'use strict';
/**
 * GET /api/get-file-url?url=<cloudinary-url>
 * Proxies a Cloudinary file through our server.
 * Tries multiple strategies to bypass 401/Strict-Transformations.
 */
const crypto = require('crypto');
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
  console.log('[get-file-url] rawUrl:', rawUrl && rawUrl.slice(0, 120));

  if (!rawUrl || !isCloudinary(rawUrl)) {
    return res.status(400).send('Invalid URL');
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dnfcayldd';
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey    = process.env.CLOUDINARY_API_KEY;

  // Strategy 1: signed URL (bypasses strict-transformations + restricted-originals)
  if (apiSecret) {
    const signedUrl = buildSignedUrl(rawUrl, cloudName, apiSecret);
    console.log('[get-file-url] trying signed URL:', signedUrl.slice(0, 120));
    const ok = await tryFetch(signedUrl, res);
    if (ok) return;
    console.warn('[get-file-url] signed URL failed, trying fl_attachment…');
  }

  // Strategy 2: add fl_attachment transformation (often bypasses restricted-originals without signing)
  const transformedUrl = insertTransform(rawUrl, 'fl_attachment');
  console.log('[get-file-url] trying fl_attachment URL:', transformedUrl.slice(0, 120));
  const ok2 = await tryFetch(transformedUrl, res);
  if (ok2) return;
  console.warn('[get-file-url] fl_attachment failed, falling back to raw redirect…');

  // Strategy 3: direct redirect — let browser handle it (may result in 401 in browser)
  res.redirect(302, rawUrl);
};

/** Attempt to proxy a URL; returns true if succeeded, false if 4xx/5xx */
async function tryFetch(url, res) {
  try {
    const upstream = await fetch(url, { redirect: 'follow' });
    console.log('[get-file-url] response status:', upstream.status, 'for', url.slice(0, 80));

    if (!upstream.ok) return false;

    const ct = upstream.headers.get('content-type') || 'application/octet-stream';
    const cl = upstream.headers.get('content-length');
    res.setHeader('Content-Type', ct);
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'private, no-store');
    if (cl) res.setHeader('Content-Length', cl);

    const buf = await upstream.arrayBuffer();
    res.end(Buffer.from(buf));
    return true;
  } catch (e) {
    console.error('[get-file-url] fetch error:', e.message);
    return false;
  }
}

/** Insert a Cloudinary transformation into the URL path (after /upload/) */
function insertTransform(rawUrl, transform) {
  return rawUrl.replace(/\/upload\//, `/upload/${transform}/`);
}

/**
 * Build a Cloudinary signed URL.
 * Signature: SHA-1( "expire={ts}&public_id={id}" + apiSecret ) → base64url[:8]
 */
function buildSignedUrl(rawUrl, cloudName, apiSecret) {
  const segs = new URL(rawUrl).pathname.split('/').filter(Boolean);
  const ui   = segs.indexOf('upload');
  if (ui === -1) return rawUrl;

  const resourceType = segs[ui - 1];
  let rest = segs.slice(ui + 1);
  if (rest[0] && rest[0].startsWith('s--')) rest = rest.slice(1);

  let version = '';
  if (rest[0] && /^v\d+$/.test(rest[0])) { version = rest[0]; rest = rest.slice(1); }

  const fullId   = rest.join('/');
  const dot      = fullId.lastIndexOf('.');
  const publicId = dot !== -1 ? fullId.slice(0, dot) : fullId;
  const ext      = dot !== -1 ? fullId.slice(dot)    : '';

  const expire = Math.floor(Date.now() / 1000) + 300;
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
