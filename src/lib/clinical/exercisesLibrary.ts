// ==========================================================
// مكتبة التمارين والتكليفات الإرشادية التفاعلية
// Therapeutic Interactive Exercises Library
// المنصة الرسمية للمستشار جلال أحمد
// ==========================================

export interface ClinicalExerciseTemplate {
  slug: string;
  titleAr: string;
  category: 'CBT' | 'ACT' | 'DBT' | 'Marital' | 'Somatic';
  categoryLabelAr: string;
  descriptionAr: string;
  estimatedMinutes: number;
  icon: string;
  instructions: string;
  defaultFields: {
    id: string;
    labelAr: string;
    placeholderAr: string;
    type: 'text' | 'textarea' | 'rating' | 'select';
    options?: string[];
  }[];
}

export const CLINICAL_EXERCISES_LIBRARY: ClinicalExerciseTemplate[] = [
  {
    slug: 'cbt-thought-record',
    titleAr: 'سجل رصد وتفنيد الأفكار التلقائية (7 أعمدة)',
    category: 'CBT',
    categoryLabelAr: 'علاج معرفي سلوكي',
    descriptionAr: 'الأداة المعيارية لتفكيك التشوهات المعرفية (كالتفكير الكارثي وقراءة الأفكار) واستبدالها بأفكار واقعية متزنة.',
    estimatedMinutes: 15,
    icon: '📝',
    instructions: 'عندما تشعر بضيق مفاجئ أو توتر، افتح هذا السجل ودوّن الموقف والمشاعر، ثم فكك الفكرة التلقائية وصغ بديلاً عقلانياً.',
    defaultFields: [
      {
        id: 'situation',
        labelAr: '1. الموقف / المثير الحقيقي (أين كنت؟ ومع من؟ وماذا حدث؟)',
        placeholderAr: 'مثال: أثناء اجتماع العمل، وجه المدير سؤالاً فجائياً ولم أسعف بالإجابة فوراً...',
        type: 'textarea'
      },
      {
        id: 'emotions',
        labelAr: '2. المشاعر المصاحبة ونسبتها (حزن، قلق، خجل، غضب من 100%)',
        placeholderAr: 'مثال: قلق 80%، إحراج وخجل 90%...',
        type: 'text'
      },
      {
        id: 'automatic_thought',
        labelAr: '3. الفكرة التلقائية الساخنة التي قفزت لذهنك فوراً',
        placeholderAr: 'مثال: "الجميع الآن يراني عاجزاً وفاشلاً ولن يحترمني أحد بعد اليوم!"...',
        type: 'textarea'
      },
      {
        id: 'cognitive_distortion',
        labelAr: '4. نوع الفخ الفكري / التشويه المعرفي',
        placeholderAr: 'اختر التشويه الأكثر انطباقاً',
        type: 'select',
        options: [
          'التهويل والكارثية (Catastrophizing)',
          'قراءة أفكار الآخرين (Mind Reading)',
          'التفكير بالأبيض والأسود الكل أو لا شيء (All-or-Nothing)',
          'التعميم الزائد المفرط (Overgeneralization)',
          'الشخصنة ولوم الذات (Personalization)',
          'التصفية العقلية السلبية (Mental Filtering)'
        ]
      },
      {
        id: 'evidence_against',
        labelAr: '5. الأدلة الواقعية ضد هذه الفكرة التلقائية (ما الذي يثبت خطأها؟)',
        placeholderAr: 'مثال: المدير أثنى على تقريري الأسبوع الماضي، والزملاء لم يبدوا أي استهزاء، ومن الطبيعي ألا يعلم الإنسان كل شيء في التو واللحظة...',
        type: 'textarea'
      },
      {
        id: 'balanced_thought',
        labelAr: '6. الفكرة البديلة الأكثر توازناً ونضجاً',
        placeholderAr: 'مثال: "أنا إنسان مجتهد ولست ملزماً بمعرفة كل تفصيلة فوراً، سأبحث وأرسل الإجابة غداً بهدوء"...',
        type: 'textarea'
      },
      {
        id: 're_rate_emotions',
        labelAr: '7. إعادة تقييم المشاعر الآن (من 100%)',
        placeholderAr: 'مثال: انخفض القلق من 80% إلى 25% وشعرت بالهدوء والاتزان...',
        type: 'text'
      }
    ]
  },

  {
    slug: 'act-values-bullseye',
    titleAr: 'بوصلة القيم ومصفوفة الالتزام (Values Bullseye)',
    category: 'ACT',
    categoryLabelAr: 'القبول والالتزام',
    descriptionAr: 'تحديد القيم الحياتية العميقة في 4 مسارات: العلاقات، العمل والنمو، الصحة الجسدية، والروحانية والمعنى، وقياس مدى الاقتراب منها.',
    estimatedMinutes: 20,
    icon: '🎯',
    instructions: 'القيم هي الاتجاه الذي تسير نحوه وليست مجرد أهداف مؤقتة. قيّم أين تقف حالياً من كل قيمة وما هي الخطوة القادمة.',
    defaultFields: [
      {
        id: 'relational_value',
        labelAr: '1. مسار العلاقات (الزوجية، الأسرية، الصداقات): ما هي القيمة التي تريد أن تجسدها؟',
        placeholderAr: 'مثال: أن أكون زوجاً منصتاً ومصدراً للأمان، وأن أكون ابناً باراً...',
        type: 'textarea'
      },
      {
        id: 'relational_score',
        labelAr: 'مدى اقترابك الفعلي من هذا المركز (من 1 إلى 10)',
        placeholderAr: '7',
        type: 'rating'
      },
      {
        id: 'work_value',
        labelAr: '2. مسار العمل والعطاء والإنجاز: ما المعنى الأعمق لعملك؟',
        placeholderAr: 'مثال: إتقان العمل بنية النفع العام وطلب الرزق الحلال بكرامة...',
        type: 'textarea'
      },
      {
        id: 'work_score',
        labelAr: 'مدى اقترابك الفعلي من هذا المركز (من 1 إلى 10)',
        placeholderAr: '6',
        type: 'rating'
      },
      {
        id: 'committed_action',
        labelAr: '3. خطوة الالتزام الفعالة (فعل سلوكي ملموس ستفعله هذا الأسبوع رغم وجود القلق)',
        placeholderAr: 'مثال: سأجلس مع زوجتي لنصف ساعة بدون هاتف للإنصات إليها يوم الثلاثاء...',
        type: 'textarea'
      }
    ]
  },

  {
    slug: 'dbt-stop-skill',
    titleAr: 'مهارة STOP للسيطرة على الاندفاع وأوقات الأزمة',
    category: 'DBT',
    categoryLabelAr: 'السلوكي الجدلي',
    descriptionAr: 'بروتوكول فوري يُستخدم عند تصاعد الغضب أو الرغبة في الانفعال أو إرسال رسالة جارحة لمنع السلوكيات الهدامة.',
    estimatedMinutes: 10,
    icon: '🛑',
    instructions: 'تذكر أحرف كلمة STOP كلما شعرت برغبة عارمة في الانفجار أو الاندفاع.',
    defaultFields: [
      {
        id: 'trigger',
        labelAr: 'الموقف الحرج المثير للاندفاع',
        placeholderAr: 'مثال: خلاف حاد وكلمة جارحة قيلت لي ورغبت في الصراخ أو كسر شيء...',
        type: 'textarea'
      },
      {
        id: 's_step',
        labelAr: 'S - توقف فوراً (Stop): هل جمدت حركتك وامتنعت عن الرد اللحظي؟',
        placeholderAr: 'نعم، أغلقت فمي ولم أتكلم...',
        type: 'text'
      },
      {
        id: 't_step',
        labelAr: 'T - خذ خطوة للوراء (Take a step back): ماذا فعلت لتغيير مكانك؟',
        placeholderAr: 'خرجت من الغرفة لشرب الماء وغسل الوجه بماء بارد...',
        type: 'text'
      },
      {
        id: 'o_step',
        labelAr: 'O - راقب دون إطلاق أحكام (Observe): ما الذي تراه في داخلك وخارجك؟',
        placeholderAr: 'أشعر بقلبي ينبض بشدة، وأعلم أن الطرف الآخر مرهق ومتوتر أيضاً...',
        type: 'textarea'
      },
      {
        id: 'p_step',
        labelAr: 'P - تصرف بوعي وحكمة (Proceed Mindfully): ما هو القرار الذي يحمي العلاقة؟',
        placeholderAr: 'قررت تأجيل النقاش حتى المساء بعد أن يهدأ التوتر تماماً...',
        type: 'textarea'
      }
    ]
  },

  {
    slug: 'marital-emotion-bank',
    titleAr: 'بنك المشاعر الزوجية وميثاق التعبير الآمن',
    category: 'Marital',
    categoryLabelAr: 'إرشاد زوجي وأسري',
    descriptionAr: 'تمرين عملي مقتبس من مسار "ميثاق" لتبادل الودائع العاطفية الإيجابية بدلاً من السحب المستمر باللوم والانتقاد.',
    estimatedMinutes: 15,
    icon: '💖',
    instructions: 'العلاقة الزوجية مثل الحساب البنكي؛ لا يمكنك السحب منه وقت الأزمات إذا لم تكن قد أودعت فيه رصيداً كافياً من التقدير والامتنان.',
    defaultFields: [
      {
        id: 'appreciation_1',
        labelAr: '1. إيداع عاطفي أول: موقف قدمه لك شريكك مؤخراً وقدرته له من قلبك',
        placeholderAr: 'مثال: اهتمامك بإعداد وجبة هادئة لي رغم تعبك بالأمس أسعدني جداً...',
        type: 'textarea'
      },
      {
        id: 'appreciation_2',
        labelAr: '2. إيداع عاطفي ثانٍ: صفة أصيلة تحبها في شخصية شريكك',
        placeholderAr: 'مثال: حلمك وصبرك وطيب معشرك مع أهلي...',
        type: 'textarea'
      },
      {
        id: 'safe_request',
        labelAr: '3. طلب احتياج بلغة الأمان الشخصي (أنا أشعر بـ ... وأحتاج إلى ... بدون لوم)',
        placeholderAr: 'مثال: "أنا أشعر ببعض الوحدة في المساء، ويسعدني جداً لو قضينا 20 دقيقة معاً بدون شاشات"...',
        type: 'textarea'
      }
    ]
  },

  {
    slug: 'somatic-grounding',
    titleAr: 'تمرين الرسو الحسي 5-4-3-2-1 والتنفس الترددي',
    category: 'Somatic',
    categoryLabelAr: 'استرخاء ووعي جسدي',
    descriptionAr: 'إعادة الاتصال بالجسد واللحظة الحاضرة لتهدئة الجهاز العصبي الودي وخفض ضربات القلب فوراً.',
    estimatedMinutes: 8,
    icon: '🌿',
    instructions: 'تنفس بعمق بأسلوب 4 ثوانٍ شهيق، و7 ثوانٍ حبس، و8 ثوانٍ زفير هادئ، ثم دوّن ما تلاحظه بحواسك الخمس.',
    defaultFields: [
      {
        id: 'sight_5',
        labelAr: '5 أشياء تراها بعينيك في الغرفة الآن',
        placeholderAr: 'الستارة البيضاء، كتاب على الرف، ظل النافذة، القلم، ساعة الحائط...',
        type: 'text'
      },
      {
        id: 'touch_4',
        labelAr: '4 أشياء تلمسها بجسدك الآن',
        placeholderAr: 'ملمس المقعد تحت ظهري، باطن قدمي على الأرض، ملمس قميصي، برودة الهواء...',
        type: 'text'
      },
      {
        id: 'sound_3',
        labelAr: '3 أصوات تسمعها في محيطك',
        placeholderAr: 'صوت مروحة المكيف، صوت سيارة بعيدة، صوت أنفاسي...',
        type: 'text'
      },
      {
        id: 'smell_2',
        labelAr: 'شيئان تشمهما الآن',
        placeholderAr: 'رائحة القهوة، نسيم الهواء الخارجي...',
        type: 'text'
      },
      {
        id: 'taste_1',
        labelAr: 'شيء واحد تتذوقه في فمك',
        placeholderAr: 'طعم الماء النقي...',
        type: 'text'
      },
      {
        id: 'heart_rate_after',
        labelAr: 'كيف تشعر بجسدك الآن بعد التمرين؟',
        placeholderAr: 'ارتخاء في الكتفين، تنفس أعمق، هدوء في نبضات القلب...',
        type: 'textarea'
      }
    ]
  }
];
