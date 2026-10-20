'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, CheckCircle2, RotateCcw, ArrowLeft, ShieldCheck, Calendar, Sparkles } from 'lucide-react';

interface Question {
  text: string;
  options: { text: string; score: number }[];
}

const questions: Question[] = [
  {
    text: 'عند مواجهة ضغط مفاجئ أو ظرف غير متوقع في العمل أو الأسرة، كيف تكون ردة فعلك الأولى؟',
    options: [
      { text: 'أتوقف للحظة، أتنفس بعمق، وأفكر في الحلول الممكنة بهدوء', score: 3 },
      { text: 'أشعر بتوتر وانزعاج أولي، ثم أحاول تدارك الموقف بعد فترة قصيرة', score: 2 },
      { text: 'أنفعل مباشرة بردود فعل حادة أو أنعزل وأشعر بالعجز والضغط الشديد', score: 1 },
    ],
  },
  {
    text: 'ما مدى قدرتك على فصل ضغوط العمل والتحديات الخارجية عن علاقاتك الأسرية والشخصية؟',
    options: [
      { text: 'أنجح غالباً في وضع حدود واضحة وأحافظ على هدوء منزلي', score: 3 },
      { text: 'تتسرب بعض الضغوط أحياناً وتؤثر على صبري مع من حولي', score: 2 },
      { text: 'أفرغ ضغوطي اليومية دون قصد في بيتي وعلى المقربين مني', score: 1 },
    ],
  },
  {
    text: 'عندما تلاحظ تغيراً سلبياً في سلوكك أو مشاعرك (كالعصبية أو الإرهاق)، كيف تتعامل مع ذاتك؟',
    options: [
      { text: 'أتعامل برفق ووعي وأتساءل: «ما الرسالة التي يحاول هذا العارض إخباري بها؟»', score: 3 },
      { text: 'أحاول تجاهل الشعور والاستمرار في مهامي اليومية حتى يزول', score: 2 },
      { text: 'أدخل في دوامة لوم وجلد للذات والشعور بالتقصير المستمر', score: 1 },
    ],
  },
  {
    text: 'كيف تصف جودة نومك وقدرتك على تصفية ذهنك قبل النوم؟',
    options: [
      { text: 'نوم هادئ ومريح وأستيقظ بطاقة جيدة في أغلب الأيام', score: 3 },
      { text: 'أواجه صعوبة في الاسترخاء وأفكر في الالتزامات لبعض الوقت', score: 2 },
      { text: 'أرق متكرر أو تفكير مفرط ومقلق يمنعني من الراحة والسكينة', score: 1 },
    ],
  },
  {
    text: 'ما مدى وضوح أهدافك ورؤيتك لحياتك وقدرتك على قول «لا» لما يستنزفك؟',
    options: [
      { text: 'واضحة جداً؛ أضع حدوداً صحية وأعرف أولوياتي النفسية والعملية', score: 3 },
      { text: 'أجد صعوبة في الرفض أحياناً على حساب راحتي الشخصية', score: 2 },
      { text: 'أشعر بالاستنزاف والاحتراق التام لإرضاء الآخرين وإهمال نفسي', score: 1 },
    ],
  },
];

export default function SelfAssessmentLeadMagnet() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectOption = (score: number) => {
    const nextAnswers = [...answers, score];
    setAnswers(nextAnswers);

    if (currentStep + 1 < questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setIsCompleted(false);
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);

  const getResult = () => {
    if (totalScore >= 13) {
      return {
        title: 'مستوى اتزان ممتاز وصلابة نفسية جيدة',
        color: 'text-[#4E7E76] dark:text-[#5E988E]',
        badgeBg: 'bg-[#EDF7F5] dark:bg-[#112924] border-[#D6EEEA] dark:border-[#1F4A42]',
        summary: 'تمتلك وعياً ذاتياً متقدماً وأدوات جيدة لإدارة الانفعالات وضغوط الحياة اليومية.',
        advice: 'حافظ على مساحات تأملك الشخصية واستمر في بناء الاتزان الفطري عبر التطوير المستمر.',
      };
    } else if (totalScore >= 9) {
      return {
        title: 'اتزان معتدل مع وجود إشارات إجهاد أو استنزاف',
        color: 'text-[#D97706] dark:text-[#F59E0B]',
        badgeBg: 'bg-[#FEF9EC] dark:bg-[#2E2413] border-[#FDF0CD] dark:border-[#4D3A1B]',
        summary: 'أنت تدير أمورك بشكل عام، لكن تراكم الأعباء وبدء تسرب التوتر للعلاقات يتطلب وقفة وعي وترتيباً للأولويات.',
        advice: 'جلسة استشارية واحدة قد تمنحك الوضوح اللازم لإعادة ضبط حدودك واستعادة صفاء ذهنك دون انتظار تفاقم الضغوط.',
      };
    } else {
      return {
        title: 'حاجة ماسة لمساحة استماع آمنة وإعادة بناء الاتزان',
        color: 'text-[#CC4E46] dark:text-[#F87171]',
        badgeBg: 'bg-[#FDF1EE] dark:bg-[#251816] border-[#F8DDD9] dark:border-[#42221E]',
        summary: 'تشير إجاباتك إلى مؤشرات احتراق وإرهاق نفسي عالي يستنزف طاقتك اليومية ويثقل علاقاتك وصحتك العامة.',
        advice: 'تذكر أن «السلوك رسالة قبل أن يكون مشكلة»؛ أنت لست وحدك، والحديث مع مستشار مختص سيساعدك على تفكيك هذه الدوامة بأمان.',
      };
    }
  };

  const result = getResult();

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#EDF7F5]/30 dark:bg-[#112924]/10 border-y border-slate-200/70 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#161F2B] border border-slate-200 dark:border-slate-800 text-xs font-bold text-[#4E7E76] dark:text-[#5E988E] shadow-2xs">
            <Compass className="w-3.5 h-3.5" />
            <span>مقياس ذاتي استرشادي (دقيقتان فقط)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            مقياس الاتزان النفسي وإدارة الضغوط
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            أجب بصدق عن 5 أسئلة سريعة لاكتشاف مستوى صلابتك النفسية وكيفية تعاملك مع الضغوط اليومية، مع توصية إرشادية فورية.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm text-right">
          
          {!isCompleted ? (
            <div className="space-y-8">
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>السؤال {currentStep + 1} من {questions.length}</span>
                  <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-[#4E7E76] transition-all duration-300 rounded-full"
                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 leading-snug">
                  {questions[currentStep].text}
                </h3>

                {/* Options */}
                <div className="space-y-3 pt-2">
                  {questions[currentStep].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(opt.score)}
                      className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#4E7E76] dark:hover:border-[#5E988E] hover:bg-[#EDF7F5]/50 dark:hover:bg-[#112924]/50 transition-all text-right text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between group cursor-pointer"
                    >
                      <span>{opt.text}</span>
                      <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-[#4E7E76] transition-transform group-hover:-translate-x-1 shrink-0 mr-3" />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Result Screen */
            <div className="space-y-8 text-center sm:text-right">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black border mb-2 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#4E7E76]" />
                    <span className={result.color}>{result.title}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                    نتيجة مقياسك الذاتي
                  </h3>
                </div>

                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة المقياس</span>
                </button>
              </div>

              {/* Summary and Advice */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-black/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  <strong className="block text-slate-900 dark:text-slate-100 font-bold mb-1">القراءة التحليلية:</strong>
                  {result.summary}
                </div>

                <div className="p-5 rounded-2xl bg-[#EDF7F5]/60 dark:bg-[#112924]/40 border border-[#D6EEEA] dark:border-[#1F4A42] text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  <strong className="block text-[#4E7E76] dark:text-[#5E988E] font-bold mb-1">التوصية الإرشادية:</strong>
                  {result.advice}
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div className="text-right text-[11px] text-slate-500">
                  <span>ترغب في فهم أعمق وتطبيق عملي لأدوات الاتزان؟</span>
                </div>

                <Link
                  href="/services#book"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#CC4E46] hover:bg-[#B33D35] text-white text-xs font-bold transition shadow-md shadow-[#CC4E46]/20"
                >
                  <Calendar className="w-4 h-4" />
                  <span>احجز جلسة لمناقشة نتيجتك مع المستشار</span>
                </Link>
              </div>

            </div>
          )}

          {/* Privacy & Legal Disclaimer */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4E7E76] shrink-0" />
              <span>خصوصية تامة 100%: الإجابات تُعالج لحظياً على متصفحك فقط ولا يتم حفظها أو مشاركتها مع أي جهة. هذا المقياس أداة استرشادية لرفع الوعي وليس تشخيصاً طبياً.</span>
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
