-- ============================================================
-- Run this in Supabase SQL Editor
-- Hardens security for production
-- ============================================================

-- 1. Remove ALL public access to applications table
DROP POLICY IF EXISTS "public_select" ON applications;
DROP POLICY IF EXISTS "public_insert" ON applications;
DROP POLICY IF EXISTS "Allow public insert" ON applications;
DROP POLICY IF EXISTS "Allow public select" ON applications;

-- 2. Create login_attempts table for brute force protection
CREATE TABLE IF NOT EXISTS login_attempts (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  ip           TEXT        NOT NULL,
  attempted_at TIMESTAMPTZ DEFAULT NOW(),
  success      BOOLEAN     DEFAULT FALSE
);

-- Index for fast IP lookups
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_time
  ON login_attempts (ip, attempted_at);

-- Enable RLS on login_attempts
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- No public access to login_attempts either
-- Service role key (server-side only) bypasses RLS automatically

-- 3. Auto-delete old login attempts (keep last 24h only)
-- Optional: run this periodically or set up a cron in Supabase
-- DELETE FROM login_attempts WHERE attempted_at < NOW() - INTERVAL '24 hours';

-- 4. Verify setup
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('applications', 'login_attempts');
