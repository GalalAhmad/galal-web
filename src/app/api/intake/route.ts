import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, whatsapp, email, track, preferred_approach, delivery_mode, preferred_time, notes } = body;

    if (!full_name || !whatsapp || !email || !track) {
      return NextResponse.json(
        { error: 'جميع الحقول الأساسية مطلوبة (الاسم، الواتساب، البريد، والمسار)' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('intake_requests').insert([
        {
          full_name,
          whatsapp,
          email,
          track,
          preferred_approach: preferred_approach || 'islamic_framework',
          delivery_mode: delivery_mode || 'online',
          preferred_time: preferred_time || 'any',
          notes: notes || '',
          status: 'new'
        }
      ]).select();

      if (error) {
        console.error('Supabase error inserting intake request:', error);
        return NextResponse.json(
          { error: 'تعذر حفظ الطلب في قاعدة البيانات' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data });
    }

    // Local / Dev Fallback
    console.log('Intake received (local fallback):', { full_name, whatsapp, email, track });
    return NextResponse.json({
      success: true,
      message: 'تم استلام طلبك بنجاح وسيتواصل معك فريق التنسيق'
    });

  } catch (error) {
    console.error('Intake route error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع أثناء معالجة الطلب' },
      { status: 500 }
    );
  }
}
