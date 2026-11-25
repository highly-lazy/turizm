import { describe, expect, it } from 'vitest';
import { boardTasks, DEFAULT_ROSTER, practiceQuestions, statements, TASK_IDS, testQuestions, wordSets } from '@/data';
import { GRID_SIZE, WORDS_PER_SET } from '@/lib/wordsearch';

const answer = (task, row, cell = 'x') =>
  boardTasks[task].rows.find((r) => r.id === row).cells.find((c) => c.id === cell).answer;

describe('savollar', () => {
  it.each([
    ['test', testQuestions, 50],
    ['amaliy', practiceQuestions, 42],
  ])('%s: soni va variantlari to‘g‘ri', (_, questions, count) => {
    expect(questions).toHaveLength(count);
    for (const q of questions) {
      expect(q.options, q.question).toHaveLength(4);
      expect(new Set(q.options).size, q.question).toBe(4);
      expect([4, 4.5, 5]).toContain(q.level);
      expect(q.note).toBeTruthy();
    }
    expect(new Set(questions.map((q) => q.question)).size).toBe(count);
  });

  it('to‘g‘ri javob uzunligi bilan ajralib turmaydi', () => {
    for (const questions of [testQuestions, practiceQuestions]) {
      const longest = questions.filter((q) => q.options.slice(1).every((o) => o.length < q.options[0].length));
      expect(longest.length / questions.length).toBeLessThan(0.4);
    }
  });

  it('fikrlar: 20 ta HA va 20 ta YO‘Q', () => {
    expect(statements.filter((s) => s.answer)).toHaveLength(20);
    expect(statements.filter((s) => !s.answer)).toHaveLength(20);
  });

  it('har topshiriqda amaliy savol va doska jadvali bor', () => {
    for (const id of TASK_IDS) {
      expect(practiceQuestions.some((q) => q.taskId === id)).toBe(true);
      expect(boardTasks[id].rows.length).toBeGreaterThan(4);
    }
  });
});

describe('atamalar', () => {
  it('6 to‘plam × 10 ta, maydonga sig‘adi va takrorlanmaydi', () => {
    expect(wordSets).toHaveLength(6);
    for (const set of wordSets) {
      expect(set.words).toHaveLength(WORDS_PER_SET);
      for (const { word } of set.words) expect(word).toMatch(new RegExp(`^[A-Z]{3,${GRID_SIZE}}$`));
      const list = set.words.map((w) => w.word);
      for (const a of list) expect(list.filter((b) => b !== a && b.includes(a)), a).toEqual([]);
    }
  });
});

describe('doska', () => {
  it('kataklar ustunlar soniga mos, javoblar variantlar ichida', () => {
    for (const [id, task] of Object.entries(boardTasks)) {
      for (const row of task.rows) {
        expect(row.cells, `${id}/${row.id}`).toHaveLength(task.columns.length - 1);
        for (const cell of row.cells.filter((c) => c.type === 'select'))
          for (const a of cell.answers) expect(cell.options, `${id}/${row.id}`).toContain(a);
      }
    }
  });

  it('to‘g‘ri javob har doim birinchi variant emas', () => {
    const selects = Object.values(boardTasks).flatMap((t) => t.rows.flatMap((r) => r.cells.filter((c) => c.type === 'select')));
    const first = selects.filter((c) => c.answers.includes(c.options[0]));
    expect(first.length / selects.length).toBeLessThan(0.45);
  });

  it('3-1: bozor hajmi', () => {
    expect(answer('3-1', 'a1')).toBe((400_000 * 2_000_000) / 1e9);
    expect(answer('3-1', 'a2')).toBe(400_000 * 0.3);
    expect(answer('3-1', 'a2', 'y')).toBe((120_000 * 2_000_000) / 1e9);
    expect(answer('3-1', 'a3')).toBe(120_000 * 0.05);
    expect(answer('3-1', 'a3', 'y')).toBe((6_000 * 2_000_000) / 1e9);
    expect(answer('3-1', 'a4')).toBe((80_000 / 320_000) * 100);
    expect(answer('3-1', 'a4', 'y')).toBeCloseTo((7.2 / 240) * 100);
    expect(answer('3-1', 'a5')).toBeCloseTo(12 - 7.2);
  });

  it('3-3: tortilgan ball', () => {
    const scores = { x: [3, 4, 5, 3, 2], y: [5, 3, 2, 5, 2], z: [4, 5, 3, 4, 4] };
    const weights = { c1: [0.25, 0.2, 0.25, 0.15, 0.15], c3: [0.15, 0.1, 0.45, 0.15, 0.15] };
    for (const [row, w] of Object.entries(weights)) {
      expect(w.reduce((a, b) => a + b)).toBeCloseTo(1);
      for (const [cell, s] of Object.entries(scores))
        expect(answer('3-3', row, cell)).toBeCloseTo(s.reduce((sum, v, i) => sum + v * w[i], 0));
    }
  });

  it('3-5: reklama kanallari', () => {
    const channels = { x: [200_000, 4_000, 80, 8e6], y: [50_000, 2_500, 100, 15e6] };
    for (const [cell, [shows, clicks, orders, cost]] of Object.entries(channels)) {
      expect(answer('3-5', 'e1', cell)).toBeCloseTo((clicks / shows) * 100);
      expect(answer('3-5', 'e2', cell)).toBe(cost / clicks);
      expect(answer('3-5', 'e3', cell)).toBeCloseTo((orders / clicks) * 100);
      expect(answer('3-5', 'e4', cell)).toBe(cost / orders);
      expect(answer('3-5', 'e5', cell)).toBe(orders * 1_200_000);
      expect(answer('3-5', 'e6', cell)).toBe((orders * 1_200_000) / cost);
    }
  });

  it('3-6: email voronkasi', () => {
    expect(answer('3-6', 'f1')).toBe((4000 / 5000) * 100);
    expect(answer('3-6', 'f1', 'y')).toBe((1000 / 4000) * 100);
    expect(answer('3-6', 'f2')).toBe((200 / 1000) * 100);
    expect(answer('3-6', 'f2', 'y')).toBe((20 / 200) * 100);
    expect(answer('3-6', 'f3')).toBe(20 * 900_000);
    expect(answer('3-6', 'f3', 'y')).toBeCloseTo(18e6 * 0.2);
    expect(answer('3-6', 'f4')).toBeCloseTo(((3.6e6 - 1e6) / 1e6) * 100);
    expect(answer('3-6', 'f5')).toBeCloseTo(4000 * 0.3 * 0.2 * 0.1);
    expect(answer('3-6', 'f5', 'y')).toBe(24 - 20);
  });

  it('3-7: CAC va LTV', () => {
    const profit = 1_500_000 * 0.2;
    expect(answer('3-7', 'g1')).toBe(60e6 / 150);
    expect(answer('3-7', 'g2')).toBe(profit);
    expect(answer('3-7', 'g3')).toBe(profit * 4);
    expect(answer('3-7', 'g3', 'y')).toBe((profit * 4) / 400_000);
    expect(answer('3-7', 'g4', 'y')).toBe(400_000 - profit);
    expect(answer('3-7', 'g5')).toBe(60e6 / profit);
    expect(answer('3-7', 'g6')).toBe(profit * 5);
    expect(answer('3-7', 'g6', 'y')).toBe((profit * 5) / 400_000);
  });

  it('3-9: keys', () => {
    expect(answer('3-9', 'k1')).toBe(12e6 / 30);
    expect(answer('3-9', 'k1', 'y')).toBe(8e6 / 40);
    expect(answer('3-9', 'k2')).toBe(24e6 / 80);
    const orders = 6e6 / 400_000 + 14e6 / 200_000 + 10;
    expect(answer('3-9', 'k3')).toBe(orders);
    expect(answer('3-9', 'k3', 'y')).toBe(orders - 80);
  });
});

describe('ro‘yxat', () => {
  it('25 nafar, takrorsiz', () => {
    expect(new Set(DEFAULT_ROSTER).size).toBe(25);
  });
});
