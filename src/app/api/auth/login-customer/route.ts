import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getStrapiBaseUrl } from '@/lib/api-config';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 });
    return true;
  }
  if (record.count >= 5) return false;
  record.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many login attempts.' }, { status: 429 });
    }

    // Login via Strapi
    const strapiRes = await fetch(getStrapiBaseUrl('/api/auth/local'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await strapiRes.json();

    if (!strapiRes.ok) {
      return NextResponse.json({ error: data.error?.message || 'Invalid credentials' }, { status: strapiRes.status });
    }

    // Check user role — must be customerPublic (not admin)
    const userRes = await fetch(`${getStrapiBaseUrl('/api/users/me')}?populate=role`, {
      headers: { Authorization: `Bearer ${data.jwt}` },
    });

    const userData = await userRes.json();
    const roleName = userData?.role?.type || userData?.role?.name || '';

    // Allow customerPublic AND authenticated (for backwards compat) — but BLOCK admin-type roles
    const blockedRoles = ['admin', 'manager', 'support_agent'];
    if (blockedRoles.includes(roleName)) {
      return NextResponse.json({ error: 'This account is for admin use. Please use the admin login.' }, { status: 403 });
    }

    // Create session
    const sessionRes = await fetch(getStrapiBaseUrl('/api/auth/create-session'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${data.jwt}` },
      body: JSON.stringify({ identifier, password, os: '', device: '', browser: '', country: '', city: '', ip }),
    });

    const sessionData = await sessionRes.json();

    if (sessionRes.ok && sessionData.accessToken) {
      const cookieStore = await cookies();
      cookieStore.set('accessToken', sessionData.accessToken, {
        httpOnly: false, secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', maxAge: 60 * 60 * 24, path: '/',
      });
      cookieStore.set('id', String(data.user.id), {
        httpOnly: false, secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', maxAge: 60 * 60 * 24, path: '/',
      });
      cookieStore.set('userRole', roleName, {
        httpOnly: false, secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', maxAge: 60 * 60 * 24, path: '/',
      });
    }

    const { role, ...safeUser } = data.user || {};
    return NextResponse.json({ ok: true, user: { ...safeUser, role: userData?.role } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
