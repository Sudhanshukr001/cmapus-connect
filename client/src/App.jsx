// client/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { TopNav, BottomNav, FloatingAction } from './components/Nav.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Marketplace from './pages/Marketplace.jsx';
import ListingDetail from './pages/ListingDetail.jsx';
import Sell from './pages/Sell.jsx';
import Events from './pages/Events.jsx';
import EventDetail from './pages/EventDetail.jsx';
import Messages from './pages/Messages.jsx';
import Saved from './pages/Saved.jsx';
import Search from './pages/Search.jsx';
import Profile from './pages/Profile.jsx';

function Shell() {
  const nav = useNavigate();
  return (
    <div className="app">
      <TopNav />
      <main className="content">
        <Outlet />
      </main>
      <BottomNav />
      <FloatingAction onClick={() => nav('/sell')} />
    </div>
  );
}

export default function App() {
  const { user, ready } = useAuth();
  if (!ready) {
    return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: 'var(--faint)', fontFamily: 'var(--font)' }}>Loading Campus Connect…</div>;
  }
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route element={user ? <Shell /> : <Navigate to="/login" />}>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/events" element={<Events />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:id" element={<Messages />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}
