import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getStrapiBaseUrl, API_ENDPOINTS } from '@/lib/api-config';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { dataToUpdate } = body;
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value || '';
    const id = cookieStore.get('id')?.value || '';

    if (!id || !token) {
      return NextResponse.json({ error: 'token is missing or id is missing' }, { status: 400 });
    }

    const strapiResponse = await fetch(getStrapiBaseUrl(API_ENDPOINTS.USERS.BY_ID(id)), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToUpdate), 
    });

    const strapiData = await strapiResponse.json();

    if (!strapiResponse.ok) {
      return NextResponse.json({ error: strapiData.error || 'strapi error' }, { status: strapiResponse.status });
    }

   
    return NextResponse.json({ ok: true, user: strapiData }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
