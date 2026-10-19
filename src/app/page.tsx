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
  FileText,
  ChevronDown,
  X,
  Phone,
  Send,
  Zap,
  Award
} from 'lucide-react';
import { 
  VectorIndividualTherapy, 
  VectorCoupleTherapy, 
  VectorPremaritalTherapy, 
  VectorParentingTherapy, 
  VectorEmergencyTherapy,
  VectorInstitutionalTherapy
} from '@/components/Vectors';

export default function HomePage() {
  // Course Interest Modal State
  const [modalCourse, setModalCourse] = useState<string | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleInterestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const message = `طلب تسجيل اهتمام في برنامج: ${modalCourse}%0Aالاسم: ${applicantName}%0Aالهاتف: ${applicantPhone}%0Aالبريد: ${applicantEmail}`;
    const whatsappUrl = `https://wa.me/201014876666?text=${message}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      window.open(whatsappUrl, '_blank');
      setTimeout(() => {
        setSubmitSuccess(false);
        setModalCourse(null);
        setApplicantName('');
        setApplicantPhone('');
        setApplicantEmail('');
      }, 2500);
    }, 400);
  };

  const services = [
    {
      id: 'psychological',
      title: 'الاستشارات النفسية الفردية',
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
      title: 'الاستشارات الزوجية والأسرية',
      tag: 'جلسة ثنائية أو فردية',
      desc: 'معالجة الخلافات المتكررة وفك الانسداد الحواري، وإعادة بناء جسور الأمان والمودة والتفاهم بين الشريكين.',
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
      title: 'الحجز الطارئ والعاجل (24 ساعة)',
      tag: '⚡ استجابة عاجلة للظروف الضاغطة',
      desc: 'مسار مباشر لمن يمر بظرف نفسي أو أسري ضاغط ويحتاج لجلسة توجيه سريعة خلال 24 ساعة دون انتظار جدول المواعيد.',
      bg: 'bg-[#F4EFFC] dark:bg-[#241738]/70',
      border: 'border-[#E5D9F8] dark:border-[#3D2561]',
      tagBg: 'bg-white/80 dark:bg-black/30 text-[#7C3AED]',
      btnBg: 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white',
      image: '/assets/arabtherapy/instant-session.svg',
      btnText: 'احجز الجلسة الطارئة عبر واتساب ⚡',
      href: 'https://wa.me/201014876666?text=%D8%B7%D9%84%D8%A8%20%D8%AD%D8%AC%D8%B6%20%D8%B7%D8%A7%D8%B1%D8%A6%20%D8%AE%D9%84%D8%A7%D9%84%2024%20%D8%B3%D8%A7%D8%B9%D8%A9',
      isExternal: true,
    },
    {
      id: 'parenting',
      title: 'الاستشارات التربوية والوالدية',
      tag: 'إرشاد الوالدين والمربين',
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
      btnText: 'اكتشف تفاصيل البرامج',
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

  const featuredCourses = [
    {
      id: 'rifq-journey',
      title: 'رحلة رِفق: الممارسات الوالدية الفعالة',
      category: 'إرشاد والدي وتربوي',
      status: 'متاح للتسجيل',
      desc: 'دليل منهجي تطبيقي للآباء والمربين لبناء علاقة سوية مع الأبناء بالرفق والحزم دون استنزاف.',
      duration: '4 أسابيع تدريبية مركزة',
      bg: 'bg-[#EDF7F5] dark:bg-[#112924]',
      border: 'border-[#D6EEEA] dark:border-[#1F4A42]',
      image: '/assets/illustrations/course-rifq.svg',
    },
    {
      id: 'mithaq-program',
      title: 'برنامج ميثاق: الإعداد الزواجي الشامل',
      category: 'إرشاد أسري وزواجي',
      status: 'متاح للتسجيل',
      desc: 'تأهيل علمي وواقعي للمقبلين على الزواج لبناء شراكة قائمة على الوعي والمودة وإدارة التوقعات.',
      duration: '6 ورش عمل تفاعلية',
      bg: 'bg-[#EDF5FD] dark:bg-[#122238]',
      border: 'border-[#D6E6F8] dark:border-[#1E3A5F]',
      image: '/assets/illustrations/course-mithaq.svg',
    },
    {
      id: 'masaha-workshop',
      title: 'برنامج مساحة: الدعم النفسي وإدارة الضغوط',
      category: 'تطوير ودعم نفسي',
      status: 'قريباً',
      desc: 'ورش عمل تفاعلية لتطوير الصلابة النفسية ومواجهة الاحتراق الحياتي والمهني واستعادة الهدوء.',
      duration: 'الدفعة القادمة',
      bg: 'bg-[#F4EFFC] dark:bg-[#241738]',
      border: 'border-[#E5D9F8] dark:border-[#3D2561]',
      image: '/assets/illustrations/course-masaha.svg',
    },
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
      category: 'العلاقات والأسرة',
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

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFCFA] dark:bg-[#0D1117] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* 1. Hero Section - Arab Therapy Style */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 overflow-hidden">
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

          {/* Foundational Quote */}
          <div className="pt-1">
            <p className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 rounded-2xl py-3 px-6 inline-block shadow-2xs">
              «وَمَنْ يَصِفُ لَكَ الطَّرِيقَ.. لَنْ يَسْلُكَهُ نِيَابَةً عَنْكَ»
            </p>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto pt-1 font-medium">
            إرشاد نفسي، أسري، وتربوي يقدمه <strong className="text-slate-900 dark:text-slate-100 font-bold">جـلال أحـمد</strong> لمساندتك على تفكيك التحديات، واستعادة الاتزان الداخلي، وبناء علاقات سوية ومستقرة.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
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
              <span>اكتشف الكورسات والبرامج</span>
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

      {/* 2. Impact & Credentials Ribbon (Extracted & Adapted from Template) */}
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
                <img src="/assets/template-icons/award-3.svg" alt="مبادرات" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-0.5">
                <div className="text-base sm:text-xl font-black text-[#154F9C] dark:text-[#60A5FA]">4 مؤسسات</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">مبادرات ومراكز مؤسسة</div>
                <div className="text-[11px] text-slate-500 hidden sm:block">رِفق، وصلة، مفهوم، إنسان</div>
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

      {/* 3. Arab Therapy Pastel Consultation Cards */}
      <section className="py-12 px-4 sm:px-6 border-y border-slate-200/70 dark:border-slate-800 bg-white/50 dark:bg-black/10">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              اختر نوع الجلسة المناسب لاحتياجك
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              مسارات استشارية متخصصة ومصممة لتمنحك الوضوح والدعم العملي المباشر
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((srv) => (
              <div
                key={srv.id}
                className={`relative p-6 sm:p-7 rounded-3xl border ${srv.bg} ${srv.border} flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="space-y-4">
                  {/* Top Tag & Illustration */}
                  <div className="flex items-start justify-between gap-4">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${srv.tagBg} border border-black/5 shadow-2xs`}>
                      {srv.tag}
                    </span>
                    <div className="shrink-0 -mt-2 -mr-2">
                      <img 
                        src={srv.image} 
                        alt={srv.title} 
                        className="w-24 h-24 sm:w-28 sm:h-28 object-contain" 
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

                {/* CTA Button */}
                <div className="pt-6">
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
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. "لماذا د. جلال أحمد؟" (Arab Therapy 4 Trust Pillars with Authentic Illustrations) */}
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

      {/* 4. "كيف تسير الجلسة في 3 خطوات بسيطة؟" (Arab Therapy 3-Step Flow) */}
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

      {/* 5. الكورسات والبرامج المتاحة (Section 4) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#4E7E76] uppercase tracking-wider">برامج وتدريب</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                الكورسات والبرامج التدريبية المعتمدة
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                برامج مبنية على خبرة ميدانية وتأصيل منهجي لبناء الأسرة والوعي الذاتي
              </p>
            </div>
            <Link 
              href="/courses" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4E7E76] hover:text-[#3D655E] transition"
            >
              <span>عرض دليل الكورسات كاملاً</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCourses.map((crs) => (
              <div 
                key={crs.id}
                className={`p-6 sm:p-7 rounded-3xl border ${crs.bg} ${crs.border} flex flex-col justify-between space-y-6 shadow-2xs hover:shadow-md transition-all`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      {crs.category}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {crs.status}
                    </span>
                  </div>

                  {/* Course Illustration */}
                  <div className="w-full h-36 flex items-center justify-center p-2 rounded-2xl bg-white/60 dark:bg-black/20">
                    <img 
                      src={crs.image} 
                      alt={crs.title} 
                      className="h-32 w-auto object-contain" 
                    />
                  </div>

                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-snug">
                    {crs.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {crs.desc}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-[#4E7E76]" />
                    <span>{crs.duration}</span>
                  </div>
                </div>

                <button
                  onClick={() => setModalCourse(crs.title)}
                  className="w-full py-2.5 px-4 bg-white dark:bg-black/40 hover:bg-slate-50 dark:hover:bg-black/60 text-[#4E7E76] dark:text-[#5E988E] border border-[#D6EEEA] dark:border-[#1F4A42] rounded-full text-xs font-bold transition shadow-2xs"
                >
                  سجّل اهتمامك / اطلب التفاصيل
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. مشروع أقومية القرآن والمقالات (Section 5) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#FEF9EC]/40 dark:bg-[#2E2413]/20 border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider">التأصيل المعرفي</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                مشروع أقومية القرآن ومقالات التوعية
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                رؤية تأصيلية تستلهم هدايات الوحي في بناء السواء النفسي والاستقرار الأسري
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

                <Link
                  href="/articles"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706] hover:text-[#B45309] transition pt-2"
                >
                  <span>اقرأ المقال كاملاً</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. الخبرة والمؤسسات التي أسسها د. جلال (Section 6) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-10 text-center">
          
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              الخبرة والمؤسسات التي أسسها
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              بصمات مؤسسية ومشاريع قائمة تُترجم الرؤية الاستشارية إلى أثر واقعي مستمر
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-6 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-2xs text-right">
              <span className="text-[10px] font-bold text-[#4E7E76] uppercase">مؤسس ومدير</span>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">مركز إنسان للتدريب والاستشارات</h3>
              <p className="text-[11px] text-slate-500 font-normal">جمهورية مصر العربية — تدريب وإرشاد أسري ونفسي.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-2xs text-right">
              <span className="text-[10px] font-bold text-[#154F9C] uppercase">مؤسس ورئيس</span>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">منصة رِفق للاستشارات</h3>
              <p className="text-[11px] text-slate-500 font-normal">المملكة الأردنية الهاشمية — إرشاد أسري وتربوي.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-2xs text-right">
              <span className="text-[10px] font-bold text-[#CC4E46] uppercase">مؤسس</span>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">مركز مفهوم للبحوث والدراسات</h3>
              <p className="text-[11px] text-slate-500 font-normal">أبحاث السلوك والأسرة وتأصيل العلوم النفسية.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-2xs text-right">
              <span className="text-[10px] font-bold text-[#7C3AED] uppercase">مؤسس شريك</span>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">منصة وصلة للاستشارات الأسرية</h3>
              <p className="text-[11px] text-slate-500 font-normal">مبادرة رقمية لدعم التواصل الزواجي الآمن.</p>
            </div>

          </div>

          <div className="pt-2">
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4E7E76] hover:text-[#3D655E] transition"
            >
              <span>تعرف على السيرة المهنية والمؤهلات المعتمدة لدكتور جلال</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 8. الأسئلة الشائعة (FAQ Accordion) - Arab Therapy Style */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#EDF5FD]/40 dark:bg-[#122238]/20 border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              الأسئلة الشائعة
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
                    className="w-full p-5 sm:p-6 text-right flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100"
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

      {/* 9. Final CTA - Arab Therapy Style (Section 7) */}
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

      {/* Registration Interest Modal */}
      {modalCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#161F2B] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative text-right">
            
            <button 
              onClick={() => setModalCourse(null)}
              className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#4E7E76] uppercase">تسجيل اهتمام</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">{modalCourse}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                سجل بياناتك وسيتم إرسال تفاصيل ومواعيد البرنامج عبر واتساب والبريد الرسمي.
              </p>
            </div>

            {submitSuccess ? (
              <div className="p-4 rounded-2xl bg-[#EDF7F5] dark:bg-[#112924] border border-[#D6EEEA] dark:border-[#1F4A42] text-xs font-bold text-[#4E7E76] text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-[#4E7E76]" />
                <p>تم استلام طلبك بنجاح! جاري توجيهك إلى واتساب لتأكيد الاستلام...</p>
              </div>
            ) : (
              <form onSubmit={handleInterestSubmit} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-slate-700 dark:text-slate-300">الاسم الكريم</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="اكتب اسمك هنا"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#4E7E76]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 dark:text-slate-300">رقم الهاتف (واتساب مع مفتاح الدولة)</label>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="+966xxxxxxxxx أو +20xxxxxxxxxx"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#4E7E76]"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 dark:text-slate-300">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#4E7E76]"
                    dir="ltr"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#CC4E46] hover:bg-[#B33D35] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-md shadow-[#CC4E46]/20"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'جاري الإرسال...' : 'تأكيد تسجيل الاهتمام'}</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
