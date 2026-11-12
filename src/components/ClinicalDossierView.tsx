'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Video,
  BookOpen,
  Brain,
  CheckCircle2,
  Check,
  ExternalLink,
  Lock,
  Plus,
  Trash2,
  Key,
  MessageSquare,
  Send,
  Activity,
  Smile,
  FileText,
  Sparkles,
  MapPin,
  Heart,
  ShieldCheck,
  AlertCircle,
  X,
  RefreshCw,
  Flame,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { articlesData } from '@/data/articles';
import { getQuestionAndAnswerLabels } from '@/data/intakeQuestions';
import ClinicalProgressCharts from '@/components/ClinicalProgressCharts';
import UnifiedClientTimeline from '@/components/UnifiedClientTimeline';

interface ClinicalDossierViewProps {
  client: any;
  matchedBookings: any[];
  clinicalExercises: { id: string; title: string; link: string }[];
  onSaveNotes: (clientId: string, notes: string) => Promise<void>;
  onAddHomework: (clientId: string, homeworkData: { title: string; link?: string }) => Promise<void>;
  onRemoveHomework: (clientId: string, homeworkId: string) => Promise<void>;
  onResetPassword: (client: any) => Promise<void>;
}

export default function ClinicalDossierView({
  client,
  matchedBookings,
  clinicalExercises,
  onSaveNotes,
  onAddHomework,
  onRemoveHomework,
  onResetPassword,
}: ClinicalDossierViewProps) {
  // Active inner dossier tab
  const [activeDossierTab, setActiveDossierTab] = useState<
    'overview' | 'sessions' | 'psychometrics' | 'homework' | 'wellbeing' | 'journal'
  >('overview');

  // Notes state
  const [notesInput, setNotesInput] = useState(client.clinicalNotes || '');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false);

  // Homework inputs
  const [newHwExercise, setNewHwExercise] = useState('');
  const [newHwArticle, setNewHwArticle] = useState('');
  const [newHwCustomTitle, setNewHwCustomTitle] = useState('');
  const [addingHw, setAddingHw] = useState(false);

  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailActionUrl, setEmailActionUrl] = useState('/profile');
  const [emailActionText, setEmailActionText] = useState('الانتقال إلى ملفك في المنصة');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSentResult, setEmailSentResult] = useState<{ success: boolean; msg: string } | null>(null);

  // Live Wellbeing & Journal streams for this client
  const [wellbeingData, setWellbeingData] = useState<{ logs: any[]; today: any | null }>({ logs: [], today: null });
  const [loadingWellbeing, setLoadingWellbeing] = useState(false);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [loadingJournal, setLoadingJournal] = useState(false);

  const cleanClientPhone = (client.phone || '').replace(/[^\d]/g, '');

  // Fetch Wellbeing & Journal data whenever client is loaded or tab changes
  useEffect(() => {
    const fetchClinicalStreams = async () => {
      const qPhone = encodeURIComponent(cleanClientPhone);
      const qEmail = encodeURIComponent(client.email || '');

      if (!qPhone && !qEmail) return;

      // 1. Fetch Wellbeing Stream
      setLoadingWellbeing(true);
      try {
        const wbRes = await fetch(`/api/user/wellbeing?phone=${qPhone}&email=${qEmail}`);
        const wbJson = await wbRes.json();
        if (wbJson.logs) {
          setWellbeingData({ logs: wbJson.logs, today: wbJson.today });
        }
      } catch (err) {
        console.error('Error fetching clinical wellbeing:', err);
      } finally {
        setLoadingWellbeing(false);
      }

      // 2. Fetch Client Journal Stream
      setLoadingJournal(true);
      try {
        const jRes = await fetch(`/api/user/journal?phone=${qPhone}&email=${qEmail}&admin=true`);
        const jJson = await jRes.json();
        if (jJson.entries) {
          setJournalEntries(jJson.entries);
        }
      } catch (err) {
        console.error('Error fetching clinical journal:', err);
      } finally {
        setLoadingJournal(false);
      }
    };

    fetchClinicalStreams();
  }, [client.id, client.phone, client.email]);

  // Handle Save Notes
  const handleSaveNotesClick = async () => {
    setSavingNotes(true);
    try {
      await onSaveNotes(client.id, notesInput);
      setNotesSavedSuccess(true);
      setTimeout(() => setNotesSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNotes(false);
    }
  };

  // Handle Add Homework
  const handleAssignHomework = async () => {
    let title = newHwCustomTitle.trim();
    let link = '';

    if (newHwExercise) {
      const ex = clinicalExercises.find((e) => e.id === newHwExercise);
      if (ex) {
        title = ex.title;
        link = ex.link;
      }
    } else if (newHwArticle) {
      const art = articlesData.find((a) => a.id === newHwArticle);
      if (art) {
        title = `قراءة علاجية: ${art.title}`;
        link = `/articles/${art.id}`;
      }
    }

    if (!title) return;

    setAddingHw(true);
    try {
      await onAddHomework(client.id, { title, link });
      setNewHwExercise('');
      setNewHwArticle('');
      setNewHwCustomTitle('');
    } catch (err) {
      console.error(err);
    } finally {
      setAddingHw(false);
    }
  };

  // Handle Dispatch Email to Client
  const handleSendClientEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.email || !emailSubject || !emailMessage) return;

    setSendingEmail(true);
    setEmailSentResult(null);

    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: client.email,
          clientName: client.name || 'المستفيد الفاضل',
          subject: emailSubject,
          message: emailMessage,
          actionUrl: emailActionUrl,
          actionText: emailActionText,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEmailSentResult({ success: true, msg: 'تم تسليم الرسالة بنجاح عبر البريد الرسمي appointments@galalahmad.com' });
        setTimeout(() => {
          setShowEmailModal(false);
          setEmailSubject('');
          setEmailMessage('');
          setEmailSentResult(null);
        }, 2500);
      } else {
        setEmailSentResult({ success: false, msg: data.error || 'تعذر إرسال الرسالة البريدية' });
      }
    } catch (err: any) {
      setEmailSentResult({ success: false, msg: err?.message || 'خطأ في الاتصال بالخادم' });
    } finally {
      setSendingEmail(false);
    }
  };

  // Gather Intake summary details from the latest booking
  const latestBooking = matchedBookings[0] || null;
  const intakeDetails: { question: string; answer: string }[] = [];
  if (latestBooking?.answers && typeof latestBooking.answers === 'object') {
    const trackId = latestBooking.consultationType || latestBooking.trackId;
    Object.entries(latestBooking.answers).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        const { questionTitle, formattedAnswer } = getQuestionAndAnswerLabels(trackId, key, val);
        const ansStr = Array.isArray(formattedAnswer) ? formattedAnswer.join('، ') : String(formattedAnswer);
        if (ansStr.trim()) {
          intakeDetails.push({ question: questionTitle, answer: ansStr });
        }
      }
    });
  }

  const testCount = Array.isArray(client.testResults) ? client.testResults.length : 0;
  const hwCount = Array.isArray(client.homework) ? client.homework.length : 0;
  const confirmedSessions = matchedBookings.filter((b) => b.status === 'confirmed').length;

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0A0F1D] text-white overflow-hidden shadow-2xl space-y-0 text-right animate-fadeIn">
      {/* 1. TOP DEMOGRAPHIC & IDENTITY BANNER */}
      <div className="p-6 bg-linear-to-r from-[#0F1D38] via-[#0E1726] to-[#0A0F1D] border-b border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#154F9C] to-[#4E7E76] text-white font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
            {(client.name || 'م').charAt(0)}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-black text-white">{client.name}</h3>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 font-mono">
                {client.id}
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>ملف إكلينيكي معتمد</span>
              </span>
            </div>

            {/* Demographics Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              {client.phone && (
                <span dir="ltr" className="flex items-center gap-1 font-mono text-cyan-300">
                  <Phone className="w-3.5 h-3.5 text-[#154F9C]" />
                  <span>{client.phone}</span>
                </span>
              )}
              {client.email && (
                <span dir="ltr" className="flex items-center gap-1 font-mono text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-[#4E7E76]" />
                  <span>{client.email}</span>
                </span>
              )}
              {client.city && (
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{client.city}</span>
                </span>
              )}
              {client.maritalStatus && client.maritalStatus !== 'غير محدد' && (
                <span className="flex items-center gap-1 text-slate-300">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>{client.maritalStatus}</span>
                </span>
              )}
              {client.ageGroup && (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                  العمر: {client.ageGroup}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {client.email && (
            <button
              type="button"
              onClick={() => {
                setShowEmailModal(true);
                setEmailSubject(`متابعة استشارية | د. جلال أحمد`);
                setEmailSentResult(null);
              }}
              className="px-4 py-2 rounded-xl bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#154F9C]/20 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>مراسلة بريدية</span>
            </button>
          )}

          {cleanClientPhone && (
            <a
              href={`https://wa.me/${cleanClientPhone}?text=${encodeURIComponent(`السلام عليكم أ. ${client.name}، معك د. جلال أحمد بخصوص متابعة جلستك الاستشارية.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>محادثة واتساب</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => onResetPassword(client)}
            className="px-3.5 py-2 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 hover:bg-amber-900/60 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="إعادة تعيين كلمة المرور وإرسالها للحالة"
          >
            <Key className="w-3.5 h-3.5" />
            <span>ضبط الباسورد</span>
          </button>
        </div>
      </div>

      {/* 2. DOSSIER NAVIGATION TABS */}
      <div className="px-6 pt-3 bg-[#0A0F1D] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: 'استمارة الدخول والملخص', icon: FileText, count: intakeDetails.length },
          { id: 'sessions', label: 'سجل الجلسات والملاحظات', icon: Calendar, count: matchedBookings.length },
          { id: 'psychometrics', label: 'المقاييس النفسية ومسار التطور', icon: Brain, count: testCount },
          { id: 'homework', label: 'الخطة الإرشادية والواجبات', icon: BookOpen, count: hwCount },
          { id: 'wellbeing', label: 'متتبع المزاج والعادات اليومي', icon: Activity, count: wellbeingData.logs.length },
          { id: 'journal', label: 'مفكرة الخواطر والمصارحات المشتركة', icon: MessageSquare, count: journalEntries.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDossierTab === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveDossierTab(tab.id as any)}
              className={`py-3 px-4 rounded-t-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 border-b-2 ${
                isActive
                  ? 'border-[#4E7E76] text-white bg-slate-900/80 font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#4E7E76]' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT REGION */}
      <div className="p-6 space-y-6">
        
        {/* TAB 1: INTAKE & OVERVIEW */}
        {activeDossierTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">الجلسات المعتمدة:</span>
                <span className="text-2xl font-black text-emerald-400">{confirmedSessions}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">من أصل {matchedBookings.length} طلب</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">المقاييس المكتملة:</span>
                <span className="text-2xl font-black text-cyan-400">{testCount}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">تقييم سريري</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">التكليفات الإرشادية:</span>
                <span className="text-2xl font-black text-amber-400">{hwCount}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">واجبات وقراءات</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">أيام الانتظام اليومي:</span>
                <span className="text-2xl font-black text-[#4E7E76]">{wellbeingData.logs.length}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">يوم موثق بالسكينة</span>
              </div>
            </div>

            {/* Intake Survey Breakdown */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#154F9C]" />
                  <span>بيانات استمارة التقييم والشكوى الأولية (Intake Form)</span>
                </h4>
                {latestBooking && (
                  <span className="text-[11px] font-mono text-slate-400">
                    رقم الحجز: {latestBooking.id}
                  </span>
                )}
              </div>

              {intakeDetails.length === 0 ? (
                <p className="text-xs text-slate-500 py-3">
                  لم يسجل المستفيد إجابات تفصيلية في استمارة الحجز الأخيرة، أو تم التسجيل كحجز مباشر.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {intakeDetails.map((pill, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block">{pill.question}</span>
                      <strong className="text-xs text-slate-200 block">{pill.answer}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Unified Client Activity Timeline */}
            <div className="pt-2">
              <UnifiedClientTimeline
                bookings={matchedBookings}
                testResults={client.testResults || []}
                homework={client.homework}
                courses={client.courses}
                clinicalNotes={client.clinicalNotes}
                isCounselor={true}
              />
            </div>
          </div>
        )}

        {/* TAB 2: SESSIONS & PROGRESS NOTES */}
        {activeDossierTab === 'sessions' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Confidential Counselor Progress Notes Box */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-rose-400" />
                  <span>الملاحظات السريرية السرية للمعالج (خاصة بد. جلال فقط):</span>
                </h4>
                {notesSavedSuccess && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold animate-fadeIn">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تم حفظ الملاحظات في قاعدة البيانات ✓</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                دوّن هنا انطباعاتك الإكلينيكية، الأهداف السلوكية، التوصيات الطبية والنفسية، ومسار الجلسات القادمة:
              </p>

              <textarea
                rows={5}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="مثال: الجلسة 1: تم استعراض القلق الاجتماعي، الاتفاق على تمرين التعرض التدريجي ومراقبة الأفكار التلقائية..."
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#154F9C] leading-relaxed"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotesClick}
                  disabled={savingNotes}
                  className="px-6 py-2.5 rounded-xl bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{savingNotes ? 'جارٍ الحفظ...' : 'حفظ الملاحظات الإكلينيكية'}</span>
                </button>
              </div>
            </div>

            {/* Sessions Chronology Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-emerald-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>سجل الجلسات وتاريخ المواعيد ({matchedBookings.length}):</span>
              </h4>

              {matchedBookings.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-500 text-xs">
                  لا توجد جلسات مسجلة لهذه الحالة حتى الآن.
                </div>
              ) : (
                <div className="space-y-2.5">
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
                          <strong className="text-white text-sm">{b.trackLabel}</strong>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            b.status === 'confirmed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {b.status === 'confirmed' ? 'جلسة مؤكدة ومعتمدة ✓' : 'بانتظار التحقق من الإيصال'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                          <span>التاريخ: <strong className="text-white font-mono">{b.slotDate}</strong></span>
                          <span>الوقت: <strong className="text-white">{b.slotTime}</strong></span>
                          <span>الرسوم: <strong className="text-slate-300">{b.fee || '250 ر.س'}</strong> ({b.paymentMethod})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {b.meetLink && (
                          <a
                            href={b.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-300 hover:bg-cyan-900/60 transition font-bold flex items-center gap-1.5"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>دخول Google Meet</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PSYCHOMETRIC ASSESSMENTS */}
        {activeDossierTab === 'psychometrics' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Visual Recharts Progress Metric */}
            {testCount > 0 && (
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
                <ClinicalProgressCharts
                  testResults={client.testResults || []}
                  homework={client.homework || []}
                />
              </div>
            )}

            {/* Test Cards List */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-cyan-400 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                <span>نتائج المقاييس والاختبارات النفسية المفصلة ({testCount}):</span>
              </h4>

              {testCount === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-500 text-xs">
                  لم يجرِ المستفيد أي مقياس نفسي حتى الآن.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {client.testResults.map((tr: any, idx: number) => (
                    <div
                      key={tr.id || idx}
                      className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs text-right"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <strong className="font-extrabold text-white text-sm">
                          {tr.testTitle}
                        </strong>
                        <span className="font-mono text-cyan-400 font-black text-sm">
                          {tr.scorePercent || tr.score}%
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 font-bold">
                          المستوى: {tr.level}
                        </span>
                        <span>•</span>
                        <span>{tr.date || 'مؤخراً'}</span>
                      </div>

                      {tr.description && (
                        <p className="text-slate-300 leading-relaxed text-xs">
                          {tr.description}
                        </p>
                      )}

                      {tr.recommendation && (
                        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/50 text-[11px] text-amber-200">
                          <strong>التوجيه الإرشادي:</strong> {tr.recommendation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: HOMEWORK & BEHAVIORAL PLAN */}
        {activeDossierTab === 'homework' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Add New Homework Tool */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h4 className="text-xs font-black text-amber-400 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>إسناد تكليف أو قراءة إرشادية جديدة للمستفيد:</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 font-bold mb-1.5">
                    1. اختيار تمرين مقنن من مكتبة التمارين:
                  </label>
                  <select
                    value={newHwExercise}
                    onChange={(e) => {
                      setNewHwExercise(e.target.value);
                      if (e.target.value) {
                        setNewHwArticle('');
                        setNewHwCustomTitle('');
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="">-- اختر من مكتبة التمارين الإرشادية --</option>
                    {clinicalExercises.map((ex) => (
                      <option key={ex.id} value={ex.id}>{ex.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-bold mb-1.5">
                    2. أو تكليف بقراءة مقال علاجي من الموقع:
                  </label>
                  <select
                    value={newHwArticle}
                    onChange={(e) => {
                      setNewHwArticle(e.target.value);
                      if (e.target.value) {
                        setNewHwExercise('');
                        setNewHwCustomTitle('');
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="">-- اختر مقالاً للتكليف --</option>
                    {articlesData.map((a) => (
                      <option key={a.id} value={a.id}>{a.title}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-300 font-bold mb-1.5">
                    3. أو كتابة عنوان تمرين مخصص لحالة المستفيد:
                  </label>
                  <input
                    type="text"
                    value={newHwCustomTitle}
                    onChange={(e) => {
                      setNewHwCustomTitle(e.target.value);
                      if (e.target.value) {
                        setNewHwExercise('');
                        setNewHwArticle('');
                      }
                    }}
                    placeholder="مثال: رصد الأفكار التلقائية عند التوتر وكتابة 3 أفكار بديلة مرنة..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAssignHomework}
                disabled={addingHw || (!newHwExercise && !newHwArticle && !newHwCustomTitle.trim())}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{addingHw ? 'جارٍ الإسناد...' : 'إسناد التكليف وإرسال إشعار بريدي للمستفيد'}</span>
              </button>
            </div>

            {/* Existing Assigned Homework List */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>التكليفات الحالية والواجبات المنجزة ({hwCount}):</span>
              </h4>

              {hwCount === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-500 text-xs">
                  لا توجد تكليفات مسندة لهذه الحالة حالياً.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {client.homework.map((hw: any, idx: number) => (
                    <div
                      key={hw.id || idx}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            hw.completed || hw.status === 'completed'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {hw.completed || hw.status === 'completed' ? 'تم إنجازه ✓' : 'قيد المتابعة والتنفيذ'}
                          </span>
                          <strong className="text-white text-sm">{hw.title}</strong>
                        </div>
                        {hw.assignedAt && (
                          <span className="text-[10px] text-slate-400 block">تاريخ الإسناد: {hw.assignedAt}</span>
                        )}
                        {hw.clientNotes && (
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px] mt-1">
                            <strong className="text-cyan-400 block mb-0.5">ملاحظات المستفيد على التمرين:</strong>
                            <p>{hw.clientNotes}</p>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveHomework(client.id, hw.id)}
                        className="text-rose-400 hover:text-rose-300 p-2 rounded-xl bg-rose-950/30 border border-rose-900/40 transition cursor-pointer self-end md:self-center"
                        title="حذف التكليف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: LIVE WELLBEING & MOOD STREAM */}
        {activeDossierTab === 'wellbeing' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-linear-to-r from-[#4E7E76]/10 to-[#154F9C]/10 border border-[#4E7E76]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
                  <span>سجل المزاج والسكينة اليومي للحالة</span>
                </h4>
                <p className="text-xs text-slate-300">
                  يعرض ما يسجله المستفيد يومياً في متتبع السكينة والعادات من ملفه الشخصي لمراقبة الاستقرار الشعوري.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 text-xs font-bold text-slate-200">
                <span>أيام التوثيق:</span>
                <span className="text-lg font-black text-[#4E7E76]">{wellbeingData.logs.length}</span>
              </div>
            </div>

            {loadingWellbeing ? (
              <div className="p-8 text-center text-xs text-slate-500">جارٍ تحميل سجل المزاج...</div>
            ) : wellbeingData.logs.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-500 text-xs">
                لم يقم المستفيد بتسجيل أي تدوين في متتبع المزاج والعادات حتى الآن.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {wellbeingData.logs.map((log: any) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-400">{log.date}</span>
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span>{log.moodLabel}</span>
                        <span className="text-lg">{log.moodScore >= 4 ? '😊' : log.moodScore === 3 ? '😐' : '😟'}</span>
                      </span>
                    </div>

                    <div className="pt-1 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>العادات المنجزة:</span>
                      <strong className="text-emerald-400">{Array.isArray(log.habits) ? log.habits.length : 0} عادات</strong>
                    </div>

                    {log.note && (
                      <p className="text-[11px] text-slate-300 leading-relaxed pt-1 border-t border-slate-800/60">
                        {log.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SHARED CLIENT JOURNAL */}
        {activeDossierTab === 'journal' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-linear-to-r from-cyan-500/10 to-[#154F9C]/10 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  <span>مفكرة الخواطر والمصارحات المشتركة من الحالة</span>
                </h4>
                <p className="text-xs text-slate-300">
                  الرسائل والخواطر التي دونتها الحالة في ملفها واختارت مشاركتها معك للاطلاع عليها ومناقشتها.
                </p>
              </div>
            </div>

            {loadingJournal ? (
              <div className="p-8 text-center text-xs text-slate-500">جارٍ تحميل مفكرة الخواطر...</div>
            ) : journalEntries.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-500 text-xs">
                لم تشارك الحالة أي خواطر أو رسائل إرشادية حتى الآن.
              </div>
            ) : (
              <div className="space-y-3">
                {journalEntries.map((entry) => (
                  <div key={entry.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-right">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-white">{entry.title}</strong>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {entry.moodTag || 'ملاحظة'}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">
                        {new Date(entry.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* 4. MODAL: COMPOSE DIRECT CLIENT EMAIL */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0E1524] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 text-right shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#154F9C]" />
                <span>إرسال رسالة رسمية للعميل ({client.name})</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              يتم إرسال الرسالة عبر النطاق المعتمد <strong className="text-cyan-400 font-mono">appointments@galalahmad.com</strong> بهوية المنصة الرسمية ورقم الواتساب.
            </p>

            {emailSentResult && (
              <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                emailSentResult.success
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-800 text-rose-300'
              }`}>
                {emailSentResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{emailSentResult.msg}</span>
              </div>
            )}

            <form onSubmit={handleSendClientEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">المستقبل:</label>
                <input
                  type="text"
                  disabled
                  value={`${client.name} <${client.email}>`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">موضوع الرسالة:</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="مثال: متابعة جلسة أمس، أو توجيه إرشادي بخصوص الواجب..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">نص الرسالة:</label>
                <textarea
                  required
                  rows={5}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="اكتب رسالتك للمستفيد هنا..."
                  className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail || !emailSubject || !emailMessage}
                  className="px-6 py-2.5 rounded-xl bg-[#154F9C] hover:bg-[#103D7A] disabled:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingEmail ? 'جارٍ الإرسال...' : 'إرسال الرسالة الآن'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
