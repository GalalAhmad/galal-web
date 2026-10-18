import React from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowLeft } from 'lucide-react';

const initialArticles = [
  {
    title: 'السلوك رسالة قبل أن يكون مشكلة: مدخل لفهم أفعال الأبناء',
    category: 'التربية واليافعين',
    categoryColor: 'bg-sage-50 text-sage-600',
    excerpt: 'كيف ننتقل من محاولة إيقاف السلوك الظاهر فوراً إلى فهم الدافع الكامن وراءه، وبناء العلاقة أولاً قبل طلب التغيير.',
    readTime: '4 دقائق',
    slug: 'behavior-is-a-message'
  },
  {
    title: 'أقومية القرآن في فقه العلاقات الزوجية والبيوت الآمنة',
    category: 'مشروع أقومية القرآن',
    categoryColor: 'bg-brand-50 text-brand-800',
    excerpt: 'تأملات في الفطرة والوحي لإعادة ترميم المودة وتجاوز صراعات التوقعات غير الواقعية في ميثاق الزواج الغليظ.',
    readTime: '6 دقائق',
    slug: 'quranic-marital-harmony'
  },
  {
    title: 'من ردود الفعل إلى الوعي: ثلاثية الاتزان الانفعالي',
    category: 'الاتزان النفسي',
    categoryColor: 'bg-accent-50 text-accent-500',
    excerpt: 'خطوات عملية في إدارة الانفعالات وتجاوز دوائر التوتر عبر الفهم وبناء المسؤولية الذاتية في مواجهة الأزمات.',
    readTime: '5 دقائق',
    slug: 'from-reactions-to-awareness'
  }
];

export default function ArticlesSection() {
  return (
    <section id="articles" className="py-20 px-4 sm:px-6 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* ترويسة القسم */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 text-right">
            <span className="text-xs font-bold text-sage-600 uppercase tracking-wider">
              المكتبة المعرفية
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-800">
              كتابات وأوراق في الوعي والتربية
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              مقالات وأدلة عملية لتأصيل الفهم وتصحيح المفاهيم
            </p>
          </div>

          <div className="text-right sm:text-left">
            <span className="text-xs font-semibold text-slate-400">
              محتوى يتجدد بانتظام
            </span>
          </div>
        </div>

        {/* شبكة المقالات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialArticles.map((article, idx) => (
            <article 
              key={idx}
              className="p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between space-y-5 shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${article.categoryColor}`}>
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-brand-800 leading-snug hover:text-accent-500 transition">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-brand-800 flex items-center gap-1">
                  <span>قراءة المقال</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </span>
                <BookOpen className="w-4 h-4 text-slate-300" />
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
