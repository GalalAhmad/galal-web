import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        
        {/* الصورة الشخصية وشارة التوفر */}
        <div className="relative inline-block">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden mx-auto shadow-lg border-4 border-white bg-slate-100">
            <img 
              src="/assets/dr-galal-speaking.jpg" 
              alt="د. جلال أحمد" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 right-2 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold rounded-full shadow-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>متاح للاستشارات</span>
          </div>
        </div>

        {/* النص التعريفي المركزي */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sage-50 text-sage-600 border border-sage-100 text-xs font-bold rounded-full">
            <span>🌱</span>
            <span>استشارات نفسية وتربوية وفق الفطرة ورؤية الوحي</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-brand-800 tracking-tight leading-tight sm:leading-snug">
            السلوك رسالة قبل أن يكون مشكلة.. والوعي بداية التغيير.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            مساحة استشارية وتربوية متخصصة يديرها <strong className="text-brand-800">د. جلال أحمد</strong>، تجمع بين عمق التأهيل الأكاديمي في علم النفس وخبرة ميدانية تمتد لأكثر من 17 عاماً في القيادة التعليمية وإدارة مركز إنسان، لمساعدتك وأسرتك على الانتقال <span className="text-brand-800 font-bold">من ردود الفعل إلى الوعي والمسؤولية والنمو</span>.
          </p>
        </div>

        {/* أزرار الإجراء السريع */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="#booking"
            className="px-8 py-3.5 bg-brand-800 text-white text-xs sm:text-sm font-bold rounded-full hover:bg-black transition shadow-md flex items-center gap-2"
          >
            <span>طلب موعد استشاري</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link
            href="#tracks"
            className="px-7 py-3.5 bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-full hover:bg-slate-50 transition shadow-xs"
          >
            استكشف المسارات الثلاثة ↓
          </Link>
        </div>

        {/* بطاقات الإثبات الموثقة (بدون مبالغة) */}
        <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto border-t border-slate-200/60 text-right">
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
            <div className="text-xl font-black text-brand-800">17+ عاماً</div>
            <div className="text-xs text-slate-500 mt-1">خبرة قيادية وتربوية ميدانية</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
            <div className="text-xl font-black text-brand-800">ماجستير</div>
            <div className="text-xs text-slate-500 mt-1">علم النفس التربوي والعيادي</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
            <div className="text-xl font-black text-brand-800">تصنيف رسمي</div>
            <div className="text-xs text-slate-500 mt-1">الهيئة السعودية للتخصصات (2025)</div>
          </div>
        </div>

      </div>
    </section>
  );
}
