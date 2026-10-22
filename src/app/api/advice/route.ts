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
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing advice.json:', err);
  }
}

export async function GET() {
  try {
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
        { error: 'يرجى كتابة رسالة لا تقل عن 5 أحرف' },
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
    await writeAdvice(currentList);

    return NextResponse.json({ success: true, item: newMessage });
  } catch (error) {
    console.error('Advice submit error:', error);
    return NextResponse.json({ error: 'Failed to submit advice' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
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
