import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

with sync_playwright() as p:
    b = p.chromium.launch(**CHROME)
    A, ea = boot(b, True); B, eb = boot(b, False)
    A.evaluate("""async()=>{let s='';for(let i=0;i<150000;i++)s+=String.fromCharCode((i*131+(i>>5))%256);const d=btoa(s);
      await DB.put({t:'blob',id:sha(d),data:d});window.__big=sha(d);await postComment(roots()[0].id,'Mit Anhang',null,{media:[{h:sha(d),m:'application/pdf',n:'gross.pdf',s:d.length}]})}""")
    BIG = A.evaluate('window.__big')
    nb = lambda pg: pg.evaluate("[...DB.mem.values()].filter(o=>o.t==='blob').length")
    B.evaluate("()=>{Meta.set('att','none')}")
    n0 = nb(B)
    # 1) ohne Ausnahme: Sender lässt grosse Anhänge weg
    f1 = A.evaluate("async()=>{const m=await makeStream();return {n:m.frames.length,sk:m.skipped}}")
    print('ohne Ausnahme', f1); assert f1['sk'] >= 1
    # 2) mit Ausnahme beim Sender, Empfänger aber begrenzt: Anhang wird zurückgestellt
    A.evaluate("()=>{QRALL=true}")
    fr = A.evaluate("async()=>{const m=await makeStream();return m.frames}")
    print('mit Ausnahme (Sender):', len(fr), 'Bilder'); assert len(fr) > 300
    r = None
    for t in fr: r = B.evaluate("async t=>handleCode(t)", t)
    print('Empfänger begrenzt:', r, 'Anhänge', nb(B)); assert not B.evaluate('id=>DB.mem.has(id)', BIG)
    assert B.evaluate("Object.keys(deferM()).length") >= 1
    # 3) Empfänger hebt Begrenzung auf, scannt erneut (neuer Austausch, neue Sitzung)
    fr = A.evaluate("async()=>{const m=await makeStream();return m.frames}")
    B.evaluate("()=>{QRALL=true}")
    B.evaluate("()=>{for(const q of RXS.values()){q.dec.clear();q.skip.clear()}}")
    for t in fr: r = B.evaluate("async t=>handleCode(t)", t)
    print('Empfänger mit Ausnahme:', r, 'Anhänge', nb(B))
    assert B.evaluate('id=>DB.mem.has(id)', BIG)
    B.evaluate("()=>{QRALL=false}")
    print('Fehler:', ea, eb); assert not ea and not eb
    print('OK')
