import { randomInt } from './utils';

export const GRID_SIZE = 10;
export const WORDS_PER_SET = 10;

// Faqat →, ↓ va ↘ (teskari yozilmaydi)
const DIRECTIONS = [[0, 1], [1, 0], [1, 1]];
const ALPHABET = [...'ABDEGHIJKLMNOPQRSTUVXYZ'];

export const cellKey = ([r, c]) => `${r},${c}`;

function placeWord(grid, word) {
  for (let attempt = 0; attempt < 700; attempt++) {
    const [dr, dc] = DIRECTIONS[randomInt(DIRECTIONS.length)];
    const r0 = randomInt(GRID_SIZE);
    const c0 = randomInt(GRID_SIZE);
    const cells = Array.from(word, (_, i) => [r0 + dr * i, c0 + dc * i]);
    const fits = cells.every(
      ([r, c], i) => r < GRID_SIZE && c < GRID_SIZE && (!grid[r][c] || grid[r][c] === word[i]),
    );
    if (!fits) continue;
    cells.forEach(([r, c], i) => (grid[r][c] = word[i]));
    return cells;
  }
  return null;
}

/** Atamalar joylashgan 10×10 maydon: {grid, positions}. */
export function generateGrid(words) {
  const sorted = words.slice().sort((a, b) => b.length - a.length);
  for (let attempt = 0; attempt < 600; attempt++) {
    const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(''));
    const positions = {};
    const placed = sorted.every((word) => (positions[word] = placeWord(grid, word)));
    if (!placed) continue;
    // To‘ldiruvchi harflar atamalarning bosh harfidan boshqa: tasodifiy chalg‘itish bo‘lmaydi
    const initials = new Set(words.map((word) => word[0]));
    const filler = ALPHABET.filter((ch) => !initials.has(ch));
    for (const row of grid)
      for (let c = 0; c < GRID_SIZE; c++) if (!row[c]) row[c] = filler[randomInt(filler.length)];
    return { grid, positions };
  }
  throw new Error('Atamalar maydonini tuzib bo‘lmadi');
}

/** Ikki katak orasidagi chiziq; burchak 45° ga karrali yo‘nalishga yaxlitlanadi. */
export function lineBetween([r0, c0], [r1, c1]) {
  let dr = r1 - r0;
  let dc = c1 - c0;
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) {
    const angle = (Math.round(Math.atan2(dr, dc) / (Math.PI / 4)) * Math.PI) / 4;
    const length = Math.max(Math.abs(dr), Math.abs(dc));
    dr = Math.round(Math.sin(angle)) * length;
    dc = Math.round(Math.cos(angle)) * length;
  }
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  const cells = [];
  for (let i = 0; i <= steps; i++) {
    const r = r0 + Math.sign(dr) * i;
    const c = c0 + Math.sign(dc) * i;
    if (r < 0 || c < 0 || r >= GRID_SIZE || c >= GRID_SIZE) break;
    cells.push([r, c]);
  }
  return cells;
}

/** Belgilangan kataklarga mos, hali topilmagan atama. */
export function matchWord(cells, { grid, found }, words) {
  const text = cells.map(([r, c]) => grid[r][c]).join('');
  const reversed = [...text].reverse().join('');
  return words.find((word) => !found.includes(word) && (word === text || word === reversed)) ?? null;
}
