'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Video, Compass, Sparkles, BookOpen } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative py-14 sm:py-20 px-4 sm:px-6 overflow-hidden border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 transition-colors">
      
      {/* Subtle ambient gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[280px] bg-accent-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[280px] h-[280px] bg-sage-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Right Column: Signature Quote & Introduction */}
          <div className="lg:col-span-7 space-y-7 text-right order-2 lg:order-1">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/60 dark:bg-slate-800/60 bg-slate-100 border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs font-bold text-accent-500">
              <Sparkles className="w-3.5 h-3.5" />
              <span>استشارات نفسية وتربوية برؤية الفطرة والوحي</span>
            </div>

            {/* The Main Headline Quote: Clean separated lines with generous vertical clearance so Tashkeel never collides */}
            <div className="space-y-5">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-100 dark:text-slate-100 text-slate-900 tracking-normal leading-[1.8] sm:leading-[1.8]">
                <span className="block mb-3 sm:mb-4">«وَمَنْ يَصِفُ لَكَ الطَّرِيقَ..</span>
                <span className="block text-accent-500 pb-1">لَنْ يَسْلُكَهُ نِيَابَةً عَنْكَ»</span>
              </h1>
              <p className="text-sm sm:text-base font-semibold text-slate-400 dark:text-slate-400 text-slate-400 pt-1 leading-relaxed">
                السلوك رسالة قبل أن يكون مشكلة.. والوعي بداية التغيير.
              </p>
            </div>

            {/* Subtitle in Galal Ahmad's philosophy */}
            <p className="text-sm sm:text-base text-slate-300 dark:text-slate-300 text-slate-600 font-normal leading-[1.9] max-w-xl">
              مساحة استشارية وتربوية يقدمها <strong className="text-white dark:text-white text-slate-900 font-bold">جـلال أحـمد</strong>، تجمع بين عمق التأصيل النفسي والخبرة الميدانية الممتدة في قيادة المدارس والمراكز، لمساعدتك على تفكيك المشكلات الزوجية والتربوية، والانتقال من ردود الفعل العشوائية إلى رحابة الوعي، وتحمل المسؤولية، وبناء بيوت آمنة ومستقرة.
            </p>

            {/* Quick Actions - The 3 Key Paths */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/booking"
                className="px-6 py-3.5 bg-accent-500 hover:bg-accent-600 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md shadow-accent-500/20 flex items-center gap-2 group"
              >
                <span>احجز استشارتك (أونلاين)</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/services"
                className="px-5 py-3.5 bg-slate-800/80 dark:bg-slate-800/80 bg-white border border-slate-700/80 dark:border-slate-700/80 border-slate-200 text-slate-200 dark:text-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl hover:bg-slate-700/60 dark:hover:bg-slate-700/60 hover:bg-slate-50 transition shadow-xs flex items-center gap-2"
              >
                <span>استكشف الاستشارات</span>
              </Link>

              <Link
                href="/courses"
                className="px-5 py-3.5 bg-slate-800/50 dark:bg-slate-800/50 bg-slate-100 text-slate-300 dark:text-slate-300 text-slate-700 text-xs sm:text-sm font-bold rounded-xl hover:bg-slate-700/40 transition flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-accent-500" />
                <span>الكورسات والبرامج</span>
              </Link>
            </div>

            {/* Serene Session Note */}
            <div className="pt-1 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400 text-slate-500">
              <Video className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>جميع الجلسات استشارية خاصة وتُعقد أونلاين عن بُعد عبر اتصال مشفر وآمن (Google Meet)</span>
            </div>

          </div>

          {/* Left Column: Abstract & Symbolic Visual Card representing Dialogue, Balance and Growth (No portrait on Home) */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-sm sm:max-w-md">
              
              {/* Symbolic Card with Serene Motifs */}
              <div className="relative rounded-3xl p-8 bg-gradient-to-br from-[#161C24] via-[#12171E] to-[#0D1117] dark:from-[#161C24] dark:via-[#12171E] dark:to-[#0D1117] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 shadow-2xl space-y-6 text-right">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 dark:border-slate-800/80 border-slate-100 pb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-accent-500/10 border border-accent-500/20 text-accent-500 flex items-center justify-center">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-100 dark:text-slate-100 text-slate-900 block">
                        فلسفة العمل والمسار
                      </span>
                      <span className="text-[10px] text-slate-400">
                        الوعي • المسؤولية • الاتزان
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    أونلاين فقط
                  </span>
                </div>

                {/* Abstract Dialogue & Balance Illustration */}
                <div className="py-4 flex justify-center items-center">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    {/* Concentric peaceful circles representing growth and dialogue */}
                    <div className="absolute inset-0 rounded-full border border-accent-500/20 animate-pulse duration-1000" />
                    <div className="absolute inset-4 rounded-full border border-slate-700/60 dark:border-slate-700/60 border-slate-200" />
                    <div className="absolute inset-8 rounded-full border border-emerald-500/20" />
                    <div className="absolute inset-12 rounded-full bg-gradient-to-tr from-accent-500/15 via-emerald-500/10 to-transparent flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-accent-500" />
                    </div>
                  </div>
                </div>

                {/* 3 Pillars of Support */}
                <div className="space-y-2.5 pt-1">
                  <div className="p-3 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 bg-slate-50 border border-slate-800 dark:border-slate-800 border-slate-100 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-200 dark:text-slate-200 text-slate-800">استشارات نفسية وبصيرة الذات</div>
                      <div className="text-[10px] text-slate-400">تفكيك القلق والانتقال من ردود الفعل للوعي</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 bg-slate-50 border border-slate-800 dark:border-slate-800 border-slate-100 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-200 dark:text-slate-200 text-slate-800">إرشاد زواجي وتأهيل المقبلين</div>
                      <div className="text-[10px] text-slate-400">برنامج رحلة رِفق، ومسار مِيثاق للترميم</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 bg-slate-50 border border-slate-800 dark:border-slate-800 border-slate-100 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold">3</div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-200 dark:text-slate-200 text-slate-800">تربية اليافعين وسيكولوجيا المراهقة</div>
                      <div className="text-[10px] text-slate-400">العلاقة أولاً قبل طلب التغيير، والحزم الرفيق</div>
                    </div>
                  </div>
                </div>

                {/* Footer Badge */}
                <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-slate-800/60 dark:border-slate-800/60 border-slate-100">
                  لقاءات خاصة ومحمية عبر Google Meet لجميع الدول
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
