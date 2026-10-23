import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const availPath = path.join(process.cwd(), 'src', 'data', 'availability.json');
const bookingsPath = path.join(process.cwd(), 'src', 'data', 'bookings.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function readAvailability() {
  try {
    const data = await fs.readFile(availPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return {
      workingDays: [0, 1, 2, 3, 4, 6],
      timeSlots: [
        { id: '16:00', label: '04:00 مساءً', enabled: true },
        { id: '17:30', label: '05:30 مساءً', enabled: true },
        { id: '19:00', label: '07:00 مساءً', enabled: true },
        { id: '20:30', label: '08:30 مساءً', enabled: true },
        { id: '22:00', label: '10:00 مساءً', enabled: true },
      ],
      blockedDates: [],
    };
  }
}

async function writeAvailability(data: any) {
  try {
    await fs.writeFile(availPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing availability.json:', err);
  }
}

async function readBookings() {
  try {
    const data = await fs.readFile(bookingsPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

export async function GET() {
  try {
    const availability = await readAvailability();
    const bookings = await readBookings();

    // Active booked slots (status !== 'cancelled')
    const bookedSlots = bookings
      .filter((b: any) => b.status !== 'cancelled' && b.slotDate && b.slotTime)
      .map((b: any) => ({
        date: b.slotDate,
        time: b.slotTime,
        bookingId: b.id,
      }));

    return NextResponse.json(
      { success: true, availability, bookedSlots },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read availability' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = await readAvailability();

    const updated = {
      ...current,
      ...(body.workingDays !== undefined && { workingDays: body.workingDays }),
      ...(body.timeSlots !== undefined && { timeSlots: body.timeSlots }),
      ...(body.blockedDates !== undefined && { blockedDates: body.blockedDates }),
    };

    await writeAvailability(updated);
    return NextResponse.json({ success: true, availability: updated });
  } catch (error) {
    console.error('Availability update error:', error);
    return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
  }
}
