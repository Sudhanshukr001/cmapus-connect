// client/src/components/icons.jsx
import React from 'react';

const P = {
  fill: 'none', stroke: 'currentColor', strokeWidth: 1.8,
  strokeLinecap: 'round', strokeLinejoin: 'round',
};
const make = (path) => (props) => (
  <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} {...P} {...props}>
    {path}
  </svg>
);

export const I = {
  search: make(<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>),
  tag: make(<><path d="M3 11V5a2 2 0 0 1 2-2h6l9 9-8 8-9-9Z" /><circle cx="7.5" cy="7.5" r="1.4" /></>),
  calendar: make(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>),
  chat: make(<><path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12Z" /></>),
  bookmark: make(<path d="M6 4h12v17l-6-4-6 4V4Z" />),
  user: make(<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>),
  plus: make(<path d="M12 5v14M5 12h14" />),
  send: make(<path d="M4 12 20 4l-6 16-3-7-7-1Z" />),
  x: make(<path d="M6 6l12 12M18 6 6 18" />),
  check: make(<path d="m5 12 5 5 9-11" />),
  checkCircle: make(<><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>),
  pin: make(<><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></>),
  arrowLeft: make(<path d="M15 6l-6 6 6 6" />),
  arrowRight: make(<path d="M9 6l6 6-6 6" />),
  trash: make(<><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" /></>),
  edit: make(<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />),
  info: make(<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>),
  image: make(<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="m4 18 5-5 4 4 3-3 4 4" /></>),
  filter: make(<path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />),
  chevronDown: make(<path d="m6 9 6 6 6-6" />),
  logout: make(<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />),
  bell: make(<><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 19a2 2 0 0 0 4 0" /></>),
  star: make(<path d="m12 4 2.5 5 5.5.8-4 4 1 5.5L12 17l-5 3 1-5.5-4-4 5.5-.8L12 4Z" />),
  spark: make(<path d="M12 3v6M12 15v6M3 12h6M15 12h6" />),
  compass: make(<><circle cx="12" cy="12" r="9" /><path d="m15 9-2 4-4 2 2-4 4-2Z" /></>),
  bag: make(<><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></>),
};

export default I;
