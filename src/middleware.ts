import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decryptSession } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  // 1. Enforce canonical www.smdmedicare.in domain and HTTPS (301 Permanent Redirect)
  if (host === 'smdmedicare.in' || (proto === 'http' && host.includes('smdmedicare.in'))) {
    return NextResponse.redirect(`https://www.smdmedicare.in${pathname}${search}`, 301);
  }

  // 2. If accessing /admin but not /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await decryptSession(sessionCookie.value);
    if (!payload) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 3. If accessing /api/admin
  if (pathname.startsWith('/api/admin')) {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 401 });
    }

    const payload = await decryptSession(sessionCookie.value);
    if (!payload) {
        return NextResponse.json({ success: false, message: 'Invalid or expired session' }, { status: 401 });
    }
  }

  // 4. If already logged in and trying to access login page, redirect to dashboard
  if (pathname === '/admin/login') {
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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon-*.png, apple-icon.png
     */
    '/((?!_next/static|_next/image|favicon.ico|icon-|apple-icon).*)',
  ],
};
