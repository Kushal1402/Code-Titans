import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/signup' || path === '/' || path.includes('/question/');
  const token = request.cookies.get('token')?.value || '';

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    '/add-question',
    '/login',
    '/signup',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 