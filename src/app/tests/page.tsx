'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Sparkles, 
  Search, 
  Clock, 
  ShieldAlert, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  X, 
  RefreshCw, 
  Calendar, 
  MessageCircle, 
  Brain, 
  Heart, 
  Smile, 
  Activity, 
  User, 
  Flame, 
  Users,
  Compass
} from 'lucide-react';

interface Question {
  id: number;
  text: string;
}

interface TestItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'الصحة النفسية' | 'الشخصية' | 'العلاقات والأسرة';
  duration: string;
  icon: any;
  bgLight: string;
  borderLight: string;
  bgDark: string;
  accentColor: string;
  questions: Question[];
  interpret: (score: number) => {
    level: string;
    levelColor: string;
    description: string;
    tips: string[];
  };
}

export default function PsychologicalTestsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Interactive Modal State
  const [activeTest, setActiveTest] = useState<TestItem | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);

  const tests: TestItem[] = [
    {
      id: 'depression',
      title: 'اختبار الاكتئاب',
      subtitle: 'يساعدك على تقييم الأعراض النفسية وفهم تأثيرها على المزاج والحياة اليومية.',
      category: 'الصحة النفسية',
      duration: '6 دقائق',
      icon: Activity,
      bgLight: 'bg-[#DDEAF8]/80',
      borderLight: 'border-[#C2DBF5]',
      bgDark: 'dark:bg-[#122238]',
      accentColor: '#154F9C',
      questions: [
        { id: 1, text: 'قلة الاهتمام أو انعدام المتعة في القيام بالأنشطة والهوايات المعتادة؟' },
        { id: 2, text: 'الشعور بالإحباط أو الحزن أو اليأس من تحسن الأمور؟' },
        { id: 3, text: 'صعوبة في النوم أو الاستيقاظ المتكرر، أو الإفراط الشديد في النوم؟' },
        { id: 4, text: 'الشعور بالتعب الدائم ونفاد الطاقة حتى عند بذل جهد بسيط؟' },
        { id: 5, text: 'صعوبة في التركيز أثناء العمل، القراءة، أو اتخاذ القرارات؟' }
      ],
      interpret: (score) => {
        if (score <= 4) {
          return {
            level: 'مستوى منخفض (أعراض طفيفة وطبيعية)',
            levelColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200',
            description: 'تشير إجاباتك إلى مؤشرات مزاجية مستقرة تقع ضمن التقلبات اليومية الطبيعية للإنسان.',
            tips: ['المحافظة على الروتين اليومي المتوازن', 'ممارسة الرياضة الخفيفة والمشي', 'الاهتمام بجودة النوم والتواصل الإيجابي']
          };
        } else if (score <= 9) {
          return {
            level: 'مستوى معتدل (إجهاد نفسي أو حزن متكرر)',
            levelColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200',
            description: 'قد تمر بفترة ضغوط مؤقتة أو استنزاف عاطفي يؤثر تدريجيًا على طاقتك اليومية وشغفك.',
            tips: ['التعبير عن المشاعر والتحدث مع شخص موثوق', 'تخفيف الأعباء غير الضرورية وممارسة تمارين التنفس', 'استشارة مختص لترتيب الأولويات قبل تزايد الإجهاد']
          };
        } else {
          return {
            level: 'مستوى مرتفع (أعراض واضحة تستحق الاهتمام والدعم)',
            levelColor: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200',
            description: 'تشير نتائجك إلى وطأة نفسية مؤثرة على المزاج والأداء اليومي. نوصيك بطلب دعم مهني متخصص لمساعدتك في استعادة طاقتك وتوازنك.',
            tips: ['حجز جلسة تقييم ودعم نفسي متخصص', 'عدم البقاء وحيداً ومشاركة المشاعر مع بيئة داعمة', 'تجنب لوم النفس وإدراك أن طلب المساعدة خطوة شجاعة']
          };
        }
      }
    },
    {
      id: 'anxiety',
      title: 'اختبار القلق والتوتر',
      subtitle: 'يقيّم مستوى القلق والتوتر لديك ويوضح تأثيرهما على التفكير والسلوك.',
      category: 'الصحة النفسية',
      duration: '4 دقائق',
      icon: Brain,
      bgLight: 'bg-[#FDE6E3]/80',
      borderLight: 'border-[#F9C9C2]',
      bgDark: 'dark:bg-[#2A1817]',
      accentColor: '#CC4E46',
      questions: [
        { id: 1, text: 'الشعور بالعصبية أو التوتر الداخلي وعدم القدرة على الاسترخاء؟' },
        { id: 2, text: 'عدم القدرة على التوقف عن القلق أو السيطرة على الأفكار المقلقة؟' },
        { id: 3, text: 'القلق المفرط بشأن أمور مختلفة وتوقع الأسوأ دائمًا؟' },
        { id: 4, text: 'صعوبة الاستقرار أو الشعور بالتململ والاضطراب الجسدي؟' },
        { id: 5, text: 'الشعور بالخوف المفاجئ وكأن شيئاً مروعاً قد يحدث؟' }
      ],
      interpret: (score) => {
        if (score <= 4) {
          return {
            level: 'مستوى قلق منخفض (طبيعي ومحفز)',
            levelColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200',
            description: 'مستوى القلق لديك طبيعي وصحي ويسهم في التركيز والإنجاز دون شل التفكير.',
            tips: ['استمرارية ممارسة الهوايات المريحة للأعصاب', 'أخذ فترات راحة منتظمة أثناء فترات العمل']
          };
        } else if (score <= 9) {
          return {
            level: 'مستوى قلق متوسط (توتر ذهني ملحوظ)',
            levelColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200',
            description: 'تشير النتائج إلى توتر ذهني وجسدي متزايد قد يسبب الأرق وصعوبة الاسترخاء التام.',
            tips: ['تقليل استهلاك الكافيين ومشتتات الشاشات قبل النوم', 'كتابة الأفكار المقلقة في ورقة وتحديد ما هو تحت سيطرتك', 'جلسة استشارية لتعلم استراتيجيات إدارة التوتر']
          };
        } else {
          return {
            level: 'مستوى قلق مرتفع (استنزاف عصبي يستحق التدخل)',
            levelColor: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200',
            description: 'القلق يسيطر على مساحة واسعة من يومك ويستهلك طاقتك الذهنية والجسدية بصورة ملحوظة.',
            tips: ['التواصل مع أخصائي نفسي لتعلم تقنيات العلاج المعرفي السلوكي', 'تمارين التفريغ الانفعالي والتنفس البطني العميق']
          };
        }
      }
    },
    {
      id: 'personality',
      title: 'اختبار الشخصية وأنماط التفكير',
      subtitle: 'يساعدك على اكتشاف نمط شخصيتك وطريقة تفكيرك وتفاعلك مع الآخرين.',
      category: 'الشخصية',
      duration: '7 دقائق',
      icon: User,
      bgLight: 'bg-[#ECE3FD]/80',
      borderLight: 'border-[#D9C6FB]',
      bgDark: 'dark:bg-[#1E1634]',
      accentColor: '#7C3AED',
      questions: [
        { id: 1, text: 'تفضل قضاء الوقت في التأمل والتفكير العميق بمفردك على التجمعات الصاخبة؟' },
        { id: 2, text: 'تميل إلى اتخاذ القرارات بناءً على التحليل المنطقي أم مراعاة مشاعر الآخرين؟' },
        { id: 3, text: 'تضع خططاً مسبقة ودقيقة لمهامك وتنزعج من التغييرات المفاجئة؟' },
        { id: 4, text: 'تشعر بطاقة أكبر عندما تتفاعل مع الناس وتتشارك الأفكار علناً؟' },
        { id: 5, text: 'تمتلك حساسية عالية لملاحظة التفاصيل الدقيقة التي قد يغفل عنها غيرك؟' }
      ],
      interpret: (score) => {
        return {
          level: score > 7 ? 'نمط تأملي تحليلي (عميق ومنظم)' : 'نمط ديناميكي مرن (تفاعلي وعفوي)',
          levelColor: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200',
          description: 'تتميز شخصيتك بقدرة فريدة على الموازنة بين المعطيات العقلانية والمشاعر الإنسانية، وتستفيد كثيراً من وضوح أهدافك الذاتية.',
          tips: ['استثمار نقاط قوتك في بيئة عمل متوافقة مع شخصيتك', 'قبول الاختلافات الفردية مع شركاء الحياة والعمل', 'تطوير الذكاء العاطفي لفهم الطرف الآخر']
        };
      }
    },
    {
      id: 'adhd',
      title: 'اختبار ADHD وتشتت الانتباه',
      subtitle: 'يساعدك على فهم اضطراب التركيز وفرط الحركة والأعراض الشائعة المرتبطة بها.',
      category: 'الصحة النفسية',
      duration: '3 دقائق',
      icon: Compass,
      bgLight: 'bg-[#D4F6E8]/80',
      borderLight: 'border-[#B2EED3]',
      bgDark: 'dark:bg-[#0D241C]',
      accentColor: '#168962',
      questions: [
        { id: 1, text: 'صعوبة مستمرة في إتمام المهام التي تتطلب تركيزاً طويلاً ومملًا؟' },
        { id: 2, text: 'كثرة نسيان المواعيد اليومية، والأغراض الشخصية (المفاتيح، الهاتف، المحفظة)؟' },
        { id: 3, text: 'التشتت السريع بأي مؤثر صوتي أو بصري في المحيط أثناء العمل؟' },
        { id: 4, text: 'الشعور بالتململ أو صعوبة البقاء جالساً لفترات طويلة دون حركة؟' },
        { id: 5, text: 'التأجيل والتسويف المتكرر حتى اللحظات الأخيرة الحرجة؟' }
      ],
      interpret: (score) => {
        if (score <= 5) {
          return {
            level: 'مؤشرات تركيز ضمن النطاق المعتاد',
            levelColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200',
            description: 'صعوبات التركيز لديك ناتجة غالباً عن التعب العارض أو تعدد المهام وليس اضطراباً.',
            tips: ['تقسيم المهام الكبيرة إلى أجزاء صغيرة', 'استخدام تقنية البومودورو في العمل']
          };
        } else {
          return {
            level: 'مؤشرات تستحق فحصاً تخصصياً لفرط الحركة وتشتت الانتباه',
            levelColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200',
            description: 'تشير النتيجة إلى تحديات مستمرة في تنظيم الانتباه وإدارة الوقت والاندفاعية.',
            tips: ['استشارة أخصائي لعمل تقييم إكلينيكي شامل', 'استخدام جداول مرئية وتنبيهات للتذكير الدائم']
          };
        }
      }
    },
    {
      id: 'child_wellbeing',
      title: 'كشف الحالة النفسية للأطفال',
      subtitle: 'يساعد الأهل على فهم الحالة النفسية للطفل بطريقة مبسطة ومطمئنة.',
      category: 'العلاقات والأسرة',
      duration: '5 دقائق',
      icon: Smile,
      bgLight: 'bg-[#DCF8E3]/80',
      borderLight: 'border-[#BFF0CB]',
      bgDark: 'dark:bg-[#0E2718]',
      accentColor: '#15803D',
      questions: [
        { id: 1, text: 'هل يعاني الطفل من نوبات غضب متكررة أو بكاء شديد يصعب تهدئته؟' },
        { id: 2, text: 'هل يشتكي من آلام جسدية متكررة (مثل البطن أو الصداع) قبل الذهاب للمدرسة؟' },
        { id: 3, text: 'هل يظهر تراجعاً مفاجئاً في التحصيل الدراسي أو صعوبة في تكوين صداقات؟' },
        { id: 4, text: 'هل يعاني من مخاوف مبالغ فيها من الظلام أو البعد عن الوالدين؟' },
        { id: 5, text: 'هل يظهر تغيراً في عادات الأكل أو النوم والتبول اللاإرادي؟' }
      ],
      interpret: (score) => {
        if (score <= 4) {
          return {
            level: 'استقرار نفسي عام ونمو طبيعي',
            levelColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200',
            description: 'الطفل يمر بمراحل نمو طبيعية وتصرفاته تعكس التفاعل المعتاد مع البيئة المحيطة.',
            tips: ['الحفاظ على أوقات نوعية للحوار واللعب اليومي', 'الاستماع لمشاعر الطفل دون تسفيه أو سخرية']
          };
        } else {
          return {
            level: 'مؤشرات على وجود ضغوط نفسية أو قلق لدى الطفل',
            levelColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200',
            description: 'تظهر الأعراض وجود قلق أو توتر كامن يحتاج لمزيد من الاحتواء الوالدي والاستشارة التربوية.',
            tips: ['جلسة إرشاد والدي متخصصة لفهم سلوك الطفل', 'مراقبة التغيرات في البيئة المدرسية أو الأسرية']
          };
        }
      }
    },
    {
      id: 'jealousy_women',
      title: 'اختبار الغيرة في العلاقات - للنساء',
      subtitle: 'يوضح مستوى الغيرة لديكِ وكيف يمكن أن تؤثر على العلاقات العاطفية.',
      category: 'العلاقات والأسرة',
      duration: '4 دقائق',
      icon: Heart,
      bgLight: 'bg-[#E2D5FC]/80',
      borderLight: 'border-[#CEB9F8]',
      bgDark: 'dark:bg-[#1E1736]',
      accentColor: '#6D28D9',
      questions: [
        { id: 1, text: 'تشعرين بالقلق والتوتر إذا تأخر شريك حياتك في الرد على رسائلك؟' },
        { id: 2, text: 'تميلين إلى تفتيش هاتفه أو فحص حساباته في وسائل التواصل؟' },
        { id: 3, text: 'تنزعجين إذا تحدث بإعجاب أو ثناء عن شخص آخر؟' },
        { id: 4, text: 'تشعرين بحاجة ملحة للتأكد المستمر من حبه واهتمامه بكِ؟' },
        { id: 5, text: 'تتخيلين سيناريوهات الخيانة أو الفقد وتتأثرين بها واقعياً؟' }
      ],
      interpret: (score) => {
        if (score <= 5) {
          return {
            level: 'غيرة طبيعية وصحية تعكس المحبة والاهتمام',
            levelColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200',
            description: 'غيرتك في حدودها الطبيعية التي تحافظ على العلاقة وتمنحها الدفء دون تقييد الشريك.',
            tips: ['المحافظة على الحوار الصريح والمفتوح', 'تعزيز الثقة المتبادلة']
          };
        } else {
          return {
            level: 'غيرة استنزافية قد تضغط على العلاقة وتثير الخلافات',
            levelColor: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200',
            description: 'قد تكون الغيرة نابعة من مخاوف قديمة أو شعور بعدم الأمان العاطفي أكثر من كونها وقائع ملموسة.',
            tips: ['العمل على تعزيز الاستحقاق الذاتي والأمان الداخلي', 'جلسة استشارية زوجية لبناء الثقة والحدود الآمنة']
          };
        }
      }
    },
    {
      id: 'jealousy_men',
      title: 'اختبار الغيرة في العلاقات - للرجال',
      subtitle: 'يقيّم تأثير الغيرة على المشاعر والسلوك والتواصل داخل العلاقات.',
      category: 'العلاقات والأسرة',
      duration: '4 دقائق',
      icon: Users,
      bgLight: 'bg-[#E3F9E9]/80',
      borderLight: 'border-[#BFF2CB]',
      bgDark: 'dark:bg-[#0E2818]',
      accentColor: '#16A34A',
      questions: [
        { id: 1, text: 'تشعر برغبة في السيطرة على كل تفاصيل خروج أو تواصل شريكة حياتك؟' },
        { id: 2, text: 'تغضب سريعاً إذا كان هناك أي تفاعل مهني عادي لها مع الآخرين؟' },
        { id: 3, text: 'تجد صعوبة في التعبير عن غيرتك بهدوء وتتحول تلقائياً إلى غضب أو صمت عقابي؟' },
        { id: 4, text: 'تشعر بالشك أو تطرح أسئلة تحقيقية متكررة حول يومها؟' },
        { id: 5, text: 'تخاف من فقدان مكانتك أو اهتمامها بك لصالح أي شخص أو مسؤولية أخرى؟' }
      ],
      interpret: (score) => {
        if (score <= 5) {
          return {
            level: 'غيرة متزنة قائمة على الحماية والاحترام',
            levelColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200',
            description: 'غيرتك متوازنة وتحترم حرية وكرامة شريكة حياتك في إطار المودة الشرعية.',
            tips: ['التعبير عن المشاعر بكلمات محبة مباشرة بدلاً من الحدة']
          };
        } else {
          return {
            level: 'غيرة خانقة تستوجب المراجعة لتجنب نفور الطرف الآخر',
            levelColor: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200',
            description: 'الغيرة الزائدة قد تحول العلاقة من سكن ومودة إلى ساحة مراقبة وخوف تؤذي الطرفين.',
            tips: ['التفريق بين الحماية الإيجابية والتحكم السلبي', 'استشارة أسرية لتعلم الحوار الآمن دون اتهامات']
          };
        }
      }
    },
    {
      id: 'love_languages',
      title: 'اختبار لغات الحب والتوافق العاطفي',
      subtitle: 'يساعدك على فهم مشاعرك العاطفية وطريقة ارتباطك وتعبيرك عن المودة للطرف الآخر.',
      category: 'العلاقات والأسرة',
      duration: '5 دقائق',
      icon: Heart,
      bgLight: 'bg-[#FDF1DE]/80',
      borderLight: 'border-[#F9DFC1]',
      bgDark: 'dark:bg-[#2A1F13]',
      accentColor: '#D97706',
      questions: [
        { id: 1, text: 'تشعر بالحب والتقدير أكثر عند سماع كلمات التشجيع والثناء الصادق؟' },
        { id: 2, text: 'يسعدك قضاء وقت خاص بدون شاشات أو مقاطعات للحديث المشترك؟' },
        { id: 3, text: 'المبادرة بمساعدتك في المسؤوليات اليومية تمثل لك أعلى درجات الاهتمام؟' },
        { id: 4, text: 'الهدايا الرمزية والمفاجآت تعبر لك عن تذكر الطرف الآخر لك باهتمام؟' },
        { id: 5, text: 'القرب الجسدي واللمسات الحنونة هي أسرع وسيلة لشعورك بالأمان العاطفي؟' }
      ],
      interpret: (score) => {
        return {
          level: 'اكتمل تحليل التوافق ولغات المودة',
          levelColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200',
          description: 'تتنوع لغات التعبير العاطفي لديك؛ وفهم لغتك المفضلة ولغة شريكك يمثل مفتاح سحر تجديد المودة وحل 80% من سوء الفهم اليومي.',
          tips: ['معرفة لغة الحب الأساسية لشريك حياتك والتحدث بها', 'برنامج رحلة رفق ميثاق يقدم دليلاً عملياً لإتقان لغات المودة']
        };
      }
    },
    {
      id: 'burnout',
      title: 'اختبار فقدان الشغف والاحتراق النفسي',
      subtitle: 'يساعدك على معرفة أسباب فقدان الدافعية وكيف يمكن استعادة الحماس في الحياة اليومية.',
      category: 'الشخصية',
      duration: '4 دقائق',
      icon: Flame,
      bgLight: 'bg-[#DBEEFD]/80',
      borderLight: 'border-[#B8DDFB]',
      bgDark: 'dark:bg-[#122238]',
      accentColor: '#0284C7',
      questions: [
        { id: 1, text: 'الاستيقاظ صباحاً مع شعور بثقل المسؤوليات وغياب الرغبة في بدء اليوم؟' },
        { id: 2, text: 'الشعور بالانفصال العاطفي أو التبلد تجاه الإنجازات والنجاحات السابقة؟' },
        { id: 3, text: 'السرعة في الغضب والانفعال من أبسط الطلبات أو المهام التافهة؟' },
        { id: 4, text: 'الشعور بأن ما تقدمه لا يصنع أي فارق حقيقي أو تقدير من الآخرين؟' },
        { id: 5, text: 'الرغبة المستمرة في العزلة والهروب من الالتزامات الاجتماعية والمهنية؟' }
      ],
      interpret: (score) => {
        if (score <= 5) {
          return {
            level: 'إجهاد عابر يمكن تداركه بالراحة',
            levelColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200',
            description: 'طاقتك الذهنية جيدة والشغف لم ينطفئ، بل تحتاج فقط لإجازة قصيرة وتجديد الروتين.',
            tips: ['أخذ يوم استرخاء كامل بعيداً عن العمل', 'ممارسة هواية محببة لا تتطلب إنجازاً أو منافسة']
          };
        } else {
          return {
            level: 'احتراق نفسي متقدم (فقدان شغف واستنزاف)',
            levelColor: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200',
            description: 'وصلت طاقتك النفسية إلى مرحلة الإنذار نتيجة العطاء المستمر دون شحن كافٍ.',
            tips: ['وضع حدود صارمة لبيئة العمل وعدم حمل المشاكل للمنزل', 'جلسة دعم نفسي للتعافي من متلازمة الاحتراق الحياتي']
          };
        }
      }
    }
  ];

  // Filtering tests
  const filteredTests = useMemo(() => {
    return tests.filter(test => {
      const matchCategory = activeCategory === 'الكل' || test.category === activeCategory;
      const matchSearch = test.title.includes(searchQuery) || test.subtitle.includes(searchQuery);
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  // Handle Starting a Test
  const startTest = (test: TestItem) => {
    setActiveTest(test);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
  };

  // Handle Option Click
  const handleAnswer = (value: number) => {
    const nextAnswers = [...answers, value];
    setAnswers(nextAnswers);

    if (activeTest && currentQuestionIndex < activeTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  // Reset Test
  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
  };

  // Calculate Result
  const resultData = useMemo(() => {
    if (!activeTest || !showResult) return null;
    const totalScore = answers.reduce((sum, val) => sum + val, 0);
    return activeTest.interpret(totalScore);
  }, [activeTest, showResult, answers]);

  return (
    <main className="min-h-screen bg-[#FDFCFB] dark:bg-[#0C111C] text-slate-800 dark:text-slate-100 flex flex-col antialiased selection:bg-[#154F9C]/10 selection:text-[#154F9C]">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-12 pb-10 sm:pt-16 sm:pb-14 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-b from-[#F2FBF7]/50 via-white to-transparent dark:from-[#0D261E]/20 dark:via-[#0C111C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            الاختبارات النفسية
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            صحتك النفسية تستحق الاهتمام، استكشف اختبارات نفسية موثوقة تمنحك فهماً أعمق لمشاعرك وصحتك النفسية والعلاقات الأسرية.
          </p>
        </div>
      </section>

      {/* Search & Categories Bar */}
      <section className="py-8 bg-white dark:bg-[#0E1524] border-b border-slate-100 dark:border-slate-800/60 sticky top-16 z-20 backdrop-blur-md bg-white/95 dark:bg-[#0E1524]/95">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن اختبار..."
              className="w-full pl-4 pr-10 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-black/30 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
            {['الكل', 'الصحة النفسية', 'الشخصية', 'العلاقات والأسرة'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  activeCategory === cat
                    ? 'bg-[#154F9C] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-[#1A2234] text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Clinical Disclaimer Alert Box */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121A2C] border border-slate-200/80 dark:border-slate-800 text-center flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            هذه الاختبارات أداة للتثقيف الذاتي وليست تشخيصية أو علاجية، ولا تحل محل استشارة الطبيب أو المختص النفسي.
          </span>
        </div>
      </div>

      {/* Tests Cards Grid (Pastel Arab Therapy Style) */}
      <section className="py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTests.map((test) => {
              const IconComp = test.icon;
              return (
                <div
                  key={test.id}
                  onClick={() => startTest(test)}
                  className={`p-6 rounded-3xl border ${test.bgLight} ${test.borderLight} ${test.bgDark} flex flex-col justify-between shadow-xs hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-[#154F9C] transition">
                        {test.title}
                      </h3>
                      <div className="w-8 h-8 rounded-xl bg-white/80 dark:bg-black/30 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-normal">
                      {test.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/5 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{test.duration}</span>
                    </span>

                    <span className="text-xs font-bold text-[#154F9C] dark:text-[#60A5FA] flex items-center gap-1 group-hover:translate-x-[-2px] transition">
                      <span>ابدأ الاختبار</span>
                      <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTests.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-sm">
              لم يتم العثور على اختبارات مطابقة لبحثك. جرب تصنيفاً آخر.
            </div>
          )}

        </div>
      </section>

      {/* Interactive Assessment Modal */}
      {activeTest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#121A2C] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-right overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#154F9C]/10 text-[#154F9C]">
                  {activeTest.category}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {activeTest.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveTest(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Test Content: Question vs Result */}
            {!showResult ? (
              <div>
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>السؤال {currentQuestionIndex + 1} من {activeTest.questions.length}</span>
                    <span>{Math.round(((currentQuestionIndex + 1) / activeTest.questions.length) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-[#154F9C] transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / activeTest.questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Text */}
                <div className="mb-8 min-h-[70px]">
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                    {activeTest.questions[currentQuestionIndex].text}
                  </p>
                </div>

                {/* Options (4-point scale) */}
                <div className="space-y-2.5">
                  {[
                    { label: 'أبداً أو نادراً جداً', value: 0 },
                    { label: 'أحياناً في بعض الأيام', value: 1 },
                    { label: 'غالباً لأكثر من نصف الوقت', value: 2 },
                    { label: 'دائماً وبشدة يومياً', value: 3 },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(opt.value)}
                      className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#154F9C] hover:bg-[#154F9C]/5 text-right text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 transition flex items-center justify-between group"
                    >
                      <span>{opt.label}</span>
                      <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 group-hover:border-[#154F9C] group-hover:bg-[#154F9C]" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Results View */
              <div className="space-y-6">
                
                {resultData && (
                  <>
                    <div className="text-center space-y-2">
                      <span className="text-xs font-semibold text-slate-500">نتيجة الفحص الذاتي</span>
                      <div className={`inline-block px-4 py-1.5 rounded-full border font-bold text-xs sm:text-sm ${resultData.levelColor}`}>
                        {resultData.level}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {resultData.description}
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">توصيات إرشادية مقترحة:</h4>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                        {resultData.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#154F9C] shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Actions */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <Link
                        href="/services#book"
                        onClick={() => setActiveTest(null)}
                        className="w-full py-3 px-6 rounded-full bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-[#154F9C]/20"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>احجز جلسة استشارة متخصصة مع جلال أحمد</span>
                      </Link>

                      <div className="flex items-center gap-3">
                        <a
                          href="https://wa.me/201014876666?text=مرحبًا، قمت بإجراء فحص ذاتي وأرغب في مناقشة نتائجه وحجز استشارة"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-4 rounded-full border border-slate-200 dark:border-slate-700 hover:border-[#168962] text-xs font-semibold text-slate-700 dark:text-slate-300 text-center transition flex items-center justify-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#168962]" />
                          <span>تواصل عبر واتساب</span>
                        </a>

                        <button
                          onClick={resetTest}
                          className="py-2.5 px-4 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-600 dark:text-slate-300 transition flex items-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>إعادة الاختبار</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}

              </div>
            )}

          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
