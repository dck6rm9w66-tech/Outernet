#!/usr/bin/env python3
"""Gegenstück zu build.py: Übernimmt Änderungen aus web/app.html zurück nach src/.
Nützlich, wenn du die gebaute Datei direkt bearbeitet oder eine fremde Version einliest.
Nur für app.js und i18n/tr.json; Vendor-Bibliotheken und Vorlage bleiben unverändert."""
import json, re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
s = (ROOT / 'web' / 'app.html').read_text(encoding='utf-8')
tpl = (ROOT / 'src' / 'index.html').read_text(encoding='utf-8')
# Position des app.js-Platzhalters: alles davor und danach in der Vorlage muss gleich bleiben
pre, post = tpl.split('{{app.js}}')
import re as _re
def fill(t):  # Vendor und CSS einsetzen
    return _re.sub(r'\{\{([a-zA-Z0-9_./-]+)\}\}', lambda m: (ROOT / 'src' / m.group(1)).read_text(encoding='utf-8'), t)
pre_f, post_f = fill(pre), post
assert s.startswith(pre_f) and s.endswith(post_f), 'Struktur außerhalb von app.js wurde verändert.'
body = s[len(pre_f):len(s) - len(post_f)]
m = re.search(r"const TR=(\{.*?\});\nconst PAT=", body, re.S)
json.dump(json.loads(m.group(1)), open(ROOT / 'src' / 'i18n' / 'tr.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
(ROOT / 'src' / 'app.js').write_text(body[:m.start(1)] + '/*@TR@*/' + body[m.end(1):], encoding='utf-8')
print('src/app.js und src/i18n/tr.json aktualisiert')
