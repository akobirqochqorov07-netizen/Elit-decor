import fs from 'node:fs';
import { capMask } from './match3d.mjs';
const ROOT = '/Users/akobir/Desktop/dikart';
for (const [kind, n, pf] of [['karniz', 83, 'karniz-profil.json'], ['bortkarniz', 26, 'bortkarniz-profil.json']]) {
  const prof = JSON.parse(fs.readFileSync(`${ROOT}/src/data/${pf}`, 'utf8'));
  for (let i = 1; i <= n; i++) {
    const kod = `${kind}-${String(i).padStart(3, '0')}`;
    let cm = capMask(kod, 'min');
    if (!cm.mask || cm.mask.reduce((a, b) => a + b, 0) < 30) cm = capMask(kod, 'max');
    const p = prof[kod];
    const cap = [cm.bw, cm.bh].sort((a, b) => a - b);
    const pr = [p.w, p.h].sort((a, b) => a - b);
    const e = [cap[0] / pr[0], cap[1] / pr[1]];
    console.log(kod, 'cap=' + cap.map((x) => x.toFixed(0)).join('x'), 'prof=' + pr.join('x'), 'ratio=' + e.map((x) => x.toFixed(2)).join('/'));
  }
}
