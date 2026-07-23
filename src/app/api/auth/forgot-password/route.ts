import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { getStrapiBaseUrl, getStrapiUrl, API_ENDPOINTS } from '@/lib/api-config';

// Rate limiting for forgot password
const forgotPasswordRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkForgotPasswordRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = forgotPasswordRateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    forgotPasswordRateLimitMap.set(ip, { count: 1, resetTime: now + 30 * 60 * 1000 }); // 30 minutes
    return true;
  }

  if (record.count >= 3) {
    return false; // Rate limited
  }

  record.count++;
  return true;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? request.headers.get('x-real-ip') ?? 'unknown';
    if (!checkForgotPasswordRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many password reset attempts. Please try again later.' },
        { status: 429 },
      );
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const checkUser = await fetch(getStrapiUrl(API_ENDPOINTS.USERS.FILTERS(`filters[email][$eq]=${encodeURIComponent(email.toLowerCase())}`)));
    const userResult = await checkUser.json();

    if (!userResult || userResult.length === 0) {
      // Return success even if user not found to prevent email enumeration
      return NextResponse.json({ ok: true, message: 'If the email exists, a reset code will be sent' });
    }

    const strapiResponse = await fetch(getStrapiBaseUrl(API_ENDPOINTS.AUTH.FORGOT_PASSWORD), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.toLowerCase() }),
    });

    if (!strapiResponse.ok) {
      return NextResponse.json({ error: 'Failed to send reset code' }, { status: strapiResponse.status });
    }

    const secureToken = crypto.randomBytes(32).toString('hex');
    const cookieStore = await cookies();
     cookieStore.set('allow_otp_access', secureToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 120,
      path: '/',
    });

    return NextResponse.json({ ok: true, message: 'Reset code sent successfully' });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
