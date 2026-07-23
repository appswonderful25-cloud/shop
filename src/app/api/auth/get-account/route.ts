import {cookies} from 'next/headers';
import {NextResponse} from 'next/server';
import { getStrapiUrl, API_ENDPOINTS } from '@/lib/api-config';

export async function GET(request:Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value || '';
    if(!token){
        return NextResponse.json({error:'Token is missing'},{status:400});
    }
    const user = await fetch(getStrapiUrl(API_ENDPOINTS.USERS.ME + '?populate=*'),{
        method:'GET',
        headers:{
            'Authorization':`Bearer ${token}`,
        },
    });
    const data = await user.json();
    if(!user.ok){
        return NextResponse.json({error:data.error},{status:400});
    }
    return NextResponse.json(data);
}