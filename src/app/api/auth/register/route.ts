import { NextResponse } from 'next/server';
import { getStrapiBaseUrl, getStrapiUrl, API_ENDPOINTS } from '@/lib/api-config';

// Simple in-memory rate limiting for registration
const registerRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRegisterRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = registerRateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    registerRateLimitMap.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 }); // 1 hour
    return true;
  }

  if (record.count >= 3) {
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

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password, fullName, phoneNumber } = body;

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? request.headers.get('x-real-ip') ?? 'unknown';
    if (!checkRegisterRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 },
      );
    }

    // Input validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 },
      );
    }

    if (!validateUsername(username)) {
      return NextResponse.json(
        { field: 'username', error: 'Username must be 3-20 characters and contain only letters, numbers, and underscores' },
        { status: 400 },
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { field: 'email', error: 'Invalid email format' },
        { status: 400 },
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { field: 'password', error: passwordValidation.error },
        { status: 400 },
      );
    }

    const emailCheck = await fetch(getStrapiUrl(API_ENDPOINTS.USERS.FILTERS(`filters[email][$eq]=${encodeURIComponent(email.toLowerCase())}`)));
    const emailResult = await emailCheck.json();
    if (emailResult && emailResult.length > 0) {
      return NextResponse.json({ field: 'email', error: 'Email is already taken' }, { status: 400 });
    }

    const usernameCheck = await fetch(getStrapiUrl(API_ENDPOINTS.USERS.FILTERS(`filters[username][$eq]=${encodeURIComponent(username)}`)));
    const usernameResult = await usernameCheck.json();
    if (usernameResult && usernameResult.length > 0) {
      return NextResponse.json({ field: 'username', error: 'Username is already taken' }, { status: 400 });
    }

    if (phoneNumber) {
      const phoneCheck = await fetch(getStrapiUrl(API_ENDPOINTS.USERS.FILTERS(`filters[phoneNumber][$eq]=${encodeURIComponent(phoneNumber)}`)));
      const phoneResult = await phoneCheck.json();
      if (phoneResult && phoneResult.length > 0) {
        return NextResponse.json({ field: 'phoneNumber', error: 'Phone number is already taken' }, { status: 400 });
      }
    }

    const strapiResponse = await fetch(getStrapiBaseUrl(API_ENDPOINTS.AUTH.REGISTER), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await strapiResponse.json();

    if (!strapiResponse.ok) {
      return NextResponse.json({ error: data.error?.message || 'Registration failed' }, { status: strapiResponse.status });
    }

    // Remove role field from user response to avoid validation issues
    const { role, ...userWithoutRole } = data.user || {};
    return NextResponse.json({ ok: true, user: userWithoutRole });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
