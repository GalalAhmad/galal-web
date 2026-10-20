'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, X, Search, ChevronRight, MessageSquare, ArrowLeft, ShieldAlert } from 'lucide-react';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const verifiedFaqs: FaqItem[] = [
  {
    id: 'services-types',
    category: 'الخدمات والاستشارات',
    question: 'ما هي أنواع الاستشارات التي يقدمها جلال أحمد؟',
    answer: 'يقدم جلال أحمد ثلاثة مسارات أساسية: 1) الاستشارات النفسية وبصيرة الذات للأفراد، 2) الاستشارات الزواجية والأسرية وبرامج تأهيل المقبلين (رحلة رفق وميثاق)، 3) الاستشارات التربوية للوالدين وسيكولوجيا اليافعين والمراهقين.'
  },
  {
    id: 'session-format',
    category: 'طريقة الجلسة',
    question: 'كيف تُعقد الجلسات؟ وهل تتوفر جلسات حضورية؟',
    answer: 'الموقع والخدمات تعمل أونلاين فقط؛ تُعقد كافة الجلسات الاستشارية عن بُعد عبر اتصال مرئي مشفر وآمن من خلال Google Meet للمستفيدين من جميع الدول دون الحاجة لأي تنقل.'
  },
  {
    id: 'booking-steps',
    category: 'خطوات الحجز',
    question: 'كيف تتم عملية الحجز واختيار الموعد؟',
    answer: 'من خلال صفحة «الحجز» في الموقع: تختار أولاً مجال الاستشارة، ثم تجيب عن أسئلة قصيرة لتحديد نوع الاحتياج، وتختار الموعد الأنسب لك من جدول المواعيد المتاحة، ثم تدخل الاسم المفضل ووسيلة اتصال واحدة لتأكيد الحجز.'
  },
  {
    id: 'reschedule-policy',
    category: 'الإلغاء والجدولة',
    question: 'هل يمكنني تعديل الموعد أو إلغاؤه بعد الحجز؟',
    answer: 'نعم، يمكن طلب إعادة جدولة الموعد أو إلغائه بالتواصل المسبق قبل 24 ساعة من موعد الجلسة تقديراً لظروفك ولتنظيم جدول المواعيد، وفق سياسة الحجز والإلغاء الموضحة بالموقع.'
  },
  {
    id: 'courses-info',
    category: 'الكورسات والبرامج',
    question: 'كيف أسجل في الكورسات والدورات التدريبية؟',
    answer: 'يمكنك استعراض كتالوج الكورسات في صفحة «الكورسات» والضغط على زر «سجّل اهتمامك» أو «اطلب التفاصيل» لإرسال بيانات تواصلك وسيتم إشعارك فور فتح باب التسجيل. الدفع الإلكتروني مؤجل حالياً.'
  },
  {
    id: 'emergency-note',
    category: 'الأمان والخصوصية',
    question: 'هل الموقع أو الاستشارات مناسبة للحالات الطارئة؟',
    answer: 'لا، خدمات الموقع والمساعد ليست خدمة طوارئ ولا تراقب الحالات العاجلة. في حال وجود خطر مباشر أو حالة طبية طارئة، يرجى التوجه فوراً لأقرب مركز طبي أو الاتصال بأرقام الطوارئ المحلية في بلدك.'
  },
  {
    id: 'contact-ways',
    category: 'التواصل',
    question: 'ما هي قنوات التواصل الرسمية المتاحة؟',
    answer: 'قنوات التواصل الرسمية هي: الواتساب المعتمد للتنسيق (+20 101 487 6666)، والبريد الإلكتروني الرسمي (info@galalahmad.com)، ونموذج الاستفسار في صفحة التواصل.'
  }
];

export default function FaqAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaq, setSelectedFaq] = useState<FaqItem | null>(null);

  const filteredFaqs = verifiedFaqs.filter(
    (item) =>
      item.question.includes(searchQuery) ||
      item.answer.includes(searchQuery) ||
      item.category.includes(searchQuery)
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none print:hidden">
      
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-700/80 dark:border-slate-700/80 border-slate-200 text-slate-100 dark:text-slate-100 text-slate-900 shadow-xl hover:shadow-2xl hover:border-accent-500 transition-all duration-300 group"
          aria-label="المساعد السريع للأسئلة الشائعة"
        >
          <div className="w-6 h-6 rounded-full bg-accent-500/10 text-accent-500 flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold hidden sm:inline">
            دليل الأسئلة الشائعة
          </span>
        </button>
      )}

      {/* Drawer / Popup */}
      {isOpen && (
        <div className="w-[320px] sm:w-[380px] max-h-[540px] flex flex-col rounded-3xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-700/80 dark:border-slate-700/80 border-slate-200 shadow-2xl text-right animate-fadeIn overflow-hidden">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-800 dark:border-slate-800 border-slate-100 flex items-center justify-between bg-slate-900/50 dark:bg-slate-900/50 bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                  دليل الأسئلة السريعة
                </h3>
                <p className="text-[10px] text-slate-400">إجابات معتمدة عن الموقع والخدمات</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                setSelectedFaq(null);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="إغلاق الدليل"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Boundaries Notice */}
          <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-[10px] text-amber-300 leading-snug flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>هذا الدليل للاستفسارات العامة فقط، ولا يقدم تشخيصاً أو استشارات نفسية خاصة.</span>
          </div>

          {/* Body */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
            
            {/* Search Input */}
            {!selectedFaq && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث في الأسئلة الشائعة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 pl-8 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 bg-slate-100 border border-slate-700 dark:border-slate-700 border-slate-200 text-xs text-slate-100 dark:text-slate-100 text-slate-900 focus:outline-hidden focus:border-accent-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            )}

            {/* Detailed Answer View */}
            {selectedFaq ? (
              <div className="space-y-3 animate-fadeIn">
                <button
                  onClick={() => setSelectedFaq(null)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-accent-500 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  <span>العودة لقائمة الأسئلة</span>
                </button>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 bg-slate-50 border border-slate-800 dark:border-slate-800 border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-accent-500 block">
                    {selectedFaq.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-100 dark:text-slate-100 text-slate-900 leading-relaxed">
                    {selectedFaq.question}
                  </h4>
                  <p className="text-[11px] text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal pt-1">
                    {selectedFaq.answer}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px]">
                  <Link
                    href="/booking"
                    onClick={() => setIsOpen(false)}
                    className="font-bold text-accent-500 hover:underline"
                  >
                    الانتقال للحجز المباشر ←
                  </Link>
                  <Link
                    href="/faq"
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:underline"
                  >
                    كل الأسئلة والموارد
                  </Link>
                </div>
              </div>
            ) : (
              /* Questions List */
              <div className="space-y-2">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedFaq(item)}
                      className="w-full p-2.5 rounded-xl bg-slate-900/40 dark:bg-slate-900/40 bg-slate-50 hover:bg-slate-800/60 dark:hover:bg-slate-800/60 hover:bg-slate-100 border border-slate-800 dark:border-slate-800 border-slate-200 text-right transition flex items-center justify-between gap-2 group"
                    >
                      <span className="text-[11px] font-semibold text-slate-200 dark:text-slate-200 text-slate-800 group-hover:text-accent-500 transition-colors">
                        {item.question}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0 rotate-180" />
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-[11px] text-slate-400">
                    لم نجد سؤالاً مطابقاً لبحثك. يمكنك التواصل معنا مباشرة عبر صفحة التواصل.
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Footer of Drawer */}
          <div className="p-3 border-t border-slate-800 dark:border-slate-800 border-slate-100 text-center bg-slate-900/40 dark:bg-slate-900/40 bg-slate-50">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-accent-500 hover:underline"
            >
              هل لديك استفسار آخر؟ تواصل مع فريق التنسيق
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}
