import React from 'react';
import { Award, BookCheck, School, Users2 } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 bg-white border-b border-slate-100">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        
        {/* الصورة الشخصية الرسمية */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm">
            <div className="rounded-3xl overflow-hidden bg-slate-100 shadow-md border border-slate-200/80">
              <img 
                src="/assets/dr-galal-portrait.jpg" 
                alt="د. جلال أحمد" 
                className="w-full h-80 sm:h-96 object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-4 -left-2 bg-brand-800 text-white p-4 rounded-2xl shadow-lg text-right max-w-[220px]">
              <div className="text-xs font-bold text-amber-300">مركز إنسان</div>
              <div className="text-[11px] text-slate-200 mt-0.5 leading-snug">
                مؤسس ومدير مركز إنسان للتدريب والاستشارات
              </div>
            </div>
          </div>
        </div>

        {/* السيرة والفلسفة */}
        <div className="md:col-span-7 space-y-6 text-right">
          <div className="space-y-2">
            <span className="text-xs font-bold text-sage-600 uppercase tracking-wider">
              المسيرة والخبرة
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-800">
              الجمع بين الرؤية النفسية والخبرة الميدانية الواقعية
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            أنا <strong>د. جلال أحمد</strong>، استشاري صحة نفسية وتربوية، ومتخصص في الإرشاد الأسري والزواجي والعلاج النفسي وإرشاد المراهقين. أجمع في عملي بين أكثر من <strong>17 عاماً من الخبرة العملية الميدانية في إدارة المدارس والمؤسسات التعليمية</strong>، والتأهيل الأكاديمي والعيادي في علم النفس التربوي.
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            فلسفتي تقوم على أن <em>«السلوك رسالة تفصح عما يحتاجه الإنسان»</em>، وأن البناء والوقاية يسبقان العلاج. هدفي دائماً ليس الاكتفاء بالمحاضرات النظرية، بل تحويل المعرفة إلى أدوات وكراسات عمل واقعية تعين الفرد والأسرة والمدرسة على إحداث نمو مستدام.
          </p>

          {/* بطاقات المؤهلات الموثقة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            
            <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-slate-200 flex items-start gap-3">
              <BookCheck className="w-5 h-5 text-brand-800 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-800">ماجستير علم النفس التربوي</div>
                <div className="text-[11px] text-slate-500">ودراسات تمهيدي الدكتوراه (2020)</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-slate-200 flex items-start gap-3">
              <Award className="w-5 h-5 text-brand-800 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-800">تصنيف الهيئة السعودية للتخصصات</div>
                <div className="text-[11px] text-slate-500">أخصائي مساعد علم نفس (2025)</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-slate-200 flex items-start gap-3">
              <School className="w-5 h-5 text-brand-800 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-800">17+ عاماً قيادة مدرسية</div>
                <div className="text-[11px] text-slate-500">إدارة كبرى المدارس وتدريب المعلمين</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-slate-200 flex items-start gap-3">
              <Users2 className="w-5 h-5 text-brand-800 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-800">دبلومات مهنية متخصصة</div>
                <div className="text-[11px] text-slate-500">إرشاد زواجي، إدارة مدرسية، تربية خاصة</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
