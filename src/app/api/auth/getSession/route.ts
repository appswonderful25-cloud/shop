import {NextRequest,NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import { getStrapiBaseUrl, API_ENDPOINTS } from '@/lib/api-config';

export async function GET(request:NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value || '';
    if(!token){
        return NextResponse.json({error:'Token is missing'},{status:400});
    }
    const response = await fetch(getStrapiBaseUrl(API_ENDPOINTS.AUTH.PROTECTED_TEST),{
        method:'GET',
        headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type':'application/json',
        },
    })
    const data = await response.json();
    
    if(!data){
        return NextResponse.json({error:'No data found'},{status:400});
    }
    return NextResponse.json(data);
}
