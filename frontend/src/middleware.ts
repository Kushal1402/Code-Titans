import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/signup' || path === '/';
  const token = request.cookies.get('token')?.value || '';

  // If user is not logged in and trying to access protected route
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is logged in and trying to access auth pages (login/signup)
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/add-question',
    '/login',
    '/signup',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 