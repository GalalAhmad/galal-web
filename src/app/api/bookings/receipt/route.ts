import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/serverAuth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { retrieveReceiptFile } from '@/lib/storage';
import { phonesMatch } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const filePath = path.join(process.cwd(), 'src', 'data', 'bookings.json');

async function readBookingsLocal(): Promise<any[]> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const authCheck = requireAuth(request);
    if (!authCheck.user) {
      return authCheck.response;
    }
    const sessionUser = authCheck.user;
    const isStaff = sessionUser.role === 'counselor' || sessionUser.role === 'admin';

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');

    if (!bookingId) {
      return NextResponse.json({ error: 'معرّف الحجز مطلوب' }, { status: 400 });
    }

    let booking: any = null;

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('bookings')
        .select('id, client_phone, client_email, receipt_image')
        .eq('id', bookingId)
        .maybeSingle();

      if (!error && data) {
        booking = data;
      }
    }

    if (!booking) {
      const localBookings = await readBookingsLocal();
      booking = localBookings.find((b: any) => b.id === bookingId);
    }

    if (!booking) {
      return NextResponse.json({ error: 'الحجز غير موجود' }, { status: 404 });
    }

    // Role and Ownership Check: Only counselor/admin or the client who booked it can view receipt
    if (!isStaff) {
      const bPhone = booking.client_phone || booking.clientPhone;
      const bEmail = (booking.client_email || booking.clientEmail || '').trim().toLowerCase();
      const userPhone = sessionUser.phone;
      const userEmail = (sessionUser.email || '').trim().toLowerCase();

      const phoneMatches = bPhone && userPhone ? phonesMatch(bPhone, userPhone) : false;
      const emailMatches = bEmail && userEmail ? bEmail === userEmail : false;

      if (!phoneMatches && !emailMatches) {
        return NextResponse.json(
          { error: 'غير مصرّح لك بالاطلاع على إيصال سداد هذا الحجز', code: 'FORBIDDEN' },
          { status: 403 }
        );
      }
    }

    const receiptRef = booking.receipt_image || booking.receiptImage;
    if (!receiptRef) {
      return NextResponse.json({ error: 'لا يوجد إيصال سداد مرفق لهذا الحجز' }, { status: 404 });
    }

    const file = await retrieveReceiptFile(receiptRef);
    if (!file) {
      return NextResponse.json({ error: 'تعذر العثور على ملف الإيصال المطلوب' }, { status: 404 });
    }

    const uint8Array = new Uint8Array(file.buffer);

    return new Response(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': file.mime,
        'Cache-Control': 'private, max-age=1800, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Error serving booking receipt:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحميل الإيصال' }, { status: 500 });
  }
}
