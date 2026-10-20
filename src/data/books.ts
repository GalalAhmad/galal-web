export interface BookItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  coverImage?: string;
  year?: string;
  publisher?: string;
  purchaseUrl?: string;
}

/**
 * قائمة مؤلفات ومطبوعات جلال أحمد.
 * إذا كانت المصفوفة فارغة، فسيتم إخفاء القسم تلقائياً من الموقع.
 * يمكن للمشرف تعبئة البيانات واستبدال المؤشرات المؤقتة {{BOOK_...}}.
 */
export const books: BookItem[] = [
  // مصفوفة فارغة افتراضياً للإخفاء التلقائي حتى توفر البيانات:
  // {
  //   id: 'book-1',
  //   title: '{{BOOK_TITLE_1}}',
  //   subtitle: '{{BOOK_SUBTITLE_1}}',
  //   description: '{{BOOK_DESCRIPTION_1}}',
  //   year: '{{BOOK_YEAR_1}}',
  //   publisher: '{{BOOK_PUBLISHER_1}}',
  // }
];
