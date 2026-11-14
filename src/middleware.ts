import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Generate a cryptographically random per-request nonce (Base64)
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV !== 'production';

  // Strict CSP: In production, script-src enforces the cryptographic nonce and strict-dynamic,
  // eliminating 'unsafe-inline' for modern browsers. In dev, 'unsafe-eval' is permitted for React Fast Refresh/HMR.
  const scriptDirectives = isDev
    ? `'self' 'unsafe-eval' 'unsafe-inline' 'nonce-${nonce}' https://challenges.cloudflare.com`
    : `'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com`;

  const cspHeader = `
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

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  // Handle Host redirect or header for Vercel staging
  const host = request.headers.get('host') || '';
  const isVercelStaging = host === 'galal-web.vercel.app';

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Content-Security-Policy', cspHeader);

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
