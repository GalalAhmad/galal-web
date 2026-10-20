'use client';

import React from 'react';
import { books } from '@/data/books';
import { trainedInstitutions } from '@/data/trainedInstitutions';
import { BookOpen, Building2, ExternalLink } from 'lucide-react';

export default function BooksAndInstitutionsStrip() {
  // Hide section automatically if both arrays are empty
  if (books.length === 0 && trainedInstitutions.length === 0) {
    return null;
  }

  return (
    <section className="py-14 px-4 sm:px-6 bg-[#F8FAFC] dark:bg-[#111923] border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#4E7E76] dark:text-[#5E988E] uppercase tracking-wider">
            خبرات وأثر ميداني
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            مؤلفات وشراكات مؤسسية
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            امتداد للأثر المعرفي والتدريبي في تطوير الكوادر وإثراء المكتبة النفسية والتربوية
          </p>
        </div>

        {/* Books Subsection */}
        {books.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              <BookOpen className="w-4 h-4 text-[#CC4E46]" />
              <span>المؤلفات والإصدارات</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2"
                >
                  {book.coverImage && (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-40 object-cover rounded-xl mb-3"
                    />
                  )}
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {book.title}
                  </h4>
                  {book.subtitle && (
                    <p className="text-xs text-[#4E7E76] font-semibold">{book.subtitle}</p>
                  )}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                    {book.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                    {book.year && <span>{book.year}</span>}
                    {book.purchaseUrl && (
                      <a
                        href={book.purchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#4E7E76] font-bold hover:underline"
                      >
                        <span>طلب الكتاب</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Institutions Subsection */}
        {trainedInstitutions.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              <Building2 className="w-4 h-4 text-[#154F9C]" />
              <span>مؤسسات وجهات دربنا كوادرها</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {trainedInstitutions.map((inst) => (
                <div
                  key={inst.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 text-center flex flex-col items-center justify-center gap-1.5 shadow-2xs"
                >
                  {inst.logo ? (
                    <img src={inst.logo} alt={inst.name} className="h-8 w-auto object-contain" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 text-xs font-bold">
                      {inst.name.slice(0, 2)}
                    </div>
                  )}
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                    {inst.name}
                  </div>
                  <div className="text-[10px] text-slate-400">{inst.type}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
