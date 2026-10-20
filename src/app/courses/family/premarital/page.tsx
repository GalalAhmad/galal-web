'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Heart, 
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
  Compass,
  HeartHandshake,
  MessageCircle,
  Shield,
  Layers,
  Home,
  Check,
  Eye,
  FileText,
  BookmarkCheck,
  Award,
  ChevronRight
} from 'lucide-react';

export default function RifqPremaritalPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantStatus, setApplicantStatus] = useState('مقبل على الزواج (مخطوب)');
  const [applicantNotes, setApplicantNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const message = `طلب تسجيل في: رحلة رِفق | للمقبلين على الزواج%0Aالاسم: ${applicantName}%0Aالهاتف: ${applicantPhone}%0Aالحالة: ${applicantStatus}%0Aملاحظات: ${applicantNotes || 'لا يوجد'}`;
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
      icon: '🧭',
      title: 'اعرف نفسك',
      desc: 'اكتشاف الذات، وفهم الدوافع والتوقعات، ومراجعة الجاهزية النفسية والشخصية للزواج، وتحديد نقاط القوة والجوانب التي تحتاج إلى تطوير.',
      bg: 'bg-[#EDF5FD] dark:bg-[#122238]',
      border: 'border-[#D6E6F8] dark:border-[#1E3A5F]',
      badge: 'المحطة المفصلة',
      hasDetail: true
    },
    {
      num: '02',
      icon: '❤️',
      title: 'أحسن الاختيار',
      desc: 'التمييز بين الإعجاب والتوافق، وفهم معايير الاختيار الواعي، ومراجعة الأولويات، والانتباه إلى مؤشرات التوافق والمخاطر التي تستحق التوقف والتقييم.',
      bg: 'bg-[#F2FBF7] dark:bg-[#0D261E]',
      border: 'border-[#D2F3E3] dark:border-[#164635]'
    },
    {
      num: '03',
      icon: '🤝',
      title: 'ابنِ الشراكة',
      desc: 'فهم معنى الزواج كشراكة ومسؤولية مشتركة، ومراجعة الأدوار والتوقعات، والتعرّف على أهمية الاتفاق على القيم والأولويات وطريقة إدارة الحياة.',
      bg: 'bg-[#FDF9F0] dark:bg-[#2A2312]',
      border: 'border-[#FAECD3] dark:border-[#4B3C1F]'
    },
    {
      num: '04',
      icon: '💬',
      title: 'أتقن الحوار',
      desc: 'التعبير عن الاحتياجات بوضوح، والإنصات باهتمام، وطرح الأسئلة المهمة، والتعامل مع الاختلاف في الرأي دون تحويل الحوار إلى هجوم أو دفاع مستمر.',
      bg: 'bg-[#F5F3FF] dark:bg-[#201938]',
      border: 'border-[#E3DEFC] dark:border-[#382D5C]'
    },
    {
      num: '05',
      icon: '🛡️',
      title: 'ابنِ الثقة',
      desc: 'فهم دور الصدق والوضوح والاحترام والحدود الشخصية، والتعرّف على أهمية الأمان النفسي والوفاء بالاتفاقات في بناء العلاقة.',
      bg: 'bg-[#EDF5FD] dark:bg-[#122238]',
      border: 'border-[#D6E6F8] dark:border-[#1E3A5F]'
    },
    {
      num: '06',
      icon: '🌱',
      title: 'أدر الخلاف',
      desc: 'الاستعداد للاختلاف الطبيعي بين الزوجين، وفهم محفزات الانفعال، والتدرّب على تهدئة المواقف الصعبة والبحث عن حلول تحفظ كرامة الطرفين.',
      bg: 'bg-[#F2FBF7] dark:bg-[#0D261E]',
      border: 'border-[#D2F3E3] dark:border-[#164635]'
    },
    {
      num: '07',
      icon: '🏡',
      title: 'ابنِ البيت',
      desc: 'التفكير في متطلبات الحياة اليومية، والعلاقة مع الأسرتين، والمسؤوليات والأولويات والمال، وكيفية تأسيس بيت له قيمه واتفاقاته الخاصة.',
      bg: 'bg-[#FDF9F0] dark:bg-[#2A2312]',
      border: 'border-[#FAECD3] dark:border-[#4B3C1F]'
    },
    {
      num: '08',
      icon: '✨',
      title: 'بداية الحياة',
      desc: 'جمع ما تعلمته في خطة استعداد شخصية، وتحديد الخطوات التالية، وصياغة رؤية مشتركة للحياة التي ترغب في بنائها مع شريك حياتك.',
      bg: 'bg-[#F5F3FF] dark:bg-[#201938]',
      border: 'border-[#E3DEFC] dark:border-[#382D5C]'
    }
  ];

  const stationOneAxes = [
    {
      num: '1',
      title: 'معرفة الذات',
      desc: 'إزاي شايف نفسك؟ إيه نقاط قوتك؟ وإيه الجوانب اللي محتاج تفهمها أو تطورها؟'
    },
    {
      num: '2',
      title: 'مراجعة الجاهزية',
      desc: 'الجاهزية للزواج مش مرتبطة بالسن أو الإمكانات المادية فقط؛ لكنها كمان مرتبطة بالنضج، وتحمل المسؤولية، وإدارة الانفعالات، والقدرة على التواصل.'
    },
    {
      num: '3',
      title: 'بوصلة الدوافع',
      desc: 'ليه عايز تتجوز دلوقتي؟ وإيه اللي بتتمناه من الزواج؟ وهل دوافعك نابعة من رغبة في بناء حياة مشتركة، ولا فيه احتياجات أو ضغوط محتاجة منك مراجعة؟'
    },
    {
      num: '4',
      title: 'حقيبة الإنسان',
      desc: 'كل واحد فينا بيدخل العلاقة ومعاه قيمه وعاداته ومعتقداته وخبراته ومخاوفه وأحلامه. فهم اللي في حقيبتك يساعدك تعرف إيه اللي هيساعدك وإيه اللي محتاج وعي وانتباه.'
    },
    {
      num: '5',
      title: 'خريطة النضج الشخصي',
      desc: 'تحديد الأولويات والجوانب اللي محتاج تطورها في نفسك قبل الارتباط أو إتمام الزواج، عشان تدخل العلاقة وأنت أكثر وعيًا واستقرارًا.'
    }
  ];

  const outcomes = [
    {
      title: 'تفهم نفسك بصورة أعمق',
      desc: 'تتعرّف على قيمك، واحتياجاتك، ونقاط قوتك، والجوانب اللي محتاج تطورها قبل الزواج.'
    },
    {
      title: 'تراجع دوافعك للزواج',
      desc: 'تميّز بين الرغبة الواعية في بناء شراكة، وبين الدوافع اللي ممكن تحتاج منك وقفة ومراجعة.'
    },
    {
      title: 'تحدد معايير اختيارك',
      desc: 'تعرف إيه الصفات الأساسية اللي تبحث عنها في شريك الحياة، وإيه الأمور اللي تحتاج إلى تفاهم واتفاق.'
    },
    {
      title: 'تراجع توقعاتك',
      desc: 'تفهم الفرق بين الصورة المثالية عن الزواج وبين الواقع اليومي للحياة المشتركة.'
    },
    {
      title: 'تستعد للمسؤولية',
      desc: 'تفكر في الجوانب النفسية والاجتماعية والأسرية والعملية المرتبطة بالزواج.'
    },
    {
      title: 'تطوّر مهارات التواصل',
      desc: 'تتدرّب على التعبير عن احتياجاتك، والاستماع للطرف الآخر، والتعامل مع الاختلاف بصورة أكثر نضجًا.'
    },
    {
      title: 'تبدأ بخطة واضحة للتطوير',
      desc: 'تحدد خطوات عملية تساعدك على الاستعداد للزواج بدل الاكتفاء بالمعلومات النظرية.'
    }
  ];

  const audience = [
    {
      title: 'المقبلون على الزواج والمخطوبون',
      desc: 'الراغبون في بناء أساس سليم ومستقر لحياتهم المشتركة وتفادي العثرات المبكرة.'
    },
    {
      title: 'الشباب والفتيات في مرحلة التفكير في الزواج',
      desc: 'من يبحثون عن الاستعداد النفسي والاجتماعي وفهم متطلبات المرحلة المقبلة بوعي.'
    },
    {
      title: 'من يريد مراجعة معايير اختياره',
      desc: 'الراغبون في التحقق من التوافق الفكري والروحي والنفسي قبل اتخاذ القرار النهائي.'
    },
    {
      title: 'من يشعر بالقلق أو التردد تجاه الزواج',
      desc: 'من يحتاج إلى رؤية واقعية متوازنة وتفكيك المخاوف غير المبررة حول مسؤوليات الزواج.'
    },
    {
      title: 'الباحثون عن مهارات تواصل ناضجة',
      desc: 'كل من يرغب في اكتساب أدوات الحوار وإدارة الاختلاف وتأسيس بيت على المودة والرحمة.'
    }
  ];

  const pillars = [
    {
      title: 'أولًا: الانطلاق من القيم الإسلامية',
      desc: 'الاستناد إلى قيم السكن والمودة والرحمة والعدل والإحسان، باعتبارها أساسًا روحيًا وأخلاقيًا يمنح العلاقة عمقًا واستقرارًا.'
    },
    {
      title: 'ثانيًا: الاستفادة من علم النفس والأسرة',
      desc: 'توظيف المفاهيم النفسية والتربوية المعاصرة في فهم الشخصية وأنماط التواصل ومحفزات السلوك في العلاقات الإنسانية.'
    },
    {
      title: 'ثالثًا: التعلُّم بالتطبيق لا بالمحاضرات فقط',
      desc: 'الاعتماد على التمارين العملية وأوراق العمل وأدوات التقييم الذاتي، لتتحول الأفكار إلى ممارسات واضحة.'
    },
    {
      title: 'رابعًا: رحلة متدرجة ومترابطة',
      desc: 'الانتقال بالمتدرب من اكتشاف الذات إلى حسن الاختيار، ثم إلى مهارات التواصل وبناء البيت والاستعداد للشراكة. كل محطة تمهّد لما بعدها.'
    },
    {
      title: 'خامسًا: واقعية بلا مثالية زائفة',
      desc: 'مش هنقدّم الزواج باعتباره حياة خالية من المشكلات، ولا هنعدك بأن البرنامج سيضمن نجاح العلاقة؛ لكن هنساعدك تفهم التحديات المتوقعة، وتستعد لها بوعي ومهارات أفضل.'
    }
  ];

  const materials = [
    { title: 'المحتوى التدريبي للمحطات الثماني', desc: 'موضوعات متدرجة تساعدك على الانتقال من اكتشاف الذات إلى الاستعداد للحياة المشتركة.' },
    { title: 'كراسة المسافر', desc: 'مساحة لتسجيل الاكتشافات والإجابات والتأملات والخطوات الشخصية خلال الرحلة.' },
    { title: 'أوراق العمل والتمارين', desc: 'أنشطة تساعدك على مراجعة الدوافع والتوقعات والقيم ومعايير الاختيار.' },
    { title: 'أدوات للتقييم الذاتي', desc: 'أسئلة منظمة تساعدك على التفكير في جوانب الجاهزية والتطوير الشخصي، دون أن تحل محل التقييم المتخصص.' },
    { title: 'المهام التطبيقية', desc: 'خطوات عملية تساعدك على ربط كل محطة بحياتك وقراراتك الواقعية.' },
    { title: 'جواز سفر الرحلة', desc: 'تصور تفاعلي لتوثيق التقدم والإنجازات بين محطات الرحلة الثمانية.' },
    { title: 'خطة الاستعداد الشخصي', desc: 'لتحديد الأولويات والجوانب التي تحتاج إلى تطوير ومتابعة بعد انتهاء البرنامج.' }
  ];

  const faqs = [
    {
      q: 'هل البرنامج للمخطوبين فقط؟',
      a: 'لا، البرنامج مناسب للمقبلين على الزواج عمومًا، سواء كانوا في مرحلة الخطوبة أو يستعدون للارتباط مستقبلًا. وقد تختلف التطبيقات بحسب مرحلة كل مشارك.'
    },
    {
      q: 'هل أحتاج إلى خبرة سابقة أو معرفة بعلم النفس؟',
      a: 'لا، المحتوى موجّه بلغة مبسطة وتطبيقات عملية، ولا يشترط تخصصًا أو معرفة مسبقة بعلم النفس.'
    },
    {
      q: 'هل البرنامج يضمن نجاح الزواج؟',
      a: 'لا يوجد برنامج يستطيع ضمان نجاح أي علاقة؛ لأن الزواج يعتمد على قرارات الطرفين واستعدادهما وممارساتهما المستمرة. هدف الرحلة هو تعزيز الوعي والاستعداد والمهارات التي قد تساعد على بناء علاقة أكثر صحة واستقرارًا.'
    },
    {
      q: 'هل البرنامج بديل عن الاستشارة الأسرية؟',
      a: 'لا، البرنامج تدريبي وتوعوي، وليس بديلًا عن الاستشارة النفسية أو الأسرية المتخصصة عند وجود مشكلات تحتاج إلى تقييم فردي أو تدخل مهني.'
    },
    {
      q: 'هل يمكنني الاستفادة من البرنامج إذا لم أكن مخطوبًا بعد؟',
      a: 'نعم، بل إن البدء مبكرًا يمنحك فرصة لفهم نفسك، وتطوير مهاراتك، وتكوين تصور أكثر واقعية عن الزواج قبل اتخاذ القرار.'
    },
    {
      q: 'هل المحتوى قائم على الجانب الشرعي فقط أم النفسي أيضًا؟',
      a: 'يجمع البرنامج بين القيم والهدي الشرعي، والمفاهيم النفسية والتربوية، والتطبيقات العملية، مع الحرص على التمييز بين النص الشرعي، والمعرفة العلمية، والتمارين التعليمية.'
    }
  ];

  return (
    <main className="min-h-screen bg-[#FDFCFB] dark:bg-[#0C111C] text-slate-800 dark:text-slate-100 flex flex-col antialiased selection:bg-[#154F9C]/10 selection:text-[#154F9C]">
      <Navbar />

      {/* Breadcrumb Bar */}
      <section className="border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1524]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-[#154F9C] transition">الرئيسية</Link>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 text-slate-300" />
            <Link href="/courses" className="hover:text-[#154F9C] transition">مسارات بناء وتمكين</Link>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 text-slate-300" />
            <Link href="/courses/family" className="hover:text-[#154F9C] transition">مسار الأسرة</Link>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 text-slate-300" />
            <span className="text-slate-800 dark:text-slate-200 font-medium">رحلة رِفق | للمقبلين على الزواج</span>
          </div>
        </div>
      </section>

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-b from-[#F2FBF7]/50 via-[#FDFCFB] to-transparent dark:from-[#0D261E]/20 dark:via-[#0C111C]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#168962]/10 border border-[#168962]/20 text-[#168962] text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مسار الأسرة • برنامج الإعداد الواعي للزواج</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-snug mb-5">
            رحلة رِفق | للمقبلين على الزواج
          </h1>

          <p className="text-lg sm:text-xl text-[#168962] dark:text-[#28B082] font-semibold max-w-3xl mx-auto mb-6">
            ابدأ رحلتك بوعي… فكل بيت مطمئن يبدأ بخطوة واعية.
          </p>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            الزواج مش مجرد اختيار شخص بتحبه، ولا يوم جميل بتبدأ فيه حياة جديدة؛ الزواج شراكة محتاجة وعي بالنفس، وحُسن اختيار، واستعداد للمسؤولية، ومهارات تساعدك تبني بيتًا قائمًا على المودة والرحمة والتفاهم.
            <br className="hidden sm:inline" />
            في <strong className="text-slate-800 dark:text-white font-bold">«رحلة رِفق»</strong> هتبدأ رحلة عملية لاكتشاف نفسك، وفهم دوافعك للزواج، والتعرّف على معايير الاختيار الواعي، واكتساب المهارات الأساسية لبناء علاقة زوجية صحية ومستقرة؛ من خلال محتوى يجمع بين الهدي القرآني والنبوي، وعلم النفس والتربية، والتمارين والأنشطة التطبيقية.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="#register"
              className="px-7 py-3 rounded-full bg-[#154F9C] hover:bg-[#103D7A] text-white text-sm font-bold shadow-lg shadow-[#154F9C]/20 transition flex items-center gap-2"
            >
              <span>انضم إلى رحلة رِفق</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-0" />
            </a>

            <a
              href="#curriculum"
              className="px-6 py-3 rounded-full border border-slate-300 dark:border-slate-700 hover:border-[#154F9C] hover:text-[#154F9C] dark:hover:text-[#4A8BE8] text-slate-700 dark:text-slate-300 text-sm font-semibold transition"
            >
              اكتشف محطات الرحلة
            </a>
          </div>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-12 text-right">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EDF5FD] dark:bg-[#122238] text-[#154F9C] flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">8 محطات تدريبية</div>
                <div className="text-[11px] text-slate-500">من الذات إلى الشراكة</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F2FBF7] dark:bg-[#0D261E] text-[#168962] flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">كراسة المسافر</div>
                <div className="text-[11px] text-slate-500">تمارين وتقييم ذاتي</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FDF9F0] dark:bg-[#2A2312] text-[#B87A14] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">إشراف استشاري</div>
                <div className="text-[11px] text-slate-500">جلال أحمد</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F5F3FF] dark:bg-[#201938] text-[#7452B8] flex items-center justify-center shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">تأصيل وتطبيق</div>
                <div className="text-[11px] text-slate-500">شرعي ونفسي عملي</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Problem & Vision */}
      <section className="py-14 sm:py-20 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-[#0E1524]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-[#168962] tracking-wider uppercase mb-2 block">الرؤية والمنطلق</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              لماذا تحتاج إلى هذه الرحلة؟
            </h2>
          </div>

          <div className="space-y-5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed text-right">
            <p className="p-5 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800">
              أحيانًا بنستعد للفرح بكل تفاصيله، وننسى نستعد للحياة اللي هتبدأ بعده.
              <br className="my-2" />
              بنهتم بتجهيز البيت، واختيار الأثاث، وتحديد موعد الزفاف، لكن هل أخدنا وقتًا كافيًا عشان نفهم نفسنا؟ وهل نعرف فعلًا إيه اللي بندور عليه في شريك الحياة؟ وهل توقعاتنا عن الزواج واقعية؟ وهل عندنا استعداد نتحمل المسؤولية، ونتحاور وقت الاختلاف، ونبني حياة مشتركة مع إنسان له شخصيته واحتياجاته وطريقته المختلفة في التفكير؟
            </p>

            <div className="p-5 rounded-2xl bg-[#154F9C]/5 dark:bg-[#154F9C]/10 border-r-4 border-[#154F9C] text-slate-800 dark:text-slate-200 font-medium">
              المشكلة مش دايمًا إننا اخترنا الشخص الخطأ؛ أحيانًا بندخل العلاقة من غير ما نكون مستعدين لها بالشكل الكافي.
            </div>

            <p>
              ومن هنا جاءت فكرة «رحلة رِفق»: مساحة للتعلُّم والاستعداد قبل اتخاذ واحدة من أهم قرارات الحياة.
            </p>

            <p>
              مش هدفنا إننا نبحث عن إنسان كامل بلا عيوب، ولا إننا نوصل لوصفة سحرية تضمن حياة بلا خلافات؛ لكن هدفنا إنك تدخل الزواج بوعي أكبر بنفسك، وبصورة أكثر واقعية عن شريك الحياة، وبمهارات تساعدك تتعامل مع تحديات الحياة المشتركة بمسؤولية ورحمة.
            </p>

            {/* Quranic Verse Box */}
            <div className="my-8 p-6 rounded-2xl bg-gradient-to-r from-[#F2FBF7] to-[#EDF5FD] dark:from-[#0D261E] dark:to-[#122238] border border-[#D2F3E3] dark:border-[#1E3A5F] text-center">
              <p className="text-base sm:text-lg font-serif text-slate-800 dark:text-slate-100 leading-loose mb-2">
                ﴿وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنْفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً﴾
              </p>
              <span className="text-xs font-bold text-[#168962] dark:text-[#28B082]">[سورة الروم: 21]</span>
            </div>

            <p>
              في رحلة رِفق، بننطلق من المعاني دي، ونحوّلها إلى فهم وتدريب وخطوات عملية تساعدك تستعد لبناء بيت تسوده المودة والرحمة، مع إدراك أن نجاح العلاقة مسؤولية مشتركة وعمل مستمر من الطرفين.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Learning Outcomes */}
      <section className="py-14 sm:py-20 border-b border-slate-100 dark:border-slate-800/60 bg-[#FDFCFB] dark:bg-[#0C111C]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#154F9C] tracking-wider uppercase mb-2 block">مخرجات التعلم</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              ماذا ستكتشف خلال الرحلة؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              بنهاية محطات الرحلة الثمانية، ستكتسب مهارات وبصائر عملية تجعل انتقالك نحو بيت الزوجية انتقالًا واعيًا ومطمئنًا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outcomes.map((item, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-white dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800 shadow-xs flex items-start gap-4 transition hover:border-[#154F9C]/30"
              >
                <div className="w-8 h-8 rounded-full bg-[#154F9C]/10 text-[#154F9C] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Course Curriculum (8 Stations) */}
      <section id="curriculum" className="py-14 sm:py-20 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-[#0E1524]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#168962] tracking-wider uppercase mb-2 block">المنهج التدريبي</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              خريطة محطات الرحلة الثمانية
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl mx-auto">
              الرحلة مكوّنة من 8 محطات مترابطة؛ كل محطة بتضيف خطوة جديدة في استعدادك لبناء حياة زوجية واعية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stations.map((station, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border ${station.bg} ${station.border} transition flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-extrabold text-slate-400/80 font-mono">
                      {station.num}
                    </span>
                    <div className="flex items-center gap-2">
                      {station.badge && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#154F9C] text-white">
                          {station.badge}
                        </span>
                      )}
                      <span className="text-2xl">{station.icon}</span>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <span>المحطة {station.num}:</span>
                    <span>{station.title}</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {station.desc}
                  </p>
                </div>
                {station.hasDetail && (
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                    <a href="#station-detail" className="text-xs font-semibold text-[#154F9C] dark:text-[#4A8BE8] flex items-center gap-1 hover:underline">
                      <span>اطلع على تفاصيل المحطة الأولى الخمسة</span>
                      <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            💡 <strong>ملحوظة:</strong> خريطة المحطات توضّح المسار العام للبرنامج، ويُستكمل تفصيل الأنشطة والأدوات والمخرجات الخاصة بكل محطة ضمن إعداد الحقيبة التدريبية النهائية.
          </div>
        </div>
      </section>

      {/* 5. Station 1 in Detail */}
      <section id="station-detail" className="py-14 sm:py-20 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-b from-[#EDF5FD]/40 to-transparent dark:from-[#122238]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121A2C] border border-[#D6E6F8] dark:border-[#1E3A5F] shadow-sm">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#154F9C]/10 text-[#154F9C] text-xs font-bold mb-4">
              <Compass className="w-3.5 h-3.5" />
              <span>إضاءة خاصة على المحطة الأولى</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
              المحطة الأولى بالتفصيل: «اعرف نفسك»
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              لأن الاستعداد للزواج بيبدأ من الداخل، هنبدأ رحلتنا بسؤال مهم: <strong className="text-slate-800 dark:text-white font-bold">هل أنا عارف نفسي فعلًا، وعارف إيه اللي هاخده معايا للعلاقة الجديدة؟</strong>
              <br />
              في المحطة الأولى، هتشتغل على خمسة محاور أساسية:
            </p>

            <div className="space-y-3.5">
              {stationOneAxes.map((axis, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-[#0E1524] border border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-6 h-6 rounded-full bg-[#154F9C] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {axis.num}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {axis.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-8">
                    {axis.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 6. Target Audience */}
      <section className="py-14 sm:py-20 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-[#0E1524]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#168962] tracking-wider uppercase mb-2 block">الفئة المستهدفة</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              لمن صُممت رحلة رِفق؟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {audience.map((item, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800"
              >
                <div className="w-8 h-8 rounded-full bg-[#168962]/10 text-[#168962] flex items-center justify-center mb-3">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            ⚠️ <strong>ملاحظة مهنية هامة:</strong> البرنامج تدريبي وتوعوي ووقائي للإعداد للزواج، ولا يُعد علاجًا نفسيًا أو بديلًا عن الاستشارة الفردية أو التقييم العيادي المتخصص عند وجود اضطرابات نفسية حادة تحتاج إلى علاج مستقل.
          </div>
        </div>
      </section>

      {/* 7. Our Approach (5 Pillars) */}
      <section className="py-14 sm:py-20 border-b border-slate-100 dark:border-slate-800/60 bg-[#FDFCFB] dark:bg-[#0C111C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#154F9C] tracking-wider uppercase mb-2 block">منهجيتنا</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              ما الذي يميّز رحلة رِفق؟
            </h2>
          </div>

          <div className="space-y-4">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800 shadow-xs"
              >
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Learning Experience & Materials */}
      <section className="py-14 sm:py-20 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-[#0E1524]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#168962] tracking-wider uppercase mb-2 block">الحقيبة التدريبية</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              ماذا ستحصل عليه من الرحلة؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              صُممت رحلة رِفق لتجمع بين المحتوى المعرفي والتطبيق العملي، وتشمل الحقيبة الجاري استكمالها:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map((mat, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#168962]/10 text-[#168962] flex items-center justify-center mb-3">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                    {mat.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {mat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-6">
            يُحدَّد شكل المواد المتاحة فعليًا للمشترك (رقمية أو مطبوعة أو مصاحبة للقاءات التدريبية) وفق النسخة النهائية المعتمدة من البرنامج.
          </p>
        </div>
      </section>

      {/* 9. About the Trainer */}
      <section className="py-14 sm:py-20 border-b border-slate-100 dark:border-slate-800/60 bg-[#FDFCFB] dark:bg-[#0C111C]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-right">
            
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#154F9C] to-[#168962] text-white flex items-center justify-center font-extrabold text-2xl shrink-0 shadow-md">
              جلال أحمد
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-[#154F9C] uppercase tracking-wider block">مدرب الرحلة</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                جلال أحمد
              </h3>
              <p className="text-xs sm:text-sm text-[#168962] font-semibold">
                استشاري تربوي ونفسي ومعالج أسري
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                يمتد عمله بين التربية والإرشاد النفسي والأسري وتطوير المؤسسات التعليمية، مع اهتمام بتقديم المعرفة النفسية والتربوية في صورة عملية مبسطة، تراعي القيم الإسلامية والسياق الثقافي العربي، وتساعد الأفراد والأسر على فهم أنفسهم واتخاذ قرارات أكثر وعيًا.
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                ومن خلال «رحلة رِفق»، يجتمع الاهتمام بالنفس والأسرة والتربية في برنامج يهدف إلى مساعدة المقبلين على الزواج على الاستعداد لهذه المرحلة المهمة، ليس بالمعلومات وحدها، بل بالتأمل والتدريب والتطبيق.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 10. FAQ Accordion */}
      <section className="py-14 sm:py-20 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-[#0E1524]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#154F9C] tracking-wider uppercase mb-2 block">الأسئلة الشائعة</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              أسئلة قد تدور في ذهنك
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#121A2C] transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-[#154F9C] transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 text-slate-400 ${isOpen ? 'rotate-180 text-[#154F9C]' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. Final CTA & Registration */}
      <section id="register" className="py-16 sm:py-24 bg-gradient-to-b from-[#F2FBF7]/60 to-white dark:from-[#0D261E]/30 dark:to-[#0C111C]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
            قبل ما تختار شريك حياتك… ابدأ بفهم نفسك.
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed mb-4">
            مش مطلوب منك تكون إنسانًا كاملًا قبل الزواج، لكن مهم تدخل المرحلة دي وأنت أكثر وعيًا بنفسك، وأكثر وضوحًا في دوافعك، وأكثر استعدادًا للتعلُّم وتحمل المسؤولية.
          </p>

          <p className="text-sm font-semibold text-[#168962] dark:text-[#28B082] mb-8">
            ابدأ رحلتك بوعي… فكل بيت مطمئن يبدأ بخطوة واعية.
          </p>

          {/* Registration Form Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121A2C] border border-slate-200 dark:border-slate-800 shadow-xl max-w-xl mx-auto text-right">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1 text-center">
              سجل رغبتك في الانضمام للدفعة القادمة
            </h3>
            <p className="text-xs text-slate-500 mb-6 text-center">
              سيتم التواصل معك فور اعتماد موعد الدفعة وتفاصيل الحضور
            </p>

            {submitSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                ✓ تم فتح واتساب للتأكيد، وجارٍ استلام بياناتك بنجاح!
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    الاسم بالكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="مثال: أحمد عبد الله"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    رقم الهاتف / الواتساب *
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="مثال: 01012345678"
                    dir="ltr"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#154F9C] text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    المرحلة الحالية
                  </label>
                  <select
                    value={applicantStatus}
                    onChange={(e) => setApplicantStatus(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
                  >
                    <option value="مقبل على الزواج (مخطوب)">مقبل على الزواج (مخطوب)</option>
                    <option value="مقبل على الزواج (في مرحلة التعارف / الاختيار)">مقبل على الزواج (في مرحلة التعارف / الاختيار)</option>
                    <option value="شاب / فتاة يرغب في الاستعداد المبكر">شاب / فتاة يرغب في الاستعداد المبكر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    ملاحظات أو أسئلة إضافية (اختياري)
                  </label>
                  <textarea
                    rows={2}
                    value={applicantNotes}
                    onChange={(e) => setApplicantNotes(e.target.value)}
                    placeholder="أي استفسار أو توقعات خاصة بالرحلة..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-[#154F9C]/20 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'جارٍ فتح واتساب...' : 'انضم إلى رحلة رِفق عبر واتساب'}</span>
                </button>
              </form>
            )}

            <p className="text-[10px] text-slate-400 text-center mt-3">
              بياناتك مشفرة ومحمية بخصوصية تامة ولا يتم مشاركتها مطلقًا مع أي طرف ثالث.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
