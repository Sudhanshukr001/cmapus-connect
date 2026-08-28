// client/src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { Avatar, Verified, Skeleton } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ListingCard } from '../components/ListingCard.jsx';
import { EventRow } from '../components/EventCard.jsx';
import I from '../components/icons.jsx';

export default function Profile() {
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const [listings, setListings] = useState(null);
  const [events, setEvents] = useState(null);

  useEffect(() => {
    if (!user) return;
    api.get('/listings?seller=' + user._id).then((r) => setListings(r.data)).catch(() => setListings([]));
    api.get('/events').then((r) => setEvents(r.data.filter((e) => e.organizer?._id === user._id))).catch(() => setEvents([]));
  }, [user]);

  if (!user) return null;

  return (
    <div>
      <div className="card card-pad mb-3">
        <div className="row" style={{ gap: 16 }}>
          <Avatar name={user.name} src={user.avatar} size={68} color={user.color} />
          <div className="grow">
            <div className="row" style={{ gap: 8 }}><h1 className="t-h2">{user.name}</h1>{user.verified && <Verified />}</div>
            <div className="t-muted t-sm">{user.email}</div>
            <div className="t-muted t-sm">{user.campus}</div>
          </div>
          <button className="btn btn-ghost" onClick={() => { logout(); nav('/login'); }}><I.logout size={16} /> Log out</button>
        </div>
      </div>

      <section className="section">
        <h2 className="t-h3 mb-3">Your listings</h2>
        {!listings ? <Skeleton h={200} /> : listings.length === 0 ? (
          <div className="card card-pad t-muted t-sm">You haven't listed anything yet. <button className="btn btn-ghost btn-sm" onClick={() => nav('/sell')}>Sell something</button></div>
        ) : (
          <div className="grid-listings">{listings.map((l) => <ListingCard key={l._id} listing={l} onOpen={(x) => nav('/listing/' + x._id)} />)}</div>
        )}
      </section>

      <section>
        <h2 className="t-h3 mb-3">Events you're hosting</h2>
        {!events ? <Skeleton h={160} /> : events.length === 0 ? (
          <div className="card card-pad t-muted t-sm">No events hosted yet.</div>
        ) : (
          <div className="grid-events">{events.map((e) => <EventRow key={e._id} event={e} onOpen={(x) => nav('/event/' + x._id)} />)}</div>
        )}
      </section>
    </div>
  );
}
