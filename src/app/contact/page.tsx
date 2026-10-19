'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Mail, 
  Phone, 
  Video, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Building2, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requestType: 'individual',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Prepare WhatsApp Message
    const typeNames: Record<string, string> = {
      individual: 'استشارة نفسية فردية',
      marital: 'إرشاد زواجي / برامج المقبلين (رفق وميثاق)',
      parenting: 'استشارة تربوية وإرشاد يافعين',
      institutional: 'تدريب واستشارات لمدارس ومؤسسات تعليمية',
      other: 'استفسار عام أو شراكة'
    };

    const text = `السلام عليكم أستاذ جلال،\nأنا: ${formData.name}\nنوع الطلب: ${typeNames[formData.requestType] || formData.requestType}\nالبريد: ${formData.email}\nالهاتف: ${formData.phone}\n\nالرسالة:\n${formData.message}`;
    
    // Open WhatsApp
    const waUrl = `https://wa.me/201014876666?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#0D1117] dark:bg-[#0D1117] bg-[#F8FAFC] text-slate-100 dark:text-slate-100 text-slate-900 transition-colors">
      <Navbar />

      {/* Header */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 text-right">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[280px] bg-accent-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/60 dark:bg-slate-800/60 bg-slate-100 border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs font-bold text-accent-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>التواصل والتنسيق المباشر</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-100 dark:text-slate-100 text-slate-900 leading-[1.6]">
            تواصل معنا.. نسعد بالاستماع إليك ومساندتك
          </h1>

          <p className="text-sm sm:text-base text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed font-normal">
            سواء كنت ترغب في حجز جلسة استشارية خاصة، أو التنسيق لبرنامج تدريبي لمدرستك أو مؤسستك، فريق التنسيق متاح للرد على استفساراتك وتنظيم المواعيد بكل عناية وسرية.
          </p>
        </div>
      </section>

      {/* المحتوى الرئيسي: قنوات التواصل والنموذج */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#11161D] dark:bg-[#11161D] bg-slate-50 border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* العمود الأيمن: قنوات التواصل المعتمدة */}
          <div className="lg:col-span-5 space-y-8 text-right order-2 lg:order-1">
            
            <div className="space-y-3">
              <h2 className="text-xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
                القنوات الرسمية المعتمدة
              </h2>
              <p className="text-xs text-slate-400">
                يمكنك التواصل المباشر عبر أي من الوسائل التالية وفق ما يناسبك:
              </p>
            </div>

            <div className="space-y-4">
              
              {/* واتساب */}
              <a
                href="https://wa.me/201014876666"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 rounded-2xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 hover:border-accent-500 transition shadow-xs group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100 dark:text-slate-100 text-slate-900 group-hover:text-accent-500 transition-colors">
                      واتساب والتنسيق الهاتفي المباشر
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </div>
                  <div className="text-xs font-mono text-emerald-400 mt-1 font-semibold" dir="ltr">
                    +20 101 487 6666
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    متاح للمراسلات السريعة وتنسيق المواعيد والبرامج
                  </p>
                </div>
              </a>

              {/* البريد الإلكتروني الرسمي */}
              <a
                href="mailto:info@galalahmad.com"
                className="flex items-start gap-4 p-5 rounded-2xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 hover:border-accent-500 transition shadow-xs group"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-500/10 text-accent-500 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100 dark:text-slate-100 text-slate-900 group-hover:text-accent-500 transition-colors">
                      البريد الإلكتروني الرسمي
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </div>
                  <div className="text-xs font-mono text-accent-500 mt-1 font-semibold">
                    info@galalahmad.com
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    للمراسلات الرسمية وطلبات التدريب للمدارس والمؤسسات
                  </p>
                </div>
              </a>

              {/* الجلسات الافتراضية */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                    جلسات أونلاين عبر Google Meet
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    تُعقد الاستشارات الفردية والزوجية عن بُعد عبر اتصال مرئي مشفر وآمن، مما يتيح لك الاستفادة من الخدمة من أي مكان في العالم.
                  </p>
                </div>
              </div>

              {/* أوقات الاستجابة والسرية */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-100 dark:text-slate-100 text-slate-900">
                    أوقات العمل وسرعة الرد
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    الرد المعتاد على الرسائل والاستفسارات خلال 24 ساعة من أيام العمل الرسمية مع الحفاظ التام على خصوصية وسرية بياناتكم.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* العمود الأيسر: نموذج التنسيق وفرز الطلبات */}
          <div className="lg:col-span-7 text-right order-1 lg:order-2">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 shadow-xl space-y-6">
              
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
                  أرسل طلبك أو استفسارك مباشرة
                </h3>
                <p className="text-xs text-slate-400">
                  يرجى تحديد نوع الطلب بدقة لتوجيهه للمسار الصحيح وتسهيل الرد عليك
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
                  <div className="text-base font-bold">تم إرسال طلبك بنجاح!</div>
                  <p className="text-xs leading-relaxed text-slate-300">
                    تم فتح محادثة الواتساب المعتمدة لإرسال تفاصيل طلبك مباشرة لمنسق المواعيد. سيتم التواصل معك والرد في أقرب وقت.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold underline mt-2 inline-block text-emerald-400 hover:text-emerald-300"
                  >
                    إرسال طلب آخر
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* نوع الطلب */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 dark:text-slate-300 text-slate-700 mb-1.5">
                      نوع الطلب أو الخدمة المطلوبة:
                    </label>
                    <select
                      value={formData.requestType}
                      onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 bg-slate-50 border border-slate-700 dark:border-slate-700 border-slate-300 text-xs text-slate-100 dark:text-slate-100 text-slate-900 focus:outline-hidden focus:border-accent-500"
                    >
                      <option value="individual">استشارة نفسية فردية وبصيرة الذات</option>
                      <option value="marital">إرشاد زواجي / برامج المقبلين (رحلة رفق أو ميثاق)</option>
                      <option value="parenting">استشارة تربوية وإرشاد الوالدين واليافعين</option>
                      <option value="institutional">تدريب واستشارات لمدارس ومؤسسات تعليمية</option>
                      <option value="other">استفسار عام أو شراكة ورعاية</option>
                    </select>
                  </div>

                  {/* الاسم الكامل */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 dark:text-slate-300 text-slate-700 mb-1.5">
                      الاسم الكريم:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="أدخل اسمك الكريم"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 bg-slate-50 border border-slate-700 dark:border-slate-700 border-slate-300 text-xs text-slate-100 dark:text-slate-100 text-slate-900 focus:outline-hidden focus:border-accent-500"
                    />
                  </div>

                  {/* الهاتف / واتساب */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 dark:text-slate-300 text-slate-700 mb-1.5">
                      رقم الواتساب مع المفتاح الدولي:
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+20 101 234 5678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 bg-slate-50 border border-slate-700 dark:border-slate-700 border-slate-300 text-xs text-slate-100 dark:text-slate-100 text-slate-900 focus:outline-hidden focus:border-accent-500 font-mono text-right"
                      dir="ltr"
                    />
                  </div>

                  {/* البريد الإلكتروني */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 dark:text-slate-300 text-slate-700 mb-1.5">
                      البريد الإلكتروني (اختياري):
                    </label>
                    <input
                      type="email"
                      placeholder="yourname@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 bg-slate-50 border border-slate-700 dark:border-slate-700 border-slate-300 text-xs text-slate-100 dark:text-slate-100 text-slate-900 focus:outline-hidden focus:border-accent-500 font-mono text-right"
                      dir="ltr"
                    />
                  </div>

                  {/* الرسالة / ملخص الاحتياج */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 dark:text-slate-300 text-slate-700 mb-1.5">
                      ملخص الطلب أو الاستفسار:
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="وضح بإيجاز طبيعة الاستشارة أو البرنامج المطلوب..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 bg-slate-50 border border-slate-700 dark:border-slate-700 border-slate-300 text-xs text-slate-100 dark:text-slate-100 text-slate-900 focus:outline-hidden focus:border-accent-500"
                    />
                  </div>

                  {/* زر الإرسال */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-accent-500 hover:bg-accent-600 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-md shadow-accent-500/20 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال الطلب والتواصل مباشرة</span>
                  </button>

                  <p className="text-[10px] text-slate-400 text-center pt-1">
                    🔒 معلوماتكم محاطة بالسرية التامة ولا يتم مشاركتها مع أي جهة خارجية.
                  </p>

                </form>
              )}

            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
