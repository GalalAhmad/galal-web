// ==========================================================
// تعريفات واجهات الدليل التشخيصي والإحصائي الخامس (DSM-5 Engine Types)
// مستند إلى المرجع الأكاديمي المعتمد:
// "الدليل التشخيصي والإحصائي الخامس للاضطرابات العقلية DSM-5"
// ==========================================================

export type DSM5CategoryCode =
  | 'anxiety'
  | 'depressive'
  | 'trauma_stress'
  | 'obsessive_compulsive'
  | 'bipolar'
  | 'somatic_symptom'
  | 'feeding_eating'
  | 'sleep_wake'
  | 'personality'
  | 'neurodevelopmental'
  | 'relational_problems'
  | 'psychotic';

export interface DSM5Criterion {
  letter: string; // 'A', 'B', 'C', 'D', 'E', 'F'
  text: string;
  subCriteria?: string[];
  minRequired?: number; // مثلاً: يتطلب وجود 3 أعراض على الأقل
}

export interface DSM5Specifier {
  id: string;
  nameAr: string;
  nameEn: string;
  description: string;
}

export interface DSM5Differential {
  disorderNameAr: string;
  icdCode?: string;
  distinctionRule: string; // كيف تفرق بينهما إكلينيكياً؟
}

export interface DSM5Disorder {
  id: string;
  category: DSM5CategoryCode;
  categoryAr: string;
  icd10: string; // مثال: F41.1
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  essentialFeatures: string[];
  durationRequirement: string; // مثال: 6 أشهر على الأقل
  criteria: DSM5Criterion[];
  specifiers?: DSM5Specifier[];
  differentials: DSM5Differential[];
  recommendedInterventions: {
    modality: 'CBT' | 'ACT' | 'DBT' | 'Fitra' | 'Family';
    techniques: string[];
  }[];
  keywords: string[]; // الكلمات الدلالية للبحث الذكي بالأعراض
}

export interface DiagnosisMatchResult {
  disorder: DSM5Disorder;
  matchScore: number; // 0 - 100%
  matchedKeywords: string[];
  suggestedAction: string;
}
