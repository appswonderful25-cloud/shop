import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { getStrapiBaseUrl, API_ENDPOINTS } from '@/lib/api-config';

export async function POST(request: Request) {
    
    const {sessionId} = await request.json();
    console.log(sessionId);
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('accessToken')?.value || '';
    if(!cookie){
      return NextResponse.json({error:'Token is missing'},{status:400});
    }
    try{
      const response = await fetch(getStrapiBaseUrl('/api/logout'),{
        method:'POST',
        headers:{
          'Authorization':`Bearer ${cookie}`,
          'Content-Type':'application/json',
        },
        body:JSON.stringify({sessionId}),
      });
      if(!response.ok){
        return NextResponse.json({error:await response.json()},{status:response.status});
      }
    
    

    return NextResponse.json({ ok: true, message: 'Logged out successfully' });
    } catch (error) {
      return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}