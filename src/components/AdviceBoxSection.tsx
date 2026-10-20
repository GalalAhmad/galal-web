'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, Clock, AlertCircle, HelpCircle, Laptop, ShieldCheck } from 'lucide-react';

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
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* 1. بطاقة ساعات العمل والتواصل المعتمدة */}
        <div className="rounded-3xl bg-white dark:bg-[#141C27] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800/80">
            {/* عنوان القسم */}
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#1E3A34] dark:text-[#5E988E]">
                ساعات العمل
              </h3>
            </div>

            {/* تفاصيل الدوام */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-14 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  الأيام العادية:
                </span>
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  من السبت إلى الخميس: 10:00 صباحًا - 3:00 مساءً
                </span>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  يوم الجمعة:
                </span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">
                  مغلق
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>ملاحظة: يمكنك التواصل معنا في أي وقت، وسنرد عليك خلال ساعات العمل.</span>
          </div>
        </div>

        {/* 2. صندوق النصيحة */}
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E3A34] dark:text-[#5E988E]">
              صندوق النصيحة
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              عندك ملاحظة، شكوى، اقتراح أو شيء تحب توصله إلينا؟ شاركنا به هنا.
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
                تم استلام رسالتك في صندوق النصيحة بنجاح، وستصل مباشرة إلى المستشار وإدارة المنصة للتحسين المستمر.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-3 text-xs font-bold text-[#4E7E76] dark:text-[#5E988E] underline hover:no-underline"
              >
                إرسال رسالة أخرى
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-right">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* حقل الرسالة */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  رسالتك
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب ما تود مشاركته معنا..."
                  rows={5}
                  maxLength={5000}
                  className="w-full p-4 rounded-2xl bg-white dark:bg-[#141C27] border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4E7E76] text-sm text-slate-900 dark:text-slate-100 resize-y transition shadow-2xs"
                  required
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>من 5 إلى 5000 حرف</span>
                  <span>{message.length}/5000</span>
                </div>
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
                  للتواصل معك فقط إذا احتجنا إلى المزيد من المعلومات.
                </span>
              </div>

              {/* زر الإرسال */}
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-10 py-3 rounded-xl bg-[#5E8B83] hover:bg-[#4E7E76] text-white text-sm font-bold transition shadow-sm disabled:opacity-50"
                >
                  {submitting ? (
                    <span>جاري الإرسال...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 ml-1 rotate-180" />
                      <span>إرسال</span>
                    </>
                  )}
                </button>
                <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
                  لا يُتوقع رد على كل رسالة. للمساعدة، استخدم المحادثة أو وسائل التواصل المتاحة.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* 3. الكروت المساندة الثلاثة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          
          {/* كارت 1: للحصول على رد أسرع */}
          <div className="p-6 rounded-3xl bg-[#F8FAF9] dark:bg-[#141C27] border border-slate-200/80 dark:border-slate-800 space-y-3.5 shadow-2xs">
            <h4 className="text-base font-bold text-[#1E3A34] dark:text-[#5E988E]">
              للحصول على رد أسرع
            </h4>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed font-medium">
              <li>• اذكر رقم ملفك إن وجد</li>
              <li>• كن واضحًا في وصف المشكلة</li>
              <li>• أرفق صورًا إذا كانت المشكلة تقنية</li>
            </ul>
          </div>

          {/* كارت 2: مشاكل تقنية شائعة */}
          <div className="p-6 rounded-3xl bg-[#F8FAF9] dark:bg-[#141C27] border border-slate-200/80 dark:border-slate-800 space-y-3.5 shadow-2xs">
            <h4 className="text-base font-bold text-[#1E3A34] dark:text-[#5E988E]">
              مشاكل تقنية شائعة
            </h4>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed font-medium">
              <li>• مشاكل الصوت أو الفيديو</li>
              <li>• مشاكل في الاتصال</li>
            </ul>
            <div className="pt-2">
              <a 
                href="https://wa.me/201014876666?text=السلام%20عليكم،%20لدي%20استفسار%20تقني%20بخصوص%20جلسة%20استشارية"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3A34] dark:text-[#5E988E] hover:underline"
              >
                <span>← ابحث عن حلول هنا</span>
              </a>
            </div>
          </div>

          {/* كارت 3: الاستعداد للجلسات */}
          <div className="p-6 rounded-3xl bg-[#F8FAF9] dark:bg-[#141C27] border border-slate-200/80 dark:border-slate-800 space-y-3.5 shadow-2xs">
            <h4 className="text-base font-bold text-[#1E3A34] dark:text-[#5E988E]">
              الاستعداد للجلسات
            </h4>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed font-medium">
              <li>• اختبر معداتك قبل 15 دقيقة</li>
              <li>• تأكد من اتصال الإنترنت</li>
              <li>• اختر مكانًا هادئًا</li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}
