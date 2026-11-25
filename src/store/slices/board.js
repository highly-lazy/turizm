import { boardTasks } from '@/data';
import { playEffect } from '@/lib/audio';
import { boardRow, checkCells, scoreRow } from '@/lib/board';
import { groupById } from '@/lib/groups';
import { nextRespondent } from '@/lib/scoring';

/** Doskada kim turgani tanlanganmi; muammo bo‘lsa matnini qaytaradi. */
function actorProblem(state) {
  const actor = state.boardActor;
  if (!actor || !state.groups.some((g) => g.id === actor.groupId)) return 'Avval «Doskada» qatoridan guruhni tanlang';
  if (groupById(state, actor.groupId).members.length && !actor.student) return 'Doskadagi talabani tanlang';
  return null;
}

function saveRecord(state, taskId, rowId) {
  const { groupId, student } = state.boardActor;
  const previous = state.boardRecords[taskId]?.[rowId];
  const sameStudent = previous && previous.student === student && previous.groupId === groupId;
  (state.boardRecords[taskId] ??= {})[rowId] = {
    student: student ?? null,
    groupId,
    cells: checkCells(boardRow(taskId, rowId), state.boardDraft[taskId]?.[rowId], sameStudent ? previous : null),
    overrides: {},
  };
}

export const createBoardActions = (set, get) => ({
  setBoardActor(groupId, student) {
    set((s) => void (s.boardActor = { groupId, student: student ?? nextRespondent(s, groupId) }));
  },

  setDraft(taskId, rowId, cellId, value) {
    set((s) => {
      const task = (s.boardDraft[taskId] ??= {});
      (task[rowId] ??= {})[cellId] = value;
    });
  },

  /** Qatorni tekshiradi; xato bo‘lsa xabar matnini qaytaradi. */
  checkRow(taskId, rowId) {
    const problem = actorProblem(get());
    if (problem) return problem;
    set((s) => saveRecord(s, taskId, rowId));
    const { earned, max } = scoreRow(taskId, rowId, get().boardRecords[taskId][rowId]);
    playEffect(max && earned === max ? 'ok' : earned ? 'part' : 'no');
    return null;
  },

  /** Hali tekshirilmagan qatorlarni tekshiradi. */
  checkRemaining(taskId) {
    const problem = actorProblem(get());
    if (problem) return problem;
    let count = 0;
    set((s) => {
      for (const row of boardTasks[taskId].rows) {
        if (row.sample || s.boardRecords[taskId]?.[row.id]) continue;
        saveRecord(s, taskId, row.id);
        count++;
      }
    });
    playEffect(count ? 'ok' : 'zero');
    return count ? `${count} ta qator tekshirildi` : 'Tekshirilmagan qator qolmadi';
  },

  /** O‘qituvchi matnli javobni baholaydi (qayta bosilsa, baho bekor bo‘ladi). */
  judgeCell(taskId, rowId, cellId, value) {
    if (!get().boardRecords[taskId]?.[rowId]) {
      const problem = actorProblem(get());
      if (problem) return problem;
    }
    set((s) => {
      if (!s.boardRecords[taskId]?.[rowId]) saveRecord(s, taskId, rowId);
      const { cells } = s.boardRecords[taskId][rowId];
      cells[cellId] = cells[cellId] === value ? null : value;
    });
    playEffect(value ? 'part' : 'zero');
    return null;
  },

  /** O‘qituvchi avtomatik bahoni almashtiradi. */
  overrideCell(taskId, rowId, cellId) {
    set((s) => {
      const record = s.boardRecords[taskId]?.[rowId];
      if (!record) return;
      record.cells[cellId] = record.cells[cellId] ? 0 : 1;
      record.overrides[cellId] = true;
    });
  },

  resetRow(taskId, rowId) {
    set((s) => {
      delete s.boardRecords[taskId]?.[rowId];
      delete s.boardDraft[taskId]?.[rowId];
    });
  },

  toggleKey: (taskId) => set((s) => void (s.shownKeys[taskId] = !s.shownKeys[taskId])),
});
