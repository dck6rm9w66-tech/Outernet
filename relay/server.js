#!/usr/bin/env node
// Outernet-Vermittler. Hilft Handys im selben WLAN, sich zu finden.
// Er leitet nur kleine Verbindungsnachrichten weiter (WebRTC-Signale). Beiträge sieht und speichert er nie.
// Ohne Abhängigkeiten. Node 18 oder neuer.  Start:  node server.js   (Port 8787, oder PORT=… setzen)
// Hinter einem Proxy:  TRUST_PROXY=1 node server.js
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const PORT = +process.env.PORT || 8787, TRUST = process.env.TRUST_PROXY === '1';
const MAX_PEERS = 50, MAX_BODY = 32 * 1024, MAX_PER_IP = 20, RATE = 240;
const MAX_ROOMS = 2000, REQ_PER_MIN = 300, JOIN_PER_MIN = 30, MAX_DATA = 24 * 1024, SSE_MAX_MS = 2 * 60 * 60 * 1000;
const hits = new Map();            // Ip-Hash -> {n, j, t}: Anfragen und Beitritte pro Minute
const rooms = new Map();           // Raumschlüssel -> Map(id -> {res, name})
const perIp = new Map();           // Ip-Hash -> offene Verbindungen
const rate = new Map();            // id -> {n, t}

const sec = { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Cache-Control': 'no-store' };
const cors = { ...sec, 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'content-type' };
const isPrivate = ip => /^(10\.|192\.168\.|127\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|::1$|f[cd][0-9a-f]{2}:|fe80:)/i.test(ip);
function ipOf(req) {
  let ip = TRUST && req.headers['x-forwarded-for'] ? String(req.headers['x-forwarded-for']).split(',')[0].trim() : req.socket.remoteAddress || '';
  ip = ip.replace(/^::ffff:/, '');
  if (ip.includes(':') && !isPrivate(ip)) ip = ip.split(':').slice(0, 4).join(':'); // IPv6: /64
  return ip;
}
// Gleiche öffentliche Adresse = gleiches WLAN. Läuft der Vermittler selbst im WLAN, teilen sich alle privaten Adressen einen Raum.
const roomKey = (req, word) => crypto.createHash('sha256').update((isPrivate(ipOf(req)) ? 'lan' : ipOf(req)) + '|' + String(word || '').slice(0, 64)).digest('hex');
const ipHash = req => crypto.createHash('sha256').update(ipOf(req)).digest('hex').slice(0, 16);
const okId = s => typeof s === 'string' && /^[a-z0-9]{8,32}$/.test(s);
const clean = s => String(s || '').replace(/[^\p{L}\p{N} ._-]/gu, '').slice(0, 24);
const sse = (res, ev, data) => res.write('event: ' + ev + '\ndata: ' + JSON.stringify(data) + '\n\n');
function json(res, code, o) { res.writeHead(code, { 'Content-Type': 'application/json', ...cors }); res.end(JSON.stringify(o)); }

setInterval(() => { const now = Date.now(); for (const [k, v] of hits) if (now - v.t > 60000) hits.delete(k); }, 30000).unref();
function limited(req, join) {           // einfacher Zähler pro Minute und Adresse
  const k = ipHash(req), now = Date.now(); let h = hits.get(k);
  if (!h || now - h.t > 60000) hits.set(k, h = { n: 0, j: 0, t: now });
  h.n++; if (join) h.j++;
  return h.n > REQ_PER_MIN || h.j > JOIN_PER_MIN;
}
const server = http.createServer((req, res) => {
  let u; try { u = new URL(req.url, 'http://x'); } catch { res.writeHead(400, cors); return res.end(); }
  if (limited(req, u.pathname === '/v1/join')) return json(res, 429, { error: 'zu viele Anfragen' });
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
  if (u.pathname === '/v1/ping') return json(res, 200, { ok: 1, randnotiz: 'relay' });

  if (u.pathname === '/v1/join' && req.method === 'GET') {
    const id = u.searchParams.get('id'), name = clean(u.searchParams.get('name')) || 'Gast', key = roomKey(req, u.searchParams.get('word')), ih = ipHash(req);
    if (!okId(id)) return json(res, 400, { error: 'id' });
    let room = rooms.get(key);
    if (!room && rooms.size >= MAX_ROOMS) return json(res, 503, { error: 'ausgelastet' });
    if (!room) rooms.set(key, room = new Map());
    if (room.has(id) || room.size >= MAX_PEERS || (perIp.get(ih) || 0) >= MAX_PER_IP) return json(res, 429, { error: 'voll' });
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive', 'X-Accel-Buffering': 'no', ...cors });
    perIp.set(ih, (perIp.get(ih) || 0) + 1);
    sse(res, 'peers', [...room].map(([pid, p]) => ({ id: pid, name: p.name })));
    for (const p of room.values()) sse(p.res, 'join', { id, name });
    room.set(id, { res, name });
    const hb = setInterval(() => res.write(': hb\n\n'), 20000), life = setTimeout(() => res.end(), SSE_MAX_MS);
    req.on('close', () => {
      clearInterval(hb); clearTimeout(life); perIp.set(ih, Math.max(0, (perIp.get(ih) || 1) - 1)); rate.delete(id);
      const r = rooms.get(key); if (!r) return; r.delete(id);
      for (const p of r.values()) sse(p.res, 'leave', { id });
      if (!r.size) rooms.delete(key);
    });
    return;
  }

  if (u.pathname === '/v1/send' && req.method === 'POST') {
    let body = '', big = false;
    req.on('data', c => { body += c; if (body.length > MAX_BODY) { big = true; req.destroy(); } });
    req.on('end', () => {
      if (big) return;
      let m; try { m = JSON.parse(body); } catch { return json(res, 400, { error: 'json' }); }
      const room = rooms.get(roomKey(req, m && m.word));
      if (!m || typeof m !== 'object' || !room || !okId(m.id) || !okId(m.to) || !room.has(m.id) || !room.has(m.to)) return json(res, 404, { error: 'unbekannt' });
      let dl = 0; try { dl = JSON.stringify(m.data === undefined ? null : m.data).length; } catch { dl = Infinity; }
      if (dl > MAX_DATA) return json(res, 413, { error: 'zu gross' });
      const r = rate.get(m.id) || { n: 0, t: Date.now() }; if (Date.now() - r.t > 60000) { r.n = 0; r.t = Date.now(); }
      if (++r.n > RATE) return json(res, 429, { error: 'zu schnell' }); rate.set(m.id, r);
      sse(room.get(m.to).res, 'msg', { from: m.id, data: m.data });
      json(res, 200, { ok: 1 });
    });
    return;
  }

  if (u.pathname === '/' || u.pathname === '/app.html') { // liefert die App mit aus, falls vorhanden
    const f = path.join(__dirname, '..', 'web', 'app.html');
    return fs.readFile(f, (e, d) => { if (e) { res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Outernet-Vermittler läuft.'); } res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', ...cors }); res.end(d); });
  }
  res.writeHead(404, cors); res.end();
});
server.headersTimeout = 10000; server.requestTimeout = 15000; server.maxHeadersCount = 40;
server.listen(PORT, () => console.log('Outernet-Vermittler auf Port ' + PORT));
