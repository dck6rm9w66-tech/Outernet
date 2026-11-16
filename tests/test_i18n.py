import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
import re,sys
GER=re.compile(r"\b(und|nicht|der|die|das|ein|eine|ich|du|mit|für|auf|Diskussion|Beitrag|Kommentare?|Teilen|Entdecken|Schreiben|Sichern|Hilfe|Zurück|Standort|Datei|Sicherungs|Auszeichn\w*|Übersetz\w*)\b")
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(**CHROME,args=['--no-sandbox','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'])
    for lang in ['de','en','fr','zh','ja','ru']:
        c=b.new_context(bypass_csp=True,viewport={'width':420,'height':860},locale=lang if lang!='zh' else 'zh-CN',permissions=['geolocation','camera'])
        pg=c.new_page();pg.on('pageerror',lambda e:errs.append(('err',lang,str(e))))
        pg.on('console',lambda m:m.type=='error' and errs.append(('con',lang,m.text)))
        pg.goto(APP)
        pg.wait_for_selector('#ob .btn',timeout=8000)
        # Onboarding durchklicken
        for _ in range(4):
            bt=pg.locator('#ob [data-ob]:not([data-ob=lang])').last
            if not pg.locator('#ob').is_visible():break
            isgo=bt.get_attribute('data-ob')=='go'
            bt.click();pg.wait_for_timeout(300)
            if isgo:break
        pg.wait_for_function("document.querySelector('#ob').hidden",timeout=15000)
        pg.evaluate("['start','thread','post','share','sticker'].forEach(k=>Meta.set('tip_'+k,1))");pg.wait_for_timeout(500)
        def scan(name):
            txt=pg.evaluate("""()=>{const o=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(n.parentElement.closest('[translate=no],script,style,noscript,[hidden]'))continue;const t=n.nodeValue.trim();if(t)o.push(t)}
              document.querySelectorAll('[placeholder],[aria-label]').forEach(e=>{if(e.closest('[translate=no]'))return;['placeholder','aria-label'].forEach(a=>{const v=e.getAttribute(a);if(v)o.push(v)})});return o}""")
            if lang!='de':
                bad=[t for t in txt if GER.search(t)]
                if bad:print(lang,name,'LEFTOVER:',bad[:6])
        scan('feed')
        pg.locator('.card.thr').first.click();pg.wait_for_timeout(500);scan('thread')
        pg.locator('[data-act=award]').first.click();pg.wait_for_timeout(300);scan('award');pg.keyboard.press('Escape')
        pg.locator('textarea').first.fill('x');pg.wait_for_timeout(100)
        pg.go_back();pg.wait_for_timeout(300)
        for h,n in [('#/share','share'),('#/me','me'),('#/subs','subs')]:
            pg.evaluate(f"location.hash='{h}'");pg.wait_for_timeout(500);scan(n)
        pg.evaluate("location.hash='#/share'");pg.wait_for_timeout(300)
        for k in ['places','plugin']:
            pg.locator(f'[data-act=area][data-k={k}]').click();pg.wait_for_timeout(300);scan('area-'+k)
        pg.locator('[data-act=area][data-k=places]').click();pg.wait_for_timeout(200)
        pg.locator('[data-act=sticker]').first.click();pg.wait_for_timeout(800);scan('sticker');pg.keyboard.press('Escape')
        pg.locator('[data-act=scan]').click();pg.wait_for_timeout(600);scan('scan');pg.keyboard.press('Escape')
        pg.locator('[data-act=area][data-k=offline]').click();pg.wait_for_timeout(200)
        pg.locator('[data-act=connect]').click();pg.wait_for_timeout(800);scan('connect');pg.keyboard.press('Escape')
        pg.evaluate('subSheet()');pg.wait_for_timeout(400);scan('subsheet');pg.keyboard.press('Escape')
        pg.evaluate("location.hash='#/s/'+subs()[0].id");pg.wait_for_timeout(400);scan('subview');pg.evaluate('newSheet(0)');pg.wait_for_timeout(300);scan('new0');pg.keyboard.press('Escape')
        pg.evaluate("location.hash='#/share'");pg.wait_for_timeout(400)
        pg.locator('[data-act=wifi]').click();pg.wait_for_timeout(500);scan('wifi-choose')
        pg.locator('[data-a=near]').click();pg.wait_for_timeout(400);scan('wifi-setup');pg.keyboard.press('Escape');pg.evaluate('wifiSheet()');pg.wait_for_timeout(400)
        pg.locator('#dlg details summary').first.click();pg.locator('[data-a=host]').click();pg.wait_for_timeout(2000);scan('wifi-host');pg.keyboard.press('Escape')
        for act in ['help','backup','restore']:
            pg.evaluate("location.hash='#/me'");pg.wait_for_timeout(300)
            pg.locator(f'[data-act={act}]').first.click();pg.wait_for_timeout(300);scan(act);pg.keyboard.press('Escape')
        pg.evaluate("location.hash='#/me'");pg.wait_for_timeout(300)
        pg.locator('[data-act=wipe]').click();pg.wait_for_timeout(300);scan('wipe');pg.keyboard.press('Escape')
        pg.evaluate("location.hash='#/'");pg.wait_for_timeout(300)
        pg.locator('[data-act=new],[data-act=compose]').first.click() if pg.locator('[data-act=new],[data-act=compose]').count() else None
        pg.wait_for_timeout(300);scan('new')
        print(lang,'h1:',pg.locator('h1').first.inner_text()[:40])
        c.close()
    b.close()
print('ERRORS',errs)
