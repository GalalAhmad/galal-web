import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { sendBookingConfirmationEmail } from '@/lib/email';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { getServerUserSession, requireAuth } from '@/lib/serverAuth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { phonesMatch } from '@/lib/auth';
import { storeReceiptFile } from '@/lib/storage';
import {
  createBookingSchema,
  updateBookingSchema,
  validateBookingTransition,
  validateBookingPricing,
} from '@/lib/validations/booking';

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

// In-memory slot locks for concurrent request serialization
const inMemorySlotLocks = new Set<string>();

/**
 * Parses time strings (e.g. "04:00 PM", "16:00", "04:00 مساءً", "4:30")
 * to normalized minutes from midnight (0 to 1439).
 */
function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const clean = timeStr.trim();

  const isPM = clean.includes('PM') || clean.includes('pm') || clean.includes('مساءً') || clean.includes('م');
  const isAM = clean.includes('AM') || clean.includes('am') || clean.includes('صباحاً') || clean.includes('ص');

  const numbersOnly = clean.replace(/[^\d:]/g, '');
  const parts = numbersOnly.split(':');
  if (parts.length < 2) return null;

  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes) || minutes < 0 || minutes > 59) return null;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  if (hours < 0 || hours > 23) return null;
  return hours * 60 + minutes;
}

/**
 * Clinical session duration based on consultation track (minutes).
 */
function getTrackDuration(track?: string): number {
  if (track === 'marital') return 75; // 75 minutes for couples/marital
  return 50; // Standard 50 minutes for psychological and parenting
}

/**
 * Checks if two appointment time slots overlap given their clinical durations.
 * Interval overlap condition: (startA < endB AND startB < endA)
 */
function doSlotsOverlap(
  timeAStr: string,
  timeBStr: string,
  durationAMinutes = 50,
  durationBMinutes = 50
): boolean {
  const tA = parseTimeToMinutes(timeAStr);
  const tB = parseTimeToMinutes(timeBStr);
  if (tA === null || tB === null) {
    return timeAStr.trim() === timeBStr.trim();
  }
  const startA = tA;
  const endA = tA + durationAMinutes;
  const startB = tB;
  const endB = tB + durationBMinutes;

  return startA < endB && startB < endA;
}

async function syncProfile(name: string, phone: string, email?: string, authenticatedUserId?: string) {
  // STRICT SECURITY GUARD: Never create or mutate user profiles for unauthenticated guest bookings.
  // Bookings by guests must not automatically create an account or link to an existing profile.
  if (!authenticatedUserId) {
    return;
  }

  const cleanPhone = phone ? phone.replace(/[^\d]/g, '') : '';
  const cleanEmail = email ? email.trim().toLowerCase() : '';

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      // Find profile strictly by authenticated user id
      const { data: existing } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', authenticatedUserId)
        .maybeSingle();

      if (existing) {
        await supabaseAdmin.from('profiles').update({
          name: name || existing.name,
          phone: cleanPhone || existing.phone,
          email: cleanEmail || existing.email,
          updated_at: new Date().toISOString(),
        }).eq('id', existing.id);
      }
    } catch (e) {
      console.error('Supabase profile sync error:', e);
    }
  }

  // Also mirror to local safely for authenticated user only
  try {
    let profiles: any[] = [];
    try {
      profiles = JSON.parse(await fs.readFile(profilesPath, 'utf-8'));
    } catch (e) {
      profiles = [];
    }
    const idx = profiles.findIndex((p: any) => p.id === authenticatedUserId);
    if (idx >= 0) {
      if (name) profiles[idx].name = name;
      if (cleanPhone) profiles[idx].phone = cleanPhone;
      if (cleanEmail) profiles[idx].email = cleanEmail;
      await fs.writeFile(profilesPath, JSON.stringify(profiles, null, 2), 'utf-8');
    }
  } catch (e) {}
}

export async function GET(request: Request) {
  try {
    const authCheck = requireAuth(request);
    if (!authCheck.user) {
      return authCheck.response;
    }
    const sessionUser = authCheck.user;

    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');

    const cleanPhone = phone ? phone.replace(/[^\d]/g, '') : '';
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    const isManagement = sessionUser.role === 'counselor' || sessionUser.role === 'admin';

    // If client, restrict strictly to own phone or email
    let filterPhone = cleanPhone;
    let filterEmail = cleanEmail;

    if (!isManagement) {
      filterPhone = (sessionUser.phone || '').replace(/[^\d]/g, '');
      filterEmail = (sessionUser.email || '').trim().toLowerCase();
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      let query = supabaseAdmin
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isManagement) {
        if (filterPhone && filterEmail) {
          query = query.or(`client_phone.eq.${filterPhone},client_email.eq.${filterEmail}`);
        } else if (filterPhone) {
          query = query.eq('client_phone', filterPhone);
        } else if (filterEmail) {
          query = query.eq('client_email', filterEmail);
        } else {
          // Client with no phone or email has no bookings
          return NextResponse.json({ success: true, bookings: [] });
        }
      } else {
        // Management may optionally filter by phone or email if provided
        if (filterPhone && filterEmail) {
          query = query.or(`client_phone.eq.${filterPhone},client_email.eq.${filterEmail}`);
        } else if (filterPhone) {
          query = query.eq('client_phone', filterPhone);
        } else if (filterEmail) {
          query = query.eq('client_email', filterEmail);
        }
      }

      const { data, error } = await query;

      if (!error && Array.isArray(data)) {
        const formatted = data.map(toFrontendBooking);
        return NextResponse.json(
          { success: true, bookings: formatted },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
        );
      } else if (error) {
        console.error('Supabase GET bookings error:', error);
        return NextResponse.json({ error: 'تعذر استرجاع الحجوزات من قاعدة البيانات' }, { status: 500 });
      }
    }

    // Local Fallback ONLY in non-production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'تعذر الاتصال بقاعدة البيانات في بيئة الإنتاج' },
        { status: 503 }
      );
    }

    const localData = await readBookingsLocal();
    let filtered = localData;

    if (!isManagement) {
      filtered = localData.filter((b: any) => {
        const bPhone = (b.clientPhone || b.client_phone || '').replace(/[^\d]/g, '');
        const bEmail = (b.clientEmail || b.client_email || '').trim().toLowerCase();
        if (filterPhone && (bPhone === filterPhone || (bPhone.length >= 8 && filterPhone.length >= 8 && bPhone.slice(-8) === filterPhone.slice(-8)))) return true;
        if (filterEmail && bEmail === filterEmail) return true;
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
    const ip = getClientIp(request);

    // Rate Limiting: 10 booking attempts per hour per IP
    const rateCheck = checkRateLimit(`booking:${ip}`, 10, 3600);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `تم تجاوز الحد المسموح لمحاولات الحجز. يرجى الانتظار لمدة ${Math.ceil(
            rateCheck.resetInSeconds / 60
          )} دقيقة قبل المحاولة مجدداً.`,
          code: 'RATE_LIMITED',
        },
        { status: 429 }
      );
    }

    // Production Fail-Closed Safety Guard:
    if (process.env.NODE_ENV === 'production' && (!isSupabaseConfigured || !supabaseAdmin)) {
      return NextResponse.json(
        { error: 'خدمة الحجز غير متاحة حالياً بسبب نقص إعدادات الخادم (Supabase unconfigured).' },
        { status: 503 }
      );
    }

    const rawBody = await request.json();

    // 1. Zod Input Validation
    const parseResult = createBookingSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const issues = parseResult.error.issues || (parseResult.error as any).errors || [];
      const firstError = issues[0]?.message || 'البيانات المدخلة لحجز الموعد غير مكتملة أو غير صالحة';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

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
    } = parseResult.data;

    // Server-Side Authoritative Pricing & Track Whitelist Check (Blocks price tampering)
    const pricingValidation = validateBookingPricing(track, fee, paymentMethod);
    if (!pricingValidation.valid) {
      return NextResponse.json({ error: pricingValidation.error }, { status: 400 });
    }
    const durationMinutes = pricingValidation.durationMinutes;
    const authoritativeFee = pricingValidation.authoritativeFee;
    const authoritativeTrackLabel = pricingValidation.authoritativeLabel;

    // 2. Concurrency Lock: Prevent simultaneous identical slot submissions
    const slotLockKey = `${slotDate}:${slotTime.trim()}`;
    if (inMemorySlotLocks.has(slotLockKey)) {
      return NextResponse.json(
        { error: 'عذراً، هذا الموعد قيد الحجز للتو من قِبل مستفيد آخر. يرجى اختيار موعد آخر متاح.' },
        { status: 409 }
      );
    }
    inMemorySlotLocks.add(slotLockKey);

    try {
      // 3. Receipt Storage & Magic-Bytes Validation
      let storedReceiptRef = '';
      if (receiptImage && receiptImage.trim()) {
        try {
          const tempId = `BK-${Date.now().toString().slice(-4)}`;
          storedReceiptRef = await storeReceiptFile(tempId, receiptImage);
        } catch (receiptErr: any) {
          return NextResponse.json(
            { error: receiptErr.message || 'الملف المرفق لإيصال السداد غير صالح' },
            { status: 400 }
          );
        }
      }

      // 4. Idempotency / Double-Submit Protection: Check if same client booked same slot recently
      const cleanPhoneDigits = clientPhone.replace(/[^\d]/g, '');
      if (isSupabaseConfigured && supabaseAdmin) {
        const { data: recentDup } = await supabaseAdmin
          .from('bookings')
          .select('*')
          .eq('slot_date', slotDate)
          .neq('status', 'cancelled')
          .neq('status', 'rejected')
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentDup && recentDup.length > 0) {
          const dupMatch = recentDup.find((existing: any) => {
            const existPhone = (existing.client_phone || '').replace(/[^\d]/g, '');
            // Exact phone digits match only (no loose suffix matching)
            const phoneMatches = existPhone.length >= 8 && existPhone === cleanPhoneDigits;
            const existDuration = getTrackDuration(existing.track);
            const timeMatches = doSlotsOverlap(existing.slot_time || '', slotTime, existDuration, getTrackDuration(track));
            return phoneMatches && timeMatches;
          });

          if (dupMatch) {
            return NextResponse.json({
              success: true,
              booking: toFrontendBooking(dupMatch),
              message: 'تم استلام هذا الحجز مسبقاً وهو مسجل في النظام',
            });
          }
        }
      }

      const durationMinutes = getTrackDuration(track);
      const startMinutes = parseTimeToMinutes(slotTime) ?? 0;
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const bookingId = `BK-${Date.now().toString().slice(-4)}${randomSuffix}`;
      const initialMeetLink = '';
      let createdBooking: any = null;

      // 5. Conflict check & Atomic Reservation on Supabase
      if (isSupabaseConfigured && supabaseAdmin) {
        let rpcCallError: any = null;
        try {
          const { data: rpcRes, error: rpcErr } = await supabaseAdmin.rpc('create_booking_atomic', {
            p_id: bookingId,
            p_client_name: clientName,
            p_client_phone: clientPhone,
            p_client_email: clientEmail || null,
            p_track: track || 'psychological',
            p_track_label: authoritativeTrackLabel,
            p_age: age ? String(age) : null,
            p_marital_status: maritalStatus || 'غير محدد',
            p_slot_date: slotDate,
            p_slot_time: slotTime,
            p_slot_start_minutes: startMinutes,
            p_duration_minutes: durationMinutes,
            p_fee: authoritativeFee,
            p_payment_method: paymentMethod || 'instapay',
            p_receipt_note: receiptNote || '',
            p_receipt_image: storedReceiptRef,
            p_answers: answers || {},
            p_meet_link: initialMeetLink,
          });

          if (rpcErr) {
            rpcCallError = rpcErr;
          } else if (rpcRes) {
            if (!rpcRes.success) {
              if (rpcRes.code === 'CONFLICT') {
                return NextResponse.json(
                  { error: rpcRes.error || 'عذراً، هذا الموعد يتعارض مع موعد محجوز مسبقاً. يرجى اختيار موعد آخر متاح.' },
                  { status: 409 }
                );
              }
              if (rpcRes.code === 'INVALID_INPUT') {
                return NextResponse.json(
                  { error: rpcRes.error || 'بيانات الحجز غير صالحة' },
                  { status: 400 }
                );
              }
              return NextResponse.json(
                { error: rpcRes.error || 'تعذر إتمام الحجز' },
                { status: 400 }
              );
            }

            if (rpcRes.success) {
              createdBooking = {
                id: bookingId,
                clientName,
                clientPhone,
                clientEmail: clientEmail || '',
                track: track || 'psychological',
                trackLabel: authoritativeTrackLabel,
                age: age || null,
                maritalStatus: maritalStatus || 'غير محدد',
                slotDate,
                slotTime,
                paymentMethod: paymentMethod || 'instapay',
                receiptNote: receiptNote || '',
                receiptImage: storedReceiptRef,
                fee: authoritativeFee,
                status: 'pending_verification',
                meetLink: initialMeetLink,
                created_at: new Date().toISOString(),
              };
            }
          }
        } catch (err: any) {
          rpcCallError = err;
        }

        // Fail-Closed Enforcement: In production, NEVER silently fall back to racy check-then-insert
        if (!createdBooking) {
          const isProduction = process.env.NODE_ENV === 'production';
          if (isProduction || rpcCallError) {
            console.error('[CRITICAL-FAIL-CLOSED] Atomic booking RPC failed in Supabase environment:', rpcCallError);
            if (isProduction) {
              return NextResponse.json(
                {
                  error: 'نظام الحجز الذري غير متاح حالياً لمنع تضارب المواعيد. يرجى المحاولة لاحقاً أو التواصل مع الإدارة.',
                  code: 'ATOMIC_BOOKING_UNAVAILABLE',
                },
                { status: 503 }
              );
            }
          }

          // In dev/test offline mode only: query-level interval check
          const { data: conflicts } = await supabaseAdmin
            .from('bookings')
            .select('id, slot_date, slot_time, track, status')
            .eq('slot_date', slotDate)
            .neq('status', 'cancelled')
            .neq('status', 'rejected');

          const isConflict = (conflicts || []).some((b: any) => {
            const bDuration = getTrackDuration(b.track);
            return doSlotsOverlap(b.slot_time || '', slotTime, bDuration, durationMinutes);
          });

          if (isConflict) {
            return NextResponse.json(
              { error: 'عذراً، هذا الموعد يتعارض مع موعد محجوز مسبقاً. يرجى اختيار موعد آخر متاح.' },
              { status: 409 }
            );
          }

          const { data, error } = await supabaseAdmin
            .from('bookings')
            .insert({
              id: bookingId,
              client_name: clientName,
              client_phone: clientPhone,
              client_email: clientEmail || null,
              track: track || 'psychological',
              track_label: authoritativeTrackLabel,
              age: age || null,
              marital_status: maritalStatus || 'غير محدد',
              slot_date: slotDate,
              slot_time: slotTime,
              meet_link: initialMeetLink,
              status: 'pending_verification',
              payment_method: paymentMethod || 'instapay',
              fee: authoritativeFee,
              receipt_note: receiptNote || '',
              receipt_image: storedReceiptRef,
              answers: answers || {},
            })
            .select()
            .single();

          if (error) {
            console.error('Supabase booking insert error:', error);
            if (error.code === '23505') {
              return NextResponse.json(
                { error: 'عذراً، هذا الموعد تم حجزه للتو من قِبل مستفيد آخر. يرجى اختيار موعد آخر متاح.' },
                { status: 409 }
              );
            }
            return NextResponse.json(
              { error: 'تعذر تسجيل الحجز في قاعدة البيانات السحابية، يرجى مراجعة الاتصال والمحاولة ثانية.' },
              { status: 500 }
            );
          }

          if (data) {
            createdBooking = toFrontendBooking(data);
          }
        }
      } else {
        if (process.env.NODE_ENV === 'production') {
          return NextResponse.json(
            { error: 'تعذر الاتصال بقاعدة البيانات لتنفيذ الحجز الذري الآمن في بيئة الإنتاج.' },
            { status: 503 }
          );
        }

        const localList = await readBookingsLocal();
        const isConflict = localList.some((b: any) => {
          if (b.status === 'cancelled' || b.status === 'rejected') return false;
          if (b.slotDate !== slotDate) return false;
          const bDuration = getTrackDuration(b.track);
          return doSlotsOverlap(b.slotTime || '', slotTime, bDuration, durationMinutes);
        });

        if (isConflict) {
          return NextResponse.json(
            { error: 'عذراً، هذا الموعد يتعارض مع موعد محجوز مسبقاً. يرجى اختيار موعد آخر متاح.' },
            { status: 409 }
          );
        }

        createdBooking = {
          id: bookingId,
          clientName,
          clientPhone,
          clientEmail: clientEmail || '',
          track: track || 'psychological',
          trackLabel: authoritativeTrackLabel,
          age: age || null,
          maritalStatus: maritalStatus || 'غير محدد',
          answers: answers || {},
          slotDate,
          slotTime,
          paymentMethod: paymentMethod || 'instapay',
          receiptNote: receiptNote || '',
          receiptImage: storedReceiptRef,
          fee: authoritativeFee,
          status: 'pending_verification',
          meetLink: initialMeetLink,
          created_at: new Date().toISOString(),
        };
      }

      // Mirror to local JSON (strictly non-production)
      if (process.env.NODE_ENV !== 'production') {
        try {
          const currentList = await readBookingsLocal();
          currentList.unshift(createdBooking);
          await writeBookingsLocal(currentList);
        } catch (e) {}
      }

      // Auto-sync client profile in Supabase & local (Safe: will never hijack existing profile)
      const authSession = getServerUserSession(request);
      await syncProfile(createdBooking.clientName, createdBooking.clientPhone, createdBooking.clientEmail, authSession?.id);

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
            recommendation: '/counselor',
            created_at: new Date().toISOString(),
          });
        } catch (err) {
          console.error('In-app notification insert error:', err);
        }
      }

      return NextResponse.json({ success: true, booking: createdBooking });
    } finally {
      inMemorySlotLocks.delete(slotLockKey);
    }
  } catch (error) {
    console.error('Booking submission error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تسجيل الحجز' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authCheck = requireAuth(request);
    if (!authCheck.user) {
      return authCheck.response;
    }
    const sessionUser = authCheck.user;
    const isManagement = sessionUser.role === 'counselor' || sessionUser.role === 'admin';

    const rawBody = await request.json();
    const parseResult = updateBookingSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const issues = parseResult.error.issues || (parseResult.error as any).errors || [];
      const firstError = issues[0]?.message || 'بيانات تعديل الحجز غير صالحة';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { id, status, slotDate, slotTime, meetLink, notes, action } = parseResult.data;

    // Fetch existing booking to verify existence and check ownership
    let existingBooking: any = null;
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data: found } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (found) existingBooking = found;
    }

    if (!existingBooking && process.env.NODE_ENV !== 'production') {
      const localList = await readBookingsLocal();
      existingBooking = localList.find((b: any) => b.id === id);
    }

    if (!existingBooking) {
      return NextResponse.json({ error: 'الحجز غير موجود' }, { status: 404 });
    }

    // Role-based authorization & ownership checks
    if (action === 'delete') {
      if (!isManagement) {
        return NextResponse.json(
          { error: 'ممنوع: حذف الحجوزات يقتصر على المعالج والإدارة فقط', code: 'FORBIDDEN' },
          { status: 403 }
        );
      }
    }

    if (!isManagement) {
      const bPhone = existingBooking.client_phone || existingBooking.clientPhone;
      const bEmail = (existingBooking.client_email || existingBooking.clientEmail || '').trim().toLowerCase();
      const userPhone = sessionUser.phone;
      const userEmail = (sessionUser.email || '').trim().toLowerCase();

      const phoneMatches = bPhone && userPhone ? phonesMatch(bPhone, userPhone) : false;
      const emailMatches = bEmail && userEmail ? bEmail === userEmail : false;

      if (!phoneMatches && !emailMatches) {
        return NextResponse.json(
          { error: 'غير مصرّح لك بتعديل بيانات هذا الحجز', code: 'FORBIDDEN' },
          { status: 403 }
        );
      }

      // Clients can only cancel, cannot set meetLink, notes, or advance state
      if (meetLink !== undefined || notes !== undefined) {
        return NextResponse.json(
          { error: 'غير مصرّح للمستفيد بتعديل رابط الاجتماع أو ملاحظات الجلسة السريرية', code: 'FORBIDDEN' },
          { status: 403 }
        );
      }

      if (status !== undefined && status !== 'cancelled') {
        return NextResponse.json(
          { error: 'عذراً، يقتصر حق اعتماد أو تأكيد أو تغيير موعد الجلسة على المعالج فقط', code: 'FORBIDDEN' },
          { status: 403 }
        );
      }
    }

    // Explicit State Machine Lifecycle Validation
    if (status !== undefined) {
      const currentStatus = existingBooking.status || 'pending_verification';
      const transitionCheck = validateBookingTransition(currentStatus, status, sessionUser.role);
      if (!transitionCheck.allowed) {
        return NextResponse.json({ error: transitionCheck.error }, { status: 400 });
      }
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      if (action === 'delete') {
        await supabaseAdmin.from('bookings').delete().eq('id', id);
        if (process.env.NODE_ENV !== 'production') {
          try {
            const currentList = await readBookingsLocal();
            await writeBookingsLocal(currentList.filter((b: any) => b.id !== id));
          } catch (e) {}
        }
        return NextResponse.json({ success: true, message: 'تم حذف الحجز بنجاح' });
      }

      const updateData: any = { updated_at: new Date().toISOString() };
      if (status !== undefined) updateData.status = status;
      if (meetLink !== undefined) updateData.meet_link = meetLink;
      if (notes !== undefined) updateData.notes = notes;

      // Atomic Reschedule with Interval Overlap Prevention & Advisory Locking
      if ((slotDate || slotTime) && status !== 'cancelled' && status !== 'rejected') {
        const targetDate = slotDate || existingBooking.slot_date;
        const targetTime = slotTime || existingBooking.slot_time;
        const targetDuration = getTrackDuration(existingBooking.track);
        const targetStartMinutes = parseTimeToMinutes(targetTime);

        if (targetStartMinutes === null) {
          return NextResponse.json({ error: 'صيغة توقيت الموعد غير صالحة' }, { status: 400 });
        }

        // Try calling the atomic stored procedure first (enforces pg_advisory_xact_lock)
        let rpcExecuted = false;
        try {
          const { data: rpcRes, error: rpcErr } = await supabaseAdmin.rpc('reschedule_booking_atomic', {
            p_id: id,
            p_slot_date: targetDate,
            p_slot_time: targetTime.trim(),
            p_slot_start_minutes: targetStartMinutes,
            p_duration_minutes: targetDuration,
            p_status: status || 'rescheduled',
            p_meet_link: meetLink || null,
            p_notes: notes || null,
          });

          if (!rpcErr && rpcRes) {
            rpcExecuted = true;
            if (!rpcRes.success) {
              if (rpcRes.code === 'CONFLICT') {
                return NextResponse.json({ error: rpcRes.error }, { status: 409 });
              }
              return NextResponse.json({ error: rpcRes.error }, { status: 400 });
            }
          }
        } catch (rpcCatchErr) {
          // RPC not deployed in current environment; proceed with serialized fallback
        }

        if (!rpcExecuted) {
          const { data: conflicts } = await supabaseAdmin
            .from('bookings')
            .select('id, slot_date, slot_time, track, status, slot_start_minutes, duration_minutes')
            .neq('id', id)
            .neq('status', 'cancelled')
            .neq('status', 'rejected')
            .eq('slot_date', targetDate);

          const isConflict = (conflicts || []).some((b: any) => {
            const bDur = b.duration_minutes || getTrackDuration(b.track);
            return doSlotsOverlap(b.slot_time || '', targetTime, bDur, targetDuration);
          });

          if (isConflict) {
            return NextResponse.json(
              { error: 'عذراً، هذا الموعد البديل محجوز بالفعل لحجز آخر. يرجى اختيار موعد شاغر.' },
              { status: 409 }
            );
          }

          updateData.slot_date = targetDate;
          updateData.slot_time = targetTime.trim();
          updateData.slot_start_minutes = targetStartMinutes;
          updateData.duration_minutes = targetDuration;
          updateData.slot_end_minutes = targetStartMinutes + targetDuration;
          if (status === undefined) updateData.status = 'rescheduled';
        }
      } else {
        if (slotDate !== undefined) updateData.slot_date = slotDate;
        if (slotTime !== undefined) updateData.slot_time = slotTime;
      }

      let data: any = null;
      let error: any = null;

      // If already updated via RPC, retrieve the authoritative row; otherwise execute update
      if (Object.keys(updateData).length > 1) {
        const res = await supabaseAdmin
          .from('bookings')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();
        data = res.data;
        error = res.error;
      } else {
        const res = await supabaseAdmin
          .from('bookings')
          .select('*')
          .eq('id', id)
          .single();
        data = res.data;
        error = res.error;
      }

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

        // mirror local (non-production only)
        if (process.env.NODE_ENV !== 'production') {
          try {
            const currentList = await readBookingsLocal();
            const idx = currentList.findIndex((b: any) => b.id === id);
            if (idx !== -1) {
              currentList[idx] = { ...currentList[idx], ...updated };
              await writeBookingsLocal(currentList);
            }
          } catch (e) {}
        }
        return NextResponse.json({ success: true, booking: updated });
      }
    }

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'تعذر الاتصال بقاعدة البيانات في بيئة الإنتاج' },
        { status: 503 }
      );
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

    if ((slotDate || slotTime) && status !== 'cancelled' && status !== 'rejected') {
      const targetDate = slotDate || currentList[idx].slotDate;
      const targetTime = slotTime || currentList[idx].slotTime;
      const targetDuration = getTrackDuration(currentList[idx].track);

      const isConflict = currentList.some((b: any) => {
        if (b.id === id) return false;
        if (b.status === 'cancelled' || b.status === 'rejected') return false;
        if (b.slotDate !== targetDate) return false;
        const bDuration = getTrackDuration(b.track);
        return doSlotsOverlap(b.slotTime || '', targetTime, bDuration, targetDuration);
      });
      if (isConflict) {
        return NextResponse.json(
          { error: 'عذراً، هذا الموعد البديل محجوز بالفعل لحجز آخر. يرجى اختيار موعد شاغر.' },
          { status: 409 }
        );
      }

      currentList[idx].slot_start_minutes = parseTimeToMinutes(targetTime);
      currentList[idx].duration_minutes = targetDuration;
      currentList[idx].slot_end_minutes = (currentList[idx].slot_start_minutes ?? 0) + targetDuration;
      if (status === undefined) currentList[idx].status = 'rescheduled';
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
