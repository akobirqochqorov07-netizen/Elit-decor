'use client';
/**
 * /katalog/karnizlar/[slug]/page.tsx
 * DIKART-style karnizlar ro'yxati sahifasi.
 *
 * Layout: Breadcrumb → H1 → Sort+Filter → Grid (4 ustun)
 */

import { use, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import KarnizCard from '@/components/karnizlar/KarnizCard';
import {
    getKatalogBySlug,
    getKarnizlarByKatalog,
    allKataloglar,
    KarnizItem,
} from '@/data/karnizlar';

// ─── Sort dropdown types ────────────────────────────────────────────────────

type SortKey = 'default' | 'price_asc' | 'price_desc' | 'name';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'default', label: 'Standart tartib' },
    { key: 'price_asc', label: 'Narx ↑' },
    { key: 'price_desc', label: 'Narx ↓' },
    { key: 'name', label: 'Kodi bo\'yicha' },
];

function sortItems(items: KarnizItem[], sort: SortKey): KarnizItem[] {
    const list = [...items];
    if (sort === 'price_asc') return list.sort((a, b) => (a.narx_pm ?? 999999) - (b.narx_pm ?? 999999));
    if (sort === 'price_desc') return list.sort((a, b) => (b.narx_pm ?? 0) - (a.narx_pm ?? 0));
    if (sort === 'name') return list.sort((a, b) => a.kod.localeCompare(b.kod));
    return list;
}

// ─── Custom Sort Dropdown ────────────────────────────────────────────────────

function SortDropdown({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
    const [open, setOpen] = useState(false);
    const current = SORT_OPTIONS.find((o) => o.key === value) ?? SORT_OPTIONS[0];

    return (
        <div className="relative" style={{ width: '275px' }}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between px-4 bg-white"
                style={{
                    height: '42px',
                    border: '2px solid #3b2a26',
                    borderRadius: '12px',
                    fontSize: '17px',
                    color: '#333',
                }}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span>{current.label}</span>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#12a870"
                    strokeWidth="2.5"
                    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {open && (
                <ul
                    className="absolute z-20 w-full bg-white border border-gray-200 shadow-lg mt-1 overflow-hidden"
                    style={{ borderRadius: '8px' }}
                    role="listbox"
                >
                    {SORT_OPTIONS.map((opt) => (
                        <li
                            key={opt.key}
                            onClick={() => { onChange(opt.key); setOpen(false); }}
                            className="px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors text-sm"
                            style={{ color: opt.key === value ? 'var(--ed-green)' : '#333', fontWeight: opt.key === value ? 600 : 400 }}
                            role="option"
                            aria-selected={opt.key === value}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// ─── Card skeleton ───────────────────────────────────────────────────────────

function CardSkeleton() {
    return (
        <div className="animate-pulse" style={{ aspectRatio: '255/208', backgroundColor: '#152f40' }}>
            <div style={{ height: '176px', backgroundColor: '#1a3a50' }} />
            <div style={{ height: '32px', backgroundColor: '#6aa030' }} />
        </div>
    );
}

// ─── Sidebar nav ─────────────────────────────────────────────────────────────

function KatalogSideNav({ currentSlug }: { currentSlug: string }) {
    return (
        <aside className="hidden xl:block w-52 flex-shrink-0 text-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-2 py-1 mb-1">
                Karniz kataloglari
            </p>
            {allKataloglar.map((k) => (
                <Link
                    key={k.slug}
                    href={`/katalog/karnizlar/${k.slug}/`}
                    className={`block px-3 py-2 transition-colors rounded ${k.slug === currentSlug
                            ? 'font-semibold text-white'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    style={k.slug === currentSlug ? { backgroundColor: '#152f40' } : {}}
                >
                    {k.nomi}
                </Link>
            ))}
        </aside>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

function KatalogListPageInner({ slug }: { slug: string }) {
    const katalog = getKatalogBySlug(slug);
    const karnizlar = getKarnizlarByKatalog(slug);
    const [sort, setSort] = useState<SortKey>('default');
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterInStock, setFilterInStock] = useState(false);

    const sorted = useMemo(() => {
        let list = [...karnizlar];
        if (filterInStock) list = list.filter((k) => k.ombor_pm !== null && k.ombor_pm > 0);
        return sortItems(list, sort);
    }, [karnizlar, sort, filterInStock]);

    if (!katalog) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold text-gray-700 mb-4">Katalog topilmadi</h1>
                        <Link href="/katalog/karnizlar/" className="text-[color:var(--ed-green)] underline">
                            Barcha kataloglarga qaytish
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-1">
                <div className="mx-auto px-4 sm:px-6 py-5" style={{ maxWidth: '1200px' }}>

                    {/* Breadcrumb */}
                    <nav className="flex flex-wrap items-center gap-0 text-base mb-5" style={{ color: '#333' }}>
                        <Link href="/" className="inline-block py-2 hover:underline">Bosh sahifa</Link>
                        <span className="mx-1 text-gray-400">/</span>
                        <Link href="/katalog/karnizlar/" className="hover:underline">Karnizlar</Link>
                        <span className="mx-1 text-gray-400">/</span>
                        <span>{katalog.nomi}</span>
                    </nav>

                    {/* H1 */}
                    <h1 className="mb-6" style={{ fontSize: '48px', fontWeight: 400, color: '#333', lineHeight: 1.15 }}>
                        {katalog.nomi} — karnizlar
                    </h1>

                    {/* Sort row */}
                    <div className="flex items-center gap-4 mb-5 flex-wrap">
                        <SortDropdown value={sort} onChange={setSort} />

                        {/* Filtr ikonkasi */}
                        <button
                            onClick={() => setFilterOpen((v) => !v)}
                            className="flex items-center gap-2 transition-opacity hover:opacity-80"
                            style={{ color: '#3b2a26' }}
                            aria-label="Filtrlar"
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b2a26" strokeWidth="2">
                                <line x1="4" y1="6" x2="20" y2="6" />
                                <line x1="8" y1="12" x2="20" y2="12" />
                                <line x1="12" y1="18" x2="20" y2="18" />
                                <circle cx="4" cy="6" r="1.5" fill="#3b2a26" stroke="none" />
                                <circle cx="8" cy="12" r="1.5" fill="#3b2a26" stroke="none" />
                                <circle cx="12" cy="18" r="1.5" fill="#3b2a26" stroke="none" />
                            </svg>
                            <span className="text-sm font-medium">Filtr</span>
                        </button>

                        <p className="text-sm text-gray-500 ml-auto">
                            {sorted.length} ta mahsulot
                        </p>
                    </div>

                    {/* Filter panel */}
                    {filterOpen && (
                        <div className="border border-gray-200 rounded-lg p-4 mb-5 bg-gray-50 flex flex-wrap gap-4 items-center">
                            <label className="flex items-center gap-2 cursor-pointer text-sm">
                                <input
                                    type="checkbox"
                                    checked={filterInStock}
                                    onChange={(e) => setFilterInStock(e.target.checked)}
                                    style={{ accentColor: 'var(--ed-green)', width: 16, height: 16 }}
                                />
                                <span>Faqat omborda borlar</span>
                            </label>
                            {filterInStock && (
                                <button
                                    onClick={() => setFilterInStock(false)}
                                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    ✕ Filtrni o&apos;chirish
                                </button>
                            )}
                        </div>
                    )}

                    {/* Main layout */}
                    <div className="flex gap-6 items-start">
                        <KatalogSideNav currentSlug={slug} />

                        {/* Grid */}
                        <div className="flex-1 min-w-0">
                            {sorted.length === 0 ? (
                                <div className="text-center py-20">
                                    <p className="text-gray-500 text-lg">Hech narsa topilmadi</p>
                                    <button
                                        onClick={() => setFilterInStock(false)}
                                        className="mt-4 text-sm text-[color:var(--ed-green)] underline"
                                    >
                                        Filtrni tozalash
                                    </button>
                                </div>
                            ) : (
                                <div className="karniz-grid grid">
                                    {sorted.map((item) => (
                                        <KarnizCard key={item.kod} item={item} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SEO matn */}
                    <div className="mt-16 max-w-2xl">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                            Elit Dekor — {katalog.nomi.toLowerCase()} karnizlar
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-3">
                            Elit Dekor kompaniyasi zavoddagi o&apos;z ishlab chiqarishida gips karnizlarining
                            keng assortimentini taqdim etadi. Barcha mahsulotlar yuqori sifatli G-16 markali
                            gipsdan tayyorlanadi va uzoq muddatli foydalanishga mo&apos;ljallangan.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            {katalog.nomi} bo&apos;limidagi karnizlar interyer bezatishda eng yaxshi yechim
                            hisoblanadi. O&apos;rnatish bo&apos;yicha maslahat va narx haqida mutaxassislarimizga
                            murojaat qiling.
                        </p>
                    </div>

                </div>
            </main>

            {/* Floating */}
            <FloatingElements />
            <CookieBanner />

            <Footer />

            {/* CSS: responsive grid */}
            <style>{`
        .karniz-grid {
          grid-template-columns: repeat(4, 1fr);
          column-gap: 14px;
          row-gap: 48px;
        }
        @media (max-width: 1199px) {
          .karniz-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 767px) {
          .karniz-grid { grid-template-columns: repeat(2, 1fr); column-gap: 10px; row-gap: 16px; }
        }
      `}</style>
        </div>
    );
}

// ─── Lazy-imported components ─────────────────────────────────────────────────

function FloatingElements() {
    return null; // FloatingButtons komponentlari quyida alohida faylda
}

function CookieBanner() {
    return null; // CookieBar quyida alohida faylda
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function KatalogListPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1 px-4 py-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', columnGap: '14px', rowGap: '60px' }}>
                            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
                        </div>
                    </main>
                    <Footer />
                </div>
            }
        >
            <KatalogListPageInner slug={slug} />
        </Suspense>
    );
}
