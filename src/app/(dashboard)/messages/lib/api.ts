
let _token: string | null = null;
let _userId: number | null = null;
let _sessionPromise: Promise<{ token: string | null; userId: number | null }> | null = null;

async function fetchSession(): Promise<{ token: string | null; userId: number | null }> {
  if (_token !== null) return { token: _token, userId: _userId };
  try {
    const res = await fetch('/api/auth/session', { cache: 'no-store' });
    if (!res.ok) return { token: null, userId: null };
    const data = await res.json();
    _token = data.token || null;
    _userId = data.userId || null;
    return { token: _token, userId: _userId };
  } catch {
    return { token: null, userId: null };
  }
}

async function getToken(): Promise<string> {
  if (_token !== null) return _token;
  if (!_sessionPromise) _sessionPromise = fetchSession();
  const s = await _sessionPromise;
  return s.token || '';
}

export async function getAccessToken(): Promise<string | null> {
  const t = await getToken();
  return t || null;
}

export async function getCurrentUserId(): Promise<number | null> {
  if (_userId !== null) return _userId;
  if (!_sessionPromise) _sessionPromise = fetchSession();
  const s = await _sessionPromise;
  return s.userId;
}

export function resetSession() {
  _token = null;
  _userId = null;
  _sessionPromise = null;
}

function unwrap(entity: any): any {
  if (entity === null || entity === undefined) return null;
  if (Array.isArray(entity)) return entity.map(unwrap);
  if (typeof entity !== 'object') return entity;
  return entity;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `/api/proxy${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    let body: any = null;
    try { body = await res.json(); } catch {}
    const msg = body?.error?.message || body?.message || `Request failed (${res.status})`;
    if (res.status === 401 || res.status === 403) {
      throw new Error('Please log in to perform this action.');
    }
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

const THREADS_URL = '/user-messages';
const CONVERSATIONS_URL = '/messages-conversations';

const THREAD_POPULATE = 'populate[user]=true&populate[sender]=true&populate[messages_conversations][populate][users_permissions_user]=true&sort=updatedAt:desc';

const CONVERSATION_POPULATE = 'populate[users_permissions_user]=true';

export async function fetchThreads() {
  const json = await apiFetch(`${THREADS_URL}?${THREAD_POPULATE}`);
  return unwrap(json.data || json);
}

export async function fetchThread(documentId: string) {
  const json = await apiFetch(`${THREADS_URL}/${documentId}?${THREAD_POPULATE}`);
  return unwrap(json.data || json);
}

export async function createThread(data: Record<string, any>) {
  const json = await apiFetch(THREADS_URL, {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
  return unwrap(json.data || json);
}

export async function updateThread(documentId: string, data: Record<string, any>) {
  const json = await apiFetch(`${THREADS_URL}/${documentId}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
  return unwrap(json.data || json);
}

export async function deleteThread(documentId: string) {
  await apiFetch(`${THREADS_URL}/${documentId}`, { method: 'DELETE' });
}

export async function findUserByEmail(email: string) {
  const json = await apiFetch(`/users?filters[email][$eq]=${encodeURIComponent(email)}`);
  const users = json || [];
  return Array.isArray(users) && users.length > 0 ? users[0] : null;
}

export async function createConversationMessage(data: Record<string, any>) {
  const json = await apiFetch(CONVERSATIONS_URL, {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
  return unwrap(json.data || json);
}


