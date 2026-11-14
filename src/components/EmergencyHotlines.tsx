'use client';

import React from 'react';
import { PhoneCall, ShieldAlert, HeartHandshake } from 'lucide-react';
import { SITE_POLICY } from '@/config/policy';

interface EmergencyHotlinesProps {
  variant?: 'card' | 'compact' | 'footer';
  className?: string;
}

/**
 * Reusable Unified Emergency Hotlines Component
 * Single Source of Truth for mental health support lines and emergency disclaimers.
 *
 * TODO: [Clinical & Operations Review]
 * تحقق وتأكيد دوري للأرقام مع الجهات الرسمية في مصر، السعودية، والخليج قبل كل إطلاق رسمي.
 */
export default function EmergencyHotlines({ variant = 'card', className = '' }: EmergencyHotlinesProps) {
  const { emergencyHotlines } = SITE_POLICY;

  if (variant === 'compact') {
    return (
      <div className={`text-xs text-slate-500 dark:text-slate-400 space-y-1 ${className}`}>
        <p className="font-bold text-slate-700 dark:text-slate-300">خطوط المساندة المجانية المعتمدة:</p>
        <p>
          مصر: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{emergencyHotlines.egyptMentalHealth.number}</strong> (الصحة النفسية) • 
          السعودية: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{emergencyHotlines.saudiMentalHealth.number}</strong> • 
          الطوارئ العامة: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{emergencyHotlines.generalEmergency.number}</strong>
        </p>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`p-4 rounded-2xl bg-white dark:bg-[#12171E] border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-3 shadow-xs ${className}`}>
        <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="mb-1">
            <strong>تنويه مهني وأخلاقي:</strong> الجلسات والاستشارات المقدمة مخصصة للدعم النفسي، والإرشاد الأسري والتربوي، وتخضع لأعلى معايير السرية المهنية. هذه الخدمات ليست بديلاً عن التدخل الطبي الطارئ.
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            في حالات الخطر أو الأزمات، يُرجى التوجه لأقرب طوارئ أو الاتصال بخطوط المساندة المجانية: 
            مصر (<strong>{emergencyHotlines.egyptMentalHealth.number}</strong>) • 
            السعودية (<strong>{emergencyHotlines.saudiMentalHealth.number}</strong>) • 
            الإسعاف (<strong>{emergencyHotlines.egyptAmbulance.number}</strong>)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-4 text-right ${className}`}>
      <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-400 font-bold text-sm sm:text-base">
        <ShieldAlert className="w-5 h-5 shrink-0" />
        <h3>تنبيه هام بشأن الحالات الطارئة والحرجة</h3>
      </div>

      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        الاستشارات المقدمة عبر المنصة متخصصة في الدعم النفسي والإرشاد الأسري والتربوي، 
        <strong> وليست مخصصة للتعامل مع الأزمات النفسية الحادة، أو محاولات إيذاء الذات، أو نوبات الذهان الحادة.</strong>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{emergencyHotlines.egyptMentalHealth.labelArabic}</div>
            <div className="text-[10px] text-slate-500">{emergencyHotlines.egyptMentalHealth.hoursArabic}</div>
          </div>
          <a
            href={`tel:${emergencyHotlines.egyptMentalHealth.number}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{emergencyHotlines.egyptMentalHealth.number}</span>
          </a>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{emergencyHotlines.saudiMentalHealth.labelArabic}</div>
            <div className="text-[10px] text-slate-500">{emergencyHotlines.saudiMentalHealth.hoursArabic}</div>
          </div>
          <a
            href={`tel:${emergencyHotlines.saudiMentalHealth.number}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{emergencyHotlines.saudiMentalHealth.number}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
