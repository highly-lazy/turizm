import { SECTION_KEYS } from '@/config/games';
import { TASK_IDS } from '@/data';
import { groupOfStudent, presentStudents } from '@/lib/groups';
import { applyPlan } from '@/lib/planner';
import { nextRespondent } from '@/lib/scoring';
import { clamp, shuffle, today } from '@/lib/utils';
import { emptyProgress } from '../initialState';

const PERSONAL_GAMES = ['test', 'tf', 'practice'];

function leaveGroups(state, name) {
  for (const group of state.groups) group.members = group.members.filter((m) => m !== name);
  if (state.boardActor?.student === name) state.boardActor.student = null;
  // Davom etayotgan o‘yinda navbati turgan talaba ketsa, o‘rniga boshqasi tanlanadi
  for (const key of PERSONAL_GAMES) {
    const game = state.games[key];
    if (game && !game.done && game.phase !== 'revealed' && game.respondent === name)
      game.respondent = nextRespondent(state, game.groupIds[game.turn % game.groupIds.length]);
  }
}

/** Davomat, guruhlar va sozlamalar. */
export const createClassActions = (set, get) => ({
  setPresent(name, present) {
    let joined = null;
    set((s) => {
      const student = s.roster.find((x) => x.name === name);
      if (!student || student.present === present) return;
      student.present = present;
      s.attendanceDate = today();
      if (!present) {
        leaveGroups(s, name);
      } else if (s.groups.some((g) => g.members.length) && !groupOfStudent(s, name)) {
        const smallest = s.groups.reduce((a, b) => (b.members.length < a.members.length ? b : a));
        smallest.members.push(name);
        joined = smallest.name;
      }
      applyPlan(s);
    });
    return joined;
  },

  markAllPresent() {
    set((s) => {
      for (const student of s.roster) student.present = true;
      s.attendanceDate = today();
      applyPlan(s);
    });
  },

  /** Yangi talabalarni qo‘shadi; qo‘shilganlar sonini qaytaradi. */
  addStudents(names) {
    let added = 0;
    set((s) => {
      for (const raw of names) {
        const name = raw.replace(/^\s*\d+[.)\s]*/, '').replace(/\s+/g, ' ').trim();
        if (!name || s.roster.some((x) => x.name.toLowerCase() === name.toLowerCase())) continue;
        s.roster.push({ name, present: true });
        added++;
      }
      applyPlan(s);
    });
    return added;
  },

  removeStudent(name) {
    set((s) => {
      s.roster = s.roster.filter((x) => x.name !== name);
      leaveGroups(s, name);
      applyPlan(s);
    });
  },

  setGroupCount: (count) => set((s) => void (s.groupCount = clamp(count, 1, 50))),

  /** Kelganlarni tasodifiy teng guruhlarga bo‘ladi. Oldingi natijalar tozalanadi. */
  splitIntoGroups() {
    set((s) => {
      const students = shuffle(presentStudents(s));
      const count = clamp(s.groupCount, 1, students.length || 1);
      s.groupCount = count;
      s.groups = Array.from({ length: count }, (_, i) => ({
        id: s.nextGroupId + i,
        name: `${i + 1}-guruh`,
        members: students.filter((_name, j) => j % count === i),
      }));
      s.nextGroupId += count;
      const { used, statementQueue, session } = s;
      Object.assign(s, emptyProgress(), { used, statementQueue, session, boardActor: null });
      applyPlan(s);
    });
    return get().groups.length;
  },

  addGroup() {
    set((s) => {
      s.groups.push({ id: s.nextGroupId++, name: `${s.groups.length + 1}-guruh`, members: [] });
      applyPlan(s);
    });
  },

  renameGroup(id, name) {
    set((s) => {
      const group = s.groups.find((g) => g.id === id);
      if (group && name.trim()) group.name = name.trim();
    });
  },

  removeGroup(id) {
    set((s) => {
      if (s.groups.length <= 1) return;
      s.groups = s.groups.filter((g) => g.id !== id);
      for (const byGroup of Object.values(s.results)) delete byGroup[id];
      for (const rows of Object.values(s.boardRecords))
        for (const [rowId, record] of Object.entries(rows)) if (record.groupId === id) delete rows[rowId];
      for (const key of Object.keys(s.games)) s.games[key] = null;
      if (s.boardActor?.groupId === id) s.boardActor = null;
      applyPlan(s);
    });
  },

  moveStudent(name, groupId) {
    set((s) => {
      leaveGroups(s, name);
      s.groups.find((g) => g.id === groupId)?.members.push(name);
      applyPlan(s);
    });
  },

  setDuration(minutes) {
    set((s) => {
      s.settings.duration = clamp(minutes, 1, 180);
      applyPlan(s);
    });
  },

  setSeconds: (key, value) => set((s) => void (s.settings.seconds[key] = value)),

  setRounds(key, value) {
    set((s) => {
      s.settings.auto = false;
      s.settings.rounds[key] = value;
      applyPlan(s);
    });
  },

  setAuto(auto) {
    set((s) => {
      s.settings.auto = auto;
      applyPlan(s);
    });
  },

  /** Bo‘limni dars rejasiga qo‘shadi/chiqaradi; oxirgisini chiqarib bo‘lmaydi. */
  toggleSection(key) {
    const { enabled } = get().settings;
    if (enabled[key] && SECTION_KEYS.filter((k) => enabled[k]).length <= 1) return false;
    set((s) => {
      s.settings.enabled[key] = !s.settings.enabled[key];
      applyPlan(s);
    });
    return true;
  },

  toggleTask(id) {
    const { tasks } = get().settings;
    if (tasks.includes(id) && tasks.length <= 1) return false;
    set((s) => {
      const next = tasks.includes(id) ? tasks.filter((t) => t !== id) : [...tasks, id];
      s.settings.tasks = TASK_IDS.filter((t) => next.includes(t));
      if (s.games.practice && !s.games.practice.done) s.games.practice = null;
      applyPlan(s);
    });
    return true;
  },
});
