'use strict';
/**
 * POST /api/admin
 * Returns all applicant data — requires valid JWT in HttpOnly cookie.
 *
 * Security:
 * - JWT validation (HMAC-SHA256, timing-safe comparison)
 * - Token from HttpOnly cookie (never accessible from JS)
 * - Service role key never leaves server
 * - Generic error messages (no internals exposed)
 */
const { verifyToken, tokenFromRequest } = require('./_lib/auth');
const { dbSelect }                      = require('./_lib/db');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  // ── 1. Extract and verify JWT from cookie ─────────────────────────────────
  const token = tokenFromRequest(req);
  try {
    const payload = verifyToken(token);
    if (payload.role !== 'admin') throw new Error('Insufficient permissions');
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // ── 2. Fetch data using service role key (server-side only) ───────────────
  try {
    const rows = await dbSelect('applications', 'order=submitted_at.desc');
    return res.status(200).json(rows);
  } catch (err) {
    console.error('[admin] DB error:', err.message);
    return res.status(500).json({ error: 'Failed to load data' });
  }
};
