import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'يرجى إدخال بريد إلكتروني صالح' },
        { status: 400 }
      );
    }

    const newSubscriber = {
      email: email.trim().toLowerCase(),
      source: source || 'lead_magnet',
      created_at: new Date().toISOString()
    };

    // 1. Supabase storage if available
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('subscribers').insert([newSubscriber]);
      } catch (dbErr) {
        console.error('Supabase subscriber insert error:', dbErr);
      }
    }

    // 2. Local JSON storage fallback / redundancy
    try {
      const filePath = path.join(process.cwd(), 'src/data/subscribers.json');
      let currentSubscribers: any[] = [];
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        try {
          currentSubscribers = JSON.parse(fileContent);
        } catch {
          currentSubscribers = [];
        }
      }
      
      const alreadyExists = currentSubscribers.some(
        (sub: any) => sub.email === newSubscriber.email
      );

      if (!alreadyExists) {
        currentSubscribers.push(newSubscriber);
        fs.writeFileSync(filePath, JSON.stringify(currentSubscribers, null, 2), 'utf8');
      }
    } catch (fsErr) {
      console.error('Local subscriber save error:', fsErr);
    }

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل بريدك بنجاح، يمكنك تحميل دليلك المجاني الآن.',
      downloadUrl: '{{LEAD_MAGNET_PDF}}'
    });

  } catch (error) {
    console.error('Newsletter route error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة الطلب' },
      { status: 500 }
    );
  }
}
