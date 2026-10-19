'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Award, Building, Sparkles, ArrowLeft } from 'lucide-react';

export default function AboutClean() {
  const initiatives = [
    {
      name: 'منصة رِفق',
      country: 'المملكة الأردنية الهاشمية',
      role: 'مؤسس وموجّه تربوي',
      desc: 'مبادرة رائدة تُعنى بنشر ثقافة التربية بالرفق، وتطوير مهارات الآباء والمربين لبناء علاقات سوية مع الأبناء.',
    },
    {
      name: 'منصة وصلة',
      country: 'منصة إقليمية رقمية',
      role: 'مؤسس ومستشار',
      desc: 'منصة متخصصة في الدعم الأسري والزواجي، وتجسير الفجوات التواصلية بين الأزواج عبر أدوات إرشادية نوعية.',
    },
    {
      name: 'مركز مفهوم',
      country: 'جمهورية مصر العربية',
      role: 'مؤسس ومدير برامج',
      desc: 'صرح استشاري يُعنى ببرامج الفهم والتأهيل النفسي، وتفكيك التشوهات المعرفية والسلوكية لدى اليافعين والبالغين.',
    },
    {
      name: 'مركز إنسان',
      country: 'جمهورية مصر العربية',
      role: 'مؤسس واستشاري',
      desc: 'مركز متخصص في التدريب وبناء الوعي النفسي والتربوي، وتقديم الاستشارات النوعية للأفراد والمؤسسات التعليمية.',
    },
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 bg-[#0D1117] dark:bg-[#0D1117] bg-white transition-colors">
      <div className="max-w-5xl mx-auto space-y-16 text-right">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-accent-500 uppercase tracking-wider block">
            المسيرة والتأسيس
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-100 dark:text-slate-100 text-slate-900 leading-tight">
            عن جـلال أحـمد
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
            استشارات وبناء الإنسان والأسرة.. بين عمق التأصيل النفسي والخبرة الميدانية.
          </p>
        </div>

        {/* The Human Statement (Mohamed Taha inspiration) */}
        <div className="rounded-3xl p-8 sm:p-10 bg-[#12171E] dark:bg-[#12171E] bg-slate-50 border border-slate-800/80 dark:border-slate-800/80 border-slate-200 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-500/10 text-accent-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-accent-500" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-100 dark:text-slate-100 text-slate-900">
                «السلوك رسالة قبل أن يكون مشكلة.. والوعي بداية التغيير»
              </h3>
              <p className="text-xs text-slate-400">رؤية جلال أحمد في الاستشارة والتوجيه</p>
            </div>
          </div>

          <p className="text-sm text-slate-300 dark:text-slate-300 text-slate-700 leading-loose">
            كل إنسان يملك في داخله بذور التعافي والنمو، لكن ضغوط الحياة وتراكمات العلاقات قد تحجب الرؤية وتصنع ردود أفعال عشوائية مؤلمة. مساحتي معك ليست لتقديم وصايا جاهزة، بل لمرافقتك في رحلة هادئة تفكك فيها الرسائل الكامنة خلف السلوك، وتكتشف أدواتك الداخلية لتصنع قراراتك بوعي ومسؤولية.
          </p>

          {/* Official License Badge */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/80 dark:bg-slate-900/80 bg-white border border-slate-800 dark:border-slate-800 border-slate-200 text-xs text-slate-200 dark:text-slate-200 text-slate-800">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <strong>تصنيف الهيئة السعودية للتخصصات الصحية</strong>
                <span className="block text-[11px] text-slate-400 mt-0.5">
                  أخصائي مساعد علم نفس | علاج وتأهيل (2025)
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/80 dark:bg-slate-900/80 bg-white border border-slate-800 dark:border-slate-800 border-slate-200 text-xs text-slate-200 dark:text-slate-200 text-slate-800">
              <Award className="w-4 h-4 text-accent-500 shrink-0" />
              <div>
                <strong>ماجستير علم النفس والخبرة الإكلينيكية</strong>
                <span className="block text-[11px] text-slate-400 mt-0.5">
                  سنوات من الإرشاد الأسري وإدارة البرامج المؤسسية
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Founded Projects & Initiatives */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-accent-500" />
              <h3 className="text-lg font-black text-slate-100 dark:text-slate-100 text-slate-900">
                مشاريع وصروح أسسها جـلال أحـمد
              </h3>
            </div>
            <span className="text-xs text-slate-400">مصر والأردن والمنطقة</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {initiatives.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#12171E] dark:bg-[#12171E] bg-slate-50 border border-slate-800/80 dark:border-slate-800/80 border-slate-200 text-right space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                    {item.name}
                  </h4>
                  <span className="text-[10px] font-bold text-accent-500 bg-accent-500/10 px-2 py-0.5 rounded-md">
                    {item.country}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-semibold">
                  {item.role}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed pt-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-xs font-bold text-accent-500 hover:text-accent-400 transition"
            >
              <span>استعرض السيرة الذاتية والمؤهلات الأكاديمية الكاملة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
