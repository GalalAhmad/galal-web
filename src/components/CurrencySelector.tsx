'use client';

import React, { useEffect, useState } from 'react';
import { supportedCurrencies, DEFAULT_CURRENCY_CODE } from '@/data/currencies';
import { Globe, Coins } from 'lucide-react';

interface CurrencySelectorProps {
  currentCurrency: string;
  onCurrencyChange: (code: string) => void;
  showNote?: boolean;
}

export default function CurrencySelector({
  currentCurrency,
  onCurrencyChange,
  showNote = true,
}: CurrencySelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200 dark:border-slate-800 shadow-2xs text-right">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
        <Coins className="w-4 h-4 text-[#4E7E76] shrink-0" />
        <span>عرض الأسعار التقريبية بالعملة:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {Object.values(supportedCurrencies).map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => onCurrencyChange(c.code)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentCurrency === c.code
                ? 'bg-[#4E7E76] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {c.name} ({c.symbol})
          </button>
        ))}
      </div>

      {showNote && (
        <span className="text-[10px] text-slate-400 font-normal">
          * الأسعار تقريبية استرشادية، ويتم تأكيد المبلغ النهائي عند تأكيد الحجز.
        </span>
      )}
    </div>
  );
}
