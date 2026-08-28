// client/src/components/ui.jsx
import React, { useEffect } from 'react';
import { initials, colorFor } from '../lib/format.js';
import I from './icons.jsx';

export function Avatar({ name = '', src, size = 36, color }) {
  const bg = color || colorFor(name + (src || ''));
  const style = { width: size, height: size, fontSize: size * 0.38, background: bg };
  if (src) return <img className="avatar" style={style} src={src} alt={name} />;
  return <div className="avatar" style={style}>{initials(name)}</div>;
}

export function Modal({ open, onClose, title, children, footer, wide }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="modal" style={wide ? { width: 'min(680px,100%)' } : undefined}>
        <div className="modal-head">
          <h3 className="t-h3">{title}</h3>
          <button className="iconbtn" onClick={onClose} aria-label="Close"><I.x /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export function Skeleton({ w = '100%', h = 14, r = 6, className = '' }) {
  return <div className={`sk ${className}`} style={{ width: w, height: h, borderRadius: r }} />;
}

export function EmptyState({ icon = 'info', title, text, action }) {
  const Icon = I[icon] || I.info;
  return (
    <div className="empty">
      <div className="ico"><Icon size={44} /></div>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function Verified() {
  return <span className="verified" title="Verified student"><I.checkCircle /> Verified student</span>;
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button key={t.value} className={`tab ${active === t.value ? 'active' : ''}`} onClick={() => onChange(t.value)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Spinner({ size = 18 }) {
  return <span style={{ display: 'inline-block', width: size, height: size, border: '2px solid var(--line-2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />;
}
