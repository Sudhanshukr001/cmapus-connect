// client/src/pages/Saved.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { Tabs, Skeleton, EmptyState } from '../components/ui.jsx';
import { ListingCard } from '../components/ListingCard.jsx';
import { EventRow } from '../components/EventCard.jsx';
import { useToast } from '../context/ToastContext.jsx';
import I from '../components/icons.jsx';

export default function Saved() {
  const nav = useNavigate();
  const toast = useToast();
  const [tab, setTab] = useState('listings');
  const [data, setData] = useState(null);

  const load = useCallback(() => {
    api.get('/users/saved').then((r) => setData(r.data)).catch(() => setData({ listings: [], events: [], searches: [] }));
  }, []);
  useEffect(load, []);

  const unsaveListing = async (l) => {
    await api.post('/listings/' + l._id + '/save');
    load();
  };
  const unsaveEvent = async (e) => {
    await api.post('/events/' + e._id + '/save');
    load();
  };
  const removeSearch = async (s) => {
    await api.del('/users/saved/search/' + s._id);
    load();
  };

  return (
    <div>
      <div className="section-head" style={{ alignItems: 'flex-end' }}>
        <div><div className="eyebrow">Your space</div><h1 className="t-h1">Saved</h1></div>
        <Tabs tabs={[{ value: 'listings', label: 'Listings' }, { value: 'events', label: 'Events' }, { value: 'searches', label: 'Searches' }]} active={tab} onChange={setTab} />
      </div>

      {!data ? <Skeleton h={200} /> :
        tab === 'listings' && (
          data.listings.length === 0 ? <EmptyState icon="bookmark" title="Nothing saved yet" text="Keep an eye out — your next campus find could be here. Tap the bookmark on any listing." />
            : <div className="grid-listings">{data.listings.map((l) => <ListingCard key={l._id} listing={l} onOpen={(x) => nav('/listing/' + x._id)} onToggleSave={unsaveListing} />)}</div>
        )
      }
      {data && tab === 'events' && (
        data.events.length === 0 ? <EmptyState icon="calendar" title="No saved events" text="When you save an event, it shows up here so you never miss it." />
          : <div className="grid-events">{data.events.map((e) => <EventRow key={e._id} event={e} onOpen={(x) => nav('/event/' + x._id)} />)}</div>
      )}
      {data && tab === 'searches' && (
        data.searches.length === 0 ? <EmptyState icon="search" title="No saved searches" text="Save a search to get back to it quickly." />
          : <div className="row wrap" style={{ gap: 10 }}>
            {data.searches.map((s) => (
              <div key={s._id} className="tag" style={{ fontSize: 'var(--fs-sm)', padding: '8px 12px' }}>
                <I.search size={14} />
                <span style={{ cursor: 'pointer', textTransform: 'capitalize' }} onClick={() => nav('/search?q=' + encodeURIComponent(s.query))}>{s.query}</span>
                <button className="iconbtn" style={{ width: 22, height: 22, border: 'none', background: 'transparent' }} onClick={() => removeSearch(s)}><I.x size={13} /></button>
              </div>
            ))}
          </div>
      )}
    </div>
  );
}
