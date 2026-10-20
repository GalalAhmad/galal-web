'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Star, 
  DollarSign, 
  Compass, 
  FileText, 
  Settings, 
  ExternalLink, 
  PhoneCall, 
  Send, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  MessageSquare, 
  Users, 
  AlertCircle,
  Plus,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { articlesData as initialArticles } from '@/data/articles';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'feedback' | 'pricing' | 'tracks' | 'articles' | 'settings'>('inquiries');
  
  // Institutional Inquiries
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);

  // Client Feedback
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  // WhatsApp Review Message Generator
  const [clientNameForWhatsapp, setClientNameForWhatsapp] = useState('');
  const [serviceForWhatsapp, setServiceForWhatsapp] = useState('استشارة نفسية فردية');
  const [copiedReviewMsg, setCopiedReviewMsg] = useState(false);

  // Pricing & Settings
  const [settings, setSettings] = useState<any>({
    siteName: 'جلال أحمد',
    siteTitle: 'استشارات وبناء الإنسان والأسرة',
    phone: '+20 101 487 6666',
    whatsapp: '201014876666',
    email: 'info@galalahmad.com',
    cancellationPolicyHours: 48,
    calendlyUrl: 'https://calendly.com',
    individualFee: 'تبدأ من 250 ر.س',
    maritalFee: 'تبدأ من 350 ر.س',
    parentingFee: 'تبدأ من 250 ر.س',
    emergencyFee: '500 ر.س',
    institutionalFee: 'حسب نطاق العمل',
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Track settings
  const [tracksConfig, setTracksConfig] = useState({
    familyMithaqStatus: 'متاح للتسجيل',
    familyPremaritalStatus: 'متاح للتسجيل',
    institutionsStatus: 'متاح لاستقبال طلبات المؤسسات والمدارس',
    youthStatus: 'قيد الإعداد والتطوير',
  });

  // Articles
  const [articles, setArticles] = useState(initialArticles);
  const [newArticle, setNewArticle] = useState({
    title: '',
    category: 'التربية واليافعين',
    readTime: '6 دقائق',
    excerpt: '',
    content: ''
  });

  // Fetch inquiries and feedback
  const fetchData = async () => {
    try {
      const inqRes = await fetch('/api/inquiries');
      const inqData = await inqRes.json();
      if (inqData.inquiries) {
        setInquiries(inqData.inquiries);
      }

      const fbRes = await fetch('/api/feedback');
      const fbData = await fbRes.json();
      if (fbData.feedback) {
        setFeedbackList(fbData.feedback);
      }

      const setRes = await fetch('/api/admin/settings');
      const setData = await setRes.json();
      if (setData.settings) {
        setSettings((prev: any) => ({ ...prev, ...setData.settings }));
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoadingInquiries(false);
      setLoadingFeedback(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Inquiry Status
  const handleInquiryStatus = async (id: string, newStatus: string) => {
    setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    try {
      await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    setInquiries(prev => prev.filter(item => item.id !== id));
    try {
      await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'delete' }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Feedback Publish
  const handleToggleFeedbackPublish = async (id: string, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;
    setFeedbackList(prev => prev.map(item => item.id === id ? { ...item, isPublished: updatedStatus } : item));
    try {
      await fetch('/api/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isPublished: updatedStatus }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;
    setFeedbackList(prev => prev.filter(item => item.id !== id));
    try {
      await fetch('/api/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'delete' }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSaveSuccessMsg('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaveSuccessMsg('تم حفظ الإعدادات والأسعار بنجاح في النظام');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSettings(false);
    }
  };

  // Add Article
  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.content) return;

    const created: any = {
      id: `art-${Date.now()}`,
      title: newArticle.title,
      category: 'quran',
      categoryLabel: newArticle.category,
      author: 'جلال أحمد',
      summary: newArticle.excerpt || newArticle.content.slice(0, 150) + '...',
      content: [newArticle.content],
      readTime: newArticle.readTime || '5 دقائق قراءة',
      publishDate: 'الآن',
      readersCount: 1,
      rating: 5.0,
      ratingsCount: 1,
      commentsCount: 0,
      comments: []
    };

    setArticles([created, ...articles]);
    setNewArticle({
      title: '',
      category: 'التربية واليافعين',
      readTime: '6 دقائق',
      excerpt: '',
      content: ''
    });
    setSaveSuccessMsg('تمت إضافة المقال إلى المنتدى الثقافي بنجاح');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Generated WhatsApp feedback link text
  const generatedFeedbackMsg = `السلام عليكم ورحمة الله وبركاته، أهلاً بك أخي/أختي الكريم/ة ${clientNameForWhatsapp || ''}، سعدنا جداً بلقائك وتقديم الجلسة الاستشارية (${serviceForWhatsapp}) مع المستشار جلال أحمد. رأيك وتجربتك تهمنا وتسهم في تطوير خدماتنا، نسعد بمشاركتك تقييمك الموجز عبر الرابط الآمن:%0Ahttps://galalahmad.com/feedback`;

  const copyReviewText = () => {
    const rawText = decodeURIComponent(generatedFeedbackMsg).replace(/%0A/g, '\n');
    navigator.clipboard.writeText(rawText);
    setCopiedReviewMsg(true);
    setTimeout(() => setCopiedReviewMsg(false), 3000);
  };

  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;
  const pendingFeedbackCount = feedbackList.filter(f => !f.isPublished).length;

  return (
    <div className="min-h-screen bg-[#0A0F18] text-slate-100 flex flex-col font-sans" dir="rtl">
      
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-[#0E1524] px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img src="/assets/logo-white.png" alt="جلال أحمد" className="h-8 w-auto opacity-95 logo-clean" />
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-base">لوحة إدارة المستشار جلال أحمد</span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
              نشطة ومزامنة ✓
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {newInquiriesCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-950/60 border border-rose-800 text-rose-300 font-bold animate-pulse">
              <BellRing className="w-3.5 h-3.5" />
              <span>{newInquiriesCount} طلب مؤسسي جديد</span>
            </div>
          )}

          <button
            onClick={fetchData}
            title="تحديث البيانات"
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <Link 
            href="/" 
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#154F9C] text-white rounded-xl hover:bg-[#103D7A] transition font-semibold"
          >
            <span>معاينة الموقع</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-1.5">
          
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition text-right cursor-pointer ${
              activeTab === 'inquiries' ? 'bg-[#154F9C] text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4" />
              <span>الرسائل والطلبات المؤسسية</span>
            </div>
            {newInquiriesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                {newInquiriesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition text-right cursor-pointer ${
              activeTab === 'feedback' ? 'bg-[#154F9C] text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4" />
              <span>الآراء والتقييمات (Testimonials)</span>
            </div>
            {pendingFeedbackCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black">
                {pendingFeedbackCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition text-right cursor-pointer ${
              activeTab === 'pricing' ? 'bg-[#154F9C] text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>الأسعار والخدمات</span>
          </button>

          <button
            onClick={() => setActiveTab('tracks')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition text-right cursor-pointer ${
              activeTab === 'tracks' ? 'bg-[#154F9C] text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>المسارات والبرامج التدريبية</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition text-right cursor-pointer ${
              activeTab === 'articles' ? 'bg-[#154F9C] text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>المقالات والمنتدى الثقافي</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition text-right cursor-pointer ${
              activeTab === 'settings' ? 'bg-[#154F9C] text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات وسياسات الموقع</span>
          </button>

          <div className="pt-4 px-3">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
              <span className="font-bold text-slate-200 block">💡 نظام الإدارة المركزي:</span>
              <p>تم تنظيف لوحة التحكم وحذف الأقسام غير الموجودة (فيديوهات وكتب) لتطابق الموقع تماماً.</p>
            </div>
          </div>

        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9">

          {saveSuccessMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* TAB 1: INQUIRIES & INSTITUTIONAL LEADS */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#154F9C]" />
                    <span>طلبات المؤسسات والمدارس التعليمية الواردة</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    ترسل مباشرة من نموذج التواصل المؤسسي في مسار المؤسسات وتظهر هنا فورياً دون الحاجة للواتساب
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                  إجمالي الطلبات: {inquiries.length}
                </span>
              </div>

              {loadingInquiries ? (
                <div className="p-8 text-center text-xs text-slate-500">جارٍ تحميل الطلبات...</div>
              ) : inquiries.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400 text-xs">
                  لا توجد طلبات مؤسسية جديدة حالياً.
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-5 rounded-2xl border transition-all ${
                        item.status === 'new' 
                          ? 'bg-[#10192A] border-[#154F9C]/50 shadow-md shadow-[#154F9C]/10' 
                          : 'bg-[#0E1524] border-slate-800/80'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-white">{item.instName}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                              {item.instType}
                            </span>
                            {item.status === 'new' && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 font-bold animate-pulse">
                                جديد لم يُعالج
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span>المسؤول: <strong className="text-slate-200">{item.contactPerson}</strong></span>
                            <span>•</span>
                            <span dir="ltr" className="font-mono text-slate-300">{item.phone}</span>
                          </div>
                        </div>

                        {/* Status selector */}
                        <div className="flex items-center gap-2">
                          <select
                            value={item.status}
                            onChange={(e) => handleInquiryStatus(item.id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-xs rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#154F9C]"
                          >
                            <option value="new">جديد (غير متواصل)</option>
                            <option value="contacted">تم التواصل</option>
                            <option value="completed">مكتمل / معتمد</option>
                            <option value="archived">أرشيف</option>
                          </select>

                          <button
                            onClick={() => handleDeleteInquiry(item.id)}
                            title="حذف الطلب"
                            className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Inquiry Details */}
                      <div className="pt-3 space-y-3">
                        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs text-slate-300 leading-relaxed">
                          <span className="font-semibold text-slate-400 block mb-1">تفاصيل طلب البرنامج أو الاستشارة:</span>
                          {item.inquiry || 'لم يتم كتابة تفاصيل إضافية'}
                        </div>

                        {/* Quick Contact Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                          <span className="text-[11px] text-slate-500 font-mono">
                            تاريخ الإرسال: {new Date(item.created_at).toLocaleString('ar-EG')}
                          </span>

                          <div className="flex items-center gap-2">
                            <a
                              href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`السلام عليكم ورحمة الله وبركاته، أ. ${item.contactPerson}، تواصل معكم بخصوص طلبكم المؤسسي لـ (${item.instName}) عبر موقع المستشار جلال أحمد.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-[#168962]/20 hover:bg-[#168962]/40 text-[#4E7E76] dark:text-[#5E988E] border border-[#168962]/40 font-bold transition flex items-center gap-1.5"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>تواصل فوري واتساب</span>
                            </a>
                            <a
                              href={`tel:${item.phone}`}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition flex items-center gap-1.5"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>اتصال</span>
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CLIENT FEEDBACK & TESTIMONIALS */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              
              {/* WhatsApp Review Link Generator */}
              <div className="p-5 rounded-3xl bg-[#10192A] border border-[#154F9C]/40 space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">
                    مولّد رابط ورسالة تقييم الجلسة عبر واتساب
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  بعد انتهاء كل جلسة استشارية، أدخل اسم المستفيد واختر نوع الجلسة لتوليد رسالة جاهزة ونسخها أو إرسالها للعميل بضغطة زر لدعوته لتقييم الجلسة عبر <code className="text-[#60A5FA]">/feedback</code>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">اسم العميل / المستفيد:</label>
                    <input
                      type="text"
                      value={clientNameForWhatsapp}
                      onChange={(e) => setClientNameForWhatsapp(e.target.value)}
                      placeholder="مثال: أ. أحمد أو سارة"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#154F9C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">نوع الجلسة المقدمة:</label>
                    <select
                      value={serviceForWhatsapp}
                      onChange={(e) => setServiceForWhatsapp(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#154F9C]"
                    >
                      <option value="استشارة نفسية فردية">استشارة نفسية فردية</option>
                      <option value="استشارة زوجية وأسرية">استشارة زوجية وأسرية</option>
                      <option value="إرشاد والدي وتربوي">إرشاد والدي وتربوي</option>
                      <option value="حجز طارئ واستجابة عاجلة">حجز طارئ واستجابة عاجلة</option>
                      <option value="برنامج رحلة رفق وميثاق">برنامج رحلة رفق وميثاق</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={copyReviewText}
                    className="px-4 py-2 rounded-xl bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    {copiedReviewMsg ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedReviewMsg ? 'تم نسخ الرسالة ✓' : 'نسخ نص الرسالة الجاهزة'}</span>
                  </button>

                  <a
                    href={`https://wa.me/?text=${generatedFeedbackMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#168962] hover:bg-[#127050] text-white text-xs font-bold transition flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>مشاركة مباشرة عبر واتساب</span>
                  </a>
                </div>
              </div>

              {/* Submitted Feedback List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white">التقييمات وتجارب المستفيدين الواردة</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      يمكنك نشر أي تقييم ليظهر فوراً في قسم "آراء المستفيدين" في الصفحة الرئيسية وصفحة الخدمات
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                    الإجمالي: {feedbackList.length}
                  </span>
                </div>

                {loadingFeedback ? (
                  <div className="p-8 text-center text-xs text-slate-500">جارٍ التحميل...</div>
                ) : feedbackList.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400 text-xs">
                    لم تصل تقييمات جديدة بعد.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {feedbackList.map((item) => (
                      <div 
                        key={item.id}
                        className={`p-4 rounded-2xl border transition ${
                          item.isPublished 
                            ? 'bg-[#0E1524] border-emerald-800/40' 
                            : 'bg-slate-900/80 border-slate-800'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2.5 border-b border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{item.clientName}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                              {item.sessionType}
                            </span>
                            {item.location && (
                              <span className="text-[10px] text-slate-400">({item.location})</span>
                            )}
                            <div className="flex items-center gap-0.5 text-amber-400 mr-2">
                              {Array.from({ length: item.rating || 5 }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400" />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleFeedbackPublish(item.id, item.isPublished)}
                              className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                item.isPublished
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{item.isPublished ? 'منشور في الموقع ✓' : 'اعتماد ونشر في الموقع'}</span>
                            </button>

                            <button
                              onClick={() => handleDeleteFeedback(item.id)}
                              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="pt-2 text-xs text-slate-300 leading-relaxed">
                          «{item.feedback}»
                        </p>

                        <div className="pt-2 text-[10px] text-slate-500 font-mono">
                          {new Date(item.created_at).toLocaleDateString('ar-EG')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: SERVICES & PRICING */}
          {activeTab === 'pricing' && (
            <div className="p-6 rounded-3xl bg-[#0E1524] border border-slate-800 space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>تعديل الأسعار والرسوم المعلنة للجلسات</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  أي تعديل هنا يُحفظ في النظام ويظهر في بطاقات الأسعار في صفحة الخدمات وصفحات الحجز
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <label className="block text-xs font-bold text-slate-200">
                      الاستشارات النفسية الفردية (50 دقيقة)
                    </label>
                    <input
                      type="text"
                      value={settings.individualFee || ''}
                      onChange={(e) => setSettings({ ...settings, individualFee: e.target.value })}
                      placeholder="مثال: تبدأ من 250 ر.س"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                    <span className="text-[10px] text-slate-500 block">يظهر تحت بطاقة الجلسة الفردية</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <label className="block text-xs font-bold text-slate-200">
                      الاستشارات الزوجية والأسرية (60-75 دقيقة)
                    </label>
                    <input
                      type="text"
                      value={settings.maritalFee || ''}
                      onChange={(e) => setSettings({ ...settings, maritalFee: e.target.value })}
                      placeholder="مثال: تبدأ من 350 ر.س"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                    <span className="text-[10px] text-slate-500 block">يظهر تحت بطاقة الاستشارة الزوجية</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <label className="block text-xs font-bold text-slate-200">
                      الإرشاد الوالدي والتربوي (50 دقيقة)
                    </label>
                    <input
                      type="text"
                      value={settings.parentingFee || ''}
                      onChange={(e) => setSettings({ ...settings, parentingFee: e.target.value })}
                      placeholder="مثال: تبدأ من 250 ر.س"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                    <span className="text-[10px] text-slate-500 block">يظهر تحت بطاقة الإرشاد الوالدي</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <label className="block text-xs font-bold text-slate-200">
                      الحجز الطارئ والعاجل (خلال 24 ساعة)
                    </label>
                    <input
                      type="text"
                      value={settings.emergencyFee || ''}
                      onChange={(e) => setSettings({ ...settings, emergencyFee: e.target.value })}
                      placeholder="مثال: 500 ر.س"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                    <span className="text-[10px] text-slate-500 block">تسعير خاص للاستجابة الاستثنائية</span>
                  </div>

                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="px-6 py-2.5 rounded-full bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{savingSettings ? 'جارٍ الحفظ...' : 'حفظ تعديلات الأسعار'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: TRACKS & PROGRAMS */}
          {activeTab === 'tracks' && (
            <div className="p-6 rounded-3xl bg-[#0E1524] border border-slate-800 space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#154F9C]" />
                  <span>إدارة المسارات الثلاثة (مسارات بناء وتمكين)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  تعديل حالات التسجيل والظهور لجميع مسارات وبرامج الموقع
                </p>
              </div>

              <div className="space-y-4">
                
                {/* Family Track */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">1. مسار الأسرة (Family Track)</h3>
                      <p className="text-xs text-slate-400">يحتوي على: رحلة رفق | ميثاق (للمتزوجين) و رحلة رفق | وعي (للمقبلين)</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                      نشط ومكتمل الصفحات
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                      <span className="font-bold text-slate-200 block">رحلة رفق | ميثاق (للمتزوجين)</span>
                      <select 
                        value={tracksConfig.familyMithaqStatus}
                        onChange={(e) => setTracksConfig({ ...tracksConfig, familyMithaqStatus: e.target.value })}
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="متاح للتسجيل">متاح للتسجيل (المقاعد محدودة)</option>
                        <option value="قريباً فتح الدفعة القادمة">قريباً فتح الدفعة القادمة</option>
                        <option value="مكتمل العدد">مكتمل العدد حالياً</option>
                      </select>
                      <Link href="/courses/family/mithaq" target="_blank" className="text-[11px] text-[#60A5FA] hover:underline inline-block mt-1">
                        معاينة صفحة ميثاق ←
                      </Link>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                      <span className="font-bold text-slate-200 block">رحلة رفق | وعي (للمقبلين على الزواج)</span>
                      <select 
                        value={tracksConfig.familyPremaritalStatus}
                        onChange={(e) => setTracksConfig({ ...tracksConfig, familyPremaritalStatus: e.target.value })}
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="متاح للتسجيل">متاح للتسجيل (المقاعد محدودة)</option>
                        <option value="قريباً فتح الدفعة القادمة">قريباً فتح الدفعة القادمة</option>
                        <option value="مكتمل العدد">مكتمل العدد حالياً</option>
                      </select>
                      <Link href="/courses/family/premarital" target="_blank" className="text-[11px] text-[#60A5FA] hover:underline inline-block mt-1">
                        معاينة صفحة وعي ←
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Institutions Track */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">2. مسار المؤسسات التعليمية والتربوية</h3>
                      <p className="text-xs text-slate-400">تأهيل الكوادر، البيئة المدرسية الآمنة، وتصميم المناهج والحقائب</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#154F9C]/30 text-[#60A5FA] border border-[#154F9C]/50 font-bold">
                      يستقبل الطلبات للوحة الإدارة
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-300">النموذج يرسل الطلبات مباشرة لتبويب الرسائل بهذه اللوحة.</span>
                    <Link href="/courses/institutions" target="_blank" className="text-xs text-[#60A5FA] hover:underline">
                      معاينة صفحة المؤسسات ←
                    </Link>
                  </div>
                </div>

                {/* Youth Track */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">3. مسار الشباب - المكلفين</h3>
                      <p className="text-xs text-slate-400">برامج بناء الهوية والفكر وسؤال المعنى وتحديات العصر لليافعين والشباب</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-800 font-bold">
                      قيد الإعداد بانتظار المواد
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400">الصفحة جاهزة وتوضح أن التفاصيل تعلن قريباً عند اكتمال الحقيبة.</span>
                    <Link href="/courses/youth" target="_blank" className="text-xs text-[#60A5FA] hover:underline">
                      معاينة صفحة الشباب ←
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: ARTICLES & CULTURAL FORUM */}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              
              {/* Add New Article */}
              <div className="p-6 rounded-3xl bg-[#0E1524] border border-slate-800 space-y-4">
                <div className="border-b border-slate-800 pb-2.5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#154F9C]" />
                    <span>إضافة مقال جديد للمنتدى الثقافي</span>
                  </h3>
                </div>

                <form onSubmit={handleAddArticle} className="space-y-3 text-right">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">عنوان المقال *</label>
                      <input
                        type="text"
                        required
                        value={newArticle.title}
                        onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                        placeholder="مثال: كيف نفهم الصمت العقابي بين الزوجين؟"
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">المحور / التصنيف</label>
                      <select
                        value={newArticle.category}
                        onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="التربية واليافعين">التربية واليافعين</option>
                        <option value="العلاقات الزوجية">العلاقات الزوجية</option>
                        <option value="مشروع أقومية القرآن">مشروع أقومية القرآن</option>
                        <option value="الصحة النفسية والاتزان">الصحة النفسية والاتزان</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">المقدمة / ملخص المقال (Excerpt)</label>
                    <textarea
                      rows={2}
                      value={newArticle.excerpt}
                      onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                      placeholder="فقرة موجزة تظهر في قائمة المقالات كتمهيد..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">نص المقال الكامل *</label>
                    <textarea
                      rows={6}
                      required
                      value={newArticle.content}
                      onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                      placeholder="اكتب المقال هنا كاملاً..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white leading-relaxed font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>نشر المقال في المنتدى</span>
                  </button>
                </form>
              </div>

              {/* Existing Articles List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400">المقالات المنشورة حالياً ({articles.length})</h3>
                {articles.map((art: any) => (
                  <div key={art.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-white block">{art.title}</span>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="text-[#60A5FA]">{art.categoryLabel || art.category}</span>
                        <span>•</span>
                        <span>{art.readTime}</span>
                        <span>•</span>
                        <span>{art.readersCount || 100} قراءة</span>
                        <span>•</span>
                        <span>⭐ {art.rating || 5.0}</span>
                      </div>
                    </div>
                    <Link
                      href="/articles"
                      target="_blank"
                      className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 transition"
                    >
                      معاينة بالمنتدى
                    </Link>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 6: SITE SETTINGS & POLICIES */}
          {activeTab === 'settings' && (
            <div className="p-6 rounded-3xl bg-[#0E1524] border border-slate-800 space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-300" />
                  <span>إعدادات التواصل وسياسات الموقع الرسمية</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  تعديل أرقام الهواتف، الواتساب، رابط الحجز، وسياسة الإلغاء
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">رقم الهاتف الرسمي</label>
                    <input
                      type="text"
                      value={settings.phone || ''}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">رقم الواتساب الرسمي (بدون +)</label>
                    <input
                      type="text"
                      value={settings.whatsapp || ''}
                      onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني الرسمي</label>
                    <input
                      type="email"
                      value={settings.email || ''}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">مهلة الإلغاء وإعادة الجدولة (بالساعات)</label>
                    <input
                      type="number"
                      value={settings.cancellationPolicyHours || 48}
                      onChange={(e) => setSettings({ ...settings, cancellationPolicyHours: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5">المعتمد حالياً: 48 ساعة قبل الموعد</span>
                  </div>

                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="px-6 py-2.5 rounded-full bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{savingSettings ? 'جارٍ الحفظ...' : 'حفظ إعدادات الموقع'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
