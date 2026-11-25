let context = null;
let musicTimer = null;

function getContext() {
  if (!context) {
    const Ctor = window.AudioContext ?? window.webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
  }
  if (context.state === 'suspended') context.resume();
  return context;
}

function tone(frequency, delay, duration, type = 'triangle', volume = 0.05) {
  const ctx = getContext();
  if (!ctx) return;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const start = ctx.currentTime + delay;
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0008, start + duration);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.05);
}

const EFFECTS = {
  ok: [[784, 0, 0.2, 'sine', 0.2], [1047, 0.1, 0.25, 'sine', 0.2], [1319, 0.2, 0.4, 'sine', 0.16]],
  no: [[220, 0, 0.25, 'sawtooth', 0.08], [165, 0.16, 0.35, 'sawtooth', 0.08]],
  zero: [[330, 0, 0.3, 'triangle', 0.12]],
  go: [[523, 0, 0.15, 'sine', 0.15], [784, 0.12, 0.3, 'sine', 0.15]],
  tick: [[900, 0, 0.06, 'square', 0.04]],
  part: [[196, 0, 0.12, 'square', 0.07], [392, 0.07, 0.2, 'triangle', 0.12]],
  fanfare: [523, 659, 784, 1047, 1319, 1568].map((f, i) => [f, i * 0.12, 0.5, 'square', 0.06]),
};

export function playEffect(name) {
  if (typeof window === 'undefined') return;
  EFFECTS[name]?.forEach((args) => tone(...args));
}

const CHORDS = [[262, 330, 392], [220, 262, 330], [175, 220, 262], [196, 247, 294]];
const MELODY = [
  [659, 0, 784, 0, 880, 0, 784, 0],
  [784, 0, 659, 0, 0, 523, 0, 0],
  [698, 0, 880, 0, 784, 0, 698, 0],
  [587, 0, 659, 0, 784, 0, 0, 0],
];

export function setMusic(on) {
  clearInterval(musicTimer);
  musicTimer = null;
  if (!on || !getContext()) return;
  let tick = 0;
  musicTimer = setInterval(() => {
    const bar = (tick >> 3) & 3;
    const step = tick & 7;
    tone(CHORDS[bar][step % 3], 0, 0.45, 'triangle', 0.03);
    if (MELODY[bar][step]) tone(MELODY[bar][step], 0, 0.6, 'sine', 0.04);
    if (step % 4 === 0) tone(CHORDS[bar][0] / 2, 0, 0.6, 'sine', 0.08);
    tick++;
  }, 330);
}
