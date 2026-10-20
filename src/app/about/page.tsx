'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdviceBoxSection from '@/components/AdviceBoxSection';
import { siteConfig } from '@/data/siteConfig';
import { 
  ShieldCheck, 
  Award, 
  Building2, 
  Calendar, 
  ArrowLeft, 
  Compass, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export default function AboutPage() {
  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    mainEntity: {
      '@type': 'Person',
      name: 'جلال أحمد',
      alternateName: 'Galal Ahmad',
      jobTitle: siteConfig.officialTitle,
      description: 'باحث ومستشار في الصحة النفسية والإرشاد الأسري والتربوي، ومطور برامج بناء الإنسان وتأهيل القيادات التعليمية.',
      url: 'https://www.galalahmad.com/about',
      image: 'https://www.galalahmad.com/assets/dr-galal-portrait.webp',
      sameAs: siteConfig.socialLinks.map((s) => s.url),
      knowsAbout: [
        'الإرشاد النفسي والأسري',
        'الإرشاد الزواجي وتأهيل المقبلين على الزواج',
        'التربية بالرفق والتعامل مع المراهقين',
        'تطوير القيادات والمؤسسات التعليمية',
        'مشروع أقومية القرآن'
      ]
    }
  };

  const initiatives = [
    {
      name: 'منصة رِفق',
      country: 'المملكة الأردنية الهاشمية',
      role: 'مؤسس وموجّه تربوي',
      desc: 'مبادرة رائدة تُعنى بنشر ثقافة التربية بالرفق، وتطوير مهارات الآباء والمربين لبناء علاقات سوية مع الأبناء.',
      bg: 'bg-[#EDF7F5] dark:bg-[#112924]',
      border: 'border-[#D6EEEA] dark:border-[#1F4A42]',
      color: 'text-[#4E7E76]'
    },
    {
      name: 'منصة وصلة',
      country: 'منصة إقليمية رقمية',
      role: 'مؤسس ومستشار',
      desc: 'منصة متخصصة في الدعم الأسري والزواجي، وتجسير الفجوات التواصلية بين الأزواج عبر أدوات إرشادية نوعية.',
      bg: 'bg-[#EDF5FD] dark:bg-[#122238]',
      border: 'border-[#D6E6F8] dark:border-[#1E3A5F]',
      color: 'text-[#154F9C]'
    },
    {
      name: 'مركز مفهوم',
      country: 'جمهورية مصر العربية',
      role: 'مؤسس ومدير برامج',
      desc: 'صرح استشاري يُعنى ببرامج الفهم والتأهيل النفسي، وتفكيك التشوهات المعرفية والسلوكية لدى اليافعين والبالغين.',
      bg: 'bg-[#F4EFFC] dark:bg-[#241738]',
      border: 'border-[#E5D9F8] dark:border-[#3D2561]',
      color: 'text-[#7C3AED]'
    },
    {
      name: 'مركز إنسان',
      country: 'جمهورية مصر العربية',
      role: 'مؤسس واستشاري',
      desc: 'مركز متخصص في التدريب وبناء الوعي النفسي والتربوي، وتقديم الاستشارات النوعية للأفراد والمؤسسات التعليمية.',
      bg: 'bg-[#FEF9EC] dark:bg-[#2E2413]',
      border: 'border-[#FDF0CD] dark:border-[#4D3A1B]',
      color: 'text-[#D97706]'
    }
  ];

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFCFA] dark:bg-[#0D1117] text-slate-900 dark:text-slate-100 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <Navbar />

      {/* Hero Header with Portrait Photo (Sole Authorized Location for Personal Portrait) */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 overflow-hidden border-b border-slate-200/70 dark:border-slate-800 text-right">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* النص التعريفي الرئيسي */}
            <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDF7F5] dark:bg-[#112924] border border-[#D6EEEA] dark:border-[#1F4A42] text-xs font-bold text-[#4E7E76] dark:text-[#5E988E]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>من أنا • الرؤية والمسيرة المهنية وبناء الإنسان</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 leading-[1.3] tracking-tight">
                  <span className="block mb-2">«السلوك رسالة قبل أن يكون مشكلة..</span>
                  <span className="block text-[#4E7E76] dark:text-[#5E988E]">والوعي بداية كل اتزان»</span>
                </h1>
                <p className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
                  جـلال أحـمد ({siteConfig.officialTitle}) — باحث ومستشار في الصحة النفسية والإرشاد الأسري والتربوي، ومطور برامج بناء الإنسان وتأهيل القيادات التعليمية.
                </p>
              </div>

              {/* مجالات ومسميات الاختصاص الخمسة */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700">اختصاصي نفسي</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700">استشاري تربوي</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700">إرشاد أسري</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700">إرشاد زواجي</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700">مستشار تعليمي</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                أجمع في مسيرتي بين أكثر من 18 عاماً من الممارسة القيادية والميدانية في إدارة وتطوير المؤسسات والمدارس الكبرى، والتأهيل الأكاديمي والعيادي في علم النفس، مع الارتكاز الأصيل على هداية القرآن وبصيرة الفطرة الإنسانية.
              </p>

              {/* الشارات الرسمية المعتمدة */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="inline-flex items-center gap-2.5 p-3.5 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 text-xs shadow-2xs">
                  <ShieldCheck className="w-5 h-5 text-[#4E7E76] shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100 font-bold">الهيئة السعودية للتخصصات الصحية</strong>
                    <span className="block text-[11px] text-slate-500 mt-0.5 font-normal">
                      {siteConfig.scfhsClassification} | ترخيص: {siteConfig.licenseNumber}
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2.5 p-3.5 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 text-xs shadow-2xs">
                  <GraduationCap className="w-5 h-5 text-[#CC4E46] shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100 font-bold">ماجستير علم النفس والخبرة الإكلينيكية</strong>
                    <span className="block text-[11px] text-slate-500 mt-0.5 font-normal">
                      أكثر من 18 عاماً في الاستشارة والقيادة التربوية
                    </span>
                  </div>
                </div>
              </div>

              {/* زر الحجز */}
              <div className="pt-3">
                <Link
                  href="/services#book"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#CC4E46] hover:bg-[#B33D35] text-white text-xs font-bold rounded-full transition shadow-md shadow-[#CC4E46]/20"
                >
                  <Calendar className="w-4 h-4" />
                  <span>احجز جلسة استشارية خاصة</span>
                </Link>
              </div>

            </div>

            {/* الصورة الشخصية الرسمية الوحيدة المعتمدة */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
              <div className="relative w-64 sm:w-80 aspect-square rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-900">
                <img
                  src="/assets/galal-formal-suit.jpg"
                  alt="جلال أحمد — مستشار الصحة النفسية والتربوية، مصنف من الهيئة السعودية للتخصصات الصحية ومؤسس منصتي رفق ووصلة"
                  loading="lazy"
                  width={700}
                  height={1000}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* المسار المهني والأكاديمي (Timeline) مستوحى ومقتبس من التمبليت بهوية عرب ثيربي */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#EDF7F5]/30 dark:bg-[#112924]/10 border-b border-slate-200/70 dark:border-slate-800">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-[#4E7E76] uppercase tracking-wider">المحطات البارزة</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              المسار المهني والاعتمادات الرسمية
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              محطات رئيسية تجمع بين التأهيل الأكاديمي والعيادي، والممارسة القيادية الميدانية
            </p>
          </div>

          <div className="relative border-r-2 border-[#4E7E76]/30 dark:border-[#4E7E76]/20 mr-4 sm:mr-8 space-y-10">
            
            {/* Timeline Item 1 */}
            <div className="relative pr-8 sm:pr-10">
              <div className="absolute -right-3 top-1.5 w-6 h-6 rounded-full bg-[#4E7E76] text-white flex items-center justify-center ring-4 ring-[#FAFCFA] dark:ring-[#0D1117]">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="p-6 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all space-y-2 text-right">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-[#EDF7F5] dark:bg-[#112924] text-[#4E7E76]">
                    2025 — حتى الآن
                  </span>
                  <span className="text-xs font-semibold text-slate-500">المملكة العربية السعودية</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  تصنيف مهني رسمي — الهيئة السعودية للتخصصات الصحية (SCFHS)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  مصنف رسمياً بدرجة «{siteConfig.scfhsClassification}» بترخيص رقم {siteConfig.licenseNumber}، لممارسة وتقديم الجلسات والدعم النفسي والاستشاري وفق المعايير المهنية والأخلاقية المعتمدة.
                </p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative pr-8 sm:pr-10">
              <div className="absolute -right-3 top-1.5 w-6 h-6 rounded-full bg-[#154F9C] text-white flex items-center justify-center ring-4 ring-[#FAFCFA] dark:ring-[#0D1117]">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <div className="p-6 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all space-y-2 text-right">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-[#EDF5FD] dark:bg-[#122238] text-[#154F9C]">
                    تأسيس المبادرات الإقليمية
                  </span>
                  <span className="text-xs font-semibold text-slate-500">مصر والأردن والعالم العربي</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  تأسيس وإدارة المنصات والمراكز الاستشارية الأربعة
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  إطلاق منصة «رِفق» في الأردن للتربية الإيجابية، ومنصة «وصلة» للدعم الزواجي والأسري، ومركزي «مفهوم» و«إنسان» في مصر لبناء الوعي وتفكيك التشوهات المعرفية والسلوكية.
                </p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative pr-8 sm:pr-10">
              <div className="absolute -right-3 top-1.5 w-6 h-6 rounded-full bg-[#D97706] text-white flex items-center justify-center ring-4 ring-[#FAFCFA] dark:ring-[#0D1117]">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <div className="p-6 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all space-y-2 text-right">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-[#FEF9EC] dark:bg-[#2E2413] text-[#D97706]">
                    التأهيل الأكاديمي والبحثي
                  </span>
                  <span className="text-xs font-semibold text-slate-500">دراسات عليا وتأهيل تخصصي</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  ماجستير علم النفس وبحوث أقومية القرآن
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  تأهيل علمي معمق في دراسات علم النفس والإرشاد السلوكي، وتطوير أطروحة «مشروع أقومية القرآن» لاستلهام هدايات الوحي في بناء الفطرة الإنسانية والاتزان النفسي.
                </p>
              </div>
            </div>

            {/* Timeline Item 4 */}
            <div className="relative pr-8 sm:pr-10">
              <div className="absolute -right-3 top-1.5 w-6 h-6 rounded-full bg-[#CC4E46] text-white flex items-center justify-center ring-4 ring-[#FAFCFA] dark:ring-[#0D1117]">
                <Award className="w-3.5 h-3.5" />
              </div>
              <div className="p-6 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all space-y-2 text-right">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-[#FDF1EE] dark:bg-[#251816] text-[#CC4E46]">
                    +18 عاماً من الممارسة الميدانية
                  </span>
                  <span className="text-xs font-semibold text-slate-500">إدارة وقيادة مؤسسية</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  القيادة التعليمية وإدارة الصروح والمدارس الكبرى
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  خبرة ممتدة في إدارة وتطوير المنظومات التربوية والمدارس الكبرى، وتدريب مئات المعلمين والمربين على الممارسات الوالدية الفعالة والإرشاد السلوكي السليم.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* المؤسسات والمشاريع التي أسسها */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-[#4E7E76] uppercase tracking-wider">الأثر المؤسسي</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              المؤسسات والمبادرات التي أسسها
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              مشاريع استشارية وتربوية تخدم المجتمع في مصر والأردن والعالم العربي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initiatives.map((item, idx) => (
              <div
                key={idx}
                className={`p-7 rounded-3xl border ${item.bg} ${item.border} space-y-4 shadow-2xs hover:shadow-md transition-all text-right`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${item.color}`}>{item.role}</span>
                  <span className="text-[11px] text-slate-500 font-semibold">{item.country}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">{item.name}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* الركائز المنهجية */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#EDF7F5]/40 dark:bg-[#112924]/20 border-t border-slate-200/70 dark:border-slate-800">
        <div className="max-w-5xl mx-auto space-y-10 text-center">
          
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              الركائز الفلسفية والمنهجية في عملي
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              أربع دعائم تحكم جلساتي الاستشارية وبرامجي التدريبية
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-right">
            
            <div className="p-6 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs">
              <span className="text-base font-black text-[#4E7E76]">01. السلوك رسالة</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                لا نحاكم السلوك الظاهر بمعزل عن الاحتياج الداخلي؛ بل نفكك الرسالة الكامنة خلفه لنصل إلى جذر المشكلة.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs">
              <span className="text-base font-black text-[#154F9C]">02. مسؤولية التغيير</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                «وَمَنْ يَصِفُ لَكَ الطَّرِيقَ.. لَنْ يَسْلُكَهُ نِيَابَةً عَنْكَ» — المستشار يضيء الدرب، والمسترشد هو البطل الحقيقي لمسيرته.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs">
              <span className="text-base font-black text-[#D97706]">03. أقومية القرآن</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                استلهام هدايات الوحي في السكن والمودة والرحمة كمرجعية عليا لبناء الأسرة واستقرار النفس الإنسانية.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs">
              <span className="text-base font-black text-[#CC4E46]">04. الأمان والسرية</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                مساحة حرة من الأحكام المسبقة، تحفظ الخصوصية والكرامة الإنسانية وفق أرفع المعايير الأخلاقية.
              </p>
            </div>

          </div>

          <div className="pt-4">
            <Link
              href="/services#book"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#CC4E46] hover:bg-[#B33D35] text-white text-xs font-bold rounded-full transition shadow-md shadow-[#CC4E46]/20"
            >
              <Calendar className="w-4 h-4" />
              <span>ابدأ جلستك الأولى الآن</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ساعات العمل وصندوق النصيحة والكروت المساندة */}
      <AdviceBoxSection />

      <Footer />
    </main>
  );
}
