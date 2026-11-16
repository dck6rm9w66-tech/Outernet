import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
URL=APP
def boot(b,seed):
    c=b.new_context(bypass_csp=True,viewport={'width':400,'height':900},locale='de')
    pg=c.new_page();pg.errs=[];pg.on('pageerror',lambda e:pg.errs.append(str(e)[:200]))
    pg.goto(URL);pg.wait_for_selector('#ob .btn');pg.locator('#ob [data-ob=skip]').click()
    if not seed:pg.locator('#obs').uncheck()
    pg.locator('#ob [data-ob=go]').click();pg.wait_for_function("document.querySelector('#ob').hidden",timeout=15000)
    pg.evaluate("['start','thread','post','share','sticker'].forEach(k=>Meta.set('tip_'+k,1))");pg.wait_for_timeout(300);return pg
with sync_playwright() as p:
    b=p.chromium.launch(**CHROME,args=['--no-sandbox','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--disable-features=WebRtcHideLocalIpsWithMdns'])
    A=boot(b,True);B=boot(b,False)
    print('A',A.evaluate("DB.mem.size"),'B',B.evaluate("DB.mem.size"))
    for pg in (A,B):
        pg.evaluate("location.hash='#/share'");pg.wait_for_timeout(300)
    A.screenshot(path=OUT+'/hub.png')
    A.locator('[data-act=wifi]').click();A.wait_for_timeout(500);A.screenshot(path=OUT+'/w0.png')
    A.locator('summary.sm').click();A.locator('[data-a=host]').click();A.wait_for_function("document.querySelector('#wmine')&&document.querySelector('#wmine').value.startsWith('RWT|')",timeout=10000)
    offer=A.evaluate("document.querySelector('#wmine').value");print('offer len',len(offer))
    A.wait_for_timeout(800);A.screenshot(path=OUT+'/w1.png')
    B.locator('[data-act=wifi]').click();B.wait_for_timeout(400);B.locator('summary.sm').click();B.locator('[data-a=join]').click();B.wait_for_timeout(500)
    B.fill('#wpaste',offer)
    B.wait_for_function("document.querySelector('#wmine')&&document.querySelector('#wmine').value.startsWith('RWT|')",timeout=10000)
    ans=B.evaluate("document.querySelector('#wmine').value");print('answer len',len(ans));B.screenshot(path=OUT+'/w2.png')
    A.fill('#wpaste',ans)
    A.wait_for_timeout(250);A.screenshot(path=OUT+'/w3.png')
    for name,pg in (('A',A),('B',B)):
        try:pg.wait_for_selector('.sa[data-s=done]',timeout=15000)
        except Exception as e:print(name,'no done',pg.locator('#wb').inner_text()[:100])
    B.wait_for_timeout(600);B.screenshot(path=OUT+'/w4.png')
    print('B subs',B.evaluate('subs().length'),'A subs',A.evaluate('subs().length'));print('B objs after',B.evaluate("DB.mem.size"),'A',A.evaluate("DB.mem.size"),'B threads',B.evaluate("roots().length"))
    print(B.locator('#wb').inner_text()[:80].replace('\n',' '));print('errs',A.errs,B.errs)
    # RW1-Rahmen-Pfad
    fr=A.evaluate("async()=>{const f=await framesFor({k:'offer',sdp:'v=0\\r\\n'+'a'.repeat(1500)},'RW1');return f.frames}")
    r=None
    for f in fr:r=B.evaluate("t=>handleCode(t)",f)
    print('frames',len(fr),'->',r.get('kind'),len(r['sig']['sdp']))
