'use client';

import React, { useState } from 'react';
import { Play, Video, Clock, X, Sparkles, ArrowLeft } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  youtubeId?: string;
  thumbnail: string;
}

const defaultVideos: VideoItem[] = [
  {
    id: 'v1',
    title: 'السلوك رسالة قبل أن يكون مشكلة: كيف نفهم تمرد الأبناء؟',
    category: 'التربية واليافعين',
    duration: '14:20',
    description: 'تحليل عيادي وتربوي لانتقال الوالدين من لغة العقاب والزجر إلى فك شفرة الدافع النفسي الكامن وراء سلوكيات المراهقين.',
    thumbnail: '/assets/workshop.jpg',
    youtubeId: 'dQw4w9WgXcQ'
  },
  {
    id: 'v2',
    title: 'فقه التوقعات وكسر دوائر الصمت العقابي بين الزوجين',
    category: 'العلاقات الزوجية',
    duration: '18:45',
    description: 'خطوات عملية من برنامج «مِيثاق» لترميم شروخ التواصل الزوجي وإعادة بناء الأمان الوجداني بعد فترات الخصام الطويلة.',
    thumbnail: '/assets/program-mithaq.jpg',
    youtubeId: 'dQw4w9WgXcQ'
  },
  {
    id: 'v3',
    title: 'من ردود الفعل إلى الوعي: كيف تفصل ذاتك عن مشاعرك؟',
    category: 'بصيرة الذات',
    duration: '12:10',
    description: 'إضاءات مستلهمة من كتاب «ذات وموضوع» لتدريب النفس على أخذ مسافة شعورية قبل اتخاذ القرارات في لحظات الغضب.',
    thumbnail: '/assets/dr-galal-speaking.jpg',
    youtubeId: 'dQw4w9WgXcQ'
  },
  {
    id: 'v4',
    title: 'أقومية القرآن في بناء الإنسان والأسرة السوية',
    category: 'مشروع أقومية القرآن',
    duration: '22:30',
    description: 'تأصيل منهجي لكيفية الاسترشاد بهدايات الوحي في تصحيح المفاهيم النفسية والتربوية المعاصرة وتزكية الفطرة.',
    thumbnail: '/assets/dr-galal-portrait.jpg',
    youtubeId: 'dQw4w9WgXcQ'
  }
];

export default function VideosSection() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  return (
    <section id="videos" className="py-20 px-4 sm:px-6 bg-[#0E1318] dark:bg-[#0E1318] bg-[#F4F7F9] border-b border-slate-800/80 dark:border-slate-800/80 border-slate-200 transition-colors">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* ترويسة المكتبة المرئية (مستلهمة من قسم فيديوهات د. محمد طه) */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 dark:bg-slate-800/60 bg-white border border-slate-700/60 dark:border-slate-700/60 border-slate-200 text-xs font-bold text-accent-500 shadow-xs">
            <Video className="w-3.5 h-3.5" />
            <span>المكتبة المرئية والمحاضرات</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-100 dark:text-slate-100 text-slate-900 tracking-tight">
            مرئيات ولقاءات جـلال أحـمد
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed">
            محاضرات ولقاءات مكثفة تتناول قضايا الوعي النفسي، بناء البيوت المستقرة، وفهم سيكولوجيا الأبناء واليافعين.
          </p>
        </div>

        {/* شبكة الفيديوهات المتماثلة هندسياً */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {defaultVideos.map((video) => (
            <div
              key={video.id}
              className="h-full flex flex-col justify-between rounded-3xl bg-[#151B23] dark:bg-[#151B23] bg-white border border-slate-800 dark:border-slate-800 border-slate-200 overflow-hidden hover:border-slate-700 dark:hover:border-slate-700 hover:border-slate-300 transition-all shadow-sm hover:shadow-md text-right group"
            >
              <div>
                {/* Thumbnail with Play Overlay */}
                <div 
                  onClick={() => setActiveVideo(video)}
                  className="relative h-44 w-full overflow-hidden bg-slate-800 cursor-pointer"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-accent-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                      {video.category}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[10px] text-white/90 bg-black/60 px-2 py-0.5 rounded-md font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{video.duration}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <h3 
                    onClick={() => setActiveVideo(video)}
                    className="text-sm font-bold text-slate-100 dark:text-slate-100 text-slate-900 group-hover:text-accent-500 transition-colors cursor-pointer leading-snug line-clamp-2"
                  >
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed font-normal line-clamp-3">
                    {video.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setActiveVideo(video)}
                  className="w-full py-2 bg-slate-800/80 dark:bg-slate-800/80 bg-slate-100 hover:bg-accent-500 dark:hover:bg-accent-500 hover:text-white dark:hover:text-white text-slate-300 dark:text-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>مشاهدة المقطع</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* مشغل الفيديو المنبثق (Video Player Modal) */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#161C24] border border-slate-700 p-4 sm:p-6 text-white shadow-2xl text-right space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-accent-500 bg-accent-500/10 px-2.5 py-1 rounded-full border border-accent-500/20">
                  {activeVideo.category}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white">{activeVideo.title}</h4>
              </div>

              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Screen */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-slate-800">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeVideo.description}
            </p>

          </div>
        </div>
      )}

    </section>
  );
}
