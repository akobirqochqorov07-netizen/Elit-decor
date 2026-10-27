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

export interface KarnizItem {
    /** "karniz-001" */
    kod: string;
    /** "K-001" — ko'rsatiladigan qisqa kod */
    korsatiladigan_kod: string;
    /** "katalog-1-katta" */
    katalog_slug: string;
    /** "Katta profil" */
    katalog_nomi: string;
    /** "/images/karnizlar/katalog-1-katta/karniz-001-kok.jpg" */
    rasm_kok: string;
    /** "/images/karnizlar/katalog-1-katta/karniz-001-oq.jpg" */
    rasm_oq: string;
    /** 0.0–1.0 — balandlik/kenglik nisbati (rasm aspect ratio uchun) */
    balandlik_nisbati: number;

    // ─── Foydalanuvchi to'ldirishi kerak bo'lgan maydonlar ───────────────────
    /** so'm/p.m. | null = "Narx so'rang" */
    narx_pm: number | null;
    /** pogon metr, omborda | null = "—" */
    ombor_pm: number | null;
    /** mm | null */
    balandlik_mm: number | null;
    /** mm | null */
    kenglik_mm: number | null;
    /** kg/p.m. | null */
    ogirlik_kg: number | null;
    /** default "Gips G-16" */
    material: string;
}

export interface KatalogInfo {
    id: number;
    slug: string;
    nomi: string;
    karnizlar_kodlari: string[];
}

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

const raw = rawData as RawJson;

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

/** Barcha 50 ta karniz */
export const allKarnizlar: KarnizItem[] = raw.mahsulotlar.map((m) => ({
    kod: m.kod,
    korsatiladigan_kod: toDisplayKod(m.kod),
    katalog_slug: m.papka,
    katalog_nomi: m.katalog,
    rasm_kok: `/images/karnizlar/${m.kok_fon}`,
    rasm_oq: `/images/karnizlar/${m.oq_fon}`,
    balandlik_nisbati: m.balandlik_nisbati,
    // null — foydalanuvchi katalog.json ga qo'shadi
    narx_pm: null,
    ombor_pm: null,
    balandlik_mm: null,
    kenglik_mm: null,
    ogirlik_kg: null,
    material: 'Gips G-16',
}));

/** Barcha 5 ta katalog metadata */
export const allKataloglar: KatalogInfo[] = raw.kataloglar.map((k) => ({
    id: k.id,
    slug: k.slug,
    nomi: k.nomi,
    karnizlar_kodlari: k.karnizlar,
}));

// ─── Helper funksiyalar ────────────────────────────────────────────────────────

/** Slug bo'yicha katalog topish */
export function getKatalogBySlug(slug: string): KatalogInfo | undefined {
    return allKataloglar.find((k) => k.slug === slug);
}

/** Katalog slugiga tegishli karnizlar */
export function getKarnizlarByKatalog(slug: string): KarnizItem[] {
    const katalog = getKatalogBySlug(slug);
    if (!katalog) return [];
    return katalog.karnizlar_kodlari
        .map((kod) => allKarnizlar.find((k) => k.kod === kod))
        .filter((k): k is KarnizItem => Boolean(k));
}

/** Kod bo'yicha karniz topish */
export function getKarnizByKod(kod: string): KarnizItem | undefined {
    return allKarnizlar.find((k) => k.kod === kod);
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
    return `${balandlik}H×${kenglik}mm`;
}

function dkCode(kod: string): string | null {
    const match = kod.match(/karniz-(\d+)/);
    return match ? `DK-${match[1]}` : null;
}

/** 3D/CAD fayl URL — fayl bo'lmasa null (UI yashiradi yoki o'chirilgan holat) */
export function getDownloadUrl(kod: string, ext: string): string | null {
    const dk = dkCode(kod);
    if (!dk) return null;
    if (kod !== 'karniz-001') return null;
    if (ext === 'pdf') return null;
    return `/products/${kod}/downloads/${dk}.${ext}`;
}

export function getModel3dUrl(kod: string): string | null {
    if (kod !== 'karniz-001') return null;
    return `/products/${kod}/model.glb`;
}
