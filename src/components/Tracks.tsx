import React from 'react';
import Link from 'next/link';
import { HeartHandshake, Compass, Building2, ArrowLeft } from 'lucide-react';

const tracks = [
  {
    number: '01',
    icon: HeartHandshake,
    title: 'الاستشارات النفسية والزوجية',
    description: 'جلسات مهنية للأفراد والأزواج والمقبلين على الزواج لفهم المشكلات الانفعالية، ترميم جسور التواصل، وبناء بيت مستقر ومتزن.',
    items: [
      'استشارات فردية وتجاوز الضغوط والانفعالات',
      'إرشاد أسري وحل الخلافات الزوجية العميقة',
      'تأهيل وإعداد المقبلين على الزواج'
    ],
    ctaText: 'طلب جلسة في هذا المسار',
    trackKey: 'marital'
  },
  {
    number: '02',
    icon: Compass,
    title: 'التربية واليافعين والمراهقة',
    description: 'تمكين الآباء والأمهات من أدوات الفهم الواعي، ومساندة اليافعين في العبور الآمن لمرحلة البلوغ وبناء الهوية والمسؤولية الذاتية.',
    items: [
      'فهم دوافع سلوك الأبناء والتعامل مع العناد',
      'إرشاد اليافعين والمراهقين وبناء الثقة',
      'مبادرة «مساحة» لتطوير مهارات مرحلة البلوغ'
    ],
    ctaText: 'طلب استشارة تربوية',
    trackKey: 'teen'
  },
  {
    number: '03',
    icon: Building2,
    title: 'التدريب والمؤسسات التعليمية',
    description: 'الذراع المؤسسي عبر «مركز إنسان للتدريب والاستشارات» لتدريب المعلمين، القيادات التربوية، وتطوير بيئات التعلم المدرسية.',
    items: [
      'برامج القيادة والإدارة المدرسية الفعالة',
      'حقائب تدريب المعلمين على علم النفس التربوي',
      'استشارات تحسين الممارسات والبيئة المدرسية'
    ],
    ctaText: 'برامج المؤسسات والمدارس',
    trackKey: 'corporate'
  }
];

export default function Tracks() {
  return (
    <section id="tracks" className="py-20 px-4 sm:px-6 bg-white border-y border-slate-100">
      <div className="max-w-6xl mx-auto">
        
        {/* العنوان */}
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold text-sage-600 uppercase tracking-wider">
            المجالات والمساندة
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-800">
            ثلاثة مسارات نتحرك من خلالها
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            صُممت مساراتنا لتقديم دعم دقيق ومخصص لكل مرحلة واحتياج
          </p>
        </div>

        {/* شبكة المسارات الثلاثة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tracks.map((track, idx) => {
            const Icon = track.icon;
            return (
              <div 
                key={idx}
                className="p-8 rounded-3xl bg-[#FAFAFA] border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {track.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-800 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-brand-800">
                    {track.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {track.description}
                  </p>

                  <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-200/50">
                    {track.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`#booking?track=${track.trackKey}`}
                  className="text-xs font-bold text-brand-800 group-hover:text-black flex items-center gap-1.5 transition pt-2"
                >
                  <span>{track.ctaText}</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
