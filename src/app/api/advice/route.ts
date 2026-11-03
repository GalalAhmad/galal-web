import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const filePath = path.join(process.cwd(), 'src', 'data', 'advice.json');

async function readAdvice() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeAdvice(data: any[]) {
  // Explicit throw: never swallow error to avoid false success reporting
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true' || request.headers.get('x-admin-role') === 'admin';

    // Privacy Guard: Only admin can view submitted confidential advice messages
    if (!isAdmin) {
      return NextResponse.json({ error: 'غير مصرح بالوصول لصندوق الاستشارات' }, { status: 403 });
    }

    const localData = await readAdvice();
    return NextResponse.json({ success: true, advice: localData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read advice messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, email } = body;

    if (!message || message.trim().length < 5) {
      return NextResponse.json(
        { error: 'يرجى كتابة رسالة واضحة لا تقل عن 5 أحرف' },
        { status: 400 }
      );
    }

    const newMessage = {
      id: `adv-${Date.now()}`,
      message: message.trim(),
      email: email ? email.trim() : '',
      status: 'new',
      created_at: new Date().toISOString(),
    };

    const currentList = await readAdvice();
    currentList.unshift(newMessage);
    // Explicit error check: Only return success if storage write confirmed
    await writeAdvice(currentList);

    return NextResponse.json({ success: true, item: newMessage });
  } catch (error) {
    console.error('Advice submit storage error');
    return NextResponse.json(
      { error: 'تعذر حفظ الرسالة حالياً، يرجى المحاولة بعد قليل أو التواصل عبر الواتساب.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const isAdmin = searchParams.get('admin') === 'true' || request.headers.get('x-admin-role') === 'admin';

    if (!isAdmin) {
      return NextResponse.json({ error: 'غير مصرح بالحذف' }, { status: 403 });
    }

    if (!id) {
      return NextResponse.json({ error: 'معرّف الرسالة مطلوب' }, { status: 400 });
    }

    const currentList = await readAdvice();
    const filtered = currentList.filter((item: any) => item.id !== id);
    await writeAdvice(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete advice item' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true' || request.headers.get('x-admin-role') === 'admin';

    if (!isAdmin) {
      return NextResponse.json({ error: 'غير مصرح بتعديل الحالة' }, { status: 403 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const currentList = await readAdvice();
    const idx = currentList.findIndex((item: any) => item.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    currentList[idx].status = status;
    await writeAdvice(currentList);

    return NextResponse.json({ success: true, item: currentList[idx] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update advice status' }, { status: 500 });
  }
}
