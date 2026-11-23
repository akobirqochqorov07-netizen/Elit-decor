/**
 * scripts/process_bortkarniz.mjs
 *
 * BortKarniz.rar dan barcha 26 ta bortkarnizni 5K Ultra-HD tiniqlikda qayta ishlaydi.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const obj2gltf = require('obj2gltf');

const SRC = process.argv[2] || '/tmp/bortkarniz_extract';
const IMG = path.resolve('public/images/bortkarnizlar');
const PRODUCTS = path.resolve('public/products');
const DATA = path.resolve('src/data');

const NAVY = { r: 21, g: 47, b: 64, alpha: 1 };
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

// Dizayner chizmalaridagi aniq o'lchamlar (mm): h — balandlik, w — chuqurlik
const PROFIL = {
  1: [150, 84], 2: [150, 82], 3: [151, 86], 4: [140, 84], 5: [121, 91], 6: [121, 91],
  7: [120, 83], 8: [120, 82], 9: [120, 80], 10: [107, 77], 11: [109, 69], 12: [75, 89],
  13: [99, 70], 14: [99, 71], 15: [80, 85], 16: [119, 55], 17: [90, 73], 18: [110, 54],
  19: [110, 54], 20: [80, 60], 21: [70, 61], 22: [70, 58], 23: [40, 55], 24: [50, 43],
  25: [40, 39], 26: [35, 34],
};

const GROUPS = [
  { id: 1, slug: 'bortkatalog-1-katta', nomi: 'Katta profil', test: (h) => h >= 115 },
  { id: 2, slug: 'bortkatalog-2-orta', nomi: "O'rta profil", test: (h) => h >= 70 && h < 115 },
  { id: 3, slug: 'bortkatalog-3-ixcham', nomi: 'Ixcham profil', test: (h) => h < 70 },
];

for (const d of ['', '_full', '_cutout', '_oq', '_profil']) {
  fs.mkdirSync(path.join(IMG, d), { recursive: true });
}

const folders = fs
  .readdirSync(SRC)
  .filter((f) => /^Bortkarniz_\d+$/.test(f))
  .sort();

console.log(`Topildi: ${folders.length} ta papka.`);

const files = {};
const profil = {};
const mahsulotlar = [];

for (const folder of folders) {
  const n = folder.split('_')[1];
  const num = parseInt(n, 10);
  const kod = `bortkarniz-${n}`;
  const bk = `BK-${n}`;
  const dir = path.join(SRC, folder);
  const blue = path.join(dir, `${folder}.jpg`);
  const png = path.join(dir, `${folder}.png`);
  const drawing = path.join(dir, `Bortkarniz (${num}).jpg`);

  // 1. Ko'k fon: kartochka uchun (1600px) va Lightbox uchun TO'LIQ 5K (5000px) Ultra-HD!
  await sharp(blue)
    .resize(1600, 1200, { fit: 'contain', background: NAVY })
    .jpeg({ quality: 94, mozjpeg: true })
    .toFile(path.join(IMG, `${kod}-kok.jpg`));

  // TO'LIQ 5000px original rezolyutsiyadagi WebP (Ultra-HD 4K/5K)
  await sharp(blue)
    .webp({ quality: 96, smartSubsample: false })
    .toFile(path.join(IMG, '_full', `${kod}.webp`));

  // 2. Shaffof fonsiz 5K Ultra-HD WebP (qorong'i blur studiya ko'rinishi uchun)
  await sharp(png)
    .webp({ quality: 96, alphaQuality: 100, smartSubsample: false })
    .toFile(path.join(IMG, '_cutout', `${kod}.webp`));

  // 3. Oq fon: to'liq 5000px Ultra-HD va kartochka uchun
  const white5kBuf = await sharp(png)
    .flatten({ background: WHITE })
    .toBuffer();

  await sharp(white5kBuf)
    .webp({ quality: 96, smartSubsample: false })
    .toFile(path.join(IMG, '_oq', `${kod}.webp`));

  await sharp(white5kBuf)
    .resize(1600, 1200, { fit: 'contain', background: WHITE })
    .jpeg({ quality: 94, mozjpeg: true })
    .toFile(path.join(IMG, `${kod}-oq.jpg`));

  // 3. Profil chizmasi
  if (fs.existsSync(drawing)) {
    await sharp(drawing).webp({ quality: 95 }).toFile(path.join(IMG, '_profil', `${kod}.webp`));
  }

  // 4. 3D fayllar
  const sub = path.join(dir, '3d');
  const subFiles = fs.existsSync(sub) ? fs.readdirSync(sub) : [];
  const dl = path.join(PRODUCTS, kod, 'downloads');
  fs.mkdirSync(dl, { recursive: true });
  const formats = [];
  for (const ext of ['3ds', 'max', 'obj', 'stl']) {
    const f = subFiles.find((x) => x.toLowerCase().endsWith(`.${ext}`));
    if (!f) continue;
    fs.copyFileSync(path.join(sub, f), path.join(dl, `${bk}.${ext}`));
    formats.push(ext);
  }

  const glbPath = path.join(PRODUCTS, kod, 'model.glb');
  let model = fs.existsSync(glbPath);
  if (!model && formats.includes('obj')) {
    try {
      const glb = await obj2gltf(path.join(dl, `${bk}.obj`), { binary: true, checkTransparency: false });
      fs.writeFileSync(glbPath, glb);
      model = true;
    } catch (e) {
      console.error(`[${kod}] GLB xato: ${e.message}`);
    }
  }
  files[kod] = { model, formats };

  const [h, w] = PROFIL[num] ?? [null, null];
  if (h) profil[kod] = { w, h };
  const g = GROUPS.find((x) => h !== null && x.test(h)) ?? GROUPS[1];
  mahsulotlar.push({
    kod,
    korsatiladigan_kod: bk,
    katalog: g.nomi,
    papka: g.slug,
    kok_fon: `${kod}-kok.jpg`,
    oq_fon: `${kod}-oq.jpg`,
    balandlik_mm: h,
    kenglik_mm: w,
    uzunlik_m: 2.0,
    narx_pm: null,
  });
  console.log(`[${kod}] 5K Ultra-HD tayyor (${h}×${w} mm, 5000px)`);
}

const kataloglar = GROUPS.map((g) => ({
  id: g.id,
  slug: g.slug,
  nomi: g.nomi,
  karnizlar: mahsulotlar.filter((m) => m.papka === g.slug).map((m) => m.kod),
}));

fs.writeFileSync(path.join(IMG, 'katalog.json'), JSON.stringify({ kataloglar, mahsulotlar }, null, 1));
fs.writeFileSync(path.join(DATA, 'bortkarniz-files.json'), JSON.stringify(files, null, 1));
fs.writeFileSync(path.join(DATA, 'bortkarniz-profil.json'), JSON.stringify(profil));
console.log(`\nBarcha 26 ta bortkarniz 5K Ultra-HD formatda muvaffaqiyatli tayyorlandi!`);
