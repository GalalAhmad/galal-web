/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
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
    ];
  },
};

export default nextConfig;
