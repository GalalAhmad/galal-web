'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowLeft, Sparkles } from 'lucide-react';

const initialArticles = [
  {
    title: 'السلوك رسالة قبل أن يكون مشكلة: مدخل لفهم أفعال الأبناء واليافعين',
    category: 'التربية واليافعين',
    categoryColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    excerpt: 'كيف ننتقل من محاولة إيقاف السلوك الظاهر فوراً بالزجر إلى فك شفرة الدافع الكامن وراءه، وبناء العلاقة أولاً قبل طلب التغيير.',
    readTime: '4 دقائق',
    slug: 'behavior-is-a-message'
  },
  {
    title: 'أقومية القرآن في فقه العلاقات الزوجية والبيوت الآمنة',
    category: 'مشروع أقومية القرآن',
    categoryColor: 'bg-accent-500/10 text-accent-500 border-accent-500/20',
    excerpt: 'تأملات في الفطرة والوحي لإعادة ترميم المودة وتجاوز صراعات التوقعات غير الواقعية في ميثاق الزواج الغليظ.',
    readTime: '6 دقائق',
    slug: 'quranic-marital-harmony'
  },
  {
    title: 'من ردود الفعل إلى الوعي: ثلاثية الاتزان الانفعالي وبصيرة الذات',
    category: 'الاتزان النفسي',
    categoryColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    excerpt: 'خطوات عملية في إدارة الانفعالات وتجاوز دوائر التوتر عبر الفهم وبناء المسؤولية الذاتية في مواجهة الأزمات اليومية.',
    readTime: '5 دقائق',
    slug: 'from-reactions-to-awareness'
  }
];

export default function ArticlesSection() {
  return (
    <section id="articles" className="py-20 px-4 sm:px-6 bg-[#0D1117] dark:bg-[#0D1117] bg-[#F8FAFC] border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 transition-colors">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* ترويسة القسم */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 text-right">
            <span className="text-xs font-bold text-accent-500 uppercase tracking-wider block">
              المكتبة المعرفية وأقومية القرآن
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-100 dark:text-slate-100 text-slate-900 tracking-normal">
              كتابات وأوراق في الوعي والتربية
            </h2>
            <p className="text-slate-400 dark:text-slate-400 text-slate-600 text-xs sm:text-sm">
              مقالات وأدلة عملية لتأصيل الفهم النفسي وتصحيح المفاهيم وفق الفطرة والوحي
            </p>
          </div>

          <div className="text-right sm:text-left">
            <span className="text-xs font-semibold text-slate-500">
              محتوى يتجدد بانتظام
            </span>
          </div>
        </div>

        {/* شبكة المقالات المتماثلة هندسياً (Strict Symmetry) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialArticles.map((article, idx) => (
            <article 
              key={idx}
              className="h-full flex flex-col justify-between p-7 rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 hover:border-slate-700 dark:hover:border-slate-700 hover:border-slate-300 transition-all shadow-sm hover:shadow-md text-right group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] border ${article.categoryColor}`}>
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100 dark:text-slate-100 text-slate-900 leading-relaxed group-hover:text-accent-500 transition-colors">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal min-h-[55px]">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/60 dark:border-slate-800/60 border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-accent-500 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>قراءة المقال</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </span>
                <BookOpen className="w-4 h-4 text-slate-500" />
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
