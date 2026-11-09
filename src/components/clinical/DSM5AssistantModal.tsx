'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  X,
  ChevronLeft,
  ChevronDown,
  Layers,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Filter,
  Brain
} from 'lucide-react';
import { DSM5_DISORDERS, DSM5_CATEGORIES_METADATA } from '@/lib/dsm5/knowledgeBase';
import { DSM5Disorder, DSM5CategoryCode } from '@/lib/dsm5/types';
import {
  searchDSM5,
  evaluateCriteriaFulfillment,
  generateClinicalSOAPAssessmentSnippet
} from '@/lib/dsm5/matcher';

interface DSM5AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDiagnosis?: (diagnosisText: string, disorder: DSM5Disorder) => void;
}

export default function DSM5AssistantModal({
  isOpen,
  onClose,
  onApplyDiagnosis
}: DSM5AssistantModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DSM5CategoryCode | 'all'>('all');
  const [selectedDisorder, setSelectedDisorder] = useState<DSM5Disorder | null>(
    DSM5_DISORDERS[0] || null
  );
  const [checkedCriteria, setCheckedCriteria] = useState<string[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState('متوسط');
  const [counselorNote, setCounselorNote] = useState('');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Filter & Search results
  const searchResults = useMemo(() => {
    return searchDSM5(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  // When selecting a new disorder, reset checked criteria to empty or initial
  const handleSelectDisorder = (disorder: DSM5Disorder) => {
    setSelectedDisorder(disorder);
    setCheckedCriteria([]);
    setCounselorNote('');
  };

  const toggleCriterion = (letter: string) => {
    if (checkedCriteria.includes(letter)) {
      setCheckedCriteria(checkedCriteria.filter((l) => l !== letter));
    } else {
      setCheckedCriteria([...checkedCriteria, letter]);
    }
  };

  // Evaluation calculation
  const evaluation = useMemo(() => {
    if (!selectedDisorder) return null;
    return evaluateCriteriaFulfillment(selectedDisorder, checkedCriteria);
  }, [selectedDisorder, checkedCriteria]);

  // Handle Copy / Apply
  const fullSOAPSnippet = useMemo(() => {
    if (!selectedDisorder) return '';
    return generateClinicalSOAPAssessmentSnippet(
      selectedDisorder,
      selectedSeverity,
      checkedCriteria,
      counselorNote
    );
  }, [selectedDisorder, selectedSeverity, checkedCriteria, counselorNote]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullSOAPSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  const handleApply = () => {
    if (selectedDisorder && onApplyDiagnosis) {
      onApplyDiagnosis(fullSOAPSnippet, selectedDisorder);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#0E1524] w-full max-w-6xl h-[90vh] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden text-right">
        
        {/* Top Clinical Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center text-lg border border-teal-500/30">
              <Brain className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  المساعد التشخيصي الذكي (DSM-5 Engine)
                </h2>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30 font-bold">
                  المرجع العربي المعتمد
                </span>
              </div>
              <p className="text-xs text-slate-400">
                مبني على قاعدة بيانات الدليل التشخيصي والإحصائي الخامس للاضطرابات العقلية والرموز الدولية ICD-10
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالعَرَض، الشكوى، كود ICD-10، أو اسم الاضطراب (مثل: قلق، أرق، خفقان، صدمة، F41.1)..."
              className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500 transition"
              dir="rtl"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                مسح
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
            >
              <option value="all">كافة الفئات الإكلينيكية ({DSM5_DISORDERS.length})</option>
              {Object.entries(DSM5_CATEGORIES_METADATA).map(([catKey, val]) => (
                <option key={catKey} value={catKey}>
                  {val.icon} {val.titleAr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Split Body: Left List + Right Detail & Criteria Matcher */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Right Column: Search Results & Disorders List */}
          <div className="w-full md:w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1524] overflow-y-auto p-3 space-y-2 shrink-0">
            <div className="text-[11px] font-bold text-slate-400 px-2 py-1">
              النتائج المطابقة ({searchResults.length})
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-12 px-4 text-slate-400 space-y-2">
                <AlertTriangle className="w-8 h-8 mx-auto text-amber-500 opacity-60" />
                <p className="text-xs">لم نجد اضطراباً يطابق هذا البحث بالضبط.</p>
                <p className="text-[11px] text-slate-500">جرب كتابة أعراض عامة مثل "قلق" أو "حزن" أو "علاقات".</p>
              </div>
            ) : (
              searchResults.map(({ disorder, matchScore, matchedKeywords }) => {
                const isSelected = selectedDisorder?.id === disorder.id;
                return (
                  <button
                    key={disorder.id}
                    onClick={() => handleSelectDisorder(disorder)}
                    className={`w-full text-right p-3 rounded-2xl transition border text-xs cursor-pointer block ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500/60 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold text-teal-700 dark:text-teal-400 bg-teal-100/70 dark:bg-teal-900/40 px-1.5 py-0.5 rounded-md">
                        {disorder.icd10}
                      </span>
                      {matchScore < 100 && searchQuery && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                          تطابق {matchScore}%
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white leading-snug">
                      {disorder.titleAr}
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5" dir="ltr">
                      {disorder.titleEn}
                    </div>

                    {matchedKeywords.length > 0 && searchQuery && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {matchedKeywords.slice(0, 3).map((kw, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded-sm"
                          >
                            ✓ {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Left Large Column: Selected Disorder Deep Diagnostic Workup */}
          {selectedDisorder ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-[#0A0F1A]">
              
              {/* Header Box */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold">
                      {selectedDisorder.categoryAr}
                    </span>
                    <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      ICD-10: {selectedDisorder.icd10}
                    </span>
                  </div>

                  {/* Evaluation Progress Pill */}
                  {evaluation && (
                    <div className="flex items-center gap-2 text-xs font-bold bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500">تحقق المعايير:</span>
                      <strong className={evaluation.isFullyMet ? 'text-teal-600 dark:text-teal-400' : 'text-amber-600'}>
                        {evaluation.fulfilledCount} / {evaluation.totalRequired} ({evaluation.percentage}%)
                      </strong>
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {selectedDisorder.titleAr}
                  </h1>
                  <p className="text-xs text-slate-500 font-sans mt-0.5" dir="ltr">
                    {selectedDisorder.titleEn}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {selectedDisorder.summaryAr}
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-teal-600 dark:text-teal-400">شرط المدة الزمنية:</span>
                  <span>{selectedDisorder.durationRequirement}</span>
                </div>
              </div>

              {/* Diagnostic Criteria Checklist (Interactive) */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      قائمة المعايير التشخيصية الصريحة (Criteria A - Z)
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    ضع علامة على كل معيار يتأكد انطباقه على العميل
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedDisorder.criteria.map((crit) => {
                    const isChecked = checkedCriteria.includes(crit.letter);
                    return (
                      <div
                        key={crit.letter}
                        onClick={() => toggleCriterion(crit.letter)}
                        className={`p-4 rounded-2xl border transition cursor-pointer text-xs ${
                          isChecked
                            ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-500/70 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-900/30 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition ${
                              isChecked
                                ? 'bg-teal-600 text-white'
                                : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-transparent'
                            }`}
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                          </button>

                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-teal-800 dark:text-teal-300 font-mono">
                                المعيار ({crit.letter})
                              </span>
                              {crit.minRequired && (
                                <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                                  يتطلب {crit.minRequired} أعراض على الأقل
                                </span>
                              )}
                            </div>
                            <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                              {crit.text}
                            </p>

                            {crit.subCriteria && crit.subCriteria.length > 0 && (
                              <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 space-y-1.5 pr-2">
                                {crit.subCriteria.map((sub, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300 leading-normal"
                                  >
                                    <span className="text-teal-500 font-bold">•</span>
                                    <span>{sub}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Differential Diagnosis (Rule Outs) */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    التشخيص الفارق واستبعاد الاضطرابات المشابهة (Rule Out)
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  إرشادات الدليل الخامس للتفريق السريري وتجنب الخلط مع اضطرابات أخرى:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {selectedDisorder.differentials.map((diff, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-1"
                    >
                      <strong className="text-amber-900 dark:text-amber-200 block">
                        استبعاد: {diff.disorderNameAr}
                      </strong>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                        {diff.distinctionRule}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Evidence-Based Interventions */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0E1524] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    فنيات التدخل العلاجي المثبتة والموصى بها في الخطة
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {selectedDisorder.recommendedInterventions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/40 text-xs space-y-2"
                    >
                      <span className="font-black text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/60 px-2 py-0.5 rounded-md text-[10px]">
                        نموذج التدخل: {item.modality}
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300 pr-1">
                        {item.techniques.map((tech, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-1.5">
                            <span className="text-teal-500 font-bold">✓</span>
                            <span>{tech}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Assessment Builder & Export to SOAP */}
              <div className="p-5 rounded-3xl bg-linear-to-b from-teal-950 to-slate-900 text-white border border-teal-800/60 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-teal-400" />
                    <h3 className="text-sm font-black text-white">
                      صياغة التقييم الإكلينيكي لسجل الجلسة (SOAP Assessment)
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">الشدة:</span>
                    <select
                      value={selectedSeverity}
                      onChange={(e) => setSelectedSeverity(e.target.value)}
                      className="bg-slate-800 text-white border border-slate-700 text-xs rounded-xl px-2.5 py-1 cursor-pointer"
                    >
                      <option value="خفيف (Mild)">خفيف (Mild)</option>
                      <option value="متوسط (Moderate)">متوسط (Moderate)</option>
                      <option value="شديد (Severe)">شديد (Severe)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-300 block font-bold">
                    ملاحظة سريرية إضافية خاصة بالمعالج (اختياري):
                  </label>
                  <textarea
                    rows={2}
                    value={counselorNote}
                    onChange={(e) => setCounselorNote(e.target.value)}
                    placeholder="مثال: لوحظ تحسن ملحوظ في التعبير، مع بقاء نوبات القلق في أوقات العمل فقط..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-hidden"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 font-mono text-[11px] text-teal-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {fullSOAPSnippet}
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
                  >
                    {copiedSnippet ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>تم النسخ للحافظة ✓</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ التقييم الإكلينيكي</span>
                      </>
                    )}
                  </button>

                  {onApplyDiagnosis && (
                    <button
                      type="button"
                      onClick={handleApply}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black transition cursor-pointer shadow-md shadow-teal-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>إدراج في سجل الجلسة الحالي</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-slate-400">
              اختر اضطراباً من القائمة لمراجعة معاييره وفنياته
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
