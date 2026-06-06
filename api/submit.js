export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  try {
    const d = req.body;

    const row = {
      position:        d.position      || null,
      name_ar:         d.nameAr        || null,
      name_en:         d.nameEn        || null,
      phone:           d.phone         || null,
      email:           d.email         || null,
      work_mode:       d.workMode      || null,
      work_type:       d.workType      || null,
      city:            d.city          || null,
      gov:             d.gov           || null,
      video_link:      d.videoLink     || null,
      cv_file_url:     d.cvFileUrl     || null,
      photo_file_url:  d.photoFileUrl  || null,
      natid_front_url: d.natidFrontUrl || null,
      natid_back_url:  d.natidBackUrl  || null,
      data:            d,
    };

    const r = await fetch(`${SUPABASE_URL}/rest/v1/applications`, {
      method: 'POST',
      headers: {
        'apikey':        SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type':  'application/json',
        'Prefer':        'return=minimal',
      },
      body: JSON.stringify(row),
    });

    if (!r.ok) {
      const err = await r.text();
      return res.status(500).json({ error: 'DB error: ' + err });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
