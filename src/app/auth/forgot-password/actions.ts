'use server';

import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function setSecureOtpCookie() {
  const cookieStore = await cookies();
  const secureToken = crypto.randomBytes(32).toString('hex');

  cookieStore.set('allow_otp_access', secureToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 120,
    path: '/',
  });
}
