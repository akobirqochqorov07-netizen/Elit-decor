#!/usr/bin/env python3
"""
scripts/batch-convert-bortkarnizlar.py

Batch converts all 26 bortkarniz OBJ models to properly centered,
front-facing (+Z), and upright (+Y) GLB models for the 3D viewer.
"""

import glob
import os
import subprocess
import time

def convert_bort(slug):
    objs = glob.glob(f'public/products/{slug}/downloads/*.obj')
    if not objs:
        print(f'[{slug}] No OBJ found in downloads/ — skipping')
        return False

    src_obj = objs[0]
    fixed_obj = f'/tmp/{slug}-fixed.obj'
    out_glb = f'public/products/{slug}/model.glb'

    with open(src_obj, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

    verts = [list(map(float, l.split()[1:4])) for l in lines if l.startswith('v ')]
    if not verts:
        print(f'[{slug}] No vertices — skipping')
        return False

    # Original bounds center
    xs = [v[0] for v in verts]
    ys = [v[1] for v in verts]
    zs = [v[2] for v in verts]
    cx = (min(xs) + max(xs)) / 2.0
    cy = (min(ys) + max(ys)) / 2.0
    cz = (min(zs) + max(zs)) / 2.0

    # Rotate 180 around Y so decorative profile faces +Z into room,
    # and center at (0, 0, 0):
    # x_new = -(x - cx)
    # y_new = y - cy
    # z_new = -(z - cz)

    new_lines = []
    for line in lines:
        if line.startswith('v '):
            p = [float(x) for x in line.split()[1:4]]
            x_new = -(p[0] - cx)
            y_new = p[1] - cy
            z_new = -(p[2] - cz)
            new_lines.append(f'v {x_new:.5f} {y_new:.5f} {z_new:.5f}\n')
        elif line.startswith('vn '):
            p = [float(x) for x in line.split()[1:4]]
            nx = -p[0]
            ny = p[1]
            nz = -p[2]
            new_lines.append(f'vn {nx:.5f} {ny:.5f} {nz:.5f}\n')
        elif line.startswith('f '):
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
        print(f'[{slug}] OK: {sz} KB')
        return True
    else:
        print(f'[{slug}] ERROR: {res.stderr.strip()[:100]}')
        return False

def main():
    start = time.time()
    total = 26
    success = 0

    print(f'Starting batch conversion of {total} bortkarniz models...\n')
    for i in range(1, total + 1):
        slug = f'bortkarniz-{i:03d}'
        if convert_bort(slug):
            success += 1

    elapsed = time.time() - start
    print(f'\nFinished: {success}/{total} bortkarniz models converted in {elapsed:.1f}s.')

if __name__ == '__main__':
    main()
