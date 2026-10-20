import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { allTestsData } from '@/data/testsData';
import SingleTestClient from './SingleTestClient';

interface Props {
  params: {
    slug: string;
  };
}

// Global/Standard Psychological Assessment Badges dictionary
const toolBadges: Record<string, string> = {
  depression: 'PHQ-9 معتمد',
  anxiety: 'GAD-7 معتمد',
  burnout: 'MBI مقياس ماسلاش',
  adhd: 'ASRS-v1.1 معتمد',
  'marital-harmony': 'DAS التوافق الزواجي',
  'toxic-relationship': 'DAS العلاقات',
  ptsd: 'PCL-5 ما بعد الصدمة',
  ocd: 'Y-BOCS مقياس ييل-براون',
  bipolar: 'MDQ ثنائي القطب',
  'social-anxiety': 'LSAS القلق الاجتماعي',
  'eating-disorders': 'EAT-26 اضطرابات الأكل',
  schizophrenia: 'BPRS الفصام',
  'children-behavior': 'CBCL سلوك الأطفال',
  'emotional-intelligence': 'TEIQue الذكاء العاطفي',
  'postpartum-depression': 'EPDS اكتئاب ما بعد الولادة',
  'imposter-syndrome': 'CIPS متلازمة المحتال',
  anger: 'STAXI إدارة الغضب',
  'childhood-trauma': 'ACE صدمات الطفولة',
  'introvert-extrovert': 'Big Five الانبساط والانطواء',
  npd: 'NPI النرجسية',
  bpd: 'MSI-BPD الحدية',
  'job-satisfaction': 'JSS الرضا الوظيفي',
  'work-life-balance': 'WLB التوازن الحياتي',
};

// Sensitive tests that require immediate emergency support warnings
const sensitiveTestIds = ['depression', 'bipolar', 'schizophrenia', 'ptsd'];

// 1. Static Generation for all 41 Tests
export async function generateStaticParams() {
  return allTestsData.map((test) => ({
    slug: test.id,
  }));
}

// 2. Server-side Metadata for SEO & Googlebot
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const test = allTestsData.find((t) => t.id === params.slug);

  if (!test) {
    return {
      title: 'المقياس غير موجود | جلال أحمد',
    };
  }

  const toolName = toolBadges[test.id] ? ` (${toolBadges[test.id]})` : '';

  return {
    title: `${test.title}${toolName} | مقاييس واختبارات جلال أحمد`,
    description: test.desc,
    keywords: [test.title, test.category, 'اختبار نفسي', 'مقياس إكلينيكي', 'جلال أحمد'],
    openGraph: {
      title: `${test.title}${toolName} | مقاييس واختبارات جلال أحمد`,
      description: test.desc,
      url: `https://galalahmad.com/tests/${test.id}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: test.title,
      description: test.desc,
    },
    alternates: {
      canonical: `https://galalahmad.com/tests/${test.id}`,
    },
  };
}

export default function SingleTestPage({ params }: Props) {
  const test = allTestsData.find((t) => t.id === params.slug);

  if (!test) {
    notFound();
  }

  const toolBadge = toolBadges[test.id];
  const isSensitive = sensitiveTestIds.includes(test.id);

  // Questionnaire JSON-LD Schema
  const testJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: test.title,
    description: test.desc,
    educationalAlignment: {
      '@type': 'AlignmentObject',
      alignmentType: 'educationalSubject',
      targetName: test.category,
    },
    provider: {
      '@type': 'Person',
      name: 'جلال أحمد',
      url: 'https://galalahmad.com',
    },
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFCFA] dark:bg-[#0D1117] text-slate-900 dark:text-slate-100 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(testJsonLd) }}
      />
      <Navbar />

      <SingleTestClient 
        test={test} 
        toolBadge={toolBadge} 
        isSensitive={isSensitive} 
      />

      <Footer />
    </main>
  );
}
