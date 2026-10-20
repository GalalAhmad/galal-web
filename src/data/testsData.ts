export interface TestQuestionOption {
  label: string;
  score: number;
}

export interface TestQuestion {
  text: string;
  options: TestQuestionOption[];
}

export interface TestItem {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  desc: string;
  duration: string;
  color: string;
  questionsCount: string;
  questions: TestQuestion[];
  scoreResults: { title: string; text: string; recommendation: string }[];
}

export const allTestsData: TestItem[] = [
  {
    "id": "depression",
    "title": "اختبار الاكتئاب",
    "category": "الصحة النفسية",
    "categoryId": "mental-health",
    "desc": "يساعدك على تقييم الأعراض النفسية وفهم تأثيرها على المزاج والحياة اليومية.",
    "duration": "6 دقائق",
    "color": "#A1D0F7",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "anxiety",
    "title": "اختبار القلق",
    "category": "الصحة النفسية",
    "categoryId": "mental-health",
    "desc": "يقيّم مستوى القلق والتوتر لديك ويوضح تأثيرهما على التفكير والسلوك.",
    "duration": "4 دقائق",
    "color": "#FFCCCD",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "personality",
    "title": "اختبار الشخصية",
    "category": "الشخصية",
    "categoryId": "personality",
    "desc": "يساعدك على اكتشاف نمط شخصيتك وطريقة تفكيرك وتفاعلك مع الآخرين.",
    "duration": "7 دقائق",
    "color": "#EBDFFE",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "adhd",
    "title": "اختبار ADHD",
    "category": "الصحة النفسية",
    "categoryId": "mental-health",
    "desc": "يساعدك على فهم اضطراب التركيز وفرط الحركة والأعراض الشائعة المرتبطة بها.",
    "duration": "3 دقائق",
    "color": "#A1F7DD",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "childrenmentalhealth",
    "title": "كشف الحالة النفسية للأطفال",
    "category": "الصحة النفسية",
    "categoryId": "mental-health",
    "desc": "يساعد الأهل على فهم الحالة النفسية للطفل بطريقة مبسّطة ومطمئنة.",
    "duration": "5 دقائق",
    "color": "#CCFFD6",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "jealousy-female",
    "title": "اختبار الغيرة - للنساء",
    "category": "العلاقات والأسرة",
    "categoryId": "family-relations",
    "desc": "يوضح مستوى الغيرة لديك وكيف يمكن أن تؤثر على العلاقات العاطفية.",
    "duration": "4 دقائق",
    "color": "#BBA1F7",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "jealousy-male",
    "title": "اختبار الغيرة - للرجال",
    "category": "العلاقات والأسرة",
    "categoryId": "family-relations",
    "desc": "يقيّم تأثير الغيرة على المشاعر والسلوك داخل العلاقات.",
    "duration": "4 دقائق",
    "color": "#D5E3F6",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "love",
    "title": "اختبار الحب",
    "category": "العلاقات والأسرة",
    "categoryId": "family-relations",
    "desc": "يساعدك على فهم مشاعرك العاطفية وطريقة ارتباطك بالآخرين.",
    "duration": "3 دقائق",
    "color": "#FFEACC",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "passion",
    "title": "اختبار فقدان الشغف",
    "category": "الصحة النفسية",
    "categoryId": "mental-health",
    "desc": "يساعدك على معرفة أسباب فقدان الدافعية وكيف يمكن استعادة الحماس في الحياة اليومية.",
    "duration": "5 دقائق",
    "color": "#B7D6FF",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "ptsd",
    "title": "اختبار اضطراب ما بعد الصدمة",
    "category": "الصحة النفسية",
    "categoryId": "mental-health",
    "desc": "يقيّم أثر التجارب الصادمة على حالتك النفسية وردود فعلك اليومية.",
    "duration": "7 دقائق",
    "color": "#F7A1B9",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "bpd",
    "title": "اختبار الشخصية الحدية",
    "category": "الصحة النفسية",
    "categoryId": "mental-health",
    "desc": "يوضح السمات الانفعالية وتقلب المشاعر بشكل مبدئي وغير تشخيصي.",
    "duration": "3 دقائق",
    "color": "#E3FFCC",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "fear-of-holes",
    "title": "اختبار فوبيا الثقوب",
    "category": "الصحة النفسية",
    "categoryId": "mental-health",
    "desc": "يساعدك على فهم درجة الخوف من الأنماط المتقاربة وتأثيره على الشعور اليومي.",
    "duration": "6 دقائق",
    "color": "#F7E9A1",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "npd",
    "title": "اختبار النرجسية",
    "category": "الشخصية",
    "categoryId": "personality",
    "desc": "يقيّم بعض السمات الشخصية النرجسية وتأثيرها على العلاقات الاجتماعية.",
    "duration": "6 دقائق",
    "color": "#FFCCCD",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "masochism",
    "title": "اختبار المازوخية",
    "category": "الشخصية",
    "categoryId": "personality",
    "desc": "يساعدك على اكتشاف أي ميول نفسية مرتبطة بالألم أو التضحية الزائدة.",
    "duration": "6 دقائق",
    "color": "#EECCFF",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "mh",
    "title": "اختبار المرض النفسي",
    "category": "الصحة النفسية",
    "categoryId": "mental-health",
    "desc": "يمنحك مؤشرات مبدئية عن حالتك النفسية العامة بشكل مبسّط.",
    "duration": "5 دقائق",
    "color": "#E3F7A1",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "Social-Anxiety",
    "title": "اختبار الرهاب الاجتماعي",
    "category": "الصحة النفسية",
    "categoryId": "mental-health",
    "desc": "يساعدك على تقييم القلق أثناء التفاعل الاجتماعي والتواصل مع الآخرين.",
    "duration": "4 دقائق",
    "color": "#DFFAFE",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "anger-level",
    "title": "اختبار الشخصية العصبية",
    "category": "الشخصية",
    "categoryId": "personality",
    "desc": "يساعدك على فهم مستوى العصبية وردود الفعل تحت الضغط.",
    "duration": "5 دقائق",
    "color": "#F7A1D7",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "trauma",
    "title": "اختبار صدمات الطفولة",
    "category": "الصحة النفسية",
    "categoryId": "mental-health",
    "desc": "يوضح تأثير تجارب الطفولة المبكرة على صحتك النفسية الحالية.",
    "duration": "4 دقائق",
    "color": "#FFFCCC",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "personality-color",
    "title": "اختبار لون الشخصية",
    "category": "الشخصية",
    "categoryId": "personality",
    "desc": "يوضح نقاط القوة وأساليب التفكير من خلال أنماط شخصية مختلفة.",
    "duration": "3 دقائق",
    "color": "#EBDFFE",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "eating-disorders",
    "title": "اختبار اضطرابات الأكل",
    "category": "الصحة النفسية",
    "categoryId": "mental-health",
    "desc": "يوضح علاقتك مع الطعام ويكشف السلوكيات الغذائية غير الصحية.",
    "duration": "5 دقائق",
    "color": "#F7A1A1",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "emotional-numbness",
    "title": "اختبار تبلد المشاعر",
    "category": "الصحة النفسية",
    "categoryId": "mental-health",
    "desc": "يساعدك على فهم الشعور بالفراغ أو فقدان الإحساس العاطفي.",
    "duration": "4 دقائق",
    "color": "#DFFEF3",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "kind-hearted",
    "title": "اختبار الشخص الحنون",
    "category": "الشخصية",
    "categoryId": "personality",
    "desc": "يوضح مستوى التعاطف والقدرة على الاهتمام بالآخرين.",
    "duration": "4 دقائق",
    "color": "#E3FFCC",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "femininity-insight-test",
    "title": "اختبار الأنوثة",
    "category": "الشخصية",
    "categoryId": "personality",
    "desc": "يساعدك على فهم سمات الأنوثة والتعبير عن المشاعر والهوية.",
    "duration": "6 دقائق",
    "color": "#F7A1D7",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "strong-personality-test",
    "title": "اختبار الشخصية القوية",
    "category": "الشخصية",
    "categoryId": "personality",
    "desc": "يقيّم مستوى الثقة بالنفس والقدرة على اتخاذ القرار.",
    "duration": "3 دقائق",
    "color": "#E3F7A1",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "masculinity-test",
    "title": "اختبار الرجولة",
    "category": "الشخصية",
    "categoryId": "personality",
    "desc": "يوضح مفاهيم الرجولة وكيف تنعكس على السلوك والتفاعل مع الآخرين.",
    "duration": "6 دقائق",
    "color": "#A1D0F7",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "friendship",
    "title": "اختبار الصداقة",
    "category": "العلاقات والأسرة",
    "categoryId": "family-relations",
    "desc": "يساعدك على اكتشاف أسلوبك في بناء العلاقات الاجتماعية والحفاظ عليها.",
    "duration": "4 دقائق",
    "color": "#FFEACC",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "schizophrenia-assessment",
    "title": "اختبار الفصام",
    "category": "الصحة النفسية",
    "categoryId": "mental-health",
    "desc": "يساعدك هذا الاختبار على فهم أعراض الفصام، وتقييم احتمالية الإصابة به.",
    "duration": "4 دقائق",
    "color": "#FFFCCC",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "cold-personality-test",
    "title": "اختبار الشخصية الباردة",
    "category": "الشخصية",
    "categoryId": "personality",
    "desc": "اختبار يساعدك على فهم مدى برودك العاطفي وطريقة تفاعلك مع المشاعر والعلاقات.",
    "duration": "3 دقائق",
    "color": "#FFFCCC",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "career-interest-test",
    "title": "اختبار الميول المهنىة",
    "category": "الشخصية",
    "categoryId": "personality",
    "desc": "أداة احترافية لقياس مهاراتك وميولك الشخصية والمهنية",
    "duration": "5 دقائق",
    "color": "#E3FFCC",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "job-satisfaction-test",
    "title": "اختبار الرضا الوظيفي",
    "category": "الشخصية",
    "categoryId": "personality",
    "desc": "اختبار سريع يقيس مدى رضاك عن وظيفتك الحالية",
    "duration": "4 دقائق",
    "color": "#D5E3F6",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "toxic-relationship-quiz",
    "title": "اختبار العلاقات السامة",
    "category": "العلاقات والأسرة",
    "categoryId": "family-relations",
    "desc": "اختبار سريع يكشف إن كانت علاقتك تحمل علامات علاقة سامة.",
    "duration": "7 دقائق",
    "color": "#F7A1A4",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "bipolar-disorder-test",
    "title": "اختبار ثنائي القطب",
    "category": "الصحة النفسية",
    "categoryId": "mental-health",
    "desc": "اختبار سريع يكشف احتمالية وجود أعراض اضطراب ثنائي القطب لديك",
    "duration": "5 دقائق",
    "color": "#B4F7A1",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "burnout-assessment",
    "title": "اختبار الاحتراق الوظيفي",
    "category": "الصحة النفسية",
    "categoryId": "mental-health",
    "desc": "اختبار يقيس مستوى الاحتراق الوظيفي والضغط النفسي في العمل",
    "duration": "6 دقائق",
    "color": "#A1D0F7",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "imposter-syndrome-test",
    "title": "اختبار متلازمة المحتال",
    "category": "الشخصية",
    "categoryId": "personality",
    "desc": "اكتشف مدى تأثير متلازمة المحتال على مسيرتك المهنية والشخصية.",
    "duration": "4 دقائق",
    "color": "#BBA1F7",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "work-life-balance-test",
    "title": "اختبار التوازن بين العمل والحياة",
    "category": "الشخصية",
    "categoryId": "personality",
    "desc": "مقياس لتقييم التوازن بين التزاماتك المهنية ورفاهيتك الشخصية بخصوصية تامة.",
    "duration": "5 دقائق",
    "color": "#B4F7A1",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "porn-addiction-test",
    "title": "اختبار إدمان الإباحية",
    "category": "الصحة النفسية",
    "categoryId": "mental-health",
    "desc": "مقياس دقيق لتقييم السلوك القهري تجاه الإباحية وتقديم توصيات للتعافي.",
    "duration": "6 دقائق",
    "color": "#F7E9A1",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "narcissistic-partner-test",
    "title": "اختبار النرجسية للشريك",
    "category": "العلاقات والأسرة",
    "categoryId": "family-relations",
    "desc": "اختبار سريع يساعدك على اكتشاف سمات النرجسية في سلوك شريكك",
    "duration": "5 دقائق",
    "color": "#D5E3F6",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "ocd-test",
    "title": "اختبار الوسواس القهري",
    "category": "الصحة النفسية",
    "categoryId": "mental-health",
    "desc": "اختبار سريع يقيس شدة الوسواس القهري والأفكار والسلوكيات القهرية.",
    "duration": "6 دقائق",
    "color": "#BBA1F7",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "introvert-vs-extrovert-test",
    "title": "اختبار الشخصية الانطوائية",
    "category": "الشخصية",
    "categoryId": "personality",
    "desc": "اكتشف أسرار هدوئك ونمط تفاعلك الاجتماعي عبر اختبار الشخصية الانطوائية السريع.",
    "duration": "3 دقائق",
    "color": "#E3F7A1",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "postpartum-depression-test",
    "title": "اختبار اكتئاب ما بعد الولادة",
    "category": "الصحة النفسية",
    "categoryId": "mental-health",
    "desc": "مقياس علمي سريع وموثوق لتقييم حالتك النفسية ومزاجك بعد الولادة.",
    "duration": "5 دقائق",
    "color": "#DFF3FE",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  },
  {
    "id": "emotional-intelligence-test",
    "title": "اختبار الذكاء العاطفي",
    "category": "الشخصية",
    "categoryId": "personality",
    "desc": "اكتشف مستوى ذكائك العاطفي وقدرتك على فهم مشاعرك وإدارتها في علاقاتك اليومية.",
    "duration": "6 دقائق",
    "color": "#F7A1B9",
    "questionsCount": "3 أسئلة",
    "questions": [
      {
        "text": "مدى تكرار هذا الشعور أو التحدي خلال الأسبوعين الماضيين؟",
        "options": [
          {
            "label": "نادر جداً",
            "score": 0
          },
          {
            "label": "عدة أيام",
            "score": 1
          },
          {
            "label": "أكثر من نصف الأيام",
            "score": 2
          },
          {
            "label": "بشكل شبه يومي",
            "score": 3
          }
        ]
      },
      {
        "text": "هل يؤثر هذا الأمر على تركيزك أو نومك أو طاقتك اليومية؟",
        "options": [
          {
            "label": "لا يؤثر إطلاقاً",
            "score": 0
          },
          {
            "label": "تأثير طفيف",
            "score": 1
          },
          {
            "label": "تأثير ملحوظ",
            "score": 2
          },
          {
            "label": "تأثير شديد ومستمر",
            "score": 3
          }
        ]
      },
      {
        "text": "هل تشعر بصعوبة في التعامل مع هذا العرض بمفردك؟",
        "options": [
          {
            "label": "أستطيع التكيف",
            "score": 0
          },
          {
            "label": "أحياناً أحتاج دعماً",
            "score": 1
          },
          {
            "label": "أشعر بضغط ملحوظ",
            "score": 2
          },
          {
            "label": "أحتاج توجيهاً متخصصاً",
            "score": 3
          }
        ]
      }
    ],
    "scoreResults": []
  }
];
