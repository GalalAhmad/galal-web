'use client';

import React from 'react';
import { Star, Quote, CheckCircle2, HeartHandshake, ShieldCheck } from 'lucide-react';

const testimonials = [
  {
    name: 'أبو عبد الرحمن وزوجته',
    type: 'برنامج «مِيثاق» لترميم العلاقات الزوجية',
    region: 'استشارة أونلاين — الأردن',
    content: 'كنا نعيش في دوامة صمت عقابي مستمرة لشهور، وأي حوار كان ينتهي بانفجار أو اتهامات متبادلة. جلسات الأستاذ جلال وضعت أيدينا بدقة على فقه التوقعات وأصل المشكلة، وساعدتنا على كسر حلقة الدفاعية واستعادة السكينة والحديث الهادئ داخل بيتنا.',
    date: 'منذ شهرين'
  },
  {
    name: 'سارة م. وخطيبها',
    type: 'برنامج «رحلة رِفق» للمقبلين على الزواج',
    region: 'استشارة أونلاين — مصر',
    content: 'أعظم ما خرجنا به من رحلة رفق هو تفكيك الخيالات الوردية غير الواقعية. تعلمنا كيف نناقش المسائل المالية وعلاقة الأهل والحدود بوضوح واحترام قبل الدخول، دون خجل أو افتراضات خاطئة. كراسة العمل كانت مرجعاً ثميناً جداً لبداية واعية.',
    date: 'منذ 3 أسابيع'
  },
  {
    name: 'م. خالد ع.',
    type: 'استشارة فردية وبصيرة الذات',
    region: 'استشارة أونلاين — السعودية',
    content: 'كنت أعيش تحت وطأة جلد الذات الدائم وضغوط العمل، وأتحرك بردود أفعال عفوية تضر بعلاقاتي. فلسفة «لستَ مشكلتك.. والذات أرحب من العارض» غيرت تماماً كيفية تعاملي مع انفعالاتي. شكراً من القلب على هذا العمق والرفق في التوجيه.',
    date: 'منذ شهر'
  },
  {
    name: 'أم ياسين (ولية أمر يافع 15 عاماً)',
    type: 'إرشاد تربوي وسلوكي لمرحلة المراهقة',
    region: 'استشارة أونلاين — الإمارات',
    content: 'العناد والصراخ اليومي كانا العنوان الأبرز لعلاقتي مع ابني المراهق. توجيه الأستاذ جلال نحو «العلاقة أولاً قبل الطلب» و«السلوك رسالة قبل أن يكون مشكلة» غيّر كل شيء. حين توقفتُ عن المحاسبة وبدأتُ بالإنصات، عاد ابني للحديث معي وأصبح أكثر مسؤولية.',
    date: 'منذ أسبوعين'
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 bg-[#0D1117] dark:bg-[#0D1117] bg-[#F8FAFC] border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 transition-colors">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* ترويسة القسم */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 dark:bg-slate-800/60 bg-white border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs font-bold text-accent-500 shadow-xs">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>أصداء من رحلة الوعي</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-100 dark:text-slate-100 text-slate-900 tracking-tight">
            تجارب وآراء المستفيدين
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
            شهادات حقيقية من أفراد وأزواج وأولياء أمور خاضوا جلسات الاستشارة والبرامج التفاعلية (مع الالتزام التام بالسرية والخصوصية).
          </p>
        </div>

        {/* شبكة البطاقات الأربعة المتماثلة هندسياً (Strict Symmetry) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="h-full flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 hover:border-slate-700 dark:hover:border-slate-700 hover:border-slate-300 transition-all shadow-sm hover:shadow-md text-right group"
            >
              <div className="space-y-4">
                
                {/* Header with Rating & Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-accent-500/40" />
                </div>

                <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-700 leading-relaxed font-normal min-h-[110px]">
                  «{t.content}»
                </p>

              </div>

              {/* Author & Verification */}
              <div className="pt-4 border-t border-slate-800/60 dark:border-slate-800/60 border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                    {t.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>مستفيد موثق</span>
                  </div>
                </div>

                <div className="text-[11px] text-accent-500 font-medium">
                  {t.type}
                </div>
                <div className="text-[10px] text-slate-500">
                  {t.region}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
