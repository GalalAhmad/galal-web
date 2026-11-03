'use client';

import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Brain, BookOpen, TrendingUp, Info, CheckCircle2 } from 'lucide-react';

interface ClinicalProgressChartsProps {
  testResults?: any[];
  homework?: any[];
  bookings?: any[];
  isAdmin?: boolean;
}

export default function ClinicalProgressCharts({
  testResults = [],
  homework = [],
  bookings = [],
  isAdmin = false,
}: ClinicalProgressChartsProps) {
  
  // 1. Process Assessment History Data for Line Chart
  const assessmentData = (testResults || [])
    .filter(t => t.score !== undefined && t.score !== null)
    .sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime())
    .map((t, idx) => {
      const dateStr = t.created_at 
        ? new Date(t.created_at).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })
        : `جلسة ${idx + 1}`;
      
      const isDepression = (t.testId || t.test_id || '').includes('depression');
      const isAnxiety = (t.testId || t.test_id || '').includes('anxiety');

      return {
        date: dateStr,
        name: t.testTitle || t.test_title || 'مقياس',
        score: Number(t.score || 0),
        depression: isDepression ? Number(t.score || 0) : undefined,
        anxiety: isAnxiety ? Number(t.score || 0) : undefined,
        level: t.level || 'معتدل',
      };
    });

  // 2. Process Homework Completion Stats
  const totalHw = homework.length;
  const completedHw = homework.filter(h => h.completed || h.status === 'completed').length;
  const inProgressHw = homework.filter(h => h.status === 'in_progress' || h.status === 'submitted').length;
  const pendingHw = totalHw - completedHw - inProgressHw;
  const completionRate = totalHw > 0 ? Math.round((completedHw / totalHw) * 100) : 0;

  const homeworkPieData = [
    { name: 'مكتمل ومعتمد', value: completedHw, color: '#16A34A' },
    { name: 'قيد التطبيق / تم الرد', value: inProgressHw, color: '#D97706' },
    { name: 'بانتظار البدء', value: Math.max(0, pendingHw), color: '#64748B' },
  ].filter(d => d.value > 0);

  // 3. Process Bookings by Track (for Admin)
  const trackCounts: Record<string, number> = {};
  for (const b of bookings) {
    const track = b.trackLabel || b.track || 'أخرى';
    trackCounts[track] = (trackCounts[track] || 0) + 1;
  }
  const trackBarData = Object.entries(trackCounts).map(([track, count]) => ({
    track: track.replace('استشارة ', ''),
    count,
  }));

  return (
    <div className="space-y-6 text-right">
      
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#4E7E76]" />
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              {isAdmin ? 'مؤشرات الأداء وتحليل الحالات السريرية' : 'مؤشرات العافية وتتبع التقدم الإرشادي'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              قراءات بيانية لتتبع استقرار الحالة النفسية ونسب إنجاز التمارين الإرشادية
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 font-bold">
          <Info className="w-3.5 h-3.5 text-[#4E7E76]" />
          <span>مؤشرات استكشافية لا تمثل تشخيصاً طبياً</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Assessment Trends Over Time */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#154F9C]" />
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                تتبع درجات المقاييس النفسية عبر الجلسات (PHQ-9 / GAD-7)
              </h4>
            </div>
            <span className="text-[11px] text-slate-400 font-bold">
              {assessmentData.length} تقييمات مسجلة
            </span>
          </div>

          {assessmentData.length < 2 ? (
            <div className="h-56 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
              <Brain className="w-8 h-8 text-slate-300 dark:text-slate-700" />
              <p className="text-xs">
                يتطلب رسم المنحنى البياني إكمال مقياسين على الأقل في فترات زمنية مختلفة لتتبع مسار التغير.
              </p>
            </div>
          ) : (
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={assessmentData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 27]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E293B', 
                      borderRadius: '12px', 
                      border: 'none', 
                      color: '#FFFFFF',
                      fontSize: '12px',
                      direction: 'rtl',
                      textAlign: 'right'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#154F9C" 
                    strokeWidth={3} 
                    dot={{ fill: '#154F9C', r: 5 }} 
                    activeDot={{ r: 7 }} 
                    name="درجة المقياس"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
            * انخفاض مؤشر الدرجة في مقاييس الاكتئاب والقلق يعكس استجابة إيجابية للتقنيات والواجبات الإرشادية.
          </p>
        </div>

        {/* Chart 2: Homework Completion Rate */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#D97706]" />
            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              معدل الالتزام بالتكليفات والتمارين
            </h4>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
              {completionRate}%
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">
              نسبة إنجاز المهام العلاجية
            </p>
          </div>

          {totalHw === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">
              لم تُسند تكليفات بعد لهذا الملف.
            </p>
          ) : (
            <div className="space-y-2.5 pt-1 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>تم إنجازه بنجاح:</span>
                </span>
                <strong className="text-slate-900 dark:text-white">{completedHw} تمرين</strong>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>قيد المتابعة والتطبيق:</span>
                </span>
                <strong className="text-slate-900 dark:text-white">{inProgressHw} تمرين</strong>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span>بانتظار البدء:</span>
                </span>
                <strong className="text-slate-900 dark:text-white">{Math.max(0, pendingHw)} تمرين</strong>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Admin Specific: Tracks Distribution Chart */}
      {isAdmin && trackBarData.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
            توزيع الجلسات الاستشارية حسب المسار والاهتمام
          </h4>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trackBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.4} />
                <XAxis dataKey="track" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    borderRadius: '12px', 
                    border: 'none', 
                    color: '#FFFFFF',
                    fontSize: '12px',
                    direction: 'rtl'
                  }} 
                />
                <Bar dataKey="count" fill="#4E7E76" radius={[6, 6, 0, 0]} name="عدد الجلسات" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
}
