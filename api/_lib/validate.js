'use strict';
/**
 * Input validation and sanitization helpers.
 * Applied to ALL user input before touching the database.
 */

const ALLOWED_POSITIONS = [
  'kids-coding', 'prog-fundamentals', 'english-instructor',
  'cybersecurity', 'data-analysis', 'ai-instructor', 'sales', 'designer',
  'robotics-instructor', 'project-management',
];

/** Strip control chars and HTML tags, trim, enforce max length */
function sanitize(val, maxLen = 2000) {
  if (val === null || val === undefined) return '';
  return String(val)
    .trim()
    .slice(0, maxLen)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // control characters
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#x27;');
}

/** Recursively sanitize all string values in an object */
function sanitizeDeep(obj, maxLen = 2000) {
  if (typeof obj === 'string') return sanitize(obj, maxLen);
  if (Array.isArray(obj))      return obj.map(v => sanitizeDeep(v, maxLen));
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) out[k] = sanitizeDeep(v, maxLen);
    return out;
  }
  return obj;
}

function isEmail(s)    { return /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,10}$/.test(String(s)); }
function isPhone(s)    { return /^[\d\s\+\-\(\)]{7,20}$/.test(String(s)); }
function isNatId(s)    { return /^\d{14}$/.test(String(s)); }
function isCloudinary(url) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME || 'dnfcayldd';
  return typeof url === 'string' &&
    url.startsWith(`https://res.cloudinary.com/${cloud}/`);
}

function isHttpsUrl(url) {
  if (!url) return true; // empty is allowed
  try { const u = new URL(url); return u.protocol === 'https:'; } catch { return false; }
}

function validateApplication(d) {
  const errs = [];
  // Required text fields
  if (!d.nameAr || String(d.nameAr).trim().length < 2) errs.push('nameAr');
  if (!d.nameEn || String(d.nameEn).trim().length < 2) errs.push('nameEn');
  if (!isEmail(d.email))                                errs.push('email');
  if (!isPhone(d.phone))                                errs.push('phone');
  if (!ALLOWED_POSITIONS.includes(d.position))          errs.push('position');
  // Optional fields — only validate format if present
  if (d.natid && !isNatId(d.natid))                    errs.push('natid');
  if (d.videoLink && !isHttpsUrl(d.videoLink))          errs.push('videoLink');
  // File URLs: must be from our Cloudinary account if provided
  ['cvFileUrl','photoFileUrl','natidFrontUrl','natidBackUrl'].forEach(k => {
    if (d[k] && !isCloudinary(d[k])) errs.push(k + '_invalid_url');
  });
  // Log for debugging (visible in Vercel function logs)
  if (errs.length > 0) console.log('[validate] failed fields:', errs, '| position:', d.position);
  return errs;
}

module.exports = { sanitize, sanitizeDeep, isEmail, isCloudinary, validateApplication };
