import { secondsLeft } from '@/lib/session';
import { clamp } from '@/lib/utils';
import { emptyProgress, PROGRESS_FIELDS } from '../initialState';
import { applyPlan } from '@/lib/planner';

const newSession = () => ({
  startedAt: Date.now(),
  pausedAt: null,
  pausedSeconds: 0,
  adjust: 0,
  warned: false,
  finished: false,
});

/** Dars taymeri, sinov rejimi va natijalarni tozalash. */
export const createSessionActions = (set, get) => ({
  startSession() {
    if (get().sandbox || get().session) return;
    set((s) => void (s.session = newSession()));
  },

  toggleSession() {
    set((s) => {
      if (s.sandbox) return;
      if (!s.session) {
        s.session = newSession();
      } else if (s.session.pausedAt) {
        s.session.pausedSeconds += (Date.now() - s.session.pausedAt) / 1000;
        s.session.pausedAt = null;
      } else {
        s.session.pausedAt = Date.now();
      }
    });
  },

  adjustSession(minutes) {
    set((s) => {
      if (!s.session) {
        s.settings.duration = clamp(s.settings.duration + minutes, 1, 180);
        applyPlan(s);
        return;
      }
      s.session.adjust += minutes * 60;
      if (secondsLeft(s) > 0) s.session.finished = false;
    });
  },

  resetSession: () => set((s) => void (s.session = null)),
  markSessionWarned: () => set((s) => void (s.session.warned = true)),

  /** Vaqt tugadi: ochiq o‘yin yakunlanadi, natija bajarilganlar bo‘yicha qoladi. */
  finishSession(activeGame) {
    set((s) => {
      s.session.finished = true;
      if (s.games[activeGame]) s.games[activeGame].done = true;
    });
  },

  finishGame: (key) =>
    set((s) => {
      if (s.games[key]) s.games[key].done = true;
    }),

  tickGame: (key) =>
    set((s) => {
      const game = s.games[key];
      if (game && game.left > 0) game.left--;
    }),

  togglePause: (key) =>
    set((s) => {
      const game = s.games[key];
      if (game?.phase === 'running') game.paused = !game.paused;
    }),

  setRespondent: (key, name) =>
    set((s) => {
      if (s.games[key]?.phase === 'locked') s.games[key].respondent = name;
    }),

  setSandbox(on) {
    set((s) => {
      if (on === s.sandbox) return;
      if (on) {
        s.savedProgress = Object.fromEntries(PROGRESS_FIELDS.map((field) => [field, s[field]]));
        Object.assign(s, emptyProgress());
      } else {
        Object.assign(s, s.savedProgress ?? emptyProgress());
        s.savedProgress = null;
      }
      s.sandbox = on;
    });
  },

  resetProgress: () => set((s) => void Object.assign(s, emptyProgress(), { boardActor: null, shownKeys: {} })),
});
