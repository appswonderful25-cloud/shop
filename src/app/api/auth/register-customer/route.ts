import { NextResponse } from 'next/server';
import { getStrapiBaseUrl } from '@/lib/api-config';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 });
    return true;
  }
  if (record.count >= 5) return false;
  record.count++;
  return true;
}

function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) return { valid: false, error: 'Password must be at least 8 characters' };
  if (!/[A-Z]/.test(password)) return { valid: false, error: 'Must contain an uppercase letter' };
  if (!/[a-z]/.test(password)) return { valid: false, error: 'Must contain a lowercase letter' };
  if (!/[0-9]/.test(password)) return { valid: false, error: 'Must contain a number' };
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return { valid: false, error: 'Must contain a special character' };
  return { valid: true };
}

export async function POST(request: Request) {
  try {
    const { username, email, password, fullName, phoneNumber } = await request.json();

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Username, email, and password are required' }, { status: 400 });
    }

    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) {
      return NextResponse.json({ error: pwCheck.error }, { status: 400 });
    }

    // Register with Strapi, flagging as customer registration
    const strapiRes = await fetch(getStrapiBaseUrl('/api/auth/local/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email: email.toLowerCase(), password, fullName, phoneNumber, _customerRegister: true }),
    });

    const data = await strapiRes.json();

    if (!strapiRes.ok) {
      const msg = data.error?.message || 'Registration failed';
      if (msg.includes('email')) return NextResponse.json({ error: 'Email is already taken' }, { status: 400 });
      if (msg.includes('username')) return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
      return NextResponse.json({ error: msg }, { status: strapiRes.status });
    }

    return NextResponse.json({ ok: true, message: 'Account created. Please login.' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
