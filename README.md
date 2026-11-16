# Outernet

**Das Internet ist tot, es lebe das Outernet.**
Outernet ist eine Gemeinschaft von Mensch zu Mensch: anonyme Unterhaltungen zu Webseiten, Textstellen und realen Orten. Es gibt keinen Pflicht-Server, kein Konto und keine Werbung. Beiträge bleiben auf den Geräten und wandern per QR-Code, WLAN oder Datei von Mensch zu Mensch.

*English: Outernet is an anonymous, decentralized, Jodel-like community discussion platform that runs as a single offline HTML file. No server, no accounts. Posts travel between people by QR code, Wi-Fi or file. Code and docs are mostly German; contributions in English are welcome.*

> **Stand: lauffähiger Prototyp.** Er zeigt das Kernprinzip, ist aber nicht von Dritten auf Sicherheit geprüft. Nicht für Inhalte nutzen, bei denen Menschen gefährdet wären.

## Ausprobieren

`web/app.html` doppelklicken (Chrome, Edge, Firefox oder Safari). Keine Installation. Auf dem Handy: Datei per Messenger oder Mail schicken, oder auf einen Webspace laden (zum Beispiel GitHub Pages).

## Warum dezentral?

- Niemand kann es abschalten oder zensieren, denn es gibt keine Zentrale.
- Keine Firma sammelt Daten.
- Es geht auch ohne Internet: per QR-Code, WLAN oder Datei.
- Es wächst, wenn Menschen sich treffen und teilen.

## Was kann es?

- Unterhaltungen zu Seiten, Textstellen und Orten, Themenbereiche (Subs), Pfeile ▲▼, Rankings, Feeds, „In der Nähe“
- Anonym: pro Unterhaltung ein anderer Tiername, signierte Beiträge, kein Konto
- **Austausch** per QR (animierte Bildfolge), WLAN (mit oder ohne Vermittler) und Datei. Der Austausch läuft in fertigen Paketen: Bricht er ab, bleibt das Empfangene sichtbar und geht später am gleichen Punkt weiter. Unter „Ich“ siehst du, was du schon bekommen hast.
- **Datenmenge steuern:** Anhänge alle, nur kleine oder keine empfangen, Grenze pro Austausch, Bildqualität. Zurückgestellte Anhänge lassen sich später nachladen.
- **Screenshot zur Seite:** Gibst du die Adresse einer Webseite an, kann die App (nach deiner Zustimmung, über einen Screenshot-Dienst) automatisch einen Screenshot anfügen. Alternativ wählst du ein eigenes Bild aus Datei oder Galerie.
- **Verbindungszahl:** Neben Tiernamen steht unauffällig, wie viele Verbindungen die Person beim Schreiben hatte (gerundet: 0, 10, 200, 3K, 4M). Selbstangabe, abschaltbar.
- **Auszeichnungen:** Einige sind immer frei, die besonderen (Silber, Gold, Platin) schaltest du durch Austausch frei. Es gibt kein Bezahlsystem.
- Sechs Sprachen (DE, EN, FR, 中文, 日本語, RU), Übersetzung von Beiträgen auf dem Gerät
- **Von Webseiten aus mitreden:** Lesezeichen (alle Browser, auch Handy) und Browser-Plugin zum Herunterladen aus der App (Chrome, Firefox, Safari)
- Schutz vor Spam und Fälschung: Signaturen, Rechenaufwand, strenge Prüfung, Mengenlimits. Siehe `docs/SECURITY.md`.

## Aufbau des Repositories

| Pfad | Inhalt |
| --- | --- |
| `src/` | **Quellcode** der App (`app.js`, `base.css`, `index.html`, `i18n/tr.json`, `vendor/`) |
| `web/app.html` | Gebaute Ein-Datei-App (mit eingecheckt) |
| `tools/` | `build.py` (baut die App), `split.py` (übernimmt Änderungen zurück), `check-syntax.js` |
| `relay/` | Optionaler Vermittler (Node, ohne Abhängigkeiten): lässt Handys im selben WLAN sich ohne Code finden. Siehe `relay/README.md` |
| `extension/` | Browser-Plugin (Manifest V3, Chrome/Firefox/Safari): öffnet zu jeder Webseite die passende Unterhaltung. Die App erzeugt es zum Herunterladen. Siehe `docs/EXTENSION.md` |
| `tests/` | Browser-Tests (Playwright) und Relay-Test |
| `docs/` | `PROTOCOL.md`, `SECURITY.md`, `ARCHITECTURE.md`, `I18N.md`, `EXTENSION.md`, `ANLEITUNG_FUER_SECHSJAEHRIGE.md` |

## Entwickeln

```bash
python3 tools/build.py            # src/ -> web/app.html
node tools/check-syntax.js        # Syntaxprüfung
pip install playwright && playwright install chromium
python3 tests/run_all.py --fast   # alle Tests (ohne lange Übersetzungsprüfung)
node relay/server.js              # optionaler Vermittler auf Port 8787
```

Mehr dazu in [`CONTRIBUTING.md`](CONTRIBUTING.md). Übersetzungen: [`docs/I18N.md`](docs/I18N.md).

## Hinweise

- Braucht einen aktuellen Browser mit Ed25519 in WebCrypto (Chrome/Edge ab 137, Firefox ab 129, Safari ab 17).
- Den Vermittler muss man selbst betreiben (etwa im eigenen WLAN auf einem Raspberry Pi). Gast-WLANs blockieren Direktverbindungen oft. Dann helfen QR-Code oder Datei.
- Die Übersetzungen der Oberfläche sind maschinell erstellt und sollten von Muttersprachlern geprüft werden.
- Wenn die App nicht startet: Im Notfall-Fenster „Zurücksetzen“ wählen oder `app.html#reset` öffnen.

## Was noch fehlt

Veröffentlichung der Zeitanker auf einer echten Chain, Präsenzbeweis, anonyme Credentials, Moderationslisten, Mobile-App, unabhängiges Sicherheits-Audit, Prüfung der Übersetzungen durch Muttersprachler.

## Lizenz

[MIT](LICENSE). Enthaltene Bibliotheken: siehe [`THIRD_PARTY.md`](THIRD_PARTY.md).
