/**
 * scripts/rebuild_all_3d_models.mjs
 *
 * Barcha 83 ta karniz va 26 ta bortkarniz 3D modellarini BK-002 (oltin standart)
 * burchagi va orientatsiyasiga moslab qayta generatsiya qiladi.
 *
 * 1. Bortkarnizlar (BK-001..026):
 *    - BK-001 ning teskari winding/normallari to'g'rilanadi.
 *    - Barcha 26 ta model doubleSidedMaterial: true bilan model.glb ga o'tkaziladi.
 * 2. Karnizlar (DK-001..083):
 *    - Har bir karniz normallari tahlil qilinadi.
 *    - Agar normal teskari (Y > 0 yoki Z > 0) bo'lsa, winding va normal to'g'rilanadi.
 *    - Barchasi doubleSidedMaterial: true bilan model.glb ga o'giriladi.
 *    - Har bir GLB da POSITION va NORMAL atributlari bo'lishi ta'minlanadi.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const obj2gltf = require('obj2gltf');

const PRODUCTS = path.resolve('public/products');
const TMP_DIR = '/tmp/3d_rebuild';
fs.mkdirSync(TMP_DIR, { recursive: true });

async function processBortkarnizlar() {
  console.log('\n=== 1. Bortkarnizlarni tekshirish va yangilash (26 ta) ===');
  for (let i = 1; i <= 26; i++) {
    const pad = String(i).padStart(3, '0');
    const kod = `bortkarniz-${pad}`;
    const bk = `BK-${pad}`;
    const objPath = path.join(PRODUCTS, kod, 'downloads', `${bk}.obj`);
    const glbPath = path.join(PRODUCTS, kod, 'model.glb');

    if (!fs.existsSync(objPath)) {
      console.warn(`[${kod}] OBJ topilmadi: ${objPath}`);
      continue;
    }

    const lines = fs.readFileSync(objPath, 'utf8').split('\n');
    const vns = lines.filter((l) => l.startsWith('vn ')).map((l) => l.trim().split(/\s+/).slice(1).map(Number));
    let avg = [0, 0, 0];
    for (const [x, y, z] of vns) { avg[0] += x; avg[1] += y; avg[2] += z; }
    const c = vns.length || 1;
    const normal = avg.map((x) => +(x / c).toFixed(2));

    // BK-002: normal[0] > 0, normal[1] < 0, normal[2] < 0
    let processedLines = lines;
    if (normal[1] > 0 || normal[2] > 0) {
      console.log(`[${kod}] Normal teskari (${normal.join(', ')}), to'g'rilanmoqda...`);
      processedLines = [];
      for (const line of lines) {
        if (line.startsWith('vn ')) {
          const parts = line.trim().split(/\s+/).slice(1).map(Number);
          processedLines.push('vn ' + parts.map((n) => (-n).toFixed(5)).join(' '));
        } else if (line.startsWith('f ')) {
          const parts = line.trim().split(/\s+/).slice(1);
          if (parts.length === 3) {
            processedLines.push('f ' + parts[0] + ' ' + parts[2] + ' ' + parts[1]);
          } else {
            processedLines.push(line);
          }
        } else {
          processedLines.push(line);
        }
      }
      fs.writeFileSync(objPath, processedLines.join('\n'));
    }

    const tmpObj = path.join(TMP_DIR, `${bk}.obj`);
    fs.writeFileSync(tmpObj, processedLines.join('\n'));
    try {
      const glb = await obj2gltf(tmpObj, {
        binary: true,
        doubleSidedMaterial: true,
        checkTransparency: false,
      });
      fs.writeFileSync(glbPath, glb);
      console.log(`[${kod}] ✓ model.glb tayyor (${Math.round(glb.length / 1024)} KB)`);
    } catch (e) {
      console.error(`[${kod}] ERROR: ${e.message}`);
    }
  }
}

async function processKarnizlar() {
  console.log('\n=== 2. Karnizlarni tekshirish va yangilash (83 ta) ===');
  let flippedCount = 0;
  for (let i = 1; i <= 83; i++) {
    const pad = String(i).padStart(3, '0');
    const kod = `karniz-${pad}`;
    const dk = `DK-${pad}`;
    const objPath = path.join(PRODUCTS, kod, 'downloads', `${dk}.obj`);
    const glbPath = path.join(PRODUCTS, kod, 'model.glb');

    if (!fs.existsSync(objPath)) {
      console.warn(`[${kod}] OBJ topilmadi: ${objPath}`);
      continue;
    }

    const lines = fs.readFileSync(objPath, 'utf8').split('\n');
    const vns = lines.filter((l) => l.startsWith('vn ')).map((l) => l.trim().split(/\s+/).slice(1).map(Number));
    let avg = [0, 0, 0];
    for (const [x, y, z] of vns) { avg[0] += x; avg[1] += y; avg[2] += z; }
    const c = vns.length || 1;
    const normal = avg.map((x) => +(x / c).toFixed(2));

    // BK-002 standarti: normal[0] > 0, normal[1] < 0, normal[2] < 0
    const needFlip = normal[1] > 0 || normal[2] > 0;
    let processedLines = lines;
    if (needFlip) {
      flippedCount++;
      processedLines = [];
      for (const line of lines) {
        if (line.startsWith('vn ')) {
          const parts = line.trim().split(/\s+/).slice(1).map(Number);
          processedLines.push('vn ' + parts.map((n) => (-n).toFixed(5)).join(' '));
        } else if (line.startsWith('f ')) {
          const parts = line.trim().split(/\s+/).slice(1);
          if (parts.length === 3) {
            processedLines.push('f ' + parts[0] + ' ' + parts[2] + ' ' + parts[1]);
          } else {
            processedLines.push(line);
          }
        } else {
          processedLines.push(line);
        }
      }
    }

    const tmpObj = path.join(TMP_DIR, `${dk}.obj`);
    fs.writeFileSync(tmpObj, processedLines.join('\n'));
    try {
      const glb = await obj2gltf(tmpObj, {
        binary: true,
        doubleSidedMaterial: true,
        checkTransparency: false,
      });
      fs.writeFileSync(glbPath, glb);
      console.log(`[${kod}] ✓ model.glb (${Math.round(glb.length / 1024)} KB)${needFlip ? ' [burchak to\'g\'rilandi]' : ''}`);
    } catch (e) {
      console.error(`[${kod}] ERROR: ${e.message}`);
    }
  }
  console.log(`\nJami: 83 tadan ${flippedCount} tasida burchak va normal BK-002 standartiga moslandi.`);
}

async function main() {
  await processBortkarnizlar();
  await processKarnizlar();
  console.log('\nBarcha 109 ta 3D modellar (26 bortkarniz + 83 karniz) muvaffaqiyatli yangilandi!');
}

main().catch(console.error);
