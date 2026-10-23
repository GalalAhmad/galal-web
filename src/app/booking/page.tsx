'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Brain,
  HeartHandshake,
  Sparkles,
  Compass,
  AlertCircle,
  Calendar,
  Clock,
  ShieldCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Upload,
  ExternalLink,
  CheckCircle2,
  Phone,
  User,
  MapPin,
  Lock,
  Zap,
  Info,
  CalendarClock,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  X
} from 'lucide-react';
import { intakeTracks, TrackConfig } from '@/data/intakeQuestions';

// Payment Logos Components
function InstaPayBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-linear-to-r from-[#7B2CBF] to-[#5A189A] text-white shadow-xs">
      <span className="font-mono font-black text-[11px] tracking-tight">IPN</span>
      <span className="text-[10px] font-bold">إنستاباي</span>
    </div>
  );
}

function VodafoneCashBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E60000] text-white shadow-xs">
      <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center">
        <span className="text-[#E60000] font-black text-[8px] leading-none">’</span>
      </div>
      <span className="text-[10px] font-bold">فودافون كاش</span>
    </div>
  );
}

function NBEBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#005A36] text-[#FFD700] shadow-xs">
      <span className="text-[10px] font-black">الأهلي المصري</span>
    </div>
  );
}

function CardsBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
      <span className="text-blue-600 font-extrabold">VISA</span>
      <span className="text-red-500 font-extrabold">•</span>
      <span className="text-emerald-600 font-black">مدى</span>
    </div>
  );
}

// Calendar Month Generator (Displays month with days grid like Image 2)
function getCalendarMonthData() {
  const arabicMonths = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const arabicDayNames = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = arabicMonths[month];

  // Days in month
  const totalDays = new Date(year, month + 1, 0).getDate();
  const days = [];

  for (let d = 1; d <= totalDays; d++) {
    const curDate = new Date(year, month, d);
    const dayOfWeek = curDate.getDay(); // 0: Sun, 1: Mon, ... 6: Sat
    // Map to Saturday-first index (Sat=0, Sun=1, Mon=2, Tue=3, Wed=4, Thu=5, Fri=6)
    const satIndex = (dayOfWeek + 1) % 7;
    const isPast = d < now.getDate();
    const isToday = d === now.getDate();

    days.push({
      dayNumber: d,
      dateIso: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      dayName: arabicDayNames[satIndex],
      dayOfWeek,
      isPast,
      isToday,
      isSelectable: !isPast,
    });
  }

  return {
    year,
    monthName,
    days,
    arabicDayNames,
  };
}

const TIME_SLOTS = [
  { id: '16:00', label: '04:00 مساءً', duration: '50 دقيقة' },
  { id: '17:30', label: '05:30 مساءً', duration: '50 دقيقة' },
  { id: '19:00', label: '07:00 مساءً', duration: '50 دقيقة' },
  { id: '20:30', label: '08:30 مساءً', duration: '50 دقيقة' },
  { id: '22:00', label: '10:00 مساءً', duration: '50 دقيقة' },
];

function BookingWizardContent() {
  const searchParams = useSearchParams();
  const trackParam = searchParams.get('track');

  // Step state: 1: Track, 2: Intake Questions, 3: Demographics, 4: Policies, 5: Schedule & Pay, 6: Confirmed Ticket
  const [currentStep, setCurrentStep] = useState<number>(trackParam ? 2 : 1);
  const [selectedTrackId, setSelectedTrackId] = useState<string>(trackParam || 'psychological');

  // Intake answers: key = questionId, value = string | string[]
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // Demographics
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAge, setClientAge] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('أعزب');
  const [clientCity, setClientCity] = useState('');

  // Auto-fill logged-in client credentials if active
  useEffect(() => {
    try {
      const saved = localStorage.getItem('galal_user_session');
      if (saved) {
        const user = JSON.parse(saved);
        if (user.name) setClientName(user.name);
        if (user.phone) setClientPhone(user.phone);
        if (user.email) setClientEmail(user.email);
      }
    } catch (e) {}
  }, []);

  // Policy Agreement
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);

  // Calendar & Schedule
  const calendarData = useMemo(() => getCalendarMonthData(), []);
  // Default to tomorrow or first selectable
  const firstSelectable = calendarData.days.find((d) => d.isSelectable && !d.isToday) || calendarData.days.find((d) => d.isSelectable);
  const [selectedDateIso, setSelectedDateIso] = useState<string>(firstSelectable?.dateIso || '');
  const [selectedTimeId, setSelectedTimeId] = useState<string>(TIME_SLOTS[1].id);

  // Live Availability & Blocked Slots (Calendly System)
  const [availabilityData, setAvailabilityData] = useState<{
    workingDays: number[];
    timeSlots: { id: string; label: string; enabled: boolean }[];
    blockedDates: string[];
  }>({
    workingDays: [0, 1, 2, 3, 4, 6],
    timeSlots: [
      { id: '16:00', label: '04:00 مساءً', enabled: true },
      { id: '17:30', label: '05:30 مساءً', enabled: true },
      { id: '19:00', label: '07:00 مساءً', enabled: true },
      { id: '20:30', label: '08:30 مساءً', enabled: true },
      { id: '22:00', label: '10:00 مساءً', enabled: true },
    ],
    blockedDates: [],
  });
  const [bookedSlotsList, setBookedSlotsList] = useState<{ date: string; time: string }[]>([]);

  // Payment Drawer Modal State
  const [isPaymentDrawerOpen, setIsPaymentDrawerOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'instapay' | 'vodafone' | 'bank'>('instapay');
  const [receiptNote, setReceiptNote] = useState('');
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Dynamic Site Settings (Prices & Accounts)
  const [settings, setSettings] = useState({
    showPricing: false,
    individualFee: 'تبدأ من 250 ر.س',
    maritalFee: 'تبدأ من 350 ر.س',
    parentingFee: 'تبدأ من 250 ر.س',
    emergencyFee: '500 ر.س',
    instapayUrl: 'https://ipn.eg/S/insan/instapay/94JPHf',
    instapayHandle: 'insan@instapay',
    vodafoneCashUrl: 'http://vf.eg/vfcash?id=mt&qrId=iLnA7Q',
    vodafoneCashNumber: '01014876666',
    internationalIban: '0873011024083701019',
    bankName: 'البنك الأهلي المصري',
    accountHolder: 'Galal Ahmed Abdelmoti Ahmed',
    whatsapp: '201014876666',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});

    fetch('/api/availability')
      .then((res) => res.json())
      .then((data) => {
        if (data?.availability) {
          setAvailabilityData(data.availability);
        }
        if (data?.bookedSlots) {
          setBookedSlotsList(data.bookedSlots);
        }
      })
      .catch(() => {});
  }, []);

  // Sync selected date with working days and blocked dates
  useEffect(() => {
    if (calendarData.days.length > 0) {
      const isCurrentValid = calendarData.days.some(
        (d) =>
          d.dateIso === selectedDateIso &&
          !d.isPast &&
          availabilityData.workingDays.includes(d.dayOfWeek) &&
          !availabilityData.blockedDates.includes(d.dateIso)
      );
      if (!isCurrentValid) {
        const firstValid =
          calendarData.days.find(
            (d) =>
              !d.isPast &&
              !d.isToday &&
              availabilityData.workingDays.includes(d.dayOfWeek) &&
              !availabilityData.blockedDates.includes(d.dateIso)
          ) ||
          calendarData.days.find(
            (d) =>
              !d.isPast &&
              availabilityData.workingDays.includes(d.dayOfWeek) &&
              !availabilityData.blockedDates.includes(d.dateIso)
          );
        if (firstValid) {
          setSelectedDateIso(firstValid.dateIso);
        }
      }
    }
  }, [availabilityData, calendarData, selectedDateIso]);

  // Sync selected time slot with available/unbooked slots
  useEffect(() => {
    const activeSlots = availabilityData.timeSlots.filter((s) => s.enabled);
    if (activeSlots.length > 0) {
      const isCurrentValid = activeSlots.some(
        (s) =>
          s.id === selectedTimeId &&
          !bookedSlotsList.some(
            (b) => b.date === selectedDateIso && (b.time === s.label || b.time === s.id)
          )
      );
      if (!isCurrentValid) {
        const firstAvailable = activeSlots.find(
          (s) =>
            !bookedSlotsList.some(
              (b) => b.date === selectedDateIso && (b.time === s.label || b.time === s.id)
            )
        );
        if (firstAvailable) {
          setSelectedTimeId(firstAvailable.id);
        }
      }
    }
  }, [selectedDateIso, availabilityData, bookedSlotsList, selectedTimeId]);

  // Preselect track and auto-advance to intake questions
  useEffect(() => {
    if (trackParam && intakeTracks.some((t) => t.id === trackParam)) {
      setSelectedTrackId(trackParam);
      setCurrentStep(2);
    }
  }, [trackParam]);

  const activeTrack = useMemo(() => {
    return intakeTracks.find((t) => t.id === selectedTrackId) || intakeTracks[0];
  }, [selectedTrackId]);

  // Current fee for track
  const currentFee = useMemo(() => {
    switch (activeTrack.id) {
      case 'psychological':
        return settings.individualFee || '250 ر.س';
      case 'marital':
        return settings.maritalFee || '350 ر.س';
      case 'parenting':
        return settings.parentingFee || '250 ر.س';
      case 'emergency':
        return settings.emergencyFee || '500 ر.س';
      default:
        return settings.individualFee || '250 ر.س';
    }
  }, [activeTrack.id, settings]);

  const currentQuestions = activeTrack.questions;
  const currentQuestion = currentQuestions[currentQuestionIndex];

  // Helper for copy
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Handle receipt upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('حجم الصورة كبير، يرجى اختيار صورة أقل من 4 ميجابايت');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle multi-select question with "other" support
  const toggleMultiSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      if (current.includes(optionId)) {
        return { ...prev, [questionId]: current.filter((id: string) => id !== optionId) };
      } else {
        return { ...prev, [questionId]: [...current, optionId] };
      }
    });
  };

  // Submit booking to API and finalize
  const handleConfirmAndPay = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const bookingPayload = {
      clientName,
      clientPhone,
      clientEmail,
      track: activeTrack.id,
      trackLabel: activeTrack.title,
      age: clientAge,
      maritalStatus,
      clientCity,
      answers,
      slotDate: selectedDateIso,
      slotTime:
        availabilityData.timeSlots.find((s) => s.id === selectedTimeId)?.label ||
        TIME_SLOTS.find((s) => s.id === selectedTimeId)?.label ||
        selectedTimeId,
      paymentMethod,
      receiptNote,
      receiptImage,
      fee: currentFee,
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'تعذر تسجيل الحجز، يرجى التحقق من البيانات.');
      }

      setSubmittedBooking(data.booking);
      setBookedSlotsList((prev) => [
        ...prev,
        { date: selectedDateIso, time: bookingPayload.slotTime },
      ]);

      // Save user session for client profile integration
      try {
        localStorage.setItem(
          'galal_user_session',
          JSON.stringify({
            name: bookingPayload.clientName,
            phone: bookingPayload.clientPhone,
            email: bookingPayload.clientEmail,
            provider: 'booking',
          })
        );
      } catch (e) {}

      setIsPaymentDrawerOpen(false);
      setCurrentStep(6); // Confirmation screen
    } catch (err: any) {
      setSubmitError(err.message || 'حدث خطأ غير متوقع، يرجى المحاولة ثانية.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp confirmation url
  const getWhatsAppConfirmationUrl = () => {
    if (!submittedBooking) return '#';
    const msg = `مرحباً أستاذ جلال أحمد،
قمت بحجز موعد استشارة وتأكيد السداد عبر موقعكم:

*رقم الحجز:* ${submittedBooking.id}
*نوع الاستشارة:* ${submittedBooking.trackLabel}
*الاسم:* ${submittedBooking.clientName}
*الموعد المختار:* ${submittedBooking.slotDate} (${submittedBooking.slotTime})
*وسيلة السداد:* ${
      submittedBooking.paymentMethod === 'instapay'
        ? 'إنستاباي'
        : submittedBooking.paymentMethod === 'vodafone'
        ? 'فودافون كاش'
        : 'تحويل بنكي'
    }

أرجو تأكيد الموعد وإرسال رابط الجلسة (Google Meet). شاكر ومقدّر.`;

    return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#0B0F15] text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors">
      
      {/* Full Header Navigation with Logo & Sections */}
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Breadcrumb Navigation & Back to Home */}
        <div className="mb-6 flex items-center justify-between text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#4E7E76] dark:hover:text-[#5E988E] font-bold transition"
          >
            <ChevronRight className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </Link>

          <div className="flex items-center gap-2 text-slate-400">
            <span>الاستشارات</span>
            <span>/</span>
            <span className="text-[#4E7E76] dark:text-[#5E988E] font-bold">{activeTrack.title}</span>
          </div>
        </div>

        {/* Step Progress Stepper (Hidden on Final Success Step) */}
        {currentStep < 6 && (
          <div className="mb-8 bg-white dark:bg-[#161B22] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className={`flex items-center gap-1.5 ${currentStep >= 1 ? 'text-[#4E7E76] dark:text-[#5E988E] font-black' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 1 ? 'bg-[#4E7E76] text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>1</span>
                <span>المسار</span>
              </span>
              <span className="w-4 sm:w-10 h-0.5 bg-slate-200 dark:bg-slate-800" />
              <span className={`flex items-center gap-1.5 ${currentStep >= 2 ? 'text-[#4E7E76] dark:text-[#5E988E] font-black' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 2 ? 'bg-[#4E7E76] text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>2</span>
                <span>الاستبيان</span>
              </span>
              <span className="w-4 sm:w-10 h-0.5 bg-slate-200 dark:bg-slate-800" />
              <span className={`flex items-center gap-1.5 ${currentStep >= 3 ? 'text-[#4E7E76] dark:text-[#5E988E] font-black' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 3 ? 'bg-[#4E7E76] text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>3</span>
                <span>البيانات</span>
              </span>
              <span className="w-4 sm:w-10 h-0.5 bg-slate-200 dark:bg-slate-800" />
              <span className={`flex items-center gap-1.5 ${currentStep >= 4 ? 'text-[#4E7E76] dark:text-[#5E988E] font-black' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 4 ? 'bg-[#4E7E76] text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>4</span>
                <span>السياسات</span>
              </span>
              <span className="w-4 sm:w-10 h-0.5 bg-slate-200 dark:bg-slate-800" />
              <span className={`flex items-center gap-1.5 ${currentStep >= 5 ? 'text-[#4E7E76] dark:text-[#5E988E] font-black' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 5 ? 'bg-[#4E7E76] text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>5</span>
                <span>الموعد والدفع</span>
              </span>
            </div>
          </div>
        )}

        {/* STEP 1: UNIFIED TRACK SELECTION CARDS (MATCHING /services DESIGN) */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center sm:text-right">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                اختر نوع الاستشارة المناسب لك
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                نفس المسارات المعتمدة في صفحة الاستشارات مع استمارة سريرية موجهة لكل مسار.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {intakeTracks.map((track) => {
                const isSelected = selectedTrackId === track.id;
                const isEmergency = track.id === 'emergency';
                const feeDisplay =
                  track.id === 'psychological'
                    ? settings.individualFee
                    : track.id === 'marital'
                    ? settings.maritalFee
                    : track.id === 'parenting'
                    ? settings.parentingFee
                    : track.id === 'emergency'
                    ? settings.emergencyFee
                    : track.defaultFee;

                return (
                  <div
                    key={track.id}
                    onClick={() => setSelectedTrackId(track.id)}
                    className={`cursor-pointer p-6 rounded-3xl border-2 transition-all relative ${
                      isSelected
                        ? isEmergency
                          ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 shadow-lg ring-2 ring-amber-500/20'
                          : 'border-[#4E7E76] dark:border-[#5E988E] bg-[#4E7E76]/5 dark:bg-[#5E988E]/10 shadow-lg ring-2 ring-[#4E7E76]/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B22] hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                          {track.badge}
                        </span>
                        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white mt-2">
                          {track.title}
                        </h3>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? isEmergency
                              ? 'border-amber-500 bg-amber-500 text-white'
                              : 'border-[#4E7E76] bg-[#4E7E76] text-white'
                            : 'border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed min-h-[45px]">
                      {track.desc}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      {settings.showPricing ? (
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          الرسوم المعتمدة: <strong className="text-[#4E7E76] dark:text-[#5E988E] text-sm">{feeDisplay}</strong>
                        </span>
                      ) : (
                        <span className="font-bold text-[#4E7E76] dark:text-[#5E988E]">
                          جلسة استشارية متخصصة ومباشرة
                        </span>
                      )}
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {track.duration}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setCurrentStep(2);
                }}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#4E7E76] hover:bg-[#3D645E] text-white font-bold rounded-2xl transition shadow-md hover:shadow-lg"
              >
                <span>متابعة للاستمارة التشخيصية</span>
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: INTAKE QUESTIONS WITH "غير ذلك" AND "اكتب هنا" */}
        {currentStep === 2 && currentQuestion && (
          <div className="bg-white dark:bg-[#161B22] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#4E7E76]/10 text-[#4E7E76] dark:text-[#5E988E] text-xs font-bold rounded-full">
                  {activeTrack.title}
                </span>
                <span className="text-xs text-slate-500">
                  سؤال {currentQuestionIndex + 1} من {currentQuestions.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-bold"
              >
                تغيير المسار
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#4E7E76] h-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`,
                }}
              />
            </div>

            {/* Question Text */}
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {currentQuestion.question}
              </h2>
              {currentQuestion.subtitle && (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {currentQuestion.subtitle}
                </p>
              )}
            </div>

            {/* Options List */}
            <div className="pt-2 space-y-3">
              {/* Multi-Select Options */}
              {currentQuestion.type === 'multi-select' && currentQuestion.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentQuestion.options.map((option) => {
                    const selectedList: string[] = Array.isArray(answers[currentQuestion.id])
                      ? answers[currentQuestion.id]
                      : [];
                    const isChecked = selectedList.includes(option.id);

                    return (
                      <button
                        type="button"
                        key={option.id}
                        onClick={() => toggleMultiSelectOption(currentQuestion.id, option.id)}
                        className={`text-right p-3.5 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${
                          isChecked
                            ? 'border-[#4E7E76] bg-[#4E7E76]/10 dark:bg-[#5E988E]/15 text-[#3D645E] dark:text-emerald-300 font-bold'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs sm:text-sm">{option.label}</span>
                        <span
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'bg-[#4E7E76] border-[#4E7E76] text-white'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </span>
                      </button>
                    );
                  })}

                  {/* "غير ذلك" Option for Multi-Select (Image 1 pattern) */}
                  {(() => {
                    const selectedList: string[] = Array.isArray(answers[currentQuestion.id])
                      ? answers[currentQuestion.id]
                      : [];
                    const isOtherChecked = selectedList.includes('other');

                    return (
                      <button
                        type="button"
                        onClick={() => toggleMultiSelectOption(currentQuestion.id, 'other')}
                        className={`text-right p-3.5 rounded-xl border-2 transition-all flex items-center justify-between gap-3 sm:col-span-2 ${
                          isOtherChecked
                            ? 'border-[#4E7E76] bg-[#4E7E76]/10 dark:bg-[#5E988E]/15 text-[#3D645E] dark:text-emerald-300 font-bold'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-bold">غير ذلك</span>
                        <span
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                            isOtherChecked
                              ? 'bg-[#4E7E76] border-[#4E7E76] text-white'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {isOtherChecked && <Check className="w-3 h-3" />}
                        </span>
                      </button>
                    );
                  })()}
                </div>
              )}

              {/* Single-Select Options */}
              {currentQuestion.type === 'single-select' && currentQuestion.options && (
                <div className="space-y-2.5">
                  {currentQuestion.options.map((option) => {
                    const isSelected = answers[currentQuestion.id] === option.id;

                    return (
                      <button
                        type="button"
                        key={option.id}
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option.id }))
                        }
                        className={`w-full text-right p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-[#4E7E76] bg-[#4E7E76]/10 dark:bg-[#5E988E]/15 text-[#3D645E] dark:text-emerald-300 font-bold'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="text-xs sm:text-sm">{option.label}</div>
                          {option.description && (
                            <div className="text-xs text-slate-500 mt-1">{option.description}</div>
                          )}
                        </div>
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-[#4E7E76] bg-[#4E7E76] text-white'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                        </span>
                      </button>
                    );
                  })}

                  {/* "غير ذلك" Option for Single-Select */}
                  <button
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: 'other' }))
                    }
                    className={`w-full text-right p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${
                      answers[currentQuestion.id] === 'other'
                        ? 'border-[#4E7E76] bg-[#4E7E76]/10 dark:bg-[#5E988E]/15 text-[#3D645E] dark:text-emerald-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">غير ذلك</span>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        answers[currentQuestion.id] === 'other'
                          ? 'border-[#4E7E76] bg-[#4E7E76] text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {answers[currentQuestion.id] === 'other' && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                  </button>
                </div>
              )}

              {/* Textarea Input */}
              {currentQuestion.type === 'textarea' && (
                <div>
                  <textarea
                    rows={4}
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }))
                    }
                    placeholder={currentQuestion.placeholder || 'اكتب هنا باستفاضة وراحة تامة...'}
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#4E7E76]"
                  />
                </div>
              )}

              {/* Single-line Text Input / Structured Child Details */}
              {currentQuestion.type === 'text' && (
                <div className="space-y-3">
                  {currentQuestion.id === 'child_basic' ? (
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            اسم الابن / الابنة <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={answers['child_name'] || ''}
                            onChange={(e) => {
                              const name = e.target.value;
                              setAnswers((prev) => {
                                const age = prev['child_age'] || '';
                                const grade = prev['child_grade'] || '';
                                const parts = [
                                  name && `الاسم: ${name}`,
                                  age && `العمر: ${age}`,
                                  grade && `المرحلة: ${grade}`,
                                ].filter(Boolean);
                                return {
                                  ...prev,
                                  child_name: name,
                                  [currentQuestion.id]: parts.join(' • '),
                                };
                              });
                            }}
                            placeholder="مثال: يوسف"
                            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            العمر <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={answers['child_age'] || ''}
                            onChange={(e) => {
                              const age = e.target.value;
                              setAnswers((prev) => {
                                const name = prev['child_name'] || '';
                                const grade = prev['child_grade'] || '';
                                const parts = [
                                  name && `الاسم: ${name}`,
                                  age && `العمر: ${age}`,
                                  grade && `المرحلة: ${grade}`,
                                ].filter(Boolean);
                                return {
                                  ...prev,
                                  child_age: age,
                                  [currentQuestion.id]: parts.join(' • '),
                                };
                              });
                            }}
                            placeholder="مثال: 9 سنوات"
                            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            المرحلة الدراسية
                          </label>
                          <input
                            type="text"
                            value={answers['child_grade'] || ''}
                            onChange={(e) => {
                              const grade = e.target.value;
                              setAnswers((prev) => {
                                const name = prev['child_name'] || '';
                                const age = prev['child_age'] || '';
                                const parts = [
                                  name && `الاسم: ${name}`,
                                  age && `العمر: ${age}`,
                                  grade && `المرحلة: ${grade}`,
                                ].filter(Boolean);
                                return {
                                  ...prev,
                                  child_grade: grade,
                                  [currentQuestion.id]: parts.join(' • '),
                                };
                              });
                            }}
                            placeholder="مثال: الصف الثالث الابتدائي"
                            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        تُسجل هذه البيانات في ملف الاستشارة لتقييم الاحتياجات النفسية والنمائية للطفل بدقة.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={answers[currentQuestion.id] || ''}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [currentQuestion.id]: e.target.value,
                          }))
                        }
                        placeholder={currentQuestion.placeholder || 'اكتب إجابتك هنا...'}
                        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#4E7E76]"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* "اكتب هنا" Box When "غير ذلك" is Selected (Image 1 pattern) */}
              {(answers[currentQuestion.id] === 'other' ||
                (Array.isArray(answers[currentQuestion.id]) &&
                  answers[currentQuestion.id].includes('other'))) && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 space-y-1.5 animate-fadeIn">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    اكتب هنا (صف العرض أو المشكلة بالتحديد):
                  </label>
                  <textarea
                    rows={3}
                    value={answers[`${currentQuestion.id}_other_text`] || ''}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [`${currentQuestion.id}_other_text`]: e.target.value,
                      }))
                    }
                    placeholder="اكتب هنا..."
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#4E7E76] focus:outline-hidden"
                  />
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  if (currentQuestionIndex > 0) {
                    setCurrentQuestionIndex((prev) => prev - 1);
                  } else {
                    setCurrentStep(1);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابق</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (currentQuestionIndex < currentQuestions.length - 1) {
                    setCurrentQuestionIndex((prev) => prev + 1);
                  } else {
                    setCurrentStep(3); // Demographics
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#4E7E76] hover:bg-[#3D645E] text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                <span>
                  {currentQuestionIndex < currentQuestions.length - 1
                    ? 'السؤال التالي'
                    : 'الانتقال للبيانات الأساسية'}
                </span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DEMOGRAPHICS */}
        {currentStep === 3 && (
          <div className="bg-white dark:bg-[#161B22] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                البيانات الأساسية والتواصل
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                نستخدم رقم الواتساب لإرسال تأكيد الحجز ورابط لقاء Google Meet المباشر.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  الاسم الكريم (أو الاسم المستعار المفضل) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="مثال: أحمد عبد الله"
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-[#4E7E76]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  رقم الواتساب مع مفتاح الدولة *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+966 50 000 0000 أو +20 100 000 0000"
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm text-left focus:outline-hidden focus:ring-2 focus:ring-[#4E7E76]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  البريد الإلكتروني (اختياري)
                </label>
                <input
                  type="email"
                  dir="ltr"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm text-left focus:outline-hidden focus:ring-2 focus:ring-[#4E7E76]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  العمر (بالسنوات)
                </label>
                <input
                  type="number"
                  value={clientAge}
                  onChange={(e) => setClientAge(e.target.value)}
                  placeholder="مثال: 29"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-[#4E7E76]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  الحالة الاجتماعية
                </label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-[#4E7E76]"
                >
                  <option value="أعزب">أعزب / عزباء</option>
                  <option value="عاقد قران / مقبل">عاقد قران / مقبل على الزواج</option>
                  <option value="متزوج">متزوج / متزوجة</option>
                  <option value="منفصل / مطلق">منفصل / مطلق</option>
                  <option value="أرمل">أرمل / أرملة</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  بلد ومدينة الإقامة الحالية
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  <input
                    type="text"
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                    placeholder="مثال: الرياض، السعودية أو القاهرة، مصر"
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-[#4E7E76]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <ChevronRight className="w-4 h-4" />
                <span>العودة للاستبيان</span>
              </button>

              <button
                type="button"
                disabled={!clientName.trim() || !clientPhone.trim()}
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#4E7E76] hover:bg-[#3D645E] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                <span>متابعة لميثاق السرية والسياسات</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: POLICIES & CHARTER (MATCHING "ونفس") */}
        {currentStep === 4 && (
          <div className="bg-white dark:bg-[#161B22] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#4E7E76]/10 text-[#4E7E76] dark:text-[#5E988E] flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  ميثاق السرية والسياسات التنظيمية
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  يرجى قراءة البنود والموافقة عليها لضمان جلسة آمنة ومنضبطة
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>1. ميثاق السرية التامة والأمانة المهنية</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-6">
                  كل ما يتم طرحه داخل الجلسة هو سر مهني مطلق، محمي بأعلى معايير الأمانة الأخلاقية والمهنية، ولا يُشارك مع أي طرف إطلاقاً.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm mb-1.5">
                  <CalendarClock className="w-4 h-4 text-[#4E7E76]" />
                  <span>2. سياسة الإلغاء وتعديل الموعد</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-6">
                  يحق لك تعديل موعد الجلسة أو تأجيله قبل الموعد بـ <strong>48 ساعة</strong> على الأقل دون أي رسوم إضافية.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm mb-1.5">
                  <Clock className="w-4 h-4 text-[#4E7E76]" />
                  <span>3. الانضباط الفني وبدء الجلسة</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-6">
                  تُعقد الجلسات عبر Google Meet. يرجى التواجد في مكان هادئ قبل الموعد بـ 5 دقائق. في حال التأخير لأكثر من 15 دقيقة دون إخطار، تُحتسب الجلسة حرصاً على جدول المواعيد.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 p-4 rounded-2xl bg-[#4E7E76]/5 dark:bg-[#5E988E]/10 border-2 border-[#4E7E76]/30 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToPolicies}
                  onChange={(e) => setAgreedToPolicies(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#4E7E76] rounded-sm focus:ring-[#4E7E76]"
                />
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
                  أقر بأنني اطلعت على ميثاق السرية وسياسة الإلغاء وشروط الجلسات وأوافق عليها بالكامل.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <ChevronRight className="w-4 h-4" />
                <span>العودة للبيانات</span>
              </button>

              <button
                type="button"
                disabled={!agreedToPolicies}
                onClick={() => setCurrentStep(5)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#4E7E76] hover:bg-[#3D645E] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                <span>متابعة لتحديد الموعد والسداد</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: UNIFIED SCHEDULE & TIME & PAY (MATCHING "عوافي" IMAGE 2 PATTERN) */}
        {currentStep === 5 && (
          <div className="bg-white dark:bg-[#161B22] p-5 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fadeIn">
            
            {/* Header */}
            <div className="text-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                تحديد موعد الجلسة
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                اختر اليوم والوقت الملائمين، ثم اضغط زر الدفع لتأكيد الحجز فورياً.
              </p>
            </div>

            {/* Calendar View (Image 2 style) */}
            <div className="max-w-md mx-auto space-y-4">
              {/* Month Header */}
              <div className="flex items-center justify-center gap-4 text-base font-extrabold text-[#10B981]">
                <span>{calendarData.monthName} {calendarData.year}</span>
              </div>

              {/* Weekdays Labels */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-500">
                {calendarData.arabicDayNames.map((dayName, idx) => (
                  <div key={idx} className="py-1">
                    {dayName}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarData.days.map((d) => {
                  const isWorkingDay = availabilityData.workingDays.includes(d.dayOfWeek);
                  const isBlocked = availabilityData.blockedDates.includes(d.dateIso);
                  const isDaySelectable = !d.isPast && isWorkingDay && !isBlocked;
                  const isSelected = selectedDateIso === d.dateIso;

                  return (
                    <div key={d.dateIso} className="flex items-center justify-center p-1">
                      <button
                        type="button"
                        disabled={!isDaySelectable}
                        onClick={() => setSelectedDateIso(d.dateIso)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#10B981] text-white shadow-md ring-4 ring-[#10B981]/25'
                            : isDaySelectable
                            ? 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                            : 'text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40'
                        }`}
                      >
                        {d.dayNumber}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Session Duration Badge */}
              <div className="pt-2 flex justify-end">
                <span className="inline-block px-3 py-1 rounded-xl border border-[#10B981]/50 text-[#10B981] text-xs font-bold bg-[#10B981]/5">
                  50 دقيقة
                </span>
              </div>

              {/* Available Time Slots */}
              <div className="pt-2 space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 text-right">
                  المواعيد المتاحة
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availabilityData.timeSlots
                    .filter((slot) => slot.enabled)
                    .map((slot) => {
                      const isSelected = selectedTimeId === slot.id;
                      const isBooked = bookedSlotsList.some(
                        (b) =>
                          b.date === selectedDateIso &&
                          (b.time === slot.label || b.time === slot.id)
                      );

                      return (
                        <button
                          type="button"
                          key={slot.id}
                          disabled={isBooked}
                          onClick={() => setSelectedTimeId(slot.id)}
                          className={`p-3 rounded-2xl border text-center transition-all flex items-center justify-center gap-1.5 text-xs font-bold ${
                            isBooked
                              ? 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50'
                              : isSelected
                              ? 'border-[#10B981] bg-[#10B981]/10 text-[#047857] dark:text-[#34D399] ring-2 ring-[#10B981]/20'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <Clock className={`w-3.5 h-3.5 ${isBooked ? 'text-slate-400' : 'text-[#10B981]'}`} />
                          <span>
                            {slot.label} {isBooked ? '(محجوز)' : ''}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Prominent Awafi-style Pay CTA Button (Image 2) */}
              <div className="pt-4">
                <button
                  type="button"
                  disabled={!selectedDateIso || !selectedTimeId}
                  onClick={() => setIsPaymentDrawerOpen(true)}
                  className="w-full py-4 rounded-2xl bg-[#10B981] hover:bg-[#059669] disabled:bg-slate-300 text-white font-extrabold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{settings.showPricing ? `دفع ${currentFee}` : 'تأكيد الموعد والمتابعة'}</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-bold"
                >
                  العودة للخطوة السابقة
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT DRAWER / MODAL (MATCHING "عوافي" IMAGE 3 PATTERN) */}
        {isPaymentDrawerOpen && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
            onClick={() => setIsPaymentDrawerOpen(false)}
          >
            <div
              className="relative max-w-lg w-full bg-white dark:bg-[#161B22] border-t sm:border border-slate-200 dark:border-slate-700 rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-slideUp text-right"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPaymentDrawerOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  اختر طريقة الدفع
                </h3>
              </div>

              {/* Payment Methods List */}
              <div className="space-y-3">
                {/* 1. InstaPay */}
                <div
                  onClick={() => setPaymentMethod('instapay')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'instapay'
                      ? 'border-[#7B2CBF] bg-[#7B2CBF]/5 dark:bg-[#7B2CBF]/15 ring-2 ring-[#7B2CBF]/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <InstaPayBadge />
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        إنستاباي (InstaPay مصر)
                      </span>
                    </div>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        paymentMethod === 'instapay' ? 'border-[#7B2CBF] bg-[#7B2CBF] text-white' : 'border-slate-300'
                      }`}
                    >
                      {paymentMethod === 'instapay' && <Check className="w-3 h-3" />}
                    </span>
                  </div>

                  {paymentMethod === 'instapay' && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-bold">معرف إنستاباي:</span>
                        <div className="flex items-center gap-2">
                          <code className="font-mono font-bold text-slate-800 dark:text-slate-200" dir="ltr">
                            {settings.instapayHandle}
                          </code>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(settings.instapayHandle, 'instapay');
                            }}
                            className="p-1 px-2 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold"
                          >
                            {copiedField === 'instapay' ? 'تم النسخ!' : 'نسخ'}
                          </button>
                        </div>
                      </div>

                      <a
                        href={settings.instapayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-[#7B2CBF] hover:bg-[#6A24A6] text-white font-bold rounded-xl text-xs transition"
                      >
                        <span>افتح تطبيق InstaPay وادفع مباشرة</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                {/* 2. Vodafone Cash */}
                <div
                  onClick={() => setPaymentMethod('vodafone')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'vodafone'
                      ? 'border-[#E60000] bg-red-50/40 dark:bg-red-950/20 ring-2 ring-red-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <VodafoneCashBadge />
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        محفظة فودافون كاش
                      </span>
                    </div>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        paymentMethod === 'vodafone' ? 'border-[#E60000] bg-[#E60000] text-white' : 'border-slate-300'
                      }`}
                    >
                      {paymentMethod === 'vodafone' && <Check className="w-3 h-3" />}
                    </span>
                  </div>

                  {paymentMethod === 'vodafone' && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-bold">رقم المحفظة:</span>
                        <div className="flex items-center gap-2">
                          <code className="font-mono font-bold text-slate-800 dark:text-slate-200" dir="ltr">
                            {settings.vodafoneCashNumber}
                          </code>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(settings.vodafoneCashNumber, 'vodafone');
                            }}
                            className="p-1 px-2 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold"
                          >
                            {copiedField === 'vodafone' ? 'تم النسخ!' : 'نسخ'}
                          </button>
                        </div>
                      </div>

                      <a
                        href={settings.vodafoneCashUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-[#E60000] hover:bg-[#CC0000] text-white font-bold rounded-xl text-xs transition"
                      >
                        <span>افتح محفظة فودافون كاش للتحويل</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                {/* 3. National Bank of Egypt (IBAN International) */}
                <div
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'bank'
                      ? 'border-[#005A36] bg-[#005A36]/5 dark:bg-[#005A36]/15 ring-2 ring-[#005A36]/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <NBEBadge />
                      <CardsBadge />
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        تحويل بنكي دولي (الأهلي المصري)
                      </span>
                    </div>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        paymentMethod === 'bank' ? 'border-[#005A36] bg-[#005A36] text-white' : 'border-slate-300'
                      }`}
                    >
                      {paymentMethod === 'bank' && <Check className="w-3 h-3" />}
                    </span>
                  </div>

                  {paymentMethod === 'bank' && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                      <div>
                        <strong>المستفيد:</strong> {settings.accountHolder}
                      </div>
                      <div>
                        <strong>البنك:</strong> {settings.bankName}
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <strong>IBAN:</strong> <span className="font-mono" dir="ltr">{settings.internationalIban}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(settings.internationalIban, 'iban');
                          }}
                          className="p-1 px-2 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold"
                        >
                          {copiedField === 'iban' ? 'تم النسخ!' : 'نسخ'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Receipt Upload / Note */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  إثبات التحويل (صورة الإيصال أو رقم العملية):
                </label>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>{receiptImage ? 'تغيير الإيصال' : 'رفع إيصال'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>

                  <input
                    type="text"
                    value={receiptNote}
                    onChange={(e) => setReceiptNote(e.target.value)}
                    placeholder="أو اكتب رقم العملية / اسم المحول..."
                    className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
                  />
                </div>

                {receiptImage && (
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تم إرفاق صورة الإيصال بنجاح</span>
                  </div>
                )}
              </div>

              {/* Error Box */}
              {submitError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs font-bold">
                  {submitError}
                </div>
              )}

              {/* Confirm Button (Image 3 style) */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmAndPay}
                  className="w-full py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] disabled:bg-slate-300 text-white font-extrabold text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>جاري تأكيد وتسجيل حجزك...</span>
                    </>
                  ) : (
                    <span>تأكيد</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: CONFIRMATION TICKET & DIRECT WHATSAPP DISPATCH */}
        {currentStep === 6 && submittedBooking && (
          <div className="bg-white dark:bg-[#161B22] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="px-3.5 py-1 bg-[#4E7E76]/10 text-[#4E7E76] dark:text-[#5E988E] text-xs font-extrabold rounded-full">
                تم اعتماد وتسجيل حجزك بنجاح
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                أهلاً بك أستاذ {submittedBooking.clientName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
                تم تسجيل بياناتك وموعد جلستك المقترح بنجاح في نظام المواعيد.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 text-right space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 font-bold">
                <span className="text-slate-500">رقم الحجز المرجعي:</span>
                <span className="font-mono text-sm text-[#4E7E76] dark:text-[#5E988E]">
                  {submittedBooking.id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">نوع الاستشارة:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {submittedBooking.trackLabel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">الموعد المحدد:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {submittedBooking.slotDate} — {submittedBooking.slotTime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">حالة السداد:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  تم تسجيل التحويل وإرفاق الإيصال
                </span>
              </div>
            </div>

            {/* 1-Click WhatsApp Button */}
            <div className="pt-2">
              <a
                href={getWhatsAppConfirmationUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
              >
                <Phone className="w-5 h-5" />
                <span>إرسال إشعار الحجز ورابط السداد للمستشار عبر واتساب فوراً</span>
              </a>
              <p className="text-xs text-slate-500 mt-2">
                ضغطة واحدة تفتح محادثة واتساب جاهزة ومجهزة برقم حجزك لتسريع اعتماد الموعد وتزويدك برابط الجلسة.
              </p>
            </div>

            {/* View Client Profile Button */}
            <div className="pt-2">
              <Link
                href="/profile"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#4E7E76] hover:bg-[#3D645E] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                <span>الانتقال لملفي الشخصي ومتابعة الحجز والواجبات</span>
                <ArrowLeft className="w-4 h-4 rtl:rotate-0" />
              </Link>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-4 text-xs font-bold">
              <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-[#4E7E76] transition">
                العودة للرئيسية
              </Link>
              <span>•</span>
              <Link href="/services" className="text-slate-600 dark:text-slate-400 hover:text-[#4E7E76] transition">
                صفحة الاستشارات
              </Link>
              <span>•</span>
              <Link href="/articles" className="text-slate-600 dark:text-slate-400 hover:text-[#4E7E76] transition">
                تصفح المقالات
              </Link>
            </div>
          </div>
        )}

      </main>

      {/* Full Footer with Logo and All Site Sections */}
      <Footer />

    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">
          جاري تحميل نظام الحجز...
        </div>
      }
    >
      <BookingWizardContent />
    </Suspense>
  );
}
