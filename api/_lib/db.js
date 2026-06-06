'use strict';
/**
 * Supabase server-side client using service role key.
 * Key NEVER leaves this module — only server code imports this.
 */
function _headers(extra) {
  const key = process.env.SUPABASE_SERVICE_KEY;
  const url = process.env.SUPABASE_URL;
  if (!key || !url) throw new Error('Supabase env vars not configured');
  return {
    apikey:         key,
    Authorization:  `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

function _url(path) {
  return `${process.env.SUPABASE_URL}/rest/v1/${path}`;
}

async function dbInsert(table, row) {
  const res = await fetch(_url(table), {
    method:  'POST',
    headers: _headers({ Prefer: 'return=minimal' }),
    body:    JSON.stringify(row),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`DB insert error ${res.status}: ${msg}`);
  }
}

async function dbSelect(table, qs = '') {
  const res = await fetch(_url(`${table}?select=*${qs ? '&' + qs : ''}`), {
    headers: _headers(),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`DB select error ${res.status}: ${msg}`);
  }
  return res.json();
}

module.exports = { dbInsert, dbSelect };
