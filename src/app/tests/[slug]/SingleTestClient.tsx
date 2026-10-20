'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TestItem } from '@/data/testsData';
import { getScaleInfo } from '@/data/scaleInfo';
import CrisisModal from '@/components/CrisisModal';
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
  Share2,
  BookOpen,
  Phone,
  Info
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
  const [showScaleDetails, setShowScaleDetails] = useState<boolean>(false);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState<boolean>(false);

  const scaleInfo = getScaleInfo(test.id, test.title, test.category);

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

  // Self-harm item detection: item 9 (index 8) for PHQ-9 depression
  const hasDepressionSelfHarmRisk = test.id === 'depression' && answers[8] !== undefined && answers[8] > 0;
  const isModerateOrHigh = percentage >= 34;

  const getResultDetails = () => {
    if (percentage < 34) {
      return test.scoreResults[0] || {
        title: 'مستوى طفيف أو طبيعي',
        text: 'المؤشرات تقع ضمن النطاق الطبيعي المعتاد في الحياة اليومية.',
        recommendation: 'حافظ على عاداتك الإيجابية وعزز وعيك الذاتي.'
      };
    } else if (percentage < 67) {
      return test.scoreResults[1] || {
        title: 'مستوى متوسط يستدعي الانتباه والدعم',
        text: 'توجد بعض الأعراض أو التحديات التي تؤثر نسبياً على جودة يومك واستقرارك النفسي.',
        recommendation: 'يُنصح بمراجعة العادات اليومية أو استشارة أخصائي نفسي مؤهل لتفكيك مصادر الضغط ووضع خطة مساندة.'
      };
    } else {
      return test.scoreResults[2] || {
        title: 'مستوى مرتفع يستدعي الرعاية المتخصصة',
        text: 'المؤشرات تشير إلى ضغوط أو أعراض واضحة قد تعيق الأداء اليومي والاتزان النفسي.',
        recommendation: 'يُوصى بحجز جلسة استشارية خاصة لمناقشة هذه الأعراض وبناء خطة دعم تلائم حالتك.'
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
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                {scaleInfo.code}: مقياس مستخدم عالمياً للفحص المبدئي
              </span>
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

          {/* About the Scale Info Card (عن المقياس والاعتماد العلمي) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#121924] border border-slate-200/70 dark:border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                <BookOpen className="w-4 h-4 text-[#4E7E76]" />
                <span>عن المقياس والمرجعية العلمية</span>
              </div>
              <button
                type="button"
                onClick={() => setShowScaleDetails(!showScaleDetails)}
                className="text-[11px] font-bold text-[#4E7E76] dark:text-[#5E988E] hover:underline"
              >
                {showScaleDetails ? 'إخفاء التفاصيل' : 'عرض التوثيق والبيانات ⭠'}
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <p>
                <strong>الاسم الرسمي:</strong> {scaleInfo.officialName}
              </p>
              <p>
                <strong>ما يقيسه:</strong> {scaleInfo.measures}
              </p>
            </div>

            {showScaleDetails && (
              <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 animate-fadeIn">
                <p>
                  <strong>جهة التطوير / الباحث:</strong> {scaleInfo.developer}
                </p>
                <p>
                  <strong>التوثيق والمرجع المعتمد:</strong> <code className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[10px]">{scaleInfo.citation}</code>
                </p>
                <p className="text-slate-400 dark:text-slate-500">
                  {scaleInfo.disclaimer}
                </p>
              </div>
            )}
          </div>
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
              
              {/* Critical Alert if Depression Self-Harm Item 9 is Positive (Rendered BEFORE Score) */}
              {hasDepressionSelfHarmRisk && (
                <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/70 border-2 border-rose-500 shadow-xl space-y-3 text-rose-950 dark:text-rose-100 text-right animate-pulse">
                  <div className="flex items-center gap-2 font-black text-base text-rose-600 dark:text-rose-400">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>تنبيه سلامة عاجل وهام: صحتك وسلامتك أولوية قصوى</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                    أشرت في إجاباتك على المقياس إلى وجود أفكار أو مشاعر ترتبط بإيذاء النفس. نرجو منك أن تعلم أنك لست وحدك، وأن هناك مساندة متخصصة ومجانية متاحة لك في هذه اللحظة.
                  </p>
                  <p className="text-xs text-rose-800 dark:text-rose-200">
                    جلسات موقعنا مخصصة للاستشارات المجدولة وليست خدمة طوارئ أو إنقاذ. يُرجى التوجه فوراً لأقرب قسم طوارئ في مستشفى أو التواصل مع خطوط المساعدة النفسية أدناه:
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCrisisModalOpen(true)}
                      className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition shadow-md flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>عرض أرقام خطوط الطوارئ والدعم النفسي المعتمدة ⭠</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Initial Screening Disclaimer Badge on Every Result */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs font-bold">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>هذه النتيجة فحص مبدئي وليست تشخيصاً طبياً</span>
                </div>
              </div>

              {/* Score Badge */}
              <div className="text-center space-y-2 py-2">
                <span className="text-xs font-bold text-slate-500">مؤشر الفحص المبدئي التقديري</span>
                <div className="text-4xl font-black text-[#4E7E76] dark:text-[#5E988E]">
                  {percentage}%
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {result.title}
                </h3>
              </div>

              {/* Sensitive Tests Emergency Warning Box (Required for Depression, Bipolar, Schizophrenia, PTSD) */}
              {isSensitive && !hasDepressionSelfHarmRisk && (
                <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 space-y-2 text-rose-900 dark:text-rose-200">
                  <div className="flex items-center gap-2 font-black text-xs sm:text-sm">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>تنبيه سلامة استرشادي</span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                    إذا كنت تشعر بضيق حاد لا يمكن تحمله أو أفكار مؤذية، تواصل فوراً مع أقرب مركز طوارئ في مدينتك.
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCrisisModalOpen(true)}
                      className="text-[11px] underline font-bold text-rose-700 dark:text-rose-300 hover:opacity-80"
                    >
                      أرقام خطوط الدعم والطوارئ المعتمدة ←
                    </button>
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
                  التوصية الاسترشادية:
                </strong>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {result.recommendation}
                </p>
              </div>

              {/* Gentle Recommendation Box for Moderate / High Scores */}
              {isModerateOrHigh && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-right">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                    <Info className="w-4 h-4 text-[#4E7E76]" />
                    <span>توصية لطيفة من فريق الاستشارات</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    تشير درجاتك إلى أنك قد تستفيد كثيراً من مساحة استماع آمنة ومتخصصة لمناقشة هذه الأعراض وتفكيك الضغوط. يمكنك حجز استشارة فردية مجدولة مع المستشار جلال أحمد لبناء خطة مساندة تناسبك.
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">في حالة الطوارئ النفسية الحادة:</span>
                    <button
                      type="button"
                      onClick={() => setIsCrisisModalOpen(true)}
                      className="text-rose-600 dark:text-rose-400 font-bold underline hover:opacity-80"
                    >
                      عرض أرقام الطوارئ والدعم النفسي ⭠
                    </button>
                  </div>
                </div>
              )}

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
            <span>تصفح كافة مقاييس الفحص المبدئي (41 مقياساً)</span>
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

      <CrisisModal isOpen={isCrisisModalOpen} onClose={() => setIsCrisisModalOpen(false)} />
    </div>
  );
}
