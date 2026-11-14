import fs from 'fs/promises';
import path from 'path';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/admin';

export interface ClinicalAuditEntry {
  timestamp?: string;
  actorId: string;
  actorName?: string;
  actorRole: string;
  action:
    | 'READ_SOAP_NOTES'
    | 'WRITE_SOAP_NOTE'
    | 'READ_DOSSIER'
    | 'ASSIGN_HOMEWORK'
    | 'UPDATE_HOMEWORK'
    | 'READ_JOURNAL';
  targetClientId?: string;
  targetSessionId?: string;
  ip?: string;
  status: 'SUCCESS' | 'FORBIDDEN' | 'FAILED';
  details?: Record<string, any>;
}

const AUDIT_FILE = path.join(process.cwd(), 'src', 'data', 'clinical_audit_logs.jsonl');

/**
 * Records an immutable audit log entry for every clinical data access or mutation.
 */
export async function logClinicalAccess(entry: ClinicalAuditEntry): Promise<void> {
  const record = {
    ...entry,
    timestamp: entry.timestamp || new Date().toISOString(),
  };

  // 1. Immutable write to Supabase clinical_audit_logs table (Primary authoritative store)
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from('clinical_audit_logs').insert({
        actor_id: record.actorId,
        actor_role: record.actorRole,
        action: record.action,
        target_client_id: record.targetClientId || null,
        target_session_id: record.targetSessionId || null,
        client_ip: record.ip || null,
        status: record.status,
        details: record.details || {},
        created_at: record.timestamp,
      });

      if (error) {
        console.error('[AUDIT_ERROR] Failed to record clinical audit log to Supabase:', error);
      }
    } catch (sbErr) {
      console.error('[AUDIT_CRITICAL] Exception recording clinical audit log to Supabase:', sbErr);
    }
  } else if (process.env.NODE_ENV === 'production') {
    console.error(
      '[AUDIT_CRITICAL] Remote database is unconfigured in production! Clinical audit log cannot be securely committed.'
    );
  }

  // 2. Local scratch file write ONLY in non-production development environments
  if (process.env.NODE_ENV !== 'production') {
    try {
      const line = JSON.stringify(record) + '\n';
      await fs.appendFile(AUDIT_FILE, line, 'utf8');
    } catch (e) {
      console.warn('[AUDIT] Failed to append to local dev audit log:', e);
    }
  }
}
