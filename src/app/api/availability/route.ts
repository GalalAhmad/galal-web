import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';

const availPath = path.join(process.cwd(), 'src', 'data', 'availability.json');
const bookingsPath = path.join(process.cwd(), 'src', 'data', 'bookings.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_TIME_SLOTS = [
  { id: '16:00', label: '04:00 مساءً', enabled: true },
  { id: '17:30', label: '05:30 مساءً', enabled: true },
  { id: '19:00', label: '07:00 مساءً', enabled: true },
  { id: '20:30', label: '08:30 مساءً', enabled: true },
  { id: '22:00', label: '10:00 مساءً', enabled: true },
];

export async function GET() {
  try {
    let workingDays = [0, 1, 2, 3, 4, 6];
    let timeSlots = DEFAULT_TIME_SLOTS;
    let blockedDates: string[] = [];
    let bookedSlots: { date: string; time: string; bookingId?: string }[] = [];

    // 1. Fetch from Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const { data: dbAvail, error: availErr } = await supabaseAdmin
          .from('availability')
          .select('*')
          .eq('id', 1)
          .maybeSingle();

        if (dbAvail && !availErr) {
          if (Array.isArray(dbAvail.working_days)) workingDays = dbAvail.working_days;
          if (Array.isArray(dbAvail.time_slots)) timeSlots = dbAvail.time_slots;
          if (Array.isArray(dbAvail.blocked_dates)) blockedDates = dbAvail.blocked_dates;
        }

        const { data: dbBookings, error: bookErr } = await supabaseAdmin
          .from('bookings')
          .select('id, slot_date, slot_time, status')
          .neq('status', 'cancelled');

        if (dbBookings && !bookErr) {
          bookedSlots = dbBookings.map((b: any) => ({
            date: typeof b.slot_date === 'string' ? b.slot_date : new Date(b.slot_date).toISOString().split('T')[0],
            time: b.slot_time,
            bookingId: b.id,
          }));
        }
      } catch (dbErr) {
        console.error('Supabase availability fetch error, falling back to local JSON:', dbErr);
      }
    }

    // 2. If no booked slots from Supabase or as local sync
    if (bookedSlots.length === 0) {
      try {
        const localBookings = JSON.parse(await fs.readFile(bookingsPath, 'utf-8'));
        bookedSlots = localBookings
          .filter((b: any) => b.status !== 'cancelled' && b.slotDate && b.slotTime)
          .map((b: any) => ({
            date: b.slotDate,
            time: b.slotTime,
            bookingId: b.id,
          }));
      } catch (e) {}
    }

    const availability = {
      workingDays,
      timeSlots,
      blockedDates,
    };

    return NextResponse.json(
      { success: true, availability, bookedSlots },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (error) {
    console.error('Failed to read availability:', error);
    return NextResponse.json({ error: 'Failed to read availability' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workingDays, timeSlots, blockedDates } = body;

    // 1. Update in Supabase
    if (isSupabaseConfigured) {
      try {
        const updatePayload: any = {
          id: 1,
          updated_at: new Date().toISOString(),
        };
        if (workingDays !== undefined) updatePayload.working_days = workingDays;
        if (timeSlots !== undefined) updatePayload.time_slots = timeSlots;
        if (blockedDates !== undefined) updatePayload.blocked_dates = blockedDates;

        const { error } = await supabaseAdmin
          .from('availability')
          .upsert(updatePayload, { onConflict: 'id' });

        if (error) {
          console.error('Supabase availability upsert error:', error);
        }
      } catch (dbErr) {
        console.error('Supabase availability update exception:', dbErr);
      }
    }

    // 2. Also mirror to local JSON file
    try {
      let current: any = { workingDays: [0, 1, 2, 3, 4, 6], timeSlots: DEFAULT_TIME_SLOTS, blockedDates: [] };
      try {
        current = JSON.parse(await fs.readFile(availPath, 'utf-8'));
      } catch (e) {}

      const updated = {
        ...current,
        ...(workingDays !== undefined && { workingDays }),
        ...(timeSlots !== undefined && { timeSlots }),
        ...(blockedDates !== undefined && { blockedDates }),
      };
      await fs.writeFile(availPath, JSON.stringify(updated, null, 2), 'utf-8');
    } catch (fsErr) {
      console.error('Local JSON mirror error:', fsErr);
    }

    return NextResponse.json({
      success: true,
      availability: {
        workingDays: workingDays !== undefined ? workingDays : [0, 1, 2, 3, 4, 6],
        timeSlots: timeSlots !== undefined ? timeSlots : DEFAULT_TIME_SLOTS,
        blockedDates: blockedDates !== undefined ? blockedDates : [],
      },
    });
  } catch (error) {
    console.error('Availability update error:', error);
    return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
  }
}
