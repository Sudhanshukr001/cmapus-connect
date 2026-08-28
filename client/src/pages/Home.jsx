// client/src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { ListingCard } from '../components/ListingCard.jsx';
import { EventRow } from '../components/EventCard.jsx';
import { Skeleton, Avatar } from '../components/ui.jsx';
import I from '../components/icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [listings, setListings] = useState(null);
  const [events, setEvents] = useState(null);
  const [stats, setStats] = useState({ listings: 0, events: 0, going: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/listings?limit=8&sort=newest'),
      api.get('/events?limit=4'),
    ]).then(([l, e]) => {
      setListings(l.data);
      setEvents(e.data);
      setStats({ listings: l.meta.total, events: e.meta.total, going: e.data.reduce((a, x) => a + (x.attendeeCount || 0), 0) });
    }).catch(() => {});
  }, []);

  const quick = [
    { icon: 'bag', label: 'Sell something', sub: 'List in under a minute', to: '/sell', c: 'var(--accent-soft)', ci: 'var(--accent-ink)' },
    { icon: 'search', label: 'Find something', sub: 'Browse the marketplace', to: '/marketplace', c: 'var(--secondary-soft)', ci: 'var(--secondary)' },
    { icon: 'compass', label: 'Explore events', sub: "See what's on", to: '/events', c: '#e9f0f8', ci: 'var(--info)' },
    { icon: 'spark', label: 'Marketplace pulse', sub: 'Trending right now', to: '/marketplace', c: '#f3e9f8', ci: '#9333ea' },
  ];

  return (
    <div>
      <div className="hero">
        <div>
          <div className="greet">{greeting()}{user ? `, ${user.name.split(' ')[0]}` : ''}</div>
          <h1 className="t-display" style={{ marginTop: 4 }}>What's happening on campus?</h1>
        </div>
      </div>

      <div className="quick">
        {quick.map((q) => {
          const Icon = I[q.icon];
          return (
            <div key={q.label} className="quickcard" onClick={() => nav(q.to)}>
              <div className="qi" style={{ background: q.c, color: q.ci }}><Icon /></div>
              <b>{q.label}</b>
              <span>{q.sub}</span>
            </div>
          );
        })}
      </div>

      <div className="hsplit">
        <section className="section" style={{ marginBottom: 0 }}>
          <div className="section-head">
            <div><div className="eyebrow">Just in</div><h2 className="t-h2">Recently listed</h2></div>
            <button className="btn btn-ghost" onClick={() => nav('/marketplace')}>View all →</button>
          </div>
          {!listings ? (
            <div className="grid-listings">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} h={230} r={11} />)}
            </div>
          ) : (
            <div className="grid-listings">
              {listings.map((l) => <ListingCard key={l._id} listing={l} onOpen={(x) => nav('/listing/' + x._id)} />)}
            </div>
          )}
        </section>

        <aside className="section" style={{ marginBottom: 0 }}>
          <div className="section-head"><div><div className="eyebrow">Don't miss</div><h2 className="t-h2">Events pulse</h2></div></div>
          {!events ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} h={64} r={11} className="mb-3" />)
          ) : (
            <div className="grid-events">
              {events.map((e) => <EventRow key={e._id} event={e} onOpen={(x) => nav('/event/' + x._id)} />)}
            </div>
          )}

          <div className="card card-pad mt-4">
            <div className="t-xs t-faint" style={{ textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700 }}>Campus activity</div>
            <div className="row mt-3" style={{ gap: 14, flexWrap: 'wrap' }}>
              <div><div className="t-h2">{stats.listings}</div><div className="t-xs t-muted">items for sale</div></div>
              <div><div className="t-h2">{stats.events}</div><div className="t-xs t-muted">events upcoming</div></div>
              <div><div className="t-h2">{stats.going}</div><div className="t-xs t-muted">RSVPs this term</div></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
