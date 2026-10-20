'use client';

import React, { useState } from 'react';
import { ShieldAlert, Phone, X, AlertTriangle, ExternalLink, Heart } from 'lucide-react';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const emergencyHelplines = [
  {
    country: 'المملكة العربية السعودية',
    code: 'SA',
    hotline: '{{HELPLINE_SA}}',
    label: 'الخط الساخن الوطني للصحة النفسية / الطوارئ',
    generalEmergency: '997 (الهلال الأحمر) / 911 (الطوارئ)',
  },
  {
    country: 'جمهورية مصر العربية',
    code: 'EG',
    hotline: '{{HELPLINE_EG}}',
    label: 'أمانة الصحة النفسية وعلاج الإدمان',
    generalEmergency: '123 (الإسعاف)',
  },
  {
    country: 'المملكة الأردنية الهاشمية',
    code: 'JO',
    hotline: '{{HELPLINE_JO}}',
    label: 'خط الدعم والمساعدة النفسية',
    generalEmergency: '911 (الطوارئ الموحدة)',
  },
  {
    country: 'دولة الإمارات العربية المتحدة',
    code: 'AE',
    hotline: '{{HELPLINE_AE}}',
    label: 'خط مساندة الصحة النفسية (وقاية)',
    generalEmergency: '998 (الإسعاف)',
  },
  {
    country: 'دولة الكويت',
    code: 'KW',
    hotline: '{{HELPLINE_KW}}',
    label: 'خط الاستشارات النفسية',
    generalEmergency: '112 (طوارئ الكويت)',
  },
  {
    country: 'دولة قطر',
    code: 'QA',
    hotline: '{{HELPLINE_QA}}',
    label: 'خط المساعدة الوطني للصحة النفسية',
    generalEmergency: '999 (الإسعاف والطوارئ)',
  },
];

export default function CrisisModal({ isOpen, onClose }: CrisisModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#111827] border border-rose-200 dark:border-rose-900/60 shadow-2xl p-6 sm:p-8 text-right space-y-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="crisis-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="إغلاق النافذة"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with High-Contrast Alert */}
        <div className="flex items-start gap-3.5 border-b border-rose-100 dark:border-rose-950 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 flex items-center justify-center shrink-0 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
              توجيه عاجل للحالات الطارئة
            </span>
            <h2 id="crisis-modal-title" className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
              في حالة الخطر أو الطوارئ النفسية
            </h2>
          </div>
        </div>

        {/* Critical Notice */}
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 leading-relaxed font-semibold">
          جلسات هذا الموقع مخصصة للدعم النفسي والتربوي المجدول، <strong>وليست خدمة إسعاف أو إنقاذ طارئ</strong>. إذا كنت أنت أو شخص قريب منك في خطر مباشر على الحياة أو تواجه أفكاراً لإيذاء النفس، يُرجى التوجه فوراً إلى أقرب قسم طوارئ بمستشفى أو الاتصال بأرقام المساعدة المباشرة أدناه:
        </div>

        {/* Country Directory */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-700 dark:text-slate-300">
            أرقام خطوط الدعم والطوارئ حسب الدولة:
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            {emergencyHelplines.map((item) => (
              <div 
                key={item.code}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <strong className="text-slate-900 dark:text-slate-100 block font-bold">
                    {item.country}
                  </strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {item.label}: <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{item.hotline}</span>
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 dark:text-slate-300 font-mono bg-white dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200/60 dark:border-slate-700 self-start sm:self-auto">
                  {item.generalEmergency}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Fallback */}
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>خارج هذه الدول؟ توجه مباشرة إلى أقرب مستشفى أو مركز رعاية طبية في بلدك.</span>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold transition"
          >
            فهمت، إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
}
