const ext = typeof browser !== 'undefined' ? browser : chrome;
const u = document.getElementById('u'), s = document.getElementById('s');
const DEFAULT_APP = '__APP_URL__';
ext.storage.local.get('appUrl').then((r) => { u.value = r.appUrl || (/^(https?|file):\/\//.test(DEFAULT_APP) ? DEFAULT_APP : ''); });
document.getElementById('b').onclick = async () => {
  const v = u.value.trim();
  if (!/^(https?|file):\/\//.test(v)) { s.textContent = 'Bitte eine Adresse eingeben, die mit https:// oder file:// beginnt.'; return; }
  await ext.storage.local.set({ appUrl: v });
  s.textContent = 'Gespeichert.';
};
