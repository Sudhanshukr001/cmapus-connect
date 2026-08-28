// client/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import I from '../components/icons.jsx';

export default function Login() {
  const { login, register } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: 'you@campus.edu', password: 'campus123', campus: 'North Campus' });
  const [busy, setBusy] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.name, form.email, form.password, form.campus);
      toast('Welcome to Campus Connect', 'ok');
      nav('/');
    } catch (err) {
      toast(err.message || 'Something went wrong', 'err');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="brand">
          <div className="mark">C</div>
          <div className="word">Campus<b>Connect</b></div>
        </div>
        <h1 className="t-h1" style={{ marginBottom: 4 }}>{mode === 'login' ? 'Welcome back' : 'Join your campus'}</h1>
        <p className="t-muted t-sm" style={{ marginBottom: 22 }}>
          {mode === 'login' ? 'Sign in to buy, sell and discover.' : 'Students only. Verify with your campus email.'}
        </p>
        <form onSubmit={submit}>
          {mode === 'register' && (
            <div className="field">
              <label>Full name</label>
              <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Aarav Sharma" required />
            </div>
          )}
          <div className="field">
            <label>Campus email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@campus.edu" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input className="input" type="password" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="••••••••" required />
          </div>
          {mode === 'register' && (
            <div className="field">
              <label>Campus</label>
              <input className="input" value={form.campus} onChange={(e) => set('campus', e.target.value)} placeholder="e.g. North Campus" />
            </div>
          )}
          <button className="btn btn-primary btn-block btn-lg" disabled={busy} type="submit">
            {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        <div className="auth-alt">
          {mode === 'login' ? (
            <>New here? <button onClick={() => setMode('register')}>Create an account</button></>
          ) : (
            <>Already a member? <button onClick={() => setMode('login')}>Sign in</button></>
          )}
        </div>
        <div className="row mt-3" style={{ gap: 6, justifyContent: 'center' }}>
          <I.info size={14} /> <span className="t-xs t-faint">Demo: you@campus.edu / campus123</span>
        </div>
      </div>
    </div>
  );
}
