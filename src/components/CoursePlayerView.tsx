'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Play,
  FileText,
  HelpCircle,
  Download,
  Clock,
  Sparkles,
  Award,
  Layers,
  Check,
  Star,
  User,
  Heart,
  MessageCircle,
  ShieldCheck,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { Course, CourseModule, Lesson } from '@/data/coursesData';
import { useAuth } from '@/context/AuthContext';

interface CoursePlayerViewProps {
  course: Course;
}

export default function CoursePlayerView({ course }: CoursePlayerViewProps) {
  const { user } = useAuth();

  // Find first lesson as default
  const defaultModule = course.syllabus[0];
  const defaultLesson = defaultModule?.lessons[0];

  const [activeModuleId, setActiveModuleId] = useState<string>(defaultModule?.id || '');
  const [activeLessonId, setActiveLessonId] = useState<string>(defaultLesson?.id || '');
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [userReflection, setUserReflection] = useState<string>('');
  const [savedReflectionSuccess, setSavedReflectionSuccess] = useState<boolean>(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Enrollment State
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false);
  const [enrollSuccessMsg, setEnrollSuccessMsg] = useState<string>('');

  const storageProgressKey = `course_progress_${course.id}`;

  // Load progress from localStorage & check user profile
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageProgressKey);
      if (stored) {
        setCompletedLessonIds(JSON.parse(stored));
      }
    } catch (e) {}

    if (user && Array.isArray((user as any).courses)) {
      const found = (user as any).courses.some((c: any) => c.id === course.id);
      if (found) setIsEnrolled(true);
    }
  }, [course.id, user, storageProgressKey]);

  // Load saved reflection for active lesson
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`reflection_${course.id}_${activeLessonId}`);
      setUserReflection(saved || '');
    } catch (e) {
      setUserReflection('');
    }
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setSavedReflectionSuccess(false);
  }, [course.id, activeLessonId]);

  // Flatten lessons for navigation
  const allLessons = useMemo(() => {
    const list: { lesson: Lesson; module: CourseModule }[] = [];
    course.syllabus.forEach((mod) => {
      mod.lessons.forEach((les) => {
        list.push({ lesson: les, module: mod });
      });
    });
    return list;
  }, [course]);

  const currentIndex = allLessons.findIndex((item) => item.lesson.id === activeLessonId);
  const currentItem = allLessons[currentIndex] || allLessons[0];
  const currentLesson = currentItem?.lesson;
  const currentModule = currentItem?.module;

  const prevItem = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextItem = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const totalLessonsCount = allLessons.length;
  const completedCount = completedLessonIds.length;
  const progressPercent = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;

  // Toggle completion
  const handleToggleComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) => {
      const updated = prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId];
      try {
        localStorage.setItem(storageProgressKey, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Save reflection
  const handleSaveReflection = () => {
    if (!activeLessonId) return;
    try {
      localStorage.setItem(`reflection_${course.id}_${activeLessonId}`, userReflection);
      setSavedReflectionSuccess(true);
      setTimeout(() => setSavedReflectionSuccess(false), 3000);
    } catch (e) {}
  };

  // Handle Enrollment
  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          courseTitle: course.title,
          name: user?.name || 'مستفيد المنصة',
          phone: user?.phone || '',
          email: user?.email || '',
          batchDate: 'الدفعة الحالية',
        }),
      });
      if (res.ok) {
        setIsEnrolled(true);
        setEnrollSuccessMsg('تم تسجيلك بنجاح في البرنامج وإضافته إلى ملفك الشخصي ✓');
        setTimeout(() => setEnrollSuccessMsg(''), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#0A0E17] text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-[#154F9C]/10 selection:text-[#154F9C]">
      {/* 1. Top Calm Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0E1524]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-xs">
        {/* Breadcrumb & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            href={`/courses/${course.slug}`}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#154F9C] transition shrink-0"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline">تفاصيل الدورة</span>
          </Link>

          <span className="text-slate-300 dark:text-slate-700">/</span>

          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#154F9C]/10 dark:bg-[#154F9C]/30 text-[#154F9C] dark:text-sky-300 font-bold shrink-0">
            {course.trackLabel}
          </span>

          <h1 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
            {course.title}
          </h1>
        </div>

        {/* Progress & Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Progress Bar */}
          <div className="hidden md:flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">الإنجاز:</span>
            <div className="w-20 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#168962] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <strong className="text-[#168962] dark:text-emerald-400 font-mono">{progressPercent}%</strong>
          </div>

          {/* Enrollment Tag / Button */}
          {isEnrolled ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>مسجل في البرنامج ✓</span>
            </span>
          ) : (
            <button
              type="button"
              disabled={isEnrolling}
              onClick={handleEnroll}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-400 text-white text-xs font-black transition shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEnrolling ? 'جارٍ التسجيل...' : 'تسجيل في الدفعة'}</span>
            </button>
          )}

          {/* Toggle Sidebar */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
            title={isSidebarOpen ? 'إخفاء قائمة المحطات' : 'إظهار قائمة المحطات'}
          >
            <Layers className="w-4 h-4 text-[#154F9C] dark:text-sky-400" />
          </button>
        </div>
      </header>

      {/* Success Banner */}
      {enrollSuccessMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/80 border-b border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold py-2.5 px-4 text-center animate-fadeIn flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{enrollSuccessMsg}</span>
          <Link href="/profile" className="underline mr-2 text-[#154F9C] dark:text-white font-bold">
            عرض في ملفي الشخصي ←
          </Link>
        </div>
      )}

      {/* 2. Main Learning Stage */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Viewport — Generous pb-36 to never overlap floating elements */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 space-y-8 max-w-4xl mx-auto pb-36">
          {currentLesson ? (
            <div className="space-y-6 animate-fadeIn text-right">
              {/* Station Banner */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-2 font-bold text-[#154F9C] dark:text-sky-300">
                    <span className="w-2 h-2 rounded-full bg-[#154F9C] dark:bg-sky-400" />
                    <span>المحطة {currentModule?.num} من {course.syllabus.length}</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-300 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentLesson.duration}</span>
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDF5FD] dark:bg-slate-900 border border-[#D6E6F8] dark:border-slate-800 text-2xl flex items-center justify-center shrink-0">
                    {currentModule?.icon || '📖'}
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {currentLesson.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {currentModule?.description}
                    </p>
                  </div>
                </div>

                {/* Mark as Completed Button */}
                <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(currentLesson.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                      completedLessonIds.includes(currentLesson.id)
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        completedLessonIds.includes(currentLesson.id) ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                      }`}
                    />
                    <span>
                      {completedLessonIds.includes(currentLesson.id) ? 'تم إنجاز هذه المحطة بنجاح ✓' : 'تحديد كمكتمل ومتابعة'}
                    </span>
                  </button>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span>إعداد وتقديم:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{course.instructor.name}</strong>
                  </div>
                </div>
              </div>

              {/* Lesson Summary & Core Concept */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#154F9C]" />
                  <span>المفهوم الجوهري وخلاصة المحطة:</span>
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-loose">
                  {currentLesson.summary}
                </p>

                {/* Key Takeaways */}
                {currentLesson.keyTakeaways && currentLesson.keyTakeaways.length > 0 && (
                  <div className="pt-3 space-y-2.5">
                    <span className="text-xs font-black text-[#168962] dark:text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>أهم المخرجات التطبيقية المستفادة:</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {currentLesson.keyTakeaways.map((takeaway, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#168962]/10 text-[#168962] dark:text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Exercise & Reflection Card */}
              {currentLesson.interactiveActivity && (
                <div className="p-6 sm:p-7 rounded-3xl bg-[#F2FBF7] dark:bg-[#0D261E] border border-[#D2F3E3] dark:border-[#164635] space-y-5 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-[#D2F3E3] dark:border-[#164635]">
                    <h3 className="text-base font-black text-[#168962] dark:text-emerald-300 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5" />
                      <span>تمرين المحطة العملي وفحص الفهم</span>
                    </h3>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900 text-[#168962] dark:text-emerald-300 border border-[#D2F3E3] dark:border-[#164635] font-bold">
                      تطبيق عملي
                    </span>
                  </div>

                  {/* Multiple Choice Question */}
                  {currentLesson.interactiveActivity.question && (
                    <div className="space-y-3">
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                        {currentLesson.interactiveActivity.question}
                      </p>

                      {currentLesson.interactiveActivity.options && (
                        <div className="space-y-2">
                          {currentLesson.interactiveActivity.options.map((opt, oIdx) => {
                            const isSelected = selectedQuizOption === oIdx;
                            const isCorrect = currentLesson.interactiveActivity?.correctOptionIndex === oIdx;

                            let optStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#168962]';
                            if (quizSubmitted) {
                              if (isCorrect) optStyle = 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                              else if (isSelected && !isCorrect) optStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-800 dark:text-rose-200';
                            } else if (isSelected) {
                              optStyle = 'bg-[#168962]/10 border-[#168962] text-slate-900 dark:text-white font-bold';
                            }

                            return (
                              <button
                                key={oIdx}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() => setSelectedQuizOption(oIdx)}
                                className={`w-full p-3.5 rounded-2xl border text-xs text-right transition cursor-pointer flex items-center justify-between gap-3 ${optStyle}`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                      isSelected
                                        ? 'border-[#168962] bg-[#168962] text-white'
                                        : 'border-slate-300 dark:border-slate-600'
                                    }`}
                                  >
                                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                                  </span>
                                  <span>{opt}</span>
                                </div>
                                {quizSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                              </button>
                            );
                          })}

                          {!quizSubmitted && selectedQuizOption !== null && (
                            <button
                              type="button"
                              onClick={() => setQuizSubmitted(true)}
                              className="mt-3 px-5 py-2.5 rounded-xl bg-[#168962] hover:bg-[#126f50] text-white text-xs font-bold transition cursor-pointer shadow-xs"
                            >
                              التحقق من الإجابة والتحليل الإرشادي
                            </button>
                          )}

                          {quizSubmitted && currentLesson.interactiveActivity.explanation && (
                            <div className="mt-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#D2F3E3] dark:border-[#164635] text-xs text-slate-700 dark:text-slate-300 leading-relaxed animate-fadeIn">
                              <strong className="block font-bold text-[#168962] dark:text-emerald-400 mb-1">
                                💡 التحليل الإرشادي والتأصيل:
                              </strong>
                              {currentLesson.interactiveActivity.explanation}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reflection Textarea */}
                  {currentLesson.interactiveActivity.reflectionPrompt && (
                    <div className="pt-4 border-t border-[#D2F3E3] dark:border-[#164635] space-y-2.5">
                      <label className="text-xs font-black text-[#1E3A34] dark:text-emerald-300 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span>مساحة التدوين والتأمل الشخصي:</span>
                      </label>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {currentLesson.interactiveActivity.reflectionPrompt}
                      </p>
                      <textarea
                        rows={3}
                        value={userReflection}
                        onChange={(e) => setUserReflection(e.target.value)}
                        placeholder="دون هنا تأملك الخاص، أو خطوتك العملية القادمة (يحفظ تلقائياً في جهازك)..."
                        className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#D2F3E3] dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-[#168962] leading-relaxed"
                      />
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={handleSaveReflection}
                          className="px-4 py-2 rounded-xl bg-[#168962] hover:bg-[#126f50] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>حفظ تأملاتي في هذا الدرس</span>
                        </button>
                        {savedReflectionSuccess && (
                          <span className="text-xs text-[#168962] dark:text-emerald-400 font-bold animate-fadeIn">
                            تم الحفظ بنجاح ✓
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Download Worksheet */}
              {currentLesson.worksheetDownloadUrl && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 text-xs shadow-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Download className="w-4 h-4 text-[#154F9C]" />
                    <span>كراسة التمارين والأنشطة الخاصة بهذه المحطة جاهزة للتحميل (PDF)</span>
                  </div>
                  <a
                    href={currentLesson.worksheetDownloadUrl}
                    download
                    className="px-4 py-2 rounded-xl bg-[#154F9C] hover:bg-[#103D7A] text-white font-bold transition"
                  >
                    تحميل الكراسة
                  </a>
                </div>
              )}

              {/* Navigation Bar (Previous & Next) */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                {prevItem ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveLessonId(prevItem.lesson.id);
                      setActiveModuleId(prevItem.module.id);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    <ChevronRight className="w-4 h-4 rtl:rotate-0" />
                    <span>المحطة السابقة: {prevItem.lesson.title}</span>
                  </button>
                ) : (
                  <span />
                )}

                {nextItem ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleComplete(currentLesson.id);
                      setActiveLessonId(nextItem.lesson.id);
                      setActiveModuleId(nextItem.module.id);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#168962] hover:bg-[#126f50] text-white text-xs font-black transition cursor-pointer shadow-md"
                  >
                    <span>المحطة التالية: {nextItem.lesson.title}</span>
                    <ChevronLeft className="w-4 h-4 rtl:rotate-0" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <Award className="w-4 h-4" />
                    <span>مبارك! أتممت كافة محطات هذا البرنامج 🎓</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-16 text-center text-slate-500">اختر محطة من القائمة للبدء</div>
          )}
        </main>

        {/* 3. Side Syllabus List */}
        {isSidebarOpen && (
          <aside className="w-80 lg:w-96 bg-white dark:bg-[#0E1524] border-r border-slate-200/80 dark:border-slate-800 flex flex-col shrink-0 animate-fadeIn overflow-hidden text-right shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#154F9C] dark:text-sky-400" />
                <span>شجرة المحطات والدروس ({totalLessonsCount})</span>
              </h3>
              <span className="text-[11px] font-mono text-[#168962] dark:text-emerald-400 font-bold">
                {completedCount}/{totalLessonsCount} مكتمل
              </span>
            </div>

            {/* Modules List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {course.syllabus.map((mod) => {
                const isModOpen = activeModuleId === mod.id;
                const modCompletedCount = mod.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
                const isModAllCompleted = mod.lessons.length > 0 && modCompletedCount === mod.lessons.length;

                return (
                  <div
                    key={mod.id}
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveModuleId(isModOpen ? '' : mod.id)}
                      className="w-full p-3.5 text-right flex items-center justify-between gap-3 hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base">{mod.icon}</span>
                        <div className="truncate">
                          <span className={`text-[10px] font-bold block ${mod.badgeColor}`}>
                            المحطة {mod.num}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                            {mod.title}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isModAllCompleted && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        )}
                        {isModOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </button>

                    {/* Module Lessons */}
                    {isModOpen && (
                      <div className="bg-white dark:bg-[#080C14] border-t border-slate-100 dark:border-slate-800 p-2 space-y-1">
                        {mod.lessons.map((lesson) => {
                          const isActive = activeLessonId === lesson.id;
                          const isCompleted = completedLessonIds.includes(lesson.id);

                          return (
                            <button
                              key={lesson.id}
                              type="button"
                              onClick={() => {
                                setActiveLessonId(lesson.id);
                                setActiveModuleId(mod.id);
                              }}
                              className={`w-full p-2.5 rounded-xl text-right transition cursor-pointer flex items-start gap-2.5 ${
                                isActive
                                  ? 'bg-[#154F9C] text-white shadow-xs'
                                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                              }`}
                            >
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleComplete(lesson.id);
                                }}
                                className="cursor-pointer mt-0.5 shrink-0"
                                title="تحديد كمكتمل"
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                                ) : (
                                  <span className={`w-3.5 h-3.5 rounded-full border block ${isActive ? 'border-white/60' : 'border-slate-400'}`} />
                                )}
                              </span>

                              <div className="min-w-0 flex-1">
                                <span className={`text-xs block leading-relaxed ${isActive ? 'font-black text-white' : 'font-medium text-slate-800 dark:text-slate-200'}`}>
                                  {lesson.title}
                                </span>
                                <span className={`text-[10px] font-mono mt-0.5 block ${isActive ? 'text-sky-200' : 'text-slate-400'}`}>
                                  {lesson.duration}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Direct Consultation Link */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 text-xs space-y-2">
              <span className="text-slate-500 dark:text-slate-400 font-bold block">متابعة إرشادية خاصة:</span>
              <Link
                href="/booking"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold transition shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>حجز جلسة خاصة مع المستشار</span>
              </Link>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
