'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, Video, Linkedin, Shield, Clock } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="bg-slate-50 dark:bg-[#090D11] border-t border-slate-200/70 dark:border-slate-800 py-16 px-4 sm:px-6 text-right transition-colors">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* صف المحتوى الرئيسي */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* الهوية والمقولة التأسيسية */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={theme === 'dark' ? '/assets/logo-white.png' : '/assets/logo.png'} 
                alt="جلال أحمد" 
                className="h-9 w-auto object-contain logo-clean" 
              />
              <div>
                <span className="text-xl font-black text-slate-900 dark:text-slate-100">جـلال أحـمد</span>
                <p className="text-xs text-[#4E7E76] dark:text-[#5E988E] font-bold">استشارات وبناء الإنسان والأسرة</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              «ومَنْ يَصِفُ لَكَ الطَّرِيقَ.. لَنْ يَسْلُكَهُ نِيَابَةً عَنْكَ» — مساحة استشارية وتربوية متخصصة تجمع بين عمق التأصيل النفسي والخبرة الميدانية، لمساعدتك على استعادة الاتزان وبناء علاقات سوية ومستقرة.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-[#4E7E76] dark:text-[#5E988E] font-semibold">
              <Clock className="w-4 h-4 shrink-0 text-[#CC4E46]" />
              <span>مرونة المواعيد: إعادة الجدولة والإلغاء متاح مجاناً حتى 48 ساعة قبل الموعد.</span>
            </div>
          </div>

          {/* روابط أقسام الموقع الخمسة */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black text-[#4E7E76] dark:text-[#5E988E] uppercase tracking-wider">
              أقسام الموقع
            </h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2.5 font-semibold">
              <li><Link href="/" className="hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition">الرئيسية</Link></li>
              <li><Link href="/services" className="hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition">الجلسات والاستشارات</Link></li>
              <li><Link href="/courses" className="hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition">الكورسات والبرامج</Link></li>
              <li><Link href="/articles" className="hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition">المقالات والمحتوى</Link></li>
              <li><Link href="/about" className="hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition">عن د. جلال أحمد</Link></li>
            </ul>
          </div>

          {/* التواصل والتنسيق الرسمي */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-black text-[#4E7E76] dark:text-[#5E988E] uppercase tracking-wider">
              التواصل والتنسيق المباشر
            </h4>
            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#4E7E76] shrink-0" />
                <a href="mailto:info@galalahmad.com" className="hover:underline font-mono text-slate-700 dark:text-slate-300">
                  info@galalahmad.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#4E7E76] shrink-0" />
                <a href="https://wa.me/201014876666" target="_blank" rel="noopener noreferrer" className="hover:underline font-mono text-slate-700 dark:text-slate-300" dir="ltr">
                  +20 101 487 6666
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#4E7E76] shrink-0" />
                <span>جلسات أونلاين خاصة عبر Google Meet في جميع الدول</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Linkedin className="w-4 h-4 text-[#154F9C] shrink-0" />
                <a 
                  href="https://linkedin.com/in/galal3hmad/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline text-[11px] text-slate-500"
                >
                  linkedin.com/in/galal3hmad
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* إخلاء المسؤولية المهنية وتوجيه الطوارئ */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12171E] border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 leading-relaxed flex items-start gap-3 shadow-xs">
          <Shield className="w-4 h-4 text-[#4E7E76] shrink-0 mt-0.5" />
          <p>
            <strong>تنويه مهني وأخلاقي:</strong> الجلسات والاستشارات المقدمة عبر هذا الموقع مخصصة للدعم النفسي، والإرشاد الأسري والتربوي، وتخضع لأعلى معايير السرية المهنية. هذه الخدمات ليست بديلاً عن التدخل الطبي النفسي الطارئ. في حالات الخطر المباشر يرجى التوجه فوراً لأقرب مشفى أو مركز طوارئ طبي معتمد في بلدك.
          </p>
        </div>

        {/* سطر الحقوق */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} — جـلال أحـمد (`galalahmad.com`)
          </div>
          <div className="flex gap-4 text-slate-500 font-semibold">
            <Link href="/policies" className="hover:underline">السياسات والخصوصية</Link>
            <span>•</span>
            <Link href="/admin" className="hover:underline text-slate-400">لوحة الإدارة</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
