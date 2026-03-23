import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE_NAME } from './lib/constants';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (isTokenExpired(token)) {
    return NextResponse.redirect(new URL('/auth?expired=true', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|auth|monitor/report).*)'],
};
