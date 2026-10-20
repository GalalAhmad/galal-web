'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Star, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  MessageSquareHeart, 
  ArrowLeft,
  HeartHandshake,
  Sparkles
} from 'lucide-react';

export default function FeedbackPage() {
  const [clientName, setClientName] = useState('');
  const [sessionType, setSessionType] = useState('استشارة نفسية فردية');
  const [serviceCategory, setServiceCategory] = useState<'psychological' | 'marital' | 'parenting' | 'course' | 'emergency'>('psychological');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [location, setLocation] = useState('');
  const [feedback, setFeedback] = useState('');
  const [allowPublish, setAllowPublish] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const serviceOptions = [
    { label: 'استشارة نفسية فردية', category: 'psychological' },
    { label: 'استشارة زوجية وأسرية', category: 'marital' },
    { label: 'إرشاد والدي وتربوي (الأبناء واليافعين)', category: 'parenting' },
    { label: 'حجز طارئ واستجابة عاجلة', category: 'emergency' },
    { label: 'برنامج رحلة رفق | ميثاق (للمتزوجين)', category: 'course' },
    { label: 'برنامج رحلة رفق | وعي (للمقبلين على الزواج)', category: 'course' },
    { label: 'استشارة أو برنامج مؤسسي', category: 'psychological' },
  ];

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTitle = e.target.value;
    setSessionType(selectedTitle);
    const matched = serviceOptions.find(o => o.label === selectedTitle);
    if (matched) {
      setServiceCategory(matched.category as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setErrorMessage('يرجى كتابة نص التقييم أو الملاحظات قبل الإرسال');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName.trim() || 'مستفيد كريم',
          sessionType,
          serviceCategory,
          rating,
          location: location.trim() || 'أونلاين',
          feedback: feedback.trim(),
          allowPublish,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'تعذر إرسال التقييم');
      }

      setSubmitted(true);
      setFeedback('');
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFCFB] dark:bg-[#0C111C] text-slate-800 dark:text-slate-100 flex flex-col antialiased selection:bg-[#154F9C]/10 selection:text-[#154F9C]">
      <Navbar />

      {/* Header Banner */}
      <section className="py-12 sm:py-16 bg-white dark:bg-[#0E1524] border-b border-slate-100 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EDF5FD] dark:bg-[#122238] border border-[#D6E6F8] dark:border-[#1E3A5F] text-[#154F9C] dark:text-[#60A5FA] text-xs font-semibold mb-4">
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span>صوتك يساعدنا على التحسين المستمر</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            تقييم الجلسة ومشاركة تجربتك
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            نثمن وقتك وثقتك بنا. ملاحظاتك وتجربتك بعد الجلسة الاستشارية تسهم في تطوير جودة الخدمة ودعم مستفيدين آخرين يبحثون عن الأمان النفسي.
          </p>
        </div>
      </section>

      {/* Form Container */}
      <section className="py-12 sm:py-16 flex-1">
        <div className="max-w-xl mx-auto px-4 sm:px-6">

          {submitted ? (
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#121A2C] border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                شكراً جزيلاً لصدقك ومشاركتك!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                تم استلام تقييمك بنجاح وسيرفع مباشرة إلى المستشار جلال أحمد وفريق الإشراف. نسأل الله لك دوام الطمأنينة والتوفيق.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold transition shadow-sm"
                >
                  العودة للرئيسية
                </Link>
                <button
                  onClick={() => setSubmitted(false)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  إرسال تقييم آخر
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121A2C] border border-slate-200 dark:border-slate-800 shadow-xl">
              
              <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-100 dark:border-slate-800/80">
                <HeartHandshake className="w-5 h-5 text-[#154F9C] dark:text-[#60A5FA]" />
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  استبيان تقييم الرضا وجودة الاستشارة
                </span>
              </div>

              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 text-right">
                
                {/* 1. Rating Stars */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-2">
                    كيف تقيم تجربتك الإجمالية مع الجلسة؟ *
                  </label>
                  <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700/60 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              isActive
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 px-2">
                    <span>تحتاج تحسيناً</span>
                    <span className="font-bold text-amber-500">
                      {rating === 5 ? 'ممتازة جداً (5/5)' : rating === 4 ? 'جيدة جداً (4/5)' : rating === 3 ? 'متوسطة (3/5)' : 'أقل من المتوقع'}
                    </span>
                    <span>فوق التوقعات</span>
                  </div>
                </div>

                {/* 2. Service Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-1.5">
                    نوع الخدمة أو الجلسة التي تلقيتها *
                  </label>
                  <select
                    value={sessionType}
                    onChange={handleServiceChange}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
                  >
                    {serviceOptions.map((opt) => (
                      <option key={opt.label} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Written Review */}
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-1.5">
                    رأيك وتجربتك مع المستشار جلال أحمد *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="ما الأثر الذي لمسته من الجلسة؟ كيف كان أسلوب الحوار ووضوح الأدوات والخطوات السلوكية المقترحة؟"
                    className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#154F9C] leading-relaxed"
                  />
                </div>

                {/* 4. Name & City (Privacy-aware) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-1.5">
                      الاسم أو اللقب المفضل (اختياري)
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="مثال: م. خالد أو فاعل خير"
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">يمكنك استخدام الأحرف الأولى للحفاظ على خصوصيتك</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-1.5">
                      المدينة / الدولة (اختياري)
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="مثال: الرياض أو عمان"
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
                    />
                  </div>
                </div>

                {/* 5. Consent to publish */}
                <div className="p-3.5 rounded-2xl bg-[#EDF7F5] dark:bg-[#112924]/50 border border-[#D6EEEA] dark:border-[#1F4A42] flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={allowPublish}
                    onChange={(e) => setAllowPublish(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#154F9C] rounded border-slate-300 focus:ring-[#154F9C]"
                  />
                  <label htmlFor="consent" className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed cursor-pointer select-none">
                    <span className="font-bold text-slate-900 dark:text-white">أوافق على نشر رأيي في تجارب المستفيدين</span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">
                      سيُنشر رأيك مع الحفاظ على خصوصيتك واسمك الرمزي فقط دون الكشف عن أي بيانات شخصية.
                    </span>
                  </label>
                </div>

                {/* Privacy Guarantee Note */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-[#168962]" />
                  <span>خصوصيتك وسريتك مصونة 100% وفق ميثاق الشرف المهني للاستشارات.</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-[#154F9C]/20 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'جارٍ حفظ التقييم...' : 'إرسال التقييم'}</span>
                </button>
              </form>

            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}
