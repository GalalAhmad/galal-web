'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft, Loader2, Sparkles, Shield } from 'lucide-react';

interface NewsletterWidgetProps {
  source?: string;
  variant?: 'card' | 'inline' | 'compact';
}

export default function NewsletterWidget({ source = 'footer', variant = 'card' }: NewsletterWidgetProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('يرجى إدخال عنوان بريد إلكتروني صحيح.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, source }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'تعذر تسجيل الاشتراك');
      }

      setSubmitted(true);
      setEmail('');
      setName('');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ، يرجى المحاولة مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-6 rounded-3xl bg-[#EDF7F5] dark:bg-[#112924] border border-[#D6EEEA] dark:border-[#1F4A42] text-right space-y-3 animate-fadeIn">
        <div className="w-10 h-10 rounded-full bg-[#4E7E76] text-white flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
          أهلاً بك في النشرة الفكرية والإرشادية 🌿
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          تم تأكيد اشتراكك بنجاح! تم إرسال رسالة ترحيبية إلى بريدك الإلكتروني تحتوي على نبذة عن مسارات النشرة وخلاصاتنا القادمة.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-xs font-bold text-[#4E7E76] dark:text-[#5E988E] underline hover:no-underline cursor-pointer"
        >
          تسجيل بريد إلكتروني آخر
        </button>
      </div>
    );
  }

  return (
    <div
      className={`rounded-3xl text-right transition-all ${
        variant === 'compact'
          ? 'p-4 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800'
          : 'p-6 sm:p-8 bg-gradient-to-br from-[#EDF7F5] via-white to-[#F0F5FA] dark:from-[#112924]/60 dark:via-[#0E1524] dark:to-[#122238]/60 border border-[#D6EEEA] dark:border-slate-800 shadow-sm'
      }`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-[#4E7E76] dark:text-[#5E988E] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>النشرة الفكرية والإرشادية الدورية</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
            انضم إلى مجتمع القراء والمستفيدين 📬
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            إضاءات دورية في بناء الإنسان والأسرة، خلاصات المقالات السلوكية، وإشعارات الدفعات التدريبية الجديدة مباشرة إلى بريدك.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Subscription Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="الاسم (اختياري)"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#141C27] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4E7E76] transition shadow-2xs"
              />
            </div>
            <div className="sm:col-span-5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني (name@example.com)"
                required
                dir="ltr"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#141C27] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4E7E76] text-right transition shadow-2xs"
              />
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-full min-h-[38px] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#4E7E76] hover:bg-[#3D655E] text-white text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>اشتراك</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
            <Shield className="w-3.5 h-3.5 text-[#4E7E76] shrink-0" />
            <span>نحترم خصوصيتك التامة؛ بدون أي رسائل ترويجية مزعجة، ويمكنك إلغاء الاشتراك في أي وقت.</span>
          </div>
        </form>
      </div>
    </div>
  );
}
