import { z } from 'zod';

export const BookingStatusEnum = z.enum([
  'pending_verification',
  'requested',
  'confirmed',
  'completed',
  'cancelled',
  'rescheduled',
  'rejected',
]);

export type BookingStatus = z.infer<typeof BookingStatusEnum>;

const phoneRegex = /^[\d\s+()-]{8,20}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createBookingSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(2, 'الاسم يجب أن يحتوي على حرفين على الأقل')
    .max(100, 'الاسم طويل جداً'),
  clientPhone: z
    .string()
    .trim()
    .min(8, 'رقم الهاتف مطلوب لتأكيد الموعد والتواصل')
    .refine((v) => {
      const digits = v.replace(/[^\d]/g, '');
      return digits.length >= 8 && digits.length <= 16;
    }, 'رقم الهاتف غير صالح، يجب أن يحتوي على 8 إلى 16 رقماً'),
  clientEmail: z
    .string()
    .trim()
    .email('البريد الإلكتروني غير صالح')
    .optional()
    .or(z.literal(''))
    .nullable(),
  track: z.string().trim().default('psychological'),
  trackLabel: z.string().trim().default('استشارة نفسية فردية'),
  age: z
    .union([z.number().int().min(1).max(120), z.string().regex(/^\d+$/).transform(Number)])
    .optional()
    .nullable(),
  maritalStatus: z.string().trim().default('غير محدد'),
  slotDate: z
    .string()
    .regex(dateRegex, 'تنسيق التاريخ غير صحيح (يجب أن يكون YYYY-MM-DD)'),
  slotTime: z
    .string()
    .trim()
    .min(2, 'وقت الموعد غير محدد')
    .max(40, 'وقت الموعد غير صالح'),
  paymentMethod: z
    .enum(['instapay', 'vodafone_cash', 'bank_transfer', 'tamara', 'visa', 'free_consultation', 'cash'])
    .default('instapay'),
  fee: z.string().trim().default('250 ر.س'),
  receiptNote: z.string().trim().max(500, 'الملاحظة طويلة جداً').optional().default(''),
  receiptImage: z.string().optional().default(''),
  answers: z.record(z.string(), z.any()).optional().default({}),
});

export const updateBookingSchema = z.object({
  id: z.string().trim().min(3, 'معرّف الحجز غير صالح'),
  action: z.enum(['delete', 'reschedule', 'update']).optional(),
  status: BookingStatusEnum.optional(),
  slotDate: z.string().regex(dateRegex, 'تنسيق التاريخ غير صحيح (YYYY-MM-DD)').optional(),
  slotTime: z.string().trim().min(2).max(40).optional(),
  meetLink: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;

/**
 * Validates state transition lifecycle between current and target booking status
 */
export function validateBookingTransition(
  currentStatus: string,
  targetStatus: string,
  userRole: 'counselor' | 'admin' | 'client'
): { allowed: boolean; error?: string } {
  if (currentStatus === targetStatus) {
    return { allowed: true };
  }

  const isStaff = userRole === 'counselor' || userRole === 'admin';

  // Terminal state: completed sessions cannot be modified
  if (currentStatus === 'completed') {
    return {
      allowed: false,
      error: 'لا يمكن تعديل حالة جلسة مكتملة وموثقة سريرياً مسبقاً',
    };
  }

  // Client permissions
  if (!isStaff) {
    if (targetStatus === 'cancelled') {
      if (currentStatus === 'cancelled') {
        return { allowed: false, error: 'هذا الحجز ملغى بالفعل' };
      }
      return { allowed: true };
    }
    return {
      allowed: false,
      error: 'عذراً، تغيير حالة الحجز أو اعتماده يقتصر على المعالج والإدارة فقط',
    };
  }

  // Staff (counselor / admin) state machine transitions
  const validTransitions: Record<string, string[]> = {
    pending_verification: ['confirmed', 'rejected', 'cancelled', 'rescheduled'],
    requested: ['confirmed', 'rejected', 'cancelled', 'rescheduled', 'pending_verification'],
    rescheduled: ['confirmed', 'rejected', 'cancelled', 'pending_verification'],
    confirmed: ['completed', 'cancelled', 'rescheduled'],
    rejected: ['pending_verification', 'cancelled'],
    cancelled: ['pending_verification'],
  };

  const allowedTargets = validTransitions[currentStatus] || [];
  if (allowedTargets.includes(targetStatus)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    error: `انتقال غير مسموح لحالة الحجز من "${currentStatus}" إلى "${targetStatus}"`,
  };
}

/**
 * Authoritative Server-Side Consultation Track Whitelist & Official Pricing
 */
export const AUTHORITATIVE_TRACKS: Record<
  string,
  { label: string; durationMinutes: number; fee: string; allowedFees: string[] }
> = {
  psychological: {
    label: 'استشارة نفسية فردية',
    durationMinutes: 50,
    fee: '250 ر.س',
    allowedFees: ['250 ر.س', 'تبدأ من 250 ر.س', '250'],
  },
  marital: {
    label: 'استشارة زوجية وأسرية',
    durationMinutes: 75,
    fee: '350 ر.س',
    allowedFees: ['350 ر.س', 'تبدأ من 350 ر.س', '350'],
  },
  marriage: {
    label: 'استشارة زوجية وأسرية',
    durationMinutes: 75,
    fee: '350 ر.س',
    allowedFees: ['350 ر.س', 'تبدأ من 350 ر.س', '350'],
  },
  parenting: {
    label: 'إرشاد تربوي ووالدي',
    durationMinutes: 50,
    fee: '250 ر.س',
    allowedFees: ['250 ر.س', 'تبدأ من 250 ر.س', '250'],
  },
  emergency: {
    label: 'حجز طارئ وعاجل (24 ساعة)',
    durationMinutes: 50,
    fee: '500 ر.س',
    allowedFees: ['500 ر.س', '500'],
  },
};

/**
 * Validates track against authoritative whitelist and strictly prevents client-side price tampering.
 */
export function validateBookingPricing(
  track: string,
  fee?: string,
  paymentMethod?: string
): {
  valid: boolean;
  error?: string;
  authoritativeFee: string;
  durationMinutes: number;
  authoritativeLabel: string;
} {
  if (paymentMethod === 'free_consultation') {
    return {
      valid: true,
      authoritativeFee: '0 ر.س (استشارة مجانية)',
      durationMinutes: 50,
      authoritativeLabel: 'جلسة استشارية مجانية',
    };
  }

  const trackConfig = AUTHORITATIVE_TRACKS[track];
  if (!trackConfig) {
    return {
      valid: false,
      error: `المسار الاستشاري المحدد (${track}) غير معتمد في المنصة`,
      authoritativeFee: '250 ر.س',
      durationMinutes: 50,
      authoritativeLabel: 'استشارة نفسية فردية',
    };
  }

  // Validate fee against authoritative whitelist
  if (fee && fee.trim()) {
    const cleanFeeDigits = fee.replace(/[^\d]/g, '');
    const cleanExpectedDigits = trackConfig.fee.replace(/[^\d]/g, '');

    const matchesExpected =
      cleanFeeDigits === cleanExpectedDigits ||
      trackConfig.allowedFees.some((f) => f.replace(/[^\d]/g, '') === cleanFeeDigits);

    if (!matchesExpected) {
      return {
        valid: false,
        error: `قيمة الرسوم المدخلة (${fee}) غير مطابقة للتسعيرة الرسمية المعتمدة لمسار (${trackConfig.label}) وهي (${trackConfig.fee})`,
        authoritativeFee: trackConfig.fee,
        durationMinutes: trackConfig.durationMinutes,
        authoritativeLabel: trackConfig.label,
      };
    }
  }

  return {
    valid: true,
    authoritativeFee: trackConfig.fee,
    durationMinutes: trackConfig.durationMinutes,
    authoritativeLabel: trackConfig.label,
  };
}
