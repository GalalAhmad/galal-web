'use client';

import React, { useState } from 'react';
import { X, Users, Send, CheckCircle2, Sparkles, Clock, ShieldCheck } from 'lucide-react';

interface GroupTherapyWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GroupTherapyWaitlistModal({
  isOpen,
  onClose,
}: GroupTherapyWaitlistModalProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [interestTopic, setInterestTopic] = useState('إدارة القلق والضغوط اليومية');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      setErrorMsg('يرجى كتابة الاسم ورقم الواتساب أو البريد');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact,
          interestTopic,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'تعذر تسجيل الطلب');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-right space-y-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="waitlist-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="إغلاق النافذة"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-11 h-11 rounded-2xl bg-[#EDF5FD] dark:bg-[#122238] flex items-center justify-center text-[#154F9C] dark:text-[#60A5FA] shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-200/70 dark:border-amber-900/60">
              <Clock className="w-3 h-3" />
              <span>قريباً • قائمة الانتظار المسبقة</span>
            </div>
            <h2 id="waitlist-modal-title" className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
              المجموعات العلاجية والإرشادية (Group Therapy)
            </h2>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              تم تسجيلك في قائمة الانتظار بنجاح!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
              شكراً لاهتمامك. سنقوم بالتواصل معك وتزويدك بكافة تفاصيل المجموعة ومواعيد انعقادها فور اكتمال الترتيبات وقبل الإعلان العام.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#154F9C] text-white text-xs font-bold hover:bg-[#103D7A] transition"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              مساحات تفاعلية مغلقة تضم عدداً محدوداً من المشاركين للتشارك والتعافي وبناء الأدوات النفسية تحت إشراف وتوجيه المستشار جلال أحمد. سجّل اهتمامك لتكون أول من ينضم:
            </p>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-900 dark:text-slate-200 mb-1">
                الاسم أو اللقب المفضل *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: سارة أو م. أحمد"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 dark:text-slate-200 mb-1">
                رقم الواتساب أو البريد الإلكتروني *
              </label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+966 50 000 0000 أو name@example.com"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 dark:text-slate-200 mb-1">
                موضوع المجموعة المفضل
              </label>
              <select
                value={interestTopic}
                onChange={(e) => setInterestTopic(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
              >
                <option value="إدارة القلق والضغوط اليومية">إدارة القلق والضغوط اليومية واستعادة الاتزان</option>
                <option value="الأمان العاطفي وتفكيك النزاعات الزوجية">الأمان العاطفي وتفكيك النزاعات الزوجية</option>
                <option value="إرشاد ودعم أمهات وآباء المراهقين">إرشاد ودعم أمهات وآباء المراهقين (التربية بالرفق)</option>
                <option value="بناء الصلابة والتعافي بعد الصدمات">بناء الصلابة والتعافي وتجاوز الخسائر العاطفية</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-900 dark:text-slate-200 mb-1">
                ملاحظات أو استفسار إضافي (اختياري)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي أوقات تفضلها أو تفاصيل تود إخبارنا بها..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-full bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'جارٍ تسجيل الطلب...' : 'تسجيل الاهتمام والانضمام لقائمة الانتظار'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
