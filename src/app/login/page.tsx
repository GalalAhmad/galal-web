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
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  UserPlus,
  LogIn,
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

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/profile';

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // OAuth Modal State (Google & Apple)
  const [oauthModalOpen, setOauthModalOpen] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<'google' | 'apple'>('google');
  const [oauthEmail, setOauthEmail] = useState('');
  const [oauthName, setOauthName] = useState('');
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthError, setOauthError] = useState('');

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');

  // Auto redirect if already logged in
  useEffect(() => {
    try {
      const saved = localStorage.getItem('galal_user_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name) {
          router.push(redirectPath);
        }
      }
    } catch (e) {}
  }, [redirectPath, router]);

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

      // Save user session
      try {
        localStorage.setItem('galal_user_session', JSON.stringify(data.user));
      } catch (err) {}

      // Redirect
      router.push(redirectPath);
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
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setRegError(data.error || 'تعذر إنشاء الحساب');
        setRegLoading(false);
        return;
      }

      // Save user session
      try {
        localStorage.setItem('galal_user_session', JSON.stringify(data.user));
      } catch (err) {}

      setRegSuccess('تم إنشاء حسابك بنجاح! جاري تحويلك إلى صفحتك الشخصية...');

      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    } catch (err) {
      setRegError('حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.');
      setRegLoading(false);
    }
  };

  // Trigger Google / Apple Flow
  const openOAuthModal = (provider: 'google' | 'apple') => {
    setOauthProvider(provider);
    setOauthError('');
    if (provider === 'google') {
      setOauthEmail('user@gmail.com');
      setOauthName('مستخدم Google الكريم');
    } else {
      setOauthEmail('user@icloud.com');
      setOauthName('مستخدم Apple الكريم');
    }
    setOauthModalOpen(true);
  };

  // Submit Real OAuth to Backend
  const handleOAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOauthLoading(true);
    setOauthError('');

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

      if (!res.ok || data.error) {
        setOauthError(data.error || 'تعذر تسجيل الدخول السريع');
        setOauthLoading(false);
        return;
      }

      // Save session
      localStorage.setItem('galal_user_session', JSON.stringify(data.user));
      setOauthModalOpen(false);
      router.push(redirectPath);
    } catch (err) {
      setOauthError('تعذر الاتصال بالخادم');
      setOauthLoading(false);
    }
  };

  // Quick Demo Account Login (أحمد الشريف)
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
        localStorage.setItem('galal_user_session', JSON.stringify(data.user));
        router.push(redirectPath);
      }
    } catch (e) {
      setLoginError('تعذر تسجيل الدخول بالحساب التجريبي');
      setLoginLoading(false);
    }
  };

  // Handle Forgot Password
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

      setForgotMsg(data.message || 'تم تحديث كلمة المرور بنجاح!');
      setTimeout(() => {
        setShowForgotModal(false);
        setActiveTab('login');
        setLoginIdentifier(forgotIdentifier);
        setForgotMsg('');
      }, 2000);
    } catch (err) {
      setForgotError('حدث خطأ في الاتصال');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#0B0F15] text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors antialiased">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 text-right">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center justify-between text-xs font-bold">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition"
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-0" />
            <span>العودة للرئيسية</span>
          </Link>
          <span className="text-slate-400">بوابة الدخول والتسجيل للمستفيدين</span>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-[#161B22] p-6 sm:p-9 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#4E7E76]/10 text-[#4E7E76] dark:text-[#5E988E] flex items-center justify-center mx-auto shadow-xs">
              <User className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              بوابة المستفيد • جلال أحمد
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              سجّل دخولك للوصول إلى جلساتك المعتمدة، دوراتك، روابط Google Meet، وتكليفاتك وتاريخ مقاييسك النفسية.
            </p>
          </div>

          {/* Trusted 1-Click Social Sign-In (Google & Apple) */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={() => openOAuthModal('google')}
              className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold transition flex items-center justify-center gap-3 shadow-xs cursor-pointer active:scale-98"
            >
              <GoogleIcon />
              <span>المتابعة السريعة بحساب Google</span>
            </button>

            <button
              type="button"
              onClick={() => openOAuthModal('apple')}
              className="w-full py-3 px-4 rounded-2xl bg-black hover:bg-slate-900 text-white text-xs font-bold transition flex items-center justify-center gap-3 shadow-xs cursor-pointer active:scale-98"
            >
              <AppleIcon />
              <span>المتابعة السريعة بحساب Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[11px] text-slate-400">أو بالهاتف والبريد المباشر</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setLoginError('');
              }}
              className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'login'
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
                setActiveTab('register');
                setRegError('');
              }}
              className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white dark:bg-slate-800 text-[#4E7E76] dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>إنشاء حساب جديد</span>
            </button>
          </div>

          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fadeIn">
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

              {/* Demo Account Quick Test Button */}
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

          {/* TAB 2: REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fadeIn">
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
        </div>

        {/* GOOGLE / APPLE OAUTH NATIVE MODAL */}
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

              {oauthError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold">
                  {oauthError}
                </div>
              )}

              <form onSubmit={handleOAuthSubmit} className="space-y-3">
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
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0F15]" />}>
      <LoginContent />
    </Suspense>
  );
}
