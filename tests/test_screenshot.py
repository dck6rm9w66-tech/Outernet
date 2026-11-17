"""Automatischer Screenshot (Einwilligung, Dienst, eigenes Bild) und Verbindungszahl neben dem Namen."""
import sys, os, json, base64, threading, io
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from http.server import BaseHTTPRequestHandler, HTTPServer
from PIL import Image
buf = io.BytesIO(); Image.new('RGB', (1400, 900), (30, 120, 200)).save(buf, 'PNG'); PNG = buf.getvalue()
hits = []
class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        hits.append(self.path)
        if self.path.startswith('/json'):
            body = json.dumps({'status': 'success', 'data': {'screenshot': {'url': f'http://127.0.0.1:{PORT}/img.png'}}}).encode(); ct = 'application/json'
        elif self.path.startswith('/fail'):
            self.send_response(500); self.send_header('Access-Control-Allow-Origin', '*'); self.end_headers(); return
        else: body = PNG; ct = 'image/png'
        self.send_response(200); self.send_header('Content-Type', ct); self.send_header('Access-Control-Allow-Origin', '*'); self.end_headers(); self.wfile.write(body)
srv = HTTPServer(('127.0.0.1', 0), H); PORT = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
open(OUT + '/own.png', 'wb').write(PNG)
errs = []
with sync_playwright() as p:
    b = p.chromium.launch(**CHROME, args=['--no-sandbox'])
    ctx = b.new_context(bypass_csp=True, viewport={'width': 420, 'height': 900})
    pg = ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(APP); pg.wait_for_selector('#ob:not([hidden])')
    TIPS = "['start','thread','post','share','sticker','shared','meet','me','vote'].forEach(k=>Meta.set('tip_'+k,1));Meta.set('onboarded',1);Meta.set('lang','de')"
    pg.evaluate("()=>{" + TIPS + "}"); pg.reload(); pg.wait_for_timeout(1500)
    def open_new(url):
        pg.evaluate("newSheet(0,{})") if False else None
        pg.evaluate("()=>{location.hash='#/';}"); pg.wait_for_timeout(300)
        pg.evaluate("()=>newSheet(1,{kind:'page'})") ; pg.wait_for_timeout(500)
    # 1) Einwilligung wird abgefragt, vorher kein Netzverkehr
    pg.evaluate("()=>newSheet(1,{kind:'page'})"); pg.wait_for_selector('#nu')
    pg.fill('#nu', 'beispiel.example/artikel'); pg.wait_for_selector('[data-a=sv1]', timeout=5000)
    assert not hits, 'Es wurde etwas gesendet, bevor der Nutzer zugestimmt hat'
    print('Einwilligung gefragt, nichts gesendet')
    pg.screenshot(path=OUT + '/shot_consent.png')
    # 2) eigener Dienst
    pg.click('[data-a=sv2]'); pg.fill('#shu2', f'http://127.0.0.1:{PORT}/img?u={{url}}'); pg.click('[data-a=sv3]')
    pg.wait_for_function("document.querySelector('#shotimg') && !document.querySelector('#shotimg').hidden", timeout=15000)
    assert hits and 'beispiel.example' in hits[0].replace('%3A', ':').replace('%2F', '/'), hits
    pg.fill('#nt', 'Stimmt diese Zahl?'); pg.screenshot(path=OUT + '/shot_auto.png')
    pg.click('[data-a=go]'); pg.wait_for_selector('.shotf img', timeout=8000)
    r = pg.evaluate("roots().find(r=>r.title==='Stimmt diese Zahl?')")
    assert r['shot']['m'] == 'image/jpeg' and r['shot']['hash'], r
    assert pg.evaluate("validate(roots().find(r=>r.title==='Stimmt diese Zahl?'))"), 'Wurzel mit Screenshot ungültig'
    print('Thread mit Screenshot:', r['shot']['size'], 'Zeichen, Anzeige ok')
    pg.screenshot(path=OUT + '/shot_thread.png')
    # 3) JSON-Antwort (wie Microlink) und Fehlerfall
    pg.evaluate("()=>{Meta.set('shotUrl',location.origin==='null'?'':'');}")
    pg.evaluate(f"()=>{{Meta.set('shotUrl','http://127.0.0.1:{PORT}/json?u={{url}}')}}")
    got = pg.evaluate("fetchShot('https://beispiel.example/x').then(b=>b.length)"); assert got > 1000, 'JSON-Weg'
    pg.evaluate(f"()=>{{Meta.set('shotUrl','http://127.0.0.1:{PORT}/fail?u={{url}}')}}")
    assert pg.evaluate("fetchShot('https://beispiel.example/x').then(()=>false,()=>true)"), 'Fehler wird nicht gemeldet'
    # 4) private Adressen werden nie gesendet
    bad = pg.evaluate("['http://localhost/x','http://192.168.1.5/','http://10.0.0.2/','http://intranet/','https://x.local/','file:///etc/passwd','http://[::1]/'].map(publicUrl)")
    assert not any(bad), bad
    assert pg.evaluate("publicUrl('https://beispiel.example/a')")
    # 5) eigenes Bild aus Datei, Entfernen, Dienst "Aus"
    pg.evaluate("()=>{Meta.set('shotSvc','off')}")
    pg.evaluate("()=>newSheet(1,{kind:'page'})"); pg.wait_for_selector('#sfi',state='attached')
    pg.set_input_files('#sfi', OUT + '/own.png'); pg.wait_for_function("!document.querySelector('#shotimg').hidden", timeout=8000)
    pg.fill('#nt', 'Eigenes Bild'); pg.click('[data-a=go]'); pg.wait_for_selector('.shotf img', timeout=8000)
    print('eigenes Bild ok')
    # 6) Verbindungszahl
    assert pg.evaluate("[0,3,9,10,17,200,3140,4200000,25000].map(cnB)") == [0, 3, 9, 10, 10, 200, 3000, 4000000, 20000]
    assert pg.evaluate("[0,10,200,3000,4000000,2500].map(cnF)") == ['0', '10', '200', '3K', '4M', '2.5K']
    pg.evaluate("()=>Meta.set('met',3140)")
    pg.evaluate("()=>{location.hash='#/'}"); pg.wait_for_timeout(300)
    tid = pg.evaluate("roots().find(r=>r.title==='Eigenes Bild').id")
    c1 = pg.evaluate(f"postComment('{tid}','Mit Zahl').then(c=>c.cn)"); assert c1 == 3000, c1
    pg.evaluate("()=>Meta.set('cnshow',0)")
    c2 = pg.evaluate(f"postComment('{tid}','Ohne Zahl').then(c=>c.cn===undefined)"); assert c2
    pg.evaluate("()=>Meta.set('cnshow',1)")
    # ungerundete / gefälschte Werte werden abgelehnt
    bad = pg.evaluate(f"""async()=>{{const key=await keyFor('{tid}');const out=[];for(const cn of[17,-1,1.5,'5',1e11]){{const o=await signObj({{t:'comment',thread:'{tid}',parent:null,body:'x'+cn,kind:'text',cn,ts:nowMin(),author:key.pub}},key);out.push(await validate(o))}}return out}}""")
    assert not any(bad), bad
    pg.evaluate(f"DB.index();location.hash='#/t/{tid}'"); pg.wait_for_timeout(800); pg.evaluate('route()'); pg.wait_for_selector('.who .cn', timeout=5000)
    chips = pg.evaluate("[...document.querySelectorAll('.who .cn')].map(e=>e.textContent.trim())")
    print('Chips im Thread:', chips); assert '3K' in chips
    pg.screenshot(path=OUT + '/cn_thread.png')
    pg.evaluate("()=>{Meta.set('seeded',0)}")
    assert pg.evaluate("Promise.all([...DB.mem.values()].map(validate)).then(a=>a.every(Boolean))"), 'Beispieldaten enthalten ungültige Objekte'
    print('Fehler:', errs); assert not errs, errs
    print('OK')
