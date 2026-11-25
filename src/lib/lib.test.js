import { describe, expect, it } from 'vitest';
import { statements, wordSets } from '@/data';
import { boardRow, checkCells, scoreRow } from './board';
import { arrangeOptions, buildPracticeQueue, buildStatementQueue, buildTestQueue, isFairPattern } from './queues';
import { applyTally, mark } from './scoring';
import { secondsLeft } from './session';
import { formatNumber, parseNumber, shortName } from './utils';
import { generateGrid, lineBetween, matchWord } from './wordsearch';

describe('utils', () => {
  it('sonlarni o‘qiydi va yozadi', () => {
    expect(parseNumber('1 104 000 so‘m')).toBe(1104000);
    expect(parseNumber('3,75')).toBe(3.75);
    expect(parseNumber('')).toBeNaN();
    expect(formatNumber(1104000)).toBe('1 104 000');
    expect(formatNumber(3.75)).toBe('3,75');
    expect(shortName('Familiyev Ism Otayevich')).toBe('Familiyev Ism');
  });
});

describe('navbatlar', () => {
  it('Ha/Yo‘q navbati adolatli va to‘liq', () => {
    for (let i = 0; i < 20; i++) {
      const queue = buildStatementQueue();
      expect(new Set(queue).size).toBe(statements.length);
      expect(isFairPattern(queue.map((q) => statements[q].answer))).toBe(true);
    }
  });

  it('test navbati takrorsiz va ishlatilganlarni chetlab o‘tadi', () => {
    const { queue } = buildTestQueue(4, 5, [0, 1, 2]);
    expect(new Set(queue).size).toBe(20);
    expect(queue.some((i) => i < 3)).toBe(false);
  });

  it('savollar tugasa hovuz yangilanadi', () => {
    const { queue, used } = buildPracticeQueue(2, 2, [0, 1, 2], [0, 1, 2, 3]);
    expect(queue).toHaveLength(4);
    expect(used).toEqual([]);
  });

  it('to‘g‘ri javob harfi ketma-ket takrorlanmaydi va teng taqsimlanadi', () => {
    const counts = [0, 0, 0, 0];
    let last = null;
    for (let i = 0; i < 40; i++) {
      const { position, order } = arrangeOptions(counts, last);
      expect(position).not.toBe(last);
      expect(order[position]).toBe(0);
      expect(order.slice().sort()).toEqual([0, 1, 2, 3]);
      counts[position]++;
      last = position;
    }
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
  });
});

describe('atama qidirish', () => {
  it('har to‘plam maydonga joylashadi va topiladi', () => {
    for (const set of wordSets) {
      const words = set.words.map((w) => w.word);
      const { grid, positions } = generateGrid(words);
      for (const word of words) {
        const cells = positions[word];
        expect(lineBetween(cells[0], cells.at(-1))).toEqual(cells);
        expect(matchWord(cells, { grid, found: [] }, words)).toBe(word);
        expect(matchWord(cells.slice().reverse(), { grid, found: [] }, words)).toBe(word);
        expect(matchWord(cells, { grid, found: [word] }, words)).toBe(null);
      }
    }
  });

  it('chiziq 45° ga yaxlitlanadi', () => {
    expect(lineBetween([0, 0], [1, 5])).toEqual([0, 1, 2, 3, 4, 5].map((c) => [0, c]));
  });
});

describe('doska', () => {
  it('son, tanlov va takroriy javobni tekshiradi', () => {
    expect(checkCells(boardRow('3-1', 'a1'), { x: '800' })).toEqual({ x: 1 });
    expect(checkCells(boardRow('3-1', 'a1'), { x: '80' })).toEqual({ x: 0 });
    const row = boardRow('3-9', 'k4');
    const [cause] = row.cells[0].answers;
    expect(checkCells(row, { x: cause, y: cause })).toEqual({ x: 1, y: 0 });
  });

  it('baholanmagan matn hisobga kirmaydi', () => {
    expect(scoreRow('3-1', 'a7', { cells: { x: null } })).toEqual({ earned: 0, max: 0 });
    expect(scoreRow('3-1', 'a7', { cells: { x: 1 } })).toEqual({ earned: 10, max: 10 });
  });
});

describe('baholash', () => {
  it('baho chegaralari', () => {
    expect([86, 85, 71, 70, 55, 54].map((s) => mark(s).label[0])).toEqual(['5', '4', '4', '3', '3', '2']);
  });

  it('bekor qilingan javob izsiz o‘chadi', () => {
    const bucket = {};
    const entry = { earned: 10, max: 10, correct: true };
    applyTally(bucket, 'a', entry);
    applyTally(bucket, 'a', entry, -1);
    expect(bucket).toEqual({});
  });
});

describe('dars taymeri', () => {
  it('pauza va qo‘shimcha vaqt hisobga olinadi', () => {
    const settings = { duration: 80 };
    const session = { startedAt: 0, pausedAt: null, pausedSeconds: 60, adjust: 120 };
    expect(secondsLeft({ session, settings }, 600_000)).toBe(80 * 60 + 120 - 540);
    expect(secondsLeft({ session: null, settings })).toBe(null);
  });
});
