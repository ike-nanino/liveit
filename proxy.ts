import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES  = ['/sign-in', '/sign-up', '/forgot-password'];
const PROTECTED_ROOT = '/dashboard';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow these through
  if (
    pathname.startsWith('/_next')   ||
    pathname.startsWith('/api')     ||
    pathname.startsWith('/images')  ||
    pathname.startsWith('/icons')   ||
    pathname.startsWith('/fonts')   ||
    pathname === '/favicon.ico'     ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const session       = req.cookies.get('session')?.value;
  const isPublicRoute = PUBLIC_ROUTES.some(r => pathname.startsWith(r));

  // Not logged in + protected route → sign-in
  if (!session && !isPublicRoute) {
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Logged in + public route → dashboard
  // IMPORTANT: only redirect the exact /sign-in path, not /sign-in?callbackUrl=...
  // to avoid redirect loops
  if (session && isPublicRoute && !req.nextUrl.searchParams.get('callbackUrl')) {
    const url = req.nextUrl.clone();
    url.pathname = PROTECTED_ROOT;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};