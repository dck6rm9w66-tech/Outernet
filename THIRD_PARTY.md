# Drittanbieter-Code

Diese Bibliotheken sind unverändert (minifiziert) in `src/vendor/` enthalten und werden beim Bauen in `web/app.html` eingebettet. Die App lädt zur Laufzeit nichts aus dem Netz.

| Bibliothek | Version | Lizenz | Zweck |
| --- | --- | --- | --- |
| [jsQR](https://github.com/cozmo/jsQR) | 1.4.0 | Apache-2.0 (`src/vendor/LICENSE.jsqr`) | QR-Codes mit der Kamera lesen |
| [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) | 2.0.4 | MIT (`src/vendor/LICENSE.qrcode-generator`) | QR-Codes zeichnen |

Alles andere (Kryptografie über WebCrypto, Komprimierung über CompressionStream, Verbindungen über WebRTC) nutzt Funktionen des Browsers.
