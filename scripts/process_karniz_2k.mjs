/**
 * scripts/process_karniz_2k.mjs
 *
 * 83 ta karnizning 2K formatdagi (2400x1800) yangi render va shaffof PNG rasmlarini
 * RAR arxivlaridan olib, barcha tegishli papkalarga (katalog-*, _full, _cutout, _oq, _kok, _bej)
 * yuqori sifatda yangilaydi.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import sharp from 'sharp';

const RAR_DIR = process.argv[2] || '/Users/akobir/Desktop/Новая папка';
const IMG_DIR = path.resolve('public/images/karnizlar');
const KATALOG_JSON_PATH = path.join(IMG_DIR, 'katalog.json');

const NAVY = { r: 21, g: 47, b: 64, alpha: 1 };
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

// Barcha zarur papkalar mavjudligini ta'minlash
for (const d of ['_full', '_cutout', '_oq', '_kok', '_bej']) {
  fs.mkdirSync(path.join(IMG_DIR, d), { recursive: true });
}

if (!fs.existsSync(KATALOG_JSON_PATH)) {
  console.error(`Xato: ${KATALOG_JSON_PATH} topilmadi!`);
  process.exit(1);
}

const rawJson = JSON.parse(fs.readFileSync(KATALOG_JSON_PATH, 'utf-8'));
const mahsulotMap = new Map();
for (const m of rawJson.mahsulotlar) {
  mahsulotMap.set(m.kod, m);
}

console.log(`\n=== 83 ta Karniz 2K rasmlarini yangilash boshlandi ===`);
console.log(`Manba: ${RAR_DIR}`);
console.log(`Natija: ${IMG_DIR}\n`);

const total = 83;
let successCount = 0;
const errors = [];

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(walkDir(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

for (let i = 1; i <= total; i++) {
  const padNum = String(i).padStart(3, '0');
  const kod = `karniz-${padNum}`;
  const rarName = `Karniz_${padNum}.rar`;
  const rarPath = path.join(RAR_DIR, rarName);

  const m = mahsulotMap.get(kod);
  if (!m) {
    console.error(`[${kod}] katalog.json da topilmadi!`);
    errors.push({ kod, error: 'katalog.json da topilmadi' });
    continue;
  }

  if (!fs.existsSync(rarPath)) {
    console.error(`[${kod}] ${rarName} topilmadi: ${rarPath}`);
    errors.push({ kod, error: `${rarName} topilmadi` });
    continue;
  }

  const tmpDir = fs.mkdtempSync(`/tmp/karniz_${padNum}_`);

  try {
    // 1. RAR arxivini chiqarish
    execSync(`bsdtar -xf "${rarPath}" -C "${tmpDir}"`);

    // 2. Ichidagi JPG va PNG fayllarni topish
    const allFiles = walkDir(tmpDir);
    const jpgPath = allFiles.find(
      (f) => /\.(jpg|jpeg)$/i.test(f) && !f.toLowerCase().includes('profile')
    );
    const pngPath = allFiles.find(
      (f) => /\.png$/i.test(f) && !f.toLowerCase().includes('profile')
    );

    if (!jpgPath || !pngPath) {
      throw new Error(`JPG yoki PNG topilmadi (JPG: ${jpgPath}, PNG: ${pngPath})`);
    }

    const jpgBuf = fs.readFileSync(jpgPath);
    const pngBuf = fs.readFileSync(pngPath);

    const papkaDir = path.join(IMG_DIR, m.papka);
    fs.mkdirSync(papkaDir, { recursive: true });

    // 3. Ko'k fonli kartochka JPEG (TO'LIQ 2K 2400x1800)
    const cardKokPath = path.join(papkaDir, `${kod}-kok.jpg`);
    await sharp(jpgBuf)
      .jpeg({ quality: 95, mozjpeg: true })
      .toFile(cardKokPath);

    // 4. TO'LIQ 2K (2400x1800) WebP ko'k fonli render (_full va _kok uchun)
    const fullWebpPath = path.join(IMG_DIR, '_full', `${kod}.webp`);
    await sharp(jpgBuf)
      .webp({ quality: 96, smartSubsample: false })
      .toFile(fullWebpPath);

    const kokWebpPath = path.join(IMG_DIR, '_kok', `${kod}.webp`);
    await sharp(jpgBuf)
      .webp({ quality: 96, smartSubsample: false })
      .toFile(kokWebpPath);

    // 5. TO'LIQ 2K (2400x1800) Shaffof cutout WebP (_cutout uchun)
    const cutoutWebpPath = path.join(IMG_DIR, '_cutout', `${kod}.webp`);
    await sharp(pngBuf)
      .webp({ quality: 96, alphaQuality: 100, smartSubsample: false })
      .toFile(cutoutWebpPath);

    // 6. Oq fonli to'liq 2K WebP va kartochka JPEG (TO'LIQ 2K 2400x1800)
    const white2kBuf = await sharp(pngBuf)
      .flatten({ background: WHITE })
      .toBuffer();

    const oqWebpPath = path.join(IMG_DIR, '_oq', `${kod}.webp`);
    await sharp(white2kBuf)
      .webp({ quality: 96, smartSubsample: false })
      .toFile(oqWebpPath);

    const cardOqPath = path.join(papkaDir, `${kod}-oq.jpg`);
    await sharp(white2kBuf)
      .jpeg({ quality: 95, mozjpeg: true })
      .toFile(cardOqPath);

    // 7. karniz-001 uchun maxsus _bej
    if (kod === 'karniz-001') {
      const bejPath = path.join(IMG_DIR, '_bej', `${kod}.webp`);
      await sharp(pngBuf)
        .webp({ quality: 96, alphaQuality: 100, smartSubsample: false })
        .toFile(bejPath);
    }

    // 8. katalog.json dagi asl manba nomlarini yangilash
    m.asl_kok = path.basename(jpgPath);
    m.asl_oq = path.basename(pngPath);

    successCount++;
    console.log(
      `[${kod}] ✓ 2K (2400×1800) tayyor: ${m.papka}/${kod}-kok.jpg, _full, _cutout, _oq, _kok`
    );
  } catch (err) {
    console.error(`[${kod}] XATO: ${err.message}`);
    errors.push({ kod, error: err.message });
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (_) {}
  }
}

// katalog.json ni saqlash
fs.writeFileSync(KATALOG_JSON_PATH, JSON.stringify(rawJson, null, 1), 'utf-8');

console.log(`\n========================================`);
console.log(`Natija: ${successCount}/${total} karniz 2K formatda muvaffaqiyatli yangilandi!`);
if (errors.length > 0) {
  console.log(`Xatolar (${errors.length}):`, errors);
  process.exit(1);
} else {
  console.log(`Barcha 83 ta karniz 100% tayyor!`);
}
