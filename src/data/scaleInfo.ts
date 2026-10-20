export interface ScaleInfo {
  officialName: string;
  code: string;
  developer: string;
  measures: string;
  citation: string;
  disclaimer: string;
}

export const scaleCatalog: Record<string, ScaleInfo> = {
  depression: {
    officialName: 'مقياس تقييم الاكتئاب (PHQ-9: Patient Health Questionnaire-9)',
    code: 'PHQ-9',
    developer: 'د. روبرت سبيتزر (Robert L. Spitzer) وفريقه البحثي بجامعة كولومبيا',
    measures: 'فحص مبدئي لتقييم تواتر وشدة الأعراض الاكتئابية وتقلبات المزاج واضطرابات النوم والطاقة خلال الأسبوعين الماضيين.',
    citation: '{{SCALE_CITATION_PHQ9}}',
    disclaimer: 'مقياس مستخدم عالمياً للفحص المبدئي، وليس تشخيصاً طبياً عيادياً مستقلاً.',
  },
  anxiety: {
    officialName: 'مقياس اضطراب القلق العام (GAD-7: Generalized Anxiety Disorder-7)',
    code: 'GAD-7',
    developer: 'د. روبرت سبيتزر (Robert L. Spitzer) وزملاؤه',
    measures: 'فحص مبدئي لمستوى التوتر العصبي وسرعة الاستثارة والمخاوف المقلقة وتأثيرها على النشاط اليومي.',
    citation: '{{SCALE_CITATION_GAD7}}',
    disclaimer: 'مقياس مستخدم عالمياً للفحص المبدئي، ولا يغني عن التقييم الإكلينيكي المباشر.',
  },
  burnout: {
    officialName: 'مقياس ماسلاش للاحتراق النفسي والمهني (MBI: Maslach Burnout Inventory)',
    code: 'MBI',
    developer: 'د. كريستينا ماسلاش (Christina Maslach) ود. سوزان جاكسون',
    measures: 'تقييم مستويات الإنهاك النفسي، وتبلد المشاعر المهني، وتراجع الشعور بالإنجاز والكفاءة في بيئة العمل.',
    citation: '{{SCALE_CITATION_MBI}}',
    disclaimer: 'مقياس استرشادي معتمد للفحص المبدئي في البيئات المؤسسية والمهنية.',
  },
  adhd: {
    officialName: 'مقياس فحص اضطراب فرط الحركة وتشتت الانتباه للبالغين (ASRS-v1.1)',
    code: 'ASRS-v1.1',
    developer: 'منظمة الصحة العالمية (WHO) بالتعاون مع فريق عمل تشتت الانتباه بجامعة هارفارد',
    measures: 'فحص مبدئي لأعراض ضعف التركيز، وتشتت الانتباه، وصعوبة تنظيم المهام والاندفاعية لدى البالغين.',
    citation: '{{SCALE_CITATION_ASRS}}',
    disclaimer: 'أداة فحص استرشادية أولية للمؤشرات السلوكية وليست تقييماً عصبياً نهائياً.',
  },
  'marital-harmony': {
    officialName: 'مقياس التوافق والرضا الزواجي (DAS: Dyadic Adjustment Scale)',
    code: 'DAS',
    developer: 'د. غراهام سبانير (Graham B. Spanier)',
    measures: 'تقييم جودة التواصل، التماسك والتقارب العاطفي، التوافق الفكري، وأسلوب إدارة الخلافات بين الزوجين.',
    citation: '{{SCALE_CITATION_DAS}}',
    disclaimer: 'مقياس استرشادي لفهم مواطن القوة والتحديات التفاعلية في العلاقة الزوجية.',
  },
  'toxic-relationship': {
    officialName: 'مقياس تقييم التوازن والأمان في العلاقات العاطفية',
    code: 'REL-SAFETY',
    developer: 'مستند إلى أدوات ونماذج علم النفس الاجتماعي وتقييم الأمان العاطفي',
    measures: 'فحص مؤشرات التكافؤ والاحترام المتبادل مقابل السيطرة والاستنزاف أو الصمت العقابي.',
    citation: '{{SCALE_CITATION_REL_SAFETY}}',
    disclaimer: 'أداة توعوية لرفع البصيرة بالعلاقات وليست حكماً قانونياً أو تقريراً قضائياً.',
  },
  ptsd: {
    officialName: 'مقياس فحص أعراض ما بعد الصدمة (PCL-5: PTSD Checklist for DSM-5)',
    code: 'PCL-5',
    developer: 'المركز الوطني الأمريكي للاضطراب التالي للصدمة (National Center for PTSD)',
    measures: 'رصد الذكريات الاقتحامية الارتجاعية، وتجنب المثيرات المقلقة، واليقظة المفرطة بعد أحداث مؤلمة.',
    citation: '{{SCALE_CITATION_PCL5}}',
    disclaimer: 'أداة فحص مبدئي استرشادية تتطلب فحصاً عيادياً متخصصاً لتأكيد الأعراض.',
  },
  ocd: {
    officialName: 'مقياس ييل-براون للوسواس القهري (Y-BOCS: Yale-Brown Obsessive Compulsive Scale)',
    code: 'Y-BOCS',
    developer: 'د. واين غودمان (Wayne K. Goodman) وفريقه البحثي',
    measures: 'تقييم شدة الأفكار الوسواسية الإلحاحية والطقوس القهرية ومدى إعاقتها لمجريات اليوم.',
    citation: '{{SCALE_CITATION_YBOCS}}',
    disclaimer: 'مقياس عالمي لتقدير شدة الأعراض وليس بديلاً عن التشخيص العيادي المباشر.',
  },
  bipolar: {
    officialName: 'استبيان اضطراب المزاج ثنائي القطب (MDQ: Mood Disorder Questionnaire)',
    code: 'MDQ',
    developer: 'د. روبرت هيرشفيلد (Robert M. A. Hirschfeld) وفريقه',
    measures: 'فحص فترات الارتفاع غير المعتاد في الطاقة والمزاج والنشاط مقارنة بفترات الهبوط الاكتئابي.',
    citation: '{{SCALE_CITATION_MDQ}}',
    disclaimer: 'مقياس فحص استرشادي يستوجب مراجعة طبيب نفسي مختص في حال الإيجابية.',
  },
  'social-anxiety': {
    officialName: 'مقياس ليبوفيتز للقلق والرهاب الاجتماعي (LSAS: Liebowitz Social Anxiety Scale)',
    code: 'LSAS',
    developer: 'د. مايكل ليبوفيتز (Michael R. Liebowitz)',
    measures: 'قياس درجات القلق والتجنب في المواقف الاجتماعية العامة ومواقف التحدث أو التفاعل.',
    citation: '{{SCALE_CITATION_LSAS}}',
    disclaimer: 'أداة قياس استرشادية لتقييم الرهاب والقلق الاجتماعي.',
  },
  'eating-disorders': {
    officialName: 'اختبار اتجاهات الأكل (EAT-26: Eating Attitudes Test)',
    code: 'EAT-26',
    developer: 'د. ديفيد غارنر (David M. Garner) وزملاؤه',
    measures: 'فحص المخاوف المرتبطة بالوزن وصورة الجسد والسلوكيات الغذائية التقييدية أو الاندفاعية.',
    citation: '{{SCALE_CITATION_EAT26}}',
    disclaimer: 'مقياس فحص مبدئي لمؤشرات اضطراب الأكل.',
  },
  schizophrenia: {
    officialName: 'مقياس التقييم النفسي الموجز (BPRS: Brief Psychiatric Rating Scale)',
    code: 'BPRS',
    developer: 'د. جون أوفيرول (John E. Overall) ود. دونالد غورام',
    measures: 'فحص المؤشرات الإدراكية والتفكير وتغيرات الوعي بالواقع.',
    citation: '{{SCALE_CITATION_BPRS}}',
    disclaimer: 'أداة فحص استرشادية أولية، ويجب استشارة طبيب نفسي فوراً.',
  },
  'children-behavior': {
    officialName: 'قائمة فحص سلوك الطفل (CBCL: Child Behavior Checklist)',
    code: 'CBCL',
    developer: 'د. توماس أشنباخ (Thomas M. Achenbach)',
    measures: 'مساعدة الوالدين على رصد التحديات السلوكية والانفعالية وصعوبات التكيف والاندماج لدى الأطفال.',
    citation: '{{SCALE_CITATION_CBCL}}',
    disclaimer: 'أداة استرشادية لمساعدة المربين وأولياء الأمور.',
  },
  'emotional-intelligence': {
    officialName: 'استبيان الذكاء العاطفي كسمة (TEIQue: Trait Emotional Intelligence Questionnaire)',
    code: 'TEIQue',
    developer: 'د. ك. ف. بتريديس (K. V. Petrides)',
    measures: 'قياس القدرة على إدراك المشاعر الذاتية وتنظيم الانفعالات والتعاطف وإدارة العلاقات.',
    citation: '{{SCALE_CITATION_TEIQUE}}',
    disclaimer: 'مقياس نمائي وتطويري للوعي الذاتي.',
  },
  'postpartum-depression': {
    officialName: 'مقياس إدنبرة لاكتئاب ما بعد الولادة (EPDS: Edinburgh Postnatal Depression Scale)',
    code: 'EPDS',
    developer: 'د. جون كوكس (John L. Cox) وفريقه',
    measures: 'فحص التغيرات المزاجية والقلق ومشاعر الإرهاق لدى الأمهات الجدد خلال فترة ما بعد الولادة.',
    citation: '{{SCALE_CITATION_EPDS}}',
    disclaimer: 'مقياس فحص مبدئي لسلامة وصحة الأم النفسية.',
  },
  'imposter-syndrome': {
    officialName: 'مقياس كلانس لظاهرة المحتال (CIPS: Clance Impostor Phenomenon Scale)',
    code: 'CIPS',
    developer: 'د. بولين روز كلانس (Pauline Rose Clance)',
    measures: 'قياس الشك في الكفاءة الذاتية والخوف من كشف عدم الأهلية ونسب النجاح للحظ.',
    citation: '{{SCALE_CITATION_CIPS}}',
    disclaimer: 'مقياس استرشادي للنمو والتطوير النفسي والمهني.',
  },
  anger: {
    officialName: 'مقياس التعبير عن الغضب وحالته (STAXI: State-Trait Anger Expression Inventory)',
    code: 'STAXI',
    developer: 'د. تشارلز سبيلبيرغر (Charles D. Spielberger)',
    measures: 'فحص طريقة معالجة الغضب، التعبير الخارجي، الكبت الداخلي، وضبط النفس.',
    citation: '{{SCALE_CITATION_STAXI}}',
    disclaimer: 'أداة تقييم استرشادية لإدارة الانفعالات.',
  },
  'childhood-trauma': {
    officialName: 'استبيان التجارب السلبية في الطفولة (ACE: Adverse Childhood Experiences Questionnaire)',
    code: 'ACE',
    developer: 'مراكز السيطرة على الأمراض والوقاية منها (CDC) ومنظمة كايزر برماننت',
    measures: 'استكشاف أثر الخبرات الضاغطة أو الصادمة في سنوات التنشئة الأولى على النضج النفسي.',
    citation: '{{SCALE_CITATION_ACE}}',
    disclaimer: 'مقياس استكشافي وتوعوي لبناء الفهم الذاتي.',
  },
  'introvert-extrovert': {
    officialName: 'مقياس عوامل الشخصية الخمسة الكبرى - بُعد الانبساط (Big Five Inventory)',
    code: 'Big Five',
    developer: 'د. أوليفر جون (Oliver P. John) ونخبة من باحثي علم نفس الشخصية',
    measures: 'تحديد نمط شحن الطاقة النفسية وميل الفرد نحو التفاعل الاجتماعي مقابل الخلوة والتأمل.',
    citation: '{{SCALE_CITATION_BIG5}}',
    disclaimer: 'مقياس سمات شخصية استكشافي.',
  },
  npd: {
    officialName: 'مقياس سمات الشخصية النرجسية (NPI: Narcissistic Personality Inventory)',
    code: 'NPI',
    developer: 'د. روبرت راسكين (Robert Raskin) ود. تيري هول',
    measures: 'استكشاف سمات الاعتداد بالذات والحاجة للتقدير والقيادة مقابل الهشاشة الداخلية.',
    citation: '{{SCALE_CITATION_NPI}}',
    disclaimer: 'مقياس فحص للسمات الشخصية وليس وصمة أو تشخيصاً نهائياً.',
  },
  bpd: {
    officialName: 'مقياس زاناريني للشخصية الحدية (MSI-BPD: McLean Screening Instrument for BPD)',
    code: 'MSI-BPD',
    developer: 'د. ماري زاناريني (Mary C. Zanarini) وفريق مستشفى ماكلين',
    measures: 'فحص تقلبات الصورة الذاتية، عدم الاستقرار العاطفي، والخوف من التخلي أو الفقد.',
    citation: '{{SCALE_CITATION_MSIBPD}}',
    disclaimer: 'مقياس فحص مبدئي يستوجب الفحص العيادي المتخصص.',
  },
  'job-satisfaction': {
    officialName: 'مقياس الرضا المهني والبيئة الوظيفية (JSS: Job Satisfaction Survey)',
    code: 'JSS',
    developer: 'د. بول سبيكتور (Paul E. Spector)',
    measures: 'تقييم التوافق مع بيئة العمل والتقدير والرضا عن المهام والمناخ المهني.',
    citation: '{{SCALE_CITATION_JSS}}',
    disclaimer: 'مقياس استرشادي لتطوير المسار الوظيفي.',
  },
  'work-life-balance': {
    officialName: 'مقياس التوازن بين العمل والحياة الشخصية (WLB: Work-Life Balance Scale)',
    code: 'WLB',
    developer: 'د. فيشر (Fisher) وزملاؤه لأبحاث علم النفس التنظيمي',
    measures: 'تقييم الحدود الصحية بين متطلبات العمل والمسؤوليات الأسرية والراحة الذاتية.',
    citation: '{{SCALE_CITATION_WLB}}',
    disclaimer: 'أداة استرشادية لتنظيم جودة الحياة.',
  },
};

export function getScaleInfo(testId: string, fallbackTitle?: string, fallbackCategory?: string): ScaleInfo {
  if (scaleCatalog[testId]) {
    return scaleCatalog[testId];
  }

  const cleanKey = testId.toUpperCase().replace(/[^A-Z0-9]/g, '_');
  return {
    officialName: fallbackTitle || 'مقياس تقييم نفسي استرشادي',
    code: testId.toUpperCase(),
    developer: 'مستند إلى أطر ومقاييس التقييم النفسي والتربوي المقننة',
    measures: `فحص أولي للمؤشرات السلوكية والنفسية المتعلقة بمجال (${fallbackCategory || 'التقييم الذاتي'}).`,
    citation: `{{SCALE_CITATION_${cleanKey}}}`,
    disclaimer: 'مقياس مستخدم عالمياً للفحص المبدئي، وليس تشخيصاً طبياً مستقلاً.',
  };
}
