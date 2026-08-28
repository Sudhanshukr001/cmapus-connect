// client/src/components/EventCard.jsx
import React from 'react';
import { eventDate } from '../lib/format.js';
import { EVENT_CAT_COLOR } from '../lib/constants.js';
import I from './icons.jsx';

export function EventRow({ event, onOpen }) {
  const d = eventDate(event.startTime);
  const cat = event.category;
  return (
    <div className="eventrow" onClick={() => onOpen?.(event)}>
      <div className="datebadge">
        <span className="mon">{d.mon}</span>
        <span className="day">{d.day}</span>
        <span className="wk">{d.wk}</span>
      </div>
      <div className="info">
        <div className="row" style={{ gap: 8 }}>
          <span className="eventcat" style={{ background: EVENT_CAT_COLOR[cat] || 'var(--accent)' }} />
          <span className="t-xs t-faint" style={{ textTransform: 'capitalize', fontWeight: 600 }}>{cat}</span>
        </div>
        <h4 className="truncate">{event.title}</h4>
        <div className="sub">
          <span><I.pin size={12} /> {event.location || 'Campus'}</span>
          <span>{d.time}</span>
        </div>
      </div>
      <div className="go">
        <span className="pill pill-green">{event.attendeeCount} going</span>
        {event.going && <div className="cnt" style={{ color: 'var(--secondary)', fontWeight: 600 }}>You're going</div>}
      </div>
    </div>
  );
}
