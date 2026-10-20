'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  Compass, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  FileText, 
  HelpCircle, 
  Lightbulb, 
  Users, 
  HeartHandshake, 
  ExternalLink,
  ChevronDown,
  Scale
} from 'lucide-react';

export default function AqwameyatQuranPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'layers' | 'principles' | 'model' | 'pilot' | 'quality'>('overview');

  const layers = [
    {
      num: '1',
      title: 'نص شرعي أصيل',
      meaning: 'آية قرآنية أو حديث نبوي شريف بنصه الدقيق وتخريجه المعتمد',
      system: 'توثيق دقيق بنوع الدليل وتخريج المحدثين وحكمهم',
      color: 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300'
    },
    {
      num: '2',
      title: 'تفسير أو شرح علمي',
      meaning: 'فهم أئمة التفسير وشراح الحديث للنص وسياق وروده',
      system: 'الرجوع إلى التفاسير المعتمدة دون ليّ لعنق النص',
      color: 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/20 text-teal-800 dark:text-teal-300'
    },
    {
      num: '3',
      title: 'استنباط تربوي',
      meaning: 'ما نستخرجه من النص تربوياً لبناء الإنسان والأسرة',
      system: 'بيان وجه الدلالة والتفريق بين دلالة النص الصريحة وما يُستنبط منه',
      color: 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300'
    },
    {
      num: '4',
      title: 'فرضية نفسية',
      meaning: 'تفسير نفسي محتمل للسلوك يحتاج إلى فحص وتثبت واقعي',
      system: 'تعدد البدائل وعدم الجزم بفرضية واحدة على أنها حقيقة نهائية',
      color: 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-300'
    },
    {
      num: '5',
      title: 'ادعاء علمي تجريبي',
      meaning: 'نتيجة بحثية مصدرها دراسة علمية محددة ذات منهجية منضبطة',
      system: 'ذكر حدود العينة والتعميم وعدم تحويل الارتباط الإحصائي إلى سببية',
      color: 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300'
    },
    {
      num: '6',
      title: 'تطبيق عملي (جسر الممكن إلى المتمكن)',
      meaning: 'ممارسة يومية صغيرة قابلة للتجربة والتكرار تحول المعنى إلى عادة',
      system: 'تطبيق محدد بحدوده الواقعية ومؤشرات ملموسة للملاحظة',
      color: 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300'
    }
  ];

  const principles = [
    {
      title: '1. الوحي أصل المرجعية',
      desc: 'القرآن الكريم والسنة النبوية الصحيحة هما المنطلق الحاكم في الرؤية والأهداف وفهم الإنسان وسواء الفطرة، مع فهم السياق ووجه الدلالة.'
    },
    {
      title: '2. التوثيق الصارم',
      desc: 'لا حديث بلا تخريج وحكم، ولا أثر بلا مصدر أصيل يمكن مراجعته، ولا اختلاق لمرجع أو درجة بحث أو تهاون في عزو النصوص.'
    },
    {
      title: '3. الفصل بين الطبقات المعرفية',
      desc: 'فصل صريح بين النص، التفسير، الاستنباط، الفرضية النفسية، والتطبيق. الاقتباس الديني لا يثبت وحده ادعاءً سببياً أو نفسياً تجريبياً.'
    },
    {
      title: '4. الإنصاف العلمي التام',
      desc: 'لا ننسب إلى النظريات النفسية الحديثة ما لا تقوله، ولا نهاجم علم النفس لمجرد أنه حديث، ولا نعمم نقداً دون تحديد الادعاء ودليله.'
    },
    {
      title: '5. عدم اختزال السلوك الإنساني',
      desc: 'السلوك الظاهر الواحد قد تنتجه دوافع نفسية وتربوية مختلفة؛ فلا نختزل السلوك في دافع وحيد، ونفرق دوماً بين الفرضية والحقيقة.'
    },
    {
      title: '6. المسؤولية المتوازنة دون لوم',
      desc: 'نفحص بعمق دور الوالدين والبيئة والمحيط دون إلغاء مسؤولية الطفل وإرادته، ودون إلقاء لوم تلقائي أو جلد لذات الأسرة.'
    },
    {
      title: '7. التطبيق الواقعي (جسر الممكن إلى المتمكّن)',
      desc: 'كل طرح ينتهي بخطوة عملية محددة قابلة للتكرار تسد الفجوة بين معرفة القيمة والقدرة على ممارستها في واقع البيوت.'
    },
    {
      title: '8. اللغة الإنسانية الدافئة وصون الكرامة',
      desc: 'طرح عميق دون تقعر، حازم دون تجريح أو تخويف مبالغ فيه، يصون كرامة الطفل ويراعي مشاعر الوالدين وظروفهم الواقعية.'
    }
  ];

  const nineSteps = [
    { num: '01', title: 'وصف السلوك الفعلي', desc: 'ماذا حدث فعلاً بالواقع الملموس دون إطلاق صفات ثابتة أو وصم على الطفل.' },
    { num: '02', title: 'تحديد السياق', desc: 'المرحلة العمرية، طبيعة الموقف، ما سبقه من ضغوط، وما تلاه من استجابات.' },
    { num: '03', title: 'سؤال الانطلاق القرآني', desc: 'ما هو السؤال الجوهري الذي ينبغي أن يحكم فهمنا للمشكلة من منظور الوحي؟' },
    { num: '04', title: 'البناء من الوحي', desc: 'ما هي القيمة أو الرؤية أو الغاية الكلية التي يؤسس لها النص الشرعي؟' },
    { num: '05', title: 'فحص التصورات الشائعة', desc: 'تحليل الفكرة التربوية السائدة وتحديد ما يحتاج منها إلى تقويم وتعديل.' },
    { num: '06', title: 'تحليل الجذور والبدائل', desc: 'استكشاف التفسيرات النفسية الممكنة والتفريق بين ما نعرفه وما نفترضه فقط.' },
    { num: '07', title: 'مراجعة دور المربي والبيئة', desc: 'فحص القدوة، ردود الأفعال، التوقعات الأسرية، ونمط الاستجابة في البيت.' },
    { num: '08', title: 'التطبيق المتدرج', desc: 'ممارسة يومية صغيرة وواقعية يمكن للطفل والأسرة تنفيذها وتكرارها بيسر.' },
    { num: '09', title: 'قياس الأثر النوعي', desc: 'ما التغير الملموس الذي سنلاحظه، دون ادعاء أن تجربة واحدة تثبت فاعلية عامة مطلقة.' }
  ];

  const pilotEpisodes = [
    {
      code: 'TAR-001',
      title: 'الصدق والكذب',
      hook: 'ابنك بيكدب عليك؟ راجع نفسك قبل ما تعاقبه!',
      anchor: 'التوبة 9:119 • البخاري 6094',
      coreLimit: 'الآية تؤسس قيمة الصدق العليا؛ لا تدعي تفسيراً نفسياً آلياً لأسباب كذب الطفل. الخوف من العقاب فرضية شائعة وليست التفسير الوحيد.',
      badge: 'مكتمل التحليل الشرعي والتربوي'
    },
    {
      code: 'TAR-002',
      title: 'الرفض والعناد',
      hook: 'ابنك بيعاند؟ مش كل رفض معناه حاجة واحدة!',
      anchor: 'وصايا لقمان الحكيم • سورة لقمان 31:13–19',
      coreLimit: 'الآيات تؤسس أصول الخطاب الوالدي الحكيم وبناء الهوية؛ لا يُدعى أنها تقدم تفسيراً عصبياً لكل سلوك معاند. التفسيرات النفسية تظل فرضيات فاحصة.',
      badge: 'قيد المراجعة العلمية'
    },
    {
      code: 'TAR-003',
      title: 'قيمة الشكر والامتنان',
      hook: 'هل بنعلّم أولادنا الشكر الحقيقي أم مجرد كلمات مجاملة؟',
      anchor: 'سورة إبراهيم 14:7',
      coreLimit: 'التأصيل القرآني للشكر كقوة بناء داخلي لا كأداة لإسكات الشكوى المشروعة للطفل أو تجاهل معاناته النفسية.',
      badge: 'قيد التطوير والتأصيل'
    }
  ];

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFCFA] dark:bg-[#0D1117] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 overflow-hidden border-b border-slate-200/70 dark:border-slate-800">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-gradient-to-b from-[#4E7E76]/15 via-[#D97706]/10 to-transparent blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF9EC] dark:bg-[#2E2413] border border-[#FDF0CD] dark:border-[#4D3A1B] text-xs font-bold text-[#D97706] dark:text-[#F59E0B] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مشروع تأصيلي معرفي وتطبيقي مستمر • الإصدار الشامل 1.0</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.25]">
            مشروع أقومية القرآن في التربية
            <span className="block text-2xl sm:text-3xl lg:text-4xl text-[#4E7E76] dark:text-[#5E988E] font-bold mt-3">
              من السلوك الظاهر إلى فهم الجذور وبناء الإنسان
            </span>
          </h1>

          <div className="pt-2">
            <p className="text-base sm:text-xl font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 rounded-2xl py-3 px-8 inline-block shadow-2xs leading-relaxed">
              ﴿إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ وَيُبَشِّرُ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا كَبِيرًا﴾
              <span className="block text-xs font-medium text-[#4E7E76] dark:text-[#5E988E] mt-1">[الإسراء: 9]</span>
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            مشروع محتوى معرفي وتطبيقي ينطلق من القرآن الكريم والسنة النبوية الصحيحة، ويستفيد من صحيح السيرة والآثار الثابتة وخبرات علم النفس المنضبطة، ليقدم فهماً تربوياً للإنسان يبدأ من القيم والمعاني والدوافع والاختيار، ولا يكتفي بإدارة السلوك الظاهر.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <a
              href="#tabs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4E7E76] hover:bg-[#3D655E] text-white text-xs font-bold rounded-full transition shadow-md shadow-[#4E7E76]/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>استكشف الوثيقة المنهجية كاملة</span>
            </a>
            <Link
              href="/articles/aqwameyat-quran-family"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#161F2B] hover:bg-slate-50 dark:hover:bg-[#1F2C3D] text-[#4E7E76] dark:text-[#5E988E] border border-[#D6EEEA] dark:border-[#1F4A42] text-xs font-bold rounded-full transition shadow-2xs"
            >
              <span>اقرأ مقال الأسرة والأقومية</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* Interactive Tabs Navigation */}
      <section id="tabs" className="sticky top-20 z-30 bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar text-xs font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#4E7E76] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              الرؤية والرسالة ومحددات الأقوم
            </button>
            <button
              onClick={() => setActiveTab('layers')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeTab === 'layers'
                  ? 'bg-[#4E7E76] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              الطبقات المعرفية الست
            </button>
            <button
              onClick={() => setActiveTab('principles')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeTab === 'principles'
                  ? 'bg-[#4E7E76] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              المبادئ الحاكمة الثمانية
            </button>
            <button
              onClick={() => setActiveTab('model')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeTab === 'model'
                  ? 'bg-[#4E7E76] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              نموذج التحليل في 9 خطوات
            </button>
            <button
              onClick={() => setActiveTab('pilot')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeTab === 'pilot'
                  ? 'bg-[#4E7E76] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              الموسم التجريبي (من السلوك إلى الجذر)
            </button>
            <button
              onClick={() => setActiveTab('quality')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeTab === 'quality'
                  ? 'bg-[#4E7E76] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              نظام الجودة والاعتماد الصارم
            </button>
          </div>
        </div>
      </section>

      {/* Main Tab Content */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* TAB 1: OVERVIEW & BOUNDARIES */}
          {activeTab === 'overview' && (
            <div className="space-y-12 animate-fadeIn">
              
              {/* Vision & Mission Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-7 rounded-3xl bg-[#EDF7F5] dark:bg-[#112924]/60 border border-[#D6EEEA] dark:border-[#1F4A42] space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#4E7E76]/10 text-[#4E7E76] flex items-center justify-center">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">رؤية المشروع</h3>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    الإسهام في بناء وعي تربوي عربي أصيل يرى الإنسان في كليته (جسداً وعقلاً وقلباً وروحاً)، ويجعل الوحي مرجعية تأسيسية عليا في فهم التربية والنمو النفسي والإصلاح السلوكي.
                  </p>
                </div>

                <div className="p-7 rounded-3xl bg-[#FEF9EC] dark:bg-[#2E2413]/60 border border-[#FDF0CD] dark:border-[#4D3A1B] space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#D97706]/10 text-[#D97706] flex items-center justify-center">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">رسالة المشروع</h3>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    تحويل المعاني القرآنية والتوجيهات النبوية إلى فهم تربوي دقيق، ونماذج تفسيرية منصفة، وتطبيقات عملية دافئة قابلة للتجربة والتكرار داخل البيوت والمدارس والمؤسسات.
                  </p>
                </div>
              </div>

              {/* Meaning of Al-Aqwam */}
              <div className="p-8 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-2xs">
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#4E7E76]" />
                  <span>معنى «الأقوم» وحدود المشروع</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  «الأقوم» في مشروعنا ليس شعاراً للمفاضلة الخطابية الجوفاء، ولا ادعاءً بأن كل ممارسة نفسية أو تربوية حديثة هي بالضرورة خاطئة. بل المقصود هو بناء طرح معرفي يستمد أصوله وغاياته من هدايات الوحي، ويفهم الإنسان أخلاقياً ونفسياً واجتماعياً، ويميز بدقة بين صلاح المرجعية، ودقة فهم المشكلة، وملاءمة التدخل العملي الواقعي.
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">
                  ضابط العبارة المعتمد: القرآن الكريم هو المرجعية العليا والمنطلق في بناء الرؤية الإنسانية، مع الاستفادة الكاملة من الخبرة والأدوات البشرية في فهم الوقائع وتنفيذ الإصلاح دون جعلها حاكمة فوق الوحي.
                </div>
              </div>

              {/* What is NOT in the project scope */}
              <div className="p-8 rounded-3xl bg-[#FEF2F2] dark:bg-[#2A1515]/50 border border-[#FECACA] dark:border-[#521B1B] space-y-5">
                <h3 className="text-lg font-black text-rose-800 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>ما ليس من أهداف المشروع (المحاذير المنهجية الخمسة)</span>
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 flex items-center justify-center shrink-0 text-xs font-black">✕</span>
                    <span><strong>لا نهاجم علم النفس الحديث لمجرد أنه حديث أو غربي:</strong> بل نستفيد من أدواته المنضبطة ونُميّز بين الفرضيات والنتائج التجريبية.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 flex items-center justify-center shrink-0 text-xs font-black">✕</span>
                    <span><strong>لا نضع آية أو حديثاً بعد نصيحة جاهزة لإضفاء الشرعية:</strong> سؤال الانطلاق القرآني هو الحاكم للفكرة منذ بداية البحث، وليس زينة لاحقة.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 flex items-center justify-center shrink-0 text-xs font-black">✕</span>
                    <span><strong>لا نفسر كل مشكلة بضعف الإيمان أو فساد الأخلاق:</strong> السلوك الإنساني مركّب قد يرجع لعوامل نمائية، أو ضغوط بيئية، أو فجوات مهارية.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 flex items-center justify-center shrink-0 text-xs font-black">✕</span>
                    <span><strong>لا نقدم وصفة واحدة معلبة لجميع الأطفال والأسر:</strong> نراعي الفروق الفردية والسياقات الأسرية ولا نعمم تجربة واحدة.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 flex items-center justify-center shrink-0 text-xs font-black">✕</span>
                    <span><strong>لا نستخدم النصوص الشرعية لإثبات ادعاءات علمية تجريبية لا تدل عليها:</strong> نحافظ على جلال النص الشرعي وغاياته التوجيهية الكبرى.</span>
                  </li>
                </ul>
              </div>

            </div>
          )}

          {/* TAB 2: THE 6 EPISTEMIC LAYERS */}
          {activeTab === 'layers' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-2 text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold text-[#4E7E76] uppercase tracking-wider">التأصيل الإبستمولوجي</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">الطبقات المعرفية الست</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  الفصل الصارم بين طبقات المعرفة لمنع الخلط بين النص الإلهي المطلق والاستنباط البشري والتطبيقات الظرفية
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {layers.map((l) => (
                  <div
                    key={l.num}
                    className={`p-6 rounded-3xl border-2 ${l.color} space-y-3 shadow-2xs flex flex-col justify-between`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-black/10 dark:bg-white/10">الطبقة {l.num}</span>
                        <Layers className="w-4 h-4 opacity-70" />
                      </div>
                      <h4 className="text-lg font-black">{l.title}</h4>
                      <p className="text-xs font-medium leading-relaxed">{l.meaning}</p>
                    </div>
                    <div className="pt-3 border-t border-current/15 text-[11px] font-semibold opacity-90">
                      <strong>موقع التوثيق في النظام:</strong> {l.system}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-3xl bg-[#FEF9EC] dark:bg-[#2E2413] border border-[#FDF0CD] dark:border-[#4D3A1B] text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                <strong className="block text-[#D97706] mb-1 font-black text-sm">القاعدة الذهبية للفصل بين الطبقات:</strong>
                «الاستنباط التربوي اجتهاد بشري يؤجر صاحبه ويصيب ويخطئ، والفرضية النفسية احتمال يحتاج فحصاً، والتطبيق المنزلي تجربة مرنة. فلا يُرفع اجتهاد إلى مقام النص الإلهي، ولا يُحط النص إلى مستوى الفرضية القابلة للدحض».
              </div>
            </div>
          )}

          {/* TAB 3: THE 8 GOVERNING PRINCIPLES */}
          {activeTab === 'principles' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-2 text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold text-[#4E7E76] uppercase tracking-wider">المرتكزات الضابطة</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">المبادئ الحاكمة الثمانية</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  قواعد تحريرية وبحثية صارمة يلتزم بها كل محتوى وبحث وتطبيق يخرج تحت مظلة المشروع
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {principles.map((pr, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-2xs hover:shadow-md transition-all text-right"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#4E7E76] shrink-0" />
                      <h4 className="text-base font-black text-slate-900 dark:text-white">{pr.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {pr.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: 9-STEP ANALYTICAL MODEL */}
          {activeTab === 'model' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-2 text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold text-[#4E7E76] uppercase tracking-wider">منهجية الفحص السلوكي</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">نموذج التحليل في تسع خطوات</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  رحلة تفكيك الموقف الإنساني والتربوي من رصد المشهد العيني وحتى غرس العادة وقياس الأثر
                </p>
              </div>

              <div className="space-y-3.5">
                {nineSteps.map((step) => (
                  <div
                    key={step.num}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 flex items-start gap-4 shadow-2xs hover:border-[#4E7E76] transition-all"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-[#EDF7F5] dark:bg-[#112924] text-[#4E7E76] font-mono font-black text-sm flex items-center justify-center border border-[#D6EEEA] dark:border-[#1F4A42]">
                      {step.num}
                    </div>
                    <div className="space-y-1 text-right">
                      <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{step.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PILOT SEASON */}
          {activeTab === 'pilot' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-2 text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold text-[#4E7E76] uppercase tracking-wider">التطبيق الميداني الأولي</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">الموسم التجريبي: «من السلوك إلى الجذر»</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  ثلاث حلقات نموذجية خضعت لنموذج التحليل ذي الـ 9 خطوات وفصل الطبقات والتحقق الصارم
                </p>
              </div>

              <div className="space-y-5">
                {pilotEpisodes.map((ep) => (
                  <div
                    key={ep.code}
                    className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-2xs text-right"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#EDF7F5] dark:bg-[#112924] text-[#4E7E76] text-xs font-mono font-black">
                          {ep.code}
                        </span>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white">حلقة {ep.title}</h4>
                      </div>
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {ep.badge}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-bold text-[#CC4E46] dark:text-[#F87171]">
                        الخطاف التحريري: «{ep.hook}»
                      </div>
                      <div className="text-xs text-slate-500 font-semibold">
                        نقطة الانطلاق الشرعية: {ep.anchor}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      <strong className="block text-slate-900 dark:text-white mb-1">الحدود المنهجية الواجب حفظها:</strong>
                      {ep.coreLimit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: QUALITY & ACCREDITATION */}
          {activeTab === 'quality' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-2 text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold text-[#4E7E76] uppercase tracking-wider">حوكمة المحتوى والموثوقية</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">نظام الجودة والاعتماد الصارم</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  لا تُعتمد أي حلقة أو مخرج للنشر لمجرد أنه مؤثر أو جذاب؛ بل يخضع لـ 23 بند جودة عبر 5 فئات رئيسية
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-black text-slate-900 dark:text-white">أ. السلامة الشرعية</h4>
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">حرجة 100%</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    4 بنود صارمة: التحقق المباشر من نص الآية والسورة، تخريج الحديث وحكمه، استيفاء التفسير المعتمد، ومنع أي نسبة شرعية غير مدعومة.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-black text-slate-900 dark:text-white">ب. السلامة المنهجية</h4>
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">بند حرج</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    4 بنود: حكم سؤال الانطلاق للحلقة، بناء مبدأ لا تزويق، الفصل الإلزامي بين الطبقات، وإنصاف المقارنة دون تجنٍّ على النظريات.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-black text-slate-900 dark:text-white">ج. السلامة العلمية</h4>
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">المصادر والسببية</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    4 بنود: توثيق مصادر الادعاءات النفسية، تقديم التفسيرات البديلة، عدم الجزم السببي دون برهان، والامتناع عن التعميم غير المبرر.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-black text-slate-900 dark:text-white">د. النفع التربوي وصون الكرامة</h4>
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">معايير أثر</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    4 بنود: تطبيق عملي محدد، إنصاف المربي والطفل معاً، صون كرامة الأسرة، وتحديد الحدود والإحالة إلى المتخصص عند اللزوم.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed text-right space-y-2">
                <div className="font-bold text-slate-900 dark:text-white text-sm">⛔ بوابات الاعتماد الآلية:</div>
                <p>
                  يمنع نظام إدارة المشروع اعتماد أو نشر أي حلقة إذا وجد بها أي ثغرة شرعية مفتوحة أو بند حرج غير مستوفٍ، مع تسجيل اسم المراجع وتاريخ التدقيق في سجلات التحقق غير القابلة للتعديل الشكلي.
                </p>
              </div>
            </div>
          )}

          {/* CTA Box */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#EDF7F5] via-white to-[#FEF9EC] dark:from-[#112924] dark:via-[#161F2B] dark:to-[#2E2413] border border-slate-200 dark:border-slate-800 text-center space-y-6 shadow-md">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              ترغب في التعاون أو الاستفادة من مخرجات مشروع أقومية القرآن؟
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              المشروع متاح للشراكات البحثية والمؤسسية مع المدارس والمراكز التربوية لتطبيق الحقائب التدريبية وكراسات التطبيقات المنزلية بعد اعتمادها.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/201014876666?text=%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%AD%D9%88%D9%84%20%D9%85%D8%B4%D8%B1%D9%88%D8%B9%20%D8%A3%D9%82%D9%88%D9%85%D9%8A%D8%A9%20%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%AA%D8%B1%D8%A8%D9%8A%D8%A9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#4E7E76] hover:bg-[#3D655E] text-white text-xs font-bold rounded-full transition shadow-md shadow-[#4E7E76]/25"
              >
                <span>تواصل لبحث الشراكات والتطبيقات المؤسسية</span>
                <ArrowLeft className="w-4 h-4" />
              </a>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-[#161F2B] hover:bg-slate-50 dark:hover:bg-[#1F2C3D] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-full transition shadow-2xs"
              >
                <span>العودة إلى الاستشارات</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
