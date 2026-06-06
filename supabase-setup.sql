-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS applications (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  submitted_at  TIMESTAMPTZ DEFAULT NOW(),
  position      TEXT,
  name_ar       TEXT,
  name_en       TEXT,
  phone         TEXT,
  email         TEXT,
  work_mode     TEXT,
  work_type     TEXT,
  city          TEXT,
  gov           TEXT,
  video_link    TEXT,
  cv_file_url   TEXT,
  photo_file_url TEXT,
  natid_front_url TEXT,
  natid_back_url  TEXT,
  data          JSONB NOT NULL DEFAULT '{}'
);

-- Enable Row Level Security
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Anyone can submit (INSERT)
CREATE POLICY "public_insert" ON applications
  FOR INSERT TO anon WITH CHECK (true);

-- Anyone can read (SELECT) — admin dashboard uses app-level password
CREATE POLICY "public_select" ON applications
  FOR SELECT TO anon USING (true);
