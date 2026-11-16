import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *
import json,sys
URL=APP
def boot(b,csp=False):
    c=b.new_context(bypass_csp=not csp,viewport={'width':400,'height':860},locale='de')
    pg=c.new_page();pg.errs=[];pg.logs=[];pg.reqs=[]
    pg.on('pageerror',lambda e:pg.errs.append(str(e)[:200]));pg.on('console',lambda m:pg.logs.append(m.text));pg.on('request',lambda r:pg.reqs.append(r.url))
    pg.goto(URL);pg.wait_for_selector('#ob .btn.pri');pg.locator('#ob [data-ob=skip]').click();pg.locator('#ob [data-ob=seed]') if False else None
    pg.locator('#ob #obs').uncheck();pg.locator('#ob [data-ob=go]').click();pg.wait_for_selector('#ob',state='hidden',timeout=30000)
    pg.evaluate("()=>{['start','thread','post','share','sticker'].forEach(k=>Meta.set('tip_'+k,1));Meta.set('backupAsked',1);Meta.set('hideSteps',1)}")
    return pg
R=[]
def ok(name,cond,extra=''):
    R.append(cond);print(('PASS ' if cond else 'FAIL ')+name,extra)
with sync_playwright() as p:
    b=p.chromium.launch(**CHROME,args=['--no-sandbox','--disable-features=WebRtcHideLocalIpsWithMdns'])
    pg=boot(b)
    # ---- 1 Validierung feindlicher Objekte
    res=pg.evaluate("""async()=>{
      const key=await keyFromSeed(rnd32()),T=sha('thr'),out={};
      const mk=async(u)=>await signObj({v:1,ts:nowMin(),author:key.pub,...u},key);
      const good=await mk({t:'comment',thread:T,parent:null,body:'hallo welt'});out.good=await validate(good);
      const H=sha('h');
      const cases={
        audio:{t:'comment',thread:T,parent:null,body:'x',media:[{h:H,m:'audio/webm" onloadstart="window.__pwn=1',n:'a',s:1}]},
        mimejunk:{t:'comment',thread:T,parent:null,body:'x',media:[{h:H,m:'text/html',n:'a'.repeat(200)}]},
        locstr:{t:'comment',thread:T,parent:null,body:'x',loc:{lat:'1" onmouseover="window.__pwn=1',lon:2}},
        urlbad:{t:'comment',thread:T,parent:null,body:'x',url:'http://'},
        urljs:{t:'comment',thread:T,parent:null,body:'x',url:'javascript:alert(1)'},
        future:{t:'comment',thread:T,parent:null,body:'x',ts:Date.now()+5*864e5},
        ancient:{t:'comment',thread:T,parent:null,body:'x',ts:1000},
        bigbody:{t:'comment',thread:T,parent:null,body:'x'.repeat(4001)},
        badthread:{t:'comment',thread:'../etc',parent:null,body:'x'},
        badparent:{t:'comment',thread:T,parent:'"><img src=x>',body:'x'},
        votebad:{t:'vote',thread:T,target:T,dir:5},
        votetarget:{t:'vote',thread:T,target:'<script>',dir:1},
        anchornest:{t:'root',title:'t',anchor:{kind:'free',x:{a:1}},salt:'ab',geo:null},
        geostr:{t:'root',title:'t',anchor:{kind:'free'},salt:'ab',geo:{lat:'x',lon:1}},
        awardtier:{t:'award',thread:T,target:T,kind:'hilfreich',tier:'free',receipt:'x'.repeat(600)},
        hugejson:{t:'comment',thread:T,parent:null,body:'x',kind:'k',junk:'y'.repeat(17000)},
      };
      for(const[k,u]of Object.entries(cases)){const o=await mk(u);if(u.ts)delete o.ts,0;out[k]=await validate(o)}
      // ts-Varianten korrekt signieren
      for(const k of ['future','ancient']){const u={...cases[k]};const o=await signObj({v:1,author:key.pub,...u},key);out[k]=await validate(o)}
      const bd={t:'blob',id:sha('x"onerror="window.__pwn=1'),data:'x"onerror="window.__pwn=1'};out.blob=await validate(bd);
      const bd2={t:'blob',id:sha('aGVsbG8='),data:'aGVsbG8='};out.blobgood=await validate(bd2);
      const lowpow=await(async()=>{const u={v:1,t:'comment',thread:T,parent:null,body:'lp',ts:nowMin(),author:key.pub},id=sha(canon(u));let n=0;for(;;n++)if(zeros(sha(id+':'+n))>=4&&zeros(sha(id+':'+n))<13)break;const sig=hex(new Uint8Array(await crypto.subtle.sign('Ed25519',key.priv,enc.encode(canon({id,pow:n})))));return validate({...u,id,pow:n,sig})})();out.lowpow=await lowpow;
      return out}""")
    ok('gültiges Objekt akzeptiert',res['good'] and res['blobgood'])
    bad=[k for k,v in res.items() if k not in('good','blobgood') and v]
    ok('alle feindlichen Objekte abgelehnt',not bad,bad)
    # ---- 2 Rendering-Verteidigung (an validate vorbei eingeschleust)
    pg.evaluate("""async()=>{
      const key=await keyFromSeed(rnd32());
      const html='<html><body><h1>Snap</h1><img src="http://evil.invalid/track.png"><script>window.__pwn=1<\\/script><img src=x onerror="window.__pwn=1"></body></html>';
      const data=btoa(unescape(encodeURIComponent(html)));const blob={t:'blob',id:sha(data),data};DB.mem.set(blob.id,blob);
      const evil={t:'blob',id:sha('EVIL'),data:'A" onerror="window.__pwn=1" x="'};DB.mem.set(evil.id,evil);
      const root=await signObj({t:'root',v:1,title:'XSS-Test <img src=x onerror=window.__pwn=1>',anchor:{kind:'free'},geo:null,ts:Date.now()-1000,snap:{hash:blob.id,size:data.length},author:key.pub,salt:'aa'},key);DB.mem.set(root.id,root);
      const mkc=async(u)=>{const kk=await keyFromSeed(rnd32());const o=await signObj({t:'comment',thread:root.id,parent:null,ts:nowMin(),author:kk.pub,...u},kk);DB.mem.set(o.id,o)};
      await mkc({body:'normal sichtbar'});
      await mkc({body:'a1',media:[{h:evil.id,m:'image/png',n:'"><b>',s:1}]});
      await mkc({body:'a2',media:[{h:evil.id,m:'audio/webm" onloadstart="window.__pwn=1',n:'x',s:1}]});
      await mkc({body:'u1',url:'http://'});
      await mkc({body:'l1',loc:{lat:'1" onmouseover="window.__pwn=1',lon:2}});
      DB.index();window.__tid=root.id;location.hash='#/t/'+root.id}""")
    pg.wait_for_timeout(1500)
    info=pg.evaluate("()=>({pwn:window.__pwn||0,txt:document.querySelector('#clist')?document.querySelector('#clist').innerText:'',onerr:document.querySelectorAll('[onerror],[onloadstart],[onmouseover]').length,iframe:document.querySelectorAll('iframe').length,srcdoc:(document.querySelector('iframe')||{}).srcdoc||''})")
    ok('kein Skript wurde ausgeführt',info['pwn']==0)
    ok('keine eingeschleusten Attribute im DOM',info['onerr']==0,info['onerr'])
    ok('Kommentare rendern trotz Fehlern weiter','normal sichtbar' in info['txt'])
    ok('Snapshot-Frame hat CSP und kein Skript','Content-Security-Policy' in info['srcdoc'] and '<script' not in info['srcdoc'].lower() and 'onerror' not in info['srcdoc'])
    pg.evaluate("()=>{document.querySelector('.snap summary')&&document.querySelector('.snap summary').click()}");pg.wait_for_timeout(500)
    ok('kein Tracking-Request an Fremdserver',not any('evil.invalid' in u for u in pg.reqs),[u for u in pg.reqs if 'evil' in u])
    ok('keine Seitenfehler',not pg.errs,pg.errs)
    # ---- 3 Flut: Sybil mit gleichem Text, eine Taste für viele Roots
    r3=pg.evaluate("""async()=>{
      const spam='Jetzt günstig kaufen auf spam-shop.example gratis';
      const th=roots()[0].id;const arr=[];
      for(let i=0;i<8;i++){const k=await keyFromSeed(rnd32());const o=await signObj({t:'comment',thread:th,parent:null,body:spam,ts:nowMin(),author:k.pub},k);DB.mem.set(o.id,o)}
      const one=await keyFromSeed(rnd32());
      for(let i=0;i<6;i++){const o=await signObj({t:'root',v:1,title:'Rabatt '+i+' xyz abc def ghi',anchor:{kind:'free'},geo:null,ts:Date.now()-i*1000,author:one.pub,salt:'b'+i},one);DB.mem.set(o.id,o)}
      const k2=await keyFromSeed(rnd32());for(let i=0;i<3;i++){const o=await signObj({t:'comment',thread:th,parent:null,body:'siehe http://a.example http://b.example http://c.example '+i,ts:nowMin(),author:k2.pub},k2);DB.mem.set(o.id,o)}
      DB.index();const r=DB.mem.get(th);const d=detail(r,'best',null);
      return{sus:d.flat.filter(x=>x.sus).length,dup:d.flat.filter(x=>x.c.body===spam&&x.sus).length,rootsSpam:roots().filter(spamRoot).length,tot:roots().length}}""")
    ok('Massen-Duplikate werden als auffällig markiert',r3['dup']==8,r3)
    ok('Link-Flut wird markiert',r3['sus']>=11,r3['sus'])
    ok('Roots mit gleicher Taste gelten als Spam',r3['rootsSpam']>=6,r3)
    pg.evaluate("()=>{S.showSpam=false;location.hash='#/';route()}");pg.wait_for_timeout(600)
    n=pg.evaluate("()=>({cards:document.querySelectorAll('.thr').length,note:/Spam/.test(document.querySelector('#main').innerText)})")
    ok('Feed blendet Spam-Roots aus und nennt die Zahl',n['cards']<=3 and n['note'],n)
    # ---- 4 Intake-Gate
    r4=pg.evaluate("""async()=>{
      const old={...LIM};LIM.objs=40;LIM.perAuthor=5;LIM.bad=5;
      const th=sha('gate');const k=await keyFromSeed(rnd32());const arr=[];
      for(let i=0;i<12;i++)arr.push(await signObj({t:'comment',thread:th,parent:null,body:'g'+i,ts:nowMin(),author:k.pub},k));
      const a=await importObjs(arr);
      const junk=[];for(let i=0;i<30;i++)junk.push({t:'comment',id:sha('j'+i),thread:th,author:sha('a'),sig:'0'.repeat(128),pow:1,ts:nowMin(),body:'x'});
      const b=await importObjs(junk);
      Object.assign(LIM,old);return{n:a.n,drop:a.drop,why:b.why,bad:b.bad}}""")
    ok('Pro-Autor-Limit greift',r4['n']==5 and r4['drop']==7,r4)
    ok('Ungültige Flut bricht den Import ab',r4['why']=='ungueltig' and r4['bad']<=7,r4)
    # ---- 5 Speicher-Limit mit Schutz eigener Inhalte
    r5=pg.evaluate("""async()=>{
      const old={...LIM};
      const mine=await createThread({title:'Meine alte Unterhaltung',anchor:{kind:'free'},ts:Date.now()-9*864e5});
      for(let i=0;i<5;i++){await createThread({title:'Fremd alt '+i+' abc def',anchor:{kind:'free'},m:rnd32(),ts:Date.now()-9*864e5})}
      const orphanKey=await keyFromSeed(rnd32());for(let i=0;i<10;i++){const o=await signObj({t:'vote',thread:sha('weg'+i),target:sha('t'),dir:1,ts:nowMin(),author:orphanKey.pub},orphanKey);DB.mem.set(o.id,o)}
      const before=DB.mem.size;LIM.store=Math.floor(before*.5);
      const gone=await DB.prune();const stillMine=DB.mem.has(mine.id);const orphans=[...DB.mem.values()].filter(o=>o.thread&&!DB.mem.has(o.thread)).length;
      const after=DB.mem.size;Object.assign(LIM,old);return{before,after,gone,stillMine,orphans}}""")
    ok('Speicher-Limit räumt auf, eigene Inhalte bleiben',r5['stillMine'] and r5['orphans']==0 and r5['after']<r5['before'],r5)
    # ---- 6 Bösartige Gegenstelle per echtem WebRTC-Kanal
    r6=pg.evaluate("""async()=>{
      const a=new RTCPeerConnection(),c=new RTCPeerConnection();a.onicecandidate=e=>e.candidate&&c.addIceCandidate(e.candidate);c.onicecandidate=e=>e.candidate&&a.addIceCandidate(e.candidate);
      const chA=a.createDataChannel('rn');const chB=await new Promise(async res=>{c.ondatachannel=e=>res(e.channel);await a.setLocalDescription(await a.createOffer());await c.setRemoteDescription(a.localDescription);await c.setLocalDescription(await c.createAnswer());await a.setRemoteDescription(c.localDescription)});
      await Promise.all([new Promise(r=>chA.readyState==='open'?r():chA.onopen=r),new Promise(r=>chB.readyState==='open'?r():chB.onopen=r)]);
      const fake=[...Array(60)].map((_,i)=>sha('fake'+i));
      chB.onmessage=ev=>{const m=JSON.parse(ev.data);if(m.t==='want'&&m.last){chB.send(JSON.stringify({t:'obj',o:fake.map(id=>({t:'comment',id,thread:sha('z'),author:sha('q'),sig:'0'.repeat(128),pow:1,ts:nowMin(),body:'x'}))}));chB.send(JSON.stringify({t:'sent'}))}};
      setTimeout(()=>chB.send(JSON.stringify({t:'inv',ids:fake,last:true})),400);
      const st=await Promise.race([runSync(chA,()=>{}),new Promise(r=>setTimeout(()=>r({timeout:1}),8000))]);return st}""")
    ok('Bösartige Gegenstelle wird abgebrochen',r6.get('why')=='ungueltig' and r6.get('n',0)==0,r6)
    # ---- 7 Ausblenden
    pg.evaluate("()=>{location.hash='#/t/'+window.__tid}");pg.wait_for_timeout(800)
    before=pg.locator('#clist .cb').count()
    pg.locator('[data-act=hide][data-au]').first.click();pg.wait_for_timeout(300);pg.locator('#dlg [data-a=a]').click();pg.wait_for_timeout(500)
    after=pg.locator('#clist .cb').count()
    ok('Person ausblenden entfernt Beiträge',after<before,(before,after))
    pg.evaluate("()=>{location.hash='#/me'}");pg.wait_for_timeout(500)
    ok('Ich-Tab zeigt Schutz-Karte mit Zähler','Ausgeblendete Inhalte: 1' in pg.inner_text('#main'))
    pg.locator('[data-act=unhide]').click();pg.wait_for_timeout(300)
    ok('Wieder anzeigen',pg.evaluate("()=>hidCount()")==0)
    # ---- 8 Fingerprint
    src=open(APP_PATH,encoding='utf-8').read()
    same=pg.evaluate("async(t)=>{const d=new DOMParser().parseFromString(t,'text/html');return sha(staticSig(d))===appFp()}",src)
    tam=pg.evaluate("async(t)=>{const d=new DOMParser().parseFromString(t.replace('</body>','<img src=x onerror=alert(1)></body>'),'text/html');return sha(staticSig(d))===appFp()}",src)
    tam2=pg.evaluate("async(t)=>{const d=new DOMParser().parseFromString(t.replace('const POWT={root:14','const POWT={root:1'),'text/html');return sha(staticSig(d))===appFp()}",src)
    ok('Prüfsumme: Original identisch',same);ok('Prüfsumme: Markup-Manipulation erkannt',not tam);ok('Prüfsumme: Code-Manipulation erkannt',not tam2)
    pg.close()
    # ---- 9 CSP ohne Umgehung
    pc=boot(b,csp=True)
    pc.evaluate("()=>{const i=new Image();i.src='https://example.com/track.png';document.body.append(i);fetch('ftp://x').catch(()=>0)}");pc.wait_for_timeout(600)
    ok('CSP blockiert fremde Bilder',any('Content Security Policy' in l and 'img-src' in l for l in pc.logs),[l[:80] for l in pc.logs][:3])
    pc.evaluate("async()=>{await seed();location.hash='#/'}");pc.wait_for_timeout(1500)
    pc.evaluate("()=>{location.hash='#/t/'+roots()[0].id}");pc.wait_for_timeout(1000)
    pc.evaluate("()=>{const s=document.querySelector('.snap summary');s&&s.click()}");pc.wait_for_timeout(500)
    viol=[l for l in pc.logs if 'Content Security Policy' in l and 'track.png' not in l and 'ftp:' not in l]
    ok('CSP stört die App nicht (Feed, Thread, Snapshot)',not viol and not pc.errs,(viol[:2],pc.errs))
print('ERGEBNIS',sum(R),'/',len(R))
sys.exit(0 if all(R) else 1)
