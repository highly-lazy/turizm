import { Check, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { boardTasks } from '@/data';
import { answerText, scoreRow } from '@/lib/board';
import { colorOfGroup, groupById } from '@/lib/groups';
import { cx, shortName } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { toast } from '@/store/useUi';

const MAX_BUTTON_OPTIONS = 4;

function SelectInput({ cell, value, label, onChange }) {
  if (cell.options.length > MAX_BUTTON_OPTIONS)
    return (
      <select value={value ?? ''} aria-label={label} onChange={(e) => onChange(e.target.value)}>
        <option value="">— tanlang —</option>
        {cell.options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    );
  return (
    <div className="choices" role="group" aria-label={label}>
      {cell.options.map((option) => (
        <button key={option} type="button" aria-pressed={value === option} onClick={() => onChange(option)}>{option}</button>
      ))}
    </div>
  );
}

/** Avtomatik baho; bosilsa, o‘qituvchi qarori bilan almashadi. */
function AutoMark({ cell, correct, overridden, onOverride }) {
  return (
    <div className="auto-mark">
      <button type="button" className={cx('auto-mark__btn', correct ? 'is-ok' : 'is-bad')} onClick={onOverride} title="Bosing: o‘qituvchi qarori bilan almashtirish">
        {correct ? <Check aria-label="To‘g‘ri" /> : <X aria-label="Noto‘g‘ri" />}
        {overridden && 'o‘qituvchi'}
      </button>
      {!correct && <small>to‘g‘ri: {answerText(cell)}</small>}
    </div>
  );
}

function BoardCell({ taskId, row, cell, column }) {
  const value = useStore((s) => s.boardDraft[taskId]?.[row.id]?.[cell.id]);
  const record = useStore((s) => s.boardRecords[taskId]?.[row.id]);
  const { setDraft, judgeCell, overrideCell } = useStore.getState();

  if (cell.type === 'blank') return <td />;
  if (cell.type === 'fixed') return <td className="fixed">{cell.value}</td>;

  const status = record?.cells[cell.id];
  const label = `${row.label}: ${column}`;
  const change = (next) => setDraft(taskId, row.id, cell.id, next);
  const judge = (next) => {
    const problem = judgeCell(taskId, row.id, cell.id, next);
    if (problem) toast(problem);
  };

  return (
    <td className={cx(status === 1 && 'is-ok', status === 0 && 'is-bad')}>
      {cell.type === 'select' && <SelectInput cell={cell} value={value} label={label} onChange={change} />}
      {cell.type === 'number' && (
        <span className="unit-input">
          <input inputMode="decimal" value={value ?? ''} aria-label={label} placeholder="son" onChange={(e) => change(e.target.value)} />
          {cell.unit && <small>{cell.unit}</small>}
        </span>
      )}
      {cell.type === 'text' && (
        <>
          <textarea rows={2} value={value ?? ''} aria-label={label} placeholder={cell.placeholder} onChange={(e) => change(e.target.value)} />
          <div className="judge no-print" role="group" aria-label="O‘qituvchi bahosi">
            <button type="button" aria-pressed={status === 1} onClick={() => judge(1)}><Check aria-hidden="true" /> Qabul</button>
            <button type="button" className="judge__no" aria-pressed={status === 0} onClick={() => judge(0)}><X aria-hidden="true" /> Rad</button>
          </div>
        </>
      )}
      {cell.type !== 'text' && record && (
        <AutoMark cell={cell} correct={status === 1} overridden={record.overrides[cell.id]} onOverride={() => overrideCell(taskId, row.id, cell.id)} />
      )}
    </td>
  );
}

function RowResult({ record, score }) {
  const state = useStore();
  if (!record) return null;
  return (
    <>
      <b className="mono">{score.earned}/{score.max}</b>
      <small style={{ color: colorOfGroup(state, record.groupId) }}>
        {record.student ? shortName(record.student) : groupById(state, record.groupId).name}
      </small>
    </>
  );
}

function BoardRow({ taskId, row, columns }) {
  const record = useStore((s) => s.boardRecords[taskId]?.[row.id]);
  const { checkRow, resetRow } = useStore.getState();

  return (
    <tr className={cx(row.sample && 'is-sample')}>
      <th scope="row">
        {row.label}
        {row.sample && <small className="muted"> namuna</small>}
      </th>
      {row.cells.map((cell, i) => (
        <BoardCell key={i} taskId={taskId} row={row} cell={cell} column={columns[i + 1]} />
      ))}
      <td className="row-result">
        <RowResult record={record} score={scoreRow(taskId, row.id, record)} />
        {!row.sample && (
          <div className="row-actions no-print">
            <Button
              size="sm"
              variant={record ? 'secondary' : 'primary'}
              onClick={() => {
                const problem = checkRow(taskId, row.id);
                if (problem) toast(problem);
              }}
            >
              Tekshirish
            </Button>
            {record && <Button size="sm" variant="ghost" icon={RotateCcw} aria-label="Qatorni tozalash" onClick={() => resetRow(taskId, row.id)} />}
          </div>
        )}
      </td>
    </tr>
  );
}

export function BoardTable({ taskId }) {
  const { columns, rows } = boardTasks[taskId];
  return (
    <div className="table-wrap">
      <table className="table board-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
            <th>Natija</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <BoardRow key={row.id} taskId={taskId} row={row} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
