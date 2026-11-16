import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
URL=APP
def boot(b,seed):
    c=b.new_context(bypass_csp=True,viewport={'width':400,'height':860},locale='de')
    pg=c.new_page();pg.errs=[];pg.on('pageerror',lambda e:pg.errs.append(str(e)[:200]))
    pg.goto(URL);pg.wait_for_selector('#ob .btn');pg.locator('#ob [data-ob=skip]').click()
    if not seed:pg.locator('#obs').uncheck()
    pg.locator('#ob [data-ob=go]').click();pg.wait_for_function("document.querySelector('#ob').hidden",timeout=15000)
    pg.evaluate("['start','thread','post','share','sticker'].forEach(k=>Meta.set('tip_'+k,1));Meta.set('backupAsked',1);Meta.set('relay','http://127.0.0.1:8799')");pg.wait_for_timeout(200);return pg
with sync_playwright() as p:
    b=p.chromium.launch(**CHROME,args=['--no-sandbox','--disable-features=WebRtcHideLocalIpsWithMdns'])
    A=boot(b,True);B=boot(b,False);C=boot(b,False);P=[A,B,C]
    for pg in P:
        pg.evaluate("wifiSheet()");pg.wait_for_timeout(400);pg.locator('[data-a=near]').click()
    for pg in P:pg.wait_for_function("document.querySelector('#wcount')&&/2/.test(document.querySelector('#wcount').textContent)",timeout=10000)
    print('count',A.locator('#wcount').inner_text());A.screenshot(path=OUT+'/n1.png')
    print('btn',A.locator('[data-a=confirm]').inner_text())
    A.locator('[data-a=confirm]').click();B.locator('[data-a=confirm]').click();A.wait_for_timeout(1500);A.screenshot(path=OUT+'/n2.png')
    C.locator('[data-a=confirm]').click()
    for n,pg in zip('ABC',P):
        try:pg.wait_for_selector('.sa[data-s=done]',timeout=25000)
        except Exception:print(n,'no done',pg.locator('#wb').inner_text()[:120])
    A.wait_for_timeout(500);A.screenshot(path=OUT+'/n3.png')
    for n,pg in zip('ABC',P):print(n,pg.evaluate("DB.mem.size"),pg.locator('#wb h2').inner_text() if pg.locator('#wb h2').count() else '-')
    print([pg.errs for pg in P])
