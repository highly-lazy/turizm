export const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));
export const round1 = (value) => Math.round(value * 10) / 10;
export const randomInt = (n) => Math.floor(Math.random() * n);
export const cx = (...names) => names.filter(Boolean).join(' ');
export const today = () => new Date().toLocaleDateString('uz-UZ');

export function shuffle(list) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function formatClock(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  return `${mm}:${String(seconds % 60).padStart(2, '0')}`;
}

/** «Familiya Ism Otasining ismi» → «Familiya Ism» */
export const shortName = (name) => name.split(' ').slice(0, 2).join(' ');

/** 1104000 → «1 104 000», 0.5 → «0,5» */
export function formatNumber(value) {
  const [int, dec] = String(value).split('.');
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (dec ? `,${dec}` : '');
}

/** Foydalanuvchi yozgan sonni o‘qiydi: «1 104 000 so‘m» → 1104000, «0,5» → 0.5 */
export function parseNumber(input) {
  if (input == null) return NaN;
  const text = String(input)
    .replace(/\s/g, '')
    .replace(/[−–]/g, '-')
    .replace(',', '.')
    .replace(/[^0-9.-]/g, '');
  return text === '' ? NaN : parseFloat(text);
}

// Oq matn bilan kontrasti yetarli (≥ 4.5:1) ranglar
const GROUP_COLORS = [
  '#0b7a75', '#b93a1c', '#5a3ec8', '#8a5300', '#1d5fc4', '#b01e63',
  '#3f6d12', '#8a1fc9', '#0b6f8a', '#8f4a12', '#4b3bd1', '#a3123f',
];

export const groupColor = (index) =>
  index < 0 ? '#5b6b73' : (GROUP_COLORS[index] ?? `hsl(${Math.round((index * 137.5) % 360)} 62% 34%)`);
