// client/src/pages/Events.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { EventRow } from '../components/EventCard.jsx';
import { Modal, Skeleton, EmptyState } from '../components/ui.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { EVENT_CATEGORIES, EVENT_CAT_COLOR } from '../lib/constants.js';
import { dateInputValue } from '../lib/format.js';
import I from '../components/icons.jsx';

export default function Events() {
  const nav = useNavigate();
  const toast = useToast();
  const [cat, setCat] = useState('');
  const [events, setEvents] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'social', location: '', startTime: dateInputValue(Date.now() + 86400000), description: '' });
  const [busy, setBusy] = useState(false);

  const load = () => {
    const qs = cat ? '?category=' + cat : '';
    api.get('/events' + qs).then((r) => setEvents(r.data)).catch(() => setEvents([]));
  };
  useEffect(load, [cat]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast('Add a title', 'err');
    setBusy(true);
    try {
      const res = await api.post('/events', { ...form, startTime: new Date(form.startTime).toISOString() });
      toast('Event created', 'ok');
      setOpen(false);
      nav('/event/' + res.data._id);
    } catch (err) { toast(err.message, 'err'); }
    finally { setBusy(false); }
  };

  return (
    <div>
      <div className="section-head" style={{ alignItems: 'flex-end' }}>
        <div><div className="eyebrow">What's on</div><h1 className="t-h1">Events</h1></div>
        <button className="btn btn-primary" onClick={() => setOpen(true)}><I.plus size={16} /> Host event</button>
      </div>

      <div className="filterbar">
        <button className={`tag ${!cat ? 'active' : ''}`} onClick={() => setCat('')}>All</button>
        {EVENT_CATEGORIES.map((c) => (
          <button key={c} className={`tag ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
            <span className="eventcat" style={{ background: EVENT_CAT_COLOR[c] }} /> {c}
          </button>
        ))}
      </div>

      {!events ? (
        Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} h={72} r={11} className="mb-3" />)
      ) : events.length === 0 ? (
        <EmptyState icon="calendar" title="Nothing planned yet" text="Check back soon — or host the first event your campus needs." action={<button className="btn btn-primary" onClick={() => setOpen(true)}><I.plus size={16} /> Host event</button>} />
      ) : (
        <div className="grid-events">
          {events.map((e) => <EventRow key={e._id} event={e} onOpen={(x) => nav('/event/' + x._id)} />)}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Host an event">
        <form onSubmit={submit}>
          <div className="field"><label>Title</label><input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Coding Club Meetup" /></div>
          <div className="row" style={{ gap: 12, alignItems: 'flex-end' }}>
            <div className="field grow"><label>Category</label>
              <select className="select" value={form.category} onChange={(e) => set('category', e.target.value)}>
                {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select></div>
            <div className="field grow"><label>Date & time</label>
              <input className="input" type="datetime-local" value={form.startTime} onChange={(e) => set('startTime', e.target.value)} /></div>
          </div>
          <div className="field"><label>Location</label><input className="input" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Student Center" /></div>
          <div className="field"><label>Description</label><textarea className="textarea" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="What's it about?" /></div>
          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Creating…' : 'Create event'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
