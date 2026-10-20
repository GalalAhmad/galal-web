import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة | جلال أحمد',
  description: 'إجابات شاملة ومباشرة عن الاستشارات النفسية والزوجية والتربوية، طريقة عقد الجلسات أونلاين عبر Google Meet، سياسات الإلغاء والجدولة، والخصوصية والسرية التامة مع المستشار جلال أحمد.',
  openGraph: {
    title: 'الأسئلة الشائعة | جلال أحمد',
    description: 'كل ما تحتاج معرفته عن طريقة حجز الجلسات والاستشارات وسياسات المواعيد والسرية.',
    url: 'https://galalahmad.com/faq',
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
