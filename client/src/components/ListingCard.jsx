// client/src/components/ListingCard.jsx
import React from 'react';
import { Avatar, Verified } from './ui.jsx';
import I from './icons.jsx';
import { money, timeAgo } from '../lib/format.js';

export function ListingCard({ listing, onOpen, onToggleSave, saving }) {
  const img = listing.images?.[0];
  const seller = listing.seller || {};
  return (
    <article className="listing" onClick={() => onOpen?.(listing)}>
      <div className="media">
        {img ? <img src={img} alt={listing.title} loading="lazy" /> : <div className="ph">{listing.title?.[0] || '?'}</div>}
        <button
          className={`save ${listing.saved ? 'on' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleSave?.(listing); }}
          disabled={saving}
          aria-label="Save"
        >
          <I.bookmark />
        </button>
      </div>
      <div className="body">
        <div className="price amount">{money(listing.price)}</div>
        <div className="title truncate">{listing.title}</div>
        <div className="row" style={{ gap: 6 }}>
          <span className="pill">{listing.condition}</span>
        </div>
        <div className="meta">
          <I.pin size={13} /> <span className="truncate">{listing.location || 'Campus'}</span>
          <span>·</span> <span>{timeAgo(listing.createdAt)}</span>
        </div>
        <div className="seller">
          <Avatar name={seller.name} src={seller.avatar} size={22} color={seller.color} />
          <span className="nm truncate">{seller.name || 'Student'}</span>
          {seller.verified && <I.checkCircle size={13} style={{ color: 'var(--secondary)' }} />}
        </div>
      </div>
    </article>
  );
}

export function FilterBar({ filters, onChange, onMobile }) {
  const set = (k, v) => onChange({ ...filters, [k]: v });
  return (
    <div className="filterbar">
      <select className="select-mini" value={filters.category || ''} onChange={(e) => set('category', e.target.value)}>
        <option value="">All categories</option>
        {['books','electronics','furniture','bicycles','hostel','clothing','tickets','services','other'].map((c) => (
          <option key={c} value={c}>{c.replace('-', ' ')}</option>
        ))}
      </select>
      <select className="select-mini" value={filters.condition || ''} onChange={(e) => set('condition', e.target.value)}>
        <option value="">Any condition</option>
        {['new','like-new','good','fair','poor'].map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select className="select-mini" value={filters.sort || 'newest'} onChange={(e) => set('sort', e.target.value)}>
        <option value="newest">Newest</option>
        <option value="price-asc">Price ↑</option>
        <option value="price-desc">Price ↓</option>
      </select>
      <button className={`tag ${filters.saved === 'true' ? 'active' : ''}`} onClick={() => set('saved', filters.saved === 'true' ? '' : 'true')}>
        <I.bookmark size={13} /> Saved
      </button>
      <div className="grow" />
      <button className="btn btn-subtle" onClick={onMobile} style={{ display: 'none' }} id="filterMobileBtn">
        <I.filter size={16} /> Filters
      </button>
    </div>
  );
}
