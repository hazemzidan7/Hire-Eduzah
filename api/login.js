'use strict';
/**
 * POST /api/login
 * Validates admin password server-side.
 * Returns JWT as HttpOnly Secure cookie — token never touches JS.
 * Protected against brute force: lockout after 5 failures / 15 min.
 */
const { createToken, setTokenCookie } = require('./_lib/auth');
const { isLockedOut, recordAttempt, delay } = require('./_lib/rateLimit');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  // Get real IP (Vercel / Cloudflare)
  const ip = (
    req.headers['cf-connecting-ip'] ||
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket?.remoteAddress ||
    'unknown'
  ).trim().slice(0, 45);

  // Brute force check
  if (await isLockedOut(ip)) {
    return res.status(429).json({ error: 'Too many failed attempts. Try again in 30 minutes.' });
  }

  const { password } = req.body || {};

  const adminPwd = process.env.ADMIN_PASSWORD;
  if (!adminPwd) return res.status(500).json({ error: 'Server misconfigured' });

  // Validate (with artificial delay to slow down automation)
  if (!password || password !== adminPwd) {
    await recordAttempt(ip, false);
    await delay(1200); // 1.2s delay on every failure
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  await recordAttempt(ip, true);

  const token = createToken({ role: 'admin', ip });
  setTokenCookie(res, token);

  return res.status(200).json({ ok: true });
};
