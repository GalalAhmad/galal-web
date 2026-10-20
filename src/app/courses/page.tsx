'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Heart, 
  Building2, 
  Compass, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  MessageCircle,
  Clock,
  Layers,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';

export default function PathwaysPage() {
  const tracks = [
    {
      id: 'family',
      title: 'مسار الأسرة',
      badge: 'نشط • متاح للتسجيل',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      icon: Heart,
      iconColor: 'text-[#168962] bg-[#F2FBF7] dark:bg-[#0D261E]',
      desc: 'برامج تأهيلية وتوعوية لبناء بيوت تقوم على السكن والمودة والرحمة، تركز على مرحلتي الإعداد الزواجي وتعميق الشراكة للمتزوجين.',
      features: [
        'برنامج رحلة رِفق | ميثاق (للمتزوجين)',
        'برنامج رحلة رِفق | للمقبلين على الزواج',
        '8 محطات تدريبية وتطبيقات عملية لكل برنامج',
        'كراسات تدريبية ومواثيق أسرية مستدامة'
      ],
      link: '/courses/family',
      linkText: 'استكشف مسار الأسرة والبرامج'
    },
    {
      id: 'institutions',
      title: 'مسار المؤسسات التعليمية والتربوية',
      badge: 'متاح للتعاقد المؤسسي',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
      icon: Building2,
      iconColor: 'text-[#154F9C] bg-[#EDF5FD] dark:bg-[#122238]',
      desc: 'برامج واستشارات لتطوير المدارس والبيئات التربوية، وتأهيل الكوادر التعليمية على الإدارة الصفية الإيجابية والرعاية النفسية للطلاب.',
      features: [
        'تأهيل المعلمين والمشرفين التربويين',
        'بناء البيئة المدرسية الآمنة والوقاية من التنمر',
        'تصميم الحقائب الإرشادية والمناهج المخصصة',
        'استشارات مؤسسية مباشرة مع جلال أحمد'
      ],
      link: '/courses/institutions',
      linkText: 'تفاصيل المسار والطلب المؤسسي'
    },
    {
      id: 'youth',
      title: 'مسار الشباب - المكلفين',
      badge: 'قيد الإعداد • تسجيل مبكر',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
      icon: Compass,
      iconColor: 'text-[#7452B8] bg-[#F5F3FF] dark:bg-[#201938]',
      desc: 'برامج متخصصة لليافعين والشباب لبناء الوعي بالذات، وترسيخ الهوية، وتنمية الصلابة النفسية، وإدارة مرحلة التكليف والمسؤولية.',
      features: [
        'إدارة مرحلة الانتقال لسن التكليف الشرعي',
        'الذكاء العاطفي وإدارة مشاعر المراهقة والشباب',
        'بناء المناعة الفكرية ومقاومة ضغط الأقران',
        'مجموعات تفاعلية آمنة قائمة على الحوار والتمكين'
      ],
      link: '/courses/youth',
      linkText: 'تفاصيل المسار وقائمة الانتظار'
    }
  ];

  return (
    <main className="min-h-screen bg-[#FDFCFB] dark:bg-[#0C111C] text-slate-800 dark:text-slate-100 flex flex-col antialiased selection:bg-[#154F9C]/10 selection:text-[#154F9C]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-b from-[#EDF5FD]/50 via-[#FDFCFB] to-transparent dark:from-[#122238]/20 dark:via-[#0C111C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#154F9C]/10 border border-[#154F9C]/20 text-[#154F9C] text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>رؤية متكاملة للبناء النفسي والتربيوي</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-snug mb-5">
            بناء وتمكين
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
            رحلات عملية متدرجة تجمع بين الهدي الإسلامي، وعلم النفس الأسري والتربوي، والتمارين التطبيقية التي تحدث فارقًا حقيقيًا في حياتك وعلاقاتك ومؤسستك.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#tracks-grid"
              className="px-6 py-2.5 rounded-full bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#154F9C]/20 transition flex items-center gap-2"
            >
              <span>استكشف المسارات الثلاثة</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-0" />
            </a>

            <a
              href="#methodology"
              className="px-6 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 hover:border-[#154F9C] text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold transition"
            >
              منهجية العمل والتمكين
            </a>
          </div>

        </div>
      </section>

      {/* 3 Tracks Overview */}
      <section id="tracks-grid" className="py-14 sm:py-20 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-[#0E1524]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#154F9C] tracking-wider uppercase mb-2 block">خريطة المسارات</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              مساراتنا الثلاثة للتمكين والبناء
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              لكل مسار فلسفته الخاصة، ومستهدفوه، وحقائبه التدريبية المستقلة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tracks.map((track) => {
              const IconComponent = track.icon;
              return (
                <div
                  key={track.id}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-[#FDFCFB] dark:bg-[#121A2C] p-6 sm:p-7 flex flex-col justify-between hover:shadow-lg transition-all duration-200 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className={`w-12 h-12 rounded-2xl ${track.iconColor} flex items-center justify-center shrink-0 shadow-xs`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${track.badgeColor}`}>
                        {track.badge}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                      {track.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                      {track.desc}
                    </p>

                    <div className="space-y-2 mb-6 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      {track.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#154F9C] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={track.link}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-black/30 hover:bg-[#154F9C] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold text-center transition flex items-center justify-center gap-1.5 group-hover:bg-[#154F9C] group-hover:text-white"
                  >
                    <span>{track.linkText}</span>
                    <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0" />
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Methodology & Supervision */}
      <section id="methodology" className="py-14 sm:py-20 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-[#0E1524]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              منهجية العمل في مسارات بناء وتمكين
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800 text-center">
              <div className="w-10 h-10 rounded-full bg-[#154F9C]/10 text-[#154F9C] flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">أصالة شرعية ونفسية</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                انطلاق راسخ من هدي القرآن والسنة ومفاهيم السكن والمودة مقرونة بعلم النفس المعاصر.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800 text-center">
              <div className="w-10 h-10 rounded-full bg-[#168962]/10 text-[#168962] flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">أدوات عملية مستدامة</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                تمارين واقعية، كراسات متدرب، ومواثيق تساعدك على التحول من المعرفة إلى الممارسة اليومية.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800 text-center">
              <div className="w-10 h-10 rounded-full bg-[#7452B8]/10 text-[#7452B8] flex items-center justify-center mx-auto mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">إشراف استشاري مباشر</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                تصميم وقيادة مباشرة من جلال أحمد، استشاري تربوي ونفسي ومعالج أسري.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Direct WhatsApp Assistance Box */}
      <section className="py-14 sm:py-16 bg-[#FDFCFB] dark:bg-[#0C111C]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#154F9C]/5 via-white to-[#168962]/5 dark:from-[#122238] dark:to-[#0D261E] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              هل تحتاج لمساعدة في اختيار المسار أو البرنامج المناسب لك؟
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              فريق المساعدة متاح للإجابة عن استفساراتك حول المواعيد، وآلية الحضور، وتفاصيل الحقائب التدريبية.
            </p>
            <a
              href="https://wa.me/201014876666?text=مرحبًا، أود الاستفسار عن مسارات بناء وتمكين والبرنامج الأنسب لاحتياجي"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#168962] hover:bg-[#127251] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#168962]/20 transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>تحدث مع المنسق عبر واتساب</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
