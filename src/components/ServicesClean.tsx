'use client';

import React from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Zap, ShieldCheck } from 'lucide-react';
import { VectorDialogue, VectorHarmony, VectorGrowth, VectorUrgent } from './Vectors';

export default function ServicesClean() {
  return (
    <section id="services" className="py-20 px-4 sm:px-6 border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 bg-[#0A0E13] dark:bg-[#0A0E13] bg-slate-50 transition-colors">
      <div className="max-w-6xl mx-auto space-y-14 text-right">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-accent-500 uppercase tracking-wider block">
            مسارات الدعم والاستشارة
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-100 dark:text-slate-100 text-slate-900 leading-tight">
            اختر المسار الأنسب لاحتياجك
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
            جلسات فردية ومتخصصة تُعقد أونلاين عبر لقاءات فيديو خاصة وآمنة على Google Meet.
          </p>
        </div>

        {/* 3 Main Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Track 1: Individual Psychological Counseling */}
          <div className="rounded-3xl p-7 bg-[#12171E] dark:bg-[#12171E] bg-white border border-slate-800/80 dark:border-slate-800/80 border-slate-200 hover:border-slate-700 transition flex flex-col justify-between shadow-xs">
            <div className="space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <VectorDialogue className="w-12 h-12" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-amber-500 block mb-1">جلسة فردية خاصة</span>
                <h3 className="text-lg font-black text-slate-100 dark:text-slate-100 text-slate-900">
                  استشارة نفسية فردية
                </h3>
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
                مساحة آمنة لفهم مشاعرك، استعادة اتزانك، والتعامل مع الضغوط الحياتية وصدمات العلاقات بوعي ومسؤولية.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800/60 dark:border-slate-800/60 border-slate-100 text-xs text-slate-300 dark:text-slate-300 text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>تفكيك نوبات القلق والتوتر المزمن</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>التعامل مع الاحتراق النفسي وضغوط العمل</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>بناء تقدير الذات والصلابة النفسية</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 dark:border-slate-800/80 border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">Google Meet أونلاين</span>
              <a
                href="#booking"
                className="px-4 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <span>حجز موعد</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Track 2: Marital & Family Guidance */}
          <div className="rounded-3xl p-7 bg-[#12171E] dark:bg-[#12171E] bg-white border border-slate-800/80 dark:border-slate-800/80 border-slate-200 hover:border-slate-700 transition flex flex-col justify-between shadow-xs">
            <div className="space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <VectorHarmony className="w-12 h-12" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-400 block mb-1">جلسة زوجية أو فردية</span>
                <h3 className="text-lg font-black text-slate-100 dark:text-slate-100 text-slate-900">
                  إرشاد أسري وزواجي
                </h3>
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
                مساعدة الأزواج والمقبلين على الزواج لتفكيك الخلافات المتكررة، تحسين لغة الحوار، وإعادة بناء الأمان والمودة.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800/60 dark:border-slate-800/60 border-slate-100 text-xs text-slate-300 dark:text-slate-300 text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>إدارة الخلافات الزوجية المزمنة</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>تفكيك سوء الفهم وصعوبات التواصل</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>برامج تأهيل المقبلين على الزواج</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 dark:border-slate-800/80 border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">Google Meet أونلاين</span>
              <a
                href="#booking"
                className="px-4 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <span>حجز موعد</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Track 3: Parenting & Youth Guidance */}
          <div className="rounded-3xl p-7 bg-[#12171E] dark:bg-[#12171E] bg-white border border-slate-800/80 dark:border-slate-800/80 border-slate-200 hover:border-slate-700 transition flex flex-col justify-between shadow-xs">
            <div className="space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <VectorGrowth className="w-12 h-12" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-blue-400 block mb-1">توجيه الوالدين والمربين</span>
                <h3 className="text-lg font-black text-slate-100 dark:text-slate-100 text-slate-900">
                  إرشاد تربوي والوالدية
                </h3>
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
                مساندة الآباء والأمهات على فهم دوافع سلوك الأبناء واليافعين، وتطوير أساليب تربوية هادئة وحازمة دون صراخ.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800/60 dark:border-slate-800/60 border-slate-100 text-xs text-slate-300 dark:text-slate-300 text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>فهم الرسائل الخفية وراء عناد وسلوك الابن</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>التعامل مع تحديات مرحلة المراهقة</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>تقليل العصبية واستعادة الهدوء المنزلي</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 dark:border-slate-800/80 border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">Google Meet أونلاين</span>
              <a
                href="#booking"
                className="px-4 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <span>حجز موعد</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Track 4: Special / Emergency & Priority Booking (طلب المستخدم الصريح) */}
        <div className="rounded-3xl p-8 bg-gradient-to-r from-amber-950/30 via-[#181B22] to-amber-950/20 dark:from-amber-950/30 dark:via-[#181B22] dark:to-amber-950/20 bg-amber-50/80 border-2 border-amber-500/40 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold">
                <Zap className="w-3.5 h-3.5" />
                <span>أولوية حجز خاصة • استجابة خلال 24 ساعة</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
                حجز استثنائي / طارئ (مستعجل)
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-700 leading-relaxed max-w-2xl">
                مخصص للمواقف الحرجة، الأزمات الأسرية المفاجئة، أو القرارات المصيرية التي لا تحتمل الانتظار ضمن جدول المواعيد الاعتيادية. يتم تخصيص موعد استشاري عاجل خارج الأوقات المجدولة خلال 24 ساعة.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-amber-300/90 dark:text-amber-300/90 text-amber-800">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>انعقاد سريع خلال 24 ساعة كحد أقصى</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>تخضع لتسعير خاص ومستقل يتناسب مع الطبيعة الاستثنائية للخدمة</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-3">
              <a
                href="https://wa.me/201014876666?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%20%D8%AF.%20%D8%AC%D9%84%D8%A7%D9%84%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8a%20%D8%B7%D9%84%D8%A8%20%D8%AD%D8%AC%D8%B2%20%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9%20%D8%B7%D8%A7%D8%B1%D8%A6%D8%A9%20%2F%20%D9%85%D8%B3%D8%AA%D8%B9%D8%AC%D9%84%D8%A9%20%D8%AE%D9%84%D8%A7%D9%84%2024%20%D8%B3%D8%A7%D8%B9%D8%A9."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition shadow-md shadow-amber-500/20 text-center flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>طلب حجز طارئ عبر واتساب</span>
              </a>
              <span className="text-[11px] text-slate-400 text-center lg:text-left">
                تنسيق فوري مباشر مع إدارة المواعيد
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
