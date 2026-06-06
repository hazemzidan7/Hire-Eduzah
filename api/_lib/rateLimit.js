'use strict';
/**
 * IP-based rate limiting stored in Supabase.
 * Used specifically for the login endpoint (brute force protection).
 *
 * Table: login_attempts (ip TEXT, attempted_at TIMESTAMPTZ, success BOOLEAN)
 */

const MAX_FAILURES    = 5;    // lock after 5 failed attempts
const WINDOW_MINUTES  = 15;   // within 15-minute window
const LOCKOUT_MINUTES = 30;   // locked out for 30 minutes after MAX_FAILURES

function _supabaseHeaders() {
  return {
    apikey:         process.env.SUPABASE_SERVICE_KEY,
    Authorization:  `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };
}
function _url(path) { return `${process.env.SUPABASE_URL}/rest/v1/${path}`; }

/** Returns true if IP is currently locked out */
async function isLockedOut(ip) {
  try {
    const since = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000).toISOString();
    const qs    = `ip=eq.${encodeURIComponent(ip)}&success=eq.false&attempted_at=gte.${since}&select=id`;
    const res   = await fetch(_url(`login_attempts?${qs}`), { headers: _supabaseHeaders() });
    const rows  = await res.json();
    return Array.isArray(rows) && rows.length >= MAX_FAILURES;
  } catch {
    return false; // fail open — don't block legitimate users on DB error
  }
}

/** Record a login attempt */
async function recordAttempt(ip, success) {
  try {
    await fetch(_url('login_attempts'), {
      method:  'POST',
      headers: { ..._supabaseHeaders(), Prefer: 'return=minimal' },
      body:    JSON.stringify({ ip, success }),
    });
  } catch { /* non-critical */ }
}

/** Delay response to slow down brute force (1s on failure) */
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

module.exports = { isLockedOut, recordAttempt, delay };
