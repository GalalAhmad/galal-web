import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { allTestsData } from '@/data/testsData';
import { SCIENTIFIC_TESTS_METADATA } from '@/data/scientificTestsMetadata';
import SingleTestClient from './SingleTestClient';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const sensitiveTestIds = ['depression', 'bipolar-disorder-test', 'schizophrenia-assessment', 'ptsd'];

// 1. Static Generation for all 41 Tests
export async function generateStaticParams() {
  return allTestsData.map((test) => ({
    slug: test.id,
  }));
}

// 2. Server-side Metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const test = allTestsData.find((t) => t.id === slug);
  const meta = SCIENTIFIC_TESTS_METADATA[slug];

  if (!test) {
    return {
      title: 'المقياس غير موجود | جلال أحمد',
    };
  }

  const toolCode = meta?.code ? ` (${meta.code})` : '';

  return {
    title: `${test.title}${toolCode} - مقياس معتمد | جلال أحمد`,
    description: meta?.clinicalPurpose || test.desc,
    keywords: [test.title, test.category, meta?.code || '', 'مقياس إكلينيكي', 'جلال أحمد'],
    openGraph: {
      title: `${test.title}${toolCode} | مقاييس واختبارات جلال أحمد`,
      description: meta?.clinicalPurpose || test.desc,
      url: `https://galalahmad.com/tests/${test.id}`,
      type: 'website',
    },
    alternates: {
      canonical: `https://galalahmad.com/tests/${test.id}`,
    },
  };
}

export default async function SingleTestPage({ params }: Props) {
  const { slug } = await params;
  const test = allTestsData.find((t) => t.id === slug);

  if (!test) {
    notFound();
  }

  const meta = SCIENTIFIC_TESTS_METADATA[slug];
  const isSensitive = sensitiveTestIds.includes(test.id);

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#0C111C] text-slate-800 dark:text-slate-100 flex flex-col justify-between antialiased">
      <Navbar />
      <SingleTestClient test={test} toolBadge={meta?.code} isSensitive={isSensitive} />
      <Footer />
    </div>
  );
}
