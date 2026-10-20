export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rateFromSar: number; // 1 SAR = rateFromSar in target currency
  decimals: number;
}

export const supportedCurrencies: Record<string, Currency> = {
  SAR: {
    code: 'SAR',
    name: 'ريال سعودي (الأساسي)',
    symbol: 'ر.س',
    rateFromSar: 1.0,
    decimals: 0,
  },
  EGP: {
    code: 'EGP',
    name: 'جنيه مصري',
    symbol: 'ج.م',
    rateFromSar: 13.0,
    decimals: 0,
  },
  JOD: {
    code: 'JOD',
    name: 'دينار أردني',
    symbol: 'د.أ',
    rateFromSar: 0.19,
    decimals: 1,
  },
  AED: {
    code: 'AED',
    name: 'درهم إماراتي',
    symbol: 'د.إ',
    rateFromSar: 0.98,
    decimals: 0,
  },
  KWD: {
    code: 'KWD',
    name: 'دينار كويتي',
    symbol: 'د.ك',
    rateFromSar: 0.082,
    decimals: 2,
  },
  QAR: {
    code: 'QAR',
    name: 'ريال قطري',
    symbol: 'ر.ق',
    rateFromSar: 0.97,
    decimals: 0,
  },
};

export const DEFAULT_CURRENCY_CODE = 'SAR';

export function formatPriceInCurrency(sarAmount: number | undefined, currencyCode: string): string {
  if (sarAmount === undefined || isNaN(sarAmount)) {
    return '{{PRICE_TODO}}';
  }

  const currency = supportedCurrencies[currencyCode] || supportedCurrencies.SAR;
  const converted = sarAmount * currency.rateFromSar;
  
  if (currency.decimals === 0) {
    return `${Math.round(converted).toLocaleString('ar-EG')} ${currency.symbol}`;
  } else {
    return `${converted.toFixed(currency.decimals)} ${currency.symbol}`;
  }
}
