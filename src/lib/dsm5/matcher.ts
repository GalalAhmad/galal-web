import { DSM5_DISORDERS } from './knowledgeBase';
import { DSM5Disorder, DiagnosisMatchResult, DSM5CategoryCode } from './types';

/**
 * محرك البحث والفرز الإكلينيكي الذكي
 * يبحث في العناوين، الرموز الدولية ICD-10، الأعراض، والكلمات المفتاحية
 */
export function searchDSM5(
  query: string,
  categoryFilter?: DSM5CategoryCode | 'all'
): DiagnosisMatchResult[] {
  const cleanQuery = query.trim().toLowerCase();

  return DSM5_DISORDERS
    .filter((d) => {
      if (!categoryFilter || categoryFilter === 'all') return true;
      return d.category === categoryFilter;
    })
    .map((disorder) => {
      if (!cleanQuery) {
        return {
          disorder,
          matchScore: 100,
          matchedKeywords: [],
          suggestedAction: 'استعراض الدليل التشخيصي',
        };
      }

      let score = 0;
      const matched: string[] = [];

      // تطابق العنوان المباشر
      if (disorder.titleAr.toLowerCase().includes(cleanQuery)) {
        score += 50;
        matched.push('العنوان العربي');
      }
      if (disorder.titleEn.toLowerCase().includes(cleanQuery)) {
        score += 45;
        matched.push('English Title');
      }

      // تطابق الكود الدولي ICD-10
      if (disorder.icd10.toLowerCase().includes(cleanQuery)) {
        score += 60;
        matched.push(`كود ${disorder.icd10}`);
      }

      // تطابق الكلمات الدلالية والأعراض
      disorder.keywords.forEach((kw) => {
        if (kw.toLowerCase().includes(cleanQuery) || cleanQuery.includes(kw.toLowerCase())) {
          score += 25;
          matched.push(kw);
        }
      });

      // البحث في تفاصيل المعايير والميزات
      disorder.criteria.forEach((crit) => {
        if (crit.text.toLowerCase().includes(cleanQuery)) {
          score += 15;
          matched.push(`معيار (${crit.letter})`);
        }
        if (crit.subCriteria) {
          crit.subCriteria.forEach((sub) => {
            if (sub.toLowerCase().includes(cleanQuery)) {
              score += 20;
              matched.push('عرض إكلينيكي');
            }
          });
        }
      });

      // حساب النسبة
      const finalScore = Math.min(Math.round(score), 100);

      let action = 'فحص أولي';
      if (finalScore >= 70) action = 'تطابق إكلينيكي قوي - يوصى بمراجعة معايير التشخيص';
      else if (finalScore >= 35) action = 'تطابق جزئي للأعراض - استبعد الاضطرابات المشابهة';
      else action = 'مؤشرات ضعيفة';

      return {
        disorder,
        matchScore: finalScore,
        matchedKeywords: Array.from(new Set(matched)),
        suggestedAction: action,
      };
    })
    .filter((res) => !cleanQuery || res.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * فحص المعايير التفاعلي لحالة معينة
 * يحسب النسبة المئوية للمستوفى من المعايير التشخيصية
 */
export function evaluateCriteriaFulfillment(
  disorder: DSM5Disorder,
  checkedCriteriaLetters: string[]
): {
  isFullyMet: boolean;
  fulfilledCount: number;
  totalRequired: number;
  percentage: number;
  missingLetters: string[];
} {
  const totalRequired = disorder.criteria.length;
  const fulfilledLetters = disorder.criteria
    .map((c) => c.letter)
    .filter((letter) => checkedCriteriaLetters.includes(letter));

  const missingLetters = disorder.criteria
    .map((c) => c.letter)
    .filter((letter) => !checkedCriteriaLetters.includes(letter));

  const fulfilledCount = fulfilledLetters.length;
  const percentage = Math.round((fulfilledCount / totalRequired) * 100);
  const isFullyMet = fulfilledCount === totalRequired;

  return {
    isFullyMet,
    fulfilledCount,
    totalRequired,
    percentage,
    missingLetters,
  };
}

/**
 * توليد نص التقييم الإكلينيكي الذكي (SOAP Assessment Generator)
 * يساعد المعالج على تضمين الصياغة التشخيصية المعتمدة بنقرة واحدة
 */
export function generateClinicalSOAPAssessmentSnippet(
  disorder: DSM5Disorder,
  severityNameAr: string = 'متوسط',
  checkedLetters: string[] = [],
  clinicalNotes: string = ''
): string {
  const evaluation = evaluateCriteriaFulfillment(disorder, checkedLetters);

  return `
[التشخيص الإكلينيكي المبدئي وفق DSM-5]:
- الاضطراب: ${disorder.titleAr} (${disorder.titleEn})
- الرمز الإحصائي المعتمد: [ICD-10: ${disorder.icd10}]
- درجة الشدة الإكلينيكية: ${severityNameAr}
- استيفاء المعايير: ${evaluation.fulfilledCount} من أصل ${evaluation.totalRequired} معايير (${evaluation.percentage}%)
${evaluation.isFullyMet ? '✓ الحالة تستوفي كافة المعايير التشخيصية الصريحة للدليل الخامس.' : `⚠️ المعايير المتبقية للتحقق الإضافي: ${evaluation.missingLetters.join(', ')}`}

[أهم الفنيات الموصى ببدئها في الخطة]:
${disorder.recommendedInterventions.map((m) => `• مسار (${m.modality}): ${m.techniques.slice(0, 2).join('، ')}`).join('\n')}

[قواعد الاستبعاد والتشخيص الفارق]:
${disorder.differentials.map((diff) => `• استبعاد ${diff.disorderNameAr}: ${diff.distinctionRule}`).join('\n')}
${clinicalNotes ? `\n[ملاحظات المعالج الخاصة أثناء الفحص]:\n${clinicalNotes}` : ''}
`.trim();
}
