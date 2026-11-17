import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
import json,base64
errs=[]
PNG=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==')
open(OUT+'/t.png','wb').write(PNG)
with sync_playwright() as p:
    b=p.chromium.launch(**CHROME,args=['--no-sandbox'])
    ctx=b.new_context(bypass_csp=True,viewport={'width':400,'height':820},accept_downloads=True,permissions=['geolocation'],geolocation={'latitude':52.52,'longitude':13.405})
    pg=ctx.new_page()
    pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)))
    pg.on('console',lambda m:m.type=='error' and errs.append('CONSOLE '+m.text))
    pg.goto(APP)
    pg.wait_for_selector('#ob:not([hidden])')
    print('sha ok', pg.evaluate("sha('abc')")=='ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
    pg.screenshot(path=OUT+'/ob1.png')
    pg.click('[data-ob=next]'); pg.click('[data-ob=next]'); pg.click('[data-ob=next]'); pg.screenshot(path=OUT+'/ob3.png')
    pg.click('[data-ob=go]')
    pg.wait_for_selector('#ob',state='hidden',timeout=30000)
    pg.evaluate("()=>['start','thread','post','share','sticker'].forEach(k=>Meta.set('tip_'+k,1))")
    pg.wait_for_selector('.thr')
    print('threads',pg.locator('.thr').count())
    pg.screenshot(path=OUT+'/feed.png')
    pg.click('.thr >> nth=0'); pg.wait_for_selector('#clist .cb')
    print('first comment:',pg.inner_text('#clist .cb p >> nth=0')[:50])
    pg.screenshot(path=OUT+'/thread.png',full_page=False)
    pg.click('#clist .vote button.u >> nth=1'); 
    pg.wait_for_timeout(1200)
    pg.fill('#ct','Das ist mein Test-Kommentar'); pg.set_input_files('[data-f=img]',OUT+'/t.png'); pg.click('[data-t=send]')
    pg.wait_for_function("document.querySelector('#clist').innerText.includes('Test-Kommentar')")
    print('img shown',pg.locator('#clist .media img').count())
    # Datenschutz-Warnung
    pg.fill('#ct','Ruf mich an: 0171 1234567'); pg.click('[data-t=send]'); pg.wait_for_selector('dialog[open]'); print('warn:',pg.inner_text('dialog h2')); pg.click('[data-a=n]')
    # Export HTML
    with pg.expect_download() as d: pg.click('[data-act=exp]')
    path=OUT+'/export.html'; d.value.save_as(path); print('export size',len(open(path).read()))
    pg.screenshot(path=OUT+'/thread2.png')
    objs=pg.evaluate("[...DB.mem.values()]"); json.dump({'objects':objs},open(OUT+'/objs.json','w'))
    # Import in frischem Kontext
    ctx2=b.new_context(bypass_csp=True,viewport={'width':400,'height':820}); p2=ctx2.new_page(); p2.on('pageerror',lambda e:errs.append('P2 '+str(e)))
    p2.goto(APP); p2.wait_for_selector('#ob:not([hidden])')
    p2.click('[data-ob=skip]'); p2.uncheck('#obs'); p2.click('[data-ob=go]'); p2.wait_for_selector('#ob',state='hidden')
    p2.click('#tabbar [data-k=share]'); p2.set_input_files('#imp',path); p2.wait_for_selector('.toast')
    print('import toast:',p2.inner_text('.toast'))
    p2.click('#tabbar [data-k=feed]'); print('threads after import',p2.locator('.thr').count())
    # Zeitanker
    p2.wait_for_timeout(1500); p2.evaluate('()=>closeSheet()')
    p2.click('#tabbar [data-k=share]'); p2.click('summary'); print('anchor',p2.inner_text('.code')[:16])
    # Dark + help
    p2.click('#tabbar [data-k=me]'); p2.click('[data-k=dark]'); p2.screenshot(path=OUT+'/me_dark.png')
    print('errors:',errs)
    b.close()
