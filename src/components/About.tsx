'use client';

import React from 'react';
import { Award, BookCheck, School, Users2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 bg-[#11161D] dark:bg-[#11161D] bg-slate-50 border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 transition-colors">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* بطاقة رمزية هادئة تعبر عن النمو والتوازن (تطبيقاً لشرط وضع الصورة الشخصية في صفحة عن جلال أحمد فقط) */}
        <div className="md:col-span-5 flex justify-center order-2 md:order-1">
          <div className="relative w-full max-w-sm">
            <div className="rounded-3xl p-8 bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-700/80 dark:border-slate-700/80 border-slate-200 shadow-xl space-y-6 text-right">
              
              <div className="flex items-center justify-between border-b border-slate-800 dark:border-slate-800 border-slate-100 pb-4">
                <div className="text-xs font-bold text-accent-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>الخبرة والتأصيل الميداني</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 dark:bg-slate-800 bg-slate-100 text-slate-400">
                  17+ عاماً
                </span>
              </div>

              {/* Abstract Harmony Visual */}
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-accent-500/20 via-emerald-500/10 to-transparent flex items-center justify-center border border-accent-500/30">
                  <BookCheck className="w-8 h-8 text-accent-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                    أخصائي معتمد ومستشار تربوي
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-[220px] mx-auto leading-relaxed">
                    تصنيف الهيئة السعودية للتخصصات الصحية وماجستير علم النفس التربوي
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/about"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 bg-slate-100 hover:bg-accent-500 hover:text-white text-slate-200 dark:text-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <span>السيرة المهنية الكاملة والمؤهلات</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </a>
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
