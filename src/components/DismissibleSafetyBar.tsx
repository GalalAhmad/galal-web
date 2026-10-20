'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, X } from 'lucide-react';

interface DismissibleSafetyBarProps {
  onOpenCrisisModal: () => void;
}

export default function DismissibleSafetyBar({ onOpenCrisisModal }: DismissibleSafetyBarProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('galal_safety_bar_dismissed');
      if (saved === 'true') setDismissed(true);
    } catch (e) {}
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('galal_safety_bar_dismissed', 'true');
    } catch (e) {}
  };

  if (dismissed) return null;

  return (
    <aside 
      aria-label="تنبيه الطوارئ والحالات الحرجة"
      className="bg-amber-500/10 dark:bg-amber-950/40 border-b border-amber-500/20 py-2 px-4 text-center text-xs text-amber-900 dark:text-amber-200 transition-all"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center justify-center gap-2 flex-1 text-center font-medium">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            خدمات الموقع استشارية مجدولة وليست للتدخل الطبي الطارئ. في حالات الخطر المباشر،{' '}
            <button
              onClick={onOpenCrisisModal}
              className="font-bold underline hover:text-amber-700 dark:hover:text-amber-100 cursor-pointer"
            >
              راجع أرقام الطوارئ والدعم النفسي هنا ←
            </button>
          </span>
        </div>

        <button
          onClick={handleDismiss}
          className="p-1 rounded-md text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 transition"
          aria-label="إغلاق التنبيه"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
