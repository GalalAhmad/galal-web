'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Sparkles, 
  Send, 
  ChevronRight, 
  Clock, 
  ArrowLeft,
  Compass,
  Shield,
  Target,
  BrainCircuit,
  MessageCircle,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

export default function YouthTrackPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ageGroup, setAgeGroup] = useState('15 - 18 سنة (مرحلة التكليف واليافعين)');
  const [interests, setInterests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const message = `تسجيل اهتمام مبكر - مسار الشباب والمكلفين%0Aالاسم: ${name}%0Aالهاتف: ${phone}%0Aالفئة العمرية: ${ageGroup}%0Aالاهتمامات أو التحديات: ${interests || 'لا يوجد'}`;
    const whatsappUrl = `https://wa.me/201014876666?text=${message}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      window.open(whatsappUrl, '_blank');
      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setPhone('');
        setInterests('');
      }, 2500);
    }, 400);
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
            <span className="text-slate-800 dark:text-slate-200 font-medium">مسار الشباب - المكلفين</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-b from-[#F5F3FF]/60 via-[#FDFCFB] to-transparent dark:from-[#201938]/20 dark:via-[#0C111C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7452B8]/10 border border-[#7452B8]/20 text-[#7452B8] text-xs font-semibold mb-6">
            <Compass className="w-3.5 h-3.5" />
            <span>مسارات بناء وتمكين • مسار تمكين اليافعين والشباب</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-5">
            مسار الشباب - المكلفين
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
            برامج متخصصة لبناء الوعي بالذات، وترسيخ الهوية، وتنمية الصلابة النفسية، وإدارة مرحلة التكليف والمسؤولية بوعي واطمئنان.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 text-[#7452B8] dark:text-purple-300 text-xs font-medium">
            <Clock className="w-4 h-4 text-[#7452B8] shrink-0" />
            <span>قيد الإعداد والتطوير المنهجي — التسجيل المبكر متاح لحجز مقعد في أولى المجموعات التفاعلية.</span>
          </div>

        </div>
      </section>

      {/* Core Themes */}
      <section className="py-14 sm:py-20 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-[#0E1524]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#7452B8] tracking-wider uppercase mb-2 block">محاور المسار</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              ركائز بناء الشباب والمكلفين
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              موضوعات واقعية تمس حياة الشاب والفتاة في عالم اليوم سريع التغير
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] dark:bg-[#201938] text-[#7452B8] flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                مرحلة التكليف والمسؤولية
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                الانتقال الواعي من مرحلة الطفولة إلى سن التكليف الشرعي، وفهم معنى الاستقلالية المسؤولة، وإدراك القيمة والأثر الشخصي في الحياة والمجتمع.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-[#EDF5FD] dark:bg-[#122238] text-[#154F9C] flex items-center justify-center mb-4">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                الوعي بالذات والمشاعر
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                اكتشاف نقاط القوة والضعف، وفهم تقلبات المشاعر في سن المراهقة والشباب، والتعامل الصحي مع القلق والتوتر وضغوط الدراسة والمستقبل.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#121A2C] border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-[#F2FBF7] dark:bg-[#0D261E] text-[#168962] flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                الصلابة النفسية والهوية
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                بناء مناعة فكرية ونفسية أمام ضغوط المقارنات في وسائل التواصل، ومقاومة ضغط الأقران، وترسيخ الاعتزاز بالهوية الإسلامية والقيم الراسخة.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Early Interest Waiting List */}
      <section className="py-16 sm:py-20 bg-[#FDFCFB] dark:bg-[#0C111C]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121A2C] border border-slate-200 dark:border-slate-800 shadow-xl text-right">
            
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-[#7452B8] uppercase tracking-wider block mb-1">قائمة الانتظار والتسجيل المبكر</span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                كن أول المنضمين لبرامج مسار الشباب
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                سجل بياناتك وسيتم إشعارك فور فتح باب التسجيل لأول دفعة تدريبية
              </p>
            </div>

            {submitted ? (
              <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-center text-[#7452B8] dark:text-purple-300 text-xs font-semibold">
                ✓ تم تسجيل رغبتك بنجاح! سيتم إخطارك بكل جديد عن المسار فور الإطلاق.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    الاسم بالكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: يوسف خالد أو والد/والدة المشارك"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7452B8]"
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
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7452B8] text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    الفئة العمرية للمستفيد
                  </label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7452B8]"
                  >
                    <option value="13 - 15 سنة (مرحلة البلوغ والتكليف المبكر)">13 - 15 سنة (مرحلة البلوغ والتكليف المبكر)</option>
                    <option value="16 - 18 سنة (اليافعين والثانوية)">16 - 18 سنة (اليافعين والثانوية)</option>
                    <option value="19 - 24 سنة (الشباب والجامعيين)">19 - 24 سنة (الشباب والجامعيين)</option>
                    <option value="ولي أمر يرغب في إلحاق أبنائه">ولي أمر يرغب في إلحاق أبنائه</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    أهم الموضوعات أو التحديات التي ترغب في تغطيتها
                  </label>
                  <textarea
                    rows={2}
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="مثال: إدارة التوتر الدراسي، بناء الثقة بالنفس، التعامل مع ضغوط السوشيال ميديا..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7452B8]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full bg-[#7452B8] hover:bg-[#6242A1] text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-[#7452B8]/20 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'جارٍ الحفظ...' : 'انضم لقائمة الانتظار عبر واتساب'}</span>
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
              href="/courses/institutions" 
              className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 hover:border-[#154F9C] text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
            >
              مسار المؤسسات التعليمية والتربوية ←
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
