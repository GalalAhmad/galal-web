'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const FullCalendar = dynamic(() => import('@fullcalendar/react'), {
  ssr: false,
  loading: () => (
    <div className="p-12 text-center text-slate-400 text-xs">
      جاري تحميل التقويم التفاعلي...
    </div>
  ),
});

import dayGridPlugin from '@fullcalendar/react/daygrid';
import timeGridPlugin from '@fullcalendar/react/timegrid';
import interactionPlugin from '@fullcalendar/react/interaction';

interface AdminCalendarProps {
  bookings: any[];
  onSelectBooking?: (booking: any) => void;
}

export default function AdminCalendarView({ bookings, onSelectBooking }: AdminCalendarProps) {
  const events = (bookings || [])
    .filter(b => b.slotDate && b.status !== 'cancelled')
    .map(b => {
      let bgColor = '#4E7E76'; // confirmed / completed
      if (b.status === 'pending_verification') bgColor = '#D97706'; // amber
      if (b.track === 'emergency') bgColor = '#CC4E46'; // red

      return {
        id: b.id,
        title: `${b.clientName || 'مستفيد'} (${b.slotTime || ''})`,
        start: b.slotDate,
        backgroundColor: bgColor,
        borderColor: bgColor,
        textColor: '#FFFFFF',
        extendedProps: b,
      };
    });

  return (
    <div className="p-4 sm:p-6 rounded-3xl bg-[#09101C] border border-slate-800 text-white shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <span>📅 جدول الجلسات التفاعلي المعتمد (FullCalendar Agenda)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            عرض مرئي لكافة المواعيد المحجوزة والمؤكدة موزعة على الأيام والأسابيع
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16A34A]/20 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>جلسات مؤكدة</span>
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>قيد المراجعة</span>
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>جلسات طارئة</span>
          </span>
        </div>
      </div>

      <div className="calendar-dark-wrapper text-right">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            right: 'prev,next today',
            center: 'title',
            left: 'dayGridMonth,timeGridWeek',
          }}
          locale="ar"
          direction="rtl"
          events={events}
          eventClick={(info) => {
            if (onSelectBooking && info.event.extendedProps) {
              onSelectBooking(info.event.extendedProps);
            }
          }}
          height="auto"
          aspectRatio={1.6}
        />
      </div>
    </div>
  );
}
