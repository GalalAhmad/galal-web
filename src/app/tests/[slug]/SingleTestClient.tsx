'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TestItem } from '@/data/testsData';
import { SCIENTIFIC_TESTS_METADATA } from '@/data/scientificTestsMetadata';
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
  Award,
  Brain,
  BookOpen,
  Users,
  ShieldCheck,
  Check,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Props {
  test: TestItem;
  toolBadge?: string;
  isSensitive?: boolean;
}

export default function SingleTestClient({ test, toolBadge, isSensitive }: Props) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [savingResult, setSavingResult] = useState<boolean>(false);

  const meta = SCIENTIFIC_TESTS_METADATA[test.id];

  const saveResult = async (score: number, pct: number, interpretation: any) => {
    if (!user?.name) return;
    setSavingResult(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone || '',
          email: user.email || '',
          provider: user.provider || 'credentials',
          testResult: {
            testId: test.id,
            testTitle: test.title,
            score,
            scorePercent: pct,
            level: interpretation.title || interpretation.level,
            desc: interpretation.text || interpretation.desc,
            recommendation: interpretation.recommendation || interpretation.rec,
          },
        }),
      });

      if (res.ok) {
        setIsSaved(true);
      }
    } catch (e) {
      console.error('Error saving test result:', e);
    } finally {
      setSavingResult(false);
    }
  };

  const handleSelectOption = (score: number) => {
    const updated = [...answers, score];
    setAnswers(updated);

    if (currentQuestionIndex + 1 < test.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResult(true);
      const total = updated.reduce((a, b) => a + b, 0);
      const maxPossible = test.questions.length * 3;
      const pct = Math.round((total / Math.max(1, maxPossible)) * 100);
      const res = getResultDetails(pct);
      saveResult(total, pct, res);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
    setIsSaved(false);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Calculate score and result
  const totalScore = answers.reduce((a, b) => a + b, 0);
  const maxPossible = test.questions.length * 3;
  const percentage = Math.round((totalScore / Math.max(1, maxPossible)) * 100);

  const getResultDetails = (pctOverride?: number) => {
    const pct = pctOverride !== undefined ? pctOverride : percentage;
    if (pct < 34) {
      return test.scoreResults[0] || {
        title: 'مستوى طفيف أو طبيعي',
        text: 'المؤشرات تقع ضمن النطاق الطبيعي المعتاد في الحياة اليومية.',
        recommendation: 'حافظ على عاداتك الإيجابية وعزز وعيك الذاتي.'
      };
    } else if (pct < 67) {
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
    <div className="py-8 sm:py-14 px-4 sm:px-6 flex-1 text-right">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Top Breadcrumb & User Tag */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <Link
            href="/tests"
            className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-[#4E7E76] transition"
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-0" />
            <span>العودة لجميع المقاييس</span>
          </Link>

          {user?.name && (
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
              المستفيد: {user.name}
            </span>
          )}
        </div>

        {/* Test Card Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#4E7E76]/10 text-[#4E7E76] dark:text-[#5E988E]">
              {test.category}
            </span>

            {toolBadge && (
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {toolBadge}
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
            {test.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {test.desc}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#4E7E76]" />
              <span>الوقت المتوقع: {test.duration}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-[#4E7E76]" />
              <span>عدد الأسئلة: {test.questions.length} أسئلة</span>
            </span>
          </div>

          {/* Scientific & Ethical Disclaimer Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200 leading-relaxed flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="block font-bold">تنبيه علمي وأخلاقي هام:</strong>
              <p className="text-[11px] opacity-90">
                هذا المقياس أداة فحص واستكشاف ذاتي للمتابعة ورفع الوعي، ولا يُعد بديلاً عن التقييم الإكلينيكي الشامل أو تشخيصاً طبياً نهائياً. إذا كانت لديك مشاعر ضاغطة أو أزمة ملحة، ننصح دائماً بالتحدث إلى مختص معتمد.
              </p>
            </div>
          </div>
        </div>

        {/* AUTH GUARD: If user is not logged in, prompt them to login to take test & save result */}
        {!user?.name ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0E1524] border-2 border-amber-200 dark:border-amber-900/60 shadow-lg text-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                تسجيل الدخول مطلوب لإجراء المقياس
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                لحفظ وتوثيق نتائج المقياس، ومتابعة قراءتك التحليلية وتوصيات المستشار ضمن ملفك الاستشاري الشخصي، يرجى تسجيل الدخول أو إنشاء حساب جديد.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#4E7E76] hover:bg-[#3D645E] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-[#4E7E76]/20"
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول للبدء</span>
              </Link>
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>حساب جديد في ثوانٍ</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Main Test Area for Logged-In User */
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">

            {!showResult ? (
              /* Questions View */
              <div className="space-y-6">
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#4E7E76] dark:text-[#5E988E]">
                      السؤال {currentQuestionIndex + 1} من {test.questions.length}
                    </span>
                    <span className="text-slate-400 font-mono">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-[#4E7E76] dark:bg-[#5E988E] transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Question Text */}
                <div className="py-2">
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
                      className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#4E7E76] hover:bg-[#4E7E76]/5 dark:hover:bg-[#4E7E76]/10 text-right text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
                    >
                      <span>{opt.label}</span>
                      <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 group-hover:border-[#4E7E76] group-hover:bg-[#4E7E76] transition-colors flex items-center justify-center shrink-0">
                        <span className="w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </button>
                  ))}
                </div>

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

                {/* Sensitive Tests Emergency Warning Box */}
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
                <div className="p-5 rounded-2xl bg-[#EDF5FD] dark:bg-[#122238] border border-[#D6E6F8] dark:border-[#1E3A5F] space-y-2 text-right">
                  <strong className="block text-xs font-black text-[#154F9C] dark:text-[#60A5FA]">
                    القراءة التحليلية للمؤشرات:
                  </strong>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {result.text}
                  </p>
                </div>

                {/* Recommendation Box */}
                <div className="p-5 rounded-2xl bg-[#FEF9EC] dark:bg-[#2E2413]/40 border border-[#FDF0CD] dark:border-[#4D3A1B] space-y-2 text-right">
                  <strong className="block text-xs font-black text-[#D97706] dark:text-[#F59E0B]">
                    التوجيه الاستشاري المقترح:
                  </strong>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {result.recommendation}
                  </p>
                </div>

                {/* Saved to Profile Notice */}
                {savingResult ? (
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري حفظ وتوثيق النتيجة في ملفك الشخصي...</span>
                  </div>
                ) : isSaved ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>تم حفظ نتيجتك بنجاح في ملفك الشخصي ({user.name})</span>
                    </div>
                    <Link href="/profile" className="font-bold underline hover:text-emerald-900 dark:hover:text-emerald-100">
                      عرض ملفي ←
                    </Link>
                  </div>
                ) : null}

                {/* Crisis & Safety Helpline Banner */}
                <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-3 text-right">
                  <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="block font-black text-rose-900 dark:text-rose-200">
                      مسار الأمان والاستجابة السريعة:
                    </strong>
                    <p className="text-[11px] leading-relaxed">
                      إذا كنت تشعر بضيق حاد، أو تراودك أفكار لإيذاء نفسك أو التخلص من الحياة، فلست وحدك. يرجى التوجه فوراً لأقرب طوارئ صحية أو التواصل مع الخطوط الساخنة المعتمدة للدعم النفسي في بلدك (مصر: 16328 • السعودية: 920033360 • أو الاتصال برقم الطوارئ المحلي).
                    </p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href="/booking"
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
        )}

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-4 text-xs font-bold text-slate-500">
          <Link
            href="/tests"
            className="inline-flex items-center gap-1.5 text-[#4E7E76] dark:text-[#5E988E] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>تصفح كافة المقاييس الـ 41 المعتمدة</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-[#4E7E76] transition cursor-pointer"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{isCopied ? 'تم نسخ الرابط' : 'مشاركة المقياس'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
