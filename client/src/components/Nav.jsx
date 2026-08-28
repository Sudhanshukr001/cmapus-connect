// client/src/components/Nav.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Avatar } from './ui.jsx';
import I from './icons.jsx';

const topLinks = [
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/events', label: 'Events' },
  { to: '/messages', label: 'Messages' },
  { to: '/saved', label: 'Saved' },
];
const botLinks = [
  { to: '/', label: 'Home', icon: 'compass' },
  { to: '/marketplace', label: 'Market', icon: 'tag' },
  { to: '/events', label: 'Events', icon: 'calendar' },
  { to: '/messages', label: 'Chat', icon: 'chat' },
  { to: '/profile', label: 'You', icon: 'user' },
];

export function TopNav() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const submit = (e) => { e.preventDefault(); nav('/search?q=' + encodeURIComponent(q.trim())); };

  return (
    <header className="topnav">
      <div className="brand" onClick={() => nav('/')} style={{ cursor: 'pointer' }}>
        <div className="mark">C</div>
        <div className="word">Campus<b>Connect</b></div>
      </div>
      <nav className="navlinks">
        {topLinks.map((l) => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => 'navlink' + (isActive ? ' active' : '')}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="nav-spacer" />
      <form className="topsearch" onSubmit={submit}>
        <I.search />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search campus…" aria-label="Search" />
      </form>
      {user && (
        <button className="avatar-btn" title="Profile" onClick={() => nav('/profile')} style={{ background: user.color }}>
          {user.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%' }} /> : user.initials}
        </button>
      )}
    </header>
  );
}

export function BottomNav() {
  return (
    <nav className="bottomnav">
      {botLinks.map((l) => {
        const Icon = I[l.icon];
        return (
          <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => 'botlink' + (isActive ? ' active' : '')}>
            <Icon /> {l.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

export function FloatingAction({ onClick }) {
  return (
    <button className="fab" onClick={onClick} aria-label="Sell something"><I.plus /></button>
  );
}
