'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Calendar, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function NavbarClean() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-[#0D1117]/95 dark:bg-[#0D1117]/95 bg-white/95 backdrop-blur-md border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Clean Logo and Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <img 
            src={theme === 'dark' ? '/assets/logo-white.png' : '/assets/logo.png'}
            alt="شعار جلال أحمد" 
            className="h-10 sm:h-11 w-auto object-contain logo-clean"
          />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black text-slate-100 dark:text-slate-100 text-slate-900 tracking-normal">
              جـلال أحـمد
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 text-slate-500 font-semibold leading-none">
              استشارات وبناء الإنسان والأسرة
            </span>
          </div>
        </Link>

        {/* Minimal Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-300 dark:text-slate-300 text-slate-700">
          <a href="#services" className="hover:text-accent-500 transition">الاستشارات</a>
          <a href="#how-it-works" className="hover:text-accent-500 transition">كيف تسير الجلسة؟</a>
          <a href="#books" className="hover:text-accent-500 transition">المؤلفات والكتب</a>
          <a href="#about" className="hover:text-accent-500 transition">عن جلال أحمد</a>
        </nav>

        {/* Theme Toggle & CTA */}
        <div className="flex items-center gap-3">
          
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-full text-slate-300 dark:text-slate-300 text-slate-600 bg-slate-800/60 dark:bg-slate-800/60 bg-slate-100 hover:bg-slate-700/60 transition shadow-xs"
            title={theme === 'dark' ? 'التحويل إلى المظهر الفاتح' : 'التحويل إلى المظهر الهادئ'}
            aria-label="تبديل المظهر"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <a
            href="#booking"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold rounded-full transition shadow-md shadow-accent-500/20"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>احجز جلستك</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 dark:text-slate-300 text-slate-700 hover:bg-slate-800/50 dark:hover:bg-slate-800/50 hover:bg-slate-100 transition"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D1117] dark:bg-[#0D1117] bg-white border-b border-slate-800 dark:border-slate-800 border-slate-200 px-6 py-5 space-y-4 text-sm font-bold text-slate-200 dark:text-slate-200 text-slate-800 animate-fadeIn text-right">
          <a 
            href="#services" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-accent-500 border-b border-slate-800/60 dark:border-slate-800/60 border-slate-100"
          >
            الاستشارات والجلسات
          </a>
          <a 
            href="#how-it-works" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-accent-500 border-b border-slate-800/60 dark:border-slate-800/60 border-slate-100"
          >
            كيف تسير الجلسة؟
          </a>
          <a 
            href="#books" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-accent-500 border-b border-slate-800/60 dark:border-slate-800/60 border-slate-100"
          >
            المؤلفات والكتب
          </a>
          <a 
            href="#about" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-accent-500 border-b border-slate-800/60 dark:border-slate-800/60 border-slate-100"
          >
            عن جلال أحمد
          </a>
          <div className="pt-2">
            <a
              href="#booking"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-accent-500 text-white text-xs font-bold rounded-xl"
            >
              <Calendar className="w-4 h-4" />
              <span>احجز جلستك الآن</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
