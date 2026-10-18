'use client';

import React, { useState } from 'react';
import { BookOpen, Sparkles, ArrowLeft, CheckCircle2, X, Clock, Bookmark } from 'lucide-react';

interface BookItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  coverBg: string;
  synopsis: string;
  status: string;
  chapters: string[];
  quote: string;
}

const booksList: BookItem[] = [
  {
    id: 'zat-wa-mawdoo',
    title: 'كتاب «ذات وموضوع»',
    subtitle: 'في بصيرة التمييز وتزكية النفس وفصل الذات عن المشكلة',
    badge: 'بصيرة الذات',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    coverBg: 'from-emerald-950 via-slate-900 to-slate-950 border-emerald-800/40',
    synopsis: 'كيف تنتقل من التماهي المدمر مع المشاعر والأزمات إلى بصيرة الملاحظة المستقلة؟ كتاب يعالج الخلط الخطير بين من «أنا» وما «يحدث لي»، ويقدم أدوات تطبيقية لفض النزاع الداخلي وبناء الهدوء الروحي والنفسي.',
    status: 'مسودة متقدمة (قيد النشر قريباً)',
    chapters: [
      'الفصل الأول: لغز التماهي — حين يتحول الحزن إلى هوية',
      'الفصل الثاني: فقه المسافة الشعورية — الملاحظة دون تخدير أو قمع',
      'الفصل الثالث: تصحيح الصورة الذهنية للذات والتحرر من أحكام الآخرين',
      'الفصل الرابع: من ردود الفعل العفوية إلى الاستجابة الواعية الحكيمة'
    ],
    quote: '«لستَ مشكلتك، ولستَ غضبك.. المشكلة موضوع يقع عليك، والذات أرحب من أن تُحصر في عارضٍ يزول». — جلال أحمد'
  },
  {
    id: 'zilly',
    title: 'كتاب «ظلّي»',
    subtitle: 'رحلة استكشاف الأعماق والمخاوف والأنماط اللاشعورية الدفينة',
    badge: 'سيكولوجيا الأعماق',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    coverBg: 'from-amber-950 via-slate-900 to-slate-950 border-amber-800/40',
    synopsis: 'دعوة شجاعة لفتح الأبواب الموصدة في النفس البشرية؛ تفكيك المخاوف غير المعلنة، والجراح النفسية الطفولية، والظلال التي نقوم بإسقاطها لا شعورياً على شريك الحياة والأبناء في لحظات التوتر والخصام.',
    status: 'قيد المراجعة والتحرير النهائي',
    chapters: [
      'الفصل الأول: ما لا نريد رؤيته — تشكل الظل والإنكار النفسي',
      'الفصل الثاني: آليات الإسقاط — لماذا نستفز من عيوب محددة فيمن حولنا؟',
      'الفصل الثالث: تفكيك العقد الدفينة في العلاقات الزوجية',
      'الفصل الرابع: التصالح مع الضعف البشري كمدخل وحيد للقوة والسكينة'
    ],
    quote: '«كل ما ترفض مواجهته في ظلك، سيقود حياتك من الخلف وسوف تسميه قدراً». — جلال أحمد'
  },
  {
    id: 'parenting-habits',
    title: 'كتاب «العادات الوالدية للآباء الأكثر فاعلية»',
    subtitle: 'العلاقة أولاً قبل طلب التغيير — دليل تطبيقي للتربية بالحزم الرفيق',
    badge: 'التربية واليافعين',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    coverBg: 'from-cyan-950 via-slate-900 to-slate-950 border-cyan-800/40',
    synopsis: 'خلاصة أكثر من 17 عاماً قضاها جلال أحمد في قيادة المدارس الكبرى والإشراف التربوي الميداني؛ دليل إرشادي واقعي يعين الوالدين على بناء سبع عادات أصيلة لتحويل صراعات البيت إلى مساحات من الأمان والشراكة.',
    status: 'إصدار تطبيقي قادم',
    chapters: [
      'العادة الأولى: الاستماع بلا مقاطعة — كيف تبني رصيد الثقة أولاً؟',
      'العادة الثانية: الحزم الرفيق — وضع الحدود دون قسوة أو ذنب',
      'العادة الثالث: فك شفرة العناد وسلوكيات اليافعين',
      'العادة الرابعة: الرقابة الذاتية وإدارة الشاشات في زمن التشتت'
    ],
    quote: '«السلوك رسالة تفصح عما يحتاجه الابن.. وإصلاح العلاقة يسبق دائماً طلب تعديل السلوك». — جلال أحمد'
  },
  {
    id: 'quranic-family',
    title: 'كتاب «أقومية القرآن في الأسرة والطفل»',
    subtitle: 'تأصيل المفاهيم النفسية والتربوية برؤية الوحي والفطرة',
    badge: 'المرجعية المعرفية',
    badgeColor: 'bg-accent-500/10 text-accent-500 border-accent-500/20',
    coverBg: 'from-rose-950 via-slate-900 to-slate-950 border-rose-800/40',
    synopsis: 'انطلاقاً من قوله تعالى ﴿إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ﴾؛ مشروع تأصيلي رائد يعيد وصل علم النفس والتربية بمنابع الفطرة والوحي، لتقديم نموذج آمن يحمي هوية الأسرة المسلمة من الاستلاب الفكري.',
    status: 'مشروع تأسيسي (أوراق ومجلدات)',
    chapters: [
      'الباب الأول: أقومية المفاهيم — كيف يُعرّف القرآن النفس والعقل والقلب؟',
      'الباب الثاني: فقه الميثاق الغليظ وأسس السكن والمودة',
      'الباب الثالث: تنشئة الفطرة — كيف نحمي الطفل من التشوه المعرفي والقيمي؟',
      'الباب الرابع: معالم النموذج النفسي الإسلامي في الوقاية والعلاج'
    ],
    quote: '«القرآن الكريم ليس كتاب مواعظ مجردة، بل هو الخريطة الأقوم لهندسة النفس واستقرار البيوت». — جلال أحمد'
  }
];

export default function BooksSection() {
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);

  return (
    <section id="books" className="py-20 px-4 sm:px-6 bg-[#0D1117] dark:bg-[#0D1117] bg-[#F8FAFC] border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 transition-colors">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* ترويسة المؤلفات (مستلهمة من وقار موقع د. محمد طه) */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 dark:bg-slate-800/60 bg-white border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs font-bold text-accent-500 shadow-xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>المؤلفات والإصدارات الفكرية</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-100 dark:text-slate-100 text-slate-900 tracking-tight">
            مؤلفات وكتابات جـلال أحـمد
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
            كتب وإصدارات تجمع بين عمق التأصيل المعرفي والخبرة الميدانية، لترسيخ الوعي وبناء الإنسان واستقرار البيوت.
          </p>
        </div>

        {/* شبكة الكتب الأربعة المتطابقة هندسياً (Strict Symmetry) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {booksList.map((book) => (
            <div
              key={book.id}
              className="h-full flex flex-col justify-between p-6 rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 hover:border-slate-700 dark:hover:border-slate-700 hover:border-slate-300 transition-all shadow-sm hover:shadow-md text-right group"
            >
              <div className="space-y-4">
                
                {/* Book Cover Graphic Simulation */}
                <div className={`w-full h-48 rounded-2xl bg-gradient-to-br ${book.coverBg} border p-5 flex flex-col justify-between shadow-inner relative overflow-hidden group-hover:scale-102 transition-transform duration-300`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${book.badgeColor} backdrop-blur-xs`}>
                      {book.badge}
                    </span>
                    <Bookmark className="w-4 h-4 text-slate-400 opacity-60" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block font-mono">مؤلفات جلال أحمد</span>
                    <h4 className="text-base font-black text-white leading-snug">
                      {book.title.replace('كتاب ', '')}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-white/10 text-[10px] text-slate-300 font-semibold flex items-center justify-between">
                    <span>{book.status.split('(')[0]}</span>
                    <span>📖</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-100 dark:text-slate-100 text-slate-900 group-hover:text-accent-500 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400 text-slate-500 mt-0.5">
                    {book.subtitle}
                  </p>
                </div>

                <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed min-h-[60px] font-normal">
                  {book.synopsis}
                </p>

              </div>

              <div className="pt-5 border-t border-slate-800/60 dark:border-slate-800/60 border-slate-100">
                <button
                  onClick={() => setSelectedBook(book)}
                  className="w-full py-2.5 bg-slate-800/80 dark:bg-slate-800/80 bg-slate-100 hover:bg-accent-500 dark:hover:bg-accent-500 hover:text-white dark:hover:text-white text-slate-200 dark:text-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 group-hover:bg-accent-500 group-hover:text-white"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>تصفح محاور ونبذة الكتاب</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* نافذة تفاصيل الكتاب (Book Details Modal) */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn text-right">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-700 dark:border-slate-700 border-slate-200 p-6 sm:p-8 text-slate-100 dark:text-slate-100 text-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border inline-block ${selectedBook.badgeColor}`}>
                {selectedBook.badge}
              </span>
              <h3 className="text-2xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
                {selectedBook.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 text-slate-500">
                {selectedBook.subtitle}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/50 dark:bg-slate-800/50 bg-slate-50 border border-slate-700/50 dark:border-slate-700/50 border-slate-200 text-xs italic text-slate-300 dark:text-slate-300 text-slate-700 leading-relaxed">
              {selectedBook.quote}
            </div>

            <div>
              <h4 className="text-sm font-bold text-accent-500 mb-2">عن الكتاب وفكرته المركزية:</h4>
              <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed">
                {selectedBook.synopsis}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-accent-500 mb-3">أبرز فصول ومحاور الكتاب:</h4>
              <ul className="space-y-2 text-xs text-slate-300 dark:text-slate-300 text-slate-700">
                {selectedBook.chapters.map((ch, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-800/30 dark:bg-slate-800/30 bg-slate-50 border border-slate-700/30 dark:border-slate-700/30 border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{ch}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span>حالة الإصدار: <strong className="text-accent-500">{selectedBook.status}</strong></span>
              <button
                onClick={() => setSelectedBook(null)}
                className="px-5 py-2 bg-slate-800 text-slate-200 rounded-xl hover:bg-slate-700 transition"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
