'use client';

import React, { useState } from 'react';
import { Calendar, Send, CheckCircle2, ShieldCheck, Video, Loader2, MessageSquare, Globe, Clock } from 'lucide-react';

export default function BookingSection() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'form'>('calendar');
  const [formData, setFormData] = useState({
    full_name: '',
    whatsapp: '',
    email: '',
    track: 'marital',
    delivery_mode: 'online', // Strictly online via Google Meet
    preferred_time: 'any',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const calendlyEmbedUrl = 'https://calendly.com/galal3hmad/insan?embed_domain=galalahmad.com&embed_type=Inline&hide_landing_page_details=1&hide_gdpr_banner=1';

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
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* ترويسة الحجز */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 dark:bg-slate-800/60 bg-white border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs font-bold text-accent-500 shadow-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>حجز الجلسات المباشر</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-100 dark:text-slate-100 text-slate-900 tracking-tight">
            احجز موعد جلستك الاستشارية مباشرة
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
            جميع الجلسات تُعقد <strong>أونلاين وحصرياً عن بُعد عبر اتصال مرئي مشفر وآمن (Google Meet)</strong> دون الحاجة للخروج من الموقع.
          </p>

          {/* تبديل التبويب */}
          <div className="inline-flex p-1.5 rounded-2xl bg-[#151B23] dark:bg-[#151B23] bg-slate-200/80 border border-slate-800 dark:border-slate-800 border-slate-300 gap-1 mt-2">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'calendar'
                  ? 'bg-accent-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>التقويم التفاعلي المباشر (Google Meet)</span>
            </button>

            <button
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'form'
                  ? 'bg-accent-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>طلب تنسيق خاص عبر الواتساب</span>
            </button>
          </div>
        </div>

        {/* التبويب 1: التقويم التفاعلي المدمج مباشرة داخل الموقع (بدون خروج العميل) */}
        {activeTab === 'calendar' && (
          <div className="p-4 sm:p-6 rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 shadow-xl space-y-4 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 pb-3 border-b border-slate-800/80 dark:border-slate-800/80 border-slate-100 text-right">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200 dark:text-slate-200 text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>جدول المواعيد المباشرة لجلال أحمد</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google Meet تلقائي</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-accent-500" />
                  <span>ضبط فرق التوقيت لبلدك</span>
                </span>
              </div>
            </div>

            {/* Calendly Inline Embed */}
            <div className="w-full rounded-2xl overflow-hidden bg-white shadow-inner min-h-[680px]">
              <iframe
                src={calendlyEmbedUrl}
                width="100%"
                height="700"
                frameBorder="0"
                title="جدول مواعيد جلال أحمد"
                className="w-full h-[700px] rounded-2xl"
              />
            </div>

            <div className="text-center text-[11px] text-slate-400 pt-1">
              🔒 بعد اختيار الموعد، ستصلك رسالة تأكيد إلكترونية فورية برابط الاجتماع المرئي المشفر.
            </div>

          </div>
        )}

        {/* التبويب 2: نموذج التنسيق المسبق (Intake Form) */}
        {activeTab === 'form' && (
          <div className="max-w-2xl mx-auto p-7 sm:p-9 rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 shadow-xl space-y-6 text-right animate-fadeIn">
            
            <div>
              <span className="text-xs font-bold text-accent-500 bg-accent-500/10 border border-accent-500/20 px-2.5 py-1 rounded-full">
                تنسيق مسبق
              </span>
              <h3 className="text-xl font-black text-slate-100 dark:text-slate-100 text-slate-900 mt-2">
                طلب استشارة أو تنسيق موعد عبر الواتساب
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-500 mt-1">
                املأ بياناتك الأساسية وسيتواصل معك المنسق لتأكيد التوقيت المناسب وإرسال الرابط.
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
                  شكراً لثقتك. سيتواصل معك فريق التنسيق عبر الواتساب لإبلاغك بالمواعيد المناسبة خلال <strong>24 ساعة</strong>.
                </p>
                <button
                  onClick={() => { setSuccess(false); setFormData({ full_name: '', whatsapp: '', email: '', track: 'marital', delivery_mode: 'online', preferred_time: 'any', notes: '' }); }}
                  className="px-5 py-2 bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-700 transition"
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
                      المسار المطلوب *
                    </label>
                    <select
                      value={formData.track}
                      onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 dark:bg-slate-800/60 bg-slate-50 border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-slate-100 dark:text-slate-100 text-slate-900 focus:ring-2 focus:ring-accent-500 outline-none text-xs"
                    >
                      <option value="marital" className="bg-[#151B23] text-white">إرشاد زواجي (برنامج مِيثاق)</option>
                      <option value="premarital" className="bg-[#151B23] text-white">تأهيل مقبلين (برنامج رحلة رِفق)</option>
                      <option value="individual" className="bg-[#151B23] text-white">استشارة نفسية فردية</option>
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
                    ملاحظات أو استفسار عام (اختياري)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="لا داعي لكتابة التفاصيل الحساسة هنا؛ يقتصر الحقل على أي استفسار تنظيمي عام."
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
        )}

      </div>
    </section>
  );
}
