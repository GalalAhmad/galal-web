'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  BookOpen, 
  Sparkles, 
  Clock, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  Quote, 
  Compass,
  FileText
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  publishDate: string;
  summary: string;
  featured?: boolean;
  quranFoundation?: {
    ayah: string;
    surah: string;
    tafseer: string;
    insight: string;
    scientificCorrelation: string;
  };
  content: string[];
}

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const categories = [
    { id: 'all', label: 'جميع المقالات' },
    { id: 'quran', label: 'مشروع أقومية القرآن' },
    { id: 'marriage', label: 'العلاقات الزوجية والأسرة' },
    { id: 'parenting', label: 'التربية والوالدية الواعية' },
    { id: 'psychology', label: 'الصحة النفسية والاتزان' },
  ];

  const articles: Article[] = [
    {
      id: 'aqwameyat-quran-family',
      title: 'أقومية القرآن في بناء الأسرة وسواء الفطرة الإنسانية',
      category: 'quran',
      readTime: '6 دقائق قراءة',
      publishDate: 'أكتوبر 2026',
      featured: true,
      summary: 'قراءة منهجية عميقة تستلهم من هدايات القرآن الكريم الركائز الثلاث للبيت المطمئن، وتوضح كيف يتكامل الوحي مع الفهم النفسي الحديث لدوافع الإنسان.',
      quranFoundation: {
        ayah: '﴿إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ﴾',
        surah: 'سورة الإسراء: 9',
        tafseer: 'الهدى الأقوم هو الأعدل والأهدى لكل ما يحقق كمال النفس وسعادتها في المعاش والمعاد.',
        insight: 'أقومية القرآن في الأسرة ليست مجرد إطار أخلاقي، بل هي منهج وقائي متكامل يعيد ضبط فطرة الإنسان قبل أن تتشوه بتراكمات البيئة وضغوطها.',
        scientificCorrelation: 'تثبت الدراسات النفسية الحديثة في علم النفس الإيجابي وعلاج العلاقات أن المشاعر الفطرية كالمودة والسكينة هي الركيزة البيولوجية والنفسية الأقوى لاستقرار الدماغ وتقليل هرمونات التوتر المزمن.'
      },
      content: [
        'حين نتحدث عن «أقومية القرآن» في عالم النفس والتربية، فإننا لا نتحدث عن إقحام نصوص شرعية في غير موضعها، بل عن استبصار عميق لكيف خلق الله النفس البشرية وكيف وجهها نحو الصلاح.',
        'لقد وضع القرآن الكريم ثلاث ركائز كبرى للأسرة في قوله تعالى: ﴿وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً﴾: السكن، والمودة، والرحمة.',
        'السكن هو الأمان الداخلي وغياب الخوف؛ والمودة هي التعبير النشط عن الحب بالقول والفعل؛ والرحمة هي شبكة الأمان التي تحمي العلاقة حين تضعف المشاعر العاطفية أو تشتد الأزمات.',
        'المعالج النفسي والمستشار الأسري الحاذق لا يقف عند حدود تفكيك الأعراض الخارجية، بل يعين المسترشد على مطابقة سلوكه مع أصل فطرته التي فطره الله عليها، لأن الخروج عن الفطرة هو المنبع الأول للاضطراب والقلق.'
      ]
    },
    {
      id: 'behavior-as-message',
      title: 'السلوك رسالة قبل أن يكون مشكلة: فك شفرات السلوك الإنساني',
      category: 'psychology',
      readTime: '4 دقائق قراءة',
      publishDate: 'سبتمبر 2026',
      summary: 'لماذا يتصرف الإنسان أو الطفل بعدوانية أو صمت مفاجئ؟ كيف نتعلم قراءة ما خلف الكلمات والسلوكيات بدلاً من معاقبة العَرَض الخارجي؟',
      content: [
        'من أكثر الأخطاء شيوعاً في العلاقات الأسرية والتربوية التعامل مع السلوك الظاهر كأنه كل الحقيقة. نرى عناد الطفل فنسميه متمرداً، أو نرى برود الشريك فنسميه متجاهلاً.',
        'في الواقع النفسي العميق: «السلوك رسالة تفصح عما يعتلج في النفس».. السلوك هو الغلاف الخارجي لاحتياج عميق لم يجد طريقة صحية للتعبير عن نفسه.',
        'الطفل الذي يصرخ أو يعاند غالباً ما يرسل رسالة غير واعية تقول: «انظروا إليّ، لست واثقاً من محبتكم، أريد أن أتحكم في شيء لأنني أشعر بالعجز».',
        'وكذلك الشريك المنسحب؛ انسحابه ليس دليلاً على انعدام الحب، بل قد يكون رسالة خوف من تفاقم الصدام وشعوراً بالعجز عن الوصول إلى تفاهم آمن.',
        'حين نتحول من عقلية «محاكمة السلوك» إلى عقلية «قراءة الرسالة»، يبدأ الوعي، وتزول نصف النزاعات تلقائياً.'
      ]
    },
    {
      id: 'marital-communication-bridges',
      title: 'جسور التواصل الزواجي: من ردود الفعل العفوية إلى الإصغاء الواعي',
      category: 'marriage',
      readTime: '5 دقائق قراءة',
      publishDate: 'أغسطس 2026',
      summary: 'النزاع الزوجي لا يعني نهاية العلاقة، بل يشير إلى انسداد في قنوات الحوار. كيف ننتقل من الرغبة في إثبات الصواب إلى الرغبة في فهم الشريك؟',
      content: [
        'معظم الخلافات الزوجية المتكررة لا تدور حول الموضوع المعلن (المال، الأعمال المنزلية، مواعيد الأهل)، بل تدور حول سؤال وجودي أعمق: «هل أنا مرئي عندك؟ هل لمشاعري قيمة في عينيك؟».',
        'حين يشعر أحد الطرفين بعدم التقدير، يتحول الحوار سريعاً من نقاش ودي إلى معركة دفاعية يمارس فيها كل طرف أحد أمرين: الهجوم المضاد أو الصمت العقابي.',
        'الإصغاء الواعي لا يعني موافقة الطرف الآخر على كل ما يقول، بل يعني إشعاره بأنك سمعت ألمه وفهمت منطقه قبل أن تبدأ بالدفاع عن وجهة نظرك.',
        'قاعدة الـ 5 ثوانٍ: قبل أن ترد على كلمة مستفزة من شريكك، اسأل نفسك: «هل ردي هذا سيبني جسراً أم سيهدم جداراً؟».. هذا التأمل البسيط هو بداية الانتقال من الانفعال إلى النضج.'
      ]
    },
    {
      id: 'parenting-with-kindness-and-firmness',
      title: 'الوالدية الواعية: كيف نربي بالرفق والحزم معاً دون تناقض؟',
      category: 'parenting',
      readTime: '5 دقائق قراءة',
      publishDate: 'يوليو 2026',
      summary: 'التربية بالحب لا تعني الفوضى وغياب الحدود، والحزم لا يعني القسوة والعقاب الجسدي أو اللفظي. كيف ندمج الاثنين في معادلة تربوية متوازنة؟',
      content: [
        'يقع كثير من الآباء في ثنائية مرهقة: إما التدليل المفرط الذي يُنتج طفلاً هشاًّ لا يتحمل المسؤولية، أو القسوة والتحكم التي تنتج طفلاً خائفاً أو متمرداً.',
        'الرفق هو قبول مشاعر الطفل وحقه في التعبير، والحزم هو حماية الحدود وقواعد البيت دون استثناء أو انفعال.',
        'حين يرفض الطفل الذهاب للنوم، نقول له برفق: «أعلم أنك مستمتع باللعب وتريد البقاء مستيقظاً»، ثم نؤكد بحزم: «ولكن موعد النوم حان الآن لحماية صحتك».',
        'الرفق يمنحه الأمان، والحزم يمنحه الوضوح؛ وبالمزيج بينهما تنمو شخصية واثقة ومستقرة.'
      ]
    }
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFCFA] dark:bg-[#0D1117] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Header */}
      <section className="pt-12 pb-10 sm:pt-16 sm:pb-12 px-4 sm:px-6 text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF9EC] dark:bg-[#2E2413] border border-[#FDF0CD] dark:border-[#4D3A1B] text-xs font-bold text-[#D97706]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>المقالات والتأصيل المعرفي • مشروع أقومية القرآن</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          المقالات ومساحات الوعي
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          كتابات تأصيلية وتوعوية تجمع بين هدايات الوحي الشريف وأحدث مبادئ علم النفس والإرشاد الأسري المعاصر.
        </p>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#4E7E76] text-white shadow-xs'
                    : 'bg-white dark:bg-[#161F2B] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1F2C3D] border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-8 px-4 sm:px-6 max-w-6xl mx-auto w-full space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article) => (
            <article 
              key={article.id}
              className="p-7 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-6 shadow-2xs hover:shadow-md transition-all"
            >
              <div className="space-y-4">
                
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span className="text-[#4E7E76] font-bold">
                    {categories.find(c => c.id === article.category)?.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {article.summary}
                  </p>
                </div>

                {/* Quran Highlight if present */}
                {article.quranFoundation && (
                  <div className="p-4 rounded-2xl bg-[#FEF9EC] dark:bg-[#2E2413] border border-[#FDF0CD] dark:border-[#4D3A1B] text-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-[#D97706] font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>تأصيل من القرآن الكريم ({article.quranFoundation.surah})</span>
                    </div>
                    <p className="font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                      {article.quranFoundation.ayah}
                    </p>
                  </div>
                )}

              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setActiveArticle(article)}
                  className="w-full py-2.5 px-4 bg-[#EDF7F5] dark:bg-[#112924] hover:bg-[#D6EEEA] dark:hover:bg-[#1F4A42] text-[#4E7E76] dark:text-[#5E988E] rounded-full text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <span>اقرأ المقال كاملاً</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>

            </article>
          ))}
        </div>
      </section>

      {/* Article Detail Modal / Reader */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#161F2B] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl relative text-right">
            
            <button 
              onClick={() => setActiveArticle(null)}
              className="sticky top-0 float-left p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 transition"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-[#4E7E76]">
                {categories.find(c => c.id === activeArticle.category)?.label} • {activeArticle.readTime}
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 leading-snug">
                {activeArticle.title}
              </h2>
            </div>

            {/* Quran Foundation Deep Box */}
            {activeArticle.quranFoundation && (
              <div className="p-5 rounded-2xl bg-[#FEF9EC] dark:bg-[#2E2413] border border-[#FDF0CD] dark:border-[#4D3A1B] space-y-3 text-xs">
                <div className="flex items-center gap-1.5 text-[#D97706] font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>الأساس القرآني: {activeArticle.quranFoundation.ayah}</span>
                </div>
                <div className="space-y-1">
                  <strong className="text-slate-800 dark:text-slate-200">التفسير المعتمد ({activeArticle.quranFoundation.surah}):</strong>
                  <p className="text-slate-600 dark:text-slate-300 font-normal">{activeArticle.quranFoundation.tafseer}</p>
                </div>
                <div className="space-y-1">
                  <strong className="text-slate-800 dark:text-slate-200">الاستبصار النفسي والتربوي:</strong>
                  <p className="text-slate-600 dark:text-slate-300 font-normal">{activeArticle.quranFoundation.insight}</p>
                </div>
                <div className="space-y-1">
                  <strong className="text-slate-800 dark:text-slate-200">التطابق مع علم النفس الحديث:</strong>
                  <p className="text-slate-600 dark:text-slate-300 font-normal">{activeArticle.quranFoundation.scientificCorrelation}</p>
                </div>
              </div>
            )}

            {/* Full text content */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-loose font-normal">
              {activeArticle.content.map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">بقلم: جـلال أحـمد</span>
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 bg-[#4E7E76] text-white rounded-full text-xs font-bold hover:bg-[#3D655E] transition"
              >
                إغلاق المقال
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
