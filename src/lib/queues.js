import { practiceQuestions, statements, TASK_IDS, testQuestions } from '@/data';
import { randomInt, shuffle } from './utils';

/** Bir xil javob 3 marta ketma-ket kelmaydi va «ha, yo‘q, ha, yo‘q» almashinuvi bo‘lmaydi. */
export function isFairPattern(p) {
  for (let i = 2; i < p.length; i++) if (p[i] === p[i - 1] && p[i - 1] === p[i - 2]) return false;
  for (let i = 3; i < p.length; i++)
    if (p[i] !== p[i - 1] && p[i - 1] !== p[i - 2] && p[i - 2] !== p[i - 3]) return false;
  return true;
}

export function buildStatementQueue() {
  const indexes = statements.map((_, i) => i);
  const trues = shuffle(indexes.filter((i) => statements[i].answer));
  const falses = shuffle(indexes.filter((i) => !statements[i].answer));

  for (let attempt = 0; attempt < 6000; attempt++) {
    const left = [falses.length, trues.length];
    const pattern = [];
    let value = randomInt(2);
    let previousRun = 0;
    while (left[0] + left[1] > 0) {
      const wanted = previousRun === 1 ? 2 : Math.random() < 0.45 ? 1 : 2;
      const run = Math.min(wanted, left[value]);
      if (run <= 0) break;
      for (let i = 0; i < run; i++) pattern.push(value);
      left[value] -= run;
      previousRun = run;
      value = 1 - value;
    }
    if (left[0] + left[1] === 0 && isFairPattern(pattern)) {
      const pools = [falses, trues];
      const cursor = [0, 0];
      return pattern.map((v) => pools[v][cursor[v]++]);
    }
  }
  return shuffle(indexes);
}

/** Davra qiyinligi: 4 dan 5 ga oshib boradi. */
function levelFor(round, rounds) {
  const levels = [4, 4.5, 4.5, 5];
  return rounds <= 1 ? 4.5 : levels[Math.round((round * 3) / (rounds - 1))];
}

/** Avval ishlatilmagan savollar; yetmasa hovuz yangilanadi. */
function availableFrom(pool, used, need) {
  const fresh = pool.filter((i) => !used.includes(i));
  if (fresh.length >= need) return { available: fresh, used: used.slice() };
  return { available: pool.slice(), used: used.filter((i) => !pool.includes(i)) };
}

/** Har davrada hamma guruhga iloji boricha bir xil qiyinlikdagi savol. */
export function buildTestQueue(groupCount, rounds, usedBefore) {
  const pool = testQuestions.map((_, i) => i);
  const { available, used } = availableFrom(pool, usedBefore, groupCount * rounds);
  const level = (i) => testQuestions[i].level;
  const queue = [];
  for (let round = 0; round < rounds; round++) {
    const target = levelFor(round, rounds);
    const picked = shuffle(available)
      .sort((a, b) => Math.abs(level(a) - target) - Math.abs(level(b) - target))
      .slice(0, groupCount)
      .sort((a, b) => level(a) - level(b));
    for (const i of picked) {
      available.splice(available.indexOf(i), 1);
      queue.push(i);
    }
  }
  return { queue, used };
}

/** Barcha tanlangan topshiriqlardan teng ulushda, 3-1 → 3-9 tartibida. */
export function buildPracticeQueue(groupCount, rounds, usedBefore, pool) {
  const need = groupCount * rounds;
  const { available, used } = availableFrom(pool, usedBefore, need);
  const byTask = {};
  for (const i of shuffle(available)) (byTask[practiceQuestions[i].taskId] ??= []).push(i);

  const taskIds = shuffle(Object.keys(byTask));
  const queue = [];
  while (queue.length < need && taskIds.some((id) => byTask[id].length)) {
    for (const id of taskIds) {
      if (queue.length < need && byTask[id].length) queue.push(byTask[id].shift());
    }
  }
  const order = (i) => TASK_IDS.indexOf(practiceQuestions[i].taskId);
  return { queue: queue.sort((a, b) => order(a) - order(b)), used };
}

/**
 * Variantlar tartibi: to‘g‘ri javob (indeks 0) harfi oldingisi bilan bir xil emas
 * va A–D bo‘yicha teng taqsimlanadi.
 */
export function arrangeOptions(positionCounts, lastPosition) {
  const candidates = [0, 1, 2, 3].filter((x) => x !== lastPosition);
  const min = Math.min(...candidates.map((x) => positionCounts[x]));
  const [position] = shuffle(candidates.filter((x) => positionCounts[x] === min));
  const rest = shuffle([1, 2, 3]);
  return { position, order: [0, 1, 2, 3].map((x) => (x === position ? 0 : rest.pop())) };
}
