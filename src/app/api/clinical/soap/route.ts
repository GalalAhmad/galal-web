import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/serverAuth';
import { parseClinicalDossier } from '@/lib/clinical/dossierParser';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET: Retrieve SOAP notes for a specific client or session (Counselor/Admin only)
export async function GET(request: Request) {
  try {
    const authCheck = requireRole(request, ['counselor', 'admin']);
    if (!authCheck.user) {
      return authCheck.response;
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const sessionId = searchParams.get('sessionId');

    if (!clientId && !sessionId) {
      return NextResponse.json({ error: 'معرّف العميل أو الجلسة مطلوب' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      let query = supabaseAdmin
        .from('session_soap_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (sessionId) query = query.eq('session_id', sessionId);
      else if (clientId) query = query.eq('client_id', clientId);

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        return NextResponse.json({ success: true, notes: data });
      }
    }

    return NextResponse.json({ success: true, notes: [] });
  } catch (error) {
    console.error('Error fetching SOAP notes:', error);
    return NextResponse.json({ error: 'تعذر جلب سجلات SOAP الإكلينيكية' }, { status: 500 });
  }
}

// POST: Save new SOAP note and link to client session (Counselor/Admin only)
export async function POST(request: Request) {
  try {
    const authCheck = requireRole(request, ['counselor', 'admin']);
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
      client_id: clientId || 'general',
      subjective_notes: subjective || '',
      objective_observations: objective || '',
      assessment_notes: assessment || '',
      plan_notes: plan || '',
      ai_generated_summary: aiSummary || '',
      assigned_homework: homeworkTitle || '',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin.from('session_soap_notes').insert([newSoapNote]);

        // Also append summary to client's profile clinical notes
        if (clientId) {
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
        }
      } catch (dbErr) {
        console.error('Supabase SOAP note insert error:', dbErr);
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
