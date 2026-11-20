/**
 * src/data/bortkarnizlar.ts
 *
 * Bortkarnizlar — karnizlar bilan bir xil KarnizItem tipida.
 * Manba: public/images/bortkarnizlar/katalog.json (scripts/process_bortkarniz.mjs yaratadi)
 */
import type { KarnizItem, KatalogInfo } from './types';
import rawData from '../../public/images/bortkarnizlar/katalog.json';

interface RawJson {
    kataloglar: { id: number; slug: string; nomi: string; karnizlar: string[] }[];
    mahsulotlar: {
        kod: string;
        korsatiladigan_kod: string;
        katalog: string;
        papka: string;
        kok_fon: string;
        oq_fon: string;
        balandlik_mm: number | null;
        kenglik_mm: number | null;
        uzunlik_m: number | null;
        narx_pm: number | null;
    }[];
}

const raw = rawData as RawJson;

export const allBortkarnizlar: KarnizItem[] = (raw.mahsulotlar || []).map((m) => ({
    bolim: 'bortkarnizlar',
    kod: m.kod,
    korsatiladigan_kod: m.korsatiladigan_kod,
    katalog_slug: m.papka,
    katalog_nomi: m.katalog,
    rasm_kok: `/images/bortkarnizlar/${m.kok_fon}`,
    rasm_oq: `/images/bortkarnizlar/${m.oq_fon}`,
    balandlik_nisbati: 0.75,
    narx_pm: m.narx_pm ?? null,
    ombor_pm: null,
    balandlik_mm: m.balandlik_mm ?? null,
    kenglik_mm: m.kenglik_mm ?? null,
    ogirlik_kg: null,
    material: 'Gips G-16',
    uzunlik_m: m.uzunlik_m ?? 2.0,
}));

export const allBortkataloglar: KatalogInfo[] = (raw.kataloglar || []).map((k) => ({
    id: k.id,
    slug: k.slug,
    nomi: k.nomi,
    karnizlar_kodlari: k.karnizlar || [],
}));
