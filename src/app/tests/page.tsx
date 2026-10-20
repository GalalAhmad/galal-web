'use client';

import React, { useState, useMemo } from 'react';
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
  MessageCircle, 
  Brain,
  Sparkles,
  ChevronRight,
  Zap
} from 'lucide-react';
import { allTestsData, TestItem } from '@/data/testsData';

export default function PsychologicalTestsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Interactive Modal State
  const [activeTest, setActiveTest] = useState<TestItem | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);

  const categories = ['الكل', 'الصحة النفسية', 'الشخصية', 'العلاقات والأسرة'];

  const filteredTests = useMemo(() => {
    return allTestsData.filter((t) => {
      const matchCat = activeCategory === 'الكل' || t.category === activeCategory;
      const matchSearch = 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleStartTest = (test: TestItem) => {
    setActiveTest(test);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
  };

  const handleSelectOption = (score: number) => {
    const updated = [...answers, score];
    setAnswers(updated);

    if (activeTest && currentQuestionIndex + 1 < activeTest.questions.length) {
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

  const handleCloseModal = () => {
    setActiveTest(null);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
  };

  // Compute Score Interpretation
  const totalScore = answers.reduce((acc, curr) => acc + curr, 0);
  const maxPossibleScore = activeTest ? activeTest.questions.length * 3 : 1;
  const scorePercent = Math.min(100, Math.round((totalScore / maxPossibleScore) * 100));

  let resultInterpretation = useMemo(() => {
    if (!activeTest) return { level: 'معتدل', color: 'text-[#154F9C]', desc: '', rec: '' };
    
    // Check if test has specific scoreResults
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

    // Default fallback interpretation
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

  return (
    <main className="min-h-screen bg-[#FDFCFB] dark:bg-[#0C111C] text-slate-800 dark:text-slate-100 flex flex-col antialiased selection:bg-[#154F9C]/10 selection:text-[#154F9C]">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-12 pb-8 sm:pt-16 sm:pb-12 px-4 sm:px-6 bg-white dark:bg-[#0E1524] border-b border-slate-100 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDF5FD] dark:bg-[#122238] border border-[#D6E6F8] dark:border-[#1E3A5F] text-xs font-bold text-[#154F9C] dark:text-[#60A5FA]">
            <Brain className="w-3.5 h-3.5" />
            <span>أدوات فحص واكتشاف الذات • 41 مقياساً واختباراً معتمداً</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            اختبارات نفسية
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            اختبارات ومقاييس مجانية ومقننة تساعدك على فهم أعراض القلق، الاكتئاب، العلاقات، والأنماط السلوكية في مساحة آمنة وخاصة.
          </p>

          {/* Search Bar & Categories Filter */}
          <div className="pt-4 max-w-xl mx-auto space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن اختبار (مثال: الاكتئاب، القلق، الشخصية، العلاقات...)"
                className="w-full py-3 pr-10 pl-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#154F9C] text-right"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#154F9C] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Clinical Disclaimer Notice (Exact Arab Therapy text) */}
      <section className="py-4 px-4 sm:px-6 bg-[#FEF9EC] dark:bg-[#2A2312] border-b border-[#FDF0CD] dark:border-[#4D3A1B]">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2.5 text-center text-xs text-[#92400E] dark:text-[#FBBF24] font-medium leading-relaxed">
          <ShieldAlert className="w-4 h-4 shrink-0 text-[#D97706]" />
          <span>
            هذه الاختبارات أداة للتثقيف الذاتي وليست تشخيصية أو علاجية، ولا تحل محل استشارة الطبيب أو المختص النفسي.
          </span>
        </div>
      </section>

      {/* Tests Grid: 41 Authentic Pastel Cards matching Arab Therapy */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 flex-1">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>الاختبارات المعروضة: <strong>{filteredTests.length}</strong> من أصل <strong>{allTestsData.length}</strong></span>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-[#154F9C] hover:underline"
              >
                مسح البحث ✕
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                style={{ backgroundColor: test.color }}
                className="relative p-6 rounded-3xl border border-black/5 dark:border-white/10 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-right text-slate-900 group"
              >
                <div className="space-y-3">
                  {/* Top Bar: Icon & Category */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/70 dark:bg-black/30 text-slate-800 dark:text-slate-200 border border-black/5">
                      {test.category}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                      <span>{test.duration}</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {test.title}
                    </h3>
                    <p className="text-xs text-slate-700/90 leading-relaxed font-normal line-clamp-3">
                      {test.desc}
                    </p>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-5 flex items-center justify-between border-t border-black/5 dark:border-white/5 mt-4">
                  <span className="text-[11px] text-slate-600 font-medium">
                    {test.questionsCount}
                  </span>
                  
                  <button
                    onClick={() => handleStartTest(test)}
                    className="px-4 py-2 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer group-hover:scale-105"
                  >
                    <span>ابدأ الاختبار</span>
                    <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTests.length === 0 && (
            <div className="text-center py-16 p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <Brain className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                لم يتم العثور على اختبار يطابق بحثك
              </h3>
              <p className="text-xs text-slate-500">
                جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً.
              </p>
              <button
                onClick={() => { setActiveCategory('الكل'); setSearchQuery(''); }}
                className="mt-2 px-4 py-2 bg-[#154F9C] text-white text-xs font-bold rounded-xl"
              >
                عرض كافة الاختبارات
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Interactive Modal */}
      {activeTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#121A2C] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative text-right">
            
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
              aria-label="إغلاق الاختبار"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Test Header */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#154F9C] uppercase tracking-wider block">
                {activeTest.category} • {activeTest.duration}
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {activeTest.title}
              </h3>
            </div>

            {!showResult ? (
              <div className="space-y-6">
                
                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>السؤال {currentQuestionIndex + 1} من {activeTest.questions.length}</span>
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
                    اختر الإجابة الأقرب لوضعك:
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

              </div>
            ) : (
              /* Results View */
              <div className="space-y-6 text-center animate-fadeIn">
                
                <div className="w-16 h-16 rounded-2xl bg-[#EDF5FD] dark:bg-[#122238] text-[#154F9C] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500">نتيجة التقييم الذاتي</span>
                  <h4 className={`text-xl font-black ${resultInterpretation.color}`}>
                    {resultInterpretation.level}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
                    {resultInterpretation.desc}
                  </p>
                </div>

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
                    href="/services#book"
                    className="w-full py-3 px-6 rounded-full bg-[#CC4E46] hover:bg-[#B33D35] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-[#CC4E46]/20"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>احجز استشارة متخصصة لمناقشة نتيجتك</span>
                  </Link>

                  <button
                    onClick={handleRestart}
                    className="w-full py-2.5 px-4 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>إعادة الاختبار</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
