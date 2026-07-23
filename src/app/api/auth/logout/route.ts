import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getStrapiBaseUrl, API_ENDPOINTS } from '@/lib/api-config';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value || '';

    // Invalidate Strapi session if token exists
    if (token) {
      try {
        await fetch(getStrapiBaseUrl('/api/logout'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        // Continue with local logout even if Strapi logout fails
        console.error('Strapi logout failed:', error);
      }
    }

    // Delete all auth cookies
    cookieStore.delete('accessToken');
    cookieStore.delete('id');
    cookieStore.delete('allow_otp_access');

    return NextResponse.json({ ok: true, message: 'Logged out successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
