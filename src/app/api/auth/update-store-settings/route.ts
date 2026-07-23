import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import { getStrapiBaseUrl, API_ENDPOINTS } from '@/lib/api-config';

const AI_FIELDS = ['aiApiKey', 'aiModel', 'aiMaxTokens', 'aiTemperature', 'aiEnabled'];

export async function PUT(request: Request) {
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value || '';
    if(!token){
        return NextResponse.json({error:'Token is missing'},{status:400});
    }

    // Check if trying to update AI fields
    const data = body?.data || body;
    const hasAiFields = AI_FIELDS.some(field => data && field in data);
    
    if (hasAiFields) {
        // Verify user is admin
        try {
            const userRes = await fetch(getStrapiBaseUrl('/api/users/me?populate=role'), {
                headers: { Authorization: `Bearer ${token}` },
            });
            const user = await userRes.json();
            if (user?.role?.name !== 'admin') {
                return NextResponse.json({error:'Only admins can update AI settings'},{status:403});
            }
        } catch {
            return NextResponse.json({error:'Failed to verify admin status'},{status:500});
        }
    }

    try{
        const response = await fetch(getStrapiBaseUrl(API_ENDPOINTS.STORE_SETTINGS.ME),{
            method:'PUT',
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json',
            },
            body:JSON.stringify(body),
        });
        const data = await response.json();
        return NextResponse.json({ok:true,user:data});
        
    }
    catch(e:any){
        return NextResponse.json({error:e.message},{status:500});
    }
    
}