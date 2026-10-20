'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Calendar, 
  BookOpen, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  Video, 
  Sparkles, 
  Users, 
  HeartHandshake, 
  Building2, 
  GraduationCap, 
  CheckCircle2, 
  ChevronDown, 
  Phone, 
  Send, 
  Compass, 
  Heart,
  Brain,
  MessageSquareHeart,
  Zap,
  Award,
  Layers
} from 'lucide-react';
import TestimonialsSection from '@/components/TestimonialsSection';
import { servicesPricing } from '@/data/pricing';

export default function HomePage() {
  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const services = [
    {
      id: 'psychological',
      title: 'استشارات نفسية فردية',
      tag: 'جلسة خاصة • 50 دقيقة',
      desc: 'مساحة استماع آمنة لتفكيك القلق والضغوط اليومية، فهم المشاعر العميقة، واستعادة الاتزان والصلابة الذاتية.',
      bg: 'bg-[#FDF1EE] dark:bg-[#251816]/70',
      border: 'border-[#F8DDD9] dark:border-[#42221E]',
      tagBg: 'bg-white/80 dark:bg-black/30 text-[#CC4E46]',
      btnBg: 'bg-[#CC4E46] hover:bg-[#B33D35] text-white',
      image: '/assets/arabtherapy/girl-animation.svg',
      btnText: 'احجز جلستك النفسية',
      href: '/services#book',
    },
    {
      id: 'marital',
      title: 'استشارات زوجية وأسرية',
      tag: 'جلسة ثنائية أو فردية • 60-75 دقيقة',
      desc: 'معالجة الخلافات المتكررة وفك الانسداد الحواري، وإعادة بناء جسور الأمان والمودة والتفاهم المشترك بين الشريكين.',
      bg: 'bg-[#EDF5FD] dark:bg-[#122238]/70',
      border: 'border-[#D6E6F8] dark:border-[#1E3A5F]',
      tagBg: 'bg-white/80 dark:bg-black/30 text-[#154F9C]',
      btnBg: 'bg-[#154F9C] hover:bg-[#103D7A] text-white',
      image: '/assets/arabtherapy/couple-animation.svg',
      btnText: 'احجز جلستك الزوجية',
      href: '/services#book',
    },
    {
      id: 'emergency',
      title: 'حجز طارئ وعاجل (24 ساعة)',
      tag: '⚡ استجابة عاجلة للظروف الضاغطة',
      desc: 'مسار مباشر لمن يمر بظرف نفسي أو أسري ضاغط ويحتاج لجلسة توجيه استثنائية وسريعة خلال 24 ساعة دون انتظار جدول المواعيد.',
      bg: 'bg-[#FEF2F2] dark:bg-[#2A1515]/70',
      border: 'border-[#FECACA] dark:border-[#521B1B]',
      tagBg: 'bg-white/90 dark:bg-black/40 text-rose-700 dark:text-rose-300 font-black',
      btnBg: 'bg-gradient-to-r from-[#CC4E46] to-[#B33D35] hover:from-[#B33D35] hover:to-[#99261E] text-white shadow-md shadow-[#CC4E46]/25',
      image: '/assets/arabtherapy/instant-session.svg',
      btnText: 'احجز الجلسة الطارئة عبر واتساب ⚡',
      href: 'https://wa.me/201014876666?text=%D8%B7%D9%84%D8%A8%20%D8%AD%D8%AC%D8%B6%20%D8%B7%D8%A7%D8%B1%D8%A6%20%D8%AE%D9%84%D8%A7%D9%84%2024%20%D8%B3%D8%A7%D8%B9%D8%A9',
      isExternal: true,
      highlightBadge: true
    },
    {
      id: 'parenting',
      title: 'إرشاد تربوي ووالدي',
      tag: 'إرشاد الوالدين والمربين • 50 دقيقة',
      desc: 'فهم الدوافع النفسية خلف سلوك الأبناء واليافعين، وتطوير أساليب تربوية تجمع بين الرفق والحزم دون صراخ.',
      bg: 'bg-[#EDF7F5] dark:bg-[#112924]/70',
      border: 'border-[#D6EEEA] dark:border-[#1F4A42]',
      tagBg: 'bg-white/80 dark:bg-black/30 text-[#4E7E76]',
      btnBg: 'bg-[#4E7E76] hover:bg-[#3D655E] text-white',
      image: '/assets/arabtherapy/boy-animation.svg',
      btnText: 'احجز استشارة تربوية',
      href: '/services#book',
    },
    {
      id: 'premarital-inst',
      title: 'تأهيل المقبلين واستشارات المؤسسات',
      tag: 'تأهيل البدايات وتطوير المدارس',
      desc: 'برامج وقائية للمقبلين على الزواج لبناء شراكة واعية، واستشارات متخصصة لتطوير بيئات التعلم ورعاية المتعلمين.',
      bg: 'bg-[#FEF9EC] dark:bg-[#2E2413]/70',
      border: 'border-[#FDF0CD] dark:border-[#4D3A1B]',
      tagBg: 'bg-white/80 dark:bg-black/30 text-[#D97706]',
      btnBg: 'bg-[#D97706] hover:bg-[#B45309] text-white',
      image: '/assets/arabtherapy/why-02.svg',
      btnText: 'اكتشف برامج بناء وتمكين',
      href: '/courses',
    },
  ];

  const trustPillars = [
    {
      title: 'سرية وأمان تام 100%',
      desc: 'بياناتك ومحادثاتك مشفرة ومحمية بأعلى المعايير الأخلاقية والمهنية. مساحتك آمنة وخاصة تماماً.',
      image: '/assets/arabtherapy/why-01.svg',
    },
    {
      title: 'إرشاد معتمد وموثوق',
      desc: 'مصنف من الهيئة السعودية للتخصصات الصحية (2025) مع أكثر من 18 عاماً من الخبرة الاستشارية والميدانية.',
      image: '/assets/arabtherapy/why-02.svg',
    },
    {
      title: 'مرونة كاملة في المواعيد',
      desc: 'نقدّر ظروفك؛ إمكانية إلغاء أو إعادة جدولة جلستك مجاناً وبكل سهولة حتى 48 ساعة قبل الموعد.',
      image: '/assets/arabtherapy/why-03.svg',
    },
    {
      title: 'جلسات أونلاين براحة منزلك',
      desc: 'لقاءات خاصة عبر Google Meet بجودة صوت وفيديو فائقة من أي دولة، دون عناء التنقل والانتظار.',
      image: '/assets/arabtherapy/why-04.svg',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'اختر نوع جلستك',
      desc: 'حدد المسار الأنسب لاحتياجك (فردي، زوجي، تربوي، أو حجز طارئ عاجل).',
      icon: '/assets/arabtherapy/chat.svg',
    },
    {
      number: '2',
      title: 'اختر الموعد المناسب',
      desc: 'حدد التاريخ والوقت الملائم لك من جدول المواعيد المباشر ليتم التأكيد فوراً.',
      icon: '/assets/arabtherapy/hours.svg',
    },
    {
      number: '3',
      title: 'التقِ في مساحة آمنة',
      desc: 'استلم رابط اللقاء المباشر على Google Meet والتقِ بخصوصية وسرية تامة.',
      icon: '/assets/arabtherapy/quality.svg',
    },
  ];

  const featuredTests = [
    {
      id: 'gad7',
      title: 'مقياس القلق العام',
      category: 'القلق والتوتر',
      desc: 'أداة طبية عالمية معتمدة لقياس أعراض القلق والتوتر النفسي خلال الأسبوعين الماضيين.',
      time: '4 دقائق',
      questions: '7 أسئلة',
      bg: 'bg-[#FFCCCD]/60 dark:bg-[#3D1A1E]/60',
      border: 'border-[#F8B4B6] dark:border-[#5C2329]',
      tagColor: 'text-[#CC4E46] dark:text-[#F87171]',
      href: '/tests'
    },
    {
      id: 'phq9',
      title: 'مقياس تقييم الاكتئاب',
      category: 'المزاج والاكتئاب',
      desc: 'المقياس الإكلينيكي المعتمد لتقييم حدة تقلبات المزاج ومؤشرات الاكتئاب اليومية.',
      time: '6 دقائق',
      questions: '9 أسئلة',
      bg: 'bg-[#A1D0F7]/40 dark:bg-[#122238]/60',
      border: 'border-[#A1D0F7]/70 dark:border-[#1E3A5F]',
      tagColor: 'text-[#154F9C] dark:text-[#60A5FA]',
      href: '/tests'
    },
    {
      id: 'marital-harmony',
      title: 'مقياس الرضا والتوافق الزواجي',
      category: 'العلاقات والأسرة',
      desc: 'تقييم جودة التواصل، الأمان العاطفي، وإدارة الخلافات الزوجية بين الشريكين.',
      time: '5 دقائق',
      questions: '10 أسئلة',
      bg: 'bg-[#D5E3F6]/50 dark:bg-[#15233B]/60',
      border: 'border-[#B8D1F3] dark:border-[#21375C]',
      tagColor: 'text-[#154F9C] dark:text-[#60A5FA]',
      href: '/tests'
    },
    {
      id: 'burnout',
      title: 'مقياس الاحتراق الوظيفي',
      category: 'الضغوط والعمل',
      desc: 'فحص مؤشرات الاستنزاف النفسي والإنهاك العصبي الناتج عن ضغوط العمل والمسؤوليات.',
      time: '6 دقائق',
      questions: '8 أسئلة',
      bg: 'bg-[#BBA1F7]/30 dark:bg-[#251838]/60',
      border: 'border-[#CBB5FA] dark:border-[#3D2561]',
      tagColor: 'text-[#7C3AED] dark:text-[#A78BFA]',
      href: '/tests'
    }
  ];

  const recentArticles = [
    {
      id: 'aqwameyat-quran-family',
      title: 'أقومية القرآن في بناء الأسرة وسواء الفطرة الإنسانية',
      category: 'مشروع أقومية القرآن',
      desc: 'تأصيل منهجي يستلهم من هدايات الوحي ركائز السكن والمودة والرحمة في ضوء الفهم النفسي الحديث.',
      readTime: '6 دقائق قراءة',
      bg: 'bg-[#FEF9EC] dark:bg-[#2E2413]',
      border: 'border-[#FDF0CD] dark:border-[#4D3A1B]',
    },
    {
      id: 'behavior-as-message',
      title: 'السلوك رسالة قبل أن يكون مشكلة: فك شفرات السلوك الإنساني',
      category: 'علم النفس والاتزان',
      desc: 'كيف نقرأ الرسائل الخفية الكامنة خلف عناد الأبناء واضطراب العلاقات بدلاً من معاقبة العَرَض الظاهر.',
      readTime: '4 دقائق قراءة',
      bg: 'bg-[#EDF7F5] dark:bg-[#112924]',
      border: 'border-[#D6EEEA] dark:border-[#1F4A42]',
    },
    {
      id: 'marital-communication-bridges',
      title: 'جسور التواصل الزواجي: من ردود الفعل العفوية إلى الإصغاء الواعي',
      category: 'علاقات وأسرة',
      desc: 'قواعد عملية للانتقال من الصدام والدفاع عن النفس إلى التلاقي الآمن وفهم الاحتياج غير المنطوق.',
      readTime: '5 دقائق قراءة',
      bg: 'bg-[#EDF5FD] dark:bg-[#122238]',
      border: 'border-[#D6E6F8] dark:border-[#1E3A5F]',
    },
  ];

  const faqs = [
    {
      q: 'كيف تتم الجلسات الاستشارية؟ وهل تتطلب الحضور شخصياً؟',
      a: 'جميع الجلسات تتم أونلاين 100% وبسرية تامة عبر منصة Google Meet. يمكنك الانضمام من هاتفك أو حاسوبك من أي مكان في العالم براحة واطمئنان تام.',
    },
    {
      q: 'ما هي سياسة الإلغاء أو إعادة الجدولة؟',
      a: 'نلتزم بمرونة كاملة تقديراً لظروفك؛ يمكنك إعادة جدولة الموعد أو إلغاؤه واسترداد رسومك مجاناً بالكامل حتى 48 ساعة قبل الموعد المحدد.',
    },
    {
      q: 'ما الفرق بين الجلسة العادية والحجز الطارئ (خلال 24 ساعة)؟',
      a: 'الجلسة العادية تُحجز وفق المواعيد المتاحة على التقويم. أما الحجز الطارئ فهو مسار مخصص للظروف الضاغطة والملحة التي لا تحتمل الانتظار، ويتم تنسيق موعدها مباشرة عبر واتساب خلال 24 ساعة.',
    },
    {
      q: 'هل بياناتي وتفاصيل الجلسة محمية بالسرية التامة؟',
      a: 'نعم، بكل تأكيد. تخضع جميع الجلسات لأعلى معايير السرية المهنية والأخلاقية المعتمدة طبياً ونفسياً، ولا يتم تسجيل الجلسات أو مشاركة أي تفاصيل مع أي طرف ثالث تحت أي ظرف.',
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFCFA] dark:bg-[#0D1117] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Google FAQ Schema Markup (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-14 sm:pt-20 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Soft background aura */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#4E7E76]/10 via-[#CC4E46]/5 to-transparent blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDF7F5] dark:bg-[#112924] border border-[#D6EEEA] dark:border-[#1F4A42] text-xs font-bold text-[#4E7E76] dark:text-[#5E988E] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مساحة استشارية متخصصة • أونلاين 100% عبر Google Meet وبسرية تامة</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.3] max-w-3xl mx-auto">
            صحتك النفسية واستقرار أسرتك يبدآن من هنا..
            <span className="block text-[#4E7E76] dark:text-[#5E988E] mt-2">بخطوة واعية وأمان مطلق</span>
          </h1>

          {/* Galal Ahmad Prominent Name & Professional Titles (Directly from LinkedIn Profile) */}
          <div className="pt-2 pb-1 space-y-2.5">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              جـلال أحـمد
            </h2>
            <p className="text-xs sm:text-sm font-bold text-[#4E7E76] dark:text-[#5E988E] max-w-3xl mx-auto leading-relaxed">
              مستشار التدريب وبناء الإنسان • استشارات وحلول تربوية • علم النفس التربوي • التدريب والتطوير المهني • مؤسس مبادرات رِفق وإنسان ومفهوم
            </p>
          </div>

          {/* Foundational Quote */}
          <div className="pt-1">
            <p className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 rounded-2xl py-2.5 px-6 inline-block shadow-2xs">
              «وَمَنْ يَصِفُ لَكَ الطَّرِيقَ.. لَنْ يَسْلُكَهُ نِيَابَةً عَنْكَ»
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/services#book"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#CC4E46] hover:bg-[#B33D35] text-white text-sm font-bold rounded-full transition-all shadow-md shadow-[#CC4E46]/20 hover:scale-[1.02]"
            >
              <Calendar className="w-4 h-4" />
              <span>احجز جلستك الآن</span>
            </Link>

            <Link
              href="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white dark:bg-[#161F2B] hover:bg-slate-50 dark:hover:bg-[#1F2C3D] text-[#4E7E76] dark:text-[#5E988E] border border-[#D6EEEA] dark:border-[#1F4A42] text-sm font-bold rounded-full transition shadow-2xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>بناء وتمكين</span>
            </Link>
          </div>

          {/* Micro trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4E7E76]" />
              <span>سرية وخصوصية تامة 100%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4E7E76]" />
              <span>إلغاء مجاني حتى 48 ساعة</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4E7E76]" />
              <span>لقاء أونلاين عبر Google Meet</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Impact & Credentials Ribbon */}
      <section className="pb-10 pt-2 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            
            <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex items-center gap-3 sm:gap-4 text-right">
              <div className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-[#EDF7F5] dark:bg-[#112924] flex items-center justify-center p-2 border border-[#D6EEEA] dark:border-[#1F4A42]">
                <img src="/assets/template-icons/award-1.svg" alt="خبرة" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-0.5">
                <div className="text-base sm:text-xl font-black text-[#4E7E76] dark:text-[#5E988E]">+18 عاماً</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">خبرة وممارسة مهنية</div>
                <div className="text-[11px] text-slate-500 hidden sm:block">استشارات وإشراف تربوي</div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex items-center gap-3 sm:gap-4 text-right">
              <div className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-[#FEF9EC] dark:bg-[#2E2413] flex items-center justify-center p-2 border border-[#FDF0CD] dark:border-[#4D3A1B]">
                <img src="/assets/template-icons/award-2.svg" alt="تصنيف" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-0.5">
                <div className="text-base sm:text-xl font-black text-[#D97706] dark:text-[#F59E0B]">تصنيف رسمي</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">هيئة التخصصات الصحية</div>
                <div className="text-[11px] text-slate-500 hidden sm:block">أخصائي مساعد علم نفس (2025)</div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex items-center gap-3 sm:gap-4 text-right">
              <div className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-[#EDF5FD] dark:bg-[#122238] flex items-center justify-center p-2 border border-[#D6E6F8] dark:border-[#1E3A5F]">
                <img src="/assets/template-icons/award-3.svg" alt="مسارات" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-0.5">
                <div className="text-base sm:text-xl font-black text-[#154F9C] dark:text-[#60A5FA]">3 مسارات تمكين</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">الأسرة، المؤسسات، والشباب</div>
                <div className="text-[11px] text-slate-500 hidden sm:block">برامج تأهيل وبناء وتطبيق</div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex items-center gap-3 sm:gap-4 text-right">
              <div className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-[#FDF1EE] dark:bg-[#251816] flex items-center justify-center p-2 border border-[#F8DDD9] dark:border-[#42221E]">
                <img src="/assets/template-icons/time.svg" alt="أونلاين" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-0.5">
                <div className="text-base sm:text-xl font-black text-[#CC4E46] dark:text-[#F87171]">أونلاين 100%</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">استشارات دولية</div>
                <div className="text-[11px] text-slate-500 hidden sm:block">جلسات فيديو مشفرة وخاصة</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. استشارات (Consultation Cards - Harmonized & Polished) */}
      <section className="py-14 px-4 sm:px-6 border-y border-slate-200/70 dark:border-slate-800 bg-white/50 dark:bg-black/10">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#4E7E76] dark:text-[#5E988E] uppercase tracking-wider">استشارات نوعية متخصصة</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                استشارات
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                مسارات استشارية مصممة لتمنحك الوضوح والدعم العملي في بيئة آمنة وسرية
              </p>
            </div>
            <Link 
              href="/services" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4E7E76] hover:text-[#3D655E] transition"
            >
              <span>دليل الجلسات والأسعار كاملاً</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => (
              <div
                key={srv.id}
                className={`relative p-6 sm:p-7 rounded-3xl border ${srv.bg} ${srv.border} flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="space-y-4">
                  {/* Top Tag & Illustration */}
                  <div className="flex items-start justify-between gap-3">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${srv.tagBg} border border-black/5 shadow-2xs`}>
                      {srv.tag}
                    </span>
                    <div className="shrink-0 -mt-2 -mr-1">
                      <img 
                        src={srv.image} 
                        alt={srv.title} 
                        loading="lazy"
                        className="w-20 h-20 sm:w-24 sm:h-24 object-contain" 
                      />
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 leading-snug">
                      {srv.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {srv.desc}
                    </p>
                  </div>
                </div>

                {/* CTA Button & Pricing */}
                <div className="pt-6 space-y-2.5">
                  {srv.isExternal ? (
                    <a
                      href={srv.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-2 ${srv.btnBg} transition-all shadow-sm`}
                    >
                      <span>{srv.btnText}</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <Link
                      href={srv.href}
                      className={`w-full py-3 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-2 ${srv.btnBg} transition-all shadow-sm`}
                    >
                      <span>{srv.btnText}</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {servicesPricing[srv.id] && (
                    <div className="text-center pt-0.5">
                      <span className="inline-block text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        {servicesPricing[srv.id].priceDisplay}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. "لماذا جلال أحمد؟" (Arab Therapy 4 Trust Pillars) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
              لماذا تبدأ رحلتك الاستشارية معنا؟
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              معايير مهنية عالية تضمن لك الراحة والخصوصية والنتائج الواقعية الملموسة
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#161F2B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-2xs hover:shadow-md transition-all text-center flex flex-col items-center justify-between"
              >
                <div className="w-full h-32 flex items-center justify-center p-2">
                  <img 
                    src={pillar.image} 
                    alt={pillar.title} 
                    loading="lazy"
                    className="h-28 w-auto max-w-full object-contain" 
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. "كيف تسير الجلسة في 3 خطوات بسيطة؟" */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#EDF7F5]/50 dark:bg-[#112924]/20 border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
              كيف تسير الجلسة؟ 3 خطوات سهلة وبسيطة
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              خطوات حجز مرنة ومباشرة دون أي تعقيد أو انتظار
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((st, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-[#161F2B] p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-2xs text-right relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#CC4E46]/10 text-[#CC4E46] flex items-center justify-center text-xl font-black">
                    {st.number}
                  </div>
                  <img src={st.icon} alt={st.title} className="w-10 h-10 object-contain opacity-80" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {st.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/services#book"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#CC4E46] hover:bg-[#B33D35] text-white text-xs font-bold rounded-full transition shadow-md shadow-[#CC4E46]/20"
            >
              <Calendar className="w-4 h-4" />
              <span>ابدأ الآن واحجز موعدك</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 6. بناء وتمكين (Focusing strictly on the 3 Tracks Overview) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#154F9C] uppercase tracking-wider">برامج وتأهيل متدرج</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                بناء وتمكين
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                برامج وتأهيل يجمع بين الهدي القرآني والنبوي، وعلم النفس الأسري، والتمارين والتطبيقات العملية
              </p>
            </div>
            <Link 
              href="/courses" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#154F9C] hover:text-[#103D7A] transition"
            >
              <span>دليل بناء وتمكين كاملاً</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 3 Tracks Preview Bar (Mithaq and Premarital details are inside family track) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <Link
              href="/courses/family"
              className="p-6 rounded-3xl border border-emerald-200/80 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-500 hover:shadow-md transition group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition">مسار الأسرة</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">نشط</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    برامج رحلة رِفق التفاعلية: برنامج ميثاق (للمتزوجين) وبرنامج وعي (للمقبلين على الزواج) شاملة كراسات التطبيق والمواثيق.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 pt-2 border-t border-emerald-200/50 dark:border-emerald-800/40">
                <span>استكشف برامج مسار الأسرة</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition" />
              </div>
            </Link>

            <Link
              href="/courses/institutions"
              className="p-6 rounded-3xl border border-blue-200/80 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-950/20 hover:border-blue-500 hover:shadow-md transition group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">مسار المؤسسات التعليمية</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-bold">طلب مباشر</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    تأهيل الكوادر الإدارية والتعليمية، بناء البيئات المدرسية الآمنة، وتصميم الحقائب التدريبية المتخصصة.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-400 pt-2 border-t border-blue-200/50 dark:border-blue-800/40">
                <span>استكشف مسار المؤسسات</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition" />
              </div>
            </Link>

            <Link
              href="/courses/youth"
              className="p-6 rounded-3xl border border-purple-200/80 dark:border-purple-800/40 bg-purple-50/50 dark:bg-purple-950/20 hover:border-purple-500 hover:shadow-md transition group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition">مسار الشباب - المكلفين</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 font-bold">قيد الإعداد</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    برامج تعزيز الهوية، بناء الصلابة النفسية، وسؤال المعنى وتحديات مرحلة التكليف لليافعين والشباب.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-400 pt-2 border-t border-purple-200/50 dark:border-purple-800/40">
                <span>استكشف مسار الشباب</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition" />
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* 7. اختبارات نفسية (Psychological Tests Teaser) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#EDF7F5]/40 dark:bg-[#112924]/20 border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#4E7E76] dark:text-[#5E988E] uppercase tracking-wider">أدوات الفحص والتقييم الذاتي</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                اختبارات نفسية
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                اختبارات مقننة ومجانية 100% تساعدك على قياس مستوى القلق، الاكتئاب، الضغوط، والرضى الزواجي بدقة وسرية
              </p>
            </div>
            <Link 
              href="/tests" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4E7E76] hover:text-[#3D655E] transition"
            >
              <span>تصفح كافة المقاييس الـ 41 المعتمدة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredTests.map((tst) => (
              <div
                key={tst.id}
                className={`p-6 rounded-3xl border ${tst.bg} ${tst.border} flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md transition-all`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={tst.tagColor}>{tst.category}</span>
                    <span className="text-slate-400">{tst.time}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {tst.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {tst.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">{tst.questions}</span>
                  <Link
                    href="/tests"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#4E7E76] dark:text-[#5E988E] hover:underline"
                  >
                    <span>ابدأ الاختبار</span>
                    <ArrowLeft className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/tests"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white dark:bg-[#161F2B] border border-[#D6EEEA] dark:border-[#1F4A42] text-xs font-bold text-[#4E7E76] dark:text-[#5E988E] hover:bg-slate-50 dark:hover:bg-[#1F2C3D] transition shadow-2xs"
            >
              <Brain className="w-4 h-4" />
              <span>استكشف دليل الاختبارات النفسية التفاعلية كاملاً (41 اختباراً)</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 8. مقالات (Articles Teaser) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#FEF9EC]/40 dark:bg-[#2E2413]/20 border-b border-slate-200/70 dark:border-slate-800">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider">التأصيل المعرفي وبصائر الوعي</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                مقالات
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                رؤية تأصيلية تستلهم هدايات الوحي في بناء السواء النفسي والاستقرار الأسري مع إمكانية التفاعل والنقاش
              </p>
            </div>
            <Link 
              href="/articles" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706] hover:text-[#B45309] transition"
            >
              <span>تصفح كافة المقالات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentArticles.map((art) => (
              <div 
                key={art.id}
                className={`p-6 sm:p-7 rounded-3xl border ${art.bg} ${art.border} flex flex-col justify-between space-y-5 shadow-2xs hover:shadow-md transition-all`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#D97706]">
                    <span>{art.category}</span>
                    <span className="text-slate-500 font-normal">{art.readTime}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100 leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {art.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                  <Link
                    href="/articles"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706] hover:text-[#B45309] transition"
                  >
                    <span>قراءة المقال والمناقشة</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[11px] text-slate-400">مناقشات تفاعلية</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. آراء وتجارب (Testimonials Section) */}
      <section className="py-6">
        <TestimonialsSection 
          title="آراء وتجارب" 
          subtitle="أصداء حقيقية من جلسات الاستشارة والبرامج التفاعلية (مع الالتزام الصارم بالسرية والخصوصية التامة)"
          limit={6}
        />
        
        {/* Post-Session Feedback Invitation */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12 text-center">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121A2C] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3 text-right">
              <div className="w-9 h-9 rounded-xl bg-[#EDF7F5] dark:bg-[#112924] text-[#4E7E76] flex items-center justify-center shrink-0">
                <MessageSquareHeart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">هل تلقيت جلسة أو شاركت في برنامج مؤخراً؟</h4>
                <p className="text-[11px] text-slate-500">رأيك وتجربتك تسهم في تطوير جودة الرعاية ومساعدة الآخرين.</p>
              </div>
            </div>
            <Link
              href="/feedback"
              className="px-5 py-2 rounded-full bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold transition shrink-0"
            >
              شاركنا تقييمك للجلسة ←
            </Link>
          </div>
        </div>
      </section>

      {/* 10. أسئلة شائعة (FAQ Accordion) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#EDF5FD]/40 dark:bg-[#122238]/20 border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              أسئلة شائعة
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              إجابات واضحة ومباشرة عن كل ما يخص حجز الجلسات والخصوصية
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#161F2B] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-right flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-[#4E7E76] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4 font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 11. Final CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 text-center relative overflow-hidden bg-gradient-to-b from-white via-[#EDF7F5]/40 to-white dark:from-[#0D1117] dark:via-[#112924]/30 dark:to-[#0D1117]">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#EDF7F5] dark:bg-[#112924] border border-[#D6EEEA] dark:border-[#1F4A42] text-xs font-bold text-[#4E7E76] dark:text-[#5E988E]">
            خطوتك الأولى نحو الهدوء والاتزان
          </span>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 leading-tight">
            أنت تستحق أن تعيش باتزان وسلام داخلي
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto font-medium">
            جلسة استشارية خاصة ومريحة تضع يدك على جوهر التحدي وتفتح لك آفاق الحل الواقعي.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/services#book"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#CC4E46] hover:bg-[#B33D35] text-white text-sm font-bold rounded-full transition shadow-md shadow-[#CC4E46]/25 hover:scale-[1.02]"
            >
              <Calendar className="w-4 h-4" />
              <span>احجز جلستك الآن</span>
            </Link>
            
            <a
              href="https://wa.me/201014876666"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white dark:bg-[#161F2B] hover:bg-slate-50 dark:hover:bg-[#1F2C3D] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-sm font-bold rounded-full transition shadow-2xs"
            >
              <Phone className="w-4 h-4 text-[#4E7E76]" />
              <span>تواصل للاستفسار عبر واتساب</span>
            </a>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
