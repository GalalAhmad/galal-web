import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { siteConfig } from '@/data/siteConfig';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.galalahmad.com'),
  title: 'جلال أحمد | إرشاد أسري وزواجي وتربوي بالرفق',
  description: `احجز جلستك الاستشارية أونلاين مع المستشار جلال أحمد (${siteConfig.officialTitle} — ${siteConfig.scfhsClassification}). استشارات نفسية فردية، إرشاد أسري وزواجي، وتربية بالرفق نلتزم فيها بالسرية المهنية عبر Google Meet.`,
  authors: [{ name: 'جلال أحمد', url: 'https://www.galalahmad.com' }],
  openGraph: {
    title: 'جلال أحمد | إرشاد أسري وزواجي وتربوي بالرفق',
    description: `استشارات نفسية وزوجية وتربوية أونلاين نلتزم فيها بالسرية المهنية مع المستشار جلال أحمد (${siteConfig.officialTitle}).`,
    url: 'https://www.galalahmad.com',
    siteName: 'جلال أحمد',
    images: [
      {
        url: '/assets/dr-galal-speaking.jpg',
        width: 1200,
        height: 630,
        alt: 'جلال أحمد — استشارات وبناء الإنسان والأسرة',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'جلال أحمد | إرشاد أسري وزواجي وتربوي بالرفق',
    description: `استشارات نفسية وزوجية وتربوية أونلاين نلتزم فيها بالسرية المهنية مع المستشار جلال أحمد (${siteConfig.officialTitle}).`,
    images: ['/assets/dr-galal-speaking.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'جلال أحمد | Galal Ahmad',
  jobTitle: siteConfig.officialTitle,
  url: 'https://www.galalahmad.com',
  image: 'https://www.galalahmad.com/assets/dr-galal-speaking.jpg',
  description: 'إرشاد أسري وزواجي وتربوي بالرفق، وتأهيل المقبلين على الزواج، وتطوير المؤسسات التعليمية.',
  telephone: siteConfig.phone,
  email: siteConfig.email,
  sameAs: siteConfig.socialLinks.map((s) => s.url),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'خدمات الاستشارات والبرامج',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'استشارات نفسية فردية' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'استشارات زوجية وأسرية' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'إرشاد والدي وتربوي' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'علاج وتأهيل المراهقين' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'تطوير المعلمين والمؤسسات التعليمية' } },
    ],
  },
};

import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" sizes="64x64" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#081422" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="جلال أحمد" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('galal_theme') || 'light';
                if (saved === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased selection:bg-accent-500 selection:text-white">
        <ThemeProvider>
          {children}
          <FloatingWhatsApp />
          <PWAInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
