// Outernet-Plugin: ein reiner Startknopf.
// Er öffnet die Outernet-App mit der aktuellen Seite (oder dem Link, oder dem markierten Text) als Thema.
// Er sendet nichts, lädt nichts und kennt deine Unterhaltungen nicht. Es gibt keinen Server.
const ext = typeof browser !== 'undefined' ? browser : chrome;
// Beim Herunterladen aus der App wird hier die Adresse der App eingetragen.
const DEFAULT_APP = '__APP_URL__';
const MENU = 'outernet-discuss';

ext.runtime.onInstalled.addListener(() => {
  ext.contextMenus.removeAll(() => {
    ext.contextMenus.create({ id: MENU, title: 'Mit Outernet besprechen', contexts: ['page', 'selection', 'link'] });
  });
});

async function appAddress() {
  const { appUrl } = await ext.storage.local.get('appUrl');
  if (appUrl) return appUrl;
  return /^(https?|file):\/\//.test(DEFAULT_APP) ? DEFAULT_APP : '';
}

async function openApp(url, text) {
  const app = await appAddress();
  if (!app) return ext.runtime.openOptionsPage();
  if (!/^https?:\/\//.test(url || '')) return;
  const base = app.replace(/#.*$/, '');
  const hash = '#/link/' + encodeURIComponent(url) + (text ? '/' + encodeURIComponent(String(text).trim().slice(0, 500)) : '');
  ext.tabs.create({ url: base + hash });
}

ext.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== MENU) return;
  openApp(info.linkUrl || info.pageUrl || (tab && tab.url), info.linkUrl ? '' : info.selectionText);
});
ext.action.onClicked.addListener((tab) => openApp(tab && tab.url));
