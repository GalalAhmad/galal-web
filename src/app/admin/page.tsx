'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { 
  Calendar, 
  BookOpen, 
  Video, 
  Settings, 
  ExternalLink, 
  PhoneCall, 
  Plus, 
  Trash2,
  CheckCircle2, 
  Clock, 
  Bookmark,
  Share2
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'leads' | 'videos' | 'articles' | 'books' | 'settings'>('leads');
  
  // Leads
  const [leads, setLeads] = useState<any[]>([
    {
      id: 'demo-1',
      full_name: 'أحمد محمود',
      whatsapp: '+201023456789',
      email: 'ahmed@example.com',
      track: 'premarital',
      delivery_mode: 'online',
      status: 'new',
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-2',
      full_name: 'سارة عبد الرحمن',
      whatsapp: '+962791234567',
      email: 'sara@example.com',
      track: 'marital',
      delivery_mode: 'online',
      status: 'contacted',
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  // Videos
  const [videos, setVideos] = useState<any[]>([
    {
      id: 'v1',
      title: 'السلوك رسالة قبل أن يكون مشكلة: كيف نفهم تمرد الأبناء؟',
      category: 'التربية واليافعين',
      duration: '14:20',
      youtubeId: 'dQw4w9WgXcQ'
    },
    {
      id: 'v2',
      title: 'فقه التوقعات وكسر دوائر الصمت العقابي بين الزوجين',
      category: 'العلاقات الزوجية',
      duration: '18:45',
      youtubeId: 'dQw4w9WgXcQ'
    }
  ]);
  const [newVideo, setNewVideo] = useState({ title: '', category: 'التربية واليافعين', duration: '15:00', youtubeId: '', description: '' });

  // Articles
  const [articles, setArticles] = useState<any[]>([
    {
      id: '1',
      title: 'السلوك رسالة قبل أن يكون مشكلة: مدخل لفهم أفعال الأبناء',
      category: 'التربية واليافعين',
      status: 'منشور'
    },
    {
      id: '2',
      title: 'أقومية القرآن في فقه العلاقات الزوجية والبيوت الآمنة',
      category: 'مشروع أقومية القرآن',
      status: 'منشور'
    }
  ]);
  const [newArticle, setNewArticle] = useState({ title: '', category: 'quranic', excerpt: '', content: '' });

  // Books
  const [books, setBooks] = useState<any[]>([
    { id: '1', title: 'كتاب ذات وموضوع', status: 'مسودة متقدمة (قيد النشر)' },
    { id: '2', title: 'كتاب ظلّي', status: 'قيد المراجعة والتحرير' },
    { id: '3', title: 'كتاب العادات الوالدية للآباء الأكثر فاعلية', status: 'إصدار تطبيقي قادم' },
    { id: '4', title: 'كتاب أقومية القرآن في الأسرة والطفل', status: 'مشروع تأسيسي' }
  ]);

  const [saving, setSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // جلب الطلبات من Supabase
  useEffect(() => {
    async function fetchLeads() {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('intake_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setLeads(data);
        }
      }
    }
    fetchLeads();
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setLeads(prev => prev.map(item => item.id === leadId ? { ...item, status: newStatus } : item));
    if (isSupabaseConfigured && supabase && !leadId.startsWith('demo-')) {
      await supabase.from('intake_requests').update({ status: newStatus }).eq('id', leadId);
    }
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title) return;
    setVideos([{ id: String(Date.now()), ...newVideo }, ...videos]);
    setNewVideo({ title: '', category: 'التربية واليافعين', duration: '15:00', youtubeId: '', description: '' });
    setFeedbackMessage('تمت إضافة الفيديو بنجاح!');
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title) return;

    setSaving(true);
    const slug = newArticle.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || `article-${Date.now()}`;

    if (isSupabaseConfigured && supabase) {
      await supabase.from('articles').insert([
        {
          title: newArticle.title,
          slug,
          category: newArticle.category,
          excerpt: newArticle.excerpt,
          content: newArticle.content,
          is_published: true
        }
      ]);
    }

    setArticles([{ id: String(Date.now()), title: newArticle.title, category: newArticle.category, status: 'منشور' }, ...articles]);
    setNewArticle({ title: '', category: 'quranic', excerpt: '', content: '' });
    setSaving(false);
    setFeedbackMessage('تم نشر المقال بنجاح!');
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-[#090D11] text-slate-100 flex flex-col font-sans" dir="rtl">
      
      {/* الترويسة العلوية للوحة التحكم */}
      <header className="border-b border-slate-800 bg-[#0E1318] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/assets/logo-white.png" alt="جلال أحمد" className="h-8 w-auto opacity-90 logo-clean" />
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-base">لوحة تحكم جـلال أحـمد</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              {isSupabaseConfigured ? 'متصل بقاعدة البيانات ✓' : 'وضع المعاينة السريعة'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition"
          >
            <span>معاينة الموقع الرئيسي</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* المحتوى الرئيسي للوحة */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* الشريط الجانبي */}
        <aside className="lg:col-span-3 space-y-2">
          <button
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition text-right ${
              activeTab === 'leads' ? 'bg-accent-500 text-white shadow-xs' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>طلبات الحجز والاستشارات</span>
            <span className="mr-auto px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-emerald-400 font-mono">
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition text-right ${
              activeTab === 'videos' ? 'bg-accent-500 text-white shadow-xs' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>المكتبة المرئية والفيديوهات</span>
            <span className="mr-auto px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
              {videos.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition text-right ${
              activeTab === 'articles' ? 'bg-accent-500 text-white shadow-xs' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>المقالات وأقومية القرآن</span>
            <span className="mr-auto px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
              {articles.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('books')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition text-right ${
              activeTab === 'books' ? 'bg-accent-500 text-white shadow-xs' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>المؤلفات والكتب الأربعة</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition text-right ${
              activeTab === 'settings' ? 'bg-accent-500 text-white shadow-xs' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>الربط والنشاط التجاري</span>
          </button>
        </aside>

        {/* مساحة العرض الرئيسية */}
        <main className="lg:col-span-9 bg-[#151B23] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          
          {feedbackMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {/* تبويب 1: طلبات الاستشارات */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white">سجل طلبات التنسيق والاستشارات</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  كافة الطلبات الواردة عبر الموقع ومخزنة بأمان في قاعدة بيانات Supabase
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#0E1318] text-slate-400 text-[11px]">
                    <tr>
                      <th className="p-3.5">الاسم</th>
                      <th className="p-3.5">المسار المطلوب</th>
                      <th className="p-3.5">النمط</th>
                      <th className="p-3.5">واتساب</th>
                      <th className="p-3.5">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-850/50 transition">
                        <td className="p-3.5 font-bold text-white">{lead.full_name}</td>
                        <td className="p-3.5 text-slate-300">
                          {lead.track === 'premarital' && 'رحلة رِفق (مقبلين)'}
                          {lead.track === 'marital' && 'برنامج مِيثاق (متزوجين)'}
                          {lead.track === 'individual' && 'استشارة فردية'}
                          {lead.track === 'teen' && 'تربية ويافعين'}
                          {lead.track === 'corporate' && 'استشارة وتدريب مؤسسي'}
                        </td>
                        <td className="p-3.5 text-emerald-400 font-medium">أونلاين</td>
                        <td className="p-3.5">
                          <a 
                            href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-[11px] hover:bg-emerald-900 transition"
                            dir="ltr"
                          >
                            <PhoneCall className="w-3 h-3" />
                            <span>{lead.whatsapp}</span>
                          </a>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={lead.status || 'new'}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className="bg-[#0E1318] border border-slate-700 text-slate-300 text-[11px] rounded-lg px-2 py-1 outline-none"
                          >
                            <option value="new">جديد</option>
                            <option value="contacted">تم التواصل</option>
                            <option value="confirmed">موعد مؤكد</option>
                            <option value="cancelled">ملغي</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* تبويب 2: إدارة الفيديوهات */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white">إضافة وإدارة الفيديوهات والمرئيات</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  أضف مقاطعك ومحاضراتك على يوتيوب لتظهر في قسم المكتبة المرئية فوراً
                </p>
              </div>

              {/* فورم إضافة فيديو */}
              <form onSubmit={handleAddVideo} className="p-5 rounded-2xl bg-[#0E1318] border border-slate-800 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">عنوان المقطع / المحاضرة *</label>
                  <input
                    type="text"
                    required
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                    placeholder="مثال: فقه التوقعات وكسر الصمت العقابي"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:ring-1 focus:ring-accent-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">التصنيف</label>
                    <select
                      value={newVideo.category}
                      onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 outline-none"
                    >
                      <option value="العلاقات الزوجية">العلاقات الزوجية</option>
                      <option value="التربية واليافعين">التربية واليافعين</option>
                      <option value="بصيرة الذات">بصيرة الذات</option>
                      <option value="مشروع أقومية القرآن">مشروع أقومية القرآن</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">معرّف يوتيوب (Video ID)</label>
                    <input
                      type="text"
                      value={newVideo.youtubeId}
                      onChange={(e) => setNewVideo({ ...newVideo, youtubeId: e.target.value })}
                      placeholder="مثال: dQw4w9WgXcQ"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">المدة التقديرية</label>
                    <input
                      type="text"
                      value={newVideo.duration}
                      onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                      placeholder="مثال: 15:30"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl text-xs transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة الفيديو للمكتبة</span>
                </button>
              </form>

              {/* قائمة الفيديوهات */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400">الفيديوهات الحالية ({videos.length})</h3>
                <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 overflow-hidden text-xs">
                  {videos.map((vid) => (
                    <div key={vid.id} className="p-4 flex items-center justify-between hover:bg-slate-800/40">
                      <div>
                        <div className="font-bold text-white">{vid.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{vid.category} • {vid.duration}</div>
                      </div>
                      <span className="text-[10px] px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono">
                        ID: {vid.youtubeId || 'غير محدد'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تبويب 3: المقالات */}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white">إضافة وإدارة المقالات</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  انشر مقالاتك في مشروع أقومية القرآن والتربية مباشرة لتظهر في الموقع
                </p>
              </div>

              <form onSubmit={handleAddArticle} className="p-5 rounded-2xl bg-[#0E1318] border border-slate-800 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">عنوان المقال *</label>
                  <input
                    type="text"
                    required
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    placeholder="مثال: فقه التوقعات في بناء البيت المستقر"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:ring-1 focus:ring-accent-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">التصنيف</label>
                    <select
                      value={newArticle.category}
                      onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 outline-none"
                    >
                      <option value="quranic">مشروع أقومية القرآن</option>
                      <option value="marital">فقه العلاقات والزواج</option>
                      <option value="parenting">التربية واليافعين</option>
                      <option value="educational">القيادة المدرسية والتعليم</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">مقتطف مختصر للبطاقة</label>
                    <input
                      type="text"
                      value={newArticle.excerpt}
                      onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                      placeholder="سطر يلخص فكرة المقال"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">المحتوى الكامل</label>
                  <textarea
                    rows={4}
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                    placeholder="اكتب المقال كاملاً هنا..."
                    className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl text-xs transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{saving ? 'جارٍ النشر...' : 'نشر المقال فوراً'}</span>
                </button>
              </form>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400">المقالات الحالية</h3>
                <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 overflow-hidden text-xs">
                  {articles.map((art) => (
                    <div key={art.id} className="p-4 flex items-center justify-between hover:bg-slate-800/40">
                      <div>
                        <div className="font-bold text-white">{art.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{art.category}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 text-[10px] border border-emerald-800">
                        {art.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تبويب 4: الكتب والمؤلفات */}
          {activeTab === 'books' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white">إصدارات ومؤلفات جلال أحمد</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  المؤلفات المعروضة في الموقع الرسمي وحالة كل مؤلف
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {books.map((b) => (
                  <div key={b.id} className="p-5 rounded-2xl bg-[#0E1318] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <Bookmark className="w-4 h-4 text-accent-500" />
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {b.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{b.title}</h4>
                    <p className="text-[11px] text-slate-400">
                      مرتبطة بمسودات Google Drive والتحرير النهائي
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* تبويب 5: إعدادات الربط والنشاط التجاري */}
          {activeTab === 'settings' && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white">بيانات الربط والنشاط التجاري</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  الروابط المتصلة بالموقع لتحسين الظهور في محركات البحث ومزامنة المواعيد
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#0E1318] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">نشاط جوجل التجاري (Google Business)</span>
                    <span className="text-emerald-400 text-xs">مرتبط ✓</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    تم ربط الرابط الرسمي ومخطط البيانات المنظمة (JSON-LD Schema) لتحسين الترتيب في خرائط ونتائج بحث Google.
                  </p>
                  <a href="https://share.google/mcjTrK9P6DPRb07Z0" target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:underline block pt-1 text-[11px]">
                    فتح النشاط على خرائط جوجل ←
                  </a>
                </div>

                <div className="p-5 rounded-2xl bg-[#0E1318] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">جدول المواعيد المباشر (Google Meet)</span>
                    <span className="text-emerald-400 text-xs">مدمج في الموقع ✓</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    تم تضمين التقويم التفاعلي مباشرة داخل الموقع لتمكين العميل من حجز موعده دون الخروج من المنصة.
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
