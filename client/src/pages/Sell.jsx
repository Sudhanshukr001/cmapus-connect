// client/src/pages/Sell.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { CATEGORIES, CONDITIONS } from '../lib/constants.js';
import { Avatar } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import I from '../components/icons.jsx';

export default function Sell() {
  const nav = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', description: '', price: '', category: 'books', condition: 'good', location: '', images: '' });
  const [busy, setBusy] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const imageList = form.images.split('\n').map((s) => s.trim()).filter(Boolean);
  const preview = {
    title: form.title || 'Your item title',
    price: form.price ? Number(form.price) : 0,
    condition: form.condition,
    location: form.location || 'Campus',
    images: imageList,
    saved: false,
    createdAt: new Date().toISOString(),
    seller: user || { name: 'You', verified: true },
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast('Add a title', 'err');
    if (!form.price || Number(form.price) <= 0) return toast('Add a valid price', 'err');
    setBusy(true);
    try {
      const res = await api.post('/listings', {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        condition: form.condition,
        location: form.location.trim(),
        images: imageList,
      });
      toast('Listed! It’s now live on campus', 'ok');
      nav('/listing/' + res.data._id);
    } catch (err) { toast(err.message, 'err'); }
    finally { setBusy(false); }
  };

  return (
    <div>
      <div className="section-head"><div><div className="eyebrow">List it</div><h1 className="t-h1">Sell something</h1></div></div>
      <div className="detail">
        <form onSubmit={submit}>
          <div className="card card-pad">
            <div className="field">
              <label>Photos</label>
              <div className="media" style={{ aspectRatio: '16/7', borderRadius: 'var(--r)', background: 'var(--paper-3)', display: 'flex', flexWrap: 'wrap', gap: 8, padding: 10, alignItems: 'center', justifyContent: imageList.length ? 'flex-start' : 'center' }}>
                {imageList.length ? imageList.map((src, i) => <img key={i} src={src} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }} />)
                  : <span className="t-sm t-faint"><I.image size={16} /> Paste image links below</span>}
              </div>
              <textarea className="textarea mt-2" rows={2} value={form.images} onChange={(e) => set('images', e.target.value)} placeholder="Paste image URLs, one per line&#10;https://…" />
              <div className="hint">Tip: use direct image links. Add a clear photo to sell faster.</div>
            </div>
            <div className="field">
              <label>Title</label>
              <input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. IKEA Study Lamp" />
            </div>
            <div className="row" style={{ gap: 12, alignItems: 'flex-end' }}>
              <div className="field grow">
                <label>Price (₹)</label>
                <input className="input" type="number" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="0" />
              </div>
              <div className="field" style={{ width: 160 }}>
                <label>Category</label>
                <select className="select" value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}
                </select>
              </div>
              <div className="field" style={{ width: 160 }}>
                <label>Condition</label>
                <select className="select" value={form.condition} onChange={(e) => set('condition', e.target.value)}>
                  {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="field">
              <label>Description</label>
              <textarea className="textarea" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Share details: age, condition, reason for selling…" />
            </div>
            <div className="field">
              <label>Pickup / location</label>
              <input className="input" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Engineering Block" />
            </div>
          </div>
          <div className="row mt-3">
            <button type="button" className="btn btn-ghost" onClick={() => nav(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>{busy ? 'Publishing…' : 'Publish listing'}</button>
          </div>
        </form>

        <aside className="section" style={{ marginBottom: 0 }}>
          <div className="t-xs t-faint" style={{ textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700, marginBottom: 10 }}>Live preview</div>
          <div className="listing" style={{ cursor: 'default' }}>
            <div className="media">
              {preview.images[0] ? <img src={preview.images[0]} alt="" /> : <div className="ph">{preview.title[0]}</div>}
            </div>
            <div className="body">
              <div className="price amount">{preview.price ? '₹' + Number(preview.price).toLocaleString('en-IN') : '₹0'}</div>
              <div className="title truncate">{preview.title}</div>
              <div className="row"><span className="pill">{preview.condition}</span></div>
              <div className="meta"><I.pin size={13} /> {preview.location} · just now</div>
              <div className="seller"><Avatar name={preview.seller.name} size={22} /> <span className="nm">{preview.seller.name}</span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
