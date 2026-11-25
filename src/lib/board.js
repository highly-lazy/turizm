import { boardTasks } from '@/data';
import { formatNumber, parseNumber } from './utils';

export const boardRow = (taskId, rowId) => boardTasks[taskId]?.rows.find((row) => row.id === rowId);

/** Qator bali: har baholangan katak 10 ball; hali baholanmagan matnli kataklar hisobga kirmaydi. */
export function scoreRow(taskId, rowId, record) {
  const row = boardRow(taskId, rowId);
  let earned = 0;
  let max = 0;
  if (!row || !record) return { earned, max };
  for (const cell of row.cells) {
    if (!cell.id) continue;
    const value = record.cells[cell.id];
    if (cell.type === 'text' && value == null) continue;
    max += 10;
    if (value === 1) earned += 10;
  }
  return { earned, max };
}

/**
 * Qatorni tekshiradi: {cellId: 1 | 0 | null}. Matnli kataklar o‘qituvchi bahosini kutadi (null);
 * `previous` berilsa, undagi o‘qituvchi bahosi saqlanadi.
 */
export function checkCells(row, draft = {}, previous = null) {
  const cells = {};
  for (const cell of row.cells) {
    if (!cell.id) continue;
    const value = draft[cell.id];
    if (cell.type === 'select') {
      cells[cell.id] = value && cell.answers.includes(value) ? 1 : 0;
    } else if (cell.type === 'number') {
      const number = parseNumber(value);
      cells[cell.id] = !Number.isNaN(number) && Math.abs(number - cell.answer) <= cell.tolerance + 1e-9 ? 1 : 0;
    } else {
      cells[cell.id] = previous?.cells[cell.id] ?? null;
    }
  }
  if (row.unique) {
    // Bir xil javob ikkinchi marta hisoblanmaydi
    const seen = new Set();
    for (const { id } of row.cells.filter((cell) => cell.type === 'select')) {
      if (draft[id] && seen.has(draft[id])) cells[id] = 0;
      seen.add(draft[id]);
    }
  }
  return cells;
}

/** Barcha tekshirilgan qatorlar tekis ro‘yxatda. */
export function checkedRows(state) {
  return Object.entries(state.boardRecords).flatMap(([taskId, rows]) =>
    Object.entries(rows).map(([rowId, record]) => ({
      taskId,
      rowId,
      student: record.student,
      groupId: record.groupId,
      ...scoreRow(taskId, rowId, record),
    })),
  );
}

export const sumRows = (rows) =>
  rows.reduce((acc, r) => ({ earned: acc.earned + r.earned, max: acc.max + r.max }), { earned: 0, max: 0 });

export const answerText = (cell) =>
  cell.type === 'select' ? cell.answers.join(' / ') : formatNumber(cell.answer) + (cell.unit ? ` ${cell.unit}` : '');
