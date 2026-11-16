import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
URL=APP
with sync_playwright() as p:
    b=p.chromium.launch(**CHROME,args=['--no-sandbox'])
    c=b.new_context(bypass_csp=True,viewport={'width':400,'height':860},locale='de');pg=c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    pg.goto(URL);pg.wait_for_selector('#ob .btn');pg.locator('#ob [data-ob=skip]').click();pg.locator('#ob [data-ob=go]').click();pg.wait_for_function("document.querySelector('#ob').hidden",timeout=15000)
    pg.evaluate("['start','thread','post','share','sticker'].forEach(k=>Meta.set('tip_'+k,1));Meta.set('backupAsked',1)");pg.wait_for_timeout(300)
    pg.screenshot(path=OUT+'/s1.png')
    pg.locator('.tabbar [data-k=subs]').click();pg.wait_for_timeout(400);pg.screenshot(path=OUT+'/s2.png')
    pg.locator('[data-act=newsub]').click();pg.wait_for_timeout(300)
    pg.fill('#sn','x'*40);print('name len',pg.evaluate("document.querySelector('#sn').value.length"))
    pg.fill('#sd','y'*600);print('desc len',pg.evaluate("document.querySelector('#sd').value.length"))
    pg.locator('[data-a=go]').click();pg.wait_for_timeout(200);print('errs shown',pg.locator('#e_sr').inner_text())
    pg.fill('#sn','Radfahren');pg.fill('#sd','Alles zu Rädern, Wegen und Werkstätten in der Stadt.');pg.screenshot(path=OUT+'/s3.png')
    pg.locator('[data-a=go]').click();pg.wait_for_timeout(200);print('rules err',pg.locator('#e_sr').inner_text())
    pg.fill('#sr','Freundlich bleiben. Keine Werbung.');pg.locator('[data-a=go]').click();pg.wait_for_function("location.hash.startsWith('#/s/')",timeout=15000);pg.wait_for_timeout(300);pg.screenshot(path=OUT+'/s4.png')
    pg.locator('[data-act=newin]').click();pg.wait_for_timeout(300);pg.locator('[data-k=free]').click();pg.wait_for_timeout(300)
    print('preselected',pg.evaluate("document.querySelector('#ns').selectedOptions[0].textContent"));pg.screenshot(path=OUT+'/s5.png')
    pg.fill('#nt','Welche Werkstatt ist gut?');pg.locator('[data-a=go]').click();pg.wait_for_function("location.hash.startsWith('#/t/')",timeout=15000);pg.wait_for_timeout(300);pg.screenshot(path=OUT+'/s6.png')
    pg.evaluate("location.hash='#/'");pg.wait_for_timeout(400);pg.screenshot(path=OUT+'/s7.png')
    print('subs',pg.evaluate("subs().length"),'in sub',pg.evaluate("subThreads(subs().find(x=>x.name==='Radfahren').id).length"))
    # Validierung
    print('invalid',pg.evaluate("subOk({name:'a',desc:'1234567890',rules:'1234567890',salt:'x',ts:1})"),pg.evaluate("subOk({name:'ab',desc:'x'.repeat(501),rules:'1234567890',salt:'x',ts:1})"),pg.evaluate("subOk({name:'x'.repeat(30),desc:'x'.repeat(500),rules:'y'.repeat(500),salt:'x',ts:1})"))
    print(errs)
