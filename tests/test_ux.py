import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
URL=APP
with sync_playwright() as p:
    b=p.chromium.launch(**CHROME,args=['--no-sandbox'])
    c=b.new_context(bypass_csp=True,viewport={'width':400,'height':860},locale='de');pg=c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:150]))
    pg.goto(URL);pg.wait_for_selector('#ob .btn');pg.screenshot(path=OUT+'/u0.png')
    pg.locator('#ob [data-ob=skip]').click();pg.locator('#ob [data-ob=go]').click();pg.wait_for_function("document.querySelector('#ob').hidden",timeout=15000)
    pg.evaluate("['start','thread','post','share','sticker'].forEach(k=>Meta.set('tip_'+k,1))");pg.wait_for_timeout(300)
    pg.screenshot(path=OUT+'/u1.png')
    pg.evaluate('newSheet(0)');pg.wait_for_timeout(400);pg.screenshot(path=OUT+'/u2.png');pg.keyboard.press('Escape')
    pg.evaluate("location.hash='#/share'");pg.wait_for_timeout(400);pg.screenshot(path=OUT+'/u3.png',full_page=True)
    pg.locator('[data-act=area][data-k=plugin]').click();pg.wait_for_timeout(300);pg.screenshot(path=OUT+'/u4.png')
    pg.evaluate("location.hash='#/link/'+encodeURIComponent('https://beispiel.example/radwege')");pg.wait_for_timeout(600);pg.screenshot(path=OUT+'/u5.png')
    pg.evaluate("location.hash='#/link/'+encodeURIComponent('https://neu.example/x')+'/'+encodeURIComponent('Ein Satz')");pg.wait_for_timeout(600);pg.screenshot(path=OUT+'/u6.png')
    print(errs)
