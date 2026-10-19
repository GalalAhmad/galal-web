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

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="#booking"
                className="px-7 py-3.5 bg-accent-500 hover:bg-accent-600 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md shadow-accent-500/20 flex items-center gap-2 group"
              >
                <span>حجز موعد استشاري (أونلاين)</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#assessments"
                className="px-6 py-3.5 bg-slate-800/80 dark:bg-slate-800/80 bg-white border border-slate-700/80 dark:border-slate-700/80 border-slate-200 text-slate-200 dark:text-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl hover:bg-slate-700/60 dark:hover:bg-slate-700/60 hover:bg-slate-50 transition shadow-xs flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-accent-500" />
                <span>المقاييس النفسية الذاتية</span>
              </Link>
            </div>

            {/* Serene Session Note */}
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400 text-slate-500">
              <Video className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>جميع الجلسات استشارية خاصة وتُعقد أونلاين عبر اتصال مرئي مشفر وآمن (Google Meet)</span>
            </div>

          </div>

          {/* Left Column: Dignified Portrait of Galal Ahmad (Clean without any extraneous icons) */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-sm sm:max-w-md">
              
              {/* Frame */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-800 dark:bg-slate-800 bg-slate-100 border-2 border-slate-700/80 dark:border-slate-700/80 border-slate-200 shadow-2xl group">
                <img 
                  src="/assets/dr-galal-speaking.jpg" 
                  alt="جلال أحمد" 
                  className="w-full h-[380px] sm:h-[450px] object-cover object-center transition-transform duration-500 group-hover:scale-102"
                />
                
                {/* Subtle gradient overlay at bottom of picture */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-transparent to-transparent opacity-85" />
                
                <div className="absolute bottom-4 right-4 left-4">
                  <span className="text-lg font-black text-white">جـلال أحـمد</span>
                  <span className="block text-[11px] text-slate-300 font-medium">استشارات نفسية وتربوية وبناء الإنسان والأسرة</span>
                </div>
              </div>

              {/* Online Availability Badge */}
              <div className="absolute -bottom-3 -right-2 px-3.5 py-1.5 bg-[#161B22] dark:bg-[#161B22] bg-white border border-slate-700 dark:border-slate-700 border-slate-200 text-[11px] font-bold text-slate-200 dark:text-slate-200 text-slate-700 rounded-full shadow-lg flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>متاح للمواعيد أونلاين عبر Google Meet</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
