import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Redirect pages.dev domain to custom domain
  if (hostname.includes('grade-flow-c9c.pages.dev')) {
    url.hostname = 'cgpacalculator.xyz';
    url.protocol = 'https:';
    url.port = '';
    return NextResponse.redirect(url, 301); // 301 Permanent Redirect
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap\\.xml|sitemaps/.*|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
