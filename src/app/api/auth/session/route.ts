import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getStrapiBaseUrl } from '@/lib/api-config';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value || '';
  const id = cookieStore.get('id')?.value || '';

  if (!token) {
    return NextResponse.json({ token: null, userId: null, user: null });
  }

  try {
    const res = await fetch(`${getStrapiBaseUrl('/api/users/me')}?populate=role`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      return NextResponse.json({ token, userId: id ? Number(id) : null, user: null });
    }
    const user = await res.json();
    return NextResponse.json({ token, userId: user.id, user });
  } catch {
    return NextResponse.json({ token, userId: id ? Number(id) : null, user: null });
  }
}
