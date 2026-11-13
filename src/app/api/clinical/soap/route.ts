import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/serverAuth';
import { parseClinicalDossier } from '@/lib/clinical/dossierParser';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET: Retrieve SOAP notes for a specific client or session (Counselor ONLY — Admin strictly prohibited)
export async function GET(request: Request) {
  try {
    const authCheck = requireRole(request, ['counselor']);
    if (!authCheck.user) {
      return authCheck.response;
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const sessionId = searchParams.get('sessionId');

    if (!clientId && !sessionId) {
      return NextResponse.json({ error: 'معرّف العميل أو الجلسة مطلوب للوصول إلى السجل الإكلينيكي' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      let query = supabaseAdmin
        .from('session_soap_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (sessionId) query = query.eq('session_id', sessionId);
      else if (clientId) query = query.eq('client_id', clientId);

      const { data, error } = await query;
      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
          console.warn('[SOAP] session_soap_notes table not yet present in Supabase cache. Returning empty list gracefully.');
          return NextResponse.json({ success: true, notes: [] });
        }
        console.error('Supabase SOAP fetch error:', error);
        return NextResponse.json({ error: 'فشل استرجاع سجلات SOAP من قاعدة البيانات' }, { status: 500 });
      }
      return NextResponse.json({ success: true, notes: data || [] });
    }

    return NextResponse.json({ success: true, notes: [] });
  } catch (error) {
    console.error('Error fetching SOAP notes:', error);
    return NextResponse.json({ error: 'تعذر جلب سجلات SOAP الإكلينيكية' }, { status: 500 });
  }
}

// POST: Save new SOAP note and link to client session (Counselor ONLY)
export async function POST(request: Request) {
  try {
    const authCheck = requireRole(request, ['counselor']);
    if (!authCheck.user) {
      return authCheck.response;
    }

    const body = await request.json();
    const {
      sessionId,
      clientId,
      subjective,
      objective,
      assessment,
      plan,
      aiSummary,
      homeworkTitle,
    } = body;

    if (!clientId) {
      return NextResponse.json({ error: 'معرّف المستفيد (clientId) مطلوب لربط السجل السريري بالملف الطبي' }, { status: 400 });
    }

    if (!subjective && !objective && !assessment && !plan) {
      return NextResponse.json(
        { error: 'يجب كتابة عنصر واحد على الأقل من عناصر السجل الإكلينيكي SOAP' },
        { status: 400 }
      );
    }

    const noteId = `soap-${Date.now()}`;
    const newSoapNote = {
      id: noteId,
      session_id: sessionId || `ses-${Date.now()}`,
      client_id: clientId,
      subjective_notes: subjective || '',
      objective_observations: objective || '',
      assessment_notes: assessment || '',
      plan_notes: plan || '',
      ai_generated_summary: aiSummary || '',
      assigned_homework: homeworkTitle || '',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabaseAdmin) {
      const { error: soapInsertErr } = await supabaseAdmin
        .from('session_soap_notes')
        .insert([newSoapNote]);

      if (soapInsertErr) {
        if (soapInsertErr.code === 'PGRST205' || soapInsertErr.message?.includes('schema cache')) {
          console.warn('[SOAP] session_soap_notes table not yet present in Supabase cache. Continuing with profile dossier update.');
        } else {
          console.error('Supabase SOAP note insert error:', soapInsertErr);
          return NextResponse.json(
            { error: 'تعذر حفظ السجل الإكلينيكي SOAP في قاعدة البيانات السحابية' },
            { status: 500 }
          );
        }
      }

      // Append summary to client's clinical profile
      try {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('id', clientId)
          .maybeSingle();

        if (profile) {
          const dossier = parseClinicalDossier(profile.clinical_notes);
          const soapSummarySnippet = `\n[جلسة SOAP بتاريخ ${new Date().toLocaleDateString('ar-EG')}]: التقييم: ${assessment || 'متابعة'} | الخطة: ${plan || ''}`;
          const updatedNotes = (dossier.notes ? dossier.notes + '\n' : '') + soapSummarySnippet;

          await supabaseAdmin
            .from('profiles')
            .update({
              clinical_notes: JSON.stringify({ ...dossier, notes: updatedNotes }),
              updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id);
        }
      } catch (profileErr) {
        console.warn('Profile clinical dossier summary update warning:', profileErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم اعتماد وحفظ السجل الإكلينيكي SOAP بنجاح في الملف السريري',
      note: newSoapNote,
    });
  } catch (error) {
    console.error('Error saving SOAP note:', error);
    return NextResponse.json({ error: 'تعذر حفظ السجل الإكلينيكي SOAP' }, { status: 500 });
  }
}
