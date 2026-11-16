"""Gemeinsame Hilfen für die Browser-Tests (Playwright, Python)."""
import os, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
APP_PATH = str(ROOT / 'web' / 'app.html')
APP = 'file://' + APP_PATH
OUT = os.environ.get('OUT_DIR') or str(ROOT / 'tests' / 'out')
os.makedirs(OUT, exist_ok=True)
CHROME = {'executable_path': os.environ['CHROME']} if os.environ.get('CHROME') else {}
from playwright.sync_api import sync_playwright
def boot(b,seed):
    c=b.new_context(bypass_csp=True,viewport={'width':420,'height':860},locale='de',permissions=['camera'])
    pg=c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)+' @ '+str(getattr(e,'stack',''))[:400]))
    pg.goto(APP);pg.wait_for_selector('#ob .btn')
    if not seed: pg.evaluate("document.querySelector('#ob')&&0")
    for _ in range(4):
        if not seed and pg.locator('#obs').count(): pg.locator('#obs').uncheck()
        bt=pg.locator('#ob [data-ob]:not([data-ob=lang])').last;g=bt.get_attribute('data-ob')=='go'
        if g and not seed: pg.locator('#obs').uncheck()
        bt.click();pg.wait_for_timeout(300)
        if g:break
    pg.wait_for_function("document.querySelector('#ob').hidden",timeout=15000);pg.wait_for_timeout(400)
    return pg,errs
