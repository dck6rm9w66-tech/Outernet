# Sicherheit: Fehlinformationen, Fluten und Angriffe

Stand des Prototyps. Dieses Dokument beschreibt, wie Outernet angegriffen werden kann und was dagegen eingebaut ist. Es ist ehrlich über die Grenzen.

## Grundsatz

Es gibt keine Zentrale, die Inhalte prüft. Deshalb gilt: **Jedes Gerät misstraut allem, was von außen kommt.** Fremde Daten werden geprüft, begrenzt und im Zweifel eingeklappt. Absolute Sicherheit gibt es nicht. Ziel ist, dass ein Angriff teuer, begrenzt und für Menschen erkennbar bleibt.

## Bedrohungsmodell

| Angriff | Gefahr | Schutz im Prototyp | Rest-Risiko |
|---|---|---|---|
| Fälschung von Beiträgen | Jemand schreibt in fremdem Namen | Ed25519-Signatur, ID = SHA-256 des Inhalts, Prüfung bei jedem Import | Gestohlener Sicherungs-Code |
| Flut mit Spam-Beiträgen | Feed voller Werbung oder Lügen | Rechenaufwand pro Beitrag (Proof-of-Work), Limits pro Austausch (4000 Objekte, 150 pro Autor, 300 neue Unterhaltungen), Abbruch bei zu viel Ungültigem | Wer viel Rechenzeit hat, kann viel erzeugen |
| Viele falsche Identitäten (Sybil) | Gekaufte Stimmen, Schein-Mehrheit | Maximal 40 Stimmen pro Minute und Beitrag zählen. Schlüssel, die in mehreren Unterhaltungen auftauchen, sind auffällig, weil ehrliche Geräte pro Unterhaltung einen neuen Schlüssel nutzen | Viele Einmal-Schlüssel, langsam verteilt |
| Automatisierte Desinformation (Bots, KI-Text) | Massen gleicher oder ähnlicher Texte | Gleicher Text von 3 oder mehr Schlüsseln wird eingeklappt, Link-Fluten, Bursts und Fast-Duplikate werden markiert | Einzelne gut formulierte Lügen erkennt keine Software. Hier helfen nur Menschen: bewerten, ausblenden |
| Speicher voll laufen lassen | Gerät wird langsam oder voll | Obergrenzen (30 000 Objekte, 90 MB Anhänge, 500 Themenbereiche). Aufräumen entfernt zuerst Waisen, dann alte, schwach bewertete Fremd-Unterhaltungen. Eigene bleiben | Wer lange offline ist, verliert alte Fremd-Inhalte |
| Schadcode in Inhalten (XSS) | Fremder Code läuft in der App | Strenge Prüfung aller Felder (Typ, Länge, Muster), alle Texte werden maskiert, Anhänge nur mit festen Typen, Seitenstände in Sandbox ohne Skripte mit eigener Sperre gegen Nachladen | Neue Browser-Lücken |
| Absturz durch kaputte Daten | App lässt sich nicht mehr öffnen | Defekte Beiträge werden einzeln übersprungen, nicht die ganze Unterhaltung | – |
| Verfolgung durch Bilder und Links | IP-Adresse wird verraten | Strikte Content-Security-Policy: keine fremden Bilder, Frames oder Formulare. Links öffnen nur mit `noopener`, ohne Referrer | Wer einen Link anklickt, verlässt den Schutz |
| Manipulierte App-Datei | Weitergegebene Datei enthält Schadcode | Prüfsumme der App im Tab „Ich“. „Erhaltene App-Datei prüfen“ vergleicht eine Datei mit der eigenen, vertrauenswürdigen App. Eine veränderte App kann ihre eigene Prüfsumme fälschen, darum immer in der echten App prüfen | App von unbekannter Quelle nie öffnen |
| Bösartige Gegenstelle im WLAN | Sendet unverlangte oder falsche Daten | Es werden nur Objekte angenommen, die angefordert wurden. Zu viel Ungültiges oder Überlänge bricht die Verbindung ab | Gegenstelle blockiert nur den Austausch |
| Missbrauch des Vermittlers | Überlastung, Mitlesen | Limits pro Adresse (300 Anfragen und 30 Beitritte pro Minute), maximal 2000 Räume und 50 Personen pro Raum, Größenlimit, Zeitlimit, Prüfung der Empfänger. Er sieht nur Verbindungs-Signale, nie Beiträge | Ein Vermittler kann Verbindungen verweigern. Er kann keine Inhalte fälschen |

## Umgebaute Clients (Forks)

Outernet ist Open Source. Jede Person kann die App ändern und eine eigene Version verteilen, auch mit böser Absicht. Das lässt sich nicht verhindern, und es gibt keine Zentrale, die so etwas sperren könnte. Der Schutz liegt deshalb woanders: **Die Prüfung steckt in jedem empfangenden Gerät.** Ein umgebauter Client kann nur Daten senden. Ob sie angenommen und angezeigt werden, entscheidet die App des Empfängers.

Daraus folgen diese Regeln für den Code:

1. **Nur Prüfungen beim Empfänger zählen.** Was ein Absender "freiwillig" begrenzt (gerundete Verbindungszahl, Bildgröße, Dateityp, Kosten), muss der Empfänger noch einmal prüfen. Das geschieht in `validate()`, `importObjs()` und beim Anzeigen.
2. **Jedes Feld hat Typ, Länge und Muster.** Neue Felder kommen zuerst in `validate()` und werden nur maskiert (`esc`) ausgegeben.
3. **Nichts Fremdes läuft als Code.** Texte werden maskiert, Bilder erst nach Prüfung von Kopfzeile, Typ und Größe angezeigt, Dateien nur als Download mit neutralem Typ und gesäubertem Namen, Seitenstände in einer Sandbox ohne Skripte.
4. **Alles ist begrenzt.** Objekte, Bytes, Objekte pro Autor, Tiefe der Antworten (20 Ebenen), Rechenaufwand der Auswertung (die Ähnlichkeitssuche prüft höchstens die neuesten 300 Kommentare) und Speicher.
5. **Ein Schlüssel ist kein Gewicht.** Auszeichnungen und Stimmen eines Schlüssels sind pro Beitrag begrenzt (Gratis: einmal pro Art, Premium: höchstens 3). Wer viele Schlüssel erzeugt, zahlt jedes Mal Rechenzeit.
6. **Zeit ist eng gefasst.** Zeitstempel dürfen höchstens 2 Stunden in der Zukunft liegen. Sonst könnte sich ein Beitrag einen Tag lang oben anheften.
7. **Nichts Geheimes im Austausch.** Es werden nur öffentliche, signierte Objekte gesendet. Ein böser Client kann daraus nichts Privates lesen, weil nichts Privates dabei ist.

Was ein Fork **nicht** verhindern kann: Er kann seine eigene Nutzerin täuschen (zum Beispiel Schlüssel abgreifen). Darum gilt: App nur aus der offiziellen Quelle laden und die Prüfsumme im Tab "Ich" mit der in den Release-Hinweisen vergleichen. Wer eine geänderte App von Fremden öffnet, ist selbst betroffen. Andere Geräte bleiben geschützt, solange sie die offizielle Version nutzen.

Restrisiken: Eine Flut gültiger, rechenaufwendig erzeugter Beiträge bleibt möglich (teuer, begrenzt, sichtbar eingeklappt). Die Verbindungszahl und Screenshots sind Selbstangaben. Browser-Lücken in der Bildverarbeitung kann die Prüfung der Kopfzeile nur verkleinern, nicht ausschließen.

## Was jede Person selbst tun kann

- **Ausblenden:** Einen Beitrag, eine Person oder eine ganze Unterhaltung lokal ausblenden. Das gilt nur auf dem eigenen Gerät und lässt sich unter „Ich“ zurücknehmen.
- **Bewerten:** Abwerten drückt schlechte Beiträge nach unten.
- **Eingeklapptes ansehen:** Verdächtiges ist nicht gelöscht, sondern eingeklappt und per Tippen sichtbar.

## Bewusst nicht gelöst

- **Wahrheit:** Niemand kann automatisch prüfen, ob etwas stimmt. Outernet liefert Herkunft (signiert, mit Zeitpunkt) und Hinweise auf Bot-Muster, nicht ein Urteil.
- **Anonym und Sybil-sicher gleichzeitig:** Ohne Konten oder Ausweise lassen sich Einmal-Identitäten nie ganz verhindern. Der Rechenaufwand macht sie nur teurer.
- **Zensur-Gegenstück:** Wer schlechte Inhalte ausblendet, wählt selbst. Es gibt keine globale Sperrliste.

## Nächste Schritte (nicht gebaut)

- Aufwand pro Beitrag adaptiv erhöhen, wenn viele neue Beiträge in kurzer Zeit auftauchen.
- Signierte, freiwillig abonnierbare Hinweislisten (Gemeinschaften pflegen eigene Sperrlisten).
- Unabhängige Sicherheitsprüfung und Test mit echten Geräten vor einem Einsatz mit sensiblen Inhalten.

## Getestet

`tests/test_security.py` (Angriffstests im Browser): 24 Prüfungen, darunter 17 feindliche Objekte, Einschleusen an der Prüfung vorbei, Duplikat- und Link-Flut, Pro-Autor-Limit, Speicher-Aufräumen, bösartige Gegenstelle über WebRTC, Ausblenden, Prüfsumme (Original, Markup- und Code-Änderung) und die Sperre durch die Content-Security-Policy.

## Screenshots und Verbindungszahl

- Screenshots (`root.shot`) und die Verbindungszahl (`comment.cn`) sind **Angaben des Absenders** und nicht überprüfbar. Ein Screenshot kann eine andere Seite zeigen, die Zahl kann übertrieben sein. Die Oberfläche beschriftet beides als „nicht geprüft“. Die Zahl wirkt nicht auf Rankings.
- Die Zahl ist auf eine gültige Ziffer gerundet und abschaltbar, damit sie nicht zum Wiedererkennen taugt. Ungerundete oder ungültige Werte werden beim Empfang verworfen (`tests/test_screenshot.py`).
- Der Screenshot-Dienst wird nur nach Zustimmung genutzt, bekommt nur öffentliche Adressen und die App sendet ihm keine Cookies oder Referrer.

`tests/test_hardening.py` (12 Prüfungen): Zeitfenster, Kommentarkette von 3000 Ebenen und 5000 Kommentare (schnell, Tiefe begrenzt), Bild-Bomben und falsche Bildtypen, gesäuberte Dateinamen, Begrenzung der Premium-Auszeichnungen, Schadcode in allen Textfeldern und präparierte Links.
