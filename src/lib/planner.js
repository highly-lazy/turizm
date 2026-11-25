import { PERSONAL_KEYS, QUESTIONS_PER_STUDENT, SECTION_KEYS } from '@/config/games';
import { practiceQuestions, statements, testQuestions } from '@/data';
import { presentStudents } from './groups';
import { clamp } from './utils';

/** Bitta savolga ketadigan o‘rtacha vaqt, soniya. */
const SECONDS_PER_QUESTION = { test: 65, tf: 40, practice: 100 };

const groupCount = (state) => Math.max(1, state.groups.length);

export const practicePool = (state) =>
  practiceQuestions.map((_, i) => i).filter((i) => state.settings.tasks.includes(practiceQuestions[i].taskId));

/** Har guruhga savollar takrorlanmasdan berilishi mumkin bo‘lgan eng ko‘p davra. */
export function maxRounds(state, key) {
  const pool = { test: testQuestions.length, tf: statements.length, practice: practicePool(state).length }[key];
  return clamp(Math.floor(pool / groupCount(state)), 1, 10);
}

export function questionsPerGroup(state) {
  const students = state.groups.reduce((sum, g) => sum + g.members.length, 0) || presentStudents(state).length;
  return Math.max(3, Math.ceil((QUESTIONS_PER_STUDENT * students) / groupCount(state)));
}

/** Davralar sonini chegaraga, «Avtomatik» rejimda esa talabalar soniga moslaydi (state’ni o‘zgartiradi). */
export function applyPlan(state) {
  const { settings } = state;
  for (const key of PERSONAL_KEYS) settings.rounds[key] = clamp(settings.rounds[key], 1, maxRounds(state, key));
  if (!settings.auto) return;
  const active = PERSONAL_KEYS.filter((key) => settings.enabled[key]);
  if (!active.length) return;
  const perGroup = questionsPerGroup(state);
  const base = Math.floor(perGroup / active.length);
  const rest = perGroup - base * active.length;
  active.forEach((key, i) => {
    settings.rounds[key] = clamp(base + (i < rest ? 1 : 0), 1, maxRounds(state, key));
  });
}

/** Bo‘limga ketadigan taxminiy vaqt, daqiqa. Doskaga qolgan vaqt beriladi. */
export function estimateMinutes(state, key) {
  const { settings } = state;
  if (!settings.enabled[key]) return 0;
  const n = groupCount(state);
  if (key === 'words') return Math.round((n * (settings.seconds.words + 20)) / 60);
  if (key === 'board') {
    const others = ['test', 'tf', 'words', 'practice'].reduce((sum, k) => sum + estimateMinutes(state, k), 0);
    return Math.max(0, settings.duration - others);
  }
  return Math.round((SECONDS_PER_QUESTION[key] * n * settings.rounds[key]) / 60);
}

export const totalMinutes = (state) => SECTION_KEYS.reduce((sum, key) => sum + estimateMinutes(state, key), 0);
