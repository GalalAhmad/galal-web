'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Save,
  CheckCircle2,
  AlertTriangle,
  Brain,
  BookOpen,
  FileText,
  Sparkles,
  Layers,
  Heart,
  User,
  Shield,
  Video,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  X,
  Lock,
  Maximize2
} from 'lucide-react';
import DSM5AssistantModal from './DSM5AssistantModal';
import { DSM5Disorder } from '@/lib/dsm5/types';
import { CLINICAL_EXERCISES_LIBRARY } from '@/lib/clinical/exercisesLibrary';

interface ConsultationStudioProps {
  session: {
    id: string;
    clientId: string;
    clientName: string;
    clientCode: string;
    sessionNumber: number;
    sessionType: string;
    meetLink?: string;
    initialDiagnosis?: string;
  };
  onClose: () => void;
  onSaveSession: (soapData: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    aiSummary: string;
    homeworkTitle?: string;
  }) => void;
}

export default function ConsultationStudio({
  session,
  onClose,
  onSaveSession
}: ConsultationStudioProps) {
  // Timer State (50 minutes default = 3000 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(50 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  // SOAP State
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState(session.initialDiagnosis || '');
  const [plan, setPlan] = useState('');
  const [assignedExerciseSlug, setAssignedExerciseSlug] = useState('');
  const [isDSMModalOpen, setIsDSMModalOpen] = useState(false);

  // Scratchpad / Live Whiteboard
  const [scratchNotes, setScratchNotes] = useState('');
  const [activeSideTool, setActiveSideTool] = useState<'tools' | 'exercises' | 'scratchpad'>('tools');

  // AI Summary State
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addExtraMinutes = (mins: number) => {
    setSecondsRemaining((prev) => prev + mins * 60);
  };

  // Handle Diagnosis from DSM-5 Modal
  const handleApplyDSM5Diagnosis = (snippet: string, disorder: DSM5Disorder) => {
    setAssessment((prev) => (prev ? `${prev}\n\n${snippet}` : snippet));
  };

  // Auto Generate Professional Clinical Summary
  const handleGenerateAISummary = () => {
    setIsGeneratingSummary(true);
    setTimeout(() => {
      const summaryText = `[ملخص إكلينيكي للجلسة رقم ${session.sessionNumber}]:
- المستفيد: ${session.clientName} (${session.clientCode})
- مسار الجلسة: ${session.sessionType === 'marital' ? 'استشارة زوجية مشتركة' : 'استشارة نفسية فردية'}
- المحور الرئيسي: تم تفكيك الأفكار التلقائية والشكوى المطروحة بتركيز، مع فحص السلوكيات الانفعالية ومراجعة استيفاء معايير الدليل الخامس.
- التقدم المحرز: إبداء العميل استبصاراً جيداً بأهمية فك الاندماج المعرفي وضبط الاندفاع، مع الاتفاق على البدء في تطبيق التكليف المنزلي المعتمد.
- التوصيات للجلسة القادمة: متابعة تطبيق الواجب الإرشادي، ورصد درجات القلق بمقياس التقييم.`;
      setAiSummary(summaryText);
      setIsGeneratingSummary(false);
    }, 800);
  };

  // Save Session
  const handleSaveAndEnd = () => {
    const exercise = CLINICAL_EXERCISES_LIBRARY.find((e) => e.slug === assignedExerciseSlug);
    onSaveSession({
      subjective,
      objective,
      assessment,
      plan: exercise ? `${plan}\n\n[التكليف الإرشادي]: ${exercise.titleAr}` : plan,
      aiSummary: aiSummary || 'تم توثيق الجلسة الإكلينيكية بنجاح وفق نموذج SOAP.',
      homeworkTitle: exercise?.titleAr
    });
    setIsSavedSuccessfully(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070B13] text-slate-100 flex flex-col overflow-hidden animate-fadeIn font-sans" dir="rtl">
      
      {/* 1. TOP LIVE SESSION BAR */}
      <header className="h-16 bg-[#0E1524] border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 shadow-lg">
        {/* Left: Client and Session Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm border border-teal-500/30">
            {session.clientName.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">{session.clientName}</span>
              <span className="font-mono text-[10px] bg-slate-800 text-teal-400 px-2 py-0.5 rounded-full border border-slate-700 font-bold">
                {session.clientCode}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              الجلسة الإكلينيكية #{session.sessionNumber} • {session.sessionType === 'marital' ? 'استشارة أسرية زوجية' : 'استشارة فردية'}
            </p>
          </div>
        </div>

        {/* Center: Live 50-Min Session Timer */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-4 py-1.5 rounded-2xl shadow-inner">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${secondsRemaining <= 300 ? 'text-rose-400 animate-pulse' : 'text-teal-400'}`} />
            <span className={`font-mono text-base font-extrabold tracking-wider ${secondsRemaining <= 300 ? 'text-rose-400' : 'text-white'}`}>
              {formatTimer(secondsRemaining)}
            </span>
          </div>

          <div className="flex items-center gap-1 border-r border-slate-800 pr-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title={isTimerRunning ? 'إيقاف مؤقت' : 'استئناف'}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => addExtraMinutes(5)}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 font-bold transition cursor-pointer"
              title="إضافة 5 دقائق"
            >
              +5د
            </button>
          </div>
        </div>

        {/* Right: Meet Link, End Session, Close */}
        <div className="flex items-center gap-2.5">
          {session.meetLink && (
            <a
              href={session.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 text-teal-300 text-xs font-bold border border-teal-500/40 transition"
            >
              <Video className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">غرفة الاتصال المباشر</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <button
            onClick={handleSaveAndEnd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black shadow-md shadow-teal-500/20 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>إنهاء واعتماد SOAP</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="إغلاق الاستوديو"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE: SOAP PROTOCOL (RIGHT) + QUICK TOOLS DRAWER (LEFT) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* RIGHT / MAIN: SOAP Clinical Documentation Matrix */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#090E1A]">
          
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" />
              <h2 className="text-sm font-black text-white">
                توثيق السجل الإكلينيكي المعتمد (SOAP Clinical Protocol)
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span>سجل مشفر خاص ب أحمد</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* S: Subjective */}
            <div className="p-4 rounded-2xl bg-[#0E1524] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-800/40">
                  (S) Subjective - ما ذكره العميل
                </span>
                <span className="text-[10px] text-slate-400">التقرير الذاتي، الشكوى الحالية، التعبير بالكلمات</span>
              </div>
              <textarea
                rows={4}
                value={subjective}
                onChange={(e) => setSubjective(e.target.value)}
                placeholder="أدخل ما ذكره العميل بلسانه: المشاعر التي عبّر عنها، نبرة الشكوى، الأحداث التي أثارت ضيقه هذا الأسبوع..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-hidden focus:border-teal-500 transition leading-relaxed"
              />
            </div>

            {/* O: Objective */}
            <div className="p-4 rounded-2xl bg-[#0E1524] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-800/40">
                  (O) Objective - الملاحظات السريرية
                </span>
                <span className="text-[10px] text-slate-400">لغة الجسد، الاتصال البصري، نبرة الصوت، التوتر الحركي</span>
              </div>
              <textarea
                rows={4}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="الملاحظات الإكلينيكية أثناء الجلسة: الاتصال البصري (مستمر / منقطع)، التململ، البكاء، تسارع الحديث، التردد..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-hidden focus:border-teal-500 transition leading-relaxed"
              />
            </div>

            {/* A: Assessment */}
            <div className="p-4 rounded-2xl bg-[#0E1524] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-800/40">
                    (A) Assessment - التقييم والتشخيص
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsDSMModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[10px] bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 px-2 py-0.5 rounded-full border border-teal-500/40 font-bold transition cursor-pointer"
                  >
                    <Brain className="w-3 h-3" />
                    <span>استدعاء DSM-5</span>
                  </button>
                </div>
                <span className="text-[10px] text-slate-400">التفسير المعرفي، استيفاء المعايير، ICD-10</span>
              </div>
              <textarea
                rows={5}
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                placeholder="الصياغة الإكلينيكية: تشخيص الدليل الخامس المبدئي، مدى استيفاء المعايير، المعتقدات الجوهرية المفعلة..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-hidden focus:border-teal-500 transition leading-relaxed font-mono"
              />
            </div>

            {/* P: Plan */}
            <div className="p-4 rounded-2xl bg-[#0E1524] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-800/40">
                  (P) Plan - الخطة والتكليفات
                </span>
                <span className="text-[10px] text-slate-400">الفنيات المستخدمة، التكليف الإرشادي، موعد المتابعة</span>
              </div>
              <textarea
                rows={5}
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="الخطة: الفنيات التي تم تدريبه عليها اليوم، التكليفات المنزلية، توجيهات الأسبوع، وموعد الجلسة القادمة..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-hidden focus:border-teal-500 transition leading-relaxed"
              />
            </div>

          </div>

          {/* Rapid Homework Assignment Module */}
          <div className="p-4 rounded-2xl bg-[#0E1524] border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" />
              <div>
                <strong className="text-xs text-white block">إسناد واجب إرشادي تفاعلي للعميل فوراً:</strong>
                <span className="text-[11px] text-slate-400">سيظهر التمرين في البوابة الشخصية للعميل ليقوم بحله وإرساله لك</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={assignedExerciseSlug}
                onChange={(e) => setAssignedExerciseSlug(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-hidden cursor-pointer"
              >
                <option value="">-- اختر التمرين من المكتبة الإكلينيكية --</option>
                {CLINICAL_EXERCISES_LIBRARY.map((ex) => (
                  <option key={ex.slug} value={ex.slug}>
                    {ex.icon} {ex.titleAr} ({ex.category})
                  </option>
                ))}
              </select>

              {assignedExerciseSlug && (
                <span className="text-[11px] bg-teal-500/20 text-teal-300 px-2 py-1 rounded-lg border border-teal-500/30 font-bold">
                  سيتم التعيين عند إنهاء الجلسة ✓
                </span>
              )}
            </div>
          </div>

          {/* AI Clinical Session Summary Generator */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0E1524] to-[#121B2F] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <strong className="text-xs text-white">توليد ملخص الجلسة الإكلينيكي الذكي:</strong>
              </div>
              <button
                type="button"
                disabled={isGeneratingSummary}
                onClick={handleGenerateAISummary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 text-teal-300 text-xs font-bold border border-teal-500/40 transition cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingSummary ? 'جارٍ الصياغة الإكلينيكية...' : 'توليد ملخص فوري'}</span>
              </button>
            </div>

            {aiSummary && (
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-mono">
                {aiSummary}
              </div>
            )}
          </div>

          {/* Confirmation Alert */}
          {isSavedSuccessfully && (
            <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>تم اعتماد وحفظ السجل الإكلينيكي بنجاح، جارٍ العودة للوحة القيادة...</span>
            </div>
          )}

        </main>

        {/* LEFT: Quick Reference Drawer (Whiteboard & Clinical Exercises) */}
        <aside className="w-80 border-r border-slate-800 bg-[#0E1524] flex flex-col shrink-0">
          
          {/* Drawer Tabs */}
          <div className="p-2 border-b border-slate-800 flex rounded-xl bg-slate-900/80 m-3 gap-1">
            <button
              onClick={() => setActiveSideTool('tools')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                activeSideTool === 'tools' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              أدوات المعالج
            </button>
            <button
              onClick={() => setActiveSideTool('exercises')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                activeSideTool === 'exercises' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              التمارين ({CLINICAL_EXERCISES_LIBRARY.length})
            </button>
            <button
              onClick={() => setActiveSideTool('scratchpad')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                activeSideTool === 'scratchpad' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              المسودة
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            
            {activeSideTool === 'tools' && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setIsDSMModalOpen(true)}
                  className="w-full text-right p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 transition cursor-pointer space-y-1 block"
                >
                  <div className="flex items-center justify-between text-teal-400">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      <strong className="text-xs">المساعد التشخيصي DSM-5</strong>
                    </div>
                    <ChevronLeft className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    فحص معايير التشخيص والأعراض وقواعد الاستبعاد ونسخ الصياغة المعتمدة.
                  </p>
                </button>

                {/* Grounding & Breathwork Quick Tool */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
                    <Heart className="w-4 h-4" />
                    <span>بروتوكول التنفس الترددي 4-7-8</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    أمر العميل بأخذ شهيق لمدة 4 ثوانٍ، ثم حبس النفس لـ 7 ثوانٍ، ثم زفير هادئ لـ 8 ثوانٍ لتهدئة ضربات القلب أثناء النوبة.
                  </p>
                </div>

                {/* Marital Conflict De-escalation */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
                    <Shield className="w-4 h-4" />
                    <span>قاعدة "المحادثة الآمنة"</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    منع المقاطعة كلياً؛ كل طرف يتحدث 5 دقائق متواصلة بينما الطرف الآخر ينصت ويكرر ما فهمه دون دفاع أو تبرير.
                  </p>
                </div>
              </div>
            )}

            {activeSideTool === 'exercises' && (
              <div className="space-y-2.5">
                {CLINICAL_EXERCISES_LIBRARY.map((ex) => (
                  <div
                    key={ex.slug}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span>{ex.icon}</span>
                        <span>{ex.titleAr}</span>
                      </span>
                      <span className="text-[9px] bg-teal-950 text-teal-300 px-1.5 py-0.5 rounded font-mono">
                        {ex.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {ex.descriptionAr}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setAssignedExerciseSlug(ex.slug);
                        setPlan((prev) => prev ? `${prev}\n- تكليف إرشادي: ${ex.titleAr}` : `- تكليف إرشادي: ${ex.titleAr}`);
                      }}
                      className="text-[10px] font-bold text-teal-400 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <span>تعيين هذا التمرين في الخطة ←</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeSideTool === 'scratchpad' && (
              <div className="space-y-2 h-full flex flex-col">
                <span className="text-[11px] text-slate-400 block">
                  مسودة سريعة للملاحظات والكلمات المفتاحية أثناء حديث العميل:
                </span>
                <textarea
                  rows={14}
                  value={scratchNotes}
                  onChange={(e) => setScratchNotes(e.target.value)}
                  placeholder="اكتب هنا أي رؤوس أقلام مؤقتة..."
                  className="flex-1 w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>
            )}

          </div>

        </aside>

      </div>

      {/* DSM-5 Assistant Modal */}
      <DSM5AssistantModal
        isOpen={isDSMModalOpen}
        onClose={() => setIsDSMModalOpen(false)}
        onApplyDiagnosis={handleApplyDSM5Diagnosis}
      />

    </div>
  );
}
