'use client';

import React, { useState } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);
  const phoneNumber = '201014876666';
  const defaultMessage = 'مرحبًا، أود الاستفسار عن خدمات د. جلال أو طريقة الحجز';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2 select-none print:hidden">
      
      {/* Tooltip Note */}
      {showTooltip && (
        <div className="relative max-w-[260px] p-3.5 rounded-2xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-700/80 dark:border-slate-700/80 border-slate-200 shadow-2xl text-right animate-fadeIn">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 left-2 p-1 text-slate-400 hover:text-white"
            aria-label="إغلاق التنبيه"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="text-xs font-bold text-slate-100 dark:text-slate-100 text-slate-900 mb-1">
            التواصل عبر الواتساب
          </div>
          <p className="text-[11px] text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed">
            مخصص للتنسيق العام واستفسارات حجز الجلسات. هذه القناة ليست للحالات الطارئة أو لإرسال التفاصيل الطبية الخاصة.
          </p>
        </div>
      )}

      {/* Floating Button */}
      <div className="flex items-center gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
          aria-label="تواصل عبر واتساب الرسمي"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="text-xs font-bold hidden sm:inline">
            واتساب للتنسيق
          </span>
        </a>

        {/* Small help toggle on mobile */}
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="sm:hidden w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold"
          aria-label="تنبيه الواتساب"
        >
          ℹ️
        </button>
      </div>

    </div>
  );
}
