import React, { createContext, useContext, useEffect, useState } from 'react';
import { alvesApiRequest, clearAlvesSession, ALVES_AUTH_UNAUTHORIZED_EVENT } from '../services/api';

type AuthUser = { id: string; name: string; email: string; role: string };

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AlvesAuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AlvesAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('alves_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener(ALVES_AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    const token = localStorage.getItem('alves_token');
    if (!token) {
      setLoading(false);
      return () => window.removeEventListener(ALVES_AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    }
    alvesApiRequest('/alves-auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
    return () => window.removeEventListener(ALVES_AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await alvesApiRequest('/alves-auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem('alves_token', data.token);
    localStorage.setItem('alves_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    clearAlvesSession();
    setUser(null);
  };

  return <AlvesAuthContext.Provider value={{ user, loading, login, logout }}>{children}</AlvesAuthContext.Provider>;
};

export function useAlvesAuth() {
  const context = useContext(AlvesAuthContext);
  if (!context) throw new Error('useAlvesAuth deve ser usado dentro de AlvesAuthProvider');
  return context;
}
