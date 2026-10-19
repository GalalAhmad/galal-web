'use client';

import React from 'react';
import { Award, BookCheck, School, Users2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 bg-[#11161D] dark:bg-[#11161D] bg-slate-50 border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 transition-colors">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* الصورة الرسمية مع إطار متناسق */}
        <div className="md:col-span-5 flex justify-center order-2 md:order-1">
          <div className="relative w-full max-w-sm">
            <div className="rounded-3xl overflow-hidden bg-slate-800 dark:bg-slate-800 bg-white shadow-xl border-2 border-slate-700/80 dark:border-slate-700/80 border-slate-200 group">
              <img 
                src="/assets/dr-galal-portrait.jpg" 
                alt="جلال أحمد" 
                className="w-full h-84 sm:h-96 object-cover object-top group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11161D] via-transparent to-transparent opacity-80" />
            </div>

            {/* شارة التأسيس والقيادة */}
            <div className="absolute -bottom-4 -left-2 sm:-left-4 bg-[#161C24] dark:bg-[#161C24] bg-white text-slate-100 dark:text-slate-100 text-slate-900 p-4 rounded-2xl shadow-xl border border-slate-700 dark:border-slate-700 border-slate-200 text-right max-w-[240px]">
              <div className="text-xs font-bold text-accent-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>مركز إنسان للتدريب</span>
              </div>
              <div className="text-[11px] text-slate-300 dark:text-slate-300 text-slate-600 mt-1 leading-relaxed">
                مؤسس ومدير مركز إنسان للتدريب والاستشارات — القاهرة
              </div>
            </div>
          </div>
        </div>

        {/* السيرة الذاتية والمؤهلات الموثقة بدقة وبساطة */}
        <div className="md:col-span-7 space-y-6 text-right order-1 md:order-2">
          
          <div className="space-y-2">
            <span className="text-xs font-bold text-accent-500 uppercase tracking-wider block">
              المسيرة والخبرة الميدانية
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-100 dark:text-slate-100 text-slate-900 tracking-normal">
              الجمع بين عمق التأصيل النفسي والخبرة الميدانية الواقعية
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal">
            <p>
              أنا <strong className="text-slate-100 dark:text-slate-100 text-slate-900 font-bold">جـلال أحـمد</strong>، استشاري صحة نفسية وتربوية، ومتخصص في الإرشاد الأسري والزواجي وبناء وتنمية الإنسان وإرشاد المراهقين. أجمع في عملي بين أكثر من <strong className="text-accent-500 font-bold">17 عاماً من الخبرة العملية الميدانية في قيادة المدارس والمؤسسات التربوية</strong>، والتأهيل الأكاديمي والعيادي في علم النفس التربوي.
            </p>

            <p>
              تنطلق رؤيتي من أن <em className="text-accent-500 not-italic font-semibold">«السلوك رسالة تفصح عما يحتاجه الإنسان»</em>، وأن البناء والوقاية النفسية يسبقان العلاج. أسعى دائماً لتجاوز التنظير الأجوف وتحويل المعرفة النفسية الشرعية إلى أدوات وكراسات عمل واعية تعين الفرد والزوجين والمدرسة على إحداث نمو مستدام.
            </p>
          </div>

          {/* شبكة المؤهلات الرسمية الموثقة (Strict Symmetry) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            
            <div className="p-4 rounded-2xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 flex items-start gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-slate-800 dark:bg-slate-800 bg-slate-100 flex items-center justify-center shrink-0">
                <BookCheck className="w-4 h-4 text-accent-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100 dark:text-slate-100 text-slate-900">ماجستير علم النفس التربوي</div>
                <div className="text-[11px] text-slate-400 mt-0.5">ودراسات تمهيدي الدكتوراه (2020)</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 flex items-start gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-slate-800 dark:bg-slate-800 bg-slate-100 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100 dark:text-slate-100 text-slate-900">تصنيف الهيئة السعودية للتخصصات</div>
                <div className="text-[11px] text-slate-400 mt-0.5">أخصائي مساعد علم نفس (2025)</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 flex items-start gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-slate-800 dark:bg-slate-800 bg-slate-100 flex items-center justify-center shrink-0">
                <School className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100 dark:text-slate-100 text-slate-900">17+ عاماً خبرة قيادية مدرسية</div>
                <div className="text-[11px] text-slate-400 mt-0.5">إدارة كبرى المدارس وتدريب المعلمين</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 flex items-start gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-slate-800 dark:bg-slate-800 bg-slate-100 flex items-center justify-center shrink-0">
                <Users2 className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100 dark:text-slate-100 text-slate-900">مؤسس 4 كيانات عربية</div>
                <div className="text-[11px] text-slate-400 mt-0.5">مركز إنسان، منصة رفق، منصة وصلة، مركز مفهوم</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
