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
  Share2,
  Clock,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
  Lock,
  Unlock,
  Check,
  Star,
  User,
  Heart,
  Send,
  MessageCircle,
  Compass,
  Building2,
  ShieldCheck,
  Lightbulb
} from 'lucide-react';
import { Course, CourseModule, Lesson } from '@/data/coursesData';
import { useAuth } from '@/context/AuthContext';

interface CoursePlayerViewProps {
  course: Course;
}

export default function CoursePlayerView({ course }: CoursePlayerViewProps) {
  const { user, isAuthenticated } = useAuth();

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

  // Local storage key for progress
  const storageProgressKey = `course_progress_${course.id}`;
  const storageReflectionKey = `reflection_${course.id}_${activeLessonId}`;

  // Load progress and enrollment from storage & user profile
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageProgressKey);
      if (stored) {
        setCompletedLessonIds(JSON.parse(stored));
      }
    } catch (e) {}

    // Check user profile for enrolled courses
    if (user && Array.isArray((user as any).courses)) {
      const found = (user as any).courses.some((c: any) => c.id === course.id);
      if (found) setIsEnrolled(true);
    }
  }, [course.id, user]);

  // Load reflection for active lesson
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

  // Flatten all lessons for navigation & progress calculation
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

  // Save reflection answer
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
          batchDate: 'الدفعة المفتوحة',
        }),
      });
      const data = await res.json();
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
    <div className="min-h-screen bg-[#0A0E17] text-slate-100 flex flex-col font-sans antialiased selection:bg-[#154F9C]/30 selection:text-white">
      {/* Top Learning Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0E1524]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Course Breadcrumbs & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/courses"
            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition shrink-0"
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-0" />
            <span className="hidden sm:inline">أكاديمية البرامج</span>
          </Link>

          <span className="text-slate-600">/</span>

          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#154F9C]/20 border border-[#154F9C]/30 text-sky-300 font-bold shrink-0">
            {course.trackLabel}
          </span>

          <h1 className="text-sm font-black text-white truncate max-w-[200px] sm:max-w-md">
            {course.title}
          </h1>
        </div>

        {/* Right: Progress & Enrollment Status */}
        <div className="flex items-center gap-3">
          {/* Progress Indicator */}
          <div className="hidden md:flex items-center gap-3 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">الإنجاز:</span>
            <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <strong className="text-emerald-400 font-mono">{progressPercent}%</strong>
          </div>

          {/* Enroll / Enrolled Button */}
          {isEnrolled ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>أنت مسجل في البرنامج</span>
            </span>
          ) : (
            <button
              type="button"
              disabled={isEnrolling}
              onClick={handleEnroll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white text-xs font-black transition shadow-md cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEnrolling ? 'جارٍ التسجيل...' : 'تسجيل مجاني في الدفعة'}</span>
            </button>
          )}

          {/* Toggle Sidebar Button */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            title={isSidebarOpen ? 'إخفاء شجرة المحتوى' : 'إظهار شجرة المحتوى'}
          >
            <Layers className="w-4 h-4 text-sky-400" />
          </button>
        </div>
      </header>

      {/* Success Banner */}
      {enrollSuccessMsg && (
        <div className="bg-emerald-950/80 border-b border-emerald-800 text-emerald-300 text-xs font-bold py-2.5 px-4 text-center animate-fadeIn flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{enrollSuccessMsg}</span>
          <Link href="/profile" className="underline mr-2 text-white">
            عرض في ملفي الشخصي ←
          </Link>
        </div>
      )}

      {/* Main Learning Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* 1. Main Lesson Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 space-y-8 max-w-5xl mx-auto">
          {currentLesson ? (
            <div className="space-y-8 animate-fadeIn">
              {/* Module & Station Banner */}
              <div className="p-6 rounded-3xl bg-linear-to-br from-[#0E1524] to-[#0A101C] border border-slate-800 space-y-3 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-2 font-mono">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    <span>المحطة {currentModule?.num} من {course.syllabus.length}</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>{currentLesson.duration}</span>
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-2xl flex items-center justify-center shrink-0">
                    {currentModule?.icon || '📖'}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {currentLesson.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                      {currentModule?.description}
                    </p>
                  </div>
                </div>

                {/* Mark as Completed Button */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(currentLesson.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                      completedLessonIds.includes(currentLesson.id)
                        ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                        : 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        completedLessonIds.includes(currentLesson.id) ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    />
                    <span>
                      {completedLessonIds.includes(currentLesson.id) ? 'تم إنجاز هذه المحطة بنجاح ✓' : 'تحديد كمكتمل ومتابعة'}
                    </span>
                  </button>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>المدرب:</span>
                    <strong className="text-slate-300">{course.instructor.name}</strong>
                  </div>
                </div>
              </div>

              {/* Lesson Summary & Core Concept */}
              <div className="p-6 rounded-3xl bg-[#0E1524] border border-slate-800 space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-sky-400" />
                  <span>المفهوم الجوهري وخلاصة المحطة:</span>
                </h3>
                <p className="text-sm text-slate-300 leading-loose">
                  {currentLesson.summary}
                </p>

                {/* Key Takeaways */}
                {currentLesson.keyTakeaways && currentLesson.keyTakeaways.length > 0 && (
                  <div className="pt-3 space-y-2.5">
                    <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>أهم المخرجات التطبيقية المستفادة:</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {currentLesson.keyTakeaways.map((takeaway, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive H5P-Style Activity Card */}
              {currentLesson.interactiveActivity && (
                <div className="p-6 rounded-3xl bg-linear-to-br from-[#121E33] to-[#0A101C] border border-[#154F9C]/40 space-y-5 shadow-lg">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-base font-black text-sky-300 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-sky-400" />
                      <span>تمرين التفاعل والتقييم الذاتي (Interactive Exercise)</span>
                    </h3>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold">
                      نشاط تطبيقي
                    </span>
                  </div>

                  {/* Multiple Choice Question (if present) */}
                  {currentLesson.interactiveActivity.question && (
                    <div className="space-y-3">
                      <p className="text-sm font-bold text-white leading-relaxed">
                        {currentLesson.interactiveActivity.question}
                      </p>

                      {currentLesson.interactiveActivity.options && (
                        <div className="space-y-2">
                          {currentLesson.interactiveActivity.options.map((opt, oIdx) => {
                            const isSelected = selectedQuizOption === oIdx;
                            const isCorrect = currentLesson.interactiveActivity?.correctOptionIndex === oIdx;

                            let optStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                            if (quizSubmitted) {
                              if (isCorrect) optStyle = 'bg-emerald-950/60 border-emerald-600 text-emerald-200';
                              else if (isSelected && !isCorrect) optStyle = 'bg-rose-950/60 border-rose-600 text-rose-200';
                            } else if (isSelected) {
                              optStyle = 'bg-[#154F9C]/30 border-[#154F9C] text-white';
                            }

                            return (
                              <button
                                key={oIdx}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() => setSelectedQuizOption(oIdx)}
                                className={`w-full p-3.5 rounded-2xl border text-xs font-bold text-right transition cursor-pointer flex items-center justify-between gap-3 ${optStyle}`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                              </button>
                            );
                          })}

                          {!quizSubmitted && selectedQuizOption !== null && (
                            <button
                              type="button"
                              onClick={() => setQuizSubmitted(true)}
                              className="mt-3 px-5 py-2 rounded-xl bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold transition cursor-pointer"
                            >
                              التحقق من الإجابة والتحليل
                            </button>
                          )}

                          {quizSubmitted && currentLesson.interactiveActivity.explanation && (
                            <div className="mt-3 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-200 leading-relaxed animate-fadeIn">
                              <strong className="block font-bold mb-1">💡 التحليل الإرشادي والتأصيل:</strong>
                              {currentLesson.interactiveActivity.explanation}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reflection Textarea Prompt */}
                  {currentLesson.interactiveActivity.reflectionPrompt && (
                    <div className="pt-4 border-t border-slate-800 space-y-2.5">
                      <label className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        <span>مساحة التأمل والتدوين الخاص:</span>
                      </label>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {currentLesson.interactiveActivity.reflectionPrompt}
                      </p>
                      <textarea
                        rows={3}
                        value={userReflection}
                        onChange={(e) => setUserReflection(e.target.value)}
                        placeholder="دون هنا تأملك الخاص، ما استوقفك، أو خطوتك العملية القادمة (يحفظ تلقائياً في جهازك)..."
                        className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-[#154F9C] leading-relaxed"
                      />
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={handleSaveReflection}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>حفظ تأملاتي في هذا الدرس</span>
                        </button>
                        {savedReflectionSuccess && (
                          <span className="text-xs text-emerald-400 font-bold animate-fadeIn">
                            تم الحفظ بنجاح ✓
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Download Worksheet (if available) */}
              {currentLesson.worksheetDownloadUrl && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Download className="w-4 h-4 text-sky-400" />
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

              {/* Navigation Between Lessons (Next & Prev) */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
                {prevItem ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveLessonId(prevItem.lesson.id);
                      setActiveModuleId(prevItem.module.id);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition cursor-pointer"
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
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition cursor-pointer shadow-md"
                  >
                    <span>المحطة التالية: {nextItem.lesson.title}</span>
                    <ChevronLeft className="w-4 h-4 rtl:rotate-0" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-800">
                    <Award className="w-4 h-4" />
                    <span>وصلت لختام محطات هذا البرنامج التدريبي 🎓</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-16 text-center text-slate-500">اختر محطة من القائمة للبدء</div>
          )}
        </main>

        {/* 2. Collapsible Side Syllabus / Modules List */}
        {isSidebarOpen && (
          <aside className="w-80 lg:w-96 bg-[#0E1524] border-r border-slate-800 flex flex-col shrink-0 animate-fadeIn overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>شجرة المحطات والدروس ({totalLessonsCount})</span>
              </h3>
              <span className="text-[11px] font-mono text-emerald-400">
                {completedCount}/{totalLessonsCount} مكتمل
              </span>
            </div>

            {/* Modules Accordion */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {course.syllabus.map((mod) => {
                const isModOpen = activeModuleId === mod.id;
                const modCompletedCount = mod.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
                const isModAllCompleted = mod.lessons.length > 0 && modCompletedCount === mod.lessons.length;

                return (
                  <div
                    key={mod.id}
                    className="rounded-2xl border border-slate-800/80 bg-slate-900/40 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveModuleId(isModOpen ? '' : mod.id)}
                      className="w-full p-3.5 text-right flex items-center justify-between gap-3 hover:bg-slate-800/50 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base">{mod.icon}</span>
                        <div className="truncate">
                          <span className={`text-[10px] font-bold block ${mod.badgeColor}`}>
                            المحطة {mod.num}
                          </span>
                          <span className="text-xs font-bold text-white block truncate">
                            {mod.title}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isModAllCompleted && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                        {isModOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </button>

                    {/* Module Lessons List */}
                    {isModOpen && (
                      <div className="bg-[#080C14] border-t border-slate-800/80 p-2 space-y-1">
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
                              className={`w-full p-2.5 rounded-xl text-right text-xs transition cursor-pointer flex items-center justify-between gap-2.5 ${
                                isActive
                                  ? 'bg-[#154F9C] text-white font-bold shadow-md'
                                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 truncate">
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleComplete(lesson.id);
                                  }}
                                  className="cursor-pointer"
                                  title="تحديد كمكتمل"
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  ) : (
                                    <span className="w-3.5 h-3.5 rounded-full border border-slate-600 block shrink-0" />
                                  )}
                                </span>
                                <span className="truncate">{lesson.title}</span>
                              </div>

                              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                                {lesson.duration}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Direct Contact & Consultant Helpline */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-xs space-y-2">
              <span className="text-slate-400 font-bold block">متابعة خاصة مع المستشار:</span>
              <Link
                href="/booking"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold transition"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>حجز استشارة خاصة مع الدورة</span>
              </Link>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
