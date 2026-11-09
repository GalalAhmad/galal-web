'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Users,
  Send,
  Sparkles,
  Search,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Loader2,
  RefreshCw,
  FileText,
  Video,
  BookmarkCheck,
  ShieldCheck,
} from 'lucide-react';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  created_at: string;
}

export default function AdminNewsletterView() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'broadcast' | 'directory'>('broadcast');

  // Broadcast Form State
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [badge, setBadge] = useState('مقال جديد');
  const [content, setContent] = useState('');
  const [actionUrl, setActionUrl] = useState('');
  const [actionText, setActionText] = useState('قراءة المقال بالكامل ←');

  const [sendingTest, setSendingTest] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter?admin=true', { cache: 'no-store' });
      const data = await res.json();
      if (data && Array.isArray(data.subscribers)) {
        setSubscribers(data.subscribers);
      }
    } catch (e) {
      console.error('Failed to load subscribers:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDeleteSubscriber = async (id: string, email: string) => {
    if (!confirm(`هل أنت متأكد من حذف المشترك (${email}) من القائمة؟`)) return;
    try {
      const res = await fetch(`/api/newsletter?id=${id}&admin=true`, { method: 'DELETE' });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete subscriber:', e);
    }
  };

  const handleCopyEmails = () => {
    const emails = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    alert('تم نسخ جميع عناوين البريد الإلكتروني للمشتركين إلى الحافظة!');
  };

  // Quick Templates
  const applyTemplate = (type: 'article' | 'video' | 'batch') => {
    if (type === 'article') {
      setSubject('مقال فكري جديد: السلوك رسالة قبل أن يكون مشكلة 🌿');
      setTitle('السلوك كرسالة: كيف نفهم ما وراء العناد ونوبات الغضب');
      setBadge('مقال جديد');
      setContent(
        'يسعدنا مشاركتكم أحدث أطروحاتنا الفكرية حول فك شفرات السلوك الإنساني، وكيف أن السلوك الظاهر ليس سوى جبل جليد يخفي تحته احتياجاً نفسياً غير ملبّى. ندعوكم لقراءة المقال ومشاركتنا تأملاتكم.'
      );
      setActionUrl('https://galalahmad.com/articles');
      setActionText('قراءة المقال ومشاركة الرأي ←');
    } else if (type === 'video') {
      setSubject('مرئية جديدة: قواعد الحوار الزواجي الآمن 🎥');
      setTitle('كيف تكسر دائرة الدفاعية والهجوم في الحوار الأسري؟');
      setBadge('مرئية جديدة');
      setContent(
        'محاضرة مرئية مكثفة نناقش فيها فن الإنصات غير الدفاعي، وكيفية التعبير عن الاحتياج العاطفي دون توجيه اللوم للشريك. تم رفع المحاضرة الآن على مكتبة المنصة وقناة اليوتيوب.'
      );
      setActionUrl('https://galalahmad.com/videos');
      setActionText('مشاهدة المرئية الآن ←');
    } else if (type === 'batch') {
      setSubject('إعلان فتح التسجيل: الدفعة الجديدة من برنامج ميثاق 🌿');
      setTitle('انطلاق الدفعة القادمة من رحلة رِفق وميثاق للأسرة');
      setBadge('إعلان دفعة تدريبية');
      setContent(
        'نعلن عن فتح باب الانضمام للدفعة القادمة من برنامج ميثاق لبناء الأسرة والزواج. يتضمن المسار محطات تطبيقية أسبوعية مباشرة عبر زووم مع  أحمد وتطبيقات عملية لكل محطة.'
      );
      setActionUrl('https://galalahmad.com/courses/family/mithaq');
      setActionText('الاطلاع على تفاصيل البرنامج والتسجيل ←');
    }
  };

  // Send Test Email
  const handleSendTest = async () => {
    if (!subject || !title || !content) {
      alert('يرجى كتابة عنوان الموضوع، العنوان الرئيسي، ومحتوى النشرة أولاً.');
      return;
    }
    setSendingTest(true);
    setResultMessage(null);
    try {
      const res = await fetch('/api/admin/newsletter-broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          title,
          badge,
          content,
          actionUrl,
          actionText,
          testEmailOnly: 'galalahmad1201@gmail.com',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResultMessage({
          type: 'success',
          text: 'تم إرسال بريد المعاينة التجريبي بنجاح إلى بريدك الشخصي (galalahmad1201@gmail.com). تفقد صندوق الوارد لمعاينته قبل الإرسال الجماعي!',
        });
      } else {
        setResultMessage({ type: 'error', text: data.error || 'فشل إرسال البريد التجريبي' });
      }
    } catch (e: any) {
      setResultMessage({ type: 'error', text: e.message || 'خطأ في الاتصال' });
    } finally {
      setSendingTest(false);
    }
  };

  // Send Final Broadcast
  const handleBroadcast = async () => {
    if (!subject || !title || !content) {
      alert('يرجى ملء جميع حقول النشرة البريدية أولاً.');
      return;
    }
    if (subscribers.length === 0) {
      alert('لا يوجد مشتركون نشطون في القائمة حالياً.');
      return;
    }
    if (
      !confirm(
        `تأكيد الإرسال: هل أنت متأكد من إرسال هذه النشرة البريدية الآن إلى جميع المشتركين (${subscribers.length} مشترك)؟`
      )
    ) {
      return;
    }

    setBroadcasting(true);
    setResultMessage(null);
    try {
      const res = await fetch('/api/admin/newsletter-broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          title,
          badge,
          content,
          actionUrl,
          actionText,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResultMessage({
          type: 'success',
          text: data.message || `تم إرسال النشرة البريدية بنجاح إلى جميع المشتركين!`,
        });
      } else {
        setResultMessage({ type: 'error', text: data.error || 'تعذر إرسال النشرة' });
      }
    } catch (e: any) {
      setResultMessage({ type: 'error', text: e.message || 'خطأ أثناء الإرسال' });
    } finally {
      setBroadcasting(false);
    }
  };

  const filteredSubscribers = subscribers.filter(
    (s) =>
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-right">
      {/* Header and Quick Stats */}
      <div className="p-6 rounded-3xl bg-[#0E1524] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#154F9C]/20 border border-[#154F9C]/40 text-cyan-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نظام النشرة البريدية والبث المباشر (Resend Verified Domain)</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            <span>إدارة النشرة البريدية وإرسال الإشعارات الجماعية</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            إرسال إشعارات رسمية للمشتركين بضغطة زر عند نشر مقال جديد، مرئية يوتيوب، أو فتح باب الحجز في دفعات البرامج التدريبية.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center min-w-[110px]">
            <span className="block text-xl font-black text-white">{subscribers.length}</span>
            <span className="text-[11px] text-slate-400 font-bold">إجمالي المشتركين</span>
          </div>
          <button
            onClick={fetchSubscribers}
            disabled={loading}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition cursor-pointer"
            title="تحديث القائمة"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('broadcast')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'broadcast'
              ? 'bg-[#154F9C] text-white shadow-md'
              : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <Send className="w-4 h-4 ml-1 rotate-180" />
          <span>إنشاء وإرسال نشرة بريدية جديدة</span>
        </button>

        <button
          onClick={() => setActiveSubTab('directory')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'directory'
              ? 'bg-[#154F9C] text-white shadow-md'
              : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>سجل المشتركين ({subscribers.length})</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {resultMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-start gap-3 animate-fadeIn ${
            resultMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/40 border-rose-800 text-rose-300'
          }`}
        >
          {resultMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          )}
          <div className="leading-relaxed">{resultMessage.text}</div>
        </div>
      )}

      {/* TAB 1: BROADCAST COMPOSER */}
      {activeSubTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: 7 cols */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0E1524] border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400 ml-1 rotate-180" />
                <span>محتوى النشرة البريدية</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                المستلمون المستهدفون: <strong className="text-white">{subscribers.length} مشترك</strong>
              </span>
            </div>

            {/* Quick Templates Buttons */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">قوالب جاهزة بضغطة زر:</label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyTemplate('article')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>مقال جديد</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('video')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-rose-400" />
                  <span>مرئية جديدة</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('batch')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition cursor-pointer"
                >
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>دفعة تدريبية جديدة</span>
                </button>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                عنوان الموضوع (Subject) في صندوق الوارد *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="مثال: مقال فكري جديد: السلوك رسالة قبل أن يكون مشكلة 🌿"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Badge & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4 space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">التصنيف / الشارة</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="مقال جديد"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="sm:col-span-8 space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">العنوان البارز داخل الإيميل *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="العنوان الرئيسي للموضوع"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">نص الرسالة والملخص الفكري *</label>
              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="اكتب خلاصة المقال أو التنويه بأسلوبك..."
                className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 leading-relaxed"
              />
            </div>

            {/* Action Button Link & Text */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-7 space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">رابط زر الانتقال (Call to Action)</label>
                <input
                  type="url"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="https://galalahmad.com/articles/..."
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-right"
                />
              </div>
              <div className="sm:col-span-5 space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">نص الزر</label>
                <input
                  type="text"
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  placeholder="قراءة المقال بالكامل ←"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSendTest}
                disabled={sendingTest || broadcasting}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700 transition disabled:opacity-50 cursor-pointer"
              >
                {sendingTest ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                <span>إرسال بريد تجريبي لمعاينته في بريدك أولاً</span>
              </button>

              <button
                type="button"
                onClick={handleBroadcast}
                disabled={broadcasting || sendingTest || subscribers.length === 0}
                className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-[#154F9C] to-[#1E6FD9] hover:from-[#114080] hover:to-[#154F9C] text-white text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {broadcasting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 ml-1 rotate-180" />
                )}
                <span>إرسال النشرة لجميع المشتركين ({subscribers.length}) الآن</span>
              </button>
            </div>
          </div>

          {/* Right Preview: 5 cols */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-3xl bg-[#0E1524] border border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>معاينة حية لشكل الرسالة للمشتركين</span>
                </span>
                <span className="text-[10px] text-slate-500">HTML Responsive</span>
              </div>

              {/* Preview Canvas */}
              <div className="mt-4 p-5 rounded-2xl bg-white text-slate-900 space-y-4 text-right shadow-inner">
                {/* Email Header */}
                <div className="p-4 rounded-xl bg-[#154F9C] text-white text-center space-y-1">
                  <h4 className="text-sm font-black"> أحـمد</h4>
                  <p className="text-[10px] opacity-80">إشعار جديد للمشتركين في النشرة الفكرية والإرشادية</p>
                </div>

                {/* Email Body */}
                <div className="space-y-3">
                  <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EDF5FD] text-[#154F9C]">
                    {badge || 'جديد المنصة'}
                  </span>
                  <h5 className="text-sm font-black text-slate-900 leading-snug">
                    {title || 'عنوان الموضوع المقترح يظهر هنا'}
                  </h5>
                  <div className="p-3.5 rounded-xl bg-slate-50 border-r-4 border-[#154F9C] text-xs text-slate-700 leading-relaxed">
                    {content || 'هنا يظهر محتوى النشرة والملخص الفكري كما سيصل في البريد الإلكتروني للمشترك...'}
                  </div>

                  {actionUrl && (
                    <div className="text-center pt-2">
                      <span className="inline-block px-5 py-2 rounded-full bg-[#CC4E46] text-white text-xs font-bold shadow-xs">
                        {actionText || 'قراءة المزيد / مشاهدة الآن ←'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Email Footer */}
                <div className="pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400 space-y-0.5">
                  <p>تصلك هذه الرسالة لاشتراكك في نشرة galalahmad.com</p>
                  <p>© 2026  أحمد — جميع الحقوق محفوظة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBSCRIBERS DIRECTORY */}
      {activeSubTab === 'directory' && (
        <div className="p-6 rounded-3xl bg-[#0E1524] border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>دليل المشتركين في النشرة البريدية</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                استعراض وحذف وإدارة المشتركين المسجلين عبر الموقع
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopyEmails}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700 transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ جميع الإيميلات</span>
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم أو البريد الإلكتروني..."
              className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-12 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
              <p className="text-xs">جاري تحميل قائمة المشتركين...</p>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Mail className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs">لا يوجد مشتركون مطابقون للبحث حالياً.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="pb-3 pr-2">#</th>
                    <th className="pb-3">الاسم</th>
                    <th className="pb-3">البريد الإلكتروني</th>
                    <th className="pb-3">المصدر</th>
                    <th className="pb-3">تاريخ الاشتراك</th>
                    <th className="pb-3">الحالة</th>
                    <th className="pb-3 text-left pl-2">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSubscribers.map((sub, idx) => (
                    <tr key={sub.id} className="hover:bg-slate-900/60 transition">
                      <td className="py-3.5 pr-2 font-mono text-slate-500">{idx + 1}</td>
                      <td className="py-3.5 font-bold text-white">{sub.name || 'مشترك في النشرة'}</td>
                      <td className="py-3.5 font-mono text-cyan-300" dir="ltr">
                        {sub.email}
                      </td>
                      <td className="py-3.5 text-slate-400 text-[11px]">{sub.source || 'الموقع العام'}</td>
                      <td className="py-3.5 text-slate-400 text-[11px]">
                        {new Date(sub.created_at).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                          نشط ✓
                        </span>
                      </td>
                      <td className="py-3.5 text-left pl-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60 transition cursor-pointer"
                          title="حذف من القائمة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
