'use client';

import React, { useState } from 'react';
import { Download, Mail, CheckCircle2, ShieldCheck, ArrowDownToLine, Loader2 } from 'lucide-react';

interface NewsletterLeadMagnetProps {
  source?: string;
  className?: string;
}

export default function NewsletterLeadMagnet({ source = 'homepage', className = '' }: NewsletterLeadMagnetProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'تعذر تسجيل البريد، يرجى المحاولة مجدداً');
      }

      setDownloadUrl(data.downloadUrl || '{{LEAD_MAGNET_PDF}}');
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ في الاتصال، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`relative overflow-hidden rounded-3xl border border-[#D6EEEA] dark:border-[#1F4A42] bg-gradient-to-br from-[#F4FAF8] via-white to-[#EDF7F5] dark:from-[#0E1A17] dark:via-[#112420] dark:to-[#0D1815] p-6 sm:p-10 shadow-sm ${className}`}>
      
      {/* Decorative subtle accent */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#4E7E76]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center space-y-5 relative z-10">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF7F5] dark:bg-[#112924] border border-[#D6EEEA] dark:border-[#1F4A42] text-[11px] font-bold text-[#4E7E76] dark:text-[#5E988E]">
          <Download className="w-3.5 h-3.5" />
          <span>هدية معرفية وتطبيقية مجانية (PDF)</span>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-snug">
            تمرين عملي مجاني: دليل فك النزاع الزواجي والتنظيم الانفعالي في 7 خطوات
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            ورقة عمل مكثفة صُممت لمساعدتك على تهدئة التوتر اللحظي، فك دوائر اللوم المتبادل، واستعادة الحوار الواعي دون صدام.
          </p>
        </div>

        {downloadUrl ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-fadeIn">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-lg font-bold">
              ✓
            </div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              تم تسجيلك بنجاح! دليلك جاهز الآن
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              يمكنك تحميل نسختك المباشرة من الملف من الرابط أدناه:
            </p>
            <div className="pt-2">
              <a
                href={downloadUrl}
                download="دليل_فك_النزاع_الزواجي.pdf"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4E7E76] hover:bg-[#3D655E] text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                <ArrowDownToLine className="w-4 h-4" />
                <span>تحميل الدليل بصيغة PDF</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto text-right">
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#161F2B] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs focus:ring-2 focus:ring-[#4E7E76] outline-none text-left"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#4E7E76] hover:bg-[#3D655E] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2 shrink-0 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جارٍ الإرسال...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>تحميل الدليل المجاني</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4E7E76]" />
              <span>خصوصيتك مصونة بالكامل • لا نرسل أي رسائل دعائية أو مزعجة</span>
            </div>
          </form>
        )}

      </div>
    </section>
  );
}
