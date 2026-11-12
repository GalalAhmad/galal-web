'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Send,
  ExternalLink,
  Edit3,
  Check,
  X,
  Layers,
  Heart,
  Compass,
  Building2,
  Play,
  HelpCircle,
  Download,
  AlertTriangle,
  FolderPlus,
  RefreshCw,
  Award
} from 'lucide-react';
import { allCoursesData, tracksData, Course, CourseModule, Lesson, TrackInfo } from '@/data/coursesData';

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
  // 1. Dynamic Courses & Tracks State
  const [courses, setCourses] = useState<Course[]>(allCoursesData);
  const [tracks, setTracks] = useState<TrackInfo[]>(tracksData);
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  // Filters & Search
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [actionErrorMsg, setActionErrorMsg] = useState('');

  // Course Batch Editing
  const [editingBatchCourseId, setEditingBatchCourseId] = useState<string | null>(null);
  const [batchDateInput, setBatchDateInput] = useState<string>('');
  const [savingBatch, setSavingBatch] = useState(false);

  // Manual Enroll Modal State
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [manualClientId, setManualClientId] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualCourseId, setManualCourseId] = useState(allCoursesData[0]?.id || 'rifq-mithaq');
  const [manualBatchDate, setManualBatchDate] = useState('الدفعة الحالية');
  const [isSubmittingEnroll, setIsSubmittingEnroll] = useState(false);

  // Course Builder Modal State (Create / Edit)
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [builderTab, setBuilderTab] = useState<'info' | 'outcomes' | 'syllabus'>('info');
  const [courseFormData, setCourseFormData] = useState<Course>({
    id: '',
    slug: '',
    title: '',
    subtitle: '',
    trackId: 'family',
    trackLabel: 'مسار الأسرة',
    instructor: { name: 'جلال أحمد', title: 'أخصائي نفسي وأسري' },
    badge: 'برنامج جديد',
    level: 'شامل لكافة المستويات',
    duration: '8 أسابيع • 8 محطات',
    format: 'محطات تفاعلية وتطبيقات عملية',
    rating: 5.0,
    reviewsCount: 0,
    studentsCount: 0,
    price: 'متاح للتسجيل',
    overview: '',
    targetAudience: [],
    learningOutcomes: [],
    syllabus: [],
    faqs: [],
  });
  const [isSavingCourse, setIsSavingCourse] = useState(false);

  // Delete Course Confirmation State
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isDeletingCourse, setIsDeletingCourse] = useState(false);

  // Track Manager Modal State
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackSubtitle, setNewTrackSubtitle] = useState('');
  const [newTrackDesc, setNewTrackDesc] = useState('');
  const [isSavingTrack, setIsSavingTrack] = useState(false);

  // Fetch Dynamic Courses on Mount
  const fetchCatalog = async () => {
    setLoadingCatalog(true);
    try {
      const res = await fetch('/api/admin/courses');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.courses) && data.courses.length > 0) {
          setCourses(data.courses);
        }
        if (Array.isArray(data.tracks) && data.tracks.length > 0) {
          setTracks(data.tracks);
        }
      }
    } catch (e) {
      console.error('Failed to fetch courses catalog:', e);
    } finally {
      setLoadingCatalog(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  // Enrolled Students Extractor
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
      if (selectedCourseFilter !== 'all' && student.courseId !== selectedCourseFilter) {
        return false;
      }
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

  // Total Lessons Across all courses
  const totalLessonsCount = useMemo(() => {
    let count = 0;
    courses.forEach((c) => {
      c.syllabus?.forEach((m) => {
        count += m.lessons?.length || 0;
      });
    });
    return count;
  }, [courses]);

  // Handle Open Create Course Modal
  const handleOpenCreateCourse = () => {
    setIsEditingCourse(false);
    setBuilderTab('info');
    const defaultId = `course-${Date.now().toString().slice(-4)}`;
    setCourseFormData({
      id: defaultId,
      slug: defaultId,
      title: '',
      subtitle: '',
      trackId: tracks[0]?.id || 'family',
      trackLabel: tracks[0]?.title || 'مسار الأسرة',
      instructor: { name: 'جلال أحمد', title: 'أخصائي نفسي وأسري' },
      badge: 'برنامج تدريبي جديد',
      level: 'شامل لكافة المستويات',
      duration: '6 أسابيع • 6 محطات',
      format: 'لقاءات تدريبية تفاعلية + تمارين عملية',
      rating: 5.0,
      reviewsCount: 0,
      studentsCount: 0,
      price: 'متاح للتسجيل',
      overview: '',
      targetAudience: ['الراغبون في تعميق الوعي وبناء الاتزان الذاتي والعلائقي'],
      learningOutcomes: [
        { title: 'اكتساب المفاهيم الأساسية', desc: 'استيعاب الإطار النظري والتطبيقي لمحاور الدورة.' },
      ],
      syllabus: [
        {
          id: 'station-1',
          num: '01',
          title: 'المحطة الأولى: التأسيس والانطلاق',
          description: 'مدخل تعريفي شامل لأهداف البرنامج والخطوات العملية.',
          icon: '🌱',
          badgeColor: 'text-[#154F9C]',
          lessons: [
            {
              id: `${defaultId}-l1`,
              title: 'الدرس الأول: خريطة الطريق والأهداف الإرشادية',
              duration: '30 دقيقة',
              type: 'video',
              summary: 'استعراض عام لخطة التعلم والمهارات المكتسبة.',
              keyTakeaways: ['الوعي الذاتي هو نقطة البداية لكل تغيير حقيقي.'],
              interactiveActivity: {
                question: 'ما هو هدفك الأساسي والأكبر من الانضمام لهذا البرنامج؟',
                options: [
                  'اكتساب مهارات عملية لتطبيقها في حياتي اليومية',
                  'فهم وتصحيح التحديات النفسية والعلائقية التي أواجهها',
                  'بناء نمط حياة أكثر اتزاناً وسكينة مع من حولي',
                ],
                correctOptionIndex: 0,
                explanation: 'تحديد الهدف بوضوح يزيد من فاعلية الالتزام والاستفادة من محطات الدورة.',
                reflectionPrompt: 'اكتب في سطرين ما تأمل تحقيقه بنهاية هذه المحطة التدريبية:',
              },
            },
          ],
        },
      ],
      faqs: [],
    });
    setIsCourseModalOpen(true);
  };

  // Handle Open Edit Course Modal
  const handleOpenEditCourse = (course: Course) => {
    setIsEditingCourse(true);
    setBuilderTab('info');
    setCourseFormData(JSON.parse(JSON.stringify(course))); // deep clone
    setIsCourseModalOpen(true);
  };

  // Submit Course Form (Create / Update)
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseFormData.title.trim()) {
      alert('يرجى إدخال عنوان الدورة التدريبية');
      return;
    }

    setIsSavingCourse(true);
    setActionErrorMsg('');

    try {
      const method = isEditingCourse ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/courses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseFormData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccessMsg(
          isEditingCourse
            ? `تم تحديث دورة (${courseFormData.title}) بنجاح ✓`
            : `تم إنشاء دورة (${courseFormData.title}) بنجاح ✓`
        );
        setTimeout(() => setActionSuccessMsg(''), 4000);
        setIsCourseModalOpen(false);
        await fetchCatalog();
      } else {
        setActionErrorMsg(data.error || 'تعذر حفظ بيانات الدورة');
      }
    } catch (err: any) {
      console.error(err);
      setActionErrorMsg('حدث خطأ أثناء حفظ الدورة');
    } finally {
      setIsSavingCourse(false);
    }
  };

  // Handle Delete Course
  const handleConfirmDeleteCourse = async () => {
    if (!courseToDelete) return;
    setIsDeletingCourse(true);
    try {
      const res = await fetch(`/api/admin/courses?id=${courseToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccessMsg(`تم حذف دورة (${courseToDelete.title}) بنجاح ✓`);
        setTimeout(() => setActionSuccessMsg(''), 4000);
        setCourseToDelete(null);
        await fetchCatalog();
      } else {
        setActionErrorMsg(data.error || 'تعذر حذف الدورة');
      }
    } catch (e) {
      setActionErrorMsg('خطأ في الاتصال أثناء حذف الدورة');
    } finally {
      setIsDeletingCourse(false);
    }
  };

  // Create New Track Submit
  const handleSaveTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackTitle.trim()) return;
    setIsSavingTrack(true);
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'track',
          title: newTrackTitle.trim(),
          subtitle: newTrackSubtitle.trim(),
          description: newTrackDesc.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccessMsg(`تم إضافة مسار (${newTrackTitle}) بنجاح ✓`);
        setTimeout(() => setActionSuccessMsg(''), 3000);
        setIsTrackModalOpen(false);
        setNewTrackTitle('');
        setNewTrackSubtitle('');
        setNewTrackDesc('');
        await fetchCatalog();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingTrack(false);
    }
  };

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
          : `batch_${courseId}`;

      await onUpdateSettings({ [fieldKey]: batchDateInput.trim() });
      setEditingBatchCourseId(null);
      setActionSuccessMsg(`تم تحديث موعد الدفعة بنجاح ✓`);
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
      const targetCourse = courses.find((c) => c.id === manualCourseId) || courses[0];
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
معك د. جلال أحمد بخصوص متابعة دورتك التدريبية (${student.courseTitle}) ضمن أكاديمية المنصة.

يسعدني تواصلك وتزويدك بأي مساندة أو استفسار بخصوص محطات البرنامج ومواعيد اللقاءات المباشرة.
أهلاً بك دائماً.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Helper: Add / Remove Outcomes
  const addOutcome = () => {
    setCourseFormData({
      ...courseFormData,
      learningOutcomes: [
        ...(courseFormData.learningOutcomes || []),
        { title: 'مخرج تعليمي جديد', desc: 'وصف المهارة والنتيجة الإرشادية المكتسبة...' },
      ],
    });
  };

  const removeOutcome = (idx: number) => {
    const updated = [...(courseFormData.learningOutcomes || [])];
    updated.splice(idx, 1);
    setCourseFormData({ ...courseFormData, learningOutcomes: updated });
  };

  // Helper: Add / Remove Modules & Lessons
  const addModule = () => {
    const num = String((courseFormData.syllabus?.length || 0) + 1).padStart(2, '0');
    const newMod: CourseModule = {
      id: `module-${Date.now()}`,
      num,
      title: `المحطة ${num}: محطة جديدة`,
      description: 'وصف أهداف ومحتوى هذه المحطة التدريبية...',
      icon: '🎯',
      badgeColor: 'text-[#154F9C]',
      lessons: [
        {
          id: `lesson-${Date.now()}-1`,
          title: 'الدرس الأول: مدخل تمهيدي',
          duration: '30 دقيقة',
          type: 'video',
          summary: 'ملخص الدرس وأهدافه التطبيقية...',
          keyTakeaways: ['الفهم الواعي يسبق التطبيق السلوكي.'],
        },
      ],
    };
    setCourseFormData({
      ...courseFormData,
      syllabus: [...(courseFormData.syllabus || []), newMod],
    });
  };

  const removeModule = (modIdx: number) => {
    const updated = [...(courseFormData.syllabus || [])];
    updated.splice(modIdx, 1);
    setCourseFormData({ ...courseFormData, syllabus: updated });
  };

  const addLessonToModule = (modIdx: number) => {
    const updated = [...(courseFormData.syllabus || [])];
    const mod = updated[modIdx];
    if (!mod) return;
    const lessonNum = (mod.lessons?.length || 0) + 1;
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}-${lessonNum}`,
      title: `درس جديد رقم ${lessonNum}`,
      duration: '25 دقيقة',
      type: 'video',
      summary: 'ملخص وتفاصيل هذا الدرس الإرشادي...',
      keyTakeaways: ['نقطة تطبيقية رئيسية.'],
      interactiveActivity: {
        question: 'سؤال لفحص الفهم والتطبيق الذاتي:',
        options: ['الخيار الأول', 'الخيار الثاني', 'الخيار الثالث'],
        correctOptionIndex: 0,
        explanation: 'التحليل والتوضيح الإرشادي للإجابة الصحيحة.',
        reflectionPrompt: 'دون تأملك الخاص واستجابتك الشخصية هنا:',
      },
    };
    mod.lessons = [...(mod.lessons || []), newLesson];
    setCourseFormData({ ...courseFormData, syllabus: updated });
  };

  const removeLessonFromModule = (modIdx: number, lesIdx: number) => {
    const updated = [...(courseFormData.syllabus || [])];
    const mod = updated[modIdx];
    if (!mod) return;
    mod.lessons.splice(lesIdx, 1);
    setCourseFormData({ ...courseFormData, syllabus: updated });
  };

  return (
    <div className="space-y-6 text-right animate-fadeIn">
      {/* 1. Header Bar with LMS Action Controls */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0E1524] border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#154F9C]/20 border border-[#154F9C]/30 text-sky-400 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>إدارة أكاديمية الكورسات والمسارات التفاعلية (LMS Pro)</span>
              {loadingCatalog && <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              تحكم احترافي شامل: إضافة وتعديل وحذف البرامج والمسارات، بناء شجرة المحطات والدروس، وإدارة المشتركين والدفعات.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Add New Course Button */}
          <button
            type="button"
            onClick={handleOpenCreateCourse}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-black transition shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ إضافة برنامج تدريبي جديد</span>
          </button>

          {/* Manage Tracks Button */}
          <button
            type="button"
            onClick={() => setIsTrackModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-purple-400" />
            <span>إدارة المسارات</span>
          </button>

          {/* Manual Enroll Button */}
          <button
            type="button"
            onClick={() => setIsEnrollModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>إسناد دورة لمستفيد</span>
          </button>

          {/* Preview Catalog Link */}
          <Link
            href="/courses"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold transition"
          >
            <span>معاينة الأكاديمية</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}
      {actionErrorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{actionErrorMsg}</span>
        </div>
      )}

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Courses */}
        <div className="p-5 rounded-3xl bg-[#0E1524] border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
            <span>البرامج والمسارات المعتمدة</span>
            <BookOpen className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {courses.length}
            <span className="text-xs font-normal text-slate-400 mr-2">دورة نشطة</span>
          </div>
          <div className="text-[11px] text-sky-400/80 mt-1">
            <span>موزعة على {tracks.length} مسارات رئيسية</span>
          </div>
        </div>

        {/* Total Enrolled Students */}
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
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {enrolledStudents.length}
            <span className="text-xs font-normal text-slate-400 mr-2">متدرب بالمنصة</span>
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            <span>اضغط لفلترة كافة المتدربين</span>
          </div>
        </div>

        {/* Total Stations & Lessons */}
        <div className="p-5 rounded-3xl bg-[#0E1524] border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
            <span>إجمالي المحطات والدروس</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {totalLessonsCount}
            <span className="text-xs font-normal text-slate-400 mr-2">درس ومحطة</span>
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">
            <span>تشمل تمارين وأنشطة تفاعلية</span>
          </div>
        </div>

        {/* Academic Tracks Count */}
        <div className="p-5 rounded-3xl bg-[#0E1524] border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
            <span>المسارات التخصصية</span>
            <Compass className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {tracks.length}
            <span className="text-xs font-normal text-slate-400 mr-2">مسارات</span>
          </div>
          <div className="text-[11px] text-purple-400/80 mt-1">
            <span>الأسرة • الشباب • المؤسسات</span>
          </div>
        </div>
      </div>

      {/* 3. Course Management Grid (Full CRUD & Builder Controls) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>البرامج التدريبية المتاحة بالأكاديمية ({courses.length}):</span>
          </h3>

          <button
            type="button"
            onClick={handleOpenCreateCourse}
            className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة برنامج تدريبي جديد</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => {
            const isEditingBatch = editingBatchCourseId === course.id;
            const currentBatch =
              course.id === 'rifq-mithaq' || course.id === 'mithaq'
                ? siteSettings.mithaqNextBatch || 'نوفمبر 2026'
                : course.id === 'rifq-premarital' || course.id === 'premarital'
                ? siteSettings.premaritalNextBatch || 'متاحة للتسجيل'
                : course.id === 'youth-identity'
                ? siteSettings.youthNextBatch || 'قيد الإعداد'
                : siteSettings[`batch_${course.id}`] || 'متاح للتسجيل';

            const countForThis = enrolledStudents.filter(
              (s) => s.courseId === course.id || s.courseId === course.slug
            ).length;

            const lessonsCount =
              course.syllabus?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0;

            return (
              <div
                key={course.id}
                className="p-5 rounded-3xl bg-[#0E1524] border border-slate-800 flex flex-col justify-between space-y-4 shadow-sm hover:border-slate-700 transition relative group"
              >
                <div className="space-y-3">
                  {/* Track Badge & Enrollees Count */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-sky-300 font-bold">
                      {course.trackLabel || 'مسار عام'}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {countForThis} مشترك
                    </span>
                  </div>

                  {/* Course Title & Subtitle */}
                  <div>
                    <h4 className="text-sm font-black text-white leading-snug">
                      {course.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                      {course.subtitle || course.overview}
                    </p>
                  </div>

                  {/* Course Quick Meta */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5">
                    <div>
                      <span className="text-slate-500 block">المحطات:</span>
                      <strong className="text-slate-200">{course.syllabus?.length || 0} محطات ({lessonsCount} درس)</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">المستوى:</span>
                      <strong className="text-slate-200">{course.level}</strong>
                    </div>
                  </div>

                  {/* Batch Date Inline Control */}
                  <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                    <span className="text-slate-400 text-[10px] block mb-1">موعد الدفعة المعلن:</span>
                    {isEditingBatch ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={batchDateInput}
                          onChange={(e) => setBatchDateInput(e.target.value)}
                          placeholder="مثلاً: نوفمبر 2026"
                          className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-bold"
                        />
                        <button
                          type="button"
                          disabled={savingBatch}
                          onClick={() => handleSaveBatchDate(course.id)}
                          className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                          title="حفظ الموعد"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingBatchCourseId(null)}
                          className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                          title="إلغاء"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between font-bold text-slate-200">
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

                {/* Course Action Buttons (Edit Syllabus, Delete, Player, Filter) */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    {/* Edit Syllabus & Info Modal */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditCourse(course)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#154F9C]/20 hover:bg-[#154F9C]/40 border border-[#154F9C]/40 text-sky-300 font-bold transition cursor-pointer"
                      title="تعديل المنهج والدروس والبيانات"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>تعديل المنهج</span>
                    </button>

                    {/* Open Station Player */}
                    <Link
                      href={`/courses/${course.slug}?mode=player`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 font-bold transition"
                      title="معاينة مشغل المحطات التفاعلي"
                    >
                      <Play className="w-3 h-3 fill-emerald-400" />
                      <span>المشغل</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Filter Enrolled */}
                    <button
                      type="button"
                      onClick={() => setSelectedCourseFilter(course.id)}
                      className="text-slate-400 hover:text-white text-[11px] font-bold"
                      title="عرض المشتركين في هذه الدورة فقط"
                    >
                      المشتركون ({countForThis})
                    </button>

                    {/* Delete Course Button */}
                    <button
                      type="button"
                      onClick={() => setCourseToDelete(course)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                      title="حذف هذه الدورة من الأكاديمية"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Enrolled Students Directory */}
      <div className="space-y-4 pt-4">
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
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
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

            {courses.slice(0, 4).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCourseFilter(c.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  selectedCourseFilter === c.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {c.title.split('—')[0].trim()}
              </button>
            ))}
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
            {filteredStudents.map((student, idx) => (
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
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. EXECUTIVE COURSE BUILDER MODAL (Add / Edit Course & Stations)          */}
      {/* ========================================================================= */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[92vh] rounded-3xl bg-[#0E1524] border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-right">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#154F9C]/30 text-sky-400 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {isEditingCourse ? `تعديل منهج وبيانات: ${courseFormData.title}` : 'إنشاء برنامج تدريبي جديد في الأكاديمية'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    بناء متكامل لكافة تفاصيل البرنامج، المحطات، والدروس، والأنشطة التفاعلية.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCourseModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Selector */}
            <div className="flex items-center gap-2 px-6 pt-3 pb-1 border-b border-slate-800/80 bg-slate-950/40 text-xs font-bold">
              <button
                type="button"
                onClick={() => setBuilderTab('info')}
                className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                  builderTab === 'info'
                    ? 'bg-[#154F9C] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1. البيانات الأساسية
              </button>

              <button
                type="button"
                onClick={() => setBuilderTab('outcomes')}
                className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                  builderTab === 'outcomes'
                    ? 'bg-[#154F9C] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2. مخرجات التعلم والفئات المستهدفة
              </button>

              <button
                type="button"
                onClick={() => setBuilderTab('syllabus')}
                className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  builderTab === 'syllabus'
                    ? 'bg-[#154F9C] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>3. شجرة المحطات والدروس</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-sky-300 font-mono">
                  {courseFormData.syllabus?.length || 0}
                </span>
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveCourse} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* TAB 1: BASIC INFORMATION */}
              {builderTab === 'info' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">عنوان البرنامج التدريبي: *</label>
                      <input
                        type="text"
                        required
                        value={courseFormData.title}
                        onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                        placeholder="مثلاً: رحلة رِفق | ميثاق — للمتزوجين"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">الرابط المختصر (Slug): *</label>
                      <input
                        type="text"
                        required
                        value={courseFormData.slug}
                        onChange={(e) => setCourseFormData({ ...courseFormData, slug: e.target.value })}
                        placeholder="mithaq-couples"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">المسار التدريبي:</label>
                      <select
                        value={courseFormData.trackId}
                        onChange={(e) => {
                          const chosenTrack = tracks.find((t) => t.id === e.target.value);
                          setCourseFormData({
                            ...courseFormData,
                            trackId: e.target.value as any,
                            trackLabel: chosenTrack?.title || 'مسار عام',
                          });
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                      >
                        {tracks.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">المستوى التدريبي:</label>
                      <input
                        type="text"
                        value={courseFormData.level}
                        onChange={(e) => setCourseFormData({ ...courseFormData, level: e.target.value })}
                        placeholder="شامل لكافة المستويات"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">شارة البرنامج (Badge):</label>
                      <input
                        type="text"
                        value={courseFormData.badge}
                        onChange={(e) => setCourseFormData({ ...courseFormData, badge: e.target.value })}
                        placeholder="الدفعة القادمة متاحة"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">مدة البرنامج:</label>
                      <input
                        type="text"
                        value={courseFormData.duration}
                        onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                        placeholder="8 أسابيع • 8 محطات"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">نمط التدريب:</label>
                      <input
                        type="text"
                        value={courseFormData.format}
                        onChange={(e) => setCourseFormData({ ...courseFormData, format: e.target.value })}
                        placeholder="لقاءات مباشرة + كراسة عمل"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">الرسوم / السعر المقترح:</label>
                      <input
                        type="text"
                        value={courseFormData.price}
                        onChange={(e) => setCourseFormData({ ...courseFormData, price: e.target.value })}
                        placeholder="متاح للتسجيل أو 300 ر.س"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">الوصف التمهيدي (Subtitle):</label>
                    <input
                      type="text"
                      value={courseFormData.subtitle}
                      onChange={(e) => setCourseFormData({ ...courseFormData, subtitle: e.target.value })}
                      placeholder="برنامج تدريبي تطبيقي لتعميق الشراكة الزوجية وبناء بيت السكن..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">النبذة الإرشادية التفصيلية (Overview):</label>
                    <textarea
                      rows={4}
                      value={courseFormData.overview}
                      onChange={(e) => setCourseFormData({ ...courseFormData, overview: e.target.value })}
                      placeholder="استعراض كامل لفلسفة البرنامج والمنهج العلمي المتبع والأدوات الإرشادية..."
                      className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: OUTCOMES & TARGET AUDIENCE */}
              {builderTab === 'outcomes' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Learning Outcomes */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-200 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span>مخرجات ونواتج التعلم المستهدفة:</span>
                      </label>
                      <button
                        type="button"
                        onClick={addOutcome}
                        className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة مخرج جديد +</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {courseFormData.learningOutcomes?.map((outcome, oIdx) => (
                        <div
                          key={oIdx}
                          className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3"
                        >
                          <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono flex items-center justify-center shrink-0 mt-1">
                            {oIdx + 1}
                          </span>
                          <div className="flex-1 space-y-1.5">
                            <input
                              type="text"
                              value={outcome.title}
                              onChange={(e) => {
                                const updated = [...courseFormData.learningOutcomes];
                                updated[oIdx].title = e.target.value;
                                setCourseFormData({ ...courseFormData, learningOutcomes: updated });
                              }}
                              placeholder="عنوان المخرج (مثلاً: إتقان الحوار الآمن)"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold"
                            />
                            <input
                              type="text"
                              value={outcome.desc}
                              onChange={(e) => {
                                const updated = [...courseFormData.learningOutcomes];
                                updated[oIdx].desc = e.target.value;
                                setCourseFormData({ ...courseFormData, learningOutcomes: updated });
                              }}
                              placeholder="وصف تفصيلي لكيفية تطبيق هذا المخرج..."
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 text-[11px]"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeOutcome(oIdx)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                            title="حذف هذا المخرج"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <label className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-amber-400" />
                      <span>الفئات الموجه إليها هذا البرنامج (سطر لكل فئة):</span>
                    </label>
                    <textarea
                      rows={3}
                      value={courseFormData.targetAudience?.join('\n') || ''}
                      onChange={(e) =>
                        setCourseFormData({
                          ...courseFormData,
                          targetAudience: e.target.value.split('\n').filter((l) => l.trim()),
                        })
                      }
                      placeholder="الأزواج في السنوات الأولى من الزواج&#10;كل من يعاني من تكرار الشجار ونمط الانسحاب&#10;المقبلون على خطوة عقد القران"
                      className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: SYLLABUS BUILDER (Stations & Lessons) */}
              {builderTab === 'syllabus' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-sky-400" />
                        <span>محطات البرنامج والدروس ({courseFormData.syllabus?.length || 0} محطات)</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        يمكنك إضافة محطات جديدة، ودروس بداخل كل محطة، وأنشطة فحص الفهم التفاعلي.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addModule}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة محطة جديدة +</span>
                    </button>
                  </div>

                  {courseFormData.syllabus?.map((mod, modIdx) => (
                    <div
                      key={mod.id || modIdx}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4"
                    >
                      {/* Module Header Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={mod.num}
                            onChange={(e) => {
                              const updated = [...(courseFormData.syllabus || [])];
                              updated[modIdx].num = e.target.value;
                              setCourseFormData({ ...courseFormData, syllabus: updated });
                            }}
                            placeholder="01"
                            className="w-12 px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-sky-300 font-mono font-bold text-center"
                          />
                          <input
                            type="text"
                            value={mod.title}
                            onChange={(e) => {
                              const updated = [...(courseFormData.syllabus || [])];
                              updated[modIdx].title = e.target.value;
                              setCourseFormData({ ...courseFormData, syllabus: updated });
                            }}
                            placeholder="عنوان المحطة (مثلاً: فك الشفرة واختلافات التفكير)"
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-black text-xs"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => addLessonToModule(modIdx)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#154F9C] hover:bg-[#103D7A] text-white text-[11px] font-bold transition cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>إضافة درس للمحطة</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => removeModule(modIdx)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                            title="حذف هذه المحطة بالكامل"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Module Description */}
                      <div>
                        <input
                          type="text"
                          value={mod.description}
                          onChange={(e) => {
                            const updated = [...(courseFormData.syllabus || [])];
                            updated[modIdx].description = e.target.value;
                            setCourseFormData({ ...courseFormData, syllabus: updated });
                          }}
                          placeholder="وصف مختصر لمحتوى هذه المحطة..."
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 text-[11px]"
                        />
                      </div>

                      {/* Lessons in this Module */}
                      <div className="space-y-3 pt-2">
                        <span className="text-[11px] font-bold text-slate-400 block">
                          دروس هذه المحطة ({mod.lessons?.length || 0}):
                        </span>

                        {mod.lessons?.map((les, lesIdx) => (
                          <div
                            key={les.id || lesIdx}
                            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3 text-xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1">
                                <Play className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <input
                                  type="text"
                                  value={les.title}
                                  onChange={(e) => {
                                    const updated = [...(courseFormData.syllabus || [])];
                                    updated[modIdx].lessons[lesIdx].title = e.target.value;
                                    setCourseFormData({ ...courseFormData, syllabus: updated });
                                  }}
                                  placeholder="عنوان الدرس..."
                                  className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                                />
                              </div>

                              <input
                                type="text"
                                value={les.duration}
                                onChange={(e) => {
                                  const updated = [...(courseFormData.syllabus || [])];
                                  updated[modIdx].lessons[lesIdx].duration = e.target.value;
                                  setCourseFormData({ ...courseFormData, syllabus: updated });
                                }}
                                placeholder="30 دقيقة"
                                className="w-24 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[11px] text-center"
                              />

                              <button
                                type="button"
                                onClick={() => removeLessonFromModule(modIdx, lesIdx)}
                                className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                                title="حذف هذا الدرس"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Summary & Takeaways */}
                            <div className="space-y-2">
                              <textarea
                                rows={2}
                                value={les.summary}
                                onChange={(e) => {
                                  const updated = [...(courseFormData.syllabus || [])];
                                  updated[modIdx].lessons[lesIdx].summary = e.target.value;
                                  setCourseFormData({ ...courseFormData, syllabus: updated });
                                }}
                                placeholder="ملخص المفهوم الجوهري للدرس..."
                                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-[11px]"
                              />
                            </div>

                            {/* Interactive Quiz Question if present */}
                            {les.interactiveActivity && (
                              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                                <label className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                                  <HelpCircle className="w-3.5 h-3.5" />
                                  <span>تمرين الفحص التفاعلي للدرس:</span>
                                </label>
                                <input
                                  type="text"
                                  value={les.interactiveActivity.question || ''}
                                  onChange={(e) => {
                                    const updated = [...(courseFormData.syllabus || [])];
                                    if (updated[modIdx].lessons[lesIdx].interactiveActivity) {
                                      updated[modIdx].lessons[lesIdx].interactiveActivity!.question = e.target.value;
                                    }
                                    setCourseFormData({ ...courseFormData, syllabus: updated });
                                  }}
                                  placeholder="سؤال التطبيق العملي..."
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-[11px]"
                                />
                                <input
                                  type="text"
                                  value={les.interactiveActivity.reflectionPrompt || ''}
                                  onChange={(e) => {
                                    const updated = [...(courseFormData.syllabus || [])];
                                    if (updated[modIdx].lessons[lesIdx].interactiveActivity) {
                                      updated[modIdx].lessons[lesIdx].interactiveActivity!.reflectionPrompt = e.target.value;
                                    }
                                    setCourseFormData({ ...courseFormData, syllabus: updated });
                                  }}
                                  placeholder="مساحة التأمل والتدوين الإرشادي..."
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 text-[11px]"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Form Bottom Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={isSavingCourse}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSavingCourse ? 'جارٍ الحفظ والمزامنة...' : 'حفظ ونشر المنهج في الأكاديمية ✓'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DELETE COURSE CONFIRMATION MODAL                                       */}
      {/* ========================================================================= */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-[#0E1524] border border-rose-900/60 p-6 space-y-4 shadow-2xl text-right">
            <div className="flex items-center gap-3 text-rose-400 font-black text-sm">
              <AlertTriangle className="w-6 h-6" />
              <span>تأكيد حذف الدورة التدريبية</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف دورة <strong className="text-white">({courseToDelete.title})</strong> من الأكاديمية؟
              سيتم إزالة كافة محطاتها ودروسها من واجهة العرض.
            </p>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
              >
                إلغاء التراجع
              </button>

              <button
                type="button"
                disabled={isDeletingCourse}
                onClick={handleConfirmDeleteCourse}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:bg-slate-700 text-white font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeletingCourse ? 'جارٍ الحذف...' : 'تأكيد الحذف نهائياً'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TRACK MANAGEMENT MODAL                                                 */}
      {/* ========================================================================= */}
      {isTrackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-[#0E1524] border border-slate-800 p-6 space-y-5 shadow-2xl text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-black text-sm">
                <FolderPlus className="w-5 h-5 text-purple-400" />
                <span>إدارة المسارات الأكاديمية التخصصية</span>
              </div>
              <button
                type="button"
                onClick={() => setIsTrackModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing Tracks */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">المسارات الحالية بالمنصة:</span>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {tracks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-white block">{t.title}</strong>
                      <span className="text-[11px] text-slate-400">{t.subtitle}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-purple-300">
                      {courses.filter((c) => c.trackId === t.id).length} برامج
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Track Form */}
            <form onSubmit={handleSaveTrack} className="space-y-3 pt-3 border-t border-slate-800 text-xs">
              <span className="font-bold text-slate-200 block">+ إضافة مسار تخصصي جديد:</span>
              <div>
                <input
                  type="text"
                  required
                  value={newTrackTitle}
                  onChange={(e) => setNewTrackTitle(e.target.value)}
                  placeholder="عنوان المسار (مثلاً: مسار التربية الوالدية الواعية)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={newTrackSubtitle}
                  onChange={(e) => setNewTrackSubtitle(e.target.value)}
                  placeholder="الوصف التمهيدي للمسار..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTrackModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  إغلاق
                </button>
                <button
                  type="submit"
                  disabled={isSavingTrack}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 text-white font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSavingTrack ? 'جارٍ الحفظ...' : 'إضافة المسار ✓'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MANUAL ENROLLMENT MODAL (Existing feature preserved)                  */}
      {/* ========================================================================= */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-[#0E1524] border border-slate-800 p-6 space-y-5 shadow-2xl relative text-right">
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
                    {courses.map((crs) => (
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
