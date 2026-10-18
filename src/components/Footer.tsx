'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Linkedin, Shield, Video, ExternalLink, Star } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();

  const googleBusinessUrl = 'https://share.google/mcjTrK9P6DPRb07Z0';

  return (
    <footer id="contact" className="bg-[#090D11] dark:bg-[#090D11] bg-slate-100 border-t border-slate-800/80 dark:border-slate-800/80 border-slate-200 py-16 px-4 sm:px-6 text-right transition-colors">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* الصف الأول: معلومات الموقع والتواصل */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={theme === 'dark' ? '/assets/logo-white.png' : '/assets/logo.png'} 
                alt="جلال أحمد" 
                className="h-10 w-auto object-contain logo-clean" 
              />
              <div>
                <span className="text-xl font-black text-slate-100 dark:text-slate-100 text-slate-900">جـلال أحـمد</span>
                <p className="text-xs text-slate-400 font-semibold">استشارات وبناء الإنسان والأسرة</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed max-w-sm">
              «ومَنْ يَصِفُ لَكَ الطَّرِيقَ.. لَنْ يَسْلُكَهُ نِيَابَةً عَنْكَ» — مساحة استشارية متخصصة تهدف إلى رفع الوعي النفسي والتربوي، ومساندة الأفراد والأزواج والمؤسسات للانتقال من ردود الفعل إلى الوعي والمسؤولية والاتزان.
            </p>

            {/* Google Business Profile Verified Badge */}
            <div className="pt-2">
              <a
                href={googleBusinessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 p-3 rounded-2xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 text-xs hover:border-accent-500 transition shadow-xs group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 font-bold text-slate-200 dark:text-slate-200 text-slate-800 group-hover:text-accent-500 transition-colors">
                    <span>الملف الرسمي على خرائط Google</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-0.5">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-slate-400 font-medium">نشاط معتمد على Google Business</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-accent-500 uppercase tracking-wider">
              أقسام الموقع
            </h4>
            <ul className="text-xs text-slate-400 dark:text-slate-400 text-slate-600 space-y-2 font-medium">
              <li><Link href="#services" className="hover:text-accent-500 transition">خدماتنا ونوع الدعم</Link></li>
              <li><Link href="#assessments" className="hover:text-accent-500 transition">المقاييس النفسية المصنفة</Link></li>
              <li><Link href="#books" className="hover:text-accent-500 transition">مؤلفات وكتب جلال أحمد</Link></li>
              <li><Link href="#videos" className="hover:text-accent-500 transition">المكتبة المرئية والمحاضرات</Link></li>
              <li><Link href="#testimonials" className="hover:text-accent-500 transition">تجارب وآراء المستفيدين</Link></li>
              <li><Link href="#about" className="hover:text-accent-500 transition">عن جلال أحمد والمسيرة</Link></li>
              <li><Link href="#booking" className="hover:text-accent-500 transition">جدول حجز المواعيد المباشر</Link></li>
            </ul>
          </div>

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

        {/* إخلاء المسؤولية المهنية وتوجيه الطوارئ */}
        <div className="p-4 rounded-2xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 text-[11px] text-slate-400 leading-relaxed flex items-start gap-3">
          <Shield className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p>
            <strong>تنويه مهني وأخلاقي:</strong> الاستشارات والجلسات والمقاييس المقدمة عبر هذا الموقع مخصصة للدعم النفسي، والإرشاد الأسري والزواجي، والتطوير التربوي، وتخضع لمعايير السرية المهنية وأخلاقيات المهنة. هذه الخدمات استشارية وتنموية وليست بديلاً عن التدخل الطبي النفسي الطارئ. في حالات الخطر المباشر يرجى التوجه فوراً لأقرب مشفى أو مركز طوارئ طبي معتمد في بلدك.
          </p>
        </div>

        {/* سطر الحقوق */}
        <div className="pt-6 border-t border-slate-800/80 dark:border-slate-800/80 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} — جـلال أحـمد (`galalahmad.com`)
          </div>
          <div className="flex gap-4 text-slate-400">
            <Link href="#contact" className="hover:underline">الخصوصية والأمان</Link>
            <span>•</span>
            <Link href="#contact" className="hover:underline">ميثاق الجلسات</Link>
            <span>•</span>
            <Link href="/admin" className="hover:underline text-slate-500">بوابة الإدارة</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
