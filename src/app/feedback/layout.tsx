import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تقييم الجلسات والاستشارات | جلال أحمد',
  description: 'شاركنا رأيك وتجربتك بعد الجلسة الاستشارية أو البرنامج التدريبي مع أ. جلال أحمد، لنسهم معاً في التطوير المستمر.',
  openGraph: {
    title: 'تقييم الجلسات والاستشارات | جلال أحمد',
    description: 'شاركنا رأيك وتجربتك بعد الجلسة الاستشارية أو البرنامج التدريبي مع أ. جلال أحمد.',
  },
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
