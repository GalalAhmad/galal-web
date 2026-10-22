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
  FileText
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

  // Quick Login form inputs
  const [inputName, setInputName] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputEmail, setInputEmail] = useState('');

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

  // Social Login Handlers
  const handleSocialSignIn = async (provider: 'google' | 'apple' | 'facebook') => {
    const providerTitles: Record<string, string> = {
      google: 'Google',
      apple: 'Apple ID',
      facebook: 'Facebook'
    };
    const enteredName = prompt(`يرجى كتابة اسمك الكريم لتسجيل الدخول بحساب ${providerTitles[provider]}:`);
    if (!enteredName || !enteredName.trim()) return;

    const enteredPhone = prompt('رقم هاتفك أو الواتساب لربط حجزك ومقاييسك تلقائياً (موصى به):') || '';

    const selectedUser = {
      name: enteredName.trim(),
      email: enteredName.includes('@') ? enteredName.trim() : `${enteredName.trim()}@${provider}.user`,
      phone: enteredPhone.trim(),
      provider,
    };

    setUserSession(selectedUser);
    localStorage.setItem('galal_user_session', JSON.stringify(selectedUser));

    // Save profile to server
    await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedUser),
    });

    fetchClientData(selectedUser);
  };

  // Quick Guest Sign-in Handler
  const handleQuickSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim() || (!inputPhone.trim() && !inputEmail.trim())) {
      alert('يرجى كتابة الاسم ورقم الهاتف أو البريد الإلكتروني للمتابعة');
      return;
    }

    const userData = {
      name: inputName.trim(),
      phone: inputPhone.trim(),
      email: inputEmail.trim(),
      provider: 'phone_quick',
    };

    setUserSession(userData);
    localStorage.setItem('galal_user_session', JSON.stringify(userData));

    // Save profile to server
    await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    fetchClientData(userData);
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

        {/* 1. NOT LOGGED IN VIEW: 4 Easy Login Channels */}
        {!userSession ? (
          <div className="max-w-md mx-auto bg-white dark:bg-[#161B22] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-[#4E7E76]/10 text-[#4E7E76] dark:text-[#5E988E] flex items-center justify-center mx-auto">
              <User className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                بوابة المستفيد وسجل المتابعة
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                سجّل دخولك بضغطة زر واحدة للوصول إلى مواعيد جلساتك، رابط Google Meet، التكليفات القرائية، وتاريخ مقاييسك النفسية.
              </p>
            </div>

            {/* Social Logins */}
            <div className="space-y-2.5 pt-2">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialSignIn('google')}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-3 shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>المتابعة باستخدام حساب Google</span>
              </button>

              {/* Apple */}
              <button
                type="button"
                onClick={() => handleSocialSignIn('apple')}
                className="w-full py-3 px-4 rounded-2xl bg-black hover:bg-slate-900 text-white text-xs font-bold transition flex items-center justify-center gap-3 shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12.01-14.42-5.74-8.8-10.24-18.73-13.51-29.77-3.27-11.04-4.91-21.84-4.91-32.4 0-14.28 3.59-26.24 10.77-35.88 7.18-9.64 16.27-14.59 27.27-14.85 4.69 0 10.15 1.34 16.39 4.02 6.23 2.68 10.18 4.07 11.84 4.17 1.89 0 6.04-1.51 12.44-4.53 6.4-3.02 12.03-4.32 16.9-3.9 12.44.88 22.38 5.67 29.83 14.37-10.88 6.64-16.21 15.72-15.99 27.23.23 9.06 3.65 16.82 10.27 23.28 6.62 6.46 14.62 10.11 24.01 10.96-2.01 6.18-4.43 12.28-7.27 18.28zM119.22 33.15c0-7.25 2.66-14.16 7.99-20.72 5.33-6.57 11.88-10.78 19.66-12.63.12 1 .18 1.95.18 2.87 0 7.14-2.82 14.15-8.46 21.03-5.64 6.88-12.23 10.9-19.78 12.07-.12-.87-.19-1.74-.19-2.62z"/>
                </svg>
                <span>المتابعة باستخدام Apple</span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={() => handleSocialSignIn('facebook')}
                className="w-full py-3 px-4 rounded-2xl bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold transition flex items-center justify-center gap-3 shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>المتابعة باستخدام Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-400">أو الدخول المباشر بالهاتف</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            {/* Quick Phone Sign-in */}
            <form onSubmit={handleQuickSignIn} className="space-y-3 text-right">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الاسم الكريم *
                </label>
                <input
                  type="text"
                  required
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="مثال: أحمد عبد الله"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رقم الهاتف / الواتساب *
                </label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={inputPhone}
                  onChange={(e) => setInputPhone(e.target.value)}
                  placeholder="+966 50 000 0000 أو +20 100 000 0000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white text-left focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#4E7E76] hover:bg-[#3D645E] text-white font-extrabold text-xs transition shadow-md cursor-pointer"
              >
                الدخول وعرض ملفي
              </button>
            </form>
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
