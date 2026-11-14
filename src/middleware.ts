import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes requiring strict per-request nonce injection (authenticated / sensitive surfaces)
const AUTHENTICATED_PREFIXES = ['/admin', '/counselor', '/profile'];

function isAuthenticatedOrManagementPath(pathname: string): boolean {
  return AUTHENTICATED_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isDev = process.env.NODE_ENV !== 'production';
  const isProtected = isAuthenticatedOrManagementPath(pathname);

  const requestHeaders = new Headers(request.headers);
  let cspHeader = '';

  if (isProtected) {
    // 1. Authenticated & Management Surfaces:
    // Generate a per-request cryptographically random nonce and enforce strict-dynamic
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    requestHeaders.set('x-nonce', nonce);

    const scriptDirectives = isDev
      ? `'self' 'unsafe-eval' 'unsafe-inline' 'nonce-${nonce}'`
      : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

    cspHeader = `
      default-src 'self';
      script-src ${scriptDirectives};
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' blob: data: https:;
      font-src 'self' https://fonts.gstatic.com data:;
      connect-src 'self' https://*.supabase.co https://*.sentry.io https://sentry.io;
      frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
      frame-ancestors 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s{2,}/g, ' ').trim();
  } else {
    // 2. Public Static Surfaces:
    // Preserve SSG / ISR and Edge CDN caching by omitting per-request nonces.
    // Static CSP protects public pages while avoiding dynamic de-optimization.
    const scriptDirectives = isDev
      ? `'self' 'unsafe-eval' 'unsafe-inline'`
      : `'self' 'unsafe-inline'`;

    cspHeader = `
      default-src 'self';
      script-src ${scriptDirectives};
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' blob: data: https:;
      font-src 'self' https://fonts.gstatic.com data:;
      connect-src 'self' https://*.supabase.co https://*.sentry.io https://sentry.io;
      frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
      frame-ancestors 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s{2,}/g, ' ').trim();
  }

  // Handle Host header for staging indexing protection
  const host = request.headers.get('host') || '';
  const isVercelStaging = host === 'galal-web.vercel.app';

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Content-Security-Policy', cspHeader);

  // Prevent caching on authenticated responses
  if (isProtected) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  if (isVercelStaging) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
