'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Building2, 
  Sparkles, 
  Send, 
  ChevronRight, 
  GraduationCap, 
  Users2, 
  BookMarked, 
  Clock, 
  ArrowLeft,
  CheckCircle2,
  FileCheck2,
  PhoneCall
} from 'lucide-react';

export default function InstitutionsTrackPage() {
  const [instName, setInstName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [instType, setInstType] = useState('مدرسة / مجمع تعليمي');
  const [inquiry, setInquiry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instName,
          contactPerson,
          phone,
          instType,
          inquiry
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء الإرسال');
      }

      setSubmitted(true);
      setInstName('');
      setContactPerson('');
      setPhone('');
      setInquiry('');
    } catch (err: any) {
      setErrorMessage(err.message || 'تعذر إرسال الطلب حالياً، يرجى المحاولة لاحقاً');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFCFB] dark:bg-[#0C111C] text-slate-800 dark:text-slate-100 flex flex-col antialiased selection:bg-[#154F9C]/10 selection:text-[#154F9C]">
      <Navbar />

      {/* Breadcrumb Bar */}
      <section className="border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#0E1524]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-[#154F9C] transition">الرئيسية</Link>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 text-slate-300" />
            <Link href="/courses" className="hover:text-[#154F9C] transition">مسارات بناء وتمكين</Link>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 text-slate-300" />
            <span className="text-slate-800 dark:text-slate-200 font-medium">مسار المؤسسات التعليمية والتربوية</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-b from-[#EDF5FD]/60 via-[#FDFCFB] to-transparent dark:from-[#122238]/20 dark:via-[#0C111C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#154F9C]/10 border border-[#154F9C]/20 text-[#154F9C] text-xs font-semibold mb-6">
            <Building2 className="w-3.5 h-3.5" />
            <span>مسارات بناء وتمكين • المسار المؤسسي الثاني</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-5">
            مسار المؤسسات التعليمية والتربوية
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
            برامج استشارية وتدريبية متخصصة لتطوير البيئات المدرسية، وتأهيل الكوادر التعليمية، وبناء نماذج تربوية فاعلة.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-xs font-medium">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>يجري استكمال الحقائب التفصيلية للمسار — ومتاح حاليًا للتعاقد المؤسسي وتصميم البرامج المخصصة.</span>
          </div>

        </div>
      </section>

      {/* Overview & Scope */}
      <section className="py-14 sm:py-20 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-[#0E1524]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#154F9C] tracking-wider uppercase mb-2 block">نطاق العمل المؤسسي</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              مجالات التدريب والاستشارات للمؤسسات
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              نقدم حلولًا متكاملة مبنية على الخبرة الميدانية لالمستشار جلال أحمد في الإشراف التربوي والنفسي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-[#EDF5FD] dark:bg-[#122238] text-[#154F9C] flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                تأهيل الكوادر والمعلمين
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                ورش عمل لتزويد المعلمين بمهارات الإدارة الصفية الإيجابية، وفهم نفسيات الطلاب في المراحل العمرية المختلفة، والتواصل التربوي الفعال.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 border-t border-slate-200/60 dark:border-slate-700/60 pt-3">
                <li className="flex items-center gap-2">✓ الإدارة الصفية بالرفق والحزم</li>
                <li className="flex items-center gap-2">✓ الرعاية النفسية للطلاب</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-[#F2FBF7] dark:bg-[#0D261E] text-[#168962] flex items-center justify-center mb-4">
                <Users2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                البيئة المدرسية الآمنة
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                بناء برامج الوقاية من التنمر، وتعزيز الصحة النفسية المدرسية، وحل النزاعات السلوكية، وإشراك أولياء الأمور في خطة تكاملية.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 border-t border-slate-200/60 dark:border-slate-700/60 pt-3">
                <li className="flex items-center gap-2">✓ مواجهة التنمر والمشكلات السلوكية</li>
                <li className="flex items-center gap-2">✓ مجالس الآباء والشراكة التربوية</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-[#FDF9F0] dark:bg-[#2A2312] text-[#B87A14] flex items-center justify-center mb-4">
                <BookMarked className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                تصميم المناهج والحقائب
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                إعداد أدلة إرشادية وتدريبية مخصصة بحسب رؤية المؤسسة، مع مراعاة الهوية الإسلامية والقيم الأخلاقية ومتطلبات الاعتماد.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 border-t border-slate-200/60 dark:border-slate-700/60 pt-3">
                <li className="flex items-center gap-2">✓ أدلة الإرشاد النفسي الطلابي</li>
                <li className="flex items-center gap-2">✓ حقائب تدريبية جاهزة للتطبيق</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* Institutional Inquiry Form */}
      <section className="py-16 sm:py-20 bg-[#FDFCFB] dark:bg-[#0C111C]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121A2C] border border-slate-200 dark:border-slate-800 shadow-xl text-right">
            
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-[#154F9C] uppercase tracking-wider block mb-1">تواصل مؤسسي مباشر</span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                طلب تدريب أو استشارة لمؤسستك
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                املأ البيانات وسيتم التواصل معك لمناقشة الاحتياجات وتصميم العرض المناسب
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  تم استلام طلبكم المؤسسي بنجاح
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed max-w-md mx-auto">
                  وصل إشعار بالطلب مباشرة إلى إدارة المستشار جلال أحمد، وسيقوم فريق العمل بالتواصل معكم هاتفياً لمناقشة الاحتياجات وتصميم البرنامج المناسب.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-4 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-emerald-900/60 rounded-xl border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                >
                  إرسال طلب مؤسسي آخر
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
                    {errorMessage}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    اسم المؤسسة / المدرسة *
                  </label>
                  <input
                    type="text"
                    required
                    value={instName}
                    onChange={(e) => setInstName(e.target.value)}
                    placeholder="مثال: مدارس الأندلس الدولية"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      اسم المسؤول / المنسق *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="مثال: أ. محمود خالد"
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      رقم الهاتف / الواتساب *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="مثال: 01012345678"
                      dir="ltr"
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#154F9C] text-right"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    نوع المؤسسة
                  </label>
                  <select
                    value={instType}
                    onChange={(e) => setInstType(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
                  >
                    <option value="مدرسة / مجمع تعليمي">مدرسة / مجمع تعليمي</option>
                    <option value="معهد / مركز تدريب">معهد / مركز تدريب</option>
                    <option value="جمعية / مؤسسة غير ربحية">جمعية / مؤسسة غير ربحية</option>
                    <option value="جامعة / كلية">جامعة / كلية</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    طبيعة الطلب أو البرنامج المطلوب
                  </label>
                  <textarea
                    rows={3}
                    value={inquiry}
                    onChange={(e) => setInquiry(e.target.value)}
                    placeholder="مثال: نحتاج ورشة عمل لتأهيل معلمي المرحلة الابتدائية حول التعامل مع السلوكيات..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-[#154F9C]/20 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'جارٍ إرسال الطلب...' : 'إرسال طلب المؤسسة المباشر للإدارة'}</span>
                </button>
              </form>
            )}

          </div>

        </div>
      </section>

      {/* Navigation to other tracks */}
      <section className="py-12 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0E1524]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-slate-500 mb-4">اكتشف المسارات الأخرى في بناء وتمكين:</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/courses/family" 
              className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 hover:border-[#154F9C] text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
            >
              مسار الأسرة (برامج رحلة رفق) ←
            </Link>
            <Link 
              href="/courses/youth" 
              className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 hover:border-[#154F9C] text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
            >
              مسار الشباب - المكلفين ←
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
