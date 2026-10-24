import { AuthResponse, User } from '../types';

const API_URL = 'http://127.0.0.1:8000';

const ACCESS_KEY = 'scm_access_token';
const REFRESH_KEY = 'scm_refresh_token';

export const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  setAccess: (access: string) => {
    localStorage.setItem(ACCESS_KEY, access);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefresh();
  if (!refreshToken) return null;

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    tokenStorage.clear();
    return null;
  }

  const data = await response.json();
  tokenStorage.setAccess(data.access_token);
  return data.access_token;
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
  let accessToken = tokenStorage.getAccess();

  const makeRequest = (token: string | null) =>
    fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  let response = await makeRequest(accessToken);

  if (response.status === 401 && tokenStorage.getRefresh()) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      response = await makeRequest(newAccess);
    }
  }

  return response;
}

export async function apiRegister(
  username: string,
  full_name: string,
  password: string,
  role: 'student' | 'teacher'
): Promise<User> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, full_name, password, role }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Ошибка регистрации');
  }
  return res.json();
}

export async function apiLogin(username: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Неверный логин или пароль');
  }

  const data: AuthResponse = await res.json();
  tokenStorage.setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function apiGetMe(): Promise<User> {
  const res = await fetchWithAuth('/auth/me');
  if (!res.ok) {
    throw new Error('Не авторизован');
  }
  return res.json();
}

export async function apiLogout(): Promise<void> {
  const refreshToken = tokenStorage.getRefresh();
  if (refreshToken) {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    }).catch(() => {});
  }
  tokenStorage.clear();
}