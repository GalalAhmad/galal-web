export interface ServicePricing {
  id: string;
  title: string;
  priceDisplay: string;
  priceSubtitle: string;
  currency: string;
  amount?: number;
  durationText: string;
  badgeStyle: string;
}

export const servicesPricing: Record<string, ServicePricing> = {
  psychological: {
    id: 'psychological',
    title: 'الاستشارات النفسية الفردية',
    priceDisplay: 'تبدأ من 250 ر.س',
    priceSubtitle: 'جلسة 50 دقيقة أونلاين • أو ما يعادلها بالعملات الأخرى',
    currency: 'SAR',
    amount: 250,
    durationText: '50 دقيقة',
    badgeStyle: 'bg-[#EDF7F5] dark:bg-[#112924] text-[#4E7E76] dark:text-[#5E988E] border-[#D6EEEA] dark:border-[#1F4A42]',
  },
  marital: {
    id: 'marital',
    title: 'الاستشارات الزوجية والأسرية',
    priceDisplay: 'تبدأ من 350 ر.س',
    priceSubtitle: 'جلسة ثنائية أو فردية 60-75 دقيقة • لقاء فيديو مشفر',
    currency: 'SAR',
    amount: 350,
    durationText: '60 - 75 دقيقة',
    badgeStyle: 'bg-[#EDF5FD] dark:bg-[#122238] text-[#154F9C] dark:text-[#60A5FA] border-[#D6E6F8] dark:border-[#1E3A5F]',
  },
  parenting: {
    id: 'parenting',
    title: 'الإرشاد الوالدي والتربوي',
    priceDisplay: 'تبدأ من 250 ر.س',
    priceSubtitle: 'جلسة استشارية 50 دقيقة للمربين أو اليافعين',
    currency: 'SAR',
    amount: 250,
    durationText: '50 دقيقة',
    badgeStyle: 'bg-[#FEF9EC] dark:bg-[#2E2413] text-[#D97706] dark:text-[#F59E0B] border-[#FDF0CD] dark:border-[#4D3A1B]',
  },
  emergency: {
    id: 'emergency',
    title: 'الحجز الطارئ والعاجل (24 ساعة)',
    priceDisplay: '500 ر.س',
    priceSubtitle: 'تسعير خاص ومستقل للاستجابة العاجلة وتنسيق موعد استثنائي',
    currency: 'SAR',
    amount: 500,
    durationText: 'خلال 24 ساعة',
    badgeStyle: 'bg-[#FDF1EE] dark:bg-[#251816] text-[#CC4E46] dark:text-[#F87171] border-[#F8DDD9] dark:border-[#42221E]',
  },
  institutional: {
    id: 'institutional',
    title: 'الاستشارات المؤسسية والتعليمية',
    priceDisplay: 'حسب نطاق العمل',
    priceSubtitle: 'تأهيل الكوادر وتصميم برامج المدارس والمراكز',
    currency: 'Custom',
    durationText: 'مشاريع مؤسسية',
    badgeStyle: 'bg-[#F4EFFC] dark:bg-[#241738] text-[#7C3AED] dark:text-[#A78BFA] border-[#E5D9F8] dark:border-[#3D2561]',
  },
};

export const coursesPricing: Record<string, { priceDisplay: string; note: string; badgeStyle: string }> = {
  'rifq-mithaq': {
    priceDisplay: 'يُحدد عند فتح التسجيل',
    note: '8 محطات تدريبية وتطبيقية شاملة كراسة المتدرب وميثاق الأسرة',
    badgeStyle: 'bg-[#EDF5FD] dark:bg-[#122238] text-[#154F9C] dark:text-[#60A5FA] border-[#D6E6F8] dark:border-[#1E3A5F]',
  },
  'rifq-premarital': {
    priceDisplay: 'يُحدد عند فتح التسجيل',
    note: '8 محطات تدريبية لتأهيل المقبلين والمخطوبين شاملة كراسة المسافر',
    badgeStyle: 'bg-[#EDF7F5] dark:bg-[#112924] text-[#4E7E76] dark:text-[#5E988E] border-[#D6EEEA] dark:border-[#1F4A42]',
  },
  'rifq-journey': {
    priceDisplay: 'يُحدد عند فتح التسجيل',
    note: 'برنامج تدريبي متكامل شامل كراسة التطبيق',
    badgeStyle: 'bg-[#EDF7F5] dark:bg-[#112924] text-[#4E7E76] dark:text-[#5E988E] border-[#D6EEEA] dark:border-[#1F4A42]',
  },
  'mithaq-program': {
    priceDisplay: 'يُحدد عند فتح التسجيل',
    note: '8 محطات تدريبية تفاعلية + كراسة المتدرب',
    badgeStyle: 'bg-[#EDF5FD] dark:bg-[#122238] text-[#154F9C] dark:text-[#60A5FA] border-[#D6E6F8] dark:border-[#1E3A5F]',
  },
  'masaha-workshop': {
    priceDisplay: 'يُعلن قريباً',
    note: 'التسجيل يفتح مع الدفعة القادمة • سجل اهتمامك أولاً',
    badgeStyle: 'bg-[#F4EFFC] dark:bg-[#241738] text-[#7C3AED] dark:text-[#A78BFA] border-[#E5D9F8] dark:border-[#3D2561]',
  },
};
