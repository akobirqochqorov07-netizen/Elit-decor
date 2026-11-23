#!/usr/bin/env python3
"""
scripts/batch-convert-karnizlar.py

Batch converts all 83 karniz OBJ models to properly oriented, centered,
and normal-corrected GLB models for the 3D viewer.
"""

import glob
import os
import subprocess
import time

def convert_karniz(slug):
    objs = glob.glob(f'public/products/{slug}/downloads/*.obj')
    if not objs:
        print(f'[{slug}] No OBJ file found in downloads/ — skipping')
        return False

    src_obj = objs[0]
    fixed_obj = f'/tmp/{slug}-fixed.obj'
    out_glb = f'public/products/{slug}/model.glb'

    with open(src_obj, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

    verts = [list(map(float, l.split()[1:4])) for l in lines if l.startswith('v ')]
    faces = [l for l in lines if l.startswith('f ')]
    vns = [list(map(float, l.split()[1:4])) for l in lines if l.startswith('vn ')]

    if not verts or not faces:
        print(f'[{slug}] Incomplete OBJ data — skipping')
        return False

    # Detect ceiling normal orientation (ceiling is at max Z)
    max_z = max(v[2] for v in verts)
    inverted = False
    for f in faces:
        parts = f.split()[1:]
        v_idx = [int(p.split('/')[0]) - 1 for p in parts]
        vn_idx = [int(p.split('/')[2]) - 1 for p in parts if len(p.split('/')) > 2 and p.split('/')[2]]
        if all(abs(verts[i][2] - max_z) < 0.2 for i in v_idx):
            if vn_idx and vns[vn_idx[0]][2] < 0:
                inverted = True
            break

    # Calculate center of transformed bounds
    xs = [v[0] for v in verts]
    ys = [v[2] for v in verts]  # Y_new is Z_old (height)
    zs = [-v[1] for v in verts] # Z_new is -Y_old (depth)
    cx = (min(xs) + max(xs)) / 2.0
    cy = (min(ys) + max(ys)) / 2.0
    cz = (min(zs) + max(zs)) / 2.0

    new_lines = []
    for line in lines:
        if line.startswith('v '):
            p = [float(x) for x in line.split()[1:4]]
            x_new = p[0] - cx
            y_new = p[2] - cy
            z_new = -p[1] - cz
            new_lines.append(f'v {x_new:.5f} {y_new:.5f} {z_new:.5f}\n')
        elif line.startswith('vn '):
            p = [float(x) for x in line.split()[1:4]]
            sign = -1.0 if inverted else 1.0
            nx = sign * p[0]
            ny = sign * p[2]
            nz = sign * (-p[1])
            new_lines.append(f'vn {nx:.5f} {ny:.5f} {nz:.5f}\n')
        elif line.startswith('f '):
            parts = line.split()[1:]
            if inverted:
                if len(parts) == 3:
                    new_lines.append(f'f {parts[0]} {parts[2]} {parts[1]}\n')
                elif len(parts) == 4:
                    new_lines.append(f'f {parts[0]} {parts[3]} {parts[2]} {parts[1]}\n')
                else:
                    new_lines.append(line)
            else:
                new_lines.append(line)
        elif line.startswith('mtllib'):
            continue
        else:
            new_lines.append(line)

    with open(fixed_obj, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

    res = subprocess.run([
        'npx', 'obj2gltf',
        '-i', fixed_obj,
        '-o', out_glb,
        '-b',
        '--doubleSidedMaterial'
    ], capture_output=True, text=True)

    if os.path.exists(fixed_obj):
        try:
            os.remove(fixed_obj)
        except OSError:
            pass

    if res.returncode == 0:
        sz = os.path.getsize(out_glb) // 1024
        print(f'[{slug}] OK: {sz} KB (inv={inverted})')
        return True
    else:
        print(f'[{slug}] ERROR: {res.stderr.strip()[:100]}')
        return False

def main():
    start = time.time()
    success = 0
    total = 83

    print(f'Starting batch conversion of {total} karniz models...\n')
    for i in range(1, total + 1):
        slug = f'karniz-{i:03d}'
        if convert_karniz(slug):
            success += 1

    elapsed = time.time() - start
    print(f'\nFinished: {success}/{total} models converted in {elapsed:.1f}s.')

if __name__ == '__main__':
    main()
