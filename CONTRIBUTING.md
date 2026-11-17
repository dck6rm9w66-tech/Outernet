# Mitmachen bei Outernet

Schön, dass du dabei bist. Outernet gehört niemandem und lebt von Menschen, die es verbessern. Du brauchst dafür keine Erlaubnis. *(English summary at the end.)*

## Schnellstart für Entwickler

```bash
git clone <dein-fork>
cd outernet
python3 tools/build.py        # baut web/app.html aus src/
open web/app.html             # oder doppelklicken
```

Du brauchst nur Python 3 und einen aktuellen Browser. Für die Tests zusätzlich Node 18+ und Playwright:

```bash
pip install playwright && playwright install chromium
python3 tests/run_all.py --fast     # alle Tests ohne die lange Übersetzungsprüfung
```

## Wo liegt was?

| Pfad | Inhalt |
| --- | --- |
| `src/app.js` | Die gesamte App-Logik, gegliedert durch Kommentare `/* ===== … ===== */` (siehe `docs/ARCHITECTURE.md`). |
| `src/base.css` | Gestaltung (inklusive Glas- und Regenbogen-Design am Ende). |
| `src/index.html` | Gerüst. Die Platzhalter `{{datei}}` werden beim Bauen ersetzt. |
| `src/i18n/tr.json` | Alle Übersetzungen (deutscher Satz → [en, fr, zh, ja, ru]). Siehe `docs/I18N.md`. |
| `src/vendor/` | Fremde Bibliotheken (siehe `THIRD_PARTY.md`). |
| `web/app.html` | **Gebautes Ergebnis.** Wird mit eingecheckt, damit man die App ohne Werkzeuge nutzen kann. Nie von Hand bearbeiten, ohne danach `python3 tools/split.py` auszuführen. |
| `relay/` | Optionaler Vermittler (Node, ohne Abhängigkeiten). |
| `extension/` | Browser-Plugin (Manifest V3). |
| `tests/` | Browser-Tests (Playwright) und Relay-Test. |
| `docs/` | Protokoll, Sicherheit, Architektur, Übersetzen. |

## Regeln für Änderungen

1. **Quellcode ändern, dann bauen.** Ändere `src/`, führe `python3 tools/build.py` aus und checke beides ein. Die CI prüft mit `--check`, ob `web/app.html` zum Quellcode passt.
2. **Keine Zentrale.** Neue Funktionen dürfen keinen Server voraussetzen. Optionale Dienste (wie der Vermittler) sehen nie Beiträge.
3. **Nichts Fremdes laden.** Die App lädt zur Laufzeit nichts aus dem Netz. Die Content-Security-Policy darf nicht gelockert werden.
4. **Fremde Daten sind feindlich.** Alles, was von anderen Geräten kommt, geht durch `validate` und `intake`. Neue Objektfelder brauchen eine strenge Prüfung (Typ, Länge, Form). Lies `docs/SECURITY.md`.
5. **Kein Bezahlsystem, kein Tracking, keine Konten.**
6. **Einfache Sprache.** Texte in der Oberfläche sind kurz und ohne Fachwörter. Jeder neue Text braucht Übersetzungen in `tr.json` (alle fünf Sprachen).
7. **Tests.** Neue Funktionen bekommen einen Test in `tests/`. Sicherheitsrelevantes gehört in `tests/test_security.py`.
8. **Kleine Pull Requests** mit einer klaren Beschreibung: Was ändert sich für Menschen, die die App nutzen?

## Fehler und Ideen melden

Öffne ein Issue mit den Vorlagen. **Sicherheitslücken bitte nicht öffentlich melden**, sondern wie in `SECURITY.md` beschrieben.

## Verhalten

Es gilt `CODE_OF_CONDUCT.md`.

## English summary

Source lives in `src/`; run `python3 tools/build.py` to produce the single-file app `web/app.html` (committed). Tests: `pip install playwright && playwright install chromium && python3 tests/run_all.py --fast`. Rules: no mandatory server, no runtime network loads, treat all foreign data as hostile (validate everything), no payments or tracking, every UI string needs five translations in `src/i18n/tr.json`. Report vulnerabilities privately (see `SECURITY.md`).

## Sicherheitsregel für Änderungen

Jede Änderung, die Daten von außen annimmt oder anzeigt, braucht drei Dinge: eine Prüfung in `validate()` oder beim Anzeigen (Typ, Länge, Muster, Grenzen), Ausgabe nur über `esc()` und einen Test in `tests/test_hardening.py` oder `tests/test_security.py`. Prüfungen nur beim Absender zählen nicht. Siehe `docs/SECURITY.md`, Abschnitt "Umgebaute Clients (Forks)".
