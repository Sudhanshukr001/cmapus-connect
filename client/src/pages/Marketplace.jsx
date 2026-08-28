// client/src/pages/Marketplace.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { ListingCard, FilterBar } from '../components/ListingCard.jsx';
import { Skeleton, EmptyState } from '../components/ui.jsx';
import { useToast } from '../context/ToastContext.jsx';
import I from '../components/icons.jsx';

export default function Marketplace() {
  const nav = useNavigate();
  const toast = useToast();
  const [params] = useSearchParams();
  const [filters, setFilters] = useState({ category: '', condition: '', sort: 'newest', saved: '', q: params.get('q') || '' });
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const load = useCallback(async (reset) => {
    setLoading(true);
    const p = reset ? 1 : page + 1;
    const qs = new URLSearchParams({ ...filters, page: p, limit: 20 }).toString();
    try {
      const res = await api.get('/listings?' + qs);
      setItems((prev) => (reset ? res.data : [...prev, ...res.data]));
      setTotal(res.meta.total);
      setPage(p);
    } catch (e) { toast(e.message, 'err'); }
    finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { load(true); }, [filters]);

  const toggleSave = async (listing) => {
    setSavingId(listing._id);
    try {
      const res = await api.post('/listings/' + listing._id + '/save');
      setItems((prev) => prev.map((x) => (x._id === listing._id ? { ...x, saved: res.data.saved } : x)));
    } catch (e) { toast(e.message, 'err'); }
    finally { setSavingId(null); }
  };

  const hasMore = items.length < total;

  return (
    <div>
      <div className="section-head" style={{ alignItems: 'flex-end' }}>
        <div>
          <div className="eyebrow">Buy & sell</div>
          <h1 className="t-h1">Marketplace</h1>
        </div>
        <span className="t-sm t-muted">{total} {total === 1 ? 'item' : 'items'}</span>
      </div>

      {filters.q && (
        <div className="row mb-3"><span className="pill pill-accent">Search: {filters.q}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setFilters((f) => ({ ...f, q: '' }))}>Clear</button></div>
      )}

      <FilterBar filters={filters} onChange={setFilters} />

      {loading && items.length === 0 ? (
        <div className="grid-listings">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} h={230} r={11} />)}</div>
      ) : items.length === 0 ? (
        <EmptyState icon="bag" title="Looks quiet here" text="Try another category or be the first to post something for sale." action={<button className="btn btn-primary" onClick={() => nav('/sell')}><I.plus size={16} /> Sell something</button>} />
      ) : (
        <>
          <div className="grid-listings">
            {items.map((l) => <ListingCard key={l._id} listing={l} onOpen={(x) => nav('/listing/' + x._id)} onToggleSave={toggleSave} saving={savingId === l._id} />)}
          </div>
          {hasMore && (
            <div className="center mt-4">
              <button className="btn btn-subtle" onClick={() => load(false)} disabled={loading}>{loading ? 'Loading…' : 'Load more'}</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
