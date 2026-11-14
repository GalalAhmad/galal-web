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

  // 1. Try Supabase clinical_audit_logs table
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('clinical_audit_logs').insert({
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
    } catch {
      // Table might not exist yet; fall back silently to append log
    }
  }

  // 2. Append to local audit file (except in production if storage is read-only)
  try {
    const line = JSON.stringify(record) + '\n';
    await fs.appendFile(AUDIT_FILE, line, 'utf8');
  } catch (e) {
    console.warn('[AUDIT] Failed to append to local audit log:', e);
  }
}
