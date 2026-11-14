'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, Video, Linkedin, Shield, Clock } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import EmergencyHotlines from '@/components/EmergencyHotlines';

export default function FooterClean() {
  const { theme } = useTheme();

  return (
    <footer className="bg-[#090D11] dark:bg-[#090D11] bg-slate-100 border-t border-slate-800/80 dark:border-slate-800/80 border-slate-200 py-16 px-4 sm:px-6 text-right transition-colors">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Identity & Mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={theme === 'dark' ? '/assets/logo-white.png' : '/assets/logo.png'} 
                alt="جلال أحمد" 
                className="h-9 w-auto object-contain logo-clean" 
              />
              <div>
                <span className="text-xl font-black text-slate-100 dark:text-slate-100 text-slate-900">جـلال أحـمد</span>
                <p className="text-xs text-slate-400 font-semibold">استشارات وبناء الإنسان والأسرة</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed max-w-sm">
              «ومَنْ يَصِفُ لَكَ الطَّرِيقَ.. لَنْ يَسْلُكَهُ نِيَابَةً عَنْكَ» — مساحة استشارية متخصصة قائمة على الوعي والمسؤولية والاتزان، ومساندة الأفراد والأزواج والآباء للانتقال من ردود الفعل إلى الاختيار الواعي.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-accent-500 shrink-0" />
              <span>إعادة الجدولة والإلغاء متاح مجاناً حتى 48 ساعة قبل الموعد.</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-accent-500 uppercase tracking-wider">
              أقسام الموقع
            </h4>
            <ul className="text-xs text-slate-400 dark:text-slate-400 text-slate-600 space-y-2.5 font-medium">
              <li><Link href="/services" className="hover:text-accent-500 transition">مسارات الاستشارات</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-accent-500 transition">كيف تسير الجلسة؟</Link></li>
              <li><Link href="/#books" className="hover:text-accent-500 transition">المؤلفات والكتب</Link></li>
              <li><Link href="/about" className="hover:text-accent-500 transition">عن جلال أحمد</Link></li>
              <li><Link href="/booking" className="hover:text-accent-500 transition">حجز موعد أونلاين</Link></li>
            </ul>
          </div>

          {/* Direct Contacts */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-accent-500 uppercase tracking-wider">
              التواصل والتنسيق
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300 dark:text-slate-300 text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent-500 shrink-0" />
                <a href="mailto:info@galalahmad.com" className="hover:underline font-mono text-slate-300 dark:text-slate-300 text-slate-700">
                  info@galalahmad.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent-500 shrink-0" />
                <a href="https://wa.me/201014876666" target="_blank" rel="noopener noreferrer" className="hover:underline font-mono text-slate-300 dark:text-slate-300 text-slate-700" dir="ltr">
                  +20 101 487 6666
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>جلسات أونلاين عبر Google Meet في جميع الدول</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Linkedin className="w-4 h-4 text-accent-500 shrink-0" />
                <a 
                  href="https://linkedin.com/in/galal3hmad/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline text-[11px] text-slate-400"
                >
                  linkedin.com/in/galal3hmad
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Unified Ethical Disclaimer & Emergency Hotlines */}
        <EmergencyHotlines variant="footer" />

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-800/80 dark:border-slate-800/80 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} — جـلال أحـمد (`galalahmad.com`)
          </div>
          <div className="flex gap-4 text-slate-400">
            <Link href="/policies" className="hover:underline">الخصوصية والسياسات</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
