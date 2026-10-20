'use client';

import React, { useState } from 'react';
import { Calendar, Zap, Clock, Shield, Video, Phone, CheckCircle2 } from 'lucide-react';

export default function BookingClean() {
  const [bookingMode, setBookingMode] = useState<'standard' | 'urgent'>('standard');

  return (
    <section id="booking" className="py-20 px-4 sm:px-6 border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 bg-[#0A0E13] dark:bg-[#0A0E13] bg-slate-50 transition-colors">
      <div className="max-w-4xl mx-auto space-y-10 text-right">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold text-accent-500 uppercase tracking-wider block">
            حجز موعد استشاري أونلاين
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-100 dark:text-slate-100 text-slate-900 leading-tight">
            اختر وقتك وابدأ رحلتك
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
            جلسات أونلاين عبر لقاءات فيديو خاصة على Google Meet. اختر بين الجدول الاعتيادي أو طلب أولوية طارئة خلال 24 ساعة.
          </p>
        </div>

        {/* Mode Toggle Switch */}
        <div className="flex justify-center">
          <div className="p-1 rounded-2xl bg-slate-900/80 dark:bg-slate-900/80 bg-slate-200/70 border border-slate-800 dark:border-slate-800 border-slate-300 inline-flex items-center gap-1 shadow-inner">
            <button
              onClick={() => setBookingMode('standard')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                bookingMode === 'standard'
                  ? 'bg-accent-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>جدول المواعيد الاعتيادية</span>
            </button>

            <button
              onClick={() => setBookingMode('urgent')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                bookingMode === 'urgent'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-amber-400/80 hover:text-amber-300'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>حجز استثنائي / طارئ (24 ساعة)</span>
            </button>
          </div>
        </div>

        {/* Content based on Mode */}
        {bookingMode === 'standard' ? (
          <div className="rounded-3xl p-4 sm:p-8 bg-[#12171E] dark:bg-[#12171E] bg-white border border-slate-800/80 dark:border-slate-800/80 border-slate-200 shadow-xl space-y-6">
            
            {/* Minimal Instructions Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-b border-slate-800/80 dark:border-slate-800/80 border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400" />
                <span>جلسة أونلاين عبر Google Meet</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent-500" />
                <span>إلغاء أو إعادة جدولة مجاني حتى 48 ساعة</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>نلتزم بالسرية المهنية</span>
              </div>
            </div>

            {/* Calendly Live Embed */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-white min-h-[680px]">
              <iframe
                src="https://calendly.com/galal3hmad/insan?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=ffffff&text_color=0f172a&primary_color=d97706"
                width="100%"
                height="680"
                frameBorder="0"
                title="جدول مواعيد جلال أحمد"
                className="w-full h-[680px]"
              />
            </div>

            {/* Note on Fees and No Online Deduction */}
            <div className="p-4 rounded-2xl bg-slate-900/40 dark:bg-slate-900/40 bg-slate-50 border border-slate-800 dark:border-slate-800 border-slate-200 text-xs text-slate-400 text-center">
              💡 <strong>تنبيه:</strong> لا يتم تحصيل أي مبالغ أو رسوم إلكترونية عبر الموقع الآن. سيتم التواصل معك عبر الواتساب أو البريد لتأكيد موعدك وإرسال كافة التفاصيل.
            </div>

          </div>
        ) : (
          /* Urgent Booking Box */
          <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-amber-950/40 via-[#161B23] to-[#12171E] dark:from-amber-950/40 dark:via-[#161B23] dark:to-[#12171E] bg-amber-50 border-2 border-amber-500/50 shadow-2xl space-y-8">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold">
                <Zap className="w-4 h-4" />
                <span>خدمة التدخل والاستشارة السريعة</span>
              </div>
              <h3 className="text-2xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
                طلب حجز استشاري طارئ (خلال 24 ساعة)
              </h3>
              <p className="text-sm text-slate-300 dark:text-slate-300 text-slate-700 leading-relaxed">
                إذا كنت تمر بظرف حرج أو أزمة أسرية مفاجئة تتطلب جلسة استشارية عاجلة خارج أوقات الجدول الاعتيادي، يمكنك تقديم طلب حجز مستعجل وسيتم التنسيق معك فوراً لتحديد أقرب موعد خلال 24 ساعة.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-black/40 dark:bg-black/40 bg-white/80 border border-amber-500/20 text-xs text-slate-300 dark:text-slate-300 text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>أولوية انعقاد الجلسة خلال 24 ساعة كحد أقصى.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>جلسة خاصة وآمنة عبر اتصال فيديو (Google Meet).</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>تخضع لتسعير خاص ومستقل يتناسب مع سرعة الاستجابة الاستثنائية.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-800/40 text-xs text-rose-300">
              ⚠️ هذه الخدمة لتنسيق موعد عاجل وليست خدمة إنقاذ. إذا كنت أو كان شخص قريب منك في خطر مباشر، تواصل فوراً مع الطوارئ في بلدك.
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <a
                href="https://wa.me/201014876666?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%AF.%20%D8%AC%D9%84%D8%A7%D9%84%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8a%20%D8%B7%D9%84%D8%A8%20%D8%AD%D8%AC%D8%B2%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D8%B7%D8%A7%D8%B1%D8%A6%D8%A9%20%2F%20%D9%85%D8%B3%D8%AA%D8%B9%D8%AC%D9%84%D8%A9%20%D8%AE%D9%84%D8%A7%D9%84%2024%20%D8%B3%D8%A7%D8%B9%D8%A9."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-2xl transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>تواصل الآن للحجز الطارئ عبر واتساب</span>
              </a>

              <span className="text-xs text-slate-400 text-center sm:text-left">
                الخط المعتمد: +20 101 487 6666
              </span>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
