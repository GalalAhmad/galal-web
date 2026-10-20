import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تواصل معنا | جلال أحمد',
  description: 'قنوات التواصل المباشر مع المستشار جلال أحمد لتنسيق الاستشارات النفسية والزوجية والتربوية، واستشارات المؤسسات وتطوير المدارس والبرامج التدريبية.',
  openGraph: {
    title: 'تواصل معنا | جلال أحمد',
    description: 'تواصل مباشر لتنسيق الاستشارات والشراكات والبرامج التأهيلية عبر البريد والواتساب الرسمي.',
    url: 'https://galalahmad.com/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
