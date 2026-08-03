import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decryptSession } from '@/lib/session';

export async function middleware(request: NextRequest) {
  // If accessing /admin but not /admin/login
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await decryptSession(sessionCookie.value);
    if (!payload) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // If accessing /api/admin
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 401 });
    }

    const payload = await decryptSession(sessionCookie.value);
    if (!payload) {
        return NextResponse.json({ success: false, message: 'Invalid or expired session' }, { status: 401 });
    }
  }

  // If already logged in and trying to access login page, redirect to dashboard
  if (request.nextUrl.pathname === '/admin/login') {
    const sessionCookie = request.cookies.get('admin_session');
    if (sessionCookie) {
      const payload = await decryptSession(sessionCookie.value);
      if (payload) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
