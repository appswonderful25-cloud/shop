import {cookies} from 'next/headers';
import {NextResponse} from 'next/server';
import { getStrapiBaseUrl, API_ENDPOINTS } from '@/lib/api-config';

function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character' };
  }
  return { valid: true };
}

export async function POST(request: Request) {
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value || '';
    if(!token){
        return NextResponse.json({error:'Token is missing'},{status:400});
    }

    // Validate new password
    if (body.password) {
      const passwordValidation = validatePassword(body.password);
      if (!passwordValidation.valid) {
        return NextResponse.json({error: passwordValidation.error},{status:400});
      }
    }

    // Validate password confirmation
    if (body.password !== body.passwordConfirmation) {
      return NextResponse.json({error: 'Passwords do not match'},{status:400});
    }

    if (!body.currentPassword) {
      return NextResponse.json({error: 'Current password is required'},{status:400});
    }

    try{
        const response = await fetch(getStrapiBaseUrl(API_ENDPOINTS.AUTH.CHANGE_PASSWORD),{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`,
            },
            body:JSON.stringify(body),
        });
        if(!response.ok){
            return NextResponse.json({error:await response.json()},{status:response.status});
        }
        return NextResponse.json({ok:true,message:'Password changed successfully'});
    }
    catch(e:any){
        return NextResponse.json(e.message,{status:500});
    }
}