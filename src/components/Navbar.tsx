'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Calendar, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-[#0D1117]/95 dark:bg-[#0D1117]/95 bg-white/95 backdrop-blur-md border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Logo and Clear Title */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative">
            {/* The modern geometric Kufic mark completely clean without any bottom shadow */}
            <img 
              src={theme === 'dark' ? '/assets/logo-white.png' : '/assets/logo.png'}
              alt="شعار جلال أحمد" 
              className="h-11 sm:h-12 w-auto object-contain logo-clean"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black text-slate-100 dark:text-slate-100 text-slate-900 tracking-normal transition-colors">
              جـلال أحـمد
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 text-slate-500 font-semibold leading-none">
              استشارات وبناء الإنسان والأسرة
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-bold text-slate-300 dark:text-slate-300 text-slate-600">
          <Link href="/about" className="hover:text-accent-500 transition">عن جلال أحمد</Link>
          <Link href="/pricing" className="hover:text-accent-500 transition">مسارات الاستثمار والخدمات</Link>
          <Link href="/#services" className="hover:text-accent-500 transition">الخدمات</Link>
          <Link href="/#assessments" className="hover:text-accent-500 transition">المقاييس النفسية</Link>
          <Link href="/#books" className="hover:text-accent-500 transition">المؤلفات والكتب</Link>
          <Link href="/#videos" className="hover:text-accent-500 transition">المكتبة المرئية</Link>
          <Link href="/contact" className="hover:text-accent-500 transition">تواصل</Link>
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

          {/* Direct Booking Link on site */}
          <Link
            href="#booking"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold rounded-full transition shadow-md shadow-accent-500/20"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>حجز موعد استشاري</span>
          </Link>

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
            href="/about" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-accent-500"
          >
            عن جلال أحمد والمسيرة
          </Link>
          <Link 
            href="/pricing" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-accent-500"
          >
            مسارات الاستثمار والخدمات
          </Link>
          <Link 
            href="/#services" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-accent-500"
          >
            دليل الخدمات ونوع الدعم
          </Link>
          <Link 
            href="/#assessments" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-accent-500"
          >
            المقاييس النفسية الذاتية
          </Link>
          <Link 
            href="/#books" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-accent-500"
          >
            المؤلفات والكتب
          </Link>
          <Link 
            href="/#videos" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-accent-500"
          >
            المكتبة المرئية
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-accent-500"
          >
            تواصل وتنسيق المواعيد
          </Link>
          <div className="pt-2">
            <Link
              href="/#booking"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-accent-500 text-white text-xs font-bold rounded-xl"
            >
              <Calendar className="w-4 h-4" />
              <span>حجز موعد استشاري (أونلاين)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
