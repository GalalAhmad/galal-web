'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  X
} from 'lucide-react';

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12.01-14.42-5.74-8.8-10.24-18.73-13.51-29.77-3.27-11.04-4.91-21.84-4.91-32.4 0-14.28 3.59-26.24 10.77-35.88 7.18-9.64 16.27-14.59 27.27-14.85 4.69 0 10.15 1.34 16.39 4.02 6.23 2.68 10.18 4.07 11.84 4.17 1.89 0 6.04-1.51 12.44-4.53 6.4-3.02 12.03-4.32 16.9-3.9 12.44.88 22.38 5.67 29.83 14.37-10.88 6.64-16.21 15.72-15.99 27.23.23 9.06 3.65 16.82 10.27 23.28 6.62 6.46 14.62 10.11 24.01 10.96-2.01 6.18-4.43 12.28-7.27 18.28zM119.22 33.15c0-7.25 2.66-14.16 7.99-20.72 5.33-6.57 11.88-10.78 19.66-12.63.12 1 .18 1.95.18 2.87 0 7.14-2.82 14.15-8.46 21.03-5.64 6.88-12.23 10.9-19.78 12.07-.12-.87-.19-1.74-.19-2.62z"/>
    </svg>
  );
}

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
  const [userSession, setUserSession] = useState<{
    id?: string;
    name: string;
    phone?: string;
    email?: string;
    provider?: string;
  } | null>(null);

  // App Tabs: consultations | courses | assessments | homework | settings
  const [activeTab, setActiveTab] = useState<'consultations' | 'courses' | 'assessments' | 'homework' | 'settings'>('consultations');

  // Client Data States
  const [clientBookings, setClientBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [clientTests, setClientTests] = useState<any[]>([]);
  const [clientCourses, setClientCourses] = useState<any[]>([]);
  const [clientHomework, setClientHomework] = useState<any[]>([]);
  const [clientReadingPlan, setClientReadingPlan] = useState<any[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState<string>('');

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

  // OAuth native sheet state
  const [oauthModalOpen, setOauthModalOpen] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<'google' | 'apple'>('google');
  const [oauthEmail, setOauthEmail] = useState('');
  const [oauthName, setOauthName] = useState('');
  const [oauthLoading, setOauthLoading] = useState(false);

  // Edit Profile Info State
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Check login on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('galal_user_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        setUserSession(parsed);
        setEditName(parsed.name || '');
        setEditPhone(parsed.phone || '');
        setEditEmail(parsed.email || '');
        fetchClientData(parsed);
      }
    } catch (e) {}
  }, []);

  // Fetch client bookings, test records, courses, and homework
  const fetchClientData = async (user: any) => {
    setLoadingBookings(true);

    try {
      // 1. Fetch Bookings matching user phone or email
      const bookRes = await fetch('/api/bookings', { cache: 'no-store' });
      const bookData = await bookRes.json();
      if (bookData.bookings) {
        const userCleanEmail = (user.email || '').trim().toLowerCase();

        const matched = bookData.bookings.filter((b: any) => {
          if (user.phone && phonesMatch(b.clientPhone, user.phone)) {
            return true;
          }
          if (userCleanEmail && b.clientEmail && userCleanEmail === (b.clientEmail || '').trim().toLowerCase()) {
            return true;
          }
          if (user.name && b.clientName && b.clientName.trim().toLowerCase() === user.name.trim().toLowerCase()) {
            return true;
          }
          return false;
        });
        setClientBookings(matched);
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

  // Trigger Google / Apple Quick Login
  const openOAuthSheet = (provider: 'google' | 'apple') => {
    setOauthProvider(provider);
    if (provider === 'google') {
      setOauthEmail('user@gmail.com');
      setOauthName('مستخدم Google الكريم');
    } else {
      setOauthEmail('user@icloud.com');
      setOauthName('مستخدم Apple الكريم');
    }
    setOauthModalOpen(true);
  };

  // Submit OAuth
  const handleOAuthConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setOauthLoading(true);

    try {
      const res = await fetch('/api/auth/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: oauthProvider,
          email: oauthEmail.trim(),
          name: oauthName.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUserSession(data.user);
        setEditName(data.user.name || '');
        setEditPhone(data.user.phone || '');
        setEditEmail(data.user.email || '');
        localStorage.setItem('galal_user_session', JSON.stringify(data.user));
        setOauthModalOpen(false);
        fetchClientData(data.user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOauthLoading(false);
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

            {/* Quick 1-Click Trusted Logins (Google & Apple) */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => openOAuthSheet('google')}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold transition flex items-center justify-center gap-3 shadow-xs cursor-pointer active:scale-98"
              >
                <GoogleIcon />
                <span>المتابعة السريعة بحساب Google</span>
              </button>

              <button
                type="button"
                onClick={() => openOAuthSheet('apple')}
                className="w-full py-3 px-4 rounded-2xl bg-black hover:bg-slate-900 text-white text-xs font-bold transition flex items-center justify-center gap-3 shadow-xs cursor-pointer active:scale-98"
              >
                <AppleIcon />
                <span>المتابعة السريعة بحساب Apple</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-400">أو بالهاتف والبريد</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
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

            {/* Mobile App Segmented Tab Bar (5 Tabs) */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('consultations')}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
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
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
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
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
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
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
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
                onClick={() => setActiveTab('settings')}
                className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                  activeTab === 'settings'
                    ? 'bg-white dark:bg-[#161B22] text-[#154F9C] dark:text-[#60A5FA] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>بياناتي</span>
              </button>
            </div>

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

        {/* NATIVE OAUTH CONFIRMATION SHEET */}
        {oauthModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
            onClick={() => setOauthModalOpen(false)}
          >
            <div
              className="relative max-w-sm w-full bg-white dark:bg-[#161B22] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-right animate-slideUp"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setOauthModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-white">
                    {oauthProvider === 'google' ? 'تسجيل الدخول بحساب Google' : 'تسجيل الدخول بحساب Apple'}
                  </span>
                  {oauthProvider === 'google' ? <GoogleIcon /> : <AppleIcon />}
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                سيتم اعتماد بريدك لربط جلساتك الاستشارية وتكليفاتك ومقاييسك بأعلى درجات الخصوصية.
              </p>

              <form onSubmit={handleOAuthConfirm} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الاسم المقترن بالحساب:
                  </label>
                  <input
                    type="text"
                    required
                    value={oauthName}
                    onChange={(e) => setOauthName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    البريد الإلكتروني المعتمد:
                  </label>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    value={oauthEmail}
                    onChange={(e) => setOauthEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-left text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={oauthLoading}
                    className="w-full py-3 rounded-xl bg-[#4E7E76] hover:bg-[#3D645E] text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {oauthLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>جارٍ الاعتماد الفوري...</span>
                      </>
                    ) : (
                      <span>تأكيد المتابعة والدخول</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
