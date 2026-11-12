import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { requireRole } from '@/lib/serverAuth';

const filePath = path.join(process.cwd(), 'src', 'data', 'siteSettings.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function readSettings() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {
      siteName: "د. جلال أحمد",
      phone: "+20 101 487 6666",
      whatsapp: "201014876666",
      email: "info@galalahmad.com",
      cancellationPolicyHours: 48,
    };
  }
}

async function writeSettings(data: any) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing siteSettings.json:', err);
  }
}

export async function GET() {
  const settings = await readSettings();
  return NextResponse.json(
    { success: true, settings },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
  );
}

export async function POST(request: Request) {
  try {
    const authCheck = requireRole(request, ['admin']);
    if (!authCheck.user) {
      return authCheck.response;
    }

    const body = await request.json();
    const current = await readSettings();
    const updated = { ...current, ...body };
    await writeSettings(updated);
    return NextResponse.json({ success: true, settings: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
