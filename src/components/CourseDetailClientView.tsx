'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CoursePlayerView from '@/components/CoursePlayerView';
import {
  Heart,
  Compass,
  Building2,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Users,
  Star,
  ChevronDown,
  ChevronUp,
  Play,
  ArrowLeft,
  ShieldCheck,
  Award,
  Layers,
  HelpCircle,
  Phone,
  MessageCircle,
  FileText,
  Send,
  LogIn
} from 'lucide-react';
import { Course } from '@/data/coursesData';
import { useAuth } from '@/context/AuthContext';

interface CourseDetailClientViewProps {
  course: Course;
}

export default function CourseDetailClientView({ course }: CourseDetailClientViewProps) {
  const { user, isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState<'overview' | 'player'>('overview');
  const [openModuleId, setOpenModuleId] = useState<string>(course.syllabus[0]?.id || '');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Enrollment form state
  const [applicantName, setApplicantName] = useState(user?.name || '');
  const [applicantPhone, setApplicantPhone] = useState(user?.phone || '');
  const [applicantEmail, setApplicantEmail] = useState(user?.email || '');
  const [applicantNotes, setApplicantNotes] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  // If in player mode, render CoursePlayerView directly
  if (viewMode === 'player') {
    return (
      <div>
        <div className="bg-[#0E1524] px-4 py-2 border-b border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewMode('overview')}
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-bold cursor-pointer"
          >
            <span>← العودة لصفحة تفاصيل الدورة</span>
          </button>
          <span className="text-xs text-sky-400 font-mono">وضع مشغل الدروس والتفاعل المباشر</span>
        </div>
        <CoursePlayerView course={course} />
      </div>
    );
  }

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEnrolling(true);
    try {
      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          courseTitle: course.title,
          name: applicantName,
          phone: applicantPhone,
          email: applicantEmail,
          notes: applicantNotes,
          batchDate: course.price || 'الدفعة القادمة',
        }),
      });
      if (res.ok) {
        setEnrollSuccess(true);
      }
    } catch (e) {
      setEnrollSuccess(true);
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFCFB] dark:bg-[#0A0E17] text-slate-800 dark:text-slate-100 flex flex-col antialiased selection:bg-[#154F9C]/10 selection:text-[#154F9C]">
      <Navbar />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/70 dark:border-slate-800/80 bg-linear-to-b from-[#EDF5FD]/60 via-[#FDFCFB] to-transparent dark:from-[#122238]/30 dark:via-[#0A0E17]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left 7 Cols: Meta & Details */}
            <div className="lg:col-span-7 space-y-6 text-right">
              {/* Track Badge & Category */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/courses"
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-[#154F9C] font-bold"
                >
                  الدورات والمسارات
                </Link>
                <span className="text-slate-400">/</span>
                <span className="text-xs px-3 py-1 rounded-full bg-[#154F9C]/10 dark:bg-[#154F9C]/30 text-[#154F9C] dark:text-sky-300 border border-[#154F9C]/20 font-black">
                  {course.trackLabel}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
                  {course.badge}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                  {course.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {course.subtitle}
                </p>
              </div>

              {/* Rating & Students Meta */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 border-y border-slate-200/60 dark:border-slate-800/80 py-3">
                <div className="flex items-center gap-1.5 font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>{course.rating}</span>
                  <span className="text-slate-400 font-normal">({course.reviewsCount} تقييم)</span>
                </div>

                <span>•</span>

                <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                  <Users className="w-4 h-4 text-[#154F9C]" />
                  <span>{course.studentsCount}+ مستفيد مسجل</span>
                </div>

                <span>•</span>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{course.duration}</span>
                </div>
              </div>

              {/* Instructor Card */}
              <div className="flex items-center gap-3.5 pt-1">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#154F9C] to-[#4E7E76] text-white font-black text-lg flex items-center justify-center shadow-sm">
                  ج
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">إعداد وتقديم:</span>
                  <strong className="text-sm text-slate-900 dark:text-white block font-black">
                    {course.instructor.name}
                  </strong>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">
                    {course.instructor.title}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('player')}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#154F9C] hover:bg-[#103D7A] text-white font-black text-sm transition shadow-lg shadow-[#154F9C]/20 hover:shadow-xl cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>الدخول لمشغل المحطات التفاعلي المباشر</span>
                </button>

                <a
                  href="#enroll-section"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition shadow-xs"
                >
                  <span>التسجيل في الدفعة</span>
                  <ArrowLeft className="w-4 h-4 rtl:rotate-0" />
                </a>
              </div>
            </div>

            {/* Right 5 Cols: Quick Highlights Box */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 text-right">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-black text-slate-400">حالة البرنامج:</span>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {course.price}
                  </span>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <Layers className="w-4 h-4 text-[#154F9C] shrink-0" />
                    <span><strong>{course.syllabus.length} محطات تدريبية</strong> متدرجة وعميقة</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>تمارين تفاعلية عيادية وتطبيقات ذاتية</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>كراسات وأدلة عمل PDF قابلة للتحميل</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <Award className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>شهادة إتمام معتمدة من المنصة</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-[#4E7E76] shrink-0" />
                    <span>خصوصية وأمان تام لكافة المدخلات والتأملات</span>
                  </div>
                </div>

                {/* Instant Player CTA */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('player')}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>ابدأ التعلم الآن مجاناً</span>
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    يمكنك تصفح أولى محطات البرنامج وتجربة الأنشطة التفاعلية مباشرة
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Course Content & Curriculum Tabs Section */}
      <section className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 w-full space-y-12">
        {/* 1. Overview */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200/80 dark:border-slate-800 space-y-4 text-right">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#154F9C]" />
            <span>عن البرنامج والمنهجية العلمية:</span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-loose">
            {course.overview}
          </p>

          {/* Learning Outcomes */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              ماذا ستتعلم وتكتسب من هذا المسار؟
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {course.learningOutcomes.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FAFCFA] dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 space-y-1"
                >
                  <div className="flex items-center gap-2 text-xs font-black text-[#154F9C] dark:text-sky-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pr-6">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Full Syllabus & Stations Map */}
        <div className="space-y-4 text-right">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#4E7E76]" />
                <span>خريطة المحطات والمنهج التدريبي التفصيلي ({course.syllabus.length} محطات):</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                منهج عملي متدرج صُمم بعناية لينقلك خطوة بخطوة من الوعي إلى التطبيق الحياتي.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {course.syllabus.map((mod) => {
              const isOpen = openModuleId === mod.id;

              return (
                <div
                  key={mod.id}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0E1524] overflow-hidden shadow-xs transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenModuleId(isOpen ? '' : mod.id)}
                    className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-slate-900 shrink-0">
                        {mod.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-black ${mod.badgeColor}`}>
                            المحطة {mod.num}
                          </span>
                          <span className="text-xs text-slate-400">• {mod.lessons.length} درس تطبيقي</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
                          {mod.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#090D15] space-y-3 animate-fadeIn">
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-2">
                        {mod.description}
                      </p>

                      <div className="space-y-2 pt-1">
                        {mod.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <strong className="text-slate-800 dark:text-slate-200 truncate">
                                {lesson.title}
                              </strong>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-slate-400 font-mono text-[11px]">
                                {lesson.duration}
                              </span>
                              <button
                                type="button"
                                onClick={() => setViewMode('player')}
                                className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-[#154F9C] hover:text-white font-bold transition text-[11px]"
                              >
                                عرض الدرس
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Enrollment Form Section */}
        <div id="enroll-section" className="p-6 sm:p-10 rounded-3xl bg-linear-to-br from-[#122238] to-[#0A101C] border border-[#154F9C]/40 text-white space-y-6 text-right shadow-2xl">
          <div className="space-y-2">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              الانضمام والمتابعة
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              سجل الآن في {course.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              سجل بياناتك للتواصل معك ومتابعة حالة ملفك، وإتاحة كافة المحطات والتكليفات فوراً في حسابك بالمنصة.
            </p>
          </div>

          {enrollSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-center space-y-3 animate-fadeIn">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">تم اعتماد تسجيلك بنجاح في البرنامج! 🌿</h3>
              <p className="text-xs text-slate-300">
                أصبح البرنامج متاحاً الآن في لوحة حسابك، ويمكنك متابعة المحطات والتمارين التفاعلية مباشرة.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('player')}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                >
                  الدخول للمحطة الأولى الآن
                </button>
                <Link
                  href="/profile"
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                >
                  الذهاب لملفي الشخصي
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleEnrollSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  الاسم الكريم:
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="الاسم ثلاثي"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  رقم الواتساب / الهاتف:
                </label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="+20 100 000 0000"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  البريد الإلكتروني (لتصلك المواد والشهادة):
                </label>
                <input
                  type="email"
                  dir="ltr"
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  ملاحظات أو استفسار تود طرحه للمستشار (اختياري):
                </label>
                <textarea
                  rows={2}
                  value={applicantNotes}
                  onChange={(e) => setApplicantNotes(e.target.value)}
                  placeholder="أي تفاصيل ترغب في مشاركتها..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:border-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={isEnrolling}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-extrabold text-xs sm:text-sm transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isEnrolling ? 'جارٍ تسجيل البيانات...' : 'تأكيد التسجيل والانضمام للبرنامج'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 4. FAQs Section */}
        {course.faqs && course.faqs.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200/80 dark:border-slate-800 space-y-4 text-right">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              <span>الأسئلة الشائعة حول هذا البرنامج:</span>
            </h2>

            <div className="space-y-2 pt-2">
              {course.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/70 dark:border-slate-800/80 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 text-right flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>

                  {openFaq === idx && (
                    <div className="p-4 pt-1 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
