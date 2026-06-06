'use strict';
/**
 * POST /api/submit
 * Receives job application form data.
 * Validates, sanitizes, then inserts into Supabase.
 * On success, fires a non-blocking email notification via Resend.
 */
const { dbInsert }            = require('./_lib/db');
const { sanitizeDeep, validateApplication } = require('./_lib/validate');

const POSITION_LABELS = {
  'kids-coding':         'Coding Instructor (Kids)',
  'prog-fundamentals':   'Programming Fundamentals Instructor',
  'cybersecurity':       'Cybersecurity Instructor',
  'data-analysis':       'Data Analysis Instructor',
  'ai-instructor':       'AI Instructor',
  'english-instructor':  'English Instructor',
  'robotics-instructor': 'Robotics Instructor',
  'sales':               'Sales Representative',
  'designer':            'Graphic Designer',
  'project-management':  'Project Manager',
};

async function sendNotification(d) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const pos  = POSITION_LABELS[d.position] || d.position;
  const name = d.nameEn || d.nameAr || '—';

  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
      <h2 style="color:#6d28d9;margin-bottom:4px">New Application 📋</h2>
      <p style="color:#6b7280;margin-top:0">hire.eduzah.com</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px">
        <tr><td style="padding:8px 0;font-weight:600;width:130px">Name</td><td style="padding:8px 0">${name}</td></tr>
        <tr style="background:#f9fafb"><td style="padding:8px 4px;font-weight:600">Position</td><td style="padding:8px 4px">${pos}</td></tr>
        <tr><td style="padding:8px 0;font-weight:600">Email</td><td style="padding:8px 0">${d.email || '—'}</td></tr>
        <tr style="background:#f9fafb"><td style="padding:8px 4px;font-weight:600">Phone</td><td style="padding:8px 4px">${d.phone || '—'}</td></tr>
        <tr><td style="padding:8px 0;font-weight:600">Governorate</td><td style="padding:8px 0">${d.gov || '—'}</td></tr>
      </table>
    </div>`;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || 'Eduzah Hiring <onboarding@resend.dev>',
      to:   ['hazemzidan833@gmail.com'],
      subject: `[Eduzah] New Application — ${pos}: ${name}`,
      html,
    }),
  });
  if (!r.ok) {
    const t = await r.text().catch(() => '');
    throw new Error(`Resend ${r.status}: ${t.slice(0, 200)}`);
  }
}

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
    // Fire-and-forget email — never block or fail the submission because of it
    sendNotification(d).catch(e => console.warn('[notify] email failed:', e.message));
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[submit] DB error:', err.message);
    return res.status(500).json({ error: 'Submission failed. Please try again.' });
  }
};
