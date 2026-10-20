import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'data', 'feedback.json');

async function readFeedback() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeFeedback(data: any[]) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing feedback.json:', err);
  }
}

export async function GET() {
  try {
    const items = await readFeedback();
    return NextResponse.json({ success: true, feedback: items });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read feedback' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, sessionType, serviceCategory, rating, feedback, location } = body;

    if (!feedback || !rating) {
      return NextResponse.json(
        { error: 'يرجى كتابة نص التقييم وتحديد الدرجة' },
        { status: 400 }
      );
    }

    const newItem = {
      id: `fb-${Date.now()}`,
      clientName: clientName || 'مستفيد كريم',
      sessionType: sessionType || 'استشارة نفسية وأسرية',
      serviceCategory: serviceCategory || 'psychological',
      rating: Number(rating) || 5,
      feedback: feedback.trim(),
      location: location || 'أونلاين',
      isPublished: false,
      created_at: new Date().toISOString(),
    };

    const current = await readFeedback();
    const updated = [newItem, ...current];
    await writeFeedback(updated);

    return NextResponse.json({
      success: true,
      message: 'شكراً جزيلاً لرأيك القيم! تم استلام تقييمك بنجاح.',
      item: newItem,
    });
  } catch (error) {
    console.error('Feedback POST error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إرسال التقييم' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isPublished, action } = body;

    const current = await readFeedback();

    if (action === 'delete') {
      const updated = current.filter((item: any) => item.id !== id);
      await writeFeedback(updated);
      return NextResponse.json({ success: true, feedback: updated });
    }

    const updated = current.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          isPublished: typeof isPublished === 'boolean' ? isPublished : !item.isPublished,
        };
      }
      return item;
    });

    await writeFeedback(updated);
    return NextResponse.json({ success: true, feedback: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update feedback' }, { status: 500 });
  }
}
