# Product Assets — Qo'shish Yo'riqnomasi

## Papka tuzilmasi (har bir mahsulot uchun)

```
public/products/{slug}/          ← tireli kichik harf: karniz-001, rozetka-005
  source/
    karniz_001.png               ← 2400×1800, RGBA PNG (shaffof fon)
    interior.jpg                 ← ixtiyoriy: interyer sahna rasmi
    profile.png | profile.svg    ← ixtiyoriy: profil kesimi
  downloads/
    DK-001.3ds
    DK-001.max
    DK-001.dwg
    DK-001.obj
    DK-001.fbx
    DK-001.pdf                   ← ixtiyoriy: texnik varaq
  model.glb                      ← ixtiyoriy: 3D viewer uchun
```

## Skript avtomatik yaratadigan fayllar (qo'lda qo'ymang)

`card.webp`, `main.webp`, `thumb.webp`, `og.jpg` — skript `source/karniz_001.png` dan yaratadi.

## Qoidalar

- Slug: faqat **kichik harf + tire** (`karniz-001`, `rozetka-005`). Bo'sh joy, kirill, `_` yo'q.
- Downloads: `DK-XXX.<ext>` formatida (masalan `DK-005.obj`), `karniz_001.*` emas.
- `model.glb` to'g'ridan-to'g'ri `{slug}/` ichida, `downloads/` da emas.
- Fayl yo'qligi UI ni sindirmaydi — o'sha element yashiriladi.
