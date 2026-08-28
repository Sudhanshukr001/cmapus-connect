// client/src/pages/ListingDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { Avatar, Skeleton, Verified, EmptyState } from '../components/ui.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import I from '../components/icons.jsx';
import { money, timeAgo } from '../lib/format.js';

export default function ListingDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/listings/' + id).then((r) => setListing(r.data)).catch(() => setListing(false)).finally(() => setLoading(false));
  }, [id]);

  const toggleSave = async () => {
    const res = await api.post('/listings/' + id + '/save');
    setListing((l) => ({ ...l, saved: res.data.saved }));
  };

  const messageSeller = async () => {
    try {
      const res = await api.post('/conversations', { participantId: listing.seller._id, listingId: listing._id });
      nav('/messages/' + res.data._id);
    } catch (e) { toast(e.message, 'err'); }
  };

  const remove = async () => {
    if (!confirm('Remove this listing?')) return;
    try { await api.del('/listings/' + id); toast('Listing removed', 'ok'); nav('/marketplace'); }
    catch (e) { toast(e.message, 'err'); }
  };

  if (loading) return (
    <div className="detail">
      <Skeleton h={360} r={16} />
      <div><Skeleton h={30} w="70%" className="mb-3" /><Skeleton h={16} w="40%" className="mb-3" /><Skeleton h={80} /><Skeleton h={44} className="mt-4" /></div>
    </div>
  );
  if (listing === false) return <EmptyState icon="info" title="Listing not found" text="It may have been removed." action={<button className="btn btn-ghost" onClick={() => nav('/marketplace')}>Back to Marketplace</button>} />;

  const isOwner = user && listing.seller?._id === user._id;
  const img = listing.images?.[0];

  return (
    <div>
      <button className="btn btn-ghost mb-3" onClick={() => nav(-1)}><I.arrowLeft size={16} /> Back</button>
      <div className="detail">
        <div className="gallery">
          {img ? <img src={img} alt={listing.title} /> : <div style={{ display: 'grid', placeItems: 'center', height: '100%', fontSize: 80, color: 'var(--faint)', fontWeight: 800 }}>{listing.title[0]}</div>}
        </div>
        <div className="panel">
          <span className="pill">{listing.condition}</span>
          <h1 className="t-h1 mt-2" style={{ letterSpacing: '-.01em' }}>{listing.title}</h1>
          <div className="amount" style={{ fontSize: 30, margin: '10px 0' }}>{money(listing.price)}</div>

          <div className="row" style={{ gap: 8, color: 'var(--muted)', fontSize: 'var(--fs-sm)' }}>
            <I.pin size={15} /> {listing.location || 'Campus'} <span>·</span> <span>Posted {timeAgo(listing.createdAt)}</span>
          </div>

          <hr className="divider" />
          <h3 className="t-h3 mb-2">Description</h3>
          <p className="t-muted" style={{ lineHeight: 1.6 }}>{listing.description || 'No description provided.'}</p>

          <div className="seller-card mt-4">
            <Avatar name={listing.seller?.name} src={listing.seller?.avatar} size={44} color={listing.seller?.color} />
            <div className="grow">
              <div className="row" style={{ gap: 6 }}>
                <b>{listing.seller?.name}</b>
                {listing.seller?.verified && <I.checkCircle size={14} style={{ color: 'var(--secondary)' }} />}
              </div>
              <div className="t-xs t-muted">{listing.seller?.campus}</div>
            </div>
          </div>

          <div className="sticky-cta">
            {isOwner ? (
              <div className="row">
                <button className="btn btn-ghost grow" onClick={remove}><I.trash size={16} /> Remove</button>
              </div>
            ) : (
              <div className="row">
                <button className="btn btn-ghost" onClick={toggleSave}><I.bookmark size={16} className={listing.saved ? 'on' : ''} style={listing.saved ? { color: 'var(--accent)' } : undefined} /> {listing.saved ? 'Saved' : 'Save'}</button>
                <button className="btn btn-primary grow" onClick={messageSeller}><I.chat size={16} /> Message seller</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
