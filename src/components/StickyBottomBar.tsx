'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Calendar, 
  Brain, 
  User, 
  MessageCircle, 
  Sparkles,
  ArrowUp,
  Compass
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function StickyBottomBar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [userSession, setUserSession] = useState<{ name: string } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('galal_user_session');
      if (saved) {
        setUserSession(JSON.parse(saved));
      }
    } catch (e) {}

    const handleScroll = () => {
      // Show sticky bar on desktop once scrolled 120px down
      if (window.scrollY > 120) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Don't render inside admin dashboard to prevent overlay on admin controls
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <aside
      aria-label="شريط التنقل والتطبيق"
      className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 transform ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'max-md:translate-y-0 max-md:opacity-100 max-md:pointer-events-auto translate-y-full opacity-0 pointer-events-none md:pointer-events-none'
      }`}
    >
      {/* MOBILE NATIVE APP TAB BAR (Always Visible on Mobile md:hidden) */}
      <div className="md:hidden bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <div className="px-3 py-1.5 flex items-center justify-around text-center">
          {/* Tab 1: Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
              pathname === '/'
                ? 'text-[#4E7E76] dark:text-[#5E988E] font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold">الرئيسية</span>
          </Link>

          {/* Tab 2: Consultations */}
          <Link
            href="/services"
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
              pathname === '/services'
                ? 'text-[#4E7E76] dark:text-[#5E988E] font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold">استشارات</span>
          </Link>

          {/* Center Floating Action Tab: Book Now */}
          <Link
            href="/booking"
            className="flex flex-col items-center -mt-6 group"
            title="حجز موعد استشارة"
          >
            <div className="w-12 h-12 rounded-full bg-[#CC4E46] text-white flex items-center justify-center shadow-lg shadow-[#CC4E46]/30 ring-4 ring-white dark:ring-[#0D1117] transform transition group-hover:scale-105 active:scale-95">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-[#CC4E46] mt-0.5">احجز الآن</span>
          </Link>

          {/* Tab 3: Tests & Assessments */}
          <Link
            href="/tests"
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
              pathname.startsWith('/tests')
                ? 'text-[#4E7E76] dark:text-[#5E988E] font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Brain className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold">المقاييس</span>
          </Link>

          {/* Tab 4: Client Profile / Account */}
          <Link
            href="/profile"
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
              pathname === '/profile'
                ? 'text-[#4E7E76] dark:text-[#5E988E] font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold">{userSession?.name ? 'حسابي' : 'دخول'}</span>
          </Link>
        </div>
      </div>

      {/* DESKTOP STICKY SCROLL BAR (Hidden on Mobile, Appears on Scroll md:block) */}
      <div className="hidden md:block bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Right side: Quick Brand & Essential Nav Links */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 group py-1"
              title="جلال أحمد - الرئيسية"
            >
              <img
                src={theme === 'dark' ? '/assets/logo-white.png' : '/assets/logo.png'}
                alt="جلال أحمد"
                className="h-7 w-auto object-contain"
              />
              <span className="font-black text-xs text-slate-800 dark:text-slate-100">
                جلال أحمد
              </span>
            </Link>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

            <nav className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
              <Link
                href="/services"
                className={`px-3 py-1.5 rounded-xl transition ${
                  pathname === '/services'
                    ? 'text-[#4E7E76] dark:text-[#5E988E] bg-[#4E7E76]/10 font-black'
                    : 'hover:text-[#4E7E76] dark:hover:text-[#5E988E]'
                }`}
              >
                استشارات
              </Link>
              <Link
                href="/tests"
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                  pathname.startsWith('/tests')
                    ? 'text-[#4E7E76] dark:text-[#5E988E] bg-[#4E7E76]/10 font-black'
                    : 'hover:text-[#4E7E76] dark:hover:text-[#5E988E]'
                }`}
              >
                <Brain className="w-3.5 h-3.5 text-[#4E7E76]" />
                <span>اختبارات ومقاييس</span>
              </Link>
              <Link
                href="/profile"
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                  pathname === '/profile'
                    ? 'text-[#4E7E76] dark:text-[#5E988E] bg-[#4E7E76]/10 font-black'
                    : 'hover:text-[#4E7E76] dark:hover:text-[#5E988E]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{userSession?.name ? 'ملفي' : 'دخول'}</span>
              </Link>
            </nav>
          </div>

          {/* Left side: Prominent Booking CTA + Scroll to Top */}
          <div className="flex items-center gap-2">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#CC4E46] hover:bg-[#B33D35] text-white text-xs font-extrabold shadow-sm hover:shadow transition transform hover:scale-[1.02]"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>احجز جلستك الآن</span>
            </Link>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition inline-flex"
              title="العودة لأعلى الصفحة"
              aria-label="العودة لأعلى"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </aside>
  );
}
