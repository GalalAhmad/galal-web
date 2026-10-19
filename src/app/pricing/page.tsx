'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  User, 
  HeartHandshake, 
  Users, 
  Building2, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Video, 
  HelpCircle,
  FileSpreadsheet,
  Clock,
  Sparkles
} from 'lucide-react';

export default function PricingPage() {
  const whatsappBookingUrl = "https://wa.me/201014876666?text=" + encodeURIComponent("السلام عليكم، أود الاستفسار عن تفاصيل وحجز موعد استشاري مع الأستاذ جلال أحمد.");

  return (
    <main className="min-h-screen flex flex-col bg-[#0D1117] dark:bg-[#0D1117] bg-[#F8FAFC] text-slate-100 dark:text-slate-100 text-slate-900 transition-colors">
      <Navbar />

      {/* Header */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 text-right">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[280px] bg-accent-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/60 dark:bg-slate-800/60 bg-slate-100 border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs font-bold text-accent-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مسارات الاستفادة والاستثمار الواعي</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-100 dark:text-slate-100 text-slate-900 leading-[1.6]">
            استثمارك في وعيك واستقرار بيتك.. هو الخطوة الأبقى أثراً
          </h1>

          <p className="text-sm sm:text-base text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal">
            نقدم خدماتنا الاستشارية والتربوية وفق معايير مهنية دقيقة تكفل السرية التامة، وتمنحك مساحة آمنة لتفكيك المشكلات والانتقال نحو خطوات عملية ملموسة وواضحة.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
            <Video className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>جميع الجلسات الاستشارية تُعقد أونلاين عبر اتصال مرئي مشفر وآمن (Google Meet) لكافة الدول</span>
          </div>
        </div>
      </section>

      {/* مسارات الاستفادة الأربعة */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#11161D] dark:bg-[#11161D] bg-slate-50 border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
              دليل المسارات والخدمات المتاحة
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 text-slate-600">
              اختر المسار الأنسب لطبيعة احتياجك الحالي للبدء في حجز الموعد أو طلب العرض المناسب
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
            
            {/* 1. الاستشارات الفردية */}
            <div className="h-full flex flex-col justify-between p-8 rounded-3xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 shadow-sm hover:border-slate-700 transition">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    للأفراد (18+ عاماً)
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
                    الاستشارات النفسية الفردية وبصيرة الذات
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    جلسات خاصة ومباشرة عبر اتصال مرئي مشفر (Google Meet)
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed">
                  مخصصة لتجاوز القلق، كسر جلد الذات، تنظيم المشاعر، والانتقال من عشوائية ردود الفعل إلى سعة الوعي وتحمل المسؤولية والاتزان الداخلي.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-800 dark:border-slate-800 border-slate-200 text-xs text-slate-300 dark:text-slate-300 text-slate-600">
                  <div className="font-bold text-slate-200 dark:text-slate-200 text-slate-800">ما الذي تشتمل عليه الجلسة؟</div>
                  <ul className="space-y-1.5 text-[11px] text-slate-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                      <span>الاستماع المركز وتفكيك الجذور دون إطلاق أحكام مسبقة</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                      <span>الفصل الواعي بين حقيقة الذات والمشكلة الطارئة</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                      <span>خطة عمل وكراسة متابعة وتطبيقات يومية واقعية</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800 dark:border-slate-800 border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/#booking"
                  className="w-full sm:w-auto px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold rounded-xl transition text-center shadow-xs"
                >
                  حجز موعد عبر التقويم
                </Link>
                <a
                  href={whatsappBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-800/80 dark:bg-slate-800/80 bg-slate-100 text-slate-200 dark:text-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-700/60 transition text-center"
                >
                  استفسار عن تفاصيل الجلسات
                </a>
              </div>
            </div>

            {/* 2. الإرشاد الزواجي والمقبلين */}
            <div className="h-full flex flex-col justify-between p-8 rounded-3xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 shadow-sm hover:border-slate-700 transition">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    للأزواج والمقبلين
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
                    الإرشاد الزواجي وتأهيل المقبلين
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    جلسات ثنائية خاصة، وبرامج تأهيلية متكاملة (رحلة رِفق ومِيثاق)
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed">
                  تأهيل الخطيبين عبر فقه التوقعات، وتفكيك الصمت العقابي والنزاعات المتكررة بين الزوجين، وإعادة بناء السكينة والمودة على أسس فطرية وقرآنية راسخة.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-800 dark:border-slate-800 border-slate-200 text-xs text-slate-300 dark:text-slate-300 text-slate-600">
                  <div className="font-bold text-slate-200 dark:text-slate-200 text-slate-800">المسارات المتخصصة:</div>
                  <ul className="space-y-1.5 text-[11px] text-slate-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                      <span>جلسات الإرشاد الزواجي المشترك لفض النزاع وبناء الحوار الآمن</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                      <span>برنامج «رحلة رِفق» للمقبلين على الزواج (فقه التوقعات وتجنب الصدمات)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                      <span>برنامج «مِيثاق» لترميم العلاقات واستعادة السكن والأمان العاطفي</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800 dark:border-slate-800 border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={whatsappBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold rounded-xl transition text-center shadow-xs"
                >
                  طلب تفاصيل المسار والتنسيق
                </a>
                <Link
                  href="/#booking"
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-800/80 dark:bg-slate-800/80 bg-slate-100 text-slate-200 dark:text-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-700/60 transition text-center"
                >
                  جدول المواعيد
                </Link>
              </div>
            </div>

            {/* 3. الاستشارات التربوية لليافعين */}
            <div className="h-full flex flex-col justify-between p-8 rounded-3xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 shadow-sm hover:border-slate-700 transition">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    للوالدين والمربين
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
                    الاستشارات التربوية وإرشاد الوالدين
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    إرشاد سلوكي ونفسي لفهم مرحلة المراهقة والبلوغ
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed">
                  فلسفتنا: «السلوك رسالة قبل أن يكون مشكلة، والعلاقة أولاً قبل طلب تعديل السلوك». مساندة الوالدين لفك شفرات العناد والتمرد وتطبيق الحزم الرفيق.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-800 dark:border-slate-800 border-slate-200 text-xs text-slate-300 dark:text-slate-300 text-slate-600">
                  <div className="font-bold text-slate-200 dark:text-slate-200 text-slate-800">أبرز المحاور المعالجة:</div>
                  <ul className="space-y-1.5 text-[11px] text-slate-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                      <span>سيكولوجيا المراهقة وتغيرات المزاج وبناء الهوية</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                      <span>قواعد وضع الحدود الآمنة دون صراخ أو تهديد</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                      <span>إدارة الشاشات والأجهزة وبناء حس المسؤولية والرقابة الذاتية</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800 dark:border-slate-800 border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/#booking"
                  className="w-full sm:w-auto px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold rounded-xl transition text-center shadow-xs"
                >
                  حجز جلسة إرشاد تربوي
                </Link>
                <a
                  href={whatsappBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-800/80 dark:bg-slate-800/80 bg-slate-100 text-slate-200 dark:text-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-700/60 transition text-center"
                >
                  تنسيق خاص
                </a>
              </div>
            </div>

            {/* 4. التدريب المؤسسي والمدرسي */}
            <div className="h-full flex flex-col justify-between p-8 rounded-3xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 shadow-sm hover:border-slate-700 transition">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    للمدارس والمؤسسات
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
                    التدريب والاستشارات المؤسسية المدرسية
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    عروض فنية وتدريبية مخصصة للقيادات التعليمية والمعلمين
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed">
                  برامج حقائب تدريب المعلمين على علم النفس التربوي والإدارة الصفية الإيجابية، وهندسة بروتوكولات التدخل السلوكي، وتطوير البيئات المدرسية.
                </p>

                <div className="p-3.5 rounded-2xl bg-slate-800/50 dark:bg-slate-800/50 bg-slate-100 text-[11px] text-slate-400 leading-relaxed">
                  💡 <strong>لماذا يُطلب عرض مخصص؟</strong> تختلف البرامج المؤسسية باختلاف حجم الكادر التعليمي، وعدد المستفيدين، وطبيعة التحديات التي تواجهها المدرسة، وما إذا كان البرنامج حضورياً أو افتراضياً، لذلك يتم تصميم كل برنامج وفق احتياج المؤسسة الدقيق.
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800 dark:border-slate-800 border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold rounded-xl transition text-center shadow-xs"
                >
                  طلب عرض فني وتدريبي للمؤسسة
                </Link>
                <a
                  href="mailto:info@galalahmad.com?subject=طلب%20عرض%20تدريبي%20مؤسسي"
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-800/80 dark:bg-slate-800/80 bg-slate-100 text-slate-200 dark:text-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-700/60 transition text-center"
                >
                  مراسلة البريد الرسمي
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ميثاق الجلسات والسرية المهنية */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#0D1117] dark:bg-[#0D1117] bg-[#F8FAFC] border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200">
        <div className="max-w-4xl mx-auto space-y-6 text-right">
          
          <div className="space-y-2">
            <span className="text-xs font-bold text-accent-500 uppercase tracking-wider block">
              الأمان والمهنية
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
              ميثاق الجلسات والسرية المهنية
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            
            <div className="p-5 rounded-2xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 space-y-2 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xs font-bold text-slate-100 dark:text-slate-100 text-slate-900">السرية التامة والأمان</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                تخضع كافة البيانات والحديث داخل الجلسات الاستشارية لأعلى معايير السرية والأخلاقيات المهنية المعتمدة.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 space-y-2 shadow-xs">
              <Video className="w-5 h-5 text-accent-500" />
              <h4 className="text-xs font-bold text-slate-100 dark:text-slate-100 text-slate-900">الانعقاد الافتراضي المرن</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                تُعقد الاستشارات عن بُعد عبر روابط Google Meet مشفرة توفر عليك عناء وتكاليف التنقل وتضمن راحتك في بيتك.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 space-y-2 shadow-xs">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h4 className="text-xs font-bold text-slate-100 dark:text-slate-100 text-slate-900">مرونة الجدولة وإعادة الترتيب</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                إمكانية تعديل أو إعادة جدولة الموعد قبل 24 ساعة من موعد الجلسة تقديراً لظروف عملائنا والتزاماتهم.
              </p>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
