'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Video, 
  ArrowLeft, 
  Zap, 
  CheckCircle2,
  Phone,
  Sparkles,
  Info,
  Users,
  Compass
} from 'lucide-react';
import { 
  VectorIndividualTherapy, 
  VectorCoupleTherapy, 
  VectorPremaritalTherapy, 
  VectorParentingTherapy, 
  VectorEmergencyTherapy,
  VectorInstitutionalTherapy 
} from '@/components/Vectors';
import TestimonialsSection from '@/components/TestimonialsSection';
import { servicesPricing } from '@/data/pricing';
import CrisisModal from '@/components/CrisisModal';
import ConfidentialityModal from '@/components/ConfidentialityModal';
import CurrencySelector from '@/components/CurrencySelector';
import GroupTherapyWaitlistModal from '@/components/GroupTherapyWaitlistModal';
import { formatPriceInCurrency } from '@/data/currencies';

interface ServiceItem {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  targetAudience: string;
  parentNote?: string;
  howWeWork: string;
  inclusions: string[];
  format: string;
  bg: string;
  border: string;
  tagBg: string;
  btnBg: string;
  image: string;
  isWaitlist?: boolean;
  linkTo?: string;
}

export default function ServicesPage() {
  const [bookingMode, setBookingMode] = useState<'standard' | 'urgent'>('standard');
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [isConfidentialityOpen, setIsConfidentialityOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState<string>('SAR');

  useEffect(() => {
    const saved = localStorage.getItem('selected_currency');
    if (saved) setCurrentCurrency(saved);
  }, []);

  const handleCurrencyChange = (code: string) => {
    setCurrentCurrency(code);
    localStorage.setItem('selected_currency', code);
  };

  const services: ServiceItem[] = [
    {
      id: 'psychological',
      title: 'الاستشارات النفسية الفردية',
      category: 'جلسة خاصة • 50 دقيقة',
      subtitle: 'مساحة استماع آمنة لفهم المشاعر العميقة، فهم القلق والتعامل معه، واستعادة الاتزان والقدرة على الصمود.',
      targetAudience: 'للأفراد الذين يمرون بضغوط حياتية أو مهنية، قلق العلاقات، أو صدمات وتحديات متكررة.',
      howWeWork: 'برؤية قيمية مستمدة من الوحي مع الاستفادة من علم النفس الحديث والأدوات المعرفية والسلوكية.',
      inclusions: [
        'فهم الرسائل والدوافع الكامنة خلف المشاعر والسلوك',
        'استراتيجيات عملية لإدارة نوبات التوتر والقلق اليومي',
        'بناء القدرة على الصمود ورفع تقدير الذات'
      ],
      format: 'لقاء فيديو خاص وآمن عبر Google Meet',
      bg: 'bg-[#FDF1EE] dark:bg-[#251816]/70',
      border: 'border-[#F8DDD9] dark:border-[#42221E]',
      tagBg: 'bg-white/80 dark:bg-black/30 text-[#CC4E46]',
      btnBg: 'bg-[#CC4E46] hover:bg-[#B33D35] text-white',
      image: '/assets/arabtherapy/girl-animation.svg'
    },
    {
      id: 'marital',
      title: 'الاستشارات الزوجية والأسرية',
      category: 'جلسة زوجية مشتركة أو فردية',
      subtitle: 'مساندة متخصصة حين يتوقف الحوار بينكما، ولعلاج الخلافات المتكررة وإعادة بناء الأمان والمودة بين الشريكين.',
      targetAudience: 'للأزواج الذين يواجهون صعوبات في التواصل، فتوراً في العلاقة، أو نزاعات مستمرة.',
      howWeWork: 'برؤية قيمية مستمدة من الوحي مع الاستفادة من علم النفس الحديث وميثاق الشراكة الزوجية.',
      inclusions: [
        'تحليل ديناميكية الخلاف وفك شفرات سوء الفهم',
        'بناء جسور الحوار البناء والتعبير عن الاحتياجات بأمان',
        'وضع حلول واقعية متفق عليها تحمي استقرار البيت'
      ],
      format: 'لقاء فيديو خاص وآمن عبر Google Meet (حضور مشترك بموافقة الطرفين أو فردي)',
      bg: 'bg-[#EDF5FD] dark:bg-[#122238]/70',
      border: 'border-[#D6E6F8] dark:border-[#1E3A5F]',
      tagBg: 'bg-white/80 dark:bg-black/30 text-[#154F9C]',
      btnBg: 'bg-[#154F9C] hover:bg-[#103D7A] text-white',
      image: '/assets/arabtherapy/couple-animation.svg'
    },
    {
      id: 'adolescent',
      title: 'علاج وإرشاد المراهقين واليافعين',
      category: 'جلسات خاصة لليافعين والمراهقين',
      subtitle: 'مساندة دافئة لفهم تحولات سن المراهقة، استيعاب تقلبات المشاعر، وبناء شخصية متزنة وواعية.',
      targetAudience: 'لليافعين والمراهقين الذين يواجهون ضغوط الدراسة، التردد، تقلبات الهوية، أو التوتر.',
      parentNote: 'يتضمن هذا المسار جلسة استطلاعية وتواصلاً استشارياً دورياً مع الوالدين لتوفير بيئة داعمة في البيت.',
      howWeWork: 'برؤية قيمية مستمدة من الوحي مع الاستفادة من علم النفس الحديث، مع احترام كامل لخصوصية المراهق.',
      inclusions: [
        'فهم طبيعة التغيرات النفسية والهرمونية وسلوك المراهق',
        'أدوات عملية لبناء التقدير الذاتي وإدارة نوبات الغضب',
        'توجيه مستمر للوالدين حول مهارات الإصغاء والاحتواء الهادئ'
      ],
      format: 'لقاء فيديو خاص عبر Google Meet (بموافقة الوالدين)',
      bg: 'bg-[#FEF9EC] dark:bg-[#2E2413]/70',
      border: 'border-[#FDF0CD] dark:border-[#4D3A1B]',
      tagBg: 'bg-white/80 dark:bg-black/30 text-[#D97706]',
      btnBg: 'bg-[#D97706] hover:bg-[#B45309] text-white',
      image: '/assets/arabtherapy/boy-animation.svg'
    },
    {
      id: 'premarital',
      title: 'الإعداد للحياة الزوجية (ميثاق)',
      category: 'تأهيل المقبلين على الزواج',
      subtitle: 'برنامج استشاري وقائي لتأهيل البدايات، فهم سيكولوجية الشريك، وإدارة التوقعات بواقعية.',
      targetAudience: 'للمخطوبين والمقبلين على الزواج لبناء أسس متينة لبيت آمن ومستقر.',
      howWeWork: 'برؤية قيمية مستمدة من الوحي مع الاستفادة من علم النفس الحديث وأسس الاختيار المتوازن.',
      inclusions: [
        'فهم الفروق النفسية وأساليب التعبير عن المشاعر',
        'مهارات إدارة الخلاف قبل وقوعه والتعامل مع التدخلات',
        'استكشاف التوافق وتحديد معايير الشراكة الزوجية'
      ],
      format: 'جلسات استشارية تأهيلية عبر Google Meet',
      bg: 'bg-[#FEF9EC] dark:bg-[#2E2413]/70',
      border: 'border-[#FDF0CD] dark:border-[#4D3A1B]',
      tagBg: 'bg-white/80 dark:bg-black/30 text-[#D97706]',
      btnBg: 'bg-[#D97706] hover:bg-[#B45309] text-white',
      image: '/assets/arabtherapy/why-02.svg'
    },
    {
      id: 'parenting',
      title: 'الاستشارات التربوية والوالدية',
      category: 'إرشاد الوالدين والمربين',
      subtitle: 'فهم دوافع سلوك الأبناء واليافعين، وتطوير أساليب تربوية واعية قائمة على الرحمة والحزم دون صراخ.',
      targetAudience: 'للآباء والأمهات الذين يواجهون عناد الأبناء، صعوبات المراهقة، أو توتراً وعصبية والدية.',
      howWeWork: 'برؤية قيمية مستمدة من الوحي مع الاستفادة من علم النفس الحديث ونظرية الارتباط التربوي.',
      inclusions: [
        'تفسير السلوك المشكل وفهم الاحتياج غير المشبع لدى الطفل',
        'استراتيجيات الحزم الهادئ وتقليل الانفعال المنزلي',
        'بناء علاقة ثقة وصداقة عميقة مع المراهقين'
      ],
      format: 'جلسات إرشادية للوالدين عبر Google Meet',
      bg: 'bg-[#EDF7F5] dark:bg-[#112924]/70',
      border: 'border-[#D6EEEA] dark:border-[#1F4A42]',
      tagBg: 'bg-white/80 dark:bg-black/30 text-[#4E7E76]',
      btnBg: 'bg-[#4E7E76] hover:bg-[#3D655E] text-white',
      image: '/assets/arabtherapy/boy-animation.svg'
    },
    {
      id: 'groupTherapy',
      title: 'المجموعات العلاجية والإرشادية (Group Therapy)',
      category: 'قريباً • قائمة انتظار',
      subtitle: 'مساحات تعافٍ وتشارك جماعية مغلقة تضم عدداً محدوداً من المشاركين لتبادل الخبرات وتجاوز التحديات.',
      targetAudience: 'للأفراد الباحثين عن إسناد جماعي آمن وتبادل خبرات داعمة تحت إشراف وتيسير استشاري متخصص.',
      howWeWork: 'برؤية قيمية مستمدة من الوحي مع الاستفادة من علم النفس الحديث في الإرشاد الجمعي والتعافي المشترك.',
      inclusions: [
        'لقاءات تفاعلية مغلقة تضم 6 إلى 8 مشاركين فقط',
        'بيئة آمنة تخضع لقواعد سرية مشددة تحمي خصوصية الجميع',
        'أدوات تكيف وتمارين وتطبيقات سلوكية أسبوعية موجهة'
      ],
      format: 'لقاءات دورية عبر Google Meet',
      bg: 'bg-[#F4EFFC] dark:bg-[#241738]/70',
      border: 'border-[#E5D9F8] dark:border-[#3D2561]',
      tagBg: 'bg-white/80 dark:bg-black/30 text-[#7C3AED]',
      btnBg: 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white',
      image: '/assets/arabtherapy/instant-session.svg',
      isWaitlist: true
    },
    {
      id: 'institutions',
      title: 'تطوير المعلمين والمؤسسات التعليمية',
      category: 'ورش وتأهيل مهني للكوادر',
      subtitle: 'تطوير القيادات المدرسية والمعلمين، وتصميم بروتوكولات التدخل السلوكي والرعاية النفسية للطلاب.',
      targetAudience: 'للمدارس الكبرى، المؤسسات التعليمية، والمراكز التي ترغب في رفع كفاءة كادرها التربوي.',
      howWeWork: 'برؤية قيمية مستمدة من الوحي مع الاستفادة من علم النفس التربوي وأحدث استراتيجيات إدارة السلوك.',
      inclusions: [
        'حقائب تدريبية متخصصة للمعلمين والأخصائيين النفسيين',
        'بناء أدلة وسياسات التدخل التربوي وحماية المتعلمين',
        'استشارات مؤسسية وإشراف فني على الأقسام الإرشادية'
      ],
      format: 'برامج تفاعلية حضورية أو عبر المنصات الرقمية',
      bg: 'bg-[#EDF7F5] dark:bg-[#112924]/70',
      border: 'border-[#D6EEEA] dark:border-[#1F4A42]',
      tagBg: 'bg-white/80 dark:bg-black/30 text-[#4E7E76]',
      btnBg: 'bg-[#4E7E76] hover:bg-[#3D655E] text-white',
      image: '/assets/arabtherapy/instant-session.svg',
      linkTo: '/courses/institutions'
    }
  ];

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFCFA] dark:bg-[#0D1117] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-12 pb-10 sm:pt-16 sm:pb-12 px-4 sm:px-6 text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDF7F5] dark:bg-[#112924] border border-[#D6EEEA] dark:border-[#1F4A42] text-xs font-bold text-[#4E7E76] dark:text-[#5E988E]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>استشارات فردية وأسرية وتربوية أونلاين</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          الجلسات والاستشارات المتخصصة
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          اختر المسار الملائم لاحتياجك، واحجز موعدك مباشرة عبر جدول المواعيد بخصوصية والتزام تام بالسرية المهنية.
        </p>

        {/* 48h cancellation & reassurance */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <button 
            type="button" 
            onClick={() => setIsConfidentialityOpen(true)}
            className="flex items-center gap-1.5 hover:text-[#4E7E76] transition cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#4E7E76]" />
            <span>نلتزم بالسرية المهنية (ما حدود السرية؟)</span>
          </button>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#CC4E46]" />
            <span>إلغاء وإعادة جدولة مجانية حتى 48 ساعة</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Video className="w-4 h-4 text-[#154F9C]" />
            <span>لقاء مباشر عبر Google Meet</span>
          </div>
        </div>
      </section>

      {/* Multi-Currency Price Selector & Services Grid */}
      <section className="py-8 px-4 sm:px-6 max-w-6xl mx-auto space-y-6 w-full">
        
        {/* Currency Switcher */}
        <div className="max-w-4xl mx-auto">
          <CurrencySelector
            currentCurrency={currentCurrency}
            onCurrencyChange={handleCurrencyChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div 
              key={srv.id}
              className={`p-6 sm:p-7 rounded-3xl border ${srv.bg} ${srv.border} flex flex-col justify-between space-y-6 shadow-2xs hover:shadow-md transition-all`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${srv.tagBg} border border-black/5`}>
                    {srv.category}
                  </span>
                  <div className="shrink-0 -mt-2 -mr-2">
                    <img 
                      src={srv.image} 
                      alt={srv.title} 
                      loading="lazy"
                      className="w-24 h-24 sm:w-28 sm:h-28 object-contain" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {srv.subtitle}
                  </p>
                </div>

                {/* لمن تناسب */}
                <div className="p-3 rounded-2xl bg-white/70 dark:bg-black/25 text-[11px] space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-200">لمن تناسب:</span>
                  <p className="text-slate-500 dark:text-slate-400 font-normal">{srv.targetAudience}</p>
                </div>

                {/* ملاحظة إشراك الوالدين إذا كانت خاصة باليافعين */}
                {srv.parentNote && (
                  <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-200 space-y-0.5">
                    <span className="font-bold block">ملاحظة إشراك الوالدين:</span>
                    <p className="font-normal leading-relaxed">{srv.parentNote}</p>
                  </div>
                )}

                {/* كيف نعمل والرؤية القيمية */}
                <div className="p-3 rounded-2xl bg-white/70 dark:bg-black/25 text-[11px] space-y-1">
                  <span className="font-bold text-[#4E7E76] dark:text-[#5E988E] block">كيف نعمل:</span>
                  <p className="text-slate-600 dark:text-slate-300 font-normal leading-relaxed">{srv.howWeWork}</p>
                  <p className="text-[10px] text-slate-400 pt-0.5">
                    * يمكنك تحديد النهج المفضل (إطار قيمي إسلامي أو نهج نفسي عام) عند الحجز.
                  </p>
                </div>

                {/* المحتويات */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">ما الذي تتضمنه:</span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-normal">
                    {srv.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4E7E76] shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                {srv.isWaitlist ? (
                  <button
                    type="button"
                    onClick={() => setIsWaitlistOpen(true)}
                    className={`w-full py-3 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-2 ${srv.btnBg} transition-all shadow-sm cursor-pointer`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>سجّل في قائمة الانتظار</span>
                  </button>
                ) : srv.linkTo ? (
                  <a
                    href={srv.linkTo}
                    className={`w-full py-3 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-2 ${srv.btnBg} transition-all shadow-sm`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>استكشف تفاصيل التدريب المؤسسي</span>
                  </a>
                ) : (
                  <a
                    href="#book"
                    className={`w-full py-3 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-2 ${srv.btnBg} transition-all shadow-sm`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>احجز موعد هذه الجلسة</span>
                  </a>
                )}

                {servicesPricing[srv.id] && (
                  <div className="text-center pt-1 space-y-0.5">
                    <div className="text-xs font-black text-slate-800 dark:text-slate-200">
                      {srv.id === 'adolescent'
                        ? '{{PRICE_TODO}}'
                        : servicesPricing[srv.id].amount
                          ? `تبدأ من ${formatPriceInCurrency(servicesPricing[srv.id].amount, currentCurrency)}`
                          : servicesPricing[srv.id].priceDisplay}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {servicesPricing[srv.id].priceSubtitle}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency 24h WhatsApp Booking Banner (Arab Therapy Instant Session pattern) */}
      <section className="py-8 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F4EFFC] dark:bg-[#241738]/80 border border-[#E5D9F8] dark:border-[#3D2561] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-3 text-right">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-black/30 text-[#7C3AED] text-xs font-bold">
                <Zap className="w-3.5 h-3.5" />
                <span>خدمة الحجز السريع والمباشر</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CC4E46]/10 text-[#CC4E46] dark:text-[#F87171] text-xs font-black border border-[#CC4E46]/20">
                تسعير خاص: 500 ر.س
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              هل تمر بظرف ضاغط وتحتاج لجلسة عاجلة؟
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl font-normal leading-relaxed">
              إذا كنت بحاجة إلى استماع وتوجيه عاجل خلال 24 ساعة دون انتظار المواعيد المجدولة، يمكنك طلب الحجز الطارئ مباشرة عبر واتساب المخصص (تسعير مستقل للاستجابة الفورية).
            </p>
            
            {/* Safety & Crisis Notice */}
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-black/40 border border-[#E5D9F8] dark:border-[#3D2561] text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
              <p className="font-semibold text-rose-700 dark:text-rose-400">
                ⚠️ هذه الخدمة لتنسيق موعد عاجل وليست خدمة إنقاذ. إذا كنت أو كان شخص قريب منك في خطر مباشر، تواصل فوراً مع الطوارئ في بلدك.
              </p>
              <button
                type="button"
                onClick={() => setIsCrisisOpen(true)}
                className="text-[11px] font-bold text-[#7C3AED] dark:text-[#A78BFA] underline hover:opacity-80 block"
              >
                عرض أرقام خطوط الطوارئ والدعم النفسي المعتمدة ⭠
              </button>
            </div>
          </div>

          <a
            href="https://wa.me/201014876666?text=%D8%B7%D9%84%D8%A8%20%D8%AD%D8%AC%D8%B6%20%D8%B7%D8%A7%D8%B1%D8%A6%20%D8%AE%D9%84%D8%A7%D9%84%2024%20%D8%B3%D8%A7%D8%B9%D8%A9"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-7 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold flex items-center gap-2 transition shadow-md shadow-[#7C3AED]/25"
          >
            <Phone className="w-4 h-4" />
            <span>طلب حجز طارئ (500 ر.س) عبر واتساب</span>
          </a>
        </div>
      </section>

      {/* Testimonials Section in Services Page */}
      <TestimonialsSection 
        title="آراء وتجارب المستفيدين من الجلسات" 
        subtitle="تجارب حقيقية تعكس أثر جلسات الاستماع والتوجيه السلوكي والأسري"
        limit={6}
      />

      {/* Booking Calendar Section (Calendly Embed) */}
      <section id="book" className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto w-full space-y-8">
        
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            جدول حجز المواعيد المباشر
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            اختر اليوم والوقت الملائم لك من الجدول أدناه، وسيصلك تأكيد الحجز ورابط اللقاء على Google Meet مباشرة.
          </p>
        </div>

        {/* Embedded Calendly Frame with Arab Therapy styled wrapper */}
        <div className="bg-white dark:bg-[#161F2B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-2 sm:p-4 shadow-lg overflow-hidden">
          <div className="w-full min-h-[680px]">
            <iframe
              src="https://calendly.com/galal3hmad/insan?embed_domain=galalahmad.com&embed_type=Inline&hide_landing_page_details=1&hide_gdpr_banner=1"
              width="100%"
              height="680"
              frameBorder="0"
              title="جدول حجز الجلسات - جلال أحمد"
              className="w-full rounded-2xl"
            />
          </div>
        </div>

        {/* Booking Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-center">
          <div className="p-4 rounded-2xl bg-[#EDF7F5] dark:bg-[#112924] border border-[#D6EEEA] dark:border-[#1F4A42] space-y-1">
            <ShieldCheck className="w-5 h-5 mx-auto text-[#4E7E76]" />
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">نلتزم بالسرية المهنية</h4>
            <button
              type="button"
              onClick={() => setIsConfidentialityOpen(true)}
              className="text-[11px] text-[#4E7E76] dark:text-[#5E988E] underline font-bold hover:opacity-80"
            >
              ما حدود السرية؟
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#FDF1EE] dark:bg-[#251816] border border-[#F8DDD9] dark:border-[#42221E] space-y-1">
            <Clock className="w-5 h-5 mx-auto text-[#CC4E46]" />
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">مرونة 48 ساعة</h4>
            <p className="text-[11px] text-slate-500 font-normal">إلغاء وإعادة جدولة مجانية</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#EDF5FD] dark:bg-[#122238] border border-[#D6E6F8] dark:border-[#1E3A5F] space-y-1">
            <Video className="w-5 h-5 mx-auto text-[#154F9C]" />
            <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">أونلاين بأمان</h4>
            <p className="text-[11px] text-slate-500 font-normal">Google Meet من أي مكان بالعالم</p>
          </div>
        </div>

      </section>

      <Footer />

      <CrisisModal isOpen={isCrisisOpen} onClose={() => setIsCrisisOpen(false)} />
      <ConfidentialityModal isOpen={isConfidentialityOpen} onClose={() => setIsConfidentialityOpen(false)} />
      <GroupTherapyWaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </main>
  );
}
