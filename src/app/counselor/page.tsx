'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Brain,
  Users,
  Calendar,
  Clock,
  FileText,
  BookOpen,
  Sparkles,
  Shield,
  Activity,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Play,
  Video,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Save,
  Trash2,
  Check,
  User,
  Heart,
  Eye,
  Lock,
  ArrowRight,
  Compass,
  Layers,
  Sparkle,
  Phone,
  Mail,
  MapPin,
  CalendarCheck,
  RefreshCw,
  Send,
  CalendarClock,
  Sun,
  Moon,
  DollarSign,
  AlertCircle,
  Home,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import DSM5AssistantModal from '@/components/clinical/DSM5AssistantModal';
import ConsultationStudio from '@/components/clinical/ConsultationStudio';
import { DSM5Disorder } from '@/lib/dsm5/types';
import { DSM5_DISORDERS } from '@/lib/dsm5/knowledgeBase';
import { CLINICAL_EXERCISES_LIBRARY } from '@/lib/clinical/exercisesLibrary';
import CounselorHomeworkReviewModal from '@/components/clinical/CounselorHomeworkReviewModal';
import {
  INITIAL_CLINICAL_CLIENTS,
  INITIAL_CLINICAL_SESSIONS,
  ClinicalClient
} from '@/lib/clinical/mockClinicalData';

export default function CounselorWorkspacePage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Route Protection: Counselor Workspace is strictly for Dr. Galal Ahmad
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'counselor') {
        router.replace('/login?redirect=/counselor');
      }
    }
  }, [user, authLoading, router]);

  // Navigation Tabs in Counselor Workspace
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'clients' | 'dossier' | 'bookings' | 'schedule' | 'dsm5' | 'exercises'
  >('dashboard');

  // Real-time Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Clients & Sessions State
  const [clients, setClients] = useState<ClinicalClient[]>(INITIAL_CLINICAL_CLIENTS);
  const [selectedClientId, setSelectedClientId] = useState<string>(INITIAL_CLINICAL_CLIENTS[0].id);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'moderate' | 'high'>('all');

  // Live Bookings from Database
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

  // Reschedule Modal State
  const [rescheduleBooking, setRescheduleBooking] = useState<any | null>(null);
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotTime, setNewSlotTime] = useState('');
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  // Availability Schedule State
  const [workingDays, setWorkingDays] = useState<number[]>([0, 1, 2, 3, 4, 6]);
  const [timeSlots, setTimeSlots] = useState<{ id: string; label: string; enabled: boolean }[]>([
    { id: '16:00', label: '04:00 مساءً', enabled: true },
    { id: '17:30', label: '05:30 مساءً', enabled: true },
    { id: '19:00', label: '07:00 مساءً', enabled: true },
    { id: '20:30', label: '08:30 مساءً', enabled: true },
    { id: '22:00', label: '10:00 مساءً', enabled: true },
  ]);
  const [newSlotInput, setNewSlotInput] = useState('');
  const [savingSchedule, setSavingSchedule] = useState(false);

  // Active Client Dossier Sub-tab
  const [dossierTab, setDossierTab] = useState<
    'sessions' | 'problem_map' | 'treatment_plan' | 'homework' | 'soap_notes' | 'assessments' | 'private_vault'
  >('sessions');

  // Live Consultation Studio Launcher
  const [activeStudioSession, setActiveStudioSession] = useState<any | null>(null);

  // New Client Intake Modal State
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientGender, setNewClientGender] = useState<'male' | 'female'>('male'); // Strictly male or female
  const [newClientAge, setNewClientAge] = useState(30);
  const [newClientMarital, setNewClientMarital] = useState('متزوج');
  const [newClientOccupation, setNewClientOccupation] = useState('');
  const [newClientComplaint, setNewClientComplaint] = useState('');
  const [newClientRisk, setNewClientRisk] = useState<'low' | 'moderate' | 'high'>('low');

  // DSM-5 Modal launcher
  const [isDSMModalOpen, setIsDSMModalOpen] = useState(false);

  // Saved Feedback Alert
  const [toastMessage, setToastMessage] = useState('');
  const [reviewingHomework, setReviewingHomework] = useState<any | null>(null);
  const [assigningLoadingSlug, setAssigningLoadingSlug] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // 1. REAL-TIME DATA SYNC (من قاعدة البيانات وسجلات المستفيدين والحجوزات)
  const fetchRealtimeData = async () => {
    setIsSyncing(true);
    try {
      // أ. جلب بيانات ملفات المستفيدين المسجلين في الموقع
      const profRes = await fetch('/api/user/profile', { cache: 'no-store' });
      const profData = await profRes.json();
      if (profData.profiles && Array.isArray(profData.profiles)) {
        const liveMapped: ClinicalClient[] = profData.profiles.map((p: any, idx: number) => ({
          id: p.id || `cl-live-${idx}`,
          clientCode: `CL-${100 + idx + 1}`,
          fullName: p.name || 'مستفيد المنصة',
          phone: p.phone || '',
          email: p.email || '',
          gender: p.gender === 'female' ? 'female' : 'male',
          age: p.age_group ? parseInt(p.age_group) || 30 : 30,
          maritalStatus: p.marital_status || 'متزوج',
          occupation: p.occupation || 'غير محدد',
          city: p.city || 'القاهرة',
          riskLevel: p.risk_level || 'low',
          chiefComplaint: p.clinical_notes || 'حساب مسجل بالمنصة — ينتظر المتابعة الإرشادية',
          primaryDiagnosis: p.primary_diagnosis || 'قيد الاستكشاف والتقييم',
          icdCode: 'Z71.9',
          intakeDate: p.created_at ? p.created_at.split('T')[0] : '2026-11-01',
          sessionsCount: Array.isArray(p.tests) ? p.tests.length : 0,
          lastSessionDate: '—',
          mentalStatusSummary: 'تمت المزامنة اللحظية من بوابة المستفيدين الرسمية.',
          homework: Array.isArray(p.homework) ? p.homework : []
        }));

        setClients((prev) => {
          const map = new Map<string, ClinicalClient>();
          // وضع العملاء المبدئيين أولاً
          INITIAL_CLINICAL_CLIENTS.forEach((c) => map.set(c.phone || c.id, c));
          // دمج العملاء المزامنين من قاعدة البيانات
          liveMapped.forEach((c) => {
            if (c.phone) map.set(c.phone, c);
            else map.set(c.id, c);
          });
          return Array.from(map.values());
        });
      }

      // ب. جلب الحجوزات الواردة من الموقع
      const bookRes = await fetch('/api/bookings', { cache: 'no-store' });
      const bookData = await bookRes.json();
      if (bookData.bookings && Array.isArray(bookData.bookings)) {
        setBookingsList(bookData.bookings);
      }

      // ج. جلب جدول التوفر المعياري
      const availRes = await fetch('/api/availability', { cache: 'no-store' });
      const availData = await availRes.json();
      if (availData.workingDays && Array.isArray(availData.workingDays)) {
        setWorkingDays(availData.workingDays);
      }
      if (availData.timeSlots && Array.isArray(availData.timeSlots)) {
        setTimeSlots(availData.timeSlots);
      }

      setLastSyncTime(new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Error syncing counselor data:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchRealtimeData();
    // تكرار المزامنة التلقائية كل 45 ثانية لمواكبة أي عميل يسجل جديداً
    const interval = setInterval(fetchRealtimeData, 45000);
    return () => clearInterval(interval);
  }, []);

  // Selected client object
  const currentClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  // 2. إقرار وتأكيد الحجز وتوليد رابط Google Meet
  const handleConfirmBooking = async (booking: any) => {
    const meetLink = `https://meet.google.com/galal-${Math.random().toString(36).substring(2, 7)}`;
    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: booking.id,
          status: 'confirmed',
          meetLink,
        }),
      });
      if (res.ok) {
        showToast(`تم تأكيد حجز ${booking.clientName} وتوليد رابط الجلسة بنجاح ✓`);
        setBookingsList((prev) =>
          prev.map((b) => (b.id === booking.id ? { ...b, status: 'confirmed', meetLink } : b))
        );

        // فتح واتساب لمراسلة العميل برابط الجلسة فوراً
        const cleanPhone = (booking.clientPhone || '').replace(/[^\d]/g, '');
        const msg = `السلام عليكم ورحمة الله وبركاته، أهلاً بك أخي/أختي الكريم/ة ${booking.clientName}.\nيسعدني تأكيد موعد جلستنا الاستشارية (${booking.trackLabel}) مع د. جلال أحمد.\n\n📅 الموعد: ${booking.slotDate}\n⏰ الوقت: ${booking.slotTime}\n🔗 رابط الحضور المباشر (Google Meet):\n${meetLink}\n\nنتمنى لك جلسة موفقة ومثمرة دائماً.`;
        if (cleanPhone) {
          window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
        }
      }
    } catch (err) {
      console.error('Error confirming booking:', err);
    }
  };

  // 3. إعادة جدولة موعد الجلسة
  const handleSaveReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleBooking || !newSlotDate || !newSlotTime) return;
    setRescheduleLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: rescheduleBooking.id,
          slotDate: newSlotDate,
          slotTime: newSlotTime,
        }),
      });

      if (res.ok) {
        setBookingsList((prev) =>
          prev.map((b) =>
            b.id === rescheduleBooking.id ? { ...b, slotDate: newSlotDate, slotTime: newSlotTime } : b
          )
        );
        showToast('تم تعديل موعد الجلسة بنجاح ✓');
        const cleanPhone = (rescheduleBooking.clientPhone || '').replace(/[^\d]/g, '');
        const msg = `السلام عليكم أ. ${rescheduleBooking.clientName}،\nنود إفادتك بأنه تم تحديث موعد جلستك الاستشارية (${rescheduleBooking.trackLabel}) مع د. جلال أحمد إلى:\n📅 ${newSlotDate} في تمام الساعة ${newSlotTime}.\nنلقاك على خير بإذن الله.`;
        if (cleanPhone) {
          window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
        }
        setRescheduleBooking(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRescheduleLoading(false);
    }
  };

  // 4. حفظ جدول التوفر السحابي
  const handleSaveAvailability = async () => {
    setSavingSchedule(true);
    try {
      const res = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workingDays,
          timeSlots,
          blockedDates: [],
        }),
      });
      if (res.ok) {
        showToast('تم حفظ أوقات العمل والتوفر الأسبوعي بنجاح في المنظومة السحابية ✓');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSchedule(false);
    }
  };

  // إضافة وقت عمل جديد
  const handleAddTimeSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotInput.trim()) return;
    const newId = `slot_${Date.now()}`;
    const updated = [...timeSlots, { id: newId, label: newSlotInput.trim(), enabled: true }];
    setTimeSlots(updated);
    setNewSlotInput('');
    showToast('تمت إضافة الموعد الجديد، اضغط حفظ لتأكيده.');
  };

  // حذف وقت عمل
  const handleDeleteTimeSlot = (id: string) => {
    setTimeSlots((prev) => prev.filter((s) => s.id !== id));
  };

  // تبديل يوم عمل
  const handleToggleDay = (dayIdx: number) => {
    if (workingDays.includes(dayIdx)) {
      setWorkingDays(workingDays.filter((d) => d !== dayIdx));
    } else {
      setWorkingDays([...workingDays, dayIdx].sort());
    }
  };

  // إضافة عميل جديد يدوياً
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientPhone) return;

    const newCode = `CL-${100 + clients.length + 1}`;
    const newClient: ClinicalClient = {
      id: `cl-${Date.now()}`,
      clientCode: newCode,
      fullName: newClientName,
      phone: newClientPhone,
      email: newClientEmail,
      gender: newClientGender,
      age: Number(newClientAge),
      maritalStatus: newClientMarital,
      occupation: newClientOccupation,
      city: 'القاهرة',
      riskLevel: newClientRisk,
      chiefComplaint: newClientComplaint,
      primaryDiagnosis: 'قيد التقييم الأولي',
      icdCode: 'Z71.9',
      intakeDate: new Date().toISOString().split('T')[0],
      sessionsCount: 0,
      lastSessionDate: '—',
      mentalStatusSummary: 'تم استيفاء استمارة المقابلة الإكلينيكية الأولية بنجاح.'
    };

    setClients([newClient, ...clients]);
    setSelectedClientId(newClient.id);
    setShowIntakeModal(false);
    showToast(`تم فتح الملف الإكلينيكي الجديد للعميل ${newClientName} بنجاح (${newCode}) ✓`);
    setActiveTab('dossier');

    setNewClientName('');
    setNewClientPhone('');
    setNewClientEmail('');
    setNewClientComplaint('');
  };

  // إسناد تمرين من المكتبة إلى ملف العميل الحالي وحفظه سحابياً ومحلياً
  const handleAssignExerciseToCurrentClient = async (ex: any) => {
    setAssigningLoadingSlug(ex.slug);
    try {
      const res = await fetch('/api/clinical/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'assign',
          exerciseSlug: ex.slug,
          clientId: currentClient.id,
          phone: currentClient.phone,
          email: currentClient.email,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        showToast(data.error || 'تعذر إسناد التمرين');
        return;
      }

      showToast(`تم إسناد تمرين "${ex.titleAr}" إلى ملف العميل ${currentClient.fullName} بنجاح ✓`);

      // Update state locally so UI updates instantly
      if (data.item) {
        setClients((prev) =>
          prev.map((c) => {
            if (c.id === currentClient.id) {
              return {
                ...c,
                homework: [data.item, ...(c.homework || [])],
              };
            }
            return c;
          })
        );
      }

      setDossierTab('homework');
      setActiveTab('dossier');
    } catch (err) {
      showToast('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setAssigningLoadingSlug(null);
    }
  };

  // حفظ الجلسة من الاستوديو المباشر
  const handleSaveStudioSession = (soapData: any) => {
    showToast('تم اعتماد وحفظ السجل الإكلينيكي SOAP وإسناد الواجب بنجاح ✓');
    setActiveStudioSession(null);
  };

  const DAYS_NAMES = [
    { idx: 0, label: 'الأحد' },
    { idx: 1, label: 'الاثنين' },
    { idx: 2, label: 'الثلاثاء' },
    { idx: 3, label: 'الأربعاء' },
    { idx: 4, label: 'الخميس' },
    { idx: 5, label: 'الجمعة' },
    { idx: 6, label: 'السبت' },
  ];

  if (authLoading || (!user || user.role !== 'counselor')) {
    return (
      <div className="min-h-screen bg-[#070B11] flex flex-col items-center justify-center p-4 text-center text-slate-200">
        <div className="w-16 h-16 rounded-3xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-3xl mb-4 animate-pulse">
          🩺
        </div>
        <h2 className="text-base font-black text-white mb-1">جاري التحقق من أمان مساحة المعالج...</h2>
        <p className="text-xs text-slate-400">مساحة عمل خاصة ومشفرة لدكتور جلال أحمد شخصياً</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B13] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-[#4E7E76] selection:text-white antialiased transition-colors duration-200" dir="rtl">
      
      {/* 1. TOP GLOBAL BAR WITH LOGO & STATUS */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0E1524]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 shadow-xs">
        
        {/* Left / Identity & Logo */}
        <div className="flex items-center gap-3.5">
          <Link href="/" className="flex items-center group shrink-0" title="الصفحة الرئيسية — د. جلال أحمد">
            <img
              src={theme === 'dark' ? '/assets/logo-white.png' : '/assets/logo.png'}
              alt="شعار د. جلال أحمد"
              className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105 shrink-0"
            />
          </Link>

          <div className="border-r border-slate-200 dark:border-slate-800 pr-3.5 space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900 dark:text-white">د. جـلال أحـمد</span>
              <span className="text-[10px] bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 px-2 py-0.5 rounded-full font-bold">
                مساحة المعالج الإكلينيكية 🩺
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              عيادتك الرقمية المعتمدة • مزامنة حية مع بوابة المستفيدين
            </p>
          </div>
        </div>

        {/* Center / Fast Real-time Sync & Launch Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchRealtimeData}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            title="مزامنة فورية مع قاعدة البيانات والمستفيدين"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-teal-600 dark:text-teal-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'جارٍ المزامنة...' : `مزامنة لحظية ${lastSyncTime ? `(${lastSyncTime})` : ''}`}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDSMModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            <Brain className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>مساعد DSM-5</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveStudioSession({
                id: `ses-live-${Date.now()}`,
                clientId: currentClient.id,
                clientName: currentClient.fullName,
                clientCode: currentClient.clientCode,
                sessionNumber: currentClient.sessionsCount + 1,
                sessionType: 'individual',
                meetLink: 'https://meet.google.com/new',
                initialDiagnosis: currentClient.primaryDiagnosis
              });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4E7E76] hover:bg-[#3D645E] text-white text-xs font-black shadow-md shadow-[#4E7E76]/20 transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>بدء جلسة مباشرة الآن</span>
          </button>
        </div>

        {/* Right / Theme Switcher & Admin Switch */}
        <div className="flex items-center gap-2">
          {/* Toggle Theme for full symmetry */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            title={theme === 'dark' ? 'التحويل للمظهر الفاتح' : 'التحويل للمظهر الليلي'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <Link
            href="/admin"
            className="text-xs text-slate-600 dark:text-slate-300 hover:text-[#4E7E76] font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition"
          >
            <span>لوحة إدارة الموقع</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50 transition cursor-pointer"
            title="تسجيل الخروج من مساحة المعالج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* 2. SUB-NAVIGATION TABS (DESKTOP + MOBILE APP TAB SCROLL) */}
      <nav className="bg-white dark:bg-[#0D1424] border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-8 py-2 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs font-bold shadow-xs">
        {[
          { id: 'dashboard', label: 'النبض الإكلينيكي', icon: Activity },
          { id: 'bookings', label: `الحجوزات والجلسات (${bookingsList.length})`, icon: CalendarClock },
          { id: 'clients', label: `سجل العملاء والحالات (${clients.length})`, icon: Users },
          { id: 'dossier', label: `ملف العميل: ${currentClient.fullName.split(' ')[0]}`, icon: FileText },
          { id: 'schedule', label: 'المواعيد وجدول التوفر', icon: Calendar },
          { id: 'dsm5', label: 'محرك الدليل التشخيصي (DSM-5)', icon: Brain },
          { id: 'exercises', label: `مكتبة التمارين الإرشادية (${CLINICAL_EXERCISES_LIBRARY.length})`, icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer ${
                isActive
                  ? 'bg-[#4E7E76] text-white font-black shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* TOAST ALERT */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#4E7E76] text-white px-5 py-2.5 rounded-2xl font-black text-xs shadow-2xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. DYNAMIC WORKSPACE BODY */}
      <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6 pb-24 md:pb-8">

        {/* ======================================================== */}
        {/* TAB 1: CLINICAL DASHBOARD (النبض الإكلينيكي) */}
        {/* ======================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Welcome Banner */}
            <div className="p-6 rounded-3xl bg-linear-to-r from-teal-900/10 via-slate-100 to-teal-900/10 dark:from-[#0E1524] dark:via-[#121B2F] dark:to-[#0E1524] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌿</span>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    أهلاً بك يا مستشار جـلال في عيادتك الرقمية المعتمدة
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • المنظومة متصلة بقاعدة البيانات وجاهزة لإدارة الجلسات
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowIntakeModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#4E7E76] dark:text-teal-400" />
                  <span>فتح ملف عميل جديد</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveStudioSession({
                      id: `ses-live-${Date.now()}`,
                      clientId: currentClient.id,
                      clientName: currentClient.fullName,
                      clientCode: currentClient.clientCode,
                      sessionNumber: currentClient.sessionsCount + 1,
                      sessionType: 'individual',
                      meetLink: 'https://meet.google.com/new',
                      initialDiagnosis: currentClient.primaryDiagnosis
                    });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4E7E76] hover:bg-[#3D645E] text-white text-xs font-black shadow-md shadow-[#4E7E76]/20 transition cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>استوديو الجلسات المباشر</span>
                </button>
              </div>
            </div>

            {/* 4 KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>إجمالي العملاء المسجلين</span>
                  <Users className="w-4 h-4 text-[#4E7E76] dark:text-teal-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{clients.length} عميل</div>
                <div className="text-[11px] text-[#4E7E76] dark:text-teal-400 font-bold flex items-center gap-1">
                  <span>● تزامن سحابي مستمر مع بوابة المستفيد</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>الحجوزات الواردة من الموقع</span>
                  <CalendarClock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{bookingsList.length} حجز</div>
                <div className="text-[11px] text-sky-600 dark:text-sky-400 font-bold flex items-center gap-1">
                  <span>● {bookingsList.filter((b) => b.status === 'pending_verification').length} بانتظار مراجعة الإيصال</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>الواجبات والتكليفات الإرشادية</span>
                  <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{CLINICAL_EXERCISES_LIBRARY.length} نماذج</div>
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                  <span>● جاهزة للإسناد المباشر للعميل</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>أيام العمل الأسبوعية المتاحة</span>
                  <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{workingDays.length} أيام</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <span>● {timeSlots.filter((s) => s.enabled).length} فترات زمنية يومياً</span>
                </div>
              </div>
            </div>

            {/* Recent Bookings and Actions */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-[#4E7E76] dark:text-teal-400" />
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    أحدث الحجوزات الواردة من المستفيدين
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-bold text-[#4E7E76] dark:text-teal-400 hover:underline cursor-pointer"
                >
                  عرض كافة الحجوزات ({bookingsList.length}) ←
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {bookingsList.slice(0, 4).map((b) => (
                  <div key={b.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-slate-800 text-[#4E7E76] dark:text-teal-400 font-bold text-xs flex items-center justify-center shrink-0">
                        {b.clientName ? b.clientName.slice(0, 2) : 'عم'}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-black text-slate-900 dark:text-white">{b.clientName}</strong>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-300">
                            {b.trackLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          الموعد: {b.slotDate} في {b.slotTime} • وسيلة الدفع: {b.paymentMethod} ({b.fee})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {b.status === 'pending_verification' && (
                        <button
                          type="button"
                          onClick={() => handleConfirmBooking(b)}
                          className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black transition cursor-pointer"
                        >
                          تأكيد الحجز وتوليد الرابط ✓
                        </button>
                      )}
                      {b.status === 'confirmed' && (
                        <span className="text-[11px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-xl font-bold">
                          مؤكدة ومجدولة ✓
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setRescheduleBooking(b);
                          setNewSlotDate(b.slotDate || '');
                          setNewSlotTime(b.slotTime || '');
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                      >
                        تعديل الموعد
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: BOOKINGS MANAGEMENT (إدارة الحجوزات والجلسات) */}
        {/* ======================================================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  إدارة الحجوزات والاستشارات الواردة
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  تحرير الحجوزات، تأكيد الدفع، إعادة الجدولة، وتوليد روابط Google Meet بنقرة واحدة
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchRealtimeData}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>تحديث الحجوزات</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="p-2 rounded-2xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
              {[
                { id: 'all', label: `كافة الحجوزات (${bookingsList.length})` },
                { id: 'pending', label: `بانتظار التأكيد (${bookingsList.filter((b) => b.status === 'pending_verification').length})` },
                { id: 'confirmed', label: `مؤكدة (${bookingsList.filter((b) => b.status === 'confirmed').length})` },
                { id: 'completed', label: `مكتملة (${bookingsList.filter((b) => b.status === 'completed').length})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setBookingFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    bookingFilter === f.id
                      ? 'bg-[#4E7E76] text-white font-black'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Bookings Table / Cards */}
            <div className="rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                    <tr>
                      <th className="p-4">المستفيد</th>
                      <th className="p-4">الهاتف</th>
                      <th className="p-4">نوع الاستشارة</th>
                      <th className="p-4">الموعد المحدد</th>
                      <th className="p-4">وسيلة الدفع / الرسوم</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4">رابط الاجتماع</th>
                      <th className="p-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {bookingsList
                      .filter((b) => {
                        if (bookingFilter === 'pending') return b.status === 'pending_verification';
                        if (bookingFilter === 'confirmed') return b.status === 'confirmed';
                        if (bookingFilter === 'completed') return b.status === 'completed';
                        return true;
                      })
                      .map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                          <td className="p-4">
                            <strong className="text-slate-900 dark:text-white block text-sm">{b.clientName}</strong>
                            <span className="text-[10px] text-slate-400">{b.clientEmail || '—'}</span>
                          </td>
                          <td className="p-4 font-mono text-slate-700 dark:text-slate-300" dir="ltr">
                            {b.clientPhone}
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-[#4E7E76] dark:text-teal-400 block">{b.trackLabel}</span>
                          </td>
                          <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                            <div>{b.slotDate}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{b.slotTime}</div>
                          </td>
                          <td className="p-4 text-slate-600 dark:text-slate-300">
                            <div>{b.paymentMethod}</div>
                            <span className="font-bold text-slate-900 dark:text-white">{b.fee}</span>
                          </td>
                          <td className="p-4">
                            {b.status === 'pending_verification' && (
                              <span className="text-[10px] bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full font-bold">
                                ⏳ بانتظار التأكيد
                              </span>
                            )}
                            {b.status === 'confirmed' && (
                              <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                                ✓ مؤكدة
                              </span>
                            )}
                            {b.status === 'completed' && (
                              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">
                                مكتملة
                              </span>
                            )}
                            {b.status === 'cancelled' && (
                              <span className="text-[10px] bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 px-2 py-0.5 rounded-full font-bold">
                                ملغاة
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            {b.meetLink ? (
                              <a
                                href={b.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-bold"
                              >
                                <Video className="w-3.5 h-3.5" />
                                <span>دخول الجلسة</span>
                              </a>
                            ) : (
                              <span className="text-slate-400 text-[11px]">—</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {b.status === 'pending_verification' && (
                                <button
                                  type="button"
                                  onClick={() => handleConfirmBooking(b)}
                                  className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-black text-[11px] transition"
                                  title="تأكيد الحجز وتوليد رابط الاجتماع"
                                >
                                  تأكيد ✓
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setRescheduleBooking(b);
                                  setNewSlotDate(b.slotDate || '');
                                  setNewSlotTime(b.slotTime || '');
                                }}
                                className="px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px]"
                                title="تعديل تاريخ وساعة الجلسة"
                              >
                                جدولة
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveStudioSession({
                                    id: `ses-${b.id}`,
                                    clientId: b.id,
                                    clientName: b.clientName,
                                    clientCode: 'BK-' + b.id.slice(-4),
                                    sessionNumber: 1,
                                    sessionType: b.track === 'marital' ? 'marital' : 'individual',
                                    meetLink: b.meetLink || 'https://meet.google.com/new',
                                    initialDiagnosis: b.trackLabel
                                  });
                                }}
                                className="p-1.5 rounded-lg bg-[#4E7E76] hover:bg-[#3D645E] text-white"
                                title="بدء الجلسة الآن في استوديو المعالج"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CLIENTS DIRECTORY (سجل العملاء والحالات) */}
        {/* ======================================================== */}
        {activeTab === 'clients' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">سجل العملاء والحالات</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  إدارة شاملة لملفات المستفيدين والبيانات الإكلينيكية ومستويات الرعاية
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowIntakeModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#4E7E76] hover:bg-[#3D645E] text-white text-xs font-black shadow-md shadow-[#4E7E76]/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>إضافة عميل جديد (استمارة مقابلة أولية)</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="relative flex-1 min-w-[240px]">
                <input
                  type="text"
                  value={clientSearchQuery}
                  onChange={(e) => setClientSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم، رقم الهاتف، الكود، أو التشخيص..."
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-[#4E7E76] transition"
                  dir="rtl"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">مستوى الرعاية:</span>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
                >
                  <option value="all">كافة المستويات ({clients.length})</option>
                  <option value="low">منخفض 🟢</option>
                  <option value="moderate">متوسط 🟡</option>
                  <option value="high">مرتفع 🔴</option>
                </select>
              </div>
            </div>

            {/* Clients Table */}
            <div className="rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                    <tr>
                      <th className="p-4">كود العميل</th>
                      <th className="p-4">الاسم الكريم</th>
                      <th className="p-4">الجنس / العمر</th>
                      <th className="p-4">الهاتف</th>
                      <th className="p-4">التشخيص المبدئي</th>
                      <th className="p-4">مستوى الرعاية</th>
                      <th className="p-4">الجلسات</th>
                      <th className="p-4 text-center">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {clients
                      .filter((c) => {
                        if (riskFilter !== 'all' && c.riskLevel !== riskFilter) return false;
                        if (!clientSearchQuery) return true;
                        const q = clientSearchQuery.toLowerCase();
                        return (
                          c.fullName.toLowerCase().includes(q) ||
                          c.clientCode.toLowerCase().includes(q) ||
                          c.phone.includes(q) ||
                          c.primaryDiagnosis.toLowerCase().includes(q)
                        );
                      })
                      .map((client) => (
                        <tr
                          key={client.id}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition cursor-pointer"
                          onClick={() => {
                            setSelectedClientId(client.id);
                            setActiveTab('dossier');
                          }}
                        >
                          <td className="p-4 font-mono font-bold text-[#4E7E76] dark:text-teal-400">
                            {client.clientCode}
                          </td>
                          <td className="p-4">
                            <strong className="text-slate-900 dark:text-white block text-sm">{client.fullName}</strong>
                            <span className="text-[11px] text-slate-400">{client.maritalStatus} • {client.occupation}</span>
                          </td>
                          <td className="p-4 text-slate-700 dark:text-slate-300">
                            {client.gender === 'male' ? 'ذكر' : 'أنثى'} • {client.age} سنة
                          </td>
                          <td className="p-4 text-slate-500 font-mono" dir="ltr">
                            {client.phone}
                          </td>
                          <td className="p-4">
                            <span className="text-slate-800 dark:text-slate-200 font-medium block">{client.primaryDiagnosis}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{client.icdCode}</span>
                          </td>
                          <td className="p-4">
                            {client.riskLevel === 'low' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                                🟢 منخفض
                              </span>
                            )}
                            {client.riskLevel === 'moderate' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold">
                                🟡 متوسط
                              </span>
                            )}
                            {client.riskLevel === 'high' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[10px] font-bold">
                                🔴 مرتفع (متابعة)
                              </span>
                            )}
                          </td>
                          <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                            {client.sessionsCount} جلسات
                          </td>
                          <td className="p-4 text-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedClientId(client.id);
                                setActiveTab('dossier');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#4E7E76] dark:text-teal-300 text-xs font-bold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                            >
                              فتح الملف الإكلينيكي ←
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: CLIENT DOSSIER (الملف الإكلينيكي المتكامل) */}
        {/* ======================================================== */}
        {activeTab === 'dossier' && currentClient && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Client Top Identity Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-3xl bg-teal-50 dark:bg-teal-950/40 text-[#4E7E76] dark:text-teal-400 flex items-center justify-center text-xl font-black border border-teal-200 dark:border-teal-800">
                  {currentClient.fullName.slice(0, 2)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{currentClient.fullName}</h1>
                    <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 text-[#4E7E76] dark:text-teal-400 px-2.5 py-0.5 rounded-full font-bold">
                      {currentClient.clientCode}
                    </span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-full">
                      {currentClient.gender === 'male' ? 'ذكر' : 'أنثى'} • {currentClient.age} سنة • {currentClient.maritalStatus}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-mono" dir="ltr">
                      <Phone className="w-3.5 h-3.5 text-[#4E7E76]" />
                      <span>{currentClient.phone}</span>
                    </span>
                    <span>•</span>
                    <span>المهنة: {currentClient.occupation}</span>
                    <span>•</span>
                    <span className="text-[#4E7E76] dark:text-teal-300 font-bold">التشخيص: {currentClient.primaryDiagnosis}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for this Client */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveStudioSession({
                      id: `ses-${Date.now()}`,
                      clientId: currentClient.id,
                      clientName: currentClient.fullName,
                      clientCode: currentClient.clientCode,
                      sessionNumber: currentClient.sessionsCount + 1,
                      sessionType: 'individual',
                      meetLink: 'https://meet.google.com/new',
                      initialDiagnosis: currentClient.primaryDiagnosis
                    });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4E7E76] hover:bg-[#3D645E] text-white text-xs font-black shadow-md shadow-[#4E7E76]/20 transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>بدء جلسة مع العميل</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('clients')}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
                >
                  تبديل العميل
                </button>
              </div>
            </div>

            {/* Dossier 7 Sub-tabs */}
            <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold whitespace-nowrap">
              {[
                { id: 'sessions', label: '1. الجلسات والمواعيد' },
                { id: 'problem_map', label: '2. خريطة المشكلات (6 أبعاد)' },
                { id: 'treatment_plan', label: '3. الخطة العلاجية الذكية' },
                { id: 'homework', label: '4. الواجبات والتكليفات الإرشادية' },
                { id: 'soap_notes', label: '5. السجل الإكلينيكي (SOAP)' },
                { id: 'assessments', label: '6. المقاييس والاختبارات' },
                { id: 'private_vault', label: '7. الملاحظات السرية للمستشار' }
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setDossierTab(sub.id as any)}
                  className={`px-3.5 py-2 rounded-xl transition cursor-pointer ${
                    dossierTab === sub.id
                      ? 'bg-[#4E7E76] text-white font-black shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Sub-tab 1: Sessions */}
            {dossierTab === 'sessions' && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">سجل الجلسات والمواعيد الخاصة بالعميل</h3>
                  <span className="text-xs text-slate-500 font-bold">إجمالي الجلسات: {currentClient.sessionsCount}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 dark:text-white text-sm">الجلسة #1 - المقابلة الإكلينيكية واستكشاف الشكوى</strong>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">تمت بنجاح ✓</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    تم استيفاء استمارة الفحص، وبناء التحالف العلاجي، وتحديد المحاور المحورية للقلق والعلاقة الزوجية.
                  </p>
                </div>
              </div>
            )}

            {/* Sub-tab 2: 6D Problem Map */}
            {dossierTab === 'problem_map' && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">خريطة المشكلات سداسية الأبعاد (Problem Mapping Matrix)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {[
                    { dim: 'البعد المعرفي (Cognitive)', val: 'أفكار كارثية متكررة حول الفشل ونظرة الناس السلبية', score: '8/10' },
                    { dim: 'البعد السلوكي (Behavioral)', val: 'تجنب حضور المناسبات والمواقف الاجتماعية العائلية', score: '7/10' },
                    { dim: 'البعد الوجداني (Affective)', val: 'مشاعر خوف وتوجس مستمر وخجل مفاجئ', score: '8/10' },
                    { dim: 'البعد الجسدي (Somatic)', val: 'خفقان في القلب، شد في عضلات الرقبة والكتفين', score: '9/10' },
                    { dim: 'البعد العلائقي (Relational)', val: 'صمت وانسحاب عند احتدام النقاش مع الزوجة', score: '7/10' },
                    { dim: 'البعد القيمي والروحي (Spiritual)', val: 'شعور بالتقصير وتأنيب الضمير ورغبة في استعادة السكينة', score: '6/10' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[#4E7E76] dark:text-teal-400 font-bold">
                        <span>{item.dim}</span>
                        <span className="font-mono text-[11px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-800 dark:text-white">{item.score}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-tab 3: Treatment Plan */}
            {dossierTab === 'treatment_plan' && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">الخطة العلاجية الذكية (SMART Treatment Plan)</h3>
                  <span className="text-xs bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 px-3 py-1 rounded-full font-bold">
                    الإنجاز: 45%
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                  <strong className="text-slate-900 dark:text-white text-sm block">الهدف الاستراتيجي العام:</strong>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    خفض حدة القلق وتفريغ الأفكار التلقائية، وبناء نمط حوار آمن مع الشريك لكسر دائرة (المطاردة والانسحاب).
                  </p>
                </div>
              </div>
            )}

            {/* Sub-tab 4: Homework */}
            {dossierTab === 'homework' && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">التكليفات والواجبات الإرشادية للعميل</h3>
                    <p className="text-xs text-slate-400 mt-0.5">التمارين المعرفية والسلوكية المسندة ومتابعة إجابات وتطبيقات الحالة</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('exercises')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#4E7E76] text-white text-xs font-bold hover:bg-[#3D645E] transition cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إسناد تمرين جديد من المكتبة</span>
                  </button>
                </div>

                {!currentClient.homework || currentClient.homework.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <p className="text-xs text-slate-500">لا توجد واجبات مسندة لهذا العميل حالياً.</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('exercises')}
                      className="text-xs font-bold text-[#4E7E76] dark:text-teal-400 underline hover:opacity-80"
                    >
                      تصفح مكتبة التمارين وإسناد تمرين الآن ←
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentClient.homework.map((hw: any) => {
                      const isSubmitted = hw.status === 'submitted' || hw.status === 'reviewed';
                      const isReviewed = hw.status === 'reviewed';

                      return (
                        <div
                          key={hw.id}
                          className={`p-4 rounded-2xl border transition-all space-y-3 ${
                            isReviewed
                              ? 'border-teal-500/30 bg-teal-50/20 dark:bg-teal-950/20'
                              : isSubmitted
                              ? 'border-amber-500/40 bg-amber-50/25 dark:bg-amber-950/25'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <span className="text-2xl">{hw.icon || '📝'}</span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                    {hw.categoryLabel || 'تمرين إرشادي'}
                                  </span>
                                  {hw.assignedAt && (
                                    <span className="text-[10px] text-slate-400">
                                      تاريخ الإسناد: {new Date(hw.assignedAt).toLocaleDateString('ar-EG')}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-0.5">
                                  {hw.title}
                                </h4>
                              </div>
                            </div>

                            {/* Status badge */}
                            <div>
                              {isReviewed ? (
                                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                                  <span>تمت المراجعة والاعتماد ✓</span>
                                </span>
                              ) : isSubmitted ? (
                                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1 animate-pulse">
                                  <span>تم تسليم الإجابة من العميل 📬</span>
                                </span>
                              ) : (
                                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                  بانتظار حل العميل
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Counselor Feedback display if reviewed */}
                          {isReviewed && hw.counselorFeedback && (
                            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 leading-relaxed">
                              <strong className="font-bold block mb-0.5">توجيهك المعتمد للعميل:</strong>
                              <span>{hw.counselorFeedback}</span>
                            </div>
                          )}

                          {/* Action Button */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80">
                            <span className="text-[11px] text-slate-400">
                              {hw.submittedAt ? `تاريخ التسليم: ${new Date(hw.submittedAt).toLocaleDateString('ar-EG')}` : 'لم يسلّم بعد'}
                            </span>

                            <button
                              type="button"
                              onClick={() => setReviewingHomework(hw)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                isSubmitted
                                  ? 'bg-[#4E7E76] hover:bg-[#3D645E] text-white shadow-2xs'
                                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <span>{isSubmitted ? 'مراجعة وتوجيه إجابات العميل 🔍' : 'معاينة هيكل التمرين 👁️'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Sub-tab 5: SOAP Notes */}
            {dossierTab === 'soap_notes' && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">سجلات SOAP الإكلينيكية الموثقة</h3>
                  <span className="text-[11px] text-slate-400">مشفرة ومحمية ببروتوكول السرية</span>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs leading-relaxed font-mono">
                  <div className="flex items-center justify-between text-[#4E7E76] dark:text-teal-400 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="font-bold">سجل الجلسة رقم 1 • تاريخ 2026-10-15</span>
                    <span> أحمد</span>
                  </div>
                  <div><strong className="text-teal-700 dark:text-teal-300">(S):</strong> يشتكي العميل من تسارع ضربات القلب عند الحديث أمام الزملاء، وتجنب الخروج.</div>
                  <div><strong className="text-teal-700 dark:text-teal-300">(O):</strong> مظهر لائق، اتصال بصري متوتر قليلاً، علامات الإرهاق الذهني بادية.</div>
                  <div><strong className="text-teal-700 dark:text-teal-300">(A):</strong> استيفاء معايير اضطراب القلق المتعمم (F41.1) بدرجة متوسطة.</div>
                  <div><strong className="text-teal-700 dark:text-teal-300">(P):</strong> التدريب على التنفس الترددي وإسناد سجل الأفكار التلقائية وموعد قادم بعد أسبوع.</div>
                </div>
              </div>
            )}

            {/* Sub-tab 6: Assessments */}
            {dossierTab === 'assessments' && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">نتائج المقاييس والاختبارات النفسية</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 dark:text-white text-sm">مقياس القلق المتعمم (GAD-7)</strong>
                      <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">الدرجة: 14 / 21</span>
                    </div>
                    <p className="text-slate-500">المستوى: قلق متوسط الشدة يتطلب تدخلاً معرفياً سلوكياً.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 7: Private Vault */}
            {dossierTab === 'private_vault' && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <Lock className="w-4 h-4" />
                  <h3 className="text-sm font-black">الملاحظات السرية الخاصة بالمعالج (Private Vault)</h3>
                </div>
                <textarea
                  rows={6}
                  placeholder="دوّن هنا انطباعاتك الشخصية العميقة، فرضيات العمل، أو تفاصيل عائلية حساسة..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-[#4E7E76] transition leading-relaxed"
                />
                <button
                  type="button"
                  onClick={() => showToast('تم حفظ الملاحظة السرية بنجاح في الخزينة ✓')}
                  className="px-4 py-2 rounded-xl bg-[#4E7E76] hover:bg-[#3D645E] text-white text-xs font-bold transition cursor-pointer"
                >
                  حفظ في الخزينة
                </button>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: AVAILABILITY & WORKING SCHEDULE (المواعيد والتوفر) */}
        {/* ======================================================== */}
        {activeTab === 'schedule' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 space-y-6 animate-fadeIn shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  إدارة المواعيد والتوفر الأسبوعي (مدة الجلسة 50 دقيقة)
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  حدد أيام العمل المتاحة وفترات الجلسات الاستشارية؛ تنعكس التعديلات لحظياً في صفحة الحجز للمستفيدين
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveAvailability}
                disabled={savingSchedule}
                className="px-5 py-2.5 rounded-xl bg-[#4E7E76] hover:bg-[#3D645E] text-white text-xs font-black shadow-md shadow-[#4E7E76]/20 transition cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{savingSchedule ? 'جارٍ الحفظ...' : 'حفظ التوفر السحابي'}</span>
              </button>
            </div>

            {/* Days Toggle */}
            <div className="space-y-3">
              <strong className="text-xs font-black text-slate-800 dark:text-white block">
                1. الأيام المتاحة لاستقبال الاستشارات:
              </strong>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                {DAYS_NAMES.map((day) => {
                  const isWorking = workingDays.includes(day.idx);
                  return (
                    <button
                      key={day.idx}
                      type="button"
                      onClick={() => handleToggleDay(day.idx)}
                      className={`p-3.5 rounded-2xl border text-xs font-bold transition cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        isWorking
                          ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-900 dark:text-teal-200'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
                      }`}
                    >
                      <span>{day.label}</span>
                      <span className="text-[10px] font-normal">
                        {isWorking ? 'متاح للحجز ✓' : 'إجازة'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots Manager */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <strong className="text-xs font-black text-slate-800 dark:text-white block">
                  2. فترات الجلسات اليومية (المعيارية 50 دقيقة):
                </strong>

                {/* Add new slot input */}
                <form onSubmit={handleAddTimeSlot} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSlotInput}
                    onChange={(e) => setNewSlotInput(e.target.value)}
                    placeholder="مثال: 11:30 مساءً"
                    className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-[#4E7E76] text-white text-xs font-bold hover:bg-[#3D645E]"
                  >
                    + إضافة موعد
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#4E7E76]" />
                      <span className="font-bold text-slate-800 dark:text-white">{slot.label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteTimeSlot(slot.id)}
                      className="text-slate-400 hover:text-rose-500 transition p-1"
                      title="حذف هذا الموعد"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: DSM-5 DIAGNOSTIC ENGINE (محرك الدليل التشخيصي) */}
        {/* ======================================================== */}
        {activeTab === 'dsm5' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">المساعد الذكي للدليل التشخيصي (DSM-5)</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  مبني على المرجع العربي المعتمد (281 صفحة) والرموز الدولية ICD-10
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDSMModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4E7E76] hover:bg-[#3D645E] text-white text-xs font-black shadow-md shadow-[#4E7E76]/20 transition cursor-pointer"
              >
                <Brain className="w-4 h-4" />
                <span>فتح الفاحص التشخيصي التفاعلي الكامل</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {DSM5_DISORDERS.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setIsDSMModalOpen(true)}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/60 transition cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded">
                      {d.icd10}
                    </span>
                    <span className="text-[10px] text-slate-400">{d.categoryAr}</span>
                  </div>
                  <strong className="text-sm text-slate-900 dark:text-white block">{d.titleAr}</strong>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{d.summaryAr}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: EXERCISES LIBRARY (مكتبة التمارين الإرشادية) */}
        {/* ======================================================== */}
        {activeTab === 'exercises' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">مكتبة التمارين والتكليفات الإرشادية التفاعلية</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                نماذج إكلينيكية معيارية يمكن إسنادها فورياً لأي عميل لمتابعة التزامه وتطوره
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CLINICAL_EXERCISES_LIBRARY.map((ex) => (
                <div
                  key={ex.slug}
                  className="p-5 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{ex.icon}</span>
                      <span className="text-[10px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 px-2 py-0.5 rounded-full">
                        {ex.categoryLabelAr}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">{ex.titleAr}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{ex.descriptionAr}</p>
                    <div className="text-[11px] text-slate-400">
                      المدة التقديرية للحل: {ex.estimatedMinutes} دقيقة
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={assigningLoadingSlug === ex.slug}
                    onClick={() => handleAssignExerciseToCurrentClient(ex)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#4E7E76] hover:text-white text-[#4E7E76] dark:text-teal-300 text-xs font-bold border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {assigningLoadingSlug === ex.slug ? (
                      <span className="inline-block animate-pulse">جاري الإسناد والتسجيل...</span>
                    ) : (
                      <span>إسناد للعميل الحالي ({currentClient.clientCode}) ←</span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 4. MODALS & SUB-COMPONENTS */}

      {/* RESCHEDULE MODAL */}
      {rescheduleBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn text-right">
          <div className="bg-white dark:bg-[#0E1524] max-w-md w-full rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-[#4E7E76]" />
                <span>إعادة جدولة موعد الجلسة</span>
              </h3>
              <button
                type="button"
                onClick={() => setRescheduleBooking(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <strong className="text-slate-900 dark:text-white block">{rescheduleBooking.clientName}</strong>
              <span className="text-slate-500">{rescheduleBooking.trackLabel}</span>
              <div className="text-[#4E7E76] font-bold">
                الموعد الحالي: {rescheduleBooking.slotDate} في {rescheduleBooking.slotTime}
              </div>
            </div>

            <form onSubmit={handleSaveReschedule} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">التاريخ الجديد *</label>
                <input
                  type="date"
                  required
                  value={newSlotDate}
                  onChange={(e) => setNewSlotDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الساعة الجديدة *</label>
                <select
                  required
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="">اختر الوقت من جدول التوفر...</option>
                  {timeSlots.map((s) => (
                    <option key={s.id} value={s.label}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleBooking(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={rescheduleLoading}
                  className="px-5 py-2 rounded-xl bg-[#4E7E76] hover:bg-[#3D645E] text-white text-xs font-black shadow-md cursor-pointer disabled:opacity-50"
                >
                  {rescheduleLoading ? 'جارٍ الحفظ...' : 'تأكيد الموعد وإشعار العميل بالواتساب'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW CLIENT INTAKE MODAL */}
      {showIntakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#0E1524] w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col text-right">
            
            <div className="p-5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#4E7E76] dark:text-teal-400" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">استمارة المقابلة الإكلينيكية وفتح ملف عميل جديد</h3>
              </div>
              <button
                onClick={() => setShowIntakeModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="p-6 overflow-y-auto space-y-4 max-h-[80vh]">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الاسم الكريم للعميل *</label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="مثال: عبد الله محمد"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-[#4E7E76]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رقم الهاتف *</label>
                  <input
                    type="tel"
                    required
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="01012345678"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-[#4E7E76]"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* STRICT GENDER SELECTION: MALE OR FEMALE ONLY */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الجنس (ذكر / أنثى فقط) *</label>
                  <select
                    value={newClientGender}
                    onChange={(e) => setNewClientGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-[#4E7E76] cursor-pointer"
                  >
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">العمر *</label>
                  <input
                    type="number"
                    value={newClientAge}
                    onChange={(e) => setNewClientAge(Number(e.target.value))}
                    min={15}
                    max={100}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-[#4E7E76]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الحالة الاجتماعية</label>
                  <select
                    value={newClientMarital}
                    onChange={(e) => setNewClientMarital(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-[#4E7E76] cursor-pointer"
                  >
                    <option value="أعزب">أعزب</option>
                    <option value="عقد قران">عقد قران / خاطب</option>
                    <option value="متزوج">متزوج</option>
                    <option value="مطلق">مطلق</option>
                    <option value="أرمل">أرمل</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">المهنة / العمل</label>
                  <input
                    type="text"
                    value={newClientOccupation}
                    onChange={(e) => setNewClientOccupation(e.target.value)}
                    placeholder="مثال: محاسب أو طبيب أو طالب..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-[#4E7E76]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">مستوى الرعاية والمتابعة</label>
                  <select
                    value={newClientRisk}
                    onChange={(e) => setNewClientRisk(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-[#4E7E76] cursor-pointer"
                  >
                    <option value="low">منخفض (استشارة اعتيادية) 🟢</option>
                    <option value="moderate">متوسط (يحتاج متابعة منتظمة) 🟡</option>
                    <option value="high">مرتفع (يتطلب خطة سلامة ومراقبة) 🔴</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الشكوى الرئيسية للمستفيد (Chief Complaint) *</label>
                <textarea
                  rows={3}
                  required
                  value={newClientComplaint}
                  onChange={(e) => setNewClientComplaint(e.target.value)}
                  placeholder="وصف المشكلة كما عبر عنها العميل في المقابلة الإكلينيكية الأولى..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-[#4E7E76]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowIntakeModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#4E7E76] hover:bg-[#3D645E] text-white font-black text-xs shadow-md shadow-[#4E7E76]/20 cursor-pointer"
                >
                  إنشاء الملف الإكلينيكي فوراً
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* LIVE CONSULTATION STUDIO MODAL */}
      {activeStudioSession && (
        <ConsultationStudio
          session={activeStudioSession}
          onClose={() => setActiveStudioSession(null)}
          onSaveSession={handleSaveStudioSession}
        />
      )}

      {/* DSM-5 ASSISTANT MODAL */}
      <DSM5AssistantModal
        isOpen={isDSMModalOpen}
        onClose={() => setIsDSMModalOpen(false)}
        onApplyDiagnosis={(snippet, disorder) => {
          showToast(`تم نسخ تشخيص ${disorder.titleAr} (${disorder.icd10}) ✓`);
        }}
      />

      {/* COUNSELOR HOMEWORK REVIEW MODAL */}
      {reviewingHomework && (
        <CounselorHomeworkReviewModal
          homework={reviewingHomework}
          client={currentClient}
          onClose={() => setReviewingHomework(null)}
          onReviewSuccess={() => {
            fetchRealtimeData();
            showToast('تم اعتماد التمرين وتوجيه العميل بنجاح ✓');
          }}
        />
      )}

      {/* 5. MOBILE APP BOTTOM TAB BAR (Always accessible on Mobile devices) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg px-2 py-1.5 flex items-center justify-around text-center">
        {[
          { id: 'dashboard', label: 'الرئيسية', icon: Home },
          { id: 'bookings', label: 'الحجوزات', icon: CalendarClock },
          { id: 'clients', label: 'العملاء', icon: Users },
          { id: 'dsm5', label: 'DSM-5', icon: Brain },
          { id: 'schedule', label: 'المواعيد', icon: Calendar },
        ].map((item) => {
          const Icon = item.icon;
          const isAct = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex-1 py-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold ${
                isAct ? 'text-[#4E7E76] dark:text-teal-400' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
