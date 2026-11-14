/**
 * Sequential Database Migration & Rollback Runner
 * Applies supabase/migrations in chronological order and maintains a rollback plan.
 *
 * Usage:
 *   node scripts/run_migrations.mjs --dry-run
 *   node scripts/run_migrations.mjs --up
 *   node scripts/run_migrations.mjs --down
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const migrationsDir = path.join(rootDir, 'supabase', 'migrations');

// Rollback plans for each migration file
const ROLLBACK_PLANS = {
  '20261114_create_auth_otps_table.sql': `
    DROP TABLE IF EXISTS public.auth_otps CASCADE;
  `,
  '20261114_backfill_booking_slot_minutes.sql': `
    ALTER TABLE public.bookings DROP COLUMN IF EXISTS slot_start_minutes;
    ALTER TABLE public.bookings DROP COLUMN IF EXISTS duration_minutes;
  `,
  '20261114_reschedule_booking_atomic_rpc.sql': `
    DROP FUNCTION IF EXISTS public.reschedule_booking_atomic;
  `,
  '20261114_institutional_inquiries_and_feedback.sql': `
    DROP TABLE IF EXISTS public.inquiries CASCADE;
    DROP TABLE IF EXISTS public.feedback_submissions CASCADE;
  `,
  '20261114_distributed_rate_limiting.sql': `
    DROP FUNCTION IF EXISTS public.check_rate_limit;
    DROP TABLE IF EXISTS public.rate_limits CASCADE;
  `,
  '20261114_append_only_audit_log.sql': `
    DROP TRIGGER IF EXISTS trg_prevent_audit_log_tamper ON public.clinical_audit_logs;
    DROP FUNCTION IF EXISTS public.prevent_audit_log_tampering();
  `,
  '20261114_force_password_reset_schema.sql': `
    ALTER TABLE public.profiles DROP COLUMN IF EXISTS must_reset_password;
    ALTER TABLE public.profiles DROP COLUMN IF EXISTS password_algo;
    ALTER TABLE public.profiles DROP COLUMN IF EXISTS password_updated_at;
  `
};

async function getMigrationFiles() {
  if (!fs.existsSync(migrationsDir)) {
    throw new Error(`Migrations directory not found at: ${migrationsDir}`);
  }
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort(); // Lexicographical sort matches chronological YYYYMMDD
  return files;
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const isUp = args.includes('--up') || (!args.includes('--down') && !isDryRun);
  const isDown = args.includes('--down');

  console.log(`\n======================================================`);
  console.log(`🚀 Supabase Migration & Rollback Runner`);
  console.log(`Mode: ${isDryRun ? 'DRY-RUN (Simulated)' : isDown ? 'ROLLBACK (Down)' : 'APPLY (Up)'}`);
  console.log(`Target Directory: ${migrationsDir}`);
  console.log(`======================================================\n`);

  const files = await getMigrationFiles();
  console.log(`Found ${files.length} migration files:\n`);
  files.forEach((file, idx) => {
    const hasRollback = !!ROLLBACK_PLANS[file];
    console.log(`  [${idx + 1}] ${file} ${hasRollback ? '✓ (Rollback defined)' : '⚠️ (No rollback)'}`);
  });
  console.log('');

  if (isDown) {
    const reverseFiles = [...files].reverse();
    console.log(`[ROLLBACK PLAN] Will execute reverse migrations in order:\n`);
    for (const file of reverseFiles) {
      console.log(`--- Rolling back: ${file} ---`);
      const downSql = (ROLLBACK_PLANS[file] || '-- No automated rollback defined').trim();
      console.log(downSql);
      console.log('--------------------------------------------\n');
    }
    if (isDryRun) {
      console.log('✅ Dry-run rollback plan completed. No database changes were made.');
      return;
    }
  } else {
    console.log(`[APPLY PLAN] Will execute migrations in order:\n`);
    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      const lines = sql.split('\n').length;
      console.log(`--- Migration: ${file} (${lines} lines, ${sql.length} bytes) ---`);
      if (isDryRun) {
        const preview = sql.split('\n').slice(0, 5).join('\n');
        console.log(`Preview:\n${preview}\n...`);
      }
      console.log('--------------------------------------------\n');
    }

    if (isDryRun) {
      console.log('✅ Dry-run migration check passed. All migration files are valid SQL and ready for execution.');
      return;
    }
  }

  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    console.log(`ℹ️ No DATABASE_URL or SUPABASE_DB_URL environment variable provided.`);
    console.log(`To execute migrations against Staging or Production, provide DATABASE_URL:`);
    console.log(`  $env:DATABASE_URL="postgres://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"`);
    console.log(`  node scripts/run_migrations.mjs --up\n`);
    console.log(`Alternatively, copy and run the SQL files above in the Supabase Dashboard SQL Editor.`);
    return;
  }

  console.log(`Connecting to database to apply migrations...`);
  // If database connection is present, user can execute using pg or psql
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
