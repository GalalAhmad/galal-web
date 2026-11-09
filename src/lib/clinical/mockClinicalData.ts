// ==========================================================
// البيانات الإكلينيكية الأولية ونماذج الحالات لمساحة عمل المعالج
// Initial Clinical Mock & Seed Data
// المنصة الرسمية للمستشار جلال أحمد
// ==========================================================

export interface ClinicalClient {
  id: string;
  clientCode: string;
  fullName: string;
  phone: string;
  email: string;
  gender: 'male' | 'female';
  age: number;
  maritalStatus: string;
  occupation: string;
  city: string;
  riskLevel: 'low' | 'moderate' | 'high';
  chiefComplaint: string;
  primaryDiagnosis: string;
  icdCode: string;
  intakeDate: string;
  sessionsCount: number;
  lastSessionDate: string;
  nextSessionDate?: string;
  mentalStatusSummary: string;
}

export const INITIAL_CLINICAL_CLIENTS: ClinicalClient[] = [
  {
    id: 'cl-101',
    clientCode: 'CL-101',
    fullName: 'أحمد محمود عبد الرحمن',
    phone: '01098765432',
    email: 'ahmed.m@example.com',
    gender: 'male',
    age: 32,
    maritalStatus: 'متزوج',
    occupation: 'مهندس برمجيات',
    city: 'القاهرة',
    riskLevel: 'moderate',
    chiefComplaint: 'قلق مزمن، خفقان مفاجئ أثناء الاجتماعات، وتوتر مستمر في التواصل مع الزوجة.',
    primaryDiagnosis: 'اضطراب القلق المتعمم (GAD) مع صعوبات تواصل زوجية',
    icdCode: 'F41.1 / Z63.0',
    intakeDate: '2026-10-15',
    sessionsCount: 3,
    lastSessionDate: '2026-11-02',
    nextSessionDate: '2026-11-10 16:00',
    mentalStatusSummary: 'هندام مرتب، اتصال بصري متقطع عند التحدث عن الخلافات، استبصار ممتاز بالمشكلة.'
  },
  {
    id: 'cl-102',
    clientCode: 'CL-102',
    fullName: 'فاطمة مصطفى إبراهيم',
    phone: '01012345678',
    email: 'fatma.m@example.com',
    gender: 'female',
    age: 28,
    maritalStatus: 'متزوجة حديثاً',
    occupation: 'معلمة لغة عربية',
    city: 'الإسكندرية',
    riskLevel: 'low',
    chiefComplaint: 'صعوبة التأقلم مع بيت الزوجية، فجوة في التوقعات، وبداية مشاعر فتور وجفاء عاطفي.',
    primaryDiagnosis: 'مشكلات العلاقة مع الشريك (Z63.0) مع استجابة تكيفية قلقية',
    icdCode: 'Z63.0',
    intakeDate: '2026-10-22',
    sessionsCount: 2,
    lastSessionDate: '2026-11-04',
    nextSessionDate: '2026-11-11 17:30',
    mentalStatusSummary: 'متعاونة جداً، نبرة حديث هادئة تميل للحزن الخفيف، متقبلة للواجبات الإرشادية.'
  },
  {
    id: 'cl-103',
    clientCode: 'CL-103',
    fullName: 'ياسر خالد الشريف',
    phone: '01123456789',
    email: 'yasser.k@example.com',
    gender: 'male',
    age: 41,
    maritalStatus: 'متزوج ولديه 3 أبناء',
    occupation: 'مدير مالي',
    city: 'الجيزة',
    riskLevel: 'low',
    chiefComplaint: 'احتراق وظيفي، أرق متقطع، وعصبية مفرطة مع الأبناء في المنزل.',
    primaryDiagnosis: 'اضطراب الأرق المزمن (Insomnia) مترافق مع إجهاد مهني وضغوط تربوية',
    icdCode: 'F51.01 / Z56.9',
    intakeDate: '2026-10-28',
    sessionsCount: 1,
    lastSessionDate: '2026-10-28',
    nextSessionDate: '2026-11-12 19:00',
    mentalStatusSummary: 'علامات الإرهاق واضحة، تفكير عملي منظم، رغبة عالية في تعلم مهارات إدارة الضيق.'
  }
];

export const INITIAL_CLINICAL_SESSIONS = [
  {
    id: 'ses-201',
    clientId: 'cl-101',
    clientName: 'أحمد محمود عبد الرحمن',
    clientCode: 'CL-101',
    sessionNumber: 4,
    sessionType: 'individual',
    date: '2026-11-10',
    time: '16:00',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    status: 'scheduled',
    duration: 50,
    initialDiagnosis: 'اضطراب القلق المتعمم (F41.1)'
  },
  {
    id: 'ses-202',
    clientId: 'cl-102',
    clientName: 'فاطمة مصطفى إبراهيم',
    clientCode: 'CL-102',
    sessionNumber: 3,
    sessionType: 'marital',
    date: '2026-11-11',
    time: '17:30',
    meetLink: 'https://meet.google.com/klm-nopq-rst',
    status: 'scheduled',
    duration: 50,
    initialDiagnosis: 'مشكلات العلاقة مع الشريك (Z63.0)'
  }
];
