import { statements } from '@/data';
import { playEffect } from '@/lib/audio';
import { buildStatementQueue } from '@/lib/queues';
import { applyTally, nextRespondent } from '@/lib/scoring';
import { currentGroupId } from './quiz';

const PERSONAL_POINTS = 10;
export const stagePoints = (stage) => 10 * (stage + 1);
export const currentStage = (game) => Math.floor(game.turn / game.groupIds.length);

function beginTurn(state, game) {
  if (!state.statementQueue.length) state.statementQueue = buildStatementQueue();
  Object.assign(game, {
    question: state.statementQueue.shift(),
    phase: 'locked',
    left: game.seconds,
    pick: null,
    paused: false,
    last: null,
    respondent: nextRespondent(state, currentGroupId(game)),
  });
}

/** Ha/Yo‘q: har bosqichda ball oshadi. */
export const createStatementActions = (set, get) => ({
  startStatements() {
    set((s) => {
      const groupIds = s.groups.map((g) => g.id);
      const rounds = s.settings.rounds.tf;
      const total = groupIds.length * rounds;
      if (s.statementQueue.length < total) s.statementQueue = buildStatementQueue();
      s.results.tf = {};
      s.individual.tf = {};
      s.games.tf = { key: 'tf', groupIds, rounds, total, turn: 0, seconds: s.settings.seconds.tf, done: false };
      beginTurn(s, s.games.tf);
    });
  },

  openStatement() {
    if (get().games.tf?.phase !== 'locked') return;
    playEffect('go');
    set((s) => void (s.games.tf.phase = 'running'));
  },

  revealStatement(pick = null) {
    const game = get().games.tf;
    if (game?.phase !== 'running' || (pick != null && game.paused)) return;
    const correct = pick != null && pick === statements[game.question].answer;
    const max = stagePoints(currentStage(game));
    set((s) => {
      const g = s.games.tf;
      const groupId = currentGroupId(g);
      const entry = { earned: correct ? max : 0, max, correct };
      const personal = { earned: correct ? PERSONAL_POINTS : 0, max: PERSONAL_POINTS, correct };
      Object.assign(g, {
        phase: 'revealed',
        pick,
        paused: false,
        last: { groupId, respondent: g.respondent, entry, personal },
      });
      applyTally(s.results.tf, groupId, entry);
      applyTally(s.individual.tf, g.respondent, personal);
    });
    playEffect(correct ? 'ok' : 'no');
  },

  undoStatement() {
    set((s) => {
      const g = s.games.tf;
      if (g?.phase !== 'revealed' || !g.last) return;
      applyTally(s.results.tf, g.last.groupId, g.last.entry, -1);
      applyTally(s.individual.tf, g.last.respondent, g.last.personal, -1);
      Object.assign(g, { phase: 'locked', left: g.seconds, pick: null, last: null });
    });
  },

  nextStatement() {
    set((s) => {
      const g = s.games.tf;
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
