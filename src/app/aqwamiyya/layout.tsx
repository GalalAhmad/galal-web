import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مشروع أقومية القرآن في التربية | جـلال أحـمد',
  description: 'الوثيقة الشاملة لمشروع أقومية القرآن في التربية: من السلوك الظاهر إلى فهم الجذور وبناء الإنسان. تأصيل إبستمولوجي يرى الإنسان في كليته ويجعل الوحي مرجعية أصيلة.',
  openGraph: {
    title: 'مشروع أقومية القرآن في التربية | جـلال أحـمد',
    description: 'الوثيقة المنهجية الكاملة لمشروع أقومية القرآن: الطبقات المعرفية الست، المبادئ الحاكمة الثمانية، ونموذج التحليل في 9 خطوات.',
    url: 'https://galalahmad.com/aqwamiyya',
  },
};

export default function AqwamiyyaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
