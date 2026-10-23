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
  RefreshCw,
  Plus,
  CheckSquare,
  Square,
  FileText,
  Eye,
  EyeOff,
  UserPlus,
  LogIn
} from 'lucide-react';

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
    name: string;
    phone?: string;
    email?: string;
    provider?: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'consultations' | 'assessments' | 'homework'>('consultations');

  // Bookings list for this user
  const [clientBookings, setClientBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Completed tests list for this user
  const [clientTests, setClientTests] = useState<any[]>([]);
  const [loadingTests, setLoadingTests] = useState(false);

  // Assigned Homework & Readings list
  const [clientHomework, setClientHomework] = useState<any[]>([]);

  // Authentication UI State for non-logged-in users
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  // Login inputs
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
  const [regSuccess, setRegSuccess] = useState('');

  // Forgot password inputs
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');

  // Check login on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('galal_user_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        setUserSession(parsed);
        fetchClientData(parsed);
      }
    } catch (e) {}
  }, []);

  // Fetch client bookings, test records, and homework
  const fetchClientData = async (user: any) => {
    setLoadingBookings(true);
    setLoadingTests(true);

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

      // 2. Fetch User Profile & Test Results & Homework
      const profRes = await fetch(
        `/api/user/profile?phone=${encodeURIComponent(user.phone || '')}&email=${encodeURIComponent(user.email || '')}`,
        { cache: 'no-store' }
      );
      const profData = await profRes.json();
      if (profData.profile) {
        if (Array.isArray(profData.profile.testResults)) {
          setClientTests(profData.profile.testResults);
        }
        if (Array.isArray(profData.profile.homework)) {
          setClientHomework(profData.profile.homework);
        }
      }
    } catch (err) {
      console.error('Error fetching client data:', err);
    } finally {
      setLoadingBookings(false);
      setLoadingTests(false);
    }
  };

  // Toggle Homework Completion Status
  const handleToggleHomework = async (hwId: string) => {
    if (!userSession) return;
    try {
      // optimistic update
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
      try {
        localStorage.setItem('galal_user_session', JSON.stringify(data.user));
      } catch (err) {}

      fetchClientData(data.user);
    } catch (err) {
      setLoginError('تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً');
    } finally {
      setLoginLoading(false);
    }
  };

  // Real Register Handler
  const handleRealRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

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
      try {
        localStorage.setItem('galal_user_session', JSON.stringify(data.user));
      } catch (err) {}

      setRegSuccess('تم إنشاء حسابك وتأكيده بنجاح!');
      fetchClientData(data.user);
    } catch (err) {
      setRegError('حدث خطأ غير متوقع أثناء إنشاء الحساب');
    } finally {
      setRegLoading(false);
    }
  };

  // Demo Login Handler
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
        localStorage.setItem('galal_user_session', JSON.stringify(data.user));
        fetchClientData(data.user);
      }
    } catch (e) {
      setLoginError('تعذر تسجيل الدخول بالحساب التجريبي');
    } finally {
      setLoginLoading(false);
    }
  };

  // Forgot Password Handler
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotMsg('');
    setForgotLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: forgotIdentifier.trim(),
          newPassword: forgotNewPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setForgotError(data.error || 'تعذر إعادة تعيين كلمة المرور');
        setForgotLoading(false);
        return;
      }

      setForgotMsg(data.message || 'تم تعيين كلمة المرور بنجاح!');
      setTimeout(() => {
        setShowForgotModal(false);
        setAuthTab('login');
        setLoginIdentifier(forgotIdentifier);
        setForgotMsg('');
      }, 2000);
    } catch (err) {
      setForgotError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setForgotLoading(false);
    }
  };

  // Sign out
  const handleSignOut = () => {
    setUserSession(null);
    setClientBookings([]);
    setClientTests([]);
    setClientHomework([]);
    localStorage.removeItem('galal_user_session');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#0B0F15] text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors antialiased">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 text-right">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center justify-between text-xs font-bold">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition"
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-0" />
            <span>العودة للرئيسية</span>
          </Link>
          <span className="text-slate-400">بوابة المستفيد • الملف الشخصي والمتابعة</span>
        </div>

        {/* 1. NOT LOGGED IN VIEW: REAL AUTHENTICATION PORTAL */}
        {!userSession ? (
          <div className="max-w-md mx-auto bg-white dark:bg-[#161B22] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-[#4E7E76]/10 text-[#4E7E76] dark:text-[#5E988E] flex items-center justify-center mx-auto">
              <User className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                بوابة المستفيد • جلال أحمد
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                سجّل دخولك للوصول إلى جلساتك المعتمدة، روابط Google Meet، وتكليفاتك وتاريخ مقاييسك النفسية.
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
                className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
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
                className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                  authTab === 'register'
                    ? 'bg-white dark:bg-slate-800 text-[#4E7E76] dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>إنشاء حساب جديد</span>
              </button>
            </div>

            {/* TAB 1: REAL LOGIN FORM */}
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
                  <div className="relative">
                    <input
                      type="text"
                      required
                      dir="ltr"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="01000000000 أو user@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs text-left focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      كلمة المرور <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] text-[#4E7E76] dark:text-[#5E988E] hover:underline cursor-pointer"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  </div>
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
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3.5 rounded-2xl bg-[#4E7E76] hover:bg-[#3D645E] disabled:bg-slate-400 text-white font-extrabold text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loginLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>جارٍ التحقق وتسجيل الدخول...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>تسجيل الدخول</span>
                    </>
                  )}
                </button>

                {/* Demo account quick login button */}
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

            {/* TAB 2: REAL REGISTER FORM */}
            {authTab === 'register' && (
              <form onSubmit={handleRealRegister} className="space-y-4 text-right animate-fadeIn">
                {regError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                {regSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{regSuccess}</span>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      البريد الإلكتروني <span className="text-slate-400 font-normal">(اختياري)</span>
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs text-left focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      كلمة المرور <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        dir="ltr"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="6 أحرف على الأقل"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs text-left focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      تأكيد كلمة المرور <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      dir="ltr"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="أعد إدخال كلمة المرور"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs text-left focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    بياناتك الشخصية وجلساتك الاستشارية محمية ومحاطة بميثاق السرية التامة وفق أعلى المعايير الأخلاقية والمهنية.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full py-3.5 rounded-2xl bg-[#4E7E76] hover:bg-[#3D645E] disabled:bg-slate-400 text-white font-extrabold text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {regLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>جارٍ إنشاء الحساب وتجهيز ملفك...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>إنشاء الحساب ومتابعة</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD MODAL */}
            {showForgotModal && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
                onClick={() => setShowForgotModal(false)}
              >
                <div
                  className="relative max-w-md w-full bg-white dark:bg-[#161B22] rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-right animate-slideUp"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      إعادة تعيين كلمة المرور
                    </h3>
                  </div>

                  {forgotError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold">
                      {forgotError}
                    </div>
                  )}

                  {forgotMsg && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                      {forgotMsg}
                    </div>
                  )}

                  <form onSubmit={handleForgotSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        رقم الهاتف أو البريد الإلكتروني المسجل:
                      </label>
                      <input
                        type="text"
                        required
                        dir="ltr"
                        value={forgotIdentifier}
                        onChange={(e) => setForgotIdentifier(e.target.value)}
                        placeholder="01000000000 أو user@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-left text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        كلمة المرور الجديدة:
                      </label>
                      <input
                        type="password"
                        required
                        dir="ltr"
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="6 أحرف أو أرقام على الأقل"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-left text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="w-full py-3 rounded-xl bg-[#4E7E76] hover:bg-[#3D645E] text-white font-bold text-xs transition"
                      >
                        {forgotLoading ? 'جارٍ الحفظ...' : 'حفظ كلمة المرور الجديدة'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 2. LOGGED IN DASHBOARD */
          <div className="space-y-6 animate-fadeIn">
            
            {/* Profile Header Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#154F9C] to-[#3B82F6] text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
                  {userSession.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {userSession.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                      <ShieldCheck className="w-3 h-3" />
                      <span>مستفيد موثق</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    {userSession.phone && (
                      <span className="flex items-center gap-1" dir="ltr">
                        <Phone className="w-3 h-3 text-[#154F9C]" />
                        <span>{userSession.phone}</span>
                      </span>
                    )}
                    {userSession.email && (
                      <span className="flex items-center gap-1" dir="ltr">
                        <Mail className="w-3 h-3 text-[#154F9C]" />
                        <span>{userSession.email}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

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

            {/* Dashboard Navigation Tabs (3 Core Tabs) */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('consultations')}
                className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'consultations'
                    ? 'bg-white dark:bg-[#161B22] text-[#154F9C] dark:text-[#60A5FA] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>جلساتي وحجوزاتي ({clientBookings.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('assessments')}
                className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'assessments'
                    ? 'bg-white dark:bg-[#161B22] text-[#154F9C] dark:text-[#60A5FA] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Brain className="w-4 h-4" />
                <span>سجل المقاييس والتقارير ({clientTests.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('homework')}
                className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'homework'
                    ? 'bg-white dark:bg-[#161B22] text-[#154F9C] dark:text-[#60A5FA] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>التكليفات والواجبات ({clientHomework.length})</span>
              </button>
            </div>

            {/* TAB 1: CONSULTATIONS & BOOKINGS */}
            {activeTab === 'consultations' && (
              <div className="space-y-4">
                {loadingBookings ? (
                  <div className="p-12 text-center text-xs text-slate-400">جارٍ تحميل بيانات جلساتك...</div>
                ) : clientBookings.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-2xs">
                    <div className="w-14 h-14 rounded-2xl bg-[#154F9C]/10 text-[#154F9C] flex items-center justify-center mx-auto">
                      <Calendar className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-800 dark:text-white">لا توجد جلسات مسجلة بعد</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        يمكنك حجز جلستك الاستشارية الخاصة الآن وتحديد الموعد الأنسب وسداد الرسوم مباشرة.
                      </p>
                    </div>
                    <Link
                      href="/booking"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#CC4E46] hover:bg-[#B33D35] text-white font-bold text-xs rounded-xl transition shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>بدء حجز استشارة جديدة</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clientBookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-5 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 text-right flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-md">
                              {b.id}
                            </span>

                            <span
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                b.status === 'confirmed'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                  : b.status === 'completed'
                                  ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                              }`}
                            >
                              {b.status === 'confirmed'
                                ? 'مؤكد ومجدول'
                                : b.status === 'completed'
                                ? 'مكتمل بنجاح'
                                : 'قيد مراجعة التحويل'}
                            </span>
                          </div>

                          <div>
                            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                              {b.trackLabel}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-[#154F9C] dark:text-[#60A5FA] font-bold mt-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{b.slotDate} — {b.slotTime}</span>
                            </div>
                          </div>

                          {/* Meeting Link */}
                          {b.meetLink && (
                            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">رابط الجلسة أونلاين:</span>
                              <a
                                href={b.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-2xs"
                              >
                                <Video className="w-3.5 h-3.5" />
                                <span>دخول Google Meet</span>
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Homework & Reading Recommendations assigned to this booking */}
                        {b.homework && b.homework.length > 0 && (
                          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-[#154F9C]" />
                              <span>تكليفات ومقالات إرشادية لهذه الجلسة:</span>
                            </span>
                            <div className="space-y-1">
                              {b.homework.map((hw: any, idx: number) => (
                                <Link
                                  key={idx}
                                  href={`/articles#${hw.id || ''}`}
                                  className="block p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:text-[#154F9C] transition truncate font-medium"
                                >
                                  • {hw.title || 'مقال إرشادي موصى به'}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PSYCHOLOGICAL ASSESSMENTS HISTORY */}
            {activeTab === 'assessments' && (
              <div className="space-y-4">
                {loadingTests ? (
                  <div className="p-12 text-center text-xs text-slate-400">جارٍ تحميل نتائج مقاييسك...</div>
                ) : clientTests.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-2xs">
                    <div className="w-14 h-14 rounded-2xl bg-[#154F9C]/10 text-[#154F9C] flex items-center justify-center mx-auto">
                      <Brain className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-800 dark:text-white">لم تجرِ مقاييس نفسية حتى الآن</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        تصفح مكتبة المقاييس الـ 41 المقننة علمياً واكتشف مؤشرات صحتك النفسية واستقرارك بخصوصية وسرية.
                      </p>
                    </div>
                    <Link
                      href="/tests"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#154F9C] hover:bg-[#103D7A] text-white font-bold text-xs rounded-xl transition shadow-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>استعراض المقاييس النفسية</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clientTests.map((t, idx) => (
                      <div
                        key={t.id || idx}
                        className="p-5 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 text-right flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                              {t.date || 'مؤخراً'}
                            </span>
                            <span className="font-black text-xs text-[#154F9C] dark:text-[#60A5FA]">
                              الدرجة: {t.scorePercent || t.score}%
                            </span>
                          </div>

                          <div>
                            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                              {t.testTitle}
                            </h3>
                            <span className="inline-block mt-1 text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                              المستوى: {t.level}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                            {t.desc}
                          </p>

                          {t.recommendation && (
                            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-[11px] text-amber-900 dark:text-amber-200">
                              <strong>التوجيه الاستشاري:</strong> {t.recommendation}
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                          <Link
                            href={t.testId ? `/tests/${t.testId}` : '/tests'}
                            className="text-[#154F9C] dark:text-[#60A5FA] hover:underline flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>إعادة المقياس</span>
                          </Link>

                          <Link
                            href="/booking"
                            className="text-slate-600 dark:text-slate-300 hover:text-[#154F9C] transition flex items-center gap-1"
                          >
                            <span>مناقشة في جلسة</span>
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: HOMEWORK & ASSIGNED READINGS */}
            {activeTab === 'homework' && (
              <div className="space-y-4">
                {clientHomework.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-2xs">
                    <div className="w-14 h-14 rounded-2xl bg-[#154F9C]/10 text-[#154F9C] flex items-center justify-center mx-auto">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <h3 className="font-extrabold text-base text-slate-800 dark:text-white">لا توجد تكليفات نشطة حالياً</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      عند انعقاد جلستك مع المستشار جلال أحمد، ستجد هنا التكليفات القرائية والتمارين السلوكية المخصصة لحالتك.
                    </p>
                    <Link
                      href="/articles"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition"
                    >
                      <FileText className="w-4 h-4" />
                      <span>تصفح مقالات التثقيف النفسي</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-500">
                      التكليفات والواجبات الموصى بها من المستشار ({clientHomework.filter(h => h.completed).length} من {clientHomework.length} مكتملة):
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {clientHomework.map((hw: any, idx: number) => (
                        <div
                          key={hw.id || idx}
                          onClick={() => handleToggleHomework(hw.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                            hw.completed
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
                              : 'bg-white dark:bg-[#161B22] border-slate-200 dark:border-slate-800 hover:border-[#154F9C]'
                          }`}
                        >
                          <div className="mt-0.5">
                            {hw.completed ? (
                              <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-400" />
                            )}
                          </div>

                          <div className="space-y-1 flex-1">
                            <span className={`text-xs font-bold block ${hw.completed ? 'line-through opacity-70' : 'text-slate-900 dark:text-white'}`}>
                              {hw.title}
                            </span>
                            {hw.assignedAt && (
                              <span className="text-[10px] text-slate-400 block">
                                تاريخ التكليف: {hw.assignedAt}
                              </span>
                            )}
                            {hw.link && (
                              <Link
                                href={hw.link}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#154F9C] dark:text-[#60A5FA] hover:underline pt-1"
                              >
                                <span>قراءة المقال / فتح الرابط</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
