'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Award, 
  BookCheck, 
  School, 
  Users2, 
  Calendar, 
  ArrowLeft, 
  ShieldCheck, 
  HeartHandshake, 
  Compass, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2,
  Building2,
  BookOpen
} from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0D1117] dark:bg-[#0D1117] bg-[#F8FAFC] text-slate-100 dark:text-slate-100 text-slate-900 transition-colors">
      <Navbar />

      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[280px] bg-accent-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* النص التعريفي الرئيسي */}
            <div className="lg:col-span-7 space-y-6 text-right order-2 lg:order-1">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/60 dark:bg-slate-800/60 bg-slate-100 border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs font-bold text-accent-500">
                <Sparkles className="w-3.5 h-3.5" />
                <span>المسيرة والرؤية وبناء الإنسان</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-100 dark:text-slate-100 text-slate-900 leading-[1.8]">
                  <span className="block mb-3 sm:mb-4">«السلوك رسالة تفصح عما يعتلج في النفس..</span>
                  <span className="block text-accent-500 pb-1">والوعي بداية كل اتزان»</span>
                </h1>
                <p className="text-sm sm:text-base font-semibold text-slate-300 dark:text-slate-300 text-slate-700 leading-relaxed pt-1">
                  جـلال أحـمد — استشاري الصحة النفسية والإرشاد الأسري والتربوي، ومطور برامج بناء الإنسان وتأهيل القيادات التعليمية.
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal">
                أجمع في مسيرتي بين أكثر من 17 عاماً من الممارسة القيادية الميدانية في إدارة المدارس الكبرى وتطوير المعلمين، والتأهيل الأكاديمي والعيادي في علم النفس التربوي والإرشاد الأسري، مع الارتكاز على هداية القرآن وبصيرة الفطرة الإنسانية.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/#booking"
                  className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md shadow-accent-500/20 flex items-center gap-2 group"
                >
                  <span>حجز موعد استشاري</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/pricing"
                  className="px-6 py-3 bg-slate-800/80 dark:bg-slate-800/80 bg-white border border-slate-700/80 dark:border-slate-700/80 border-slate-200 text-slate-200 dark:text-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl hover:bg-slate-700/60 transition shadow-xs"
                >
                  <span>استكشف مسارات الاستفادة</span>
                </Link>
              </div>

            </div>

            {/* الصورة الرسمية الوقورة */}
            <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
              <div className="relative w-full max-w-sm">
                <div className="rounded-3xl overflow-hidden bg-slate-800 dark:bg-slate-800 bg-white border-2 border-slate-700/80 dark:border-slate-700/80 border-slate-200 shadow-2xl">
                  <img
                    src="/assets/dr-galal-portrait.jpg"
                    alt="جلال أحمد"
                    className="w-full h-84 sm:h-96 object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-transparent to-transparent opacity-85" />
                  
                  <div className="absolute bottom-4 right-4 left-4 text-right">
                    <span className="text-lg font-black text-white">جـلال أحـمد</span>
                    <span className="block text-xs text-slate-300 font-medium">استشاري الصحة النفسية والإرشاد الأسري والتربوي</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* المنطلق الإنساني والمهني */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#11161D] dark:bg-[#11161D] bg-slate-50 border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200">
        <div className="max-w-4xl mx-auto space-y-8 text-right">
          
          <div className="space-y-2">
            <span className="text-xs font-bold text-accent-500 uppercase tracking-wider block">
              المنطلق الإنساني
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
              لماذا أعمل في حقل النفس والتربية وبناء الأسرة؟
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal">
            <p>
              لم تكن رحلتي في حقل النفس والتربية خياراً وظيفياً عابراً، بل مساراً تشكّل عبر سنوات طويلة من الممارسة الميدانية الحية؛ في الغرف الصفية، وإدارات المدارس، وجلسات الحوار الصادقة مع الأسر والشباب، وتأمل أعماق النفس البشرية في ضوء هداية الوحي الفطرية.
            </p>
            <p>
              أؤمن أن الإنسان لا يُختصر في مشكلته العارضة، وأن الأعراض السلوكية التي تظهر في البيت أو المدرسة — سواء كانت صمتاً عقابياً بين الزوجين، أو عناداً وتمرداً عند المراهق، أو قلقاً يستنزف طاقة الفرد — ليست إلا <strong className="text-slate-100 dark:text-slate-100 text-slate-900 font-bold">«رسائل غير معلنة»</strong> عن احتياجات فطرية لم تُلبَّ، ومخاوف دفينة لم تُسمع، وتوقعات غير واقعية أرهقت الروح.
            </p>
            <p>
              عملي لا يرتكز على إعطاء النصائح المعلبة أو تصدير الحلول الجاهزة، بل على مدّ يد البصيرة؛ لمساندتك على تفكيك المشهد بهدوء، ورؤية الأسباب وراء النتائج، والانتقال من عشوائية ردود الفعل إلى سعة الوعي وتحمل المسؤولية وبناء بيوت آمنة ومستقرة.
            </p>
          </div>

        </div>
      </section>

      {/* المؤهلات والاعتمادات الرسمية الموثقة من السيرة الذاتية */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#0D1117] dark:bg-[#0D1117] bg-[#F8FAFC] border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 dark:bg-slate-800/60 bg-white border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs font-bold text-accent-500 shadow-xs">
              <Award className="w-3.5 h-3.5" />
              <span>السيرة الأكاديمية والمهنية الموثقة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
              المؤهلات والاعتمادات الرسمية
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 text-slate-600">
              بيانات موثقة من السيرة الذاتية الرسمية والاعتمادات المهنية المعتمدة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
            
            {/* المؤهل الأكاديمي */}
            <div className="p-6 rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                ماجستير علم النفس التربوي
              </h3>
              <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed">
                حاصل على درجة الماجستير في علم النفس التربوي (2020)، مع إتمام دراسات تمهيدي الدكتوراه في علم النفس التربوي، وبكالوريوس التربية من جامعة القاهرة.
              </p>
            </div>

            {/* التصنيف المهني الرسمي */}
            <div className="p-6 rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                الهيئة السعودية للتخصصات الصحية
              </h3>
              <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed">
                تصنيف مهني رسمي معتمد كـ <strong className="text-slate-100 dark:text-slate-100 text-slate-900">«أخصائي مساعد علم نفس | علاج وتأهيل»</strong> (Assistant Specialist – Psychology)، تصنيف عام 2025.
              </p>
            </div>

            {/* الدبلومات المهنية المتخصصة */}
            <div className="p-6 rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <BookCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                دبلومات مهنية متخصصة
              </h3>
              <ul className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 space-y-1.5 list-disc list-inside">
                <li>دبلوم الإرشاد الأسري والزواجي</li>
                <li>دبلوم الإدارة والقيادة المدرسية</li>
                <li>دبلوم التربية الخاصة وتعديل السلوك</li>
              </ul>
            </div>

            {/* الخبرة القيادية في المدارس */}
            <div className="p-6 rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <School className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                17+ عاماً خبرة قيادية مدرسية
              </h3>
              <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed">
                مدير عام ومدير تنفيذي لكبرى المدارس واللغات والمعاهد الأزهرية (معاهد البخاري الأزهرية للغات، مدارس المعالي، مدارس ستارز، ومدارس بريمير).
              </p>
            </div>

            {/* تأسيس وتطوير الكيانات */}
            <div className="p-6 rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-accent-500/10 text-accent-500 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                مؤسس منصات ومراكز تدريبية
              </h3>
              <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed">
                مؤسس مركز إنسان للتدريب والاستشارات (مصر، 2015)، ومؤسس ومطور منصة رِفق (Rifq)، وشريك مؤسس لمركز مفهوم (Mafhoom) ومنصة وصلة (Wasla360).
              </p>
            </div>

            {/* مجالات التدريب والتأليف */}
            <div className="p-6 rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                التأليف وتبسيط المعرفة النفسية
              </h3>
              <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed">
                مؤلف ومعد لسلسلة من الكتب والدراسات التطبيقية: «ذات وموضوع»، «ظلّي»، «العادات الوالدية للآباء الأكثر فاعلية»، و«أقومية القرآن في الأسرة والطفل».
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* أبعاد الهوية الأربعة المتكاملة */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#11161D] dark:bg-[#11161D] bg-slate-50 border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200">
        <div className="max-w-5xl mx-auto space-y-10 text-right">
          
          <div className="space-y-2">
            <span className="text-xs font-bold text-accent-500 uppercase tracking-wider block">
              مجالات العمل والتأثير
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
              أبعاد الهوية المهنية المتكاملة
            </h2>
          </div>

          <div className="space-y-6">
            
            <div className="p-6 rounded-3xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                  1. في الإرشاد النفسي والزواجي وبناء الأسرة
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed">
                العمل الاستشاري المباشر مع المقبلين على الزواج عبر مسارات تأهيلية قائمة على فقه التوقعات، وتفكيك المفاهيم الرومانسية الزائفة، وبناء ميثاق السكينة والأمان العاطفي. ومساندة الأزواج على تفكيك دوائر النزاع المزمنة، وكسر حواجز الصمت والجفاء، وإعادة بناء قنوات الحوار الرفيق، وإرشاد الوالدين في فهم نفسيات اليافعين والمراهقين بمبدأ «العلاقة أولاً قبل طلب التغيير».
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                  <School className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                  2. في القيادة التعليمية وتطوير المؤسسات المدرسية
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed">
                خبرة تراكمية ميدانية تمتد لأكثر من 17 عاماً في الإدارة المدرسية وتطوير البيئات التعليمية، وتأهيل القيادات والمعلمين على استراتيجيات علم النفس التربوي، والإدارة الصفية الإيجابية، وبروتوكولات التدخل السلوكي ورعاية المتعلمين، والانتقال بالمدرسة من مجرد حيز تلقيني إلى بيئة آمنة محفزة لنمو الشخصية السوية.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                  3. في التأليف وصناعة المحتوى المعرفي الرصين
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed">
                مؤلف لسلسلة من الكتب المتخصصة في بصيرة الذات، والعلاقات الزوجية، وتربية اليافعين، وأقومية المنهج القرآني في هندسة النفس واستقرار البيوت. بالإضافة إلى صناعة محتوى مرئي وتثقيفي يسعى لتبسيط العلوم النفسية والتربوية وتقديمها في قوالب عملية تحترم وعي المتلقي وتلبي احتياجاته الواقعية.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                  4. في تأسيس وتطوير المنصات والمبادرات
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed">
                الإسهام في تأسيس وتطوير منصات ومراكز نوعية (منصة رِفق لتأهيل المقبلين على الزواج، مركز إنسان للتدريب والاستشارات بالقاهرة، مركز مفهوم للاستشارات المدرسية، ومنصة وصلة لتمكين الشباب) بهدف توسيع دائرة النفع المجتمعي وتمكين الأسرة العربية بأدوات علمية وفطرية راسخة.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* فلسفة التكامل بين المعرفة الإنسانية والهداية القرآنية */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#0D1117] dark:bg-[#0D1117] bg-[#F8FAFC] border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200">
        <div className="max-w-4xl mx-auto space-y-6 text-right">
          
          <div className="space-y-2">
            <span className="text-xs font-bold text-accent-500 uppercase tracking-wider block">
              المرجعية المعرفية
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
              فلسفة التكامل بين المعرفة النفسية والهداية القرآنية
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal">
            <p>
              إن النموذج الذي أتبناه لا يرى تعارضاً بين الاستفادة المسؤولة من المعارف النفسية والتربوية التجريبية الرصينة، وبين الاستمساك بمرجعية الوحي الفطرية التي تمنح الإنسان أصله ومعناه وكرامته.
            </p>
            <p>
              نسعى لقراءة الإنسان ككلّ متكامل (جسداً ونفساً وعقلاً وروحاً وعلاقات)، ونحذر من التبعية الفكرية المنقطعة عن هويتنا، كما نحذر في المقابل من الجمود أو تحميل النصوص الشرعية ما لا تحتمله من تفاصيل عيادية دقيقة أو نظريات بشرية متغيرة.
            </p>
          </div>

          {/* CTA Box */}
          <div className="p-8 rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-right">
              <h3 className="text-lg font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                هل تبحث عن مسار استشاري أو برنامج تدريبي؟
              </h3>
              <p className="text-xs text-slate-400">
                يمكنك حجز موعدك أونلاين عبر اتصال Google Meet المشفر أو التواصل لتنسيق برامج المؤسسات.
              </p>
            </div>
            <Link
              href="/#booking"
              className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white text-xs sm:text-sm font-bold rounded-xl transition shrink-0 shadow-md shadow-accent-500/20"
            >
              حجز موعد استشاري
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
