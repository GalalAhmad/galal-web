'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Brain, 
  BookOpen, 
  GraduationCap, 
  Lock, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Video, 
  AlertCircle,
  ChevronDown,
  Filter,
  Send,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export interface TimelineEvent {
  id: string;
  type: 'booking' | 'assessment' | 'homework' | 'course' | 'clinical_note';
  date: string;
  timestamp: number;
  title: string;
  subtitle?: string;
  status?: string;
  data: any;
}

interface UnifiedClientTimelineProps {
  bookings?: any[];
  testResults?: any[];
  homework?: any[];
  courses?: any[];
  clinicalNotes?: string;
  isCounselor?: boolean;
  onUpdateHomeworkStatus?: (hwId: string, newStatus: string, clientNotes?: string) => Promise<void>;
}

export default function UnifiedClientTimeline({
  bookings = [],
  testResults = [],
  homework = [],
  courses = [],
  clinicalNotes,
  isCounselor = false,
  onUpdateHomeworkStatus,
}: UnifiedClientTimelineProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [answeringHwId, setAnsweringHwId] = useState<string | null>(null);
  const [clientResponseText, setClientResponseText] = useState<string>('');
  const [submittingNote, setSubmittingNote] = useState<boolean>(false);

  // 1. Build unified chronological list of events
  const events: TimelineEvent[] = [];

  // Add Bookings
  for (const b of bookings) {
    if (!b.slotDate) continue;
    events.push({
      id: `bk-${b.id}`,
      type: 'booking',
      date: b.slotDate,
      timestamp: new Date(b.slotDate + (b.slotTime ? ` ${b.slotTime.slice(0, 5)}` : '')).getTime() || Date.now(),
      title: `جلسة: ${b.trackLabel || 'استشارة خاصة'}`,
      subtitle: `التوقيت: ${b.slotTime || 'محدد مسبقاً'}`,
      status: b.status,
      data: b,
    });
  }

  // Add Assessments / Tests
  for (const t of testResults) {
    const d = t.created_at || t.timestamp || new Date().toISOString();
    events.push({
      id: `tr-${t.id || Math.random()}`,
      type: 'assessment',
      date: new Date(d).toISOString().split('T')[0],
      timestamp: new Date(d).getTime(),
      title: `مقياس: ${t.testTitle || t.test_title || 'تقييم نفسي'}`,
      subtitle: `النتيجة: ${t.level || 'مستوفى'} (${t.score || t.score_percent || 0} نقطة)`,
      status: 'completed',
      data: t,
    });
  }

  // Add Homework / Clinical Exercises
  for (const h of homework) {
    const d = h.assignedAt || new Date().toISOString().split('T')[0];
    events.push({
      id: `hw-${h.id}`,
      type: 'homework',
      date: d,
      timestamp: new Date(d).getTime(),
      title: `تمرين إرشادي: ${h.title}`,
      subtitle: h.status ? `الحالة: ${getHomeworkStatusLabel(h.status)}` : (h.completed ? 'مكتمل ✓' : 'بانتظار الإنجاز'),
      status: h.status || (h.completed ? 'completed' : 'assigned'),
      data: h,
    });
  }

  // Add Courses
  for (const c of courses) {
    const d = c.enrolledAt || new Date().toISOString().split('T')[0];
    events.push({
      id: `crs-${c.id}`,
      type: 'course',
      date: d,
      timestamp: new Date(d).getTime(),
      title: `انضمام لبرنامج: ${c.title}`,
      subtitle: `الدفعة: ${c.batchDate || 'الدفعة الحالية'}`,
      status: 'active',
      data: c,
    });
  }

  // Add Counselor Note (Counselor view only)
  if (isCounselor && clinicalNotes && clinicalNotes.trim().length > 0) {
    events.push({
      id: 'counselor-notes-event',
      type: 'clinical_note',
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      title: 'ملاحظة سرية للمستشار (سجل الحالة السريري)',
      subtitle: 'خاص بالمختص فقط ولا يظهر للمستفيد',
      status: 'confidential',
      data: { notes: clinicalNotes },
    });
  }

  // Sort descending by date
  events.sort((a, b) => b.timestamp - a.timestamp);

  // Filter
  const filteredEvents = filterType === 'all' 
    ? events 
    : events.filter(e => e.type === filterType);

  function getHomeworkStatusLabel(status: string) {
    switch (status) {
      case 'assigned': return 'مُسند من المستشار';
      case 'in_progress': return 'قيد التنفيذ والمتابعة';
      case 'submitted': return 'تم إرسال إجابة العميل';
      case 'completed': return 'مكتمل ومعتمد ✓';
      default: return 'بانتظار الإنجاز';
    }
  }

  function getBookingStatusBadge(status?: string) {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">جلسة مؤكدة ✓</span>;
      case 'pending_verification':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">قيد التدقيق</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">انتهت الجلسة</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold">ملغية</span>;
      default:
        return null;
    }
  }

  return (
    <div className="space-y-6 text-right">
      
      {/* Timeline Controls & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#4E7E76]" />
          <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
            السجل الزمني الموحد للأنشطة والمسار الإرشادي (Timeline)
          </h4>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
          {[
            { id: 'all', label: `الكل (${events.length})` },
            { id: 'booking', label: `الجلسات (${events.filter(e => e.type === 'booking').length})` },
            { id: 'homework', label: `الواجبات (${events.filter(e => e.type === 'homework').length})` },
            { id: 'assessment', label: `المقاييس (${events.filter(e => e.type === 'assessment').length})` },
            { id: 'course', label: `الكورسات (${events.filter(e => e.type === 'course').length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-[#4E7E76] text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
          لا توجد أنشطة مسجلة في هذا القسم حتى الآن.
        </div>
      ) : (
        <div className="relative border-r-2 border-[#4E7E76]/30 dark:border-[#4E7E76]/20 mr-4 sm:mr-6 space-y-6">
          {filteredEvents.map((evt) => (
            <div key={evt.id} className="relative pr-7 sm:pr-9">
              
              {/* Event Marker Icon */}
              <div className={`absolute -right-3 top-2 w-6 h-6 rounded-full flex items-center justify-center text-white ring-4 ring-[#F8FAFC] dark:ring-[#0D1117] ${
                evt.type === 'booking' ? 'bg-[#CC4E46]' :
                evt.type === 'assessment' ? 'bg-[#154F9C]' :
                evt.type === 'homework' ? 'bg-[#D97706]' :
                evt.type === 'course' ? 'bg-[#4E7E76]' :
                'bg-slate-800'
              }`}>
                {evt.type === 'booking' && <Calendar className="w-3 h-3" />}
                {evt.type === 'assessment' && <Brain className="w-3 h-3" />}
                {evt.type === 'homework' && <BookOpen className="w-3 h-3" />}
                {evt.type === 'course' && <GraduationCap className="w-3 h-3" />}
                {evt.type === 'clinical_note' && <Lock className="w-3 h-3 text-rose-300" />}
              </div>

              {/* Event Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                      {evt.title}
                    </span>
                    {evt.type === 'booking' && getBookingStatusBadge(evt.status)}
                    {evt.type === 'homework' && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        evt.status === 'completed' 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {getHomeworkStatusLabel(evt.status || '')}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold" dir="ltr">
                    {evt.date}
                  </span>
                </div>

                {evt.subtitle && (
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {evt.subtitle}
                  </p>
                )}

                {/* Additional context for Bookings */}
                {evt.type === 'booking' && evt.data.meetLink && evt.data.status === 'confirmed' && (
                  <div className="pt-2">
                    <a
                      href={evt.data.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#154F9C] hover:bg-[#103D7A] text-white text-xs font-bold rounded-xl transition"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>دخول قاعة الجلسة الآمنة (Google Meet)</span>
                    </a>
                  </div>
                )}

                {/* Additional context for Homework & Interactive Client Notes */}
                {evt.type === 'homework' && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    {evt.data.link && (
                      <Link
                        href={evt.data.link}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4E7E76] dark:text-[#5E988E] hover:underline"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>فتح المادة / مقال التمرين الإرشادي ←</span>
                      </Link>
                    )}

                    {evt.data.clientNotes && (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800">
                        <strong className="text-slate-900 dark:text-white block mb-1">استجابة وملاحظات المستفيد:</strong>
                        <p>{evt.data.clientNotes}</p>
                      </div>
                    )}

                    {onUpdateHomeworkStatus && (
                      <div className="pt-1">
                        {answeringHwId === evt.data.id ? (
                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-700 space-y-2.5">
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                              سجل إنجازك أو ملحوظتك على التمرين للمستشار:
                            </label>
                            <textarea
                              rows={2}
                              value={clientResponseText}
                              onChange={(e) => setClientResponseText(e.target.value)}
                              placeholder="مثال: قمت بتطبيق تمرين تفريغ الأفكار وشعرت بانخفاض التوتر بنسبة ملحوظة..."
                              className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={submittingNote}
                                onClick={async () => {
                                  setSubmittingNote(true);
                                  await onUpdateHomeworkStatus(evt.data.id, 'submitted', clientResponseText);
                                  setSubmittingNote(false);
                                  setAnsweringHwId(null);
                                  setClientResponseText('');
                                }}
                                className="px-4 py-1.5 rounded-lg bg-[#4E7E76] hover:bg-[#3D645E] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                              >
                                <Send className="w-3 h-3" />
                                <span>{submittingNote ? 'جاري الحفظ...' : 'إرسال الرد للمستشار'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setAnsweringHwId(null)}
                                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                              >
                                إلغاء
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setAnsweringHwId(evt.data.id);
                                setClientResponseText(evt.data.clientNotes || '');
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold transition cursor-pointer"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>{evt.data.clientNotes ? 'تعديل استجابتي' : 'تدوين استجابة للتمرين'}</span>
                            </button>
                            {evt.status !== 'completed' && (
                              <button
                                type="button"
                                onClick={() => onUpdateHomeworkStatus(evt.data.id, 'completed')}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>تأكيد الإكمال التام</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Additional context for Confidential Counselor Note */}
                {evt.type === 'clinical_note' && isCounselor && (
                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs text-rose-300 leading-relaxed font-mono">
                    {evt.data.notes}
                  </div>
                )}

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
