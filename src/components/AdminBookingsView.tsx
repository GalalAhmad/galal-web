'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Trash2,
  CalendarClock,
  Eye,
  FileText,
  Send,
  Sparkles,
  User,
  RefreshCw,
  CalendarDays,
  ListFilter,
  CreditCard,
  X,
  BookOpen,
  Star,
  CheckCheck
} from 'lucide-react';
import AdminCalendarView from '@/components/AdminCalendarView';
import { getIntakeSummaryPills, getQuestionAndAnswerLabels } from '@/data/intakeQuestions';

interface AdminBookingsViewProps {
  bookings: any[];
  onUpdateStatus: (id: string, newStatus: string) => Promise<void>;
  onUpdateMeetLink: (id: string, meetLink: string) => Promise<void>;
  onReschedule: (booking: any) => void;
  onDelete: (id: string) => Promise<void>;
  articles?: any[];
  onOpenSendEmail?: (clientEmail: string, clientName: string) => void;
}

export default function AdminBookingsView({
  bookings = [],
  onUpdateStatus,
  onUpdateMeetLink,
  onReschedule,
  onDelete,
  articles = [],
  onOpenSendEmail,
}: AdminBookingsViewProps) {
  // View mode: 'list' or 'calendar'
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_verification' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<'all' | 'instapay' | 'vodafone' | 'alrajhi' | 'cliq' | 'bank_transfer'>('all');
  const [showFinanceDetail, setShowFinanceDetail] = useState<boolean>(true);

  // UI state
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [activeReceiptModal, setActiveReceiptModal] = useState<any | null>(null);
  const [meetLinkInput, setMeetLinkInput] = useState<{ [id: string]: string }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<{ [id: string]: string }>({});

  const todayIso = new Date().toISOString().split('T')[0];

  // Helper: parse fee number
  const parseFeeNumber = (feeStr: any) => {
    if (typeof feeStr === 'number') return feeStr;
    const match = String(feeStr).match(/\d+/);
    return match ? parseInt(match[0], 10) : 250;
  };

  // KPI Calculations
  const pendingList = useMemo(() => bookings.filter((b) => b.status === 'pending_verification'), [bookings]);
  const confirmedList = useMemo(() => bookings.filter((b) => b.status === 'confirmed'), [bookings]);
  const completedList = useMemo(() => bookings.filter((b) => b.status === 'completed'), [bookings]);
  const cancelledList = useMemo(() => bookings.filter((b) => b.status === 'cancelled'), [bookings]);
  const todaySessions = useMemo(
    () => bookings.filter((b) => b.slotDate === todayIso && b.status !== 'cancelled'),
    [bookings, todayIso]
  );

  const confirmedRevenue = useMemo(
    () => [...confirmedList, ...completedList].reduce((sum, b) => sum + parseFeeNumber(b.fee), 0),
    [confirmedList, completedList]
  );
  const pendingRevenue = useMemo(
    () => pendingList.reduce((sum, b) => sum + parseFeeNumber(b.fee), 0),
    [pendingList]
  );

  // Payment Methods Financial Breakdown
  const paymentStats = useMemo(() => {
    const stats: Record<string, { label: string; count: number; confirmedSum: number; pendingSum: number; color: string; country: string }> = {
      instapay: { label: 'إنستاباي (InstaPay)', count: 0, confirmedSum: 0, pendingSum: 0, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', country: '🇪🇬 مصر' },
      vodafone: { label: 'فودافون كاش (Vodafone Cash)', count: 0, confirmedSum: 0, pendingSum: 0, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', country: '🇪🇬 مصر' },
      alrajhi: { label: 'الراجحي / بنك سعودي', count: 0, confirmedSum: 0, pendingSum: 0, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', country: '🇸🇦 السعودية' },
      cliq: { label: 'كليك (CliQ)', count: 0, confirmedSum: 0, pendingSum: 0, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', country: '🇯🇴 الأردن' },
      bank_transfer: { label: 'تحويل بنكي عام / دولي', count: 0, confirmedSum: 0, pendingSum: 0, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30', country: '🇦🇪 الإمارات / دولي' },
    };

    bookings.forEach((b) => {
      const pm = (b.paymentMethod || 'instapay').toLowerCase();
      let key = 'bank_transfer';
      if (pm.includes('insta')) key = 'instapay';
      else if (pm.includes('voda')) key = 'vodafone';
      else if (pm.includes('rajhi') || pm.includes('saudi') || pm.includes('ksa')) key = 'alrajhi';
      else if (pm.includes('cliq') || pm.includes('jordan')) key = 'cliq';

      stats[key].count += 1;
      const feeVal = parseFeeNumber(b.fee);
      if (b.status === 'confirmed' || b.status === 'completed') {
        stats[key].confirmedSum += feeVal;
      } else if (b.status === 'pending_verification') {
        stats[key].pendingSum += feeVal;
      }
    });

    return stats;
  }, [bookings]);

  // Filtered Bookings for the List View
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // 1. Status Filter
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;

      // 2. Date Filter
      if (dateFilter === 'today' && b.slotDate !== todayIso) return false;
      if (dateFilter === 'upcoming' && b.slotDate < todayIso) return false;
      if (dateFilter === 'past' && b.slotDate >= todayIso) return false;

      // 3. Payment Method Filter
      if (paymentMethodFilter !== 'all') {
        const pm = (b.paymentMethod || '').toLowerCase();
        if (paymentMethodFilter === 'instapay' && !pm.includes('insta')) return false;
        if (paymentMethodFilter === 'vodafone' && !pm.includes('voda')) return false;
        if (paymentMethodFilter === 'alrajhi' && !(pm.includes('rajhi') || pm.includes('saudi') || pm.includes('ksa'))) return false;
        if (paymentMethodFilter === 'cliq' && !(pm.includes('cliq') || pm.includes('jordan'))) return false;
        if (paymentMethodFilter === 'bank_transfer' && !(pm.includes('bank') || pm.includes('transfer'))) return false;
      }

      // 4. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (b.clientName || '').toLowerCase();
        const phone = (b.clientPhone || '').replace(/[^\d]/g, '');
        const email = (b.clientEmail || '').toLowerCase();
        const id = (b.id || '').toLowerCase();
        const track = (b.trackLabel || '').toLowerCase();
        if (!name.includes(q) && !phone.includes(q) && !email.includes(q) && !id.includes(q) && !track.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [bookings, statusFilter, dateFilter, paymentMethodFilter, searchQuery, todayIso]);

  // Handle 1-Click Confirmation
  const handleFastConfirm = async (booking: any) => {
    setConfirmingId(booking.id);
    try {
      // Ensure meet link exists
      const currentMeet = meetLinkInput[booking.id] || booking.meetLink;
      const defaultMeet = currentMeet && currentMeet.trim() ? currentMeet.trim() : 'https://meet.google.com';

      if (!booking.meetLink || booking.meetLink !== defaultMeet) {
        await onUpdateMeetLink(booking.id, defaultMeet);
      }

      await onUpdateStatus(booking.id, 'confirmed');
    } finally {
      setConfirmingId(null);
    }
  };

  // WhatsApp formatted shortcuts
  const openWhatsAppConfirm = (booking: any) => {
    const meet = meetLinkInput[booking.id] || booking.meetLink || 'https://meet.google.com';
    const msg = `السلام عليكم ورحمة الله وبركاته، أهلاً بك أستاذ ${booking.clientName} الكريم 🌿
معك أ. جلال أحمد، يسعدني تأكيد موعد جلستنا الاستشارية (${booking.trackLabel}).

🗓️ الموعد: ${booking.slotDate}
⏰ الوقت: ${booking.slotTime} (بتوقيت القاهرة ومكة المكرمة)
💻 رابط الحضور المباشر عبر Google Meet:
${meet}

يرجى التواجد قبل الموعد بـ 5 دقائق في مكان هادئ ومريح لضمان أقصى فائدة من الجلسة.
أهلاً ومرحباً بك دائماً.`;
    const cleanPhone = (booking.clientPhone || '').replace(/[^\d]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const openWhatsAppHomework = (booking: any) => {
    const artId = selectedArticleId[booking.id];
    const article = articles.find((a) => a.id === artId) || articles[0];
    const articleUrl = `https://galalahmad.com/articles/${article?.slug || article?.id || ''}`;
    const msg = `السلام عليكم أستاذ ${booking.clientName}،
بناءً على جلستنا الاستشارية ولمتابعة خطة التمكين والوعي، أشاركك هذا المقال العلاجي الهام للقراءة والتأمل:

📖 "${article?.title}"
🔗 الرابط: ${articleUrl}

يسعدني أن تدون أبرز ما استوقفك لنناقشه في خطواتنا القادمة.
مع خالص التحية، جلال أحمد`;
    const cleanPhone = (booking.clientPhone || '').replace(/[^\d]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const openWhatsAppReview = (booking: any) => {
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

  const copyMeetLink = (id: string, link: string) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar: Title + View Switcher */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0E1524] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#154F9C]/20 border border-[#154F9C]/30 text-sky-400 flex items-center justify-center shrink-0">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">إدارة الحجوزات والمواعيد الاستشارية</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                متابعة الحجوزات الواردة، التحقق من إيصالات السداد، تأكيد المواعيد، وتزويد المستفيدين بروابط قاعات Google Meet.
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle Tabs (List vs Calendar) */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#154F9C] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>عرض القائمة ({bookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-[#154F9C] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CalendarDays className="w-4 h-4 text-amber-400" />
            <span>التقويم التفاعلي (Calendar)</span>
          </button>
        </div>
      </div>

      {/* 2. Executive KPI Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Verification Card */}
        <div
          onClick={() => setStatusFilter('pending_verification')}
          className={`p-5 rounded-3xl border transition cursor-pointer ${
            statusFilter === 'pending_verification'
              ? 'bg-linear-to-br from-[#2D1B06] to-[#1F1303] border-amber-500 shadow-lg shadow-amber-950/30'
              : 'bg-[#0E1524] border-slate-800 hover:border-amber-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>بانتظار التحقق من الإيصال</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono">
              جديد
            </span>
          </div>
          <div className="text-3xl font-black text-white">
            {pendingList.length}
            <span className="text-xs font-normal text-slate-400 mr-2">جلسة معلقة</span>
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1 flex items-center justify-between">
            <span>بقيمة: {pendingRevenue.toLocaleString()} ر.س</span>
            <span className="underline font-bold">تصفية الآن ←</span>
          </div>
        </div>

        {/* Today's Scheduled Sessions */}
        <div
          onClick={() => setDateFilter(dateFilter === 'today' ? 'all' : 'today')}
          className={`p-5 rounded-3xl border transition cursor-pointer ${
            dateFilter === 'today'
              ? 'bg-linear-to-br from-[#0F1D38] to-[#091224] border-[#154F9C] shadow-lg'
              : 'bg-[#0E1524] border-slate-800 hover:border-[#154F9C]/50'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-sky-400 font-bold mb-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>جلسات اليوم</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">{todayIso}</span>
          </div>
          <div className="text-3xl font-black text-white">
            {todaySessions.length}
            <span className="text-xs font-normal text-slate-400 mr-2">جلسة مبرمجة</span>
          </div>
          <div className="text-[11px] text-sky-400/80 mt-1 flex items-center justify-between">
            <span>{todaySessions.length > 0 ? 'جاهزة للانعقاد' : 'لا جلسات اليوم'}</span>
            <span className="underline font-bold">عرض جلسات اليوم ←</span>
          </div>
        </div>

        {/* Confirmed Sessions */}
        <div
          onClick={() => setStatusFilter('confirmed')}
          className={`p-5 rounded-3xl border transition cursor-pointer ${
            statusFilter === 'confirmed'
              ? 'bg-linear-to-br from-[#0F291E] to-[#0A1D15] border-emerald-500 shadow-lg'
              : 'bg-[#0E1524] border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>الجلسات المؤكدة</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]">
              نشطة
            </span>
          </div>
          <div className="text-3xl font-black text-white">
            {confirmedList.length}
            <span className="text-xs font-normal text-slate-400 mr-2">جلسة معتمدة</span>
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1 flex items-center justify-between">
            <span>تم تزويدهم برابط Meet</span>
            <span className="underline font-bold">تصفية ←</span>
          </div>
        </div>

        {/* Total Value & Revenue */}
        <div className="p-5 rounded-3xl bg-[#0E1524] border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>الإيرادات المحصلة</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {confirmedList.length + completedList.length} حجز
            </span>
          </div>
          <div className="text-2xl font-black text-white">
            {confirmedRevenue.toLocaleString()} <span className="text-sm font-normal text-emerald-400">ر.س</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>مكتملة: {completedList.length}</span>
            <span className="text-slate-400">ملغية: {cancelledList.length}</span>
          </div>
        </div>
      </div>

      {/* 2.5 Financial Breakdown & Payment Channels Ledger (مصر، السعودية، الأردن، الإمارات) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0E1524] border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs sm:text-sm font-black text-white">
              السجل المحاسبي وقنوات التحصيل الإقليمية (مصر • السعودية • الأردن • الإمارات)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowFinanceDetail(!showFinanceDetail)}
            className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>{showFinanceDetail ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}</span>
            {showFinanceDetail ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showFinanceDetail && (
          <div className="space-y-3 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {Object.entries(paymentStats).map(([key, st]) => {
                const isSelected = paymentMethodFilter === key;
                return (
                  <div
                    key={key}
                    onClick={() => setPaymentMethodFilter(isSelected ? 'all' : (key as any))}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer text-right flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#154F9C] bg-[#154F9C]/15 ring-2 ring-[#154F9C]/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-slate-300">{st.country}</span>
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-slate-800 text-slate-400">
                          {st.count} حجز
                        </span>
                      </div>
                      <div className="text-xs font-black text-white truncate" title={st.label}>
                        {st.label}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] space-y-0.5 font-mono">
                      <div className="flex items-center justify-between text-emerald-400 font-bold">
                        <span className="font-sans font-medium text-[10px] text-slate-400">محصل:</span>
                        <span>{st.confirmedSum.toLocaleString()} ر.س</span>
                      </div>
                      {st.pendingSum > 0 && (
                        <div className="flex items-center justify-between text-amber-400">
                          <span className="font-sans font-medium text-[10px] text-slate-400">معلق:</span>
                          <span>{st.pendingSum.toLocaleString()} ر.س</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {paymentMethodFilter !== 'all' && (
              <div className="flex items-center justify-between bg-slate-900 px-3.5 py-2 rounded-xl text-xs">
                <span className="text-slate-300">
                  تصفية الحجوزات المعروضة حسب وسيلة: <strong className="text-white">{paymentStats[paymentMethodFilter]?.label}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setPaymentMethodFilter('all')}
                  className="text-rose-400 hover:underline font-bold text-xs cursor-pointer"
                >
                  إلغاء التصفية (عرض الكل)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. CALENDAR VIEW (If active) */}
      {viewMode === 'calendar' && (
        <div className="p-6 rounded-3xl bg-[#0E1524] border border-slate-800 animate-fadeIn">
          <div className="mb-4 flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-amber-400" />
              <span>جدول المواعيد والتقويم الإكلينيكي الشامل (FullCalendar)</span>
            </h3>
            <span className="text-xs text-slate-400">
              اضغط على أي موعد في التقويم لاستعراض تفاصيله
            </span>
          </div>
          <AdminCalendarView bookings={bookings} />
        </div>
      )}

      {/* 4. LIST VIEW (If active) */}
      {viewMode === 'list' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Search Bar & Filters Bar */}
          <div className="p-4 rounded-2xl bg-[#0E1524] border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم المستفيد، رقم الهاتف، رقم الحجز (BK-...)، أو نوع الاستشارة..."
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-[#154F9C]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { id: 'all', label: 'الكل', count: bookings.length },
                { id: 'pending_verification', label: 'بانتظار الإيصال', count: pendingList.length, color: 'text-amber-300' },
                { id: 'confirmed', label: 'مؤكد', count: confirmedList.length, color: 'text-emerald-300' },
                { id: 'completed', label: 'مكتمل', count: completedList.length, color: 'text-sky-300' },
                { id: 'cancelled', label: 'ملغي', count: cancelledList.length, color: 'text-rose-300' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-[#154F9C] text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-950/60 ${tab.color || 'text-slate-300'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Count Notice */}
          <div className="flex items-center justify-between px-2 text-xs text-slate-400">
            <span>
              عرض <strong>{filteredBookings.length}</strong> من أصل {bookings.length} موعد
            </span>
            {dateFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setDateFilter('all')}
                className="text-amber-400 hover:underline flex items-center gap-1 font-bold"
              >
                <X className="w-3.5 h-3.5" />
                <span>إلغاء تصفية التاريخ ({dateFilter})</span>
              </button>
            )}
          </div>

          {/* Bookings Cards List */}
          {filteredBookings.length === 0 ? (
            <div className="p-16 rounded-3xl bg-[#0E1524] border border-slate-800 text-center space-y-3">
              <CalendarClock className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">لا توجد حجوزات مطابقة للبحث أو التصفية</h3>
              <p className="text-xs text-slate-500">جرب مسح معايير البحث أو اختيار تصنيف مختلف من الأعلى.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const isExpanded = expandedBookingId === booking.id;
                const cleanPhone = (booking.clientPhone || '').replace(/[^\d]/g, '');
                const isPending = booking.status === 'pending_verification';
                const isConfirmed = booking.status === 'confirmed';
                const isCompleted = booking.status === 'completed';
                const isCancelled = booking.status === 'cancelled';
                const currentMeet = meetLinkInput[booking.id] !== undefined ? meetLinkInput[booking.id] : (booking.meetLink || '');

                return (
                  <div
                    key={booking.id}
                    className={`rounded-3xl border transition-all overflow-hidden ${
                      isPending
                        ? 'bg-linear-to-b from-[#131B2E] to-[#0E1524] border-amber-500/40 shadow-lg shadow-amber-950/20'
                        : isConfirmed
                        ? 'bg-[#0E1524] border-emerald-500/30'
                        : 'bg-[#0E1524] border-slate-800'
                    }`}
                  >
                    {/* Main Card Header Bar */}
                    <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Client & Consultation Meta */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-800">
                            {booking.id}
                          </span>

                          <h3 className="text-base font-black text-white flex items-center gap-2">
                            <span>{booking.clientName}</span>
                          </h3>

                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#154F9C]/30 text-sky-300 border border-[#154F9C]/40 font-bold">
                            {booking.trackLabel || 'استشارة خاصة'}
                          </span>

                          {/* Payment Method Badge */}
                          <span
                            className={`text-[11px] px-2.5 py-0.5 rounded-full border font-bold flex items-center gap-1 ${
                              booking.paymentMethod === 'instapay'
                                ? 'bg-purple-950/50 border-purple-800/80 text-purple-300'
                                : booking.paymentMethod === 'vodafone'
                                ? 'bg-red-950/50 border-red-800/80 text-red-300'
                                : 'bg-emerald-950/50 border-emerald-800/80 text-emerald-300'
                            }`}
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>
                              {booking.paymentMethod === 'instapay'
                                ? 'إنستاباي'
                                : booking.paymentMethod === 'vodafone'
                                ? 'فودافون كاش'
                                : 'تحويل بنكي'}
                            </span>
                            <span className="font-mono mr-1">({booking.fee || '250 ر.س'})</span>
                          </span>
                        </div>

                        {/* Date & Contact Information */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1.5 font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{booking.slotDate}</span>
                            <span>—</span>
                            <span>الساعة {booking.slotTime}</span>
                          </span>

                          {booking.clientPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition"
                              dir="ltr"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="font-mono">{booking.clientPhone}</span>
                            </a>
                          )}

                          {booking.clientEmail && (
                            <span
                              onClick={() => onOpenSendEmail && onOpenSendEmail(booking.clientEmail, booking.clientName)}
                              className="flex items-center gap-1 text-slate-400 hover:text-sky-300 cursor-pointer transition font-mono"
                              dir="ltr"
                              title="اضغط لإرسال بريد رسمي من الاستشاري"
                            >
                              <Mail className="w-3.5 h-3.5 text-sky-400" />
                              <span>{booking.clientEmail}</span>
                            </span>
                          )}

                          {booking.clientCity && (
                            <span className="text-slate-500">📍 {booking.clientCity}</span>
                          )}
                        </div>

                        {/* Intake Symptoms Summary Tags */}
                        {(() => {
                          const pills = getIntakeSummaryPills(booking.track, booking.answers);
                          if (pills.length === 0) return null;
                          return (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[11px] text-slate-400 font-bold">الأعراض والتحديات:</span>
                              {pills.map((pill, pIdx) => (
                                <span
                                  key={pIdx}
                                  className="px-2 py-0.5 rounded-md bg-[#154F9C]/20 border border-[#154F9C]/40 text-sky-200 text-[11px] font-medium"
                                >
                                  {pill}
                                </span>
                              ))}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Right: Quick Action Controls */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* 1-Click Confirmation Button (For Pending) */}
                        {isPending && (
                          <button
                            type="button"
                            disabled={confirmingId === booking.id}
                            onClick={() => handleFastConfirm(booking)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white text-xs font-black rounded-xl transition shadow-lg shadow-emerald-950/40 cursor-pointer"
                          >
                            <CheckCheck className="w-4 h-4" />
                            <span>{confirmingId === booking.id ? 'جارٍ الاعتماد...' : 'اعتماد الدفع وتأكيد الحجز ✓'}</span>
                          </button>
                        )}

                        {/* Inspect Receipt Button */}
                        {(booking.receiptNote || booking.receiptImage) && (
                          <button
                            type="button"
                            onClick={() => setActiveReceiptModal(booking)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-800 text-amber-300 text-xs font-bold rounded-xl transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>فحص الإيصال</span>
                          </button>
                        )}

                        {/* Reschedule Button */}
                        <button
                          type="button"
                          onClick={() => onReschedule(booking)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                          title="تعديل تاريخ أو ساعة الجلسة"
                        >
                          <CalendarClock className="w-3.5 h-3.5 text-sky-400" />
                          <span>تعديل الموعد</span>
                        </button>

                        {/* Status Select Box */}
                        <select
                          value={booking.status}
                          onChange={(e) => onUpdateStatus(booking.id, e.target.value)}
                          className={`text-xs font-bold px-3 py-2 rounded-xl border focus:outline-hidden cursor-pointer ${
                            isPending
                              ? 'bg-amber-950/60 border-amber-700 text-amber-300'
                              : isConfirmed
                              ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                              : isCompleted
                              ? 'bg-blue-950/60 border-blue-700 text-blue-300'
                              : 'bg-rose-950/60 border-rose-700 text-rose-300'
                          }`}
                        >
                          <option value="pending_verification">⏳ بانتظار التحقق من التحويل</option>
                          <option value="confirmed">✅ مؤكد ومجدول</option>
                          <option value="completed">🎉 تم إنجاز الجلسة</option>
                          <option value="cancelled">❌ ملغي</option>
                        </select>

                        {/* Expand Details Button */}
                        <button
                          type="button"
                          onClick={() => setExpandedBookingId(isExpanded ? null : booking.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                        >
                          <span>{isExpanded ? 'طي الملف' : 'تفاصيل الاستمارة'}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => onDelete(booking.id)}
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition cursor-pointer"
                          title="حذف الحجز نهائياً"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Secondary Bar: Google Meet & Instant WhatsApp Dispatch */}
                    <div className="px-5 sm:px-6 py-3.5 bg-slate-950/70 border-t border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
                      {/* Meet Link Field */}
                      <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1.5">
                          <Video className="w-4 h-4 text-emerald-400" />
                          <span>رابط اللقاء (Meet):</span>
                        </span>

                        <input
                          type="text"
                          value={currentMeet}
                          onChange={(e) => setMeetLinkInput({ ...meetLinkInput, [booking.id]: e.target.value })}
                          placeholder="https://meet.google.com/..."
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-emerald-500"
                          dir="ltr"
                        />

                        <button
                          type="button"
                          onClick={() => onUpdateMeetLink(booking.id, currentMeet)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                        >
                          حفظ الرابط
                        </button>

                        {currentMeet && (
                          <button
                            type="button"
                            onClick={() => copyMeetLink(booking.id, currentMeet)}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono shrink-0 cursor-pointer"
                            title="نسخ الرابط"
                          >
                            {copiedId === booking.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>

                      {/* WhatsApp Buttons */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => openWhatsAppConfirm(booking)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>تأكيد الموعد عبر واتساب</span>
                        </button>

                        {articles.length > 0 && (
                          <div className="flex items-center gap-1">
                            <select
                              value={selectedArticleId[booking.id] || ''}
                              onChange={(e) => setSelectedArticleId({ ...selectedArticleId, [booking.id]: e.target.value })}
                              className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-[11px] max-w-[130px] truncate"
                            >
                              <option value="">واجب قرائي...</option>
                              {articles.map((art) => (
                                <option key={art.id} value={art.id}>{art.title}</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              disabled={!selectedArticleId[booking.id]}
                              onClick={() => openWhatsAppHomework(booking)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-sky-400 rounded-lg transition cursor-pointer"
                              title="إرسال المقال كواجب عبر واتساب"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => openWhatsAppReview(booking)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition cursor-pointer"
                          title="طلب تقييم الجلسة عبر واتساب"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* 5. Expanded Full Intake Answers Details */}
                    {isExpanded && (
                      <div className="p-6 bg-[#080C14] border-t border-slate-800 space-y-4 animate-fadeIn">
                        <h4 className="text-xs font-black text-cyan-400 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>إجابات استمارة الدخول والتشخيص المبدئي:</span>
                        </h4>

                        {booking.answers && typeof booking.answers === 'object' && Object.keys(booking.answers).length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {Object.entries(booking.answers).map(([key, val], idx) => {
                              if (val === undefined || val === null || val === '') return null;
                              const { questionTitle, formattedAnswer } = getQuestionAndAnswerLabels(
                                booking.track,
                                key,
                                val
                              );
                              const ansStr = Array.isArray(formattedAnswer) ? formattedAnswer.join('، ') : String(formattedAnswer);
                              if (!ansStr.trim()) return null;

                              return (
                                <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                                  <span className="text-[10px] text-slate-400 font-bold block">{questionTitle}</span>
                                  <strong className="text-xs text-slate-200 block">{ansStr}</strong>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500">
                            لا توجد إجابات تفصيلية مسجلة في هذا الحجز، أو تم تسجيل الحجز مباشرة.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* RECEIPT INSPECTION MODAL */}
      {activeReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-[#0E1524] border border-slate-800 p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
                <Eye className="w-5 h-5" />
                <span>إيصال التحويل المالي — {activeReceiptModal.clientName}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveReceiptModal(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">وسيلة التحويل:</span>
                <strong className="text-white">
                  {activeReceiptModal.paymentMethod === 'instapay'
                    ? 'إنستاباي (InstaPay)'
                    : activeReceiptModal.paymentMethod === 'vodafone'
                    ? 'فودافون كاش'
                    : 'تحويل بنكي مباشر'}
                </strong>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">قيمة الجلسة:</span>
                <strong className="text-emerald-400 font-mono text-sm">{activeReceiptModal.fee || '250 ر.س'}</strong>
              </div>

              {activeReceiptModal.receiptNote && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-bold block">ملاحظة ورقم التحويل من العميل:</span>
                  <p className="text-slate-200 font-mono text-xs leading-relaxed">{activeReceiptModal.receiptNote}</p>
                </div>
              )}

              {activeReceiptModal.receiptImage && (
                <div className="space-y-1.5">
                  <span className="text-slate-400 font-bold block">صورة الإيصال المرفقة:</span>
                  <div className="rounded-2xl border border-slate-800 overflow-hidden max-h-72 bg-black flex items-center justify-center">
                    <img
                      src={activeReceiptModal.receiptImage}
                      alt="إيصال التحويل"
                      className="max-h-72 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveReceiptModal(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                إغلاق
              </button>

              {activeReceiptModal.status === 'pending_verification' && (
                <button
                  type="button"
                  onClick={async () => {
                    await handleFastConfirm(activeReceiptModal);
                    setActiveReceiptModal(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition cursor-pointer flex items-center gap-2 shadow-lg"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>اعتماد الإيصال وتأكيد الجلسة فوراً ✓</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
