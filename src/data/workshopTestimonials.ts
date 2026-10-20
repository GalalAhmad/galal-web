export interface WorkshopTestimonial {
  id: string;
  quote: string;
  initials: string;
  role: string;
  country: string;
  programName: string;
  monthYear: string;
}

/**
 * بيانات آراء ومشاركات الورش والبرامج التدريبية
 * تُعرض كبديل لآراء الجلسات الفردية إلى حين اعتماد موافقات النشر الخطية الصريحة.
 * تترك فارغة مع بنية الحقول التوضيحية (Placeholders) لحين تزويد الموقع بها.
 */
export const workshopTestimonialsData: WorkshopTestimonial[] = [
  // نموذج توضيحي لعناصر التقييم - فارغ حالياً حتى تزويد البيانات
  /*
  {
    id: 'w1',
    quote: '{{WORKSHOP_TESTIMONIAL_QUOTE_1}}',
    initials: '{{WORKSHOP_TESTIMONIAL_INITIALS_1}}',
    role: '{{WORKSHOP_TESTIMONIAL_ROLE_1}}',
    country: '{{WORKSHOP_TESTIMONIAL_COUNTRY_1}}',
    programName: '{{WORKSHOP_TESTIMONIAL_PROGRAM_1}}',
    monthYear: '{{WORKSHOP_TESTIMONIAL_DATE_1}}',
  },
  */
];
