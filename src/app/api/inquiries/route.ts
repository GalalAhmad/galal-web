import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { requireRole } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const filePath = path.join(process.cwd(), 'src', 'data', 'inquiries.json');

async function readInquiries() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeInquiries(data: any[]) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing inquiries.json:', err);
  }
}

// GET: List all inquiries (Admin Only)
export async function GET(request: Request) {
  try {
    const authCheck = requireRole(request, ['admin']);
    if (!authCheck.user) {
      return authCheck.response;
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('institutional_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, inquiries: data });
      }
    }

    const localData = await readInquiries();
    return NextResponse.json({ success: true, inquiries: localData });
  } catch {
    return NextResponse.json({ error: 'Failed to read inquiries' }, { status: 500 });
  }
}

// POST: Public submission of institutional inquiries
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { instName, contactPerson, phone, instType, inquiry } = body;

    if (!instName || !contactPerson || !phone) {
      return NextResponse.json(
        { error: 'يرجى إدخال اسم المؤسسة، اسم المسؤول، ورقم الهاتف للتواصل' },
        { status: 400 }
      );
    }

    const newInquiry = {
      id: `inq-${Date.now()}`,
      instName,
      contactPerson,
      phone,
      instType: instType || 'other',
      inquiry: inquiry || '',
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const current = await readInquiries();
    current.unshift(newInquiry);
    await writeInquiries(current);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('institutional_inquiries').insert([
          {
            id: newInquiry.id,
            inst_name: instName,
            contact_person: contactPerson,
            phone: phone,
            inst_type: instType || 'other',
            inquiry: inquiry || '',
            status: 'pending',
            created_at: newInquiry.created_at,
          },
        ]);
      } catch (sbError) {
        console.error('Supabase error inserting inquiry:', sbError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم استلام طلبكم بنجاح وسيتواصل معكم فريق العمل في أقرب وقت',
      inquiry: newInquiry,
    });
  } catch (error) {
    console.error('Inquiries POST error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء معالجة الطلب' }, { status: 500 });
  }
}

// PATCH: Update or delete inquiry (Admin Only)
export async function PATCH(request: Request) {
  try {
    const authCheck = requireRole(request, ['admin']);
    if (!authCheck.user) {
      return authCheck.response;
    }

    const body = await request.json();
    const { id, status, action } = body;

    const current = await readInquiries();

    if (action === 'delete') {
      const updated = current.filter((item: any) => item.id !== id);
      await writeInquiries(updated);
      return NextResponse.json({ success: true, inquiries: updated });
    }

    const updated = current.map((item: any) => {
      if (item.id === id) {
        return { ...item, status: status || item.status };
      }
      return item;
    });

    await writeInquiries(updated);
    return NextResponse.json({ success: true, inquiries: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}
