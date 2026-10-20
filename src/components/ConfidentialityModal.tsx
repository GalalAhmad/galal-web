'use client';

import React from 'react';
import { ShieldCheck, X, AlertCircle, Lock } from 'lucide-react';

interface ConfidentialityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfidentialityModal({ isOpen, onClose }: ConfidentialityModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-right space-y-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confidentiality-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="إغلاق النافذة"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EDF7F5] dark:bg-[#112924] flex items-center justify-center text-[#4E7E76] dark:text-[#5E988E] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 id="confidentiality-modal-title" className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              ميثاق وحدود السرية المهنية
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              وفق المعايير الأخلاقية والمهنية المعتمدة للإرشاد والاستشارات
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          <p>
            <strong>الأصل في كافة الجلسات:</strong> الالتزام التام بالسرية المهنية، فلا يتم تسجيل الجلسات أو مشاركة بيانات المستفيد أو محتوى الحديث مع أي طرف خارجي.
          </p>

          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2">
            <span className="font-bold text-amber-900 dark:text-amber-300 block flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>استثناءات وحدود السرية القانونية والأخلاقية:</span>
            </span>
            <ul className="space-y-1.5 pr-4 list-disc text-amber-900 dark:text-amber-200 text-[11px]">
              <li>وجود خطر مباشر ووشيك على حياة المستفيد (نية مؤكدة لإيذاء النفس) أو حياة شخص آخر.</li>
              <li>حالات الإساءة الجسدية أو الإهمال الشديد للأطفال أو القُصّر أو الفئات المعالة الضعيفة.</li>
              <li>الأوامر والطلبات القضائية الملزمة الصادرة عن الجهات العدلية المختصة نظاماً.</li>
            </ul>
          </div>

          <p className="text-[11px] text-slate-500">
            في حال تحقق أي من هذه الاستثناءات النادرة، يقتصر الإجراء على التدخل الضروري لحماية الأرواح وبالحد الأدنى اللازم وفق القانون.
          </p>
        </div>

        <div className="pt-2 text-left">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#4E7E76] text-white text-xs font-bold hover:bg-[#3D655E] transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
