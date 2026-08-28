// server/src/utils/avatar.js
// Deterministic avatar fallback: a colored initial tile.
const PALETTE = ['#ff5a1f', '#0a7cff', '#16a34a', '#9333ea', '#e11d48', '#0891b2', '#ca8a04'];

export function avatarFor(name = '?', seed = '') {
  const letter = (name || '?').trim().charAt(0).toUpperCase() || '?';
  let hash = 0;
  for (let i = 0; i < (seed || name || '').length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const bg = PALETTE[hash % PALETTE.length];
  return { letter, bg };
}
