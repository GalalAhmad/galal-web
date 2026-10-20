'use client';

import React from 'react';
import Link from 'next/link';
import NavbarClean from '@/components/NavbarClean';
import FooterClean from '@/components/FooterClean';
import { 
  ShieldCheck, 
  FileText, 
  CalendarX, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Sparkles,
  Lock,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function PoliciesPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0D1117] dark:bg-[#0D1117] bg-[#F8FAFC] text-slate-100 dark:text-slate-100 text-slate-900 transition-colors">
      <NavbarClean />

      {/* Header */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 text-right">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[280px] bg-accent-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/60 dark:bg-slate-800/60 bg-slate-100 border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs font-bold text-accent-500">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>السياسات والشفافية المهنية</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-100 dark:text-slate-100 text-slate-900 leading-[1.7]">
            سياسة الخصوصية، شروط الاستخدام، والإلغاء
          </h1>

          <p className="text-sm sm:text-base text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal">
            نضع بين يديك ميثاق العمل، وسياسات الحجز والإلغاء، وحماية البيانات، لضمان تجربة استشارية قائمة على الوضوح والمسؤولية المشتركة.
          </p>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#11161D] dark:bg-[#11161D] bg-slate-50 border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200">
        <div className="max-w-4xl mx-auto space-y-12 text-right">
          
          {/* 1. تنبيه الأمان وحالات الطوارئ (Emergency Disclaimer) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>تنبيه مهني هام: الموقع والخدمات ليست لخدمات الطوارئ</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed font-normal">
              الموقع، ونماذج الحجز، والمساعد السريع، والاستشارات المقدمة مخصصة للدعم النفسي والتربوي والأسري، وليست خدمة طوارئ ولا تراقب الحالات الحرجة على مدار الساعة. في حال وجود خطر مباشر على حياتك أو سلامة من حولك، أو في حالات الأزمات الحادة، يرجى التوجه فوراً لأقرب مشفى أو مركز طوارئ طبي معتمد في مدينتك، أو الاتصال بأرقام الطوارئ الوطنية الرسمية في بلدك.
            </p>
          </div>

          {/* 2. سياسة الخصوصية وحماية البيانات */}
          <div className="p-8 rounded-3xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent-500/10 text-accent-500 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                1. سياسة الخصوصية وحماية البيانات
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal">
              <p>
                <strong>الحد الأدنى من البيانات:</strong> نلتزم بجمع أقل قدر ممكن من البيانات اللازمة لتنسيق الموعد وتأكيده (الاسم المفضل، وسيلة اتصال واحدة كالبريد أو الواتساب). لا نسأل في نماذج الموقع العامة عن أرقام هوية، ولا عن أسرار حميمة، ولا عن روايات النزاع التفصيلية.
              </p>
              <p>
                <strong>الغرض من الجمع:</strong> تُستخدم بيانات الاتصال فقط لأغراض التنسيق وتأكيد الجلسة الاستشارية وإرسال رابط اللقاء الافتراضي (Google Meet).
              </p>
              <p>
                <strong>فصل التسويق عن الحجز:</strong> الموافقة على جمع بيانات الحجز منفصلة تماماً عن أي اشتراك تسويقي، ولا يُشترط الاشتراك في أي رسائل ترويجية لإتمام الحجز.
              </p>
              <p>
                <strong>عدم التتبع الحساس:</strong> إجابات الاستبيان التمهيدي لا تُخزن في أدوات التحليلات أو منصات الإعلانات، ولا يتم تسجيل الجلسات المرئية حفاظاً على أمانك التام.
              </p>
            </div>
          </div>

          {/* 3. شروط الاستخدام وحدود الخدمة */}
          <div className="p-8 rounded-3xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                2. شروط الاستخدام وحدود الخدمة
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal">
              <p>
                <strong>طبيعة الخدمة:</strong> جميع الاستشارات المقدمة عبر الموقع استشارية وتربوية ونفسية تهدف إلى رفع الوعي والاتزان ومساندة متخذ القرار. هذه الخدمات ليست بديلاً عن التدخل الطبي السريري عند الحاجة إليه.
              </p>
              <p>
                <strong>موافقة الطرف الآخر في الجلسات الزوجية:</strong> في حال الرغبة في حضور الشريك، فإن مشاركته تتطلب موافقته الصريحة واختياره الحر. يتيح الموقع دائماً خيار الحضور الفردي لأي طرف بكل استقلالية.
              </p>
              <p>
                <strong>عدم ادعاء نتائج قطعية:</strong> العلاج والإرشاد النفسي والتربوي قائم على التعاون وبذل الجهد والتطبيق الواعي، ولا يمكن لأي جهة مهنية ادعاء ضمانات قطعية لنتائج العلاقات أو تصرفات الآخرين.
              </p>
            </div>
          </div>

          {/* 4. سياسة الإلغاء وإعادة الجدولة */}
          <div className="p-8 rounded-3xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <CalendarX className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                3. سياسة الإلغاء وإعادة الجدولة
              </h2>
            </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal">
              <p>
                <strong>إعادة الجدولة والإلغاء المجاني (مهلة 48 ساعة):</strong> يمكن للمستفيد طلب تعديل الموعد أو إلغائه مجاناً بالكامل بالتواصل المسبق قبل موعد الجلسة بـ <strong>48 ساعة على الأقل</strong>، تقديراً لأوقات الانتظار ولتنظيم المواعيد الاستشارية.
              </p>
              <p>
                <strong>الحجز الاستثنائي / الطارئ (خلال 24 ساعة):</strong> مخصص للحالات الحرجة التي تتطلب تدخلاً سريعاً وموعداً استثنائياً خارج الجدول المعتاد، ويخضع لتسعير خاص ومستقل يتناسب مع سرعة الاستجابة.
              </p>
              <p>
                <strong>التأخر عن الموعد:</strong> يُرجى الحضور في الموعد المحدد برابط Google Meet لضمان الاستفادة من الوقت المخصص كاملاً؛ حيث يُحسب وقت الجلسة من بداية الموعد المحجوز.
              </p>
            </div>
          </div>

          {/* 5. قنوات التواصل المعتمدة */}
          <div className="p-8 rounded-3xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 shadow-sm space-y-5">
            <h2 className="text-xl font-bold text-slate-100 dark:text-slate-100 text-slate-900">
              4. قنوات التواصل والتنسيق الرسمي
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 bg-slate-50 border border-slate-800 dark:border-slate-800 border-slate-200 space-y-1">
                <div className="font-bold text-slate-100 dark:text-slate-100 text-slate-900">الواتساب المعتمد للتنسيق:</div>
                <div className="font-mono text-emerald-400 font-semibold" dir="ltr">+20 101 487 6666</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 bg-slate-50 border border-slate-800 dark:border-slate-800 border-slate-200 space-y-1">
                <div className="font-bold text-slate-100 dark:text-slate-100 text-slate-900">البريد الإلكتروني الرسمي:</div>
                <div className="font-mono text-accent-500 font-semibold">info@galalahmad.com</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <FooterClean />
    </main>
  );
}
