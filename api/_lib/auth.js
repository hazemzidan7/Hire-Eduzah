'use strict';
/**
 * Lightweight JWT implementation using Node.js built-in crypto.
 * No external dependencies — pure HMAC-SHA256.
 */
const crypto = require('crypto');

const EXPIRY_SECONDS = 4 * 60 * 60; // 4 hours

function _sign(header, body) {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error('JWT_SECRET not configured or too short');
  return crypto
    .createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url');
}

function createToken(payload) {
  const h = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const b = Buffer.from(JSON.stringify({
    ...payload,
    iat: now,
    exp: now + EXPIRY_SECONDS,
  })).toString('base64url');
  return `${h}.${b}.${_sign(h, b)}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') throw new Error('No token provided');
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Malformed token');
  const [h, b, sig] = parts;
  const expected = _sign(h, b);

  // Timing-safe comparison to prevent timing attacks
  const sigBuf  = Buffer.from(sig,      'base64url');
  const expBuf  = Buffer.from(expected, 'base64url');
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    throw new Error('Invalid signature');
  }

  const payload = JSON.parse(Buffer.from(b, 'base64url').toString('utf8'));
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }
  return payload;
}

/** Read token from HttpOnly cookie */
function tokenFromRequest(req) {
  const cookie = req.headers.cookie || '';
  const match  = cookie.match(/(?:^|;\s*)adminToken=([^;]+)/);
  return match ? match[1] : null;
}

/** Set HttpOnly cookie (4h) */
function setTokenCookie(res, token) {
  res.setHeader('Set-Cookie',
    `adminToken=${token}; HttpOnly; Secure; SameSite=Lax; Max-Age=${EXPIRY_SECONDS}; Path=/`
  );
}

/** Clear cookie on logout */
function clearTokenCookie(res) {
  res.setHeader('Set-Cookie',
    'adminToken=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/'
  );
}

module.exports = { createToken, verifyToken, tokenFromRequest, setTokenCookie, clearTokenCookie };
