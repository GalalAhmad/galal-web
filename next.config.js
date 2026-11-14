const { withSentryConfig } = require("@sentry/nextjs/config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  async redirects() {
    return [
      {
        source: '/courses/rifq-mithaq',
        destination: '/courses/family/mithaq',
        permanent: true,
      },
      {
        source: '/courses/rifq-premarital',
        destination: '/courses/family/premarital',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'galalahmad.com',
          },
        ],
        destination: 'https://www.galalahmad.com/:path*',
        permanent: true, // HTTP 301 Permanent Redirect
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'galal-web.vercel.app',
          },
        ],
        destination: 'https://www.galalahmad.com/:path*',
        permanent: true, // HTTP 301 Permanent Redirect from Vercel staging
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'galal-web.vercel.app',
          },
        ],
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
      {
        source: '/counselor/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
    ];
  },
};

module.exports = withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: process.env.SENTRY_ORG || "rifq-2w",
    project: process.env.SENTRY_PROJECT || "galal-web",
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: "/monitoring",
    hideSourceMaps: true,
    disableLogger: true,
  }
);
