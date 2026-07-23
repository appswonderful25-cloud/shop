import { API_CONFIG } from "@/lib/api-config";

function getToken(): string {
  if (typeof document === 'undefined') return '';
  return document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] || '';
}

export async function supportFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const url = `${API_CONFIG.STRAPI_BASE_URL}/api${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    let body: any = null;
    try { body = await res.json(); } catch {}
    const msg = body?.error?.message || body?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}
