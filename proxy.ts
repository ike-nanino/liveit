// proxy.ts
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES  = [
  '/',
  '/sign-in',
  '/sign-up',
  '/forgot-password',
];

const PROTECTED_ROOT = '/dashboard';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
  const isPublicRoute = PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(`${r}/`));

  if (!session && !isPublicRoute) {
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (session && isPublicRoute && pathname !== '/' && !req.nextUrl.searchParams.get('callbackUrl')) {
    const url = req.nextUrl.clone();
    url.pathname = PROTECTED_ROOT;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};