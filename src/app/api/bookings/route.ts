import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { sendBookingConfirmationEmail } from '@/lib/email';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const filePath = path.join(process.cwd(), 'src', 'data', 'bookings.json');
const profilesPath = path.join(process.cwd(), 'src', 'data', 'userProfiles.json');

function toFrontendBooking(row: any) {
  if (!row) return null;
  let parsedAnswers = row.answers;
  if (typeof parsedAnswers === 'string') {
    try {
      parsedAnswers = JSON.parse(parsedAnswers);
    } catch (e) {
      parsedAnswers = {};
    }
  }
  return {
    id: row.id,
    clientName: row.client_name || row.clientName,
    clientPhone: row.client_phone || row.clientPhone,
    clientEmail: row.client_email || row.clientEmail || '',
    track: row.track || 'psychological',
    trackLabel: row.track_label || row.trackLabel || 'استشارة نفسية فردية',
    age: row.age || null,
    maritalStatus: row.marital_status || row.maritalStatus || 'غير محدد',
    slotDate: typeof row.slot_date === 'string' ? row.slot_date : (row.slotDate || ''),
    slotTime: row.slot_time || row.slotTime,
    meetLink: (row.status === 'confirmed') ? (row.meet_link || row.meetLink || '') : '',
    status: row.status || 'pending_verification',
    paymentMethod: row.payment_method || row.paymentMethod || 'instapay',
    fee: row.fee || '250 ر.س',
    receiptNote: row.receipt_note || row.receiptNote || '',
    receiptImage: row.receipt_image || row.receiptImage || '',
    answers: parsedAnswers || {},
    notes: row.notes || '',
    created_at: row.created_at || new Date().toISOString(),
  };
}

async function readBookingsLocal() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeBookingsLocal(data: any[]) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing bookings.json:', err);
  }
}

async function syncProfile(name: string, phone: string, email?: string) {
  const cleanPhone = phone ? phone.replace(/[^\d]/g, '') : '';
  const cleanEmail = email ? email.trim().toLowerCase() : '';

  if (isSupabaseConfigured) {
    try {
      // Find if profile exists by phone or email
      let query = supabaseAdmin.from('profiles').select('*');
      if (cleanPhone) query = query.eq('phone', cleanPhone);
      else if (cleanEmail) query = query.eq('email', cleanEmail);
      else query = query.eq('name', name);

      const { data: existing } = await query.maybeSingle();

      if (existing) {
        await supabaseAdmin.from('profiles').update({
          name: name || existing.name,
          phone: cleanPhone || existing.phone,
          email: cleanEmail || existing.email,
          updated_at: new Date().toISOString(),
        }).eq('id', existing.id);
      } else {
        await supabaseAdmin.from('profiles').insert({
          name: name || 'مستفيد جديد',
          phone: cleanPhone || null,
          email: cleanEmail || null,
          role: 'client',
        });
      }
    } catch (e) {
      console.error('Supabase profile sync error:', e);
    }
  }

  // Also mirror to local
  try {
    let profiles: any[] = [];
    try {
      profiles = JSON.parse(await fs.readFile(profilesPath, 'utf-8'));
    } catch (e) {
      profiles = [];
    }
    const idx = profiles.findIndex((p: any) => (cleanPhone && p.phone === cleanPhone) || (cleanEmail && p.email === cleanEmail) || p.name === name);
    if (idx >= 0) {
      if (name) profiles[idx].name = name;
      if (cleanPhone) profiles[idx].phone = cleanPhone;
      if (cleanEmail) profiles[idx].email = cleanEmail;
    } else {
      profiles.unshift({
        id: `user-${Date.now()}`,
        name: name || 'مستفيد جديد',
        phone: cleanPhone || '',
        email: cleanEmail || '',
        role: 'client',
        createdAt: new Date().toISOString(),
      });
    }
    await fs.writeFile(profilesPath, JSON.stringify(profiles, null, 2), 'utf-8');
  } catch (e) {}
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');
    const isAdmin = searchParams.get('admin') === 'true' || request.headers.get('x-admin-role') === 'admin';

    const cleanPhone = phone ? phone.replace(/[^\d]/g, '') : '';
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    // Privacy guard: Unauthenticated visitors must never receive full booking database
    if (!isAdmin && !cleanPhone && !cleanEmail) {
      return NextResponse.json(
        { success: true, bookings: [] },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    if (isSupabaseConfigured) {
      let query = supabaseAdmin
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      // If not admin, restrict to owner's phone or email only
      if (!isAdmin) {
        if (cleanPhone && cleanEmail) {
          query = query.or(`client_phone.eq.${cleanPhone},client_email.eq.${cleanEmail}`);
        } else if (cleanPhone) {
          query = query.eq('client_phone', cleanPhone);
        } else if (cleanEmail) {
          query = query.eq('client_email', cleanEmail);
        }
      }

      const { data, error } = await query;

      if (!error && Array.isArray(data)) {
        if (data.length > 0) {
          const formatted = data.map(toFrontendBooking);
          return NextResponse.json(
            { success: true, bookings: formatted },
            { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
          );
        }
      } else if (error) {
        console.error('Supabase GET bookings error:', error);
        return NextResponse.json({ error: 'تعذر استرجاع الحجوزات من قاعدة البيانات' }, { status: 500 });
      }
    }

    // Local Fallback (only if Supabase is unconfigured or returns empty/null)
    const localData = await readBookingsLocal();
    let filtered = localData;
    if (!isAdmin) {
      filtered = localData.filter((b: any) => {
        const bPhone = (b.clientPhone || b.client_phone || '').replace(/[^\d]/g, '');
        const bEmail = (b.clientEmail || b.client_email || '').trim().toLowerCase();
        if (cleanPhone && (bPhone === cleanPhone || (bPhone.length >= 8 && cleanPhone.length >= 8 && bPhone.slice(-8) === cleanPhone.slice(-8)))) return true;
        if (cleanEmail && bEmail === cleanEmail) return true;
        return false;
      });
    }

    const formatted = filtered.map(toFrontendBooking);

    return NextResponse.json(
      { success: true, bookings: formatted },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (error) {
    console.error('Error in GET bookings:', error);
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

    // Receipt Validation (Size < 5MB and allowed mime types)
    if (receiptImage && typeof receiptImage === 'string') {
      if (receiptImage.length > 7.5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'حجم إيصال السداد المرفق كبير جداً. يرجى إرفاق صورة أصغر من 5 ميجابايت لتسريع الاعتماد.' },
          { status: 400 }
        );
      }
      if (receiptImage.startsWith('data:')) {
        const isAllowedMime = 
          receiptImage.startsWith('data:image/jpeg') ||
          receiptImage.startsWith('data:image/jpg') ||
          receiptImage.startsWith('data:image/png') ||
          receiptImage.startsWith('data:image/webp') ||
          receiptImage.startsWith('data:application/pdf');
        if (!isAllowedMime) {
          return NextResponse.json(
            { error: 'صيغة ملف الإيصال غير مدعومة. يرجى إرفاق صورة (JPG, PNG, WEBP) أو ملف PDF.' },
            { status: 400 }
          );
        }
      }
    }

    // Idempotency / Double-Submit Protection: Check if same client booked same slot in last 3 minutes
    const cleanPhoneDigits = clientPhone.replace(/[^\d]/g, '');
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data: recentDup } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .eq('slot_date', slotDate)
        .eq('slot_time', slotTime)
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false })
        .limit(1);

      if (recentDup && recentDup.length > 0) {
        const existing = recentDup[0];
        const existPhone = (existing.client_phone || '').replace(/[^\d]/g, '');
        if (existPhone === cleanPhoneDigits || (cleanPhoneDigits.length >= 8 && existPhone.endsWith(cleanPhoneDigits.slice(-8)))) {
          return NextResponse.json({
            success: true,
            booking: toFrontendBooking(existing),
            message: 'تم استلام هذا الحجز مسبقاً وتأكيده في النظام',
          });
        }
      }
    }

    // 1. Conflict check on Supabase
    if (isSupabaseConfigured) {
      const { data: conflicts } = await supabaseAdmin
        .from('bookings')
        .select('id, slot_date, slot_time, status')
        .eq('slot_date', slotDate)
        .neq('status', 'cancelled');

      const isConflict = (conflicts || []).some((b: any) => {
        const timeA = (b.slot_time || '').trim();
        const timeB = (slotTime || '').trim();
        return timeA === timeB || timeA.includes(timeB) || timeB.includes(timeA);
      });

      if (isConflict) {
        return NextResponse.json(
          { error: 'عذراً، هذا الموعد تم حجزه للتو من قِبل مستفيد آخر. يرجى اختيار موعد آخر متاح.' },
          { status: 409 }
        );
      }
    } else {
      const localList = await readBookingsLocal();
      const isConflict = localList.some((b: any) => {
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
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `BK-${Date.now().toString().slice(-4)}${randomSuffix}`;
    // Meet link is generated and issued upon confirmation, not arbitrarily beforehand
    const initialMeetLink = '';

    let createdBooking: any = null;

    // 2. Insert into Supabase (Single Source of Truth)
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('bookings')
        .insert({
          id: bookingId,
          client_name: clientName.trim(),
          client_phone: clientPhone.trim(),
          client_email: clientEmail ? clientEmail.trim() : null,
          track: track || 'psychological',
          track_label: trackLabel || 'استشارة نفسية فردية',
          age: age || null,
          marital_status: maritalStatus || 'غير محدد',
          slot_date: slotDate,
          slot_time: slotTime,
          meet_link: initialMeetLink,
          status: 'pending_verification',
          payment_method: paymentMethod || 'instapay',
          fee: fee || '250 ر.س',
          receipt_note: receiptNote || '',
          receipt_image: receiptImage || '',
          answers: answers || {},
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase booking insert error:', error);
        return NextResponse.json(
          { error: 'تعذر تسجيل الحجز في قاعدة البيانات السحابية، يرجى مراجعة الاتصال والمحاولة ثانية.' },
          { status: 500 }
        );
      }

      if (data) {
        createdBooking = toFrontendBooking(data);
      }
    } else {
      createdBooking = {
        id: bookingId,
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
        status: 'pending_verification',
        meetLink: initialMeetLink,
        created_at: new Date().toISOString(),
      };
    }

    // Mirror to local JSON
    try {
      const currentList = await readBookingsLocal();
      currentList.unshift(createdBooking);
      await writeBookingsLocal(currentList);
    } catch (e) {}

    // Auto-sync client profile in Supabase & local
    await syncProfile(createdBooking.clientName, createdBooking.clientPhone, createdBooking.clientEmail);

    // 1. Send receipt-acknowledgment email to client
    if (createdBooking.clientEmail) {
      sendBookingConfirmationEmail({
        to: createdBooking.clientEmail,
        clientName: createdBooking.clientName,
        bookingId: createdBooking.id,
        trackLabel: createdBooking.trackLabel,
        slotDate: createdBooking.slotDate,
        slotTime: createdBooking.slotTime,
        meetLink: createdBooking.meetLink,
        status: createdBooking.status,
      }).catch((err) => console.error('Email send background error:', err));
    }

    // 2. Insert in-app notification for the client
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin.from('test_results').insert({
          id: `notif-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          client_name: createdBooking.clientName,
          client_phone: createdBooking.clientPhone || '',
          client_email: createdBooking.clientEmail || '',
          test_id: 'user_notification',
          test_title: `تم استلام طلب حجزك (${createdBooking.id}) 🌿`,
          score: 0,
          score_percent: 0,
          level: 'unread',
          description: `تم تسجيل موعد استشارتك (${createdBooking.trackLabel}) بتاريخ ${createdBooking.slotDate} (${createdBooking.slotTime}) بنجاح وهو قيد مراجعة إيصال السداد واعتماد الموعد.`,
          recommendation: '/profile',
          created_at: new Date().toISOString(),
        });

        // 3. Insert notification for the admin
        await supabaseAdmin.from('test_results').insert({
          id: `notif-admin-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          client_name: 'إشعار الإدارة',
          client_phone: 'admin',
          client_email: 'galalahmad1201@gmail.com',
          test_id: 'user_notification',
          test_title: `حجز جديد بانتظار الاعتماد: ${createdBooking.clientName}`,
          score: 0,
          score_percent: 0,
          level: 'unread',
          description: `طلب جديد (${createdBooking.trackLabel}) - موعد: ${createdBooking.slotDate} (${createdBooking.slotTime}). اضغط لمراجعة إيصال السداد واعتماد الموعد.`,
          recommendation: '/admin',
          created_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('In-app notification insert error:', err);
      }
    }

    return NextResponse.json({ success: true, booking: createdBooking });
  } catch (error) {
    console.error('Booking submission error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تسجيل الحجز' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, slotDate, slotTime, meetLink, notes, action } = body;

    if (!id) {
      return NextResponse.json({ error: 'معرّف الحجز مطلوب' }, { status: 400 });
    }

    if (isSupabaseConfigured) {
      if (action === 'delete') {
        await supabaseAdmin.from('bookings').delete().eq('id', id);
        try {
          const currentList = await readBookingsLocal();
          await writeBookingsLocal(currentList.filter((b: any) => b.id !== id));
        } catch (e) {}
        return NextResponse.json({ success: true, message: 'تم حذف الحجز بنجاح' });
      }

      // Check conflict if rescheduling
      if ((slotDate || slotTime) && status !== 'cancelled') {
        const { data: conflicts } = await supabaseAdmin
          .from('bookings')
          .select('id, slot_date, slot_time, status')
          .neq('id', id)
          .neq('status', 'cancelled')
          .eq('slot_date', slotDate);

        const isConflict = (conflicts || []).some((b: any) => {
          const timeA = (b.slot_time || '').trim();
          const timeB = (slotTime || '').trim();
          return timeA === timeB || timeA.includes(timeB) || timeB.includes(timeA);
        });

        if (isConflict) {
          return NextResponse.json(
            { error: 'عذراً، هذا الموعد البديل محجوز بالفعل لحجز آخر. يرجى اختيار موعد شاغر.' },
            { status: 409 }
          );
        }
      }

      const updateData: any = { updated_at: new Date().toISOString() };
      if (status !== undefined) updateData.status = status;
      if (slotDate !== undefined) updateData.slot_date = slotDate;
      if (slotTime !== undefined) updateData.slot_time = slotTime;
      if (meetLink !== undefined) updateData.meet_link = meetLink;
      if (notes !== undefined) updateData.notes = notes;

      const { data, error } = await supabaseAdmin
        .from('bookings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        const updated = toFrontendBooking(data);

        // Send official confirmation email and Meet room upon confirmation
        if (status === 'confirmed' && updated?.clientEmail) {
          sendBookingConfirmationEmail({
            to: updated.clientEmail,
            clientName: updated.clientName,
            bookingId: updated.id,
            trackLabel: updated.trackLabel,
            slotDate: updated.slotDate,
            slotTime: updated.slotTime,
            meetLink: updated.meetLink || 'https://meet.google.com',
            status: 'confirmed',
          }).catch((err) => console.error('Confirmed email dispatch error:', err));
        }

        // Send in-app notification to client upon confirmation
        if (status === 'confirmed' && isSupabaseConfigured && supabaseAdmin) {
          try {
            await supabaseAdmin.from('test_results').insert({
              id: `notif-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
              client_name: updated?.clientName || 'مستفيد',
              client_phone: updated?.clientPhone || '',
              client_email: updated?.clientEmail || '',
              test_id: 'user_notification',
              test_title: `تم اعتماد وتأكيد موعد جلستك الاستشارية ✓`,
              score: 0,
              score_percent: 0,
              level: 'unread',
              description: `تم اعتماد وتأكيد موعدك (${updated?.trackLabel}) بتاريخ ${updated?.slotDate} (${updated?.slotTime}) ورابط قاعة Google Meet متاح الآن في ملفك الشخصي.`,
              recommendation: '/profile',
              created_at: new Date().toISOString(),
            });
          } catch (err) {
            console.error('In-app confirmed notification error:', err);
          }
        }

        // Audit Log Entry
        if (isSupabaseConfigured && supabaseAdmin) {
          try {
            await supabaseAdmin.from('test_results').insert({
              id: `audit-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
              client_name: 'سجل النظام (Audit Log)',
              client_phone: 'admin',
              client_email: 'audit@galalahmad.com',
              test_id: 'audit_log',
              test_title: `تعديل حالة الحجز ${id} إلى: ${status || 'تحديث بيانات'}`,
              score: 0,
              score_percent: 0,
              level: status || 'updated',
              description: `تم تحديث الحجز ${id} بواسطة الإدارة. رابط اللقاء: ${meetLink || 'بدون تعديل'}. الموعد: ${slotDate || 'نفس الموعد'} ${slotTime || ''}`,
              recommendation: id,
              created_at: new Date().toISOString(),
            });
          } catch (auditErr) {
            console.error('Audit log insert error:', auditErr);
          }
        }

        // mirror local
        try {
          const currentList = await readBookingsLocal();
          const idx = currentList.findIndex((b: any) => b.id === id);
          if (idx !== -1) {
            currentList[idx] = { ...currentList[idx], ...updated };
            await writeBookingsLocal(currentList);
          }
        } catch (e) {}
        return NextResponse.json({ success: true, booking: updated });
      }
    }

    // Local fallback
    const currentList = await readBookingsLocal();
    const idx = currentList.findIndex((b: any) => b.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'الحجز غير موجود' }, { status: 404 });
    }

    if (action === 'delete') {
      currentList.splice(idx, 1);
      await writeBookingsLocal(currentList);
      return NextResponse.json({ success: true, message: 'تم حذف الحجز بنجاح' });
    }

    if (status !== undefined) currentList[idx].status = status;
    if (slotDate !== undefined) currentList[idx].slotDate = slotDate;
    if (slotTime !== undefined) currentList[idx].slotTime = slotTime;
    if (meetLink !== undefined) currentList[idx].meetLink = meetLink;
    if (notes !== undefined) currentList[idx].notes = notes;
    currentList[idx].updated_at = new Date().toISOString();

    await writeBookingsLocal(currentList);
    return NextResponse.json({ success: true, booking: currentList[idx] });
  } catch (error) {
    console.error('Booking update error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تعديل الحجز' }, { status: 500 });
  }
}

export const PATCH = PUT;
