import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

const filePath = path.join(process.cwd(), 'src', 'data', 'inquiries.json');

async function readInquiries() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
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

export async function GET() {
  try {
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
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read inquiries' }, { status: 500 });
  }
}

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
      instType: instType || 'مدرسة / مجمع تعليمي',
      inquiry: inquiry || '',
      status: 'new',
      created_at: new Date().toISOString(),
    };

    // Save locally
    const current = await readInquiries();
    const updated = [newInquiry, ...current];
    await writeInquiries(updated);

    // Save to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('institutional_inquiries').insert([newInquiry]);
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

export async function PATCH(request: Request) {
  try {
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
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}
