import { DEFAULT_ROSTER, TASK_IDS } from '@/data';
import { today } from '@/lib/utils';

/** O‘yin natijalariga oid maydonlar: sinov rejimida alohida saqlanadi, tozalashda boshlang‘ich holatga qaytadi. */
export const emptyProgress = () => ({
  results: { test: {}, tf: {}, words: {}, practice: {} },
  individual: { test: {}, tf: {}, practice: {} },
  boardDraft: {},
  boardRecords: {},
  games: { test: null, tf: null, words: null, practice: null },
  used: { test: [], practice: [] },
  statementQueue: [],
  session: null,
});

export const PROGRESS_FIELDS = Object.keys(emptyProgress());

export const createInitialState = () => ({
  roster: DEFAULT_ROSTER.map((name) => ({ name, present: true })),
  attendanceDate: today(),
  groupCount: 4,
  groups: [1, 2, 3, 4].map((id) => ({ id, name: `${id}-guruh`, members: [] })),
  nextGroupId: 5,
  settings: {
    duration: 80,
    auto: true,
    seconds: { test: 30, tf: 20, practice: 75, words: 120 },
    rounds: { test: 3, tf: 3, practice: 2 },
    enabled: { test: true, tf: true, words: true, practice: true, board: true },
    tasks: TASK_IDS.slice(),
  },
  boardActor: null,
  shownKeys: {},
  sandbox: false,
  savedProgress: null,
  ...emptyProgress(),
});
