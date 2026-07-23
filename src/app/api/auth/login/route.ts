import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { detect, getOS } from 'get-browser';
import { getGeoLocation, getCountry, getCity } from "@slynhq/geo";
import { lookupIp } from "quick-geocode";
import { getStrapiBaseUrl, API_ENDPOINTS } from '@/lib/api-config';

// Simple in-memory rate limiting (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 minutes
    return true;
  }

  if (record.count >= 5) {
    return false; // Rate limited
  }

  record.count++;
  return true;
}

function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character' };
  }
  return { valid: true };
}

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();

    // Basic input validation
    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Identifier and password are required' },
        { status: 400 },
      );
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? request.headers.get('x-real-ip') ?? 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 },
      );
    }

    const strapiResponse = await fetch(getStrapiBaseUrl(API_ENDPOINTS.AUTH.LOGIN), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await strapiResponse.json();


    if (!strapiResponse.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Login failed' },
        { status: strapiResponse.status },
      );
    }

    // Fetch user with role to determine redirect destination
    let userRole = '';
    try {
      const userRes = await fetch(`${getStrapiBaseUrl('/api/users/me')}?populate=role`, {
        headers: { Authorization: `Bearer ${data.jwt}` },
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        userRole = userData?.role?.type || '';
      }
    } catch {}

    const cookieStore = await cookies();
    const userAgent = request.headers.get('user-agent') ?? '';
    const browser = detect({ userAgent });
    const os = getOS({ userAgent });
    const country = request.headers.get('cf-ipcountry') ?? '';
    const city = request.headers.get('cf-ipcity') ?? '';

  const device = userAgent.includes('Mobile') ? 'Mobile': userAgent.includes('Tablet') ? 'Tablet' : 'Desktop';



    try {
      const response = await fetch(getStrapiBaseUrl(API_ENDPOINTS.AUTH.CREATE_SESSION), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.jwt}`,
        },
        body: JSON.stringify({
          identifier,
          password,
          os,
          device,
          browser,
          country,
          city,
          ip,
        }),
      });
      const data2 = await response.json();


      cookieStore.set('accessToken', data2.accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/',
      });
      cookieStore.set('id',data.user.id,{
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/',
      })



    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, user: data.user, role: userRole });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
