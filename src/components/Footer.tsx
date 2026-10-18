import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Linkedin, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-white border-t border-slate-200/80 py-16 px-4 sm:px-6 text-right">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* الصف الأول: معلومات الموقع والتواصل */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img src="/assets/logo.png" alt="جلال" className="h-10 w-auto" />
              <div>
                <span className="text-xl font-black text-brand-800">د. جـلال أحـمد</span>
                <p className="text-xs text-slate-400 font-semibold">استشارات وبناء الإنسان والأسرة</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              مساحة استشارية متخصصة تهدف إلى رفع الوعي النفسي والتربوي، ومساندة الأفراد والأزواج والمؤسسات التعليمية للانتقال من ردود الفعل إلى الوعي والمسؤولية والاتزان.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-brand-800 uppercase tracking-wider">
              روابط سريعة
            </h4>
            <ul className="text-xs text-slate-600 space-y-2 font-medium">
              <li><Link href="#tracks" className="hover:text-brand-800 transition">المسارات الاستشارية</Link></li>
              <li><Link href="#programs" className="hover:text-brand-800 transition">برنامج رحلة رِفق للمقبلين</Link></li>
              <li><Link href="#programs" className="hover:text-brand-800 transition">برنامج مِيثاق للمتزوجين</Link></li>
              <li><Link href="#about" className="hover:text-brand-800 transition">المسيرة والمؤهلات الموثقة</Link></li>
              <li><Link href="#articles" className="hover:text-brand-800 transition">المكتبة المعرفية وأقومية القرآن</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-brand-800 uppercase tracking-wider">
              التواصل والتنسيق
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-800 shrink-0" />
                <a href="mailto:info@galalahmad.com" className="hover:underline font-mono">
                  info@galalahmad.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-800 shrink-0" />
                <a href="https://wa.me/201014876666" target="_blank" rel="noopener noreferrer" className="hover:underline font-mono" dir="ltr">
                  +20 101 487 6666
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-800 shrink-0" />
                <span>القاهرة، جمهورية مصر العربية</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Linkedin className="w-4 h-4 text-brand-800 shrink-0" />
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
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed flex items-start gap-3">
          <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            <strong>تنويه مهني وأخلاقي:</strong> الاستشارات والجلسات المقدمة عبر هذا الموقع مخصصة للدعم النفسي، والإرشاد الأسري، والتطوير التربوي، وتخضع لمعايير السرية المهنية. هذه الخدمات ليست بديلاً عن التدخل الطبي العاجل أو الحالات الطارئة. في حالات الخطر المباشر يرجى التوجه فوراً لأقرب مشفى أو مركز طوارئ طبي معتمد.
          </p>
        </div>

        {/* سطر الحقوق */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} — د. جلال أحمد (`galalahmad.com`)
          </div>
          <div className="flex gap-4 text-slate-500">
            <Link href="#contact" className="hover:underline">سياسة الخصوصية</Link>
            <span>•</span>
            <Link href="#contact" className="hover:underline">شروط الخدمة</Link>
            <span>•</span>
            <Link href="/admin" className="hover:underline text-slate-400">بوابة الإدارة</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
