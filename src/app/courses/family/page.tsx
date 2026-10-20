'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Heart, 
  HeartHandshake, 
  Compass, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  ChevronRight,
  BookOpen,
  ShieldCheck,
  Calendar,
  MessageCircle
} from 'lucide-react';

export default function FamilyTrackPage() {
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
            <span className="text-slate-800 dark:text-slate-200 font-medium">مسار الأسرة</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-b from-[#F2FBF7]/60 via-[#FDFCFB] to-transparent dark:from-[#0D261E]/20 dark:via-[#0C111C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#168962]/10 border border-[#168962]/20 text-[#168962] text-xs font-semibold mb-6">
            <Heart className="w-3.5 h-3.5" />
            <span>مسارات بناء وتمكين • المسار الأسري الأول</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-5">
            مسار الأسرة
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
            برامج تأهيلية وتوعوية لبناء بيوت تقوم على السكن، والمودة، والرحمة، والشراكة الواعية.
          </p>

          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            الأسرة هي اللبنة الأولى للاستقرار الإنساني. نركز في هذا المسار على محطتين فارقتين: مرحلة التأسيس والاختيار (المقبلين على الزواج)، ومرحلة تعميق الشراكة وإدارة المسؤوليات (المتزوجين).
          </p>

        </div>
      </section>

      {/* Two Flagship Programs */}
      <section className="py-14 sm:py-20 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-[#0E1524]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#154F9C] tracking-wider uppercase mb-2 block">البرامج المعتمدة</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              برامج رحلة رِفق ضمن مسار الأسرة
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              برنامجان عمليان تم تصميمهما بعناية فائقة لتقديم تدريب متخصص يناسب مرحلتك الحالية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1: Mithaq */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-[#FDFCFB] dark:bg-[#121A2C] overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition">
              <div className="p-6 sm:p-8">
                
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#154F9C]/10 text-[#154F9C] text-xs font-bold">
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>للمتزوجين</span>
                  </span>
                  <span className="text-xs text-slate-400 font-medium">8 محطات</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                  رحلة رِفق | ميثاق
                </h3>

                <p className="text-xs font-semibold text-[#154F9C] dark:text-[#4A8BE8] mb-4">
                  البيوت لا تُبنى بحفلات الزفاف وحدها، بل بالوعي والمهارات والرفق.
                </p>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  برنامج عملي يساعد الزوجين على فهم أنماط التفاعل بينهما، والتعبير عن الاحتياجات بصورة أوضح، وإدارة الخلافات بوعي، وبناء مساحة أكبر من الأمان العاطفي والشراكة والمسؤولية.
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#154F9C] shrink-0" />
                    <span>فك الشفرة ورصيد المشاعر والحوار الآمن</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#154F9C] shrink-0" />
                    <span>إدارة العاصفة وهندسة التوقعات وشراكة المسار</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#154F9C] shrink-0" />
                    <span>كراسة المتدرب وتصميم «ميثاق الأسرة»</span>
                  </div>
                </div>

              </div>

              <div className="p-6 sm:px-8 bg-slate-50 dark:bg-[#0E1524] border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/courses/family/mithaq"
                  className="w-full sm:w-auto flex-1 py-3 px-5 rounded-full bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold text-center transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>عرض التفاصيل الكاملة</span>
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0" />
                </Link>

                <a
                  href="https://wa.me/201014876666?text=مرحبًا جلال أحمد، أود الاستفسار والتسجيل في برنامج رحلة رفق ميثاق للمتزوجين"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3 px-5 rounded-full border border-slate-300 dark:border-slate-700 hover:border-[#154F9C] text-slate-700 dark:text-slate-300 text-xs font-semibold text-center transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#168962]" />
                  <span>تواصل عبر واتساب</span>
                </a>
              </div>
            </div>

            {/* Card 2: Premarital */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-[#FDFCFB] dark:bg-[#121A2C] overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition">
              <div className="p-6 sm:p-8">
                
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#168962]/10 text-[#168962] text-xs font-bold">
                    <Compass className="w-3.5 h-3.5" />
                    <span>للمقبلين على الزواج</span>
                  </span>
                  <span className="text-xs text-slate-400 font-medium">8 محطات</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                  رحلة رِفق | للمقبلين على الزواج
                </h3>

                <p className="text-xs font-semibold text-[#168962] dark:text-[#28B082] mb-4">
                  ابدأ رحلتك بوعي… فكل بيت مطمئن يبدأ بخطوة واعية.
                </p>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  برنامج عملي متدرج يساعدك على اكتشاف نفسك، وفهم دوافعك للزواج، والتعرّف على معايير الاختيار الواعي، واكتساب المهارات الأساسية لبناء علاقة زوجية صحية ومستقرة.
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#168962] shrink-0" />
                    <span>المحطة المفصلة: «اعرف نفسك» بمحاورها الخمسة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#168962] shrink-0" />
                    <span>حسن الاختيار وبناء الشراكة وفن إدارة الاختلاف</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#168962] shrink-0" />
                    <span>كراسة المسافر وخطة الاستعداد الشخصي</span>
                  </div>
                </div>

              </div>

              <div className="p-6 sm:px-8 bg-slate-50 dark:bg-[#0E1524] border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/courses/family/premarital"
                  className="w-full sm:w-auto flex-1 py-3 px-5 rounded-full bg-[#168962] hover:bg-[#127251] text-white text-xs font-bold text-center transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>عرض التفاصيل الكاملة</span>
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0" />
                </Link>

                <a
                  href="https://wa.me/201014876666?text=مرحبًا جلال أحمد، أود الاستفسار والتسجيل في برنامج رحلة رفق للمقبلين على الزواج"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3 px-5 rounded-full border border-slate-300 dark:border-slate-700 hover:border-[#168962] text-slate-700 dark:text-slate-300 text-xs font-semibold text-center transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#168962]" />
                  <span>تواصل عبر واتساب</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Track Methodology Highlights */}
      <section className="py-14 sm:py-20 border-b border-slate-100 dark:border-slate-800/60 bg-[#FDFCFB] dark:bg-[#0C111C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              لماذا برامج «مسار الأسرة» مع جلال أحمد؟
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800 text-center">
              <div className="w-10 h-10 rounded-full bg-[#154F9C]/10 text-[#154F9C] flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">أصالة وتطبيق</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                انطلاق من الهدي الإسلامي ومفاهيم السكن والمودة مع أدوات علم النفس والتربية الحديثة.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800 text-center">
              <div className="w-10 h-10 rounded-full bg-[#168962]/10 text-[#168962] flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">تدريب لا تنظير</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                تمارين واقعية، كراسات للمتدرب، وأوراق عمل تحول المفاهيم إلى ممارسات يومية قابلة للاستمرار.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800 text-center">
              <div className="w-10 h-10 rounded-full bg-[#F5F3FF] dark:bg-[#201938] text-[#7452B8] flex items-center justify-center mx-auto mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">خصوصية وأمان</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                مساحة آمنة تمامًا تحترم خصوصية كل أسرة ومشارك وتراعي الفروق الفردية والثقافية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation to other tracks */}
      <section className="py-12 bg-white dark:bg-[#0E1524]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-slate-500 mb-4">اكتشف المسارات الأخرى في بناء وتمكين:</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/courses/institutions" 
              className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 hover:border-[#154F9C] text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
            >
              مسار المؤسسات التعليمية والتربوية ←
            </Link>
            <Link 
              href="/courses/youth" 
              className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 hover:border-[#154F9C] text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
            >
              مسار الشباب - المكلفين ←
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
