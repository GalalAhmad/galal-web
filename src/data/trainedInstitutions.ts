export interface TrainedInstitutionItem {
  id: string;
  name: string;
  type: string; // e.g. "مدرسة", "مؤسسة مجتمعية", "جامعة", "مركز تدريب"
  city?: string;
  logo?: string;
}

/**
 * قائمة المؤسسات والجهات التعليمية التي تم تدريب كوادرها.
 * إذا كانت المصفوفة فارغة، فسيتم إخفاء القسم تلقائياً من الموقع.
 * يمكن للمشرف تعبئة البيانات واستبدال المؤشرات المؤقتة {{INSTITUTION_...}}.
 */
export const trainedInstitutions: TrainedInstitutionItem[] = [
  // مصفوفة فارغة افتراضياً للإخفاء التلقائي حتى توفر البيانات:
  // {
  //   id: 'inst-1',
  //   name: '{{INSTITUTION_NAME_1}}',
  //   type: '{{INSTITUTION_TYPE_1}}',
  //   city: '{{INSTITUTION_CITY_1}}',
  // }
];
