'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Settings, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  PhoneCall, 
  Plus, 
  Check, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'leads' | 'articles' | 'settings'>('leads');
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
      whatsapp: '+966541234567',
      email: 'sara@example.com',
      track: 'marital',
      delivery_mode: 'online',
      status: 'contacted',
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

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

  const [newArticle, setNewArticle] = useState({
    title: '',
    category: 'quranic',
    excerpt: '',
    content: ''
  });

  const [savingArticle, setSavingArticle] = useState(false);
  const [articleMessage, setArticleMessage] = useState('');

  // جلب الطلبات الحقيقية من Supabase إن وُجدت
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
      await supabase
        .from('intake_requests')
        .update({ status: newStatus })
        .eq('id', leadId);
    }
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title) return;

    setSavingArticle(true);
    setArticleMessage('');

    const slug = newArticle.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || `article-${Date.now()}`;

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('articles').insert([
        {
          title: newArticle.title,
          slug,
          category: newArticle.category,
          excerpt: newArticle.excerpt,
          content: newArticle.content,
          is_published: true
        }
      ]);

      if (error) {
        setArticleMessage('حدث خطأ في حفظ المقال في سوبا بيز');
        setSavingArticle(false);
        return;
      }
    }

    setArticles(prev => [
      { id: String(Date.now()), title: newArticle.title, category: newArticle.category, status: 'منشور' },
      ...prev
    ]);

    setNewArticle({ title: '', category: 'quranic', excerpt: '', content: '' });
    setSavingArticle(false);
    setArticleMessage('تمت إضافة المقال بنجاح!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" dir="rtl">
      
      {/* الترويسة العلوية للوحة التحكم */}
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/assets/logo-white.png" alt="جلال" className="h-8 w-auto opacity-90" />
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-base">لوحة تحكم د. جلال أحمد</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              {isSupabaseConfigured ? 'متصل بـ Supabase ✓' : 'الوضع المحلي (Mock Mode)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
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
            className={`w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition text-right ${
              activeTab === 'leads' ? 'bg-brand-700 text-white shadow-xs' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>طلبات الحجز والاستشارات</span>
            <span className="mr-auto px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-emerald-400">
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition text-right ${
              activeTab === 'articles' ? 'bg-brand-700 text-white shadow-xs' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>المكتبة المعرفية والمقالات</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition text-right ${
              activeTab === 'settings' ? 'bg-brand-700 text-white shadow-xs' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات النشر و Supabase</span>
          </button>
        </aside>

        {/* مساحة العرض الرئيسية */}
        <main className="lg:col-span-9 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          
          {/* تبويب 1: طلبات الاستشارات */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">سجل طلبات التنسيق والحجوزات</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    كافة الطلبات الواردة عبر الموقع مخزنة بأمان في قاعدة بيانات سوبا بيز
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-slate-400 text-[11px]">
                    <tr>
                      <th className="p-3.5">الاسم</th>
                      <th className="p-3.5">المسار المطلوب</th>
                      <th className="p-3.5">النمط</th>
                      <th className="p-3.5">التواصل</th>
                      <th className="p-3.5">حالة الطلب</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-800/50 transition">
                        <td className="p-3.5 font-bold text-white">{lead.full_name}</td>
                        <td className="p-3.5 text-slate-300">
                          {lead.track === 'premarital' && 'رحلة رِفق (مقبلين)'}
                          {lead.track === 'marital' && 'برنامج مِيثاق (متزوجين)'}
                          {lead.track === 'individual' && 'استشارة فردية'}
                          {lead.track === 'teen' && 'تربية ويافعين'}
                          {lead.track === 'corporate' && 'استشارة مؤسسية'}
                        </td>
                        <td className="p-3.5 text-slate-400">
                          {lead.delivery_mode === 'in_person' ? 'حضوري' : 'أونلاين'}
                        </td>
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
                            className="bg-slate-950 border border-slate-700 text-slate-300 text-[11px] rounded-lg px-2 py-1 outline-none"
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

          {/* تبويب 2: إدارة المقالات */}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white">إضافة وإدارة المقالات</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  انشر مقالاتك في مشروع أقومية القرآن والتربية مباشرة لتظهر في الموقع
                </p>
              </div>

              {articleMessage && (
                <div className="p-3 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs">
                  {articleMessage}
                </div>
              )}

              {/* فورم إضافة مقال */}
              <form onSubmit={handleAddArticle} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">عنوان المقال *</label>
                  <input
                    type="text"
                    required
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    placeholder="مثال: فقه التوقعات في بناء البيت المستقر"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:ring-1 focus:ring-brand-500"
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
                  disabled={savingArticle}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{savingArticle ? 'جارٍ النشر...' : 'نشر المقال فوراً'}</span>
                </button>
              </form>

              {/* قائمة المقالات المنشورة */}
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

          {/* تبويب 3: إعدادات الربط والمنظومة */}
          {activeTab === 'settings' && (
            <div className="space-y-6 text-xs">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white">إعدادات المنظومة (مثل مشروع رفق)</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  الخطوات المتبعة لربط Supabase + GitHub + Vercel + Cloudflare
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">1. قاعدة بيانات سوبا بيز (Supabase)</span>
                    <span className="text-emerald-400 text-xs">جاهز</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    تم إنشاء ملف <code className="text-brand-400">supabase/schema.sql</code>. افتح محرر SQL في Supabase وقم بلصق محتواه لإنشاء الجداول وسياسات الأمان بضغطة زر.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">2. الكود على جيت هب (GitHub)</span>
                    <span className="text-emerald-400 text-xs">جاهز للرفع</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    المشروع مهيأ بالكامل كـ Git Repository محلي، وجاهز للربط مع المستودع الخاص بك على GitHub فوراً.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">3. الاستضافة والواجهة (Vercel)</span>
                    <span className="text-emerald-400 text-xs">جاهز للنشر</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    استيراد المستودع على Vercel بنقرة واحدة، وتعيين متغيرات البيئة ليعمل في ثوانٍ مع شهادة أمان وسرعة عالمية.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">4. ربط النطاق (Hostinger ➔ Cloudflare)</span>
                    <span className="text-emerald-400 text-xs">الخطوة الأخيرة</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    تغيير الـ Nameservers في Hostinger لتشير إلى Cloudflare، وتوجيه الـ CNAME في Cloudflare إلى Vercel (`cname.vercel-dns.com`).
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
