import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  '/overview',
  '/products',
  '/orders',
  '/teams',
  '/wallet',
  '/coupons',
  '/returns',
  '/platform-support',
  '/messages',
  '/settings',
  '/analytics',
  '/notifications',
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/overview/:path*', '/products/:path*', '/orders/:path*', '/teams/:path*', '/wallet/:path*', '/coupons/:path*', '/returns/:path*', '/platform-support/:path*', '/messages/:path*', '/settings/:path*', '/analytics/:path*', '/notifications/:path*', '/auth/check-otp'],
};