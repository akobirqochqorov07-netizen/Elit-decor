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
export const BOLIM_NOMI_LOCALIZED: Record<string, Record<Bolim, { kop: string; birlik: string }>> = {
    uz: {
        karnizlar: { kop: 'Karnizlar', birlik: 'Karniz' },
        bortkarnizlar: { kop: 'Bortkarnizlar', birlik: 'Bortkarniz' },
    },
    ru: {
        karnizlar: { kop: 'Карнизы', birlik: 'Карниз' },
        bortkarnizlar: { kop: 'Борткарнизы', birlik: 'Борткарниз' },
    },
    en: {
        karnizlar: { kop: 'Cornices', birlik: 'Cornice' },
        bortkarnizlar: { kop: 'Cove cornices', birlik: 'Cove cornice' },
    },
};

export function getBolimNomi(bolim: Bolim, locale: string = 'uz'): { kop: string; birlik: string } {
    const loc = BOLIM_NOMI_LOCALIZED[locale] || BOLIM_NOMI_LOCALIZED.uz;
    return loc[bolim] || BOLIM_NOMI_LOCALIZED.uz[bolim];
}

export const BOLIM_NOMI: Record<Bolim, { kop: string; birlik: string }> = BOLIM_NOMI_LOCALIZED.uz;

export const KATALOG_NOMI_LOCALIZED: Record<string, Record<string, string>> = {
    uz: {
        'katalog-1-katta': 'Katta profil',
        'katalog-2-orta-katta': "O'rta-katta profil",
        'katalog-3-orta': "O'rta profil",
        'katalog-4-orta-past': "O'rta-past profil",
        'katalog-5-ingichka': 'Ingichka profil',
        'katalog-6-juda-ingichka': 'Juda ingichka profil',
        'bortkatalog-1-katta': 'Katta profil',
        'bortkatalog-2-orta': "O'rta profil",
        'bortkatalog-3-ixcham': 'Ixcham profil',
    },
    ru: {
        'katalog-1-katta': 'Большой профиль',
        'katalog-2-orta-katta': 'Средне-большой профиль',
        'katalog-3-orta': 'Средний профиль',
        'katalog-4-orta-past': 'Средне-малый профиль',
        'katalog-5-ingichka': 'Узкий профиль',
        'katalog-6-juda-ingichka': 'Очень узкий профиль',
        'bortkatalog-1-katta': 'Большой профиль',
        'bortkatalog-2-orta': 'Средний профиль',
        'bortkatalog-3-ixcham': 'Компактный профиль',
    },
    en: {
        'katalog-1-katta': 'Large profile',
        'katalog-2-orta-katta': 'Medium-large profile',
        'katalog-3-orta': 'Medium profile',
        'katalog-4-orta-past': 'Medium-small profile',
        'katalog-5-ingichka': 'Slim profile',
        'katalog-6-juda-ingichka': 'Extra-slim profile',
        'bortkatalog-1-katta': 'Large profile',
        'bortkatalog-2-orta': 'Medium profile',
        'bortkatalog-3-ixcham': 'Compact profile',
    },
};

export function getKatalogNomi(slug: string, fallback: string = '', locale: string = 'uz'): string {
    const loc = KATALOG_NOMI_LOCALIZED[locale] || KATALOG_NOMI_LOCALIZED.uz;
    return loc[slug] || fallback;
}

/** Mahsulot sahifasi manzili */
export function getItemHref(item: KarnizItem): string {
    return `/katalog/${item.bolim}/${item.katalog_slug}/${item.kod}/`;
}

/** Galereya: 1-rasm: 3D render (ko'k/blur fon), 2-rasm: Iliq bej studiya foni */
export function getGallerySlides(item: KarnizItem): { thumb: string; full: string }[] {
    if (item.bolim === 'bortkarnizlar') {
        return [
            { thumb: item.rasm_kok, full: `/images/bortkarnizlar/_cutout/${item.kod}.webp` },
            { thumb: item.rasm_oq, full: `/images/bortkarnizlar/_cutout/${item.kod}.webp` },
        ];
    }
    return [
        { thumb: item.rasm_kok, full: `/images/karnizlar/_cutout/${item.kod}.webp` },
        {
            thumb: item.rasm_oq,
            full: item.kod === 'karniz-001'
                ? '/images/karnizlar/_bej/karniz-001.webp'
                : `/images/karnizlar/_cutout/${item.kod}.webp`,
        },
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

/** Mahsulot ichida oldingi/keyingi karniz (ketma-ket va aylanma tartibda) */
export function getPrevNextInKatalog(
    katalogSlug: string,
    currentKod: string
): { prev: KarnizItem | null; next: KarnizItem | null } {
    const currentItem = getKarnizByKod(currentKod);
    const bolim: Bolim = currentItem?.bolim ?? (currentKod.startsWith('bortkarniz-') ? 'bortkarnizlar' : 'karnizlar');
    const items = getBolimData(bolim).items;
    if (items.length === 0) return { prev: null, next: null };

    const idx = items.findIndex((k) => k.kod === currentKod);
    if (idx === -1) return { prev: null, next: null };

    const prevIdx = (idx - 1 + items.length) % items.length;
    const nextIdx = (idx + 1) % items.length;

    return {
        prev: items[prevIdx],
        next: items[nextIdx],
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
