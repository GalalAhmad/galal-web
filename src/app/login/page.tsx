'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  User,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  UserPlus,
  LogIn,
  Globe,
  Heart,
  Calendar,
  ExternalLink,
  KeyRound,
  X,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/profile';
  const { user, login } = useAuth();
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Forgot Password Interactive Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regGender, setRegGender] = useState('male');
  const [regAgeGroup, setRegAgeGroup] = useState('26-35');
  const [regMaritalStatus, setRegMaritalStatus] = useState('married');
  const [regCountry, setRegCountry] = useState('مصر');
  const [regCity, setRegCity] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Role-safe destination resolver to completely prevent redirect loops
  const resolveSafeDestination = (role?: string, target?: string | null): string => {
    if (role === 'counselor') {
      if (target && (target.startsWith('/counselor') || target.startsWith('/admin'))) {
        return target;
      }
      return '/counselor';
    }
    if (role === 'admin') {
      return '/admin';
    }
    // Clients must never be forwarded to admin or counselor workspaces
    if (target && !target.startsWith('/admin') && !target.startsWith('/counselor')) {
      return target;
    }
    return '/profile';
  };

  // Auto redirect if already logged in
  useEffect(() => {
    if (user?.name) {
      const dest = resolveSafeDestination(user.role, searchParams.get('redirect'));
      router.replace(dest);
    }
  }, [user, searchParams, router]);

  // Handle Password Reset
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');

    if (forgotNewPassword.length < 6) {
      setForgotError('كلمة المرور الجديدة يجب أن لا تقل عن 6 خانات.');
      setForgotLoading(false);
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('كلمتا المرور غير متطابقتين.');
      setForgotLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: forgotIdentifier.trim(),
          newPassword: forgotNewPassword.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setForgotError(data.error || 'تعذر إعادة تعيين كلمة المرور، يرجى التأكد من صحة البيانات.');
        return;
      }
      setForgotSuccess('تم تعيين كلمة المرور الجديدة بنجاح! يمكنك الآن تسجيل الدخول بها.');
      setTimeout(() => {
        setShowForgotModal(false);
        setActiveTab('login');
        setLoginIdentifier(forgotIdentifier);
        setForgotSuccess('');
      }, 1800);
    } catch (err) {
      setForgotError('حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة لاحقاً.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Handle Standard Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
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
        setLoginError(data.error || 'حدث خطأ أثناء تسجيل الدخول');
        setLoginLoading(false);
        return;
      }

      // Save user session into AuthContext
      login(data.user);

      if (data.user.role === 'counselor' || data.user.role === 'admin') {
        try {
          localStorage.setItem('galal_admin_session', 'active');
        } catch (e) {}
      }

      // Role-safe redirect with replace to avoid history loops
      const dest = resolveSafeDestination(data.user.role, searchParams.get('redirect'));
      router.replace(dest);
    } catch (err) {
      setLoginError('تعذر الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.');
      setLoginLoading(false);
    }
  };

  // Handle Standard Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (regPassword !== regConfirmPassword) {
      setRegError('كلمة المرور وتأكيدها غير متطابقين، يرجى التأكد');
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
          gender: regGender,
          ageGroup: regAgeGroup,
          maritalStatus: regMaritalStatus,
          country: regCountry,
          city: regCity.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setRegError(data.error || 'تعذر إنشاء الحساب');
        setRegLoading(false);
        return;
      }

      // Save user session into AuthContext
      login(data.user);

      setRegSuccess('تم إنشاء حسابك بنجاح! جاري توجيهك...');

      setTimeout(() => {
        router.replace(redirectPath);
      }, 500);
    } catch (err) {
      setRegError('حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.');
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B11] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-[#4E7E76] selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-4 sm:py-10 px-3 sm:px-6">
        <div className="w-full max-w-lg bg-white dark:bg-[#0E1524] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden animate-fadeIn">
          
          {/* Header with Official Logo - Native App Feel */}
          <div className="p-5 sm:p-8 bg-linear-to-b from-slate-50 via-white to-white dark:from-[#111A2E] dark:via-[#0E1524] dark:to-[#0E1524] border-b border-slate-100 dark:border-slate-800 text-center space-y-2.5">
            <Link href="/" className="inline-block group" title="الصفحة الرئيسية — د. جلال أحمد">
              <img
                src={theme === 'dark' ? '/assets/logo-white.png' : '/assets/logo.png'}
                alt="شعار د. جلال أحمد"
                className="h-12 sm:h-16 w-auto mx-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
              {activeTab === 'login' ? 'تسجيل الدخول إلى حسابك' : 'إنشاء حساب جديد في المنصة'}
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              بوابتك الخاصة والآمنة لمتابعة استشاراتك النفسية والزوجية، نتائج مقاييسك، ومهامك الإرشادية.
            </p>

            {/* Native Mobile App Style Tabs Toggle */}
            <div className="pt-2 flex rounded-2xl bg-slate-100 dark:bg-slate-900/90 p-1.5 max-w-xs mx-auto border border-slate-200/60 dark:border-slate-800">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setLoginError(''); }}
                className={`flex-1 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white shadow-xs scale-100 font-extrabold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>تسجيل الدخول</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('register'); setRegError(''); }}
                className={`flex-1 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white shadow-xs scale-100 font-extrabold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>إنشاء حساب</span>
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            {/* LOGIN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-1.5 text-right">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    رقم الهاتف أو البريد الإلكتروني المسجل
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="مثال: 01014876666 أو email@example.com"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs text-right focus:outline-hidden focus:border-[#4E7E76] transition"
                      dir="auto"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5 text-right">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      كلمة المرور
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotModal(true);
                        setForgotIdentifier(loginIdentifier);
                        setForgotError('');
                        setForgotSuccess('');
                      }}
                      className="text-[11px] font-bold text-[#4E7E76] dark:text-[#5E988E] hover:underline cursor-pointer"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور الخاصة بك"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs text-right focus:outline-hidden focus:border-[#4E7E76] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute left-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3.5 rounded-full bg-[#4E7E76] hover:bg-[#3D645E] active:scale-[0.98] text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-[#4E7E76]/20 cursor-pointer disabled:opacity-50 mt-4 select-none"
                >
                  {loginLoading ? (
                    <span className="inline-block animate-pulse">جاري التحقق وتسجيل الدخول...</span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>دخول إلى حسابي</span>
                    </>
                  )}
                </button>

                {/* Footer with Clickable Reset Password & WhatsApp Links */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-2 text-center">
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      نسيت كلمة المرور الخاصة بحسابك؟
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotModal(true);
                          setForgotIdentifier(loginIdentifier);
                          setForgotError('');
                          setForgotSuccess('');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 text-[#4E7E76] dark:text-[#5E988E] font-black hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>إعادة تعيينها ذاتياً هنا</span>
                      </button>
                      <a
                        href="https://wa.me/201014876666?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20%D8%A3%D8%B3%D8%AA%D8%A7%D8%B0%20%D8%AC%D9%84%D8%A7%D9%84%D8%8C%20%D9%86%D8%B3%D9%8A%D8%AA%20%D9%83%D9%84%D9%85%D8%A9%20%D8%A7%D9%84%D9%85%D8%B1%D9%88%D8%B1%20%D9%84%D8%AD%D8%B3%D8%A7%D8%A8%D9%8A%20%D9%88%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A7%D8%B3%D8%AA%D8%B9%D8%A7%D8%AF%D8%AA%D9%87%D8%A7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>مراسلة د. جلال عبر واتساب</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* REGISTER FORM */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-right">
                {regError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                {regSuccess && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{regSuccess}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    الاسم الكريم (أو الاسم المستعار للخصوصية) *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="مثال: د. أحمد الشريف أو سارة"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs text-right focus:outline-hidden focus:border-[#4E7E76] transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      رقم الواتساب للتنسيق *
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="مثال: 01014876666 أو +966..."
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs text-right focus:outline-hidden focus:border-[#4E7E76] transition"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      البريد الإلكتروني (لتفاصيل الجلسة) *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs text-right focus:outline-hidden focus:border-[#4E7E76] transition"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Dropdowns for demographic profiling */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#4E7E76]" />
                      <span>الجنس</span>
                    </label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:border-[#4E7E76] transition cursor-pointer"
                    >
                      <option value="male">ذكر</option>
                      <option value="female">أنثى</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#4E7E76]" />
                      <span>الفئة العمرية</span>
                    </label>
                    <select
                      value={regAgeGroup}
                      onChange={(e) => setRegAgeGroup(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:border-[#4E7E76] transition cursor-pointer"
                    >
                      <option value="18-25">18 - 25 سنة (شباب / يافعين)</option>
                      <option value="26-35">26 - 35 سنة</option>
                      <option value="36-45">36 - 45 سنة</option>
                      <option value="46-55">46 - 55 سنة</option>
                      <option value="55+">أكبر من 55 سنة</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-[#4E7E76]" />
                      <span>الحالة الاجتماعية</span>
                    </label>
                    <select
                      value={regMaritalStatus}
                      onChange={(e) => setRegMaritalStatus(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:border-[#4E7E76] transition cursor-pointer"
                    >
                      <option value="single">أعزب / عزباء</option>
                      <option value="engaged">مقبل على الزواج / خطوبة</option>
                      <option value="married">متزوج / متزوجة</option>
                      <option value="divorced">منفصل / منفصلة</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-[#4E7E76]" />
                      <span>الدولة / الإقامة</span>
                    </label>
                    <select
                      value={regCountry}
                      onChange={(e) => setRegCountry(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:border-[#4E7E76] transition cursor-pointer"
                    >
                      <option value="مصر">جمهورية مصر العربية</option>
                      <option value="السعودية">المملكة العربية السعودية</option>
                      <option value="الإمارات">دولة الإمارات العربية المتحدة</option>
                      <option value="قطر">دولة قطر</option>
                      <option value="الكويت">دولة الكويت</option>
                      <option value="سلطنة عمان">سلطنة عُمان</option>
                      <option value="الأردن">المملكة الأردنية الهاشمية</option>
                      <option value="أوروبا / أمريكا">أوروبا / أمريكا / كندا</option>
                      <option value="دولة أخرى">دولة أخرى</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      كلمة المرور *
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="6 أحرف أو أرقام على الأقل"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs text-right focus:outline-hidden focus:border-[#4E7E76] transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute left-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      تأكيد كلمة المرور *
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="أعد إدخال كلمة المرور"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs text-right focus:outline-hidden focus:border-[#4E7E76] transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full py-3.5 rounded-full bg-[#4E7E76] hover:bg-[#3D645E] text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-[#4E7E76]/20 cursor-pointer disabled:opacity-50 mt-4"
                >
                  {regLoading ? (
                    <span className="inline-block animate-pulse">جاري إنشاء ملفك الشخصي...</span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>إنشاء الحساب وبدء الاستفادة</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

        </div>

        {/* FORGOT PASSWORD MODAL */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-white dark:bg-[#0E1524] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-4 text-right">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#4E7E76]/10 text-[#4E7E76] dark:text-[#5E988E] flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      استعادة كلمة المرور
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      إعادة تعيين كلمة المرور لحسابك المسجل
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {forgotError && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{forgotSuccess}</span>
                </div>
              )}

              <form onSubmit={handleForgotSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    رقم الهاتف أو البريد الإلكتروني المسجل:
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="مثال: 01014876666 أو email@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs text-right focus:outline-hidden focus:border-[#4E7E76] transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    كلمة المرور الجديدة (6 خانات أو أكثر):
                  </label>
                  <div className="relative">
                    <input
                      type={showForgotNewPassword ? 'text' : 'password'}
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور الجديدة"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs text-right focus:outline-hidden focus:border-[#4E7E76] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                      className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    تأكيد كلمة المرور الجديدة:
                  </label>
                  <input
                    type="password"
                    required
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    placeholder="أعد إدخال كلمة المرور للتأكيد"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs text-right focus:outline-hidden focus:border-[#4E7E76] transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 rounded-full bg-[#4E7E76] hover:bg-[#3D645E] text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-[#4E7E76]/20 cursor-pointer disabled:opacity-50 mt-3"
                >
                  {forgotLoading ? (
                    <span className="inline-block animate-pulse">جارٍ حفظ كلمة المرور...</span>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>حفظ كلمة المرور الجديدة</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <a
                  href="https://wa.me/201014876666?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20%D8%A3%D8%B3%D8%AA%D8%A7%D8%B0%20%D8%AC%D9%84%D8%A7%D9%84%D8%8C%20%D9%86%D8%B3%D9%8A%D8%AA%20%D9%83%D9%84%D9%85%D8%A9%20%D8%A7%D9%84%D9%85%D8%B1%D9%88%D8%B1%20%D9%84%D8%AD%D8%B3%D8%A7%D8%A8%D9%8A%20%D9%88%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A7%D8%B3%D8%AA%D8%B9%D8%A7%D8%AF%D8%AA%D9%87%D8%A7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1.5"
                >
                  <span>أو تواصل مع الدعم الفني عبر واتساب فوراً</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#070B11]" />}>
      <LoginContent />
    </Suspense>
  );
}
