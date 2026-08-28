// client/src/pages/Search.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { ListingCard } from '../components/ListingCard.jsx';
import { EventRow } from '../components/EventCard.jsx';
import { Skeleton, EmptyState, Tabs } from '../components/ui.jsx';
import { useToast } from '../context/ToastContext.jsx';
import I from '../components/icons.jsx';

export default function Search() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const toast = useToast();
  const q = params.get('q') || '';
  const [tab, setTab] = useState('all');
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (!q) { setRes({ listings: [], events: [] }); return; }
    setRes(null);
    api.get('/search?q=' + encodeURIComponent(q))
      .then((r) => setRes(r.data))
      .catch((e) => toast(e.message, 'err'));
  }, [q]);

  const listings = res?.listings || [];
  const events = res?.events || [];

  const saveSearch = async () => {
    try { await api.post('/users/saved/search', { query: q, type: 'listing' }); toast('Search saved to your Saved tab', 'ok'); }
    catch (e) { toast(e.message, 'err'); }
  };

  return (
    <div>
      <div className="section-head" style={{ alignItems: 'flex-end' }}>
        <div><div className="eyebrow">Results</div><h1 className="t-h1">“{q}”</h1></div>
        <div className="row" style={{ gap: 10 }}>
          {q && <button className="btn btn-ghost btn-sm" onClick={saveSearch}><I.bookmark size={15} /> Save search</button>}
          {(listings.length + events.length) > 0 && (
            <Tabs tabs={[{ value: 'all', label: 'All' }, { value: 'listings', label: `Listings (${listings.length})` }, { value: 'events', label: `Events (${events.length})` }]} active={tab} onChange={setTab} />
          )}
        </div>
      </div>

      {!res ? <Skeleton h={220} /> :
        (listings.length + events.length) === 0 ? (
          <EmptyState icon="search" title="Nothing here yet" text={`No listings or events match “${q}”. Try another search.`} />
        ) : (
          <>
            {(tab === 'all' || tab === 'listings') && listings.length > 0 && (
              <section className="section">
                <h2 className="t-h3 mb-3">{listings.length} {listings.length === 1 ? 'listing' : 'listings'}</h2>
                <div className="grid-listings">
                  {listings.map((l) => <ListingCard key={l._id} listing={l} onOpen={(x) => nav('/listing/' + x._id)} />)}
                </div>
              </section>
            )}
            {(tab === 'all' || tab === 'events') && events.length > 0 && (
              <section>
                <h2 className="t-h3 mb-3">{events.length} {events.length === 1 ? 'event' : 'events'}</h2>
                <div className="grid-events">
                  {events.map((e) => <EventRow key={e._id} event={e} onOpen={(x) => nav('/event/' + x._id)} />)}
                </div>
              </section>
            )}
          </>
        )
      }
    </div>
  );
}
