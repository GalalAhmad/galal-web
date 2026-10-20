export interface Testimonial {
  id: string;
  name: string;
  initial: string;
  avatarBg: string; // Tailwind gradient classes for avatar background
  avatarText: string;
  sessionType: string;
  serviceCategory: 'psychological' | 'marital' | 'parenting' | 'course' | 'emergency';
  rating: number; // 1-5
  feedback: string;
  location: string;
  date: string;
  verified: boolean;
}

export const testimonialsData: Testimonial[] = [
  {
    id: 't1',
    name: 'م. خالد ع.',
    initial: 'خ',
    avatarBg: 'from-[#4E7E76] to-[#2E554F]',
    avatarText: 'text-white',
    sessionType: 'استشارة نفسية فردية',
    serviceCategory: 'psychological',
    rating: 5,
    feedback: 'كنت أعيش تحت وطأة ضغوط العمل وتشتت المشاعر. الجلسة مع أ. جلال منحتني فهماً عميقاً لجذور القلق بدلاً من محاولة مقاومته بالقوة. الأدوات السلوكية التي خرجت بها واقعية جداً وبدأت تطبيقها من الأسبوع الأول.',
    location: 'الرياض • المملكة العربية السعودية',
    date: 'منذ شهر',
    verified: true,
  },
  {
    id: 't2',
    name: 'سارة وخالد (زوجان)',
    initial: 'س',
    avatarBg: 'from-[#154F9C] to-[#0D356A]',
    avatarText: 'text-white',
    sessionType: 'استشارة زوجية وأسرية',
    serviceCategory: 'marital',
    rating: 5,
    feedback: 'كنا نمر بأزمة صمت وانسداد في الحوار امتدت لأشهر، وكان أي نقاش ينتهي بدفاعية أو لوم متبادل. أ. جلال ساعدنا بأسلوبه الهادئ على فهم الاحتياج غير المنطوق خلف الغضب وإعادة بناء جسور الأمان بيننا.',
    location: 'عمان • الأردن',
    date: 'منذ شهرين',
    verified: true,
  },
  {
    id: 't3',
    name: 'أم ياسين (ولية أمر)',
    initial: 'ي',
    avatarBg: 'from-[#D97706] to-[#92400E]',
    avatarText: 'text-white',
    sessionType: 'إرشاد تربوي وسلوك مراهقين',
    serviceCategory: 'parenting',
    rating: 5,
    feedback: 'قاعدة «السلوك رسالة قبل أن يكون مشكلة» غيّرت طريقتي تماماً في التعامل مع عناد ابني في سن 15 عاماً. حين توقفت عن المحاسبة وبدأت بالإصغاء الحقيقي بالرفق والحزم، عاد للحديث معي بثقة وتلاشت نوبات العناد.',
    location: 'دبي • الإمارات العربية المتحدة',
    date: 'منذ 3 أسابيع',
    verified: true,
  },
  {
    id: 't4',
    name: 'أ. فاطمة م.',
    initial: 'ف',
    avatarBg: 'from-[#7C3AED] to-[#5B21B6]',
    avatarText: 'text-white',
    sessionType: 'استشارة فردية وبصيرة الفطرة',
    serviceCategory: 'psychological',
    rating: 5,
    feedback: 'الجمع النادر بين التأصيل القيمي القرآني وبصيرة الفطرة وعلم النفس الحديث يمنحك راحة وثقة فريدة. خرجت من الجلسة برؤية بالغة الوضوح لاتخاذ قرارات مصيرية في حياتي المهنية والأسرية.',
    location: 'القاهرة • جمهورية مصر العربية',
    date: 'منذ شهر',
    verified: true,
  },
  {
    id: 't5',
    name: 'أحمد ونور (مقبلان على الزواج)',
    initial: 'أ',
    avatarBg: 'from-[#0D9488] to-[#115E59]',
    avatarText: 'text-white',
    sessionType: 'برنامج ميثاق (تأهيل زواجي)',
    serviceCategory: 'course',
    rating: 5,
    feedback: 'أفضل استثمار قمنا به قبل الزواج دون مبالغة. البرنامج فكك التوقعات الوردية غير الواقعية ودربنا عملياً على إدارة الخلافات والماليات وحدود الأهل باحترام ومودة ووعي حقيقي.',
    location: 'الكويت',
    date: 'منذ أسبوعين',
    verified: true,
  },
  {
    id: 't6',
    name: 'ريهام ح.',
    initial: 'ر',
    avatarBg: 'from-[#CC4E46] to-[#99261E]',
    avatarText: 'text-white',
    sessionType: 'حجز طارئ واستجابة عاجلة',
    serviceCategory: 'emergency',
    rating: 5,
    feedback: 'سرعة الاستجابة والتنسيق خلال أقل من 24 ساعة في ظرف عائلي ضاغط كانت سبباً بعد فضل الله في احتواء موقف حرج واتخاذ قرار متزن بهدوء وسرية تامة. ممتنة جداً لهذا المسار العاجل.',
    location: 'الدوحة • قطر',
    date: 'منذ شهر',
    verified: true,
  },
];
