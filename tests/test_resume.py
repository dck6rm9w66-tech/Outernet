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
    st=A.evaluate("async()=>{const s=await makeStream();return{n:s.frames.length,f:s.frames,skipped:s.skipped,cut:s.cut,count:s.count}}")
    fr=st['f'];print('A frames',st['n'],'skipped',st['skipped'],'cut',st['cut'],'maxlen',max(map(len,fr)))
    random.seed(3);idx=list(range(len(fr)));random.shuffle(idx);half=idx[:len(fr)//2]
    for i in half:B.evaluate("t=>handleCode(t)",fr[i])
    print('B nach Haelfte: objs',B.evaluate("DB.mem.size"),'threads',B.evaluate("roots().length"),'ledger',B.evaluate("JSON.stringify(ledger().map(x=>[x.via,x.have,x.tot,x.state]))"))
    B.evaluate("qrInterrupted()");print('after interrupt ledger',B.evaluate("JSON.stringify(ledger().map(x=>[x.via,x.have,x.tot,x.state]))"))
    # Neuladen von B (Persistenz), Rest einspielen
    B.reload();B.wait_for_timeout(1500)
    try:B.wait_for_function("typeof DB!=='undefined'&&DB.mem.size>0",timeout=5000)
    except Exception as e:print('no persist?')
    print('B nach Reload objs',B.evaluate("DB.mem.size"),'ledger',B.evaluate("JSON.stringify(ledger().map(x=>[x.via,x.have,x.tot,x.state]))"))
    res=None
    for i in idx:
        r=B.evaluate("t=>handleCode(t)",fr[i])
        if r and r.get('kind')=='data':res=r
    print('Resume result',res,'objs',B.evaluate("DB.mem.size"),'A',A.evaluate("DB.mem.size"),'blob',B.evaluate("[...DB.mem.values()].filter(o=>o.t==='blob').length"))
    print('ledger',B.evaluate("JSON.stringify(ledger().map(x=>[x.via,x.have,x.tot,x.state]))"))
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
        C.wait_for_function("window.__res!==null",timeout=30000)
        return C.evaluate("window.__res")
    r1=link(True);print('Lauf1 (unterbrochen)',r1,'C objs',C.evaluate("DB.mem.size"),'ledger',C.evaluate("JSON.stringify(ledger().map(x=>[x.via,x.have,x.tot,x.state]))"),'gap',C.evaluate("JSON.stringify(gapMap())"))
    print('C blob?',C.evaluate("[...DB.mem.values()].filter(o=>o.t==='blob').length"),'partial',C.evaluate("DB.pkeys().then(s=>s.size)"))
    r2=link(False);print('Lauf2 (fortgesetzt)',r2,'C objs',C.evaluate("DB.mem.size"),'A',A.evaluate("DB.mem.size"),'blob',C.evaluate("[...DB.mem.values()].filter(o=>o.t==='blob').length"),'partial',C.evaluate("DB.pkeys().then(s=>s.size)"),'gap',C.evaluate("JSON.stringify(gapMap())"))
    assert res and res['kind']=='data','QR-Fortsetzung nicht abgeschlossen'
    assert r1.get('err'),'Abbruch wurde nicht ausgelöst'
    assert C.evaluate("DB.mem.size")==A.evaluate("DB.mem.size"),'WLAN-Fortsetzung unvollständig'
    assert not(ea or eb or ec),(ea,eb,ec)
    print('OK')
