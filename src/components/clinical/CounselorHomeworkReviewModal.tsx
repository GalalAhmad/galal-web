'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, MessageSquare, Send, Calendar, Clock, UserCheck } from 'lucide-react';

interface CounselorHomeworkReviewModalProps {
  homework: any;
  client: any;
  onClose: () => void;
  onReviewSuccess: () => void;
}

export default function CounselorHomeworkReviewModal({
  homework,
  client,
  onClose,
  onReviewSuccess,
}: CounselorHomeworkReviewModalProps) {
  const [feedback, setFeedback] = useState(homework.counselorFeedback || '');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fields: any[] = Array.isArray(homework.fields) && homework.fields.length > 0
    ? homework.fields
    : [
        {
          id: 'response',
          labelAr: 'إجابة العميل',
        },
      ];

  const answers: Record<string, any> = homework.clientAnswers || {};

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/clinical/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'review',
          homeworkId: homework.id,
          phone: client.phone,
          email: client.email,
          clientId: client.id,
          counselorFeedback: feedback.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'تعذر حفظ التقييم');
        setSubmitting(false);
        return;
      }

      setSuccessMsg('تم حفظ المراجعة واعتماد التمرين وإرسال التغذية الراجعة لملف العميل بنجاح ✓');
      setTimeout(() => {
        onReviewSuccess();
        onClose();
      }, 1400);
    } catch (err) {
      setErrorMsg('حدث خطأ أثناء الاتصال بالخادم.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn text-right overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0E1524] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-linear-to-b from-slate-50 to-white dark:from-[#111A2E] dark:to-[#0E1524] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{homework.icon || '📝'}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  مراجعة إجابات العميل
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {client.fullName || client.name} ({client.clientCode || 'عميل'})
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                {homework.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Submission Meta */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar className="w-4 h-4 text-[#4E7E76]" />
              <span>تاريخ الإسناد: {homework.assignedAt ? new Date(homework.assignedAt).toLocaleDateString('ar-EG') : 'غير محدد'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>تاريخ تسليم العميل: {homework.submittedAt ? new Date(homework.submittedAt).toLocaleDateString('ar-EG') : 'قيد الانتظار'}</span>
            </div>
          </div>

          {/* Client Answers Display */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <UserCheck className="w-4 h-4 text-[#4E7E76]" />
              <span>إجابات وتطبيقات العميل التفصيلية:</span>
            </h3>

            {Object.keys(answers).length === 0 ? (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-300 text-xs">
                لم يقم العميل بتعبئة الإجابات بعد، أو أن التمرين لا يزال قيد الإنجاز.
              </div>
            ) : (
              fields.map((field) => {
                const answer = answers[field.id];
                return (
                  <div key={field.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                      {field.labelAr}
                    </span>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-wrap">
                      {answer || <span className="text-slate-400 italic">لا توجد إجابة</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Counselor Clinical Feedback Form */}
          <form onSubmit={handleReviewSubmit} id="review-form" className="pt-2 space-y-3 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#4E7E76]" />
              <span>تغذية راجعة وتوجيه سريري للعميل (ستظهر في ملفه الشخصي):</span>
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="اكتب ملاحظاتك الإرشادية، تشجيع العميل، وتوجيهه نحو الخطوة العملية القادمة..."
              className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#0E1524] border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs leading-relaxed text-right focus:outline-hidden focus:border-[#4E7E76] transition"
            />
          </form>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 text-xs">
              {successMsg}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#111A2E] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            إغلاق
          </button>

          <button
            type="submit"
            form="review-form"
            disabled={submitting}
            className="px-5 py-2.5 rounded-full bg-[#4E7E76] hover:bg-[#3D645E] text-white text-xs font-extrabold transition shadow-md shadow-[#4E7E76]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <span className="inline-block animate-pulse">جاري اعتماد التمرين...</span>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>اعتماد التمرين وإرسال التوجيه للعميل</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
