import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Brain, 
  HeartHandshake, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';
import { SITE_POLICY } from '@/config/policy';

export const metadata: Metadata = {
  title: 'رسوم وباقات الجلسات الاستشارية | د. جلال أحمد',
  description: 'تعرف على رسوم ومسارات الاستشارات النفسية الفردية والزوجية والتربوية مع د. جلال أحمد، مع خيارات سداد مرنة عبر إنستاباي والتحويل البنكي.',
  alternates: {
    canonical: 'https://www.galalahmad.com/pricing',
  },
  openGraph: {
    title: 'رسوم وباقات الجلسات الاستشارية | د. جلال أحمد',
    description: 'تعرف على رسوم ومسارات الاستشارات النفسية الفردية والزوجية والتربوية مع د. جلال أحمد.',
    url: 'https://www.galalahmad.com/pricing',
    siteName: 'د. جلال أحمد للاستشارات',
    locale: 'ar_EG',
  },
};

const PRICING_TRACKS = [
  {
    id: 'psychological',
    title: 'استشارة نفسية فردية',
    badge: 'الأكثر طلباً • جلسة خاصة',
    duration: '50 دقيقة',
    fee: 'تبدأ من 250 ر.س',
    desc: 'مساحة استماع آمنة لتفكيك القلق والضغوط، فهم المشاعر، واستعادة الصلابة والاتزان الذاتي وفق منهجية تكاملية.',
    features: [
      'جلسة فردية مباشرة عبر Google Meet',
      'خطة متابعة وتكليفات سلوكية وتطبيقات عملية',
      'مرونة إعادة الجدولة حتى 48 ساعة قبل الموعد',
      'سرية مهنية وأمان إلكتروني تام',
    ],
    icon: Brain,
    accent: 'emerald',
    ctaTrack: 'psychological',
  },
  {
    id: 'marital',
    title: 'استشارة زوجية وأسرية',
    badge: 'جلسة معمقة للزوجين',
    duration: '75 دقيقة',
    fee: 'تبدأ من 350 ر.س',
    desc: 'إصلاح التواصل وفكك الانسدادات الصامتة، إدارة الخلافات، وتجديد المودة والسكينة بين الزوجين بأسلوب محايد.',
    features: [
      'حضور الزوجين معاً أو بالتناوب حسب الخطة',
      'خارطة أبعاد المشكلة وبناء جسور الحوار الآمن',
      'بروتوكولات حل النزاعات ووضع الحدود الأسرية',
      'مرونة إعادة الجدولة حتى 48 ساعة قبل الموعد',
    ],
    icon: HeartHandshake,
    accent: 'sapphire',
    ctaTrack: 'marital',
  },
  {
    id: 'parenting',
    title: 'إرشاد تربوي والوالدية',
    badge: 'توجيه الوالدين والمربين',
    duration: '50 دقيقة',
    fee: 'تبدأ من 250 ر.س',
    desc: 'مساعدة الآباء على فهم دوافع سلوك الأبناء واليافعين، وتطوير أساليب تربوية هادئة وحازمة دون صراخ.',
    features: [
      'تحليل رسائل العناد وسلوك المراهقين واليافعين',
      'استراتيجيات الحزم بالرفق وإدارة الانفعالات الأسرية',
      'توجيهات مخصصة لبيئة وظروف الأسرة الواقعية',
      'مرونة كاملة في المواعيد وإلغاء مجاني حتى 48 ساعة',
    ],
    icon: Sparkles,
    accent: 'amber',
    ctaTrack: 'parenting',
  },
  {
    id: 'emergency',
    title: 'استشارة طارئة واستجابة عاجلة',
    badge: 'استجابة سريعة خلال 24 ساعة',
    duration: '60 دقيقة',
    fee: '500 ر.س',
    desc: 'مسار مخصص للأزمات العائلية أو النفسية الضاغطة التي تتطلب تدخلاً سريعاً وجلسة استثنائية خارج جدول المواعيد المعتاد.',
    features: [
      'تنسيق موعد فوري وسريع خلال أقل من 24 ساعة',
      'أولوية مطلقة في جدول المستشار د. جلال أحمد',
      'احتواء الموقف الحرج ودعم اتخاذ قرارات متزنة',
      'تنسيق مباشر وسريع عبر واتساب العيادة المعتمد',
    ],
    icon: Zap,
    accent: 'coral',
    ctaTrack: 'emergency',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCFA] dark:bg-[#0D1117] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12 text-right">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDF7F5] dark:bg-[#112924] border border-[#D6EEEA] dark:border-[#1F4A42] text-xs font-bold text-[#4E7E76] dark:text-[#5E988E]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>وضوح وشفافية • استثمار في بناء الإنسان</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              رسوم وباقات الجلسات الاستشارية
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              اختر المسار الاستشاري الأنسب لاحتياجك. كافة الجلسات تُعقد أونلاين عبر قاعة Google Meet الآمنة وتخضع لأعلى معايير السرية والخصوصية المهنية.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_TRACKS.map((track) => {
              const Icon = track.icon;
              return (
                <div
                  key={track.id}
                  className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#161F2B] border border-slate-200 dark:border-slate-800 hover:border-[#4E7E76] dark:hover:border-[#5E988E] transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-[#4E7E76] dark:text-[#5E988E]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {track.duration}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-1">
                        {track.title}
                      </h2>
                      <div className="text-2xl font-black text-[#4E7E76] dark:text-[#5E988E] font-mono">
                        {track.fee}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {track.desc}
                    </p>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      {track.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      href={`/booking?track=${track.ctaTrack}`}
                      className="w-full py-3 bg-[#4E7E76] hover:bg-[#3D645E] text-white text-xs font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>احجز الموعد الآن</span>
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Policy Banner */}
          <div className="p-6 rounded-3xl bg-[#EDF7F5] dark:bg-[#112924] border border-[#D6EEEA] dark:border-[#1F4A42] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#4E7E76] dark:text-[#5E988E] shrink-0" />
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <strong>سياسة الإلغاء والتعديل المرنة:</strong> {SITE_POLICY.cancellation.descriptionArabic}
              </div>
            </div>
            <Link
              href="/policies"
              className="text-xs font-bold text-[#4E7E76] dark:text-[#5E988E] hover:underline shrink-0"
            >
              قراءة كافة السياسات والشروط ➔
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
