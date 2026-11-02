import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { sendBookingConfirmationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const filePath = path.join(process.cwd(), 'src', 'data', 'bookings.json');
const profilesPath = path.join(process.cwd(), 'src', 'data', 'userProfiles.json');

function phonesMatch(phone1?: string, phone2?: string): boolean {
  if (!phone1 || !phone2) return false;
  const digits1 = phone1.replace(/[^\d]/g, '');
  const digits2 = phone2.replace(/[^\d]/g, '');
  if (!digits1 || !digits2) return false;
  if (digits1 === digits2) return true;
  if (digits1.length >= 8 && digits2.length >= 8) {
    return digits1.slice(-8) === digits2.slice(-8);
  }
  return false;
}

async function syncUserProfile(name: string, phone: string, email?: string) {
  try {
    let profiles: any[] = [];
    try {
      const pData = await fs.readFile(profilesPath, 'utf-8');
      profiles = JSON.parse(pData);
    } catch (e) {
      profiles = [];
    }

    const cleanPhone = phone ? phone.replace(/[^\d]/g, '') : '';
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    const existingIdx = profiles.findIndex((p: any) => {
      const pEmail = (p.email || '').trim().toLowerCase();
      if (cleanPhone && phonesMatch(p.phone, cleanPhone)) return true;
      if (cleanEmail && pEmail && cleanEmail === pEmail) return true;
      if (name && p.name && p.name.trim().toLowerCase() === name.trim().toLowerCase()) return true;
      return false;
    });

    if (existingIdx >= 0) {
      if (name) profiles[existingIdx].name = name;
      if (cleanPhone && !profiles[existingIdx].phone) profiles[existingIdx].phone = cleanPhone;
      if (cleanEmail && !profiles[existingIdx].email) profiles[existingIdx].email = cleanEmail;
    } else {
      profiles.unshift({
        id: `user-${Date.now()}`,
        name: name || 'مستفيد جديد',
        phone: cleanPhone || '',
        email: cleanEmail || '',
        provider: 'booking',
        clinicalNotes: '',
        homework: [],
        testResults: [],
        createdAt: new Date().toISOString(),
      });
    }

    await fs.writeFile(profilesPath, JSON.stringify(profiles, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error syncing user profile on booking:', err);
  }
}

async function readBookings() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeBookings(data: any[]) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing bookings.json:', err);
  }
}

export async function GET() {
  try {
    const localData = await readBookings();
    return NextResponse.json(
      { success: true, bookings: localData },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientName,
      clientPhone,
      clientEmail,
      track,
      trackLabel,
      age,
      maritalStatus,
      answers,
      slotDate,
      slotTime,
      paymentMethod,
      receiptNote,
      receiptImage,
      fee,
    } = body;

    if (!clientName || !clientPhone || !slotDate || !slotTime) {
      return NextResponse.json(
        { error: 'الاسم ورقم الهاتف والموعد محددات أساسية لإتمام الحجز' },
        { status: 400 }
      );
    }

    const currentList = await readBookings();

    // NexCal Anti-Double-Booking Guard (Atomic Slot Conflict Detection)
    const isConflict = currentList.some((b: any) => {
      if (b.status === 'cancelled') return false;
      if (b.slotDate !== slotDate) return false;
      const timeA = (b.slotTime || '').trim();
      const timeB = (slotTime || '').trim();
      return timeA === timeB || timeA.includes(timeB) || timeB.includes(timeA);
    });

    if (isConflict) {
      return NextResponse.json(
        { error: 'عذراً، هذا الموعد تم حجزه للتو من قِبل مستفيد آخر. يرجى اختيار موعد آخر متاح.' },
        { status: 409 }
      );
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newBooking = {
      id: `BK-${Date.now().toString().slice(-4)}${randomSuffix}`,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail ? clientEmail.trim() : '',
      track: track || 'psychological',
      trackLabel: trackLabel || 'استشارة نفسية فردية',
      age: age || null,
      maritalStatus: maritalStatus || 'غير محدد',
      answers: answers || {},
      slotDate,
      slotTime,
      paymentMethod: paymentMethod || 'instapay',
      receiptNote: receiptNote || '',
      receiptImage: receiptImage || '',
      fee: fee || '250 ر.س',
      status: 'pending_verification', // pending_verification | confirmed | completed | cancelled
      meetLink: `https://meet.google.com/galal-${Math.random().toString(36).substring(2, 7)}`,
      notes: '',
      homework: [],
      created_at: new Date().toISOString(),
    };

    currentList.unshift(newBooking);
    await writeBookings(currentList);

    // Auto-create/sync client dossier in userProfiles.json
    await syncUserProfile(newBooking.clientName, newBooking.clientPhone, newBooking.clientEmail);

    // Send confirmation email with Google Meet details
    if (newBooking.clientEmail) {
      sendBookingConfirmationEmail({
        to: newBooking.clientEmail,
        clientName: newBooking.clientName,
        bookingId: newBooking.id,
        trackLabel: newBooking.trackLabel,
        slotDate: newBooking.slotDate,
        slotTime: newBooking.slotTime,
        meetLink: newBooking.meetLink,
      }).catch((err) => console.error('Email send background error:', err));
    }

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error) {
    console.error('Booking submission error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تسجيل الحجز' }, { status: 500 });
  }
}

// PUT: Admin updates booking status, time, or Google Meet link
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, slotDate, slotTime, meetLink, notes, action } = body;

    if (!id) {
      return NextResponse.json({ error: 'معرّف الحجز مطلوب' }, { status: 400 });
    }

    const currentList = await readBookings();
    const idx = currentList.findIndex((b: any) => b.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: 'الحجز غير موجود' }, { status: 404 });
    }

    if (action === 'delete') {
      currentList.splice(idx, 1);
      await writeBookings(currentList);
      return NextResponse.json({ success: true, message: 'تم حذف الحجز بنجاح' });
    }

    // Check conflict if date or time is changed to a new slot
    const targetDate = slotDate !== undefined ? slotDate : currentList[idx].slotDate;
    const targetTime = slotTime !== undefined ? slotTime : currentList[idx].slotTime;
    if ((slotDate || slotTime) && status !== 'cancelled') {
      const isConflict = currentList.some((b: any, bIdx: number) => {
        if (bIdx === idx) return false;
        if (b.status === 'cancelled') return false;
        if (b.slotDate !== targetDate) return false;
        const timeA = (b.slotTime || '').trim();
        const timeB = (targetTime || '').trim();
        return timeA === timeB || timeA.includes(timeB) || timeB.includes(timeA);
      });

      if (isConflict) {
        return NextResponse.json(
          { error: 'عذراً، هذا الموعد البديل محجوز بالفعل لحجز آخر. يرجى اختيار موعد شاغر.' },
          { status: 409 }
        );
      }
    }

    if (status !== undefined) currentList[idx].status = status;
    if (slotDate !== undefined) currentList[idx].slotDate = slotDate;
    if (slotTime !== undefined) currentList[idx].slotTime = slotTime;
    if (meetLink !== undefined) currentList[idx].meetLink = meetLink;
    if (notes !== undefined) currentList[idx].notes = notes;
    currentList[idx].updated_at = new Date().toISOString();

    await writeBookings(currentList);
    return NextResponse.json({ success: true, booking: currentList[idx] });
  } catch (error) {
    console.error('Booking update error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تعديل الحجز' }, { status: 500 });
  }
}

export const PATCH = PUT;
