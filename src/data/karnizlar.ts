/**
 * src/data/karnizlar.ts
 *
 * Karnizlar katalogi uchun ma'lumotlar qatlami.
 * Asosiy manba: public/images/karnizlar/katalog.json
 *
 * Narx / ombor / o'lcham maydonlari null bo'lishi mumkin —
 * UI "Narx so'rang" / "—" ko'rsatadi, lekin buzilmaydi.
 */

// ─── Tiplар ──────────────────────────────────────────────────────────────────
export type { Bolim, KarnizItem, KatalogInfo } from './types';
import type { Bolim, KarnizItem, KatalogInfo } from './types';

// ─── Raw JSON tipi ────────────────────────────────────────────────────────────

interface RawKatalog {
    id: number;
    slug: string;
    nomi: string;
    karnizlar: string[];
}

interface RawMahsulot {
    kod: string;
    katalog: string;
    papka: string;
    oq_fon: string;
    kok_fon: string;
    asl_oq: string;
    asl_kok: string;
    balandlik_nisbati: number;
}

interface RawJson {
    kataloglar: RawKatalog[];
    mahsulotlar: RawMahsulot[];
}

// ─── Statik import ──────────────────────────────────────────────────────────
// Next.js App Router da JSON statik import qilinadi (server-side safe)
import rawData from '../../public/images/karnizlar/katalog.json';
import { products } from './products';

const raw = rawData as RawJson;

// products.ts dan narx/o'lcham ma'lumotlarini slug bo'yicha indekslaymiz
const productDataMap = new Map(products.map((p) => [p.slug, p]));

// ─── Ko'rsatiladigan kod hisoblash ───────────────────────────────────────────
function toDisplayKod(kod: string): string {
    // "karniz-001" → "K-001"
    const match = kod.match(/karniz-(\d+)/);
    if (match) return `K-${match[1]}`;
    return kod.toUpperCase();
}

// ─── Ma'lumotlarni build qilish ───────────────────────────────────────────────
const mahsulotMap = new Map<string, RawMahsulot>();
for (const m of raw.mahsulotlar) {
    mahsulotMap.set(m.kod, m);
}

/** Barcha 83 ta karniz — products.ts dan narx/o'lcham ma'lumotlari merge qilingan */
export const allKarnizlar: KarnizItem[] = raw.mahsulotlar.map((m) => {
    const pd = productDataMap.get(m.kod);
    return {
        bolim: 'karnizlar' as const,
        kod: m.kod,
        korsatiladigan_kod: toDisplayKod(m.kod),
        katalog_slug: m.papka,
        katalog_nomi: m.katalog,
        rasm_kok: `/images/karnizlar/${m.kok_fon}`,
        rasm_oq: `/images/karnizlar/${m.oq_fon}`,
        balandlik_nisbati: m.balandlik_nisbati,
        narx_pm: pd?.pricePerMeter ?? null,
        ombor_pm: null,
        balandlik_mm: pd?.heightMm ?? null,
        kenglik_mm: pd?.depthMm ?? null,
        ogirlik_kg: pd?.weightKgPerM ?? null,
        material: pd?.material ?? 'Gips G-16',
        uzunlik_m: pd?.pieceLengthM ?? null,
    };
});

/** Barcha 5 ta katalog metadata */
export const allKataloglar: KatalogInfo[] = raw.kataloglar.map((k) => ({
    id: k.id,
    slug: k.slug,
    nomi: k.nomi,
    karnizlar_kodlari: k.karnizlar,
}));

// ─── Helper funksiyalar ────────────────────────────────────────────────────────
// Karnizlar va bortkarnizlar uchun umumiy: kod va katalog sluglari bo'limlararo takrorlanmaydi.

import { allBortkarnizlar, allBortkataloglar } from './bortkarnizlar';
import bortFileManifest from './bortkarniz-files.json';

export function getAllItems(): KarnizItem[] {
    return [...allKarnizlar, ...(allBortkarnizlar || [])];
}

export function getAllKataloglar(): KatalogInfo[] {
    return [...allKataloglar, ...(allBortkataloglar || [])];
}

/** Bo'lim bo'yicha mahsulotlar va guruhlar */
export function getBolimData(bolim: Bolim): { items: KarnizItem[]; kataloglar: KatalogInfo[] } {
    return bolim === 'bortkarnizlar'
        ? { items: allBortkarnizlar || [], kataloglar: allBortkataloglar || [] }
        : { items: allKarnizlar, kataloglar: allKataloglar };
}

/** Bo'lim nomlari (UI uchun) */
export const BOLIM_NOMI: Record<Bolim, { kop: string; birlik: string }> = {
    karnizlar: { kop: 'Karnizlar', birlik: 'Karniz' },
    bortkarnizlar: { kop: 'Bortkarnizlar', birlik: 'Bortkarniz' },
};

/** Mahsulot sahifasi manzili */
export function getItemHref(item: KarnizItem): string {
    return `/katalog/${item.bolim}/${item.katalog_slug}/${item.kod}/`;
}

/** Galereya: kartochka rasmi (thumb) va lightbox uchun yuqori sifatli rasm (full) */
export function getGallerySlides(item: KarnizItem): { thumb: string; full: string }[] {
    if (item.bolim === 'bortkarnizlar') {
        return [
            { thumb: item.rasm_kok, full: `/images/bortkarnizlar/_full/${item.kod}.webp` },
            { thumb: item.rasm_oq, full: `/images/bortkarnizlar/_cutout/${item.kod}.webp` },
        ];
    }
    return [
        { thumb: item.rasm_kok, full: `/images/karnizlar/_kok/${item.kod}.webp` },
        { thumb: item.rasm_oq, full: `/images/karnizlar/_oq/${item.kod}.webp` },
    ];
}

/** Profil chizmasi rasmi */
export function getProfilSrc(kod: string): string {
    return kod.startsWith('bortkarniz-')
        ? `/images/bortkarnizlar/_profil/${kod}.webp`
        : `/images/karnizlar/_profil/${kod}.webp`;
}

/** Slug bo'yicha katalog topish */
export function getKatalogBySlug(slug: string): KatalogInfo | undefined {
    return getAllKataloglar().find((k) => k.slug === slug);
}

/** Katalog slugiga tegishli karnizlar */
export function getKarnizlarByKatalog(slug: string): KarnizItem[] {
    const katalog = getKatalogBySlug(slug);
    if (!katalog) return [];
    const allItems = getAllItems();
    return katalog.karnizlar_kodlari
        .map((kod) => allItems.find((k) => k.kod === kod))
        .filter((k): k is KarnizItem => Boolean(k));
}

/** Kod bo'yicha karniz topish */
export function getKarnizByKod(kod: string): KarnizItem | undefined {
    return getAllItems().find((k) => k.kod === kod);
}

/** Katalogdagi eng arzon narx (plitkalar uchun "dan NNN so'm") */
export function getMinNarx(slug: string): number | null {
    const items = getKarnizlarByKatalog(slug);
    const prices = items.map((k) => k.narx_pm).filter((p): p is number => p !== null);
    if (prices.length === 0) return null;
    return Math.min(...prices);
}

/** Katalog ichida oldingi/keyingi karniz */
export function getPrevNextInKatalog(
    katalogSlug: string,
    currentKod: string
): { prev: KarnizItem | null; next: KarnizItem | null } {
    const items = getKarnizlarByKatalog(katalogSlug);
    const idx = items.findIndex((k) => k.kod === currentKod);
    return {
        prev: idx > 0 ? items[idx - 1] : null,
        next: idx < items.length - 1 ? items[idx + 1] : null,
    };
}

/** Narxni formatlash */
export function formatNarx(narx: number | null): string {
    if (narx === null) return "Narx so'rang";
    return `${narx.toLocaleString('uz-UZ')} so'm/p.m.`;
}

/** O'lchamni formatlash */
export function formatOlcham(balandlik: number | null, kenglik: number | null): string {
    if (balandlik === null || kenglik === null) return '—';
    return `${balandlik}×${kenglik} mm`;
}

function dkCode(kod: string): string | null {
    const bort = kod.match(/^bortkarniz-(\d+)/);
    if (bort) return `BK-${bort[1]}`;
    const match = kod.match(/karniz-(\d+)/);
    return match ? `DK-${match[1]}` : null;
}

// ─── 3D va yuklab olish fayllari ─────────────────────────────────────────────
// Qaysi mahsulotda qaysi fayl borligi src/data/karniz-files.json va bortkarniz-files.json da.
// Fayl joyi: public/products/<kod>/model.glb  va  public/products/<kod>/downloads/DK-XXX.<ext> (BK-XXX)
import fileManifest from './karniz-files.json';

interface KarnizFiles {
    model: boolean;
    formats: string[];
    /** Ixtiyoriy: 3D ko'rinishdagi boshlang'ich kamera burchagi */
    orbit?: string;
}
const files = {
    ...(fileManifest as Record<string, KarnizFiles>),
    ...(bortFileManifest as Record<string, KarnizFiles>),
};

/** 3D/CAD fayl URL — fayl bo'lmasa null (UI tugmani ko'rsatmaydi) */
export function getDownloadUrl(kod: string, ext: string): string | null {
    const dk = dkCode(kod);
    if (!dk) return null;
    if (!files[kod]?.formats.includes(ext)) return null;
    return `/products/${kod}/downloads/${dk}.${ext}`;
}

export function getModel3dOrbit(kod: string): string | undefined {
    return files[kod]?.orbit;
}

export function getModel3dUrl(kod: string): string | null {
    if (!files[kod]?.model) return null;
    return `/products/${kod}/model.glb`;
}
