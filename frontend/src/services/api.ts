const API_URL = import.meta.env.VITE_API_URL || '/api';

export const AUTH_UNAUTHORIZED_EVENT = 'libus:auth:unauthorized';
export const ALVES_AUTH_UNAUTHORIZED_EVENT = 'alves:auth:unauthorized';

export function clearSession() {
  localStorage.removeItem('libus_token');
  localStorage.removeItem('libus_user');
}

export function clearAlvesSession() {
  localStorage.removeItem('alves_token');
  localStorage.removeItem('alves_user');
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  return request(endpoint, options, true, 'libus');
}

export async function publicApiRequest(endpoint: string, options: RequestInit = {}) {
  return request(endpoint, options, false, 'libus');
}

export async function alvesApiRequest(endpoint: string, options: RequestInit = {}) {
  return request(endpoint, options, true, 'alves');
}

async function request(endpoint: string, options: RequestInit = {}, authenticated: boolean, domain: 'libus' | 'alves' = 'libus') {
  const token = localStorage.getItem(domain === 'alves' ? 'alves_token' : 'libus_token');
  const unauthorizedEvent = domain === 'alves' ? ALVES_AUTH_UNAUTHORIZED_EVENT : AUTH_UNAUTHORIZED_EVENT;
  const clear = domain === 'alves' ? clearAlvesSession : clearSession;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(authenticated && token ? { Authorization: `Bearer ${token}` } : {})
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (authenticated && res.status === 401) {
    clear();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(unauthorizedEvent, { detail: data }));
    }
    throw new Error(data.error || 'Sessão expirada ou não autorizada');
  }

  if (!res.ok) {
    throw new Error(data.error || 'Erro na requisição');
  }
  return data;
}

