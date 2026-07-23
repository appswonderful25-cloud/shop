import {cookies} from 'next/headers';
import {NextResponse} from 'next/server';
import { getStrapiBaseUrl, API_ENDPOINTS } from '@/lib/api-config';

export async function GET(request:Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value || '';
    if(!token){
        return NextResponse.json({error:'Token is missing'},{status:400});
    }
    try{
        const response = await fetch(getStrapiBaseUrl(API_ENDPOINTS.STORE_SETTINGS.ME),{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json',
            },
        });
        const data = await response.json();
        return NextResponse.json({ok:true,user:data});

    }catch(e:any){
        return NextResponse.json({error:e.message},{status:500});
    } 
}