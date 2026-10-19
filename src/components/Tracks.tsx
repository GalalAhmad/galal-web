'use client';

import React from 'react';
import Link from 'next/link';
import { HeartHandshake, Compass, Building2, ArrowLeft, CheckCircle2 } from 'lucide-react';

const tracks = [
  {
    number: '01',
    icon: HeartHandshake,
    title: 'الاستشارات النفسية والزوجية',
    subtitle: 'للأفراد، الأزواج، والمقبلين على الزواج',
    description: 'جلسات مهنية معمقة لتفكيك المشكلات الانفعالية، ترميم جسور التواصل المتعثرة، وإعادة بناء الأمان والمودة داخل البيوت.',
    items: [
      'استشارات فردية للتعامل مع الضغوط والقلق والانفعال',
      'إرشاد زواجي لكسر الصمت العقابي وتجديد الميثاق',
      'تأهيل الخطيبين وبناء التوافق الفطري قبل الدخول'
    ],
    ctaText: 'حجز جلسة في المسار الزواجي',
    tag: 'جلسات أونلاين خاصة'
  },
  {
    number: '02',
    icon: Compass,
    title: 'التربية وبناء شخصية اليافعين',
    subtitle: 'للآباء، الأمهات، والمربين',
    description: 'تمكين الوالدين من أدوات الفهم الواعي لسيكولوجيا المراهقة، ومساندة اليافع في بناء هويته ومسؤوليته الذاتية برفق وحزم.',
    items: [
      'فهم دوافع سلوك الأبناء والتعامل مع العناد والتمرد',
      'إرشاد اليافعين ومساعدتهم على تجاوز ضغوط الأقران',
      'برنامج «مِساحة» لتطوير مهارات مرحلة البلوغ'
    ],
    ctaText: 'حجز استشارة تربوية وأسرية',
    tag: 'إرشاد والدين ويافعين'
  },
  {
    number: '03',
    icon: Building2,
    title: 'التدريب وتطوير المؤسسات والمدارس',
    subtitle: 'للمدارس، المعلمين، والقيادات التربوية',
    description: 'الذراع المؤسسي عبر «مركز إنسان» و«مركز مفهوم» لتدريب المعلمين وتطوير النظم المدرسية والبيئات الصفية المحفزة.',
    items: [
      'حقائب تدريب المعلمين على مهارات علم النفس التربوي',
      'برامج القيادة والإدارة المدرسية المتقدمة',
      'استشارات هندسة البيئة الصفية وجودة التعلم'
    ],
    ctaText: 'طلب استشارة أو تدريب مؤسسي',
    tag: 'مؤسسي ومدرسي'
  }
];

export default function Tracks() {
  return (
    <section id="tracks" className="py-20 px-4 sm:px-6 bg-[#0D1117] dark:bg-[#0D1117] bg-[#F8FAFC] border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 transition-colors">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* ترويسة المسارات */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 dark:bg-slate-800/60 bg-white border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs font-bold text-accent-500 shadow-xs">
            <span>🧭</span>
            <span>مجالات الحركة والتأثير</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-100 dark:text-slate-100 text-slate-900 tracking-normal">
            ثلاثة مسارات رئيسية نتحرك من خلالها
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
            صُممت مساراتنا لتوفير دعم دقيق ومخصص لكل مرحلة واحتياج؛ من الفرد إلى الزوجين والأسرة والمدرسة.
          </p>
        </div>

        {/* شبكة المسارات الثلاثية المتطابقة المتوازنة (Strict Symmetry) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tracks.map((track, idx) => {
            const Icon = track.icon;
            return (
              <div 
                key={idx}
                className="h-full flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 hover:border-slate-700 dark:hover:border-slate-700 hover:border-slate-300 transition-all shadow-sm hover:shadow-md text-right group"
              >
                <div className="space-y-4">
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-accent-500 px-2 py-0.5 rounded-md bg-accent-500/10 border border-accent-500/20">
                      مسار {track.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 dark:bg-slate-800 bg-slate-100 flex items-center justify-center text-slate-300 dark:text-slate-300 text-slate-700 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-accent-500" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-100 dark:text-slate-100 text-slate-900 group-hover:text-accent-500 transition-colors">
                      {track.title}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 text-slate-500 mt-0.5 block">
                      {track.subtitle}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal min-h-[55px]">
                    {track.description}
                  </p>

                  <ul className="text-xs text-slate-400 dark:text-slate-400 text-slate-600 space-y-2 pt-3 border-t border-slate-800/60 dark:border-slate-800/60 border-slate-100">
                    {track.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                </div>

                <div className="pt-6 border-t border-slate-800/80 dark:border-slate-800/80 border-slate-100">
                  <a
                    href="https://calendly.com/galal3hmad/insan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-slate-800/80 dark:bg-slate-800/80 bg-slate-100 hover:bg-accent-500 dark:hover:bg-accent-500 hover:text-white dark:hover:text-white text-slate-200 dark:text-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 group-hover:bg-accent-500 group-hover:text-white"
                  >
                    <span>{track.ctaText}</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
