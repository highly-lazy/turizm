import { wordSets } from '@/data';
import { playEffect } from '@/lib/audio';
import { cellKey, generateGrid, matchWord, WORDS_PER_SET } from '@/lib/wordsearch';

export const wordsOf = (board) => wordSets[board.set].words;
const wordList = (board) => wordsOf(board).map((x) => x.word);

/** Atama qidirish: guruhlar ketma-ket, har biriga alohida to‘plam. */
export const createWordActions = (set, get) => ({
  startWords() {
    set((s) => {
      const groupIds = s.groups.map((g) => g.id);
      const boards = {};
      groupIds.forEach((id, i) => {
        const setIndex = i % wordSets.length;
        boards[id] = {
          set: setIndex,
          ...generateGrid(wordSets[setIndex].words.map((x) => x.word)),
          found: [],
          foundCells: [],
        };
      });
      s.results.words = {};
      const seconds = s.settings.seconds.words;
      s.games.words = { key: 'words', groupIds, boards, turn: 0, seconds, left: seconds, phase: 'locked', paused: false, done: false };
    });
  },

  openWords() {
    const game = get().games.words;
    if (game?.phase !== 'locked') return;
    playEffect('go');
    set((s) => {
      const g = s.games.words;
      g.seconds = s.settings.seconds.words;
      g.left = g.seconds;
      g.phase = 'running';
      s.results.words[g.groupIds[g.turn]] = { found: 0 };
    });
  },

  /** Belgilangan chiziqni tekshiradi; atama topilsa true. */
  submitLine(cells) {
    const game = get().games.words;
    if (game?.phase !== 'running' || game.paused) return null;
    const groupId = game.groupIds[game.turn];
    const board = game.boards[groupId];
    const word = matchWord(cells, board, wordList(board));
    playEffect(word ? 'ok' : 'no');
    if (!word) return false;
    set((s) => {
      const g = s.games.words;
      const b = g.boards[groupId];
      b.found.push(word);
      b.foundCells.push(...cells.map(cellKey));
      s.results.words[groupId].found = b.found.length;
      if (b.found.length >= WORDS_PER_SET) g.phase = 'revealed';
    });
    return true;
  },

  endWords() {
    if (get().games.words?.phase !== 'running') return;
    set((s) => Object.assign(s.games.words, { phase: 'revealed', paused: false }));
    playEffect('zero');
  },

  nextWords() {
    set((s) => {
      const g = s.games.words;
      if (g?.phase !== 'revealed') return;
      if (g.turn + 1 >= g.groupIds.length) {
        g.done = true;
        return;
      }
      Object.assign(g, { turn: g.turn + 1, phase: 'locked', seconds: s.settings.seconds.words, left: s.settings.seconds.words });
    });
  },
});
