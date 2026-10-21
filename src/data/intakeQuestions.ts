export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
}

export interface IntakeQuestion {
  id: string;
  question: string;
  subtitle?: string;
  type: 'single-select' | 'multi-select' | 'text' | 'textarea';
  options?: QuestionOption[];
  placeholder?: string;
  required?: boolean;
}

export interface TrackConfig {
  id: string;
  title: string;
  badge: string;
  desc: string;
  feeKey: string;
  defaultFee: string;
  duration: string;
  questionsCount: number;
  iconName: string;
  questions: IntakeQuestion[];
}

export const intakeTracks: TrackConfig[] = [
  {
    id: 'psychological',
    title: 'استشارة نفسية فردية',
    badge: 'جلسة خاصة • 50 دقيقة',
    desc: 'مساحة استماع آمنة لتفكيك القلق والضغوط، فهم المشاعر، واستعادة الصلابة والاتزان الذاتي.',
    feeKey: 'individualFee',
    defaultFee: 'تبدأ من 250 ر.س',
    duration: '50 دقيقة',
    questionsCount: 4,
    iconName: 'Brain',
    questions: [
      {
        id: 'psychological_symptoms',
        question: 'ما أبرز الأعراض النفسية التي تؤرقك حالياً؟',
        subtitle: 'يمكنك اختيار أكثر من خيار يصف ما تشعر به بدقة',
        type: 'multi-select',
        options: [
          { id: 'anxiety', label: 'قلق وتوتر دائم أو هلع مفاجئ' },
          { id: 'sadness', label: 'حزن وكآبة مستمرة منذ فترة' },
          { id: 'overthinking', label: 'تفكير مفرط وزائد وصعوبة إيقاف الأفكار' },
          { id: 'ocd', label: 'أفكار وسواسية أو مخاوف متكررة' },
          { id: 'sleep_issues', label: 'أرق وصعوبة نوم أو كوابيس مزعجة' },
          { id: 'fatigue', label: 'كسل وخمول وفقدان الطاقة والشغف' },
          { id: 'anger', label: 'عصبية شديدة ونوبات غضب سريعة' },
          { id: 'isolation', label: 'انعزال وتجنب التفاعل مع الآخرين' },
          { id: 'trauma', label: 'مررت بصدمة أو موقف قاهر مؤخراً' },
          { id: 'existential', label: 'أسئلة وجودية وحيرة مؤرقة في المعنى' },
        ],
      },
      {
        id: 'physical_symptoms',
        question: 'هل تعاني من أعراض جسمية مصاحبة؟',
        subtitle: 'الجسد غالباً ما يترجم الضغوط النفسية — اختر ما ينطبق عليك',
        type: 'multi-select',
        options: [
          { id: 'headache', label: 'صداع مستمر أو ثقل بالرأس' },
          { id: 'heartbeat', label: 'تسارع ضربات القلب أو خفقان' },
          { id: 'colon', label: 'اضطرابات القولون أو آلام المعدة' },
          { id: 'exhaustion', label: 'إرهاق وثقل عام في الجسم' },
          { id: 'tremors', label: 'رعشة بالأطراف أو ضيق في التنفس' },
          { id: 'none', label: 'لا أعاني من أعراض جسدية ملحوظة' },
        ],
      },
      {
        id: 'previous_therapy',
        question: 'هل خضت جلسات استشارية أو علاج نفسي سابقاً؟',
        subtitle: 'يساعدنا ذلك على فهم مسارك واستمرار خطتك العلاجية',
        type: 'single-select',
        options: [
          { id: 'first_time', label: 'لا، هذه تجربتي الاستشارية الأولى' },
          { id: 'yes_benefited', label: 'نعم، واستفدت منها جزئياً سابقاً' },
          { id: 'yes_not_satisfied', label: 'نعم، لكن لم أشعر بالارتياح الكافي' },
        ],
      },
      {
        id: 'consultation_reason',
        question: 'ما هو الدافع الأساسي وما تأمل تحقيقه من الجلسة؟',
        subtitle: 'صف المشكلة بكلماتك البسيطة كما تشعر بها تماماً',
        type: 'textarea',
        placeholder: 'اكتب باختصار: ما الذي حدث؟ وما الهدف الأساسي الذي تود الخروج به؟',
      },
    ],
  },
  {
    id: 'marital',
    title: 'استشارة زوجية وأسرية',
    badge: 'جلسة ثنائية أو فردية • 60-75 دقيقة',
    desc: 'معالجة الخلافات المتكررة وفك الانسداد الحواري، وإعادة بناء جسور الأمان والتفاهم المشترك.',
    feeKey: 'maritalFee',
    defaultFee: 'تبدأ من 350 ر.س',
    duration: '60-75 دقيقة',
    questionsCount: 4,
    iconName: 'HeartHandshake',
    questions: [
      {
        id: 'attendance_type',
        question: 'ما هي طبيعة الحضور في هذه الجلسة؟',
        subtitle: 'نرحب بحضورك بمفردك أو بحضور الشريكين معاً',
        type: 'single-select',
        options: [
          { id: 'individual', label: 'سأحضر بمفردي لعرض التحدي وفهم المشكلة' },
          { id: 'couple', label: 'سنحضر معاً (الزوج والزوجة) في الجلسة' },
        ],
      },
      {
        id: 'main_challenges',
        question: 'ما هو الدافع والمشكلة الأساسية خلف طلب الاستشارة؟',
        subtitle: 'اختر التحدي الأقرب لواقع العلاقة حالياً',
        type: 'multi-select',
        options: [
          { id: 'premarital', label: 'الاستعداد للزواج وتأهيل البدايات والانسجام' },
          { id: 'communication', label: 'خلافات متكررة وانسداد لغة الحوار والصدام' },
          { id: 'quality', label: 'تحسين جودة الحياة الزوجية واستعادة المودة والفتور' },
          { id: 'trust', label: 'أزمة ثقة أو خيانة أو جرح عاطفي غائر' },
          { id: 'divorce_decision', label: 'الحيرة والمساعدة في اتخاذ قرار الانفصال أو البقاء' },
          { id: 'post_divorce', label: 'تنظيم ما بعد الطلاق ورعاية الأبناء المشتركة' },
          { id: 'family_inlaws', label: 'تدخلات الأهل والأقارب وتأثيرها على العلاقة' },
        ],
      },
      {
        id: 'reconciliation_will',
        question: 'كيف تصف الرغبة الحالية في استمرار وتطوير العلاقة؟',
        subtitle: 'تساعد هذه الإجابة على تحديد الإطار الأنسب لإدارة الجلسة',
        type: 'single-select',
        options: [
          { id: 'both_willing', label: 'هناك رغبة متبادلة وصادقة في الإصلاح وتجاوز الخلاف' },
          { id: 'one_hesitant', label: 'أحد الطرفين حريص والطرف الآخر متردد أو محبط' },
          { id: 'seeking_clarity', label: 'وصلنا لمرحلة حاسمة ونحتاج رؤية موضوعية متخصصة' },
        ],
      },
      {
        id: 'consultation_reason',
        question: 'معلومات عامة عن مدة الزواج وطبيعة الخلاف الراهن',
        subtitle: 'سنوات الزواج، وجود أبناء، وأبرز نقطة نزاع حالية',
        type: 'textarea',
        placeholder: 'مثال: متزوجون منذ 5 سنوات ولدينا طفلان، المشكلة الأساسية في صعوبة التفاهم عند اتخاذ القرارات اليومية...',
      },
    ],
  },
  {
    id: 'parenting',
    title: 'إرشاد تربوي ووالدي',
    badge: 'إرشاد الوالدين • 50 دقيقة',
    desc: 'فهم الدوافع النفسية خلف سلوك الأبناء، وبناء أساليب تعامل تجمع بين الرفق والحزم دون صراخ.',
    feeKey: 'parentingFee',
    defaultFee: 'تبدأ من 250 ر.س',
    duration: '50 دقيقة',
    questionsCount: 4,
    iconName: 'Users',
    questions: [
      {
        id: 'child_basic',
        question: 'ما اسم الابن/الابنة وعمره والمرحلة الدراسية؟',
        subtitle: 'البيانات الأساسية للطفل أو اليافع محل الاستشارة',
        type: 'text',
        placeholder: 'مثال: يوسف، 9 سنوات، الصف الثالث الابتدائي',
      },
      {
        id: 'behavioral_problems',
        question: 'ما هي المشكلات السلوكية الأكثر تكراراً؟',
        subtitle: 'اختر السلوكيات التي تسبب لك أو للأسرة التحدي الأكبر',
        type: 'multi-select',
        options: [
          { id: 'stubbornness', label: 'عناد ورفض سماع الكلام والتمرد' },
          { id: 'tantrums', label: 'عصبية شديدة، صراخ، أو كثرة بكاء' },
          { id: 'screens', label: 'إدمان الشاشات والألعاب وصعوبة سحبها' },
          { id: 'homework', label: 'رفض المذاكرة والنفور من الواجبات المدرسية' },
          { id: 'lying', label: 'الكذب أو إخفاء الأمور والسرية' },
          { id: 'hyperactivity', label: 'تشتت انتباه، حركة زائدة، أو اندفاعية' },
          { id: 'bad_words', label: 'التلفظ بكلمات سيئة أو عدوانية تجاه الآخرين' },
          { id: 'jealousy', label: 'غيرة شديدة وصراع مستمر مع الإخوة' },
          { id: 'fears', label: 'خوف زائد، خجل مفرط، أو عدم ثقة بالنفس' },
          { id: 'bedwetting', label: 'تبول لا إرادي أو تراجع نمائي مفاجئ' },
        ],
      },
      {
        id: 'punishment_methods',
        question: 'ما هي أساليب التوجيه أو العقاب المستخدمة حالياً في المنزل؟',
        subtitle: 'لكل سلوك استجابة؛ معرفة ردود الفعل تساعدنا على تفكيك الحلقة المفرغة',
        type: 'multi-select',
        options: [
          { id: 'yelling', label: 'الصوت العالي أو الصراخ وقت الغضب' },
          { id: 'deprivation', label: 'الحرمان من الأجهزة أو النزهات' },
          { id: 'blame', label: 'اللوم والتأنيب والمقارنة بالآخرين' },
          { id: 'silent_treatment', label: 'المقاطعة والخصام المؤقت' },
          { id: 'hitting', label: 'الضرب أو الشد الجسدي في لحظات الانفعال' },
          { id: 'calm_talk', label: 'محاولة الحوار الهادئ لكن دون نتيجة دائمة' },
        ],
      },
      {
        id: 'consultation_reason',
        question: 'ما هو الموقف الضاغط أو المفجر الذي استدعى طلب الجلسة الآن؟',
        subtitle: 'صف المشكلة كما تعيشها في بيتك لنحدد أولويات التدخل العملي',
        type: 'textarea',
        placeholder: 'صف الموقف أو المشهد الذي يتكرر وتجد صعوبة في احتوائه بالرفق والحزم...',
      },
    ],
  },
  {
    id: 'youth',
    title: 'تأهيل اليافعين والشباب',
    badge: 'جلسة خاصة للشباب • 50 دقيقة',
    desc: 'مساحة واعية لليافعين والشباب لمعالجة أسئلة الهوية، ضغوط المسار، وبناء الشخصية المتزنة.',
    feeKey: 'individualFee',
    defaultFee: 'تبدأ من 250 ر.س',
    duration: '50 دقيقة',
    questionsCount: 3,
    iconName: 'Compass',
    questions: [
      {
        id: 'youth_challenges',
        question: 'ما التحديات الأساسية التي تشغل بالك حالياً؟',
        subtitle: 'اختر ما يعبر عن أزمتك وتساؤلاتك الحالية بكل صراحة وأمان',
        type: 'multi-select',
        options: [
          { id: 'identity', label: 'أزمة هوية وتساؤلات حول الذات والمعنى' },
          { id: 'career_study', label: 'حيرة في تحديد المسار الأكاديمي أو المهني' },
          { id: 'relationships', label: 'علاقات مؤلمة أو تعلق عاطفي يسبب استنزافاً' },
          { id: 'digital_habits', label: 'عادات رقمية مستنزفة (إدمان سوشيال أو عادات سرية)' },
          { id: 'parents_conflict', label: 'صدام وسوء تفاهم حاد مع الوالدين والأسرة' },
          { id: 'confidence', label: 'ضعف تقدير الذات والخوف من الفشل والمستقبل' },
        ],
      },
      {
        id: 'previous_support',
        question: 'هل ناقشت هذا الأمر مع أحد المقربين أو المختصين من قبل؟',
        subtitle: 'يساعدنا على معرفة المساحة التي تحتاجها اليوم',
        type: 'single-select',
        options: [
          { id: 'alone', label: 'لا، لم أشارك هذه المشاعر مع أحد بعد' },
          { id: 'shared_friends', label: 'تحدثت مع أصدقاء أو أهل دون الوصول لحل مريح' },
          { id: 'sought_specialist', label: 'تحدثت مع مستشار أو مرشد سابقاً' },
        ],
      },
      {
        id: 'consultation_reason',
        question: 'ما هو أهم شيء تريد الخروج به والتركيز عليه في الجلسة؟',
        subtitle: 'مساحتك هنا حرة تماماً من أي أحكام مسبقة',
        type: 'textarea',
        placeholder: 'اكتب ما تود قوله للمستشار جلال أحمد بحرية وراحة تامة...',
      },
    ],
  },
  {
    id: 'emergency',
    title: 'حجز طارئ واستجابة عاجلة',
    badge: 'تنسيق مباشر • خلال 24 ساعة',
    desc: 'مسار مخصص للحالات الضاغطة والأزمات الملحة التي لا تحتمل الانتظار على التقويم العادي.',
    feeKey: 'emergencyFee',
    defaultFee: '500 ر.س',
    duration: '60 دقيقة',
    questionsCount: 2,
    iconName: 'Zap',
    questions: [
      {
        id: 'emergency_nature',
        question: 'ما هي طبيعة الظرف الضاغط الطارئ؟',
        subtitle: 'اختر أقرب وصف للأزمة الراهنة لتحديد سرعة الاستجابة',
        type: 'single-select',
        options: [
          { id: 'panic_breakdown', label: 'نوبة هلع أو انهيار نفسي مفاجئ' },
          { id: 'acute_conflict', label: 'أزمة زوجية أو أسرية طارئة مهددة بالانفصال الفوري' },
          { id: 'teen_crisis', label: 'تصرف طارئ أو خطير من الابن/المراهق يتطلب تدخلاً عاجلاً' },
          { id: 'urgent_decision', label: 'موقف مصيري يتطلب قراراً واستشارة خلال ساعات' },
        ],
      },
      {
        id: 'consultation_reason',
        question: 'اشرح بإيجاز الموقف وما تحتاجه فوراً',
        subtitle: 'سيصل تنبيه فوري لفريق التنسيق للتواصل معك خلال وقت قياسي',
        type: 'textarea',
        placeholder: 'اكتب ملخص ما حدث ورقم هاتفك البديل إن وجد للتواصل الفوري...',
      },
    ],
  },
];
