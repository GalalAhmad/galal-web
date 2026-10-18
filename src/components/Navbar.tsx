'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Calendar, ArrowLeft } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Logo and Clear Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            {/* The modern geometric mark */}
            <img 
              src="/assets/logo.png" 
              alt="شعار جلال أحمد" 
              className="h-11 w-auto object-contain group-hover:scale-105 transition"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black text-brand-800 tracking-tight">
              د. جـلال أحـمد
            </span>
            <span className="text-[11px] text-slate-400 font-semibold leading-none">
              استشارات وبناء الإنسان والأسرة
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-600">
          <Link href="#tracks" className="hover:text-brand-800 transition">المسارات الاستشارية</Link>
          <Link href="#programs" className="hover:text-brand-800 transition">برامج رِفق ومِيثاق</Link>
          <Link href="#about" className="hover:text-brand-800 transition">عن د. جلال</Link>
          <Link href="#articles" className="hover:text-brand-800 transition">المكتبة المعرفية</Link>
          <Link href="#contact" className="hover:text-brand-800 transition">تواصل</Link>
        </nav>

        {/* CTA Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="#booking"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-brand-800 text-white text-xs font-bold rounded-full hover:bg-black transition shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>حجز موعد</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 px-6 py-6 space-y-4 text-sm font-bold text-slate-700 animate-fadeIn">
          <Link 
            href="#tracks" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-brand-800"
          >
            المسارات الاستشارية
          </Link>
          <Link 
            href="#programs" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-brand-800"
          >
            برامج رِفق ومِيثاق
          </Link>
          <Link 
            href="#about" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-brand-800"
          >
            عن د. جلال
          </Link>
          <Link 
            href="#articles" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-brand-800"
          >
            المكتبة المعرفية
          </Link>
          <Link 
            href="#contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-brand-800"
          >
            تواصل
          </Link>
          <div className="pt-2">
            <Link
              href="#booking"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-brand-800 text-white text-xs font-bold rounded-xl"
            >
              <Calendar className="w-4 h-4" />
              <span>حجز موعد استشاري</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
