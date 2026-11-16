const ext = typeof browser !== 'undefined' ? browser : chrome;
const u = document.getElementById('u'), s = document.getElementById('s');
ext.storage.local.get('appUrl').then((r) => { u.value = r.appUrl || ''; });
document.getElementById('b').onclick = async () => {
  const v = u.value.trim();
  if (!/^https?:\/\/|^file:\/\//.test(v)) { s.textContent = 'Bitte eine Adresse eingeben, die mit file:// oder https:// beginnt.'; return; }
  await ext.storage.local.set({ appUrl: v });
  s.textContent = 'Gespeichert.';
};
