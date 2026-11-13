import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB max
const BUCKET_NAME = 'payment-receipts';
const LOCAL_RECEIPTS_DIR = path.join(process.cwd(), 'src', 'data', 'receipts_vault');

interface ValidationResult {
  valid: boolean;
  error?: string;
  mime?: string;
  ext?: string;
  buffer?: Buffer;
}

/**
 * Validates file buffer magic bytes to ensure real image/PDF content (no disguised executables)
 */
export function validateReceiptFile(base64Data: string): ValidationResult {
  if (!base64Data || typeof base64Data !== 'string') {
    return { valid: false, error: 'لم يتم تقديم ملف الإيصال' };
  }

  let cleanBase64 = base64Data;
  let declaredMime = '';

  if (base64Data.startsWith('data:')) {
    const metaEnd = base64Data.indexOf(';base64,');
    if (metaEnd !== -1) {
      declaredMime = base64Data.slice(5, metaEnd).toLowerCase();
      cleanBase64 = base64Data.slice(metaEnd + 8);
    }
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(cleanBase64, 'base64');
  } catch {
    return { valid: false, error: 'تنسيق الملف غير صالح (ترميز Base64 تالف)' };
  }

  if (buffer.length > MAX_FILE_SIZE) {
    return { valid: false, error: 'حجم إيصال السداد يتجاوز الحد الأقصى المسموح (5 ميجابايت)' };
  }

  if (buffer.length < 12) {
    return { valid: false, error: 'الملف فارغ أو غير صالح' };
  }

  // Magic bytes inspection
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, mime: 'image/jpeg', ext: 'jpg', buffer };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { valid: true, mime: 'image/png', ext: 'png', buffer };
  }

  // WebP: RIFF .... WEBP
  const isRiff = buffer.toString('ascii', 0, 4) === 'RIFF';
  const isWebp = buffer.toString('ascii', 8, 12) === 'WEBP';
  if (isRiff && isWebp) {
    return { valid: true, mime: 'image/webp', ext: 'webp', buffer };
  }

  // PDF: %PDF
  if (buffer.toString('ascii', 0, 4) === '%PDF') {
    return { valid: true, mime: 'application/pdf', ext: 'pdf', buffer };
  }

  return {
    valid: false,
    error: 'نوع الملف غير مدعوم. يرجى رفع صورة واضحة (JPG, PNG, WebP) أو ملف PDF للإيصال.',
  };
}

/**
 * Stores the receipt into private Supabase Storage bucket or local secure vault,
 * returning a lightweight reference key instead of bloating the database with raw Base64.
 */
export async function storeReceiptFile(bookingId: string, base64Data: string): Promise<string> {
  const validation = validateReceiptFile(base64Data);
  if (!validation.valid || !validation.buffer) {
    throw new Error(validation.error || 'الملف المرفق غير صالح');
  }

  const randomToken = crypto.randomBytes(16).toString('hex');
  const filename = `${bookingId}-${randomToken}.${validation.ext}`;

  // 1. Try Supabase Storage Bucket
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .upload(`receipts/${filename}`, validation.buffer, {
          contentType: validation.mime,
          upsert: true,
        });

      if (!error && data?.path) {
        return `storage://${BUCKET_NAME}/${data.path}`;
      }
    } catch (e) {
      console.error('Supabase storage upload error:', e);
    }
  }

  // 2. Fallback to local secure vault (outside client bundle)
  try {
    await fs.mkdir(LOCAL_RECEIPTS_DIR, { recursive: true });
    const localFilePath = path.join(LOCAL_RECEIPTS_DIR, filename);
    await fs.writeFile(localFilePath, validation.buffer);
    return `vault://${filename}`;
  } catch (fsErr) {
    console.error('Local receipt vault error:', fsErr);
    // If filesystem is read-only (e.g. serverless) and Supabase storage wasn't ready,
    // return a clean metadata indicator without storing raw megabytes
    return `inline://${validation.mime};size=${validation.buffer.length}`;
  }
}

/**
 * Retrieves receipt binary and MIME type securely by storage reference
 */
export async function retrieveReceiptFile(
  receiptRef: string
): Promise<{ buffer: Buffer; mime: string } | null> {
  if (!receiptRef || typeof receiptRef !== 'string') return null;

  // 1. Supabase Storage Reference: storage://<bucket>/<path>
  if (receiptRef.startsWith('storage://')) {
    const raw = receiptRef.replace('storage://', '');
    const slashIdx = raw.indexOf('/');
    if (slashIdx !== -1) {
      const bucket = raw.substring(0, slashIdx);
      const filePath = raw.substring(slashIdx + 1);
      if (isSupabaseConfigured && supabaseAdmin) {
        try {
          const { data, error } = await supabaseAdmin.storage.from(bucket).download(filePath);
          if (!error && data) {
            const arrayBuffer = await data.arrayBuffer();
            const mime = data.type || 'application/octet-stream';
            return { buffer: Buffer.from(arrayBuffer), mime };
          }
        } catch (downloadErr) {
          console.error('Failed to download receipt from Supabase storage:', downloadErr);
        }
      }
    }
  }

  // 2. Local Vault Reference: vault://<filename>
  if (receiptRef.startsWith('vault://')) {
    const filename = path.basename(receiptRef.replace('vault://', ''));
    const fullPath = path.join(LOCAL_RECEIPTS_DIR, filename);
    try {
      const buffer = await fs.readFile(fullPath);
      const ext = path.extname(filename).toLowerCase();
      let mime = 'application/octet-stream';
      if (ext === '.jpg' || ext === '.jpeg') mime = 'image/jpeg';
      else if (ext === '.png') mime = 'image/png';
      else if (ext === '.webp') mime = 'image/webp';
      else if (ext === '.pdf') mime = 'application/pdf';
      return { buffer, mime };
    } catch {
      return null;
    }
  }

  // 3. Legacy Base64 / Data URI
  if (receiptRef.startsWith('data:')) {
    const metaEnd = receiptRef.indexOf(';base64,');
    if (metaEnd !== -1) {
      const mime = receiptRef.slice(5, metaEnd);
      const cleanBase64 = receiptRef.slice(metaEnd + 8);
      try {
        const buffer = Buffer.from(cleanBase64, 'base64');
        return { buffer, mime };
      } catch {
        return null;
      }
    }
  }

  return null;
}
