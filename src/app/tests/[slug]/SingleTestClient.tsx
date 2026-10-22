'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  X
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
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // User Authentication State
  const [userSession, setUserSession] = useState<{ name: string; phone?: string; email?: string; provider?: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [quickName, setQuickName] = useState('');
  const [quickContact, setQuickContact] = useState('');

  const meta = SCIENTIFIC_TESTS_METADATA[test.id];

  useEffect(() => {
    try {
      const saved = localStorage.getItem('galal_user_session');
      if (saved) {
        setUserSession(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const saveResult = async (score: number, pct: number, interpretation: any) => {
    if (!userSession) return;
    try {
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userSession.name,
          phone: userSession.phone,
          email: userSession.email,
          provider: userSession.provider,
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
    } catch (e) {
      console.error(e);
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
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSocialLogin = (provider: 'google' | 'apple' | 'facebook') => {
    const providerTitles: Record<string, string> = {
      google: 'Google',
      apple: 'Apple ID',
      facebook: 'Facebook'
    };
    const enteredName = prompt(`يرجى كتابة اسمك الكريم لتسجيل الدخول بحساب ${providerTitles[provider]}:`);
    if (!enteredName || !enteredName.trim()) return;

    const enteredContact = prompt('رقم هاتفك أو بريدك الإلكتروني لحفظ النتيجة في ملفك الشخصي:') || '';

    const defaultUser = {
      name: enteredName.trim(),
      email: enteredContact.includes('@') ? enteredContact.trim() : `${enteredName.trim()}@${provider}.user`,
      phone: !enteredContact.includes('@') ? enteredContact.trim() : '',
      provider,
    };
    setUserSession(defaultUser);
    try {
      localStorage.setItem('galal_user_session', JSON.stringify(defaultUser));
    } catch (e) {}
    setShowAuthModal(false);

    if (showResult) {
      const total = answers.reduce((a, b) => a + b, 0);
      const maxPossible = test.questions.length * 3;
      const pct = Math.round((total / Math.max(1, maxPossible)) * 100);
      saveResult(total, pct, getResultDetails(pct));
    }
  };

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;
    const user = {
      name: quickName.trim(),
      phone: quickContact.trim() || '',
      email: quickContact.includes('@') ? quickContact.trim() : '',
      provider: 'phone_quick',
    };
    setUserSession(user);
    try {
      localStorage.setItem('galal_user_session', JSON.stringify(user));
    } catch (e) {}
    setShowAuthModal(false);

    if (showResult) {
      const total = answers.reduce((a, b) => a + b, 0);
      const maxPossible = test.questions.length * 3;
      const pct = Math.round((total / Math.max(1, maxPossible)) * 100);
      saveResult(total, pct, getResultDetails(pct));
    }
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
            className="inline-flex items-center gap-1.5 text-[#154F9C] dark:text-[#60A5FA] hover:underline"
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-0" />
            <span>العودة إلى مكتبة المقاييس</span>
          </Link>

          {userSession ? (
            <Link href="/profile" className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 hover:underline">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ملفك متصل: {userSession.name}</span>
            </Link>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-[#4E7E76] dark:text-[#5E988E] hover:underline cursor-pointer flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>تسجيل دخول لحفظ نتيجتك</span>
            </button>
          )}
        </div>

        {/* Test Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {meta?.code && (
              <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-900 text-white shadow-2xs">
                {meta.code}
              </span>
            )}
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EDF7F5] dark:bg-[#112924] text-[#4E7E76] dark:text-[#5E988E]">
              {meta?.clinicalCategory || test.category}
            </span>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-500 text-white">
              مجاني لفترة تجريبية
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1 mr-auto">
              <Clock className="w-3.5 h-3.5" />
              <span>{test.duration}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
            {test.title}
          </h1>

          {meta?.originalName && (
            <div className="text-xs font-mono text-slate-400" dir="ltr">
              {meta.originalName}
            </div>
          )}

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {meta?.clinicalPurpose || test.desc}
          </p>
        </div>

        {/* Scientific Details Accordion/Card (NAYA Psych Standard) */}
        {meta && (
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Award className="w-4 h-4 text-[#154F9C] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-slate-100 font-bold">المرجعية الأكاديمية والجهة المطورة:</strong>
                <span className="text-slate-600 dark:text-slate-300">{meta.author}</span>
                <div className="text-[11px] text-slate-400 mt-0.5">{meta.institution}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 flex items-start gap-2.5">
              <Users className="w-4 h-4 text-[#4E7E76] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-slate-100 font-bold">الفئة المستهدفة:</strong>
                <span className="text-slate-600 dark:text-slate-300">{meta.targetAudience}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 flex items-start gap-2.5">
              <BookOpen className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-slate-100 font-bold">معايير التصحيح والتفسير الإكلينيكي:</strong>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{meta.scoringGuide}</p>
              </div>
            </div>

            {meta.dimensions && meta.dimensions.length > 0 && (
              <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800">
                <strong className="block text-slate-900 dark:text-slate-100 font-bold mb-1.5">الأبعاد الفرعية التي يقيسها المقياس:</strong>
                <div className="flex flex-wrap gap-1.5">
                  {meta.dimensions.map((dim, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-white dark:bg-black/30 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 text-[11px]">
                      • {dim}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Interactive Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 shadow-md text-right space-y-6">

          {!showResult ? (
            /* Questions View */
            <div className="space-y-6">
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>العبارة {currentQuestionIndex + 1} من {test.questions.length}</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-[#154F9C] to-[#3B82F6] transition-all duration-300"
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
                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#154F9C] hover:bg-[#EDF5FD]/60 dark:hover:bg-[#122238] text-right text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
                  >
                    <span>{opt.label}</span>
                    <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 group-hover:border-[#154F9C] group-hover:bg-[#154F9C] transition-colors flex items-center justify-center shrink-0">
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
                <div className="text-4xl font-black text-[#154F9C] dark:text-[#60A5FA]">
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
              {userSession ? (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span>تم حفظ نتيجتك بنجاح في ملفك الشخصي ({userSession.name})</span>
                  <Link href="/profile" className="font-bold underline">عرض الملف</Link>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
                  <span>لم يتم تسجيل دخولك. سجّل دخولك لحفظ هذه النتيجة</span>
                  <button onClick={() => setShowAuthModal(true)} className="text-[#154F9C] font-bold underline cursor-pointer">
                    تسجيل الدخول
                  </button>
                </div>
              )}

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

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-4 text-xs font-bold text-slate-500">
          <Link
            href="/tests"
            className="inline-flex items-center gap-1.5 text-[#154F9C] dark:text-[#60A5FA] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>تصفح كافة المقاييس الـ 41 المعتمدة</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-[#154F9C] transition cursor-pointer"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{isCopied ? 'تم نسخ الرابط' : 'مشاركة المقياس'}</span>
          </button>
        </div>

      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="relative max-w-md w-full bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-right animate-scaleUp">
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 left-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-[#4E7E76]/10 text-[#4E7E76] flex items-center justify-center mx-auto">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                تسجيل الدخول للمقاييس النفسية
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                سجّل دخولك لحفظ نتائج مقاييسك والوصول إلى سجلك التراكمي في أي وقت.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-3 shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>المتابعة باستخدام Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('apple')}
                className="w-full py-3 px-4 rounded-xl bg-black hover:bg-slate-900 text-white text-xs font-bold transition flex items-center justify-center gap-3 shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12.01-14.42-5.74-8.8-10.24-18.73-13.51-29.77-3.27-11.04-4.91-21.84-4.91-32.4 0-14.28 3.59-26.24 10.77-35.88 7.18-9.64 16.27-14.59 27.27-14.85 4.69 0 10.15 1.34 16.39 4.02 6.23 2.68 10.18 4.07 11.84 4.17 1.89 0 6.04-1.51 12.44-4.53 6.4-3.02 12.03-4.32 16.9-3.9 12.44.88 22.38 5.67 29.83 14.37-10.88 6.64-16.21 15.72-15.99 27.23.23 9.06 3.65 16.82 10.27 23.28 6.62 6.46 14.62 10.11 24.01 10.96-2.01 6.18-4.43 12.28-7.27 18.28zM119.22 33.15c0-7.25 2.66-14.16 7.99-20.72 5.33-6.57 11.88-10.78 19.66-12.63.12 1 .18 1.95.18 2.87 0 7.14-2.82 14.15-8.46 21.03-5.64 6.88-12.23 10.9-19.78 12.07-.12-.87-.19-1.74-.19-2.62z"/>
                </svg>
                <span>المتابعة باستخدام Apple</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                className="w-full py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold transition flex items-center justify-center gap-3 shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>المتابعة باستخدام Facebook</span>
              </button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-400">أو تسجيل سريع</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <form onSubmit={handleQuickLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الاسم الكريم *
                </label>
                <input
                  type="text"
                  required
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  placeholder="مثال: عبد الله"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رقم الهاتف أو البريد
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={quickContact}
                  onChange={(e) => setQuickContact(e.target.value)}
                  placeholder="+966 50 000 0000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white text-left focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={!quickName.trim()}
                className="w-full py-3 rounded-xl bg-[#4E7E76] hover:bg-[#3D645E] disabled:bg-slate-300 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                متابعة
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
