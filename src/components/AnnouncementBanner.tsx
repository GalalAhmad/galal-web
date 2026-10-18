'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, X } from 'lucide-react';

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-accent-600 via-accent-500 to-amber-600 text-white text-xs py-2.5 px-4 relative z-50 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 text-right">
        
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 font-bold text-[11px] backdrop-blur-xs">
            <Sparkles className="w-3 h-3 text-amber-200" />
            <span>تسجيل متاح الآن</span>
          </span>
          <span className="font-semibold text-white/95 text-[11px] sm:text-xs">
            انطلاق الدفعات التفاعلية الجديدة من برنامجي <strong>«رحلة رِفق» للمقبلين</strong> و<strong>«مِيثاق» للمتزوجين</strong> — جلسات أونلاين عبر Google Meet بمجموعات مركزة.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="#programs"
            className="inline-flex items-center gap-1 px-3 py-1 bg-white text-accent-600 hover:bg-amber-50 font-bold rounded-full text-[11px] transition shadow-xs"
          >
            <span>التفاصيل والمقاعد</span>
            <ArrowLeft className="w-3 h-3" />
          </Link>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition"
            aria-label="إغلاق الإعلان"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
