// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, setToken } from '../lib/api.js';

const AuthCtx = createContext(null);
export function useAuth() {
  return useContext(AuthCtx);
}
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const loadMe = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => { loadMe(); }, [loadMe]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };
  const register = async (name, email, password, campus) => {
    const res = await api.post('/auth/register', { name, email, password, campus });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, setUser, ready, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
