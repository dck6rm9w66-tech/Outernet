import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

with sync_playwright() as p:
    b = p.chromium.launch(**CHROME)
    pg, errs = boot(b, True)
    pg.evaluate("()=>['start','thread','post','share','sticker'].forEach(k=>Meta.set('tip_'+k,1))"); tid = pg.evaluate("roots()[0].id")
    # Kommentar mit Anhang, dessen Datei nicht auf dem Gerät liegt
    pg.evaluate("""async t=>{const h='a'.repeat(64);await postComment(t,'Mit Bild',null,{media:[{h,m:'image/png',s:250000,n:'foto.png'},{h:'b'.repeat(64),m:'application/pdf',s:90000,n:'plan.pdf'}]})}""", tid)
    pg.evaluate("t=>{location.hash='#/t/'+t}", tid); pg.wait_for_timeout(600)
    pg.evaluate("()=>Meta.set('att','all')"); pg.evaluate("()=>route()"); pg.wait_for_timeout(300)
    print('Alle: Platzhalter', pg.locator('.attph').count())
    assert pg.locator('.attph').count() == 0
    pg.evaluate("()=>Meta.set('att','none')"); pg.evaluate("()=>route()"); pg.wait_for_timeout(400)
    n = pg.locator('.attph').count(); print('Keine: Platzhalter', n); assert n == 2
    print(pg.inner_text('.attph.img')[:160].replace('\n', ' / '))
    pg.screenshot(path=OUT + '/placeholder.png')
    pg.evaluate("()=>{const d=document.querySelector('#dlg');d.open&&d.close()}"); pg.screenshot(path=OUT + '/placeholder.png'); pg.click('[data-act=attall]'); pg.wait_for_timeout(400)
    assert pg.evaluate("Meta.get('att')") == 'all'
    print('Fehler', errs); assert not errs
    print('OK')
