'use client';

import React from 'react';
import { Calendar, FileCheck, Video, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function HowItWorksClean() {
  const steps = [
    {
      num: '01',
      icon: Calendar,
      title: 'اختر الموعد المناسب',
      desc: 'حدد اليوم والتوقيت الأنسب لجدولك الزمني عبر التقويم الإلكتروني المباشر بكل مرونة وسهولة.',
    },
    {
      num: '02',
      icon: FileCheck,
      title: 'أجب عن لمحة سريعة',
      desc: 'استبيان مقتضب لا يتجاوز دقيقة واحدة يوضح طبيعة احتياجك، لنكون مستعدين لدعمك بالشكل الأمثل.',
    },
    {
      num: '03',
      icon: Video,
      title: 'ادخل جلستك بأمان',
      desc: 'يصلك رابط خاص ومشفر عبر Google Meet، لتلتقي بجلال أحمد من راحة منزلك وبأعلى درجات الخصوصية.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 bg-[#0D1117] dark:bg-[#0D1117] bg-white transition-colors">
      <div className="max-w-5xl mx-auto space-y-14 text-right">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-accent-500 uppercase tracking-wider block">
            تجربة ميسرة ومباشرة
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-100 dark:text-slate-100 text-slate-900 leading-tight">
            كيف تبدأ جلستك الاستشارية؟
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
            ثلاث خطوات ميسرة تفصلك عن مساحتك الآمنة، دون تعقيد أو انتظار مطول.
          </p>
        </div>

        {/* 3 Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-3xl p-7 bg-[#12171E] dark:bg-[#12171E] bg-slate-50 border border-slate-800/80 dark:border-slate-800/80 border-slate-200 text-right space-y-4 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-accent-500/10 text-accent-500 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-700 dark:text-slate-700 text-slate-300 font-mono">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 dark:text-slate-100 text-slate-900 pt-2">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}

        </div>

        {/* Policies & Reassurance Banner */}
        <div className="rounded-2xl p-6 bg-slate-900/60 dark:bg-slate-900/60 bg-emerald-50/50 border border-slate-800 dark:border-slate-800 border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-accent-500" />
            </div>
            <div>
              <span className="font-bold text-slate-200 dark:text-slate-200 text-slate-900 block">
                سياسة إعادة الجدولة والإلغاء المعتمدة:
              </span>
              <p className="text-slate-400 dark:text-slate-400 text-slate-600 mt-0.5">
                يمكنك إعادة جدولة موعدك أو إلغاؤه مجاناً بالكامل حتى <strong>48 ساعة</strong> قبل موعد الجلسة، حرصاً على وقتك وتنظيم الجلسات.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>سرية وأمان مهني 100%</span>
          </div>

        </div>

      </div>
    </section>
  );
}
