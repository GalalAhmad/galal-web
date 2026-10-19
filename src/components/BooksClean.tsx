'use client';

import React, { useState } from 'react';
import { BookOpen, Sparkles, Send, CheckCircle2, X } from 'lucide-react';
import { VectorBookCover } from './Vectors';

interface BookItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  focus: string[];
  gradient: string;
}

export default function BooksClean() {
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [requestContact, setRequestContact] = useState('');

  const books: BookItem[] = [
    {
      id: 'zat-wa-mawdoo',
      title: 'ذات وموضوع',
      subtitle: 'في إدراك النفس والآخر وتفكيك صراعات العلاقات',
      category: 'علم نفس وتحليل العلاقات',
      description: 'كتاب يبحث في عمق العلاقة بين «الذات» كوعي داخلي و«الموضوع» كطرف آخر في المعادلة الإنسانية، وكيف تنشأ التشوهات الإدراكية التي تؤدي إلى صدام العلاقات والاضطراب الداخلي.',
      focus: ['إدراك الذات وتفكيك الإسقاطات', 'تحليل ديناميكيات العلاقات الصعبة', 'الانتقال إلى النضج الانفعالي'],
      gradient: 'from-amber-600/30 to-amber-900/40',
    },
    {
      id: 'zilly',
      title: 'ظلي',
      subtitle: 'رحلة استبصار لمواجهة الجوانب غير المعترف بها في ذواتنا',
      category: 'استبصار وتطوير الذات',
      description: 'رحلة نفسية عميقة لمواجهة «الظل»؛ تلك الأجزاء والمشاعر التي نخفيها أو نخجل منها، وتحويل الصراع الداخلي إلى قبول ونضج وتصالح حقيقي مع إنسانيتنا.',
      focus: ['فهم مفهوم الظل النفسي', 'المصالحة مع المخاوف الدفينة', 'صناعة السلام الداخلي'],
      gradient: 'from-slate-700/40 to-slate-900/60',
    },
    {
      id: 'effective-parenting',
      title: 'العادات الوالدية للآباء الأكثر فاعلية',
      subtitle: 'دليل منهجي وتطبيقي للتربية الإيجابية الواعية',
      category: 'إرشاد والدي وتربوي',
      description: 'دليل عملي واقعي للآباء والأمهات، يفكك ردود الأفعال العصبية اليومية، ويقدم عادات تربوية واضحة لبناء جسور من الثقة والرحمة والاحتواء مع الأبناء واليافعين.',
      focus: ['الانتقال من الانفعال إلى التأثير', 'مهارات الحوار واحتواء العناد', 'بناء بيوت يسودها الأمان'],
      gradient: 'from-emerald-700/30 to-emerald-950/40',
    },
    {
      id: 'aqwameyat-quran',
      title: 'أقومية القرآن في الأسرة والطفل',
      subtitle: 'تأصيل نفسي وتربوي يستلهم ركائز البيت المطمئن من الوحي',
      category: 'تأصيل إسلامي وتربوي',
      description: 'قراءة منهجية عميقة تستلهم من هدايات القرآن الكريم القواعد الذهبية لاستقرار الأسرة وسواء نفسية الطفل، كمنهج حياة أصيل يجيب عن أسئلة التربية المعاصرة.',
      focus: ['استلهام هدي الوحي في التربية', 'بناء الفطرة السوية لدى الطفل', 'أركان السكن والمودة الزوجية'],
      gradient: 'from-blue-700/30 to-blue-950/40',
    },
  ];

  const handleInterestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestContact) return;
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setSelectedBook(null);
      setRequestContact('');
    }, 2800);
  };

  return (
    <section id="books" className="py-20 px-4 sm:px-6 border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 bg-[#0A0E13] dark:bg-[#0A0E13] bg-slate-50 transition-colors">
      <div className="max-w-6xl mx-auto space-y-14 text-right">
        
        {/* Section Header - Mohamed Taha inspiration */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-accent-500 uppercase tracking-wider block">
            المؤلفات والإصدارات المعرفية
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-100 dark:text-slate-100 text-slate-900 leading-tight">
            كتب وإصدارات جـلال أحـمد
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
            مؤلفات تجمع بين عمق التأصيل النفسي والإنساني واستلهام هدي الفطرة، لصناعة وعي حقيقي بالذات والأسرة.
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="rounded-3xl p-6 bg-[#12171E] dark:bg-[#12171E] bg-white border border-slate-800/80 dark:border-slate-800/80 border-slate-200 hover:border-slate-700 transition flex flex-col justify-between group shadow-xs"
            >
              <div className="space-y-4">
                
                {/* Book Cover Mockup Card */}
                <div className={`relative h-56 rounded-2xl p-6 bg-gradient-to-br ${book.gradient} border border-slate-700/60 flex flex-col justify-between overflow-hidden shadow-inner`}>
                  <div className="absolute top-2 left-2 opacity-20">
                    <VectorBookCover className="w-20 h-20" />
                  </div>
                  
                  <span className="text-[10px] font-bold text-amber-300 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm self-start">
                    {book.category}
                  </span>

                  <div className="space-y-1 z-10">
                    <h3 className="text-lg font-black text-white leading-tight">
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-slate-200 line-clamp-2 leading-relaxed">
                      {book.subtitle}
                    </p>
                  </div>

                  <span className="text-[10px] font-semibold text-slate-300 z-10">
                    جـلال أحـمد
                  </span>
                </div>

                {/* Brief description */}
                <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed line-clamp-3">
                  {book.description}
                </p>

              </div>

              {/* Action Button */}
              <div className="pt-5 mt-5 border-t border-slate-800/80 dark:border-slate-800/80 border-slate-100">
                <button
                  onClick={() => setSelectedBook(book)}
                  className="w-full py-2.5 bg-slate-800/80 dark:bg-slate-800/80 bg-slate-100 hover:bg-accent-500 hover:text-white dark:hover:bg-accent-500 dark:hover:text-white text-slate-200 dark:text-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>تفاصيل وطلب نسخة</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Book Details Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12171E] dark:bg-[#12171E] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-right relative shadow-2xl animate-fadeIn">
            
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-xs font-bold text-accent-500">
                {selectedBook.category}
              </span>
              <h3 className="text-2xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
                كتاب {selectedBook.title}
              </h3>
              <p className="text-xs text-slate-400">
                {selectedBook.subtitle}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-700 leading-relaxed">
              {selectedBook.description}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-200 dark:text-slate-200 text-slate-800 block">
                أبرز محاور الكتاب:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-400 dark:text-slate-400 text-slate-600">
                {selectedBook.focus.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interest form */}
            <div className="pt-4 border-t border-slate-800 dark:border-slate-800 border-slate-200">
              {requestSent ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold text-center">
                  تم تسجيل اهتمامك بنجاح! سيتم إشعارك فور توفر النسخ وتفاصيل الاقتناء.
                </div>
              ) : (
                <form onSubmit={handleInterestSubmit} className="space-y-3">
                  <label className="text-xs font-bold text-slate-300 dark:text-slate-300 text-slate-700 block">
                    اطلب نسختك أو استفسر عن توفر الإصدار:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="رقم الواتساب أو البريد الإلكتروني"
                      value={requestContact}
                      onChange={(e) => setRequestContact(e.target.value)}
                      required
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-900 bg-slate-50 border border-slate-700 dark:border-slate-700 border-slate-300 text-xs text-slate-200 dark:text-slate-200 text-slate-800 focus:outline-hidden focus:border-accent-500"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>إرسال</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
