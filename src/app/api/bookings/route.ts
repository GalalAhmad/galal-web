import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'data', 'bookings.json');

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
    return NextResponse.json({ success: true, bookings: localData });
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

    const currentList = await readBookings();
    currentList.unshift(newBooking);
    await writeBookings(currentList);

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error) {
    console.error('Booking submission error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تسجيل الحجز' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, meetLink, notes, homework, action } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 });
    }

    const currentList = await readBookings();
    const idx = currentList.findIndex((item: any) => item.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (action === 'delete') {
      const filtered = currentList.filter((item: any) => item.id !== id);
      await writeBookings(filtered);
      return NextResponse.json({ success: true, bookings: filtered });
    }

    if (status) currentList[idx].status = status;
    if (meetLink !== undefined) currentList[idx].meetLink = meetLink;
    if (notes !== undefined) currentList[idx].notes = notes;
    if (homework !== undefined) currentList[idx].homework = homework;

    await writeBookings(currentList);
    return NextResponse.json({ success: true, booking: currentList[idx], bookings: currentList });
  } catch (error) {
    console.error('Booking update error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
