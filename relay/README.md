# Outernet-Vermittler (optional)

Ein winziger Dienst, damit sich Handys im selben WLAN **ohne Textcode** finden. Die App fragt ihn, wer im selben Netz ist. Jede Person bestätigt dann per Knopf den Austausch mit X Personen. Die Daten fließen danach direkt von Handy zu Handy (WebRTC).

Was der Vermittler sieht: zufällige Kurznamen und Verbindungsnachrichten (WebRTC-Signale mit Netzwerkadressen). Beiträge sieht und speichert er nie. Er schreibt nichts auf die Platte und führt kein Protokoll.

## Start

```
node server.js            # Port 8787
PORT=9000 node server.js
TRUST_PROXY=1 node server.js   # hinter nginx, Caddy oder Cloudflare
```

Node 18 oder neuer, keine Abhängigkeiten. Liegt `../web/app.html` daneben, liefert der Vermittler die App unter `/` gleich mit aus. Dann findet sie ihn von selbst.

## Wer landet im selben Raum?

- Öffentlicher Betrieb: Handys mit derselben öffentlichen Internet-Adresse (also hinter demselben Router). IPv6 zählt pro /64.
- Betrieb im eigenen WLAN (zum Beispiel Raspberry Pi): Alle privaten Adressen teilen sich einen Raum.
- Zusätzlich lässt sich in der App ein „gleiches Wort“ eingeben. Wer dasselbe Wort tippt, landet im selben Raum, falls die Adressen nicht passen.

## In der App

Teilen → Offline teilen → WLAN → „In der Nähe suchen“. Beim ersten Mal die Adresse des Vermittlers eintragen (zum Beispiel `https://relay.example.org`). Läuft die App von diesem Vermittler, entfällt das.

Wird die App über https geöffnet, braucht der Vermittler ebenfalls https.

## Grenzen

Höchstens 50 Personen pro Raum, 20 Verbindungen pro Adresse, 240 Nachrichten pro Minute und Person. Ohne Internet (oder ohne erreichbaren Vermittler) bleibt der Weg mit Code.
