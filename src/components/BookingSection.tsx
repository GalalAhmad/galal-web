'use client';

import React, { useState } from 'react';
import { Calendar, Send, CheckCircle2, ShieldCheck, Video, Loader2, Clock, Globe } from 'lucide-react';

export default function BookingSection() {
  const [formData, setFormData] = useState({
    full_name: '',
    whatsapp: '',
    email: '',
    track: 'marital',
    delivery_mode: 'online', // Sessions are strictly online via Google Meet
    preferred_time: 'any',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const calendlyUrl = 'https://calendly.com/galal3hmad/insan';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'تعذر إرسال الطلب');
      }

      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ في الاتصال، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="booking" className="py-20 px-4 sm:px-6 bg-[#0D1117] dark:bg-[#0D1117] bg-[#F8FAFC] border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 transition-colors">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* ترويسة الحجز */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 dark:bg-slate-800/60 bg-white border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs font-bold text-accent-500 shadow-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>حجز المواعيد والجلسات الاستشارية</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-100 dark:text-slate-100 text-slate-900 tracking-tight">
            اختر الطريقة الأنسب لحجز موعدك
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
            جميع الجلسات تُعقد <strong>أونلاين وحصرياً عن بُعد عبر اتصال مرئي مشفر وآمن (Google Meet)</strong> لضمان الخصوصية وسهولة الانعقاد من أي مكان بالعالم.
          </p>
        </div>

        {/* بطاقتان متماثلتان: الحجز الفوري عبر Calendly أو نموذج التنسيق المسبق */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* 1. خيار جدول التقويم المباشر (Google Calendar / Calendly) */}
          <div className="md:col-span-5 p-7 sm:p-8 rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 hover:border-slate-700 dark:hover:border-slate-700 transition-all shadow-sm space-y-5 text-right">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                حجز فوري وتأكيد آلي
              </span>
              <span className="text-xl">⚡</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
                الحجز المباشر عبر جدول التقويم
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-500 mt-1">
                اختر اليوم والساعة الأنسب لك فوراً من المواعيد المتاحة لجلال أحمد.
              </p>
            </div>

            <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal">
              يتضمن الحجز رابطاً مشفراً لاجتماع <strong>Google Meet</strong> يصلك تلقائياً على بريدك الإلكتروني، مع ضبط فرق التوقيت لبلدك تلقائياً.
            </p>

            <ul className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 space-y-2.5 pt-3 border-t border-slate-800/60 dark:border-slate-800/60 border-slate-100">
              <li className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>جلسة أونلاين عبر Google Meet مشفرة بالكامل</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>مطابقة آلية ودقيقة لفرق التوقيت الدولي</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تذكير تلقائي بالميعاد قبل الجلسة بيوم وساعة</span>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 text-center"
              >
                <span>فتح جدول المواعيد على التقويم الآن</span>
              </a>
            </div>
          </div>

          {/* 2. خيار نموذج التنسيق المسبق (Intake Form) مع Supabase */}
          <div className="md:col-span-7 p-7 sm:p-8 rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 shadow-sm space-y-6 text-right">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-accent-500 bg-accent-500/10 border border-accent-500/20 px-2.5 py-1 rounded-full">
                  تنسيق عبر الواتساب
                </span>
                <span className="text-xs text-slate-400">سرية وخصوصية مهنية تامة</span>
              </div>
              <h3 className="text-xl font-black text-slate-100 dark:text-slate-100 text-slate-900 mt-2">
                طلب استشارة أو ترتيب موعد خاص
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-500 mt-1 leading-relaxed">
                إذا كنت ترغب في التنسيق المسبق أو لديك استفسار تنظيمي، املأ البيانات وسيتواصل معك المنسق عبر الواتساب.
              </p>
            </div>

            {success ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-lg font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                  تم استلام طلب التنسيق بنجاح!
                </h4>
                <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed max-w-sm mx-auto">
                  شكراً لثقتك. سيتواصل معك المنسق عبر الواتساب لتأكيد موعد الجلسة ورابط Google Meet خلال <strong>24 ساعة</strong>.
                </p>
                <button
                  onClick={() => { setSuccess(false); setFormData({ full_name: '', whatsapp: '', email: '', track: 'marital', delivery_mode: 'online', preferred_time: 'any', notes: '' }); }}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-700 transition"
                >
                  إرسال طلب آخر
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-200 dark:text-slate-200 text-slate-700 mb-1">
                    الاسم الكريم (ثنائي أو ثلاثي) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="مثال: أحمد عبد الله"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 dark:bg-slate-800/60 bg-slate-50 border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-slate-100 dark:text-slate-100 text-slate-900 focus:ring-2 focus:ring-accent-500 outline-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-200 dark:text-slate-200 text-slate-700 mb-1">
                      رقم الواتساب مع رمز الدولة *
                    </label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="+962 70 000 0000 أو +20 100 000 0000"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 dark:bg-slate-800/60 bg-slate-50 border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-slate-100 dark:text-slate-100 text-slate-900 focus:ring-2 focus:ring-accent-500 outline-none text-xs text-left"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-200 dark:text-slate-200 text-slate-700 mb-1">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      required
                      dir="ltr"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 dark:bg-slate-800/60 bg-slate-50 border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-slate-100 dark:text-slate-100 text-slate-900 focus:ring-2 focus:ring-accent-500 outline-none text-xs text-left"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-200 dark:text-slate-200 text-slate-700 mb-1">
                      المسار أو البرنامج المطلوب *
                    </label>
                    <select
                      value={formData.track}
                      onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 dark:bg-slate-800/60 bg-slate-50 border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-slate-100 dark:text-slate-100 text-slate-900 focus:ring-2 focus:ring-accent-500 outline-none text-xs"
                    >
                      <option value="premarital" className="bg-[#151B23] text-white">برنامج رحلة رِفق (للمقبلين على الزواج)</option>
                      <option value="marital" className="bg-[#151B23] text-white">برنامج مِيثاق (للمتزوجين والأسر)</option>
                      <option value="individual" className="bg-[#151B23] text-white">استشارة نفسية فردية (عن بُعد)</option>
                      <option value="teen" className="bg-[#151B23] text-white">إرشاد اليافعين وتربية المراهقين</option>
                      <option value="corporate" className="bg-[#151B23] text-white">استشارة وتدريب مدرسي / مؤسسي</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-200 dark:text-slate-200 text-slate-700 mb-1">
                      طريقة الانعقاد
                    </label>
                    <input
                      type="text"
                      disabled
                      value="أونلاين عبر اتصال مرئي مشفر (Google Meet)"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/30 dark:bg-slate-800/30 bg-slate-100 border border-slate-700/40 dark:border-slate-700/40 border-slate-200 text-emerald-400 font-bold outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-200 dark:text-slate-200 text-slate-700 mb-1">
                    ملاحظات أو أسئلة عامة (اختياري)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="لا داعي لكتابة تفاصيل مشكلتك الحساسة هنا؛ يقتصر هذا الحقل على أي استفسار تنظيمي عام."
                    className="w-full px-4 py-2 rounded-xl bg-slate-800/60 dark:bg-slate-800/60 bg-slate-50 border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-slate-100 dark:text-slate-100 text-slate-900 focus:ring-2 focus:ring-accent-500 outline-none text-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>جارٍ إرسال الطلب...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>إرسال طلب التنسيق المبدئي</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 text-center">
                  نلتزم بالسرية المهنية وأخلاقيات الاستشارات النفسية. بياناتك لا تشارك مع أي طرف ثالث.
                </p>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
