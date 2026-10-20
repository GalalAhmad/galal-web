import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مرئيات | جلال أحمد',
  description: 'مكتبة مرئية شاملة تضم حلقات ومحاضرات المستشار جلال أحمد في علم النفس التربوي، بناء الأسرة، مشروع أقومية القرآن، وفك شفرات السلوك الإنساني.',
  openGraph: {
    title: 'مرئيات | جلال أحمد',
    description: 'شاهد واستمع إلى رؤى وتطبيقات تربوية ونفسية عملية مسجلة بأعلى جودة.',
    url: 'https://galalahmad.com/videos',
  },
};

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
