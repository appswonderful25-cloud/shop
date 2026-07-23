import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getStrapiBaseUrl } from '@/lib/api-config';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value || '';
    const id = cookieStore.get('id')?.value || '';

    if (!token || !id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const strapiRes = await fetch(getStrapiBaseUrl(`/api/users/${id}`), {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await strapiRes.json();

    if (!strapiRes.ok) {
      return NextResponse.json({ error: data.error?.message || 'Update failed' }, { status: strapiRes.status });
    }

    const { password, resetPasswordToken, confirmationToken, ...safeUser } = data;
    return NextResponse.json({ ok: true, user: safeUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value || '';
    const id = cookieStore.get('id')?.value || '';

    if (!token || !id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const strapiRes = await fetch(getStrapiBaseUrl(`/api/users/${id}?populate=role`), {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await strapiRes.json();

    if (!strapiRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: strapiRes.status });
    }

    const { password, resetPasswordToken, confirmationToken, ...safeUser } = data;
    return NextResponse.json({ ok: true, user: safeUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
