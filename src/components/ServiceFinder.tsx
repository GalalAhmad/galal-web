'use client';

import React from 'react';
import Link from 'next/link';
import { User, Users, HeartHandshake, Zap, ArrowLeft, CheckCircle2, Calendar, Video, FileText } from 'lucide-react';

const serviceTypes = [
  {
    id: 'instant',
    title: 'استشارة فورية / مرنة',
    target: 'دعم نفسي واستشاري عاجل',
    desc: 'مخصصة للمواقف الضاغطة الطارئة، اتخاذ القرارات الحساسة، أو تفريغ الاحتقان الانفعالي دون فترات انتظار.',
    icon: Zap,
    themeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20 group-hover:border-amber-500/40',
    trackParam: 'instant'
  },
  {
    id: 'individual',
    title: 'استشارة نفسية فردية',
    target: 'للأفراد بعمر 18 فما فوق',
    desc: 'جلسات خاصة لتجاوز القلق، كسر جلد الذات، تنظيم المشاعر، والانتقال من ردود الفعل العفوية إلى رحابة الوعي والاتزان.',
    icon: User,
    themeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20 group-hover:border-rose-500/40',
    trackParam: 'individual'
  },
  {
    id: 'marital',
    title: 'إرشاد وتأهيل زواجي',
    target: 'لي ولشريكي (أزواج ومقبلون)',
    desc: 'تأهيل الخطيبين عبر «رحلة رِفق»، أو تفكيك دوائر الصمت العقابي والخلافات المستنزفة وترميم السكينة عبر «مِيثاق».',
    icon: HeartHandshake,
    themeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20 group-hover:border-sky-500/40',
    trackParam: 'marital'
  },
  {
    id: 'teens',
    title: 'إرشاد سلوكي لليافعين',
    target: 'للأبناء والوالدين والمربين',
    desc: 'فك شفرات مرحلة المراهقة والبلوغ، التعامل مع العناد والتمرد، وبناء علاقة قائمة على الحزم الرفيق وبناء الهوية.',
    icon: Users,
    themeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:border-emerald-500/40',
    trackParam: 'teen'
  }
];

const journeySteps = [
  {
    step: '01',
    title: 'حدد مسارك أو خض مقياساً ذاتياً',
    desc: 'اختر نوع الاستشارة المناسبة لحالتك، أو استعن بمقاييس التبصر بالذات لمعرفة بوصلتك النفسية في دقيقتين مجاناً.',
    icon: FileText
  },
  {
    step: '02',
    title: 'احجز موعدك مباشرة عبر التقويم',
    desc: 'اختر اليوم والساعة الأنسب لك فوراً من جدول المواعيد المتاحة، ليصلك تأكيد الموعد ورابط Google Meet المشفر تلقائياً.',
    icon: Calendar
  },
  {
    step: '03',
    title: 'انطلق في جلستك مع خطة عملية',
    desc: 'جلسة استشارية خاصة ومباشرة عبر اتصال مرئي مشفر مع جلال أحمد، للخروج بأدوات وكراسة متابعة واقعية للنمو والاتزان.',
    icon: Video
  }
];

export default function ServiceFinder() {
  return (
    <section id="services" className="py-20 px-4 sm:px-6 bg-[#0E1318] dark:bg-[#0E1318] bg-[#F4F7F9] border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 transition-colors">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* الجزء الأول: مستلهم من تجربة عرب ثيرابي (ما هو نوع الدعم الذي تبحث عنه؟) */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-accent-500 uppercase tracking-wider block">
              دليلك لاختيار الاستشارة المناسبة
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-100 dark:text-slate-100 text-slate-900 tracking-normal">
              ما هو نوع الدعم أو الاستشارة التي تبحث عنها؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
              اختر المسار الأقرب لاحتياجك الحالي للبدء في حجز جلستك أونلاين عبر اتصال مرئي مشفر وآمن.
            </p>
          </div>

          {/* شبكة البطاقات الأربعة المتماثلة بنمط عربي حديث متقن */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceTypes.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="h-full flex flex-col justify-between p-7 rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 hover:border-slate-700 dark:hover:border-slate-700 hover:border-slate-300 transition-all shadow-sm hover:shadow-md text-right group"
                >
                  <div className="space-y-4">
                    
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.themeColor} transition-transform group-hover:scale-105`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">جلسات أونلاين</span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-100 dark:text-slate-100 text-slate-900 group-hover:text-accent-500 transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-xs font-bold text-accent-500 block mt-0.5">
                        {item.target}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed min-h-[60px]">
                      {item.desc}
                    </p>

                  </div>

                  <div className="pt-6 border-t border-slate-800/60 dark:border-slate-800/60 border-slate-100">
                    <Link
                      href={`#booking?type=${item.trackParam}`}
                      className="w-full py-2.5 bg-slate-800/80 dark:bg-slate-800/80 bg-slate-100 hover:bg-accent-500 dark:hover:bg-accent-500 hover:text-white dark:hover:text-white text-slate-200 dark:text-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 group-hover:bg-accent-500 group-hover:text-white"
                    >
                      <span>ابدأ الآن</span>
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* الجزء الثاني: كيف تبدأ رحلتك الاستشارية معنا؟ (3 خطوات بسيطة) */}
        <div className="pt-10 border-t border-slate-800/80 dark:border-slate-800/80 border-slate-200 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              خطوات يسيرة وواضحة
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
              كيف تبدأ رحلتك الاستشارية معنا؟
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 text-slate-600">
              ثلاث محطات بسيطة تفصلك عن أولى خطوات الوعي والاتزان وتجاوز الحيرة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {journeySteps.map((s, idx) => {
              const StepIcon = s.icon;
              return (
                <div 
                  key={idx}
                  className="p-8 rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 shadow-sm relative text-right space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-accent-500/40 font-mono">
                      {s.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 dark:bg-slate-800 bg-slate-100 flex items-center justify-center text-accent-500">
                      <StepIcon className="w-5 h-5" />
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                    {s.title}
                  </h4>

                  <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
