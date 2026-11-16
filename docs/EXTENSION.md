# Von Webseiten aus: Lesezeichen und Browser-Plugin

Ziel: Von jeder Webseite aus mit einem Klick die passende Outernet-Unterhaltung öffnen. Markierter Text wird zur Textstelle (Passage).

## Was ist sinnvoll?

| Weg | Wo es geht | Aufwand | Grenzen |
| --- | --- | --- | --- |
| **Lesezeichen** (Bookmarklet) | Alle Browser, auch iPhone und Android | Knopf ziehen, fertig | Die App muss unter einer Webadresse liegen. Aus einer Datei (`file://`) dürfen Browser keine Dateien aus Webseiten heraus öffnen. Manche Seiten sperren Lesezeichen per Sicherheitsrichtlinie (zum Beispiel GitHub). |
| **Plugin** | Chrome, Edge, Brave, Firefox, Safari (Mac) | Datei laden, einmal einrichten | Nur Computer. Geht auch mit einer App-Datei. Kann Link-Rechtsklick und Tastenkürzel. |
| **Adresse einfügen** | Überall | Kopieren, in der App einfügen | Zwei Schritte mehr |

Das Plugin ist ein reiner Startknopf. Es hat nur die Berechtigungen `storage`, `contextMenus` und `activeTab`, sendet nichts, lädt nichts und kann die Unterhaltungen der App nicht lesen. Es zeigt deshalb auch nicht an, ob es zu einer Seite schon Unterhaltungen gibt (das ginge nur, wenn die App ihre Liste dem Plugin gäbe, siehe „Ideen“).

## Warum kein Ein-Klick-Einbau?

Die Browser erlauben es Webseiten nicht, Plugins zu installieren. Chrome und Edge nehmen Plugins außerhalb des Stores nur im Entwicklermodus an. Firefox verlangt eine Signatur von Mozilla (ohne sie nur „temporär“ bis zum Neustart). Safari verlangt eine Mac-App, die mit Xcode gebaut wird. Die App erzeugt deshalb beim Klick eine ZIP-Datei für den gewählten Browser mit der Adresse der App schon eingetragen, plus Schritt-für-Schritt-Anleitung.

Wer will, kann das Plugin in den Stores veröffentlichen. Dann ist die Installation ein Klick. Dafür gelten die Regeln des jeweiligen Stores (Chrome Web Store, addons.mozilla.org, App Store für Safari).

## Aufbau

- Quelle: `extension/` (`manifest.json` im Chrome-Stil, `background.js`, `options.html`, `options.js`).
- `tools/build.py` bettet diese vier Dateien in `web/app.html` ein. `extZip()` in `src/app.js` setzt daraus je Browser eine ZIP-Datei zusammen: Chrome (`service_worker`), Firefox (`scripts` und `browser_specific_settings.gecko`), Safari (`scripts`, nicht dauerhaft, plus `SAFARI.txt`). `__APP_URL__` wird durch die Adresse der App ersetzt, die Symbole werden im Browser gezeichnet.
- Der Aufruf ist `<App-Adresse>#/link/<Seitenadresse>[/<markierter Text>]`. Die App öffnet die vorhandene Unterhaltung oder bietet an, eine neue zu starten.
- Test: `tests/test_plugin.py` lädt das erzeugte Chrome-Plugin in ein echtes Chromium und prüft Aufruf, Lesezeichen und alle drei ZIP-Dateien.

## Entwickeln

Chrome/Edge: `chrome://extensions` → Entwicklermodus → „Entpackte Erweiterung laden“ → Ordner `extension/`. Adresse der App in den Plugin-Einstellungen eintragen (oder `__APP_URL__` in `background.js` ersetzen).
Firefox: ZIP aus der App laden und unter `about:debugging` als temporäres Add-on einlesen.

## Firefox dauerhaft (kostenlos)

1. ZIP aus der App laden (Firefox-Variante).
2. Bei [addons.mozilla.org](https://addons.mozilla.org/developers/) ein Entwicklerkonto anlegen und die ZIP als **nicht gelistet** (self-distribution) hochladen. Mozilla signiert sie automatisch.
3. Die signierte `.xpi` im Firefox öffnen. Sie bleibt dauerhaft.
Die Gecko-ID in der erzeugten `manifest.json` (`outernet@outernet.invalid`) kannst du durch eine eigene ersetzen.

## Safari (Mac)

Die ZIP enthält `SAFARI.txt` mit den Befehlen (`xcrun safari-web-extension-converter`). Für die dauerhafte Nutzung ohne „Unsignierte Erweiterungen erlauben“ braucht man ein Apple-Entwicklerkonto. Auf iPhone und iPad bleibt das Lesezeichen.

## Ideen

- Anzeige am Symbol, ob es zur Seite schon Unterhaltungen gibt: Die App könnte dem Plugin eine Liste von Seiten-Prüfsummen geben (nie die Adressen selbst). Bräuchte eine Verbindung zwischen App und Plugin.
- Web-Share-Target als Webanwendung: Teilen aus anderen Apps unter Android, wenn die App von einer Webadresse läuft und ein Manifest bekommt.
