/* ==========================================================================
   GET /api/bbc?series=6min|speak   → BBC Learning English podcast epizodlari
   --------------------------------------------------------------------------
   BBC Learning English podcastlari ochiq RSS orqali tarqatiladi (mp3 fayllar
   BBC'ning o'z serverida). Brauzer boshqa domen RSS'ini CORS tufayli o'qiy
   olmaydi — shuning uchun bu funksiya serverda o'qib, JSON qaytaradi.
   Audio platformada SAQLANMAYDI — <audio src> to'g'ridan-to'g'ri BBC'dan
   oqadi. Transkript BBC sahifasida (link beriladi), nusxalanmaydi.

   Javob: { series, title, items: [{ id, title, date, mp3, duration, desc, link }] }
   Kesh: 6 soat (RSS kuniga bir yangilanadi).
   ========================================================================== */
'use strict';

const FEEDS = {
  '6min':  { id: 'p02pc9tn', title: '6 Minute English' },
  'speak': { id: 'p02pc9wq', title: 'The English We Speak' }
};

function pick(xml, tag) {
  const m = xml.match(new RegExp('<' + tag + '(?:\\s[^>]*)?>([\\s\\S]*?)</' + tag + '>', 'i'));
  if (!m) return '';
  return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, '').trim();
}
function attr(xml, tag, name) {
  const m = xml.match(new RegExp('<' + tag + '[^>]*\\s' + name + '="([^"]*)"', 'i'));
  return m ? m[1] : '';
}

module.exports = async function (req, res) {
  const key = String((req.query && req.query.series) || '6min');
  const feed = FEEDS[key] || FEEDS['6min'];
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');

  try {
    const r = await fetch('https://podcasts.files.bbci.co.uk/' + feed.id + '.rss', {
      headers: { 'User-Agent': 'UzLeederAcademy/1.0 (personal study platform)' }
    });
    if (!r.ok) { res.statusCode = 502; return res.end(JSON.stringify({ error: 'bbc ' + r.status })); }
    const xml = await r.text();
    const items = [];
    const re = /<item>([\s\S]*?)<\/item>/gi;
    let m;
    while ((m = re.exec(xml)) && items.length < 60) {
      const it = m[1];
      const mp3 = attr(it, 'enclosure', 'url');
      if (!mp3) continue;
      const title = pick(it, 'title');
      const date = pick(it, 'pubDate');
      items.push({
        id: (pick(it, 'guid') || mp3).replace(/[^A-Za-z0-9]+/g, '-').slice(-40),
        title: title,
        date: date ? new Date(date).toISOString().slice(0, 10) : '',
        mp3: mp3,
        duration: pick(it, 'itunes:duration') || '',
        desc: pick(it, 'description').slice(0, 400),
        link: pick(it, 'link')
      });
    }
    res.statusCode = 200;
    res.end(JSON.stringify({ series: key, title: feed.title, items: items }));
  } catch (e) {
    res.statusCode = 502;
    res.end(JSON.stringify({ error: 'fetch', message: e.message }));
  }
};
