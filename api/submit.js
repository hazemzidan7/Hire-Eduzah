'use strict';
/**
 * POST /api/submit
 * Receives job application form data.
 * Validates, sanitizes, then inserts into Supabase.
 *
 * Security:
 * - Input validation + sanitization
 * - Honeypot anti-bot check
 * - File URL whitelist (Cloudinary only)
 * - Request size limit (handled by Vercel)
 * - No secrets in response
 */
const { dbInsert }            = require('./_lib/db');
const { sanitizeDeep, validateApplication } = require('./_lib/validate');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  // ── 1. Honeypot anti-bot ──────────────────────────────────────────────────
  // Form has a hidden field `_hp` that real users never fill
  const body = req.body || {};
  if (body._hp) {
    // Silent reject — bots don't need to know they were caught
    return res.status(200).json({ ok: true });
  }

  // ── 2. Validate required fields ───────────────────────────────────────────
  const errs = validateApplication(body);
  if (errs.length > 0) {
    return res.status(422).json({ error: 'Validation failed', fields: errs });
  }

  // ── 3. Deep sanitize all input ────────────────────────────────────────────
  const d = sanitizeDeep(body);

  // ── 4. Build safe DB row ──────────────────────────────────────────────────
  const row = {
    position:        d.position        || null,
    name_ar:         d.nameAr          || null,
    name_en:         d.nameEn          || null,
    phone:           d.phone           || null,
    email:           d.email           || null,
    work_mode:       d.workMode        || null,
    work_type:       d.workType        || null,
    city:            d.city            || null,
    gov:             d.gov             || null,
    video_link:      d.videoLink       || null,
    cv_file_url:     d.cvFileUrl       || null,
    photo_file_url:  d.photoFileUrl    || null,
    natid_front_url: d.natidFrontUrl   || null,
    natid_back_url:  d.natidBackUrl    || null,
    data:            d,                        // full sanitized payload in JSONB
  };

  // ── 5. Insert ─────────────────────────────────────────────────────────────
  try {
    await dbInsert('applications', row);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[submit] DB error:', err.message);
    // Return generic error — never expose DB internals
    return res.status(500).json({ error: 'Submission failed. Please try again.' });
  }
};
