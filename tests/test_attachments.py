import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
import sys,random

with sync_playwright() as p:
    b=p.chromium.launch(**CHROME,args=['--no-sandbox','--disable-features=WebRtcHideLocalIpsWithMdns'])
    A,ea=boot(b,True);B,eb=boot(b,False)
    A.on('console',lambda m:print('A:',m.text[:150]) if 'rs' in m.text else 0)
    # grosses Bild als Blob in A (Fragmente)
    A.evaluate("""async()=>{const d=btoa((()=>{let s='';for(let i=0;i<500000;i++)s+=String.fromCharCode((i*131+(i>>5))%256);return s})());const h=sha(d);
      const o={t:'blob',id:h,data:d};await DB.put(o)}""")
    # WLAN: Unterbrechung mitten im Bild, dann Fortsetzen
    C,ec=boot(b,False)
    C.on('console',lambda m:print('C:',m.text[:150]) if m.type in('warning','error') else 0)
    def link(cut):
        for pg in(A,C):pg.evaluate("()=>{window.__r=null;window.__p=new RTCPeerConnection();window.__p.onicecandidate=e=>{if(e.candidate)(window.__ic=window.__ic||[]).push(e.candidate)}}")
        A.evaluate("()=>{window.__ic=[];window.__dca=window.__p.createDataChannel('rn')}")
        C.evaluate("()=>{window.__ic=[];window.__dcP=new Promise(r=>window.__p.ondatachannel=e=>r(e.channel))}")
        off=A.evaluate("async()=>{await __p.setLocalDescription(await __p.createOffer());await new Promise(r=>setTimeout(r,500));return __p.localDescription.toJSON()}")
        ans=C.evaluate("async o=>{await __p.setRemoteDescription(o);await __p.setLocalDescription(await __p.createAnswer());await new Promise(r=>setTimeout(r,500));return __p.localDescription.toJSON()}",off)
        A.evaluate("async o=>{await __p.setRemoteDescription(o)}",ans)
        A.evaluate("async()=>{await new Promise(r=>__dca.readyState==='open'?r():__dca.onopen=r)}")
        C.evaluate("async()=>{window.__dcc=await __dcP;await new Promise(r=>__dcc.readyState==='open'?r():__dcc.onopen=r)}")
        C.evaluate("()=>{window.__res=null;window.__n=0;runSync(__dcc,(a,n)=>{window.__n=a}).then(r=>window.__res=r).catch(e=>window.__res={err:1})}")
        if cut:
            A.evaluate("()=>{let n=0;const o=__dca.send.bind(__dca);__dca.send=m=>{if(typeof m==='string'&&m.startsWith('{\"t\":\"frag\"')&&++n>=12){__dca.close();return}o(m)}}")
        A.evaluate("()=>{window.__res=null;runSync(__dca,()=>{}).then(r=>window.__res=r).catch(e=>window.__res={err:1})}")
        C.wait_for_timeout(6000);print('dbgp',C.evaluate('DB.pkeys().then(async s=>{const o=[];for(const k of s){const r=await DB.pget(k);o.push([k.slice(0,8),r.n,Object.keys(r.p).length])}return o})'));print('dbg',C.evaluate('[window.__res,window.__n,DB.mem.size]'),A.evaluate('window.__res'),A.evaluate('__dca.readyState'),C.evaluate('__dcc.readyState'))
        C.wait_for_function("window.__res!==null",timeout=30000)
        return C.evaluate("window.__res")
    C.evaluate("()=>Meta.set('att','none')")
    r1=link(False);print('Lauf1 att=none',r1,'C objs',C.evaluate("DB.mem.size"),'blobs',C.evaluate("[...DB.mem.values()].filter(o=>o.t==='blob').length"),'defer',C.evaluate("Object.keys(deferM()).length"),'earn',C.evaluate("earnSt().n"))
    C.evaluate("()=>{viewMe()}");C.wait_for_timeout(800);print('datac:',C.evaluate("document.querySelector('#datac').innerText.replace(/\\n+/g,' | ')")[:400])
    print('mine:',C.evaluate("document.querySelector('#mythr').innerText.replace(/\\n+/g,' | ')")[:200])
    A.evaluate("()=>{viewMe()}");A.wait_for_timeout(1500);print('A mine:',A.evaluate("document.querySelectorAll('#mythr li').length"),A.evaluate("roots().length"))
    assert C.evaluate("Object.keys(deferM()).length")>0,'nichts zurückgestellt'
    C.evaluate("()=>Meta.set('pull',1)")
    r2=link(False);print('Lauf2 pull',r2,'blobs',C.evaluate("[...DB.mem.values()].filter(o=>o.t==='blob').length"),'defer',C.evaluate("Object.keys(deferM()).length"),'pull',C.evaluate("Meta.get('pull',0)"),'earn',C.evaluate("earnSt().n"))
    assert C.evaluate("[...DB.mem.values()].filter(o=>o.t==='blob').length")==A.evaluate("[...DB.mem.values()].filter(o=>o.t==='blob').length"),'Anhänge nicht nachgeladen'
    assert C.evaluate("Object.keys(deferM()).length")==0
    assert not(ea or eb or ec),(ea,eb,ec)
    print('OK')
