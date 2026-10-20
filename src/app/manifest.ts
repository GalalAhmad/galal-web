import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'جلال أحمد | استشارات وبناء الإنسان والأسرة',
    short_name: 'جلال أحمد',
    description: 'منصة الاستشارات النفسية والزوجية والتربوية وبرامج بناء الإنسان مع المستشار جلال أحمد.',
    start_url: '/',
    id: '/',
    display: 'standalone',
    dir: 'rtl',
    lang: 'ar',
    background_color: '#FAFCFA',
    theme_color: '#4E7E76',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
