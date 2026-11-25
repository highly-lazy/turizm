import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createInitialState } from './initialState';
import { createBoardActions } from './slices/board';
import { createClassActions } from './slices/classroom';
import { createQuizActions } from './slices/quiz';
import { createSessionActions } from './slices/session';
import { createStatementActions } from './slices/statements';
import { createWordActions } from './slices/words';

const STORAGE_KEY = 'a3-turizm-marketing:v1';

const isData = ([, value]) => typeof value !== 'function';

export const useStore = create(
  persist(
    immer((set, get) => ({
      ...createInitialState(),
      ...createClassActions(set, get),
      ...createSessionActions(set, get),
      ...createQuizActions(set, get),
      ...createStatementActions(set, get),
      ...createWordActions(set, get),
      ...createBoardActions(set, get),
    })),
    {
      name: STORAGE_KEY,
      version: 2,
      // v1 da ro‘yxat bo‘sh boshlangan: o‘shanda saqlangan bo‘sh ro‘yxat boshlang‘ichi bilan to‘ldiriladi
      migrate: (saved) => (saved.roster?.length ? saved : { ...saved, roster: createInitialState().roster }),
      partialize: (state) => Object.fromEntries(Object.entries(state).filter(isData)),
    },
  ),
);
