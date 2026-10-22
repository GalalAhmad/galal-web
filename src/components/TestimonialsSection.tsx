'use client';

import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, HeartHandshake } from 'lucide-react';
import { testimonialsData, Testimonial } from '@/data/testimonials';

interface TestimonialsSectionProps {
  filterCategory?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
}

export default function TestimonialsSection({
  filterCategory,
  title = 'تجارب وآراء المستفيدين',
  subtitle = 'أصداء حقيقية من جلسات الاستشارة والبرامج التفاعلية (مع الالتزام الصارم بالسرية والخصوصية التامة)',
  limit,
}: TestimonialsSectionProps) {
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>(testimonialsData);

  // Fetch dynamic published reviews from Admin & Community feedback
  useEffect(() => {
    fetch('/api/feedback', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.feedback)) {
          const published = data.feedback.filter((item: any) => item.isPublished);
          if (published.length > 0) {
            const formatted: Testimonial[] = published.map((item: any) => ({
              id: item.id,
              name: item.clientName || 'مستفيد كريم',
              sessionType: item.sessionType || 'استشارة استماع وبناء',
              serviceCategory: item.serviceCategory || 'psychological',
              rating: item.rating || 5,
              feedback: item.feedback,
              location: item.location || 'أونلاين',
              verified: true,
              initial: (item.clientName || 'م').trim().charAt(0),
              avatarBg: 'from-[#4E7E76] to-[#3D645E]',
              avatarText: 'text-white',
            }));

            // Merge dynamic reviews at the front
            setAllTestimonials((prev) => {
              const base = prev.filter((p) => !formatted.some((f) => f.id === p.id));
              return [...formatted, ...base];
            });
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching live testimonials:', err);
      });
  }, []);

  const filtered = filterCategory
    ? allTestimonials.filter((t) => t.serviceCategory === filterCategory)
    : allTestimonials;

  const items = limit ? filtered.slice(0, limit) : filtered;

  // Duplicate items for infinite seamless scroll
  const marqueeItems = [...items, ...items];

  return (
    <section className="py-14 sm:py-20 bg-[#FAFCFA] dark:bg-[#0D1117] transition-colors overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 sm:mb-10 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDF7F5] dark:bg-[#112924] border border-[#D6EEEA] dark:border-[#1F4A42] text-xs font-bold text-[#4E7E76] dark:text-[#5E988E] shadow-2xs">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>ثقة وأمان ومسيرة وعي</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {title}
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal max-w-xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Single-row Horizontal Continuous Moving Track (Marquee) */}
      <div className="relative w-full overflow-hidden py-3">
        {/* Subtle Fade Gradient Masks at Left & Right Edges */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-28 bg-linear-to-l from-[#FAFCFA] dark:from-[#0D1117] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-28 bg-linear-to-r from-[#FAFCFA] dark:from-[#0D1117] to-transparent z-10" />

        <div className="animate-marquee-track flex gap-4 sm:gap-6 pr-4">
          {marqueeItems.map((t, idx) => (
            <div
              key={`${t.id}-${idx}`}
              className="w-[290px] sm:w-[350px] shrink-0 flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 hover:border-[#4E7E76]/40 dark:hover:border-[#5E988E]/40 transition-all duration-300 shadow-2xs hover:shadow-md text-right group select-none"
            >
              <div className="space-y-3">
                {/* Header: Rating & Session Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 truncate max-w-[150px]">
                    {t.sessionType}
                  </span>
                </div>

                {/* Feedback Quote */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal min-h-[75px] line-clamp-4">
                  «{t.feedback}»
                </p>
              </div>

              {/* Author & Verification Footer */}
              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-full bg-linear-to-br ${t.avatarBg} ${t.avatarText} flex items-center justify-center text-xs font-black shadow-xs shrink-0 select-none`}
                  >
                    {t.initial}
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                        {t.name}
                      </h3>
                      {t.verified && (
                        <span title="مستفيد موثق">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#4E7E76] dark:text-[#5E988E]" />
                        </span>
                      )}
                    </div>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {t.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
