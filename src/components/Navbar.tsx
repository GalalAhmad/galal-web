'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Calendar, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/services', label: 'الجلسات والاستشارات' },
    { href: '/courses', label: 'مسارات بناء وتمكين' },
    { href: '/articles', label: 'المقالات والمحتوى' },
    { href: '/about', label: 'عن د. جلال' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* الشعار والهوية المعتمدة */}
        <Link href="/" className="flex items-center gap-3 group">
          <img 
            src={theme === 'dark' ? '/assets/logo-white.png' : '/assets/logo.png'}
            alt="شعار جلال أحمد" 
            className="h-10 sm:h-11 w-auto object-contain logo-clean"
          />
          <div className="flex flex-col text-right">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              جـلال أحـمد
            </span>
            <span className="text-[11px] text-[#4E7E76] dark:text-[#5E988E] font-bold leading-none mt-0.5">
              استشارات وبناء الإنسان والأسرة
            </span>
          </div>
        </Link>

        {/* روابط التنقل الخمسة الرئيسية على الحاسوب - ستايل عرب ثيرابي */}
        <nav className="hidden lg:flex items-center gap-7 text-[13px] font-bold text-slate-600 dark:text-slate-300">
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

          {/* زر احجز جلسة بلون عرب ثيرابي المرجاني الجذاب */}
          <Link
            href="/services#book"
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
          <div className="pt-2">
            <Link
              href="/services#book"
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
