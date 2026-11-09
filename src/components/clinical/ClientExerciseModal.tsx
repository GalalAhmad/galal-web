'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Send, Clock, BookOpen, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';

interface ClientExerciseModalProps {
  homework: any;
  onClose: () => void;
  onSubmitSuccess: () => void;
  userPhone?: string;
  userEmail?: string;
}

export default function ClientExerciseModal({
  homework,
  onClose,
  onSubmitSuccess,
  userPhone,
  userEmail,
}: ClientExerciseModalProps) {
  const isAlreadySubmitted = homework.status === 'submitted' || homework.status === 'reviewed';
  const isReviewed = homework.status === 'reviewed';

  // Initialize form state from previously submitted answers or empty strings
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    return homework.clientAnswers || {};
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fields: any[] = Array.isArray(homework.fields) && homework.fields.length > 0
    ? homework.fields
    : [
        {
          id: 'response',
          labelAr: 'إجابة وتطبيق التمرين',
          placeholderAr: 'اكتب تفاصيل تطبيقك للتمرين الإرشادي هنا...',
          type: 'textarea',
        },
      ];

  const handleFieldChange = (fieldId: string, value: any) => {
    if (isAlreadySubmitted && !isReviewed) return; // Read-only if submitted
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/clinical/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          homeworkId: homework.id,
          phone: userPhone,
          email: userEmail,
          clientAnswers: answers,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'تعذر تسليم الواجب، يرجى المحاولة مرة أخرى.');
        setSubmitting(false);
        return;
      }

      setSuccessMsg('تم تسليم إجابات الواجب بنجاح! ستظهر لدى المعالج جلال أحمد لمراجعتها.');
      setTimeout(() => {
        onSubmitSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMsg('حدث خطأ أثناء الاتصال بالخادم.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn text-right overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0E1524] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-linear-to-b from-slate-50 to-white dark:from-[#111A2E] dark:to-[#0E1524] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{homework.icon || '📝'}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {homework.categoryLabel || 'تمرين إرشادي'}
                </span>
                {homework.estimatedMinutes && (
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{homework.estimatedMinutes} دقيقة</span>
                  </span>
                )}
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

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Instructions Banner */}
          {homework.instructions && (
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5 leading-relaxed">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">إرشادات تطبيق التمرين:</strong>
                <span>{homework.instructions}</span>
              </div>
            </div>
          )}

          {/* Counselor Feedback Banner (if reviewed) */}
          {isReviewed && homework.counselorFeedback && (
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border-2 border-teal-500/40 text-xs space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-1.5 font-black text-teal-900 dark:text-teal-200">
                <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>تغذية راجعة وتوجيه من المعالج جلال أحمد:</span>
              </div>
              <p className="text-slate-700 dark:text-slate-200 pr-5">
                {homework.counselorFeedback}
              </p>
            </div>
          )}

          {/* Status Alert if Already Submitted */}
          {isAlreadySubmitted && !isReviewed && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-600" />
              <span>تم تسليم هذا التمرين مسبقاً، وهو الآن بانتظار مراجعة وتوجيهات المعالج جلال أحمد.</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Interactive Dynamic Form Fields */}
          <form onSubmit={handleSubmit} id="exercise-form" className="space-y-4">
            {fields.map((field, idx) => (
              <div key={field.id} className="space-y-1.5 text-right">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {field.labelAr}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={answers[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholderAr}
                    disabled={isAlreadySubmitted && !isReviewed}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs leading-relaxed text-right focus:outline-hidden focus:border-[#4E7E76] transition disabled:opacity-75"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={answers[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    disabled={isAlreadySubmitted && !isReviewed}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs text-right focus:outline-hidden focus:border-[#4E7E76] transition cursor-pointer disabled:opacity-75"
                  >
                    <option value="">-- {field.placeholderAr || 'اختر من القائمة'} --</option>
                    {field.options?.map((opt: string) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={answers[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholderAr}
                    disabled={isAlreadySubmitted && !isReviewed}
                    className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs text-right focus:outline-hidden focus:border-[#4E7E76] transition disabled:opacity-75"
                  />
                )}
              </div>
            ))}
          </form>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#111A2E] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            إغلاق النافذة
          </button>

          {!isAlreadySubmitted ? (
            <button
              type="submit"
              form="exercise-form"
              disabled={submitting}
              className="px-5 py-2.5 rounded-full bg-[#4E7E76] hover:bg-[#3D645E] text-white text-xs font-extrabold transition shadow-md shadow-[#4E7E76]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span className="inline-block animate-pulse">جاري تسليم الإجابات...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>تسليم الواجب للمعالج جلال أحمد</span>
                </>
              )}
            </button>
          ) : (
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isReviewed ? 'تم اعتماد التمرين ومراجعته بنجاح ✓' : 'تم تسليم الإجابة بنجاح ✓'}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
