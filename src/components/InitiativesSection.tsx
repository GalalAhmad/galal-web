'use client';

import React from 'react';
import { Layers, Compass, BookOpen, Building, MapPin, CheckCircle2 } from 'lucide-react';

const initiatives = [
  {
    name: 'منصة رِفْق (Rifq)',
    role: 'المؤسس والمطور للمنهجية',
    region: 'الأردن والوطن العربي',
    category: 'إرشاد نفسي وتأهيل أسري',
    description: 'منصة رقمية متخصصة تهدف إلى إعادة الاعتبار لسكينة البيوت وتأهيل المقبلين على الزواج ببرامج فطرية نوعية، تجمع بين عمق التأصيل الشرعي والمهنية العيادية لتفكيك النزاعات وتعميق المودة.',
    highlights: [
      'برنامج رحلة رِفق التفاعلي للمقبلين على الزواج',
      'كراسات عملية لفحص التوافق وكسر التوقعات المثالية',
      'استشارات عن بُعد للأسر والشباب في أنحاء الوطن العربي'
    ],
    icon: Layers,
    accentColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    name: 'منصة وصْلة (Wasla360)',
    role: 'المؤسس ورئيس مجلس الإدارة',
    region: 'المملكة الأردنية الهاشمية',
    category: 'تمكين وتوجيه الشباب',
    description: 'بوابة استشارية وتوجيهية متكاملة لدعم وتمكين اليافعين والشباب، تعينهم على اكتشاف قدراتهم، ورسم بوصلتهم الأكاديمية والمهنية، والانتقال من التشتت إلى وضوح الهدف وتحمل المسؤولية.',
    highlights: [
      'برامج اكتشاف الميول وبوصلة المسار المهني والأكاديمي',
      'ورش تفاعلية في بناء الشخصية والوعي الذاتي',
      'شراكات نوعية مع مؤسسات رعاية وتوجيه الشباب'
    ],
    icon: Compass,
    accentColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  },
  {
    name: 'مركز مفهوم (Mafhoom)',
    role: 'المؤسس والمستشار التربوي',
    region: 'استشارات وحلول تعليمية',
    category: 'التطوير المدرسي والتربوي',
    description: 'بيت خبرة تربوي يقدم استشارات هندسة وتطوير النظم المدرسية، وتدريب القيادات التعليمية والمعلمين على مهارات علم النفس التربوي وتعديل السلوك وبناء البيئات المدرسية المحفزة.',
    highlights: [
      'حقائب تدريب المعلمين على الإدارة الصفية الإيجابية',
      'بروتوكولات التدخل السلوكي ورعاية الموهوبين والمتعثرين',
      'استشارات تطوير البيئات المدرسية ونظم جودة التعليم'
    ],
    icon: BookOpen,
    accentColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
  },
  {
    name: 'مركز إنسان للتدريب والاستشارات',
    role: 'المؤسس والمدير العام',
    region: 'القاهرة — جمهورية مصر العربية',
    category: 'بناء وتنمية الإنسان والأسرة',
    description: 'صرح تدريبي واستشاري رائد في القاهرة يركز على بناء وتنمية الشخصية المتزنة، وتقديم الاستشارات النفسية والأسرية، وإطلاق المبادرات المجتمعية لترسيخ الوعي النفسي السليم.',
    highlights: [
      'جلسات الدعم النفسي والإرشاد الزواجي الفردي والمشترك',
      'دبلومات وورش تدريبية متقدمة في المهارات الحياتية',
      'برامج إرشاد الوالدين في التعامل مع تحديات المراهقة'
    ],
    icon: Building,
    accentColor: 'text-accent-500 bg-accent-500/10 border-accent-500/20'
  }
];

export default function InitiativesSection() {
  return (
    <section id="initiatives" className="py-20 px-4 sm:px-6 bg-[#0D1117] dark:bg-[#0D1117] bg-[#F8FAFC] border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 transition-colors">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* ترويسة القسم المتناغمة */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 dark:bg-slate-800/60 bg-white border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs font-bold text-accent-500 shadow-xs">
            <span>🏛️</span>
            <span>الأذرع والمبادرات التأسيسية</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-100 dark:text-slate-100 text-slate-900 tracking-tight">
            مشاريع ومبادرات أسسها جـلال أحـمد
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
            منظومة متكاملة من المنصات والمراكز المتخصصة لخدمة الإنسان والأسرة والتعليم في العالم العربي برؤية أصيلة وميدانية.
          </p>
        </div>

        {/* شبكة البطاقات المتماثلة بدقة هندسية (Strict Symmetry) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {initiatives.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="h-full flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 hover:border-slate-700 dark:hover:border-slate-700 hover:border-slate-300 transition-all shadow-sm hover:shadow-md group text-right"
              >
                <div className="space-y-4">
                  {/* رأس البطاقة والشارة */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.accentColor}`}>
                      {item.category}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 bg-slate-100 flex items-center justify-center text-slate-300 dark:text-slate-300 text-slate-700 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4 text-accent-500" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-100 dark:text-slate-100 text-slate-900 group-hover:text-accent-500 transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-400 text-slate-500 mt-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{item.region}</span>
                    </div>
                  </div>

                  {/* نبذة عن المشروع */}
                  <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal min-h-[70px]">
                    {item.description}
                  </p>

                  {/* أبرز المخرجات */}
                  <div className="pt-3 border-t border-slate-800/60 dark:border-slate-800/60 border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      أبرز المجالات والبرامج:
                    </span>
                    <ul className="space-y-1.5 text-[11px] text-slate-400 dark:text-slate-400 text-slate-600">
                      {item.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* صفة التأسيس في الأسفل لضمان تناسق الارتفاع */}
                <div className="mt-6 pt-3 border-t border-slate-800/80 dark:border-slate-800/80 border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">الدور الإشرافي:</span>
                  <span className="text-xs font-bold text-accent-500">{item.role}</span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
