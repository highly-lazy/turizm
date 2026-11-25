import { create } from 'zustand';
import { setMusic } from '@/lib/audio';

const TOAST_MS = 3200;
let toastId = 0;

/** Saqlanmaydigan interfeys holati: xabarlar, tasdiqlash oynasi, e’lon oynasi, musiqa. */
export const useUi = create((set, get) => ({
  toasts: [],
  confirmation: null,
  sheet: null,
  music: false,

  toast(message) {
    const id = ++toastId;
    set({ toasts: [...get().toasts.slice(-2), { id, message }] });
    setTimeout(() => set({ toasts: get().toasts.filter((t) => t.id !== id) }), TOAST_MS);
  },
  confirm: (confirmation) => set({ confirmation }),
  closeConfirm: () => set({ confirmation: null }),
  openSheet: (sheet) => set({ sheet }),
  closeSheet: () => set({ sheet: null }),
  toggleMusic() {
    const music = !get().music;
    setMusic(music);
    set({ music });
  },
}));

export const toast = (message) => useUi.getState().toast(message);
export const confirm = (options) => useUi.getState().confirm(options);
