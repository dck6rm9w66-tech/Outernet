
(function(){var errs=[];window.__rnOK=false;var de=/^de/i.test(navigator.language||'de');var T=function(a,b){return de?a:b};
function wipe(all,cb){try{var ks=[];for(var i=0;i<localStorage.length;i++)ks.push(localStorage.key(i));ks.forEach(function(k){if(k&&k.indexOf('rn_')===0&&(all||(k!=='rn_master'&&k!=='rn_created')))localStorage.removeItem(k)})}catch(e){}
 if(!all){cb();return}var done=false,fin=function(){if(!done){done=true;cb()}};try{var r=indexedDB.deleteDatabase('randnotiz');r.onsuccess=r.onerror=r.onblocked=fin}catch(e){}setTimeout(fin,1500)}
function home(){location.href=location.href.split('#')[0]}
function show(force){if(!force&&window.__rnOK)return;if(document.getElementById('rnfail'))return;var d=document.createElement('div');d.id='rnfail';d.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;z-index:999;background:#fff;color:#111;font:16px/1.5 system-ui,sans-serif;padding:22px;overflow:auto';
 var b='display:block;width:100%;margin:8px 0;padding:14px;border-radius:12px;border:1px solid #bbb;background:#fff;font:600 16px system-ui;cursor:pointer;color:#111';
 d.innerHTML='<h2 style="margin:0 0 8px">'+T('Outernet konnte nicht starten','Outernet could not start')+'</h2><p>'+T('Meist hilft ein Zurücksetzen des gespeicherten Zustands. Deine Beiträge und dein Schlüssel bleiben bei der ersten Option erhalten.','Resetting the saved state usually helps. Your posts and your key are kept with the first option.')+'</p>'
 +'<button id="rn1" style="'+b+'">'+T('Neu laden','Reload')+'</button><button id="rn2" style="'+b+'">'+T('Einstellungen zurücksetzen (Beiträge und Schlüssel bleiben)','Reset settings (posts and key are kept)')+'</button><button id="rn3" style="'+b+';color:#b00020">'+T('Alles löschen (auch Schlüssel und Beiträge)','Delete everything (including key and posts)')+'</button>'
 +'<p style="font-size:13px;color:#555;word-break:break-word">'+(errs.join(' | ')||'-')+'<br>'+navigator.userAgent+'</p>';(document.body||document.documentElement).appendChild(d);
 document.getElementById('rn1').onclick=home;document.getElementById('rn2').onclick=function(){wipe(false,home)};
 var c=document.getElementById('rn3'),armed=false;c.onclick=function(){if(!armed){armed=true;c.textContent=T('Wirklich alles löschen? Nochmal tippen.','Really delete everything? Tap again.');return}wipe(true,home)}}
window.__rnFail=function(e){errs.push(String(e&&e.message||e));show(true)};
window.addEventListener('error',function(e){errs.push(String(e.message||e.type))});
window.addEventListener('unhandledrejection',function(e){errs.push(String(e.reason))});
window.addEventListener('load',function(){setTimeout(show,6000);if(/reset/.test(location.hash))show(true)})})();
