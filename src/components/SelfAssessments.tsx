'use client';

import React, { useState } from 'react';
import { Compass, CheckCircle2, ArrowLeft, X, RotateCcw, HeartHandshake, ShieldAlert, Users, User, Clock, AlertCircle } from 'lucide-react';

interface Question {
  text: string;
  options: { text: string; score: number }[];
}

interface Assessment {
  id: string;
  trackId: 'marital' | 'individual' | 'parenting';
  title: string;
  category: string;
  target: string;
  time: string;
  questionsCount: string;
  description: string;
  cardColor: string;
  questions: Question[];
  getResult: (score: number) => { level: string; summary: string; advice: string };
}

const assessmentsList: Assessment[] = [
  // 1. المسار الزواجي والمقبلين
  {
    id: 'marital-readiness',
    trackId: 'marital',
    title: 'مقياس التوافق والجاهزية الزواجية',
    category: 'المقبلون على الزواج',
    target: 'للخطاب والعاقدين والمقبلين حديثاً',
    time: 'دقيقتان',
    questionsCount: '5 أسئلة',
    cardColor: 'from-amber-600 to-amber-700',
    description: 'مستلهم من دليل المقاييس الأسرية للدكتور أحمد أبو أسعد؛ يقيس نضج التوقعات، وتطابق المفاهيم الأساسية، وجاهزية الشراكة قبل الدخول.',
    questions: [
      {
        text: 'ما مدى وضوح الرؤية المشتركة لمفهوم الزواج والمسؤولية بينكما؟',
        options: [
          { text: 'واضحة جداً؛ ناقشنا أدوارنا وتوقعاتنا المالية والعائلية بالتفصيل', score: 3 },
          { text: 'واضحة بشكل عام ولكن هناك ملفات نؤجل الحديث فيها لما بعد الزواج', score: 2 },
          { text: 'غائمة؛ نعتمد فقط على المشاعر العاطفية دون نقاش واقعي', score: 1 },
        ]
      },
      {
        text: 'كيف تدار الخلافات البسيطة التي تنشأ خلال فترة الخطوبة أو العقد؟',
        options: [
          { text: 'نتحاور بهدوء ونصل لحلول وسط دون تدخل أطراف خارجية', score: 3 },
          { text: 'يحدث توتر وانسحاب مؤقت ثم نعود دون حل جذري', score: 2 },
          { text: 'نتبادل اللوم أو الاستفزاز، أو يتدخل الأهل في كل صغيرة وكبيرة', score: 1 },
        ]
      },
      {
        text: 'هل تشعر بحرية كاملة في إظهار شخصيتك الحقيقية دون تصنع أو تجميل؟',
        options: [
          { text: 'نعم تماماً، أتقبل شريكي كما هو وهو يتقبلني دون شروط', score: 3 },
          { text: 'أتحفظ أحياناً على بعض أفكاري خشية الانتقاد', score: 2 },
          { text: 'أشعر بضغط كبير لأظهر بصورة مثالية ترضيه هو فقط', score: 1 },
        ]
      },
      {
        text: 'ما هو مستوى التوافق في المعايير القيمية والأخلاقية وأسلوب الحياة؟',
        options: [
          { text: 'توافق عميق وانسجام في المبادئ الكبرى', score: 3 },
          { text: 'اختلافات متوسطة يمكن ترويضها بالحوار والتنازل المتبادل', score: 2 },
          { text: 'تناقضات جوهرية تقلقني بشأن المستقبل', score: 1 },
        ]
      },
      {
        text: 'ما هي قدرتكما على الاستماع دون مقاطعة أو دفاعية؟',
        options: [
          { text: 'عالية؛ نستمع لنفهم مشاعر الآخر أولاً', score: 3 },
          { text: 'متوسطة؛ نميل للدفاع عن أنفسنا أحياناً', score: 2 },
          { text: 'منخفضة؛ كل طرف يريد إثبات أنه على حق فقط', score: 1 },
        ]
      }
    ],
    getResult: (score) => {
      if (score >= 13) {
        return {
          level: 'جاهزية عالية وتوافق ناضج',
          summary: 'تمتلكان أرضية صلبة من الواقعية والوعي. استمرار الحوار الصادق وبناء ميثاق تفاهم مبكر سيحمي عش الزوجية من الهزات.',
          advice: 'ننصح بتتويج هذه الجاهزية بحضور برنامج «رحلة رِفق» للمقبلين على الزواج لامتلاك حقيبة الأدوات العملية.'
        };
      } else if (score >= 9) {
        return {
          level: 'جاهزية جيدة مع وجود ملفات تحتاج حسماً واعياً',
          summary: 'التوافق العام موجود، لكن تأجيل مناقشة الملفات الحساسة (الماليات، الأهل، التوقعات) قد يولد صدمات لاحقة.',
          advice: 'افتحوا مساحات حوار صريحة دون حرج، واطلبوا جلسة تأهيل مقبلين لتفكيك النقاط العالقة بهدوء.'
        };
      } else {
        return {
          level: 'حاجة ماسة لإعادة تقييم أسس التوافق',
          summary: 'هناك تباينات عميقة وتوقعات مثالية قد تهدد استقرار البيت في أول شهور الزواج ما لم يتم تداركها بالوعي والتأهيل.',
          advice: 'لا تتسرعوا في إتمام الخطوات قبل جلسة استشارية متخصصة لفحص التوافق وتفكيك أسباب النزاع المبكر.'
        };
      }
    }
  },
  {
    id: 'marital-safety',
    trackId: 'marital',
    title: 'مقياس الأمان والاتصال العاطفي بين الزوجين',
    category: 'العلاقات الزوجية',
    target: 'للمتزوجين والأسر',
    time: 'دقيقتان',
    questionsCount: '5 أسئلة',
    cardColor: 'from-purple-600 to-purple-700',
    description: 'يقيس مستوى الحميمية الوجدانية، كسر حلقات الصمت العقابي، وقدرة الشريكين على أن يكونا ملاذاً آمناً لبعضهما البعض.',
    questions: [
      {
        text: 'عندما تقع في أزمة أو ضيق، هل شريك حياتك هو ملاذك الأول؟',
        options: [
          { text: 'نعم؛ شريكي يسمعني باحتواء دون لوم أو تسفيه', score: 3 },
          { text: 'أتردد أحياناً، وأفضل الاعتماد على نفسي أو أصدقائي', score: 2 },
          { text: 'أتحاشى إخباره خشية أن يستخدم ضعفي ضدي في خلاف قادم', score: 1 },
        ]
      },
      {
        text: 'كيف ينتهي الخلاف الزوجي المعتاد بينكما؟',
        options: [
          { text: 'بجلسة مودة وتفاهم واعتذار لطيف من المخطئ', score: 3 },
          { text: 'يمر الوقت وتبرد المشكلة دون تفكيك أصلها', score: 2 },
          { text: 'بصمت عقابي يمتد لأيام وفتور واستنزاف نفسي', score: 1 },
        ]
      },
      {
        text: 'ما هو حضور التقدير والامتنان اللفظي في يومكما؟',
        options: [
          { text: 'نعبر عن الشكر والامتنان لما يبذله الآخر باستمرار', score: 3 },
          { text: 'نقدر داخلياً ولكن يقل التعبير المباشر', score: 2 },
          { text: 'التركيز دائم على التقصير والنواقص والطلبات فقط', score: 1 },
        ]
      },
      {
        text: 'هل تشعر أن شريكك يفهم احتياجاتك العاطفية دون الحاجة لتكرار الشكوى؟',
        options: [
          { text: 'نعم، هناك التقاط ذكي واستجابة محبة', score: 3 },
          { text: 'يفهم في بعض الأوقات ويغفل في أوقات أخرى', score: 2 },
          { text: 'إحباط مستمر وشعور بأني أعيش بمفردي في العلاقة', score: 1 },
        ]
      },
      {
        text: 'إلى أي مدى تتمتعان بمرونة في تقبل طباع الآخر وعيوبه غير المؤذية؟',
        options: [
          { text: 'نتقبل الفروق برفق وروح دعابة وتفهم للفطرة', score: 3 },
          { text: 'نحاول التأقلم مع وجود بعض التذمر', score: 2 },
          { text: 'محاولات يومية مستميتة لتغيير الآخر وإجباره على التوافق', score: 1 },
        ]
      }
    ],
    getResult: (score) => {
      if (score >= 13) {
        return {
          level: 'أمان وجداني متين وسكن حقيقي',
          summary: 'بيتكما يتمتع بميثاق سكينة أصيل. الأمان العاطفي حاضر بقوة، وهو الدرع الأكبر لحماية البيت من نوائب الدهر.',
          advice: 'استمروا في تغذية هذه الشجرة بالكلمة الطيبة والاهتمام اليومي غير المشروط.'
        };
      } else if (score >= 9) {
        return {
          level: 'رصيد مودة طيب يحتاج تجديد الاتصال وترميم الصمت',
          summary: 'المودة موجودة لكن فتور الروتين اليومي وتراكم العتب غير المصرح به يصنع جداراً بارداً بينكما تدريجياً.',
          advice: 'ننصح بتخصيص وقت نوعي أسبوعي دون شاشات، والاستفادة من محاور مسار «مِيثاق» لكسر الفتور.'
        };
      } else {
        return {
          level: 'استنزاف عاطفي وحاجة لتدخل إرشادي وترميم فوري',
          summary: 'الصمت العقابي والدفاعية يستنزفان أمان البيت. البقاء في هذا النمط يضر بالصحة النفسية للزوجين والأبناء.',
          advice: 'احجز جلسة إرشاد زواجي متخصصة للبدء في نزع فتيل الاحتقان وإعادة بناء الثقة المهدرة.'
        };
      }
    }
  },

  // 2. مسار الاتزان النفسي وبصيرة الذات
  {
    id: 'stress-regulation',
    trackId: 'individual',
    title: 'مقياس إدارة الضغوط وردود الفعل',
    category: 'الاتزان وبصيرة الذات',
    target: 'للأفراد (رجالاً ونساءً)',
    time: 'دقيقتان',
    questionsCount: '5 أسئلة',
    cardColor: 'from-emerald-600 to-emerald-700',
    description: 'أداة مستلهمة من فقه النفس لقياس المسافة الشعورية بين المثير والاستجابة؛ هل تتصرف بوعي ومسؤولية أم باندفاع وعفوية؟',
    questions: [
      {
        text: 'عندما تواجه موقفاً مفاجئاً أو مستفزاً، ما هو تصرفك التلقائي؟',
        options: [
          { text: 'آخذ نفساً ومسافة شعورية قبل أن أقرر الاستجابة المناسبة', score: 3 },
          { text: 'أشعر باحتقان داخلي وأحاول كبت الغضب بصعوبة', score: 2 },
          { text: 'أنفجر فوراً في رد فعل انفعالي حاد ثم أندم عليه لاحقاً', score: 1 },
        ]
      },
      {
        text: 'كيف تؤثر ضغوط العمل والحياة على تعاملك مع أهل بيتك؟',
        options: [
          { text: 'أفصل تماماً بين ضغوط الخارج وحسن خلقي داخل بيتي', score: 3 },
          { text: 'يقل صبري وأحتاج وقتاً للعزلة والهدوء', score: 2 },
          { text: 'أفرغ شحنات الغضب فيمن حولي دون ذنب منهم', score: 1 },
        ]
      },
      {
        text: 'ما هي نظرتك لمشاعرك المؤلمة كالحزن أو القلق؟',
        options: [
          { text: 'رسائل نفسية مهمة أفهم رسالتها وأتعامل مع جذورها برفق', score: 3 },
          { text: 'أحاول الهروب والتشتيت عنها بالانشغال المفرط', score: 2 },
          { text: 'أعتبرها علامة ضعف وألوم نفسي بشدة على الشعور بها', score: 1 },
        ]
      },
      {
        text: 'عند وقوع خطأ أو عثرة في حياتك، كيف تحاور نفسك داخلياً؟',
        options: [
          { text: 'بحوار رفيق ومسؤول: ما الذي أتعلمه وأصلحه الآن؟', score: 3 },
          { text: 'بانزعاج عام مع صعوبة في تجاوز الخطأ سريعاً', score: 2 },
          { text: 'بجلد ذات قاسٍ وتعميم الفشل على كامل شخصيتي', score: 1 },
        ]
      },
      {
        text: '«ومَنْ يَصِفُ لَكَ الطَّرِيقَ لَنْ يَسْلُكَهُ نِيَابَةً عَنْكَ» — كيف ترى مسؤوليتك في التغيير؟',
        options: [
          { text: 'أتحمل مسؤولية قراراتي ومشاعري وأسعى للأدوات العملية للنمو', score: 3 },
          { text: 'أدرك المسؤولية نظرياً ولكن أتردد في التطبيق العملي', score: 2 },
          { text: 'أرى دائماً أن الظروف والناس هم سبب معاناتي وعطلي', score: 1 },
        ]
      }
    ],
    getResult: (score) => {
      if (score >= 13) {
        return {
          level: 'وعي ذاتي متزن واستجابة مسؤولة',
          summary: 'لديك قدرة ممتازة على الفصل بين الذات والمشاعر، والتحرك من فقه الملاحظة دون تماهٍ مدمر.',
          advice: 'استمر في ترسيخ هذه البصيرة ومشاركة هذا الهدوء مع محيطك الأسري والمهني.'
        };
      } else if (score >= 9) {
        return {
          level: 'وعي متوسط مع الوقوع أحياناً في ردود الفعل',
          summary: 'تدرك ما يجب فعله ولكن الضغوط المتراكمة تسحبك أحياناً لكبت المشاعر أو الانفعال المؤقت.',
          advice: 'تدرب على الوقفات التأملية قبل الردود، ولا تجلد ذاتك عند الزلل فالوعي مهارة تتطور بالممارسة.'
        };
      } else {
        return {
          level: 'استنزاف انفعالي وحاجة لإعادة ترتيب البوصلة الداخلية',
          summary: 'تعيش في حلقة مفرغة من ردود الفعل العفوية وجلد الذات وإسقاط اللوم، مما يرهق طاقتك الحيوية.',
          advice: 'أنت بحاجة لمساحة آمنة لفهم جذور هذا التوتر؛ جلسة استشارة فردية ستساعدك على وضع أولى لبنات الاتزان.'
        };
      }
    }
  },
  {
    id: 'self-esteem',
    trackId: 'individual',
    title: 'مقياس تقدير الذات والأصالة النفسية',
    category: 'بصيرة الذات',
    target: 'للأفراد في مختلف المراحل',
    time: 'دقيقتان',
    questionsCount: '5 أسئلة',
    cardColor: 'from-teal-600 to-teal-700',
    description: 'يقيس مدى اعتمادك على القيمة الداخلية الفطرية في مقابل الارتهان لتقييمات وأحكام الآخرين والبحث عن القبول المرضي.',
    questions: [
      {
        text: 'إلى أي مدى ترتهن قيمتك لنظرة الناس وإعجابهم بما تفعل؟',
        options: [
          { text: 'قيمتي نابعة من صلتي بالله ورضا ضميري وسعيي الصادق', score: 3 },
          { text: 'يهمني رأي المحيطين ويتأثر مزاجي بمدحهم أو نقدهم', score: 2 },
          { text: 'أشعر بانعدام القيمة تماماً إذا لم أحصل على استحسان الآخرين', score: 1 },
        ]
      },
      {
        text: 'هل تجد صعوبة في قول كلمة «لا» للطلبات التي ترهق طاقتك؟',
        options: [
          { text: 'أقولها بلطف ووضوح احتراماً لطاقتي وحدودي', score: 3 },
          { text: 'أتحرج أحياناً وأضغط على نفسي إرضاءً لغيري', score: 2 },
          { text: 'مستحيل أن أرفض طلباً؛ أضحي براحتي وصحتي لتجنب زعل الناس', score: 1 },
        ]
      },
      {
        text: 'عندما تقارن نفسك بالآخرين على وسائل التواصل الاجتماعي، ماذا تشعر؟',
        options: [
          { text: 'أدرك أن لكل إنسان مساره وامتحانه الخاص وأفرح للخير للجميع', score: 3 },
          { text: 'أشعر ببعض الضيق المقلق الذي سرعان ما أتجاوزه', score: 2 },
          { text: 'شعور حارق بالحسرة والفشل والدونية تجاه إنجازاتهم', score: 1 },
        ]
      },
      {
        text: 'كيف تتقبل عيوبك وضعفك البشري الطبيعي؟',
        options: [
          { text: 'برفق ورحمة مع السعي المستمر للتزكية والإصلاح', score: 3 },
          { text: 'بصعوبة؛ أحاول إخفاء ضعفي دائماً', score: 2 },
          { text: 'برفض تام وجلد ذات لا يهدأ', score: 1 },
        ]
      },
      {
        text: 'هل تمنح نفسك وقتاً خاصاً للعناية النفسية والتأمل والاسترخاء؟',
        options: [
          { text: 'نعم؛ أعتبره واجباً يحفظ قدرتي على العطاء', score: 3 },
          { text: 'نادراً ما يتوفر لي وقت لذلك', score: 2 },
          { text: 'أشعر بالذنب إذا جلست دون عمل أو خدمة الآخرين', score: 1 },
        ]
      }
    ],
    getResult: (score) => {
      if (score >= 13) {
        return {
          level: 'تقدير ذاتي متزن وأصالة نفسية',
          summary: 'لديك بوصلة داخلية مطمئنة وحدود نفسية صحية تحميك من الاستنزاف والتصنع.',
          advice: 'حافظ على هذا النقاء وتذكر أن التواضع الحقيقي لا يتعارض مع احترام الذات وقيمتها.'
        };
      } else if (score >= 9) {
        return {
          level: 'حاجة لتقوية الحدود النفسية وتخفيف إرضاء الناس',
          summary: 'أنت ترهق نفسك في محاولة إرضاء الجميع على حساب راحتك، مما يجعلك عرضة للتقلبات المزاجية.',
          advice: 'تدرب على وضع حدود آمنة وتعلم أن قول «لا» لغيرك هو في الحقيقة قول «نعم» لصحتك النفسية.'
        };
      } else {
        return {
          level: 'هشاشة تقدير الذات والارتهان لأحكام الآخرين',
          summary: 'طاقتك مستنزفة بالكامل في السعي وراء القبول الخارجي، مما يفقدك الاتصال بذاتك الحقيقية.',
          advice: 'رحلة استكشاف الذات وبناء المناعة النفسية ستحررك من هذا القيد الثقيل؛ ننصح بطلب استشارة متخصصة.'
        };
      }
    }
  },

  // 3. مسار التربية واليافعين
  {
    id: 'parenting-communication',
    trackId: 'parenting',
    title: 'مقياس نمط التواصل الوالدي والتربوي',
    category: 'التربية واليافعين',
    target: 'للآباء والأمهات والمربين',
    time: 'دقيقتان',
    questionsCount: '5 أسئلة',
    cardColor: 'from-cyan-600 to-cyan-700',
    description: 'استكشاف لغتك في الحوار مع الأبناء؛ هل تبني العلاقة أولاً قبل طلب التعديل؟ وهل تميز بين شخصية الابن وسلوكه العارض؟',
    questions: [
      {
        text: 'عندما يبدر من ابنك سلوك غير مقبول (عناد، كذب، تقصير)، ما هو تركيزك الأول؟',
        options: [
          { text: 'فهم الرسالة الكامنة وراء السلوك والاحتياج غير الملبى لديه', score: 3 },
          { text: 'إيقاف السلوك سريعاً بالزجر والنصح المباشر المتكرر', score: 2 },
          { text: 'الشعور بالغضب الشديد واعتبار السلوك تحدياً شخصياً لسلطتي', score: 1 },
        ]
      },
      {
        text: 'كيف يبدو رصيد الأوقات النوعية والمرح غير المشروط مع أبنائك؟',
        options: [
          { text: 'نلتقي ونلعب ونتحاور دون أوامر أو محاسبة بانتظام', score: 3 },
          { text: 'موجود في المناسبات والعطلات ولكن يغلب عليه الانشغال', score: 2 },
          { text: 'شبه معدوم؛ كل أحاديثنا تدور حول المذاكرة والواجبات والممنوعات', score: 1 },
        ]
      },
      {
        text: 'عندما يعبر ابنك عن حزنه أو اعتراضه بحدة، كيف تكون استجابتك؟',
        options: [
          { text: 'أحتوي انفعاله وأمنحه حق التعبير ثم نناقش أسلوب الحوار', score: 3 },
          { text: 'أطالبه بالهدوء فوراً وأقدم حلولاً منطقية سريعة', score: 2 },
          { text: 'أقمعه فوراً لأن رفع الصوت قلة أدب لا تغتفر', score: 1 },
        ]
      },
      {
        text: 'ما هو التوازن في تعاملك بين الحزم التربوي والمودة؟',
        options: [
          { text: 'حزم رفيق: قواعد واضحة وثابتة مع حب غير مشروط وغير مقايض', score: 3 },
          { text: 'تذبذب بين الشدة المفرطة ثم التدليل الزائد للتعويض عن الذنب', score: 2 },
          { text: 'شدة وقسوة مستمرة لاعتقادي أن أي مودة زائدة تفسد الأبناء', score: 1 },
        ]
      },
      {
        text: 'إلى أي مدى يثق ابنك في إخبارك بأخطائه دون خوف من العقاب العنيف؟',
        options: [
          { text: 'يلجأ إليّ أولاً لعلمه بأني سأساعده على حل المشكلة وتجاوزها', score: 3 },
          { text: 'يتردد كثيراً ويخفي بعض التفاصيل حتى يطمئن لرد فعلي', score: 2 },
          { text: 'يخفي تماماً ويكذب خوفاً من الفضيحة واللوم والضرب', score: 1 },
        ]
      }
    ],
    getResult: (score) => {
      if (score >= 13) {
        return {
          level: 'علاقة تربوية راشدة ونموذج آمن',
          summary: 'تبني علاقتك مع أبنائك على قاعدة متينة: «العلاقة أولاً قبل الطلب»، وتدرك أن السلوك رسالة تفصح عما يحتاجه الابن.',
          advice: 'استمر في تقديم هذا النموذج الآمن، خاصة في مرحلة المراهقة والتحولات السريعة في الهوية.'
        };
      } else if (score >= 9) {
        return {
          level: 'نية طيبة تحتاج مزيداً من الإنصات وتخفيف النقد',
          summary: 'حبك لأبنائك عظيم ولكن النصح المتواصل والانتقاد اليومي يقلل من فاعلية التأثير ويضع جداراً خفياً من الحذر.',
          advice: 'زِد من رصيد الاستماع والإنصات دون مقاطعة، واطرح أسئلة تفكيرية بدلاً من الأوامر المباشرة.'
        };
      } else {
        return {
          level: 'خطر حدوث قطيعة شعورية وحاجة لتصحيح النمط التربوي',
          summary: 'أسلوب التربية المعتمد على الخوف وردود الفعل الحادة يدفع الأبناء للكذب أو العناد الشديد أو الانطواء.',
          advice: 'التربية بالحب والحزم أسهل وأبقى؛ استشر متخصصاً لإعادة بناء الثقة قبل أن تتسع الفجوة في مرحلة البلوغ.'
        };
      }
    }
  },
  {
    id: 'teen-adjustment',
    trackId: 'parenting',
    title: 'مقياس التكيف السلوكي والنفسي لليافعين',
    category: 'التربية واليافعين',
    target: 'لليافعين (12-18 سنة) ولأولياء أمورهم',
    time: 'دقيقتان',
    questionsCount: '5 أسئلة',
    cardColor: 'from-blue-600 to-blue-700',
    description: 'مستلهم من أدلة المقاييس المدرسية والعيادية؛ يقيس مستوى التكيف مع التغيرات الجسدية والانفعالية وضغوط الأقران والشاشات.',
    questions: [
      {
        text: 'كيف يتعامل اليافع مع التغيرات الجسدية والمزاجية السريعة في البلوغ؟',
        options: [
          { text: 'بفهم وتقبل واطمئنان بفضل التوعية الأسرية الهادئة', score: 3 },
          { text: 'ببعض الخجل والارتباك مع تقلبات مزاجية بين الحين والآخر', score: 2 },
          { text: 'بانطواء شديد، عصبية مفرطة، أو كره للمظهر والذات', score: 1 },
        ]
      },
      {
        text: 'ما هو تأثير مجموعة الأصدقاء والأقران على قراراته وقيمه؟',
        options: [
          { text: 'أصدقاء إيجابيون مع قدرته على اتخاذ قراره المستقل', score: 3 },
          { text: 'يتأثر أحياناً بآرائهم ويحاول مجاراتهم لنيل القبول', score: 2 },
          { text: 'تبعية عمياء للأقران وخوف شديد من مخالفة مجموعتهم', score: 1 },
        ]
      },
      {
        text: 'كيف تصف علاقة اليافع بالشاشات والهواتف والألعاب الإلكترونية؟',
        options: [
          { text: 'استخدام متزن بضوابط وأولويات محددة وواضحة', score: 3 },
          { text: 'استخدام زائد يسبب بعض الخلافات عند طلب إيقافه', score: 2 },
          { text: 'إدمان شبه كامل، عصبية شديدة عند سحبه، وإهمال للدراسة والنوم', score: 1 },
        ]
      },
      {
        text: 'ما هي قدرة اليافع على التعبير اللفظي عما يغضبه دون تكسير أو صراخ؟',
        options: [
          { text: 'يعبر بكلمات واضحة ويطلب المساعدة عند الحاجة', score: 3 },
          { text: 'يغلق باب غرفته ويلتزم الصمت لبعض الوقت ثم يهدأ', score: 2 },
          { text: 'نوبات غضب عارمة، إيذاء ذات، أو إتلاف للأشياء', score: 1 },
        ]
      },
      {
        text: 'هل يمتلك اليافع أهدافاً أو هوايات شخصية يشعر بالشغف والمسؤولية نحوها؟',
        options: [
          { text: 'نعم؛ لديه اهتمامات ومشاريع وهوايات يمارسها بانتظام', score: 3 },
          { text: 'يبدأ بعض الأنشطة ثم يتكاسل عنها سريعاً', score: 2 },
          { text: 'فراغ تام، غياب للحافز، وشعور دائم بالملل واللاجدوى', score: 1 },
        ]
      }
    ],
    getResult: (score) => {
      if (score >= 13) {
        return {
          level: 'تكيف نفسي وسلوكي متميز ومناعة عالية',
          summary: 'يمر اليافع بمرحلة نمو صحية ومتزنة مع وعي ذاتي ودعم أسري متين يجعله قادراً على مواجهة ضغوط المرحلة.',
          advice: 'استمروا في تعزيز شعلة الشغف والمسؤولية الذاتية وتوفير مساحات للتعبير والمبادرة.'
        };
      } else if (score >= 9) {
        return {
          level: 'تحديات مراهقة عادية تحتاج توجيهاً وشراكة',
          summary: 'السلوكيات الظاهرة هي تقلبات طبيعية للبلوغ ولكن إهمالها أو مواجهتها بالعناد قد يحولها إلى أزمة مستمرة.',
          advice: 'التحق ببرنامج «مِساحة» لليافعين والآباء لامتلاك أدوات الحوار والمصاحبة الآمنة.'
        };
      } else {
        return {
          level: 'مؤشرات قلق نفسي وسلوكي تستدعي تدخلاً إرشادياً',
          summary: 'الانطواء الشديد أو نوبات الغضب أو الانغماس المفرط في الشاشات هي صرخات استغاثة غير معلنة من اليافع.',
          advice: 'جلسة إرشاد يافعين وتربية متخصصة ستساعدكم على فهم لغز السلوك واستعادة التواصل قبل تفاقم العزلة.'
        };
      }
    }
  }
];

export default function SelfAssessments() {
  const [selectedTrack, setSelectedTrack] = useState<'all' | 'marital' | 'individual' | 'parenting'>('all');
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const filteredAssessments = selectedTrack === 'all'
    ? assessmentsList
    : assessmentsList.filter(a => a.trackId === selectedTrack);

  const startAssessment = (assessment: Assessment) => {
    setActiveAssessment(assessment);
    setCurrentIndex(0);
    setAnswers([]);
    setShowResult(false);
  };

  const handleSelectOption = (score: number) => {
    const nextAnswers = [...answers, score];
    setAnswers(nextAnswers);

    if (activeAssessment && currentIndex + 1 < activeAssessment.questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetAssessment = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setShowResult(false);
  };

  const closeModal = () => {
    setActiveAssessment(null);
    setCurrentIndex(0);
    setAnswers([]);
    setShowResult(false);
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);

  return (
    <section id="assessments" className="py-20 px-4 sm:px-6 bg-[#0E1318] dark:bg-[#0E1318] bg-[#F4F7F9] border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 transition-colors">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* ترويسة القسم وإخلاء المسؤولية المقتبس من تجربة لبيه ود. أحمد أبو أسعد */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 dark:bg-slate-800/60 bg-white border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs font-bold text-accent-500 shadow-xs">
            <Compass className="w-3.5 h-3.5" />
            <span>مقاييس التبصر بالذات</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-100 dark:text-slate-100 text-slate-900 tracking-tight">
            المقاييس النفسية والتربوية المصنفة
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
            مقاييس ذاتية تأملية مقسمة حسب مساراتنا الثلاثة، مستلهمة من أدلة المقاييس النفسية للدكتور أحمد أبو أسعد ومؤصلة بفقه النفس والقرآن.
          </p>

          {/* صندوق التعليمات وإخلاء المسؤولية الرسمي (مثل لبيه تماماً) */}
          <div className="p-4 rounded-2xl bg-slate-800/40 dark:bg-slate-800/40 bg-white border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-right space-y-1 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-accent-500">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>لأن صحتك النفسية واستقرار بيتك غاليان؛ تعرف على مستواك بدقة:</span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 text-slate-500 leading-relaxed pr-6">
              <strong>تنويه مهني:</strong> هذه الاختبارات أدوات إرشادية وتأملية ذاتية وليست أداة تشخيص طبي نهائي أو بديلاً عن استشارة الطبيب أو المعالج النفسي المتخصص.
            </p>
          </div>
        </div>

        {/* أزرار الفلترة حسب المسارات الثلاثة */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setSelectedTrack('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              selectedTrack === 'all'
                ? 'bg-accent-500 text-white'
                : 'bg-slate-800/60 dark:bg-slate-800/60 bg-white text-slate-300 dark:text-slate-300 text-slate-700 hover:bg-slate-700/60'
            }`}
          >
            جميع المقاييس (6)
          </button>
          <button
            onClick={() => setSelectedTrack('marital')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              selectedTrack === 'marital'
                ? 'bg-accent-500 text-white'
                : 'bg-slate-800/60 dark:bg-slate-800/60 bg-white text-slate-300 dark:text-slate-300 text-slate-700 hover:bg-slate-700/60'
            }`}
          >
            مسار الزواج والأسرة
          </button>
          <button
            onClick={() => setSelectedTrack('individual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              selectedTrack === 'individual'
                ? 'bg-accent-500 text-white'
                : 'bg-slate-800/60 dark:bg-slate-800/60 bg-white text-slate-300 dark:text-slate-300 text-slate-700 hover:bg-slate-700/60'
            }`}
          >
            مسار الاتزان وبصيرة الذات
          </button>
          <button
            onClick={() => setSelectedTrack('parenting')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              selectedTrack === 'parenting'
                ? 'bg-accent-500 text-white'
                : 'bg-slate-800/60 dark:bg-slate-800/60 bg-white text-slate-300 dark:text-slate-300 text-slate-700 hover:bg-slate-700/60'
            }`}
          >
            مسار التربية وسلوك اليافعين
          </button>
        </div>

        {/* شبكة بطاقات المقاييس المتماثلة هندسياً (Strict Symmetry) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((item) => (
            <div
              key={item.id}
              className="h-full flex flex-col justify-between p-7 rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 hover:border-slate-700 dark:hover:border-slate-700 hover:border-slate-300 transition-all shadow-sm hover:shadow-md text-right group"
            >
              <div className="space-y-4">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-accent-500/10 text-accent-500 border border-accent-500/20">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                    <span>⏱ {item.time}</span>
                    <span>•</span>
                    <span>{item.questionsCount}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-100 dark:text-slate-100 text-slate-900 group-hover:text-accent-500 transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 text-slate-500 mt-1 block">
                    الفئة المستهدفة: {item.target}
                  </span>
                </div>

                <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed min-h-[55px] font-normal">
                  {item.description}
                </p>

                <div className="pt-3 border-t border-slate-800/60 dark:border-slate-800/60 border-slate-100 text-[11px] text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>نتيجة فورية وقراءة تحليلية واعية وتوصية عملية</span>
                </div>

              </div>

              <div className="pt-6">
                <button
                  onClick={() => startAssessment(item)}
                  className="w-full py-3 bg-slate-800/80 dark:bg-slate-800/80 bg-slate-100 hover:bg-accent-500 dark:hover:bg-accent-500 hover:text-white dark:hover:text-white text-slate-200 dark:text-slate-200 text-slate-800 text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2 group-hover:bg-accent-500 group-hover:text-white"
                >
                  <span>ابدأ المقياس الذاتي</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* نافذة خوض المقياس التفاعلية (Assessment Interactive Modal) */}
      {activeAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn text-right">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-700 dark:border-slate-700 border-slate-200 p-6 sm:p-8 text-slate-100 dark:text-slate-100 text-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            {!showResult ? (
              <div className="space-y-6">
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-accent-500 font-bold">
                    <span>{activeAssessment.title}</span>
                    <span>السؤال {currentIndex + 1} من {activeAssessment.questions.length}</span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-800 dark:bg-slate-800 bg-slate-200 overflow-hidden">
                    <div 
                      className="h-full bg-accent-500 transition-all duration-300"
                      style={{ width: `${((currentIndex + 1) / activeAssessment.questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="py-2">
                  <h4 className="text-base sm:text-lg font-bold text-slate-100 dark:text-slate-100 text-slate-900 leading-snug">
                    {activeAssessment.questions[currentIndex].text}
                  </h4>
                </div>

                <div className="space-y-3">
                  {activeAssessment.questions[currentIndex].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(opt.score)}
                      className="w-full p-4 rounded-2xl bg-slate-800/60 dark:bg-slate-800/60 bg-slate-50 hover:bg-accent-500/10 dark:hover:bg-accent-500/10 hover:border-accent-500 border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs sm:text-sm font-medium text-slate-200 dark:text-slate-200 text-slate-800 transition-all text-right flex items-center justify-between gap-3 group"
                    >
                      <span>{opt.text}</span>
                      <span className="w-5 h-5 rounded-full border border-slate-600 group-hover:border-accent-500 group-hover:bg-accent-500 shrink-0 flex items-center justify-center text-[10px] text-white">
                        ✓
                      </span>
                    </button>
                  ))}
                </div>

                <div className="text-[11px] text-slate-400 text-center pt-2">
                  اختر الإجابة الأقرب لواقعك اليومي الحقيقي للحصول على أدق نتيجة.
                </div>

              </div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-500 flex items-center justify-center mx-auto text-2xl font-black">
                    ✨
                  </div>
                  <span className="text-xs font-bold text-accent-500 uppercase tracking-wider block">
                    نتيجة التقييم الذاتي
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-100 dark:text-slate-100 text-slate-900">
                    {activeAssessment.getResult(totalScore).level}
                  </h3>
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/60 dark:bg-slate-800/60 bg-slate-50 border border-slate-700/60 dark:border-slate-700/60 border-slate-200 space-y-3 text-xs leading-relaxed">
                  <div>
                    <span className="font-bold text-accent-500 block mb-1">القراءة النفسية والتأمل:</span>
                    <p className="text-slate-300 dark:text-slate-300 text-slate-700">
                      {activeAssessment.getResult(totalScore).summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 dark:border-slate-700/60 border-slate-200">
                    <span className="font-bold text-emerald-400 block mb-1">التوصية والخطوة القادمة:</span>
                    <p className="text-slate-300 dark:text-slate-300 text-slate-700">
                      {activeAssessment.getResult(totalScore).advice}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <a
                    href="#booking"
                    onClick={closeModal}
                    className="w-full py-3.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 text-center"
                  >
                    <span>حجز موعد استشاري لمناقشة النتائج</span>
                    <ArrowLeft className="w-4 h-4" />
                  </a>

                  <button
                    onClick={resetAssessment}
                    className="w-full py-3 bg-slate-800/80 dark:bg-slate-800/80 bg-slate-100 text-slate-300 dark:text-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-700 transition flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة خوض المقياس</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
