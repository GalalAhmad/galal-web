'use client';

import React, { useState } from 'react';
import { Calendar, Send, CheckCircle2, ShieldCheck, Video, MapPin, Loader2 } from 'lucide-react';

export default function BookingSection() {
  const [formData, setFormData] = useState({
    full_name: '',
    whatsapp: '',
    email: '',
    track: 'marital',
    delivery_mode: 'online',
    preferred_time: 'any',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const googleCalendarUrl = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_URL || 'https://calendar.google.com';

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
    <section id="booking" className="py-20 px-4 sm:px-6 bg-brand-800 text-white relative">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* ترويسة الحجز */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-slate-200">
            <Calendar className="w-3.5 h-3.5" />
            <span>حجز الجلسات والمواعيد</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black">
            اختر الطريقة الأنسب لحجز موعدك
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            تُعقد الجلسات عن بُعد عبر اتصال مرئي مشفر وآمن، أو حضورياً بمقرنا في القاهرة.
          </p>
        </div>

        {/* بطاقتان رئيسيتان: جوجل كالندر المباشر أو نموذج التنسيق */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* 1. خيار تقويم جوجل المباشر (Google Calendar) */}
          <div className="md:col-span-5 p-7 sm:p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-5 text-right">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                حجز فوري مؤكد
              </span>
              <span className="text-2xl">⚡</span>
            </div>

            <h3 className="text-xl font-bold text-white">
              الحجز المباشر عبر تقويم جوجل
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              إذا كنت تفضل اختيار الوقت المناسب لك مباشرة من جدول المواعيد المتاحة لد. جلال وتأكيد الموعد فوراً مع رابط <strong>Google Meet</strong> تلقائي:
            </p>

            <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-white/10">
              <li className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>رابط اتصال Google Meet مشفر لكل جلسة</span>
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>مطابقة آلية لفرق التوقيت الدولي</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>إشعار وتذكير عبر البريد الإلكتروني</span>
              </li>
            </ul>

            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-white text-brand-800 text-xs font-bold rounded-xl hover:bg-slate-100 transition shadow-md flex items-center justify-center gap-2 text-center"
            >
              <span>فتح جدول المواعيد على Google Calendar</span>
            </a>
          </div>

          {/* 2. خيار نموذج التنسيق المسبق (Intake Form) متصل بـ Supabase */}
          <div className="md:col-span-7 p-7 sm:p-8 rounded-3xl bg-white text-slate-800 shadow-xl space-y-6 text-right">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sage-600 bg-sage-50 px-2.5 py-1 rounded-full">
                  تنسيق مسبق
                </span>
                <span className="text-xs text-slate-400">سرية وخصوصية تامة</span>
              </div>
              <h3 className="text-xl font-bold text-brand-800 mt-2">
                طلب استشارة أو تنسيق خاص
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                املأ بيانات التنسيق الأساسية وسيتواصل معك فريق المركز عبر الواتساب لتأكيد التفاصيل والموعد المناسب.
              </p>
            </div>

            {success ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-lg font-bold text-emerald-950">
                  تم استلام طلبك بنجاح!
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                  شكراً لثقتك. سيتواصل معك منسق الحجوزات عبر الواتساب أو البريد خلال <strong>24–48 ساعة</strong> لإبلاغك بالمواعيد المناسبة وإتمام التأكيد.
                </p>
                <button
                  onClick={() => { setSuccess(false); setFormData({ full_name: '', whatsapp: '', email: '', track: 'marital', delivery_mode: 'online', preferred_time: 'any', notes: '' }); }}
                  className="px-4 py-2 bg-white border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-xl hover:bg-emerald-100 transition"
                >
                  إرسال طلب آخر
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    الاسم الكريم (ثنائي أو ثلاثي) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="مثال: أحمد عبد الله"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-800 outline-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      رقم الواتساب مع رمز الدولة *
                    </label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="+20 100 000 0000"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-800 outline-none text-xs text-left"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      required
                      dir="ltr"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-800 outline-none text-xs text-left"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      المسار أو البرنامج المطلوب *
                    </label>
                    <select
                      value={formData.track}
                      onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-800 outline-none text-xs bg-white"
                    >
                      <option value="premarital">برنامج رحلة رِفق (للمقبلين على الزواج)</option>
                      <option value="marital">برنامج مِيثاق (للمتزوجين والأسر)</option>
                      <option value="individual">استشارة نفسية فردية</option>
                      <option value="teen">إرشاد اليافعين وتربية المراهقين</option>
                      <option value="corporate">استشارة وتدريب مؤسسي (مركز إنسان)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      طريقة الانعقاد المفضلة
                    </label>
                    <select
                      value={formData.delivery_mode}
                      onChange={(e) => setFormData({ ...formData, delivery_mode: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-800 outline-none text-xs bg-white"
                    >
                      <option value="online">عن بُعد (اتصال مرئي مشفر)</option>
                      <option value="in_person">حضورياً (بمقرنا في القاهرة)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ملاحظات أو أسئلة عامة (اختياري)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="لا داعي لكتابة تفاصيل مشكلتك الحساسة هنا؛ يقتصر هذا الحقل على أي استفسار تنظيمي عام."
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-800 outline-none text-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-brand-800 text-white font-bold rounded-xl text-xs hover:bg-black transition flex items-center justify-center gap-2 shadow-md disabled:opacity-70"
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
