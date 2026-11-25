import { playEffect } from '@/lib/audio';
import { maxRounds, practicePool } from '@/lib/planner';
import { arrangeOptions, buildPracticeQueue, buildTestQueue } from '@/lib/queues';
import { applyTally, nextRespondent } from '@/lib/scoring';

const POINTS = 10;

export const currentGroupId = (game) => game.groupIds[game.turn % game.groupIds.length];

function beginTurn(state, game) {
  const question = game.queue[game.turn];
  if (!state.used[game.key].includes(question)) state.used[game.key].push(question);
  const { position, order } = arrangeOptions(game.positionCounts, game.lastPosition);
  game.positionCounts[position]++;
  Object.assign(game, {
    question,
    order,
    lastPosition: position,
    phase: 'locked',
    left: game.seconds,
    pick: null,
    paused: false,
    last: null,
    respondent: nextRespondent(state, currentGroupId(game)),
  });
}

/** Test va amaliy savollar: navbat bilan, to‘rt variantli. key = 'test' | 'practice' */
export const createQuizActions = (set, get) => ({
  startQuiz(key) {
    set((s) => {
      const groupIds = s.groups.map((g) => g.id);
      const rounds = Math.min(s.settings.rounds[key], maxRounds(s, key));
      const { queue, used } =
        key === 'test'
          ? buildTestQueue(groupIds.length, rounds, s.used.test)
          : buildPracticeQueue(groupIds.length, rounds, s.used.practice, practicePool(s));
      s.used[key] = used;
      s.results[key] = {};
      s.individual[key] = {};
      s.games[key] = {
        key,
        groupIds,
        queue,
        turn: 0,
        total: queue.length,
        seconds: s.settings.seconds[key],
        history: {},
        positionCounts: [0, 0, 0, 0],
        lastPosition: null,
        done: false,
      };
      beginTurn(s, s.games[key]);
    });
  },

  openOptions(key) {
    if (get().games[key]?.phase !== 'locked') return;
    playEffect('go');
    set((s) => void (s.games[key].phase = 'running'));
  },

  /** Javobni ochadi. pick = null bo‘lsa, javob berilmagan hisoblanadi. */
  revealQuiz(key, pick = null) {
    const game = get().games[key];
    if (game?.phase !== 'running' || (pick != null && game.paused)) return;
    const correct = pick != null && game.order[pick] === 0;
    const entry = { earned: correct ? POINTS : 0, max: POINTS, correct };
    set((s) => {
      const g = s.games[key];
      const groupId = currentGroupId(g);
      Object.assign(g, { phase: 'revealed', pick, paused: false, last: { groupId, respondent: g.respondent, entry } });
      applyTally(s.results[key], groupId, entry);
      applyTally(s.individual[key], g.respondent, entry);
      (g.history[groupId] ??= []).push(correct);
    });
    playEffect(correct ? 'part' : pick == null ? 'zero' : 'no');
  },

  undoQuiz(key) {
    set((s) => {
      const g = s.games[key];
      if (g?.phase !== 'revealed' || !g.last) return;
      const { groupId, respondent, entry } = g.last;
      applyTally(s.results[key], groupId, entry, -1);
      applyTally(s.individual[key], respondent, entry, -1);
      g.history[groupId]?.pop();
      Object.assign(g, { phase: 'locked', left: g.seconds, pick: null, last: null });
    });
  },

  nextQuiz(key) {
    set((s) => {
      const g = s.games[key];
      if (g?.phase !== 'revealed') return;
      if (g.turn + 1 >= g.total) {
        g.done = true;
        return;
      }
      g.turn++;
      beginTurn(s, g);
    });
  },
});
