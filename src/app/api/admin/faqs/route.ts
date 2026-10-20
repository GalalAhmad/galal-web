import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'data', 'faqs.json');

async function readFaqs() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeFaqs(data: any[]) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing faqs.json:', err);
  }
}

export async function GET() {
  try {
    const localData = await readFaqs();
    return NextResponse.json({ success: true, faqs: localData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read FAQs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, id, q, a } = body;

    let currentList = await readFaqs();

    if (action === 'delete') {
      currentList = currentList.filter((item: any) => item.id !== id);
      await writeFaqs(currentList);
      return NextResponse.json({ success: true, faqs: currentList });
    }

    if (action === 'edit') {
      const idx = currentList.findIndex((item: any) => item.id === id);
      if (idx !== -1) {
        currentList[idx] = { ...currentList[idx], q, a };
        await writeFaqs(currentList);
      }
      return NextResponse.json({ success: true, faqs: currentList });
    }

    // Default: Add new FAQ
    if (!q || !a) {
      return NextResponse.json({ error: 'السؤال والإجابة مطلوبان' }, { status: 400 });
    }

    const newItem = {
      id: `faq-${Date.now()}`,
      q: q.trim(),
      a: a.trim(),
    };

    currentList.push(newItem);
    await writeFaqs(currentList);

    return NextResponse.json({ success: true, faqs: currentList, item: newItem });
  } catch (error) {
    console.error('FAQ error:', error);
    return NextResponse.json({ error: 'Failed to manage FAQ' }, { status: 500 });
  }
}
