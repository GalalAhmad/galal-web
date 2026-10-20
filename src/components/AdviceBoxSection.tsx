'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Laptop, Clock, HelpCircle } from 'lucide-react';

export default function AdviceBoxSection() {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (message.trim().length < 5) {
      setError('يرجى كتابة رسالة لا تقل عن 5 أحرف.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء الإرسال');
      }

      setSubmitted(true);
      setMessage('');
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'تعذر الإرسال، يرجى المحاولة مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 bg-[#FAFCFA] dark:bg-[#0B1017] border-t border-slate-200/70 dark:border-slate-800 text-right">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* صندوق النصيحة */}
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E3A34] dark:text-[#5E988E]">
              صندوق النصيحة
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              عندك ملاحظة، شكوى، اقتراح أو شيء تحب توصله إلينا؟ شاركنا به هنا بكل خصوصية.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-3xl bg-[#EDF7F5] dark:bg-[#112924] border border-[#D6EEEA] dark:border-[#1F4A42] text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-[#4E7E76] text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                شكراً لمشاركتك القيّمة!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                تم استلام رسالتك في صندوق النصيحة بنجاح، وستصل مباشرة إلى المستشار وإدارة المنصة للتحسين والتطوير المستمر.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-3 text-xs font-bold text-[#4E7E76] dark:text-[#5E988E] underline hover:no-underline cursor-pointer"
              >
                إرسال ملاحظة أخرى
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="text-right space-y-4">
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* حقل الرسالة */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <label htmlFor="advice-msg">رسالتك</label>
                  <span className="text-[11px] text-slate-400 font-normal" dir="ltr">
                    {message.length} / 5000
                  </span>
                </div>
                <textarea
                  id="advice-msg"
                  rows={5}
                  maxLength={5000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="شاركنا باقتراحك أو ملاحظتك بكل سرية..."
                  required
                  className="w-full p-4 rounded-2xl bg-white dark:bg-[#141C27] border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4E7E76] text-sm text-slate-900 dark:text-slate-100 transition shadow-2xs leading-relaxed"
                />
              </div>

              {/* حقل البريد الإلكتروني اختياري */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  البريد الإلكتروني (اختياري)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  dir="ltr"
                  className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#141C27] border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4E7E76] text-sm text-slate-900 dark:text-slate-100 transition shadow-2xs text-right"
                />
                <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                  للتواصل معك فقط إذا احتجنا إلى المزيد من التوضيح.
                </span>
              </div>

              {/* زر الإرسال */}
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-10 py-3 rounded-full bg-[#4E7E76] hover:bg-[#3D655E] text-white text-sm font-bold transition shadow-md disabled:opacity-50"
                >
                  {submitting ? (
                    <span>جاري الإرسال...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 ml-1 rotate-180" />
                      <span>إرسال النصيحة</span>
                    </>
                  )}
                </button>
                <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
                  تُعامل جميع الرسائل في صندوق النصيحة بخصوصية وسرية تامة وتصل مباشرة إلى الإدارة.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* الكروت المساندة الثلاثة المستلهمة من عرب ثيرابي */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          
          {/* كارت 1: الاستعداد للجلسات */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#141C27] border border-slate-200/80 dark:border-slate-800 space-y-3.5 shadow-2xs hover:shadow-md transition">
            <div className="w-9 h-9 rounded-xl bg-[#EDF7F5] dark:bg-[#112924] text-[#4E7E76] dark:text-[#5E988E] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold text-[#1E3A34] dark:text-[#5E988E]">
              الاستعداد للجلسات
            </h4>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed font-medium">
              <li>• اختبر اتصالك ومعداتك قبل الموعد بـ 15 دقيقة</li>
              <li>• اختر مكاناً هادئاً وخاصاً خالياً من أي مقاطعات</li>
              <li>• جهّز أهم النقاط أو التساؤلات التي تود طرحها</li>
            </ul>
          </div>

          {/* كارت 2: مشاكل تقنية شائعة / إرشادات التواصل */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#141C27] border border-slate-200/80 dark:border-slate-800 space-y-3.5 shadow-2xs hover:shadow-md transition">
            <div className="w-9 h-9 rounded-xl bg-[#EDF5FD] dark:bg-[#122238] text-[#154F9C] dark:text-[#60A5FA] flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold text-[#1E3A34] dark:text-[#5E988E]">
              مشاكل تقنية شائعة
            </h4>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed font-medium">
              <li>• انقطاع الصوت أو تعطل الكاميرا في المتصفح</li>
              <li>• صعوبة في فتح رابط Google Meet</li>
            </ul>
            <div className="pt-2">
              <a 
                href="https://wa.me/201014876666?text=السلام%20عليكم،%20لدي%20استفسار%20تقني%20بخصوص%20جلسة%20استشارية"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4E7E76] dark:text-[#5E988E] hover:underline"
              >
                <span>تواصل مع الدعم الفني المباشر ←</span>
              </a>
            </div>
          </div>

          {/* كارت 3: للحصول على رد أسرع */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#141C27] border border-slate-200/80 dark:border-slate-800 space-y-3.5 shadow-2xs hover:shadow-md transition">
            <div className="w-9 h-9 rounded-xl bg-[#FEF9EC] dark:bg-[#2E2413] text-[#D97706] dark:text-[#F59E0B] flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold text-[#1E3A34] dark:text-[#5E988E]">
              للحصول على رد أسرع
            </h4>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed font-medium">
              <li>• وضّح طبيعة الاستفسار أو المشكلة بدقة واختصار</li>
              <li>• اذكر رقم الجلسة أو البريد المسجل به</li>
              <li>• للمواعيد العاجلة استخدم خيار الجلسة الطارئة</li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
