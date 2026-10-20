import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'data', 'waitlist.json');

async function readWaitlist() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeWaitlist(data: any[]) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing waitlist.json:', err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, contact, interestTopic, preferredSchedule, notes } = body;

    if (!name || !contact) {
      return NextResponse.json(
        { error: 'الاسم ورقم التواصل أو البريد حقول مطلوبة' },
        { status: 400 }
      );
    }

    const newEntry = {
      id: `w-${Date.now()}`,
      name: name.trim(),
      contact: contact.trim(),
      interestTopic: interestTopic || 'المجموعات العلاجية العامة',
      preferredSchedule: preferredSchedule || 'مسائي',
      notes: notes || '',
      created_at: new Date().toISOString(),
    };

    const currentList = await readWaitlist();
    currentList.push(newEntry);
    await writeWaitlist(currentList);

    return NextResponse.json({
      success: true,
      message: 'تم تسجيلك بنجاح في قائمة الانتظار، وسنتواصل معك فور فتح باب التسجيل للمجموعة.',
    });
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حفظ البيانات، يرجى المحاولة لاحقاً' },
      { status: 500 }
    );
  }
}
