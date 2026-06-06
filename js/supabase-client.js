/* supabase-client.js — lightweight Supabase REST client (no SDK needed) */
window.SupabaseClient = (function () {

  var URL = 'https://ekmcogwofozrbmvmyfdq.supabase.co';
  var KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbWNvZ3dvZm96cmJtdm15ZmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MTg5MDUsImV4cCI6MjA5NjI5NDkwNX0.Aw6N1qXXHwC1xVs3oC7bNfd9h1iml1tsp25jdFKir54';

  function headers(extra) {
    return Object.assign({
      'apikey':        KEY,
      'Authorization': 'Bearer ' + KEY,
      'Content-Type':  'application/json',
    }, extra || {});
  }

  /** Insert a row. Returns the inserted row. */
  async function insert(table, row) {
    var res = await fetch(URL + '/rest/v1/' + table, {
      method:  'POST',
      headers: headers({ 'Prefer': 'return=representation' }),
      body:    JSON.stringify(row),
    });
    if (!res.ok) {
      var err = await res.text();
      throw new Error('Supabase insert error ' + res.status + ': ' + err);
    }
    var data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  }

  /** Select rows. options: { order, limit, filters } */
  async function select(table, options) {
    var opts = options || {};
    var qs = 'select=*';
    if (opts.order) qs += '&order=' + opts.order;
    if (opts.limit) qs += '&limit=' + opts.limit;

    var res = await fetch(URL + '/rest/v1/' + table + '?' + qs, {
      headers: headers({ 'Prefer': 'return=representation' }),
    });
    if (!res.ok) {
      var err = await res.text();
      throw new Error('Supabase select error ' + res.status + ': ' + err);
    }
    return res.json();
  }

  return { insert, select };
})();
