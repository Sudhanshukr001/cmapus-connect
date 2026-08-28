// client/src/lib/constants.js
export const CATEGORIES = [
  'books', 'electronics', 'furniture', 'bicycles', 'hostel',
  'clothing', 'tickets', 'services', 'other',
];
export const CONDITIONS = ['new', 'like-new', 'good', 'fair', 'poor'];
export const EVENT_CATEGORIES = ['social', 'academic', 'clubs', 'sports', 'career', 'arts'];

export const CAT_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c, c.replace('-', ' ')]));
export const EVENT_CAT_LABEL = Object.fromEntries(EVENT_CATEGORIES.map((c) => [c, c]));

export const EVENT_CAT_COLOR = {
  social: '#ff5a1f',
  academic: '#2f6db0',
  clubs: '#9333ea',
  sports: '#16a34a',
  career: '#0a7cff',
  arts: '#e11d48',
};

export const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];
