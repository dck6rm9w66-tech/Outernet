# Outernet-Protokoll v1 (Entwurf)

Alle Objekte sind JSON, kanonisch serialisiert (sortierte Schlüssel), und tragen:

- `id` = SHA-256 des Objekts ohne `id`, `pow`, `sig`
- `pow` = Zahl, sodass SHA-256(`id:pow`) mit mindestens N Nullbits beginnt (Standard N=12)
- `sig` = Ed25519-Signatur über `{id, pow}` mit dem Schlüssel `author`

## Objekttypen

| `t` | Pflichtfelder | Zweck |
| --- | --- | --- |
| `root` | `title`, `anchor`, `geo`, `ts`, `snap`, `author` | Unveränderlicher Thread-Start. `anchor.kind` = `page`, `passage` oder `place`. `geo.gh` = Geohash (7). |
| `blob` | `data` (Base64), `id` = SHA-256(`data`) | HTML-Snapshot (max. 2 MB), nicht signiert (inhaltsadressiert). |
| `comment` | `thread`, `parent`, `body`, `ts` (auf Minute gerundet) | Beitrag. |
| `vote` | `thread`, `target`, `dir` (+1/-1) | Pfeil hoch/runter auf Thread oder Kommentar. Pro Autor und Ziel zählt die neueste Stimme. |
| `award` | `thread`, `target`, `kind`, `tier` | Auszeichnung. `tier` = `free` (einmal pro Autor und Art) oder `premium` (besondere Auszeichnung: Silber, Gold, Platin). Es gibt keine Belege und keine Zahlung. |

## Schlüssel und Anonymität

- Master-Schlüssel nur lokal. Pro Thread wird `HKDF(master, "thread:"+threadId)` abgeleitet, daher sind Threads nicht verknüpfbar.
- Der Starter nutzt den zufälligen Root-Schlüssel des Threads weiter und erscheint dadurch als OP.

## Austausch (ohne Server)

Objekte wandern von Gerät zu Gerät: per QR-Bildfolge (`RN2`, siehe unten; `RN1` wird noch gelesen), per WLAN (WebRTC-Datenkanal; Signalisierung über den optionalen Vermittler `relay/` oder über QR `RW1|…` beziehungsweise Text `RWT|…`) oder als Datei.
Beim WLAN-Weg gilt: `inv {ids[]}` → `want {ids[]}` → `obj {o}` → `sent` → `bye`. Reihenfolge: Roots, Blobs, Kommentare, Votes, Awards. Jedes Objekt wird beim Empfang geprüft (Signatur, Proof-of-Work, Form).

## Ranking

- **Threads:** Aktuell (letzte Aktivität), Hot (log Aktivität + Zeit), Meistdiskutiert (Teilnehmer×3 + Kommentare), Kontrovers ((up+down)^(min/max)), In der Nähe (Haversine).
- **Kommentare:** `best` = Wilson-Untergrenze (z≈1,28) + Award-Bonus; Bonus = min(0,25; 0,06·log2(1 + Σ Gewicht)). Gewichte: kostenlos 1, Silber 3, Gold 8, Platin 20. Die Gewichte sind begrenzt, ein einzelner Beitrag lässt sich also nur wenig anheben.

## Besondere Auszeichnungen

Sie sind kostenlos. Jedes Gerät schaltet sie lokal nach und nach frei: Als Austausch zählt ein Austausch (QR, WLAN oder Datei), der neue Beiträge brachte, höchstens einer je zehn Minuten. Silber nach 2, Gold nach 5, Platin nach 12 gezählten Austauschen, danach jeweils wieder. Freigeschaltetes sammelt sich an, bis es vergeben wird. Die Zähler liegen nur auf dem Gerät. Da es keine Zentrale gibt, kann niemand fremde Zähler prüfen. Der Schutz davor ist das gedeckelte Gewicht im Ranking.

## Offene Punkte

Zeugen-Zeitstempel, Erasure Coding, Medien-Chunks, Präsenzbeweis, anonyme Rate-Limit-Credentials, Moderationslisten.

## Themenbereich (`sub`)

`{t:'sub',v:1,name,desc,rules,ts,author,salt}` mit `name` 2–30, `desc` und `rules` je 10–500 Zeichen, signiert mit dem Root-Schlüssel (HKDF aus Master und `salt`). Ein Root kann `sub: <id>` tragen. Fehlt das Objekt lokal, zeigt die App den Bereich als unbekannt und die Unterhaltung bleibt lesbar.

## Vermittler (`relay/`)

`GET /v1/join?id&name&word` öffnet einen Server-Sent-Events-Strom (`peers`, `join`, `leave`, `msg`). `POST /v1/send` `{word,id,to,data}` reicht eine Nachricht an eine Person im selben Raum weiter. Raum = Hash aus öffentlicher Adresse (private Adressen: `lan`) und Wort. Nachrichten der App: `ready {acc:[ids]}` nach der Bestätigung, dann `offer {sdp}` und `answer {sdp}`. Verbunden wird nur, wenn jede Seite in der `acc`-Liste der anderen steht. Die kleinere Id sendet das Angebot.

## Teilübertragung und Fortsetzen (QR, WLAN, Datei)

Jede Übertragung besteht aus **fertigen Einzelpaketen**. Was angekommen ist, wird sofort geprüft, gespeichert und angezeigt, auch wenn die Verbindung abbricht.

- **Reihenfolge:** Unterhaltungen von neu nach alt, je Unterhaltung erst Titel, dann Kommentare, Auszeichnungen und Stimmen, danach die zugehörigen Anhänge.
- **QR (`RN2|sid|i|n|z|daten`):** Jedes Bild ist ein eigenständiges Paket mit ganzen Objekten (oder einem Bruchstück `{k,i,n,d}` eines großen Objekts, ca. 380 Zeichen). Bilder dürfen in beliebiger Reihenfolge und mehrfach kommen. Die Liste der erhaltenen Bilder steht im Protokoll (`rxlog`), daher geht es nach Abbruch oder Neuladen am gleichen Bild weiter. `RN1` wird weiter gelesen.
- **WLAN/Peer:** Das Inventar enthält je Objekt einen Gruppenschlüssel `k` (Typ und Unterhaltung). Der Empfänger fordert nur Fehlendes an, bei großen Objekten mit Startfragment `[id, from]`. Bruchstücke liegen im IndexedDB-Store `p` (Version 2), bis das Objekt vollständig ist und seine Prüfsumme stimmt.
- **Ich-Tab:** „Empfangen und Fortsetzen“ zeigt je Austausch Balken, Teile-Raster (QR) und je Unterhaltung, wie viel schon da ist. `gap` merkt sich offene Teile je Unterhaltung. Unvollständige Unterhaltungen tragen ein Etikett.
- Alle Prüfungen (Signatur, PoW, Limits) gelten unverändert pro Objekt.

## Datenmenge und Zurückstellen

- Das Inventar (`inv`) enthält je Objekt den Gruppenschlüssel `k` und für Anhänge die Größe `z`.
- Der Empfänger entscheidet je Anhang anhand seiner Einstellungen (`att`: alle, nur kleine bis 300 KB, keine; `cap`: Megabyte je Austausch). Abgelehnte Anhänge werden nicht angefordert, sondern in `defer` vermerkt.
- Beim QR-Weg werden Bilder mit Anhang-Bruchstücken, die abgelehnt wurden, nicht als empfangen gezählt. Sie kommen bei einem späteren Durchlauf erneut in Frage.
- „Beim nächsten Austausch laden“ setzt `pull`. Im nächsten Austausch gelten die Grenzen nicht, danach wird `pull` zurückgesetzt. Das Nachladen ist also nur Beginn eines normalen Austauschs mit anderer Entscheidung, kein eigenes Protokoll.
