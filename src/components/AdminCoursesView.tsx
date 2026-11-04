'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  Clock,
  Sparkles,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Phone,
  Mail,
  Send,
  ExternalLink,
  Edit3,
  Check,
  X,
  Filter,
  Layers,
  Heart,
  Compass,
  Building2,
  Play
} from 'lucide-react';
import { allCoursesData, Course } from '@/data/coursesData';

interface AdminCoursesViewProps {
  clientProfiles: any[];
  siteSettings: any;
  onUpdateSettings: (newSettings: any) => Promise<void>;
  onRefreshData: () => Promise<void>;
}

export default function AdminCoursesView({
  clientProfiles = [],
  siteSettings = {},
  onUpdateSettings,
  onRefreshData,
}: AdminCoursesViewProps) {
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [editingBatchCourseId, setEditingBatchCourseId] = useState<string | null>(null);
  const [batchDateInput, setBatchDateInput] = useState<string>('');
  const [savingBatch, setSavingBatch] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Manual Enroll Form State
  const [manualClientId, setManualClientId] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualCourseId, setManualCourseId] = useState(allCoursesData[0]?.id || 'rifq-mithaq');
  const [manualBatchDate, setManualBatchDate] = useState('الدفعة الحالية');
  const [isSubmittingEnroll, setIsSubmittingEnroll] = useState(false);

  // Extract all enrolled students across all client profiles
  const enrolledStudents = useMemo(() => {
    const list: {
      profileId: string;
      studentName: string;
      studentPhone: string;
      studentEmail: string;
      courseId: string;
      courseTitle: string;
      batchDate: string;
      enrolledAt: string;
      progress: number;
    }[] = [];

    clientProfiles.forEach((profile) => {
      if (Array.isArray(profile.courses)) {
        profile.courses.forEach((c: any) => {
          list.push({
            profileId: profile.id,
            studentName: profile.name || 'مستفيد',
            studentPhone: profile.phone || '',
            studentEmail: profile.email || '',
            courseId: c.id,
            courseTitle: c.title || c.id,
            batchDate: c.batchDate || 'الدفعة الحالية',
            enrolledAt: c.enrolledAt || profile.createdAt?.split('T')[0] || 'مؤخراً',
            progress: c.progress || 0,
          });
        });
      }
    });

    return list;
  }, [clientProfiles]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return enrolledStudents.filter((student) => {
      // Course filter
      if (selectedCourseFilter !== 'all' && student.courseId !== selectedCourseFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = student.studentName.toLowerCase().includes(q);
        const phoneMatch = student.studentPhone.replace(/[^\d]/g, '').includes(q.replace(/[^\d]/g, ''));
        const emailMatch = student.studentEmail.toLowerCase().includes(q);
        const courseMatch = student.courseTitle.toLowerCase().includes(q);
        if (!nameMatch && !phoneMatch && !emailMatch && !courseMatch) {
          return false;
        }
      }

      return true;
    });
  }, [enrolledStudents, selectedCourseFilter, searchQuery]);

  // Counts by Course
  const mithaqCount = enrolledStudents.filter((s) => s.courseId === 'rifq-mithaq' || s.courseId === 'mithaq').length;
  const premaritalCount = enrolledStudents.filter((s) => s.courseId === 'rifq-premarital' || s.courseId === 'premarital').length;
  const youthCount = enrolledStudents.filter((s) => s.courseId === 'youth-identity').length;
  const institutionsCount = enrolledStudents.filter((s) => s.courseId === 'school-positive-discipline').length;

  // Save Batch Date in site settings
  const handleSaveBatchDate = async (courseId: string) => {
    if (!batchDateInput.trim()) return;
    setSavingBatch(true);
    try {
      const fieldKey =
        courseId === 'rifq-mithaq' || courseId === 'mithaq'
          ? 'mithaqNextBatch'
          : courseId === 'rifq-premarital' || courseId === 'premarital'
          ? 'premaritalNextBatch'
          : courseId === 'youth-identity'
          ? 'youthNextBatch'
          : 'institutionsNextBatch';

      await onUpdateSettings({ [fieldKey]: batchDateInput.trim() });
      setEditingBatchCourseId(null);
      setActionSuccessMsg(`تم تحديث موعد الدفعة لـ (${batchDateInput}) بنجاح ✓`);
      setTimeout(() => setActionSuccessMsg(''), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingBatch(false);
    }
  };

  // Remove / Unenroll Student
  const handleRemoveEnrollment = async (student: any) => {
    if (!confirm(`هل أنت متأكد من إلغاء قيد المستفيد (${student.studentName}) من دورة (${student.courseTitle})؟`)) {
      return;
    }

    try {
      const targetProfile = clientProfiles.find((p) => p.id === student.profileId);
      if (!targetProfile) return;

      const updatedCourses = (targetProfile.courses || []).filter((c: any) => c.id !== student.courseId);

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: student.profileId,
          courses: updatedCourses,
        }),
      });

      if (res.ok) {
        setActionSuccessMsg(`تم إلغاء قيد المستفيد بنجاح ✓`);
        setTimeout(() => setActionSuccessMsg(''), 3000);
        await onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Manual Enrollment Submit
  const handleManualEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingEnroll(true);

    try {
      const targetCourse = allCoursesData.find((c) => c.id === manualCourseId) || allCoursesData[0];
      let nameToSend = manualName;
      let phoneToSend = manualPhone;
      let emailToSend = manualEmail;

      if (manualClientId) {
        const found = clientProfiles.find((p) => p.id === manualClientId);
        if (found) {
          nameToSend = found.name;
          phoneToSend = found.phone;
          emailToSend = found.email;
        }
      }

      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: targetCourse.id,
          courseTitle: targetCourse.title,
          name: nameToSend,
          phone: phoneToSend,
          email: emailToSend,
          batchDate: manualBatchDate,
        }),
      });

      if (res.ok) {
        setIsEnrollModalOpen(false);
        setManualName('');
        setManualPhone('');
        setManualEmail('');
        setManualClientId('');
        setActionSuccessMsg(`تم إسناد الدورة للمستفيد بنجاح ✓`);
        setTimeout(() => setActionSuccessMsg(''), 3000);
        await onRefreshData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingEnroll(false);
    }
  };

  // WhatsApp shortcut for student
  const openWhatsAppStudent = (student: any) => {
    const cleanPhone = (student.studentPhone || '').replace(/[^\d]/g, '');
    const msg = `السلام عليكم ورحمة الله وبركاته، أهلاً بك أستاذ(ة) ${student.studentName} الكريم(ة) 🌿
معك المستشار جلال أحمد بخصوص متابعة دورتك التدريبية (${student.courseTitle}) ضمن أكاديمية المنصة.

يسعدني تواصلك وتزويدك بأي مساندة أو استفسار بخصوص محطات البرنامج ومواعيد اللقاءات المباشرة.
أهلاً بك دائماً.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6 text-right animate-fadeIn">
      {/* 1. Header Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0E1524] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#154F9C]/20 border border-[#154F9C]/30 text-sky-400 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">
              إدارة أكاديمية الكورسات والمسارات التفاعلية
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              التحكم في مواعيد الدفعات، متابعة المتدربين المسجلين، إسناد البرامج للمستفيدين، والتواصل السريع عبر واتساب.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsEnrollModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة متدرب لدورة يدوياً +</span>
          </button>

          <Link
            href="/courses"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
          >
            <span>معاينة الأكاديمية</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div
          onClick={() => setSelectedCourseFilter('all')}
          className={`p-5 rounded-3xl border transition cursor-pointer ${
            selectedCourseFilter === 'all'
              ? 'bg-[#154F9C]/20 border-[#154F9C] shadow-lg'
              : 'bg-[#0E1524] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
            <span>إجمالي المتدربين المسجلين</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {enrolledStudents.length}
            <span className="text-xs font-normal text-slate-400 mr-2">متدرب بالمنصة</span>
          </div>
          <div className="text-[11px] text-sky-400/80 mt-1">
            <span>عبر 4 برامج تخصصية</span>
          </div>
        </div>

        {/* Mithaq Enrollees */}
        <div
          onClick={() => setSelectedCourseFilter('rifq-mithaq')}
          className={`p-5 rounded-3xl border transition cursor-pointer ${
            selectedCourseFilter === 'rifq-mithaq'
              ? 'bg-[#0F291E] border-emerald-500 shadow-lg'
              : 'bg-[#0E1524] border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-2">
            <span>رحلة رِفق | ميثاق</span>
            <Heart className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-white">
            {mithaqCount}
            <span className="text-xs font-normal text-slate-400 mr-2">مشترك</span>
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            <span>الدفعة: {siteSettings.mithaqNextBatch || 'نوفمبر 2026'}</span>
          </div>
        </div>

        {/* Premarital Enrollees */}
        <div
          onClick={() => setSelectedCourseFilter('rifq-premarital')}
          className={`p-5 rounded-3xl border transition cursor-pointer ${
            selectedCourseFilter === 'rifq-premarital'
              ? 'bg-[#2D1B06] border-amber-500 shadow-lg'
              : 'bg-[#0E1524] border-slate-800 hover:border-amber-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-2">
            <span>تأهيل المقبلين على الزواج</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-white">
            {premaritalCount}
            <span className="text-xs font-normal text-slate-400 mr-2">مشترك</span>
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">
            <span>الدفعة: {siteSettings.premaritalNextBatch || 'متاحة للتسجيل'}</span>
          </div>
        </div>

        {/* Youth & Institutions */}
        <div
          onClick={() => setSelectedCourseFilter('youth-identity')}
          className={`p-5 rounded-3xl border transition cursor-pointer ${
            selectedCourseFilter === 'youth-identity'
              ? 'bg-[#201938] border-purple-500 shadow-lg'
              : 'bg-[#0E1524] border-slate-800 hover:border-purple-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-purple-400 font-bold mb-2">
            <span>مسار اليافعين والمؤسسات</span>
            <Compass className="w-4 h-4" />
          </div>
          <div className="text-3xl font-black text-white">
            {youthCount + institutionsCount}
            <span className="text-xs font-normal text-slate-400 mr-2">مشترك</span>
          </div>
          <div className="text-[11px] text-purple-400/80 mt-1">
            <span>اليافعين: {youthCount} • المؤسسات: {institutionsCount}</span>
          </div>
        </div>
      </div>

      {/* 3. Course Control Cards (Edit Batches) */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-sky-400" />
          <span>البرامج الأساسية والتحكم في الدفعات:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {allCoursesData.map((course) => {
            const isEditing = editingBatchCourseId === course.id;
            const currentBatch =
              course.id === 'rifq-mithaq' || course.id === 'mithaq'
                ? siteSettings.mithaqNextBatch || 'نوفمبر 2026'
                : course.id === 'rifq-premarital' || course.id === 'premarital'
                ? siteSettings.premaritalNextBatch || 'متاحة للتسجيل'
                : course.id === 'youth-identity'
                ? siteSettings.youthNextBatch || 'قيد الإعداد'
                : siteSettings.institutionsNextBatch || 'تعاقد مؤسسي';

            const countForThis = enrolledStudents.filter((s) => s.courseId === course.id || s.courseId === course.slug).length;

            return (
              <div
                key={course.id}
                className="p-5 rounded-3xl bg-[#0E1524] border border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-sky-300 font-bold">
                      {course.trackLabel}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {countForThis} مشترك
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-white leading-snug">
                    {course.title}
                  </h4>

                  {/* Batch Date Editor */}
                  <div className="pt-2 text-xs">
                    <span className="text-slate-400 text-[11px] block mb-1">موعد الدفعة المعلن بالموقع:</span>
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={batchDateInput}
                          onChange={(e) => setBatchDateInput(e.target.value)}
                          placeholder="مثلاً: نوفمبر 2026"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                        />
                        <button
                          type="button"
                          disabled={savingBatch}
                          onClick={() => handleSaveBatchDate(course.id)}
                          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                          title="حفظ الموعد"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingBatchCourseId(null)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                          title="إلغاء"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 font-bold text-slate-200">
                        <span>{currentBatch}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBatchCourseId(course.id);
                            setBatchDateInput(currentBatch);
                          }}
                          className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>تعديل</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct Links */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                  <Link
                    href={`/courses/${course.slug}?mode=player`}
                    target="_blank"
                    className="flex items-center gap-1 text-emerald-400 hover:underline font-bold"
                  >
                    <Play className="w-3.5 h-3.5 fill-emerald-400" />
                    <span>مشغل المحطات</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSelectedCourseFilter(course.id)}
                    className="text-slate-400 hover:text-white text-[11px] font-bold"
                  >
                    عرض المشتركين ←
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Enrolled Students Directory */}
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#0E1524] border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المتدرب، رقم الهاتف، الإيميل، أو اسم الدورة..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-[#154F9C]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                مسح
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setSelectedCourseFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                selectedCourseFilter === 'all'
                  ? 'bg-[#154F9C] text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              الكل ({enrolledStudents.length})
            </button>

            <button
              type="button"
              onClick={() => setSelectedCourseFilter('rifq-mithaq')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                selectedCourseFilter === 'rifq-mithaq'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              ميثاق ({mithaqCount})
            </button>

            <button
              type="button"
              onClick={() => setSelectedCourseFilter('rifq-premarital')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                selectedCourseFilter === 'rifq-premarital'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              المقبلين ({premaritalCount})
            </button>

            <button
              type="button"
              onClick={() => setSelectedCourseFilter('youth-identity')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                selectedCourseFilter === 'youth-identity'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              اليافعين ({youthCount})
            </button>
          </div>
        </div>

        {/* Students List Cards */}
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#0E1524] border border-slate-800 space-y-2">
            <Users className="w-8 h-8 text-slate-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-300">لا يوجد متدربون مطابقون للبحث</h4>
            <p className="text-xs text-slate-500">جرب مسح معايير البحث أو إضافة متدرب جديد عبر الزر أعلاه.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map((student, idx) => {
              const cleanPhone = (student.studentPhone || '').replace(/[^\d]/g, '');

              return (
                <div
                  key={`${student.profileId}-${student.courseId}-${idx}`}
                  className="p-5 rounded-3xl bg-[#0E1524] border border-slate-800 space-y-3.5 shadow-sm hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#154F9C]/20 border border-[#154F9C]/30 text-white font-bold flex items-center justify-center shrink-0">
                        {student.studentName.charAt(0) || 'م'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{student.studentName}</h4>
                        <span className="text-[11px] text-slate-400 font-mono" dir="ltr">
                          {student.studentPhone || student.studentEmail || 'لا توجد وسيلة تواصل'}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-sky-300">
                      {student.courseTitle}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>الدفعة: <strong>{student.batchDate}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>تاريخ القيد: {student.enrolledAt}</span>
                    </div>
                  </div>

                  {/* Quick Student Actions: WhatsApp & Remove */}
                  <div className="flex items-center justify-between pt-1">
                    {student.studentPhone ? (
                      <button
                        type="button"
                        onClick={() => openWhatsAppStudent(student)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>واتساب المتدرب</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">لا رقم مسجل</span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveEnrollment(student)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                      title="إلغاء قيد المستفيد من الدورة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Manual Enrollment Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-[#0E1524] border border-slate-800 p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-black text-sm">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <span>إضافة متدرب لدورة يدوياً من الإدارة</span>
              </div>
              <button
                type="button"
                onClick={() => setIsEnrollModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualEnrollSubmit} className="space-y-4 text-xs">
              {/* Select from existing client */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  اختر من المستفيدين المسجلين مسبقاً (اختياري):
                </label>
                <select
                  value={manualClientId}
                  onChange={(e) => {
                    setManualClientId(e.target.value);
                    const found = clientProfiles.find((p) => p.id === e.target.value);
                    if (found) {
                      setManualName(found.name || '');
                      setManualPhone(found.phone || '');
                      setManualEmail(found.email || '');
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                >
                  <option value="">-- متدرب جديد أو كتابة يدوية --</option>
                  {clientProfiles.map((cl) => (
                    <option key={cl.id} value={cl.id}>
                      {cl.name} ({cl.phone || cl.email || 'بدون هاتف'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">الاسم الكريم:</label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="اسم المتدرب"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">رقم الهاتف / الواتساب:</label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="+20 100 000 0000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">البريد الإلكتروني:</label>
                  <input
                    type="email"
                    dir="ltr"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">الدورة التدريبية:</label>
                  <select
                    value={manualCourseId}
                    onChange={(e) => setManualCourseId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                  >
                    {allCoursesData.map((crs) => (
                      <option key={crs.id} value={crs.id}>
                        {crs.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">الدفعة:</label>
                  <input
                    type="text"
                    value={manualBatchDate}
                    onChange={(e) => setManualBatchDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingEnroll}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmittingEnroll ? 'جارٍ الحفظ...' : 'تأكيد إسناد الدورة ✓'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
