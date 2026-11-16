
'use strict';
const staticSig=d=>JSON.stringify([...d.querySelectorAll('*')].filter(e=>e.tagName==='NOSCRIPT'||!e.closest('noscript')).map(e=>[e.tagName,[...e.attributes].filter(a=>!/^(lang|class|style|hidden|open|translate|aria-.*|data-.*)$/i.test(a.name)).map(a=>a.name+'='+a.value).join('|'),/^(SCRIPT|STYLE)$/.test(e.tagName)?e.textContent:'']));
const SIG0=staticSig(document);
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const enc=new TextEncoder();
const hex=u=>[...u].map(b=>b.toString(16).padStart(2,'0')).join('');
const unhex=h=>Uint8Array.from(h.match(/../g)||[],x=>parseInt(x,16));
const b64u=s=>{s=s.replace(/-/g,'+').replace(/_/g,'/');return Uint8Array.from(atob(s+'='.repeat((4-s.length%4)%4)),c=>c.charCodeAt(0))};

/* ===== Symbole ===== */
const P={bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',shield:'<path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',people:'<circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9" r="2.6"/><path d="M3 20c.4-3.6 3-5.6 6-5.6s5.6 2 6 5.6M15.5 14.6c3 0 5 1.6 5.5 4.4"/>',hash:'<path d="M5 9h14M5 15h14M10 3L8 21M16 3l-2 18"/>',wifi:'<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10.5 10.5 0 0 1 14 0M8.5 16a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>',qr:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v1M14 21h2M19 18v3h2"/>',compass:'<circle cx="12" cy="12" r="10"/><path d="M16.2 7.8l-2.1 6.3-6.3 2.1 2.1-6.3z"/>',plus:'<path d="M12 5v14M5 12h14"/>',share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',up:'<path d="M12 19V5M5 12l7-7 7 7"/>',down:'<path d="M12 5v14M5 12l7 7 7-7"/>',award:'<circle cx="12" cy="8" r="6"/><path d="M8.2 13.5L7 22l5-3 5 3-1.2-8.5"/>',image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>',link:'<path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>',clip:'<path d="M21 11l-9 9a5 5 0 01-7-7l9-9a3.5 3.5 0 015 5l-9 9a2 2 0 01-3-3l8-8"/>',mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v4"/>',pin:'<path d="M12 22s7-6.5 7-12a7 7 0 00-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',upload:'<path d="M12 15V3M7 8l5-5 5 5M5 15v4a2 2 0 002 2h10a2 2 0 002-2v-4"/>',dl:'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',x:'<path d="M18 6L6 18M6 6l12 12"/>',back:'<path d="M15 18l-6-6 6-6"/>',msg:'<path d="M21 12a8 8 0 01-11.5 7.2L3 21l1.8-6A8 8 0 1121 12z"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/>',help:'<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01"/>',check:'<path d="M5 12l5 5 9-10"/>',flame:'<path d="M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1 2-2 3-4 3 0-4-2-6-3-8-2 3-4 6-4 10 0 5 3 9 7 9z"/>',file:'<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8zM14 3v5h5"/>',lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>'};
const ic=(n,s)=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"${s?` style="width:${s}px;height:${s}px"`:''}>${P[n]}</svg>`;

/* ===== Speicher ===== */
const Meta={mem:{},get(k,d){try{const v=localStorage.getItem('rn_'+k);return v==null?d:JSON.parse(v)}catch{return k in this.mem?this.mem[k]:d}},set(k,v){this.mem[k]=v;try{localStorage.setItem('rn_'+k,JSON.stringify(v))}catch{}}};
/* ===== Sprache (Oberfläche) ===== */
const LANGS_OK=['de','en','fr','zh','ja','ru'];
let LANG=Meta.get('lang');if(!LANGS_OK.includes(LANG)){LANG=(navigator.language||'de').slice(0,2);if(!LANGS_OK.includes(LANG))LANG='de'}
const LI={en:0,fr:1,zh:2,ja:3,ru:4};
const TR=/*@TR@*/;
const PAT=[["^Erste Schritte · (\\d+) von 4$", ["First steps · $1 of 4", "Premiers pas · $1 sur 4", "入门步骤 · $1/4", "はじめの一歩 · $1/4", "Первые шаги · $1 из 4"]], ["^(\\d+) Kommentare$", ["$1 comments", "$1 commentaires", "$1 条评论", "コメント $1 件", "Комментарии: $1"]], ["^(\\d+) Teilnehmer$", ["$1 participants", "$1 participants", "$1 位参与者", "参加者 $1 人", "Участников: $1"]], ["^vor (\\d+) Min\\.$", ["$1 min ago", "il y a $1 min", "$1 分钟前", "$1 分前", "$1 мин. назад"]], ["^vor (\\d+) Std\\.$", ["$1 h ago", "il y a $1 h", "$1 小时前", "$1 時間前", "$1 ч. назад"]], ["^vor (\\d+) Tagen$", ["$1 days ago", "il y a $1 jours", "$1 天前", "$1 日前", "$1 дн. назад"]], ["^Start (.+)$", ["Started $1", "Début $1", "开始 $1", "開始 $1", "Начато $1"]], ["^Kürzel (\\w+)$", ["Short ID $1", "Code court $1", "短码 $1", "短縮ID $1", "Код $1"]], ["^Seite: (.+)$", ["Page: $1", "Page : $1", "页面：$1", "ページ: $1", "Страница: $1"]], ["^Antwort an (.+) …$", ["Reply to $1 …", "Répondre à $1 …", "回复 $1 …", "$1 に返信 …", "Ответ для $1 …"]], ["^Speichert alle (\\d+) Unterhaltungen in einer Datei auf deinem Gerät\\.$", ["Saves all $1 discussions in one file on your device.", "Enregistre les $1 discussions dans un fichier sur ton appareil.", "把全部 $1 个讨论保存为你设备上的一个文件。", "$1 件の議論すべてを端末上の1つのファイルに保存します。", "Сохраняет все обсуждения ($1) в один файл на твоём устройстве."]], ["^über (\\d+) Unterhaltungen$", ["across $1 discussions", "sur $1 discussions", "涵盖 $1 个讨论", "$1 件の議論分", "по $1 обсуждениям"]], ["^(\\d+) Beiträge neu hinzugefügt$", ["$1 posts added", "$1 messages ajoutés", "新增 $1 条帖子", "$1 件の投稿を追加しました", "Добавлено сообщений: $1"]], ["^Du hast (\\d+) Unterhaltungen\\.$", ["You have $1 discussions.", "Tu as $1 discussions.", "你有 $1 个讨论。", "あなたは $1 件の議論を持っています。", "У тебя обсуждений: $1."]], ["^(\\d+) Unterhaltungen$", ["$1 discussions", "$1 discussions", "$1 个讨论", "議論 $1 件", "Обсуждений: $1"]], ["^Angelegt (.+)$", ["Created $1", "Créé $1", "创建于 $1", "作成 $1", "Создано $1"]]].map(([r,t])=>[new RegExp(r),t]);
const trText=s=>{if(LANG==='de')return s;const m=s.match(/^(\s*)([\s\S]*?)(\s*)$/),k=m[2];if(!k)return s;const i=LI[LANG];
 let v=TR[k];if(v)return m[1]+v[i]+m[3];
 for(const[r,t]of PAT){const x=k.match(r);if(x)return m[1]+t[i].replace(/\$(\d)/g,(_,n)=>x[n])+m[3]}
 const y=k.match(/^(.+?) (\d+)$/);if(y&&TR[y[1]])return m[1]+TR[y[1]][i]+' '+y[2]+m[3];
 return s};
const _=(s,v)=>{let t=LANG==='de'||!TR[s]?s:TR[s][LI[LANG]];if(v)for(const k in v)t=t.split('{'+k+'}').join(v[k]);return t};
const LOC=()=>({de:'de-DE',en:'en-GB',fr:'fr-FR',zh:'zh-CN',ja:'ja-JP',ru:'ru-RU'})[LANG];
const ANIMS={de:['Fuchs','Igel','Dachs','Otter','Luchs','Hase','Eule','Marder','Specht','Biber'],en:['Fox','Hedgehog','Badger','Otter','Lynx','Hare','Owl','Marten','Woodpecker','Beaver'],fr:['Renard','Hérisson','Blaireau','Loutre','Lynx','Lièvre','Hibou','Martre','Pic','Castor'],zh:['狐狸','刺猬','獾','水獭','猞猁','野兔','猫头鹰','貂','啄木鸟','海狸'],ja:['キツネ','ハリネズミ','アナグマ','カワウソ','オオヤマネコ','ノウサギ','フクロウ','テン','キツツキ','ビーバー'],ru:['Лиса','Ёж','Барсук','Выдра','Рысь','Заяц','Сова','Куница','Дятел','Бобёр']};
const SKIP='[translate=no],script,style,textarea';
function trNode(n){if(LANG==='de'||!n)return;
 if(n.nodeType===3){if(n.parentElement&&n.parentElement.closest(SKIP))return;const v=trText(n.nodeValue);if(v!==n.nodeValue)n.nodeValue=v;return}
 if(n.nodeType!==1||n.closest(SKIP))return;
 for(const el of [n,...n.querySelectorAll('*')]){if(el.closest('[translate=no]'))continue;for(const a of['placeholder','aria-label','title','alt']){const o=el.getAttribute&&el.getAttribute(a);if(o){const v=trText(o);if(v!==o)el.setAttribute(a,v)}}}
 const w=document.createTreeWalker(n,NodeFilter.SHOW_TEXT);let t;const L=[];while(t=w.nextNode())L.push(t);for(const x of L)trNode(x)}
new MutationObserver(ms=>{if(LANG==='de')return;for(const m of ms){if(m.type==='childList')m.addedNodes.forEach(trNode);else if(m.type==='characterData')trNode(m.target);else if(m.type==='attributes'){const o=m.target.getAttribute(m.attributeName),v=o&&trText(o);if(v&&v!==o)m.target.setAttribute(m.attributeName,v)}}
 xlate()}).observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title','alt']});
function applyLang(){document.documentElement.lang=LANG;document.querySelectorAll('nav[id]').forEach(e=>e.setAttribute('aria-label',_('Hauptmenü')))}

/* ===== Übersetzung zwischen Nutzern (auf dem Gerät) ===== */
const SW={de:'der die das und ist nicht ein eine ich du zu mit auf für auch von den dem wie wir aber sie es im bei noch oder wenn dass am sind keine sich nur hat einen einer einem sein wird werden kann gibt mehr sehr schon'.split(' '),en:'the and is not you are to of in that it for with this on be have was but they what we your can will'.split(' '),fr:'le la les et est pas un une je tu de du des que qui pour avec dans sur ce ne vous nous mais ou il elle au'.split(' ')};
function detectLang(t){if(/[\u3040-\u30ff]/.test(t))return'ja';if(/[\u4e00-\u9fff]/.test(t))return'zh';if(/[\u0400-\u04ff]/.test(t))return'ru';
 const w=t.toLowerCase().match(/[a-zäöüßéèêàçùâîôûœ']+/g)||[];if(w.length<4)return null;const sc={};for(const k in SW){const S=new Set(SW[k]);sc[k]=w.filter(x=>S.has(x)).length}
 const r=Object.entries(sc).sort((a,b)=>b[1]-a[1]);const hint=/[äöüß]/.test(t)?'de':/[éèêàçùâîôûœ]/.test(t)?'fr':'';return(r[0][1]>=2||(r[0][1]>=1&&hint===r[0][0]))&&r[0][1]>r[1][1]?r[0][0]:null}
const TX={inst:new Map(),cache:new Map(),
 can(){return !!self.Translator||!!Meta.get('ltUrl','')},
 async run(text,from,to,gesture){const key=from+'>'+to+'|'+text;if(this.cache.has(key))return this.cache.get(key);let out;
  if(self.Translator){let t=this.inst.get(from+to);if(!t){const a=await Translator.availability({sourceLanguage:from,targetLanguage:to});if(a==='unavailable')throw new Error('na');if(a!=='available'&&!gesture)throw new Error('gesture');t=await Translator.create({sourceLanguage:from,targetLanguage:to});this.inst.set(from+to,t)}out=await t.translate(text)}
  else{const u=Meta.get('ltUrl','').replace(/\/$/,'');if(!u)throw new Error('na');const r=await fetch(u+'/translate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({q:text,source:from,target:to,format:'text'})});out=(await r.json()).translatedText;if(!out)throw new Error('na')}
  this.cache.set(key,out);return out}};
const langName=c=>{try{return new Intl.DisplayNames([LANG],{type:'language'}).of(c)}catch{return c}};
function txNote(el,state,from){let b=el.nextElementSibling;if(!b||!b.classList.contains('txn')){b=document.createElement('button');b.className='txn';b.type='button';b.setAttribute('translate','no');el.after(b)}
 b.dataset.act='txtoggle';b.dataset.state=state;b.textContent=state==='tr'?'🌐 '+_('Übersetzt aus {l} · Original anzeigen',{l:langName(from)}):state==='orig'?'🌐 '+_('Original ({l}) · Übersetzung anzeigen',{l:langName(from)}):state==='busy'?'🌐 '+_('Übersetzung wird geladen …'):'🌐 '+_('Übersetzung nicht verfügbar. Wie aktivieren?');
 if(state==='na')b.dataset.act='txsetup'}
async function xlate(el,gesture){if(!Meta.get('autotr',1))return;
 const L=el?[el]:[...document.querySelectorAll('[data-tx]:not([data-txd])')];
 for(const e of L){const txt=e.dataset.orig||e.textContent;const f=detectLang(txt);if(!f||f===LANG){e.dataset.txd='1';continue}
  e.dataset.orig=txt;e.dataset.from=f;e.dataset.txd='1';e.dataset.txs='busy';
  if(!TX.can()){e.dataset.txs='na';txNote(e,'na',f);continue}
  txNote(e,'busy',f);
  TX.run(txt,f,LANG,gesture).then(o=>{e.dataset.tr=o;e.textContent=o;e.dataset.txs='tr';txNote(e,'tr',f)}).catch(()=>{e.dataset.txs='na';txNote(e,'na',f)})}}

const okShape=o=>!!o&&typeof o==='object'&&typeof o.id==='string'&&typeof o.t==='string'&&(o.t!=='root'||(typeof o.title==='string'&&o.anchor&&typeof o.anchor==='object'&&typeof o.ts==='number'))&&(o.t!=='sub'||(typeof o.name==='string'&&typeof o.desc==='string'&&typeof o.rules==='string'&&typeof o.ts==='number'))&&(o.t==='root'||o.t==='blob'||o.t==='sub'||typeof o.thread==='string');
const DB={mem:new Map(),use:false,by:new Map(),
 async open(){let late=false;try{await Promise.race([this._open(()=>late),new Promise((_,no)=>setTimeout(()=>no(new Error('timeout')),2500))])}catch{late=true;this.use=false}this.index();this.pclean()},
 async _open(isLate){const r=indexedDB.open('randnotiz',2);r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains('o'))d.createObjectStore('o',{keyPath:'id'});if(!d.objectStoreNames.contains('p'))d.createObjectStore('p',{keyPath:'id'})};await new Promise((ok,no)=>{r.onsuccess=ok;r.onerror=no;r.onblocked=()=>no(new Error('blocked'))});if(isLate()){try{r.result.close()}catch{}return}
  r.result.onversionchange=()=>{try{r.result.close()}catch{}};this.db=r.result;const all=await this.tx('getAll');if(isLate())return;this.use=true;all.forEach(o=>{if(okShape(o))this.mem.set(o.id,o)})},
 tx(m,...a){return new Promise((ok,no)=>{const q=this.db.transaction('o',m==='getAll'?'readonly':'readwrite').objectStore('o')[m](...a);q.onsuccess=()=>ok(q.result);q.onerror=()=>no(q.error)})},
 index(){this.by=new Map();for(const o of this.mem.values())if(o.thread){if(!this.by.has(o.thread))this.by.set(o.thread,[]);this.by.get(o.thread).push(o)}},
 async put(o){if(this.mem.has(o.id))return false;this.mem.set(o.id,o);if(o.thread){if(!this.by.has(o.thread))this.by.set(o.thread,[]);this.by.get(o.thread).push(o)}if(this.use)try{await this.tx('put',o)}catch{this.use=false}return true},
 pm:new Map(),
 ptx(m,...a){return new Promise((ok,no)=>{const q=this.db.transaction('p',m==='get'||m==='getAll'||m==='getAllKeys'?'readonly':'readwrite').objectStore('p')[m](...a);q.onsuccess=()=>ok(q.result);q.onerror=()=>no(q.error)})},
 async pget(id){if(this.use)try{return(await this.ptx('get',id))||null}catch{}return this.pm.get(id)||null},
 async pput(r){this.pm.set(r.id,r);if(this.use)try{await this.ptx('put',r)}catch{}},
 async pdel(id){this.pm.delete(id);if(this.use)try{await this.ptx('delete',id)}catch{}},
 async pkeys(){if(this.use)try{return new Set(await this.ptx('getAllKeys'))}catch{}return new Set(this.pm.keys())},
 async pclean(){try{const all=this.use?await this.ptx('getAll'):[...this.pm.values()];all.sort((a,b)=>b.ts-a.ts);for(const r of all.slice(100).concat(all.filter(r=>r.ts<Date.now()-7*864e5)))await this.pdel(r.id)}catch{}},
 async del(id){this.mem.delete(id);if(this.use)try{await this.tx('delete',id)}catch{}},
 async prune(){let n=this.mem.size,b=0;for(const o of this.mem.values())if(o.t==='blob')b+=o.data.length;let nsub=0;for(const o of this.mem.values())if(o.t==='sub')nsub++;
  if(n<=LIM.store&&b<=LIM.storeBytes&&nsub<=LIM.maxSubs)return 0;let gone=0;
  const rootIds=new Set([...this.mem.values()].filter(o=>o.t==='root').map(o=>o.id));
  for(const o of [...this.mem.values()])if(o.thread&&!rootIds.has(o.thread)){await this.del(o.id);gone++}
  const sweep=async()=>{const ref=new Set();for(const o of this.mem.values()){if(o.snap)ref.add(o.snap.hash);if(o.shot)ref.add(o.shot.hash);for(const m of o.media||[])ref.add(m.h)}for(const o of [...this.mem.values()])if(o.t==='blob'&&!ref.has(o.id)){await this.del(o.id);gone++}};await sweep();
  if(nsub>LIM.maxSubs){const used=new Set([...this.mem.values()].filter(o=>o.t==='root'&&o.sub).map(o=>o.sub));for(const o of [...this.mem.values()].filter(o=>o.t==='sub'&&!used.has(o.id)).sort((a,c)=>a.ts-c.ts)){if(nsub<=LIM.maxSubs)break;await this.del(o.id);nsub--;gone++}}
  const over=()=>{let c=this.mem.size,y=0;for(const o of this.mem.values())if(o.t==='blob')y+=o.data.length;return c>LIM.store*.8||y>LIM.storeBytes*.8};
  if(this.mem.size>LIM.store||b>LIM.storeBytes){this.index();const cand=[...this.mem.values()].filter(o=>o.t==='root'&&o.ts<Date.now()-3*864e5).map(summ).sort((a,c)=>a.hot-c.hot);
   for(const x of cand){if(!over())break;let mine=false;try{mine=(await rootKey(master(),x.r.salt)).pub===x.r.author}catch{}if(mine)continue;
    for(const e of [...(this.by.get(x.id)||[])])await this.del(e.id);await this.del(x.id);gone++;this.index();await sweep()}}
  this.index();return gone},
 async wipe(){this.mem.clear();this.by.clear();this.pm.clear();if(this.use)try{await this.tx('clear');await this.ptx('clear')}catch{}}};

/* ===== Kryptografie ===== */
const sha256b=(()=>{const Pr=[];for(let n=2;Pr.length<64;n++)if(Pr.every(p=>n%p))Pr.push(n);const fr=x=>Math.floor((x-Math.floor(x))*4294967296);
 const K=Pr.map(p=>fr(Math.cbrt(p))),H0=Pr.slice(0,8).map(p=>fr(Math.sqrt(p)));const R=(x,n)=>(x>>>n)|(x<<(32-n));
 return bytes=>{const l=bytes.length,nb=((l+9+63)>>6)<<6,m=new Uint8Array(nb);m.set(bytes);m[l]=128;const dv=new DataView(m.buffer);dv.setUint32(nb-4,(l*8)>>>0);dv.setUint32(nb-8,Math.floor(l*8/4294967296));
  const h=H0.slice(),w=new Uint32Array(64);
  for(let o=0;o<nb;o+=64){for(let i=0;i<16;i++)w[i]=dv.getUint32(o+i*4);for(let i=16;i<64;i++){const a=w[i-15],b=w[i-2];w[i]=(w[i-16]+(R(a,7)^R(a,18)^(a>>>3))+w[i-7]+(R(b,17)^R(b,19)^(b>>>10)))|0}
   let[a,b,c,d,e,f,g,q]=h;for(let i=0;i<64;i++){const t1=(q+(R(e,6)^R(e,11)^R(e,25))+((e&f)^(~e&g))+K[i]+w[i])|0,t2=((R(a,2)^R(a,13)^R(a,22))+((a&b)^(a&c)^(b&c)))|0;q=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0}
   h[0]=(h[0]+a)|0;h[1]=(h[1]+b)|0;h[2]=(h[2]+c)|0;h[3]=(h[3]+d)|0;h[4]=(h[4]+e)|0;h[5]=(h[5]+f)|0;h[6]=(h[6]+g)|0;h[7]=(h[7]+q)|0}
  return h.map(x=>(x>>>0).toString(16).padStart(8,'0')).join('')}})();
const sha=s=>sha256b(enc.encode(s));
function canon(o){if(o===null||typeof o!=='object')return JSON.stringify(o);if(Array.isArray(o))return'['+o.map(canon).join(',')+']';return'{'+Object.keys(o).filter(k=>o[k]!==undefined).sort().map(k=>JSON.stringify(k)+':'+canon(o[k])).join(',')+'}'}
const zeros=h=>{let n=0;for(const c of h){const v=parseInt(c,16);if(!v){n+=4;continue}n+=Math.clz32(v)-28;break}return n};
const POWT={root:14,sub:14,comment:13,award:13,vote:12};
const minePow=(id,b)=>{for(let n=0;;n++)if(zeros(sha(id+':'+n))>=b)return n};
async function hkdf(master,info){const k=await crypto.subtle.importKey('raw',master,'HKDF',false,['deriveBits']);return new Uint8Array(await crypto.subtle.deriveBits({name:'HKDF',hash:'SHA-256',salt:new Uint8Array(0),info:enc.encode('randnotiz:'+info)},k,256))}
const PK8=unhex('302e020100300506032b657004220420');
async function keyFromSeed(seed){const der=new Uint8Array(48);der.set(PK8);der.set(seed,16);const priv=await crypto.subtle.importKey('pkcs8',der,{name:'Ed25519'},true,['sign']);const jwk=await crypto.subtle.exportKey('jwk',priv);return{priv,pub:hex(b64u(jwk.x))}}
async function verifySig(pub,obj,sig){try{const k=await crypto.subtle.importKey('raw',unhex(pub),{name:'Ed25519'},false,['verify']);return await crypto.subtle.verify('Ed25519',k,unhex(sig),enc.encode(canon(obj)))}catch{return false}}
async function signObj(unsigned,key){const id=sha(canon(unsigned)),pow=minePow(id,POWT[unsigned.t]||14);const sig=hex(new Uint8Array(await crypto.subtle.sign('Ed25519',key.priv,enc.encode(canon({id,pow})))));return{...unsigned,id,pow,sig}}
const SUBMAX={name:30,desc:500,rules:500},SUBMIN={name:2,desc:10,rules:10};
const subOk=o=>['name','desc','rules'].every(k=>typeof o[k]==='string'&&o[k].trim()===o[k]&&o[k].length>=SUBMIN[k]&&o[k].length<=SUBMAX[k])&&!/[\r\n]/.test(o.name)&&typeof o.salt==='string'&&typeof o.ts==='number';
const LIM={objs:4000,perAuthor:150,roots:300,subs:60,bad:25,bytes:3e7,store:30000,storeBytes:9e7,maxSubs:500,maxJson:16000,skew:864e5,voteMin:40};
const H64=/^[0-9a-f]{64}$/,H128=/^[0-9a-f]{128}$/,B64RE=/^[A-Za-z0-9+\/]*={0,2}$/,MIME=/^[a-z]{3,12}\/[a-z0-9.+-]{1,40}(;[a-z]+=[a-z0-9.,-]{1,30})?$/;
const IMG=/^image\/(jpeg|png|webp|gif)$/,AUD=/^audio\/(webm|ogg|mp4|mpeg|wav)(;codecs=[a-z0-9.,-]{1,20})?$/;
const sOK=(x,n)=>typeof x==='string'&&x.length<=n,fin=(x,a,b)=>typeof x==='number'&&Number.isFinite(x)&&x>=a&&x<=b;
const okTs=t=>fin(t,1.6e12,Date.now()+LIM.skew);
const okUrl=u=>{if(!sOK(u,2000)||!/^https?:\/\//i.test(u))return false;try{return!!new URL(u).hostname}catch{return false}};
const okLoc=l=>!!l&&typeof l==='object'&&fin(l.lat,-90,90)&&fin(l.lon,-180,180);
const okAnchor=a=>!!a&&typeof a==='object'&&!Array.isArray(a)&&Object.keys(a).length<=8&&sOK(a.kind,20)&&Object.values(a).every(v=>typeof v==='boolean'||fin(v,-1e9,1e9)||sOK(v,1000));
const okMedia=m=>!!m&&typeof m==='object'&&H64.test(m.h||'')&&typeof m.m==='string'&&m.m.length<=80&&MIME.test(m.m)&&(m.n===undefined||sOK(m.n,120))&&(m.s===undefined||fin(m.s,0,3e6));
/* Verbindungszahl neben dem Namen: grob gerundet (eine gültige Ziffer), vom Absender angegeben, nicht geprüft */
function cnB(n){n=Math.floor(+n)||0;if(n<10)return Math.max(0,n);const p=10**(String(n).length-1);return Math.floor(n/p)*p}
function cnF(n){const f=(v,u)=>(v%1?v.toFixed(1):v)+u;return n>=1e9?f(n/1e9,'B'):n>=1e6?f(n/1e6,'M'):n>=1e3?f(n/1e3,'K'):String(n)}
const cnExtra=()=>Meta.get('cnshow',1)?{cn:cnB(Meta.get('met',0)||0)}:{};
const cnTag=c=>Number.isInteger(c.cn)?`<span class="cn" title="${esc(_('Angabe des Absenders: So viele Verbindungen hatte dieser Mensch beim Schreiben. Nicht geprüft.'))}" aria-label="${esc(_('Verbindungen: {n}',{n:cnF(c.cn)}))}">${ic('people',11)}${cnF(c.cn)}</span>`:'';
async function validate(o){
  if(!o||typeof o!=='object'||Array.isArray(o)||typeof o.t!=='string'||typeof o.id!=='string'||!H64.test(o.id))return false;
  if(o.t==='blob')return typeof o.data==='string'&&o.data.length<2.9e6&&B64RE.test(o.data)&&sha(o.data)===o.id;
  if(!['root','comment','vote','award','sub'].includes(o.t)||typeof o.author!=='string'||!H64.test(o.author)||typeof o.sig!=='string'||!H128.test(o.sig))return false;
  try{if(JSON.stringify(o).length>LIM.maxJson)return false}catch{return false}
  if(!okTs(o.ts))return false;
  const{id,pow,sig,...u}=o;if(!Number.isInteger(pow)||pow<0||pow>1e9)return false;
  if(o.t!=='sub'&&o.t!=='root'&&!H64.test(o.thread||''))return false;
  if(o.t==='root'){if(!(sOK(o.title,200)&&o.title&&okAnchor(o.anchor)&&sOK(o.salt,64)))return false;
    if(o.geo!=null&&!(okLoc(o.geo)&&(o.geo.gh===undefined||(typeof o.geo.gh==='string'&&/^[0-9a-z]{1,12}$/.test(o.geo.gh)))))return false;
    if(o.snap!=null&&!(typeof o.snap==='object'&&H64.test(o.snap.hash||'')&&fin(o.snap.size,0,4e6)))return false;
    if(o.shot!=null&&!(typeof o.shot==='object'&&H64.test(o.shot.hash||'')&&fin(o.shot.size,0,2.9e6)&&['image/jpeg','image/png','image/webp'].includes(o.shot.m)))return false;
    if(o.sub!==undefined&&!H64.test(o.sub))return false}
  if(o.t==='sub'&&!(subOk(o)&&sOK(o.salt,64)))return false;
  if(o.t==='comment'){if(!(typeof o.body==='string'&&o.body&&o.body.length<=4000))return false;
    if(o.parent!=null&&!H64.test(o.parent))return false;
    if(o.url!=null&&!okUrl(o.url))return false;
    if(o.cn!==undefined&&!(Number.isInteger(o.cn)&&o.cn>=0&&o.cn<=1e10&&o.cn===cnB(o.cn)))return false;
    if(o.loc!=null&&!okLoc(o.loc))return false;
    if(o.media!==undefined&&!(Array.isArray(o.media)&&o.media.length<=4&&o.media.every(okMedia)))return false;
    if(o.kind!==undefined&&!sOK(o.kind,20))return false}
  if(o.t==='vote'&&!((o.dir===1||o.dir===-1)&&H64.test(o.target||'')))return false;
  if(o.t==='award'&&!(typeof o.kind==='string'&&(AW.free[o.kind]||AW.premium[o.kind])&&H64.test(o.target||'')&&o.receipt===undefined))return false;
  if(sha(canon(u))!==id||zeros(sha(id+':'+pow))<(POWT[o.t]||14))return false;
  return verifySig(o.author,{id,pow},sig)}

/* ===== Identität ===== */
const rnd32=()=>crypto.getRandomValues(new Uint8Array(32));
function master(){let m=Meta.get('master');if(!m){m=hex(rnd32());Meta.set('master',m);Meta.set('created',Date.now())}return unhex(m)}
const keyCache=new Map();
async function rootKey(m,salt){return keyFromSeed(await hkdf(m,'root:'+salt))}
async function keyFor(threadId,m=master()){const ck=hex(m).slice(0,8)+threadId;if(keyCache.has(ck))return keyCache.get(ck);const root=DB.mem.get(threadId);let k=null;
  if(root&&root.salt){const rk=await rootKey(m,root.salt);if(rk.pub===root.author)k=rk}
  if(!k)k=await keyFromSeed(await hkdf(m,'thread:'+threadId));keyCache.set(ck,k);return k}
const alias=pub=>{const n=parseInt(pub.slice(0,8),16);return ANIMS[LANG][n%10]+' '+(10+((n>>>8)%90))};
const gh=(lat,lon,pr=7)=>{const B='0123456789bcdefghjkmnpqrstuvwxyz';let la=[-90,90],lo=[-180,180],bit=0,ch=0,ev=true,o='';while(o.length<pr){const r=ev?lo:la,v=ev?lon:lat,mid=(r[0]+r[1])/2;if(v>=mid){ch=ch*2+1;r[0]=mid}else{ch*=2;r[1]=mid}ev=!ev;if(++bit===5){o+=B[ch];bit=0;ch=0}}return o};
const dist=(a,b)=>{const r=x=>x*Math.PI/180,dl=r(b.lat-a.lat),dn=r(b.lon-a.lon),h=Math.sin(dl/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(dn/2)**2;return 12742*Math.asin(Math.sqrt(h))};

/* ===== Auszeichnungen ===== */
const AW={free:{hilfreich:['Hilfreich',1],klug:['Klug',1],lustig:['Lustig',1],danke:['Danke',1]},premium:{silber:['Silber',3],gold:['Gold',8],platin:['Platin',20]}};
const UNL={silber:2,gold:5,platin:12};
const earnSt=()=>{const e=Meta.get('earn',null);return e&&typeof e==='object'?e:{n:0,t:0,u:{}}};
const awAvail=k=>Math.max(0,Math.floor((earnSt().n||0)/UNL[k])-((earnSt().u||{})[k]||0));
const awNext=k=>UNL[k]-((earnSt().n||0)%UNL[k]);
function earn(n){if(!(n>0))return;const e=earnSt();if(Date.now()-(e.t||0)<6e5)return;const before=Object.keys(UNL).map(k=>Math.floor((e.n||0)/UNL[k]));e.n=(e.n||0)+1;e.t=Date.now();e.u=e.u||{};Meta.set('earn',e);const nw=Object.keys(UNL).filter((k,i)=>Math.floor(e.n/UNL[k])>before[i]);if(nw.length)setTimeout(()=>toast(_('Neue Auszeichnung freigeschaltet: {k}',{k:nw.map(k=>_(AW.premium[k][0])).join(', ')})),900)}
const awW=k=>(AW.free[k]||AW.premium[k]||[0,0])[1],awL=k=>(AW.free[k]||AW.premium[k])[0];

/* ===== Objekte erzeugen ===== */
const nowMin=()=>Math.floor(Date.now()/60000)*60000;
async function createSub({name,desc,rules,m=master(),ts=Date.now()}){
  const salt=hex(rnd32().slice(0,16)),key=await rootKey(m,salt);
  const o=await signObj({t:'sub',v:1,name:name.replace(/\s+/g,' ').trim().slice(0,30),desc:desc.trim().slice(0,500),rules:rules.trim().slice(0,500),ts,author:key.pub,salt},key);
  if(!subOk(o))throw new Error('sub');await DB.put(o);return o}
const subs=()=>[...DB.mem.values()].filter(o=>o.t==='sub');
const subLabel=sb=>{const same=subs().filter(x=>x.name.toLowerCase()===sb.name.toLowerCase()).length>1;return same?sb.name+' · '+sb.id.slice(0,4):sb.name};
const subThreads=id=>roots().filter(r=>r.sub===id);
async function createThread({title,anchor,geo,html,first,m,ts=Date.now(),extra,sub,shot}){const own=m===undefined;if(own)m=master();
  let shotRef=null;if(shot&&B64RE.test(shot)){const bb={t:'blob',id:sha(shot),data:shot};await DB.put(bb);shotRef={hash:bb.id,size:shot.length,m:'image/jpeg'}}
  let snap=null;if(html){const data=btoa(unescape(encodeURIComponent(html)));const b={t:'blob',id:sha(data),data};await DB.put(b);snap={hash:b.id,size:data.length}}
  const salt=hex(rnd32().slice(0,16));const key=await rootKey(m,salt);
  const root=await signObj({t:'root',v:1,title:title.slice(0,200),anchor,geo:geo?{lat:geo.lat,lon:geo.lon,gh:gh(geo.lat,geo.lon)}:null,ts,snap,author:key.pub,salt,...(sub?{sub}:{}),...(shotRef?{shot:shotRef}:{})},key);
  await DB.put(root);if(first)await postComment(root.id,first.body,null,own?{...cnExtra(),...first.extra}:first.extra,m);return root}
async function postComment(tid,body,parent,extra={},m,ts=nowMin()){if(m===undefined){m=master();if(extra.cn===undefined)extra={...cnExtra(),...extra}}const key=await keyFor(tid,m);
  const blobs=extra.blobs||[];for(const b of blobs)await DB.put(b);const{blobs:_,...rest}=extra;
  const o=await signObj({t:'comment',thread:tid,parent:parent||null,body:body.slice(0,4000),...rest,ts,author:key.pub},key);await DB.put(o);return o}
async function postVote(tid,target,dir,m=master(),ts=nowMin()){const key=await keyFor(tid,m);const o=await signObj({t:'vote',thread:tid,target,dir,ts,author:key.pub},key);DB.mem.set(o.id,o);DB.index();if(DB.use)try{await DB.tx('put',o)}catch{}return o}
async function postAward(tid,target,kind,_r,m=master(),ts=nowMin()){const key=await keyFor(tid,m);const u={t:'award',thread:tid,target,kind,tier:AW.free[kind]?'free':'premium',ts,author:key.pub};return DB.put(await signObj(u,key))}

/* ===== Auswertung ===== */
const roots=()=>[...DB.mem.values()].filter(o=>o.t==='root');
const norm=t=>String(t).toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
let _sp={n:-1,t:new Map(),a:new Map(),m:new Set()};
function spamIdx(){if(_sp.n===DB.mem.size)return _sp;const t=new Map(),a=new Map();
 for(const o of DB.mem.values()){if(o.t==='blob')continue;const th=o.t==='root'||o.t==='sub'?o.id:o.thread;let z=a.get(o.author);if(!z)a.set(o.author,z=new Set());z.add(th);
  const tx=o.t==='comment'?o.body:o.t==='root'?o.title:null;if(!tx)continue;const k=norm(tx);if(k.length<12)continue;let w=t.get(k);if(!w)t.set(k,w=new Set());w.add(o.author)}
 const m=new Set();for(const[k,v]of a)if(v.size>1)m.add(k);_sp={n:DB.mem.size,t,a,m};return _sp}
const multiAuth=()=>spamIdx().m;
const dupSpam=t=>{const w=spamIdx().t.get(norm(t));return!!w&&w.size>=3};
const linkSpam=t=>(String(t).match(/https?:\/\//gi)||[]).length>=3;
const spamText=t=>dupSpam(t)||linkSpam(t);
const spamRoot=r=>spamText(r.title)||multiAuth().has(r.author);
const HID=()=>{const h=Meta.get('hid',null)||{};return{o:new Set(h.o||[]),a:new Set(h.a||[])}};
const hideAdd=(k,v)=>{const h=Meta.get('hid',null)||{o:[],a:[]};h[k]=[...new Set([...(h[k]||[]),v])].slice(-2000);Meta.set('hid',h)};
const hidCount=()=>{const h=HID();return h.o.size+h.a.size};
function tally(evs,id){const l=new Map();for(const e of evs)if(e.t==='vote'&&e.target===id&&(!l.has(e.author)||l.get(e.author).ts<=e.ts))l.set(e.author,e);const cnt=new Map(),mt=multiAuth();let u=0,d=0;for(const v of [...l.values()].sort((a,b)=>a.id<b.id?-1:1)){if(mt.has(v.author))continue;const bk=Math.floor(v.ts/60000),c=(cnt.get(bk)||0)+1;cnt.set(bk,c);if(c>LIM.voteMin)continue;v.dir===1?u++:d++}return{u,d,mine:l}}
function awardsOf(evs,id){const seen=new Set(),c={};let w=0;for(const e of evs){if(e.t!=='award'||e.target!==id)continue;if(e.tier==='free'){const k=e.author+e.kind;if(seen.has(k))continue;seen.add(k)}c[e.kind]=(c[e.kind]||0)+1;w+=awW(e.kind)}return{c,w}}
const wilson=(u,d,z=1.2816)=>{const n=u+d;if(!n)return 0;const p=u/n;return(p+z*z/(2*n)-z*Math.sqrt((p*(1-p)+z*z/(4*n))/n))/(1+z*z/n)};
const ctr=(u,d)=>u&&d?Math.pow(u+d,Math.min(u,d)/Math.max(u,d)):0;
function summ(r){const ev=DB.by.get(r.id)||[],cs=ev.filter(e=>e.t==='comment'),au=new Set(cs.map(c=>c.author)),{u,d}=tally(ev,r.id),last=Math.max(r.ts,...cs.map(c=>c.ts));
 return{r,id:r.id,title:r.title,kind:r.anchor.kind,n:cs.length,p:au.size,u,d,last,hot:Math.log10(Math.max(1,cs.length+au.size*2+u-d))+(last/1000-1.7e9)/45000,ctr:ctr(u,d),aw:awardsOf(ev,r.id).c,media:cs.some(c=>c.media&&c.media.length)}}
function detail(r,sort,key){const ev=DB.by.get(r.id)||[];
 const hid=HID(),flat=ev.filter(e=>e.t==='comment'&&!hid.o.has(e.id)&&!hid.a.has(e.author)).map(c=>{const t=tally(ev,c.id),a=awardsOf(ev,c.id);return{c,id:c.id,parent:c.parent,u:t.u,d:t.d,my:key&&t.mine.get(key.pub)?t.mine.get(key.pub).dir:0,aw:a.c,best:wilson(t.u,t.d)+Math.min(.25,.06*Math.log2(1+a.w)),ctr:ctr(t.u,t.d),ts:c.ts,kids:[]}});
 const by=new Map(flat.map(x=>[x.id,x])),tree=[];for(const x of flat){const p=x.parent&&by.get(x.parent);(p?p.kids:tree).push(x)}
 const cmp={best:(a,b)=>b.best-a.best||b.ts-a.ts,top:(a,b)=>(b.u-b.d)-(a.u-a.d)||b.ts-a.ts,new:(a,b)=>b.ts-a.ts,ctr:(a,b)=>b.ctr-a.ctr||b.ts-a.ts}[sort]||((a,b)=>b.best-a.best);
 const ord=a=>{a.sort(cmp);a.forEach(x=>ord(x.kids))};ord(tree);
 // Auffälligkeiten: fast gleiche Texte von verschiedenen Pseudonymen, oder viele Beiträge pro Minute
 const W=s=>new Set(s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,'').split(/\s+/).filter(Boolean));const ws=flat.map(x=>W(x.c.body));
 flat.forEach((x,i)=>{let sim=0;flat.forEach((y,j)=>{if(i!==j&&y.c.author!==x.c.author&&ws[i].size>3){let n=0;for(const w of ws[i])if(ws[j].has(w))n++;sim=Math.max(sim,n/(ws[i].size+ws[j].size-n))}});
  const burst=flat.filter(y=>y.c.author===x.c.author&&Math.abs(y.ts-x.ts)<60001).length;x.sus=sim>=.7||burst>=4||spamText(x.c.body)||multiAuth().has(x.c.author)});
 return{tree,flat}}

/* ===== UI-Helfer ===== */
const ago=ts=>{const m=Math.round((Date.now()-ts)/60000);return m<1?'gerade eben':m<60?`vor ${m} Min.`:m<1440?`vor ${Math.round(m/60)} Std.`:`vor ${Math.round(m/1440)} Tagen`};
const say=t=>{$('#live').textContent='';setTimeout(()=>$('#live').textContent=t,50)};
function toast(msg,action,fn){const _o=$('.toast');if(_o)_o.remove();const t=document.createElement('div');t.className='toast';t.innerHTML=`<span>${esc(msg)}</span>${action?`<button>${esc(action)}</button>`:''}`;document.body.append(t);say(msg);if(action)t.querySelector('button').onclick=()=>{t.remove();fn()};setTimeout(()=>t.remove(),action?9000:3500)}
function sheet(html,onOpen){const d=$('#dlg');d.innerHTML=`<div class="sheet">${html}</div>`;if(!d.open)d.showModal();onOpen&&onOpen(d);return d}
const closeSheet=()=>{const d=$('#dlg');if(d.open)d.close()};
$('#dlg').addEventListener('click',e=>{if(e.target.id==='dlg')closeSheet()});
document.addEventListener('change',e=>{if(e.target&&e.target.id==='chkf'){const f=e.target.files[0];e.target.value='';checkAppFile(f)}});
const ask=(title,text,ok='Ja, senden',no='Zurück')=>new Promise(res=>{sheet(`<div class="hd"><h2>${esc(title)}</h2></div><p>${esc(text)}</p><div style="display:flex;gap:10px;margin-top:14px"><button class="btn" data-a="n" style="flex:1">${esc(no)}</button><button class="btn pri" data-a="y" style="flex:1">${esc(ok)}</button></div>`,d=>{d.onclick=e=>{const b=e.target.closest('[data-a]');if(b){d.onclick=null;closeSheet();res(b.dataset.a==='y')}};d.onclose=()=>res(false)})});
const dlFile=(name,text,type)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000)};

/* ===== Erste Schritte ===== */
const STEPS=[['view','Eine Unterhaltung öffnen'],['vote','Mit ▲ oder ▼ bewerten'],['comment','Einen Kommentar schreiben'],['share','Einen Beitrag als Datei teilen']];
const markStep=k=>{const s=Meta.get('steps',{});if(!s[k]){s[k]=1;Meta.set('steps',s);if(STEPS.every(([x])=>s[x]))toast('Geschafft! Du kennst jetzt alles Wichtige.')}};
const stepsCard=()=>{const s=Meta.get('steps',{});if(Meta.get('hideSteps')||STEPS.every(([k])=>s[k]))return'';const n=STEPS.filter(([k])=>s[k]).length;
 return`<section class="card pop" aria-label="Erste Schritte"><div style="display:flex;align-items:center;gap:8px"><h2 style="flex:1">Erste Schritte · ${n} von 4</h2><button class="btn ghost icon sm" data-act="hidesteps" aria-label="Ausblenden">${ic('x')}</button></div><div class="bar" aria-hidden="true"><i style="width:${n*25}%"></i></div><ul class="steps">${STEPS.map(([k,l])=>`<li class="${s[k]?'done':''}"><span class="ck">${ic('check',14)}</span><span>${l}</span></li>`).join('')}</ul></section>`};

/* ===== Router ===== */
const NAV=[['feed','Unterhaltungen','compass'],['subs','Themen','hash'],['new','Schreiben','plus'],['share','Teilen','share'],['me','Ich','user']];
const navHtml=cur=>NAV.map(([k,l,i])=>`<button class="nav ${k==='new'?'write':''}" data-act="nav" data-k="${k}" ${k===cur?'aria-current="page"':''}><span class="${k==='new'?'pill':''}">${ic(i,k==='new'?24:undefined)}</span>${k==='new'?'':l}${k==='new'?`<span class="sr">${l}</span>`:''}</button>`).join('');
let S={sort:'hot',q:'',csort:'best',hideSus:true,near:null};
async function route(){try{await routeInner()}catch(e){console.error(e);if(!$('#main').innerHTML.trim()&&window.__rnFail)window.__rnFail(e);else toast(_('Das hat leider nicht geklappt.'))}}
function openLink(h){let u='',q='';try{const p=h.slice(7).split('/');u=decodeURIComponent(p[0]||'');q=decodeURIComponent(p[1]||'')}catch{}
 history.replaceState(null,'','#/');if(!/^https?:\/\//.test(u))return;
 const hit=roots().filter(r=>r.anchor.url===u&&(!q||r.anchor.text===q)).sort((a,b)=>b.ts-a.ts)[0];
 if(hit){location.hash='#/t/'+hit.id;return true}setTimeout(()=>newSheet(1,{kind:'page',url:u,text:q.slice(0,500)}),50)}
async function routeInner(){let h=location.hash||'#/';if(h.startsWith('#/link/')){if(openLink(h))h=location.hash;else h='#/'}if(h.startsWith('#/rnp/')){const P=h.slice(6);history.replaceState(null,'','#/');h='#/';placeResult(await openPlace('RNP1|'+P))}let cur='feed';document.body.classList.toggle('inthread',h.startsWith('#/t/'));
 if(h.startsWith('#/t/')){await viewThread(h.slice(4));cur='feed';tipLater('thread',900)}
 else if(h==='#/subs'){viewSubs();cur='subs'}else if(h.startsWith('#/s/')){viewSub(h.slice(4));cur='subs'}
 else if(h==='#/share'){viewShare();cur='share';tipLater('share',700)}else if(h==='#/me'){viewMe();cur='me'}else viewFeed();
 $('#tabbar').innerHTML=navHtml(cur);$('#rail').innerHTML=`<div class="brand" style="padding:6px 14px 14px"><span class="logo">${ic('people',18)}</span>Outernet</div>`+navHtml(cur);window.scrollTo(0,0)}
addEventListener('hashchange',route);
addEventListener('click',e=>{const a=e.target.closest('[data-stop]');if(a){e.stopPropagation();e.preventDefault();location.hash=a.getAttribute('data-href')}},true);
addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches&&e.target.matches('[data-stop]')){e.preventDefault();location.hash=e.target.getAttribute('data-href')}},true);
const topbar=(back,title)=>`<header class="top">${back?`<button class="btn icon ghost" data-act="back" aria-label="Zurück">${ic('back')}</button>`:`<div class="brand"><span class="logo">${ic('people',18)}</span>Outernet</div>`}${back?`<div class="brand" style="font-size:1.05rem">${esc(title||'')}</div>`:''}<button class="btn icon ghost" data-act="help" aria-label="Hilfe">${ic('help')}</button></header>`;

/* ===== Unterhaltungen ===== */
const SORTS=[['hot','Beliebt','flame'],['new','Neu','compass'],['disc','Viel besprochen','msg'],['ctr','Umstritten','award'],['near','In der Nähe','pin']];
const KIND={page:['Webseite','globe'],passage:['Textstelle','file'],place:['Ort','pin'],free:['Thema','msg']};
function viewFeed(){
 const hid=HID();let L=roots().filter(r=>!hid.o.has(r.id)&&!hid.a.has(r.author)).map(summ);const q=S.q.trim().toLowerCase();const nSp=S.showSpam?0:L.filter(x=>spamRoot(x.r)).length;if(!S.showSpam)L=L.filter(x=>!spamRoot(x.r));if(q)L=L.filter(x=>x.title.toLowerCase().includes(q));
 if(S.subF)L=L.filter(x=>x.r.sub===S.subF);
 if(S.sort==='near'&&S.near){const me=S.near;L=L.filter(x=>x.r.geo).map(x=>({...x,km:dist(me,x.r.geo)})).sort((a,b)=>a.km-b.km)}
 else L.sort({hot:(a,b)=>b.hot-a.hot,new:(a,b)=>b.last-a.last,disc:(a,b)=>(b.p*3+b.n)-(a.p*3+a.n),ctr:(a,b)=>b.ctr-a.ctr}[S.sort]||((a,b)=>b.hot-a.hot));
 $('#main').innerHTML=`${topbar()}<h1>Unterhaltungen</h1><p class="mu" style="margin:0 0 12px">Worüber Menschen gerade miteinander sprechen.</p>${stepsCard()}
 <label class="search"><span class="sr">Suchen</span>${ic('search')}<input type="search" id="q" placeholder="Unterhaltung suchen" value="${esc(S.q)}" autocomplete="off"></label>
 ${subs().length?`<label class="f" for="fsub" style="margin-top:0">Themenbereich</label><select id="fsub"><option value="">Alle Themenbereiche</option>${subs().map(sb=>`<option value="${sb.id}" ${S.subF===sb.id?'selected':''}>${esc(subLabel(sb))}</option>`).join('')}</select>`:''}
 <div class="chips" role="group" aria-label="Sortieren">${SORTS.map(([k,l,i])=>`<button class="chip" data-act="sort" data-k="${k}" aria-pressed="${k===S.sort}">${ic(i,16)}${l}</button>`).join('')}</div>
 <div id="list">${L.map((x,i)=>card(x,i)).join('')||`<div class="empty">${art(0)}<h2>Hier ist noch alles ruhig</h2><p class="mu">${q?'Keine Treffer. Probiere ein anderes Wort.':'Mach den Anfang und sprich die Ersten an, oder lade Beispiele.'}</p><button class="btn pri" data-act="new">Unterhaltung starten</button> <button class="btn" data-act="seed">Beispiele laden</button></div>`}</div>${nSp?`<p class="sm mu" style="text-align:center">${_('{n} als Spam verdächtig ausgeblendet',{n:nSp})} <button class="btn ghost sm" data-act="spam">${_('Anzeigen')}</button></p>`:''}`;
 const fs=$('#fsub');if(fs)fs.onchange=()=>{S.subF=fs.value||null;viewFeed()};
 const qi=$('#q');qi.oninput=()=>{S.q=qi.value;const p=qi.selectionStart;viewFeed();const n=$('#q');n.focus();n.setSelectionRange(p,p)}}
function card(x,i){const[kl,ki]=KIND[x.kind]||KIND.free;const aw=Object.entries(x.aw).map(([k,n])=>`<span class="tag ${AW.premium[k]?'gold':''}">${ic('award',12)}${awL(k)} ${n}</span>`).join('');
 return`<button class="card thr" data-act="open" data-id="${x.id}" ${i===0&&!Meta.get('steps',{}).view?'style="border-color:var(--ac)"':''}><div class="meta"><span class="tag">${ic(ki,12)}${kl}</span>${gapOf(x.id)?`<span class="tag gold">${_('unvollständig')}</span>`:''}${subTag(x.r.sub)}${x.r.geo?`<span>${ic('pin',13)} ${S.sort==='near'?x.km.toFixed(1)+' km':'mit Ort'}</span>`:''}<span>${ago(x.last)}</span></div><h3 translate="no" data-tx>${esc(x.title)}</h3><div class="meta"><span>${ic('up',13)} ${x.u-x.d}</span><span>${ic('msg',13)} ${x.n}</span><span>${x.p} Teilnehmer</span>${x.media?`<span>${ic('image',13)}</span>`:''}${aw}</div></button>`}
const art=n=>['<svg class="art" viewBox="0 0 200 150" aria-hidden="true"><rect x="20" y="30" width="110" height="70" rx="18" fill="var(--acs)"/><path d="M50 100l-6 22 26-22z" fill="var(--acs)"/><rect x="70" y="55" width="110" height="60" rx="18" fill="var(--ac)"/><circle cx="100" cy="85" r="6" fill="var(--act)"/><circle cx="125" cy="85" r="6" fill="var(--act)"/><circle cx="150" cy="85" r="6" fill="var(--act)"/></svg>',
 '<svg class="art" viewBox="0 0 200 150" aria-hidden="true"><circle cx="100" cy="75" r="52" fill="var(--acs)"/><circle cx="100" cy="62" r="20" fill="var(--ac)"/><path d="M62 112c4-24 22-30 38-30s34 6 38 30" fill="var(--ac)"/><rect x="104" y="26" width="90" height="32" rx="12" fill="var(--s1)" stroke="var(--ac)" stroke-width="3"/><text x="149" y="47" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ac)">'+ANIMS[LANG][0]+' 42</text></svg>',
 '<svg class="art" viewBox="0 0 200 150" aria-hidden="true"><rect x="62" y="20" width="76" height="110" rx="16" fill="var(--s1)" stroke="var(--ac)" stroke-width="4"/><rect x="74" y="38" width="52" height="8" rx="4" fill="var(--acs)"/><rect x="74" y="54" width="40" height="8" rx="4" fill="var(--acs)"/><path d="M100 118l-14-14h9V86h10v18h9z" fill="var(--ac)"/><circle cx="34" cy="100" r="14" fill="var(--acs)"/><circle cx="168" cy="52" r="14" fill="var(--acs)"/><path d="M48 96l14-6M154 56l-16 8" stroke="var(--ac)" stroke-width="3" stroke-dasharray="4 5"/></svg>',
 '<svg class="art" viewBox="0 0 200 150" aria-hidden="true"><g stroke="var(--ac)" stroke-width="3" opacity=".5" fill="none"><path d="M38 42L100 28L162 48M38 42L52 108M100 28L100 78M162 48L150 112M52 108L100 78L150 112M52 108L150 112M38 42L100 78M162 48L100 78"/></g><g fill="var(--acs)" stroke="var(--ac)" stroke-width="4"><circle cx="38" cy="42" r="13"/><circle cx="100" cy="28" r="13"/><circle cx="162" cy="48" r="13"/><circle cx="52" cy="108" r="13"/><circle cx="150" cy="112" r="13"/><circle cx="100" cy="78" r="13"/></g><g fill="var(--ac)"><circle cx="38" cy="42" r="4"/><circle cx="100" cy="28" r="4"/><circle cx="162" cy="48" r="4"/><circle cx="52" cy="108" r="4"/><circle cx="150" cy="112" r="4"/><circle cx="100" cy="78" r="4"/></g></svg>'][n];


/* ===== Themenbereiche (Subs) ===== */
const subTag=id=>{const sb=id&&DB.mem.get(id);return sb&&sb.t==='sub'?`<span class="tag" role="link" tabindex="0" data-stop data-href="#/s/${sb.id}" translate="no" style="cursor:pointer">${ic('hash',12)}${esc(subLabel(sb))}</span>`:''};
const subCard=sb=>{const th=subThreads(sb.id);return`<button class="card thr" data-act="opensub" data-id="${sb.id}"><div class="meta"><span class="tag">${ic('hash',12)}Themenbereich</span><span>${th.length} Unterhaltungen</span></div><h3 translate="no" data-tx>${esc(subLabel(sb))}</h3><p class="mu sm" style="margin:6px 0 0" translate="no" data-tx>${esc(sb.desc.length>140?sb.desc.slice(0,137)+'…':sb.desc)}</p></button>`};
function viewSubs(){const L=subs().map(sb=>({sb,n:subThreads(sb.id).length})).sort((a,b)=>b.n-a.n||b.sb.ts-a.sb.ts);
 $('#main').innerHTML=`${topbar()}<h1>Themenbereiche</h1><p class="mu" style="margin:0 0 12px">Jeder kann einen Themenbereich anlegen. Alle dürfen darin eigene Unterhaltungen starten.</p><button class="btn pri" data-act="newsub">${ic('plus',18)}Themenbereich anlegen</button><div id="list" style="margin-top:14px">${L.map(x=>subCard(x.sb)).join('')||`<div class="empty">${art(0)}<h2>Noch kein Themenbereich</h2><p class="mu">Lege den ersten an oder verbinde dich mit jemandem, der schon welche hat.</p></div>`}</div>`}
function viewSub(id){const sb=DB.mem.get(id);
 if(!sb||sb.t!=='sub'){$('#main').innerHTML=`${topbar(true,'')}<div class="empty">${art(0)}<h2>Dieser Themenbereich ist noch nicht hier</h2><p class="mu">Verbinde dich mit jemandem, der ihn hat, unter „Teilen“.</p><button class="btn pri" data-act="nav" data-k="share">Zu „Teilen“</button></div>`;return}
 const L=subThreads(id).map(summ).sort((a,b)=>b.hot-a.hot);
 $('#main').innerHTML=`${topbar(true,'')}<div class="meta"><span class="tag">${ic('hash',12)}Themenbereich</span><span>Angelegt ${new Date(sb.ts).toLocaleDateString(LOC(),{dateStyle:'medium'})}</span><span>Kürzel ${id.slice(0,8)}</span></div>
 <h1 translate="no" data-tx>${esc(subLabel(sb))}</h1><p translate="no" data-tx style="white-space:pre-wrap">${esc(sb.desc)}</p>
 <section class="card" style="background:var(--acs)"><h2 style="font-size:1rem">${ic('shield',16)} Verhaltensregeln</h2><p class="sm" translate="no" data-tx style="white-space:pre-wrap;margin:6px 0 0">${esc(sb.rules)}</p></section>
 <button class="btn pri" data-act="newin" data-id="${id}" style="width:100%;margin:6px 0 14px;min-height:50px">${ic('plus',18)}Unterhaltung hier starten</button>
 <div id="list">${L.map((x,i)=>card(x,i+1)).join('')||`<div class="empty"><h2>Noch keine Unterhaltung</h2><p class="mu">Starte die erste in diesem Themenbereich.</p></div>`}</div>`}
function subSheet(){const cnt=(k,n)=>`<span class="sm mu" id="c_${k}" aria-live="off">0/${n}</span>`;
 sheet(`<div class="hd"><h2>Themenbereich anlegen</h2><button class="btn ghost icon" data-a="x" aria-label="Schließen">${ic('x')}</button></div>
 <label class="f" for="sn">Name</label><input type="text" id="sn" maxlength="30" autocomplete="off" placeholder="z. B. Stadt & Verkehr">${cnt('sn',30)}<div class="err" id="e_sn" role="alert"></div>
 <label class="f" for="sd">Beschreibung</label><textarea id="sd" rows="4" maxlength="500" placeholder="Worum geht es in diesem Themenbereich?"></textarea>${cnt('sd',500)}<div class="err" id="e_sd" role="alert"></div>
 <label class="f" for="sr">Verhaltensregeln</label><textarea id="sr" rows="4" maxlength="500" placeholder="Was ist hier erlaubt, was nicht?"></textarea>${cnt('sr',500)}<div class="err" id="e_sr" role="alert"></div>
 <p class="sm mu">Beschreibung und Regeln sind Pflicht und erscheinen für alle sichtbar. Sie lassen sich später nicht ändern.</p>
 <button class="btn pri" style="width:100%;margin-top:10px;min-height:50px" data-a="go">Themenbereich anlegen</button>`,d=>{
  const F={sn:['name',30],sd:['desc',500],sr:['rules',500]};
  for(const id in F){const el=$('#'+id,d);el.oninput=()=>{$('#c_'+id,d).textContent=el.value.length+'/'+F[id][1]}}
  d.onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;if(b.dataset.a==='x')return closeSheet();
   if(b.dataset.a!=='go')return;let bad=false;const v={};
   for(const id in F){const k=F[id][0],el=$('#'+id,d),x=k==='name'?el.value.replace(/\s+/g,' ').trim():el.value.trim();v[k]=x;const er=$('#e_'+id,d);er.textContent='';
    if(x.length<SUBMIN[k]){er.textContent=k==='name'?_('Bitte gib mindestens 2 Zeichen ein.'):_('Bitte schreibe mindestens 10 Zeichen. Das Feld ist Pflicht.');bad=true}}
   if(bad)return;b.disabled=true;b.textContent=_('Wird angelegt …');await new Promise(r=>setTimeout(r,30));
   const o=await createSub(v);closeSheet();location.hash='#/s/'+o.id;say('Themenbereich angelegt')};
  $('#sn',d).focus()})}

/* ===== Unterhaltung ansehen ===== */
const SORTC=[['best','Beste'],['top','Top'],['new','Neu'],['ctr','Umstritten']];
let curKey=null;
async function viewThread(id){const r=DB.mem.get(id);
 if(!r){$('#main').innerHTML=`${topbar(true,'')}<div class="empty">${art(0)}<h2>Diese Unterhaltung ist noch nicht hier</h2><p class="mu">Importiere die Datei, die du bekommen hast, unter „Teilen“.</p><button class="btn pri" data-act="nav" data-k="share">Zu „Teilen“</button></div>`;return}
 curKey=await keyFor(id);markStep('view');const s=summ(r),blob=r.snap&&DB.mem.get(r.snap.hash),shotB=r.shot&&DB.mem.get(r.shot.hash),[kl,ki]=KIND[r.anchor.kind]||KIND.free;
 $('#main').innerHTML=`${topbar(true,'')}<div class="meta"><span class="tag">${ic(ki,12)}${kl}</span>${subTag(r.sub)}<span>Start ${new Date(r.ts).toLocaleString(LOC(),{dateStyle:'medium',timeStyle:'short'})}</span>${r.geo?`<span>${ic('pin',13)} Ort fixiert</span>`:''}<span>Kürzel ${id.slice(0,8)}</span></div>
 ${gapOf(id)?`<div class="card gapb"><span>${_('Diese Unterhaltung ist noch nicht vollständig. Es fehlen noch {n} Teile. Beim nächsten Austausch geht es hier weiter.',{n:gapOf(id)})}</span> <button class="btn sm pri" data-act="connect">${_('Jetzt verbinden')}</button></div>`:''}
 <h1 translate="no" data-tx>${esc(r.title)}</h1>
 ${r.anchor.text?`<div class="card" style="background:var(--acs)"><div class="sm mu">Textstelle</div><span translate="no" data-tx>„${esc(r.anchor.text)}“</span></div>`:''}
 ${r.anchor.url?`<p class="sm mu" style="margin:0 0 8px">Seite: ${esc(r.anchor.url)}</p>`:''}
 <div class="acts" style="margin:8px 0"><span class="vote"><button class="u ${myV(r.id)>0?'on':''}" data-act="vote" data-t="${r.id}" data-d="1" aria-label="Unterhaltung gut finden">${ic('up')}</button><b>${s.u-s.d}</b><button class="d ${myV(r.id)<0?'on':''}" data-act="vote" data-t="${r.id}" data-d="-1" aria-label="Unterhaltung nicht gut finden">${ic('down')}</button></span>
 <button class="btn sm" data-act="exp" data-id="${r.id}">${ic('upload',16)}Als Datei teilen</button><button class="btn ghost sm" data-act="hide" data-id="${r.id}">${_('Unterhaltung ausblenden')}</button></div>
 ${shotB&&B64RE.test(shotB.data)?`<figure class="shotf"><img class="shotimg" data-act="shotzoom" alt="${esc(_('Screenshot der Seite'))}" src="data:${r.shot.m};base64,${shotB.data}"><figcaption class="sm mu">${_('Bild vom Ersteller. Nicht geprüft.')}</figcaption></figure>`:r.shot?`<p class="sm mu">${ic('clip',12)} ${deferM()[r.shot.hash]?_('Screenshot zurückgestellt'):_('Screenshot fehlt noch')}</p>`:''}
 ${snapDoc(blob)?`<details class="snap"><summary>Seitenstand beim Start ansehen</summary><iframe sandbox="" title="Gespeicherter Seitenstand" srcdoc="${esc(snapDoc(blob))}"></iframe></details>`:''}
 <div class="chips" role="group" aria-label="Kommentare sortieren" style="margin-top:12px">${SORTC.map(([k,l])=>`<button class="chip" data-act="csort" data-k="${k}" aria-pressed="${k===S.csort}">${l}</button>`).join('')}<button class="chip" data-act="sus" aria-pressed="${!S.hideSus}">${S.hideSus?'Auffälliges ausgeblendet':'Auffälliges sichtbar'}</button></div>
 <div id="clist"></div><div class="dock" id="dock"></div>`;
 renderComments(r);const dock=$('#dock');dock.append(makeComposer({placeholder:'Anonym schreiben …',onSend:async p=>{await sendPost(r.id,p,window._reply);window._reply=null;renderComments(r)}}));
 if(S.focusDock){S.focusDock=false}}
function myV(id){const ev=DB.by.get(id)||[];const t=tally(DB.by.get(id)||[],id);const v=curKey&&t.mine.get(curKey.pub);return v?v.dir:0}
function renderComments(r){const{tree}=detail(r,S.csort,curKey);const sum=summ(r);
 const row0=(x,l)=>{const c=x.c,mine=curKey&&c.author===curKey.pub;if(x.sus&&S.hideSus&&!(S.shown&&S.shown.has(x.id)))return`<div class="c ${l?'':'l0'} stub"><div class="cb"><span class="tag red">${_('auffällig')}</span> <span class="sm mu">${_('Verdacht auf Spam.')}</span> <button class="btn ghost sm" data-act="sus1" data-id="${x.id}">${_('Anzeigen')}</button></div>${x.kids.map(k=>row(k,l+1)).join('')}</div>`;
  const aw=Object.entries(x.aw).map(([k,n])=>`<span class="tag ${AW.premium[k]?'gold':''}">${ic('award',12)}${awL(k)} ${n}</span>`).join(' ');
  const med=(c.media||[]).map(m=>{const b=DB.mem.get(m.h);if(!b||!B64RE.test(b.data)){const dz=deferM()[m.h];return dz?`<div class="sm mu">${ic('clip',12)} ${_('Anhang zurückgestellt ({b})',{b:fmtB(dz[0])})} <button class="btn ghost sm" data-act="pull">${_('Beim nächsten Austausch laden')}</button></div>`:`<div class="sm mu">${_('Anhang fehlt noch')}</div>`}
   if(IMG.test(m.m))return`<img src="data:${m.m};base64,${b.data}" alt="${esc(m.n||'Bild')}" data-act="zoom" tabindex="0">`;
   if(AUD.test(m.m))return`<audio controls src="data:${m.m};base64,${b.data}"></audio>`;
   return`<a class="lnk" download="${esc(m.n||'datei')}" href="data:application/octet-stream;base64,${b.data}">${ic('clip')}<span translate="no">${esc(m.n||'Datei')}</span> · ${Math.round((m.s||0)/1024)} KB</a>`}).join('');
  const lk=c.url&&okUrl(c.url)?`<a class="lnk" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer nofollow ugc">${ic('link')}${esc(new URL(c.url).hostname)}</a>`:'';
  const lc=c.loc&&okLoc(c.loc)?`<a class="lnk" href="https://www.openstreetmap.org/?mlat=${+c.loc.lat}&mlon=${+c.loc.lon}#map=17/${+c.loc.lat}/${+c.loc.lon}" target="_blank" rel="noopener noreferrer">${ic('pin')}Standort auf der Karte (ca. 100 m genau)</a>`:'';
  return`<div class="c ${l?'':'l0'} ${x.sus?'sus':''}"><div class="cb"><div class="who"><b>${alias(c.author)}</b>${cnTag(c)}${c.author===r.author?'<span class="tag">Starter</span>':''}${mine?'<span class="tag blue">Du</span>':''}${x.sus?'<span class="tag red">auffällig</span>':''}<span>${ago(c.ts)}</span></div>
  <p translate="no" data-tx>${esc(c.body)}</p><div class="media">${med}${lk}${lc}</div>
  <div class="acts"><span class="vote"><button class="u ${x.my>0?'on':''}" data-act="vote" data-t="${r.id}" data-id="${x.id}" data-d="1" aria-label="Beitrag gut finden">${ic('up')}</button><b>${x.u-x.d}</b><button class="d ${x.my<0?'on':''}" data-act="vote" data-t="${r.id}" data-id="${x.id}" data-d="-1" aria-label="Beitrag nicht gut finden">${ic('down')}</button></span>
  <button class="btn ghost sm" data-act="award" data-t="${r.id}" data-id="${x.id}">${ic('award',16)}Auszeichnen</button><button class="btn ghost sm" data-act="reply" data-id="${x.id}" data-by="${esc(alias(c.author))}">Antworten</button>${mine?'':`<button class="btn ghost sm" data-act="hide" data-t="${r.id}" data-id="${x.id}" data-au="${c.author}">${_('Ausblenden')}</button>`}${aw}</div></div>${x.kids.map(k=>row(k,l+1)).join('')}</div>`};
 const row=(x,l)=>{try{return row0(x,l)}catch{return''}};
 $('#clist').innerHTML=`<h2 style="margin-top:6px">${sum.n} Kommentare</h2>${tree.map(x=>row(x,0)).join('')||'<p class="mu">Noch keine Kommentare. Schreibe den ersten!</p>'}`}

/* ===== Schreiben: Eingabefeld mit allen Beitragsarten ===== */
const MAXB=1.5e6;
const rd=f=>new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result.split(',')[1]);r.onerror=no;r.readAsDataURL(f)});
async function shrink(file){const Q={h:[1600,.85],m:[1280,.8],l:[800,.62]}[Meta.get('imgq','m')]||[1280,.8],bmp=await createImageBitmap(file),sc=Math.min(1,Q[0]/Math.max(bmp.width,bmp.height)),c=document.createElement('canvas');c.width=Math.round(bmp.width*sc);c.height=Math.round(bmp.height*sc);c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);return c.toDataURL('image/jpeg',Q[1]).split(',')[1]}
function makeComposer({placeholder,onSend,label='Senden',compact}){
 const st={media:[],blobs:[],url:'',loc:null,rec:null};const root=document.createElement('div');root.className='comp';
 root.innerHTML=`<label class="sr" for="ct">Dein Beitrag</label><textarea id="ct" rows="2" placeholder="${esc(placeholder)}"></textarea><div class="att" aria-live="polite"></div><div data-u hidden style="padding:4px 6px"><input type="url" placeholder="https://… (Link einfügen)" aria-label="Link"></div>
 <div class="cbar"><div class="tools"><button class="btn ghost icon" data-t="img" aria-label="Foto hinzufügen">${ic('image')}</button><button class="btn ghost icon" data-t="url" aria-label="Link hinzufügen">${ic('link')}</button><button class="btn ghost icon" data-t="file" aria-label="Datei hinzufügen">${ic('clip')}</button><button class="btn ghost icon" data-t="mic" aria-label="Sprachnachricht aufnehmen">${ic('mic')}</button><button class="btn ghost icon" data-t="loc" aria-label="Standort teilen">${ic('pin')}</button></div><button class="btn pri" data-t="send">${label}</button></div>
 <input type="file" accept="image/*" hidden data-f="img"><input type="file" hidden data-f="file">`;
 const att=$('.att',root),ta=$('textarea',root),ui=$('[data-u]',root);
 const draw=()=>{att.innerHTML=st.media.map((m,i)=>`<span class="tag">${esc(m.n)}<button data-rm="${i}" aria-label="Entfernen">×</button></span>`).join('')+(st.loc?`<span class="tag">Standort<button data-rm="loc" aria-label="Entfernen">×</button></span>`:'')};
 const addBlob=async(data,m,n,s)=>{if(data.length>2.7e6)return toast('Die Datei ist zu groß. Bis 1,5 MB geht.');const b={t:'blob',id:sha(data),data};st.blobs.push(b);st.media.push({h:b.id,m,n,s});draw()};
 root.onclick=async e=>{const rm=e.target.closest('[data-rm]');if(rm){if(rm.dataset.rm==='loc')st.loc=null;else{st.media.splice(+rm.dataset.rm,1)}return draw()}
  const b=e.target.closest('[data-t]');if(!b)return;const t=b.dataset.t;
  if(t==='img')$('[data-f=img]',root).click();if(t==='file')$('[data-f=file]',root).click();
  if(t==='url'){ui.hidden=!ui.hidden;if(!ui.hidden)$('input',ui).focus()}
  if(t==='loc'){if(!navigator.geolocation)return toast('Dein Gerät kann den Standort nicht bestimmen.');navigator.geolocation.getCurrentPosition(p=>{st.loc={lat:Math.round(p.coords.latitude*1000)/1000,lon:Math.round(p.coords.longitude*1000)/1000};draw()},()=>toast('Kein Zugriff auf den Standort. Das kannst du in den Einstellungen erlauben.'))}
  if(t==='mic'){if(st.rec){st.rec.stop();return}try{const stream=await navigator.mediaDevices.getUserMedia({audio:true}),mr=new MediaRecorder(stream),ch=[];st.rec=mr;b.classList.add('rec');mr.ondataavailable=ev=>ch.push(ev.data);
    mr.onstop=async()=>{stream.getTracks().forEach(x=>x.stop());b.classList.remove('rec');st.rec=null;const bl=new Blob(ch,{type:mr.mimeType});await addBlob(await rd(bl),(mr.mimeType||'audio/webm').split(';')[0],'Sprachnachricht',bl.size)};mr.start();setTimeout(()=>st.rec&&st.rec.state==='recording'&&st.rec.stop(),60000)}catch{toast('Kein Zugriff auf das Mikrofon.')}}
  if(t==='send'){if(st.rec)st.rec.stop();const body=ta.value.trim(),url=$('input',ui).value.trim();
   if(!body&&!st.media.length&&!url&&!st.loc)return toast('Schreibe etwas oder hänge etwas an.');
   if(url&&!/^https?:\/\//.test(url))return toast('Der Link muss mit http:// oder https:// beginnen.');
   if(/[\w.+-]+@[\w-]+\.[a-z]{2,}|\+?\d[\d\s\/-]{8,}\d/i.test(body)&&!await ask('Persönliche Daten?','Dein Text enthält etwas, das wie eine E-Mail-Adresse oder Telefonnummer aussieht. Jeder kann es lesen und es lässt sich nicht sicher löschen. Trotzdem senden?','Trotzdem senden','Ändern'))return;
   b.disabled=true;b.textContent='Wird gesendet …';await new Promise(r=>setTimeout(r,30));
   const kind=st.media.length?(/^image/.test(st.media[0].m)?'image':/^audio/.test(st.media[0].m)?'audio':'file'):st.loc?'location':url?'link':'text';
   const lab={image:'Foto',audio:'Sprachnachricht',file:'Datei',location:'Standort',link:'Link',text:''}[kind];
   const extra={kind,blobs:st.blobs};if(st.media.length)extra.media=st.media;if(url)extra.url=url;if(st.loc)extra.loc=st.loc;
   try{await onSend({body:body||lab,extra})}finally{ta.value='';$('input',ui).value='';ui.hidden=true;st.media=[];st.blobs=[];st.loc=null;draw();b.disabled=false;b.textContent=label}}};
 root.onchange=async e=>{const f=e.target.files&&e.target.files[0];if(!f)return;const k=e.target.dataset.f;e.target.value='';try{
  if(k==='img'){const d=await shrink(f);await addBlob(d,'image/jpeg',f.name.replace(/\.\w+$/,'')+'.jpg',Math.round(d.length*.75))}
  else{if(f.size>MAXB)return toast('Die Datei ist zu groß. Bis 1,5 MB geht.');await addBlob(await rd(f),f.type||'application/octet-stream',f.name,f.size)}}catch{toast('Das hat leider nicht geklappt.')}};
 root.get=()=>ta;return root}
let _bh=0;
function backupHint(){if(_bh)return;_bh=1;const go=n=>{if(Meta.get('backupAsked')){_bh=0;return}if($('#dlg').open||!$('#ob').hidden){if(n<20)setTimeout(()=>go(n+1),1500);else _bh=0;return}_bh=0;Meta.set('backupAsked',1);toast('Tipp: Sichere deinen Platz, falls du dein Gerät verlierst.','Jetzt sichern',backupSheet)};setTimeout(()=>go(0),4500)}
async function sendPost(tid,p,parent){await postComment(tid,p.body,parent,p.extra);markStep('comment');tipLater('post',1200);if(!Meta.get('backupAsked'))backupHint();else say('Beitrag gesendet')}

/* ===== Neue Unterhaltung (Schritt für Schritt) ===== */
function newSheet(step=0,data={}){
 if(step===0)return sheet(`<div class="hd"><h2>Worüber willst du sprechen?</h2><button class="btn ghost icon" data-a="x" aria-label="Schließen">${ic('x')}</button></div><div class="tiles">
  <button class="tile" data-a="k" data-k="page"><span class="ti">${ic('globe')}</span><span><b>Eine Webseite oder Textstelle</b><span class="mu sm">Zum Beispiel ein Zeitungsartikel</span></span></button>
  <button class="tile" data-a="k" data-k="place"><span class="ti">${ic('pin')}</span><span><b>Einen Ort</b><span class="mu sm">Tür, Haltestelle, Spielplatz. Mit QR-Aufkleber.</span></span></button>
  <button class="tile" data-a="k" data-k="free"><span class="ti">${ic('msg')}</span><span><b>Ein freies Thema</b><span class="mu sm">Frage in die Runde</span></span></button>
  <button class="tile" data-a="sub"><span class="ti">${ic('hash')}</span><span><b>Einen Themenbereich</b><span class="mu sm">Eigener Bereich mit Regeln. Andere starten darin Unterhaltungen.</span></span></button></div>`,d=>{d.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;if(b.dataset.a==='x')closeSheet();else if(b.dataset.a==='sub')subSheet();else newSheet(1,{kind:b.dataset.k,sub:data.sub})}});
 const k=data.kind,t={page:'Webseite',place:'Ort',free:'Thema'}[k];let html=null,geo=null;
 sheet(`<div class="hd"><button class="btn ghost icon" data-a="b" aria-label="Zurück">${ic('back')}</button><h2>${t} · Neue Unterhaltung</h2><button class="btn ghost icon" data-a="x" aria-label="Schließen">${ic('x')}</button></div>
 <label class="f" for="nt">Titel</label><input type="text" id="nt" maxlength="120" placeholder="${k==='place'?'z. B. Klingel an der Haustür kaputt':k==='page'?'z. B. Stimmt diese Zahl wirklich?':'z. B. Welche Bahn nehmt ihr?'}" autocomplete="off"><div class="err" id="nterr" role="alert"></div>
 ${k==='page'?`<label class="f" for="nu">Adresse der Seite (optional)</label><input type="url" id="nu" placeholder="https://…" value="${esc(data.url||'')}"><label class="f" for="nq">Textstelle (optional)</label><textarea id="nq" rows="2" placeholder="Kopiere hier den Satz hinein, um den es geht">${esc(data.text||'')}</textarea>
  <label class="f">${_('Screenshot (optional)')}</label><div id="shot"><div class="sm mu" id="shotst" aria-live="polite"></div><img id="shotimg" class="shotimg" alt="" hidden><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px"><button class="btn sm" data-a="si">${ic('image')}${_('Bild aus Datei oder Galerie')}</button><button class="btn ghost sm" data-a="sr" id="shotrm" hidden>${_('Bild entfernen')}</button></div><input type="file" accept="image/*" hidden id="sfi"></div>
  <label class="f">Seite als Datei hinzufügen (optional)</label><p class="sm mu" style="margin:0 0 6px">So bleibt der heutige Stand erhalten, auch wenn die Seite später geändert wird. Im Browser: Seite speichern unter … als „Webseite, nur HTML“.</p><button class="btn" data-a="f">${ic('file')}Datei auswählen</button> <span class="sm mu" id="nf"></span><input type="file" accept=".html,.htm,text/html" hidden id="nfi">`:''}
 ${k==='place'?`<label class="f">Wo ist das?</label><button class="btn" data-a="g">${ic('pin')}Meinen Standort verwenden</button> <span class="sm mu" id="ng">Noch kein Ort gewählt</span><p class="sm mu">Der Ort der Unterhaltung ist öffentlich und wird auf etwa 100 m gerundet. Dein eigener Standort bleibt privat.</p>`:''}
 ${subs().length?`<label class="f" for="ns">Themenbereich (optional)</label><select id="ns"><option value="">Kein Themenbereich</option>${subs().map(sb=>`<option value="${sb.id}" ${data.sub===sb.id?'selected':''}>${esc(subLabel(sb))}</option>`).join('')}</select><div id="nsr"></div>`:''}
 <label class="f" for="nb">Erster Beitrag (optional)</label><textarea id="nb" rows="3" placeholder="Was möchtest du sagen?"></textarea>
 <button class="btn pri" style="width:100%;margin-top:14px;min-height:50px" data-a="go">Unterhaltung starten</button>`,d=>{
  d.onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
   if(a==='si')return $('#sfi',d).click();
   if(a==='sr'){shotSrc='removed';shotFor=($('#nu',d)||{value:''}).value.trim();showShot(null,'removed');say('');return}
   if(a==='sv0'){Meta.set('shotSvc','off');say(_('Kein automatischer Screenshot. Du kannst selbst ein Bild anfügen.'));return}
   if(a==='sv1'){Meta.set('shotSvc','microlink');runAuto();return}
   if(a==='sv2'){say(`<input type="url" id="shu2" translate="no" placeholder="https://dienst.example/shot?url={url}"> <button class="btn sm pri" data-a="sv3">${_('Speichern')}</button>`);return}
   if(a==='sv3'){const v=($('#shu2',d)||{value:''}).value.trim();if(!/^https?:\/\/.*\{url\}/.test(v))return toast(_('Die Adresse muss {url} enthalten.'));Meta.set('shotSvc','custom');Meta.set('shotUrl',v);runAuto();return}
   if(a==='x')return closeSheet();if(a==='b')return newSheet(0,{sub:data.sub});if(a==='f')return $('#nfi',d).click();
   if(a==='g'){if(!navigator.geolocation)return toast('Dein Gerät kann den Standort nicht bestimmen.');return navigator.geolocation.getCurrentPosition(p=>{geo={lat:Math.round(p.coords.latitude*1000)/1000,lon:Math.round(p.coords.longitude*1000)/1000};$('#ng',d).textContent='Ort festgelegt ✓'},()=>toast('Kein Zugriff auf den Standort. Das kannst du in den Einstellungen erlauben.'))}
   if(a==='go'){const title=$('#nt',d).value.trim();if(title.length<3){$('#nterr',d).textContent='Bitte gib einen Titel mit mindestens 3 Zeichen ein.';$('#nt',d).focus();return}
    b.disabled=true;b.textContent='Wird angelegt …';await new Promise(r=>setTimeout(r,30));
    const anchor={kind:k==='page'?(($('#nq',d)||{value:''}).value.trim()?'passage':'page'):k};if(k==='page'){const u=$('#nu',d).value.trim();if(/^https?:\/\//.test(u))anchor.url=u;const q=$('#nq',d).value.trim();if(q)anchor.text=q.slice(0,500)}
    const bd=$('#nb',d).value.trim();const nsEl=$('#ns',d),sbId=nsEl&&/^[0-9a-f]{64}$/.test(nsEl.value)?nsEl.value:undefined;if(shotBusy)await Promise.race([shotBusy,new Promise(r=>setTimeout(r,4000))]);const r=await createThread({title,anchor,geo,html,sub:sbId,shot:shotData,first:bd?{body:bd,extra:{kind:'text'}}:null});
    closeSheet();markStep('comment');location.hash='#/t/'+r.id;if(!Meta.get('backupAsked'))backupHint()}};
  let shotData=null,shotSrc='',shotTimer=0,shotBusy=null,shotFor='';
  const sst=$('#shotst',d),simg=$('#shotimg',d),srm=$('#shotrm',d);
  const showShot=(b64,src)=>{shotData=b64;shotSrc=src;if(!simg)return;if(b64){simg.src='data:image/jpeg;base64,'+b64;simg.hidden=false;srm.hidden=false}else{simg.hidden=true;srm.hidden=true;simg.removeAttribute('src')}};
  const say=t=>{if(sst)sst.innerHTML=t};
  const runAuto=async()=>{const nu=$('#nu',d);if(!nu)return;const u=nu.value.trim();if(shotSrc==='user')return;
   if(shotSrc==='removed'){if(u===shotFor)return;shotSrc=''}
   if(!publicUrl(u)){if(shotSrc==='auto')showShot(null,'');shotFor='';say('');return}
   if(u===shotFor&&shotData)return;
   const svc=Meta.get('shotSvc','');
   if(svc==='off'){say(_('Kein automatischer Screenshot. Du kannst selbst ein Bild anfügen.'));return}
   if(!svc){if(sst&&sst.querySelector('[data-a=sv1],#shu2'))return;say(`<b>${_('Automatisch einen Screenshot anfügen?')}</b> ${_('Dafür wird die Adresse der Seite an einen Screenshot-Dienst gesendet. Der Dienst sieht dann, welche Seite du besprichst.')}<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px"><button class="btn sm pri" data-a="sv1">${_('Ja, Microlink nutzen')}</button><button class="btn sm" data-a="sv2">${_('Eigenen Dienst eintragen')}</button><button class="btn ghost sm" data-a="sv0">${_('Nein, danke')}</button></div>`);return}
   shotFor=u;say(_('Screenshot wird erstellt …'));
   const p=fetchShot(u).then(b=>{if(nu.value.trim()!==u||shotSrc==='user')return;showShot(b,'auto');say(_('Screenshot angefügt. Du kannst ihn entfernen.'))}).catch(()=>{if(shotSrc!=='user'&&nu.value.trim()===u){showShot(null,'');shotFor='';say(_('Der Screenshot hat nicht geklappt. Du kannst selbst ein Bild anfügen.'))}});
   shotBusy=p;await p;if(shotBusy===p)shotBusy=null};
  const nuEl=$('#nu',d);if(nuEl){nuEl.addEventListener('input',()=>{clearTimeout(shotTimer);shotTimer=setTimeout(runAuto,900)});nuEl.addEventListener('change',runAuto);if(data.url)setTimeout(runAuto,300)}
  const sfi=$('#sfi',d);if(sfi)sfi.onchange=async()=>{const f=sfi.files[0];sfi.value='';if(!f)return;if(!/^image\//.test(f.type))return toast(_('Das Bild konnte nicht gelesen werden.'));try{const b=await shrink(f);if(b.length>MAXB)throw 0;showShot(b,'user');say(_('Eigenes Bild angefügt.'))}catch{toast(_('Das Bild konnte nicht gelesen werden.'))}};
  const fi=$('#nfi',d);if(fi)fi.onchange=async()=>{const f=fi.files[0];if(!f)return;if(f.size>MAXB)return toast('Die Datei ist zu groß. Bis 1,5 MB geht.');html=cleanHtml(await f.text());$('#nf',d).textContent=f.name+' ✓'};
  const ns=$('#ns',d);if(ns){const showR=()=>{const sb=DB.mem.get(ns.value);$('#nsr',d).innerHTML=sb&&sb.t==='sub'?`<details open class="sm" style="margin:6px 0"><summary>Regeln dieses Themenbereichs</summary><p class="mu" translate="no" style="white-space:pre-wrap">${esc(sb.rules)}</p><p class="mu">Mit dem Start akzeptierst du diese Regeln.</p></details>`:''};ns.onchange=showR;showR()}
  $('#nt',d).focus()})}
function publicUrl(u){try{const x=new URL(u);if(!/^https?:$/.test(x.protocol))return false;const h=x.hostname.toLowerCase();if(h==='localhost'||h.includes(':')||h.startsWith('[')||!h.includes('.'))return false;if(/\.(local|internal|lan|home|localdomain|intranet)$/.test(h))return false;if(/^(0\.|10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(h))return false;return true}catch{return false}}
async function fetchShot(url){const svc=Meta.get('shotSvc',''),tpl=Meta.get('shotUrl','');let api='';
 if(svc==='microlink')api='https://api.microlink.io/?url='+encodeURIComponent(url)+'&screenshot=true&meta=false&viewport.width=1100&viewport.height=700&type=jpeg';
 else if(svc==='custom'&&/^https?:\/\/.*\{url\}/.test(tpl))api=tpl.replace('{url}',encodeURIComponent(url));
 else throw new Error('kein Dienst');
 const ac=new AbortController(),to=setTimeout(()=>ac.abort(),25000),opt={signal:ac.signal,credentials:'omit',referrerPolicy:'no-referrer'};
 try{const r=await fetch(api,opt);if(!r.ok)throw new Error('http');let bl;
  if(/^image\//.test(r.headers.get('content-type')||''))bl=await r.blob();
  else{const j=await r.json(),u=(j&&j.data&&j.data.screenshot&&j.data.screenshot.url)||(j&&typeof j.screenshot==='string'&&j.screenshot)||(j&&typeof j.url==='string'&&j.url);if(typeof u!=='string'||!/^https?:\/\//.test(u))throw new Error('antwort');const r2=await fetch(u,opt);if(!r2.ok)throw new Error('http');bl=await r2.blob()}
  if(!/^image\//.test(bl.type)||bl.size>8e6)throw new Error('bild');return await shrink(bl)}finally{clearTimeout(to)}}
function snapDoc(blob){try{if(!blob||typeof blob.data!=='string'||!B64RE.test(blob.data))return'';return cleanHtml(decodeURIComponent(escape(atob(blob.data))),true)}catch{return''}}
function cleanHtml(src,csp){const d=new DOMParser().parseFromString(src,'text/html');d.querySelectorAll('script,iframe,object,embed,form,base,link,meta[http-equiv]').forEach(n=>n.remove());if(csp)d.querySelectorAll('*').forEach(n=>{for(const a of['src','srcset','href','poster','background','data','action','formaction','xlink:href'])if(n.hasAttribute(a)&&!(a==='href'&&n.tagName==='A')&&!/^\s*data:image\//i.test(n.getAttribute(a)))n.removeAttribute(a);if(n.hasAttribute('style'))n.setAttribute('style',n.getAttribute('style').replace(/url\([^)]*\)/gi,'none'))});
 if(csp){const m=d.createElement('meta');m.setAttribute('http-equiv','Content-Security-Policy');m.setAttribute('content',"default-src 'none'; style-src 'unsafe-inline'; img-src data:");d.head.prepend(m)}d.querySelectorAll('*').forEach(n=>[...n.attributes].forEach(a=>{if(/^on/i.test(a.name)||/^\s*javascript:/i.test(a.value))n.removeAttribute(a.name)}));return'<!doctype html>'+d.documentElement.outerHTML}

/* ===== Auszeichnen ===== */
function awardSheet(tid,target){const prem=Object.entries(AW.premium).map(([k,v])=>{const a=awAvail(k);return a>0?`<button class="chip" data-a="p" data-k="${k}" style="border-color:var(--gold)">${ic('award',16)}${_(v[0])} · ${_('{n} übrig',{n:a})}</button>`:`<button class="chip" disabled style="opacity:.6">${ic('lock',14)}${_(v[0])} · ${_('noch {n} Austausch',{n:awNext(k)})}</button>`}).join('');
 sheet(`<div class="hd"><h2>${_('Auszeichnen')}</h2><button class="btn ghost icon" data-a="x" aria-label="${_('Schließen')}">${ic('x')}</button></div><p class="mu">${_('Sag danke für einen guten Beitrag.')}</p>
 <div class="mu sm" style="font-weight:700">${_('Immer frei')}</div><div class="chips" style="flex-wrap:wrap">${Object.entries(AW.free).map(([k,v])=>`<button class="chip" data-a="g" data-k="${k}">${ic('award',16)}${_(v[0])}</button>`).join('')}</div>
 <div class="mu sm" style="font-weight:700;margin-top:6px">${_('Besondere Auszeichnungen')}</div><div class="chips" style="flex-wrap:wrap">${prem}</div>
 <p class="sm mu">${_('Besondere Auszeichnungen kosten nichts. Du verdienst sie, wenn du dich mit anderen Menschen austauschst. Sie sammeln sich bei dir an, bis du sie vergibst.')}</p>`,d=>{d.onclick=async e=>{const b=e.target.closest('[data-a]');if(!b||b.disabled)return;if(b.dataset.a==='x')return closeSheet();
  if(b.dataset.a==='p'){const k=b.dataset.k;if(!UNL[k]||awAvail(k)<1)return;const st=earnSt();st.u=st.u||{};st.u[k]=(st.u[k]||0)+1;Meta.set('earn',st)}
  await postAward(tid,target,b.dataset.k);closeSheet();renderComments(DB.mem.get(tid));toast(_('Auszeichnung vergeben'))}})}

/* ===== Teilen & Sichern ===== */
function merkleRoot(){let L=roots().map(r=>r.id).sort();if(!L.length)return sha('');while(L.length>1){const n=[];for(let i=0;i<L.length;i+=2)n.push(sha(L[i]+(L[i+1]!==undefined?L[i+1]:L[i])));L=n}return L[0]}

/* ===== Export / Import als HTML-Datei ===== */
function threadObjects(id){const r=DB.mem.get(id),ev=DB.by.get(id)||[],bl=new Set();if(r.snap)bl.add(r.snap.hash);if(r.shot)bl.add(r.shot.hash);for(const e of ev)for(const m of e.media||[])bl.add(m.h);return[r,...[...bl].map(h=>DB.mem.get(h)).filter(Boolean),...ev]}
function exportHtml(id){const r=DB.mem.get(id),objs=threadObjects(id),{tree}=detail(r,'best',null),blob=r.snap&&DB.mem.get(r.snap.hash);
 const row=(x,l)=>{const c=x.c;const med=(c.media||[]).map(m=>{const b=DB.mem.get(m.h);if(!b||!B64RE.test(b.data))return'';if(IMG.test(m.m))return`<img src="data:${m.m};base64,${b.data}" alt="${esc(m.n||'')}" style="max-width:100%;border-radius:8px">`;if(AUD.test(m.m))return`<audio controls src="data:${m.m};base64,${b.data}"></audio>`;return`<a download="${esc(m.n||'datei')}" href="data:application/octet-stream;base64,${b.data}">${esc(m.n||'Datei')}</a>`}).join('');
  return`<li><b>${esc(alias(c.author))}</b> <small>▲${x.u-x.d} · ${new Date(c.ts).toLocaleString(LOC())}</small><br>${esc(c.body)}<br>${med}${c.url&&okUrl(c.url)?`<a href="${esc(c.url)}" rel="noopener noreferrer nofollow">${esc(c.url)}</a>`:''}${x.kids.length?'<ul>'+x.kids.map(k=>row(k,l+1)).join('')+'</ul>':''}</li>`};
 return`<!doctype html><html lang="${LANG}"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; media-src data:; frame-src about:"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(r.title)} · Outernet</title><style>body{font:16px/1.55 system-ui,sans-serif;max-width:42em;margin:2em auto;padding:0 1em;color:#101614}ul{padding-left:1.1em}li{margin:.8em 0}iframe{width:100%;height:260px;border:1px solid #ccc;border-radius:8px}.n{background:#eef6f4;border-radius:12px;padding:12px;font-size:.9rem}@media(prefers-color-scheme:dark){body{background:#0d1210;color:#eaf0ed}.n{background:#133a35}a{color:#7fd}}</style></head><body>
<p class="n"><b>${_('Outernet-Unterhaltung.')}</b> ${_('Du kannst diese Datei einfach lesen. Zum Mitmachen öffne sie über „Teilen → Datei öffnen“ in der Outernet-App (app.html). Alle Beiträge sind signiert und lassen sich prüfen.')}</p>
<h1>${esc(r.title)}</h1><p><small>${_('Start')} ${new Date(r.ts).toLocaleString(LOC())}${r.geo?' · '+_('Ort')+' '+esc(r.geo.gh):''} · ${_('Kürzel')} ${r.id.slice(0,8)}</small></p>${r.anchor.text?`<blockquote>${esc(r.anchor.text)}</blockquote>`:''}
${snapDoc(blob)?`<details><summary>${_('Seitenstand beim Start')}</summary><iframe sandbox="" srcdoc="${esc(snapDoc(blob))}"></iframe></details>`:''}<ul>${tree.map(x=>row(x,0)).join('')}</ul>
<script type="application/json" id="rn-data">${JSON.stringify({randnotiz:1,objects:objs}).replace(/</g,'\\u003c')}<\/script></body></html>`}
async function importFiles(files){let n=0,bad=0,why='';for(const f of files){let objs=[];if(f.size>4e7){bad++;continue}
 try{const txt=await f.text();if(/\.html?$/i.test(f.name)||/^\s*</.test(txt)){const el=new DOMParser().parseFromString(txt,'text/html').getElementById('rn-data');objs=JSON.parse(el.textContent).objects}else objs=JSON.parse(txt).objects}catch{bad++;continue}
 if(!Array.isArray(objs)){bad++;continue}const ix=intake();for(let k=0;k<objs.length&&!ix.why&&k<LIM.objs;k+=500)await importObjs(objs.slice(k,k+500),ix);n+=ix.n;bad+=ix.bad;if(ix.why)why=ix.why}
  if(n>0)earn(n);
  if(n>0)ledPut({...newSess('file','f'+Date.now().toString(36),n),have:n,tot:n,new:n,state:'done'});
 DB.index();toast(why?abuseMsg(why):n?`${n} Beiträge neu hinzugefügt`:bad?'Diese Datei ist keine gültige Outernet-Datei.':'Nichts Neues in dieser Datei.');return n}

/* ===== Ich ===== */
const VIA={qr:['QR-Codes','qr'],wlan:['WLAN','wifi'],file:['Datei','file']};
function awCard(){const e=earnSt(),ks=Object.keys(UNL);return`<section class="card"><h2>${ic('award',18)} ${_('Deine Auszeichnungen')}</h2><p class="mu sm">${_('Besondere Auszeichnungen sind kostenlos. Sie werden nach und nach freigeschaltet, je mehr du dich mit anderen austauschst.')}</p><div class="chips" style="flex-wrap:wrap;padding:0">${ks.map(k=>`<span class="tag ${awAvail(k)?'gold':''}">${ic('award',12)}${_(AW.premium[k][0])}: ${_('{n} übrig',{n:awAvail(k)})} · ${_('noch {n} Austausch',{n:awNext(k)})}</span>`).join('')}</div><p class="sm mu" style="margin-top:8px">${_('Gezählte Austausche: {n}',{n:e.n||0})}</p></section>`}
function dataCard(){const di=deferInfo(),att=Meta.get('att','all'),cap=String(Meta.get('cap',0)||0),q=String(Meta.get('imgq','m')),pull=Meta.get('pull',0);let bl=0,bn=0;for(const o of DB.mem.values())if(o.t==='blob'){bl+=o.data.length;bn++}
 const seg=(act,cur,opts)=>`<div class="seg" role="group" style="margin:6px 0 10px">${opts.map(([k,l])=>`<button data-act="${act}" data-k="${k}" aria-pressed="${String(cur)===k}">${l}</button>`).join('')}</div>`;
 const r8=new Map(roots().map(r=>[r.id,r]));
 const rows=[...di.th].slice(0,30).map(([t,z])=>{const r=r8.get(t);return r?`<li><div class="rt"><button class="lk" data-act="open" data-id="${r.id}">${esc(r.title)}</button><span class="sm mu">${_('{n} Anhänge zurückgestellt',{n:z[0]})} · ${fmtB(z[1])}</span></div></li>`:''}).join('');
 return`<section class="card" id="datac"><h2>${ic('clip',18)} ${_('Datenmenge')}</h2><p class="mu sm">${_('Bilder und Dateien können groß werden. Hier bestimmst du, was du empfängst. Was du jetzt nicht willst, bleibt beim Absender und kann später nachgeladen werden.')}</p>
 <p class="sm" style="margin:8px 0 0"><b>${_('Anhänge empfangen')}</b></p>${seg('att',att,[['all',_('Alle')],['small',_('Nur kleine')],['none',_('Keine')]])}
 <p class="sm" style="margin:0"><b>${_('Höchstens pro Austausch')}</b></p>${seg('cap',cap,[['0',_('Unbegrenzt')],['5','5 MB'],['20','20 MB'],['50','50 MB']])}
 <p class="sm" style="margin:0"><b>${_('Bildqualität beim Posten')}</b></p>${seg('imgq',q,[['h',_('Hoch')],['m',_('Mittel')],['l',_('Klein')]])}
 <p class="sm" style="margin:0"><b>${_('Screenshot-Dienst')}</b></p>${seg('shotsvc',Meta.get('shotSvc',''),[['off',_('Aus')],['microlink','Microlink'],['custom',_('Eigener')]])}${Meta.get('shotSvc','')==='custom'?`<div style="display:flex;gap:6px;margin:-4px 0 8px"><input type="url" id="shu" translate="no" placeholder="https://dienst.example/shot?url={url}" value="${esc(Meta.get('shotUrl',''))}" style="flex:1"><button class="btn sm" data-act="shoturl">${_('Speichern')}</button></div>`:''}<p class="sm mu" style="margin:-4px 0 8px">${_('Der Dienst bekommt die Adresse der Seite. Microlink ist gratis, aber auf wenige Screenshots pro Tag begrenzt.')}</p>
 <p class="sm mu">${_('Auf diesem Gerät: {n} Anhänge, {b}. Beim QR-Austausch werden Daten zusätzlich komprimiert.',{n:bn,b:fmtB(bl)})}</p>
 ${di.n?`<div class="rxo"><b>${_('{n} Anhänge ({b}) warten auf dich',{n:di.n,b:fmtB(di.b)})}</b></div><p class="sm mu">${pull?_('Beim nächsten Austausch werden sie geladen.'):_('Sie liegen bei anderen Nutzern. Beim nächsten Austausch kannst du sie holen.')}</p><div style="display:flex;gap:8px;flex-wrap:wrap">${pull?`<button class="btn" data-act="pullx">${_('Doch nicht laden')}</button>`:`<button class="btn pri" data-act="pull">${_('Beim nächsten Austausch laden')}</button>`}<button class="btn ghost" data-act="connect">${_('Jetzt verbinden')}</button><button class="btn ghost" data-act="dropdef">${_('Liste verwerfen')}</button></div>${rows?`<ul class="rxt">${rows}</ul>`:''}`:`<p class="sm"><b>${_('Es wartet nichts auf dich.')}</b></p>`}
 ${bn?`<button class="btn ghost sm" data-act="dropatt" style="margin-top:8px">${_('Anhänge von diesem Gerät entfernen')}</button>`:''}</section>`}
function rxCard(){const L=ledger(),qopen=L.filter(x=>x.state!=='done'&&x.via==='qr').reduce((a,x)=>a+Math.max(0,x.tot-x.have),0),g=gapMap(),open=Object.values(g).reduce((a,b)=>a+b,0),nth=Object.keys(g).length,r8=new Map();for(const r of roots())r8.set(r.id.slice(0,8),r);
 const row=x=>{const[vl,vi]=VIA[x.via]||VIA.wlan,pct=x.tot?Math.round(100*x.have/x.tot):100,dn=x.state==='done';
  const cells=x.via==='qr'&&x.tot<=400?`<div class="cells" role="img" aria-label="${_('{a} von {n} Teilen',{a:x.have,n:x.tot})}">${Array.from({length:x.tot},(e,i)=>`<i class="${(x.got||[]).includes(i)?'on':''}"></i>`).join('')}</div>`:'';
  const ths=Object.entries(x.th||{}).slice(0,60).map(([p,v])=>{const r=r8.get(p),t=v[0],h=v[1],c=Math.min(t,30);return`<li><div class="rt">${r?`<button class="lk" data-act="open" data-id="${r.id}">${esc(r.title)}</button>`:`<span class="mu sm">${_('Unterhaltung wird noch geladen')}</span>`}<span class="sm mu">${h}/${t}</span></div><div class="seg2" aria-hidden="true">${Array.from({length:c},(e,i)=>`<i class="${i<Math.round(c*h/t)?'on':''}"></i>`).join('')}</div></li>`}).join('');
  return`<details class="rxs"><summary><span class="rxi">${ic(vi,18)}</span><span style="flex:1"><b>${_(vl)}</b> <span class="sm mu">${ago(x.t1)}</span></span><span class="tag ${dn?'':'gold'}">${dn?_('abgeschlossen'):_('unvollständig')}</span></summary><div class="bar" style="margin-top:8px"><i style="width:${pct}%"></i></div>${(x.def||x.sk)?`<div class="sm" style="margin:4px 0">${ic('clip',12)} ${_('{n} Anhänge zurückgestellt',{n:(x.def||0)+(x.sk||0)})}</div>`:''}<div class="sm" style="margin:4px 0">${_('{a} von {n} Teilen',{a:x.have,n:x.tot})}</div>${cells}${ths?`<ul class="rxt">${ths}</ul>`:''}</details>`};
 return`<section class="card" id="rxc"><h2>${ic('dl',18)} ${_('Empfangen und Fortsetzen')}</h2><p class="mu sm">${_('Hier siehst du, was du von anderen schon bekommen hast. Unterbrochene Übertragungen gehen beim nächsten Austausch an der gleichen Stelle weiter.')}</p>
 ${open?`<div class="rxo"><b>${_('Noch offen: {p} Teile in {t} Unterhaltungen',{p:open,t:nth})}</b><button class="btn sm pri" data-act="connect">${_('Jetzt verbinden')}</button></div>`:qopen?`<div class="rxo"><b>${_('Noch offen: {p} Teile. Zeigt den Code nochmal, dann geht es weiter.',{p:qopen})}</b><button class="btn sm pri" data-act="connect">${_('Jetzt verbinden')}</button></div>`:`<p class="sm"><b>${_('Alles vollständig. Es fehlt nichts.')}</b></p>`}
 ${L.length?L.map(row).join(''):`<p class="sm mu">${_('Noch kein Austausch.')}</p>`}${L.length?`<button class="btn ghost sm" data-act="clrlog" style="margin-top:6px">${_('Protokoll löschen')}</button>`:''}</section>`}
function viewMe(){const th=Meta.get('theme','auto'),big=Meta.get('big',0);
 const met=Meta.get('met',0)||0;
 $('#main').innerHTML=`${topbar()}<h1>Ich</h1>
 <section class="card rbw"><h2>${ic('people',18)} Du gehörst dazu</h2><p class="mu sm">Outernet lebt von Menschen, die sich treffen und teilen. Das ist bei dir zusammengekommen.</p><div class="stats"><div><b>${roots().length}</b><span class="sm mu">Unterhaltungen</span></div><div><b>${subs().length}</b><span class="sm mu">Themenbereiche</span></div><div><b>${met}</b><span class="sm mu">Austausche mit Menschen</span></div></div></section>
 ${rxCard()}
 ${dataCard()}
 ${awCard()}
 <section class="card"><h2>${ic('user',18)} ${_('Deine Unterhaltungen')}</h2><p class="mu sm">In jeder Unterhaltung bekommst du einen anderen Tiernamen. Niemand kann sie verbinden. Du brauchst kein Konto.</p><p class="sm" style="margin:10px 0 0"><b>${_('Meine Verbindungen neben dem Namen zeigen')}</b></p><div class="seg" role="group" style="margin:6px 0">${[['1',_('Ja')],['0',_('Nein')]].map(([k,l])=>`<button data-act="cnshow" data-k="${k}" aria-pressed="${String(Meta.get('cnshow',1)?1:0)===k}">${l}</button>`).join('')}</div><p class="sm mu">${_('Zeigt grob, mit wie vielen Menschen du dich schon ausgetauscht hast (zum Beispiel 10 oder 3K). Die Zahl ist deine Angabe und wird nicht geprüft. Sie ist gerundet, damit man dich nicht wiedererkennt. Jetzt: {n}',{n:cnF(cnB(Meta.get('met',0)||0))})}</p><ul class="rxt" id="mythr"><li class="sm mu">…</li></ul></section>
 <section class="card"><h2>${ic('lock',18)} Sicherung</h2><p class="mu sm">Mit dem Sicherungs-Code kannst du auf einem neuen Gerät weitermachen und bleibst derselbe Tiername in deinen Unterhaltungen.</p><button class="btn" data-act="backup">Sicherungs-Code anzeigen</button> <button class="btn ghost" data-act="restore">Code eingeben</button></section>
 <section class="card"><h2>${ic('shield',18)} ${_('Schutz und Sicherheit')}</h2><p class="mu sm">${_('Jeder Beitrag ist signiert und kostet etwas Rechenzeit. Fremde Daten werden streng geprüft, Verdächtiges wird eingeklappt.')}</p>
  <p class="sm" style="margin:8px 0 4px"><b>${_('Prüfsumme dieser App')}</b></p><div class="code" style="font-size:.95rem" translate="no">${fmtFp(appFp())}</div><p class="mu sm">${_('Vergleiche sie mit der Prüfsumme der Person, von der du die App hast.')}</p>
  <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-act="chkapp">${_('Erhaltene App-Datei prüfen')}</button><input type="file" id="chkf" accept=".html,text/html" hidden></div>
  <p class="sm" style="margin:12px 0 4px">${_('Ausgeblendete Inhalte: {n}',{n:hidCount()})}</p>${hidCount()?`<button class="btn" data-act="unhide">${_('Alle wieder anzeigen')}</button>`:''}</section>
 <section class="card"><h2>Darstellung</h2><div class="seg" role="group" aria-label="Farbschema">${[['auto','Automatisch'],['light','Hell'],['dark','Dunkel']].map(([k,l])=>`<button data-act="theme" data-k="${k}" aria-pressed="${th===k}">${l}</button>`).join('')}</div>
 <label class="switch" style="margin-top:12px"><input type="checkbox" data-act="big" ${big?'checked':''}><span>Größere Schrift</span></label></section>
 <section class="card"><h2>Sprache</h2><div class="chips" role="group" aria-label="Sprache" translate="no" style="padding:0">${LANGS_OK.map(k=>`<button class="chip" data-act="lang" data-k="${k}" aria-pressed="${LANG===k}" lang="${k}">${({de:'Deutsch',en:'English',fr:'Français',zh:'中文',ja:'日本語',ru:'Русский'})[k]}</button>`).join('')}</div></section>
 <section class="card"><h2>Übersetzung</h2><p class="mu sm">Die Übersetzung läuft direkt auf deinem Gerät und bleibt privat. Du siehst bei jedem Text, dass er übersetzt wurde, und kannst jederzeit das Original lesen.</p>
 <label class="switch"><input type="checkbox" data-act="autotr" ${Meta.get('autotr',1)?'checked':''}><span>Fremde Sprachen automatisch übersetzen</span></label>
 <p class="sm mu" style="margin:10px 0 4px">${self.Translator?'Übersetzer im Browser: verfügbar (privat, auf dem Gerät)':'Übersetzer im Browser: nicht verfügbar'}</p>
 <details><summary class="sm">Eigener Übersetzungs-Server (optional)</summary><p class="mu sm">Adresse eines LibreTranslate-Servers. Achtung: Dann werden Texte an diesen Server gesendet.</p><input id="lturl" type="url" translate="no" placeholder="https://" value="${esc(Meta.get('ltUrl',''))}" data-act="lturl"></details></section>
 <section class="card"><h2>Hilfe</h2><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-act="help">Fragen und Antworten</button><button class="btn" data-act="tour">Einführung wiederholen</button><button class="btn" data-act="seed">Beispiele laden</button></div></section>
 <section class="card"><h2>Daten löschen</h2><p class="mu sm">Entfernt alles von diesem Gerät. Ohne Sicherungs-Code kommst du nicht mehr an deine Tiernamen.</p><button class="btn" style="color:var(--red)" data-act="wipe">Alles von diesem Gerät löschen</button></section>`;fillMine()}
async function fillMine(){const el=$('#mythr');if(!el)return;const out=[];for(const r of roots()){try{if((await rootKey(master(),r.salt)).pub===r.author)out.push(r)}catch{}}out.sort((a,b)=>b.ts-a.ts);const e2=$('#mythr');if(!e2)return;e2.innerHTML=out.length?out.map(r=>{const n=(DB.by.get(r.id)||[]).filter(e=>e.t==='comment').length;return`<li><div class="rt"><button class="lk" data-act="open" data-id="${r.id}">${esc(r.title)}</button><span class="sm mu">${n} · ${ago(r.ts)}</span></div></li>`}).join(''):`<li class="sm mu">${_('Du hast noch keine Unterhaltung gestartet.')}</li>`}
function hideSheet(id,tid,au){const root=!tid;
 sheet(`<div class="hd"><h2>${_('Ausblenden')}</h2><button class="btn ghost icon" data-a="x" aria-label="Schließen">${ic('x')}</button></div><p class="mu sm">${_('Das gilt nur auf deinem Gerät. Du kannst es unter „Ich“ rückgängig machen.')}</p>
 <div style="display:flex;flex-direction:column;gap:8px;margin-top:10px">${root?`<button class="btn pri" data-a="o">${_('Unterhaltung ausblenden')}</button>`:`<button class="btn pri" data-a="o">${_('Diesen Beitrag ausblenden')}</button><button class="btn" data-a="a">${_('Alles von dieser Person ausblenden')}</button>`}</div>`,d=>{d.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;if(b.dataset.a==='x')return closeSheet();
  if(b.dataset.a==='o')hideAdd('o',id);if(b.dataset.a==='a'&&au)hideAdd('a',au);closeSheet();toast(_('Ausgeblendet.'));if(root)location.hash='#/';else renderComments(DB.mem.get(tid))}})}
const appFp=()=>sha(SIG0),fmtFp=h=>h.slice(0,24).match(/.{4}/g).join(' ');
async function checkAppFile(f){if(!f)return;let ok=false,bad=false;try{if(f.size>4e7)throw 0;const d=new DOMParser().parseFromString(await f.text(),'text/html');ok=sha(staticSig(d))===appFp()}catch{bad=true}
 sheet(`<div class="hd"><h2>${_('App-Datei prüfen')}</h2><button class="btn ghost icon" data-a="x" aria-label="Schließen">${ic('x')}</button></div><p>${bad?_('Die Datei konnte nicht gelesen werden.'):ok?_('Die Datei ist identisch mit dieser App.'):_('Achtung: Die Datei weicht von dieser App ab. Öffne sie nicht, wenn du der Quelle nicht traust.')}</p>`,d=>{d.onclick=e=>{if(e.target.closest('[data-a=x]'))closeSheet()}})}
function backupSheet(){const m=hex(master());Meta.set('backupAsked',1);const g=m.match(/.{4}/g).join(' ');
 sheet(`<div class="hd"><h2>Dein Sicherungs-Code</h2><button class="btn ghost icon" data-a="x" aria-label="Schließen">${ic('x')}</button></div><p class="mu">Bewahre ihn sicher auf, zum Beispiel im Passwort-Manager oder ausgedruckt. Zeige ihn niemandem. Wer ihn hat, kann als du schreiben.</p><div class="code">${g}</div>
 <div style="display:flex;gap:8px;margin-top:12px"><button class="btn" data-a="c" style="flex:1">Kopieren</button><button class="btn" data-a="d" style="flex:1">Als Textdatei</button></div>`,d=>{d.onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;if(b.dataset.a==='x')closeSheet();if(b.dataset.a==='c'){try{await navigator.clipboard.writeText(g);toast('Kopiert')}catch{toast('Kopieren geht hier nicht. Markiere den Code mit dem Finger.')}}if(b.dataset.a==='d')dlFile('outernet-sicherung.txt',_('Outernet Sicherungs-Code (geheim halten):')+'\n'+g+'\n','text/plain')}})}
function restoreSheet(){sheet(`<div class="hd"><h2>Code eingeben</h2><button class="btn ghost icon" data-a="x" aria-label="Schließen">${ic('x')}</button></div><p class="mu">Gib den Sicherungs-Code ein (64 Zeichen). Leerzeichen sind egal.</p><textarea id="rc" rows="3" aria-label="Sicherungs-Code"></textarea><div class="err" id="rce" role="alert"></div><button class="btn pri" data-a="ok" style="width:100%;margin-top:10px">Wiederherstellen</button>`,d=>{d.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;if(b.dataset.a==='x')return closeSheet();const v=$('#rc',d).value.replace(/\s/g,'').toLowerCase();if(!/^[0-9a-f]{64}$/.test(v)){$('#rce',d).textContent='Das ist kein gültiger Code. Prüfe, ob alle 64 Zeichen da sind.';return}Meta.set('master',v);keyCache.clear();closeSheet();toast('Wiederhergestellt');route()}})}

/* ===== Verbinden: Austausch von Mensch zu Mensch per QR (ohne Server) ===== */
const B64={enc(u8){let s='';for(let i=0;i<u8.length;i+=8192)s+=String.fromCharCode.apply(null,u8.subarray(i,i+8192));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')},dec(t){t=t.replace(/-/g,'+').replace(/_/g,'/');t+='='.repeat((4-t.length%4)%4);const b=atob(t),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}};
const CS=typeof CompressionStream!=='undefined'&&typeof DecompressionStream!=='undefined';
async function pipeZ(u8,S,mode){const st=new Blob([u8]).stream().pipeThrough(new S(mode));return new Uint8Array(await new Response(st).arrayBuffer())}
const pack=async o=>{const u=new TextEncoder().encode(JSON.stringify(o));return CS?{z:1,u:await pipeZ(u,CompressionStream,'deflate-raw')}:{z:0,u}};
const unpack=async(u,z)=>{if(z&&!CS)throw 0;return JSON.parse(new TextDecoder().decode(z?await pipeZ(u,DecompressionStream,'deflate-raw'):u))};
const CHUNK=500,MAXF=300;
const FRG=380,QBLOB=120000;
/* ===== Datenmenge: Anhänge begrenzen und zurückstellen ===== */
const deferM=()=>{const d=Meta.get('defer',{});return d&&typeof d==='object'&&!Array.isArray(d)?d:{}};
const capB=()=>(+Meta.get('cap',0)||0)*1e6,SMALL=3e5;
function attOk(sz,used){if(Meta.get('pull',0))return true;const p=Meta.get('att','all');if(p==='none')return false;if(p==='small'&&sz>SMALL)return false;const c=capB();return!(c&&used+sz>c)}
function deferAdd(id,sz,via){const d=deferM();if(!d[id]&&Object.keys(d).length>=500)return;d[id]=[sz|0,Date.now(),via];Meta.set('defer',d)}
function deferDel(id){const d=deferM();if(d[id]){delete d[id];Meta.set('defer',d)}}
const fmtB=n=>n<1e5?Math.round(n/1e3)+' KB':(n/1e6).toFixed(1)+' MB';
function deferInfo(){const d=deferM(),own=new Map();for(const o of DB.mem.values()){const t=o.t==='root'?o.id:o.thread;if(o.snap)own.set(o.snap.hash,t);if(o.shot)own.set(o.shot.hash,t);for(const m of o.media||[])own.set(m.h,t)}
 let n=0,b=0;const th=new Map();for(const[id,v]of Object.entries(d)){if(DB.mem.has(id)){deferDel(id);continue}n++;b+=v[0]||0;const t=own.get(id);if(t){const z=th.get(t)||[0,0];z[0]++;z[1]+=v[0]||0;th.set(t,z)}}
 return{n,b,th}}
/* ===== Teilübertragung: Reihenfolge, Pakete, Protokoll, Fortsetzen ===== */
const th8=o=>o.t==='root'||o.t==='sub'?o.id.slice(0,8):o.t==='blob'?'':String(o.thread||'').slice(0,8);
const kOf=o=>({root:'r',sub:'s',comment:'c',vote:'v',award:'a',blob:'b'}[o.t]||'x')+':'+th8(o);
const KRE=/^[rscvabx]:[0-9a-f]{0,8}$/;
function orderedObjs(){const grp=new Map(),subsL=[],blobs=new Map();
 for(const o of DB.mem.values()){if(o.t==='blob'){blobs.set(o.id,o);continue}if(o.t==='sub'){subsL.push(o);continue}const k=o.t==='root'?o.id:o.thread;let g=grp.get(k);if(!g)grp.set(k,g={root:null,ev:[]});o.t==='root'?g.root=o:g.ev.push(o)}
 const rank={comment:0,award:1,vote:2},out=[...subsL.sort((a,b)=>b.ts-a.ts)],used=new Set();
 for(const g of[...grp.values()].sort((a,b)=>(b.root?b.root.ts:0)-(a.root?a.root.ts:0))){if(g.root)out.push(g.root);g.ev.sort((a,b)=>((rank[a.t]??3)-(rank[b.t]??3))||a.ts-b.ts);out.push(...g.ev);
  const refs=[];if(g.root&&g.root.snap)refs.push(g.root.snap.hash);if(g.root&&g.root.shot)refs.push(g.root.shot.hash);for(const e of g.ev)for(const m of e.media||[])refs.push(m.h);
  for(const h of refs){const b=blobs.get(h);if(b&&!used.has(h)){used.add(h);out.push(b)}}}
 for(const[h,b]of blobs)if(!used.has(h))out.push(b);
 return out}
const ledger=()=>{const l=Meta.get('rxlog',[]);return Array.isArray(l)?l:[]};
function ledPut(x){x.t1=Date.now();Meta.set('rxlog',[x,...ledger().filter(y=>y.sid!==x.sid)].slice(0,25))}
const ledGet=sid=>ledger().find(x=>x.sid===sid)||null;
const newSess=(via,sid,tot)=>({sid,via,t0:Date.now(),t1:Date.now(),tot:tot||0,have:0,new:0,got:[],th:{},state:'open'});
const gapMap=()=>{const g=Meta.get('gap',{});return g&&typeof g==='object'&&!Array.isArray(g)?g:{}};
const gapOf=id=>gapMap()[String(id).slice(0,8)]||0;
async function takeFrag(f,ix,allow){
 if(!f||typeof f.k!=='string'||!H64.test(f.k)||!Number.isInteger(f.i)||!Number.isInteger(f.n)||f.n<1||f.n>400||f.i<0||f.i>=f.n||typeof f.d!=='string'||f.d.length>13000)return 0;
 if(DB.mem.has(f.k)||(allow&&!allow(f.k)))return 0;
 if((ix.bytes+=f.d.length)>LIM.bytes){ix.why='gross';return 0}
 let r=await DB.pget(f.k);if(!r||r.n!==f.n||r.b!==(f.b?1:0)){if(!r&&(await DB.pkeys()).size>=100)return 0;r={id:f.k,n:f.n,b:f.b?1:0,p:{},ts:Date.now()}}
 if(r.p[f.i]!==undefined)return 0;r.p[f.i]=f.d;r.ts=Date.now();
 let s='';for(let i=0;i<r.n;i++){if(r.p[i]===undefined){await DB.pput(r);return{done:false,have:Object.keys(r.p).length,n:r.n}}s+=r.p[i]}
 await DB.pdel(f.k);let obj;try{obj=r.b?{t:'blob',id:f.k,data:s}:JSON.parse(s)}catch{ix.bad++;return 0}
 if(!obj||obj.id!==f.k){ix.bad++;return 0}
 await importObjs([obj],ix);return{done:true}}
async function makeStream(){const list=orderedObjs(),z=CS?1:0,BUD=560,enc=async a=>B64.enc((await pack(a)).u),pk=[];let cur=[],skipped=0;
 const flush=()=>{if(cur.length){pk.push({o:cur});cur=[]}};
 for(const o of list){const js=o.t==='blob'?o.data:JSON.stringify(o);if(o.t==='blob'&&js.length>QBLOB){skipped++;continue}
  const frag=()=>{flush();const n=Math.ceil(js.length/FRG);for(let i=0;i<n;i++)pk.push({k:o.id,i,n,b:o.t==='blob'?1:0,d:js.slice(i*FRG,(i+1)*FRG)})};
  if(o.t==='blob'||js.length>900){frag();continue}
  const t=[...cur,o];if((await enc({o:t})).length<=BUD){cur=t;continue}
  flush();if((await enc({o:[o]})).length<=BUD)cur=[o];else frag()}
 flush();if(!pk.length)pk.push({o:[]});const cut=Math.max(0,pk.length-MAXF),use=pk.slice(0,MAXF),sid=B64.enc(unhex(sha(list.map(o=>o.id).join(','))).slice(0,6)),frames=[];
 for(let i=0;i<use.length;i++)frames.push(`RN2|${sid}|${i}|${use.length}|${z}|${await enc(use[i])}`);
 return{frames,skipped,cut,count:list.length,sid}}
function drawQR(cv,text,px){const q=qrcode(0,'L');q.addData(text,'Byte');q.make();const n=q.getModuleCount(),sc=Math.max(2,Math.floor(px/(n+8))),z=(n+8)*sc;cv.width=cv.height=z;const c=cv.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,z,z);c.fillStyle='#000';for(let r=0;r<n;r++)for(let k=0;k<n;k++)if(q.isDark(r,k))c.fillRect((k+4)*sc,(r+4)*sc,sc,sc)}
const intake=()=>({n:0,t:0,bad:0,seen:0,drop:0,bytes:0,subs:0,auth:new Map(),why:''});
async function importObjs(objs,ix=intake()){const rk={sub:0,root:1,blob:2,comment:3,vote:4,award:5};
 if(!Array.isArray(objs)){ix.bad++;return ix}
 objs=objs.slice(0,2000).filter(o=>o&&typeof o==='object'&&!Array.isArray(o)).sort((a,b)=>(a.t in rk?rk[a.t]:5)-(b.t in rk?rk[b.t]:5));
 for(const o of objs){if(ix.why)break;
  if(typeof o.id!=='string'||DB.mem.has(o.id))continue;
  if(++ix.seen>LIM.objs){ix.why='viel';break}
  let sz=0;try{sz=o.t==='blob'?String(o.data||'').length:JSON.stringify(o).length}catch{}
  if((ix.bytes+=sz)>LIM.bytes){ix.why='gross';break}
  if(!await validate(o)){if(++ix.bad>LIM.bad)ix.why='ungueltig';continue}
  if(o.t!=='blob'){const c=(ix.auth.get(o.author)||0)+1;ix.auth.set(o.author,c);
   if(c>LIM.perAuthor||(o.t==='root'&&ix.t>=LIM.roots)||(o.t==='sub'&&ix.subs>=LIM.subs)){ix.drop++;continue}}
  await DB.put(o);ix.n++;if(o.t==='root')ix.t++;if(o.t==='sub')ix.subs++;if(o.t==='blob'){DB.pdel(o.id);deferDel(o.id)}}
 DB.index();await DB.prune();return ix}
const abuseMsg=why=>why==='ungueltig'?_('Austausch abgebrochen: Die andere Seite hat zu viel Ungültiges gesendet.'):_('Austausch abgebrochen: Die andere Seite hat zu viel auf einmal gesendet.');
const RX={sid:null,n:0,z:0,parts:new Map()},RXW={sid:null,n:0,z:0,parts:new Map()},RXS=new Map();
async function rxFrame(text,ui){const p=text.split('|');if(p.length<6)return{kind:'bad'};const sid=p[1],ii=+p[2],nn=+p[3],z=+p[4],data=p.slice(5).join('|');
 if(!/^[A-Za-z0-9_-]{4,16}$/.test(sid)||!(nn>=1&&nn<=1000&&ii>=0&&ii<nn)||data.length>2400)return{kind:'bad'};
 let q=RXS.get(sid);if(!q){const old=ledGet(sid),sess=old&&old.via==='qr'&&old.tot===nn?old:newSess('qr',sid,nn);q={ix:intake(),sess,got:new Set(sess.got||[]),skip:new Set(),dec:new Map(),used:0};RXS.set(sid,q)}
 if(q.sess.tot!==nn)return{kind:'bad'};
 if(q.got.has(ii)||q.skip.has(ii)){ui&&ui(q.got.size+q.skip.size,nn,q.sess.new);return{kind:'dup'}}
 let pk;try{pk=await unpack(B64.dec(data),z)}catch{return{kind:'bad'}}
 if(pk&&Array.isArray(pk.o))await importObjs(pk.o.slice(0,40),q.ix);
 else if(pk&&typeof pk.k==='string'){if(pk.b&&H64.test(pk.k)&&!DB.mem.has(pk.k)){let ok=q.dec.get(pk.k);if(ok===undefined){const sz=(pk.n||1)*FRG;ok=attOk(sz,q.used);q.dec.set(pk.k,ok);if(ok)q.used+=sz;else{deferAdd(pk.k,sz,'qr');q.sess.sk=(q.sess.sk||0)+1}}if(!ok){q.skip.add(ii);const s3=q.sess;s3.have=q.got.size;ledPut(s3);ui&&ui(q.got.size+q.skip.size,nn,s3.new);if(q.got.size+q.skip.size===nn){RXS.delete(sid);s3.state='done';ledPut(s3);earn(q.ix.n);return{kind:'data',n:q.ix.n,t:q.ix.t,bad:q.ix.bad}}return{kind:'frame',got:q.got.size,n:nn}}}await takeFrag(pk,q.ix)}
 else return{kind:'bad'};
 q.got.add(ii);const s2=q.sess;s2.got=[...q.got];s2.have=q.got.size;s2.new=(s2.new||0)+0;s2.new=Math.max(s2.new,q.ix.n);s2.state=q.got.size===nn?'done':'open';ledPut(s2);
 ui&&ui(q.got.size,nn,s2.new);
 if(q.got.size+q.skip.size===nn){RXS.delete(sid);earn(q.ix.n);return{kind:'data',n:q.ix.n,t:q.ix.t,bad:q.ix.bad}}
 return{kind:'frame',got:q.got.size,n:nn}}
function qrInterrupted(){let n=0,any=false;for(const[sid,q]of RXS){if(q.got.size&&q.got.size<q.sess.tot){q.sess.state='partial';ledPut(q.sess);n=Math.max(n,q.sess.new);any=true}}RXS.clear();if(any){DB.index();route();toast(_('Unterbrochen. {n} Beiträge sind schon da. Beim nächsten Austausch geht es an der gleichen Stelle weiter.',{n}))}}
async function handleCode(text,ui){
 if(text.startsWith('RN2|'))return rxFrame(text,ui);
 if(text.startsWith('RN1|')){const p=text.split('|');if(p.length<6)return{kind:'bad'};const sid=p[1],ii=+p[2],nn=+p[3],z=+p[4],data=p.slice(5).join('|');
  if(!(nn>=1&&nn<=5000&&ii>=0&&ii<nn))return{kind:'bad'};
  if(RX.sid!==sid){RX.sid=sid;RX.n=nn;RX.z=z;RX.parts=new Map()}
  if(!RX.parts.has(ii)){RX.parts.set(ii,data);ui&&ui(RX.parts.size,RX.n)}
  if(RX.parts.size===RX.n){const enc=[...Array(RX.n).keys()].map(k=>RX.parts.get(k)).join(''),zz=RX.z;RX.sid=null;RX.parts=new Map();
   try{const o=await unpack(B64.dec(enc),zz);return{kind:'data',...await importObjs(o.o)}}catch{return{kind:'bad'}}}
  return{kind:'frame'}}
 if(text.startsWith('RW1|')){const p=text.split('|');if(p.length<6)return{kind:'bad'};const sid=p[1],ii=+p[2],nn=+p[3],z=+p[4],data=p.slice(5).join('|');if(!(nn>=1&&nn<=50&&ii>=0&&ii<nn))return{kind:'bad'};
  if(RXW.sid!==sid){RXW.sid=sid;RXW.n=nn;RXW.z=z;RXW.parts=new Map()}
  if(!RXW.parts.has(ii)){RXW.parts.set(ii,data);ui&&ui(RXW.parts.size,RXW.n)}
  if(RXW.parts.size===RXW.n){const enc=[...Array(RXW.n).keys()].map(k=>RXW.parts.get(k)).join(''),zz=RXW.z;RXW.sid=null;RXW.parts=new Map();try{const o=await unpack(B64.dec(enc),zz);if(!o||typeof o.sdp!=='string'||o.sdp.length>20000)return{kind:'bad'};return{kind:'signal',sig:o}}catch{return{kind:'bad'}}}
  return{kind:'frame'}}
 if(text.startsWith('RNP1|')||text.includes('#/rnp/'))return{kind:'place',...await openPlace(text)};
 return null}
async function openPlace(text){let P=text.includes('#/rnp/')?text.split('#/rnp/')[1]:text.slice(5);let d;
 try{P=decodeURIComponent(P.trim());d=await unpack(B64.dec(P.slice(1)),+P[0]);if(typeof d.id!=='string')throw 0}catch{return{ok:false}}
 const r=await importObjs(d.o);
 return{ok:true,id:d.id,has:DB.mem.has(d.id),n:r.n}}
function placeResult(r){
 if(!r||!r.ok){toast(_('Dieser Code ist ungültig.'));return}
 if(r.has){toast(_(r.n?'Unterhaltung hinzugefügt':'Unterhaltung geöffnet'));location.hash='#/t/'+r.id;route();return}
 sheet(`<div class="hd"><h2>${_('Unterhaltung noch nicht hier')}</h2><button class="btn ghost icon" data-a="x" aria-label="${_('Schließen')}">${ic('x')}</button></div><p class="mu">${_('Die Unterhaltung ist noch nicht auf deinem Gerät. Verbinde dich mit jemandem, der sie hat.')}</p>
 <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri" data-a="c">${_('Verbinden')}</button></div><div class="sm mu" id="prs" role="status"></div>`,d=>{d.onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
  if(a==='x')closeSheet();else if(a==='c')connectSheet('both')}})}
function connectSheet(mode){const both=mode==='both';let stream=null,timer=null,idx=0,fps=4,stopped=false,fr=null,vid,facing=both?'user':'environment',mk=0;
 const d=sheet(`<div class="hd"><h2>${both?_('Verbinden'):_('Scannen')}</h2><button class="btn ghost icon" data-a="x" aria-label="${_('Schließen')}">${ic('x')}</button></div>${animHtml('idle')}
 ${both?`<div class="howto"><svg viewBox="0 0 260 120" aria-hidden="true"><g fill="none" stroke="var(--ac)" stroke-width="3"><rect x="14" y="14" width="84" height="96" rx="12" fill="var(--s1)"/><rect x="162" y="14" width="84" height="96" rx="12" fill="var(--s1)"/></g><circle cx="56" cy="24" r="3.5" fill="var(--ac)"/><circle cx="204" cy="24" r="3.5" fill="var(--ac)"/><g fill="var(--tx)"><rect x="36" y="42" width="40" height="40" rx="4" opacity=".85"/><rect x="184" y="42" width="40" height="40" rx="4" opacity=".85"/></g><g fill="#fff"><rect x="42" y="48" width="10" height="10"/><rect x="60" y="48" width="10" height="10"/><rect x="42" y="66" width="10" height="10"/><rect x="190" y="48" width="10" height="10"/><rect x="208" y="48" width="10" height="10"/><rect x="190" y="66" width="10" height="10"/></g><g stroke="var(--ac)" stroke-width="3" fill="none" stroke-linecap="round"><path d="M110 52h40M142 44l8 8-8 8"/><path d="M150 76h-40M118 68l-8 8 8 8"/></g></svg>
 <div><b>${_('Beide Handys gleichzeitig')}</b><ol><li>${_('Haltet die Bildschirme gegeneinander, etwa eine Handbreit Abstand.')}</li><li>${_('Dein Bildschirm zeigt deinen Code. Die Frontkamera oben liest den Code der anderen Person.')}</li><li>${_('Bewegt die Handys langsam, bis beide Balken voll sind.')}</li></ol></div></div>
 <div class="card" style="text-align:center"><div class="sm"><b>${_('1. Dein Bildschirm zeigt deinen Code')}</b></div><canvas id="qs" class="qrc" aria-label="QR"></canvas><div class="sm mu" id="qsi" role="status">…</div>
 <p class="sm mu" style="margin:6px 0 0">${_('Jedes Bild enthält fertige Beiträge. Bricht es ab, bleibt das Empfangene erhalten und geht später weiter.')}</p><div class="seg" role="group" aria-label="${_('Geschwindigkeit')}" style="margin-top:8px"><button data-a="slow">${_('Langsamer')}</button><button data-a="fast">${_('Schneller')}</button></div></div>`:''}
 <div class="card"><div class="sm"><b>${both?_('2. Die Frontkamera liest den Code des anderen'):_('Kamera')}</b></div><div class="vidw"><video id="qv" playsinline muted></video></div><div class="bar"><i id="qp" style="width:0%"></i></div><div class="sm mu" id="qvi" role="status"></div>
 <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button class="btn" data-a="cam">${_('Kamera starten')}</button><button class="btn ghost" data-a="flip">${_('Kamera wechseln')}</button><button class="btn ghost" data-a="img">${_('Foto eines Codes wählen')}</button><input type="file" id="qf" accept="image/*" hidden></div></div>
 <p class="mu sm">${_('Beim Verbinden werden nur öffentliche Beiträge ausgetauscht. Dein Sicherungs-Code bleibt privat.')}</p><button class="btn pri" data-a="x" style="width:100%">${_('Fertig')}</button>`,d=>{
  vid=$('#qv',d);const cleanup=()=>{stopped=true;clearTimeout(timer);if(stream)stream.getTracks().forEach(t=>t.stop());vid.srcObject=null};const onclose=()=>{if(d.open)return;d.removeEventListener('close',onclose);cleanup();qrInterrupted()};d.addEventListener('close',onclose);
  const info=t=>{$('#qvi',d).textContent=t};
  const onCode=async text=>{const r=await handleCode(text,(a,n,k)=>{$('#qp',d).style.width=(100*a/n)+'%';info(k?_('Empfangen: {a} von {n} · {k} neue Beiträge',{a,n,k}):_('Empfangen: {a} von {n}',{a,n}));navigator.vibrate&&navigator.vibrate(8);const an=$('.sa',d);if(an)an.dataset.s='transfer'});
   if(!r)return false;if(r.kind==='bad'){info(_('Dieser Code ist ungültig.'));return false}
   if(r.kind==='data'){cleanup();bumpMet(1);route();shareDone(_('Verbunden'),r.n?_('Fertig! {n} neue Beiträge in {t} Unterhaltungen.',{n:r.n,t:r.t}):_('Nichts Neues. Ihr habt schon dasselbe.'));return true}
   if(r.kind==='place'){cleanup();closeSheet();placeResult(r);return true}return false};
  const tick=async()=>{if(stopped)return;if(vid.readyState>=2&&vid.videoWidth){const sc=Math.min(1,720/vid.videoWidth),w=vid.videoWidth*sc|0,h=vid.videoHeight*sc|0;cv.width=w;cv.height=h;if(facing==='user'&&(mk++%3===2)){cx.save();cx.translate(w,0);cx.scale(-1,1);cx.drawImage(vid,0,0,w,h);cx.restore()}else cx.drawImage(vid,0,0,w,h);const c=jsQR(cx.getImageData(0,0,w,h).data,w,h,{inversionAttempts:'dontInvert'});if(c&&c.data&&await onCode(c.data))return}timer=setTimeout(tick,90)};
  const cv=document.createElement('canvas'),cx=cv.getContext('2d',{willReadFrequently:true});
  const startCam=async()=>{if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){info(_('Keine Kamera verfügbar. Nutze stattdessen eine Datei oder das Netzwerk.'));return}
   try{info(_('Kamera wird gestartet …'));if(stream)stream.getTracks().forEach(t=>t.stop());stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:facing},width:{ideal:1280}},audio:false});vid.srcObject=stream;vid.classList.toggle('front',facing==='user');await vid.play();info(facing==='user'?_('Frontkamera aktiv. Sie liest den Code der anderen Person.'):_('Rückkamera aktiv. Halte sie auf den Code.'));clearTimeout(timer);tick()}catch{info(_('Kein Zugriff auf die Kamera. Das kannst du in den Einstellungen erlauben.'))}};
  if(both)(async()=>{fr=await makeStream();const qs=$('#qs',d),qi=$('#qsi',d);const show=()=>{if(stopped||!qs.isConnected)return;drawQR(qs,fr.frames[idx],340);qi.textContent=_('Bild {a} von {n}',{a:idx+1,n:fr.frames.length})+(fr.skipped?' · '+_('{k} große Anhänge sind nicht dabei. Sie kommen per Datei oder Netzwerk.',{k:fr.skipped}):'')+(fr.cut?' · '+_('{k} Bilder passen nicht mehr in den Strom. Der Rest kommt per Netzwerk.',{k:fr.cut}):'');idx=(idx+1)%fr.frames.length;setTimeout(show,1000/fps)};show()})();
  d.onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;if(a==='x')closeSheet();else if(a==='slow')fps=Math.max(1,fps-1.5);else if(a==='fast')fps=Math.min(10,fps+1.5);else if(a==='cam')startCam();else if(a==='flip'){facing=facing==='user'?'environment':'user';startCam()}else if(a==='img')$('#qf',d).click()};
  $('#qf',d).onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const bm=await createImageBitmap(f);cv.width=bm.width;cv.height=bm.height;cx.drawImage(bm,0,0);const c=jsQR(cx.getImageData(0,0,cv.width,cv.height).data,cv.width,cv.height);if(!(c&&c.data&&await onCode(c.data)))info(_('Kein QR-Code im Bild gefunden.'))}catch{info(_('Kein QR-Code im Bild gefunden.'))}};
  startCam()})}
/* ===== Einmalige Hinweise: Aktualisierung nur durch Austausch ===== */
const TIPS={
 start:['Wichtig: Neues kommt von Mensch zu Mensch','Outernet hat keinen Server. Unterhaltungen werden nur aktualisiert, wenn du dich mit anderen austauschst: per QR-Code, WLAN oder Datei.'],
 thread:['Das ist dein Stand von heute','Du siehst den Stand deines letzten Austauschs. Neue Kommentare anderer kommen erst an, wenn du dich wieder mit jemandem austauschst: per QR-Code, WLAN oder Datei.'],
 post:['Dein Beitrag ist noch bei dir','Er liegt zuerst nur auf deinem Gerät. Andere sehen ihn erst, wenn du den Stand mit ihnen teilst: per QR-Code, WLAN oder Datei.'],
 share:['Je öfter du teilst, desto aktueller','Verbinde dich mit möglichst vielen verschiedenen Menschen. Jeder Austausch bringt dir neue Beiträge und gibt deine weiter.'],
 sticker:['Der Aufkleber zeigt nur den Anfang','Neue Beiträge zu diesem Ort bekommst du nur, wenn du dich mit anderen austauschst, die sie schon haben: per QR-Code, WLAN oder Datei.']};
function tip(key){const T=TIPS[key];if(!T||Meta.get('tip_'+key))return false;const d=$('#dlg');if(d.open||!$('#ob').hidden)return false;Meta.set('tip_'+key,1);
 sheet(`<div style="text-align:center"><span class="logo" style="width:56px;height:56px;border-radius:18px;display:inline-grid;place-items:center">${ic('share',28)}</span><h2 style="margin:12px 0 6px">${_(T[0])}</h2><p class="mu">${_(T[1])}</p></div>
 <div style="display:flex;gap:8px;margin-top:14px"><button class="btn" data-a="x" style="flex:1">${_('Verstanden')}</button><button class="btn pri" data-a="c" style="flex:1">${_('Jetzt verbinden')}</button></div>`,d=>{d.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;if(b.dataset.a==='c')connectSheet('both');else closeSheet()}});return true}
const tipLater=(k,ms)=>setTimeout(()=>tip(k),ms||900);
/* ===== App als Datei weitergeben ===== */
const bumpMet=n=>Meta.set('met',(Meta.get('met',0)||0)+n);
const SELF=(()=>{try{return '<!doctype html>\n'+document.documentElement.outerHTML}catch{return ''}})();
async function shareApp(){const f=new File([SELF],'outernet-app.html',{type:'text/html'});
 try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'Outernet'});shareDone(_('Bereit zum Teilen'),_('Datei gespeichert. Schicke sie weiter.'));return}}catch(e){if(e&&e.name==='AbortError')return}
 dlFile('outernet-app.html',SELF,'text/html');shareDone(_('Bereit zum Teilen'),_('Datei gespeichert. Schicke sie weiter.'))}
/* ===== Aufkleber im professionellen Design ===== */
const STK={teal:['#0f766e','#0a4f4a','#d9f1ee'],blue:['#2557d6','#173a96','#e0e9ff'],orange:['#d9531e','#8f3411','#ffe7dc'],ink:['#26322f','#0d1211','#e6ebe9']};
function qrMatrix(text){for(const e of['M','L']){try{const q=qrcode(0,e);q.addData(text,'Byte');q.make();return q}catch{}}throw 0}
const rr=(c,x,y,w,h,r)=>{c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()};
function wrapLines(c,t,mw,maxL){const sp=/\s/.test(t),tk=sp?(t.match(/\S+\s*|\s+/g)||[]):Array.from(t),L=[];let cur='';for(const w of tk){if(c.measureText(cur+w).width>mw&&cur){L.push(cur.trim());cur=w}else cur+=w}if(cur.trim())L.push(cur.trim());
 if(L.length>maxL){L.length=maxL;let l=L[maxL-1];while(c.measureText(l+'…').width>mw&&l.length>1)l=l.slice(0,-1);L[maxL-1]=l+'…'}return L}
function drawSticker(cv,o){const W=1200,H=1700,[m,dk,lt]=STK[o.color]||STK.teal,F='system-ui,"Segoe UI",Roboto,"Noto Sans","Noto Sans CJK SC","Hiragino Sans",sans-serif';cv.width=W;cv.height=H;const c=cv.getContext('2d');c.clearRect(0,0,W,H);
 c.save();rr(c,0,0,W,H,80);c.clip();c.fillStyle='#fff';c.fillRect(0,0,W,H);
 // Kopfband
 let g=c.createLinearGradient(0,0,W,330);g.addColorStop(0,m);g.addColorStop(1,dk);c.fillStyle=g;c.fillRect(0,0,W,330);
 c.fillStyle='rgba(255,255,255,.08)';c.beginPath();c.arc(1090,40,230,0,7);c.fill();c.beginPath();c.arc(1010,300,120,0,7);c.fill();
 rr(c,80,88,140,140,38);c.fillStyle='#fff';c.fill();
 c.fillStyle=m;rr(c,112,120,76,56,16);c.fill();c.beginPath();c.moveTo(126,170);c.lineTo(124,200);c.lineTo(156,174);c.closePath();c.fill();
 c.fillStyle='#fff';[132,150,168].forEach(x=>{c.beginPath();c.arc(x,148,6,0,7);c.fill()});
 c.fillStyle='#fff';c.textBaseline='alphabetic';c.textAlign='left';c.font='800 84px '+F;c.fillText('Outernet',250,170);
 c.globalAlpha=.88;c.font='500 38px '+F;c.fillText(o.tag,252,222);c.globalAlpha=1;
 // Überschrift
 c.textAlign='center';c.fillStyle=m;c.font='800 38px '+F;if('letterSpacing'in c)c.letterSpacing='6px';c.fillText(o.kicker.toUpperCase(),W/2,375);if('letterSpacing'in c)c.letterSpacing='0px';
 c.fillStyle='#0f1715';c.font='800 76px '+F;const L=wrapLines(c,o.title,1040,3),lh=90,bh=L.length*lh,y0=405+(270-bh)/2+68;L.forEach((l,i)=>c.fillText(l,W/2,y0+i*lh));
 // QR-Tafel
 const px=640,x=(W-px)/2,y=700;c.shadowColor='rgba(0,0,0,.18)';c.shadowBlur=40;c.shadowOffsetY=14;rr(c,x,y,px,px,48);c.fillStyle='#fff';c.fill();c.shadowColor='transparent';
 rr(c,x,y,px,px,48);c.lineWidth=14;c.strokeStyle=m;c.stroke();
 const q=qrMatrix(o.qr),n=q.getModuleCount(),mod=Math.floor((px-90)/n),sz=mod*n,qx=x+(px-sz)/2,qy=y+(px-sz)/2;c.fillStyle='#0b1210';
 for(let r=0;r<n;r++)for(let k=0;k<n;k++)if(q.isDark(r,k))c.fillRect(qx+k*mod,qy+r*mod,mod,mod);
 // Eckmarken
 c.strokeStyle=m;c.lineWidth=16;c.lineCap='round';const a=36,e=70;[[x-a,y-a,1,1],[x+px+a,y-a,-1,1],[x-a,y+px+a,1,-1],[x+px+a,y+px+a,-1,-1]].forEach(([cx,cy,sx,sy])=>{c.beginPath();c.moveTo(cx,cy+sy*e);c.lineTo(cx,cy);c.lineTo(cx+sx*e,cy);c.stroke()});
 c.fillStyle=m;c.font='800 52px '+F;c.fillText(o.scan,W/2,y+px+100);
 // Schritte
 [o.s1,o.s2,o.s3].forEach((t,i)=>{const cx=200+i*400,cy=1492;c.fillStyle=lt;c.beginPath();c.arc(cx,cy,30,0,7);c.fill();c.fillStyle=dk;c.font='800 34px '+F;c.fillText(String(i+1),cx,cy+12);c.fillStyle='#33403c';let fs=32;c.font='600 '+fs+'px '+F;while(c.measureText(t).width>370&&fs>20){fs-=2;c.font='600 '+fs+'px '+F}c.fillText(t,cx,cy+78)});
 // Fuß
 c.fillStyle=dk;c.fillRect(0,1610,W,90);c.fillStyle='#fff';c.font='600 32px '+F;c.fillText(o.foot,W/2,1666);
 c.restore();c.lineWidth=2;c.strokeStyle='#0002';rr(c,1,1,W-2,H-2,80);c.stroke()}
async function stickerSheet(id){const r=DB.mem.get(id);if(!r)return;let color=Meta.get('stickerColor','teal');
 sheet(`<div class="hd"><h2>${_('Aufkleber')}</h2><button class="btn ghost icon" data-a="x" aria-label="${_('Schließen')}">${ic('x')}</button></div>
 <canvas id="sq" class="stk" aria-label="QR"></canvas><div class="sm mu" id="sqi" role="status" style="text-align:center"></div>
 <div class="sw" role="group" aria-label="${_('Farbe')}">${Object.keys(STK).map(k=>`<button data-c="${k}" aria-label="${_('Farbe')}" aria-pressed="${k===color}" style="background:${STK[k][0]}"></button>`).join('')}</div>
 <div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0"><button class="btn pri" data-a="p">${_('Drucken')}</button><button class="btn" data-a="s">${_('Als Bild speichern')}</button></div>
 <details><summary class="sm">${_('Erweitert')}</summary><label class="f" for="sb">${_('Adresse der App (optional)')}</label><input type="url" id="sb" translate="no" placeholder="https://" value="${esc(Meta.get('stickerApp',''))}"><p class="mu sm">${_('Wenn du app.html im Netz bereitstellst, öffnet auch die normale Handy-Kamera den Aufkleber.')}</p></details>`,async d=>{
  const cv=$('#sq',d),info=$('#sqi',d);
  const build=async()=>{const app=$('#sb',d).value.trim();Meta.set('stickerApp',app);Meta.set('stickerColor',color);
   const mk=async full=>{const pl={id:r.id};if(full)pl.o=[r];else{pl.ti=r.title;pl.gh=r.geo?r.geo.gh:null}const pk=await pack(pl),P=pk.z+B64.enc(pk.u);return /^https?:\/\//.test(app)?app.replace(/#.*$/,'')+'#/rnp/'+P:'RNP1|'+P};
   let t=await mk(true),ref=false;if(t.length>1700){t=await mk(false);ref=true}
   try{drawSticker(cv,{qr:t,title:r.title,color,tag:_('Mit Menschen vor Ort reden'),kicker:_('Hier mitreden'),scan:_('Scannen & mitreden'),s1:_('App öffnen'),s2:_('Teilen → Orte'),s3:_('Code scannen'),foot:_('Kein Konto · Auch offline')+(r.geo?'  ·  '+r.geo.gh:'')+'  ·  '+new Date(r.ts).toLocaleDateString(LOC())});info.textContent=ref?_('Die Unterhaltung ist zu groß für einen Code. Der Code enthält nur den Verweis.'):''}catch{info.textContent=_('Der Code ist zu groß. Kürze die Adressen.')}};
  await build();d.oninput=()=>{clearTimeout(d._t);d._t=setTimeout(build,350)};
  d.onclick=e=>{const sw=e.target.closest('[data-c]');if(sw){color=sw.dataset.c;d.querySelectorAll('[data-c]').forEach(x=>x.setAttribute('aria-pressed',x===sw));build();return}
   const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;if(a==='x')closeSheet();
   else if(a==='s'){cv.toBlob(bl=>{const u=document.createElement('a');u.href=URL.createObjectURL(bl);u.download='outernet-aufkleber.png';document.body.append(u);u.click();u.remove();setTimeout(()=>URL.revokeObjectURL(u.href),4000)});closeSheet();tipLater('sticker',500)}
   else if(a==='p'){let pa=$('#printarea');if(!pa){pa=document.createElement('div');pa.id='printarea';document.body.append(pa)}pa.innerHTML=`<img alt="QR" src="${cv.toDataURL('image/png')}">`;setTimeout(()=>{print();tipLater('sticker',800)},200)}}})}
const shareOffline=rs=>`<section class="card" style="border-color:var(--ac)"><h2>${ic('share',18)} ${_('Von Mensch zu Mensch')}</h2><p class="mu sm">Tauscht automatisch alle Unterhaltungen aus, die einer von euch kennt, auch die, die ihr früher von anderen bekommen habt. So verbreiten sich Unterhaltungen von Mensch zu Mensch.</p>
 <div class="tiles"><button class="tile" data-act="connect"><span class="ti">${ic('qr',22)}</span><b>QR-Code</b><span class="sm">Handys gegeneinander halten</span></button><button class="tile" data-act="wifi"><span class="nb">Neu</span><span class="ti">${ic('wifi',22)}</span><b>WLAN</b><span class="sm">Im selben Netz, auch iPhone ↔ Android</span></button></div><div class="sm mu">Du hast ${rs} Unterhaltungen.</div></section>
 <section class="card"><h2>${ic('file',18)} Dateien</h2><p class="mu sm">Schicke Dateien per Messenger, Mail oder USB. Wer sie öffnet, kann sofort mitmachen, ohne Installation.</p>
  <div class="row"><button class="btn pri" data-act="dlapp">App als HTML herunterladen</button><button class="btn" data-act="shareapp">App als Datei teilen</button><button class="btn" data-act="expall">Alles als Datei speichern</button><button class="btn" data-act="imp">Datei auswählen</button></div><input type="file" id="imp" accept=".html,.json,application/json,text/html" multiple hidden>
  <p class="mu sm">Die HTML-Datei ist die ganze App. Du kannst sie speichern oder teilen.</p>
  <p class="mu sm">Eine einzelne Unterhaltung teilst du direkt in der Unterhaltung mit „Als Datei teilen“.</p></section>
 <details class="card"><summary>Zeitanker</summary><div class="sm"><b>Zeitanker</b> über ${rs} Unterhaltungen</div><div class="code" style="font-size:.8rem">${merkleRoot()}</div><p class="sm mu">Dieser Fingerabdruck lässt sich in einer Blockchain oder per OpenTimestamps veröffentlichen und beweist später, dass diese Unterhaltungen zu diesem Zeitpunkt existierten.</p><button class="btn sm" data-act="copy" data-v="${merkleRoot()}">Kopieren</button></details>`;
function sharePlaces(){const L=roots().sort((a,b)=>((b.anchor.kind==='place')-(a.anchor.kind==='place'))||b.ts-a.ts).slice(0,30);
 return`<section class="card"><h2>${ic('pin',18)} QR-Code für einen Ort</h2><p class="mu sm">Klebe den Code an eine Tür, Haltestelle oder Wand. Wer ihn scannt, bekommt die Unterhaltung direkt aufs Gerät, auch ohne Internet.</p>
 ${L.length?`<div class="sm"><b>Unterhaltung wählen</b></div>`+L.map(r=>`<button class="card thr" data-act="sticker" data-id="${r.id}" style="margin-top:8px"><h3 translate="no">${esc(r.title)}</h3></button>`).join(''):`<p class="mu">Starte zuerst eine Unterhaltung für einen Ort.</p>`}</section>
 <section class="card"><h2>${ic('globe',18)} Einen Aufkleber scannen</h2><p class="mu sm">Scanne den QR-Code an einem Ort, um mitzureden.</p><button class="btn pri" data-act="scan">Scannen</button></section>`}
/* ===== Von Webseiten aus: Lesezeichen und Browser-Plugin ===== */
const EXT=/*@EXT@*/;
const appAddr=()=>{const l=location.href.split('#')[0];const m=Meta.get('stickerApp','');return/^https?:\/\//.test(m)?m:l};
function bookmarklet(app){const body="(function(){var s=String(getSelection()||'').trim().slice(0,500);window.open("+JSON.stringify(app)+"+'#/link/'+encodeURIComponent(location.href)+(s?'/'+encodeURIComponent(s):''))})()";return'javascript:'+encodeURIComponent(body)}
function crc32(u){let t=crc32.t;if(!t){t=crc32.t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}}let c=-1;for(let i=0;i<u.length;i++)c=t[(c^u[i])&255]^(c>>>8);return(c^-1)>>>0}
function zipStore(files){const te=new TextEncoder(),loc=[],cen=[];let off=0;
 for(const[name,data]of files){const nb=te.encode(name),crc=crc32(data),h=new DataView(new ArrayBuffer(30));
  h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(8,0,true);h.setUint16(10,0,true);h.setUint16(12,23585,true);h.setUint32(14,crc,true);h.setUint32(18,data.length,true);h.setUint32(22,data.length,true);h.setUint16(26,nb.length,true);h.setUint16(28,0,true);
  loc.push(new Uint8Array(h.buffer),nb,data);
  const c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(10,0,true);c.setUint16(12,0,true);c.setUint16(14,23585,true);c.setUint32(16,crc,true);c.setUint32(20,data.length,true);c.setUint32(24,data.length,true);c.setUint16(28,nb.length,true);c.setUint32(42,off,true);
  cen.push(new Uint8Array(c.buffer),nb);off+=30+nb.length+data.length}
 const csz=cen.reduce((a,x)=>a+x.length,0),e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,csz,true);e.setUint32(16,off,true);
 return new Blob([...loc,...cen,new Uint8Array(e.buffer)],{type:'application/zip'})}
async function extIcon(px){const c=document.createElement('canvas');c.width=c.height=px;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,px,px);g.addColorStop(0,'#7c3aed');g.addColorStop(.55,'#db2777');g.addColorStop(1,'#f59e0b');x.fillStyle=g;x.beginPath();x.arc(px/2,px/2,px/2,0,7);x.fill();x.strokeStyle='#fff';x.lineWidth=px/9;x.lineCap='round';x.beginPath();x.arc(px/2,px/2,px*.24,0,7);x.stroke();
 return new Uint8Array(await new Promise(r=>c.toBlob(b=>b.arrayBuffer().then(a=>r(a)),'image/png')))}
const SAFARI_TXT="Outernet für Safari (Mac)\n\nSafari lädt Plugins nur, wenn sie als kleine Mac-App verpackt sind. Das braucht Apples kostenlose Entwicklerwerkzeuge (Xcode).\n\n1. Entpacke diese ZIP-Datei in einen Ordner, zum Beispiel ~/outernet-plugin\n2. Öffne das Terminal und gib ein:\n   xcrun safari-web-extension-converter ~/outernet-plugin --app-name Outernet\n3. Xcode öffnet sich. Drücke den Start-Knopf (Run).\n4. Öffne Safari > Einstellungen > Erweiterungen und schalte Outernet ein. Falls es fehlt: Entwickler > Unsignierte Erweiterungen erlauben.\n\nAuf dem iPhone und iPad geht das nicht ohne Apple-Entwicklerkonto. Nutze dort das Lesezeichen aus der App.\n";
async function extZip(target,app){const man=JSON.parse(EXT['manifest.json']);const png=[48,128];man.icons={48:'icon48.png',128:'icon128.png'};man.action.default_icon={48:'icon48.png'};
 if(target==='firefox'){man.background={scripts:['background.js']};man.browser_specific_settings={gecko:{id:'outernet@outernet.invalid',strict_min_version:'121.0',data_collection_permissions:{required:['none']}}}}
 else if(target==='safari'){man.background={scripts:['background.js'],persistent:false}}
 const te=new TextEncoder(),fill=t=>te.encode(t.replace(/__APP_URL__/g,app.replace(/\\/g,'\\\\').replace(/'/g,"\\'")));
 const files=[['manifest.json',te.encode(JSON.stringify(man,null,2))],['background.js',fill(EXT['background.js'])],['options.html',te.encode(EXT['options.html'])],['options.js',fill(EXT['options.js'])]];
 for(const px of png)files.push(['icon'+px+'.png',await extIcon(px)]);
 if(target==='safari')files.push(['SAFARI.txt',te.encode(SAFARI_TXT)]);
 return zipStore(files)}
function browserKind(){const u=navigator.userAgent;return/Firefox\//.test(u)?'firefox':/Edg\/|OPR\/|Chrome\/|CriOS\//.test(u)?'chrome':/Safari\//.test(u)?'safari':''}
const isMobileUA=()=>/Android|iPhone|iPad|iPod/.test(navigator.userAgent);
function sharePlugin(){const app=appAddr(),file=/^file:/.test(app),bk=browserKind(),mob=isMobileUA(),bm=bookmarklet(app);
 const STEPS={chrome:[_('Entpacke die ZIP-Datei in einen Ordner.'),_('Öffne chrome://extensions (in Edge: edge://extensions) und schalte „Entwicklermodus“ ein.'),_('Wähle „Entpackte Erweiterung laden“ und den Ordner.')],
  firefox:[_('Öffne about:debugging#/runtime/this-firefox.'),_('Wähle „Temporäres Add-on laden“ und dann die ZIP-Datei. Nicht entpacken.'),_('Das gilt, bis Firefox neu startet. Dauerhaft geht es nur mit einer kostenlosen Signatur von addons.mozilla.org (Anleitung in docs/EXTENSION.md).')],
  safari:[_('Safari verlangt Apples Entwicklerwerkzeuge (Xcode, nur Mac). Die ZIP enthält die Anleitung SAFARI.txt mit zwei Befehlen.'),_('Auf iPhone und iPad geht das nicht. Nutze dort das Lesezeichen.')]};
 const NAMES={chrome:'Chrome, Edge, Brave',firefox:'Firefox',safari:'Safari'};
 const row=k=>`<details class="plg"${bk===k&&!mob?' open':''}><summary><b>${NAMES[k]}</b>${bk===k?` <span class="tag gold">${_('Dein Browser')}</span>`:''}</summary><ol class="mu sm" style="padding-left:1.2em">${STEPS[k].map(x=>`<li>${x}</li>`).join('')}</ol><button class="btn pri sm" data-act="plugdl" data-k="${k}">${ic('dl',16)} ${_('Plugin laden')}</button></details>`;
 return`<section class="card"><h2>${ic('globe',18)} ${_('Von Webseiten aus mitreden')}</h2><p class="mu sm">${_('Du bist auf einer Seite und willst darüber sprechen? Mit einem Knopf im Browser öffnest du die passende Unterhaltung. Markierter Text wird zur Textstelle.')}</p></section>
 <section class="card"><h2>${ic('bookmark',18)} ${_('Lesezeichen')} <span class="tag gold">${_('Für alle Browser')}</span></h2><p class="mu sm">${_('Ohne Installation, auch auf dem Handy. Zieh den Knopf in die Lesezeichenleiste. Auf einer Seite tippst du ihn an, und die Unterhaltung öffnet sich.')}</p>
 <p><a class="btn pri bm" href="${esc(bm)}" data-act="bmhint" draggable="true" translate="no">Outernet</a></p>
 <p class="mu sm">${_('Auf dem Handy: Lege irgendein Lesezeichen an, bearbeite es und füge diesen Code als Adresse ein.')}</p><button class="btn sm" data-act="copy" data-v="${esc(bm)}">${_('Code kopieren')}</button>
 ${file?`<p class="sm" style="margin-top:8px"><b>${_('Achtung:')}</b> ${_('Diese App läuft als Datei. Browser verbieten Webseiten, Dateien zu öffnen. Das Lesezeichen geht nur, wenn die App unter einer Webadresse liegt (zum Beispiel vom Vermittler oder von deinem Webspace). Das Plugin unten geht auch mit einer Datei.')}</p>`:''}</section>
 <section class="card"><h2>${ic('globe',18)} ${_('Browser-Plugin')} <span class="tag">${_('Computer')}</span></h2><p class="mu sm">${_('Rechtsklick auf Seite, Link oder markierten Text, dann „Mit Outernet besprechen“. Die Adresse dieser App ist schon eingetragen.')}</p>
 ${mob?`<p class="sm"><b>${_('Auf dem Handy gibt es für Plugins kaum Unterstützung. Nimm das Lesezeichen.')}</b></p><details><summary class="sm">${_('Trotzdem Plugin laden')}</summary>${['chrome','firefox','safari'].map(row).join('')}</details>`:['chrome','firefox','safari'].map(row).join('')}
 <p class="mu sm" style="margin-top:8px">${_('Das Plugin ist nur ein Startknopf. Es sendet nichts, lädt nichts und kennt deine Unterhaltungen nicht.')}</p></section>
 <section class="card"><h2>${ic('link',18)} ${_('Ganz ohne Zusatz')}</h2><p class="mu sm">${_('Kopiere die Adresse der Seite. Tippe in der App auf +, wähle „Webseite“ und füge sie ein.')}</p></section>`}
function viewShare(){const rs=roots().length,area=S.shareArea||'offline';
 $('#main').innerHTML=`${topbar()}<h1>Teilen &amp; Sichern</h1><p class="mu" style="margin:0 0 12px">Gib Unterhaltungen von Mensch zu Mensch weiter, ganz ohne Firma dazwischen.</p>
 <div class="seg" role="group" aria-label="Bereich" style="margin-bottom:12px">${[['offline','Offline teilen'],['places','Orte (QR)'],['plugin','Webseiten']].map(([k,l])=>`<button data-act="area" data-k="${k}" aria-pressed="${area===k}">${l}</button>`).join('')}</div>
 ${area==='offline'?shareOffline(rs):area==='places'?sharePlaces():sharePlugin()}`}

/* ===== Animation beim Teilen ===== */
let _an=0;
const animHtml=(st,hub)=>{const k='a'+(++_an),sp=[0,45,90,135,180,225,270,315].map(a=>`<line class="sp" x1="150" y1="20" x2="150" y2="11" transform="rotate(${a} 150 60)"/>`).join('');
 const pk=(p,dir)=>[0,.6,1.2].map(i=>`<circle r="4.5" fill="var(--ac)"><animateMotion dur="1.8s" begin="${i+(dir?.3:0)}s" repeatCount="indefinite"><mpath href="#${k}${p}"/></animateMotion></circle>`).join('');
 const ph=x=>`<rect class="ph" x="${x}" y="28" width="44" height="64" rx="10"/><rect class="sc" x="${x+5}" y="36" width="34" height="42" rx="5"/><path class="ln" d="M${x+10} 46h24M${x+10} 54h16M${x+10} 62h20"/><circle class="dot" cx="${x+22}" cy="85" r="2.2"/>`;
 const wv=(x,dir)=>[0,1,2].map(i=>`<path class="wv w${i}" d="M${x+dir*(4+i*7)} ${60-(8+i*6)}a${10+i*6} ${10+i*6} 0 0 ${dir>0?1:0} 0 ${16+i*12}"/>`).join('');
 return`<div class="sa" data-s="${st}"${hub?' data-hub="1"':''} aria-hidden="true"><svg viewBox="0 0 300 120"><defs><path id="${k}p1" d="M90 50C125 24 175 24 210 50"/><path id="${k}p2" d="M210 70C175 96 125 96 90 70"/></defs>
 <g><circle class="r r1" cx="52" cy="60" r="22"/><circle class="r r2" cx="52" cy="60" r="22"/><circle class="r r3" cx="248" cy="60" r="22"/><circle class="r r4" cx="248" cy="60" r="22"/></g>
 <use href="#${k}p1" class="lane"/><use href="#${k}p2" class="lane"/><g class="pk">${pk('p1',0)}${pk('p2',1)}</g>${ph(30)}${ph(226)}
 <g class="wvs">${wv(76,1)}${wv(224,-1)}</g>
 <g class="hub"><circle class="hb" cx="150" cy="60" r="27"/><circle class="pgb" cx="150" cy="60" r="23" pathLength="100"/><circle class="pg" cx="150" cy="60" r="23" pathLength="100"/><path class="rdr" d="M150 33a27 27 0 0 1 27 27"/><text class="cn" x="150" y="64.5" text-anchor="middle"></text></g>
 <g class="ok"><circle class="okc" cx="150" cy="60" r="27"/><path class="chk" d="M137 61l9 9 17-19"/>${sp}</g></svg></div>`};
function shareDone(title,text){sheet(`<div style="text-align:center">${animHtml('done')}<h2 style="margin:6px 0">${esc(title)}</h2><p class="mu">${esc(text)}</p><button class="btn pri" data-a="x" style="width:100%;margin-top:12px">${_('Fertig')}</button></div>`,d=>{d.onclick=e=>{if(e.target.closest('[data-a=x]'))closeSheet()}})}
/* ===== Teilen und Verbinden über WLAN (WebRTC, ohne Server) ===== */
async function framesFor(obj,prefix){const pk=await pack(obj),enc=B64.enc(pk.u),n=Math.max(1,Math.ceil(enc.length/CHUNK)),sid=B64.enc(crypto.getRandomValues(new Uint8Array(4))),f=[];
 for(let i=0;i<n;i++)f.push(`${prefix}|${sid}|${i}|${n}|${pk.z}|${enc.slice(i*CHUNK,(i+1)*CHUNK)}`);return{frames:f,text:'RWT|'+pk.z+enc}}
const parseSignalText=async t=>{t=(t||'').replace(/\s+/g,'');if(!t.startsWith('RWT|'))throw 0;const o=await unpack(B64.dec(t.slice(5)),+t[4]);if(!o||typeof o.sdp!=='string'||o.sdp.length>20000)throw 0;return o};
const iceDone=pc=>new Promise(res=>{if(pc.iceGatheringState==='complete')return res();const f=()=>{if(pc.iceGatheringState==='complete'){pc.removeEventListener('icegatheringstatechange',f);res()}};pc.addEventListener('icegatheringstatechange',f);setTimeout(res,3500)});
function runSync(dc,prog,via='wlan'){return new Promise((resolve,reject)=>{
 const st={n:0,t:0,bad:0,total:0,recv:0,why:'',sid:''},ix=intake(),asked=new Map(),credited=new Set(),sess=newSess(via,'w'+hex(crypto.getRandomValues(new Uint8Array(5))),0),gap=gapMap();st.sid=sess.sid;
 let gotSent=false,sentOut=false,fin=false,remote=[],rmeta=[],rsz=[],q=Promise.resolve(),msgs=0,lastSave=0;
 const chunks=(a,n)=>{const r=[];for(let i=0;i<a.length;i+=n)r.push(a.slice(i,i+n));return r.length?r:[[]]};
 const save=force=>{const now=Date.now();if(!force&&now-lastSave<400)return;lastSave=now;sess.new=ix.n;ledPut(sess);Meta.set('gap',gap)};
 const finish=state=>{sess.state=state;if(remote.length&&Meta.get('pull',0))Meta.set('pull',0);if(ix.n>0&&state!=='aborted')earn(ix.n);save(true);DB.index()};
 const send=async o=>{const m=JSON.stringify(o);while(dc.bufferedAmount>1e6)await new Promise(r=>setTimeout(r,40));dc.send(m)};
 const check=()=>{if(!fin&&gotSent&&sentOut){fin=true;finish(sess.have>=sess.tot?'done':'partial');send({t:'bye'}).catch(()=>{});setTimeout(()=>resolve(st),200)}};
 const stop=why=>{if(fin)return;fin=true;st.why=why;finish('partial');try{dc.close()}catch{}setTimeout(()=>resolve(st),50)};
 const credit=id=>{if(credited.has(id)||!asked.has(id))return;credited.add(id);sess.have++;const p=(asked.get(id)||'').slice(2);if(p){const t=sess.th[p];if(t)t[1]++;if(gap[p]){gap[p]--;if(gap[p]<=0)delete gap[p]}}};
 const upd=()=>{st.n=ix.n;st.t=ix.t;st.bad=ix.bad;st.recv=sess.have;prog(sess.have,st.total);save();if(ix.why)stop(ix.why)};
 const FR=12000;
 const serve=async ids=>{let batch=[],size=0;const fl=async()=>{if(batch.length){await send({t:'obj',o:batch});batch=[];size=0}};
  for(const e of ids){const id=Array.isArray(e)?e[0]:e,from=Array.isArray(e)&&Number.isInteger(e[1])&&e[1]>0?e[1]:0;if(typeof id!=='string')continue;const o=DB.mem.get(id);if(!o)continue;const js=o.t==='blob'?o.data:JSON.stringify(o);
   if(o.t==='blob'||js.length>FR){await fl();const n=Math.ceil(js.length/FR);for(let i=Math.min(from,n);i<n;i++)await send({t:'frag',k:id,i,n,b:o.t==='blob'?1:0,d:js.slice(i*FR,(i+1)*FR)});continue}
   if(size+js.length>16000)await fl();batch.push(o);size+=js.length}
  await fl()};
 const handle=async ev=>{if(fin)return;if(typeof ev.data!=='string'||ev.data.length>4e6||++msgs>20000)return stop('viel');let m;try{m=JSON.parse(ev.data)}catch{return}if(!m||typeof m.t!=='string')return;
  if(m.t==='inv'&&Array.isArray(m.ids)){if(remote.length<20000){const ks=Array.isArray(m.k)?m.k:[],zs=Array.isArray(m.z)?m.z:[];m.ids.slice(0,400).forEach((x,i)=>{if(typeof x==='string'&&x.length===64){remote.push(x);rmeta.push(typeof ks[i]==='string'&&KRE.test(ks[i])?ks[i]:'x:');rsz.push(Number.isInteger(zs[i])&&zs[i]>=0&&zs[i]<4e6?zs[i]:0)}})}
   if(m.last){const miss=[];let used=0;for(let i=0;i<remote.length&&miss.length<LIM.objs;i++)if(!DB.mem.has(remote[i])&&!asked.has(remote[i])){if(rmeta[i]==='b:'&&rsz[i]){if(!attOk(rsz[i],used)){deferAdd(remote[i],rsz[i],via);sess.def=(sess.def||0)+1;continue}used+=rsz[i]}asked.set(remote[i],rmeta[i]);miss.push(remote[i])}
    st.total=miss.length;sess.tot=miss.length;const cnt={};for(const id of miss){const p=asked.get(id).slice(2);if(p)cnt[p]=(cnt[p]||0)+1}
    const rp=new Set(rmeta.map(x=>x.slice(2)));for(const p in gap)if(rp.has(p)&&!cnt[p])delete gap[p];
    let nth=0;for(const p in cnt){if(nth++<200)sess.th[p]=[cnt[p],0];gap[p]=cnt[p]}
    save(true);prog(0,st.total);
    const pk=await DB.pkeys(),wants=[];for(const id of miss){let from=0;if(pk.has(id)){const r=await DB.pget(id);if(r)while(r.p[from]!==undefined)from++}wants.push(from?[id,from]:id)}
    const ch=chunks(wants,200);for(let i=0;i<ch.length;i++)await send({t:'want',ids:ch[i],last:i===ch.length-1})}}
  else if(m.t==='want'&&Array.isArray(m.ids)){await serve(m.ids.slice(0,400));if(m.last){await send({t:'sent'});sentOut=true;check()}}
  else if(m.t==='obj'&&Array.isArray(m.o)){const all=m.o.slice(0,200),ok=all.filter(o=>o&&typeof o==='object'&&asked.has(o.id));ix.bad+=all.length-ok.length;if(ix.bad>LIM.bad)return stop('ungueltig');
   await importObjs(ok,ix);for(const o of ok)if(DB.mem.has(o.id))credit(o.id);upd()}
  else if(m.t==='frag'){const r=await takeFrag(m,ix,id=>asked.has(id));if(r&&r.done&&DB.mem.has(m.k))credit(m.k);upd()}
  else if(m.t==='sent'){gotSent=true;check()}};
 dc.onmessage=ev=>{q=q.then(()=>handle(ev)).catch(e=>console.warn("rs",e&&e.message))};
 dc.onclose=()=>{q=q.then(()=>{if(!fin){fin=true;finish('partial');reject(new Error('closed'))}})};
 ledPut(sess);
 (async()=>{await new Promise(r=>setTimeout(r,350));const L=orderedObjs(),ch=chunks(L,300);for(let i=0;i<ch.length;i++)await send({t:'inv',ids:ch[i].map(o=>o.id),k:ch[i].map(kOf),z:ch[i].map(o=>o.t==='blob'?o.data.length:0),last:i===ch.length-1})})().catch(e=>{if(!fin){fin=true;finish('partial');reject(e)}})})}
function wifiSheet(){
 if(!self.RTCPeerConnection){toast(_('Dein Browser unterstützt keine WLAN-Verbindung.'));return}
 sheet(`<div class="hd"><h2>${_('WLAN-Verbindung')}</h2><button class="btn ghost icon" data-a="x" aria-label="${_('Schließen')}">${ic('x')}</button></div>${animHtml('idle',1)}<div id="wb"></div>`,d=>{
  let pc=null,dc=null,cam=null,stopped=false,role='',scanT=null,frT=null,fidx=0,synced=false,tmo=null,useCam=false,stage='',fr=null;
  const B=()=>$('#wb',d),anim=s=>{const e=$('.sa',d);if(e)e.dataset.s=s},st=t=>{const e=$('#wst',d);if(e)e.textContent=t};
  const prog=(a,n)=>{const e=$('.sa',d);if(!e)return;const p=n?Math.max(3,Math.min(100,100*a/n)):100;e.style.setProperty('--p',p);const c=$('.cn',e);if(c)c.textContent=n?Math.round(p)+'%':''};
  const stopCam=()=>{if(cam){cam.getTracks().forEach(t=>t.stop());cam=null}};
  const cleanup=()=>{stopped=true;clearTimeout(scanT);clearTimeout(frT);clearTimeout(tmo);stopCam();nbStop();try{dc&&dc.close()}catch{}try{pc&&pc.close()}catch{}};
  const onclose=()=>{if(d.open)return;d.removeEventListener('close',onclose);cleanup()};d.addEventListener('close',onclose);
  const choose=()=>{cleanup();stopped=false;role='';stage='';fr=null;synced=false;anim('idle');prog(0,1);B().innerHTML=`<div class="howto" style="flex-direction:column;align-items:stretch;gap:6px"><div class="sm">${_('Beide Handys müssen im selben WLAN sein, oder ein Handy teilt seinen Hotspot. Das funktioniert auch zwischen iPhone und Android.')}</div></div>
   <button class="tile" data-a="near" style="width:100%;margin:10px 0"><span class="ti">${ic('wifi',22)}</span><b>${_('In der Nähe suchen')}</b><span class="sm">${_('Handys im selben WLAN finden sich selbst. Jeder bestätigt den Austausch per Knopf.')}</span></button>
   <details style="margin-top:12px"><summary class="sm">${_('Oder ohne Vermittler, mit Code')}</summary><p class="sm mu">${_('Ihr tauscht zwei kurze Codes aus, zum Beispiel per Messenger. Ein QR-Code ist nicht nötig.')}</p><div class="tiles"><button class="tile" data-a="host"><b>${_('Einladen')}</b><span class="sm">${_('Ich schicke zuerst den Code')}</span></button><button class="tile" data-a="join"><b>${_('Beitreten')}</b><span class="sm">${_('Ich habe einen Code bekommen')}</span></button></div></details>`};
  const codeBox=(title,id)=>`<div class="card"><div class="sm"><b>${title}</b></div><textarea id="${id}" rows="3" readonly translate="no" aria-label="${_('Mein Code')}">${_('Code wird erstellt …')}</textarea><div class="row"><button class="btn sm" data-a="cp">${_('Kopieren')}</button>${navigator.share?`<button class="btn sm" data-a="shr">${_('Code teilen')}</button>`:''}</div></div>`;
  const pasteBox=title=>`<div class="card"><div class="sm"><b>${title}</b></div><textarea id="wpaste" rows="3" translate="no" placeholder="RWT|…" aria-label="${_('Code des anderen einfügen')}"></textarea><div class="row"><button class="btn sm" data-a="pst">${_('Aus Zwischenablage einfügen')}</button><button class="btn sm pri" data-a="pp">${_('Übernehmen')}</button></div><div class="sm mu" id="wst" role="status"></div></div>`;
  const qrBox=()=>`<details id="wqr" style="margin-top:10px"><summary class="sm">${_('Lieber per QR-Code?')}</summary><div id="wqb"></div></details>`;
  const openCam=async()=>{try{cam=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'user'},width:{ideal:1280}},audio:false});return true}catch{cam=null;return false}};
  const startScan=async onText=>{const vid=$('#wv',d);if(!vid)return;if(!cam&&!(await openCam())){st(_('Kein Zugriff auf die Kamera. Das kannst du in den Einstellungen erlauben.'));return}
   vid.srcObject=cam;vid.classList.add('front');try{await vid.play()}catch{}
   const cv=document.createElement('canvas'),cx=cv.getContext('2d',{willReadFrequently:true});let k=0;
   const tick=async()=>{if(stopped||!vid.isConnected)return;if(vid.readyState>=2&&vid.videoWidth){const sc=Math.min(1,720/vid.videoWidth),w=vid.videoWidth*sc|0,h=vid.videoHeight*sc|0;cv.width=w;cv.height=h;if(k++%3===2){cx.save();cx.translate(w,0);cx.scale(-1,1);cx.drawImage(vid,0,0,w,h);cx.restore()}else cx.drawImage(vid,0,0,w,h);
     const c=jsQR(cx.getImageData(0,0,w,h).data,w,h,{inversionAttempts:'dontInvert'});if(c&&c.data&&await onText(c.data)===true)return}scanT=setTimeout(tick,90)};tick()};
  const showFrames=f=>{const cv=$('#wq',d),inf=$('#wqi',d);fidx=0;clearTimeout(frT);const g=()=>{if(stopped||!cv||!cv.isConnected)return;const i=fidx%f.frames.length;drawQR(cv,f.frames[i],340);inf.textContent=f.frames.length>1?_('Bild {a} von {n}',{a:i+1,n:f.frames.length}):'';fidx++;if(f.frames.length>1)frT=setTimeout(g,600)};g()};
  const qrCam=()=>`<div class="card"><div class="vidw"><video id="wv" playsinline muted></video></div></div>`;
  const qrShow=()=>`<div class="card" style="text-align:center"><canvas id="wq" class="qrc" aria-label="QR"></canvas><div class="sm mu" id="wqi"></div></div>`;
  const renderQr=()=>{const det=$('#wqr',d),box=$('#wqb',d);if(!det||!det.open||!box||stopped)return;clearTimeout(scanT);clearTimeout(frT);
   if(stage==='offer'){box.innerHTML=qrShow()+qrCam();if(fr)showFrames(fr);startScan(onText)}
   else if(stage==='wait-offer'){box.innerHTML=qrCam();startScan(onText)}
   else if(stage==='answer'){box.innerHTML=qrShow();if(fr)showFrames(fr)}
   else box.innerHTML=''};
  const mkPC=()=>{const p=new RTCPeerConnection({iceServers:[]});p.onconnectionstatechange=()=>{if(!synced&&!stopped&&(p.connectionState==='failed'))fail()};return p};
  const armTimeout=()=>{clearTimeout(tmo);tmo=setTimeout(()=>{if(!synced&&!stopped)fail()},30000)};
  const fail=custom=>{const msg=typeof custom==='string'?custom:_('Verbindung fehlgeschlagen. Seid ihr im selben WLAN? Manche Netze, zum Beispiel Gast-WLAN, blockieren die Verbindung.'),was=useCam||typeof custom==='string';cleanup();stopped=false;anim('idle');prog(0,1);B().innerHTML=`<p class="mu" role="alert">${msg}</p><button class="btn pri" data-a="again" style="width:100%">${_('Nochmal versuchen')}</button>${was?'':`<button class="btn" data-a="againcam" style="width:100%;margin-top:8px">${_('Mit Kamera-Freigabe versuchen')}</button><p class="sm mu">${_('Die Freigabe hilft manchen Netzen, die Handys zu verbinden. Die Kamera wird nicht benutzt.')}</p>`}`};
  const wire=ch=>{dc=ch;ch.onopen=()=>sync(ch);if(ch.readyState==='open')sync(ch)};
  const sync=async ch=>{if(stopped||synced)return;synced=true;clearTimeout(tmo);clearTimeout(scanT);clearTimeout(frT);stopCam();anim('transfer');prog(0,1);
   B().innerHTML=`<p class="mu" id="wst" role="status" style="text-align:center">${_('Verbunden. Beiträge werden ausgetauscht …')}</p>`;
   try{const r=await runSync(ch,(a,n)=>{prog(a,n);st(n?_('Übertragen: {a} von {n}',{a,n}):_('Verbunden. Beiträge werden ausgetauscht …'))});
    bumpMet(1);DB.index();prog(1,1);anim('done');route();const msg=r.n?_('Fertig! {n} neue Beiträge in {t} Unterhaltungen.',{n:r.n,t:r.t}):_('Nichts Neues. Ihr habt schon dasselbe.');
    B().innerHTML=`<h2 style="text-align:center;margin:4px 0">${_('Verbunden')}</h2><p class="mu" style="text-align:center">${esc(msg)}</p><button class="btn pri" data-a="x" style="width:100%;margin-top:10px">${_('Fertig')}</button>`;
    try{ch.close();pc&&pc.close()}catch{}}
   catch{synced=false;const ps=ledger()[0];if(ps&&ps.via==='wlan'&&ps.have>0&&ps.state!=='done'){route();anim('idle');B().innerHTML=`<h2 style="text-align:center;margin:4px 0">${_('Unterbrochen')}</h2><p class="mu" style="text-align:center">${esc(_('Unterbrochen. {n} Beiträge sind schon da. Beim nächsten Austausch geht es an der gleichen Stelle weiter.',{n:ps.new}))}</p><button class="btn pri" data-a="x" style="width:100%;margin-top:10px">${_('Fertig')}</button>`}else fail()}};
  const accept=async sig=>{try{
    if(role==='host'&&sig.k==='answer'&&stage==='offer'){stage='';await pc.setRemoteDescription({type:'answer',sdp:sig.sdp});armTimeout();anim('connect');clearTimeout(scanT);clearTimeout(frT);B().innerHTML=`<p class="mu" id="wst" role="status" style="text-align:center">${_('Verbindung wird aufgebaut …')}</p>`;return true}
    if(role==='join'&&sig.k==='offer'&&stage==='wait-offer'){stage='';clearTimeout(scanT);anim('connect');B().innerHTML=`<p class="mu" id="wst" role="status" style="text-align:center">${_('Code wird erstellt …')}</p>`;
     pc=mkPC();pc.ondatachannel=e=>wire(e.channel);await pc.setRemoteDescription({type:'offer',sdp:sig.sdp});await pc.setLocalDescription(await pc.createAnswer());await iceDone(pc);
     fr=await framesFor({k:'answer',sdp:pc.localDescription.sdp},'RW1');if(!useCam)stopCam();stage='answer';armTimeout();
     B().innerHTML=codeBox(_('2. Schicke diesen Antwort-Code zurück'),'wmine')+`<p class="sm mu" id="wst" role="status" style="text-align:center">${_('Warte auf das andere Handy …')}</p>`+qrBox();$('#wmine',d).value=fr.text;
     const det=$('#wqr',d);det.ontoggle=renderQr;return true}
    st(_('Dieser Code passt nicht. Prüfe, ob du den ganzen Code kopiert hast.'));return false}catch{fail();return true}};
  const onText=async t=>{const r=await handleCode(t,(a,n)=>{st(_('Empfangen: {a} von {n}',{a,n}));navigator.vibrate&&navigator.vibrate(8)});return r&&r.kind==='signal'?accept(r.sig):false};
  const hookPaste=()=>{const p=$('#wpaste',d);if(!p)return;let t=null;p.oninput=()=>{clearTimeout(t);t=setTimeout(async()=>{if(/^\s*RWT\|/.test(p.value)&&p.value.length>40)try{await accept(await parseSignalText(p.value))}catch{st(_('Dieser Code passt nicht. Prüfe, ob du den ganzen Code kopiert hast.'))}},200)}};
  const host=async()=>{role='host';stage='offer';fr=null;anim('idle');B().innerHTML=codeBox(_('1. Schicke diesen Code an das andere Handy'),'wmine')+pasteBox(_('2. Füge die Antwort des anderen ein'))+qrBox();hookPaste();$('#wqr',d).ontoggle=renderQr;
   if(useCam)await openCam();try{pc=mkPC();wire(pc.createDataChannel('rn'));await pc.setLocalDescription(await pc.createOffer());await iceDone(pc);fr=await framesFor({k:'offer',sdp:pc.localDescription.sdp},'RW1');const m=$('#wmine',d);if(m)m.value=fr.text;renderQr()}catch{fail()}};
  const join=async()=>{role='join';stage='wait-offer';fr=null;anim('idle');B().innerHTML=pasteBox(_('1. Füge den Code des anderen ein'))+qrBox();hookPaste();$('#wqr',d).ontoggle=renderQr;if(useCam)await openCam()};
  /* ---- Automatisch in der Nähe finden (über den Vermittler) ---- */
  const nb={es:null,me:null,peers:new Map(),acc:null,rdy:new Map(),offers:new Map(),pairs:new Map(),gone:new Set(),word:'',t:null,res:{n:0,t:0},fin:false,url:''};
  const nbStop=()=>{clearTimeout(nb.t);if(nb.es){try{nb.es.close()}catch{}nb.es=null}for(const p of nb.pairs.values()){try{p.dc&&p.dc.close()}catch{}try{p.pc&&p.pc.close()}catch{}}nb.pairs=new Map();nb.peers=new Map();nb.acc=null;nb.rdy=new Map();nb.offers=new Map();nb.gone=new Set();nb.res={n:0,t:0};nb.fin=false};
  const plural=(n,one,many)=>n===1?_(one):_(many,{n});
  const nbPost=async(to,data)=>{try{await fetch(nb.url+'/v1/send',{method:'POST',headers:{'content-type':'text/plain'},body:JSON.stringify({word:nb.word,id:nb.me.id,to,data})})}catch{}};
  const nbPeersHtml=()=>{const n=nb.peers.size,conf=!!nb.acc;
   const chips=[...nb.peers].map(([id,p])=>{const pr=nb.pairs.get(id),ok=pr&&pr.done,bad=pr&&pr.bad,rd=nb.rdy.has(id)&&nb.rdy.get(id).includes(nb.me.id);const tag=ok?'✓ '+_('verbunden'):bad?'! ':pr?'… ':rd?'● '+_('bereit'):'';return`<span class="chip" translate="no" style="cursor:default${ok?';border-color:var(--ac)':''}">${esc(p.name)}${tag?` <span class="sm" translate="yes">${esc(tag)}</span>`:''}</span>`}).join('');
   const head=n?plural(n,'1 Person in der Nähe','{n} Personen in der Nähe'):_('Niemand in der Nähe. Die anderen müssen dieselbe Seite öffnen.');
   const act=conf?`<p class="mu sm" role="status">${_('Warte auf die Bestätigung der anderen …')}</p><button class="btn" data-a="again" style="width:100%">${_('Abbrechen')}</button>`:`<button class="btn pri" data-a="confirm" style="width:100%;min-height:50px" ${n?'':'disabled'}>${n?plural(n,'Austausch mit 1 Person bestätigen','Austausch mit {n} Personen bestätigen'):_('Austausch bestätigen')}</button>`;
   return`<div class="sm"><b id="wcount" role="status">${head}</b></div><div class="chips" style="flex-wrap:wrap;margin:8px 0">${chips}</div>${act}`};
  const nbRender=()=>{const e=$('#wpeers',d);if(e&&!nb.fin)e.innerHTML=nbPeersHtml()};
  const nbProg=()=>{let a=0,n=0;for(const p of nb.pairs.values()){a+=p.recv||0;n+=p.total||0}prog(a,n);st(n?_('Übertragen: {a} von {n}',{a,n}):_('Verbunden. Beiträge werden ausgetauscht …'))};
  const nbFinish=()=>{if(nb.fin)return;nb.fin=true;clearTimeout(nb.t);const ok=[...nb.pairs.values()].filter(p=>p.done).length,{n,t}=nb.res;
   if(nb.es){try{nb.es.close()}catch{}nb.es=null}for(const p of nb.pairs.values()){try{p.dc&&p.dc.close()}catch{}try{p.pc&&p.pc.close()}catch{}}
   if(!ok){fail(_('Niemand hat bestätigt oder die Verbindung kam nicht zustande. Versuche es nochmal.'));return}
   bumpMet(ok);DB.index();prog(1,1);anim('done');route();
   const msg=n?_('{p} neue Beiträge in {t} Unterhaltungen.',{p:n,t}):_('Nichts Neues. Ihr habt schon dasselbe.');
   B().innerHTML=`<h2 style="text-align:center;margin:4px 0">${plural(ok,'Ausgetauscht mit 1 Person','Ausgetauscht mit {n} Personen')}</h2><p class="mu" style="text-align:center">${esc(msg)}</p><button class="btn pri" data-a="x" style="width:100%;margin-top:10px">${_('Fertig')}</button>`};
  const nbCheck=()=>{if(nb.fin||!nb.acc)return;for(const id of nb.acc){if(nb.gone.has(id))continue;const p=nb.pairs.get(id);if(!p||!(p.done||p.bad))return}setTimeout(nbFinish,700)};
  const nbPair=(id,initiator)=>{if(nb.pairs.has(id))return null;const p={pc:mkPC(),dc:null,recv:0,total:0,done:false,bad:false};nb.pairs.set(id,p);
   const bad=()=>{if(!p.done&&!p.bad){p.bad=true;nbRender();nbCheck()}};p.pc.onconnectionstatechange=()=>{if(p.pc.connectionState==='failed')bad()};setTimeout(()=>{if(!p.done&&!p.synced)bad()},30000);
   const wireP=ch=>{p.dc=ch;const go=()=>{if(p.synced)return;p.synced=true;anim('transfer');runSync(ch,(a,n)=>{p.recv=a;p.total=n;nbProg()}).then(r=>{nb.res.n+=r.n;nb.res.t+=r.t;p.done=true;nbRender();nbCheck()}).catch(()=>{DB.index();route();bad()})};ch.onopen=go;if(ch.readyState==='open')go()};
   if(initiator)wireP(p.pc.createDataChannel('rn'));else p.pc.ondatachannel=e=>wireP(e.channel);return p};
  const nbTry=async id=>{if(nb.fin||!nb.acc||!nb.acc.has(id))return;const r=nb.rdy.get(id);if(!r||!r.includes(nb.me.id))return;
   try{if(nb.me.id<id){if(nb.pairs.has(id))return;const p=nbPair(id,true);await p.pc.setLocalDescription(await p.pc.createOffer());await iceDone(p.pc);await nbPost(id,{t:'offer',sdp:p.pc.localDescription.sdp})}
    else if(nb.offers.has(id)&&!nb.pairs.has(id)){const p=nbPair(id,false),sdp=nb.offers.get(id);await p.pc.setRemoteDescription({type:'offer',sdp});await p.pc.setLocalDescription(await p.pc.createAnswer());await iceDone(p.pc);await nbPost(id,{t:'answer',sdp:p.pc.localDescription.sdp})}}catch{const p=nb.pairs.get(id);if(p){p.bad=true;nbRender();nbCheck()}}};
  const nbMsg=async(from,m)=>{if(!m||typeof m!=='object'||!nb.peers.has(from))return;
   if(m.t==='ready'&&Array.isArray(m.acc)){nb.rdy.set(from,m.acc.filter(x=>typeof x==='string').slice(0,60));nbRender();nbTry(from)}
   else if(m.t==='offer'&&typeof m.sdp==='string'&&m.sdp.length<20000){nb.offers.set(from,m.sdp);nbTry(from)}
   else if(m.t==='answer'&&typeof m.sdp==='string'&&m.sdp.length<20000){const p=nb.pairs.get(from);if(p&&p.pc.signalingState==='have-local-offer')try{await p.pc.setRemoteDescription({type:'answer',sdp:m.sdp});anim('connect')}catch{p.bad=true;nbCheck()}}};
  const nbConnect=()=>{nbStop();nb.me={id:hex(rnd32()).slice(0,12).replace(/[^a-z0-9]/g,'a'),name:alias(hex(rnd32()))};
   let es;try{es=new EventSource(nb.url+'/v1/join?id='+nb.me.id+'&name='+encodeURIComponent(nb.me.name)+'&word='+encodeURIComponent(nb.word))}catch{fail(_('Vermittler nicht erreichbar. Prüfe die Adresse und dein Internet.'));return}
   nb.es=es;const J=e=>{try{return JSON.parse(e.data)}catch{return null}};
   es.addEventListener('peers',e=>{const l=J(e);if(Array.isArray(l))for(const p of l)if(p&&typeof p.id==='string')nb.peers.set(p.id,{name:String(p.name||'').slice(0,24)});nbRender()});
   es.addEventListener('join',e=>{const p=J(e);if(p&&typeof p.id==='string'){nb.peers.set(p.id,{name:String(p.name||'').slice(0,24)});nbRender()}});
   es.addEventListener('leave',e=>{const p=J(e);if(p){nb.peers.delete(p.id);nb.gone.add(p.id);nbRender();nbCheck()}});
   es.addEventListener('msg',e=>{const p=J(e);if(p&&typeof p.from==='string')nbMsg(p.from,p.data)});
   es.onerror=()=>{if(!nb.fin&&!stopped&&!nb.pairs.size){fail(_('Vermittler nicht erreichbar. Prüfe die Adresse und dein Internet.'))}}};
  const nbView=()=>{anim('idle');B().innerHTML=`<div class="card"><div id="wpeers">${nbPeersHtml()}</div></div>
   <details style="margin-top:10px"><summary class="sm">${_('Gleiches Wort (optional)')}</summary><p class="sm mu">${_('Falls ihr euch nicht findet: Alle tippen dasselbe Wort.')}</p><input type="text" id="wword" maxlength="40" autocomplete="off" translate="no" value="${esc(nb.word)}"><button class="btn sm" data-a="wset" style="margin-top:6px">${_('Übernehmen')}</button></details>`;nbConnect();nbRender()};
  const nbSetup=msg=>{anim('idle');B().innerHTML=`<div class="card"><div class="sm"><b>${_('Vermittler-Adresse')}</b></div><p class="sm mu">${_('Ein Vermittler hilft den Handys im selben WLAN, sich zu finden. Er sieht keine Beiträge. Trage die Adresse ein, die dir jemand gibt oder die du selbst betreibst (Ordner „relay“).')}</p><input type="url" id="wrelay" placeholder="https://…" autocomplete="off" translate="no" value="${esc(Meta.get('relay',''))}"><div class="err" id="wrerr" role="alert">${msg?esc(msg):''}</div><button class="btn pri" data-a="rsave" style="width:100%;margin-top:8px">${_('Speichern')}</button></div>`};
  const near=async()=>{let url=Meta.get('relay','')||(/^https?:$/.test(location.protocol)?location.origin:'');
   if(!url)return nbSetup();anim('connect');B().innerHTML=`<p class="mu" role="status" style="text-align:center">${_('Suche läuft …')}</p>`;
   try{const c=new AbortController(),t=setTimeout(()=>c.abort(),5000),r=await fetch(url+'/v1/ping',{signal:c.signal});clearTimeout(t);const j=await r.json();if(j&&j.randnotiz==='relay'){nb.url=url;return nbView()}}catch{}
   nbSetup(_('Vermittler nicht erreichbar. Prüfe die Adresse und dein Internet.'))};
  d.onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
   if(a==='near')near();else if(a==='rsave'){const v=$('#wrelay',d).value.trim().replace(/\/+$/,'');if(!/^https?:\/\/[^\s]+$/.test(v)){$('#wrerr',d).textContent=_('Adresse ungültig');return}Meta.set('relay',v);near()}
   else if(a==='confirm'){if(!nb.peers.size||nb.acc)return;nb.acc=new Set(nb.peers.keys());anim('connect');nbRender();for(const id of nb.acc)nbPost(id,{t:'ready',acc:[...nb.acc]});clearTimeout(nb.t);nb.t=setTimeout(nbFinish,90000);for(const id of nb.acc)nbTry(id)}
   else if(a==='wset'){nb.word=$('#wword',d).value.trim().slice(0,40);nbStop();nbView()}
   else if(a==='x')closeSheet();else if(a==='host')host();else if(a==='join')join();else if(a==='again')choose();else if(a==='againcam'){useCam=true;choose()}
   else if(a==='cp'){try{await navigator.clipboard.writeText($('#wmine',d).value);toast(_('Kopiert'))}catch{const m=$('#wmine',d);m.select();toast(_('Kopieren geht hier nicht.'))}}
   else if(a==='shr'){try{await navigator.share({text:$('#wmine',d).value})}catch{}}
   else if(a==='pst'){try{const t=await navigator.clipboard.readText();$('#wpaste',d).value=t;await accept(await parseSignalText(t))}catch{st(_('Einfügen geht hier nicht. Halte das Feld gedrückt und wähle „Einfügen“.'))}}
   else if(a==='pp'){try{await accept(await parseSignalText($('#wpaste',d).value))}catch{st(_('Dieser Code passt nicht. Prüfe, ob du den ganzen Code kopiert hast.'))}}};
  choose()})}
/* ===== Hilfe ===== */
function helpSheet(){const Q=[['Muss ich mich anmelden?','Nein. Es gibt kein Konto, keine E-Mail und keine Telefonnummer.'],['Wer sieht, was ich schreibe?','Alle, die die Unterhaltung öffnen. Dein Name ist ein Tiername wie „Fuchs 42“. Er ist in jeder Unterhaltung anders.'],['Kann man mich erkennen?','Nicht an deinem Namen. Aber: Schreibe keine echten Namen, Adressen oder Telefonnummern. Was du schreibst, bleibt lesbar.'],['Kann ich Beiträge löschen?','Nicht sicher. Weil keine Firma dahintersteht, haben andere schon Kopien. Überlege deshalb vor dem Senden.'],['Was bedeutet „auffällig“?','Der Beitrag sieht aus wie Spam oder wie viele gleiche Texte auf einmal. Er ist nur ausgeblendet, nicht gelöscht. Du kannst ihn einblenden.'],['Was bedeutet die Zahl neben einem Namen?','So viele Verbindungen mit Menschen hatte die Person beim Schreiben, grob gerundet. Es ist ihre eigene Angabe und nicht geprüft. Sie sagt nichts darüber, ob etwas stimmt.'],['Was kosten Auszeichnungen?','Nichts. Die besonderen Auszeichnungen schaltest du nach und nach frei, wenn du dich mit anderen austauschst.'],['Wie bekomme ich eine Unterhaltung zu Freunden?','Öffne sie und tippe auf „Als Datei teilen“. Schicke die Datei per Messenger oder Mail.'],['Wie funktioniert der QR-Aufkleber?','Im Aufkleber steckt die Unterhaltung als QR-Code. Wer ihn scannt, bekommt sie aufs Gerät. Erstelle ihn unter Teilen → Orte (QR), drucke ihn aus und klebe ihn an den Ort.'],['Was, wenn ich mein Handy verliere?','Mit dem Sicherungs-Code unter „Ich“ kommst du auf einem neuen Gerät weiter.'],['Wie funktioniert die Übersetzung?','Texte in einer anderen Sprache werden automatisch in deine Sprache übersetzt. Darunter steht, dass sie übersetzt wurden. Mit einem Tipp siehst du den Originaltext. Erkannt werden Deutsch, Englisch, Französisch, Chinesisch, Japanisch und Russisch.']];
 sheet(`<div class="hd"><h2>Hilfe</h2><button class="btn ghost icon" data-a="x" aria-label="Schließen">${ic('x')}</button></div>${Q.map(([q,a])=>`<details><summary>${q}</summary><p class="mu">${a}</p></details>`).join('')}`,d=>{d.onclick=e=>{if(e.target.closest('[data-a=x]'))closeSheet()}})}

/* ===== Willkommen (Onboarding) ===== */
let obStep=0,obSeed=true;
const LANGS=[['de','Deutsch'],['en','English'],['fr','Français'],['zh','中文'],['ja','日本語'],['ru','Русский']];
const OBQ={"de": "Das Internet ist tot, es lebe das Outernet.", "en": "The internet is dead, long live the Outernet.", "fr": "Internet est mort, vive l’Outernet.", "zh": "互联网已死，Outernet 万岁。", "ja": "インターネットは死んだ。Outernet 万歳。", "ru": "Интернет умер, да здравствует Outernet."};
const OBT={
 de:{s:[["Hier reden Menschen miteinander.", "Outernet ist eine Gemeinschaft von Mensch zu Mensch. Zu jeder Webseite, jedem Satz und jedem Ort gibt es eine eigene Unterhaltung. Du brauchst kein Konto und keine E-Mail."], ["Ein Netz ohne Zentrale", "Outernet gehört niemandem und läuft auf keinem Firmen-Server. Jedes Handy ist ein Teil des Netzes.", ["Niemand kann es abschalten oder zensieren", "Keine Firma sammelt deine Daten", "Deine Beiträge bleiben auf deinem Gerät", "Es geht auch ohne Internet", "Es wächst, wenn Menschen sich treffen"]], ["Dein Tiername schützt dich", "In jeder Unterhaltung bekommst du einen anderen Tiernamen, zum Beispiel „Fuchs 42“. So kann niemand deine Beiträge verbinden."], ["Von Hand zu Hand", "Neue Unterhaltungen erreichen dich, wenn du dich mit Menschen verbindest: per QR-Code, im WLAN oder als Datei. Je mehr mitmachen, desto lebendiger wird dein Netz."]],next:'Weiter',back:'Zurück',skip:'Überspringen',go:'Los geht’s',seed:'Mit Beispielen starten',seedsub:'Ein paar Unterhaltungen zum Ausprobieren. Du kannst sie später löschen.',setup:'Dein Platz wird eingerichtet …',wait:'Das dauert nur einen Moment.',step:'Willkommen, Schritt {n} von 4',lang:'Sprache'},
 en:{s:[["People talking to people.", "Outernet is a community from person to person. Every web page, every sentence and every place has its own conversation. No account, no email."], ["A network with no center", "Outernet belongs to nobody and runs on no company server. Every phone is part of the network.", ["Nobody can switch it off or censor it", "No company collects your data", "Your posts stay on your device", "It works without internet too", "It grows when people meet"]], ["Your animal name protects you", "In every conversation you get a different animal name, like “Fox 42”. Nobody can link your posts together."], ["From hand to hand", "New conversations reach you when you connect with people: by QR code, over Wi-Fi or as a file. The more people join in, the livelier your network gets."]],next:'Next',back:'Back',skip:'Skip',go:'Let’s go',seed:'Start with examples',seedsub:'A few discussions to try out. You can delete them later.',setup:'Setting up your space …',wait:'This only takes a moment.',step:'Welcome, step {n} of 4',lang:'Language'},
 fr:{s:[["Des gens qui parlent aux gens.", "Outernet est une communauté de personne à personne. Chaque page web, chaque phrase et chaque lieu a sa propre conversation. Sans compte, sans e-mail."], ["Un réseau sans centre", "Outernet n’appartient à personne et ne tourne sur aucun serveur d’entreprise. Chaque téléphone fait partie du réseau.", ["Personne ne peut l’éteindre ni le censurer", "Aucune entreprise ne collecte tes données", "Tes messages restent sur ton appareil", "Ça marche aussi sans internet", "Il grandit quand les gens se rencontrent"]], ["Ton nom d’animal te protège", "Dans chaque conversation, tu as un autre nom d’animal, par exemple « Renard 42 ». Personne ne peut relier tes messages entre eux."], ["De main en main", "Les nouvelles conversations te parviennent quand tu te connectes à d’autres personnes : par code QR, en Wi-Fi ou sous forme de fichier. Plus on est nombreux, plus ton réseau est vivant."]],next:'Suivant',back:'Retour',skip:'Passer',go:'C’est parti',seed:'Commencer avec des exemples',seedsub:'Quelques discussions pour essayer. Tu peux les supprimer plus tard.',setup:'Ton espace se prépare …',wait:'Ça ne prend qu’un instant.',step:'Bienvenue, étape {n} sur 4',lang:'Langue'},
 zh:{s:[["人与人，面对面交流。", "Outernet 是一个人与人之间的社区。每个网页、每句话、每个地点都有自己的对话。无需账号，无需邮箱。"], ["没有中心的网络", "Outernet 不属于任何人，也不运行在任何公司的服务器上。每部手机都是网络的一部分。", ["没有人能关停或审查它", "没有公司收集你的数据", "你的帖子留在你的设备上", "没有网络也能使用", "人们相遇，它就会成长"]], ["动物昵称保护你", "每个对话里你都会得到不同的动物昵称，例如“狐狸 42”。没有人能把你的帖子联系起来。"], ["手手相传", "当你与他人连接时，新的对话就会到达你这里：通过二维码、WLAN 或文件。参与的人越多，你的网络就越有活力。"]],next:'下一步',back:'返回',skip:'跳过',go:'开始吧',seed:'用示例开始',seedsub:'几个可以试玩的讨论，之后可以删除。',setup:'正在为你设置空间……',wait:'只需片刻。',step:'欢迎，第 {n} 步，共 4 步',lang:'语言'},
 ja:{s:[["人と人が話す場所。", "Outernet は人から人へつながるコミュニティです。すべてのウェブページ、文章、場所に、それぞれの会話があります。アカウントもメールも不要です。"], ["中心のないネットワーク", "Outernet は誰のものでもなく、企業のサーバーでも動きません。すべてのスマホがネットワークの一部です。", ["誰にも止められず、検閲もされません", "企業があなたのデータを集めることはありません", "投稿はあなたの端末に残ります", "インターネットがなくても使えます", "人が出会うほど広がります"]], ["動物の名前があなたを守ります", "会話ごとに違う動物の名前が付きます。たとえば「キツネ42」。投稿同士を結びつけることは誰にもできません。"], ["手から手へ", "人とつながると、新しい会話があなたに届きます。QRコード、Wi-Fi、ファイルのどれでも。参加する人が増えるほど、ネットワークは活気づきます。"]],next:'次へ',back:'戻る',skip:'スキップ',go:'はじめる',seed:'サンプルで始める',seedsub:'試せる議論がいくつか入ります。あとで削除できます。',setup:'あなたの場所を準備しています…',wait:'すぐ終わります。',step:'ようこそ、4 ステップ中 {n}',lang:'言語'},
 ru:{s:[["Люди говорят с людьми.", "Outernet — сообщество «от человека к человеку». У каждой веб-страницы, каждой фразы и каждого места есть своё обсуждение. Без аккаунта и без e-mail."], ["Сеть без центра", "Outernet никому не принадлежит и не работает на сервере компании. Каждый телефон — часть сети.", ["Никто не может её отключить или цензурировать", "Ни одна компания не собирает твои данные", "Твои сообщения остаются на твоём устройстве", "Работает и без интернета", "Растёт, когда люди встречаются"]], ["Имя животного защищает тебя", "В каждом обсуждении у тебя новое имя животного, например «Лиса 42». Никто не сможет связать твои сообщения."], ["Из рук в руки", "Новые обсуждения приходят к тебе, когда ты соединяешься с людьми: по QR-коду, через Wi-Fi или файлом. Чем больше людей, тем живее твоя сеть."]],next:'Далее',back:'Назад',skip:'Пропустить',go:'Поехали',seed:'Начать с примеров',seedsub:'Несколько обсуждений для пробы. Позже их можно удалить.',setup:'Готовим твоё место …',wait:'Это займёт всего миг.',step:'Добро пожаловать, шаг {n} из 4',lang:'Язык'}};
function renderOb(){const o=$('#ob'),t=OBT[LANG],s=t.s[obStep],last=obStep===3;o.hidden=false;o.lang=LANG;
 o.innerHTML=`<div style="display:flex;gap:8px;align-items:center;max-width:520px;width:100%;margin:0 auto;min-height:44px"><div class="chips" role="group" aria-label="${esc(t.lang)}" style="flex:1;padding:0">${LANGS.map(([k,l])=>`<button class="chip" lang="${k}" data-ob="lang" data-l="${k}" aria-pressed="${k===LANG}">${l}</button>`).join('')}</div>${last?'':`<button class="btn ghost" data-ob="skip">${esc(t.skip)}</button>`}</div>
 <div class="stage" data-step="${obStep}" role="group" aria-label="${esc(t.step.replace('{n}',obStep+1))}">${art([0,3,1,2][obStep])}${obStep===0?`<div class="obq">${esc(OBQ[LANG])}</div>`:''}<h1>${esc(s[0])}</h1><p>${esc(s[1])}</p>${s[2]?`<ul class="obl">${s[2].map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}${last?`<label class="switch"><input type="checkbox" id="obs" ${obSeed?'checked':''}><span><b>${esc(t.seed)}</b><br><span class="sm mu">${esc(t.seedsub)}</span></span></label>`:''}</div>
 <div class="dots" aria-hidden="true">${[0,1,2,3].map(i=>`<i class="${i===obStep?'on':''}"></i>`).join('')}</div>
 <div class="obbar">${obStep?`<button class="btn" data-ob="back" aria-label="${esc(t.back)}">${ic('back')}</button>`:''}<button class="btn pri" data-ob="${last?'go':'next'}">${esc(last?t.go:t.next)}</button></div>`;
 o.querySelector('.btn.pri').focus();o.querySelector('.chip[aria-pressed=true]').scrollIntoView({inline:'center',block:'nearest'})}
$('#ob').onclick=async e=>{const b=e.target.closest('[data-ob]');if(!b)return;const a=b.dataset.ob,t=OBT[LANG];
 if(a==='lang'){LANG=b.dataset.l;Meta.set('lang',LANG);applyLang();renderOb();return}
 if(a==='next'){obStep++;renderOb()}else if(a==='back'){obStep--;renderOb()}else if(a==='skip'){obStep=3;renderOb()}
 else if(a==='go'){obSeed=$('#obs').checked;b.disabled=true;$('.stage',$('#ob')).innerHTML=`<div class="bar" style="margin:30px 0 14px"><i id="obp" style="width:10%"></i></div><h1>${esc(t.setup)}</h1><p>${esc(t.wait)}</p>`;
  await new Promise(r=>setTimeout(r,60));master();if(obSeed)await seed(p=>{$('#obp').style.width=(10+p*90)+'%'});Meta.set('onboarded',1);applyLang();tipLater('start',1200);$('#ob').hidden=true;location.hash='#/';route();say('Fertig. Willkommen bei Outernet.');say('Fertig! Tippe auf eine Unterhaltung, um zu starten.')}};

/* ===== Beispieldaten (echt signiert, von fremden Pseudonymen) ===== */
async function seed(prog=()=>{}){if(Meta.get('seeded'))return;Meta.set('seeded',1);const U=()=>rnd32(),H=60*60000,N=Date.now();let step=0;const tick=()=>prog(Math.min(1,++step/40));
 const art1='<h2>Stadtrat beschließt neue Radwege</h2><p>Der Stadtrat hat mit knapper Mehrheit zwölf neue Radwege beschlossen. Die Kosten liegen bei 18 Millionen Euro.</p><p>Anwohner kritisieren, dass dafür rund 400 Parkplätze wegfallen.</p>';
 const sbV=await createSub({name:'Stadt & Verkehr',desc:'Alles rund um Wege, Bahnen, Parkplätze und Baustellen in unserer Stadt. Fragen, Erfahrungen und Ideen sind willkommen.',rules:'Bleibt freundlich und sachlich. Keine persönlichen Angriffe, keine Werbung, keine privaten Daten anderer Menschen.',m:U(),ts:N-60*H});
 await createSub({name:'Nachbarschaft',desc:'Für kleine Fragen und Hilfe im Haus und in der Straße: Wer leiht eine Leiter, wo ist der nächste Flohmarkt?',rules:'Respektiert die Privatsphäre. Nennt keine Namen oder Adressen. Hilfe anbieten ist besser als meckern.',m:U(),ts:N-50*H});
 const t1=await createThread({sub:sbV.id,title:'Radwege: 400 Parkplätze weg – okay?',anchor:{kind:'passage',url:'https://beispiel.example/radwege',text:'Anwohner kritisieren, dass dafür rund 400 Parkplätze wegfallen.'},html:'<!doctype html><meta charset=utf-8>'+art1,m:U(),ts:N-5*H});
 const t2=await createThread({title:'Klingel an der Haustür Kastanienallee 12 kaputt?',anchor:{kind:'place'},geo:{lat:52.540,lon:13.424},m:U(),ts:N-40*H});
 const t3=await createThread({sub:sbV.id,title:'Welche Bahn nehmt ihr zum Hauptbahnhof?',anchor:{kind:'free'},m:U(),ts:N-2*H});
 const V=[...Array(14)].map(U);
 const say1=async(t,m,txt,par,age,up,dn,aw=[])=>{const c=await postComment(t.id,txt,par,{kind:'text',cn:CNS.get(m)},m,N-age*60000);tick();for(let i=0;i<up;i++)await postVote(t.id,c.id,1,V[i],N-age*60000+i*1000);for(let i=0;i<dn;i++)await postVote(t.id,c.id,-1,V[13-i],N-age*60000+i*1000);for(const k of aw)await postAward(t.id,c.id,k,undefined,V[aw.indexOf(k)],N-age*60000+5000);tick();return c};
 const a=U(),b=U(),c=U(),d=U(),e=U();const CNS=new Map([[a,10],[b,200],[c,0],[d,3],[e,40]]);
 const c1=await say1(t1,a,'Ohne Parkplätze sterben die kleinen Läden aus, das zeigen andere Städte.',null,290,5,3);
 await say1(t1,b,'In Kopenhagen stieg der Umsatz nach dem Umbau. Studien gibt es genug.',c1.id,270,12,0,['hilfreich','gold']);
 await say1(t1,c,'Parkhäuser am Stadtrand sind für Rollstuhlfahrer keine Lösung.',null,200,9,1,['klug']);
 await say1(t1,d,'Erster!!! lol',null,250,0,6);
 await say1(t2,e,'Bei uns im 3. Stock klingelt auch nichts. Die Hausverwaltung weiß Bescheid.',null,2300,6,0,['danke']);
 await say1(t3,a,'Die 12 ist am schnellsten, aber oft voll.',null,100,8,7);
 await say1(t3,b,'Ich nehme immer das Rad, geht schneller.',null,90,7,8,['lustig']);prog(1)}

/* ===== Klicks ===== */
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,id=b.dataset.id;
 if(a==='nav'){const k=b.dataset.k;if(k==='new')return newSheet(0,{sub:/^#\/s\/[0-9a-f]{64}$/.test(location.hash)?location.hash.slice(4):undefined});location.hash=k==='feed'?'#/':'#/'+k}
 else if(a==='new')newSheet();else if(a==='feed')location.hash='#/';
 else if(a==='back'){history.length>1?history.back():location.hash='#/'}
 else if(a==='open')location.hash='#/t/'+id;
 else if(a==='opensub')location.hash='#/s/'+id;else if(a==='newsub')subSheet();else if(a==='newin')newSheet(0,{sub:id});
 else if(a==='sort'){S.sort=b.dataset.k;if(S.sort==='near'&&!S.near){const f=()=>{S.sort='hot';toast('Standort nicht verfügbar. „In der Nähe“ braucht deinen Standort.');viewFeed()};navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>{S.near={lat:p.coords.latitude,lon:p.coords.longitude};viewFeed()},f,{timeout:6000}):f()}viewFeed()}
 else if(a==='csort'){S.csort=b.dataset.k;viewThread(location.hash.slice(4))}
 else if(a==='sus'){S.hideSus=!S.hideSus;viewThread(location.hash.slice(4))}
 else if(a==='sus1'){(S.shown=S.shown||new Set()).add(id);renderComments(DB.mem.get(location.hash.slice(4)))}
 else if(a==='spam'){S.showSpam=true;viewFeed()}
 else if(a==='hide')hideSheet(id,b.dataset.t,b.dataset.au);
 else if(a==='unhide'){Meta.set('hid',{o:[],a:[]});toast(_('Alles wieder sichtbar.'));viewMe()}
 else if(a==='chkapp')$('#chkf').click();
 else if(a==='clrlog'){Meta.set('rxlog',[]);viewMe()}
 else if(a==='att'||a==='cap'||a==='imgq'){Meta.set(a,a==='cap'?+b.dataset.k:b.dataset.k);viewMe()}
 else if(a==='pull'){Meta.set('pull',1);viewMe();toast(_('Beim nächsten Austausch werden die Anhänge geladen.'))}
 else if(a==='shotsvc'){Meta.set('shotSvc',b.dataset.k);viewMe()}
 else if(a==='shoturl'){const v=($('#shu')||{value:''}).value.trim();if(!/^https?:\/\/.*\{url\}/.test(v))return toast(_('Die Adresse muss {url} enthalten.'));Meta.set('shotUrl',v);toast(_('Gespeichert'))}
 else if(a==='cnshow'){Meta.set('cnshow',b.dataset.k==='1'?1:0);viewMe()}
 else if(a==='shotzoom'){b.classList.toggle('full')}
 else if(a==='pullx'){Meta.set('pull',0);viewMe()}
 else if(a==='dropdef'){Meta.set('defer',{});viewMe()}
 else if(a==='dropatt'){(async()=>{for(const o of[...DB.mem.values()])if(o.t==='blob'){deferAdd(o.id,o.data.length,'local');await DB.del(o.id)}DB.index();viewMe();toast(_('Anhänge entfernt. Du kannst sie später wieder laden.'))})()}
 else if(a==='vote'){const tid=b.dataset.t,tg=id||tid,d=+b.dataset.d;const cur=await keyFor(tid);const t=tally(DB.by.get(tid)||[],tg),mv=t.mine.get(cur.pub);if(mv&&mv.dir===d)return;b.classList.add('pulse');await postVote(tid,tg,d);markStep('vote');viewThread(tid)}
 else if(a==='award')awardSheet(b.dataset.t,id);
 else if(a==='reply'){window._reply=id;const ta=$('#dock textarea');ta.placeholder='Antwort an '+b.dataset.by+' …';ta.focus();ta.scrollIntoView({block:'center'})}
 else if(a==='zoom'){sheet(`<div class="hd"><h2>Bild</h2><button class="btn ghost icon" data-a="x" aria-label="Schließen">${ic('x')}</button></div><img src="${b.src}" alt="${esc(b.alt)}" style="max-width:100%;border-radius:12px">`,d=>{d.onclick=e=>{if(e.target.closest('[data-a=x]'))closeSheet()}})}
 else if(a==='exp'){const r=DB.mem.get(id),html=exportHtml(id),name=r.title.replace(/[^\p{L}\p{N}]+/gu,'-').slice(0,40)+'.html';markStep('share');
  try{const f=new File([html],name,{type:'text/html'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:r.title});shareDone(_('Bereit zum Teilen'),_('Datei gespeichert. Schicke sie weiter.'));return}}catch(er){if(er&&er.name==='AbortError')return}
  dlFile(name,html,'text/html');shareDone(_('Bereit zum Teilen'),_('Datei gespeichert. Schicke sie weiter.'))}
 else if(a==='expall'){dlFile('outernet-sicherung-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify({randnotiz:1,objects:[...DB.mem.values()]}),'application/json');shareDone(_('Bereit zum Teilen'),_('Datei gespeichert. Schicke sie weiter.'))}
 else if(a==='imp')$('#imp').click();
 else if(a==='copy'){try{await navigator.clipboard.writeText(b.dataset.v);toast('Kopiert')}catch{toast('Kopieren geht hier nicht.')}}
 else if(a==='help')helpSheet();else if(a==='backup')backupSheet();else if(a==='restore')restoreSheet();
 else if(a==='shareapp')shareApp();
 else if(a==='wifi')wifiSheet();else if(a==='dlapp'){dlFile('outernet.html',SELF,'text/html');shareDone(_('Bereit zum Teilen'),_('Datei gespeichert. Schicke sie weiter.'))}
 else if(a==='connect')connectSheet('both');else if(a==='scan')connectSheet('scan');else if(a==='sticker')stickerSheet(id);
 else if(a==='area'){S.shareArea=b.dataset.k;viewShare()}
 else if(a==='bmhint'){e.preventDefault();toast(_('Nicht antippen, sondern in die Lesezeichenleiste ziehen.'))}
 else if(a==='plugdl'){const k=b.dataset.k;if(!['chrome','firefox','safari'].includes(k))return;try{const bl=await extZip(k,appAddr()),u=document.createElement('a');u.href=URL.createObjectURL(bl);u.download='outernet-plugin-'+k+'.zip';document.body.append(u);u.click();u.remove();setTimeout(()=>URL.revokeObjectURL(u.href),4000);toast(_('Plugin geladen. Folge den Schritten darüber.'))}catch{toast(_('Das Plugin konnte nicht erzeugt werden.'))}}
 else if(a==='lang'){LANG=b.dataset.k;Meta.set('lang',LANG);applyLang();closeSheet();route()}
 else if(a==='autotr'){Meta.set('autotr',b.checked?1:0);if(b.checked){document.querySelectorAll('[data-tx]').forEach(e=>delete e.dataset.txd);xlate()}}
 else if(a==='txtoggle'){const e=b.previousElementSibling;if(!e||!e.dataset.orig)return;if(e.dataset.txs==='tr'){e.textContent=e.dataset.orig;e.dataset.txs='orig';txNote(e,'orig',e.dataset.from)}else if(e.dataset.txs==='orig'){e.textContent=e.dataset.tr;e.dataset.txs='tr';txNote(e,'tr',e.dataset.from)}}
 else if(a==='txsetup'){const e=b.previousElementSibling;if(!e)return;delete e.dataset.txd;await xlate(e,true);if(e.dataset.txs==='na')sheet(`<div class="hd"><h2>${_('Übersetzer einrichten')}</h2><button class="btn ghost icon" data-a="x" aria-label="${_('Schließen')}">${ic('x')}</button></div><p class="mu">${_('Für die automatische Übersetzung lädt dein Browser einmalig ein Sprachpaket auf dein Gerät. Danach läuft sie ohne Internet und privat.')}</p>`,d=>{d.onclick=ev=>{if(ev.target.closest('[data-a=x]'))closeSheet()}})}
 else if(a==='theme'){Meta.set('theme',b.dataset.k);applyPrefs();viewMe()}
 else if(a==='big'){Meta.set('big',b.checked?1:0);applyPrefs()}
 else if(a==='hidesteps'){Meta.set('hideSteps',1);viewFeed()}
 else if(a==='tour'){obStep=0;renderOb()}
 else if(a==='seed'){Meta.set('seeded',0);await seed();DB.index();route();toast('Beispiele geladen')}
 else if(a==='wipe'){if(await ask('Wirklich alles löschen?','Alle Unterhaltungen und dein Sicherungs-Code verschwinden von diesem Gerät. Das kann nicht rückgängig gemacht werden.','Ja, löschen','Abbrechen')){await DB.wipe();['master','created','steps','hideSteps','seeded','onboarded','backupAsked'].forEach(k=>Meta.set(k,null));keyCache.clear();location.reload()}}});
document.addEventListener('change',e=>{if(e.target.id==='lturl'){Meta.set('ltUrl',e.target.value.trim());return}if(e.target.id==='imp')importFiles([...e.target.files]).then(()=>{DB.index();viewShare()})});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.dataset&&e.target.dataset.act==='zoom')e.target.click()});
function applyPrefs(){const t=Meta.get('theme','auto');if(t==='auto')document.documentElement.removeAttribute('data-theme');else document.documentElement.dataset.theme=t;document.documentElement.style.setProperty('--fs',Meta.get('big')?1.2:1)}

/* ===== Start ===== */
(async()=>{try{applyPrefs();applyLang();document.body.querySelectorAll('*').length&&trNode(document.body);
 try{await crypto.subtle.generateKey({name:'Ed25519'},false,['sign']);if(sha('abc')!=='ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')throw 0}
 catch{window.__rnOK=true;$('#main').innerHTML=`<div class="empty"><h1>${_('Dein Browser ist zu alt')}</h1><p class="mu">${_('Bitte aktualisiere Chrome, Edge, Safari oder Firefox auf die neueste Version und öffne die Datei erneut.')}</p></div>`;return}
 await DB.open();
 if(!DB.use)setTimeout(()=>toast('Speichern im Browser ist hier nicht möglich. Nutze „Alles als Datei speichern“.'),1500);
 if(!Meta.get('onboarded')&&!location.hash.startsWith('#/t/')){renderOb()}
 await route();window.__rnOK=true}catch(e){console.error(e);window.__rnFail&&window.__rnFail(e)}})();
