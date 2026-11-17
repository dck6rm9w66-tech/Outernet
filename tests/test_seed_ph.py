import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

with sync_playwright() as p:
    b = p.chromium.launch(**CHROME)
    def run(att):
        c = b.new_context(bypass_csp=True, viewport={'width': 420, 'height': 860}, locale='de')
        pg = c.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(APP); pg.wait_for_selector('#ob .btn')
        pg.evaluate(f"()=>{{Meta.set('att','{att}');['start','thread','post','share','sticker'].forEach(k=>Meta.set('tip_'+k,1))}}")
        for _ in range(4):
            bt = pg.locator('#ob [data-ob]:not([data-ob=lang])').last; g = bt.get_attribute('data-ob') == 'go'
            bt.click(); pg.wait_for_timeout(300)
            if g: break
        pg.wait_for_function("document.querySelector('#ob').hidden", timeout=20000); pg.wait_for_timeout(500)
        res = {}
        for key, title in (('t1', 'Radwege'), ('t3', 'Bahn')):
            pg.evaluate("t=>{location.hash='#/t/'+roots().find(r=>r.title.includes(t)).id}", title); pg.wait_for_timeout(600)
            res[key] = (pg.locator('.attph').count(), pg.locator('.shotf img').count(), pg.locator('.c .media img').count(), pg.locator('.c .media a.lnk[download]').count())
        if att == 'none': pg.screenshot(path=OUT + '/seed_ph.png')
        assert not errs, errs
        return res
    a = run('all'); n = run('none')
    print('Alle (Platzhalter, Screenshot, Bild, Datei):', a); print('Keine:', n)
    assert a['t1'][0] == 0 and a['t1'][1] == 1 and a['t1'][2] == 1 and a['t3'][3] == 1
    assert n['t1'][0] == 2 and n['t1'][1] == 0 and n['t3'][0] == 1
    print('OK')
