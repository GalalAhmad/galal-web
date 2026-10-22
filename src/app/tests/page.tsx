'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Search, 
  Clock, 
  ShieldAlert, 
  ArrowLeft, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  Calendar, 
  Brain,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  BookOpen,
  Award,
  Users,
  ShieldCheck,
  Info,
  Check,
  Share2
} from 'lucide-react';
import { allTestsData, TestItem } from '@/data/testsData';
import { SCIENTIFIC_TESTS_METADATA } from '@/data/scientificTestsMetadata';

export default function PsychologicalTestsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(12);
  
  // Interactive Modal State
  const [activeTest, setActiveTest] = useState<TestItem | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [viewingOverview, setViewingOverview] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // User Authentication Gate State
  const [userSession, setUserSession] = useState<{ name: string; phone?: string; email?: string; provider?: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [pendingTest, setPendingTest] = useState<TestItem | null>(null);
  const [quickLoginName, setQuickLoginName] = useState('');
  const [quickLoginContact, setQuickLoginContact] = useState('');

  // Categories Aligned with Dr. Hossam Elwaseemy (NAYA Psych)
  const categories = [
    'الكل',
    'الصحة النفسية والاضطرابات الإكلينيكية',
    'اختبارات الشخصية والأنماط',
    'العلاقات الزوجية والتوافق الأسري',
    'مقاييس الأطفال واليافعين',
    'المهارات وجودة الحياة والعمل',
  ];

  // Quick symptom/disorder filter pills (like NAYA Psych top pills)
  const quickFilters = [
    { label: 'الكل', key: 'الكل' },
    { label: 'اكتئاب', key: 'اكتئاب' },
    { label: 'قلق وتوتر', key: 'قلق' },
    { label: 'علاقات وأسرة', key: 'علاقات' },
    { label: 'شخصية ونرجسية', key: 'شخصية' },
    { label: 'ADHD وأطفال', key: 'أطفال' },
    { label: 'وسواس وصدمات', key: 'وسواس' },
    { label: 'الاحتراق والعمل', key: 'عمل' },
  ];

  const sensitiveTestIds = ['depression', 'bipolar-disorder-test', 'schizophrenia-assessment', 'ptsd'];

  // Load user session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('galal_user_session');
      if (saved) {
        setUserSession(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  // Filter tests based on category, quick tags, and search query
  const filteredTests = useMemo(() => {
    return allTestsData.filter((t) => {
      const meta = SCIENTIFIC_TESTS_METADATA[t.id];
      const testCategory = meta?.clinicalCategory || t.category;

      const matchCat = activeCategory === 'الكل' || testCategory === activeCategory;

      let matchQuick = true;
      if (activeQuickFilter !== 'الكل') {
        const textToMatch = `${t.title} ${t.desc} ${meta?.clinicalPurpose || ''} ${meta?.originalName || ''} ${meta?.code || ''}`.toLowerCase();
        if (activeQuickFilter === 'اكتئاب') matchQuick = textToMatch.includes('اكتئاب') || textToMatch.includes('phq');
        else if (activeQuickFilter === 'قلق') matchQuick = textToMatch.includes('قلق') || textToMatch.includes('gad') || textToMatch.includes('توتر') || textToMatch.includes('رهاب');
        else if (activeQuickFilter === 'علاقات') matchQuick = textToMatch.includes('حب') || textToMatch.includes('علاق') || textToMatch.includes('زواج') || textToMatch.includes('شريك') || textToMatch.includes('غير');
        else if (activeQuickFilter === 'شخصية') matchQuick = textToMatch.includes('شخصي') || textToMatch.includes('نرجس') || textToMatch.includes('حدي') || textToMatch.includes('انطواء');
        else if (activeQuickFilter === 'أطفال') matchQuick = textToMatch.includes('طفل') || textToMatch.includes('أطفال') || textToMatch.includes('adhd') || textToMatch.includes('تربية');
        else if (activeQuickFilter === 'وسواس') matchQuick = textToMatch.includes('وسواس') || textToMatch.includes('صدم') || textToMatch.includes('ptsd') || textToMatch.includes('oci');
        else if (activeQuickFilter === 'عمل') matchQuick = textToMatch.includes('عمل') || textToMatch.includes('احتراق') || textToMatch.includes('وظي') || textToMatch.includes('مهن');
      }

      const matchSearch = 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (meta && (
          meta.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meta.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meta.author.toLowerCase().includes(searchQuery.toLowerCase())
        ));

      return matchCat && matchQuick && matchSearch;
    });
  }, [activeCategory, activeQuickFilter, searchQuery]);

  // Open modal with scientific overview first
  const handleOpenTest = (test: TestItem, startDirectly: boolean = false) => {
    setActiveTest(test);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
    setViewingOverview(!startDirectly);
  };

  // Start answering test questions (gate check)
  const handleBeginQuestions = () => {
    if (!userSession) {
      setPendingTest(activeTest);
      setShowAuthModal(true);
      return;
    }
    setViewingOverview(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
  };

  // Save completed test result to client file
  const saveCompletedTest = async (test: TestItem, score: number, scorePct: number, interpretation: any) => {
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
            scorePercent: scorePct,
            level: interpretation.level,
            desc: interpretation.desc,
            recommendation: interpretation.rec,
          },
        }),
      });
    } catch (err) {
      console.error('Error saving test result:', err);
    }
  };

  // Social Sign-in
  const handleSocialLogin = (provider: 'google' | 'apple' | 'facebook') => {
    const mockUsers = {
      google: { name: 'مستخدم Google الكريم', email: 'user@gmail.com', phone: '+966 50 000 0000', provider: 'google' },
      apple: { name: 'مستخدم Apple الكريم', email: 'user@icloud.com', phone: '+966 50 000 0000', provider: 'apple' },
      facebook: { name: 'مستخدم Facebook الكريم', email: 'user@facebook.com', phone: '+20 100 000 0000', provider: 'facebook' },
    };
    const defaultUser = mockUsers[provider];
    setUserSession(defaultUser);
    try {
      localStorage.setItem('galal_user_session', JSON.stringify(defaultUser));
    } catch (e) {}
    setShowAuthModal(false);

    if (pendingTest) {
      setActiveTest(pendingTest);
      setViewingOverview(false);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setShowResult(false);
      setPendingTest(null);
    }
  };

  // Quick Phone / Name Sign-in
  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLoginName.trim()) return;
    const guestUser = {
      name: quickLoginName.trim(),
      phone: quickLoginContact.trim() || '',
      email: quickLoginContact.includes('@') ? quickLoginContact.trim() : '',
      provider: 'phone_quick',
    };
    setUserSession(guestUser);
    try {
      localStorage.setItem('galal_user_session', JSON.stringify(guestUser));
    } catch (e) {}
    setShowAuthModal(false);

    if (pendingTest) {
      setActiveTest(pendingTest);
      setViewingOverview(false);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setShowResult(false);
      setPendingTest(null);
    }
  };

  const handleLogout = () => {
    setUserSession(null);
    try {
      localStorage.removeItem('galal_user_session');
    } catch (e) {}
  };

  const handleSelectOption = (score: number) => {
    const updated = [...answers, score];
    setAnswers(updated);

    if (activeTest && currentQuestionIndex + 1 < activeTest.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (activeTest) {
      setShowResult(true);
      // Auto save
      const finalScore = updated.reduce((a, b) => a + b, 0);
      const maxScore = activeTest.questions.length * 3;
      const pct = Math.min(100, Math.round((finalScore / maxScore) * 100));
      saveCompletedTest(activeTest, finalScore, pct, resultInterpretation);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
    setViewingOverview(false);
  };

  const handleCloseModal = () => {
    setActiveTest(null);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
    setViewingOverview(true);
  };

  const handleShareLink = (testId: string) => {
    const url = `${window.location.origin}/tests/${testId}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Compute Score Interpretation
  const totalScore = answers.reduce((acc, curr) => acc + curr, 0);
  const maxPossibleScore = activeTest ? activeTest.questions.length * 3 : 1;
  const scorePercent = Math.min(100, Math.round((totalScore / maxPossibleScore) * 100));

  const resultInterpretation = useMemo(() => {
    if (!activeTest) return { level: 'معتدل', color: 'text-[#154F9C]', desc: '', rec: '' };
    
    if (activeTest.scoreResults && activeTest.scoreResults.length > 0) {
      const idx = Math.min(
        activeTest.scoreResults.length - 1,
        Math.floor((scorePercent / 100) * activeTest.scoreResults.length)
      );
      const res = activeTest.scoreResults[idx];
      return {
        level: res.title,
        color: idx >= activeTest.scoreResults.length - 1 ? 'text-rose-600 dark:text-rose-400' : 'text-[#154F9C] dark:text-[#60A5FA]',
        desc: res.text || 'تشير إجاباتك إلى مؤشرات تتطلب الانتباه والوعي بمسببات الضغط.',
        rec: res.recommendation || 'جلسة استشارية خاصة مع المستشار جلال أحمد تساعدك على فهم الجذور ووضع خطة متوازنة.'
      };
    }

    if (scorePercent < 35) {
      return {
        level: 'مستوى طفيف / مستقر',
        color: 'text-emerald-600 dark:text-emerald-400',
        desc: 'تشير إجاباتك إلى استقرار عام يقع ضمن المعدلات الطبيعية للتعامل مع التحديات اليومية.',
        rec: 'استمر في الحفاظ على روتينك الصحي المتوازن والوعي بمشاعرك.'
      };
    } else if (scorePercent < 70) {
      return {
        level: 'مستوى متوسط / يستحق الانتباه',
        color: 'text-amber-600 dark:text-amber-400',
        desc: 'توجد بعض المؤشرات المتكررة التي قد تسبب لك استنزافاً نفسياً أو تؤثر على طاقتك وعلاقاتك.',
        rec: 'يُنصح بمناقشة هذه المؤشرات في جلسة استشارية لتفكيك أسبابها قبل تراكمها.'
      };
    } else {
      return {
        level: 'مستوى ملحوظ / يُنصح بالدعم الاستشاري',
        color: 'text-rose-600 dark:text-rose-400',
        desc: 'تشير نتائجك إلى ضغوط أو أعراض واضحة ومستمرة قد تؤثر بشكل ملحوظ على راحتك واستقرارك.',
        rec: 'حجز جلسة استشارية متخصصة مع المستشار جلال أحمد يساعدك على استعادة الاتزان والأمان النفسي.'
      };
    }
  }, [activeTest, scorePercent]);

  const activeTestMeta = activeTest ? SCIENTIFIC_TESTS_METADATA[activeTest.id] : null;

  return (
    <main className="min-h-screen bg-[#FDFCFB] dark:bg-[#0C111C] text-slate-800 dark:text-slate-100 flex flex-col antialiased selection:bg-[#154F9C]/10 selection:text-[#154F9C]">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-12 pb-8 sm:pt-16 sm:pb-12 px-4 sm:px-6 bg-white dark:bg-[#0E1524] border-b border-slate-100 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDF5FD] dark:bg-[#122238] border border-[#D6E6F8] dark:border-[#1E3A5F] text-xs font-bold text-[#154F9C] dark:text-[#60A5FA]">
            <Brain className="w-3.5 h-3.5" />
            <span>بوابة المقاييس النفسية المقننة • وفق المعايير الأكاديمية العالمية</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            المقاييس والاختبارات النفسية
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            مكتبة علمية متخصصة تضم 41 مقياساً مقنناً لاكتشاف الذات وفحص مؤشرات الصحة النفسية، الأنماط الشخصية، والعلاقات الأسرية في بيئة آمنة وخاصة 100%.
          </p>

          {/* Pilot Phase Notice (مجانية لفترة تجريبية) */}
          <div className="max-w-2xl mx-auto p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3 text-right">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                <strong>فترة تجريبية مجانية:</strong> كافة المقاييس متاحة مجاناً بالكامل حالياً، وستتاح لاحقاً عبر باقات اشتراك موجهة.
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white font-black text-[10px] shrink-0">
              مجاني 100%
            </span>
          </div>

          {/* Search Bar & Quick Tags Filter */}
          <div className="pt-4 max-w-2xl mx-auto space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم المقياس أو رمزه العلمي (مثال: PHQ-9، الاكتئاب، القلق، العلاقات...)"
                className="w-full py-3.5 pr-11 pl-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#154F9C] text-right placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* Category Tabs (NayaPsych Architecture) */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#154F9C] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Symptom Filter Pills (like NayaPsych top row) */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 ml-1">التصنيف الإكلينيكي:</span>
              {quickFilters.map((qf) => (
                <button
                  key={qf.key}
                  onClick={() => setActiveQuickFilter(qf.key)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer border ${
                    activeQuickFilter === qf.key
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-2xs'
                      : 'bg-transparent text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  {qf.label}
                </button>
              ))}
            </div>

            {/* User Session Banner */}
            <div className="pt-2">
              {userSession ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>ملف المستفيد متصل: {userSession.name} • تحفظ المقاييس تلقائياً في حسابك</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/profile"
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-2xs"
                    >
                      عرض ملفي
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-slate-400 hover:text-rose-500 font-bold text-[11px] transition"
                    >
                      خروج
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-[#4E7E76]/10 dark:bg-[#5E988E]/15 border border-[#4E7E76]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium">
                    <ShieldCheck className="w-4 h-4 text-[#4E7E76] shrink-0" />
                    <span>سجّل دخولك لحفظ مقاييسك في ملفك الشخصي واستعراض سجلك التراكمي في أي وقت</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#4E7E76] hover:bg-[#3D645E] text-white font-bold transition shrink-0 shadow-xs cursor-pointer"
                  >
                    تسجيل الدخول بضغطة زر
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Clinical Disclaimer Notice */}
      <section className="py-3 px-4 sm:px-6 bg-[#FEF9EC] dark:bg-[#2A2312] border-b border-[#FDF0CD] dark:border-[#4D3A1B]">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2.5 text-center text-xs text-[#92400E] dark:text-[#FBBF24] font-medium leading-relaxed">
          <ShieldAlert className="w-4 h-4 shrink-0 text-[#D97706]" />
          <span>
            هذه المقاييس أدوات استرشادية واستكشافية مقننة للتوعية والتقييم الأولي، وليست بديلاً عن التشخيص الطبي أو العيادي المتخصص.
          </span>
        </div>
      </section>

      {/* Tests Grid: 41 Clinical Cards Aligned with Hossam Elwaseemy Model */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 flex-1">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>المقاييس المعروضة: <strong>{filteredTests.length}</strong> من أصل <strong>{allTestsData.length}</strong></span>
            {(searchQuery || activeQuickFilter !== 'الكل' || activeCategory !== 'الكل') && (
              <button 
                onClick={() => { setSearchQuery(''); setActiveQuickFilter('الكل'); setActiveCategory('الكل'); }}
                className="text-[#154F9C] hover:underline cursor-pointer"
              >
                إعادة ضبط التصفية ✕
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTests.slice(0, visibleCount).map((test) => {
              const meta = SCIENTIFIC_TESTS_METADATA[test.id];

              return (
                <div
                  key={test.id}
                  style={{ backgroundColor: test.color }}
                  className="relative p-6 rounded-3xl border border-black/5 dark:border-white/10 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-right text-slate-900 group"
                >
                  <div className="space-y-3">
                    
                    {/* Top Row: Academic Code & Badges */}
                    <div className="flex items-center justify-between flex-wrap gap-1.5">
                      <div className="flex items-center gap-1.5">
                        {meta?.code && (
                          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-slate-900 text-white shadow-2xs">
                            {meta.code}
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 dark:bg-black/40 text-slate-800 dark:text-slate-200 border border-black/5">
                          عالمي
                        </span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/90 text-white">
                          تجريبي مجاناً
                        </span>
                      </div>
                      
                      <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-600" />
                        <span>{test.duration}</span>
                      </span>
                    </div>

                    {/* Test Title & Demographic */}
                    <div className="space-y-1.5">
                      <h3 className="text-base font-black text-slate-950 leading-snug">
                        {test.title}
                      </h3>
                      {meta?.targetAudience && (
                        <div className="text-[11px] font-bold text-slate-700/80 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{meta.targetAudience}</span>
                        </div>
                      )}
                      <p className="text-xs text-slate-800/90 leading-relaxed font-normal line-clamp-3">
                        {meta?.clinicalPurpose || test.desc}
                      </p>
                    </div>

                    {/* Dimensions / Subscales Snippet */}
                    {meta?.dimensions && meta.dimensions.length > 0 && (
                      <div className="pt-1 flex flex-wrap gap-1">
                        {meta.dimensions.slice(0, 2).map((dim, dIdx) => (
                          <span key={dIdx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/60 text-slate-800">
                            • {dim}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Actions: Start & Scientific Details */}
                  <div className="pt-4 flex items-center justify-between border-t border-black/5 mt-4">
                    <button
                      type="button"
                      onClick={() => handleOpenTest(test, false)}
                      className="text-[11px] text-slate-800 hover:text-black font-extrabold flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>معرفة المزيد</span>
                    </button>
                    
                    <button
                      onClick={() => handleOpenTest(test, true)}
                      className="px-4 py-2 rounded-full bg-slate-900/95 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer group-hover:scale-105"
                    >
                      <span>بدء المقياس</span>
                      <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show More Tests Button */}
          {filteredTests.length > visibleCount && (
            <div className="text-center pt-8 space-y-2">
              <button
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="px-8 py-3.5 rounded-full bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs sm:text-sm font-bold transition shadow-md shadow-[#154F9C]/20 hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>عرض المزيد من المقاييس (+12 مقياساً)</span>
              </button>
              <div className="text-[11px] text-slate-500 font-semibold">
                معروض حالياً {Math.min(visibleCount, filteredTests.length)} من أصل {filteredTests.length} مقياساً
              </div>
            </div>
          )}

          {filteredTests.length === 0 && (
            <div className="text-center py-16 p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <Brain className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                لم يتم العثور على مقياس يطابق بحثك
              </h3>
              <p className="text-xs text-slate-500">
                جرب البحث بكلمات أخرى أو اختر تصنيفاً إكلينيكياً مختلفاً.
              </p>
              <button
                onClick={() => { setActiveCategory('الكل'); setActiveQuickFilter('الكل'); setSearchQuery(''); }}
                className="mt-2 px-4 py-2 bg-[#154F9C] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                عرض كافة المقاييس
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Interactive Assessment Modal (Scientific Overview + Runner + Result) */}
      {activeTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#121A2C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative text-right max-h-[92vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
              aria-label="إغلاق الاختبار"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Test Header */}
            <div className="space-y-1 pl-8">
              <div className="flex items-center gap-2">
                {activeTestMeta?.code && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-900 text-white">
                    {activeTestMeta.code}
                  </span>
                )}
                <span className="text-[11px] font-bold text-[#154F9C] dark:text-[#60A5FA]">
                  {activeTestMeta?.clinicalCategory || activeTest.category}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {activeTest.title}
              </h3>
              {activeTestMeta?.originalName && (
                <div className="text-[11px] font-mono text-slate-400" dir="ltr">
                  {activeTestMeta.originalName}
                </div>
              )}
            </div>

            {/* VIEW 1: SCIENTIFIC OVERVIEW (NAYA Psych Standard) */}
            {viewingOverview ? (
              <div className="space-y-4 animate-fadeIn pt-2">
                
                {/* Author & Academic Institution Card */}
                {activeTestMeta && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-[#154F9C] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-slate-900 dark:text-slate-100 font-bold">المطور والمرجعية العلمية:</strong>
                        <span className="text-slate-600 dark:text-slate-300">{activeTestMeta.author}</span>
                        <div className="text-[11px] text-slate-400 mt-0.5">{activeTestMeta.institution}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-start gap-2">
                      <Brain className="w-4 h-4 text-[#4E7E76] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-slate-900 dark:text-slate-100 font-bold">الهدف الإكلينيكي:</strong>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{activeTestMeta.clinicalPurpose}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-slate-900 dark:text-slate-100 font-bold">معايير التصحيح والتفسير:</strong>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{activeTestMeta.scoringGuide}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Test Parameters Badge Bar */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block">مدة التطبيق</span>
                    <strong className="font-bold text-slate-800 dark:text-slate-200">{activeTest.duration}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block">عدد العبارات</span>
                    <strong className="font-bold text-slate-800 dark:text-slate-200">{activeTest.questions.length} أسئلة</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block">حالة الوصول</span>
                    <strong className="font-bold text-emerald-600 dark:text-emerald-400">مجاني تجريبياً</strong>
                  </div>
                </div>

                {/* Free Trial Banner */}
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/80 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                  💡 <strong>ملاحظة هامة:</strong> هذا المقياس متاح مجاناً 100% خلال المرحلة التجريبية للمنصة، وسيصبح لاحقاً بمقابل مادي وباقات اشتراك.
                </div>

                {/* Action Buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={handleBeginQuestions}
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>ابدأ الإجابة على الأسئلة الآن</span>
                    <ArrowLeft className="w-4 h-4 rtl:rotate-0" />
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/tests/${activeTest.id}`}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition text-center"
                    >
                      فتح الصفحة المستقلة للمقياس
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleShareLink(activeTest.id)}
                      className="py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      title="مشاركة رابط المقياس"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                      <span>{isCopied ? 'تم النسخ' : 'مشاركة'}</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : !showResult ? (
              /* VIEW 2: ACTIVE QUESTION RUNNER */
              <div className="space-y-6">
                
                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>العبارة {currentQuestionIndex + 1} من {activeTest.questions.length}</span>
                    <span>{Math.round(((currentQuestionIndex + 1) / activeTest.questions.length) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-[#154F9C] rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / activeTest.questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Current Question Text */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-slate-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                    {activeTest.questions[currentQuestionIndex].text}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    اختر الإجابة الأقرب لحالتك:
                  </span>
                  {activeTest.questions[currentQuestionIndex].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(opt.score)}
                      className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#162032] hover:border-[#154F9C] hover:bg-[#EDF5FD] dark:hover:bg-[#122238] text-xs font-bold text-slate-800 dark:text-slate-200 transition text-right cursor-pointer flex items-center justify-between"
                    >
                      <span>{opt.label}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
                    </button>
                  ))}
                </div>

                <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal flex items-start gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>تنبيه استرشادي: نتائج هذه المقاييس مخصصة للتوعية الذاتية، ولا تُعد تشخيصاً طبياً أو عيادياً بديلاً عن استشارة الطبيب أو الأخصائي النفسي المؤهل.</span>
                </div>

              </div>
            ) : (
              /* VIEW 3: RESULTS VIEW */
              <div className="space-y-5 text-center animate-fadeIn">
                
                <div className="w-16 h-16 rounded-2xl bg-[#EDF5FD] dark:bg-[#122238] text-[#154F9C] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500">نتيجة الفحص الذاتي</span>
                  <h4 className={`text-xl font-black ${resultInterpretation.color}`}>
                    {resultInterpretation.level}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
                    {resultInterpretation.desc}
                  </p>
                </div>

                {/* Emergency Safety Alert for Sensitive Tests */}
                {sensitiveTestIds.includes(activeTest.id) && (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs text-right space-y-1.5">
                    <div className="flex items-center gap-1.5 font-black text-rose-700 dark:text-rose-300">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>تنبيه أمان عاجل</span>
                    </div>
                    <p className="leading-relaxed">
                      إذا كنت تفكر في إيذاء نفسك أو كنت في خطر داهم، تواصل فوراً مع أقرب مركز طوارئ أو اتصل بالخطوط الساخنة المعتمدة في بلدك.
                    </p>
                    <Link href="/policies" className="block text-[11px] font-bold underline hover:text-rose-800">
                      راجع إرشادات الطوارئ في صفحة السياسات ←
                    </Link>
                  </div>
                )}

                {/* Clinical Recommendation Box */}
                <div className="p-4 rounded-2xl bg-[#FEF9EC] dark:bg-[#2A2312] border border-[#FDF0CD] dark:border-[#4D3A1B] text-right space-y-1.5">
                  <span className="text-xs font-bold text-[#D97706] block">
                    التوجيه الاستشاري المقترح:
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {resultInterpretation.rec}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <Link
                    href="/booking"
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#CC4E46] hover:bg-[#B33D35] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-[#CC4E46]/20"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>احجز استشارة متخصصة لمناقشة نتيجتك</span>
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRestart}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>إعادة الاختبار</span>
                    </button>

                    <Link
                      href="/profile"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition text-center"
                    >
                      عرض تقاريري
                    </Link>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* Authentication Login Gate Modal (Google / Apple / Facebook / Quick Phone) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="relative max-w-md w-full bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-right animate-scaleUp">
            <button
              type="button"
              onClick={() => {
                setShowAuthModal(false);
                setPendingTest(null);
              }}
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
                سجّل دخولك لحفظ نتائج مقاييسك والوصول إلى سجل تحليلك النفسي التراكمي بخصوصية وسرية تامة.
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
                <span>المتابعة باستخدام حساب Google</span>
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
              <span className="flex-shrink mx-3 text-[11px] text-slate-400">أو تسجيل سريع بالاسم</span>
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
                  value={quickLoginName}
                  onChange={(e) => setQuickLoginName(e.target.value)}
                  placeholder="مثال: عبد الله"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رقم الواتساب أو البريد (لحفظ نتيجتك)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={quickLoginContact}
                  onChange={(e) => setQuickLoginContact(e.target.value)}
                  placeholder="+966 50 000 0000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white text-left focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={!quickLoginName.trim()}
                className="w-full py-3 rounded-xl bg-[#4E7E76] hover:bg-[#3D645E] disabled:bg-slate-300 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                متابعة وبدء المقياس
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
