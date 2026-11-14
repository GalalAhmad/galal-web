'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  ShieldCheck, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Brain, 
  Activity, 
  HelpCircle, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles
} from 'lucide-react';
import { DSM5_DISORDERS } from '@/lib/dsm5/knowledgeBase';
import { ScientificTestMeta } from '@/data/scientificTestsMetadata';

interface Props {
  disorderId?: string;
  testTitle: string;
  testCode?: string;
  meta?: ScientificTestMeta;
  defaultOpen?: boolean;
}

export default function DSM5CriteriaCard({
  disorderId,
  testTitle,
  testCode,
  meta,
  defaultOpen = true,
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [activeTab, setActiveTab] = useState<'criteria' | 'differentials' | 'interventions'>('criteria');

  // Look up DSM-5 disorder definition
  const disorder = disorderId 
    ? DSM5_DISORDERS.find((d) => d.id === disorderId)
    : null;

  if (!disorder && !meta?.isStandardizedDsm5) {
    // If not a DSM-5 clinical disorder, show psychometric standardization badge
    if (meta?.clinicalEvidenceLevel) {
      return (
        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-right space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5 text-[#4E7E76] dark:text-[#5E988E]">
              <ShieldCheck className="w-4 h-4" />
              <span>مقياس سيكومتري مقنن علمياً</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-mono">
              {meta.code}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {meta.clinicalPurpose}
          </p>
          <div className="text-[11px] text-slate-500 font-medium">
            المؤسسة المرجعية: {meta.institution} • تطوير: {meta.author}
          </div>
        </div>
      );
    }
    return null;
  }

  const durationText = disorder?.durationRequirement || meta?.durationRequirement;
  const icdCode = disorder?.icd10 || meta?.icd10Code;
  const categoryAr = disorder?.categoryAr || meta?.dsmCategoryAr;
  const evidenceLevel = meta?.clinicalEvidenceLevel || 'معيار ذهبي مقنن دولياً (Gold Standard)';

  return (
    <div className="rounded-3xl bg-gradient-to-br from-white via-teal-50/20 to-emerald-50/20 dark:from-[#0E1524] dark:via-[#0E1B26] dark:to-[#0A1720] border-2 border-[#4E7E76]/30 dark:border-[#5E988E]/30 shadow-md overflow-hidden text-right transition-all">
      
      {/* Top Banner & Header Toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 sm:p-6 cursor-pointer select-none flex items-start justify-between gap-4 border-b border-teal-100/60 dark:border-teal-950/60 hover:bg-teal-500/5 transition-colors"
      >
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black bg-[#4E7E76] text-white flex items-center gap-1.5 shadow-xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>معايير الدليل التشخيصي DSM-5</span>
            </span>

            {icdCode && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-black bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                ICD-10: {icdCode}
              </span>
            )}

            {categoryAr && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {categoryAr}
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
            {disorder?.titleAr || testTitle}
            {disorder?.titleEn && (
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 block sm:inline sm:mr-2">
                ({disorder.titleEn})
              </span>
            )}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {disorder?.summaryAr || meta?.diagnosticCriteriaSummary || meta?.clinicalPurpose}
          </p>
        </div>

        <button 
          type="button"
          aria-label="Toggle criteria"
          className="w-8 h-8 rounded-full bg-teal-50 dark:bg-slate-800 text-[#4E7E76] dark:text-[#5E988E] flex items-center justify-center shrink-0 mt-1"
        >
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Accordion Expanded Body */}
      {isOpen && (
        <div className="p-5 sm:p-6 space-y-6">

          {/* Clinical Essentials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {durationText && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <span className="font-black text-amber-900 dark:text-amber-200 block">شرط المدة الزمنية الإلزامي:</span>
                  <span className="text-amber-800 dark:text-amber-300">{durationText}</span>
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-teal-500/10 dark:bg-teal-950/20 border border-teal-500/20 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs">
                <span className="font-black text-teal-900 dark:text-teal-200 block">مستوى التوثيق الإكلينيكي:</span>
                <span className="text-teal-800 dark:text-teal-300">{evidenceLevel}</span>
              </div>
            </div>
          </div>

          {/* Sub-Tabs Navigation */}
          {disorder && (
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('criteria')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'criteria'
                    ? 'bg-[#4E7E76] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>المعايير التشخيصية (A-F)</span>
              </button>

              {disorder.differentials && disorder.differentials.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('differentials')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'differentials'
                      ? 'bg-[#4E7E76] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>التشخيص الفارقي</span>
                </button>
              )}

              {disorder.recommendedInterventions && disorder.recommendedInterventions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('interventions')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'interventions'
                      ? 'bg-[#4E7E76] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>البروتوكولات العلاجية</span>
                </button>
              )}
            </div>
          )}

          {/* Tab 1: Criteria A, B, C... */}
          {activeTab === 'criteria' && (
            <div className="space-y-4">
              {disorder?.criteria ? (
                disorder.criteria.map((crit, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-right space-y-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#4E7E76]/10 text-[#4E7E76] dark:text-[#5E988E] font-black text-xs flex items-center justify-center shrink-0">
                        {crit.letter}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 leading-snug">
                        {crit.text}
                      </h4>
                    </div>

                    {crit.minRequired && (
                      <span className="inline-block px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                        يشترط تحقق {crit.minRequired} أعراض على الأقل
                      </span>
                    )}

                    {crit.subCriteria && crit.subCriteria.length > 0 && (
                      <ul className="space-y-1.5 pt-1 pr-4">
                        {crit.subCriteria.map((sub, sIdx) => (
                          <li key={sIdx} className="text-xs text-slate-600 dark:text-slate-300 list-disc leading-relaxed">
                            {sub}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {meta?.diagnosticCriteriaSummary}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Differential Diagnosis */}
          {activeTab === 'differentials' && disorder?.differentials && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                قواعد التمييز الإكلينيكي لاستبعاد الحالات المشابهة طبقاً للدليل التشخيصي:
              </p>
              {disorder.differentials.map((diff, dIdx) => (
                <div 
                  key={dIdx}
                  className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1 text-right"
                >
                  <strong className="block text-xs font-black text-teal-800 dark:text-teal-300">
                    مقارنة مع: {diff.disorderNameAr} {diff.icdCode && `(${diff.icdCode})`}
                  </strong>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {diff.distinctionRule}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Evidence-based Interventions */}
          {activeTab === 'interventions' && disorder?.recommendedInterventions && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                المدارس والبروتوكولات العلاجية المعتمدة إكلينيكياً في علاج هذا الاضطراب:
              </p>
              {disorder.recommendedInterventions.map((interv, iIdx) => (
                <div 
                  key={iIdx}
                  className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-right"
                >
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-black">
                    نموذج {interv.modality}
                  </span>
                  <ul className="space-y-1 pt-1 pr-4">
                    {interv.techniques.map((tech, tIdx) => (
                      <li key={tIdx} className="text-xs text-slate-600 dark:text-slate-300 list-disc leading-relaxed">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Clinical Guidance Notice & Doctor Consultation CTA */}
          <div className="p-4 rounded-2xl bg-[#4E7E76]/10 dark:bg-[#4E7E76]/15 border border-[#4E7E76]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-right flex-1">
              <div className="flex items-center gap-1.5 font-black text-xs text-[#4E7E76] dark:text-[#5E988E]">
                <Sparkles className="w-4 h-4" />
                <span>التقييم الإكلينيكي المباشر مع د. جلال أحمد</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                المقاييس الذاتية هي أدوات فحص استرشادية لرفع الوعي؛ التشخيص الدقيق وبناء الخطة العلاجية الشخصية يتطلبان مقابلة إكلينيكية متخصصة.
              </p>
            </div>

            <Link
              href={`/booking?track=clinical&reason=${encodeURIComponent(disorder?.titleAr || testTitle)}`}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#4E7E76] hover:bg-[#3D645E] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>حجز استشارة تقييم مع د. جلال</span>
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}
