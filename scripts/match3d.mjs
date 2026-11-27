import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = '/Users/akobir/Desktop/dikart';
export const N = +(process.env.NN || 56); // descriptor grid

function loadGlb(file) {
  const b = fs.readFileSync(file);
  const jl = b.readUInt32LE(12);
  const json = JSON.parse(b.slice(20, 20 + jl).toString());
  const bin = b.slice(20 + jl + 8);
  const tris = [], pos = [];
  for (const m of json.meshes) for (const pr of m.primitives) {
    const a = json.accessors[pr.attributes.POSITION];
    const bv = json.bufferViews[a.bufferView];
    const off = (bv.byteOffset || 0) + (a.byteOffset || 0);
    const stride = bv.byteStride || 12;
    const base = pos.length;
    for (let i = 0; i < a.count; i++) pos.push([bin.readFloatLE(off + i * stride), bin.readFloatLE(off + i * stride + 4), bin.readFloatLE(off + i * stride + 8)]);
    if (pr.indices !== undefined) {
      const ia = json.accessors[pr.indices];
      const ibv = json.bufferViews[ia.bufferView];
      const ioff = (ibv.byteOffset || 0) + (ia.byteOffset || 0);
      const sz = ia.componentType === 5125 ? 4 : ia.componentType === 5123 ? 2 : 1;
      for (let i = 0; i < ia.count; i++) tris.push(base + (sz === 4 ? bin.readUInt32LE(ioff + i * 4) : sz === 2 ? bin.readUInt16LE(ioff + i * 2) : bin[ioff + i]));
    } else for (let i = 0; i < a.count; i++) tris.push(base + i);
  }
  return { pos, tris };
}

// Model end-cap mask (one end only) -> N x N binary, bbox-normalised
export function capMask(kod, end = 'min') {
  const g = loadGlb(path.join(ROOT, 'public/products', kod, 'model.glb'));
  const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (const p of g.pos) for (let i = 0; i < 3; i++) { mn[i] = Math.min(mn[i], p[i]); mx[i] = Math.max(mx[i], p[i]); }
  const ext = mx.map((v, i) => v - mn[i]);
  const ax = ext.indexOf(Math.max(...ext));
  const [u, v] = [0, 1, 2].filter((i) => i !== ax);
  const E = end === 'min' ? mn[ax] : mx[ax];
  const eps = Math.max(ext[ax] * 0.002, 0.5);
  const polys = [];
  for (let t = 0; t < g.tris.length; t += 3) {
    const q = [g.pos[g.tris[t]], g.pos[g.tris[t + 1]], g.pos[g.tris[t + 2]]];
    if (q.every((p) => Math.abs(p[ax] - E) < eps)) polys.push(q.map((p) => [p[u], p[v]]));
  }
  if (!polys.length) return { mask: null, ext, ax };
  let bx0 = Infinity, bx1 = -Infinity, by0 = Infinity, by1 = -Infinity;
  for (const t of polys) for (const [x, y] of t) { bx0 = Math.min(bx0, x); bx1 = Math.max(bx1, x); by0 = Math.min(by0, y); by1 = Math.max(by1, y); }
  const mask = new Uint8Array(N * N);
  const sx = (N - 1) / (bx1 - bx0 || 1), sy = (N - 1) / (by1 - by0 || 1);
  for (const t of polys) {
    const xs = t.map((p) => (p[0] - bx0) * sx), ys = t.map((p) => (by1 - p[1]) * sy);
    const x0 = Math.max(0, Math.floor(Math.min(...xs))), x1 = Math.min(N - 1, Math.ceil(Math.max(...xs)));
    const y0 = Math.max(0, Math.floor(Math.min(...ys))), y1 = Math.min(N - 1, Math.ceil(Math.max(...ys)));
    const den = (ys[1] - ys[2]) * (xs[0] - xs[2]) + (xs[2] - xs[1]) * (ys[0] - ys[2]);
    if (Math.abs(den) < 1e-9) continue;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const l1 = ((ys[1] - ys[2]) * (x - xs[2]) + (xs[2] - xs[1]) * (y - ys[2])) / den;
      const l2 = ((ys[2] - ys[0]) * (x - xs[2]) + (xs[0] - xs[2]) * (y - ys[2])) / den;
      if (l1 >= -0.05 && l2 >= -0.05 && 1 - l1 - l2 >= -0.05) mask[y * N + x] = 1;
    }
  }
  return { mask, ext, ax, bw: bx1 - bx0, bh: by1 - by0 };
}

// box morphology via integral image (square element radius r)
function morph(bin, W, H, r, dilate) {
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

export async function drawingMask(file) {
  const { data, info } = await sharp(file).flatten({ background: '#fff' }).resize({ width: 400, withoutEnlargement: false }).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, C = info.channels;
  let dark = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const r = data[i * C], g = data[i * C + 1], b = data[i * C + 2];
    dark[i] = r + g + b < 360 ? 1 : 0;
  }
  let m = morph(dark, W, H, 5, true);
  m = morph(m, W, H, 5, false); // closing: fill hatch
  m = morph(m, W, H, 9, false); // opening: remove thin dim lines/text
  m = morph(m, W, H, 9, true);
  // largest connected component
  const lab = new Int32Array(W * H); let best = 0, bestId = 0, id = 0;
  for (let i = 0; i < W * H; i++) if (m[i] && !lab[i]) {
    id++; let cnt = 0; const st = [i]; lab[i] = id;
    while (st.length) { const c = st.pop(); cnt++; const x = c % W, y = (c / W) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < W && ny < H) { const ni = ny * W + nx; if (m[ni] && !lab[ni]) { lab[ni] = id; st.push(ni); } } }
    }
    if (cnt > best) { best = cnt; bestId = id; }
  }
  let x0 = W, x1 = 0, y0 = H, y1 = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (lab[y * W + x] === bestId) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  const mask = new Uint8Array(N * N);
  const sx = (x1 - x0) / N, sy = (y1 - y0) / N;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const px = Math.min(W - 1, Math.floor(x0 + (x + 0.5) * sx)), py = Math.min(H - 1, Math.floor(y0 + (y + 0.5) * sy));
    mask[y * N + x] = lab[py * W + px] === bestId ? 1 : 0;
  }
  return { mask, bw: x1 - x0, bh: y1 - y0 };
}

// 8 orientations
export function orient(mask, k) {
  const out = new Uint8Array(N * N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let sx = x, sy = y;
    if (k & 1) sx = N - 1 - sx; // flip
    let rx = sx, ry = sy;
    for (let r = 0; r < (k >> 1); r++) { const t = rx; rx = N - 1 - ry; ry = t; }
    out[y * N + x] = mask[ry * N + rx];
  }
  return out;
}
function iou(a, b) { let i = 0, u = 0; for (let k = 0; k < a.length; k++) { if (a[k] && b[k]) i++; if (a[k] || b[k]) u++; } return u ? i / u : 0; }
export function bestIou(a, b) { let best = 0, bk = 0; for (let k = 0; k < 8; k++) { const v = iou(orient(a, k), b); if (v > best) { best = v; bk = k; } } return { v: best, k: bk }; }

async function main() {
  const kind = process.argv[2];
  const n = kind === 'karniz' ? 83 : 26;
  const dir = kind === 'karniz' ? 'karnizlar' : 'bortkarnizlar';
  const kods = Array.from({ length: n }, (_, i) => `${kind}-${String(i + 1).padStart(3, '0')}`);
  const models = [], draws = [];
  for (const kod of kods) {
    let cm = capMask(kod, 'min');
    if (!cm.mask || cm.mask.reduce((a, b) => a + b, 0) < 30) cm = capMask(kod, 'max');
    models.push(cm);
    draws.push(await drawingMask(path.join(ROOT, `public/images/${dir}/_profil/${kod}.webp`)));
  }
  let bad = 0;
  const report = [];
  for (let i = 0; i < n; i++) {
    const sc = draws.map((d) => bestIou(models[i].mask, d.mask).v);
    const own = sc[i];
    const order = sc.map((v, j) => [v, j]).sort((a, b) => b[0] - a[0]);
    const rank = order.findIndex((o) => o[1] === i) + 1;
    const top = order.slice(0, 3).map(([v, j]) => `${j + 1}:${v.toFixed(2)}`).join(' ');
    report.push({ kod: kods[i], own, rank, top });
    console.log(kods[i], 'own=' + own.toFixed(2), 'rank=' + rank, 'top3=' + top, rank > 1 ? '  <<< ?' : '');
    if (rank > 1) bad++;
  }
  console.log('Non-top1 count:', bad);
  fs.writeFileSync(`/tmp/match_${kind}.json`, JSON.stringify(report, null, 1));
}
if (process.argv[1]?.endsWith('match3d.mjs')) main();
