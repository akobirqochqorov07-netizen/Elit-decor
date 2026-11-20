/**
 * src/data/types.ts
 * Umumiy katalog tiplari
 */

export type Bolim = 'karnizlar' | 'bortkarnizlar';

export interface KarnizItem {
    bolim: Bolim;
    kod: string;
    korsatiladigan_kod: string;
    katalog_slug: string;
    katalog_nomi: string;
    rasm_kok: string;
    rasm_oq: string;
    balandlik_nisbati: number;
    narx_pm: number | null;
    ombor_pm: number | null;
    balandlik_mm: number | null;
    kenglik_mm: number | null;
    ogirlik_kg: number | null;
    material: string;
    uzunlik_m: number | null;
}

export interface KatalogInfo {
    id: number;
    slug: string;
    nomi: string;
    karnizlar_kodlari: string[];
}
