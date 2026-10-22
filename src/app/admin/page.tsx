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
  BellRing,
  Lock,
  LogOut,
  Video,
  Play,
  HelpCircle,
  Edit3,
  Inbox,
  MessageSquareHeart,
  CalendarClock,
  CalendarCheck,
  BookOpen,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Link2,
  ShieldCheck,
  HeartHandshake,
  Brain,
  Sparkles,
  Zap,
  Search
} from 'lucide-react';
import { articlesData as initialArticles } from '@/data/articles';

export default function AdminDashboardPage() {
  // Authentication Protection State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [inputPassword, setInputPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'crm' | 'clients' | 'inquiries' | 'advice' | 'feedback' | 'faqs' | 'pricing' | 'tracks' | 'videos' | 'articles' | 'settings'>('crm');

  // Client Dossiers & Psychological Profiles State
  const [clientProfiles, setClientProfiles] = useState<any[]>([]);
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
  const [clientSearchQuery, setClientSearchQuery] = useState<string>('');
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);
  const [clientNotesInputs, setClientNotesInputs] = useState<Record<string, string>>({});
  const [newHwTitleInput, setNewHwTitleInput] = useState<Record<string, string>>({});
  const [newHwArticleSelect, setNewHwArticleSelect] = useState<Record<string, string>>({});

  // CRM Bookings State
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'all' | 'pending_verification' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [meetLinkInput, setMeetLinkInput] = useState<Record<string, string>>({});
  const [selectedHomeworkArticle, setSelectedHomeworkArticle] = useState<Record<string, string>>({});
  const [viewingReceiptImage, setViewingReceiptImage] = useState<string | null>(null);

  const SYMPTOM_LABELS: Record<string, string> = {
    anxiety: 'قلق وتوتر دائم أو هلع مفاجئ',
    sadness: 'حزن وكآبة مستمرة منذ فترة',
    overthinking: 'تفكير مفرط وزائد وصعوبة إيقاف الأفكار',
    ocd: 'أفكار وسواسية أو مخاوف متكررة',
    sleep_issues: 'أرق وصعوبة نوم أو كوابيس مزعجة',
    fatigue: 'كسل وخمول وفقدان الطاقة والشغف',
    anger: 'عصبية شديدة ونوبات غضب سريعة',
    isolation: 'انعزال وتجنب التفاعل مع الآخرين',
    trauma: 'مررت بصدمة أو موقف قاهر مؤخراً',
    existential: 'أسئلة وجودية وحيرة مؤرقة في المعنى',
    headache: 'صداع مستمر أو ثقل بالرأس',
    heartbeat: 'تسارع ضربات القلب أو خفقان',
    colon: 'اضطرابات القولون أو آلام المعدة',
    exhaustion: 'إرهاق وثقل عام في الجسم',
    tremors: 'رعشة بالأطراف أو ضيق في التنفس',
    none: 'لا أعاني من أعراض جسدية ملحوظة',
    first_time: 'تجربة استشارية أولى',
    yes_benefited: 'سبق الاستشارة واستفاد جزئياً',
    yes_not_satisfied: 'سبق الاستشارة ولم يشعر بارتياح كافٍ',
    communication_gap: 'انسداد الحوار والخرس الزوجي',
    frequent_fights: 'شجار دائم على أتفه الأسباب',
    emotional_coldness: 'برود عاطفي وجفاف في المشاعر',
    distrust: 'شكوك وصعوبة في بناء الثقة والأمان',
    financial_conflict: 'خلافات مالية أو تدخل الأهل في القرارات',
    intimacy_issues: 'فتور أو اضطراب في العلاقة الخاصة',
    divorce_threat: 'التهديد المستمر بالانفصال والطلاق',
    stubbornness: 'عناد شديد ورفض التوجيه',
    aggression: 'عدوانية ونوبات صراخ أو ضرب',
    academic_drop: 'تراجع دراسي وتكاسل وإهمال الواجبات',
    screen_addiction: 'تعلق شديد بالشاشات والألعاب الإلكترونية',
    lying_secretive: 'كذب وإخفاء أمور وسرية مفرطة',
    fear_shyness: 'خوف شديد أو خجل وانعدام الثقة بالنفس',
    peer_pressure: 'تأثر برفقاء السوء أو تمرد على قيم الأسرة',
    identity_crisis: 'حيرة في الهوية وتخبط في تحديد الاتجاه',
    low_esteem: 'ضعف تقدير الذات وجلد النفس المقلق',
    existential_questions: 'شكوك وأسئلة وجودية وفكرية ملحة',
    relationship_distraction: 'تعلق عاطفي مشتت يؤثر على الدراسة والمستقبل',
    loss_of_passion: 'فقدان الشغف والغموض حول المستقبل',
    parent_friction: 'صدام دائم وشعور بأن الأهل لا يفهمونني',
    panic_breakdown: 'نوبة هلع أو انهيار نفسي مفاجئ',
    acute_conflict: 'أزمة زوجية أو أسرية طارئة مهددة بالانفصال الفوري',
    teen_crisis: 'تصرف طارئ أو خطير من الابن يتطلب تدخلاً عاجلاً',
    urgent_decision: 'موقف مصيري يتطلب قراراً واستشارة خلال ساعات',
  };
  
  // Institutional Inquiries
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);

  // Advice Box Messages
  const [adviceList, setAdviceList] = useState<any[]>([]);
  const [loadingAdvice, setLoadingAdvice] = useState(true);

  // Client Feedback
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

  // FAQs
  const [faqsList, setFaqsList] = useState<any[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState<boolean>(true);
  const [newFaq, setNewFaq] = useState({ q: '', a: '' });
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editFaqData, setEditFaqData] = useState({ q: '', a: '' });

  // Videos List
  const [videosList, setVideosList] = useState<any[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [newVideo, setNewVideo] = useState({
    title: '',
    youtubeUrl: '',
    category: 'quran',
    categoryLabel: 'مشروع أقومية القرآن',
    duration: '10:00',
    desc: ''
  });

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
    mithaqNextBatch: 'نوفمبر 2026',
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

  // Check Authentication on load
  useEffect(() => {
    try {
      const auth = localStorage.getItem('galal_admin_session');
      if (auth === 'active') {
        setIsAuthenticated(true);
      }
    } catch (e) {}
    setAuthLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    // Primary admin password
    const validPasswords = ['galal@admin2026', 'galalahmad2026', 'galal2026', 'admin@galal'];
    if (validPasswords.includes(inputPassword.trim())) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem('galal_admin_session', 'active');
      } catch (e) {}
    } else {
      setAuthError('كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('galal_admin_session');
    } catch (e) {}
  };

  // Fetch inquiries, feedback, settings, and videos
  const fetchData = async () => {
    try {
      const inqRes = await fetch('/api/inquiries', { cache: 'no-store' });
      const inqData = await inqRes.json();
      if (inqData.inquiries) {
        setInquiries(inqData.inquiries);
      }

      const fbRes = await fetch('/api/feedback', { cache: 'no-store' });
      const fbData = await fbRes.json();
      if (fbData.feedback) {
        setFeedbackList(fbData.feedback);
      }

      const setRes = await fetch('/api/admin/settings', { cache: 'no-store' });
      const setData = await setRes.json();
      if (setData.settings) {
        setSettings((prev: any) => ({ ...prev, ...setData.settings }));
      }

      const vidRes = await fetch('/api/admin/videos', { cache: 'no-store' });
      const vidData = await vidRes.json();
      if (vidData.videos) {
        setVideosList(vidData.videos);
      }

      const advRes = await fetch('/api/advice', { cache: 'no-store' });
      const advData = await advRes.json();
      if (advData.advice) {
        setAdviceList(advData.advice);
      }

      const faqRes = await fetch('/api/admin/faqs', { cache: 'no-store' });
      const faqData = await faqRes.json();
      if (faqData.faqs) {
        setFaqsList(faqData.faqs);
      }

      const bookRes = await fetch('/api/bookings', { cache: 'no-store' });
      const bookData = await bookRes.json();
      if (bookData.bookings) {
        setBookingsList(bookData.bookings);
      }

      const profRes = await fetch('/api/user/profile', { cache: 'no-store' });
      const profData = await profRes.json();
      if (profData.profiles) {
        setClientProfiles(profData.profiles);
      }

      const artRes = await fetch('/api/articles', { cache: 'no-store' });
      const artData = await artRes.json();
      if (artData.articles && Array.isArray(artData.articles)) {
        setArticles(artData.articles);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoadingInquiries(false);
      setLoadingFeedback(false);
      setLoadingVideos(false);
      setLoadingAdvice(false);
      setLoadingFaqs(false);
      setLoadingBookings(false);
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

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

  // Add Manual Review
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
        setSaveSuccessMsg('تم حفظ التقييم بنجاح وإدراجه في قائمة الآراء');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      }
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

  // Toggle Videos Live Status
  const handleToggleVideosLive = async () => {
    const nextStatus = !settings.videosEnabled;
    setSettings((prev: any) => ({ ...prev, videosEnabled: nextStatus, videosPublished: nextStatus }));
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videosEnabled: nextStatus, videosPublished: nextStatus }),
      });
      setSaveSuccessMsg(nextStatus ? 'تم تفعيل صفحة المرئيات بث حي للجمهور بنجاح' : 'تم تحويل صفحة المرئيات إلى وضع (قريباً) بنجاح');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // Update Advice Status
  const handleAdviceStatus = async (id: string, newStatus: string) => {
    setAdviceList(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    try {
      await fetch('/api/advice', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAdvice = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة من صندوق النصيحة؟')) return;
    setAdviceList(prev => prev.filter(item => item.id !== id));
    try {
      await fetch(`/api/advice?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
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
        setSaveSuccessMsg('تمت إضافة السؤال الشائع بنجاح للموقع');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
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
        setSaveSuccessMsg('تم تعديل السؤال بنجاح');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
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
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Article
  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.content) return;

    const created: any = {
      title: newArticle.title,
      category: 'quran',
      categoryLabel: newArticle.category,
      author: 'جلال أحمد',
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
      setSaveSuccessMsg('تمت إضافة المقال إلى المنتدى الثقافي والموقع بنجاح');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Article
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
        setSaveSuccessMsg('تم حذف المقال بنجاح');
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Video Handler
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
        setSaveSuccessMsg('تمت إضافة الفيديو بنجاح إلى قسم المرئيات');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Video Handler
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
      }
    } catch (err) {
      console.error(err);
    }
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
  const newAdviceCount = adviceList.filter(a => a.status === 'new').length;
  const pendingFeedbackCount = feedbackList.filter(f => !f.isPublished).length;

  const pendingBookingsCount = bookingsList.filter(b => b.status === 'pending_verification').length;
  const confirmedBookingsCount = bookingsList.filter(b => b.status === 'confirmed').length;
  const completedBookingsCount = bookingsList.filter(b => b.status === 'completed').length;
  const cancelledBookingsCount = bookingsList.filter(b => b.status === 'cancelled').length;

  const handleBookingStatus = async (id: string, newStatus: string) => {
    setBookingsList(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    try {
      await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setSaveSuccessMsg(`تم تحديث حالة الحجز إلى: ${newStatus === 'confirmed' ? 'مؤكد ومجدول' : newStatus === 'completed' ? 'مكتمل بنجاح' : newStatus === 'cancelled' ? 'ملغي' : 'قيد المراجعة'}`);
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  const handleUpdateBookingMeetLink = async (id: string) => {
    const link = meetLinkInput[id];
    if (!link) return;
    setBookingsList(prev => prev.map(b => b.id === id ? { ...b, meetLink: link } : b));
    try {
      await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, meetLink: link }),
      });
      setSaveSuccessMsg('تم حفظ وتحديث رابط الجلسة بنجاح');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to update meet link:', err);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الحجز نهائياً من السجلات؟')) return;
    setBookingsList(prev => prev.filter(b => b.id !== id));
    try {
      await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'delete' }),
      });
      setSaveSuccessMsg('تم حذف سجل الحجز بنجاح');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to delete booking:', err);
    }
  };

  const openWhatsAppWithMeetLink = (booking: any) => {
    const meet = meetLinkInput[booking.id] || booking.meetLink || 'https://meet.google.com';
    const msg = `السلام عليكم ورحمة الله وبركاته، أهلاً بك أستاذ ${booking.clientName} الكريم.
معك المستشار جلال أحمد، يسعدني تأكيد موعد جلستنا الاستشارية (${booking.trackLabel}).

🗓️ *الموعد:* ${booking.slotDate}
⏰ *الوقت:* ${booking.slotTime} (بتوقيت مكة والقاهرة)
💻 *رابط الحضور المباشر عبر Google Meet:*
${meet}

يرجى التواجد قبل الموعد بـ 5 دقائق في مكان هادئ ومريح لضمان أقصى فائدة من الجلسة.
أهلاً ومرحباً بك دائماً.`;
    const cleanPhone = (booking.clientPhone || '').replace(/[^\d]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const openWhatsAppWithHomework = (booking: any) => {
    const articleId = selectedHomeworkArticle[booking.id];
    const article = articles.find(a => a.id === articleId) || articles[0];
    const articleUrl = `https://galalahmad.com/articles#${article?.id || ''}`;
    const msg = `السلام عليكم أستاذ ${booking.clientName}،
بناءً على ما ناقشناه في جلستنا الاستشارية ولمتابعة خطة التمكين والوعي، أشاركك هذا المقال العلاجي الهام للقراءة والتأمل:

📖 *"${article?.title}"*
🔗 الرابط: ${articleUrl}

يسعدني أن تدون أبرز ما استوقفك لنناقشه في خطواتنا القادمة.
مع خالص التحية، جلال أحمد`;
    const cleanPhone = (booking.clientPhone || '').replace(/[^\d]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const openWhatsAppReviewRequest = (booking: any) => {
    const reviewUrl = `https://galalahmad.com/feedback`;
    const msg = `السلام عليكم أستاذ ${booking.clientName}،
أتمنى أن تكون الجلسة الاستشارية قد تركت أثراً طيباً وخطوات واضحة على طريق استقرارك واتزانك.

يهمني كثيراً أن تشاركني انطباعك وتقييمك الصادق للتجربة عبر هذا الرابط السريع (متاح باسم مستعار أو سري):
🔗 ${reviewUrl}

ممتن جداً لثقتك الكريمة.
أخوك/ جلال أحمد`;
    const cleanPhone = (booking.clientPhone || '').replace(/[^\d]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Save Private Counselor Notes for Client
  const handleSaveClientNotes = async (clientId: string) => {
    const notesText = clientNotesInputs[clientId];
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: clientId, notes: notesText }),
      });
      const data = await res.json();
      if (data.success) {
        setClientProfiles(prev => prev.map(p => p.id === clientId ? { ...p, clinicalNotes: notesText } : p));
        setSaveSuccessMsg('تم حفظ الملاحظات الإكلينيكية الخاصة بالمستفيد بنجاح');
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add Assigned Homework / Reading to Client
  const handleAddClientHomework = async (clientId: string) => {
    const customTitle = newHwTitleInput[clientId] || '';
    const selectedArticleId = newHwArticleSelect[clientId] || '';
    
    let title = customTitle.trim();
    let link = '';
    
    if (selectedArticleId) {
      const art = initialArticles.find(a => a.id === selectedArticleId);
      if (art) {
        title = title ? `${title} (مقال: ${art.title})` : `قراءة مقال: ${art.title}`;
        link = `/articles#${art.id}`;
      }
    }

    if (!title) {
      alert('يرجى كتابة عنوان التكليف أو اختيار مقال موصى به');
      return;
    }

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: clientId,
          homework: { title, link },
        }),
      });
      const data = await res.json();
      if (data.success && data.profile) {
        setClientProfiles(prev => prev.map(p => p.id === clientId ? data.profile : p));
        setNewHwTitleInput(prev => ({ ...prev, [clientId]: '' }));
        setNewHwArticleSelect(prev => ({ ...prev, [clientId]: '' }));
        setSaveSuccessMsg('تم إسناد التكليف للمستفيد بنجاح وسيظهر في ملفه الشخصي');
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Remove Homework from Client
  const handleRemoveClientHomework = async (clientId: string, hwId: string) => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: clientId, removeHomeworkId: hwId }),
      });
      const data = await res.json();
      if (data.success && data.profile) {
        setClientProfiles(prev => prev.map(p => p.id === clientId ? data.profile : p));
        setSaveSuccessMsg('تم حذف التكليف بنجاح');
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 1. Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0F18] flex items-center justify-center text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-[#154F9C]" />
      </div>
    );
  }

  // 2. Authentication Gate (Protecting Admin Panel strictly for Galal Ahmad)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0F18] text-slate-100 flex items-center justify-center p-4 selection:bg-[#154F9C] selection:text-white" dir="rtl">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#0E1524] border border-slate-800 shadow-2xl space-y-6 text-right">
          <div className="text-center space-y-3">
            <img src="/assets/logo-white.png" alt="جلال أحمد" className="h-10 w-auto mx-auto logo-clean" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>منطقة تحكم محمية ومشفرة</span>
            </div>
            <h1 className="text-xl font-black text-white">
              لوحة إدارة المستشار جلال أحمد
            </h1>
            <p className="text-xs text-slate-400">
              أدخل كلمة المرور الخاصة بك لتسجيل الدخول والتحكم في الموقع
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                كلمة المرور السرية:
              </label>
              <input
                type="password"
                required
                autoFocus
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#154F9C] text-center font-mono"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs text-center font-bold">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs sm:text-sm font-bold transition shadow-md shadow-[#154F9C]/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>دخول إلى لوحة التحكم</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition">
              ← العودة إلى الموقع الرئيسي
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

          <button
            onClick={handleLogout}
            title="تسجيل الخروج من لوحة التحكم"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 transition font-bold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-1.5">
          
          {/* CRM TAB BUTTON */}
          <button
            onClick={() => setActiveTab('crm')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition text-right cursor-pointer ${
              activeTab === 'crm' ? 'bg-[#154F9C] text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CalendarClock className="w-4 h-4 text-emerald-400" />
              <span>إدارة الحالات والجلسات (CRM)</span>
            </div>
            {pendingBookingsCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black animate-pulse">
                {pendingBookingsCount} جديدة
              </span>
            ) : bookingsList.length > 0 ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {bookingsList.length}
              </span>
            ) : null}
          </button>

          {/* CLIENT DOSSIERS & PSYCHOLOGICAL PROFILES TAB BUTTON */}
          <button
            onClick={() => setActiveTab('clients')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition text-right cursor-pointer ${
              activeTab === 'clients' ? 'bg-[#154F9C] text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>ملفات المستفيدين والمقاييس النفسية</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300">
              {clientProfiles.length}
            </span>
          </button>

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
            onClick={() => setActiveTab('advice')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition text-right cursor-pointer ${
              activeTab === 'advice' ? 'bg-[#154F9C] text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>صندوق النصيحة والملاحظات</span>
            </div>
            {newAdviceCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                {newAdviceCount}
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
            <span>المسارات والدفعات</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition text-right cursor-pointer ${
              activeTab === 'videos' ? 'bg-[#154F9C] text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Video className="w-4 h-4 text-rose-400" />
              <span>المرئيات والفيديوهات</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {videosList.length}
            </span>
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
            onClick={() => setActiveTab('faqs')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition text-right cursor-pointer ${
              activeTab === 'faqs' ? 'bg-[#154F9C] text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span>الأسئلة الشائعة (FAQ)</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {faqsList.length}
            </span>
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
              <span className="font-bold text-slate-200 block">💡 نظام الإدارة المركزي الشامل:</span>
              <p>تحكم كامل في الطلبات المؤسسية، صندوق النصيحة، تقييمات العملاء، الأسئلة الشائعة، المرئيات، الأسعار، ومواعيد الدفعات.</p>
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

          {/* TAB 0: MINI-CRM FOR CLIENT CASES & CONSULTATIONS */}
          {activeTab === 'crm' && (
            <div className="space-y-5">
              {/* CRM Header */}
              <div className="p-5 rounded-3xl bg-[#0E1524] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <CalendarClock className="w-5 h-5 text-emerald-400" />
                    <span>إدارة الحالات والجلسات الاستشارية (Mini-CRM)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    متابعة طلبات الحجز المباشرة، فحص الاستمارات التشخيصية، التحقق من إيصالات السداد، وتزويد المستفيد برابط الجلسة والمهمات القرائية عبر واتساب.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                    إجمالي الجلسات: <strong className="text-white">{bookingsList.length}</strong>
                  </span>
                  {pendingBookingsCount > 0 && (
                    <span className="px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-300 font-bold">
                      {pendingBookingsCount} بانتظار التأكيد
                    </span>
                  )}
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setBookingStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl transition font-bold ${
                    bookingStatusFilter === 'all'
                      ? 'bg-[#154F9C] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  الكل ({bookingsList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setBookingStatusFilter('pending_verification')}
                  className={`px-3 py-1.5 rounded-xl transition font-bold ${
                    bookingStatusFilter === 'pending_verification'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  بانتظار التحقق من الإيصال ({pendingBookingsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setBookingStatusFilter('confirmed')}
                  className={`px-3 py-1.5 rounded-xl transition font-bold ${
                    bookingStatusFilter === 'confirmed'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  مؤكد ومجدول ({confirmedBookingsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setBookingStatusFilter('completed')}
                  className={`px-3 py-1.5 rounded-xl transition font-bold ${
                    bookingStatusFilter === 'completed'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  مكتمل ({completedBookingsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setBookingStatusFilter('cancelled')}
                  className={`px-3 py-1.5 rounded-xl transition font-bold ${
                    bookingStatusFilter === 'cancelled'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ملغي ({cancelledBookingsCount})
                </button>
              </div>

              {/* Bookings List */}
              {loadingBookings ? (
                <div className="p-12 text-center text-xs text-slate-500">جارٍ تحميل بيانات الحالات...</div>
              ) : bookingsList.filter(b => bookingStatusFilter === 'all' ? true : b.status === bookingStatusFilter).length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400 text-xs">
                  لا توجد طلبات جلسات ضمن هذا التصنيف حالياً.
                </div>
              ) : (
                <div className="space-y-4">
                  {bookingsList
                    .filter(b => bookingStatusFilter === 'all' ? true : b.status === bookingStatusFilter)
                    .map((booking) => {
                      const isExpanded = expandedBookingId === booking.id;
                      const cleanPhone = (booking.clientPhone || '').replace(/[^\d]/g, '');

                      return (
                        <div
                          key={booking.id}
                          className={`rounded-3xl border transition-all ${
                            booking.status === 'pending_verification'
                              ? 'bg-[#10192A] border-amber-500/40 shadow-md shadow-amber-950/20'
                              : booking.status === 'confirmed'
                              ? 'bg-[#0E1524] border-emerald-500/30'
                              : 'bg-[#0E1524] border-slate-800'
                          }`}
                        >
                          {/* Card Main Header */}
                          <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-xs font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                                  {booking.id}
                                </span>
                                <h3 className="font-extrabold text-white text-base">
                                  {booking.clientName}
                                </h3>
                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#154F9C]/30 text-sky-300 border border-[#154F9C]/40 font-bold">
                                  {booking.trackLabel}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{booking.slotDate} — الساعة {booking.slotTime}</span>
                                </span>
                                <span>•</span>
                                <a
                                  href={`https://wa.me/${cleanPhone}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition"
                                  dir="ltr"
                                >
                                  <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>{booking.clientPhone}</span>
                                </a>
                                {booking.clientCity && (
                                  <>
                                    <span>•</span>
                                    <span>{booking.clientCity}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Status Selector & Actions */}
                            <div className="flex flex-wrap items-center gap-2">
                              <select
                                value={booking.status}
                                onChange={(e) => handleBookingStatus(booking.id, e.target.value)}
                                className={`text-xs font-bold px-3 py-2 rounded-xl border focus:outline-hidden cursor-pointer ${
                                  booking.status === 'pending_verification'
                                    ? 'bg-amber-950/60 border-amber-700 text-amber-300'
                                    : booking.status === 'confirmed'
                                    ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                                    : booking.status === 'completed'
                                    ? 'bg-blue-950/60 border-blue-700 text-blue-300'
                                    : 'bg-rose-950/60 border-rose-700 text-rose-300'
                                }`}
                              >
                                <option value="pending_verification">⏳ بانتظار التحقق من التحويل</option>
                                <option value="confirmed">✅ مؤكد ومجدول</option>
                                <option value="completed">🎉 تم إنجاز الجلسة</option>
                                <option value="cancelled">❌ ملغي</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => setExpandedBookingId(isExpanded ? null : booking.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition"
                              >
                                <span>{isExpanded ? 'إخفاء الملف' : 'الملف والأعراض'}</span>
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteBooking(booking.id)}
                                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition"
                                title="حذف الحجز نهائياً"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Quick Clinical WhatsApp Dispatch Bar */}
                          <div className="px-5 py-3.5 bg-slate-950/50 border-t border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
                            {/* Google Meet Field & WhatsApp Send */}
                            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-slate-400 font-bold shrink-0">رابط الجلسة:</span>
                                <input
                                  type="text"
                                  value={meetLinkInput[booking.id] !== undefined ? meetLinkInput[booking.id] : (booking.meetLink || '')}
                                  onChange={(e) => setMeetLinkInput({ ...meetLinkInput, [booking.id]: e.target.value })}
                                  placeholder="https://meet.google.com/..."
                                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                                  dir="ltr"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUpdateBookingMeetLink(booking.id)}
                                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-bold"
                                  title="حفظ الرابط في السجل"
                                >
                                  حفظ
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => openWhatsAppWithMeetLink(booking)}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition shrink-0"
                              >
                                <Send className="w-3 h-3" />
                                <span>إرسال الرابط والتأكيد بالواتساب</span>
                              </button>
                            </div>

                            {/* Additional Actions: Homework & Review */}
                            <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                              <select
                                value={selectedHomeworkArticle[booking.id] || ''}
                                onChange={(e) => setSelectedHomeworkArticle({ ...selectedHomeworkArticle, [booking.id]: e.target.value })}
                                className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-[11px] max-w-[140px] truncate"
                              >
                                <option value="">اختر مقالاً كواجب...</option>
                                {articles.map((art) => (
                                  <option key={art.id} value={art.id}>{art.title}</option>
                                ))}
                              </select>

                              <button
                                type="button"
                                disabled={!selectedHomeworkArticle[booking.id]}
                                onClick={() => openWhatsAppWithHomework(booking)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-lg transition"
                                title="إرسال المقال كواجب علاجي للمستفيد عبر واتساب"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                              </button>

                              <button
                                type="button"
                                onClick={() => openWhatsAppReviewRequest(booking)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-[11px] font-bold transition"
                                title="إرسال طلب كتابة رأي وتقييم عبر واتساب"
                              >
                                <Star className="w-3 h-3" />
                                <span>طلب تقييم</span>
                              </button>
                            </div>
                          </div>

                          {/* Expandable Clinical Intake Details */}
                          {isExpanded && (
                            <div className="p-5 bg-slate-950/70 border-t border-slate-800 space-y-4 text-xs animate-fadeIn">
                              {/* Clinical & Demographic Highlights */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                                  <span className="text-slate-500 block mb-1">العمر والحالة:</span>
                                  <span className="text-white font-bold">{booking.age ? `${booking.age} سنة` : 'غير محدد'} • {booking.maritalStatus || 'غير محدد'}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                                  <span className="text-slate-500 block mb-1">رسوم الجلسة:</span>
                                  <span className="text-emerald-400 font-bold">{booking.fee || '250 ر.س'}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                                  <span className="text-slate-500 block mb-1">وسيلة السداد:</span>
                                  <span className="text-white font-bold">
                                    {booking.paymentMethod === 'instapay' ? 'إنستاباي (InstaPay)' : booking.paymentMethod === 'vodafone' ? 'فودافون كاش' : 'تحويل بنكي دولي'}
                                  </span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                                  <div>
                                    <span className="text-slate-500 block mb-1">إيصال السداد:</span>
                                    <span className="text-slate-300">{booking.receiptNote || (booking.receiptImage ? 'صورة مرفقة' : 'لا يوجد ملاحظة')}</span>
                                  </div>
                                  {booking.receiptImage && (
                                    <button
                                      type="button"
                                      onClick={() => setViewingReceiptImage(booking.receiptImage)}
                                      className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 transition flex items-center gap-1 font-bold"
                                    >
                                      <ImageIcon className="w-3.5 h-3.5" />
                                      <span>معاينة</span>
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Symptoms & Answers from Intake Form */}
                              {booking.answers && Object.keys(booking.answers).length > 0 && (
                                <div className="space-y-3 pt-2">
                                  <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
                                    <Brain className="w-4 h-4 text-[#154F9C]" />
                                    <span>الاستجابات التشخيصية والأعراض المحددة:</span>
                                  </h4>

                                  <div className="space-y-2">
                                    {Object.entries(booking.answers).map(([key, val]: [string, any]) => {
                                      if (!val || (Array.isArray(val) && val.length === 0)) return null;

                                      return (
                                        <div key={key} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
                                          <div className="text-slate-400 font-bold mb-1.5">
                                            {key === 'psychological_symptoms' && 'الأعراض النفسية الأساسية:'}
                                            {key === 'physical_symptoms' && 'الأعراض الجسدية المصاحبة:'}
                                            {key === 'previous_therapy' && 'الخبرة الاستشارية السابقة:'}
                                            {key === 'marital_crisis_nature' && 'طبيعة المشكلة الزوجية / الأسرية:'}
                                            {key === 'crisis_duration' && 'مدة استمرار الخلاف:'}
                                            {key === 'parenting_behaviors' && 'سلوكيات الابن التي تثير القلق:'}
                                            {key === 'youth_challenges' && 'التحديات والمخاوف الشبابية:'}
                                            {key === 'emergency_nature' && 'طبيعة الظرف الضاغط الطارئ:'}
                                            {key === 'consultation_reason' && 'وصف المشكلة والهدف بكلمات المستفيد:'}
                                            {key === 'child_age_stage' && 'المرحلة العمرية للأبناء:'}
                                            {key === 'children_count' && 'عدد الأبناء:'}
                                            {!['psychological_symptoms', 'physical_symptoms', 'previous_therapy', 'marital_crisis_nature', 'crisis_duration', 'parenting_behaviors', 'youth_challenges', 'emergency_nature', 'consultation_reason', 'child_age_stage', 'children_count'].includes(key) && `${key}: `}
                                          </div>

                                          {Array.isArray(val) ? (
                                            <div className="flex flex-wrap gap-1.5">
                                              {val.map((itemStr: string) => (
                                                <span
                                                  key={itemStr}
                                                  className="px-2.5 py-1 rounded-lg bg-[#154F9C]/20 border border-[#154F9C]/40 text-sky-200 text-xs font-medium"
                                                >
                                                  {SYMPTOM_LABELS[itemStr] || itemStr}
                                                </span>
                                              ))}
                                            </div>
                                          ) : (
                                            <p className="text-slate-200 leading-relaxed font-sans bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/50">
                                              {SYMPTOM_LABELS[String(val)] || String(val)}
                                            </p>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Receipt Image Modal */}
              {viewingReceiptImage && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn"
                  onClick={() => setViewingReceiptImage(null)}
                >
                  <div
                    className="relative max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-4 shadow-2xl space-y-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-emerald-400" />
                        <span>معاينة إيصال التحويل والسداد</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setViewingReceiptImage(null)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="max-h-[75vh] overflow-auto rounded-2xl flex items-center justify-center bg-black/40 p-2">
                      <img
                        src={viewingReceiptImage}
                        alt="إيصال السداد"
                        className="max-w-full max-h-[70vh] rounded-xl object-contain shadow-md"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setViewingReceiptImage(null)}
                        className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition"
                      >
                        إغلاق النافذة
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 0.5: BENEFICIARY DOSSIERS & CLINICAL CASE PROFILES */}
          {activeTab === 'clients' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Clients Header */}
              <div className="p-6 rounded-3xl bg-[#0E1524] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <span>سجل وملفات المستفيدين والمقاييس النفسية</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    استعراض الملفات الإكلينيكية الكاملة للمستفيدين، نتائج وتواريخ المقاييس النفسية المنجزة، الجلسات السابقة والقادمة مع رابط Google Meet، إسناد التكليفات القرائية، وتدوين الملاحظات الإرشادية الخاصة لكل حالة.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                    إجمالي المستفيدين المسجلين: <strong className="text-white font-mono">{clientProfiles.length}</strong>
                  </span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={clientSearchQuery}
                  onChange={(e) => setClientSearchQuery(e.target.value)}
                  placeholder="ابحث باسم المستفيد، رقم الهاتف، أو البريد الإلكتروني..."
                  className="w-full py-3.5 pr-11 pl-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#154F9C] text-right"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>

              {/* Clients List */}
              {loadingClients ? (
                <div className="p-12 text-center text-xs text-slate-500">جارٍ تحميل ملفات المستفيدين...</div>
              ) : clientProfiles.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400 text-xs space-y-2">
                  <Brain className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>لا توجد ملفات مستفيدين مسجلة بعد. عند تسجيل أي مستفيد دخوله أو إجرائه مقياساً، سيظهر ملفه هنا تلقائياً.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {clientProfiles
                    .filter((p) => {
                      if (!clientSearchQuery.trim()) return true;
                      const q = clientSearchQuery.toLowerCase();
                      const name = (p.name || '').toLowerCase();
                      const phone = (p.phone || '').toLowerCase();
                      const email = (p.email || '').toLowerCase();
                      return name.includes(q) || phone.includes(q) || email.includes(q);
                    })
                    .map((client) => {
                      const isExpanded = expandedClientId === client.id;
                      const cleanClientPhone = (client.phone || '').replace(/[^\d]/g, '');

                      // Matching Bookings for this client
                      const matchedBookings = bookingsList.filter((b) => {
                        const bPhone = (b.clientPhone || '').replace(/[^\d]/g, '');
                        const bEmail = (b.clientEmail || '').trim().toLowerCase();
                        if (cleanClientPhone && bPhone && (bPhone.includes(cleanClientPhone) || cleanClientPhone.includes(bPhone))) return true;
                        if (client.email && bEmail && bEmail === client.email.trim().toLowerCase()) return true;
                        if (client.name && b.clientName && b.clientName.trim() === client.name.trim()) return true;
                        return false;
                      });

                      const testCount = Array.isArray(client.testResults) ? client.testResults.length : 0;
                      const hwCount = Array.isArray(client.homework) ? client.homework.length : 0;

                      return (
                        <div
                          key={client.id}
                          className="rounded-3xl border border-slate-800 bg-[#0E1524] transition-all overflow-hidden"
                        >
                          {/* Client Main Summary Bar */}
                          <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                              <div className="w-12 h-12 rounded-2xl bg-[#154F9C]/20 border border-[#154F9C]/30 text-white font-black text-lg flex items-center justify-center shrink-0">
                                {(client.name || 'م').charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm font-black text-white">{client.name}</h3>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                                    {client.provider || 'مسجل'}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                                  {client.phone && (
                                    <span dir="ltr" className="flex items-center gap-1 font-mono">
                                      <PhoneCall className="w-3 h-3 text-[#154F9C]" />
                                      <span>{client.phone}</span>
                                    </span>
                                  )}
                                  {client.email && (
                                    <span dir="ltr" className="flex items-center gap-1 font-mono">
                                      <span>{client.email}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Badges & Expand Button */}
                            <div className="flex items-center gap-2.5">
                              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                                جلسات: <strong className="text-white font-mono">{matchedBookings.length}</strong>
                              </span>
                              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-cyan-300">
                                مقاييس: <strong className="text-white font-mono">{testCount}</strong>
                              </span>
                              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-amber-300">
                                تكليفات: <strong className="text-white font-mono">{hwCount}</strong>
                              </span>

                              {cleanClientPhone && (
                                <a
                                  href={`https://wa.me/${cleanClientPhone}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 hover:bg-emerald-900/60 transition"
                                  title="مراسلة واتساب"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </a>
                              )}

                              <button
                                type="button"
                                onClick={() => setExpandedClientId(isExpanded ? null : client.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <span>{isExpanded ? 'إخفاء الملف' : 'فتح الملف الكامل'}</span>
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Full Client Dossier */}
                          {isExpanded && (
                            <div className="p-6 border-t border-slate-800 bg-[#0A0F1A] space-y-6 animate-fadeIn">
                              
                              {/* 1. Psychological Assessment History */}
                              <div className="space-y-3">
                                <h4 className="text-xs font-black text-cyan-400 flex items-center gap-2">
                                  <Brain className="w-4 h-4" />
                                  <span>سجل المقاييس والاختبارات النفسية المنجزة ({testCount}):</span>
                                </h4>

                                {testCount === 0 ? (
                                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-500">
                                    لم يجرِ المستفيد أي مقاييس حتى الآن.
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {client.testResults.map((tr: any, idx: number) => (
                                      <div
                                        key={tr.id || idx}
                                        className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs"
                                      >
                                        <div className="flex items-center justify-between">
                                          <strong className="font-extrabold text-white text-sm">
                                            {tr.testTitle}
                                          </strong>
                                          <span className="font-mono text-cyan-400 font-bold">
                                            {tr.scorePercent || tr.score}%
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 font-bold">
                                            المستوى: {tr.level}
                                          </span>
                                          <span>{tr.date || 'مؤخراً'}</span>
                                        </div>

                                        {tr.desc && (
                                          <p className="text-slate-400 leading-relaxed text-[11px]">
                                            {tr.desc}
                                          </p>
                                        )}

                                        {tr.recommendation && (
                                          <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-900/60 text-[10px] text-amber-200">
                                            <strong>التوصية:</strong> {tr.recommendation}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* 2. Client Bookings & Sessions */}
                              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                                <h4 className="text-xs font-black text-emerald-400 flex items-center gap-2">
                                  <CalendarClock className="w-4 h-4" />
                                  <span>جلسات واستشارات المستفيد ({matchedBookings.length}):</span>
                                </h4>

                                {matchedBookings.length === 0 ? (
                                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-500">
                                    لا توجد جلسات حجز مسجلة لهذا المستفيد بعد.
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {matchedBookings.map((b) => (
                                      <div
                                        key={b.id}
                                        className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                                      >
                                        <div className="space-y-1">
                                          <div className="flex items-center gap-2">
                                            <span className="font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded text-[10px]">
                                              {b.id}
                                            </span>
                                            <strong className="text-white">{b.trackLabel}</strong>
                                            <span className="text-[11px] text-emerald-400 font-bold">
                                              ({b.slotDate} — {b.slotTime})
                                            </span>
                                          </div>
                                          {b.meetLink && (
                                            <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                              <Video className="w-3.5 h-3.5 text-cyan-400" />
                                              <span className="font-mono">{b.meetLink}</span>
                                            </div>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                          {b.meetLink && (
                                            <a
                                              href={b.meetLink}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="px-3 py-1.5 rounded-xl bg-cyan-900/40 border border-cyan-700 text-cyan-300 hover:bg-cyan-800/40 transition font-bold"
                                            >
                                              فتح Meet
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* 3. Assign Homework & Readings */}
                              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                                <h4 className="text-xs font-black text-amber-400 flex items-center gap-2">
                                  <BookOpen className="w-4 h-4" />
                                  <span>التكليفات والواجبات القرائية المسندة للمستفيد:</span>
                                </h4>

                                {Array.isArray(client.homework) && client.homework.length > 0 && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {client.homework.map((hw: any, idx: number) => (
                                      <div
                                        key={hw.id || idx}
                                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs gap-2"
                                      >
                                        <div className="space-y-0.5">
                                          <span className="text-slate-200 font-bold block">{hw.title}</span>
                                          {hw.assignedAt && (
                                            <span className="text-[10px] text-slate-500 block">{hw.assignedAt}</span>
                                          )}
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveClientHomework(client.id, hw.id)}
                                          className="text-rose-400 hover:text-rose-300 p-1 transition cursor-pointer"
                                          title="حذف التكليف"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Add New Homework / Article Tool */}
                                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                                  <span className="text-xs font-bold text-slate-300 block">
                                    + إضافة تكليف أو مقال علاجي موجه للمستفيد:
                                  </span>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    <div>
                                      <label className="block text-[11px] text-slate-400 mb-1">اختر مقالاً من مقالات الموقع:</label>
                                      <select
                                        value={newHwArticleSelect[client.id] || ''}
                                        onChange={(e) => setNewHwArticleSelect(prev => ({ ...prev, [client.id]: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                                      >
                                        <option value="">-- اختر مقالاً للتكليف --</option>
                                        {initialArticles.map(a => (
                                          <option key={a.id} value={a.id}>{a.title}</option>
                                        ))}
                                      </select>
                                    </div>

                                    <div>
                                      <label className="block text-[11px] text-slate-400 mb-1">أو اكتب عنوان تكليف/تمرين مخصص:</label>
                                      <input
                                        type="text"
                                        value={newHwTitleInput[client.id] || ''}
                                        onChange={(e) => setNewHwTitleInput(prev => ({ ...prev, [client.id]: e.target.value }))}
                                        placeholder="مثال: تمرين تفريغ الأفكار اليومي قبل النوم..."
                                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600"
                                      />
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleAddClientHomework(client.id)}
                                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>إسناد التكليف لحساب المستفيد الآن</span>
                                  </button>
                                </div>
                              </div>

                              {/* 4. Private Counselor Case Notes */}
                              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                                <h4 className="text-xs font-black text-white flex items-center gap-2">
                                  <Lock className="w-4 h-4 text-rose-400" />
                                  <span>ملاحظات المستشار الإكلينيكية السرية (لا تظهر للمستفيد):</span>
                                </h4>

                                <textarea
                                  rows={3}
                                  defaultValue={client.clinicalNotes || ''}
                                  onChange={(e) => setClientNotesInputs(prev => ({ ...prev, [client.id]: e.target.value }))}
                                  placeholder="اكتب هنا ملاحظاتك الخاصة حول الخطة العلاجية، الأهداف السلوكية، وتطور الحالة..."
                                  className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#154F9C] leading-relaxed"
                                />

                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => handleSaveClientNotes(client.id)}
                                    className="px-4 py-2 rounded-xl bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>حفظ ملاحظات الحالة</span>
                                  </button>
                                </div>
                              </div>

                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
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

          {/* TAB 1.5: ADVICE BOX (صندوق النصيحة والملاحظات) */}
          {activeTab === 'advice' && (
            <div className="p-6 rounded-3xl bg-[#0E1524] border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-400" />
                    <span>رسائل وملاحظات صندوق النصيحة</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    الرسائل والمقترحات والشكاوى الواردة من الزوار عبر نموذج "صندوق النصيحة" في صفحة من أنا
                  </p>
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  إجمالي الرسائل: <strong className="text-white">{adviceList.length}</strong>
                </div>
              </div>

              {adviceList.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs">لا توجد رسائل جديدة في صندوق النصيحة حالياً.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {adviceList.map((item) => (
                    <div
                      key={item.id}
                      className={`p-5 rounded-2xl border transition-all text-right space-y-3 ${
                        item.status === 'new'
                          ? 'bg-slate-900/90 border-[#4E7E76]/50 shadow-sm'
                          : 'bg-slate-950 border-slate-800 opacity-90'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2.5 border-b border-slate-800/80">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                            item.status === 'new'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : item.status === 'reviewed'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {item.status === 'new' ? 'جديدة ★' : item.status === 'reviewed' ? 'تمت المراجعة ✓' : 'مؤرشفة'}
                          </span>
                          
                          {item.email ? (
                            <a
                              href={`mailto:${item.email}`}
                              className="text-xs font-mono text-[#60A5FA] hover:underline"
                              dir="ltr"
                            >
                              {item.email}
                            </a>
                          ) : (
                            <span className="text-xs text-slate-500">مجهول (لم يحدد بريد)</span>
                          )}

                          <span className="text-[10px] text-slate-500 mr-2">
                            {new Date(item.created_at).toLocaleString('ar-EG')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.status === 'new' && (
                            <button
                              onClick={() => handleAdviceStatus(item.id, 'reviewed')}
                              className="px-3 py-1 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/70 border border-emerald-700/60 text-emerald-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>تعليم كمراجعة</span>
                            </button>
                          )}
                          {item.status !== 'archived' && (
                            <button
                              onClick={() => handleAdviceStatus(item.id, 'archived')}
                              className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                            >
                              أرشفة
                            </button>
                          )}
                          {item.email && (
                            <a
                              href={`mailto:${item.email}?subject=بخصوص%20رسالتك%20في%20صندوق%20النصيحة%20-%20المستشار%20جلال%20أحمد`}
                              className="px-3 py-1 rounded-xl bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold transition flex items-center gap-1.5"
                            >
                              <Send className="w-3 h-3 ml-1" />
                              <span>رد بالبريد</span>
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-line bg-black/20 p-3.5 rounded-xl border border-slate-800/60">
                        «{item.message}»
                      </p>
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

              {/* Manual Review Addition Box */}
              <div className="p-5 rounded-3xl bg-[#0E1524] border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-emerald-400" />
                      <span>إضافة تجربة / تقييم يدوي مباشرة إلى الموقع</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      إذا وصلك رأي أو شكر عبر واتساب أو بعد انتهاء الجلسة، يمكنك إدراجه هنا ليظهر فوراً في قسم آراء المستفيدين
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowManualReviewForm(!showManualReviewForm)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition cursor-pointer"
                  >
                    {showManualReviewForm ? 'إخفاء النموذج' : '+ إضافة تقييم يدوي'}
                  </button>
                </div>

                {showManualReviewForm && (
                  <form onSubmit={handleAddManualReview} className="space-y-3.5 pt-3 border-t border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">اسم المستفيد أو الكنية *</label>
                        <input
                          type="text"
                          required
                          value={manualReview.clientName}
                          onChange={(e) => setManualReview({ ...manualReview, clientName: e.target.value })}
                          placeholder="مثال: أ. محمد السعيد أو مستفيد - الرياض"
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">نوع الجلسة</label>
                        <select
                          value={manualReview.sessionType}
                          onChange={(e) => setManualReview({ ...manualReview, sessionType: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        >
                          <option value="استشارة نفسية فردية">استشارة نفسية فردية</option>
                          <option value="استشارة زوجية وأسرية">استشارة زوجية وأسرية</option>
                          <option value="إرشاد والدي وتربوي">إرشاد والدي وتربوي</option>
                          <option value="حجز طارئ">حجز طارئ</option>
                          <option value="برنامج رحلة رفق وميثاق">برنامج رحلة رفق وميثاق</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">التقييم بالنجوم</label>
                        <select
                          value={manualReview.rating}
                          onChange={(e) => setManualReview({ ...manualReview, rating: Number(e.target.value) })}
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        >
                          <option value={5}>★★★★★ (5 نجوم - ممتاز)</option>
                          <option value={4}>★★★★☆ (4 نجوم - جيد جداً)</option>
                          <option value={3}>★★★☆☆ (3 نجوم - جيد)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">نص التقييم والتجربة *</label>
                      <textarea
                        rows={3}
                        required
                        value={manualReview.feedback}
                        onChange={(e) => setManualReview({ ...manualReview, feedback: e.target.value })}
                        placeholder="ماذا قال المستفيد عن تجربته مع المستشار جلال أحمد..."
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={manualReview.isPublished}
                          onChange={(e) => setManualReview({ ...manualReview, isPublished: e.target.checked })}
                          className="rounded text-[#154F9C] focus:ring-0"
                        />
                        <span>نشر التقييم مباشرة في الصفحة الرئيسية والموقع</span>
                      </label>

                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        حفظ ونشر التقييم
                      </button>
                    </div>
                  </form>
                )}
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

                  {/* الدفعة القادمة لبرنامج ميثاق */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mt-3 text-right">
                    <label className="block text-xs font-bold text-slate-200">
                      📅 موعد الدفعة القادمة لبرنامج ميثاق (يظهر تلقائياً في صفحة ميثاق):
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={settings.mithaqNextBatch || ''}
                        onChange={(e) => setSettings({ ...settings, mithaqNextBatch: e.target.value })}
                        placeholder="مثال: نوفمبر 2026 أو 15 ديسمبر 2026"
                        className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={handleSaveSettings}
                        disabled={savingSettings}
                        className="px-5 py-2.5 rounded-xl bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold transition shrink-0 cursor-pointer"
                      >
                        {savingSettings ? 'جارٍ الحفظ...' : 'حفظ موعد الدفعة'}
                      </button>
                    </div>
                    {saveSuccessMsg && (
                      <span className="text-[11px] text-emerald-400 block font-bold">
                        {saveSuccessMsg}
                      </span>
                    )}
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

          {/* TAB 5: VIDEOS & VISUALS */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              
              {/* Video Page Live Status Controller */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">حالة صفحة المرئيات للجمهور:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      settings.videosEnabled
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {settings.videosEnabled ? 'مفعلة بث حي (معروضة للزوار)' : 'وضع قريباً (مخفية عن الزوار لحين الانتهاء)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {settings.videosEnabled
                      ? 'صفحة المرئيات ظاهرة للجمهور ويمكن للجميع تصفح الفيديوهات وتشغيلها.'
                      : 'صفحة المرئيات تعرض شاشة "قريباً" للجمهور، بينما يمكنك رفع وتجهيز فيديوهاتك وتعديلها هنا بحرية تامة.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleVideosLive}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
                    settings.videosEnabled
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{settings.videosEnabled ? 'تحويل إلى وضع (قريباً)' : 'تفعيل الصفحة بث حي الآن'}</span>
                </button>
              </div>

              {/* Add New Video Form */}
              <div className="p-6 rounded-3xl bg-[#0E1524] border border-slate-800 space-y-4">
                <div className="border-b border-slate-800 pb-2.5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Video className="w-4 h-4 text-rose-500" />
                    <span>إضافة فيديو جديد إلى قسم المرئيات</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    أدخل رابط يوتيوب وسيقوم النظام باستخراج المعرف والصورة المصغرة وعرضه تلقائياً في صفحة المرئيات
                  </p>
                </div>

                <form onSubmit={handleAddVideo} className="space-y-3.5 text-right">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">عنوان الفيديو *</label>
                      <input
                        type="text"
                        required
                        value={newVideo.title}
                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                        placeholder="عنوان جذاب للمقطع..."
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">رابط يوتيوب الكامل أو المختصر *</label>
                      <input
                        type="url"
                        required
                        value={newVideo.youtubeUrl}
                        onChange={(e) => setNewVideo({ ...newVideo, youtubeUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=... أو https://youtu.be/..."
                        dir="ltr"
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">التصنيف</label>
                      <select
                        value={newVideo.category}
                        onChange={(e) => {
                          const catMap: Record<string, string> = {
                            quran: 'مشروع أقومية القرآن',
                            family: 'العلاقات والأسرة',
                            parenting: 'التربية والوالدية',
                            psychology: 'بصائر نفسية'
                          };
                          setNewVideo({
                            ...newVideo,
                            category: e.target.value,
                            categoryLabel: catMap[e.target.value] || 'مرئيات عامة'
                          });
                        }}
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="quran">مشروع أقومية القرآن</option>
                        <option value="family">العلاقات والأسرة</option>
                        <option value="parenting">التربية والوالدية</option>
                        <option value="psychology">بصائر نفسية</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">المدة التقديرية (مثال: 12:45)</label>
                      <input
                        type="text"
                        value={newVideo.duration}
                        onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                        placeholder="10:00"
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">وصف موجز للمقطع</label>
                    <textarea
                      rows={2}
                      value={newVideo.desc}
                      onChange={(e) => setNewVideo({ ...newVideo, desc: e.target.value })}
                      placeholder="ملخص لما يتعلمه المشاهد من هذا المقطع..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#CC4E46] to-[#B33D35] hover:from-[#B33D35] hover:to-[#99261E] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة الفيديو للموقع</span>
                  </button>
                </form>
              </div>

              {/* Videos List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400">
                  <span>الفيديوهات المنشورة حالياً ({videosList.length})</span>
                  <Link href="/videos" target="_blank" className="text-[#60A5FA] hover:underline flex items-center gap-1">
                    <span>معاينة صفحة المرئيات</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {videosList.map((v) => (
                    <div
                      key={v.id}
                      className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3 text-right"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-24 aspect-video rounded-lg bg-black overflow-hidden shrink-0 relative">
                          <img
                            src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                            alt={v.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-[#D97706]">
                            {v.categoryLabel}
                          </span>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{v.title}</h4>
                          <span className="text-[10px] text-slate-500 block">{v.duration} • {v.publishDate}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteVideo(v.id)}
                        title="حذف الفيديو"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: ARTICLES & CULTURAL FORUM */}
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
                    <div className="flex items-center gap-2">
                      <Link
                        href="/articles"
                        target="_blank"
                        className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 transition"
                      >
                        معاينة بالمنتدى
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteArticle(art.id)}
                        className="text-xs text-rose-400 hover:text-rose-300 p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 transition cursor-pointer"
                        title="حذف المقال"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB: FAQS MANAGEMENT */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              
              {/* Add New FAQ Form */}
              <div className="p-6 rounded-3xl bg-[#0E1524] border border-slate-800 space-y-4">
                <div className="border-b border-slate-800 pb-2.5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-sky-400" />
                    <span>إضافة سؤال شائع جديد</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    يظهر السؤال فوراً في قسم الأسئلة الشائعة في الصفحة الرئيسية
                  </p>
                </div>

                <form onSubmit={handleAddFaq} className="space-y-3.5 text-right">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">نص السؤال *</label>
                    <input
                      type="text"
                      required
                      value={newFaq.q}
                      onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })}
                      placeholder="مثال: كيف يتم تسديد الرسوم الاستشارية؟"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">الإجابة الوافية *</label>
                    <textarea
                      rows={3}
                      required
                      value={newFaq.a}
                      onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })}
                      placeholder="اكتب الإجابة بأسلوب واضح ومطمئن للمستفيد..."
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white leading-relaxed"
                    />
                  </div>

                  <div className="text-left">
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      إضافة السؤال الشائع
                    </button>
                  </div>
                </form>
              </div>

              {/* Current FAQs List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white">الأسئلة الشائعة المنشورة حالياً ({faqsList.length})</h3>
                </div>

                {loadingFaqs ? (
                  <div className="p-8 text-center text-xs text-slate-500">جارٍ التحميل...</div>
                ) : faqsList.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400 text-xs">
                    لا توجد أسئلة شائعة مضافة.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {faqsList.map((item, idx) => (
                      <div key={item.id || idx} className="p-4 rounded-2xl bg-[#0E1524] border border-slate-800 space-y-2">
                        {editingFaqId === item.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editFaqData.q}
                              onChange={(e) => setEditFaqData({ ...editFaqData, q: e.target.value })}
                              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-bold"
                            />
                            <textarea
                              rows={3}
                              value={editFaqData.a}
                              onChange={(e) => setEditFaqData({ ...editFaqData, a: e.target.value })}
                              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white leading-relaxed"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSaveEditFaq(item.id)}
                                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                              >
                                حفظ التعديل
                              </button>
                              <button
                                onClick={() => setEditingFaqId(null)}
                                className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs transition cursor-pointer"
                              >
                                إلغاء
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-800/60">
                              <span className="text-xs font-bold text-white">{item.q}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => {
                                    setEditingFaqId(item.id);
                                    setEditFaqData({ q: item.q, a: item.a });
                                  }}
                                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                                  title="تعديل السؤال"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteFaq(item.id)}
                                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition cursor-pointer"
                                  title="حذف السؤال"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed font-normal pt-1">
                              {item.a}
                            </p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">الدفعة القادمة لمسار ميثاق</label>
                    <input
                      type="text"
                      value={settings.mithaqNextBatch || ''}
                      onChange={(e) => setSettings({ ...settings, mithaqNextBatch: e.target.value })}
                      placeholder="مثال: نوفمبر 2026"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5">تظهر في صفحة برنامج ميثاق</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">رسوم الجلسة الاستشارية الطارئة</label>
                    <input
                      type="text"
                      value={settings.emergencyFee || ''}
                      onChange={(e) => setSettings({ ...settings, emergencyFee: e.target.value })}
                      placeholder="مثال: 500 ر.س"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5">جلسة خلال 24 ساعة للتدخل العاجل</span>
                  </div>

                  {/* Payment accounts section */}
                  <div className="sm:col-span-2 pt-4 mt-2 border-t border-slate-800">
                    <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span>بيانات السداد المباشر (تظهر للمستفيد في شاشة الدفع الذكية)</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mb-2">
                      تعديل روابط إنستاباي ومحفظة فودافون كاش والآيبان الدولي وتحديثها فورياً في الموقع.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">رابط تطبيق إنستاباي المباشر (InstaPay URL)</label>
                    <input
                      type="url"
                      value={settings.instapayUrl || ''}
                      onChange={(e) => setSettings({ ...settings, instapayUrl: e.target.value })}
                      placeholder="https://ipn.eg/S/..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">معرّف حساب إنستاباي (IPA Handle)</label>
                    <input
                      type="text"
                      value={settings.instapayHandle || ''}
                      onChange={(e) => setSettings({ ...settings, instapayHandle: e.target.value })}
                      placeholder="insan@instapay"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">رابط محفظة فودافون كاش المباشر (Vodafone Cash URL)</label>
                    <input
                      type="url"
                      value={settings.vodafoneCashUrl || ''}
                      onChange={(e) => setSettings({ ...settings, vodafoneCashUrl: e.target.value })}
                      placeholder="http://vf.eg/vfcash?id=..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">رقم محفظة فودافون كاش للتحويل</label>
                    <input
                      type="text"
                      value={settings.vodafoneCashNumber || ''}
                      onChange={(e) => setSettings({ ...settings, vodafoneCashNumber: e.target.value })}
                      placeholder="01014876666"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">رقم الآيبان البنكي الدولي (IBAN)</label>
                    <input
                      type="text"
                      value={settings.internationalIban || ''}
                      onChange={(e) => setSettings({ ...settings, internationalIban: e.target.value })}
                      placeholder="EG..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">اسم البنك واسم صاحب الحساب</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={settings.bankName || ''}
                        onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                        placeholder="البنك الأهلي المصري"
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={settings.accountHolder || ''}
                        onChange={(e) => setSettings({ ...settings, accountHolder: e.target.value })}
                        placeholder="جلال أحمد"
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
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
