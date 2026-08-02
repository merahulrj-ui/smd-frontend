import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // If accessing /admin but not /admin/login
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    // Check for our secure cookie
    const sessionCookie = request.cookies.get('admin_session');
    
    if (!sessionCookie) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // If already logged in and trying to access login page, redirect to dashboard
  if (request.nextUrl.pathname === '/admin/login') {
    const sessionCookie = request.cookies.get('admin_session');
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
