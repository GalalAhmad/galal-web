'use client';

import UnifiedClientTimeline from '@/components/UnifiedClientTimeline';
import ClinicalProgressCharts from '@/components/ClinicalProgressCharts';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Video,
  BookOpen,
  Brain,
  CheckCircle2,
  Check,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Plus,
  CheckSquare,
  Square,
  FileText,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  GraduationCap,
  BookmarkCheck,
  Compass,
  ArrowUpRight,
  Smile,
  Activity,
  Heart,
  Send,
  X
} from 'lucide-react';
import { getIntakeSummaryPills } from '@/data/intakeQuestions';

// Google & Apple OAuth removed per policy

function phonesMatch(phone1?: string, phone2?: string): boolean {
  if (!phone1 || !phone2) return false;
  const digits1 = phone1.replace(/[^\d]/g, '');
  const digits2 = phone2.replace(/[^\d]/g, '');
  if (!digits1 || !digits2) return false;
  if (digits1 === digits2) return true;
  if (digits1.length >= 8 && digits2.length >= 8) {
    return digits1.slice(-8) === digits2.slice(-8);
  }
  return false;
}

export default function ClientProfilePage() {
  const { user: authUser, logout, login } = useAuth();
  const [userSession, setUserSession] = useState<any>(null);

  // App Tabs: consultations | courses | assessments | homework | settings | consultant_hub | wellbeing
  const [activeTab, setActiveTab] = useState<'consultations' | 'courses' | 'assessments' | 'homework' | 'timeline' | 'settings' | 'consultant_hub' | 'wellbeing'>('consultations');

  // Client Data States
  const [clientBookings, setClientBookings] = useState<any[]>([]);
  const [allConsultations, setAllConsultations] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [clientTests, setClientTests] = useState<any[]>([]);
  const [clientCourses, setClientCourses] = useState<any[]>([]);
  const [clientHomework, setClientHomework] = useState<any[]>([]);
  const [clientReadingPlan, setClientReadingPlan] = useState<any[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState<string>('');

  // Wellbeing & Daily Habits Tracker State
  const [dailyMood, setDailyMood] = useState<{ id: string; label: string; emoji: string; insight: string } | null>(null);
  const [habits, setHabits] = useState([
    { id: 'quran', title: 'ورد القرآن وتدبر آيات السكينة', icon: '📖', done: false },
    { id: 'breathing', title: 'تمرين التنفس العميق والاسترخاء (4-7-8)', icon: '🧘‍♂️', done: false },
    { id: 'walk', title: 'المشي وتفريغ الشحنات الضاغطة', icon: '🚶‍♂️', done: false },
    { id: 'sleep', title: 'النوم المبكر والابتعاد عن الشاشات', icon: '🌙', done: false },
  ]);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);
  const [enrollSuccessMsg, setEnrollSuccessMsg] = useState<string>('');

  // Authentication UI State for non-logged-in users
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');

  // Edit Profile Info State
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  const isConsultant = userSession?.role === 'admin' || userSession?.email === 'admin@galalahmad.com';

  // Check login on mount and whenever authUser updates
  useEffect(() => {
    if (authUser?.name) {
      setUserSession(authUser);
      setEditName(authUser.name || '');
      setEditPhone(authUser.phone || '');
      setEditEmail(authUser.email || '');
      fetchClientData(authUser);
      if (authUser?.role === 'admin' || authUser?.email === 'admin@galalahmad.com') {
        setActiveTab('consultant_hub');
      }
    } else {
      setUserSession(null);
    }
  }, [authUser]);

  // Fetch client bookings, test records, courses, and homework
  const fetchClientData = async (user: any) => {
    setLoadingBookings(true);

    try {
      // 1. Fetch Bookings securely with identity params
      const isConsultantUser = user?.role === 'admin' || user?.email === 'admin@galalahmad.com';
      const bookingUrl = isConsultantUser
        ? '/api/bookings?admin=true'
        : `/api/bookings?phone=${encodeURIComponent(user?.phone || '')}&email=${encodeURIComponent(user?.email || '')}`;

      const bookRes = await fetch(bookingUrl, { cache: 'no-store' });
      const bookData = await bookRes.json();
      if (bookData.bookings) {
        if (isConsultantUser) {
          setAllConsultations(bookData.bookings);
        }
        setClientBookings(bookData.bookings);
      }

      // 2. Fetch User Profile & Test Results & Courses & Homework
      const profRes = await fetch(
        `/api/user/profile?phone=${encodeURIComponent(user.phone || '')}&email=${encodeURIComponent(user.email || '')}`,
        { cache: 'no-store' }
      );
      const profData = await profRes.json();
      if (profData.profile) {
        if (Array.isArray(profData.profile.testResults)) {
          setClientTests(profData.profile.testResults);
        }
        if (Array.isArray(profData.profile.courses)) {
          setClientCourses(profData.profile.courses);
        }
        if (Array.isArray(profData.profile.homework)) {
          setClientHomework(profData.profile.homework);
        }
        if (Array.isArray(profData.profile.readingPlan)) {
          setClientReadingPlan(profData.profile.readingPlan);
        }
        if (profData.profile.clinicalNotes) {
          setClinicalNotes(profData.profile.clinicalNotes);
        }
      }
    } catch (err) {
      console.error('Error fetching client data:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Multi-stage Homework Status & Client Response Handler
  const handleUpdateHomeworkStatus = async (hwId: string, newStatus: string, clientNotes?: string) => {
    try {
      setClientHomework(prev => prev.map(hw => {
        if (hw.id === hwId) {
          return {
            ...hw,
            status: newStatus,
            completed: newStatus === 'completed',
            clientNotes: clientNotes !== undefined ? clientNotes : hw.clientNotes,
          };
        }
        return hw;
      }));

      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userSession?.phone || authUser?.phone,
          email: userSession?.email || authUser?.email,
          updateHomeworkId: hwId,
          updateHomeworkStatus: newStatus,
          clientNotes,
        }),
      });
    } catch (err) {
      console.error('Error updating homework status:', err);
    }
  };

  const [emailNotifEnabled, setEmailNotifEnabled] = useState(true);
  const [inAppNotifEnabled, setInAppNotifEnabled] = useState(true);

  // Toggle Homework Completion Status
  const handleToggleHomework = async (hwId: string) => {
    if (!userSession) return;
    try {
      setClientHomework(prev => prev.map(hw => hw.id === hwId ? { ...hw, completed: !hw.completed } : hw));

      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userSession.phone,
          email: userSession.email,
          toggleHomeworkId: hwId,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Reading Plan Item Status
  const handleToggleReading = async (rpId: string) => {
    if (!userSession) return;
    try {
      setClientReadingPlan(prev => prev.map(rp => rp.id === rpId ? { ...rp, completed: !rp.completed } : rp));

      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userSession.phone,
          email: userSession.email,
          toggleReadingPlanId: rpId,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Handle 1-Click Course Enrollment
  const handleEnrollCourse = async (course: any) => {
    if (!userSession) return;
    setEnrollingCourseId(course.id);
    setEnrollSuccessMsg('');

    try {
      const isAlreadyEnrolled = clientCourses.some(c => c.id === course.id);
      if (isAlreadyEnrolled) {
        setEnrollSuccessMsg('أنت مسجل بالفعل في هذه الدورة وموجودة في حسابك.');
        setTimeout(() => setEnrollSuccessMsg(''), 3500);
        setEnrollingCourseId(null);
        return;
      }

      const newCourseEntry = {
        id: course.id,
        title: course.title,
        instructor: course.instructor || 'أ. جلال أحمد',
        progress: 0,
        enrolledAt: new Date().toISOString(),
      };

      const updatedCourses = [...clientCourses, newCourseEntry];
      setClientCourses(updatedCourses);

      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userSession.phone,
          email: userSession.email,
          courses: updatedCourses,
        }),
      });

      setEnrollSuccessMsg(`تم انضمامك بنجاح إلى "${course.title}"! يمكنك بدء المتابعة فوراً.`);
      setTimeout(() => setEnrollSuccessMsg(''), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setEnrollingCourseId(null);
    }
  };

  // Toggle Daily Habit
  const handleToggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

  // Real Login Handler
  const handleRealLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setLoginError(data.error || 'حدث خطأ في تسجيل الدخول');
        setLoginLoading(false);
        return;
      }

      setUserSession(data.user);
      setEditName(data.user.name || '');
      setEditPhone(data.user.phone || '');
      setEditEmail(data.user.email || '');
      localStorage.setItem('galal_user_session', JSON.stringify(data.user));
      fetchClientData(data.user);
    } catch (err) {
      setLoginError('تعذر الاتصال بالخادم');
    } finally {
      setLoginLoading(false);
    }
  };

  // Real Register Handler
  const handleRealRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (regPassword !== regConfirmPassword) {
      setRegError('كلمة المرور وتأكيدها غير متطابقين');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('كلمة المرور يجب أن لا تقل عن 6 خانات أو أحرف');
      return;
    }

    setRegLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          phone: regPhone.trim(),
          email: regEmail.trim(),
          password: regPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setRegError(data.error || 'تعذر إنشاء الحساب');
        setRegLoading(false);
        return;
      }

      setUserSession(data.user);
      setEditName(data.user.name || '');
      setEditPhone(data.user.phone || '');
      setEditEmail(data.user.email || '');
      localStorage.setItem('galal_user_session', JSON.stringify(data.user));
      fetchClientData(data.user);
    } catch (err) {
      setRegError('حدث خطأ غير متوقع أثناء إنشاء الحساب');
    } finally {
      setRegLoading(false);
    }
  };



  // Demo Login (أحمد الشريف)
  const handleQuickDemoLogin = async () => {
    setLoginIdentifier('01098765432');
    setLoginPassword('123456');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: '01098765432',
          password: '123456',
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUserSession(data.user);
        setEditName(data.user.name || '');
        setEditPhone(data.user.phone || '');
        setEditEmail(data.user.email || '');
        localStorage.setItem('galal_user_session', JSON.stringify(data.user));
        fetchClientData(data.user);
      }
    } catch (e) {
      setLoginError('تعذر تسجيل الدخول بالحساب التجريبي');
    } finally {
      setLoginLoading(false);
    }
  };

  // Save Profile Details
  const handleSaveProfileDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccessMsg('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userSession?.phone,
          email: userSession?.email,
          name: editName.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = { ...userSession, name: editName.trim() };
        setUserSession(updated);
        localStorage.setItem('galal_user_session', JSON.stringify(updated));
        setProfileSuccessMsg('تم تحديث البيانات بنجاح!');
        setTimeout(() => setProfileSuccessMsg(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingProfile(false);
    }
  };

  // Sign out
  const handleSignOut = () => {
    setUserSession(null);
    setClientBookings([]);
    setClientTests([]);
    setClientCourses([]);
    setClientHomework([]);
    setClientReadingPlan([]);
    localStorage.removeItem('galal_user_session');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#0B0F15] text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors antialiased">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 text-right">

        {/* 1. NOT LOGGED IN VIEW */}
        {!userSession ? (
          <div className="max-w-md mx-auto bg-white dark:bg-[#161B22] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-[#4E7E76]/10 text-[#4E7E76] dark:text-[#5E988E] flex items-center justify-center mx-auto shadow-xs">
              <User className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                بوابة المستفيد • جلال أحمد
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                مساحتك المتكاملة لإدارة جلساتك، دوراتك، تكليفاتك المنزلية، ومتابعة القراءة ونتائج مقاييسك.
              </p>
            </div>



            {/* Tab Selector */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('login');
                  setLoginError('');
                }}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                  authTab === 'login'
                    ? 'bg-white dark:bg-slate-800 text-[#4E7E76] dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>تسجيل الدخول</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthTab('register');
                  setRegError('');
                }}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                  authTab === 'register'
                    ? 'bg-white dark:bg-slate-800 text-[#4E7E76] dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>إنشاء حساب</span>
              </button>
            </div>

            {/* LOGIN FORM */}
            {authTab === 'login' && (
              <form onSubmit={handleRealLogin} className="space-y-4 text-right animate-fadeIn">
                {loginError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    رقم الهاتف أو البريد الإلكتروني <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="01000000000 أو user@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs text-left focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    كلمة المرور <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      dir="ltr"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs text-left focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3.5 rounded-2xl bg-[#4E7E76] hover:bg-[#3D645E] disabled:bg-slate-400 text-white font-extrabold text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loginLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>جارٍ تسجيل الدخول...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>تسجيل الدخول</span>
                    </>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-[#4E7E76] dark:hover:text-[#5E988E] underline transition"
                  >
                    الدخول السريع بحساب تجريبي معتمد (أحمد الشريف)
                  </button>
                </div>
              </form>
            )}

            {/* REGISTER FORM */}
            {authTab === 'register' && (
              <form onSubmit={handleRealRegister} className="space-y-4 text-right animate-fadeIn">
                {regError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    الاسم الكامل <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="مثال: عبد الرحمن محمد"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    رقم الهاتف / الواتساب <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="01012345678"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs text-left focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    كلمة المرور (6 أحرف على الأقل) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    dir="ltr"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs text-left focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    تأكيد كلمة المرور <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    dir="ltr"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs text-left focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full py-3.5 rounded-2xl bg-[#4E7E76] hover:bg-[#3D645E] disabled:bg-slate-400 text-white font-extrabold text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{regLoading ? 'جارٍ إنشاء الحساب...' : 'إنشاء حساب ومتابعة'}</span>
                </button>
              </form>
            )}
          </div>
        ) : (
          /* 2. FLAGSHIP MOBILE-FIRST CLIENT DASHBOARD (عوافي / داعم / فامكير STYLE) */
          <div className="space-y-6 animate-fadeIn">

            {/* App Top Bar & User Welcome Card */}
            <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br from-[#154F9C] to-[#3B82F6] text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-md shrink-0">
                    {userSession.name.charAt(0)}
                  </div>
                  <span className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#161B22]" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      أهلاً بك، {userSession.name} 🌿
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                      <ShieldCheck className="w-3 h-3" />
                      <span>مستفيد معتمد</span>
                    </span>
                    {userSession.phone && (
                      <span className="flex items-center gap-1 font-mono" dir="ltr">
                        <Phone className="w-3 h-3 text-[#154F9C]" />
                        <span>{userSession.phone}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href="/booking"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#CC4E46] hover:bg-[#B33D35] text-white text-xs font-bold rounded-xl transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>حجز استشارة</span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 transition cursor-pointer"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar (Overview Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('consultations')}
                className={`p-4 rounded-2xl border text-right transition cursor-pointer ${
                  activeTab === 'consultations'
                    ? 'border-[#154F9C] bg-[#154F9C]/5 dark:bg-[#154F9C]/15 ring-2 ring-[#154F9C]/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B22]'
                }`}
              >
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-bold">الجلسات</span>
                  <Calendar className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {clientBookings.length}
                </div>
                <span className="text-[10px] text-slate-400">جلسة مسجلة</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('courses')}
                className={`p-4 rounded-2xl border text-right transition cursor-pointer ${
                  activeTab === 'courses'
                    ? 'border-[#154F9C] bg-[#154F9C]/5 dark:bg-[#154F9C]/15 ring-2 ring-[#154F9C]/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B22]'
                }`}
              >
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-bold">الدورات والمسارات</span>
                  <GraduationCap className="w-4 h-4 text-[#154F9C]" />
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {clientCourses.length}
                </div>
                <span className="text-[10px] text-slate-400">برنامج نشط</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('assessments')}
                className={`p-4 rounded-2xl border text-right transition cursor-pointer ${
                  activeTab === 'assessments'
                    ? 'border-[#154F9C] bg-[#154F9C]/5 dark:bg-[#154F9C]/15 ring-2 ring-[#154F9C]/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B22]'
                }`}
              >
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-bold">المقاييس النفسية</span>
                  <Brain className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {clientTests.length}
                </div>
                <span className="text-[10px] text-slate-400">مقياس مكتمل</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('homework')}
                className={`p-4 rounded-2xl border text-right transition cursor-pointer ${
                  activeTab === 'homework'
                    ? 'border-[#154F9C] bg-[#154F9C]/5 dark:bg-[#154F9C]/15 ring-2 ring-[#154F9C]/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B22]'
                }`}
              >
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-bold">الخطة والتكليفات</span>
                  <BookOpen className="w-4 h-4 text-cyan-500" />
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {clientHomework.length + clientReadingPlan.length}
                </div>
                <span className="text-[10px] text-slate-400">مهام وقراءات</span>
              </button>
            </div>

            {/* Crisis & Communication Boundaries Banner */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3 text-right">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div className="space-y-1">
                <strong className="block font-bold">تنويه هام بشأن حدود التواصل والطوارئ:</strong>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
                  هذه المنصة مخصصة للجلسات الاستشارية المجدولة والواجبات الإرشادية، وليست قناة للاستجابة الفورية للأزمات الحادة أو الطوارئ الطبية. في حال الطوارئ، يرجى التوجه فوراً لأقرب مشفى أو الاتصال بخطوط المساندة المجانية:
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-700 dark:text-slate-300 font-medium pt-0.5">
                  <span>🇪🇬 مصر: <strong className="font-mono text-amber-900 dark:text-amber-200">16328</strong></span>
                  <span>•</span>
                  <span>🇸🇦 السعودية: <strong className="font-mono text-amber-900 dark:text-amber-200">920033360</strong></span>
                  <span>•</span>
                  <span>🇯🇴 الأردن: <strong className="font-mono text-amber-900 dark:text-amber-200">110</strong> / <strong className="font-mono text-amber-900 dark:text-amber-200">065530837</strong></span>
                  <span>•</span>
                  <span>🇦🇪 الإمارات: <strong className="font-mono text-amber-900 dark:text-amber-200">800-4673</strong> (800-HOPE)</span>
                </div>
              </div>
            </div>

            {/* Mobile App Segmented Tab Bar */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto">
              {isConsultant && (
                <button
                  type="button"
                  onClick={() => setActiveTab('consultant_hub')}
                  className={`flex-1 min-w-[145px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 font-extrabold ${
                    activeTab === 'consultant_hub'
                      ? 'bg-[#154F9C] text-white shadow-xs'
                      : 'text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>بوابة المستشار ({allConsultations.filter(b => b.slotDate === new Date().toISOString().split('T')[0]).length} اليوم)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('wellbeing')}
                className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                  activeTab === 'wellbeing'
                    ? 'bg-white dark:bg-[#161B22] text-[#154F9C] dark:text-[#60A5FA] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smile className="w-3.5 h-3.5 text-emerald-500" />
                <span>المزاج والعادات 🌿</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('consultations')}
                className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                  activeTab === 'consultations'
                    ? 'bg-white dark:bg-[#161B22] text-[#154F9C] dark:text-[#60A5FA] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>جلساتي ({clientBookings.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('courses')}
                className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                  activeTab === 'courses'
                    ? 'bg-white dark:bg-[#161B22] text-[#154F9C] dark:text-[#60A5FA] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>دوراتي ({clientCourses.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('assessments')}
                className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                  activeTab === 'assessments'
                    ? 'bg-white dark:bg-[#161B22] text-[#154F9C] dark:text-[#60A5FA] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>مقاييسي ({clientTests.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('homework')}
                className={`flex-1 min-w-[125px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                  activeTab === 'homework'
                    ? 'bg-white dark:bg-[#161B22] text-[#154F9C] dark:text-[#60A5FA] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>التكليفات والقراءة</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('timeline')}
                className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                  activeTab === 'timeline'
                    ? 'bg-white dark:bg-[#161B22] text-[#4E7E76] dark:text-[#5E988E] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-[#4E7E76]" />
                <span>السجل الزمني 📜</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex-1 min-w-[95px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                  activeTab === 'settings'
                    ? 'bg-white dark:bg-[#161B22] text-[#154F9C] dark:text-[#60A5FA] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>بياناتي</span>
              </button>
            </div>

            {/* TAB 0: CONSULTANT HUB (بوابة المستشار جلال أحمد) */}
            {activeTab === 'consultant_hub' && isConsultant && (
              <div className="space-y-6 animate-fadeIn">
                {/* Consultant Top Banner */}
                <div className="p-6 rounded-3xl bg-linear-to-br from-[#0F1D38] via-[#0D182E] to-[#080F1E] border border-[#154F9C]/40 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                        بوابة المستشار المعتمد
                      </span>
                      <span className="text-xs text-slate-300">
                        {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black">
                      جلساتك الاستشارية اليوم والمواعيد القادمة
                    </h2>
                    <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                      تحكم بمواعيدك وجلساتك من هاتفك مباشرة: دخول قاعة Google Meet بنقرة واحدة، مراسلة العميل بالواتساب، واستعراض الأعراض المسجلة في الاستمارة التشخيصية.
                    </p>
                  </div>

                  <Link
                    href="/admin"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#154F9C] hover:bg-[#124080] text-white text-xs font-bold transition shadow-lg shrink-0"
                  >
                    <span>لوحة التحكم الشاملة (Admin)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Today's Sessions Section */}
                <div className="space-y-3">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-emerald-500" />
                    <span>جلسات اليوم ({allConsultations.filter(b => b.slotDate === new Date().toISOString().split('T')[0] && b.status !== 'cancelled').length})</span>
                  </h3>

                  {(() => {
                    const todayIso = new Date().toISOString().split('T')[0];
                    const todayList = allConsultations.filter(b => b.slotDate === todayIso && b.status !== 'cancelled');

                    if (todayList.length === 0) {
                      return (
                        <div className="p-8 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                          لا توجد جلسات استشارية مجدولة لليوم.
                        </div>
                      );
                    }

                    return todayList.map((b: any) => {
                      const cleanPhone = (b.clientPhone || '').replace(/[^\d]/g, '');
                      const pills = getIntakeSummaryPills(b.track, b.answers);

                      return (
                        <div
                          key={b.id}
                          className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#161B22] border-2 border-emerald-500/40 dark:border-emerald-500/30 shadow-md space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[#154F9C] dark:text-[#60A5FA] font-bold">
                                  {b.id}
                                </span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                  {b.clientName}
                                </span>
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#154F9C]/10 text-[#154F9C] dark:text-[#60A5FA] font-bold">
                                  {b.trackLabel}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>الساعة {b.slotTime} (اليوم)</span>
                              </div>
                            </div>

                            {/* Direct Actions: Google Meet & WhatsApp */}
                            <div className="flex items-center gap-2">
                              {b.meetLink && (
                                <a
                                  href={b.meetLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-black rounded-xl transition shadow-md"
                                >
                                  <Video className="w-4 h-4" />
                                  <span>دخول القاعة (Meet)</span>
                                </a>
                              )}
                              <a
                                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`مرحباً أستاذ(ة) ${b.clientName}، معك المستشار جلال أحمد بخصوص جلستنا اليوم الساعة ${b.slotTime}. رابط القاعة: ${b.meetLink || ''}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-black rounded-xl transition shadow-md"
                              >
                                <Phone className="w-4 h-4" />
                                <span>واتساب المستفيد</span>
                              </a>
                            </div>
                          </div>

                          {/* Intake summary pills */}
                          {pills.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                              <span className="text-slate-400 font-bold">ملخص الأعراض:</span>
                              {pills.map((pill, idx) => (
                                <span
                                  key={idx}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]"
                                >
                                  {pill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Upcoming Sessions Section */}
                <div className="space-y-3 pt-4">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-sky-500" />
                    <span>الجلسات القادمة والمجدولة</span>
                  </h3>

                  {(() => {
                    const todayIso = new Date().toISOString().split('T')[0];
                    const upcomingList = allConsultations.filter(b => b.slotDate > todayIso && b.status !== 'cancelled');

                    if (upcomingList.length === 0) {
                      return (
                        <div className="p-8 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                          لا توجد حجوزات قادمة بعد اليوم.
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcomingList.map((b: any) => {
                          const cleanPhone = (b.clientPhone || '').replace(/[^\d]/g, '');
                          return (
                            <div
                              key={b.id}
                              className="p-5 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                                  {b.clientName}
                                </span>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                                  {b.trackLabel}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                                  <Calendar className="w-3.5 h-3.5 text-[#154F9C]" />
                                  <span>{b.slotDate}</span>
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{b.slotTime}</span>
                                </span>
                              </div>

                              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
                                <a
                                  href={`https://wa.me/${cleanPhone}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{b.clientPhone}</span>
                                </a>
                                {b.meetLink && (
                                  <a
                                    href={b.meetLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#154F9C] dark:text-[#60A5FA] hover:underline font-bold"
                                  >
                                    رابط Meet ↗
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* TAB: UNIFIED CLIENT ACTIVITY TIMELINE */}
            {activeTab === 'timeline' && (
              <div className="space-y-6 animate-fadeIn">
                <UnifiedClientTimeline
                  bookings={clientBookings}
                  testResults={clientTests}
                  homework={clientHomework}
                  courses={clientCourses}
                  onUpdateHomeworkStatus={handleUpdateHomeworkStatus}
                />
              </div>
            )}

            {/* TAB: WELLBEING & DAILY MOOD & HABITS (سجل المزاج والعادات) */}
            {activeTab === 'wellbeing' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Mood Logger Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span>سجل المزاج والسكينة اليومي</span>
                        <Smile className="w-5 h-5 text-amber-500" />
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        كيف تشعر في هذه اللحظة؟ تسمية الشعور نصف التعافي والاتزان النفسي.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { id: 'peaceful', label: 'مطمئن ومبتهج', emoji: '😊', insight: 'الحمد لله، استثمر هذه الحالة الإيجابية في كتابة الامتنان ومشاركة المحبة مع من حولك.' },
                      { id: 'calm', label: 'هادئ ومتزن', emoji: '😌', insight: 'حالة ممتازة من السكون الداخلي، حافظ عليها بالتنفس الواعي والابتعاد عن المشتتات.' },
                      { id: 'neutral', label: 'مستقر وعادي', emoji: '😐', insight: 'يوم طبيعي ومستقر، خذ وقتاً صغيراً للمشي أو قراءة صفحة من القرآن لتجديد الطاقة.' },
                      { id: 'anxious', label: 'قلق أو متوتر', emoji: '😟', insight: 'تذكر أن القلق مجرد فكرة عابرة وليس حقيقة مطلقة؛ مارس تمرين التنفس (4-7-8) الآن.' },
                      { id: 'exhausted', label: 'حزين أو مجهد', emoji: '😔', insight: 'رفقاً بنفسك، لا بأس بالشعور بالتعب؛ امنح جسدك الراحة وتحدث مع شخص آمن.' },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setDailyMood(item)}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                          dailyMood?.id === item.id
                            ? 'border-[#4E7E76] bg-[#4E7E76]/10 dark:bg-[#5E988E]/15 scale-105'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-3xl">{item.emoji}</span>
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  {dailyMood && (
                    <div className="p-4 rounded-2xl bg-[#4E7E76]/10 dark:bg-[#5E988E]/15 border border-[#4E7E76]/20 text-xs text-slate-800 dark:text-slate-200 leading-relaxed space-y-1 animate-fadeIn">
                      <strong className="text-[#3D645E] dark:text-emerald-300 block">رسالة إرشادية لحالتك ({dailyMood.label}):</strong>
                      <p>{dailyMood.insight}</p>
                    </div>
                  )}
                </div>

                {/* Daily Habits Tracker Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span>متتبع العادات الإيجابية والتعافي الذاتي</span>
                        <Activity className="w-5 h-5 text-emerald-500" />
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        عادات يومية بسيطة متوافقة مع الفطرة والقرآن لحماية طاقتك الذهنية والنفسية.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-500">
                      {habits.filter(h => h.done).length} من {habits.length} منجزة
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {habits.map((habit) => (
                      <button
                        type="button"
                        key={habit.id}
                        onClick={() => handleToggleHabit(habit.id)}
                        className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-right cursor-pointer ${
                          habit.done
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{habit.icon}</span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{habit.title}</span>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 ${
                            habit.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {habit.done && <Check className="w-4 h-4" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: CONSULTATIONS & SESSIONS */}
            {activeTab === 'consultations' && (
              <div className="space-y-4 animate-fadeIn">
                {loadingBookings ? (
                  <div className="p-12 text-center text-xs text-slate-400">جارٍ تحميل الجلسات...</div>
                ) : clientBookings.length === 0 ? (
                  <div className="p-10 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-2xs">
                    <div className="w-14 h-14 rounded-2xl bg-[#154F9C]/10 text-[#154F9C] flex items-center justify-center mx-auto">
                      <Calendar className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">لا توجد جلسات مسجلة حالياً</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        يمكنك حجز استشارة جديدة وسيقوم النظام بربطها تلقائياً بملفك وتزويدك برابط اللقاء.
                      </p>
                    </div>
                    <Link
                      href="/booking"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4E7E76] hover:bg-[#3D645E] text-white text-xs font-bold transition shadow-sm"
                    >
                      <span>احجز جلستك الآن</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </Link>
                  </div>
                ) : (
                  clientBookings.map((b: any) => (
                    <div
                      key={b.id}
                      className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[#154F9C] dark:text-[#60A5FA] font-bold">
                              {b.id}
                            </span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                              {b.status === 'confirmed' ? 'جلسة مؤكدة' : 'تم استلام الحجز'}
                            </span>
                          </div>
                          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1.5">
                            {b.trackLabel || 'استشارة متخصصة'}
                          </h3>
                        </div>

                        {/* Google Meet 1-Click Launch Button */}
                        {b.meetLink ? (
                          <a
                            href={b.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-extrabold transition shadow-md hover:shadow-lg"
                          >
                            <Video className="w-4 h-4" />
                            <span>دخول الجلسة (Google Meet)</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                            سيصلك رابط اللقاء قبل الموعد
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Calendar className="w-4 h-4 text-[#154F9C]" />
                          <span>تاريخ الجلسة: <strong>{b.slotDate}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Clock className="w-4 h-4 text-[#154F9C]" />
                          <span>الوقت: <strong>{b.slotTime}</strong> (50 دقيقة)</span>
                        </div>
                      </div>

                      {b.notes && (
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                          <strong className="text-slate-900 dark:text-white block mb-0.5">توجيه المستشار:</strong>
                          <p>{b.notes}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: COURSES & ENROLLED PROGRAMS */}
            {activeTab === 'courses' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#154F9C]" />
                    <span>برامجي ومساراتي التدريبية</span>
                  </h3>
                  <Link
                    href="/courses"
                    className="text-xs text-[#154F9C] dark:text-[#60A5FA] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>استعراض كل الدورات</span>
                    <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0" />
                  </Link>
                </div>

                {clientCourses.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 text-center space-y-3">
                    <GraduationCap className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs text-slate-500">لست مسجلاً في أي برنامج حالياً.</p>
                    <Link
                      href="/courses/family/mithaq"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#154F9C] text-white text-xs font-bold"
                    >
                      <span>الانضمام لبرنامج ميثاق</span>
                    </Link>
                  </div>
                ) : (
                  clientCourses.map((crs: any) => (
                    <div
                      key={crs.id}
                      className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#154F9C]/10 text-[#154F9C] dark:text-[#60A5FA]">
                            {crs.badge || 'برنامج تدريبي'}
                          </span>
                          <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                            {crs.title}
                          </h4>
                        </div>

                        <Link
                          href={crs.link || '/courses'}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold transition"
                        >
                          <span>عرض محتوى البرنامج</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                          <span>نسبة الإنجاز في المسار:</span>
                          <span className="font-mono text-[#154F9C] dark:text-[#60A5FA]">{crs.progress || 0}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-[#154F9C] to-[#3B82F6] rounded-full transition-all duration-500"
                            style={{ width: `${crs.progress || 0}%` }}
                          />
                        </div>
                      </div>

                      {crs.nextSession && (
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>المحاضرة القادمة: <strong>{crs.nextSession}</strong></span>
                        </div>
                      )}
                    </div>
                  ))
                )}

                {/* 1-Click Course Discovery Catalog */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>اكتشف برامج تدريبية وتأهيلية إضافية (انضمام فوري)</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        برامج تأصيلية تجمع بين هدايات القرآن وعلم النفس المعاصر، متاحة للانضمام المباشر بضغطة زر.
                      </p>
                    </div>
                  </div>

                  {enrollSuccessMsg && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{enrollSuccessMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        id: 'anxiety-relief-mastery',
                        title: 'برنامج تفكيك القلق والوساوس واستعادة الهدوء',
                        instructor: 'أ. جلال أحمد',
                        duration: '4 ساعات تدريبية',
                        badge: 'برنامج علاجي ذاتي',
                        desc: 'استراتيجيات عملية مجربة مبنية على العلاج المعرفي السلوكي وتطبيقات السكينة النفسية.',
                      },
                      {
                        id: 'marital-peace-blueprint',
                        title: 'فقه الخلافات الزوجية والأمان العاطفي المشترك',
                        instructor: 'أ. جلال أحمد',
                        duration: '6 ساعات تدريبية',
                        badge: 'مسار العلاقات الزوجية',
                        desc: 'منهج متكامل لكسر دائرة الصدام والخرس الزوجي، وإعادة بناء جسور المودة والتفاهم.',
                      },
                      {
                        id: 'conscious-parenting-firm-gentle',
                        title: 'الوالدية الواعية: فن التربية بالرفق والحزم',
                        instructor: 'أ. جلال أحمد',
                        duration: '3.5 ساعات تدريبية',
                        badge: 'مسار التربية والأسرة',
                        desc: 'كيف تفكك عناد الأطفال وسلوكياتهم المزعجة دون صراخ أو تهديد أو إيذاء نفسي.',
                      },
                    ].map((course) => {
                      const isEnrolled = clientCourses.some(c => c.id === course.id);

                      return (
                        <div
                          key={course.id}
                          className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3"
                        >
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#154F9C]/10 text-[#154F9C] dark:text-[#60A5FA]">
                              {course.badge}
                            </span>
                            <h5 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                              {course.title}
                            </h5>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                              {course.desc}
                            </p>
                          </div>

                          <div className="pt-2">
                            {isEnrolled ? (
                              <span className="w-full py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>مضاف لحسابك بالفعل</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                disabled={enrollingCourseId === course.id}
                                onClick={() => handleEnrollCourse(course)}
                                className="w-full py-2.5 rounded-xl bg-[#154F9C] hover:bg-[#124080] disabled:bg-slate-400 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                {enrollingCourseId === course.id ? (
                                  <span>جارٍ التسجيل...</span>
                                ) : (
                                  <>
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>انضم للبرنامج مجاناً الآن</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PSYCHOLOGICAL ASSESSMENTS */}
            {activeTab === 'assessments' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Brain className="w-4 h-4 text-amber-500" />
                    <span>سجل المقاييس والتقارير النفسية</span>
                  </h3>
                  <Link
                    href="/tests"
                    className="text-xs text-[#154F9C] dark:text-[#60A5FA] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>إجراء مقياس جديد</span>
                    <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0" />
                  </Link>
                </div>

                {clientTests.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 text-center space-y-3">
                    <Brain className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs text-slate-500">لم تقم بإجراء مقاييس نفسية بعد.</p>
                    <Link
                      href="/tests"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4E7E76] text-white text-xs font-bold"
                    >
                      <span>تصفح المقاييس المعتمدة (+40 مقياساً)</span>
                    </Link>
                  </div>
                ) : (
                  clientTests.map((t: any) => (
                    <div
                      key={t.id || t.testId}
                      className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono">{t.date}</span>
                          <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                            {t.testTitle}
                          </h4>
                        </div>
                        <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {t.level}
                        </span>
                      </div>

                      {/* Score bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-500">مؤشر النتيجة السريرية:</span>
                          <span className="font-mono text-slate-900 dark:text-white font-extrabold">
                            {t.scorePercent || 0}% ({t.score} نقطة)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full"
                            style={{ width: `${t.scorePercent || 50}%` }}
                          />
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {t.desc}
                      </p>

                      {t.recommendation && (
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                          <strong className="text-slate-900 dark:text-white block font-bold">
                            توصية المستشار جلال أحمد:
                          </strong>
                          <p className="text-slate-600 dark:text-slate-300">{t.recommendation}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 4: READING PLAN & HOMEWORK TRACKER */}
            {activeTab === 'homework' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Section 1: Assigned Homework */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BookmarkCheck className="w-4 h-4 text-emerald-500" />
                        <span>الواجبات والتكليفات السلوكية</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        تمارين منزلية موجهة لك من المستشار لتعزيز نتائج الجلسة
                      </p>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {clientHomework.filter(h => h.completed).length} من {clientHomework.length} مكتمل
                    </span>
                  </div>

                  {clientHomework.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-4 text-center">لا توجد واجبات مطلوبة حالياً.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {clientHomework.map((hw: any) => (
                        <div
                          key={hw.id}
                          onClick={() => handleToggleHomework(hw.id)}
                          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            hw.completed
                              ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button type="button" className="text-emerald-500 shrink-0">
                              {hw.completed ? (
                                <CheckSquare className="w-5 h-5" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-400" />
                              )}
                            </button>
                            <div>
                              <span
                                className={`text-xs font-bold block ${
                                  hw.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                                }`}
                              >
                                {hw.title}
                              </span>
                              <span className="text-[10px] text-slate-400">تاريخ التكليف: {hw.assignedAt}</span>
                            </div>
                          </div>

                          {hw.link && (
                            <Link
                              href={hw.link}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-[#154F9C] dark:text-[#60A5FA] font-bold hover:underline shrink-0 flex items-center gap-1"
                            >
                              <span>فتح التمرين</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 2: Guided Reading Plan */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#154F9C]" />
                        <span>خطة القراءات الموجهة (أقومية القرآن والتربية)</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        مقالات ورؤى فكرية مقترحة لبناء الوعي والسكينة النفسية
                      </p>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {clientReadingPlan.filter(r => r.completed).length} من {clientReadingPlan.length} مقروء
                    </span>
                  </div>

                  {clientReadingPlan.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-4 text-center">لا توجد قراءات معينة حالياً.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {clientReadingPlan.map((rp: any) => (
                        <div
                          key={rp.id}
                          onClick={() => handleToggleReading(rp.id)}
                          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            rp.completed
                              ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button type="button" className="text-emerald-500 shrink-0">
                              {rp.completed ? (
                                <CheckSquare className="w-5 h-5" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-400" />
                              )}
                            </button>
                            <div>
                              <span
                                className={`text-xs font-bold block ${
                                  rp.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                                }`}
                              >
                                {rp.title}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {rp.category} • وقت القراءة: {rp.readTime}
                              </span>
                            </div>
                          </div>

                          {rp.link && (
                            <Link
                              href={rp.link}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-[#154F9C] dark:text-[#60A5FA] font-bold hover:underline shrink-0 flex items-center gap-1"
                            >
                              <span>قراءة المقال</span>
                              <ArrowLeft className="w-3 h-3 rtl:rotate-0" />
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: ACCOUNT SETTINGS */}
            {activeTab === 'settings' && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fadeIn">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-[#154F9C]" />
                    <span>تعديل بيانات الحساب الشخصي</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    تحديث الاسم أو رقم التواصل المسجل في النظام
                  </p>
                </div>

                {profileSuccessMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{profileSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfileDetails} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      الاسم الكامل:
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      رقم الهاتف / الواتساب:
                    </label>
                    <input
                      type="text"
                      disabled
                      dir="ltr"
                      value={editPhone}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 cursor-not-allowed"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">رقم الهاتف مرتبط بالحجوزات المعتمدة</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      البريد الإلكتروني:
                    </label>
                    <input
                      type="email"
                      disabled
                      dir="ltr"
                      value={editEmail}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-2.5 rounded-xl bg-[#4E7E76] hover:bg-[#3D645E] text-white text-xs font-bold transition shadow-sm"
                  >
                    {savingProfile ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        </main>

      <Footer />
    </div>
  );
}
