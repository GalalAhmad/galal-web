'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Clock, Video, Sparkles } from 'lucide-react';
import { VectorDialogue } from './Vectors';

export default function HeroClean() {
  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 bg-gradient-to-b from-[#0D1117] via-[#0E141C] to-[#0D1117] dark:from-[#0D1117] dark:via-[#0E141C] dark:to-[#0D1117] bg-white transition-colors">
      
      {/* Gentle ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center space-y-8">
        
        {/* Top Serene Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/60 dark:bg-slate-800/60 bg-slate-100 border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs font-semibold text-accent-500 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-accent-500" />
          <span>مساحة استشارية متخصصة • أونلاين 100% عبر Google Meet</span>
        </div>

        {/* The Signature Quote & Core Headline */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-100 dark:text-slate-100 text-slate-900 leading-[1.4] sm:leading-[1.3] tracking-normal">
            جلسات استشارية تبدأ من حيث أنت..
            <span className="block text-accent-500 mt-2">بخصوصية وأمان تام</span>
          </h1>

          {/* Dr. Galal Ahmad's signature philosophical compass */}
          <div className="pt-2">
            <p className="text-base sm:text-lg font-bold text-slate-300 dark:text-slate-300 text-slate-700 bg-slate-900/40 dark:bg-slate-900/40 bg-slate-50 border border-slate-800 dark:border-slate-800 border-slate-200 rounded-2xl py-3 px-6 inline-block">
              «وَمَنْ يَصِفُ لَكَ الطَّرِيقَ.. لَنْ يَسْلُكَهُ نِيَابَةً عَنْكَ»
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed max-w-2xl mx-auto pt-2">
            إرشاد نفسي، أسري، وتربوي يقدمه <strong className="text-slate-200 dark:text-slate-200 text-slate-900 font-bold">جـلال أحـمد</strong> لمساندتك على تفكيك التحديات، واستعادة الاتزان الداخلي، وبناء علاقات سوية ومستقرة.
          </p>
        </div>

        {/* Minimal Vector Illustration */}
        <div className="flex justify-center py-2">
          <VectorDialogue className="w-40 h-40 sm:w-48 sm:h-48 drop-shadow-md" />
        </div>

        {/* Primary Direct CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="#booking"
            className="px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white text-sm sm:text-base font-bold rounded-full transition shadow-lg shadow-accent-500/25 flex items-center gap-2 group"
          >
            <span>احجز جلستك الآن</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </a>

          <a
            href="#services"
            className="px-6 py-4 bg-slate-800/80 dark:bg-slate-800/80 bg-slate-100 hover:bg-slate-700/60 dark:hover:bg-slate-700/60 hover:bg-slate-200 text-slate-200 dark:text-slate-200 text-slate-800 text-sm sm:text-base font-bold rounded-full transition border border-slate-700/60 dark:border-slate-700/60 border-slate-300"
          >
            استكشف مسارات الاستشارة
          </a>
        </div>

        {/* Arab Therapy Style Reassurance Chips */}
        <div className="pt-6 border-t border-slate-800/80 dark:border-slate-800/80 border-slate-200 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400 dark:text-slate-400 text-slate-600">
          <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900/40 dark:bg-slate-900/40 bg-slate-50 border border-slate-800/80 dark:border-slate-800/80 border-slate-200">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>سرية مهنية وأمان 100%</span>
          </div>

          <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900/40 dark:bg-slate-900/40 bg-slate-50 border border-slate-800/80 dark:border-slate-800/80 border-slate-200">
            <Clock className="w-4 h-4 text-accent-500 shrink-0" />
            <span>إلغاء وتعديل مجاني حتى 48 ساعة</span>
          </div>

          <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900/40 dark:bg-slate-900/40 bg-slate-50 border border-slate-800/80 dark:border-slate-800/80 border-slate-200">
            <Video className="w-4 h-4 text-blue-400 shrink-0" />
            <span>لقاء مشفر عبر Google Meet</span>
          </div>
        </div>

      </div>
    </section>
  );
}
