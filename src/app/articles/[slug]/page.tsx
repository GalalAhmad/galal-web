import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  initialArticles, 
  ArticleItem 
} from '@/data/articles';
import NewsletterLeadMagnet from '@/components/NewsletterLeadMagnet';
import { 
  Clock, 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  BookOpen, 
  Star, 
  Eye, 
  MessageSquare,
  Sparkles,
  Quote,
  ChevronRight
} from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

// 1. Static Generation for all articles
export async function generateStaticParams() {
  return initialArticles.map((article) => ({
    slug: article.id,
  }));
}

// 2. Server-side Dynamic Metadata for SEO & Googlebot
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = initialArticles.find((a) => a.id === params.slug);

  if (!article) {
    return {
      title: 'المقال غير موجود | جلال أحمد',
    };
  }

  return {
    title: `${article.title} | جلال أحمد`,
    description: article.summary,
    authors: [{ name: article.author, url: 'https://galalahmad.com' }],
    openGraph: {
      title: `${article.title} | جلال أحمد`,
      description: article.summary,
      url: `https://galalahmad.com/articles/${article.id}`,
      type: 'article',
      publishedTime: article.publishDate,
      authors: [article.author],
      tags: [article.categoryLabel, 'استشارات نفسية', 'تربية واعية', 'جلال أحمد'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
    },
    alternates: {
      canonical: `https://galalahmad.com/articles/${article.id}`,
    },
  };
}

export default function SingleArticlePage({ params }: Props) {
  const article = initialArticles.find((a) => a.id === params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = initialArticles.filter(
    (a) => a.id !== article.id && (article.relatedArticleIds?.includes(a.id) || a.category === article.category)
  ).slice(0, 2);

  // Article JSON-LD Schema
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    author: {
      '@type': 'Person',
      name: article.author,
      url: 'https://galalahmad.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'جلال أحمد',
      logo: {
        '@type': 'ImageObject',
        url: 'https://galalahmad.com/assets/logo.png',
      },
    },
    datePublished: article.publishDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://galalahmad.com/articles/${article.id}`,
    },
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFCFA] dark:bg-[#0D1117] text-slate-900 dark:text-slate-100 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Navbar />

      {/* Breadcrumb Navigation */}
      <nav className="border-b border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-black/20 text-xs py-3.5 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-[#4E7E76] transition">الرئيسية</Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          <Link href="/articles" className="hover:text-[#4E7E76] transition">مقالات</Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-[240px] sm:max-w-md">
            {article.title}
          </span>
        </div>
      </nav>

      {/* Article Header & Main Content */}
      <article className="py-12 sm:py-16 px-4 sm:px-6 flex-1">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* Header Info */}
          <header className="space-y-5 text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FEF9EC] dark:bg-[#2E2413] border border-[#FDF0CD] dark:border-[#4D3A1B] text-xs font-bold text-[#D97706] dark:text-[#F59E0B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{article.categoryLabel}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-[1.3] tracking-tight">
              {article.title}
            </h1>

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 pb-4 border-b border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                  <User className="w-3.5 h-3.5 text-[#4E7E76]" />
                  <span>{article.author}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{article.publishDate}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readTime}</span>
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{article.readersCount.toLocaleString('ar-EG')} قارئ</span>
                </span>
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{article.rating}</span>
                </span>
              </div>
            </div>

            {/* Summary Lead */}
            <p className="text-base sm:text-lg font-medium text-slate-700 dark:text-slate-200 leading-relaxed bg-[#EDF7F5]/50 dark:bg-[#112924]/30 p-5 rounded-2xl border border-[#D6EEEA] dark:border-[#1F4A42]">
              {article.summary}
            </p>
          </header>

          {/* Quranic & Prophetic Foundation (if available) */}
          {article.quranFoundation && (
            <section className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#FEF9EC] to-white dark:from-[#2E2413]/40 dark:to-[#161F2B] border border-[#FDF0CD] dark:border-[#4D3A1B] space-y-4 text-right shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-black text-[#D97706] uppercase tracking-wider">
                <Quote className="w-4 h-4" />
                <span>المرتكز القرآني والتأصيلي</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-relaxed font-serif">
                {article.quranFoundation.ayah}
                <span className="block text-xs font-normal text-slate-500 mt-1">[{article.quranFoundation.surah}]</span>
              </div>
              <div className="space-y-2 pt-2 border-t border-amber-200/60 dark:border-amber-800/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                <p><strong>من لطائف التفسير:</strong> {article.quranFoundation.tafseer}</p>
                <p><strong>البصيرة التربوية:</strong> {article.quranFoundation.insight}</p>
                <p><strong>التكامل النفسي الحديث:</strong> {article.quranFoundation.scientificCorrelation}</p>
              </div>
            </section>
          )}

          {/* Article Body Paragraphs */}
          <section className="space-y-6 text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-[2] font-normal text-right">
            {article.content.map((p, idx) => (
              <p key={idx} className="tracking-wide">
                {p}
              </p>
            ))}
          </section>

          {/* Action & Sharing Bar */}
          <div className="pt-6 pb-6 border-y border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#4E7E76] hover:text-[#3D655E] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>العودة لكافة المقالات</span>
            </Link>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${article.title} - بقلم جلال أحمد\nhttps://galalahmad.com/articles/${article.id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>مشاركة المقال عبر واتساب</span>
            </a>
          </div>

          {/* Lead Magnet Opt-in */}
          <NewsletterLeadMagnet source={`article_${article.id}`} className="my-8" />

          {/* Comments Section */}
          <section className="space-y-6 text-right">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#4E7E76]" />
                <span>التعليقات والمشاركات ({article.comments.length})</span>
              </h2>
            </div>

            <div className="space-y-3.5">
              {article.comments.map((cm) => (
                <div
                  key={cm.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{cm.authorName}</span>
                    <span className="text-slate-400 font-normal">{cm.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {cm.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="space-y-6 pt-6 border-t border-slate-200/80 dark:border-slate-800 text-right">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                مقالات ذات صلة
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/articles/${rel.id}`}
                    className="p-5 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 hover:border-[#4E7E76] space-y-2 transition shadow-2xs group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-[#D97706]">{rel.categoryLabel}</span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#4E7E76] transition line-clamp-2">
                        {rel.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>{rel.readTime}</span>
                      <span className="text-[#4E7E76] font-bold group-hover:underline">اقرأ المقال ←</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </article>

      <Footer />
    </main>
  );
}
