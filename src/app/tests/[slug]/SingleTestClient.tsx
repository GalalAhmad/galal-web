'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TestItem } from '@/data/testsData';
import { 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  RefreshCw, 
  Calendar, 
  ShieldAlert, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Share2
} from 'lucide-react';

interface Props {
  test: TestItem;
  toolBadge?: string;
  isSensitive?: boolean;
}

export default function SingleTestClient({ test, toolBadge, isSensitive }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);

  const handleSelectOption = (score: number) => {
    const updated = [...answers, score];
    setAnswers(updated);

    if (currentQuestionIndex + 1 < test.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
  };

  // Calculate score and result
  const totalScore = answers.reduce((a, b) => a + b, 0);
  const maxPossible = test.questions.length * 3;
  const percentage = Math.round((totalScore / Math.max(1, maxPossible)) * 100);

  const getResultDetails = () => {
    if (percentage < 34) {
      return test.scoreResults[0] || {
        title: 'مستوى طفيف أو طبيعي',
        text: 'المؤشرات تقع ضمن النطاق الطبيعي المعتاد في الحياة اليومية.',
        recommendation: 'حافظ على عاداتك الإيجابية وعزز وعيك الذاتي.'
      };
    } else if (percentage < 67) {
      return test.scoreResults[1] || {
        title: 'مستوى متوسط يستدعي الانتباه',
        text: 'توجد بعض الأعراض أو التحديات التي تؤثر نسبياً على جودة يومك.',
        recommendation: 'يُنصح بمراجعة العادات اليومية أو استشارة مرشد نفسي لتفكيك الضغوط.'
      };
    } else {
      return test.scoreResults[2] || {
        title: 'مستوى مرتفع يستدعي الرعاية',
        text: 'المؤشرات تشير إلى ضغوط أو أعراض واضحة قد تعيق الأداء والاستقرار النفسي.',
        recommendation: 'يُوصى بشدة بطلب استشارة متخصصة لتقديم خطة دعم ملائمة.'
      };
    }
  };

  const result = getResultDetails();
  const currentQuestion = test.questions[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex + (showResult ? 1 : 0)) / test.questions.length) * 100);

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 flex-1">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Test Header */}
        <div className="space-y-4 text-right">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EDF7F5] dark:bg-[#112924] text-[#4E7E76] dark:text-[#5E988E]">
                {test.category}
              </span>
              {toolBadge && (
                <span className="text-xs font-black px-3 py-1 rounded-full bg-[#FEF9EC] dark:bg-[#2E2413] text-[#D97706] dark:text-[#F59E0B] border border-[#FDF0CD] dark:border-[#4D3A1B]">
                  الأداة: {toolBadge}
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{test.duration}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
            {test.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {test.desc}
          </p>
        </div>

        {/* Main Interactive Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 shadow-md text-right space-y-6">

          {!showResult ? (
            /* Questions View */
            <div className="space-y-6">
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>السؤال {currentQuestionIndex + 1} من {test.questions.length}</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-[#4E7E76] to-[#68a096] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="py-4">
                <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
                  {currentQuestion?.text}
                </h2>
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion?.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt.score)}
                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#4E7E76] hover:bg-[#EDF7F5]/50 dark:hover:bg-[#112924]/40 text-right text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
                  >
                    <span>{opt.label}</span>
                    <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 group-hover:border-[#4E7E76] group-hover:bg-[#4E7E76] transition-colors flex items-center justify-center shrink-0">
                      <span className="w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </button>
                ))}
              </div>

              {/* Required Non-Medical Disclaimer directly above result trigger */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>تنبيه استرشادي:</strong> نتائج هذا المقياس مخصصة للتوعية والفهم الاسترشادي الذاتي، ولا تُعد تشخيصاً طبياً أو عيادياً بديلاً عن استشارة الطبيب أو الأخصائي النفسي المؤهل.
                </span>
              </div>

            </div>
          ) : (
            /* Results View */
            <div className="space-y-6 animate-fadeIn">
              
              {/* Score Badge */}
              <div className="text-center space-y-2 py-2">
                <span className="text-xs font-bold text-slate-500">النتيجة الاسترشادية التقديرية</span>
                <div className="text-4xl font-black text-[#4E7E76] dark:text-[#5E988E]">
                  {percentage}%
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {result.title}
                </h3>
              </div>

              {/* Sensitive Tests Emergency Warning Box (Required for Depression, Bipolar, Schizophrenia, PTSD) */}
              {isSensitive && (
                <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 space-y-2 text-rose-900 dark:text-rose-200">
                  <div className="flex items-center gap-2 font-black text-xs sm:text-sm">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>تنبيه سلامة عاجل وهام</span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                    إذا كنت تفكر في إيذاء نفسك أو كنت في خطر، تواصل فوراً مع أقرب مركز طوارئ أو اتصل بأرقام الطوارئ في بلدك.
                  </p>
                  <div className="pt-1 text-[11px]">
                    <Link href="/policies" className="underline font-bold hover:text-rose-700">
                      راجع إرشادات الطوارئ وسياسة الدعم في صفحة السياسات ←
                    </Link>
                  </div>
                </div>
              )}

              {/* Analysis Text */}
              <div className="p-5 rounded-2xl bg-[#EDF7F5]/50 dark:bg-[#112924]/30 border border-[#D6EEEA] dark:border-[#1F4A42] space-y-2 text-right">
                <strong className="block text-xs font-black text-[#4E7E76] dark:text-[#5E988E]">
                  القراءة التحليلية للمؤشرات:
                </strong>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {result.text}
                </p>
              </div>

              {/* Recommendation Box */}
              <div className="p-5 rounded-2xl bg-[#FEF9EC] dark:bg-[#2E2413]/40 border border-[#FDF0CD] dark:border-[#4D3A1B] space-y-2 text-right">
                <strong className="block text-xs font-black text-[#D97706] dark:text-[#F59E0B]">
                  التوصية المقترحة:
                </strong>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {result.recommendation}
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/services#book"
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[#CC4E46] hover:bg-[#B33D35] text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-[#CC4E46]/20 text-center"
                >
                  <Calendar className="w-4 h-4" />
                  <span>احجز جلسة استشارية لمناقشة التقييم</span>
                </Link>

                <button
                  onClick={handleRestart}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>إعادة المقياس</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-4 text-xs font-bold text-slate-500">
          <Link
            href="/tests"
            className="inline-flex items-center gap-1.5 text-[#4E7E76] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>تصفح كافة المقاييس الـ 41 المعتمدة</span>
          </Link>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${test.title} - منصة استشارات جلال أحمد\nhttps://galalahmad.com/tests/${test.id}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-[#4E7E76] transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>مشاركة المقياس</span>
          </a>
        </div>

      </div>
    </div>
  );
}
