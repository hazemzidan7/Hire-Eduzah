'use strict';
/**
 * POST /api/get-file-url
 * Returns a signed Cloudinary URL (2-hour expiry) for private/authenticated files.
 * Requires a valid admin JWT cookie.
 */
const crypto = require('crypto');
const { verifyToken, tokenFromRequest } = require('./_lib/auth');
const { isCloudinary } = require('./_lib/validate');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'same-origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  // ── Auth (same as /api/admin) ─────────────────────────────────────────────
  try {
    const payload = verifyToken(tokenFromRequest(req));
    if (payload.role !== 'admin') throw new Error();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { url } = req.body || {};
  if (!url || !isCloudinary(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dnfcayldd';
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) {
    return res.status(500).json({ error: 'CLOUDINARY_API_SECRET not configured in Vercel env vars' });
  }

  try {
    return res.status(200).json({ url: buildSignedUrl(url, cloudName, apiSecret) });
  } catch (e) {
    console.error('[get-file-url]', e.message);
    return res.status(500).json({ error: 'Failed to sign URL' });
  }
};

/**
 * Generate a Cloudinary signed URL with a 2-hour expiry.
 * Signature algorithm: SHA-1( "expire={ts}&public_id={id}" + apiSecret ) → base64url[:8]
 *
 * Works for both type:upload and type:authenticated resources.
 */
function buildSignedUrl(rawUrl, cloudName, apiSecret) {
  const parsed   = new URL(rawUrl);
  const segments = parsed.pathname.split('/').filter(Boolean);

  const uploadIdx = segments.indexOf('upload');
  if (uploadIdx === -1) throw new Error('Not a Cloudinary upload URL');

  const resourceType = segments[uploadIdx - 1]; // image | video | raw

  let rest = segments.slice(uploadIdx + 1);

  // Strip existing s--sig-- if present
  if (rest[0] && rest[0].startsWith('s--')) rest = rest.slice(1);

  // Extract version segment (vNNNNNN)
  let version = '';
  if (rest[0] && /^v\d+$/.test(rest[0])) { version = rest[0]; rest = rest.slice(1); }

  // Remaining path = public_id + optional extension
  const fullId  = rest.join('/');                           // e.g. eduzah-hiring/abc123.pdf
  const dotIdx  = fullId.lastIndexOf('.');
  const publicId = dotIdx !== -1 ? fullId.slice(0, dotIdx) : fullId;
  const ext      = dotIdx !== -1 ? fullId.slice(dotIdx)    : '';     // .pdf

  // 2-hour expiry
  const expire = Math.floor(Date.now() / 1000) + 7200;

  // Cloudinary signing: sha1(toSign + apiSecret) → base64url → first 8 chars
  const toSign = `expire=${expire}&public_id=${publicId}`;
  const sig    = crypto.createHash('sha1')
    .update(toSign + apiSecret)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .slice(0, 8);

  const vStr = version ? `${version}/` : '';
  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/s--${sig}--/${vStr}${publicId}${ext}`;
}
