import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import earcut from 'earcut';
import { extractProfile } from './profile_extract.mjs';

const ROOT = '/Users/akobir/Desktop/dikart';
const prof = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/karniz-profil.json'), 'utf8'));

// Given 2D polygon (x: width, y: height, 0 at top-left), convert to 3D OBJ
function generateCorniceObj(poly, bbox, targetW, targetH, length = 1000) {
  const [bx0, by0, bx1, by1] = bbox;
  const polyW = bx1 - bx0;
  const polyH = by1 - by0;

  // Map 2D polygon to real millimeters (y: width, z: height):
  const pts2d = poly.map(([px, py]) => {
    const y = ((px - bx0) / polyW) * targetW;
    const z = targetH - ((py - by0) / polyH) * targetH - targetH / 2; // centered
    return [y, z];
  });

  const N = pts2d.length;
  // Ensure CCW winding order for earcut
  let area = 0;
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    area += pts2d[i][0] * pts2d[j][1] - pts2d[j][0] * pts2d[i][1];
  }
  if (area < 0) {
    pts2d.reverse();
  }

  // Triangulate cap
  const flat2d = [];
  for (const [y, z] of pts2d) {
    flat2d.push(y, z);
  }
  const capIndices = earcut(flat2d);

  // Extrusion along X:
  // Flat end cap at -length / 2 (min X)
  // 45-degree mitered cut at +length / 2 - y (max X)
  const xFlat = -length / 2;
  const xMiter = (y) => length / 2 - y;

  const verts = [];
  // 0..N-1: flat end vertices
  for (let i = 0; i < N; i++) {
    verts.push([xFlat, pts2d[i][0], pts2d[i][1]]);
  }
  // N..2N-1: mitered end vertices
  for (let i = 0; i < N; i++) {
    verts.push([xMiter(pts2d[i][0]), pts2d[i][0], pts2d[i][1]]);
  }

  // Calculate center and center the vertices
  let mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (const p of verts) {
    for (let i = 0; i < 3; i++) {
      mn[i] = Math.min(mn[i], p[i]);
      mx[i] = Math.max(mx[i], p[i]);
    }
  }
  const center = mn.map((v, i) => (v + mx[i]) / 2);
  const centeredVerts = verts.map(p => p.map((v, i) => v - center[i]));

  // Calculate 2D normals for profile vertices (for smooth shading on extrusion sides)
  const norm2d = [];
  for (let i = 0; i < N; i++) {
    const prev = (i - 1 + N) % N;
    const next = (i + 1) % N;
    const dy = pts2d[next][0] - pts2d[prev][0];
    const dz = pts2d[next][1] - pts2d[prev][1];
    // Normal perpendicular to tangent (dy, dz): (dz, -dy)
    const len = Math.hypot(dz, -dy) || 1;
    norm2d.push([dz / len, -dy / len]);
  }

  // Generate normals list:
  // Normals for sides: [0, ny, nz]
  // Normal for flat cap: [1, 0, 0]
  // Normal for miter cap: [-Math.SQRT1_2, -Math.SQRT1_2, 0]
  const normals = [];
  for (let i = 0; i < N; i++) {
    normals.push([0, norm2d[i][0], norm2d[i][1]]);
  }
  const normFlatIdx = normals.length + 1;
  normals.push([-1, 0, 0]);
  const normMiterIdx = normals.length + 1;
  normals.push([0.7071, -0.7071, 0]);

  // Faces
  const sideFaces = [];
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    const v1 = i + 1;
    const v2 = j + 1;
    const v3 = N + j + 1;
    const v4 = N + i + 1;
    const vn1 = i + 1;
    const vn2 = j + 1;
    sideFaces.push(`${v1}//${vn1} ${v2}//${vn2} ${v3}//${vn2}`);
    sideFaces.push(`${v1}//${vn1} ${v3}//${vn2} ${v4}//${vn1}`);
  }

  const capFlatFaces = [];
  for (let i = 0; i < capIndices.length; i += 3) {
    const a = capIndices[i] + 1;
    const b = capIndices[i + 1] + 1;
    const c = capIndices[i + 2] + 1;
    capFlatFaces.push(`${a}//${normFlatIdx} ${b}//${normFlatIdx} ${c}//${normFlatIdx}`);
  }

  const capMiterFaces = [];
  for (let i = 0; i < capIndices.length; i += 3) {
    const a = N + capIndices[i] + 1;
    const b = N + capIndices[i + 2] + 1;
    const c = N + capIndices[i + 1] + 1;
    capMiterFaces.push(`${a}//${normMiterIdx} ${b}//${normMiterIdx} ${c}//${normMiterIdx}`);
  }

  let objText = '# Elit Dekor 3D Cornice Model\n';
  for (const [x, y, z] of centeredVerts) {
    objText += `v ${x.toFixed(4)} ${y.toFixed(4)} ${z.toFixed(4)}\n`;
  }
  for (const [nx, ny, nz] of normals) {
    objText += `vn ${nx.toFixed(4)} ${ny.toFixed(4)} ${nz.toFixed(4)}\n`;
  }
  objText += 's 1\n';
  for (const f of sideFaces) {
    objText += `f ${f}\n`;
  }
  objText += 's off\n';
  for (const f of capFlatFaces) {
    objText += `f ${f}\n`;
  }
  for (const f of capMiterFaces) {
    objText += `f ${f}\n`;
  }

  return objText;
}

export async function rebuildAll() {
  console.log('Rebuilding Karniz 3D models...');

  // Generate accurate models for 001, 002, 003, 004, 005, 011
  const targetIds = [1, 2, 3, 4, 5, 11];
  for (const id of targetIds) {
    const kod = `karniz-${String(id).padStart(3, '0')}`;
    const dkName = `DK-${String(id).padStart(3, '0')}`;
    const imgPath = path.join(ROOT, `public/images/karnizlar/_profil/${kod}.webp`);
    const ext = await extractProfile(imgPath, { eps: 1.0 });
    const targetW = prof[kod].w;
    const targetH = prof[kod].h;

    const objContent = generateCorniceObj(ext.poly, ext.bbox, targetW, targetH);
    const objPath = path.join(ROOT, `public/products/${kod}/downloads/${dkName}.obj`);
    const glbPath = path.join(ROOT, `public/products/${kod}/model.glb`);

    fs.writeFileSync(objPath, objContent, 'utf8');

    // Convert to GLB with obj2gltf
    execSync(`npx obj2gltf -i "${objPath}" -o "${glbPath}" --doubleSidedMaterial`, { stdio: 'pipe' });

    const glbStat = fs.statSync(glbPath);
    console.log(`✓ Rebuilt ${kod}: w=${targetW} h=${targetH} (GLB size: ${(glbStat.size / 1024).toFixed(1)} KB)`);
  }
}

if (process.argv[1]?.endsWith('rebuild_missing_karniz.mjs')) {
  rebuildAll();
}
