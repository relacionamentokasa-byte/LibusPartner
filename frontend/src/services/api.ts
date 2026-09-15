const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

export const AUTH_UNAUTHORIZED_EVENT = 'libus:auth:unauthorized';

export function clearSession() {
  localStorage.removeItem('libus_token');
  localStorage.removeItem('libus_user');
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('libus_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    clearSession();
    // Dispara evento para sincronizar estado no AuthContext e redirecionar
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT, { detail: data }));
    }
    throw new Error(data.error || 'Sessão expirada ou não autorizada');
  }

  if (!res.ok) {
    throw new Error(data.error || 'Erro na requisição');
  }
  return data;
}

