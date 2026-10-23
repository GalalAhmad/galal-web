'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Calendar, Sun, Moon, User, ChevronLeft } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [userSession, setUserSession] = useState<{ name: string } | null>(null);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  // Check user session
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('galal_user_session');
      if (saved) {
        setUserSession(JSON.parse(saved));
      } else {
        setUserSession(null);
      }
    } catch (e) {}
  }, [pathname]);

  // Smart Mobile Header: Sticks & slides into view when scrolling UP
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 60) {
        setShowHeader(true);
      } else if (currentScrollY < lastScrollY - 4) {
        // Scrolling UP -> show header immediately!
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY + 10 && currentScrollY > 100) {
        // Scrolling DOWN -> hide header on mobile to maximize content area
        if (!mobileMenuOpen) {
          setShowHeader(false);
        }
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

  const navLinks = [
    { href: '/', label: 'رئيسية' },
    { href: '/services', label: 'استشارات' },
    { href: '/courses', label: 'بناء وتمكين' },
    { href: '/aqwameyat-quran', label: 'أقومية القرآن' },
    { href: '/tests', label: 'اختبارات ومقاييس' },
    { href: '/articles', label: 'مقالات' },
    { href: '/videos', label: 'مرئيات' },
    { href: '/about', label: 'من أنا' },
  ];

  return (
    <header className={`sticky top-0 z-40 bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-all duration-300 shadow-xs ${
      showHeader ? 'translate-y-0' : '-translate-y-full md:translate-y-0'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        
        {/* الشعار المعتمد بدون نص لتوسيع مساحة الهيدر */}
        <Link href="/" className="flex items-center group shrink-0" title="جلال أحمد - الصفحة الرئيسية">
          <img 
            src={theme === 'dark' ? '/assets/logo-white.png' : '/assets/logo.png'}
            alt="شعار جلال أحمد" 
            className="h-11 sm:h-12 w-auto object-contain logo-clean transition-transform group-hover:scale-105"
          />
        </Link>

        {/* روابط التنقل الرئيسية - بدون ال التعريف لتصميم عصري متزن */}
        <nav className="hidden lg:flex items-center gap-6 sm:gap-7 text-[13px] font-bold text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-all py-1 relative ${
                  isActive
                    ? 'text-[#4E7E76] dark:text-[#5E988E] font-black'
                    : 'hover:text-[#4E7E76] dark:hover:text-[#5E988E]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4E7E76] dark:bg-[#5E988E] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* أدوات التحكم وزر الحجز البارز */}
        <div className="flex items-center gap-3">
          
          {/* تبديل المظهر */}
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-full text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title={theme === 'dark' ? 'التحويل إلى المظهر الفاتح المريح' : 'التحويل إلى المظهر الليلي'}
            aria-label="تبديل المظهر"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* User Account / Login Button */}
          <Link
            href={userSession?.name ? '/profile' : '/login'}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title={userSession?.name ? 'الملف الشخصي والمتابعة' : 'تسجيل الدخول / إنشاء حساب'}
          >
            <User className="w-3.5 h-3.5 text-[#4E7E76] dark:text-[#5E988E]" />
            <span>{userSession?.name ? userSession.name.split(' ')[0] : 'دخول / حسابي'}</span>
          </Link>

          {/* زر احجز جلسة بلون عرب ثيرابي المرجاني الجذاب */}
          <Link
            href="/booking"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[#CC4E46] hover:bg-[#B33D35] text-white text-xs font-bold rounded-full transition shadow-sm hover:shadow"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>احجز جلستك الآن</span>
          </Link>

          {/* زر قائمة الجوال */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* قائمة الجوال المنسدلة */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0D1117] border-b border-slate-100 dark:border-slate-800 px-6 py-5 space-y-3 text-sm font-bold text-slate-800 dark:text-slate-200 animate-fadeIn text-right shadow-lg">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 border-b border-slate-50 dark:border-slate-800/60 hover:text-[#4E7E76] dark:hover:text-[#5E988E]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 space-y-2">
            <Link
              href={userSession?.name ? '/profile' : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs font-extrabold text-slate-800 dark:text-slate-100"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#4E7E76] dark:text-[#5E988E]" />
                <span>{userSession?.name ? `حسابي (${userSession.name})` : 'بوابة المستفيد (تسجيل الدخول / إنشاء حساب)'}</span>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400 rtl:rotate-0" />
            </Link>

            <Link
              href="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#CC4E46] text-white text-xs font-bold rounded-full shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>احجز جلستك الآن</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
