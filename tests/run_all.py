#!/usr/bin/env python3
"""Startet alle Browser-Tests nacheinander. Voraussetzung: pip install playwright && playwright install chromium
Optional: CHROME=/pfad/zu/chrome. Schnelltest ohne Übersetzungsprüfung: python3 tests/run_all.py --fast"""
import subprocess, sys, os, time, re, pathlib
here = pathlib.Path(__file__).resolve().parent
env = dict(os.environ)
tests = ['test_app', 'test_security', 'test_qr', 'test_resume', 'test_attachments', 'test_wlan_codes', 'test_nearby', 'test_subs', 'test_ux']
if '--fast' not in sys.argv: tests.append('test_i18n')
relay = subprocess.Popen(['node', str(here.parent / 'relay' / 'server.js')], env={**env, 'PORT': '8799'}, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.2); bad = []
try:
    for t in tests:
        r = subprocess.run([sys.executable, str(here / (t + '.py'))], capture_output=True, text=True, timeout=900, env=env)
        out = r.stdout + r.stderr
        m = re.search(r'ERGEBNIS (\d+) / (\d+)', out)
        ok = r.returncode == 0 and not re.search(r'^FAIL', out, re.M) and (not m or m.group(1) == m.group(2))
        print(('ok   ' if ok else 'FAIL ') + t); 
        if not ok: bad.append(t); print(out[-1500:])
    r = subprocess.run(['node', str(here / 'test_relay.js')], capture_output=True, text=True, timeout=120)
    print(('ok   ' if r.returncode == 0 else 'FAIL ') + 'test_relay'); 
    if r.returncode: bad.append('test_relay'); print((r.stdout + r.stderr)[-1500:])
finally:
    relay.terminate()
sys.exit(1 if bad else 0)
