'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
  FileCheck
} from 'lucide-react';
import { intakeTracks, TrackConfig, IntakeQuestion } from '@/data/intakeQuestions';

// Days generator for the next 14 days
function getAvailableDates() {
  const dates = [];
  const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const arabicMonths = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const now = new Date();
  // Start from tomorrow
  for (let i = 1; i <= 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dayName = arabicDays[d.getDay()];
    const dayNum = d.getDate();
    const monthName = arabicMonths[d.getMonth()];
    const isoDate = d.toISOString().split('T')[0];

    dates.push({
      iso: isoDate,
      label: `${dayName}، ${dayNum} ${monthName}`,
      shortLabel: `${dayName} ${dayNum}`,
      isWeekend: d.getDay() === 5, // Friday
    });
  }
  return dates;
}

const TIME_SLOTS = [
  { id: '16:00', label: '04:00 مساءً', period: 'مساءً' },
  { id: '17:30', label: '05:30 مساءً', period: 'مساءً' },
  { id: '19:00', label: '07:00 مساءً', period: 'مساءً' },
  { id: '20:30', label: '08:30 مساءً', period: 'مساءً' },
  { id: '22:00', label: '10:00 مساءً', period: 'ليلاً' },
];

function BookingWizardContent() {
  const searchParams = useSearchParams();
  const trackParam = searchParams.get('track');

  // Step state: 1: Track, 2: Intake Questions, 3: Demographics, 4: Policies, 5: Schedule, 6: Payment, 7: Confirmed
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedTrackId, setSelectedTrackId] = useState<string>('psychological');

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

  // Policy Agreement
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);

  // Schedule
  const availableDates = useMemo(() => getAvailableDates(), []);
  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0]?.iso || '');
  const [selectedTime, setSelectedTime] = useState<string>(TIME_SLOTS[1].id);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'instapay' | 'vodafone' | 'bank'>('instapay');
  const [receiptNote, setReceiptNote] = useState('');
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Site Settings for payment info
  const [settings, setSettings] = useState({
    instapayUrl: 'https://ipn.eg/S/insan/instapay/94JPHf',
    instapayHandle: 'insan@instapay',
    vodafoneCashUrl: 'http://vf.eg/vfcash?id=mt&qrId=iLnA7Q',
    vodafoneCashNumber: '01014876666',
    internationalIban: 'EG0000000000000000000000000',
    bankName: 'البنك الأهلي المصري',
    accountHolder: 'جلال أحمد',
    whatsapp: '201014876666',
  });

  useEffect(() => {
    // Fetch live settings if available
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  // Preselect track from query param
  useEffect(() => {
    if (trackParam && intakeTracks.some((t) => t.id === trackParam)) {
      setSelectedTrackId(trackParam);
    }
  }, [trackParam]);

  const activeTrack = useMemo(() => {
    return intakeTracks.find((t) => t.id === selectedTrackId) || intakeTracks[0];
  }, [selectedTrackId]);

  const currentQuestions = activeTrack.questions;
  const currentQuestion = currentQuestions[currentQuestionIndex];

  // Helper for copy
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Handle image upload (base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 4 ميجابايت');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle multi-select question
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

  // Submit booking to API
  const handleSubmitBooking = async () => {
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
      slotDate: selectedDate,
      slotTime: selectedTime,
      paymentMethod,
      receiptNote,
      receiptImage,
      fee: activeTrack.defaultFee,
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
      setCurrentStep(7); // Show confirmation
    } catch (err: any) {
      setSubmitError(err.message || 'حدث خطأ غير متوقع، يرجى المحاولة ثانية.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate WhatsApp message for instant confirmation dispatch
  const getWhatsAppConfirmationUrl = () => {
    if (!submittedBooking) return '#';
    const msg = `مرحباً أستاذ جلال أحمد،
قمت بحجز موعد استشارة عبر موقعكم الرسمي:

*رقم الحجز:* ${submittedBooking.id}
*نوع الاستشارة:* ${submittedBooking.trackLabel}
*الاسم:* ${submittedBooking.clientName}
*الموعد المقترح:* ${submittedBooking.slotDate} (${submittedBooking.slotTime})
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

  // Dynamic track icon renderer
  const renderTrackIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'Brain':
        return <Brain className={className} />;
      case 'HeartHandshake':
        return <HeartHandshake className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      default:
        return <HeartHandshake className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50 dark:from-[#0B0F15] dark:via-[#0D1117] dark:to-[#0B0F15] py-8 sm:py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header Breadcrumb / Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4E7E76]/10 dark:bg-[#5E988E]/15 text-[#3D645E] dark:text-[#7EB5AB] text-xs font-bold mb-3 border border-[#4E7E76]/20">
            <ShieldCheck className="w-4 h-4 text-[#4E7E76] dark:text-[#5E988E]" />
            <span>نظام الحجز الذكي وميثاق السرية التامة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            حجز استشارة خاصة مع <span className="text-[#4E7E76] dark:text-[#5E988E]">جلال أحمد</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            خطوات ميسّرة تبدأ بتشخيص أولي دقيق لاحتياجك، وتحديد الموعد الأنسب، وسداد آمن وسريع.
          </p>
        </div>

        {/* Step Progress Stepper (Hidden on Final Success Step) */}
        {currentStep < 7 && (
          <div className="mb-8 bg-white dark:bg-[#161B22] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className={`flex items-center gap-1.5 ${currentStep >= 1 ? 'text-[#4E7E76] dark:text-[#5E988E] font-black' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 1 ? 'bg-[#4E7E76] text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>1</span>
                <span>المسار</span>
              </span>
              <span className="hidden sm:inline-block w-8 h-0.5 bg-slate-200 dark:bg-slate-800" />
              <span className={`flex items-center gap-1.5 ${currentStep >= 2 ? 'text-[#4E7E76] dark:text-[#5E988E] font-black' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 2 ? 'bg-[#4E7E76] text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>2</span>
                <span>الاستبيان</span>
              </span>
              <span className="hidden sm:inline-block w-8 h-0.5 bg-slate-200 dark:bg-slate-800" />
              <span className={`flex items-center gap-1.5 ${currentStep >= 3 ? 'text-[#4E7E76] dark:text-[#5E988E] font-black' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 3 ? 'bg-[#4E7E76] text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>3</span>
                <span>البيانات</span>
              </span>
              <span className="hidden sm:inline-block w-8 h-0.5 bg-slate-200 dark:bg-slate-800" />
              <span className={`flex items-center gap-1.5 ${currentStep >= 4 ? 'text-[#4E7E76] dark:text-[#5E988E] font-black' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 4 ? 'bg-[#4E7E76] text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>4</span>
                <span>السياسات</span>
              </span>
              <span className="hidden sm:inline-block w-8 h-0.5 bg-slate-200 dark:bg-slate-800" />
              <span className={`flex items-center gap-1.5 ${currentStep >= 5 ? 'text-[#4E7E76] dark:text-[#5E988E] font-black' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 5 ? 'bg-[#4E7E76] text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>5</span>
                <span>الموعد</span>
              </span>
              <span className="hidden sm:inline-block w-8 h-0.5 bg-slate-200 dark:bg-slate-800" />
              <span className={`flex items-center gap-1.5 ${currentStep >= 6 ? 'text-[#4E7E76] dark:text-[#5E988E] font-black' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 6 ? 'bg-[#4E7E76] text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>6</span>
                <span>السداد</span>
              </span>
            </div>
          </div>
        )}

        {/* STEP 1: TRACK SELECTION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center sm:text-right">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                الخطوة الأولى: اختر نوع الاستشارة المناسب لك
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                لكل مسار جلساته واستمارته التشخيصية الموجهة لمساعدتك بأعلى درجات الدقة والخصوصية.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {intakeTracks.map((track) => {
                const isSelected = selectedTrackId === track.id;
                const isEmergency = track.id === 'emergency';

                return (
                  <div
                    key={track.id}
                    onClick={() => setSelectedTrackId(track.id)}
                    className={`cursor-pointer p-5 rounded-2xl border-2 transition-all relative ${
                      isSelected
                        ? isEmergency
                          ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/20'
                          : 'border-[#4E7E76] dark:border-[#5E988E] bg-[#4E7E76]/5 dark:bg-[#5E988E]/10 shadow-md ring-2 ring-[#4E7E76]/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B22] hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? isEmergency
                                ? 'bg-amber-500 text-white'
                                : 'bg-[#4E7E76] text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {renderTrackIcon(track.iconName)}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-slate-900 dark:text-white">
                            {track.title}
                          </h3>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {track.badge}
                          </span>
                        </div>
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

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed min-h-10">
                      {track.desc}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        قيمة الجلسة: <span className="text-[#4E7E76] dark:text-[#5E988E]">{track.defaultFee}</span>
                      </span>
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
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setCurrentStep(2);
                }}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#4E7E76] hover:bg-[#3D645E] text-white font-bold rounded-xl transition shadow-md hover:shadow-lg"
              >
                <span>متابعة للاستمارة التشخيصية</span>
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: GAMIFIED CLINICAL INTAKE QUESTIONS */}
        {currentStep === 2 && currentQuestion && (
          <div className="bg-white dark:bg-[#161B22] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {/* Intake header */}
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

            {/* Question Title & Subtitle */}
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

            {/* Question Body Depending on Type */}
            <div className="pt-2">
              {/* MULTI-SELECT CHIPS */}
              {currentQuestion.type === 'multi-select' && currentQuestion.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        className={`text-right p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${
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
                </div>
              )}

              {/* SINGLE-SELECT CARDS */}
              {currentQuestion.type === 'single-select' && currentQuestion.options && (
                <div className="space-y-3">
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
                </div>
              )}

              {/* TEXTAREA INPUT */}
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
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#4E7E76]" />
                    <span>ملاحظتك تذهب مباشرة وسرياً للمستشار جلال أحمد فقط للاطلاع عليها قبل الجلسة.</span>
                  </p>
                </div>
              )}
            </div>

            {/* Step 2 Navigation Buttons */}
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
                    setCurrentStep(3); // Go to demographics
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

        {/* STEP 3: DEMOGRAPHICS & CONTACT DETAILS */}
        {currentStep === 3 && (
          <div className="bg-white dark:bg-[#161B22] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                الخطوة الثالثة: البيانات الأساسية والتواصل
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                نستخدم رقم الواتساب لإرسال تأكيد الحجز ورابط جلسة Google Meet ومتابعة استفساراتك.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Client Name */}
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

              {/* Phone / WhatsApp */}
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

              {/* Email */}
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

              {/* Age */}
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

              {/* Marital Status */}
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

              {/* City / Country */}
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

            {/* Step 3 Navigation */}
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

        {/* STEP 4: POLICIES & PRIVACY CHARTER (MATCHING "ونفس" REFERENCE) */}
        {currentStep === 4 && (
          <div className="bg-white dark:bg-[#161B22] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#4E7E76]/10 text-[#4E7E76] dark:text-[#5E988E] flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  الخطوة الرابعة: ميثاق السرية والسياسات التنظيمية
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  يرجى قراءة البنود بدقة لضمان جلسة استشارية آمنة وفعالة ومنضبطة للطرفين
                </p>
              </div>
            </div>

            {/* Policies Cards */}
            <div className="space-y-4">
              {/* 1. Confidentiality */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>1. ميثاق السرية التامة والأمانة المهنية</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-6">
                  كل ما يتم طرحه ومشاركته داخل الجلسة من معلومات وأعراض ومشاعر هو سر مهني مطلق، محمي بأعلى معايير الأمانة الأخلاقية والمهنية، ولا يُشارك مع أي طرف ثالث إطلاقاً.
                </p>
              </div>

              {/* 2. Cancellation & Rescheduling */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm mb-1.5">
                  <CalendarClock className="w-4 h-4 text-[#4E7E76]" />
                  <span>2. سياسة الإلغاء وتعديل الموعد</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-6">
                  يحق لك تعديل موعد الجلسة أو تأجيله قبل الموعد بـ <strong>48 ساعة</strong> على الأقل دون أي رسوم إضافية. في حال الإلغاء قبل 48 ساعة يُعاد المبلغ بالكامل.
                </p>
              </div>

              {/* 3. Session Readiness & Late Policy */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm mb-1.5">
                  <Clock className="w-4 h-4 text-[#4E7E76]" />
                  <span>3. الانضباط الفني وبدء الجلسة</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-6">
                  تُعقد الجلسات عبر Google Meet بجودة عالية. يرجى التواجد في مكان هادئ وخاص قبل الموعد بـ 5 دقائق والتأكد من جودة الإنترنت وسماعة الرأس. في حال التأخير لأكثر من 15 دقيقة دون إخطار مسبق، تُحتسب الجلسة حرصاً على مواعيد المستفيدين الآخرين.
                </p>
              </div>
            </div>

            {/* Compulsory Checkbox */}
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

            {/* Step 4 Navigation */}
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
                <span>متابعة لاختيار الموعد</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SCHEDULE PICKER (DATE & TIME) */}
        {currentStep === 5 && (
          <div className="bg-white dark:bg-[#161B22] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                الخطوة الخامسة: حدد اليوم والوقت الأنسب لك
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                جميع المواعيد الموضحة بتوقيت مكة المكرمة والقاهرة.
              </p>
            </div>

            {/* Date Selection Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5">
                1. اختر اليوم المتاح (خلال الأسبوعين القادمين):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 max-h-56 overflow-y-auto p-1">
                {availableDates.map((dateObj) => {
                  const isSelected = selectedDate === dateObj.iso;
                  return (
                    <button
                      type="button"
                      key={dateObj.iso}
                      onClick={() => setSelectedDate(dateObj.iso)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-[#4E7E76] bg-[#4E7E76] text-white font-bold shadow-sm ring-2 ring-[#4E7E76]/20'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs">{dateObj.shortLabel}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5">
                2. اختر التوقيت المناسب:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedTime === slot.id;
                  return (
                    <button
                      type="button"
                      key={slot.id}
                      onClick={() => setSelectedTime(slot.id)}
                      className={`p-3 rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'border-[#4E7E76] bg-[#4E7E76] text-white font-bold shadow-sm ring-2 ring-[#4E7E76]/20'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs">{slot.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#4E7E76]/10 text-[#4E7E76] flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">ملخص الموعد المختار</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {availableDates.find((d) => d.iso === selectedDate)?.label} — {TIME_SLOTS.find((s) => s.id === selectedTime)?.label}
                  </div>
                </div>
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                رسوم الجلسة: <span className="text-[#4E7E76] dark:text-[#5E988E] font-black">{activeTrack.defaultFee}</span>
              </div>
            </div>

            {/* Step 5 Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <ChevronRight className="w-4 h-4" />
                <span>العودة للسياسات</span>
              </button>

              <button
                type="button"
                disabled={!selectedDate || !selectedTime}
                onClick={() => setCurrentStep(6)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#4E7E76] hover:bg-[#3D645E] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                <span>متابعة لوسائل السداد المباشر</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: SMART DIRECT PAYMENT & RECEIPT UPLOAD */}
        {currentStep === 6 && (
          <div className="bg-white dark:bg-[#161B22] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                الخطوة السادسة: السداد المباشر وتأكيد الحجز
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                اختر وسيلة الدفع الأنسب لك وحوّل مباشرة ثم ارفع صورة الإيصال ليتم اعتماد الموعد فوراً.
              </p>
            </div>

            {/* Payment Method Switcher */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* InstaPay */}
              <button
                type="button"
                onClick={() => setPaymentMethod('instapay')}
                className={`p-4 rounded-2xl border-2 text-right transition-all ${
                  paymentMethod === 'instapay'
                    ? 'border-[#4E7E76] bg-[#4E7E76]/10 dark:bg-[#5E988E]/15 ring-2 ring-[#4E7E76]/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  إنستاباي (InstaPay)
                </div>
                <div className="text-xs text-slate-500">تحويل فوري ومباشر داخل مصر</div>
              </button>

              {/* Vodafone Cash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('vodafone')}
                className={`p-4 rounded-2xl border-2 text-right transition-all ${
                  paymentMethod === 'vodafone'
                    ? 'border-red-500 bg-red-50/40 dark:bg-red-950/20 ring-2 ring-red-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  فودافون كاش
                </div>
                <div className="text-xs text-slate-500">محفظة إلكترونية مباشرة</div>
              </button>

              {/* International / Bank */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bank')}
                className={`p-4 rounded-2xl border-2 text-right transition-all ${
                  paymentMethod === 'bank'
                    ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  تحويل بنكي / من الخارج
                </div>
                <div className="text-xs text-slate-500">آيبان البنك الأهلي المصري</div>
              </button>
            </div>

            {/* Payment Details Container */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
              {paymentMethod === 'instapay' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      معرف إنستاباي المعتمد:
                    </span>
                    <a
                      href={settings.instapayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4E7E76] hover:bg-[#3D645E] text-white text-xs font-bold rounded-lg transition"
                    >
                      <span>افتح تطبيق InstaPay للتحويل</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <code className="text-sm font-bold text-slate-800 dark:text-slate-200" dir="ltr">
                      {settings.instapayHandle}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopy(settings.instapayHandle, 'instapay')}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-md transition"
                    >
                      {copiedField === 'instapay' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedField === 'instapay' ? 'تم النسخ!' : 'نسخ'}</span>
                    </button>
                  </div>
                </div>
              )}

              {paymentMethod === 'vodafone' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      رقم محفظة فودافون كاش:
                    </span>
                    <a
                      href={settings.vodafoneCashUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition"
                    >
                      <span>افتح محفظة فودافون كاش</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <code className="text-sm font-bold text-slate-800 dark:text-slate-200" dir="ltr">
                      {settings.vodafoneCashNumber}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopy(settings.vodafoneCashNumber, 'vodafone')}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-md transition"
                    >
                      {copiedField === 'vodafone' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedField === 'vodafone' ? 'تم النسخ!' : 'نسخ'}</span>
                    </button>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      بيانات التحويل البنكي الدولي:
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                    <div>
                      <strong>اسم المستفيد:</strong> {settings.accountHolder}
                    </div>
                    <div>
                      <strong>البنك:</strong> {settings.bankName}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <strong>IBAN:</strong> <span dir="ltr">{settings.internationalIban}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(settings.internationalIban, 'iban')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-md transition"
                      >
                        {copiedField === 'iban' ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedField === 'iban' ? 'تم النسخ' : 'نسخ'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Receipt Section */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  إرفاق لقطة شاشة / صورة إيصال التحويل (مستحسن للتأكيد الفوري):
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition">
                    <Upload className="w-4 h-4 text-[#4E7E76]" />
                    <span>{receiptImage ? 'تغيير صورة الإيصال' : 'رفع صورة الإيصال'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    value={receiptNote}
                    onChange={(e) => setReceiptNote(e.target.value)}
                    placeholder="أو اكتب رقم العملية / اسم المحوّل هنا..."
                    className="flex-1 w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#4E7E76]"
                  />
                </div>

                {/* Receipt Preview */}
                {receiptImage && (
                  <div className="mt-3 p-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                        تم تجهيز صورة الإيصال بنجاح
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReceiptImage('')}
                      className="text-xs text-red-500 hover:text-red-700 font-bold"
                    >
                      حذف
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-400">
                {submitError}
              </div>
            )}

            {/* Step 6 Navigation & Submit */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <ChevronRight className="w-4 h-4" />
                <span>العودة للموعد</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitBooking}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#4E7E76] hover:bg-[#3D645E] disabled:bg-slate-400 text-white text-sm font-bold rounded-xl transition shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>جاري تسجيل وتثبيت حجزك...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>تأكيد تسجيل الحجز الآن</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: CONFIRMATION TICKET & 1-CLICK WHATSAPP DISPATCH */}
        {currentStep === 7 && submittedBooking && (
          <div className="bg-white dark:bg-[#161B22] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="px-3.5 py-1 bg-[#4E7E76]/10 text-[#4E7E76] dark:text-[#5E988E] text-xs font-extrabold rounded-full">
                تم استلام طلب حجزك بنجاح
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                أهلاً بك أستاذ {submittedBooking.clientName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
                تم تسجيل بياناتك التشخيصية والموعد المقترح بنجاح في نظام المواعيد.
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
                <span className="text-slate-500">نوع الجلسة:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {submittedBooking.trackLabel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">الموعد المقترح:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {submittedBooking.slotDate} — الساعة {submittedBooking.slotTime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">حالة الاعتماد:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  قيد مراجعة التحويل وتأكيد الرابط
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
                ضغطة واحدة تفتح محادثة واتساب جاهزة ومجهزة برقم حجزك لتسريع اعتماد الموعد وإرسال رابط الجلسة.
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-4 text-xs font-bold">
              <Link
                href="/"
                className="text-slate-600 dark:text-slate-400 hover:text-[#4E7E76] transition"
              >
                العودة للرئيسية
              </Link>
              <span>•</span>
              <Link
                href="/articles"
                className="text-slate-600 dark:text-slate-400 hover:text-[#4E7E76] transition"
              >
                تصفح المقالات الإرشادية
              </Link>
              <span>•</span>
              <Link
                href="/tests"
                className="text-slate-600 dark:text-slate-400 hover:text-[#4E7E76] transition"
              >
                إجراء المقاييس النفسية
              </Link>
            </div>
          </div>
        )}

      </div>
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
