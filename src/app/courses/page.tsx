'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  Search,
  ArrowLeft,
  ChevronLeft,
  Layers,
  Award,
  Play,
  Filter,
  Check,
  ShieldCheck,
  HelpCircle,
  MessageCircle
} from 'lucide-react';
import { allCoursesData, tracksData, Course, TrackInfo } from '@/data/coursesData';

export default function CoursesCatalogPage() {
  const [coursesList, setCoursesList] = useState<Course[]>(allCoursesData);
  const [tracksList, setTracksList] = useState<TrackInfo[]>(tracksData);
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch dynamic courses if updated via admin
  React.useEffect(() => {
    fetch('/api/admin/courses')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.courses) && data.courses.length > 0) {
          setCoursesList(data.courses);
        }
        if (Array.isArray(data.tracks) && data.tracks.length > 0) {
          setTracksList(data.tracks);
        }
      })
      .catch(() => {});
  }, []);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return coursesList.filter((course) => {
      // Track filter
      if (selectedTrack !== 'all' && course.trackId !== selectedTrack) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = course.title.toLowerCase().includes(q);
        const subMatch = course.subtitle.toLowerCase().includes(q);
        const overviewMatch = course.overview.toLowerCase().includes(q);
        const trackMatch = course.trackLabel.toLowerCase().includes(q);
        if (!titleMatch && !subMatch && !overviewMatch && !trackMatch) {
          return false;
        }
      }

      return true;
    });
  }, [coursesList, selectedTrack, searchQuery]);

  return (
    <main className="min-h-screen bg-[#FDFCFB] dark:bg-[#0A0E17] text-slate-800 dark:text-slate-100 flex flex-col antialiased selection:bg-[#154F9C]/10 selection:text-[#154F9C]">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/70 dark:border-slate-800/80 bg-linear-to-b from-[#EDF5FD]/60 via-[#FDFCFB] to-transparent dark:from-[#122238]/30 dark:via-[#0A0E17]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#154F9C]/10 dark:bg-[#154F9C]/30 text-[#154F9C] dark:text-sky-300 border border-[#154F9C]/20 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#154F9C] dark:text-sky-400" />
            <span>أكاديمية أ. جلال أحمد للتمكين الإنساني والأسري</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight">
            مسارات وبرامج متخصصة <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#154F9C] via-[#4E7E76] to-[#168962]">
              لبناء الإنسان واستقرار الأسرة
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
            برامج تدريبية وتطبيقية مؤصلة تجمع بين النظريات النفسية الحديثة والقيم الأصيلة، صُممت لنقل المفاهيم الإرشادية إلى ممارسات حياتية يومية مستدامة.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
              <Layers className="w-4 h-4 text-[#154F9C]" />
              <span>3 مسارات تخصصية كبرى</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
              <Users className="w-4 h-4 text-[#4E7E76]" />
              <span>+1,850 مستفيد ومتدرب</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>4.95 تقييم المستفيدين العام</span>
            </div>
          </div>
        </div>
      </section>

      {/* Track Switcher & Search Bar */}
      <section className="py-8 bg-white/60 dark:bg-[#0E1524]/60 border-b border-slate-200/60 dark:border-slate-800/80 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Tracks Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedTrack('all')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition shrink-0 cursor-pointer ${
                selectedTrack === 'all'
                  ? 'bg-[#154F9C] text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              كافة البرامج ({coursesList.length})
            </button>

            {tracksList.map((tr) => (
              <button
                key={tr.id}
                type="button"
                onClick={() => setSelectedTrack(tr.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition shrink-0 cursor-pointer flex items-center gap-2 ${
                  selectedTrack === tr.id
                    ? 'bg-[#154F9C] text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{tr.title}</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في البرامج والمحطات..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[#154F9C]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                مسح
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Courses Grid Section */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 w-full flex-1">
        {filteredCourses.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">لا توجد برامج مطابقة لبحثك</h3>
            <p className="text-xs text-slate-500">جرب مسح البحث أو تصفح مسار آخر من الأعلى.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1 text-right"
              >
                {/* Card Top Banner */}
                <div className="p-6 sm:p-7 space-y-4">
                  {/* Badges Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-[#154F9C]/10 dark:bg-[#154F9C]/30 text-[#154F9C] dark:text-sky-300 font-bold border border-[#154F9C]/20">
                      {course.trackLabel}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
                      {course.badge}
                    </span>
                  </div>

                  {/* Course Title & Subtitle */}
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-[#154F9C] dark:group-hover:text-sky-400 transition leading-snug">
                      <Link href={`/courses/${course.slug}`}>
                        {course.title}
                      </Link>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {course.subtitle}
                    </p>
                  </div>

                  {/* Duration & Rating */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{course.rating}</span>
                      <span className="text-slate-400 font-normal">({course.reviewsCount})</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.duration}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1 font-mono">
                      <span>{course.studentsCount}+ مسجل</span>
                    </div>
                  </div>

                  {/* Curriculum Preview Pills */}
                  <div className="pt-2 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 block">أبرز المحطات التدريبية:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {course.syllabus.slice(0, 4).map((mod) => (
                        <span
                          key={mod.id}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1"
                        >
                          <span>{mod.icon}</span>
                          <span>{mod.title}</span>
                        </span>
                      ))}
                      {course.syllabus.length > 4 && (
                        <span className="text-[11px] px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400 font-bold">
                          +{course.syllabus.length - 4} محطات إضافية
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                  <Link
                    href={`/courses/${course.slug}?mode=player`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>مشغل المحطات</span>
                  </Link>

                  <Link
                    href={`/courses/${course.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition"
                  >
                    <span>استكشف المنهج</span>
                    <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3 Dedicated Tracks Overview Cards */}
        <div className="pt-16 space-y-6 text-right">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              المسارات الإرشادية والتدريبية الثلاثة
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              اختر المسار المناسب لاحتياجك واستكشف الخطط الموجهة والبرامج المتخصصة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tracksData.map((track) => (
              <div
                key={track.id}
                className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-2xl ${track.bgColor} ${track.color} flex items-center justify-center font-bold text-lg`}>
                    {track.id === 'family' ? <Heart className="w-6 h-6" /> : track.id === 'youth' ? <Compass className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                  </div>

                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {track.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {track.description}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/courses/${track.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-[#154F9C] dark:text-sky-400 hover:underline"
                  >
                    <span>تصفح برامج المسار بالتفصيل</span>
                    <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cross Promotion: Personal Consultations */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-linear-to-r from-[#154F9C]/10 via-[#4E7E76]/10 to-[#168962]/10 border border-[#154F9C]/20 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            هل تحتاج إلى خطة إرشادية فردية أو استشارة خاصة؟
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            بالإضافة إلى البرامج التدريبية الجماعية، يقدم أ. جلال أحمد جلسات استشارية فردية وزوجية عبر قاعة Google Meet الآمنة لمناقشة التحديات الخاصة بمنتهى الخصوصية والسرية.
          </p>
          <div className="pt-2">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs sm:text-sm font-extrabold shadow-md transition"
            >
              <span>حجز جلسة استشارية خاصة</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-0" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
