// Öffnet die Outernet-App mit der aktuellen Seite (und markiertem Text) als Thema.
// Es gibt keinen Server: Die App läuft als Datei oder unter einer Adresse, die du in den Einstellungen einträgst.
const ext = typeof browser !== 'undefined' ? browser : chrome;
const MENU = 'randnotiz-discuss';

ext.runtime.onInstalled.addListener(() => {
  ext.contextMenus.create({ id: MENU, title: 'Mit Outernet besprechen', contexts: ['page', 'selection'] });
});

async function openApp(url, text) {
  const { appUrl } = await ext.storage.local.get('appUrl');
  if (!appUrl) return ext.runtime.openOptionsPage();
  if (!/^https?:\/\/|^file:\/\//.test(url || '')) return;
  const base = appUrl.replace(/#.*$/, '');
  const hash = '#/link/' + encodeURIComponent(url) + (text ? '/' + encodeURIComponent(text.slice(0, 500)) : '');
  ext.tabs.create({ url: base + hash });
}

ext.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === MENU) openApp(info.pageUrl || (tab && tab.url), info.selectionText);
});
ext.action.onClicked.addListener((tab) => openApp(tab && tab.url));
