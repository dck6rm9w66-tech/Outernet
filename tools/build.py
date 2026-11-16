#!/usr/bin/env python3
"""Baut aus src/ die einzelne Datei web/app.html (keine Abhängigkeiten, nur Python 3).

Aufruf:  python3 tools/build.py            -> schreibt web/app.html
         python3 tools/build.py --check    -> prüft, ob web/app.html zum Quellcode passt
"""
import json, re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / 'src', ROOT / 'web' / 'app.html'

def build():
    tpl = (SRC / 'index.html').read_text(encoding='utf-8')
    def inc(m):
        body = (SRC / m.group(1)).read_text(encoding='utf-8')
        if m.group(1) == 'app.js':
            tr = json.loads((SRC / 'i18n' / 'tr.json').read_text(encoding='utf-8'))
            for k, v in tr.items():
                assert isinstance(v, list) and len(v) == 5 and all(isinstance(x, str) for x in v), 'Übersetzung unvollständig: ' + k
            body = body.replace('/*@TR@*/', json.dumps(tr, ensure_ascii=False), 1)
        return body
    return re.sub(r'\{\{([a-zA-Z0-9_./-]+)\}\}', inc, tpl)

if __name__ == '__main__':
    out = build()
    if '--check' in sys.argv:
        if OUT.read_text(encoding='utf-8') != out:
            sys.exit('web/app.html passt nicht zu src/. Bitte "python3 tools/build.py" ausführen.')
        print('ok: web/app.html ist aktuell')
    else:
        OUT.write_text(out, encoding='utf-8'); print('geschrieben:', OUT, len(out), 'Zeichen')
