'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  BookOpen, 
  Sparkles, 
  ArrowLeft, 
  Video, 
  Calendar, 
  ShieldCheck, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface Faq {
  q: string;
  a: string;
  category: 'services' | 'online' | 'booking' | 'cancellation' | 'courses' | 'privacy';
}

const faqsData: Faq[] = [
  // Services
  {
    category: 'services',
    q: 'ما هي المسارات الاستشارية التي يقدمها جلال أحمد؟',
    a: 'يقدم جلال أحمد ثلاثة مسارات أساسية: الاستشارات النفسية وبصيرة الذات للأفراد، والاستشارات الزواجية والأسرية وبرامج تأهيل المقبلين على الزواج (رحلة رفق وميثاق)، والاستشارات التربوية لإرشاد الوالدين وسيكولوجيا اليافعين والمراهقين.'
  },
  {
    category: 'services',
    q: 'هل الاستشارات تقدم تشخيصاً طبياً أو وصفاً للأدوية؟',
    a: 'لا، خدماتنا استشارية وتربوية ونفسية تهدف إلى رفع الوعي وبناء الاتزان وتفكيك المشكلات السلوكية والعلائقية، وليست عيادة طبية ولا تتضمن وصفاً للأدوية أو تشخيصات إكلينيكية سريرية.'
  },
  // Online
  {
    category: 'online',
    q: 'كيف تُعقد الجلسات؟ وهل يمكنني الحضور من خارج مصر؟',
    a: 'الموقع وخدماته تعمل أونلاين فقط؛ تُعقد كافة الجلسات عبر اتصال مرئي مشفر وآمن من خلال منصة Google Meet، ويمكنك الاستفادة من الخدمة بكل أمان من أي دولة في العالم دون الحاجة للتنقل.'
  },
  {
    category: 'online',
    q: 'ماذا أحتاج قبل بدء موعد الجلسة؟',
    a: 'تحتاج فقط إلى اتصال إنترنت جيد، ومكان هادئ يضمن لك الراحة والخصوصية، واستخدام جهاز هاتف أو حاسوب مزود بكاميرا وميكروفون. سيصلك رابط الجلسة المشفر تلقائياً قبل الموعد.'
  },
  // Booking
  {
    category: 'booking',
    q: 'كيف تتم خطوات الحجز في الموقع؟',
    a: 'تبدأ بالدخول على صفحة «الحجز»، تختار مجال الاستشارة، تجيب عن استبيان تمهيدي قصير لمساعدتنا على توجيه المسار، ثم تختار اليوم والساعة المناسبة لك من جدول المواعيد، وتدخل الاسم المفضل ووسيلة اتصال واحدة لتأكيد الحجز.'
  },
  {
    category: 'booking',
    q: 'هل يتطلب الحجز الدفع الإلكتروني الآن؟',
    a: 'لا، الدفع الإلكتروني مؤجل لمرحلة لاحقة. الحجز الحالي يتيح لك تثبيت موعدك وتنسيق التفاصيل مباشرة.'
  },
  // Cancellation
  {
    category: 'cancellation',
    q: 'ما هي سياسة إعادة الجدولة أو الإلغاء؟',
    a: 'يمكن طلب إعادة جدولة الموعد أو إلغائه بالتواصل المسبق قبل 24 ساعة من موعد الجلسة تقديراً لظروفك ولتنظيم أوقات الاستشارات، وفق سياسة الحجز والإلغاء الموضحة بالموقع.'
  },
  // Courses
  {
    category: 'courses',
    q: 'كيف يمكنني التسجيل في الدورات والكورسات؟',
    a: 'يمكنك استعراض كتالوج الكورسات في صفحة «الكورسات» والضغط على زر «سجّل اهتمامك» لإرسال بيانات التواصل لتصلك مواعيد الانعقاد والتفاصيل فور اعتمادها.'
  },
  // Privacy
  {
    category: 'privacy',
    q: 'كيف يتم الحفاظ على خصوصية وسرية بيانات الجلسات؟',
    a: 'نلتزم التزاماً صارماً بأعلى معايير السرية والأخلاقيات المهنية. لا نجمع سوى الحد الأدنى من البيانات الضرورية، ولا يتم تسجيل الجلسات المرئية، ولا نشارك أي معلومة مع أي طرف ثالث.'
  },
  {
    category: 'privacy',
    q: 'ماذا أفعل في الحالات الطارئة أو الأزمات الحادة؟',
    a: 'الموقع والاستشارات ليست خدمة طوارئ ولا تراقب الحالات العاجلة. في حال وجود خطر مباشر على السلامة أو أزمة نفسية حادة، يرجى التوجه فوراً لأقرب مستشفى أو الاتصال بالخطوط الساخنة للطوارئ الطبية في بلدك.'
  }
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqsData.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.q.includes(search) || item.a.includes(search);
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen flex flex-col bg-[#0D1117] dark:bg-[#0D1117] bg-[#F8FAFC] text-slate-100 dark:text-slate-100 text-slate-900 transition-colors">
      <Navbar />

      {/* Header */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 text-right">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[280px] bg-accent-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/60 dark:bg-slate-800/60 bg-slate-100 border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs font-bold text-accent-500">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>الأسئلة الشائعة والموارد التوعوية</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-100 dark:text-slate-100 text-slate-900 leading-[1.7]">
            كل ما تود معرفته عن الجلسات والخدمات
          </h1>

          <p className="text-sm sm:text-base text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal">
            إجابات واضحة ومعتمدة عن أكثر الأسئلة شيوعاً حول طبيعة الاستشارات، طريقة اللقاء أونلاين، سياسة المواعيد، وبرامج الكورسات.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="ابحث عن سؤال أو موضوع..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3.5 pl-10 rounded-2xl bg-slate-900/80 dark:bg-slate-900/80 bg-white border border-slate-700 dark:border-slate-700 border-slate-200 text-xs sm:text-sm text-slate-100 dark:text-slate-100 text-slate-900 focus:outline-hidden focus:border-accent-500 shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
          </div>
        </div>
      </section>

      {/* الأسئلة والتصنيفات */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#11161D] dark:bg-[#11161D] bg-slate-50 border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200">
        <div className="max-w-4xl mx-auto space-y-10 text-right">
          
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 dark:border-slate-800 border-slate-200 pb-4">
            {[
              { id: 'all', label: 'جميع الأسئلة' },
              { id: 'services', label: 'الخدمات والاستشارات' },
              { id: 'online', label: 'طريقة الجلسات أونلاين' },
              { id: 'booking', label: 'الحجز والمواعيد' },
              { id: 'cancellation', label: 'الإلغاء والجدولة' },
              { id: 'courses', label: 'الكورسات' },
              { id: 'privacy', label: 'الخصوصية والأمان' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeCategory === tab.id ? 'bg-accent-500 text-white shadow-xs' : 'bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 text-slate-300 dark:text-slate-300 text-slate-600 hover:border-slate-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border transition bg-[#161C24] dark:bg-[#161C24] bg-white border-slate-800 dark:border-slate-800 border-slate-200 overflow-hidden shadow-xs"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-right flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-100 dark:text-slate-100 text-slate-900"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-accent-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal border-t border-slate-800/60 dark:border-slate-800/60 border-slate-100 animate-fadeIn">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                لم نجد نتائج مطابقة لبحثك. يمكنك البحث بكلمات أخرى أو التواصل معنا مباشرة.
              </div>
            )}
          </div>

          {/* Contact Box if not found */}
          <div className="p-6 rounded-3xl bg-slate-900/60 dark:bg-slate-900/60 bg-white border border-slate-800 dark:border-slate-800 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-right">
              <h4 className="text-xs sm:text-sm font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                هل لديك سؤال آخر لم تجد إجابته هنا؟
              </h4>
              <p className="text-[11px] text-slate-400">
                فريق التنسيق متاح للرد على استفساراتك وتنظيم المواعيد عبر الواتساب أو البريد.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white rounded-xl text-xs font-bold transition shrink-0 shadow-xs"
            >
              تواصل معنا مباشرة
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
