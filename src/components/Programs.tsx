import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, ShieldCheck, BookOpen } from 'lucide-react';

export default function Programs() {
  return (
    <section id="programs" className="py-20 px-4 sm:px-6 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* مقدمة البرامج */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-accent-500 uppercase tracking-wider">
            برامج تخصصية نوعية
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-800">
            برامج متخصصة لبناء واستقرار البيوت
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            مسارات تطبيقية قائمة على الفطرة، وتصحيح المفاهيم، والوقاية قبل العلاج
          </p>
        </div>

        {/* كارتين للبرنامجين الأساسيين */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* برنامج 1: رحلة رِفق */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-sage-50 text-sage-600 border border-sage-100 text-xs font-bold rounded-full">
                  للمقبلين على الزواج
                </span>
                <span className="text-2xl">🌱</span>
              </div>

              <h3 className="text-2xl font-black text-brand-800">
                برنامج «رحلة رِفق»
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                مسار نوعي متكامل للخطيبين والمقبلين على الزواج لتفكيك التوقعات المثالية، وفهم الفروق النفسية بين الجنسين، والتمرس العملي على إدارة الخلاف وبناء الأمان العاطفي قبل الدخول.
              </p>

              <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>فقه التوقعات:</strong> الانتقال من خيالات الرومانسية إلى واقعية المودة والمسؤولية.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>أدوات الحوار:</strong> التدريب على التعبير الصادق عن الاحتياج دون دفاعية أو لوم.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>خريطة النزاعات المبكرة:</strong> قواعد التفاهم المالي وحدود العلاقة مع الأهل الممتدين.</span>
                </div>
              </div>
            </div>

            <Link
              href="#booking?program=rifq"
              className="w-full py-3 bg-brand-800 text-white text-xs font-bold rounded-xl hover:bg-black transition text-center shadow-xs flex items-center justify-center gap-2"
            >
              <span>طلب الانضمام لـ «رحلة رِفق»</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* برنامج 2: ميثاق للمتزوجين */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-accent-50 text-accent-500 border border-accent-500/20 text-xs font-bold rounded-full">
                  للمتزوجين والأسر
                </span>
                <span className="text-2xl">🤝</span>
              </div>

              <h3 className="text-2xl font-black text-brand-800">
                برنامج «مِيثاق»
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                انطلاقاً من قوله تعالى ﴿وَأَخَذْنَ مِنكُم مِّيثَاقًا غَلِيظًا﴾؛ برنامج تطبيقي لترميم شروخ العلاقة الزوجية، استعادة الاتصال الوجداني، وكسر حلقات الخلاف والفتور لحماية استقرار البيت.
              </p>

              <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-2">
                  <span className="text-accent-500 font-bold">✓</span>
                  <span><strong>ترميم الاتصال:</strong> كسر حلقات الصمت العقابي وتجديد الأمان الوجداني المشترك.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent-500 font-bold">✓</span>
                  <span><strong>إدارة لحظات الغضب:</strong> بروتوكول واقعي للتعامل مع لحظات الاحتقان الشديد.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent-500 font-bold">✓</span>
                  <span><strong>تجديد المودة والسكينة:</strong> استعادة الحميمية والتقدير المتبادل داخل البيت.</span>
                </div>
              </div>
            </div>

            <Link
              href="#booking?program=mithaq"
              className="w-full py-3 bg-brand-800 text-white text-xs font-bold rounded-xl hover:bg-black transition text-center shadow-xs flex items-center justify-center gap-2"
            >
              <span>طلب استشارة مسار «مِيثاق»</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* قسم أقومية القرآن المصغر */}
        <div className="p-8 rounded-3xl bg-brand-800 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-right">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300">
              <BookOpen className="w-4 h-4" />
              <span>المرجعية المعرفية العليا</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black">
              مشروع «أقومية القرآن» وتصحيح التصورات النفسية والتربوية
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ﴿إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ﴾ — رؤية تؤصل المفاهيم النفسية وفق الفطرة والوحي، وتتجاوز النظريات المستوردة لبناء إنسان متزن وأسرة آمنة.
            </p>
          </div>
          <Link
            href="#articles"
            className="whitespace-nowrap px-6 py-3 bg-white text-brand-800 text-xs font-bold rounded-xl hover:bg-slate-100 transition shadow-xs"
          >
            تصفح أوراق المشروع المعرفية ←
          </Link>
        </div>

      </div>
    </section>
  );
}
