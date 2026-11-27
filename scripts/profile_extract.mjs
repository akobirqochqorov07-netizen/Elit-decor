import fs from 'node:fs';
import sharp from 'sharp';

function boxMorph(bin, W, H, r, dilate) {
  const I = new Int32Array((W + 1) * (H + 1));
  for (let y = 0; y < H; y++) { let row = 0; for (let x = 0; x < W; x++) { row += bin[y * W + x]; I[(y + 1) * (W + 1) + x + 1] = I[y * (W + 1) + x + 1] + row; } }
  const out = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const x0 = Math.max(0, x - r), x1 = Math.min(W - 1, x + r), y0 = Math.max(0, y - r), y1 = Math.min(H - 1, y + r);
    const s = I[(y1 + 1) * (W + 1) + x1 + 1] - I[y0 * (W + 1) + x1 + 1] - I[(y1 + 1) * (W + 1) + x0] + I[y0 * (W + 1) + x0];
    const area = (x1 - x0 + 1) * (y1 - y0 + 1);
    out[y * W + x] = dilate ? (s > 0 ? 1 : 0) : (s === area ? 1 : 0);
  }
  return out;
}

function largestCC(mask, W, H) {
  const lab = new Int32Array(W * H); let best = 0, bestId = 0, id = 0;
  const st = [];
  for (let i = 0; i < W * H; i++) if (mask[i] && !lab[i]) {
    id++; let cnt = 0; st.length = 0; st.push(i); lab[i] = id;
    while (st.length) {
      const c = st.pop(); cnt++; const x = c % W, y = (c / W) | 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const ni = ny * W + nx;
        if (mask[ni] && !lab[ni]) { lab[ni] = id; st.push(ni); }
      }
    }
    if (cnt > best) { best = cnt; bestId = id; }
  }
  const out = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) if (lab[i] === bestId) out[i] = 1;
  return out;
}

function fillHoles(mask, W, H) {
  const bg = new Uint8Array(W * H); const st = [];
  const push = (x, y) => { const i = y * W + x; if (!mask[i] && !bg[i]) { bg[i] = 1; st.push(i); } };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (st.length) {
    const c = st.pop(); const x = c % W, y = (c / W) | 0;
    if (x > 0) push(x - 1, y); if (x < W - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < H - 1) push(x, y + 1);
  }
  const out = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) out[i] = bg[i] ? 0 : 1;
  return out;
}

// Moore boundary trace (8-connected), returns ordered pixel list
function traceBoundary(mask, W, H) {
  let sx = -1, sy = -1;
  outer: for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (mask[y * W + x]) { sx = x; sy = y; break outer; }
  if (sx < 0) return [];
  const dirs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const at = (x, y) => (x >= 0 && y >= 0 && x < W && y < H && mask[y * W + x] ? 1 : 0);
  const pts = [[sx, sy]];
  let cx = sx, cy = sy, d = 6; // came from above-left region
  let guard = 0;
  while (guard++ < 2_000_000) {
    let found = false;
    for (let k = 0; k < 8; k++) {
      const nd = (d + 6 + k) % 8; // start search backtrack+1
      const nx = cx + dirs[nd][0], ny = cy + dirs[nd][1];
      if (at(nx, ny)) { cx = nx; cy = ny; d = nd; found = true; break; }
    }
    if (!found) break;
    if (cx === sx && cy === sy) break;
    pts.push([cx, cy]);
  }
  return pts;
}

function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  const dist = (p, a, b) => {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const l = dx * dx + dy * dy;
    if (!l) return Math.hypot(p[0] - a[0], p[1] - a[1]);
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l));
    return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
  };
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop(); let md = 0, mi = -1;
    for (let i = a + 1; i < b; i++) { const d = dist(pts[i], pts[a], pts[b]); if (d > md) { md = d; mi = i; } }
    if (md > eps && mi > 0) { keep[mi] = 1; stack.push([a, mi], [mi, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

export async function extractProfile(file, { eps = 1.4, openR = 3, thr = 170 } = {}) {
  const { data, info } = await sharp(file).flatten({ background: '#fff' }).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, C = info.channels;
  const dark = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) dark[i] = (data[i * C] + data[i * C + 1] + data[i * C + 2]) / 3 < thr ? 1 : 0;
  const darkOpen = boxMorph(boxMorph(dark, W, H, +(process.env.DR || 1), false), W, H, +(process.env.DR || 1), true);
  const closeD = boxMorph(darkOpen, W, H, 1, true);
  // flood-fill background from border through non-dark
  const bg = new Uint8Array(W * H); const st = [];
  const push = (x, y) => { const i = y * W + x; if (!closeD[i] && !bg[i]) { bg[i] = 1; st.push(i); } };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (st.length) {
    const c = st.pop(); const x = c % W, y = (c / W) | 0;
    if (x > 0) push(x - 1, y); if (x < W - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < H - 1) push(x, y + 1);
  }
  let solid = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) solid[i] = bg[i] ? 0 : 1;
  solid = boxMorph(boxMorph(solid, W, H, openR, false), W, H, openR, true); // opening
  solid = largestCC(solid, W, H);
  solid = fillHoles(solid, W, H);
  // undo the 1px dilation of outline (approx)
  solid = boxMorph(solid, W, H, 1, false);
  const trace = traceBoundary(solid, W, H);
  const poly = rdp(trace, eps);
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const [x, y] of poly) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  return { poly, bbox: [x0, y0, x1, y1], W, H, solid };
}

export async function overlay(file, poly, out) {
  const { width, height } = await sharp(file).metadata();
  const path = poly.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ') + ' Z';
  const svg = Buffer.from(`<svg width="${width}" height="${height}"><path d="${path}" fill="rgba(255,0,0,0.25)" stroke="red" stroke-width="2"/></svg>`);
  await sharp(file).flatten({ background: '#fff' }).composite([{ input: svg }]).jpeg({ quality: 80 }).toFile(out);
}

if (process.argv[1]?.endsWith('profile_extract.mjs')) {
  const ROOT = '/Users/akobir/Desktop/dikart';
  const OUT = '/Users/akobir/.gemini/antigravity/brain/b4362c33-01e1-4d99-9f35-721dbb2bef13/scratch';
  const prof = JSON.parse(fs.readFileSync(`${ROOT}/src/data/karniz-profil.json`, 'utf8'));
  for (const id of process.argv[2].split(',')) {
    const kod = `karniz-${id.padStart(3, '0')}`;
    const file = `${ROOT}/public/images/karnizlar/_profil/${kod}.webp`;
    const r = await extractProfile(file);
    const bw = r.bbox[2] - r.bbox[0], bh = r.bbox[3] - r.bbox[1];
    console.log(kod, 'pts', r.poly.length, 'bbox px', bw, 'x', bh, 'aspect', (bw / bh).toFixed(3), 'json w/h', (prof[kod].w / prof[kod].h).toFixed(3));
    await overlay(file, r.poly, `${OUT}/ov_${kod}.jpg`);
  }
}
