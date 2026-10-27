/**
 * scripts/optimize-images.mjs
 *
 * Idempotent image pipeline for product assets.
 * Reads public/products/<slug>/source/ and writes optimised variants
 * directly into public/products/<slug>/.
 *
 * Outputs:
 *   card.webp   – 800×800 square, transparent bg, ~10 % padding, centred
 *   main.webp   – 1600 px wide, transparent bg, ~6 % padding
 *   thumb.webp  – 160×120, transparent bg, padded
 *   og.jpg      – 1200×630, dark-blue bg (#152F40), product centred
 *
 * If interior.* or profile.* exist in source/ they are also converted to WebP.
 * downloads/ and model.glb are never touched.
 *
 * Usage:  node scripts/optimize-images.mjs [slug]
 *   slug is optional; without it all product folders are processed.
 */

import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_DIR = path.resolve(__dirname, '../public/products');
const BG_DARK = { r: 10, g: 39, b: 52, alpha: 1 }; // #0a2734 — dikart dark blue

// ── helpers ──────────────────────────────────────────────────────────────────

/**
 * Trim transparent edges, then add symmetric padding (fraction of longer side).
 * Returns a PNG Buffer with alpha channel.
 */
async function trimAndPad(inputPath, paddingFraction = 0.08) {
  // Step 1: trim to content bounds
  const trimmed = await sharp(inputPath)
    .trim({ threshold: 10 })
    .png()
    .toBuffer();

  // Step 2: get dimensions after trim
  const { width, height } = await sharp(trimmed).metadata();
  const pad = Math.round(Math.max(width, height) * paddingFraction);

  // Step 3: extend with transparent padding
  return sharp(trimmed)
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

/**
 * Resize to fit within a box, keeping aspect ratio (no crop).
 * Returns PNG Buffer.
 */
async function fitInBox(buf, w, h) {
  return sharp(buf)
    .resize(w, h, { fit: 'inside', withoutEnlargement: false })
    .png()
    .toBuffer();
}

/**
 * Place buf centred on a transparent canvas of exactly w×h.
 * Returns PNG Buffer.
 */
async function centreOnCanvas(buf, w, h) {
  const meta = await sharp(buf).metadata();
  const top = Math.floor((h - meta.height) / 2);
  const left = Math.floor((w - meta.width) / 2);
  return sharp({
    create: { width: w, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: buf, top, left }])
    .png()
    .toBuffer();
}

/** KB helper */
async function kbOf(filePath) {
  const s = await stat(filePath);
  return Math.round(s.size / 1024);
}

/** Find first file matching base name (any extension) in a dir */
async function findFile(dir, baseName) {
  const exts = ['.png', '.jpg', '.jpeg', '.webp', '.PNG', '.JPG', '.JPEG'];
  for (const ext of exts) {
    const p = path.join(dir, baseName + ext);
    if (existsSync(p)) return p;
  }
  return null;
}

// ── per-product processing ────────────────────────────────────────────────────

async function processProduct(slug) {
  const productDir = path.join(PRODUCTS_DIR, slug);
  const sourceDir = path.join(productDir, 'source');

  if (!existsSync(sourceDir)) {
    console.warn(`  [${slug}] source/ not found — skipping`);
    return;
  }

  // Find main source PNG (karniz_001.png, rozetka_001.png, etc.)
  const sourceFiles = await readdir(sourceDir);
  const mainSourceFile = sourceFiles.find(
    (f) => /\.(png|PNG)$/.test(f) && !f.startsWith('interior') && !f.startsWith('profile')
  );

  if (!mainSourceFile) {
    console.warn(`  [${slug}] No source PNG found in source/ — skipping`);
    return;
  }

  const sourcePath = path.join(sourceDir, mainSourceFile);
  console.log(`  [${slug}] Source: ${mainSourceFile}`);

  // 1. Trim + pad the source (shared base for card/main/thumb)
  const padded = await trimAndPad(sourcePath, 0.08);

  // ── card.webp: 800×800 square, transparent ─────────────────────────────────
  const cardPath = path.join(productDir, 'card.webp');
  const fitted800 = await fitInBox(padded, 720, 720); // leave room for 10% pad
  const card800 = await centreOnCanvas(fitted800, 800, 800);
  await sharp(card800).webp({ quality: 82 }).toFile(cardPath);
  console.log(`  [${slug}] card.webp  ${await kbOf(cardPath)} KB`);

  // ── main.webp: 1600 px wide, transparent ──────────────────────────────────
  const mainPath = path.join(productDir, 'main.webp');
  const paddedMain = await trimAndPad(sourcePath, 0.06);
  const resizedMain = await sharp(paddedMain)
    .resize(1600, null, { fit: 'inside', withoutEnlargement: false })
    .png()
    .toBuffer();
  await sharp(resizedMain).webp({ quality: 85 }).toFile(mainPath);
  console.log(`  [${slug}] main.webp  ${await kbOf(mainPath)} KB`);

  // ── thumb.webp: 160×120 ───────────────────────────────────────────────────
  const thumbPath = path.join(productDir, 'thumb.webp');
  const paddedThumb = await trimAndPad(sourcePath, 0.06);
  const fittedThumb = await fitInBox(paddedThumb, 140, 104);
  const thumb160 = await centreOnCanvas(fittedThumb, 160, 120);
  await sharp(thumb160).webp({ quality: 75 }).toFile(thumbPath);
  console.log(`  [${slug}] thumb.webp ${await kbOf(thumbPath)} KB`);

  // ── og.jpg: 1200×630, dark-blue bg ────────────────────────────────────────
  const ogPath = path.join(productDir, 'og.jpg');
  // Product occupies ~60% of canvas height
  const fittedOg = await fitInBox(padded, 700, 480);
  const bgCanvas = await sharp({
    create: { width: 1200, height: 630, channels: 3, background: BG_DARK },
  })
    .jpeg()
    .toBuffer();
  const metaFitted = await sharp(fittedOg).metadata();
  const ogTop = Math.floor((630 - metaFitted.height) / 2);
  const ogLeft = Math.floor((1200 - metaFitted.width) / 2);
  await sharp(bgCanvas)
    .composite([{ input: fittedOg, top: ogTop, left: ogLeft, blend: 'over' }])
    .jpeg({ quality: 88 })
    .toFile(ogPath);
  console.log(`  [${slug}] og.jpg     ${await kbOf(ogPath)} KB`);

  // ── optional: interior.* ──────────────────────────────────────────────────
  const interiorSrc = await findFile(sourceDir, 'interior');
  if (interiorSrc) {
    const intPath = path.join(productDir, 'interior.webp');
    await sharp(interiorSrc)
      .resize(1600, null, { fit: 'inside', withoutEnlargement: false })
      .webp({ quality: 85 })
      .toFile(intPath);
    console.log(`  [${slug}] interior.webp ${await kbOf(intPath)} KB`);
  } else {
    console.log(`  [${slug}] interior.*: not found — skipped`);
  }

  // ── optional: profile.* ───────────────────────────────────────────────────
  const profileSrc = await findFile(sourceDir, 'profile');
  if (profileSrc) {
    const profPath = path.join(productDir, 'profile.webp');
    await sharp(profileSrc)
      .resize(800, null, { fit: 'inside', withoutEnlargement: false })
      .webp({ quality: 85 })
      .toFile(profPath);
    console.log(`  [${slug}] profile.webp  ${await kbOf(profPath)} KB`);
  } else {
    console.log(`  [${slug}] profile.*: not found — skipped`);
  }

  console.log(`  [${slug}] ✓ Done\n`);
}

// ── entry point ───────────────────────────────────────────────────────────────

async function main() {
  const targetSlug = process.argv[2]; // optional: node optimize-images.mjs karniz-001

  let slugs;
  if (targetSlug) {
    slugs = [targetSlug];
  } else {
    const entries = await readdir(PRODUCTS_DIR, { withFileTypes: true });
    slugs = entries
      .filter((e) => e.isDirectory() && e.name !== '.') 
      .map((e) => e.name);
  }

  console.log(`\nProcessing ${slugs.length} product(s)…\n`);
  for (const slug of slugs) {
    await processProduct(slug).catch((e) =>
      console.error(`  [${slug}] ERROR: ${e.message}`)
    );
  }
  console.log('All done.');
}

main();
