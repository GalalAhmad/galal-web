'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, Video, Shield, Clock, Linkedin } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { siteConfig } from '@/data/siteConfig';
import NewsletterWidget from '@/components/NewsletterWidget';

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="bg-slate-50 dark:bg-[#090D11] border-t border-slate-200/70 dark:border-slate-800 pt-16 pb-28 md:pb-16 px-4 sm:px-6 text-right transition-colors">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* النشرة البريدية والإرشادية */}
        <NewsletterWidget source="footer" />

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

          {/* روابط سريعة للمنصة */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              مسارات المنصة
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li><Link href="/services" className="hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition">دليل الاستشارات</Link></li>
              <li><Link href="/courses/family/mithaq" className="hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition">برنامج ميثاق للأسرة</Link></li>
              <li><Link href="/courses/family/premarital" className="hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition">تأهيل المقبلين على الزواج</Link></li>
              <li><Link href="/tests" className="hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition">الاختبارات والمقاييس النفسية</Link></li>
              <li><Link href="/aqwameyat-quran" className="hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition">مشروع أقومية القرآن</Link></li>
              <li><Link href="/articles" className="hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition">المنتدى الفكري والمقالات</Link></li>
              <li><Link href="/videos" className="hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition">مكتبة المرئيات واليوتيوب</Link></li>
            </ul>
          </div>

          {/* الجلسات والسرية */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              عن الاستشارات
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li><Link href="/booking" className="hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition font-bold text-[#CC4E46]">حجز موعد جلسة</Link></li>
              <li><Link href="/about" className="hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition">السيرة الذاتية والخبرات</Link></li>
              <li><Link href="/about#advice" className="hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition text-[#4E7E76] dark:text-[#5E988E] font-bold">صندوق النصيحة والملاحظات</Link></li>
              <li><Link href="/faq" className="hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition">الأسئلة الشائعة</Link></li>
              <li><Link href="/feedback" className="hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition">تقييمات وآراء المستفيدين</Link></li>
              <li><Link href="/policies" className="hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition">سياسة الخصوصية والسرية</Link></li>
              <li><Link href="/contact" className="hover:text-[#4E7E76] dark:hover:text-[#5E988E] transition">التواصل مع المكتب</Link></li>
            </ul>
          </div>

          {/* قنوات التواصل المباشر */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              التواصل والاستفسار
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#4E7E76] shrink-0" />
                <span dir="ltr" className="font-mono text-slate-700 dark:text-slate-300">+20 101 487 6666</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#4E7E76] shrink-0" />
                <span className="font-mono text-slate-700 dark:text-slate-300">info@galalahmad.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-3.5 h-3.5 text-[#4E7E76] shrink-0" />
                <span>جلسات أونلاين عبر Google Meet</span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Linkedin className="w-3.5 h-3.5 text-[#154F9C] shrink-0" />
                <a 
                  href="https://linkedin.com/in/galal3hmad/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline font-mono text-[11px]"
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
            <strong>تنويه مهني وأخلاقي:</strong> الجلسات والاستشارات المقدمة مخصصة للدعم النفسي، والإرشاد الأسري والتربوي، وتخضع لأعلى معايير السرية المهنية. هذه الخدمات ليست بديلاً عن التدخل الطبي الطارئ. في حالات الأزمات يرجى التوجه لأقرب طوارئ أو الاتصال بخطوط المساندة المجانية (مصر: <strong>16328</strong> • السعودية: <strong>920033360</strong> • الأردن: <strong>110</strong> • الإمارات: <strong>800-4673</strong>).
          </p>
        </div>

        {/* سطر الحقوق ورقم الإصدار */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>جميع الحقوق محفوظة © {new Date().getFullYear()} — د. جلال أحمد (galalahmad.com)</span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
              v1.2.0
            </span>
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
