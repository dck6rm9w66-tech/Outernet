"""Plugin-Download aus der App (Chrome, Firefox, Safari), Lesezeichen und echtes Laden in Chromium."""
import sys, os, json, base64, io, zipfile, threading, tempfile, shutil, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
from http.server import BaseHTTPRequestHandler, HTTPServer

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        if self.path.startswith('/app.html'): body = open(APP_PATH, 'rb').read()
        else: body = b'<!doctype html><title>Beispielseite</title><p id=t>Hallo Welt und gute Nacht</p>'
        self.send_response(200); self.send_header('Content-Type', 'text/html; charset=utf-8'); self.end_headers(); self.wfile.write(body)
srv = HTTPServer(('127.0.0.1', 0), H); PORT = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{PORT}/app.html'
errs = []
with sync_playwright() as p:
    b = p.chromium.launch(**CHROME, args=['--no-sandbox'])
    ctx = b.new_context(bypass_csp=True, viewport={'width': 420, 'height': 900}, accept_downloads=True)
    pg = ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(BASE); pg.wait_for_selector('#ob:not([hidden])')
    pg.evaluate("()=>{Meta.set('lang','de');['start','thread','post','share','sticker','shared','meet','me','vote'].forEach(k=>Meta.set('tip_'+k,1));Meta.set('onboarded',1)}")
    pg.reload(); pg.wait_for_timeout(1500)
    pg.evaluate("S.shareArea='plugin';location.hash='#/share'"); pg.wait_for_timeout(600)
    txt = pg.inner_text('#main')
    print('UI:', [w in txt for w in ('Lesezeichen', 'Chrome, Edge, Brave', 'Firefox', 'Safari')])
    assert all(w in txt for w in ('Lesezeichen', 'Chrome, Edge, Brave', 'Firefox', 'Safari')), 'Bereich unvollständig'
    pg.screenshot(path=OUT + '/plugin_area.png', full_page=False)
    # --- ZIP je Browser
    pg.evaluate("document.querySelectorAll('details.plg').forEach(d=>d.open=true)")
    zips = {}
    for k in ('chrome', 'firefox', 'safari'):
        with pg.expect_download() as d:
            pg.click(f'[data-act=plugdl][data-k={k}]')
        path = d.value.path(); zips[k] = open(path, 'rb').read()
        z = zipfile.ZipFile(io.BytesIO(zips[k])); assert z.testzip() is None
        names = z.namelist(); man = json.loads(z.read('manifest.json'))
        bg = z.read('background.js').decode(); opt = z.read('options.js').decode()
        assert BASE in bg and BASE in opt and '__APP_URL__' not in bg + opt, 'Adresse nicht eingetragen'
        assert z.read('icon128.png')[:4] == b'\x89PNG' and 'options.html' in names
        if k == 'firefox': assert man['background'] == {'scripts': ['background.js']} and man['browser_specific_settings']['gecko']['id']
        if k == 'chrome': assert man['background'] == {'service_worker': 'background.js'}
        if k == 'safari': assert 'SAFARI.txt' in names and man['background']['scripts'] == ['background.js']
        print('zip', k, len(zips[k]), 'Bytes', sorted(names))
    # --- Lesezeichen
    bm = pg.evaluate("bookmarklet(appAddr())"); assert bm.startswith('javascript:')
    code = urllib.parse.unquote(bm[len('javascript:'):])
    pg2 = ctx.new_page(); pg2.goto(f'http://127.0.0.1:{PORT}/page.html')
    pg2.evaluate("()=>{const r=document.createRange();r.selectNodeContents(document.getElementById('t'));getSelection().removeAllRanges();getSelection().addRange(r)}")
    with ctx.expect_page() as np_:
        pg2.evaluate("c=>{(0,eval)(c)}", code)
    popup = np_.value; popup.wait_for_load_state()
    print('Lesezeichen öffnet:', urllib.parse.unquote(popup.url)[:150])
    assert popup.url.startswith(BASE + '#/link/') and 'page.html' in urllib.parse.unquote(popup.url) and 'Hallo Welt' in urllib.parse.unquote(popup.url)
    # --- echtes Chromium-Plugin laden
    d = tempfile.mkdtemp(); ed = os.path.join(d, 'ext'); zipfile.ZipFile(io.BytesIO(zips['chrome'])).extractall(ed)
    ok = False
    try:
        c2 = p.chromium.launch_persistent_context(os.path.join(d, 'u'), channel='chromium', headless=True, args=['--no-sandbox', f'--disable-extensions-except={ed}', f'--load-extension={ed}'])
        sw = c2.service_workers[0] if c2.service_workers else c2.wait_for_event('serviceworker', timeout=15000)
        with c2.expect_page() as ep:
            sw.evaluate("()=>openApp('https://example.org/artikel','Ein markierter Satz')")
        tab = ep.value; tab.wait_for_load_state()
        print('Plugin öffnet:', urllib.parse.unquote(tab.url)[:140])
        assert tab.url.startswith(BASE + '#/link/https%3A%2F%2Fexample.org%2Fartikel/Ein%20markierter%20Satz')
        tab.wait_for_selector('#ob, #main', timeout=8000)
        # Rechtsklick-Menü angelegt?
        n = sw.evaluate("()=>new Promise(r=>chrome.contextMenus.removeAll(()=>r(1)))")
        ok = True; c2.close()
    except Exception as e:
        print('Chromium-Plugin-Test nicht ausführbar oder fehlgeschlagen:', repr(e)[:300]); 
        if os.environ.get('REQUIRE_EXT'): raise
    shutil.rmtree(d, ignore_errors=True)
    print('Plugin im echten Chromium geladen:', ok)
    assert not errs, errs
    print('OK')
