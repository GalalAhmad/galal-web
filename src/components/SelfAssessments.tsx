'use client';

import React, { useState } from 'react';
import { Compass, CheckCircle2, ArrowLeft, X, RotateCcw, Sparkles, HeartHandshake, ShieldAlert, Users } from 'lucide-react';

interface Question {
  text: string;
  options: { text: string; score: number }[];
}

interface Assessment {
  id: string;
  title: string;
  category: string;
  target: string;
  time: string;
  description: string;
  icon: any;
  questions: Question[];
  getResult: (score: number) => { level: string; summary: string; advice: string };
}

const assessments: Assessment[] = [
  {
    id: 'marital',
    title: 'مقياس الاستقرار والاتصال الزواجي',
    category: 'العلاقات الزوجية والمقبلون',
    target: 'للمتزوجين والمقبلين على الزواج',
    time: 'دقيقتان',
    description: 'فحص ذاتي تأملي يقيس مدى حضور الأمان الوجداني، كفاءة إدارة الخلافات، والقدرة على التعبير عن الاحتياج دون دفاعية أو صمت عقابي.',
    icon: HeartHandshake,
    questions: [
      {
        text: 'عندما يقع خلاف بينكما، ما هو النمط الأغلب الذي يتكرر؟',
        options: [
          { text: 'نتحاور بهدوء ونركز على فهم المشكلة دون تجريح', score: 3 },
          { text: 'يحدث بعض التوتر وعلو الصوت ثم نهدأ تدريجياً', score: 2 },
          { text: 'نلجأ إلى الصمت العقابي، الانسحاب، أو تبادل الاتهامات', score: 1 },
        ]
      },
      {
        text: 'إلى أي مدى تشعر بالأمان للتعبير عن ضعفك أو مخاوفك لشريكك؟',
        options: [
          { text: 'أمان كامل؛ شريكي ملاذ آمن لا يسخر من مشاعري', score: 3 },
          { text: 'أمان متوسط؛ أتردد أحياناً خشية أن يُفهم كلامي خطأ', score: 2 },
          { text: 'ضعيف جداً؛ أتحفظ خشية استغلال ضعفي في خلافات لاحقة', score: 1 },
        ]
      },
      {
        text: 'كيف تتعاملان مع الفروق في الطباع والاهتمامات الشخصية؟',
        options: [
          { text: 'نتقبل الفروق ونعتبرها ثراءً مكملاً لبعضنا البعض', score: 3 },
          { text: 'نحاول التكيف معها بصعوبة في بعض الملفات', score: 2 },
          { text: 'نحاول دائماً تغيير الآخر وإجباره على التوافق معنا', score: 1 },
        ]
      },
      {
        text: 'ما هو مستوى وضوح التوقعات والمسؤوليات المشتركة داخل البيت؟',
        options: [
          { text: 'واضحة ومتفق عليها بالتراضي والاحترام', score: 3 },
          { text: 'شبه واضحة وتحدث بشأنها تباينات دورية', score: 2 },
          { text: 'غائمة وتسبب إحباطاً متراكماً وشعوراً بالظلم', score: 1 },
        ]
      },
      {
        text: 'هل تشعران بالامتنان والتقدير المتبادل لما يبذله كل طرف؟',
        options: [
          { text: 'نعم، نعبر عن التقدير والشكر بانتظام قولا وفعلا', score: 3 },
          { text: 'نقدر داخلياً ولكن يقل التعبير اللفظي المباشر', score: 2 },
          { text: 'نادراً؛ التركيز الأكبر يكون على النواقص والتقصير', score: 1 },
        ]
      }
    ],
    getResult: (score: number) => {
      if (score >= 13) {
        return {
          level: 'اتصال وجداني ناضج وأمان عالٍ',
          summary: 'تتمتع علاقتكما بأساس متين من الأمان النفسي والقبول المتبادل. الخلافات واردة ولكن لغتكم في تفكيكها تحمي استقرار البيت.',
          advice: 'حافظوا على هذا الاستثمار اليومي في المودة، واحرصوا على تجديد معاني الميثاق بانتظام لحماية هذه النعمة من الفتور العادي.'
        };
      } else if (score >= 9) {
        return {
          level: 'استقرار نسبي يحتاج حواراً وتفكيكاً للتوقعات',
          summary: 'العلاقة قائمة على المودة العامة ولكن ثمة مساحات من الصمت أو سوء الفهم المتكرر الذي قد يولد احتقاناً تراكمياً إذا لم يُعالج.',
          advice: 'ننصح بتخصيص جلسات حوار هادئة قائمة على الاستماع الصادق دون دفاعية، أو الاستفادة من محاور برنامج «مِيثاق» لترميم شروخ الاتصال.'
        };
      } else {
        return {
          level: 'حاجة ملحة لترميم جسور الثقة والأمان',
          summary: 'تشير إجاباتك إلى وجود نمط استنزافي من الصمت العقابي أو الدفاعية يهدد السكينة الزوجية ويجعل البيت في حالة تأهب وقلق مستمر.',
          advice: 'البقاء في ردود الفعل يفاقم الأزمة؛ نوصي بطلب جلسة استشارية متخصصة (فردية أو مشتركة) لإعادة بناء الأمان الوجداني وإيقاف نزيف المشاعر.'
        };
      }
    }
  },
  {
    id: 'stress',
    title: 'مقياس إدارة الضغوط وردود الفعل',
    category: 'الاتزان وبصيرة الذات',
    target: 'للأفراد (رجالاً ونساءً)',
    time: 'دقيقتان',
    description: 'أداة لاستكشاف مدى قدرتك على إيقاف ردود الفعل الاندفاعية، وأخذ مسافة شعورية للتحرك من الوعي والمسؤولية بدلاً من الانفعال.',
    icon: Compass,
    questions: [
      {
        text: 'عندما تواجه موقفاً مستفزاً أو غير متوقع، ما هو تصرفك التلقائي؟',
        options: [
          { text: 'آخذ نفساً ومسافة شعورية قبل أن أقرر الاستجابة المناسبة', score: 3 },
          { text: 'أشعر بالغليان الداخلي وأحاول كبت المشاعر بالقوة', score: 2 },
          { text: 'أنفجر فوراً في رد فعل حاد ثم أندم عليه لاحقاً', score: 1 },
        ]
      },
      {
        text: 'عندما تتعرض لضغط عمل أو مسؤوليات متراكمة، كيف تؤثر على علاقاتك؟',
        options: [
          { text: 'أفصل بين ضغط العمل ومعاملتي لأهل بيتي ومن حولي', score: 3 },
          { text: 'يصبح صبري أقصر قليلاً وأحتاج وقتاً للعزلة', score: 2 },
          { text: 'أفرغ شحنات التوتر في أقرب الناس إلي دون وعي', score: 1 },
        ]
      },
      {
        text: 'ما هي نظرتك للمشاعر الصعبة مثل الخوف أو الحزن أو القلق؟',
        options: [
          { text: 'رسائل نفسية مهمة أفهم رسالتها وأتعامل مع سببها الجذري', score: 3 },
          { text: 'أحاول التشتيت والهروب منها بالانشغال الدائم', score: 2 },
          { text: 'أعتبرها علامة ضعف وألوم نفسي على الشعور بها', score: 1 },
        ]
      },
      {
        text: 'عند ارتكاب خطأ أو مواجهة فشل مؤقت، كيف تحاور ذاتك داخلياً؟',
        options: [
          { text: 'بحوار رفيق ناصح: ما الذي يمكنني تعلمه وتصحيحه الآن؟', score: 3 },
          { text: 'بشعور بالانزعاج العام مع صعوبة في تجاوز الأمر سريعاً', score: 2 },
          { text: 'بجلد ذات قاسٍ وتعميم الفشل على كامل شخصيتي', score: 1 },
        ]
      },
      {
        text: '«ومَنْ يَصِفُ لَكَ الطَّرِيقَ لَنْ يَسْلُكَهُ نِيَابَةً عَنْكَ» — كيف ترى مسؤوليتك في التغيير؟',
        options: [
          { text: 'أتحمل مسؤولية اختياراتي ومشاعري وأسعى للأدوات العملية', score: 3 },
          { text: 'أدرك المسؤولية نظرياً ولكن أتردد في الخطوات التطبيقية', score: 2 },
          { text: 'أشعر أن الظروف ومن حولي هم السبب في معاناتي دائماً', score: 1 },
        ]
      }
    ],
    getResult: (score: number) => {
      if (score >= 13) {
        return {
          level: 'وعي ذاتي متزن واستجابة مسؤولة',
          summary: 'لديك قدرة ممتازة على أخذ مسافة بين المثير والاستجابة، ومعاملة مشاعرك كإشارات ورسائل دون التماهي المدمر معها.',
          advice: 'استمر في تعميق هذا الاتزان وتطبيق فقه النفس في تفاصيل يومك لدعم من حولك بحضورك الهادئ المطمئن.'
        };
      } else if (score >= 9) {
        return {
          level: 'وعي متوسط مع الوقوع أحياناً في دوامة ردود الفعل',
          summary: 'تدرك ما يجب فعله ولكن الضغوط المتراكمة تسحبك أحياناً إلى الاستنزاف، أو كبت المشاعر بدلاً من تفكيكها السليم.',
          advice: 'ركز على التدرب على الوقفات التأملية قبل الردود، ولا تجلد ذاتك عند الزلل؛ فالوعي مهارة تُبنى بالممارسة المستمرة.'
        };
      } else {
        return {
          level: 'استنزاف انفعالي وحاجة ملحة لترتيب البوصلة الداخلية',
          summary: 'تعيش في حالة من ردود الفعل المتلاحقة وجلد الذات أو إسقاط اللوم، مما يرهق طاقتك النفسية والجسدية ويعطل اتزانك.',
          advice: 'أنت بحاجة إلى مساحة آمنة لتفريغ هذا الركام وفهم جذور الانفعال. جلسة استشارية نفسية ستساعدك على وضع أولى لبنات الاستقرار الذاتي.'
        };
      }
    }
  },
  {
    id: 'parenting',
    title: 'مقياس نمط التواصل الوالدي والتربوي',
    category: 'التربية واليافعين',
    target: 'للآباء والأمهات والمربين',
    time: 'دقيقتان',
    description: 'استكشاف لغتك في الحوار مع الأبناء؛ هل تبني العلاقة أولاً قبل طلب التعديل؟ وهل تميز بين شخصية الابن وسلوكه العارض؟',
    icon: Users,
    questions: [
      {
        text: 'عندما يبدر من ابنك سلوك غير مقبول (عناد، كذب، تقصير)، ما هو تركيزك الأول؟',
        options: [
          { text: 'فهم الرسالة الكامنة وراء السلوك والاحتياج غير الملبى', score: 3 },
          { text: 'إيقاف السلوك سريعاً بالزجر والنصح المباشر', score: 2 },
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
          { text: 'أحتوي انفعاله وأمنحه حق التعبير ثم نناقش الأسلوب المناسب', score: 3 },
          { text: 'أطالبه بالهدوء فوراً وأقدم حلولاً منطقية سريعة', score: 2 },
          { text: 'أقمعه فوراً لأن رفع الصوت قلة احترام لا تغتفر', score: 1 },
        ]
      },
      {
        text: 'ما هو التوازن في تعاملك بين الحزم التربوي والمودة؟',
        options: [
          { text: 'حزم رفيق: قواعد واضحة وثابتة مع حب غير مشروط وغير مقايض', score: 3 },
          { text: 'تذبذب أحياناً بين القسوة الزائدة ثم الإفراط في التدليل للتعويض', score: 2 },
          { text: 'شدة مستمرة لاعتقادي أن أي مودة زائدة تفسد الأبناء', score: 1 },
        ]
      },
      {
        text: 'إلى أي مدى يثق ابنك في إخبارك بأخطائه دون خوف من العقاب العنيف؟',
        options: [
          { text: 'يلجأ إليّ أولاً لعلمه بأني سأساعده على حل المشكلة', score: 3 },
          { text: 'يتردد كثيراً ويخفي بعض التفاصيل حتى يطمئن لرد فعلي', score: 2 },
          { text: 'يخفي تماماً ويكذب خوفاً من العقاب أو الفضيحة واللوم', score: 1 },
        ]
      }
    ],
    getResult: (score: number) => {
      if (score >= 13) {
        return {
          level: 'علاقة تربوية راشدة وحزم رفيق',
          summary: 'تبني علاقتك مع أبنائك على قاعدة متينة: «العلاقة قبل الطلب»، وتدرك أن السلوك رسالة تفصح عما يحتاجه الطفل أو اليافع.',
          advice: 'استمر في تقديم هذا النموذج الآمن، خاصة في مرحلة المراهقة والتحولات السريعة في الهوية.'
        };
      } else if (score >= 9) {
        return {
          level: 'نية طيبة تحتاج مزيداً من ضبط لغة الحوار وتخفيف النقد',
          summary: 'حبك لأبنائك عظيم ولكن النصح المتواصل والانتقاد المتكرر يقلل من فاعلية التأثير ويضع جداراً خفياً من الحذر بينهم وبينك.',
          advice: 'زِد من رصيد الاستماع والإنصات دون مقاطعة، وحول بعض التوجيهات إلى أسئلة حوارية تحفز تفكيرهم.'
        };
      } else {
        return {
          level: 'خطر حدوث قطيعة شعورية وحاجة لتصحيح النمط التربوي',
          summary: 'أسلوب التربية الحالي يعتمد على الخوف وردود الفعل الحادة، مما قد يدفع الأبناء للكذب أو العناد الشديد أو الانطواء.',
          advice: 'التربية بالحب والحزم أسهل وأبقى؛ استشر متخصصاً لإعادة بناء الثقة قبل أن تتسع الفجوة في مرحلة البلوغ.'
        };
      }
    }
  }
];

export default function SelfAssessments() {
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

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
    <section id="assessments" className="py-20 px-4 sm:px-6 bg-[#11161D] dark:bg-[#11161D] bg-slate-50 border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 transition-colors">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* ترويسة القسم */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 dark:bg-slate-800/60 bg-white border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs font-bold text-accent-500 shadow-xs">
            <Compass className="w-3.5 h-3.5" />
            <span>وعي وتبصر بالذات</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-100 dark:text-slate-100 text-slate-900 tracking-tight">
            مقاييس التبصر بالذات والوعي النفسي
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
            أدوات تقييمية ذاتية مبسطة وسرية مستلهمة من فقه النفس وتصحيح المفاهيم، تعينك على فحص بوصلتك العاطفية والتربوية في دقيقتين.
          </p>
        </div>

        {/* شبكة المقاييس الثلاثة المتماثلة بدقة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {assessments.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="h-full flex flex-col justify-between p-7 rounded-3xl bg-[#161C24] dark:bg-[#161C24] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 hover:border-slate-700 dark:hover:border-slate-700 hover:border-slate-300 transition-all shadow-sm hover:shadow-md text-right group"
              >
                <div className="space-y-4">
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-accent-500/10 text-accent-500 border border-accent-500/20">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      ⏱ {item.time}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-100 dark:text-slate-100 text-slate-900 group-hover:text-accent-500 transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400 text-slate-500 mt-1 block">
                      الفئة المستهدفة: {item.target}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 dark:text-slate-300 text-slate-600 leading-relaxed min-h-[60px]">
                    {item.description}
                  </p>

                  <div className="pt-3 border-t border-slate-800/60 dark:border-slate-800/60 border-slate-100 text-[11px] text-slate-400 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>5 أسئلة تأملية سريعة بنتيجة وتحليل فوري</span>
                  </div>

                </div>

                <div className="pt-6">
                  <button
                    onClick={() => startAssessment(item)}
                    className="w-full py-3 bg-slate-800 dark:bg-slate-800 bg-slate-100 hover:bg-accent-500 dark:hover:bg-accent-500 hover:text-white dark:hover:text-white text-slate-200 dark:text-slate-200 text-slate-800 text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2"
                  >
                    <span>ابدأ المقياس الذاتي</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* نافذة المقياس التفاعلية (Assessment Interactive Modal) */}
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
              /* وضع الأسئلة */
              <div className="space-y-6">
                
                {/* Header & Step Tracker */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-accent-500 font-bold">
                    <span>{activeAssessment.title}</span>
                    <span>السؤال {currentIndex + 1} من {activeAssessment.questions.length}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-800 dark:bg-slate-800 bg-slate-200 overflow-hidden">
                    <div 
                      className="h-full bg-accent-500 transition-all duration-300"
                      style={{ width: `${((currentIndex + 1) / activeAssessment.questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Text */}
                <div className="py-2">
                  <h4 className="text-base sm:text-lg font-bold text-slate-100 dark:text-slate-100 text-slate-900 leading-snug">
                    {activeAssessment.questions[currentIndex].text}
                  </h4>
                </div>

                {/* Options */}
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
                  اختر الإجابة الأقرب لواقعك اليومي الحقيقي دون تجميل للحصول على أدق نتيجة.
                </div>

              </div>
            ) : (
              /* وضع النتيجة والتحليل */
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

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  <a
                    href="https://calendly.com/galal3hmad/insan"
                    target="_blank"
                    rel="noopener noreferrer"
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
