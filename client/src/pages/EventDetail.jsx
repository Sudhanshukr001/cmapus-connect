// client/src/pages/EventDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { Avatar, Skeleton, EmptyState } from '../components/ui.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getSocket } from '../lib/socket.js';
import { eventDate } from '../lib/format.js';
import { EVENT_CAT_COLOR, EVENT_CAT_LABEL } from '../lib/constants.js';
import I from '../components/icons.jsx';

export default function EventDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([api.get('/events/' + id), api.get('/events/' + id + '/attendees')])
      .then(([e, a]) => { if (alive) { setEvent(e.data); setAttendees(a.data); } })
      .catch(() => alive && setEvent(false))
      .finally(() => alive && setLoading(false));

    const socket = getSocket();
    socket.emit('event:join', id);
    const handler = (payload) => {
      if (payload.eventId === id) {
        setEvent((ev) => ev && ({ ...ev, attendeeCount: payload.attendeeCount }));
        if (user && payload.userId === user._id) setEvent((ev) => ev && ({ ...ev, viewerStatus: payload.status }));
      }
    };
    socket.on('rsvp:update', handler);
    return () => { socket.off('rsvp:update', handler); socket.emit('event:leave', id); alive = false; };
  }, [id, user]);

  const rsvp = async () => {
    setBusy(true);
    const prev = event.viewerStatus;
    // optimistic
    setEvent((ev) => ({ ...ev, viewerStatus: prev === 'going' ? 'cancelled' : 'going', attendeeCount: prev === 'going' ? ev.attendeeCount - 1 : ev.attendeeCount + 1 }));
    try {
      await api.post('/events/' + id + '/rsvp');
    } catch (e) {
      setEvent((ev) => ({ ...ev, viewerStatus: prev, attendeeCount: prev === 'going' ? ev.attendeeCount + 1 : ev.attendeeCount - 1 }));
      toast(e.message, 'err');
    } finally { setBusy(false); }
  };

  if (loading) return <div className="detail"><Skeleton h={300} r={16} /><Skeleton h={200} /></div>;
  if (event === false) return <EmptyState icon="calendar" title="Event not found" text="It may have been removed." action={<button className="btn btn-ghost" onClick={() => nav('/events')}>Back to Events</button>} />;

  const d = eventDate(event.startTime);
  const going = event.viewerStatus === 'going';

  return (
    <div>
      <button className="btn btn-ghost mb-3" onClick={() => nav(-1)}><I.arrowLeft size={16} /> Back</button>
      <div className="detail">
        <div>
          <div className="row" style={{ gap: 10, marginBottom: 12 }}>
            <span className="eventcat" style={{ background: EVENT_CAT_COLOR[event.category] || 'var(--accent)', width: 10, height: 10 }} />
            <span className="pill">{EVENT_CAT_LABEL[event.category]}</span>
          </div>
          <h1 className="t-h1" style={{ letterSpacing: '-.01em' }}>{event.title}</h1>
          <p className="t-muted mt-2" style={{ lineHeight: 1.6 }}>{event.description}</p>

          <div className="card card-pad mt-4">
            <div className="row" style={{ gap: 14 }}>
              <div className="datebadge" style={{ flex: '0 0 72px', width: 72, height: 72 }}>
                <span className="mon">{d.mon}</span><span className="day" style={{ fontSize: 28 }}>{d.day}</span><span className="wk">{d.wk}</span>
              </div>
              <div>
                <div className="t-h3">{d.full}</div>
                <div className="t-sm t-muted mt-1"><I.pin size={14} /> {event.location || 'Campus'}</div>
                <div className="t-sm t-muted"><I.user size={14} /> Hosted by {event.organizer?.name}</div>
              </div>
            </div>
          </div>

          <div className="card card-pad mt-3">
            <div className="t-h3 mb-2">{event.attendeeCount} {event.attendeeCount === 1 ? 'student is' : 'students are'} going</div>
            <div className="row wrap" style={{ gap: -6 }}>
              {attendees.slice(0, 8).map((a) => <Avatar key={a._id} name={a.name} src={a.avatar} size={34} color={a.color} style={{ marginLeft: -6, border: '2px solid var(--paper-2)' }} />)}
              {attendees.length > 8 && <span className="t-sm t-muted">+{attendees.length - 8} more</span>}
            </div>
            {attendees.length === 0 && <div className="t-sm t-faint">Be the first to RSVP.</div>}
          </div>
        </div>

        <div className="panel">
          <div className="card card-pad">
            <div className="amount" style={{ fontSize: 22 }}>{event.attendeeCount} going</div>
            <div className="t-xs t-muted mb-3">Free to attend · open to campus</div>
            <button className={`btn btn-block btn-lg ${going ? 'btn-subtle' : 'btn-primary'}`} onClick={rsvp} disabled={busy}>
              {going ? <><I.check size={16} /> Going ✓</> : 'RSVP'}
            </button>
            {going && <button className="btn btn-ghost btn-block mt-2" onClick={rsvp} disabled={busy}>Cancel RSVP</button>}
          </div>
          <div className="t-xs t-faint mt-3 center">RSVPs update live as your peers respond.</div>
        </div>
      </div>
    </div>
  );
}
