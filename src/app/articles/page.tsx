'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
  FileText,
  Search,
  Eye,
  Star,
  MessageSquare,
  ThumbsUp,
  Share2,
  Send,
  User,
  Heart,
  Bookmark,
  Calendar
} from 'lucide-react';
import { initialArticles, ArticleItem, ArticleComment } from '@/data/articles';

export default function ArticlesForumPage() {
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Active reading modal / article
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);
  
  // Comment Form state
  const [commentName, setCommentName] = useState<string>('');
  const [commentText, setCommentText] = useState<string>('');
  const [userRating, setUserRating] = useState<number>(0);
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'جميع المقالات والنقاشات' },
    { id: 'quran', label: 'مشروع أقومية القرآن' },
    { id: 'marriage', label: 'العلاقات الزوجية والأسرة' },
    { id: 'parenting', label: 'التربية والوالدية الواعية' },
    { id: 'psychology', label: 'الصحة النفسية والاتزان' },
  ];

  // Filtering
  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      const matchCat = selectedCategory === 'all' || a.category === selectedCategory;
      const matchSearch = a.title.includes(searchQuery) || a.summary.includes(searchQuery);
      return matchCat && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  // Open Article & increment reader count
  const handleOpenArticle = (art: ArticleItem) => {
    setActiveArticle(art);
    setUserRating(0);
    setRatingSubmitted(false);
    setCommentName('');
    setCommentText('');

    // Increment reader count
    setArticles(prev => prev.map(item => 
      item.id === art.id ? { ...item, readersCount: item.readersCount + 1 } : item
    ));
  };

  // Submit Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeArticle || !commentText.trim()) return;

    const newComment: ArticleComment = {
      id: 'c_' + Date.now(),
      authorName: commentName.trim() || 'قارئ مهتم',
      date: 'الآن',
      text: commentText.trim(),
      likes: 1
    };

    const updatedArticle = {
      ...activeArticle,
      commentsCount: activeArticle.commentsCount + 1,
      comments: [newComment, ...activeArticle.comments]
    };

    setActiveArticle(updatedArticle);
    setArticles(prev => prev.map(item => item.id === activeArticle.id ? updatedArticle : item));
    setCommentText('');
  };

  // Submit Rating
  const handleRate = (star: number) => {
    if (!activeArticle || ratingSubmitted) return;
    setUserRating(star);
    setRatingSubmitted(true);

    const newRatingsCount = activeArticle.ratingsCount + 1;
    const newRating = Number((((activeArticle.rating * activeArticle.ratingsCount) + star) / newRatingsCount).toFixed(1));

    const updatedArticle = {
      ...activeArticle,
      rating: newRating,
      ratingsCount: newRatingsCount
    };

    setActiveArticle(updatedArticle);
    setArticles(prev => prev.map(item => item.id === activeArticle.id ? updatedArticle : item));
  };

  return (
    <main className="min-h-screen bg-[#FDFCFB] dark:bg-[#0C111C] text-slate-800 dark:text-slate-100 flex flex-col antialiased selection:bg-[#154F9C]/10 selection:text-[#154F9C]">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-12 pb-10 sm:pt-16 sm:pb-12 px-4 sm:px-6 text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#154F9C]/10 border border-[#154F9C]/20 text-xs font-bold text-[#154F9C]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>المنتدى الثقافي والفكري • مقالات وبصائر تفاعلية</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          المقالات ومساحات الوعي
        </h1>
        
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          طرح تأصيلي رصين يجمع بين هدايات القرآن الكريم وعلم النفس والتربية المعاصرة — تصفح، قيّم، وشارك برأيك في النقاشات الفكرية.
        </p>

        {/* Search Input */}
        <div className="max-w-md mx-auto pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في عناوين وموضوعات المقالات..."
              className="w-full pl-4 pr-10 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121A2C] text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#154F9C] text-white shadow-xs'
                    : 'bg-white dark:bg-[#161F2B] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1F2C3D] border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Cultural Forum Articles Stream */}
      <section className="py-8 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#121A2C] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#154F9C]/30 hover:shadow-md transition-all text-right"
            >
              {/* Post Header: Author, Date, Category */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#154F9C]/10 text-[#154F9C] flex items-center justify-center font-bold text-xs">
                    جـ
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {article.author}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {article.publishDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-300">
                    {article.categoryLabel}
                  </span>
                  {article.featured && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      مقال متميز
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <h2 
                onClick={() => handleOpenArticle(article)}
                className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug mb-3 hover:text-[#154F9C] cursor-pointer transition"
              >
                {article.title}
              </h2>

              {/* Excerpt */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                {article.summary}
              </p>

              {/* Forum Metadata Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Readers Count */}
                  <span className="flex items-center gap-1.5" title="عدد القراء">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{article.readersCount.toLocaleString('ar-EG')} قراءة</span>
                  </span>

                  {/* Rating */}
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold" title="متوسط التقييم">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{article.rating} ({article.ratingsCount})</span>
                  </span>

                  {/* Comments Count */}
                  <span className="flex items-center gap-1.5 hover:text-[#154F9C] transition cursor-pointer" onClick={() => handleOpenArticle(article)} title="المناقشات والتعليقات">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>{article.commentsCount} مشاركة</span>
                  </span>

                  {/* Read Time */}
                  <span className="hidden sm:flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{article.readTime}</span>
                  </span>
                </div>

                {/* Read Full Button */}
                <button
                  onClick={() => handleOpenArticle(article)}
                  className="px-4 py-2 rounded-full bg-slate-50 dark:bg-black/30 hover:bg-[#154F9C] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <span>اقرأ المقال كاملاً</span>
                  <ArrowLeft className="w-3 h-3 rtl:rotate-0" />
                </button>
              </div>
            </article>
          ))}

          {filteredArticles.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-sm">
              لا توجد مقالات مطابقة لبحثك الحالي.
            </div>
          )}

        </div>
      </section>

      {/* Interactive Full Article Reader & Discussion Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#121A2C] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-9 text-right overflow-y-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#154F9C]/10 text-[#154F9C]">
                  {activeArticle.categoryLabel}
                </span>
                <span className="text-xs text-slate-400">
                  {activeArticle.publishDate} • {activeArticle.readTime}
                </span>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Article Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight mb-4">
              {activeArticle.title}
            </h1>

            {/* Author Byline */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-full bg-[#154F9C]/10 text-[#154F9C] flex items-center justify-center font-bold text-sm">
                جـ
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  {activeArticle.author}
                </span>
                <span className="text-xs text-slate-500">
                  مستشار الصحة النفسية والتربوية والزواجية
                </span>
              </div>
            </div>

            {/* Quranic Foundation Callout if applicable */}
            {activeArticle.quranFoundation && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FEF9EC] to-amber-50 dark:from-[#2E2413] dark:to-[#221A0F] border border-[#FDF0CD] dark:border-[#4D3A1B] my-6 text-center space-y-3">
                <p className="text-lg sm:text-xl font-serif text-slate-800 dark:text-slate-100 font-bold leading-loose">
                  {activeArticle.quranFoundation.ayah}
                </p>
                <span className="text-xs font-bold text-[#D97706] block">
                  [{activeArticle.quranFoundation.surah}]
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-[#FDF0CD]/60 dark:border-[#4D3A1B]/60 pt-2 text-right">
                  💡 <strong>الاستبصار القرآني والنفسي:</strong> {activeArticle.quranFoundation.insight}
                </p>
              </div>
            )}

            {/* Full Body Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal mb-8">
              {activeArticle.content.map((paragraph, idx) => (
                <p key={idx} className="leading-loose">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Interactive Rating Widget */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 my-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  ما رأيك في هذا المقال؟
                </h4>
                <p className="text-[11px] text-slate-500">
                  تقييمك يساعد في إثراء المحتوى الفكري والتوعوي للمنتدى
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    disabled={ratingSubmitted}
                    className="p-1 text-slate-300 hover:text-amber-500 transition cursor-pointer disabled:cursor-default"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (userRating || Math.round(activeArticle.rating))
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                ))}
                {ratingSubmitted && (
                  <span className="text-xs font-bold text-emerald-600 mr-2">
                    ✓ شكرًا لتقييمك!
                  </span>
                )}
              </div>
            </div>

            {/* Discussion & Comments Section */}
            <div className="my-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#154F9C]" />
                <span>المشاركات والتعليقات ({activeArticle.commentsCount})</span>
              </h3>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 space-y-3">
                <input
                  type="text"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="اسمك (أو اترك فارغاً للمشاركة كقارئ مهتم)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-black/40 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
                />
                <textarea
                  rows={2}
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="شارك برأيك أو تساؤلك الفكري حول المقال..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-black/40 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-full bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>نشر المشاركة</span>
                  </button>
                </div>
              </form>

              {/* Existing Comments List */}
              <div className="space-y-3">
                {activeArticle.comments.map((comm) => (
                  <div 
                    key={comm.id}
                    className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-[#0E1524] border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {comm.authorName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {comm.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {comm.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Articles Box */}
            {activeArticle.relatedArticleIds && activeArticle.relatedArticleIds.length > 0 && (
              <div className="my-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  مقالات ذات صلة
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeArticle.relatedArticleIds.map((relId) => {
                    const rel = articles.find(a => a.id === relId);
                    if (!rel) return null;
                    return (
                      <div
                        key={rel.id}
                        onClick={() => handleOpenArticle(rel)}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#154F9C] cursor-pointer transition bg-white dark:bg-[#0E1524]"
                      >
                        <span className="text-[10px] text-slate-400 block mb-1">{rel.categoryLabel}</span>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white hover:text-[#154F9C] line-clamp-2">
                          {rel.title}
                        </h5>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer Consultation CTA */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#154F9C]/10 to-transparent border border-[#154F9C]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  هل تحتاج إلى استشارة متخصصة لمناقشة حالتك بتفصيل؟
                </span>
                <span className="text-[11px] text-slate-500">
                  جلسات استشارية فردية وزوجية خاصة عن بعد بخصوصية تامة
                </span>
              </div>
              <Link
                href="/services#book"
                onClick={() => setActiveArticle(null)}
                className="py-2 px-5 rounded-full bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold transition shrink-0"
              >
                احجز جلسة الآن
              </Link>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
