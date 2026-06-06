'use strict';
/**
 * POST /api/logout
 * Clears the HttpOnly adminToken cookie.
 */
const { clearTokenCookie } = require('./_lib/auth');

module.exports = async function handler(req, res) {
  clearTokenCookie(res);
  return res.status(200).json({ ok: true });
};
