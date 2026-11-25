import { PERSONAL_KEYS, SECTION_KEYS } from '@/config/games';
import { checkedRows, sumRows } from './board';
import { groupById, groupOfStudent } from './groups';
import { clamp, round1 } from './utils';

const percent = (earned, max) => (max > 0 ? clamp(Math.round((earned / max) * 100)) : null);

/** Guruhning bitta bo‘limdagi 100 ballik bahosi (o‘ynamagan bo‘lsa null). */
export function grade(state, key, groupId) {
  if (key === 'board') {
    const { earned, max } = sumRows(checkedRows(state).filter((r) => r.groupId === groupId));
    return percent(earned, max);
  }
  const result = state.results[key][groupId];
  if (!result) return null;
  return key === 'words' ? clamp(result.found * 10) : percent(result.earned, result.max);
}

/** Guruh jami bali: o‘ynalgan bo‘limlar baholarining o‘rtachasi. */
export function total(state, groupId) {
  const grades = SECTION_KEYS.map((key) => grade(state, key, groupId)).filter((v) => v != null);
  if (!grades.length) return null;
  return {
    score: round1(grades.reduce((a, b) => a + b, 0) / grades.length),
    count: grades.length,
    share: round1(100 / grades.length),
  };
}

export function mark(score) {
  if (score == null) return { label: '—', tone: 'none' };
  if (score >= 86) return { label: '5 · a’lo', tone: 'excellent' };
  if (score >= 71) return { label: '4 · yaxshi', tone: 'good' };
  if (score >= 55) return { label: '3 · qoniqarli', tone: 'fair' };
  return { label: '2 · qoniqarsiz', tone: 'poor' };
}

export function answeredCount(state) {
  const tallies = Object.values(state.results).flatMap((byGroup) => Object.values(byGroup));
  return tallies.reduce((sum, r) => sum + (r.answered ?? r.found ?? 0), 0) + checkedRows(state).length;
}

/** Talaba shaxsan javob bergan savollar soni. */
export const studentAnswers = (state, name) =>
  PERSONAL_KEYS.reduce((sum, key) => sum + (state.individual[key][name]?.answered ?? 0), 0);

/** Guruhda eng kam javob bergan talaba: keyingi javob beruvchi. */
export function nextRespondent(state, groupId) {
  const { members } = groupById(state, groupId);
  return members.reduce(
    (best, name) => (best == null || studentAnswers(state, name) < studentAnswers(state, best) ? name : best),
    null,
  );
}

/** Talabaning individual hisoboti. */
export function individualReport(state, name) {
  const report = {};
  for (const key of PERSONAL_KEYS) report[key] = state.individual[key][name] ?? null;

  const rows = checkedRows(state).filter((r) => r.student === name);
  report.board = rows.length ? { ...sumRows(rows), answered: rows.length } : null;

  const group = groupOfStudent(state, name);
  const words = group && state.results.words[group.id];
  report.words = words ? { found: words.found } : null;

  let earned = 0;
  let max = 0;
  for (const key of [...PERSONAL_KEYS, 'board']) {
    earned += report[key]?.earned ?? 0;
    max += report[key]?.max ?? 0;
  }
  if (report.words) {
    earned += report.words.found * 10;
    max += 100;
  }
  return { ...report, earned, max, percent: percent(earned, max) };
}

/** Javobni hisoblagichga qo‘shadi (sign = 1) yoki bekor qiladi (sign = -1). */
export function applyTally(bucket, id, { earned, max, correct }, sign = 1) {
  if (id == null) return;
  if (sign < 0 && !bucket[id]) return;
  const tally = (bucket[id] ??= { earned: 0, max: 0, answered: 0, correct: 0 });
  tally.earned += sign * earned;
  tally.max += sign * max;
  tally.answered += sign;
  if (correct) tally.correct += sign;
  if (tally.answered <= 0) delete bucket[id];
}
