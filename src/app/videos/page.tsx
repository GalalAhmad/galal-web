'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { initialVideos, VideoItem } from '@/data/videos';
import { 
  Video, 
  Search, 
  Play, 
  Clock, 
  Eye, 
  Calendar, 
  Share2, 
  X, 
  Sparkles, 
  ExternalLink,
  CheckCircle2,
  Tv,
  ArrowLeft
} from 'lucide-react';

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // Fetch updated videos from API
  useEffect(() => {
    fetch('/api/admin/videos')
      .then(res => res.json())
      .then(data => {
        if (data.videos && Array.isArray(data.videos)) {
          setVideos(data.videos);
        }
      })
      .catch(err => console.error('Error fetching videos:', err));
  }, []);

  const categories = [
    { id: 'all', label: 'جميع المرئيات' },
    { id: 'quran', label: 'مشروع أقومية القرآن' },
    { id: 'family', label: 'العلاقات والأسرة' },
    { id: 'parenting', label: 'التربية والوالدية' },
    { id: 'psychology', label: 'بصائر نفسية' },
  ];

  const filteredVideos = useMemo(() => {
    return videos.filter(v => {
      const matchCat = selectedCategory === 'all' || v.category === selectedCategory;
      const matchSearch = 
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [videos, selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFCFA] dark:bg-[#0D1117] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-12 pb-10 sm:pt-16 sm:pb-14 px-4 sm:px-6 bg-white dark:bg-[#0E1524] border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FEF2F2] dark:bg-[#2A1515] border border-[#FECACA] dark:border-[#521B1B] text-xs font-bold text-rose-700 dark:text-rose-400">
            <Tv className="w-3.5 h-3.5 text-rose-600" />
            <span>المكتبة المرئية الشاملة • مقاطع ومحاضرات متخصصة</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            مرئيات
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            حلقات ولقاءات مرئية يقدمها جلال أحمد لتفكيك السلوك الإنساني، تعزيز الحوار الزواجي، والتأصيل التربوي المستلهم من هدايات الوحي.
          </p>

          {/* Search & Categories Bar */}
          <div className="pt-4 max-w-xl mx-auto space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في المرئيات (مثال: أقومية القرآن، العناد، الزواج، القلق...)"
                className="w-full py-3.5 pr-11 pl-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#CC4E46] text-right"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-[#CC4E46] to-[#B33D35] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Videos YouTube-Style Grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 flex-1">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>المرئيات المتاحة: <strong>{filteredVideos.length}</strong> فيديو</span>
            <span>بث مباشر وحلقات مسجلة</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white dark:bg-[#161F2B] rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 group flex flex-col justify-between text-right"
              >
                {/* 16:9 Thumbnail Box */}
                <div 
                  onClick={() => setActiveVideo(video)}
                  className="relative aspect-video w-full bg-slate-900 cursor-pointer overflow-hidden flex items-center justify-center"
                >
                  {/* YouTube thumbnail background */}
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    onError={(e) => {
                      // Fallback gradient if thumbnail cannot load
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />

                  {/* Dark overlay & Play Button */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-13 h-13 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-rose-600 transition-all">
                      <Play className="w-6 h-6 fill-current mr-0.5" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-[11px] font-bold">
                    {video.duration}
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-black/70 text-slate-800 dark:text-slate-200 text-[10px] font-bold shadow-2xs">
                    {video.categoryLabel}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h2 
                      onClick={() => setActiveVideo(video)}
                      className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug group-hover:text-[#CC4E46] transition-colors cursor-pointer line-clamp-2"
                    >
                      {video.title}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal line-clamp-2">
                      {video.desc}
                    </p>
                  </div>

                  {/* Channel / Author & Stats */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                      <img 
                        src="/assets/logo.png" 
                        alt="جلال أحمد" 
                        className="w-4 h-4 object-contain rounded-full" 
                      />
                      <span>جلال أحمد</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-slate-400" />
                        <span>{video.viewsCount.toLocaleString('ar-EG')}</span>
                      </span>
                      <span>•</span>
                      <span>{video.publishDate}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 pb-5 pt-0 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveVideo(video)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current text-rose-600" />
                    <span>تشغيل الفيديو</span>
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${video.title}\n${video.youtubeUrl || 'https://galalahmad.com/videos'}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                    title="مشاركة عبر واتساب"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-16 p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <Tv className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                لم يتم العثور على مرئيات تطابق بحثك
              </h3>
              <p className="text-xs text-slate-500">
                جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً.
              </p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="mt-2 px-4 py-2 bg-[#CC4E46] text-white text-xs font-bold rounded-xl"
              >
                عرض كافة المرئيات
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#121A2C] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative text-right">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveVideo(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate max-w-[280px] sm:max-w-md">
                {activeVideo.title}
              </h3>
            </div>

            {/* Responsive 16:9 Video Embed */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Modal Details Footer */}
            <div className="p-5 sm:p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EDF7F5] dark:bg-[#112924] text-[#4E7E76]">
                  {activeVideo.categoryLabel}
                </span>
                <span className="text-xs text-slate-500">
                  {activeVideo.publishDate} • {activeVideo.viewsCount.toLocaleString('ar-EG')} مشاهدة
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {activeVideo.desc}
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <a
                  href={activeVideo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>المشاهدة مباشرة على يوتيوب</span>
                </a>

                <Link
                  href="/services#book"
                  className="px-4 py-2 rounded-full bg-[#CC4E46] hover:bg-[#B33D35] text-white text-xs font-bold transition shadow-xs"
                >
                  حجز استشارة خاصة
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
