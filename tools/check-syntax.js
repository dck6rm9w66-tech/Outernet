// Prüft, ob alle Skripte in src/, relay/ und extension/ syntaktisch gültig sind (nur Node, keine Pakete).
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
let bad = 0, n = 0;
const check = (name, code) => { n++; try { new vm.Script(code, { filename: name }); } catch (e) { bad++; console.error('FEHLER', name, e.message); } };
const rd = f => fs.readFileSync(path.join(root, f), 'utf8');
check('src/early.js', rd('src/early.js'));
check('src/vendor/qrcode-generator.js', rd('src/vendor/qrcode-generator.js'));
check('src/vendor/jsqr.js', rd('src/vendor/jsqr.js'));
check('src/app.js', rd('src/app.js').replace('/*@TR@*/', '{}'));
for (const f of ['relay/server.js', 'extension/background.js', 'extension/options.js']) check(f, rd(f));
if (bad) process.exit(1); console.log('ok:', n, 'Dateien gültig');
