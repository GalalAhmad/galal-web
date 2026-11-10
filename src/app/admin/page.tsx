'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import AdminCoursesView from '@/components/AdminCoursesView';
import AdminNewsletterView from '@/components/AdminNewsletterView';
import { articlesData as initialArticles } from '@/data/articles';
import {
  Building2,
  GraduationCap,
  Star,
  DollarSign,
  FileText,
  Settings,
  ExternalLink,
  Send,
  Trash2,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  MessageSquare,
  AlertCircle,
  Plus,
  RefreshCw,
  LogOut,
  Video,
  Play,
  HelpCircle,
  Edit3,
  BookOpen,
  Sparkles,
  Search,
  Mail,
  Sun,
  Moon,
  User,
  MessageSquareHeart,
  Eye,
  CheckCheck,
  Globe,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Phone,
  BookmarkCheck
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Navigation Tabs for Platform Admin (strictly platform content, zero consultation overlap)
  type AdminTab =
    | 'articles'
    | 'videos'
    | 'courses'
    | 'inquiries'
    | 'advice'
    | 'feedback'
    | 'newsletter'
    | 'faqs'
    | 'settings';

  const [activeTab, setActiveTab] = useState<AdminTab>('articles');

  // Single-fetch guard to prevent re-render / fetch loops
  const hasFetchedRef = useRef(false);

  // Notifications & Toast
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const showToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  // 1. Articles State
  const [articles, setArticles] = useState(initialArticles);
  const [newArticle, setNewArticle] = useState({
    title: '',
    category: 'التربية واليافعين',
    readTime: '6 دقائق',
    excerpt: '',
    content: ''
  });
  const [articleFilter, setArticleFilter] = useState('all');
  const [articleSearchQuery, setArticleSearchQuery] = useState('');

  // 2. Videos State
  const [videosList, setVideosList] = useState<any[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [videoCategoryFilter, setVideoCategoryFilter] = useState('all');
  const [newVideo, setNewVideo] = useState({
    title: '',
    youtubeUrl: '',
    category: 'quran',
    categoryLabel: 'مشروع أقومية القرآن',
    duration: '10:00',
    desc: ''
  });

  // 3. Institutional Inquiries State
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'new' | 'contacted' | 'completed'>('all');

  // 4. Advice Box Messages State
  const [adviceList, setAdviceList] = useState<any[]>([]);
  const [loadingAdvice, setLoadingAdvice] = useState(true);
  const [adviceFilter, setAdviceFilter] = useState<'all' | 'new' | 'reviewed'>('all');

  // 5. Client Testimonials & Feedback State
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [showManualReviewForm, setShowManualReviewForm] = useState(false);
  const [manualReview, setManualReview] = useState({
    clientName: '',
    sessionType: 'استشارة نفسية فردية',
    serviceCategory: 'psychological',
    rating: 5,
    feedback: '',
    location: 'أونلاين',
    isPublished: true,
  });
  const [clientNameForWhatsapp, setClientNameForWhatsapp] = useState('');
  const [serviceForWhatsapp, setServiceForWhatsapp] = useState('استشارة نفسية فردية');
  const [copiedReviewMsg, setCopiedReviewMsg] = useState(false);

  // 6. FAQs State
  const [faqsList, setFaqsList] = useState<any[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState<boolean>(true);
  const [newFaq, setNewFaq] = useState({ q: '', a: '' });
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editFaqData, setEditFaqData] = useState({ q: '', a: '' });

  // 7. Platform Settings State
  const [settings, setSettings] = useState<any>({
    siteName: 'د. جلال أحمد',
    siteTitle: 'استشارات وبناء الإنسان والأسرة',
    phone: '+20 101 487 6666',
    whatsapp: '201014876666',
    email: 'info@galalahmad.com',
    cancellationPolicyHours: 48,
    calendlyUrl: 'https://calendly.com',
    showPricing: false,
    individualFee: 'تبدأ من 250 ر.س',
    maritalFee: 'تبدأ من 350 ر.س',
    parentingFee: 'تبدأ من 250 ر.س',
    emergencyFee: '500 ر.س',
    institutionalFee: 'حسب نطاق العمل',
    mithaqNextBatch: 'نوفمبر 2026',
    videosEnabled: true,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Strict Role Control & Anti-Flicker Protection
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/login?redirect=/admin');
      } else if (user.role !== 'admin' && user.role !== 'counselor') {
        // Send unauthorized clients directly to client profile
        router.replace('/profile');
      } else if (!hasFetchedRef.current) {
        hasFetchedRef.current = true;
        fetchData();
      }
    }
  }, [user, authLoading, router]);

  // Master Data Fetch for Platform Content
  const fetchData = async () => {
    try {
      const [inqRes, fbRes, setRes, vidRes, advRes, faqRes, artRes] = await Promise.allSettled([
        fetch('/api/inquiries', { cache: 'no-store' }),
        fetch('/api/feedback', { cache: 'no-store' }),
        fetch('/api/admin/settings', { cache: 'no-store' }),
        fetch('/api/admin/videos', { cache: 'no-store' }),
        fetch('/api/advice?admin=true', { cache: 'no-store' }),
        fetch('/api/admin/faqs', { cache: 'no-store' }),
        fetch('/api/articles', { cache: 'no-store' }),
      ]);

      if (inqRes.status === 'fulfilled' && inqRes.value.ok) {
        const inqData = await inqRes.value.json();
        if (inqData.inquiries) setInquiries(inqData.inquiries);
      }
      if (fbRes.status === 'fulfilled' && fbRes.value.ok) {
        const fbData = await fbRes.value.json();
        if (fbData.feedback) setFeedbackList(fbData.feedback);
      }
      if (setRes.status === 'fulfilled' && setRes.value.ok) {
        const setData = await setRes.value.json();
        if (setData.settings) setSettings((prev: any) => ({ ...prev, ...setData.settings }));
      }
      if (vidRes.status === 'fulfilled' && vidRes.value.ok) {
        const vidData = await vidRes.value.json();
        if (vidData.videos) setVideosList(vidData.videos);
      }
      if (advRes.status === 'fulfilled' && advRes.value.ok) {
        const advData = await advRes.value.json();
        if (advData.advice) setAdviceList(advData.advice);
      }
      if (faqRes.status === 'fulfilled' && faqRes.value.ok) {
        const faqData = await faqRes.value.json();
        if (faqData.faqs) setFaqsList(faqData.faqs);
      }
      if (artRes.status === 'fulfilled' && artRes.value.ok) {
        const artData = await artRes.value.json();
        if (artData.articles && Array.isArray(artData.articles)) setArticles(artData.articles);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoadingInquiries(false);
      setLoadingFeedback(false);
      setLoadingVideos(false);
      setLoadingAdvice(false);
      setLoadingFaqs(false);
    }
  };

  const handleLogout = () => {
    logout();
    try {
      localStorage.removeItem('galal_admin_session');
    } catch (e) {}
    router.push('/login');
  };

  // Article Handlers
  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.content) return;

    const created: any = {
      title: newArticle.title,
      category: 'quran',
      categoryLabel: newArticle.category,
      author: 'د. جلال أحمد',
      summary: newArticle.excerpt || newArticle.content.slice(0, 150) + '...',
      content: [newArticle.content],
      readTime: newArticle.readTime || '5 دقائق قراءة',
    };

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(created),
      });
      const data = await res.json();
      if (data.articles) {
        setArticles(data.articles);
      } else {
        setArticles([created, ...articles]);
      }
      setNewArticle({
        title: '',
        category: 'التربية واليافعين',
        readTime: '6 دقائق',
        excerpt: '',
        content: ''
      });
      showToast('تم نشر المقال في المنتدى الثقافي بنجاح ✓');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteArticle = async (artId: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا المقال نهائياً من الموقع؟')) return;
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: artId }),
      });
      const data = await res.json();
      if (data.articles) {
        setArticles(data.articles);
        showToast('تم حذف المقال بنجاح');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Video Handlers
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.youtubeUrl) return;

    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVideo),
      });
      const data = await res.json();
      if (data.videos) {
        setVideosList(data.videos);
        setNewVideo({
          title: '',
          youtubeUrl: '',
          category: 'quran',
          categoryLabel: 'مشروع أقومية القرآن',
          duration: '10:00',
          desc: ''
        });
        showToast('تمت إضافة الفيديو بنجاح إلى قسم المرئيات ✓');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الفيديو من قسم المرئيات؟')) return;
    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });
      const data = await res.json();
      if (data.videos) {
        setVideosList(data.videos);
        showToast('تم حذف الفيديو بنجاح');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Inquiry Handlers
  const handleInquiryStatus = async (id: string, newStatus: string) => {
    setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    try {
      await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      showToast('تم تحديث حالة الطلب المؤسسي بنجاح ✓');
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
      showToast('تم حذف الطلب بنجاح');
    } catch (err) {
      console.error(err);
    }
  };

  // Advice Box Handlers
  const handleAdviceStatus = async (id: string, newStatus: string) => {
    setAdviceList(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    try {
      await fetch('/api/advice?admin=true', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      showToast('تم تحديث حالة رسالة النصيحة ✓');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAdvice = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة من صندوق النصيحة؟')) return;
    setAdviceList(prev => prev.filter(item => item.id !== id));
    try {
      await fetch(`/api/advice?id=${id}&admin=true`, { method: 'DELETE' });
      showToast('تم حذف الرسالة بنجاح');
    } catch (err) {
      console.error(err);
    }
  };

  // Feedback & Testimonial Handlers
  const handleToggleFeedbackPublish = async (id: string, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;
    setFeedbackList(prev => prev.map(item => item.id === id ? { ...item, isPublished: updatedStatus } : item));
    try {
      await fetch('/api/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isPublished: updatedStatus }),
      });
      showToast(updatedStatus ? 'تم اعتماد ونشر التقييم في الموقع ✓' : 'تم حجب التقييم بنجاح');
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
      showToast('تم حذف التقييم بنجاح');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddManualReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualReview.feedback) return;
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualReview),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setFeedbackList(prev => [data.item, ...prev]);
        setShowManualReviewForm(false);
        setManualReview({
          clientName: '',
          sessionType: 'استشارة نفسية فردية',
          serviceCategory: 'psychological',
          rating: 5,
          feedback: '',
          location: 'أونلاين',
          isPublished: true,
        });
        showToast('تم إدراج التقييم الجديد بنجاح ✓');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // WhatsApp Review Message Generator
  const generatedFeedbackMsg = `السلام عليكم ورحمة الله وبركاته، أهلاً بك أخي/أختي الكريم/ة ${clientNameForWhatsapp || ''}، سعدنا جداً بلقائك وتقديم الجلسة الاستشارية (${serviceForWhatsapp}) مع د. جلال أحمد. رأيك وتجربتك تهمنا وتسهم في تطوير خدماتنا، نسعد بمشاركتك تقييمك الموجز عبر الرابط الآمن:%0Ahttps://galalahmad.com/feedback`;

  const copyReviewText = () => {
    const rawText = decodeURIComponent(generatedFeedbackMsg).replace(/%0A/g, '\n');
    navigator.clipboard.writeText(rawText);
    setCopiedReviewMsg(true);
    setTimeout(() => setCopiedReviewMsg(false), 3000);
  };

  // FAQ Handlers
  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaq.q || !newFaq.a) return;
    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFaq),
      });
      const data = await res.json();
      if (data.faqs) {
        setFaqsList(data.faqs);
        setNewFaq({ q: '', a: '' });
        showToast('تمت إضافة السؤال الشائع بنجاح ✓');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEditFaq = async (id: string) => {
    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'edit', id, ...editFaqData }),
      });
      const data = await res.json();
      if (data.faqs) {
        setFaqsList(data.faqs);
        setEditingFaqId(null);
        showToast('تم تعديل السؤال بنجاح ✓');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السؤال الشائع؟')) return;
    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });
      const data = await res.json();
      if (data.faqs) {
        setFaqsList(data.faqs);
        showToast('تم حذف السؤال بنجاح');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Settings Handlers
  const handleUpdateSettingsDirect = async (partialSettings: any) => {
    try {
      const updated = { ...settings, ...partialSettings };
      setSettings(updated);
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      showToast('تم تحديث الإعدادات بنجاح ✓');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showToast('تم حفظ كافة إعدادات وسياسات المنصة بنجاح ✓');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSettings(false);
    }
  };

  // Tab Definitions
  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;
  const newAdviceCount = adviceList.filter(a => a.status === 'new').length;

  const ADMIN_TABS = [
    { id: 'articles' as AdminTab, label: 'المقالات والمنتدى', icon: BookOpen, count: articles.length },
    { id: 'videos' as AdminTab, label: 'المرئيات واليوتيوب', icon: Video, count: videosList.length },
    { id: 'courses' as AdminTab, label: 'أكاديمية الكورسات', icon: GraduationCap },
    { id: 'inquiries' as AdminTab, label: 'طلبات المؤسسات', icon: Building2, count: newInquiriesCount, alertBadge: newInquiriesCount > 0 },
    { id: 'advice' as AdminTab, label: 'صندوق النصيحة', icon: MessageSquareHeart, count: newAdviceCount, alertBadge: newAdviceCount > 0 },
    { id: 'feedback' as AdminTab, label: 'الآراء والتقييمات', icon: Star, count: feedbackList.length },
    { id: 'newsletter' as AdminTab, label: 'النشرة البريدية', icon: Mail },
    { id: 'faqs' as AdminTab, label: 'الأسئلة الشائعة', icon: HelpCircle, count: faqsList.length },
    { id: 'settings' as AdminTab, label: 'إعدادات المنصة', icon: Settings },
  ];

  // 1. Anti-Flicker Loading Screen
  if (authLoading || !user || (user.role !== 'admin' && user.role !== 'counselor')) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F15] flex flex-col items-center justify-center p-4 text-center text-slate-600 dark:text-slate-300 font-sans" dir="rtl">
        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm mb-4">
          <RefreshCw className="w-6 h-6 animate-spin text-[#154F9C]" />
        </div>
        <p className="text-sm font-bold text-slate-900 dark:text-white">جاري تحميل لوحة تحكم المنصة...</p>
        <p className="text-xs text-slate-500 mt-1">التحقق من الصلاحيات الإدارية ومزامنة المحتوى</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F15] text-slate-800 dark:text-slate-100 font-sans flex flex-col transition-colors duration-200" dir="rtl">
      
      {/* 1. TOP HEADER */}
      <header className="border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#0E1524]/95 px-4 sm:px-6 py-3.5 sticky top-0 z-40 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Right Brand & Title */}
          <div className="flex items-center gap-3">
            <Link href="/" title="د. جلال أحمد — الرئيسية">
              <img
                src={theme === 'dark' ? '/assets/logo-white.png' : '/assets/logo.png'}
                alt="د. جلال أحمد"
                className="h-8 w-auto opacity-95 logo-clean"
              />
            </Link>
            <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-slate-200 dark:border-slate-700">
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                لوحة إدارة المنصة (Admin)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#154F9C] dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold">
                إدارة المحتوى العام
              </span>
            </div>
          </div>

          {/* Left Actions & User Info */}
          <div className="flex items-center gap-2 text-xs">
            
            {/* If counselor is logged in, offer quick jump to clinical workspace */}
            {user?.role === 'counselor' && (
              <Link
                href="/counselor"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black transition shadow-xs text-xs"
                title="الانتقال إلى مساحة المعالج الإكلينيكية وسجلات العملاء"
              >
                <span>مساحة المعالج 🩺</span>
              </Link>
            )}

            {/* Site Preview Link */}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition text-xs border border-slate-200 dark:border-slate-700"
              title="معاينة الواجهة الأمامية للموقع في نافذة جديدة"
            >
              <span>معاينة الموقع</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Refresh Button */}
            <button
              onClick={fetchData}
              title="تحديث البيانات"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer border border-slate-200 dark:border-slate-700"
              title={theme === 'dark' ? 'التحويل للمظهر الفاتح' : 'التحويل للمظهر الليلي'}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
            </button>

            {/* User Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">
              <User className="w-3.5 h-3.5 text-[#154F9C]" />
              <span>{user?.name || 'مدير المنصة'}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              title="تسجيل الخروج"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. TOAST NOTIFICATION */}
      {saveSuccessMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#154F9C] text-white px-5 py-2.5 rounded-2xl font-black text-xs shadow-2xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* 3. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">

        {/* Welcome Header Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#121926] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌿</span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                أهلاً بك في لوحة تحكم المنصة العامة
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              إدارة محتويات ومسارات الموقع، المقالات، المرئيات، طلبات المؤسسات، والتواصل مع الجمهور.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('articles')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>مقال جديد</span>
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-rose-500" />
              <span>إضافة فيديو</span>
            </button>
          </div>
        </div>

        {/* Metric Summary Cards (4 Clean Cards matching Counselor & Client design) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div 
            onClick={() => setActiveTab('articles')}
            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121926] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#154F9C]/50 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">المقالات والمنتدى</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#154F9C] dark:text-blue-300 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{articles.length}</span>
              <span className="text-[11px] text-slate-400">مقال منشور</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('videos')}
            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121926] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#154F9C]/50 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">المرئيات واليوتيوب</span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{videosList.length}</span>
              <span className="text-[11px] text-slate-400">حلقة وبرنامج</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('inquiries')}
            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121926] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#154F9C]/50 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">طلبات المؤسسات</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{inquiries.length}</span>
              {newInquiriesCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300 font-bold">
                  {newInquiriesCount} جديد
                </span>
              )}
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('advice')}
            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121926] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#154F9C]/50 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">صندوق النصيحة</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                <MessageSquareHeart className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{adviceList.length}</span>
              {newAdviceCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 font-bold">
                  {newAdviceCount} جديد
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Horizontal Segmented Pill Navigation Bar */}
        <div className="bg-white dark:bg-[#121926] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-1.5 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-xs font-bold shadow-xs">
          {ADMIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                  isActive
                    ? 'bg-[#154F9C] text-white font-black shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : tab.alertBadge
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 4. ACTIVE TAB PANELS */}

        {/* TAB 1: ARTICLES (المقالات والمنتدى الثقافي) */}
        {activeTab === 'articles' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Create Article Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121926] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#154F9C]" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">إضافة مقال جديد للمنتدى الثقافي</h2>
                </div>
                <span className="text-xs text-slate-400">ينشر فورياً في صفحة المقالات</span>
              </div>

              <form onSubmit={handleAddArticle} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">عنوان المقال *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: كيف نفهم الصمت العقابي بين الزوجين؟"
                      value={newArticle.title}
                      onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">المحور / التصنيف</label>
                    <select
                      value={newArticle.category}
                      onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#154F9C]"
                    >
                      <option value="التربية واليافعين">التربية واليافعين</option>
                      <option value="الزواج والأسرة">الزواج والأسرة</option>
                      <option value="مشروع أقومية القرآن">مشروع أقومية القرآن</option>
                      <option value="الصحة النفسية والاتزان">الصحة النفسية والاتزان</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">المقدمة / ملخص المقال (Excerpt)</label>
                  <input
                    type="text"
                    placeholder="فقرة موجزة تظهر في قائمة المقالات كتمهيد..."
                    value={newArticle.excerpt}
                    onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">نص المقال الكامل *</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="اكتب المقال هنا كاملاً..."
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#154F9C] hover:bg-[#103D7A] text-white font-bold text-xs transition shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>نشر المقال في المنتدى</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Published Articles List */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121926] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">المقالات المنشورة حالياً ({articles.length})</h3>
                </div>
                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="بحث في المقالات..."
                    value={articleSearchQuery}
                    onChange={(e) => setArticleSearchQuery(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {articles
                  .filter((a) => !articleSearchQuery || a.title.toLowerCase().includes(articleSearchQuery.toLowerCase()))
                  .map((art) => (
                    <div
                      key={art.id}
                      className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:border-[#154F9C]/40 transition space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-[#154F9C] dark:text-blue-300 font-bold">
                            {art.categoryLabel || art.category}
                          </span>
                          <span>{art.readTime || '5 دقائق قراءة'}</span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                          {art.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {art.summary}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                        <Link
                          href={`/articles#${art.id}`}
                          target="_blank"
                          className="text-[#154F9C] hover:underline flex items-center gap-1 font-bold text-[11px]"
                        >
                          <span>معاينة المقال</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => handleDeleteArticle(art.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                          title="حذف المقال"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: VIDEOS (المرئيات واليوتيوب) */}
        {activeTab === 'videos' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Add Video Form */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121926] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-rose-500" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">إضافة حلقة أو فيديو جديد</h2>
                </div>
                <span className="text-xs text-slate-400">تدعم روابط YouTube العادية والمختصرة (youtu.be)</span>
              </div>

              <form onSubmit={handleAddVideo} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">عنوان الفيديو *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: كيف تبني علاقة آمنة مع ابنك المراهق؟"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رابط يوتيوب (URL) *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={newVideo.youtubeUrl}
                      onChange={(e) => setNewVideo({ ...newVideo, youtubeUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">المسار / التصنيف</label>
                    <select
                      value={newVideo.category}
                      onChange={(e) => {
                        const val = e.target.value;
                        const labels: Record<string, string> = {
                          quran: 'مشروع أقومية القرآن',
                          family: 'بناء الأسرة والزواج',
                          youth: 'التربية واليافعين',
                          general: 'إضاءات فكرية وإنسانية',
                        };
                        setNewVideo({ ...newVideo, category: val, categoryLabel: labels[val] || val });
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="quran">مشروع أقومية القرآن</option>
                      <option value="family">بناء الأسرة والزواج</option>
                      <option value="youth">التربية واليافعين</option>
                      <option value="general">إضاءات فكرية وإنسانية</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">المدة الزمنية التقريبية</label>
                    <input
                      type="text"
                      placeholder="مثال: 12:45"
                      value={newVideo.duration}
                      onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">وصف موجز (اختياري)</label>
                    <input
                      type="text"
                      placeholder="نبذة سريعة عن الحلقة..."
                      value={newVideo.desc}
                      onChange={(e) => setNewVideo({ ...newVideo, desc: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>حفظ ونشر الفيديو</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Videos Grid */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121926] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">الفيديوهات المسجلة ({videosList.length})</h3>
                <Link
                  href="/videos"
                  target="_blank"
                  className="text-xs text-[#154F9C] hover:underline flex items-center gap-1 font-bold"
                >
                  <span>عرض صفحة المرئيات للجمهور</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {loadingVideos ? (
                <div className="p-8 text-center text-xs text-slate-500">جاري تحميل المرئيات...</div>
              ) : videosList.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400">لا توجد مرئيات مضافة بعد. أضف أول فيديو أعلاه.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videosList.map((vid) => (
                    <div
                      key={vid.id}
                      className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 font-bold">
                            {vid.categoryLabel || vid.category}
                          </span>
                          <span>{vid.duration}</span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2">
                          {vid.title}
                        </h4>
                        {vid.desc && (
                          <p className="text-xs text-slate-500 line-clamp-2">{vid.desc}</p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                        <a
                          href={vid.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-rose-600 hover:underline flex items-center gap-1 font-bold text-[11px]"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>مشاهدة في يوتيوب</span>
                        </a>
                        <button
                          onClick={() => handleDeleteVideo(vid.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                          title="حذف الفيديو"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: COURSES (أكاديمية الكورسات والمسارات) */}
        {activeTab === 'courses' && (
          <div className="space-y-6 animate-fadeIn">
            <AdminCoursesView
              clientProfiles={[]}
              siteSettings={settings}
              onUpdateSettings={async (newSet) => {
                await handleUpdateSettingsDirect(newSet);
              }}
              onRefreshData={async () => {
                await fetchData();
              }}
            />
          </div>
        )}

        {/* TAB 4: INQUIRIES (طلبات المؤسسات والمدارس) */}
        {activeTab === 'inquiries' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121926] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 animate-fadeIn">
            
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#154F9C]" />
                  <span>طلبات المؤسسات والمدارس التعليمية الواردة</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  تصل مباشرة من مسار المؤسسات وتظهر هنا لحظياً للتعامل معها
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {[
                  { id: 'all', label: `الكل (${inquiries.length})` },
                  { id: 'new', label: `جديدة (${newInquiriesCount})` },
                  { id: 'contacted', label: 'تم التواصل' },
                  { id: 'completed', label: 'مكتملة' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setInquiryFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                      inquiryFilter === f.id
                        ? 'bg-[#154F9C] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingInquiries ? (
              <div className="p-8 text-center text-xs text-slate-500">جاري تحميل الطلبات...</div>
            ) : inquiries.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">لا توجد طلبات مؤسسية واردة حالياً.</div>
            ) : (
              <div className="space-y-3">
                {inquiries
                  .filter((item) => inquiryFilter === 'all' || item.status === inquiryFilter)
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        item.status === 'new'
                          ? 'bg-blue-50/40 dark:bg-blue-950/20 border-[#154F9C]/40 shadow-xs'
                          : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{item.instName || item.orgName}</span>
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                              {item.instType || 'مؤسسة / مدرسة'}
                            </span>
                            {item.status === 'new' && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold animate-pulse">
                                جديد
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                            <span>المسؤول: {item.contactName || item.name}</span>
                            <span>•</span>
                            <span dir="ltr">{item.contactPhone || item.phone}</span>
                            {item.contactEmail && (
                              <>
                                <span>•</span>
                                <span>{item.contactEmail}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Status Select & Actions */}
                        <div className="flex items-center gap-2">
                          <select
                            value={item.status || 'new'}
                            onChange={(e) => handleInquiryStatus(item.id, e.target.value)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white"
                          >
                            <option value="new">طلب جديد</option>
                            <option value="contacted">تم التواصل</option>
                            <option value="completed">مكتمل ومعتمد</option>
                          </select>

                          {item.contactPhone && (
                            <a
                              href={`https://wa.me/${(item.contactPhone || '').replace(/[^\d]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1"
                              title="مراسلة عبر واتساب"
                            >
                              <span>واتساب</span>
                            </a>
                          )}

                          <button
                            onClick={() => handleDeleteInquiry(item.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                            title="حذف الطلب"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Request Details */}
                      <div className="mt-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
                        <strong className="block text-slate-500 dark:text-slate-400 mb-1 text-[11px]">تفاصيل ونطاق الطلب:</strong>
                        {item.details || item.message || 'لا توجد تفاصيل إضافية مسجلة.'}
                      </div>
                    </div>
                  ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 5: ADVICE BOX (صندوق النصيحة والملاحظات) */}
        {activeTab === 'advice' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121926] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 animate-fadeIn">
            
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquareHeart className="w-5 h-5 text-purple-600" />
                  <span>رسائل وملاحظات صندوق النصيحة</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  رسائل وملاحظات الجمهور الواردة عبر صندوق النصيحة السري بالموقع
                </p>
              </div>

              <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                إجمالي الرسائل: {adviceList.length}
              </span>
            </div>

            {loadingAdvice ? (
              <div className="p-8 text-center text-xs text-slate-500">جاري تحميل الرسائل...</div>
            ) : adviceList.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">لا توجد رسائل جديدة في صندوق النصيحة.</div>
            ) : (
              <div className="space-y-3">
                {adviceList.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      item.status === 'new'
                        ? 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-500/40 shadow-xs'
                        : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.senderName || 'متابع كريم (مجهول)'}
                        </span>
                        {item.senderPhone && (
                          <span className="text-slate-400 font-mono" dir="ltr">{item.senderPhone}</span>
                        )}
                        {item.status === 'new' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600 text-white font-bold">
                            جديد
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString('ar-EG') : 'حديثاً'}
                        </span>
                        <button
                          onClick={() => handleAdviceStatus(item.id, item.status === 'reviewed' ? 'new' : 'reviewed')}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-bold cursor-pointer"
                        >
                          {item.status === 'reviewed' ? 'تحديد كجديد' : 'تمت المراجعة ✓'}
                        </button>
                        <button
                          onClick={() => handleDeleteAdvice(item.id)}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                          title="حذف الرسالة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 6: FEEDBACK & REVIEWS (الآراء والتقييمات) */}
        {activeTab === 'feedback' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* WhatsApp Generator & Add Review Bar */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121926] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span>إدارة الآراء والتقييمات وتوليد روابط المتابعة</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    التحكم في التقييمات المنشورة في الموقع، أو توليد رسالة واتساب للعميل لطلب رأيه
                  </p>
                </div>

                <button
                  onClick={() => setShowManualReviewForm(!showManualReviewForm)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showManualReviewForm ? 'إغلاق النموذج' : '+ إضافة تقييم يدوي'}</span>
                </button>
              </div>

              {/* Manual Review Form (Collapsible) */}
              {showManualReviewForm && (
                <form onSubmit={handleAddManualReview} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">إضافة تقييم معتمد للموقع:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="اسم المستفيد (أو أ. محمد)..."
                      value={manualReview.clientName}
                      onChange={(e) => setManualReview({ ...manualReview, clientName: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                    <select
                      value={manualReview.sessionType}
                      onChange={(e) => setManualReview({ ...manualReview, sessionType: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                    >
                      <option value="استشارة نفسية فردية">استشارة نفسية فردية</option>
                      <option value="استشارة زواج وأسرة">استشارة زواج وأسرة</option>
                      <option value="استشارة تربية ويافعين">استشارة تربية ويافعين</option>
                      <option value="جلسة طارئة واستجابة عاجلة">جلسة طارئة واستجابة عاجلة</option>
                    </select>
                    <select
                      value={manualReview.rating}
                      onChange={(e) => setManualReview({ ...manualReview, rating: parseInt(e.target.value) })}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 نجوم)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 نجوم)</option>
                    </select>
                  </div>
                  <textarea
                    required
                    rows={3}
                    placeholder="نص التقييم ورأي المستفيد..."
                    value={manualReview.feedback}
                    onChange={(e) => setManualReview({ ...manualReview, feedback: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
                    >
                      حفظ ونشر التقييم
                    </button>
                  </div>
                </form>
              )}

              {/* WhatsApp Review Generator */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                  مولّد رسالة طلب التقييم عبر واتساب:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="اسم العميل لدمجه في الرسالة..."
                    value={clientNameForWhatsapp}
                    onChange={(e) => setClientNameForWhatsapp(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                  <button
                    onClick={copyReviewText}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedReviewMsg ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedReviewMsg ? 'تم نسخ الرسالة بنجاح ✓' : 'نسخ نص رسالة التقييم'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Testimonials List */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121926] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                التقييمات المسجلة ({feedbackList.length})
              </h3>

              {loadingFeedback ? (
                <div className="p-8 text-center text-xs text-slate-500">جاري تحميل التقييمات...</div>
              ) : feedbackList.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400">لا توجد تقييمات بعد.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feedbackList.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 dark:text-white">{item.clientName || 'مستفيد'}</span>
                          <span className="text-amber-500 font-bold">{'★'.repeat(item.rating || 5)}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block">{item.sessionType}</span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          &quot;{item.feedback}&quot;
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                        <button
                          onClick={() => handleToggleFeedbackPublish(item.id, item.isPublished)}
                          className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                            item.isPublished
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {item.isPublished ? 'منشور في الموقع ✓' : 'محجوب عن العرض'}
                        </button>
                        <button
                          onClick={() => handleDeleteFeedback(item.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                          title="حذف التقييم"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 7: NEWSLETTER (النشرة البريدية) */}
        {activeTab === 'newsletter' && (
          <div className="space-y-6 animate-fadeIn">
            <AdminNewsletterView />
          </div>
        )}

        {/* TAB 8: FAQS (الأسئلة الشائعة) */}
        {activeTab === 'faqs' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Add FAQ Form */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121926] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">إضافة سؤال شائع جديد</h2>
                </div>
                <span className="text-xs text-slate-400">يظهر في صفحة الأسئلة الشائعة وصفحات الحجز</span>
              </div>

              <form onSubmit={handleAddFaq} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">السؤال *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: كيف يتم الحفاظ على سرية الجلسات والمعلومات الشخصية؟"
                    value={newFaq.q}
                    onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الإجابة المعتمدة *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="نص الإجابة الإرشادية والتنظيمية..."
                    value={newFaq.a}
                    onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none leading-relaxed"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-[#154F9C] hover:bg-[#103D7A] text-white font-bold text-xs transition cursor-pointer"
                  >
                    حفظ ونشر السؤال
                  </button>
                </div>
              </form>
            </div>

            {/* FAQs List */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121926] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                الأسئلة الشائعة الحالية ({faqsList.length})
              </h3>

              {loadingFaqs ? (
                <div className="p-8 text-center text-xs text-slate-500">جاري تحميل الأسئلة...</div>
              ) : faqsList.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400">لا توجد أسئلة مضافة بعد.</div>
              ) : (
                <div className="space-y-3">
                  {faqsList.map((faq) => (
                    <div
                      key={faq.id}
                      className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2"
                    >
                      {editingFaqId === faq.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editFaqData.q}
                            onChange={(e) => setEditFaqData({ ...editFaqData, q: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                          />
                          <textarea
                            rows={3}
                            value={editFaqData.a}
                            onChange={(e) => setEditFaqData({ ...editFaqData, a: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSaveEditFaq(faq.id)}
                              className="px-4 py-1.5 rounded-lg bg-[#154F9C] text-white text-xs font-bold"
                            >
                              حفظ التعديل
                            </button>
                            <button
                              onClick={() => setEditingFaqId(null)}
                              className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs"
                            >
                              إلغاء
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between text-xs">
                            <h4 className="font-bold text-slate-900 dark:text-white">{faq.q}</h4>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingFaqId(faq.id);
                                  setEditFaqData({ q: faq.q, a: faq.a });
                                }}
                                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                title="تعديل السؤال"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteFaq(faq.id)}
                                className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                                title="حذف السؤال"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 9: SETTINGS & POLICIES (إعدادات وسياسات المنصة) */}
        {activeTab === 'settings' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121926] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 animate-fadeIn">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  <span>إعدادات وسياسات المنصة العامة والرسوم</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  تعديل معلومات التواصل الرسمية، سياسة الإلغاء، الرسوم التقديرية، والتحكم في ظهور الأسعار للجمهور
                </p>
              </div>

              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="px-6 py-2.5 rounded-xl bg-[#154F9C] hover:bg-[#103D7A] text-white font-bold text-xs transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                {savingSettings ? 'جاري الحفظ...' : 'حفظ كافة الإعدادات ✓'}
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* Public Pricing Toggle */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    <span>عرض الرسوم والأسعار للجمهور على الموقع</span>
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    {settings.showPricing
                      ? 'الأسعار معروضة حالياً على كروت الاستشارات وصفحات الحجز.'
                      : 'الأسعار مخفية حالياً عن الزوار في الموقع بالكامل (الوضع الحالي المعتمد).'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, showPricing: !settings.showPricing })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    settings.showPricing
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {settings.showPricing ? 'الأسعار معروضة ✓' : 'الأسعار مخفية'}
                </button>
              </div>

              {/* General Platform Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">اسم المنصة</label>
                  <input
                    type="text"
                    value={settings.siteName || ''}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">عنوان المنصة الرئيسي</label>
                  <input
                    type="text"
                    value={settings.siteTitle || ''}
                    onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">البريد الإلكتروني الرسمي</label>
                  <input
                    type="email"
                    value={settings.email || ''}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Phones & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رقم الهاتف الظاهر للجمهور</label>
                  <input
                    type="text"
                    value={settings.phone || ''}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رقم الواتساب (بدون +)</label>
                  <input
                    type="text"
                    value={settings.whatsapp || ''}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">مهلة إلغاء الحجز (ساعات)</label>
                  <input
                    type="number"
                    value={settings.cancellationPolicyHours || 48}
                    onChange={(e) => setSettings({ ...settings, cancellationPolicyHours: parseInt(e.target.value) || 48 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                  />
                </div>
              </div>

              {/* Consultation Fees Reference */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">الرسوم المرجعية للاستشارات:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-bold">الاستشارة الفردية</label>
                    <input
                      type="text"
                      value={settings.individualFee || ''}
                      onChange={(e) => setSettings({ ...settings, individualFee: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-bold">الاستشارة الزوجية</label>
                    <input
                      type="text"
                      value={settings.maritalFee || ''}
                      onChange={(e) => setSettings({ ...settings, maritalFee: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-bold">الاستشارة التربوية</label>
                    <input
                      type="text"
                      value={settings.parentingFee || ''}
                      onChange={(e) => setSettings({ ...settings, parentingFee: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-bold">الاستجابة الطارئة</label>
                    <input
                      type="text"
                      value={settings.emergencyFee || ''}
                      onChange={(e) => setSettings({ ...settings, emergencyFee: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                    />
                  </div>
                </div>
              </div>

            </form>

          </div>
        )}

      </main>

    </div>
  );
}
