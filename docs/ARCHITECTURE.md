# Architektur

Outernet ist eine einzelne HTML-Datei ohne Laufzeit-Abhängigkeiten. Der Quellcode steckt in `src/`; `tools/build.py` setzt ihn zu `web/app.html` zusammen.

## Prinzipien

- **Signierte Objekte:** Alles ist ein Objekt (`root`, `comment`, `vote`, `award`, `sub`, `blob`) mit Ed25519-Signatur, Proof-of-Work und SHA-256-ID. Es gibt keine Konten. Pro Unterhaltung wird aus einem geheimen Hauptschlüssel ein eigener Schlüssel abgeleitet.
- **Jedes Gerät prüft alles:** `validate` (Form), Signatur, Proof-of-Work und `intake` (Mengenlimits, Spam-Muster) laufen für jedes fremde Objekt.
- **Speicher:** IndexedDB (`o` = Objekte, `p` = Teilstücke noch nicht fertiger Übertragungen) mit Arbeitsspeicher als Ersatz. Einstellungen und Protokolle liegen in `localStorage` (`rn_`-Präfix, Objekt `Meta`).
- **Austausch:** QR (`RN2`-Pakete, siehe `docs/PROTOCOL.md`), WLAN über WebRTC (mit optionalem Vermittler zum Finden) und Datei. Alle Wege nutzen dieselben Prüfungen und denselben Zustand für Unterbrechen und Fortsetzen.
- **Texte:** Deutsche Sätze sind die Schlüssel für die Übersetzung (`_()` und `src/i18n/tr.json`).

## Abschnitte in `src/app.js`

Die Datei ist durch Kommentare gegliedert. Suche nach der Überschrift.

| Zeile | Abschnitt |
| --- | --- |
| 12 | /* ===== Symbole ===== */ |
| 16 | /* ===== Speicher ===== */ |
| 18 | /* ===== Sprache (Oberfläche) ===== */ |
| 42 | /* ===== Übersetzung zwischen Nutzern (auf dem Gerät) ===== */ |
| 94 | /* ===== Kryptografie ===== */ |
| 148 | /* ===== Identität ===== */ |
| 160 | /* ===== Auszeichnungen ===== */ |
| 169 | /* ===== Objekte erzeugen ===== */ |
| 189 | /* ===== Auswertung ===== */ |
| 222 | /* ===== UI-Helfer ===== */ |
| 233 | /* ===== Erste Schritte ===== */ |
| 239 | /* ===== Router ===== */ |
| 258 | /* ===== Unterhaltungen ===== */ |
| 281 | /* ===== Themenbereiche (Subs) ===== */ |
| 311 | /* ===== Unterhaltung ansehen ===== */ |
| 346 | /* ===== Schreiben: Eingabefeld mit allen Beitragsarten ===== */ |
| 382 | /* ===== Neue Unterhaltung (Schritt für Schritt) ===== */ |
| 413 | /* ===== Auszeichnen ===== */ |
| 422 | /* ===== Teilen & Sichern ===== */ |
| 425 | /* ===== Export / Import als HTML-Datei ===== */ |
| 442 | /* ===== Ich ===== */ |
| 499 | /* ===== Verbinden: Austausch von Mensch zu Mensch per QR (ohne Server) ===== */ |
| 507 | /* ===== Datenmenge: Anhänge begrenzen und zurückstellen ===== */ |
| 517 | /* ===== Teilübertragung: Reihenfolge, Pakete, Protokoll, Fortsetzen ===== */ |
| 635 | /* ===== Einmalige Hinweise: Aktualisierung nur durch Austausch ===== */ |
| 646 | /* ===== App als Datei weitergeben ===== */ |
| 652 | /* ===== Aufkleber im professionellen Design ===== */ |
| 718 | /* ===== Animation beim Teilen ===== */ |
| 731 | /* ===== Teilen und Verbinden über WLAN (WebRTC, ohne Server) ===== */ |
| 879 | /* ===== Hilfe ===== */ |
| 883 | /* ===== Willkommen (Onboarding) ===== */ |
| 906 | /* ===== Beispieldaten (echt signiert, von fremden Pseudonymen) ===== */ |
| 925 | /* ===== Klicks ===== */ |
| 975 | /* ===== Start ===== */ |

(Die Zeilennummern sind Richtwerte und ändern sich beim Bearbeiten.)

## Daten und Zustände

| Schlüssel (`Meta`) | Bedeutung |
| --- | --- |
| `rxlog` | Protokoll der letzten Austausche (Teile, Zustand, Unterhaltungen) |
| `gap` | Offene Teile je Unterhaltung (8-stelliger Präfix der ID) |
| `defer` | Zurückgestellte Anhänge (ID → Größe, Zeit, Weg) |
| `att`, `cap`, `imgq`, `pull` | Einstellungen zur Datenmenge und Nachladen-Wunsch |
| `earn` | Gezählte Austausche und vergebene besondere Auszeichnungen |
| `met` | Zahl der Austausche mit Personen (Anzeige unter „Ich“) |

## Gebaute Datei und Prüfsumme

Unter „Ich“ zeigt die App eine Prüfsumme ihrer eigenen Struktur. Wer die App weitergibt, kann sie damit vergleichen. Jede Änderung am Gerüst ändert die Prüfsumme.
