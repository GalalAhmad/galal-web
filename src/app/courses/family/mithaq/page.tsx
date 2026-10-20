'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  Calendar, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  ChevronDown, 
  Send, 
  Clock, 
  HelpCircle,
  Puzzle,
  Heart,
  MessageCircle,
  Compass,
  Shield,
  Layers,
  Home
} from 'lucide-react';

export default function RifqMithaqPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantNotes, setApplicantNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const message = `طلب تسجيل في: رحلة رِفق | ميثاق — للمتزوجين%0Aالاسم: ${applicantName}%0Aالهاتف: ${applicantPhone}%0Aملاحظات: ${applicantNotes || 'لا يوجد'}`;
    const whatsappUrl = `https://wa.me/201014876666?text=${message}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      window.open(whatsappUrl, '_blank');
      setTimeout(() => {
        setSubmitSuccess(false);
        setApplicantName('');
        setApplicantPhone('');
        setApplicantNotes('');
      }, 2500);
    }, 400);
  };

  const stations = [
    {
      num: '01',
      icon: '🧩',
      title: 'فك الشفرة',
      desc: 'فهم اختلافات التفكير والتعبير والاستجابة، والتعرّف على الأنماط المتكررة التي قد تجعل أحد الطرفين يقترب بإلحاح بينما ينسحب الآخر.',
      bg: 'bg-[#EDF5FD] dark:bg-[#122238]',
      border: 'border-[#D6E6F8] dark:border-[#1E3A5F]',
      badgeColor: 'text-[#154F9C]',
    },
    {
      num: '02',
      icon: '❤️',
      title: 'رصيد المشاعر',
      desc: 'فهم الاحتياجات العاطفية وطرق التعبير عن المودة، والتعرّف على ما يساعد كل طرف على الشعور بالاهتمام والتقدير والقرب.',
      bg: 'bg-[#FDF1EE] dark:bg-[#251816]',
      border: 'border-[#F8DDD9] dark:border-[#42221E]',
      badgeColor: 'text-[#CC4E46]',
    },
    {
      num: '03',
      icon: '💬',
      title: 'فن الحوار الآمن',
      desc: 'تطوير مهارات التعبير عن الاحتياجات والإنصات الفعّال، ومناقشة الموضوعات الحساسة دون تحويل الحوار إلى اتهام أو دفاع مستمر.',
      bg: 'bg-[#EDF7F5] dark:bg-[#112924]',
      border: 'border-[#D6EEEA] dark:border-[#1F4A42]',
      badgeColor: 'text-[#4E7E76]',
    },
    {
      num: '04',
      icon: '🌱',
      title: 'إدارة العاصفة',
      desc: 'فهم تصاعد الخلاف، والتعرّف على أنماط التواصل الهدامة، والتدرب على تهدئة الانفعال والعودة إلى النقاش بصورة أكثر أمانًا.',
      bg: 'bg-[#FEF9EC] dark:bg-[#2E2413]',
      border: 'border-[#FDF0CD] dark:border-[#4D3A1B]',
      badgeColor: 'text-[#D97706]',
    },
    {
      num: '05',
      icon: '🛡',
      title: 'هندسة التوقعات',
      desc: 'مراجعة التوقعات والأدوار والحدود، وتنظيم العلاقة مع الأسرتين، وبناء مساحة أسرية مستقلة مع الحفاظ على الاحترام والحقوق.',
      bg: 'bg-[#F4EFFC] dark:bg-[#241738]',
      border: 'border-[#E5D9F8] dark:border-[#3D2561]',
      badgeColor: 'text-[#7C3AED]',
    },
    {
      num: '06',
      icon: '🤝',
      title: 'شراكة المسار',
      desc: 'مناقشة المسؤوليات والقرارات المالية والأولويات، وبناء طريقة مشتركة للتخطيط وإدارة شؤون الحياة اليومية.',
      bg: 'bg-[#EDF5FD] dark:bg-[#122238]',
      border: 'border-[#D6E6F8] dark:border-[#1E3A5F]',
      badgeColor: 'text-[#154F9C]',
    },
    {
      num: '07',
      icon: '✨',
      title: 'حراسة الشغف',
      desc: 'الاهتمام بالمودة والقرب والوقت المشترك، ومواجهة تراجع التواصل بسبب الروتين والمسؤوليات، وبناء عادات صغيرة لتجديد العلاقة.',
      bg: 'bg-[#FDF1EE] dark:bg-[#251816]',
      border: 'border-[#F8DDD9] dark:border-[#42221E]',
      badgeColor: 'text-[#CC4E46]',
    },
    {
      num: '08',
      icon: '🏡',
      title: 'الميثاق المستمر',
      desc: 'تحديد القيم المشتركة، وصياغة اتفاقات أسرية عملية، وبناء رؤية للمستقبل وخطة لمراجعة العلاقة وتطويرها باستمرار.',
      bg: 'bg-[#EDF7F5] dark:bg-[#112924]',
      border: 'border-[#D6EEEA] dark:border-[#1F4A42]',
      badgeColor: 'text-[#4E7E76]',
    },
  ];

  const outcomes = [
    { title: 'تفهم أنماط التفاعل بينكما', desc: 'تلاحظ كيف تؤثر طريقة التفكير والتعبير عن المشاعر والاستجابة للخلاف في علاقتكما.' },
    { title: 'تتعرف على الاحتياجات العاطفية', desc: 'تفهم أهمية التعبير عن الاهتمام والمودة، وتكتشف طرقًا عملية لتعزيز القرب بين الزوجين.' },
    { title: 'تطوّر مهارات الحوار', desc: 'تتدرب على التعبير عن احتياجاتك بوضوح، والإنصات للطرف الآخر، وتقليل الهجوم والدفاعية أثناء النقاش.' },
    { title: 'تدير الخلافات بصورة أنضج', desc: 'تتعلم كيف تهدأ وقت الانفعال، وتفصل بين المشكلة وبين قيمة الشخص، وتبحث عن حلول بدلًا من تصعيد الصراع.' },
    { title: 'تبني الثقة والأمان', desc: 'تراجع أثر الصدق والوضوح والاحترام والحدود والوفاء بالاتفاقات في استقرار العلاقة.' },
    { title: 'تتفق على توقعات الحياة المشتركة', desc: 'تناقش الأدوار والمسؤوليات والعلاقة مع الأسرتين والقرارات المالية والأولويات اليومية.' },
    { title: 'تحافظ على مساحة العلاقة', desc: 'تتعلم أهمية الاهتمام المتبادل والوقت المشترك والطقوس الصغيرة التي تدعم المودة وسط انشغالات الحياة.' },
    { title: 'تبني رؤية مشتركة للمستقبل', desc: 'تضعان خطوات عملية للحفاظ على العلاقة ومراجعة الاتفاقات وتطوير الشراكة مع مرور الوقت.' },
  ];

  const pillars = [
    {
      num: 'أولاً',
      title: 'الانطلاق من القيم الإسلامية',
      desc: 'نستحضر معاني المودة والرحمة وحسن المعاشرة والحقوق والمسؤوليات في القرآن والسنة، ونربطها بالممارسات اليومية التي تساعد الزوجين على التعامل باحترام ورحمة.'
    },
    {
      num: 'ثانياً',
      title: 'فهم العلاقة من منظور نفسي وأسري',
      desc: 'نستفيد من مفاهيم علم النفس والعلاقات الأسرية لفهم أنماط التفاعل والانفعالات والاحتياجات وطرق التواصل، مع تجنب اختزال الخلافات الزوجية في فروق ثابتة أو تعميمات لا تنطبق على الجميع.'
    },
    {
      num: 'ثالثاً',
      title: 'التعلُّم بالتطبيق',
      desc: 'البرنامج لا يكتفي بعرض المعلومات؛ بل يهدف إلى تحويلها إلى مهارات من خلال التمارين والأسئلة والأنشطة وأوراق العمل التي تساعد الزوجين على مراجعة ممارساتهما وتجربة بدائل عملية.'
    },
    {
      num: 'رابعاً',
      title: 'التركيز على العلاقة لا على إدانة أحد الطرفين',
      desc: 'مش هدفنا نحدد مين المذنب في كل خلاف، ولا نفترض أن طرفًا واحدًا هو المسؤول دائمًا عن المشكلة؛ لكننا نساعد على فهم ما يحدث بين الطرفين، وتحديد ما يمكن تغييره، مع التأكيد على مسؤولية كل طرف عن سلوكه واحترامه للآخر.'
    },
    {
      num: 'خامساً',
      title: 'خطوات قابلة للاستمرار',
      desc: 'الهدف مش مجرد تحسن مؤقت بعد انتهاء البرنامج؛ بل مساعدة الزوجين على بناء عادات واتفاقات عملية، ومراجعتها كلما تغيرت ظروف الحياة واحتياجات الأسرة.'
    }
  ];

  const materials = [
    'المحتوى التدريبي للمحطات الثماني لموضوعات متدرجة لفهم العلاقة وتطوير التواصل',
    'كراسة المتدرب لمساحة التأمل وتسجيل الملاحظات والاتفاقات المشتركة',
    'أوراق العمل والتمارين لمراجعة أنماط الحوار والتوقعات والاحتياجات الأسرية',
    'أدوات للتقييم الذاتي كأسئلة منظمة تساعد على التأمل الموضوعي في جوانب العلاقة',
    'بطاقات وأنشطة تطبيقية لتحويل موضوعات البرنامج إلى حوارات وممارسات يومية',
    'وثيقة «ميثاق الأسرة» كنموذج مقترح يساعد الزوجين على صياغة قيم واتفاقات مشتركة',
    'خطة متابعة وتطوير لخطوات عملية تضمن استمرار تحسين العلاقة بعد انتهاء الرحلة'
  ];

  const faqs = [
    {
      q: 'هل البرنامج مناسب للمتزوجين حديثًا فقط؟',
      a: 'لا، البرنامج مناسب للمتزوجين في مراحل مختلفة، سواء كانوا في بداية حياتهم الزوجية أو بعد سنوات من الزواج. وقد تختلف التطبيقات والأولويات بحسب احتياجات كل زوجين.'
    },
    {
      q: 'هل يجب أن يشترك الزوجان معًا؟',
      a: 'تُحدَّد طريقة المشاركة بحسب النسخة النهائية للبرنامج. والاستفادة من بعض الأنشطة المشتركة قد تكون أكبر عند مشاركة الزوجين معًا، مع مراعاة أن المشاركة يجب أن تكون طوعية وآمنة.'
    },
    {
      q: 'هل البرنامج مخصص للأزواج الذين يعانون من مشكلات كبيرة؟',
      a: 'ليس بالضرورة. يمكن الاستفادة منه لتطوير العلاقة والوقاية من تكرار بعض أنماط الخلاف، كما يمكن أن يساعد على فهم تحديات الحياة اليومية. أما المشكلات الشديدة أو التي تتضمن عنفًا أو تهديدًا للسلامة، فقد تحتاج إلى دعم متخصص يناسب طبيعتها.'
    },
    {
      q: 'هل يضمن البرنامج حل الخلافات الزوجية؟',
      a: 'لا يمكن لأي برنامج أن يضمن حل جميع الخلافات؛ فالنتائج تتأثر باستعداد الطرفين للتغيير، وظروفهما، وطبيعة المشكلات. هدف البرنامج هو تطوير الوعي والمهارات التي قد تساعد على إدارة الخلافات بصورة أفضل.'
    },
    {
      q: 'هل البرنامج بديل عن الاستشارات الزوجية؟',
      a: 'لا، البرنامج تدريبي وتوعوي، ولا يحل محل التقييم أو الإرشاد الزوجي المتخصص عندما تحتاج الحالة إلى تدخل مهني مباشر.'
    },
    {
      q: 'هل المحتوى قائم على الجانب الشرعي فقط أم النفسي أيضًا؟',
      a: 'يجمع البرنامج بين القيم والهدي الشرعي، والمفاهيم النفسية والأسرية، والتطبيقات العملية، مع الحرص على التمييز بين النصوص الشرعية والمعرفة العلمية والتمارين التعليمية.'
    }
  ];

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFCFA] dark:bg-[#0D1117] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Breadcrumb Navigation */}
      <div className="py-3 px-4 sm:px-6 bg-slate-50 dark:bg-[#121820] border-b border-slate-200/70 dark:border-slate-800 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <Link href="/courses" className="hover:text-[#4E7E76] transition">مسارات بناء وتمكين</Link>
          <span>/</span>
          <Link href="/courses/family" className="hover:text-[#4E7E76] transition">مسار الأسرة</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100 font-bold">رحلة رِفق | ميثاق (للمتزوجين)</span>
        </div>
      </div>

      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDF5FD] dark:bg-[#122238] border border-[#D6E6F8] dark:border-[#1E3A5F] text-xs font-bold text-[#154F9C] dark:text-[#60A5FA] shadow-2xs">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>مسار الأسرة • للمتزوجين</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              رحلة رِفق | ميثاق — للمتزوجين
            </h1>
            <p className="text-base sm:text-xl font-bold text-[#154F9C] dark:text-[#60A5FA]">
              «البيوت لا تُبنى بحفلات الزفاف وحدها، بل بالوعي والمهارات والرفق»
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            الحياة الزوجية مش مجرد حب جمع بين شخصين؛ لكنها شراكة يومية تحتاج إلى فهم متبادل، وحوار آمن، وثقة، وقدرة على إدارة الخلافات، وتجديد المودة وسط مسؤوليات الحياة.
          </p>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            في <strong>«رحلة رفق | ميثاق»</strong> هتخوض رحلة عملية تساعدك أنت وشريك حياتك على فهم أنماط التفاعل بينكما، والتعبير عن الاحتياجات بصورة أوضح، وإدارة الخلافات بوعي، وبناء مساحة أكبر من الأمان العاطفي والشراكة والمسؤولية؛ من خلال محتوى يجمع بين الهدي القرآني والنبوي، وعلم النفس الأسري، والتمارين والتطبيقات العملية.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#register"
              className="px-8 py-3.5 rounded-full bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs sm:text-sm font-bold transition shadow-md shadow-[#154F9C]/25"
            >
              انضم إلى رحلة رفق | ميثاق
            </a>
            <a
              href="#curriculum"
              className="px-8 py-3.5 rounded-full bg-white dark:bg-[#161F2B] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#154F9C] text-xs sm:text-sm font-bold transition shadow-2xs"
            >
              اكتشف محطات الرحلة
            </a>
          </div>

          <div className="pt-2">
            <span className="inline-block text-[11px] font-semibold text-slate-500">
              ⚡ 8 محطات تدريبية وتطبيقية شاملة كراسة المتدرب وميثاق الأسرة
            </span>
          </div>

        </div>
      </section>

      {/* 2. لماذا تحتاج إلى هذه الرحلة؟ (The Problem & Vision) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#EDF5FD]/40 dark:bg-[#122238]/20 border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-4xl mx-auto space-y-8 text-right">
          
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#154F9C] uppercase tracking-wider">الرؤية والاحتياج</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              لماذا تحتاج إلى هذه الرحلة؟
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            <p>
              أغلب العلاقات الزوجية لا تواجه تحدياتها في صورة مشكلة واحدة كبيرة فقط؛ أحيانًا تبدأ المسافة بين الزوجين بتفاصيل صغيرة تتكرر كل يوم.
            </p>
            <p>
              كلمة تُفهم بطريقة مختلفة، واحتياج لا يُعبَّر عنه بوضوح، وعتاب يتكرر دون أن يصل إلى حل، وصمت يترك كل طرف يحاول تفسير ما يدور في ذهن الآخر، ومسؤوليات تتزايد حتى تصبح العلاقة آخر ما يجد الزوجان وقتًا للاهتمام به.
            </p>
            <p>
              ومع الوقت، قد يتحول الحوار إلى دفاع وهجوم، ويصبح الخلاف معركة لإثبات من المخطئ بدلًا من أن يكون فرصة لفهم المشكلة وحلها، وقد تنشغل الحياة اليومية بإدارة البيت حتى تتراجع مساحة القرب والاهتمام المتبادل.
            </p>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#161F2B] border border-[#D6E6F8] dark:border-[#1E3A5F] my-4 font-bold text-slate-900 dark:text-slate-100">
              «المشكلة مش بالضرورة إن الحب انتهى؛ أحيانًا بيكون الزوجان محتاجين يفهموا بعض بصورة أفضل، ويتعلموا مهارات تساعدهم يحافظوا على العلاقة وسط ضغوط الحياة.»
            </div>

            <p>
              ومن هنا جاءت فكرة «رحلة رفق | ميثاق»: برنامج يساعد الزوجين على التوقف عن تكرار الأنماط المرهقة، وفهم ما يحدث بينهما، وتعلُّم طرق عملية للتواصل وإدارة الخلافات وتجديد الشراكة.
            </p>
          </div>

          {/* Ayah Box */}
          <div className="p-6 rounded-3xl bg-[#FEF9EC] dark:bg-[#2E2413] border border-[#FDF0CD] dark:border-[#4D3A1B] text-center space-y-2">
            <p className="text-base sm:text-lg font-bold text-[#D97706] leading-relaxed">
              ﴿وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنْفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً﴾
            </p>
            <span className="text-xs text-slate-500 font-semibold">[سورة الروم: 21]</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            في رحلة رفق، بننطلق من معاني السكن والمودة والرحمة، ونربطها بمهارات عملية تساعد الزوجين على بناء علاقة أكثر وعيًا، مع إدراك أن الاستقرار لا يعني غياب الخلاف، بل القدرة على التعامل معه بطريقة تحفظ الكرامة وتدعم العلاقة.
          </p>

        </div>
      </section>

      {/* 3. ماذا ستكتشف خلال الرحلة؟ (Learning Outcomes) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-[#154F9C] uppercase tracking-wider">مخرجات التعلم</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              ماذا ستكتشف خلال الرحلة؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              بنهاية الرحلة، ستكون لديكما فرصة لاكتساب 8 مهارات عملية تحمي استقرار البيت
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {outcomes.map((out, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-2xs hover:shadow-md transition-all text-right flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#EDF5FD] dark:bg-[#122238] text-[#154F9C] dark:text-[#60A5FA] flex items-center justify-center text-xs font-black">
                    0{idx + 1}
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 leading-snug">
                    {out.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {out.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. خريطة محطات الرحلة الثمانية (Course Curriculum) */}
      <section id="curriculum" className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-50 dark:bg-[#0E131A] border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-5xl mx-auto space-y-10">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-[#154F9C] uppercase tracking-wider">المنهج والمسار</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              خريطة محطات الرحلة الثمانية
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              تنتقل بالزوجين تدرجياً من فهم العلاقة وأنماط التفاعل إلى بناء رؤية وميثاق مشترك للحياة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {stations.map((st) => (
              <div
                key={st.num}
                className={`p-6 sm:p-7 rounded-3xl border ${st.bg} ${st.border} space-y-3 shadow-2xs hover:shadow-md transition-all text-right`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black ${st.badgeColor}`}>المحطة {st.num}</span>
                  <span className="text-2xl">{st.icon}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {st.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 text-center font-normal pt-2">
            * ملحوظة: تمثل هذه المحطات الخريطة العامة للبرنامج، وتُحدَّد تفاصيل كل محطة وأنشطتها وأدواتها وفق الحقيبة التدريبية النهائية.
          </p>

        </div>
      </section>

      {/* 5. لمن صُممت رحلة رفق | ميثاق؟ (Target Audience) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8 text-right">
          
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#154F9C] uppercase tracking-wider">الفئة المستهدفة</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              لمن صُممت رحلة رفق | ميثاق؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              البرنامج مناسب للمتزوجين الذين يريدون تطوير علاقتهم وبناء شراكة أكثر وعيًا، وخاصة:
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#154F9C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-bold">المتزوجون حديثًا:</strong>
                <span className="text-xs text-slate-600 dark:text-slate-300 mr-1.5 font-normal">الذين يرغبون في تأسيس عادات صحية للحوار والتفاهم وتوزيع المسؤوليات منذ بداية الحياة الزوجية.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#154F9C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-bold">الأزواج بعد سنوات من الزواج:</strong>
                <span className="text-xs text-slate-600 dark:text-slate-300 mr-1.5 font-normal">الذين يريدون استعادة مساحة القرب والاهتمام وسط مسؤوليات العمل والأبناء والحياة اليومية.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#154F9C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-bold">الأزواج الذين يتكرر بينهم الخلاف:</strong>
                <span className="text-xs text-slate-600 dark:text-slate-300 mr-1.5 font-normal">ويرغبون في فهم الأنماط المتكررة وتعلُّم طرق أفضل للتعامل مع الاختلاف.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#154F9C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-bold">الأزواج الذين يشعرون بتراجع التواصل:</strong>
                <span className="text-xs text-slate-600 dark:text-slate-300 mr-1.5 font-normal">ويريدون التعبير عن احتياجاتهم بوضوح واستعادة الحوار والاهتمام المتبادل.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#154F9C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-bold">كل زوجين يرغبان في تطوير علاقتهما:</strong>
                <span className="text-xs text-slate-600 dark:text-slate-300 mr-1.5 font-normal">حتى لو لم تكن هناك أزمة واضحة، ويريدان بناء عادات تحافظ على المودة والثقة والتعاون.</span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-200 leading-relaxed flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>تنويه مهني: البرنامج تعليمي وتدريبي، وليس بديلاً عن التدخل المتخصص عند وجود عنف أو تهديد للسلامة أو مشكلات نفسية وأسرية تحتاج إلى تقييم مهني فردي.</span>
          </div>

        </div>
      </section>

      {/* 6. ما الذي يميز رحلة رفق | ميثاق؟ (Our Approach) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#EDF7F5]/30 dark:bg-[#112924]/10 border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-4xl mx-auto space-y-8 text-right">
          
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#4E7E76] uppercase tracking-wider">المنهجية الفلسفية</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              ما الذي يميز رحلة رفق | ميثاق؟
            </h2>
          </div>

          <div className="space-y-4">
            {pillars.map((pil, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-2xs text-right"
              >
                <div className="flex items-center gap-2 text-xs font-black text-[#4E7E76] dark:text-[#5E988E]">
                  <span>{pil.num}:</span>
                  <span>{pil.title}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {pil.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. ماذا ستحصل عليه من الرحلة؟ (Materials) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8 text-right">
          
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#154F9C] uppercase tracking-wider">الحقيبة التدريبية</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              ماذا ستحصل عليه من الرحلة؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              صُممت رحلة رفق | ميثاق لتجمع بين المعرفة والتطبيق العملي، وتشمل الحقيبة الجاري استكمالها:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {materials.map((mat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200 dark:border-slate-800 flex items-start gap-3 shadow-2xs"
              >
                <CheckCircle2 className="w-4 h-4 text-[#154F9C] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
                  {mat}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 font-normal text-center pt-2">
            * يُحدَّد شكل المواد المتاحة فعلياً للمشترك، سواء كانت رقمية أو مطبوعة أو مصاحبة للقاءات التدريبية، وفق النسخة النهائية المعتمدة من البرنامج.
          </p>

        </div>
      </section>

      {/* 8. من يقدم لك الرحلة؟ (About the Trainer) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#EDF5FD]/40 dark:bg-[#122238]/20 border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-right">
            
            <div className="md:col-span-8 space-y-4">
              <span className="text-xs font-bold text-[#154F9C] uppercase tracking-wider">مقدّم البرنامج</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                د. جلال أحمد
              </h2>
              <p className="text-xs sm:text-sm font-bold text-[#4E7E76] dark:text-[#5E988E]">
                استشاري تربوي ونفسي ومعالج أسري
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                يمتد عمله بين التربية والإرشاد النفسي والأسري وتطوير المؤسسات التعليمية، مع اهتمام بتقديم المعرفة النفسية والتربوية في صورة عملية مبسطة، تراعي القيم الإسلامية والسياق الثقافي العربي، وتساعد الأفراد والأسر على فهم أنفسهم وعلاقاتهم واتخاذ قرارات أكثر وعيًا.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                ومن خلال «رحلة رفق»، يجتمع الاهتمام بالنفس والأسرة والتربية في برنامج يهدف إلى مساعدة الأزواج على تطوير مهاراتهم، وفهم أنماط التفاعل بينهم، وبناء علاقة تقوم على الاحترام والمودة والرحمة والمسؤولية المشتركة.
              </p>
            </div>

            <div className="md:col-span-4 flex justify-center">
              <div className="w-48 sm:w-56 aspect-square rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-900">
                <img
                  src="/assets/dr-galal-portrait.webp"
                  alt="د. جلال أحمد"
                  loading="lazy"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. أسئلة شائعة (FAQ) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-8 text-right">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#154F9C] uppercase tracking-wider">إجابات وتوضيحات</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              الأسئلة الشائعة حول البرنامج
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#161F2B] overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-right flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 cursor-pointer"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-[#154F9C]' : ''}`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal border-t border-slate-100 dark:border-slate-800">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. الدعوة الختامية ونموذج التسجيل (Final CTA & Form) */}
      <section id="register" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#EDF5FD]/60 dark:bg-[#122238]/40 border-t border-slate-200/70 dark:border-slate-800">
        <div className="max-w-3xl mx-auto space-y-8 text-center">
          
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 leading-snug">
              مش لازم تستنوا لحد ما تكبر المسافة بينكم عشان تبدأوا تهتموا بعلاقتكم
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
              العلاقة الزوجية محتاجة رعاية مستمرة، وحوارًا صادقًا، وفهمًا متبادلًا، واستعدادًا للتعلُّم والتغيير. ابدأوا رحلة التجديد… فالميثاق لا يُبنى مرة واحدة، بل يتجدد كل يوم.
            </p>
          </div>

          {/* Registration Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200 dark:border-slate-800 shadow-md text-right space-y-5">
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 text-center">
              سجل اهتمامك الآن في الدفعة القادمة
            </h3>

            {submitSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center">
                ✓ تم تجهيز طلبك وسيتم فتح محادثة واتساب للتنسيق وتزويدك بالموعد والتفاصيل.
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الاسم الكريم *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="اكتب اسمك الثلاثي"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رقم الهاتف / واتساب (مع رمز الدولة) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="+966xxxxxxxxx أو +20xxxxxxxxx"
                    dir="ltr"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#154F9C] text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ملاحظات أو استفسار محدد (اختياري)
                  </label>
                  <textarea
                    rows={2}
                    value={applicantNotes}
                    onChange={(e) => setApplicantNotes(e.target.value)}
                    placeholder="أي توضيحات أو تساؤلات ترغب في طرحها..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-[#154F9C]/20 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'جاري التجهيز...' : 'انضم إلى رحلة رفق | ميثاق عبر واتساب'}</span>
                </button>
              </form>
            )}

            <p className="text-[10px] text-slate-400 text-center">
              بياناتك محمية بسرية تامة ولا يتم مشاركتها مطلقاً مع أي طرف ثالث.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
