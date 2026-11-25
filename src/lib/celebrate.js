import confetti from 'canvas-confetti';
import { playEffect } from './audio';

const COLORS = ['#0b7a75', '#ffb627', '#ff6b4a', '#5a3ec8', '#ffffff'];

export function celebrate() {
  playEffect('fanfare');
  const base = { colors: COLORS, disableForReducedMotion: true, zIndex: 200, spread: 75, particleCount: 90 };
  confetti({ ...base, origin: { x: 0.2, y: 0.65 }, angle: 60 });
  confetti({ ...base, origin: { x: 0.8, y: 0.65 }, angle: 120 });
}
