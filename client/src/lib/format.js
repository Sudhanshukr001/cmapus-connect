// client/src/lib/format.js
const PALETTE = ['#ff5a1f', '#0a7cff', '#16a34a', '#9333ea', '#e11d48', '#0891b2', '#ca8a04'];

export function money(n) {
  const num = Number(n || 0);
  return '₹' + num.toLocaleString('en-IN');
}
export function initials(name = '') {
  return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?';
}
export function colorFor(seed = '') {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}
export function timeAgo(date) {
  const d = new Date(date);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d ago`;
  return days.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
export function clockTime(date) {
  return new Date(date).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}
export function eventDate(date) {
  const d = new Date(date);
  return {
    mon: d.toLocaleString('en', { month: 'short' }),
    day: d.getDate(),
    wk: d.toLocaleString('en', { weekday: 'short' }),
    time: d.toLocaleString('en', { hour: 'numeric', minute: '2-digit' }),
    full: d.toLocaleString('en', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
  };
}
export function dateInputValue(date) {
  const d = new Date(date);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}
