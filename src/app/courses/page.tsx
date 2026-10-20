'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  BookOpen, 
  Sparkles, 
  Video, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Users, 
  ArrowLeft, 
  X, 
  Send,
  ShieldCheck,
  Phone,
  GraduationCap
} from 'lucide-react';
import { coursesPricing } from '@/data/pricing';

interface Course {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  status: 'available' | 'upcoming';
  statusText: string;
  statusBadge: string;
  targetAudience: string;
  format: string;
  duration: string;
  description: string;
  objectives: string[];
  bg: string;
  border: string;
  accentColor: string;
  image: string;
}

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [interestSubmitted, setInterestSubmitted] = useState(false);
  const [interestForm, setInterestForm] = useState({
    name: '',
    contact: '',
    notes: ''
  });

  const coursesCatalog: Course[] = [
    {
      id: 'rifq-journey',
      title: 'رحلة رِفق: الممارسات الوالدية الفعالة',
      subtitle: 'بناء علاقة سوية وواعية مع الأبناء والانتقال من الانفعال إلى التأثير الإيجابي',
      category: 'إرشاد والدي وتربوي',
      status: 'available',
      statusText: 'متاح للتسجيل الآن',
      statusBadge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      targetAudience: 'الآباء، الأمهات، والمعلمون المهتمون بتطوير أدوات التربية الإيجابية الحديثة.',
      format: 'لقاءات تفاعلية مباشرة عبر Google Meet + تسجيلات وتطبيقات عملية',
      duration: '4 أسابيع تدريبية مركزة (لقاء أسبوعي مباشر)',
      description: 'برنامج تطبيقي مكثف يهدف إلى تفكيك التوتر والعصبية في التعامل اليومي مع الأبناء، وفهم الدوافع النفسية الكامنة خلف عناد وسلوكيات الطفل، مع تزويد الوالدين بأدوات التربية بالرفق والحزم في آن واحد.',
      objectives: [
        'فهم الاحتياجات النفسية غير المشبعة التي تفجر السلوك المشكل',
        'اكتساب مهارات الحزم الهادئ دون صراخ أو تهديد',
        'بناء لغة حوار دافئة تُشعر الابن بالأمان والانتماء',
        'إدارة الانفعالات الشخصية للوالدين وتحقيق الاتزان المنزلي'
      ],
      bg: 'bg-[#EDF7F5] dark:bg-[#112924]',
      border: 'border-[#D6EEEA] dark:border-[#1F4A42]',
      accentColor: 'text-[#4E7E76]',
      image: '/assets/illustrations/course-rifq.svg'
    },
    {
      id: 'mithaq-program',
      title: 'برنامج ميثاق: الإعداد الزواجي الشامل',
      subtitle: 'تأهيل المقبلين على الزواج وحديثي الارتباط لبيوت مستقرة وقائمة على المودة',
      category: 'إرشاد زواجي وأسري',
      status: 'available',
      statusText: 'متاح للتسجيل الآن',
      statusBadge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      targetAudience: 'المقبلون والمقبلات على الزواج، المخطوبون، وحديثو الزواج في السنوات الأولى.',
      format: 'جلسات وورش عمل أونلاين تفاعلية عبر Google Meet',
      duration: '6 ورش عمل تدريبية وتطبيقية',
      description: 'دليل منهجي متكامل يدمج بين الفهم السيكولوجي العميق للشريك ومبادئ التأصيل الأسري من هدي القرآن، بهدف ردم فجوة التوقعات وبناء شراكة واقعية تصمد أمام تحديات الحياة.',
      objectives: [
        'استكشاف معايير التوافق النفسي والقيمي وإدارة التوقعات',
        'تفكيك أنماط الشخصية وطرق التعبير عن المشاعر والاحتياج',
        'اكتساب مهارات التفاوض وحل النزاعات الزوجية قبل تفاقمها',
        'بناء الحدود الصحية والتوازن مع الأسرة الممتدة'
      ],
      bg: 'bg-[#EDF5FD] dark:bg-[#122238]',
      border: 'border-[#D6E6F8] dark:border-[#1E3A5F]',
      accentColor: 'text-[#154F9C]',
      image: '/assets/illustrations/course-mithaq.svg'
    },
    {
      id: 'masaha-workshop',
      title: 'برنامج مساحة: الدعم النفسي وإدارة الضغوط',
      subtitle: 'ورش عمل تفاعلية لتطوير الصلابة النفسية ومواجهة الاحتراق الحياتي',
      category: 'تطوير ودعم نفسي',
      status: 'upcoming',
      statusText: 'قريباً (الدفعة القادمة)',
      statusBadge: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      targetAudience: 'الأفراد الباحثون عن استعادة التوازن، إدارة مشاعر القلق، والتعامل مع ضغوط العمل.',
      format: 'مجموعات دعم تفاعلية مصغرة أونلاين عبر Google Meet',
      duration: 'تُحدد وتُعلن مواعيد الدفعة الجديدة قريباً',
      description: 'مساحة إنسانية آمنة تركز على بناء الوعي بالذات وتفكيك الإجهاد العصبي، ومساعدة المشاركين على التحرر من الأفكار المشوهة واكتساب مناعة نفسية قوية.',
      objectives: [
        'رصد نوبات التوتر وتفكيك الأنماط الفكرية المقلقة',
        'تطوير المرونة النفسية والتعامل مع المشاعر غير المريحة',
        'ممارسات يومية للتهدئة واستعادة اليقظة الذهنية والاتزان'
      ],
      bg: 'bg-[#F4EFFC] dark:bg-[#241738]',
      border: 'border-[#E5D9F8] dark:border-[#3D2561]',
      accentColor: 'text-[#7C3AED]',
      image: '/assets/illustrations/course-masaha.svg'
    },
    {
      id: 'institutional-training',
      title: 'برامج التطوير التربوي والمؤسسي للمدارس',
      subtitle: 'حقائب تدريبية وتأهيلية للكوادر التعليمية والأقسام الإرشادية',
      category: 'تدريب مؤسسي ومدارس',
      status: 'available',
      statusText: 'متاح للتعاقد المؤسسي',
      statusBadge: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      targetAudience: 'إدارات المدارس، القيادات التربوية، المرشدون النفسيون والطلابيّون.',
      format: 'برامج حضورية أو أونلاين مصممة خصيصاً وفق احتياج المؤسسة',
      duration: 'حسب الخطة الاستشارية المتفق عليها',
      description: 'تصميم وتنفيذ برامج تدريبية متكاملة لتمكين المعلمين والمشرفين من إدارة الفصول الصعبة، وبناء سياسات حماية ورعاية المتعلمين، والارتقاء بالمناخ النفسي للمؤسسة.',
      objectives: [
        'تدريب الكادر على فك شفرات السلوك المشكل وتجنب الصدام',
        'بناء بروتوكولات التدخل الإرشادي والتحويل المهني الآمن',
        'تأهيل بيئة مدرسية تراعي الاحتياجات النفسية للمتعلمين'
      ],
      bg: 'bg-[#FEF9EC] dark:bg-[#2E2413]',
      border: 'border-[#FDF0CD] dark:border-[#4D3A1B]',
      accentColor: 'text-[#D97706]',
      image: '/assets/illustrations/course-schools.svg'
    }
  ];

  const handleInterestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInterestSubmitted(true);

    const message = `طلب تسجيل اهتمام في: ${selectedCourse?.title}%0Aالاسم: ${interestForm.name}%0Aرقم التواصل: ${interestForm.contact}%0Aملاحظات: ${interestForm.notes || 'لا يوجد'}`;
    const whatsappUrl = `https://wa.me/201014876666?text=${message}`;

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setTimeout(() => {
        setInterestSubmitted(false);
        setSelectedCourse(null);
        setInterestForm({ name: '', contact: '', notes: '' });
      }, 2500);
    }, 400);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFCFA] dark:bg-[#0D1117] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-12 pb-10 sm:pt-16 sm:pb-12 px-4 sm:px-6 text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDF7F5] dark:bg-[#112924] border border-[#D6EEEA] dark:border-[#1F4A42] text-xs font-bold text-[#4E7E76] dark:text-[#5E988E]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>كتالوج الكورسات والبرامج التدريبية المعتمدة</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          الكورسات والبرامج التدريبية
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          برامج تدريبية وتطبيقية مركزة تستند إلى الممارسة الميدانية والتأصيل المعرفي، لمساندتك في التربية والزواج والتطوير الذاتي.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Video className="w-4 h-4 text-[#4E7E76]" />
            <span>لقاءات تفاعلية أونلاين عبر Google Meet</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#154F9C]" />
            <span>مجموعات تدريبية مصغرة لضمان التفاعل</span>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-8 px-4 sm:px-6 max-w-6xl mx-auto w-full space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coursesCatalog.map((course) => (
            <div 
              key={course.id}
              className={`p-7 rounded-3xl border ${course.bg} ${course.border} flex flex-col justify-between space-y-6 shadow-2xs hover:shadow-md transition-all`}
            >
              <div className="space-y-4">
                
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    {course.category}
                  </span>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${course.statusBadge}`}>
                    {course.statusText}
                  </span>
                </div>

                {/* Course Illustration */}
                <div className="w-full h-40 flex items-center justify-center p-2 rounded-2xl bg-white/60 dark:bg-black/20">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    loading="lazy"
                    className="h-36 w-auto object-contain" 
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {course.subtitle}
                  </p>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  {course.description}
                </p>

                {/* Duration */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <Clock className="w-4 h-4 text-[#4E7E76]" />
                  <span>{course.duration}</span>
                </div>

                {/* Objectives */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">أبرز المحاور والمخرجات:</span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-normal">
                    {course.objectives.slice(0, 3).map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4E7E76] shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Action Button & Pricing */}
              <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-3">
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="w-full py-3 px-5 bg-white dark:bg-black/40 hover:bg-slate-50 dark:hover:bg-black/60 text-[#CC4E46] border border-[#CC4E46]/30 rounded-full text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs"
                >
                  <span>سجل اهتمامك / اطلب تفاصيل البرنامج</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>

                {coursesPricing[course.id] && (
                  <div className="text-center pt-0.5 space-y-0.5">
                    <span className="inline-block text-xs font-black text-slate-800 dark:text-slate-200">
                      رسوم البرنامج: {coursesPricing[course.id].priceDisplay}
                    </span>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                      {coursesPricing[course.id].note}
                    </span>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Registration Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#161F2B] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative text-right">
            
            <button 
              onClick={() => setSelectedCourse(null)}
              className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#4E7E76] uppercase">تسجيل الاهتمام ببرنامج تدريبي</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">{selectedCourse.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                سجل بياناتك وسيصلك ملف تفاصيل البرنامج والجدول الزمني عبر البريد الرسمي وواتساب.
              </p>
            </div>

            {interestSubmitted ? (
              <div className="p-5 rounded-2xl bg-[#EDF7F5] dark:bg-[#112924] border border-[#D6EEEA] dark:border-[#1F4A42] text-xs font-bold text-[#4E7E76] text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-[#4E7E76]" />
                <p>تم استلام طلبك بنجاح! جاري تحويلك إلى واتساب لتأكيد الاستلام...</p>
              </div>
            ) : (
              <form onSubmit={handleInterestSubmit} className="space-y-4 text-xs font-semibold">
                
                <div className="space-y-1.5">
                  <label className="text-slate-700 dark:text-slate-300">الاسم الكريم</label>
                  <input
                    type="text"
                    required
                    value={interestForm.name}
                    onChange={(e) => setInterestForm({...interestForm, name: e.target.value})}
                    placeholder="اكتب اسمك الثلاثي"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#4E7E76]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 dark:text-slate-300">رقم الهاتف أو واتساب (مع مفتاح الدولة)</label>
                  <input
                    type="tel"
                    required
                    value={interestForm.contact}
                    onChange={(e) => setInterestForm({...interestForm, contact: e.target.value})}
                    placeholder="+966xxxxxxxxx أو +20xxxxxxxxxx"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#4E7E76]"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 dark:text-slate-300">ملاحظات أو أسئلة إضافية (اختياري)</label>
                  <textarea
                    rows={2}
                    value={interestForm.notes}
                    onChange={(e) => setInterestForm({...interestForm, notes: e.target.value})}
                    placeholder="هل لديك أي استفسار حول البرنامج أو توقيته؟"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#4E7E76]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#CC4E46] hover:bg-[#B33D35] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-[#CC4E46]/20"
                >
                  <Send className="w-4 h-4" />
                  <span>تأكيد تسجيل الاهتمام</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
