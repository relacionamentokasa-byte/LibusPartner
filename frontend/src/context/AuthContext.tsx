import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, clearSession, AUTH_UNAUTHORIZED_EVENT } from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'GESTOR' | 'TECNICO';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('libus_token'));
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await apiRequest('/auth/me');
        setUser(data.user);
      } catch (err) {
        logout();
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email: string, pass: string) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass })
    });
    localStorage.setItem('libus_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

