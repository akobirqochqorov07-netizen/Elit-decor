/**
 * scripts/obj2glb.mjs
 *
 * Converts OBJ files to GLB (binary glTF) for the 3D viewer.
 * Reads public/products/<slug>/downloads/<code>.obj
 * Writes public/products/<slug>/model.glb
 *
 * Usage:
 *   node scripts/obj2glb.mjs              # all products
 *   node scripts/obj2glb.mjs karniz-001   # single product
 *
 * Idempotent: skips conversion if model.glb already exists and is newer than .obj
 */

import { createRequire } from 'module';
import { readdir, stat } from 'node:fs/promises';
import { existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const obj2gltf = require('obj2gltf');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_DIR = path.resolve(__dirname, '../public/products');

async function processProduct(slug) {
  const downloadsDir = path.join(PRODUCTS_DIR, slug, 'downloads');
  const outPath = path.join(PRODUCTS_DIR, slug, 'model.glb');

  if (!existsSync(downloadsDir)) {
    console.log(`  [${slug}] No downloads/ folder — skipping`);
    return;
  }

  // Find first .obj file in downloads/
  const files = await readdir(downloadsDir);
  const objFile = files.find((f) => /\.obj$/i.test(f));

  if (!objFile) {
    console.log(`  [${slug}] No .obj file found — skipping`);
    return;
  }

  const objPath = path.join(downloadsDir, objFile);

  // Idempotency: skip if glb is newer than obj
  if (existsSync(outPath)) {
    const [objStat, glbStat] = await Promise.all([stat(objPath), stat(outPath)]);
    if (glbStat.mtimeMs >= objStat.mtimeMs) {
      console.log(`  [${slug}] model.glb is up-to-date — skipped`);
      return;
    }
  }

  console.log(`  [${slug}] Converting ${objFile} -> model.glb ...`);
  try {
    const glb = await obj2gltf(objPath, {
      binary: true,
      checkTransparency: false,
    });
    writeFileSync(outPath, glb);
    const kb = Math.round((await stat(outPath)).size / 1024);
    console.log(`  [${slug}] ✓ model.glb  ${kb} KB`);
  } catch (e) {
    console.error(`  [${slug}] ERROR: ${e.message}`);
  }
}

async function main() {
  const targetSlug = process.argv[2];

  let slugs;
  if (targetSlug) {
    slugs = [targetSlug];
  } else {
    const entries = await readdir(PRODUCTS_DIR, { withFileTypes: true });
    slugs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  }

  console.log(`\nConverting ${slugs.length} product(s)...\n`);
  for (const slug of slugs) {
    await processProduct(slug);
  }
  console.log('\nAll done.');
}

main();
