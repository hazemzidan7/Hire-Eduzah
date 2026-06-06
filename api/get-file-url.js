'use strict';
/**
 * GET /api/get-file-url?url=<cloudinary-url>
 * Proxies a Cloudinary file through our server so the admin browser
 * never hits Cloudinary directly (avoids 401 on private/restricted assets).
 * Requires a valid admin JWT cookie — no expiry from the browser's perspective.
 */
const crypto = require('crypto');
const https  = require('https');
const { verifyToken, tokenFromRequest } = require('./_lib/auth');
const { isCloudinary } = require('./_lib/validate');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  // ── Auth ──────────────────────────────────────────────────────────────────
  try {
    const payload = verifyToken(tokenFromRequest(req));
    if (payload.role !== 'admin') throw new Error();
  } catch {
    return res.status(401).send('Unauthorized — please log in to Admin first.');
  }

  const rawUrl = req.query && req.query.url;
  if (!rawUrl || !isCloudinary(rawUrl)) {
    return res.status(400).send('Invalid URL');
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dnfcayldd';
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey    = process.env.CLOUDINARY_API_KEY;

  if (!apiSecret || !apiKey) {
    // No credentials — try serving directly and hope it's public
    return res.redirect(302, rawUrl);
  }

  // ── Build signed Cloudinary URL (server-side only, never exposed to client) ─
  let fetchUrl;
  try {
    fetchUrl = buildSignedUrl(rawUrl, cloudName, apiSecret);
  } catch (e) {
    console.error('[get-file-url] sign error:', e.message);
    fetchUrl = rawUrl; // fallback to unsigned
  }

  // ── Proxy the file bytes to the browser ──────────────────────────────────
  try {
    await pipe(fetchUrl, res);
  } catch (e) {
    console.error('[get-file-url] proxy error:', e.message);
    res.status(502).send('Could not fetch file from Cloudinary.');
  }
};

/** Stream a remote URL to the response */
function pipe(url, res) {
  return new Promise((resolve, reject) => {
    https.get(url, (upstream) => {
      if (upstream.statusCode >= 400) {
        upstream.resume();
        return reject(new Error(`Cloudinary returned ${upstream.statusCode}`));
      }
      const ct = upstream.headers['content-type'] || 'application/octet-stream';
      const cl = upstream.headers['content-length'];
      res.setHeader('Content-Type', ct);
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('Cache-Control', 'private, no-store');
      if (cl) res.setHeader('Content-Length', cl);
      upstream.pipe(res);
      upstream.on('end', resolve);
      upstream.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Generate a Cloudinary signed URL.
 * Signature: SHA-1( "expire={ts}&public_id={id}" + apiSecret ) → base64url[:8]
 */
function buildSignedUrl(rawUrl, cloudName, apiSecret) {
  const segs = new URL(rawUrl).pathname.split('/').filter(Boolean);
  const ui   = segs.indexOf('upload');
  if (ui === -1) throw new Error('Not a Cloudinary upload URL');

  const resourceType = segs[ui - 1];
  let rest = segs.slice(ui + 1);
  if (rest[0] && rest[0].startsWith('s--')) rest = rest.slice(1);

  let version = '';
  if (rest[0] && /^v\d+$/.test(rest[0])) { version = rest[0]; rest = rest.slice(1); }

  const fullId   = rest.join('/');
  const dot      = fullId.lastIndexOf('.');
  const publicId = dot !== -1 ? fullId.slice(0, dot) : fullId;
  const ext      = dot !== -1 ? fullId.slice(dot)    : '';

  // Fresh signature each request — no fixed expiry from the user's perspective
  const expire = Math.floor(Date.now() / 1000) + 300; // 5-min fetch window is enough
  const toSign = `expire=${expire}&public_id=${publicId}`;
  const sig    = crypto.createHash('sha1')
    .update(toSign + apiSecret)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .slice(0, 8);

  const v = version ? `${version}/` : '';
  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/s--${sig}--/${v}${publicId}${ext}`;
}
