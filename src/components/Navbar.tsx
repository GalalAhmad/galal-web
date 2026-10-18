'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Calendar, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-[#0D1117]/90 dark:bg-[#0D1117]/90 bg-white/90 backdrop-blur-md border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Logo and Clear Title */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative">
            {/* The modern geometric Kufic mark with subtle glow animation */}
            <img 
              src={theme === 'dark' ? '/assets/logo-white.png' : '/assets/logo.png'}
              alt="شعار جلال أحمد" 
              className="h-11 sm:h-12 w-auto object-contain logo-animated"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black text-slate-100 dark:text-slate-100 text-slate-900 tracking-tight transition-colors">
              جـلال أحـمد
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 text-slate-500 font-semibold leading-none">
              استشارات وبناء الإنسان والأسرة
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-bold text-slate-300 dark:text-slate-300 text-slate-600">
          <Link href="#tracks" className="hover:text-accent-500 transition">المسارات</Link>
          <Link href="#initiatives" className="hover:text-accent-500 transition">المشاريع والمبادرات</Link>
          <Link href="#programs" className="hover:text-accent-500 transition">البرامج والكورسات</Link>
          <Link href="#assessments" className="hover:text-accent-500 transition">مقاييس التبصر</Link>
          <Link href="#about" className="hover:text-accent-500 transition">عن جلال أحمد</Link>
          <Link href="#articles" className="hover:text-accent-500 transition">المكتبة المعرفية</Link>
          <Link href="#contact" className="hover:text-accent-500 transition">تواصل</Link>
        </nav>

        {/* CTA Button, Theme Toggle & Mobile Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-full text-slate-300 dark:text-slate-300 text-slate-600 bg-slate-800/60 dark:bg-slate-800/60 bg-slate-100 hover:bg-slate-700/60 transition shadow-xs"
            title={theme === 'dark' ? 'التحويل إلى المظهر الفاتح' : 'التحويل إلى المظهر الهادئ (الداكن)'}
            aria-label="تبديل المظهر"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Direct Booking CTA */}
          <a
            href="https://calendly.com/galal3hmad/insan"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold rounded-full transition shadow-md shadow-accent-500/20"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>حجز موعد استشاري</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-slate-300 dark:text-slate-300 text-slate-700 hover:bg-slate-800/50 dark:hover:bg-slate-800/50 hover:bg-slate-100 transition"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0D1117] dark:bg-[#0D1117] bg-white border-b border-slate-800 dark:border-slate-800 border-slate-200 px-6 py-6 space-y-4 text-sm font-bold text-slate-200 dark:text-slate-200 text-slate-700 animate-fadeIn">
          <Link 
            href="#tracks" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-accent-500"
          >
            المسارات الاستشارية
          </Link>
          <Link 
            href="#initiatives" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-accent-500"
          >
            المشاريع والمبادرات التأسيسية
          </Link>
          <Link 
            href="#programs" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-accent-500"
          >
            البرامج والكورسات التخصصية
          </Link>
          <Link 
            href="#assessments" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-accent-500"
          >
            مقاييس التبصر بالذات
          </Link>
          <Link 
            href="#about" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-accent-500"
          >
            عن جلال أحمد
          </Link>
          <Link 
            href="#articles" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-accent-500"
          >
            المكتبة المعرفية وأقومية القرآن
          </Link>
          <Link 
            href="#contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-accent-500"
          >
            تواصل وتنسيق
          </Link>
          <div className="pt-2">
            <a
              href="https://calendly.com/galal3hmad/insan"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-accent-500 text-white text-xs font-bold rounded-xl"
            >
              <Calendar className="w-4 h-4" />
              <span>حجز موعد عبر Google Calendar</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
