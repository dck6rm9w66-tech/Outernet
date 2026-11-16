import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
with sync_playwright() as p:
    b=p.chromium.launch(**CHROME,args=['--no-sandbox','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'])
    A,ea=boot(b,True);B,eb=boot(b,False)
    print('A threads',A.evaluate("roots().length"),'B threads',B.evaluate("roots().length"))
    frames=A.evaluate("""async()=>{const st=await makeStream();const cv=document.createElement('canvas'),out=[];let bad=0;
      for(const f of st.frames){drawQR(cv,f,340);const c=cv.getContext('2d').getImageData(0,0,cv.width,cv.height);const r=jsQR(c.data,cv.width,cv.height);if(!r||r.data!==f)bad++;out.push(r?r.data:'')}
      return{n:out.length,bad,skipped:st.skipped,out}}""")
    print('frames',frames['n'],'decode-bad',frames['bad'],'skipped',frames['skipped'])
    import random;fl=frames['out'];random.shuffle(fl)
    res=None
    for f in fl+fl[:3]:
        r=B.evaluate("t=>handleCode(t)",f)
        if r and r.get('kind')=='data':res=r;break
    print('B result',res,'B threads',B.evaluate("roots().length"),'objs',B.evaluate("DB.mem.size"),'A objs',A.evaluate("DB.mem.size"))
    # Aufkleber
    t=A.evaluate("""async()=>{const r=roots().find(x=>x.anchor.kind==='place');stickerSheet(r.id);await new Promise(s=>setTimeout(s,900));const cv=document.querySelector('#sq');const c=cv.getContext('2d').getImageData(0,0,cv.width,cv.height);const q=jsQR(c.data,cv.width,cv.height);closeSheet();return{id:r.id,txt:q&&q.data}}""")
    print('sticker text len',len(t['txt']),t['txt'][:12])
    C,ec=boot(b,False)
    print('C before',C.evaluate("DB.mem.has('%s')"%t['id']))
    print(C.evaluate("t=>handleCode(t)",t['txt']),'C after',C.evaluate("DB.mem.has('%s')"%t['id']),C.evaluate("location.hash"))
    # UI: Verbinden-Dialog mit Fake-Kamera
    A.evaluate("()=>['start','thread','post','share','sticker','shared','meet','me','vote'].forEach(k=>Meta.set('tip_'+k,1))");A.evaluate("location.hash='#/share'");A.wait_for_timeout(500)
    A.locator('[data-act=connect]').first.click();A.wait_for_timeout(2500)
    print('dlg:',A.locator('#qsi').inner_text(),'|',A.locator('#qvi').inner_text(), A.evaluate("document.querySelector('#qv').videoWidth"))
    A.screenshot(path=OUT+'/connect.png');A.keyboard.press('Escape');A.wait_for_timeout(300)
    A.locator('[data-act=area][data-k=places]').click();A.wait_for_timeout(300);A.screenshot(path=OUT+'/places.png')
    A.locator('[data-act=sticker]').first.click();A.wait_for_timeout(900);A.screenshot(path=OUT+'/sticker.png');A.keyboard.press('Escape')
    A.locator('[data-act=area][data-k=plugin]').click();A.wait_for_timeout(300);A.screenshot(path=OUT+'/plugin.png')
    print('errors',ea,eb,ec)
