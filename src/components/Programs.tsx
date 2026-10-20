'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, CheckCircle2, BookOpen, X, Video, Users, Clock, Calendar } from 'lucide-react';

interface ProgramDetail {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  image: string;
  targetAudience: string;
  duration: string;
  format: string;
  summary: string;
  modules: { title: string; desc: string }[];
  outcomes: string[];
}

const programsList: ProgramDetail[] = [
  {
    id: 'rifq',
    title: 'برنامج «رحلة رِفق»',
    subtitle: 'تأهيل وتأسيس المقبلين على الزواج والخطيبين',
    badge: 'للمقبلين على الزواج',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    image: '/assets/program-rifq.jpg',
    targetAudience: 'الخطاب، العاقدون، والمقبلون على الزواج حديثاً',
    duration: '4 أسابيع تفاعلية مكثفة (جلسات أسبوعية)',
    format: 'أونلاين عبر Google Meet (مجموعات صغيرة تفاعلية)',
    summary: 'مسار تأهيلي تطبيقي يهدف إلى تفكيك التوقعات الرومانسية غير الواقعية، وفهم الفروق النفسية والوجدانية الفطرية بين الجنسين، والتمرس العملي على إدارة الخلافات وبناء الأمان الوجداني المشترك قبل الدخول.',
    modules: [
      {
        title: 'المحور الأول: فقه التوقعات وتفكيك الصور النمطية',
        desc: 'الانتقال من الخيالات الذهنية الوردية إلى واقعية المودة والرحمة، وفهم معنى الميثاق الغليظ والمسؤولية المشتركة.'
      },
      {
        title: 'المحور الثاني: سيكولوجيا الفروق والتواصل الآمن',
        desc: 'كيف يفكر الرجل وكيف تشعر المرأة؟ وكيف يعبر كل طرف عن احتياجه دون دفاعية، لوم، أو افتراضات مسبقة.'
      },
      {
        title: 'المحور الثالث: خريطة النزاعات المبكرة والحدود',
        desc: 'الاتفاق على قواعد الحوار، إدارة الجوانب المالية، وحدود العلاقة المتزنة مع العائلات والأهل الممتدين.'
      },
      {
        title: 'المحور الرابع: ميثاق الاستقرار والروتين الوجداني',
        desc: 'بناء طقوس يومية لتغذية المودة، حماية العلاقة من الفتور، وكتابة وثيقة التفاهم المشتركة لبداية واعية.'
      }
    ],
    outcomes: [
      'وضوح كامل للتوقعات والحقوق والواجبات المتبادلة',
      'امتلاك أدوات حوارية عملية لحل الخلافات بهدوء',
      'كراسة عمل تفاعلية لتطبيق محاور البرنامج خطوة بخطوة'
    ]
  },
  {
    id: 'mithaq',
    title: 'برنامج «مِيثاق»',
    subtitle: 'ترميم واستعادة السكينة والاتصال الزواجي',
    badge: 'للمتزوجين والأسر',
    badgeColor: 'bg-accent-500/10 text-accent-500 border-accent-500/20',
    image: '/assets/program-mithaq.jpg',
    targetAudience: 'الأزواج الذين يعانون من تراكم الخلافات أو الفتور أو الصمت العقابي',
    duration: 'مسار استشاري وتطبيقي مركّز (4 إلى 6 لقاءات)',
    format: 'أونلاين عبر Google Meet (جلسات زوجية خاصة وآمنة)',
    summary: 'انطلاقاً من قوله تعالى ﴿وَأَخَذْنَ مِنكُم مِّيثَاقًا غَلِيظًا﴾؛ برنامج علاجي وإرشادي هادف لإذابة الجليد العاطفي، وكسر دوائر النزاع واللوم المتبادل، وإعادة بناء مساحات التقدير والسكينة داخل البيت.',
    modules: [
      {
        title: 'المحور الأول: تفكيك دوائر الصمت العقابي واللوم',
        desc: 'تحديد النمط المتكرر الذي يشعل الخلاف، والتعرف على الجراح النفسية غير المعلنة وراء الغضب الظاهر.'
      },
      {
        title: 'المحور الثاني: بروتوكول إدارة نوبات الاحتقان',
        desc: 'خطوات عملية محددة لإيقاف التصعيد عند الغضب، وأخذ مسافة شعورية آمنة قبل الانزلاق للكلمات الجارحة.'
      },
      {
        title: 'المحور الثالث: استعادة الأمان الوجداني والحميمية',
        desc: 'إحياء لغة الامتنان والتقدير غير المشروط، وتجديد الاتصال القلبي والجسدي بعيداً عن الروتين اليومي المستنزف.'
      },
      {
        title: 'المحور الرابع: حماية البيت من الهزات الخارجية',
        desc: 'إعادة ضبط التدخلات العائلية وضغوط العمل والأبناء، وتأمين الجبهة الداخلية للأسرة برؤية أقومية واعية.'
      }
    ],
    outcomes: [
      'إيقاف استنزاف الخلافات اليومية واستعادة طمأنينة البيت',
      'بروتوكول تفاوضي متفق عليه لحل أي أزمة مستقبلية',
      'متابعة دورية مباشرة مع جلال أحمد خلال فترة البرنامج'
    ]
  },
  {
    id: 'mesaha',
    title: 'برنامج «مِساحة»',
    subtitle: 'إرشاد وبناء شخصية اليافعين وفهم المراهقة',
    badge: 'للآباء والمربين واليافعين',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    image: '/assets/workshop.jpg',
    targetAudience: 'أولياء الأمور والمعلمون ومربو اليافعين (من سن 11 إلى 18 عاماً)',
    duration: '3 أسابيع تدريبية مع تطبيقات ميدانية أسرية',
    format: 'أونلاين عبر Google Meet (ورش عمل تفاعلية)',
    summary: 'فلسفتنا الراسخة: «السلوك رسالة قبل أن يكون مشكلة»؛ برنامج تطبيقي لفك شفرات التحولات السلوكية في المراهقة، والتعامل مع العناد والتمرد والانطواء برؤية قائمة على «العلاقة أولاً قبل الطلب».',
    modules: [
      {
        title: 'المحور الأول: سيكولوجيا البلوغ وتكوين الهوية',
        desc: 'ماذا يجري في دماغ المراهق؟ ولماذا يتغير مزاجه بسرعة؟ وكيف نفرق بين التمرد الطبيعي والاضطراب السلوكي.'
      },
      {
        title: 'المحور الثاني: الحزم الرفيق وبناء القواعد الآمنة',
        desc: 'كيف تضع حدوداً واضحة للبيت دون صراخ أو تهديد؟ وكيف تطبق العواقب الطبيعية للسلوك بدلاً من العقاب الانتقامي.'
      },
      {
        title: 'المحور الثالث: الاستماع الفعال وحوار الصداقة',
        desc: 'إتقان فن الإنصات دون مقاطعة أو نصائح فجة، ليظل الوالدان الملجأ الأول لابنهما عند الوقوع في الخطأ أو الأزمة.'
      },
      {
        title: 'المحور الرابع: إدارة الشاشات والأقران والمسؤولية',
        desc: 'استراتيجيات واقعية للتعامل مع الهاتف ووسائل التواصل الاجتماعي وبناء حس المسؤولية الذاتية والرقابة الذاتية.'
      }
    ],
    outcomes: [
      'انخفاض الصدامات اليومية وتحول لغة الحوار إلى شراكة ومودة',
      'خطة والدية مخصصة للتعامل مع طباع كل ابن على حدة',
      'أدوات تشجيع المسؤولية والاعتماد على النفس بدلاً من الاعتمادية'
    ]
  }
];

export default function Programs() {
  const [selectedProgram, setSelectedProgram] = useState<ProgramDetail | null>(null);

  return (
    <section id="programs" className="py-20 px-4 sm:px-6 bg-[#0D1117] dark:bg-[#0D1117] bg-[#F8FAFC] border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 transition-colors">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* ترويسة البرامج */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 dark:bg-slate-800/60 bg-white border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs font-bold text-accent-500 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>برامج تخصصية تطبيقية</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-100 dark:text-slate-100 text-slate-900 tracking-normal">
            برامج وكورسات نوعية لبناء واستقرار البيوت
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
            مسارات تأهيلية وعلاجية مكثفة قائمة على الفطرة، وتصحيح المفاهيم، والوقاية قبل العلاج مع متابعة تطبيقية مباشرة.
          </p>
        </div>

        {/* شبكة الكروت الثلاثية المتماثلة هندسياً (Strict Symmetry) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programsList.map((program) => (
            <div
              key={program.id}
              className="h-full flex flex-col justify-between rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 overflow-hidden hover:border-slate-700 dark:hover:border-slate-700 hover:border-slate-300 transition-all shadow-sm hover:shadow-md group text-right"
            >
              <div>
                {/* صورة معبرة عن الكورس */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151B23] via-transparent to-transparent opacity-90" />
                  
                  <div className="absolute top-3 right-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-xs ${program.badgeColor}`}>
                      {program.badge}
                    </span>
                  </div>
                </div>

                {/* محتوى الكارت */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-100 dark:text-slate-100 text-slate-900 group-hover:text-accent-500 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-500 mt-1 font-medium">
                      {program.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal min-h-[60px]">
                    {program.summary}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-800/60 dark:border-slate-800/60 border-slate-100 text-[11px] text-slate-400 dark:text-slate-400 text-slate-500">
                    <div className="flex items-center gap-2">
                      <Video className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                      <span>{program.format}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                      <span>{program.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* أزرار الإجراء السفلية المتناسقة */}
              <div className="p-6 pt-0 space-y-2">
                <button
                  onClick={() => setSelectedProgram(program)}
                  className="w-full py-2.5 bg-slate-800/80 dark:bg-slate-800/80 bg-slate-100 hover:bg-slate-700/80 dark:hover:bg-slate-700/80 hover:bg-slate-200 text-slate-200 dark:text-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-accent-500" />
                  <span>تفاصيل المحتوى والمحاور الكاملة</span>
                </button>

                <a
                  href="https://calendly.com/galal3hmad/insan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 text-center shadow-xs"
                >
                  <span>طلب التسجيل وحجز المقعد</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          ))}
        </div>

        {/* قسم أقومية القرآن المصغر الموحد */}
        <div className="p-8 rounded-3xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm text-right">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-accent-500">
              <BookOpen className="w-4 h-4" />
              <span>المرجعية المعرفية العليا</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
              مشروع «أقومية القرآن» وتصحيح التصورات النفسية والتربوية
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal">
              ﴿إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ﴾ — رؤية تؤصل المفاهيم النفسية وفق الفطرة والوحي، وتتجاوز النظريات المستوردة لبناء إنسان متزن وأسرة آمنة مستقرة.
            </p>
          </div>
          <Link
            href="#articles"
            className="whitespace-nowrap px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2"
          >
            <span>تصفح أوراق المشروع المعرفية</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* نافذة تفاصيل البرنامج المستقلة (Program Details Full Modal) */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn text-right">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-700 dark:border-slate-700 border-slate-200 p-6 sm:p-8 text-slate-100 dark:text-slate-100 text-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedProgram(null)}
              className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border inline-block ${selectedProgram.badgeColor}`}>
                {selectedProgram.badge}
              </span>
              <h3 className="text-2xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
                {selectedProgram.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 text-slate-500">
                {selectedProgram.subtitle}
              </p>
            </div>

            {/* Meta details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-800/60 dark:bg-slate-800/60 bg-slate-50 border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">الفئة المستهدفة:</span>
                <span className="font-bold text-slate-200 dark:text-slate-200 text-slate-800">{selectedProgram.targetAudience}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">مدة البرنامج:</span>
                <span className="font-bold text-slate-200 dark:text-slate-200 text-slate-800">{selectedProgram.duration}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">طريقة الحضور:</span>
                <span className="font-bold text-emerald-400">{selectedProgram.format}</span>
              </div>
            </div>

            {/* Modules Breakdown */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-accent-500">
                محاور ومحتوى الورش التطبيقية:
              </h4>
              <div className="space-y-3">
                {selectedProgram.modules.map((m, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-800/40 dark:bg-slate-800/40 bg-slate-50 border border-slate-700/40 dark:border-slate-700/40 border-slate-200 space-y-1">
                    <div className="text-xs font-bold text-slate-100 dark:text-slate-100 text-slate-900">{m.title}</div>
                    <div className="text-[11px] text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed">{m.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outcomes */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-emerald-400">
                ماذا ستكتسب وتخرج به من هذا المسار؟
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 dark:text-slate-300 text-slate-700">
                {selectedProgram.outcomes.map((out, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href="https://calendly.com/galal3hmad/insan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 text-center"
              >
                <span>حجز موعد والانضمام للبرنامج</span>
                <ArrowLeft className="w-4 h-4" />
              </a>
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-6 py-3.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 transition"
              >
                إغلاق النافذة
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
