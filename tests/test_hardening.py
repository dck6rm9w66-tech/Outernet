"""Härtung gegen umgebaute Clients: Alles, was von aussen kommt, wird beim Empfänger geprüft."""
import sys, os, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *

R = []
def ok(name, cond, extra=''):
    R.append(bool(cond)); print(('PASS ' if cond else 'FAIL ') + name, extra)

PAY = '"><img src=x onerror=window.__pwn=1><svg onload=window.__pwn=1>'
with sync_playwright() as p:
    b = p.chromium.launch(**CHROME)
    pg, errs = boot(b, False)
    pg.evaluate("()=>['start','thread','post','share','sticker'].forEach(k=>Meta.set('tip_'+k,1))")

    # 1 Ungültiges Zeitfenster
    r = pg.evaluate("""async()=>{const key=await keyFromSeed(rnd32()),T=sha('t'),o={};
      for(const[k,dt]of[['plus1h',36e5],['plus3h',108e5]]){const u={t:'comment',thread:T,parent:null,body:'x',v:1,ts:Math.floor((Date.now()+dt)/6e4)*6e4,author:key.pub};o[k]=await validate(await signObj(u,key))}return o}""")
    ok('Zeitstempel +1 h ok, +3 h abgelehnt', r['plus1h'] and not r['plus3h'], r)

    # 2 Tiefe Kommentarkette und viele Kommentare (an validate vorbei, nur Rendering)
    pg.evaluate("""async()=>{const key=await keyFromSeed(rnd32());
      const root=await signObj({t:'root',v:1,title:'Tief',anchor:{kind:'free'},geo:null,ts:Date.now()-1e5,author:key.pub,salt:'aa'},key);DB.mem.set(root.id,root);window.__T=root.id;
      let par=null;const N=Date.now();
      for(let i=0;i<3000;i++){const c={t:'comment',v:1,thread:root.id,parent:par,body:'Ebene '+i+' wort wort wort',ts:N-(3000-i)*1000,author:'a'.repeat(63)+(i%10),id:sha('c'+i),pow:0,sig:'0'.repeat(128)};DB.mem.set(c.id,c);par=c.id}
      for(let i=0;i<2000;i++){const c={t:'comment',v:1,thread:root.id,parent:null,body:'Flach '+i+' alpha beta gamma delta '+(i%7),ts:N-i*500,author:'b'.repeat(60)+String(1000+i%900),id:sha('f'+i),pow:0,sig:'0'.repeat(128)};DB.mem.set(c.id,c)}
      DB.index()}""")
    t0 = time.time()
    n = pg.evaluate("""async()=>{const t=performance.now();const r=detail(DB.mem.get(window.__T),'best',null);
       let md=0;const w=(a,d)=>{md=Math.max(md,d);a.forEach(x=>w(x.kids,d+1))};w(r.tree,1);return{ms:Math.round(performance.now()-t),depth:md,n:r.flat.length}}""")
    ok('5000 Kommentare, Kette von 3000: Auswertung schnell und Tiefe begrenzt', n['ms'] < 4000 and n['depth'] <= 22 and n['n'] == 5000, n)
    pg.evaluate("t=>{location.hash='#/t/'+t}", pg.evaluate("window.__T")); pg.wait_for_timeout(1500)
    ok('Unterhaltung mit Riesenkette lässt sich öffnen', pg.locator('#clist .c').count() > 10 and not errs, errs)
    pg.evaluate("()=>{location.hash='#/'}"); pg.wait_for_timeout(300)

    # 3 Bild-Bomben und falsche Typen
    r = pg.evaluate("""()=>{const bytes=a=>btoa(String.fromCharCode(...a));
      const pad=n=>Array(n).fill(0);
      const png=(w,h)=>bytes([0x89,0x50,0x4e,0x47,13,10,26,10,0,0,0,13,73,72,68,82,w>>>24&255,w>>>16&255,w>>>8&255,w&255,h>>>24&255,h>>>16&255,h>>>8&255,h&255,...pad(40)]);
      const jpg=(w,h)=>bytes([255,216,255,224,0,16,74,70,73,70,0,1,1,0,0,1,0,1,0,0,255,192,0,17,8,h>>8,h&255,w>>8,w&255,3,1,34,0,2,17,1,3,17,1,...pad(40)]);
      return{png_ok:imgSafe('image/png',png(800,600)),png_bomb:imgSafe('image/png',png(60000,60000)),png_wide:imgSafe('image/png',png(9000,9000)),
        jpg_ok:imgSafe('image/jpeg',jpg(1280,720)),jpg_bomb:imgSafe('image/jpeg',jpg(30000,30000)),mismatch:imgSafe('image/jpeg',png(10,10)),junk:imgSafe('image/png',btoa('x'.repeat(200))),
        gif_bomb:imgSafe('image/gif',bytes([71,73,70,56,57,97,255,255,255,255,...pad(40)]))}}""")
    ok('Bildprüfung: normale Bilder ok, Bomben/Fremdtypen nicht', r['png_ok'] and r['jpg_ok'] and not any(r[k] for k in ('png_bomb','png_wide','jpg_bomb','mismatch','junk','gif_bomb')), r)
    # echtes Bild aus dem Browser wird akzeptiert
    real = pg.evaluate("""()=>{const c=document.createElement('canvas');c.width=64;c.height=48;const x=c.getContext('2d');x.fillStyle='red';x.fillRect(0,0,64,48);
      return['image/jpeg','image/png','image/webp'].map(m=>{const d=c.toDataURL(m,.8);return d.startsWith('data:'+m)?imgSafe(m,d.split(',')[1]):'n/a'})}""")
    ok('echte Browser-Bilder (JPEG/PNG/WebP) werden akzeptiert', all(v is True or v == 'n/a' for v in real), real)

    # 4 Bomben-Bild in der Anzeige
    pg.evaluate("""async()=>{const key=await keyFromSeed(rnd32());const bytes=a=>btoa(String.fromCharCode(...a));
      const d=bytes([0x89,0x50,0x4e,0x47,13,10,26,10,0,0,0,13,73,72,68,82,0,0,234,96,0,0,234,96,...Array(60).fill(0)]);
      DB.mem.set(sha(d),{t:'blob',id:sha(d),data:d});
      const root=await signObj({t:'root',v:1,title:'Bombe',anchor:{kind:'free'},geo:null,ts:Date.now()-1e4,author:key.pub,salt:'bb'},key);DB.mem.set(root.id,root);
      const c=await signObj({t:'comment',v:1,thread:root.id,parent:null,body:'bild',ts:Date.now()-5e3,author:key.pub,media:[{h:sha(d),m:'image/png',n:'x.png',s:100},{h:sha(d),m:'application/zip',n:'../../Rechnung\\u202egpj.exe',s:100}]},key);DB.mem.set(c.id,c);DB.index();window.__B=root.id}""")
    pg.evaluate("t=>{location.hash='#/t/'+t}", pg.evaluate("window.__B")); pg.wait_for_timeout(700)
    ok('Bilder-Bombe wird nicht angezeigt', pg.locator('#clist img').count() == 0 and 'ungültig' in pg.inner_text('#clist'))
    dl = pg.locator('#clist a[download]').first.get_attribute('download')
    ok('Dateiname gesäubert (kein Pfad, keine Umkehrzeichen, .txt statt .exe)', dl and '/' not in dl and '‮' not in dl and dl.endswith('.txt'), dl)
    ok('Warnhinweis bei Dateien von Unbekannten', 'trau' in pg.inner_text('#clist'))
    pg.evaluate("()=>{location.hash='#/'}")

    # 5 Premium-Auszeichnungen nicht beliebig häufbar
    r = pg.evaluate("""async()=>{const key=await keyFromSeed(rnd32()),k2=await keyFromSeed(rnd32());const T=sha('award-thread'),tg=sha('target'),ev=[];
      for(let i=0;i<10;i++)ev.push({t:'award',target:tg,kind:'platin',tier:'premium',author:key.pub,ts:i});
      for(let i=0;i<10;i++)ev.push({t:'award',target:tg,kind:'hilfreich',tier:'free',author:k2.pub,ts:i});
      const a=awardsOf(ev,tg);return a}""")
    ok('10 × Platin vom selben Schlüssel zählen höchstens 3 ×, Gratis nur 1 ×', r['c'].get('platin') == 3 and r['c'].get('hilfreich') == 1, r['c'])

    # 6 Alle Textfelder mit Schadcode: nichts darf ausgeführt oder eingefügt werden
    pg.evaluate("""async(P)=>{const key=await keyFromSeed(rnd32());const N=Date.now();
      const sub={t:'sub',v:1,name:P.slice(0,40),desc:P,rules:P,ts:N-9e5,author:key.pub,salt:'cc',id:sha('sub'+P),pow:0,sig:'0'.repeat(128)};DB.mem.set(sub.id,sub);
      const root={t:'root',v:1,title:P,anchor:{kind:P.slice(0,20),text:P,url:'https://beispiel.example/'+encodeURIComponent(P)},geo:{lat:1,lon:2,gh:P.slice(0,12)},ts:N-8e5,author:key.pub,salt:P.slice(0,60),sub:sub.id,id:sha('r'+P),pow:0,sig:'0'.repeat(128)};DB.mem.set(root.id,root);
      const c={t:'comment',v:1,thread:root.id,parent:null,body:P,kind:P.slice(0,20),url:'https://x.example/'+encodeURIComponent(P),media:[{h:sha('zz'),m:'image/png',n:P},{h:sha('yy'),m:'audio/webm',n:P}],ts:N-7e5,author:key.pub,id:sha('c'+P),pow:0,sig:'0'.repeat(128)};DB.mem.set(c.id,c);DB.index();window.__X=[root.id,sub.id]}""", PAY)
    for h in ['#/', '#/subs', '#/s/' + pg.evaluate("window.__X[1]"), '#/t/' + pg.evaluate("window.__X[0]")]:
        pg.evaluate("h=>{location.hash=h}", h); pg.wait_for_timeout(600)
    pwn = pg.evaluate("window.__pwn"); inj = pg.evaluate("document.querySelectorAll('img[src=x],svg[onload]').length")
    ok('Schadcode in allen Textfeldern: nichts ausgeführt, nichts eingefügt', pwn is None and inj == 0, (pwn, inj))
    # 7 Manipulierte Links
    pg.evaluate("()=>{location.hash='#/link/javascript:window.__pwn=2'}"); pg.wait_for_timeout(500)
    pg.evaluate("()=>{location.hash='#/link/https://a.example/'+encodeURIComponent('\"><img src=x onerror=window.__pwn=3>')}"); pg.wait_for_timeout(700)
    ok('präparierte #/link/-Adressen führen nichts aus', pg.evaluate("window.__pwn") is None and pg.evaluate("document.querySelectorAll('img[src=x]').length") == 0)
    ok('keine Seitenfehler', not errs, errs)
    b.close()
print('Ergebnis:', sum(R), '/', len(R)); sys.exit(0 if all(R) else 1)
