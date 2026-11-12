// ==========================================================
// البيانات الإكلينيكية الأولية ونماذج الحالات لمساحة عمل المعالج
// Initial Clinical Mock & Seed Data
// المنصة الرسمية للدكتور جلال أحمد
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
  homework?: any[];
}

export const INITIAL_CLINICAL_CLIENTS: ClinicalClient[] = [
  {
    id: 'client-test-01',
    clientCode: 'CL-101',
    fullName: 'عميل تجريبي',
    phone: '01000000000',
    email: 'client@test.com',
    gender: 'male',
    age: 32,
    maritalStatus: 'متزوج',
    occupation: 'مهندس برمجيات',
    city: 'القاهرة',
    riskLevel: 'moderate',
    chiefComplaint: 'قلق وتوتر عملي، رغبة في تحسين مهارات إدارة الضغوط وتوازن الحياة الشخصية.',
    primaryDiagnosis: 'اضطراب التكيف مع أعراض قلقية (F43.22)',
    icdCode: 'F43.22 / Z63.0',
    intakeDate: '2026-11-09',
    sessionsCount: 1,
    lastSessionDate: '2026-11-09',
    nextSessionDate: '2026-11-12 17:30',
    mentalStatusSummary: 'هندام مرتب، اتصال بصري ممتاز، استبصار متقدم وتفاعل إيجابي مع التكليفات الإرشادية.',
    homework: [
      {
        id: 'hw-sample-1',
        exerciseSlug: 'cbt-thought-record',
        title: 'سجل رصد وتفنيد الأفكار التلقائية (7 أعمدة)',
        category: 'CBT',
        categoryLabel: 'علاج معرفي سلوكي',
        description: 'تفكيك التشوهات المعرفية واستبدالها بأفكار واقعية متزنة.',
        estimatedMinutes: 15,
        icon: '📝',
        status: 'assigned',
        completed: false,
        assignedAt: '2026-11-09T18:00:00Z',
        submittedAt: null,
        clientAnswers: null,
        counselorFeedback: '',
        counselorReviewedAt: null,
      },
    ],
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
    clientId: 'client-test-01',
    clientName: 'عميل تجريبي',
    clientCode: 'CL-101',
    sessionNumber: 1,
    sessionType: 'individual',
    date: '2026-11-12',
    time: '17:30',
    meetLink: 'https://meet.google.com/galal-test-session',
    status: 'scheduled',
    duration: 50,
    initialDiagnosis: 'اضطراب التكيف مع أعراض قلقية (F43.22)'
  }
];
