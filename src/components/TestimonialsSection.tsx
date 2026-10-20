'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Quote, ShieldCheck, HeartHandshake, GraduationCap, Sparkles, MessageSquareHeart } from 'lucide-react';
import { testimonialsData, Testimonial } from '@/data/testimonials';
import { workshopTestimonialsData, WorkshopTestimonial } from '@/data/workshopTestimonials';
import { siteConfig } from '@/data/siteConfig';

interface TestimonialsSectionProps {
  filterCategory?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
}

export default function TestimonialsSection({
  filterCategory,
  title,
  subtitle,
  limit,
}: TestimonialsSectionProps) {
  // If showClientTestimonials is false, switch to Workshop Testimonials
  const showClientReviews = siteConfig.showClientTestimonials;

  if (!showClientReviews) {
    const hasWorkshops = workshopTestimonialsData.length > 0;
    const workshopItems = limit ? workshopTestimonialsData.slice(0, limit) : workshopTestimonialsData;

    return (
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#FAFCFA] dark:bg-[#0D1117] transition-colors border-t border-slate-200/60 dark:border-slate-800">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDF7F5] dark:bg-[#112924] border border-[#D6EEEA] dark:border-[#1F4A42] text-xs font-bold text-[#4E7E76] dark:text-[#5E988E] shadow-2xs">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>أصداء البرامج والورش التدريبية</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {title || 'ما يقوله المشاركون في الورش والبرامج'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              {subtitle || 'انطباعات وشهادات المشاركين في مسارات بناء وتمكين والبرامج التربوية والمؤسسية'}
            </p>
          </div>

          {hasWorkshops ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workshopItems.map((w: WorkshopTestimonial) => (
                <div
                  key={w.id}
                  className="h-full flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all text-right group"
                >
                  <div className="space-y-4">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#EDF7F5] dark:bg-[#112924] text-[#4E7E76] dark:text-[#5E988E] border border-[#D6EEEA] dark:border-[#1F4A42]">
                      {w.programName}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal min-h-[80px]">
                      «{w.quote}»
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4E7E76] to-[#2E554F] text-white flex items-center justify-center text-sm font-black shadow-xs shrink-0 select-none">
                        {w.initials}
                      </div>
                      <div className="text-right">
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                          {w.role}
                        </h3>
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {w.country}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">
                      {w.monthYear}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Elegant Placeholder / Invitation Block */
            <div className="max-w-3xl mx-auto p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#EDF7F5] dark:bg-[#112924] text-[#4E7E76] dark:text-[#5E988E] flex items-center justify-center mx-auto">
                <MessageSquareHeart className="w-7 h-7" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  توثيق واعتماد تقييمات الورش التدريبية
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                  نلتزم بالشفافية والتوثيق المعتمد؛ يجري حالياً تجميع واعتماد شهادات الحضور للمشاركين في برامج رحلة رفق ومسارات التمكين الأسري والمؤسسي بعد أخذ الموافقات الرسمية للنشر.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/feedback"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4E7E76] hover:bg-[#3D655E] text-white text-xs font-bold transition shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>شاركنا انطباعك عن البرامج والورش التدريبية</span>
                </Link>
              </div>
            </div>
          )}

          {/* Micro Trust Note */}
          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4E7E76]" />
              <span>نلتزم بالسرية المهنية وفق أخلاقيات المهنة؛ لا يتم نشر أي رأي إلا بموافقة صريحة وموثقة.</span>
            </p>
          </div>

        </div>
      </section>
    );
  }

  // Fallback: If showClientTestimonials is true
  const displayed = filterCategory
    ? testimonialsData.filter((t) => t.serviceCategory === filterCategory)
    : testimonialsData;

  const items = limit ? displayed.slice(0, limit) : displayed;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#FAFCFA] dark:bg-[#0D1117] transition-colors border-t border-slate-200/60 dark:border-slate-800">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDF7F5] dark:bg-[#112924] border border-[#D6EEEA] dark:border-[#1F4A42] text-xs font-bold text-[#4E7E76] dark:text-[#5E988E] shadow-2xs">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>ثقة وأمان ومسيرة وعي</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {title || 'تجارب وآراء المستفيدين'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            {subtitle || 'أصداء حقيقية من جلسات الاستشارة والبرامج التفاعلية (مع الالتزام الصارم بالسرية المهنية)'}
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t: Testimonial) => (
            <div
              key={t.id}
              className="h-full flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 shadow-2xs hover:shadow-md text-right group"
            >
              <div className="space-y-4">
                
                {/* Header: Rating & Session Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                    {t.sessionType}
                  </span>
                </div>

                {/* Feedback Quote */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal min-h-[90px]">
                  «{t.feedback}»
                </p>

              </div>

              {/* Author & Verification Footer */}
              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                
                <div className="flex items-center gap-3">
                  {/* Gradient Initial Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarBg} ${t.avatarText} flex items-center justify-center text-sm font-black shadow-xs shrink-0 select-none`}
                  >
                    {t.initial}
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                        {t.name}
                      </h3>
                      {t.verified && (
                        <span title="مستفيد موثق">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#4E7E76] dark:text-[#5E988E]" />
                        </span>
                      )}
                    </div>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {t.location}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-medium shrink-0">
                  {t.date}
                </span>

              </div>
            </div>
          ))}
        </div>

        {/* Micro Trust Note */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4E7E76]" />
            <span>نلتزم بالسرية المهنية وفق أخلاقيات المهنة؛ أسماء المستفيدين مختصرة حفاظاً على الخصوصية.</span>
          </p>
        </div>

      </div>
    </section>
  );
}
