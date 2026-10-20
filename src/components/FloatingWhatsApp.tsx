'use client';

import React, { useState } from 'react';
import { Zap } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);
  const phoneNumber = '201014876666';
  const defaultMessage = 'أرغب في حجز استشارة مع أ. جلال أحمد';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
  const emergencyUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent('طلب حجز جلسة طارئة وعاجلة خلال 24 ساعة مع المستشار جلال أحمد')}`;

  return (
    <div className="fixed bottom-6 start-6 z-50 flex flex-col items-start gap-2.5 select-none print:hidden">
      
      {/* Tooltip Note */}
      {showTooltip && (
        <div className="relative max-w-[260px] p-3.5 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200 dark:border-slate-800 shadow-xl text-right animate-fadeIn">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 left-2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            aria-label="إغلاق التنبيه"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
            تواصل مباشر وتنسيق المواعيد
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            متاح لحجز الاستشارات العادية أو التنسيق العاجل للجلسات الطارئة خلال 24 ساعة.
          </p>
        </div>
      )}

      {/* Floating Buttons Group: Emergency Session + WhatsApp */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        
        {/* Floating Emergency Session (24h) */}
        <a
          href={emergencyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#CC4E46] to-[#B33D35] text-white text-xs font-bold shadow-lg shadow-[#CC4E46]/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all border border-white/20"
          title="حجز جلسة طارئة واستجابة عاجلة خلال 24 ساعة"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
          </span>
          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          <span>جلسة طارئة (24 ساعة)</span>
        </a>

        {/* Floating Sticky WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all group"
          aria-label="تواصل عبر واتساب الرسمي"
        >
          <svg
            className="w-4 h-4 fill-current shrink-0"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span>واتساب</span>
        </a>

      </div>

    </div>
  );
}
