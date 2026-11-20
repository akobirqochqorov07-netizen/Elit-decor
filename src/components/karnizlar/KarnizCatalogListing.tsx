'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import KarnizCard from '@/components/karnizlar/KarnizCard';
import {
    getBolimData,
    getKarnizlarByKatalog,
    BOLIM_NOMI,
    type Bolim,
    type KarnizItem,
} from '@/data/karnizlar';

type SortKey = 'default' | 'price_asc' | 'price_desc' | 'code_asc' | 'dim_asc';

interface SortOption {
    key: SortKey;
    label: string;
}

const SORT_OPTIONS: SortOption[] = [
    { key: 'default', label: 'Standart tartib' },
    { key: 'price_asc', label: 'Narx: arzondan qimmatga ↑' },
    { key: 'price_desc', label: 'Narx: qimmatdan arzonga ↓' },
    { key: 'code_asc', label: "Kod bo'yicha (K-001...)" },
    { key: 'dim_asc', label: "O'lcham bo'yicha (kichikdan kattaga)" },
];

interface KarnizCatalogListingProps {
    initialGroup?: string;
    bolim?: Bolim;
}

export default function KarnizCatalogListing({ initialGroup = 'all', bolim = 'karnizlar' }: KarnizCatalogListingProps) {
    const { items: allKarnizlar, kataloglar: allKataloglar } = getBolimData(bolim);
    const nomi = BOLIM_NOMI[bolim];
    const [group, setGroup] = useState<string>(initialGroup);
    const [sort, setSort] = useState<SortKey>('default');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterOnlyWithPrice, setFilterOnlyWithPrice] = useState<boolean>(false);

    const activeCategory = allKataloglar.find((k) => k.slug === group);

    const filteredAndSortedItems = useMemo(() => {
        let list: KarnizItem[] =
            group === 'all' ? [...allKarnizlar] : getKarnizlarByKatalog(group);

        if (filterOnlyWithPrice) {
            list = list.filter((item) => item.narx_pm !== null && item.narx_pm > 0);
        }

        const q = searchQuery.trim().toLowerCase().replace(/\s+/g, '');
        if (q) {
            list = list.filter((item) => {
                const kod = item.kod.toLowerCase().replace(/[-_\s]/g, '');
                const displayKod = item.korsatiladigan_kod.toLowerCase().replace(/[-_\s]/g, '');
                const numOnly = item.kod.replace(/\D/g, '');
                const catName = item.katalog_nomi.toLowerCase();
                const dims = `${item.balandlik_mm || ''}x${item.kenglik_mm || ''}`.toLowerCase();
                return (
                    kod.includes(q) ||
                    displayKod.includes(q) ||
                    numOnly.includes(q) ||
                    catName.includes(q) ||
                    dims.includes(q)
                );
            });
        }

        const sorted = [...list];
        switch (sort) {
            case 'price_asc':
                sorted.sort((a, b) => {
                    if (a.narx_pm === null && b.narx_pm === null) return 0;
                    if (a.narx_pm === null) return 1;
                    if (b.narx_pm === null) return -1;
                    return a.narx_pm - b.narx_pm;
                });
                break;
            case 'price_desc':
                sorted.sort((a, b) => {
                    if (a.narx_pm === null && b.narx_pm === null) return 0;
                    if (a.narx_pm === null) return 1;
                    if (b.narx_pm === null) return -1;
                    return b.narx_pm - a.narx_pm;
                });
                break;
            case 'code_asc':
                sorted.sort((a, b) => {
                    const numA = parseInt(a.kod.replace(/\D/g, '') || '0', 10);
                    const numB = parseInt(b.kod.replace(/\D/g, '') || '0', 10);
                    return numA - numB;
                });
                break;
            case 'dim_asc':
                sorted.sort((a, b) => {
                    const maxDimA = Math.max(a.balandlik_mm || 0, a.kenglik_mm || 0);
                    const maxDimB = Math.max(b.balandlik_mm || 0, b.kenglik_mm || 0);
                    if (maxDimA === 0 && maxDimB === 0) return 0;
                    if (maxDimA === 0) return 1;
                    if (maxDimB === 0) return -1;
                    return maxDimA - maxDimB;
                });
                break;
        }

        return sorted;
    }, [group, sort, searchQuery, filterOnlyWithPrice, allKarnizlar]);

    const activeSortLabel = SORT_OPTIONS.find((o) => o.key === sort)?.label || 'Standart tartib';

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-1 bg-white">
                <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

                    {/* Breadcrumb */}
                    <nav className="flex flex-wrap items-center text-sm mb-4" style={{ color: '#4b5563' }}>
                        <Link href="/" className="inline-block py-1 hover:text-black transition-colors">
                            Bosh sahifa
                        </Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <Link href="/catalog/" className="inline-block py-1 hover:text-black transition-colors">
                            Katalog
                        </Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <Link
                            href={`/katalog/${bolim}/`}
                            onClick={(e) => {
                                if (group !== 'all') {
                                    e.preventDefault();
                                    setGroup('all');
                                }
                            }}
                            className={`inline-block py-1 ${group === 'all' ? 'text-gray-900 font-semibold' : 'hover:text-black transition-colors'}`}
                        >
                            {nomi.kop}
                        </Link>
                        {activeCategory && (
                            <>
                                <span className="mx-2 text-gray-400">/</span>
                                <span className="text-gray-900 font-semibold">{activeCategory.nomi}</span>
                            </>
                        )}
                    </nav>

                    {/* H1 */}
                    <div className="mb-6">
                        <h1
                            className="text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-900 mb-1 tracking-tight"
                            style={{ lineHeight: 1.15 }}
                        >
                            {activeCategory ? `${activeCategory.nomi} ${nomi.kop.toLowerCase()}` : `Interyer ${nomi.kop.toLowerCase()}`}
                        </h1>
                    </div>

                    {/* Category Tabs */}
                    <div className="mb-5 border-b border-gray-200 pb-3">
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none chips-scroll">
                            <button
                                type="button"
                                onClick={() => setGroup('all')}
                                className={`px-4 py-2.5 rounded text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 ${
                                    group === 'all'
                                        ? 'bg-[#152f40] text-white shadow-md border-b-2 border-[#D4AF37]'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                                }`}
                            >
                                <span>Barchasi</span>
                                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${group === 'all' ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                    {allKarnizlar.length}
                                </span>
                            </button>
                            {allKataloglar.map((kat) => {
                                const count = getKarnizlarByKatalog(kat.slug).length;
                                const isActive = group === kat.slug;
                                return (
                                    <button
                                        key={kat.slug}
                                        type="button"
                                        onClick={() => setGroup(kat.slug)}
                                        className={`px-4 py-2.5 rounded text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 ${
                                            isActive
                                                ? 'bg-[#152f40] text-white shadow-md border-b-2 border-[#D4AF37]'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                                        }`}
                                    >
                                        <span>{kat.nomi}</span>
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${isActive ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Controls: Sort + Search + Filter */}
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                        {/* Sort dropdown */}
                        <div className="relative">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as SortKey)}
                                className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 cursor-pointer hover:border-gray-400 focus:outline-none focus:border-[#152f40]"
                            >
                                {SORT_OPTIONS.map((o) => (
                                    <option key={o.key} value={o.key}>{o.label}</option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
                        </div>

                        {/* Search */}
                        <div className="relative flex-1 min-w-[180px] max-w-xs">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={bolim === 'bortkarnizlar' ? 'Qidirish: BK-001, 120×80...' : 'Qidirish: K-001, 30×30...'}
                                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#152f40]"
                            />
                            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                        </div>

                        {/* Only with price */}
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 select-none">
                            <input
                                type="checkbox"
                                checked={filterOnlyWithPrice}
                                onChange={(e) => setFilterOnlyWithPrice(e.target.checked)}
                                className="w-4 h-4 accent-[#152f40]"
                            />
                            Narxi borlar
                        </label>

                        {/* Count */}
                        <span className="ml-auto text-sm text-gray-500 font-medium whitespace-nowrap">
                            {filteredAndSortedItems.length} ta mahsulot
                        </span>
                    </div>

                    {/* Product Grid — 4 columns desktop */}
                    {filteredAndSortedItems.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                            {filteredAndSortedItems.map((item) => (
                                <KarnizCard key={item.kod} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <p className="text-gray-400 text-lg mb-4">Hech narsa topilmadi</p>
                            <button
                                type="button"
                                onClick={() => { setGroup('all'); setSearchQuery(''); setFilterOnlyWithPrice(false); }}
                                className="px-5 py-2 text-sm font-medium rounded text-white"
                                style={{ backgroundColor: '#152f40' }}
                            >
                                Hammasini ko&apos;rish
                            </button>
                        </div>
                    )}

                    {/* SEO text */}
                    <div className="mt-16 max-w-2xl">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                            {nomi.kop} — gips lepninadan
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-3">
                            Elit Dekor — O&apos;zbekistonda interyer va fasad uchun gips mahsulotlari ishlab chiqaruvchi zavod.
                            {nomi.kop}imiz yuqori sifatli G-16 markali gipsdan tayyorlanib, interyerga nafosatli ko&apos;rinish beradi.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Har bir {nomi.birlik.toLowerCase()}ning 3D modeli va texnik chizmasi mavjud. O&apos;rnatish xizmati ko&apos;rsatiladi.
                            Narx va o&apos;lchamlar bo&apos;yicha mutaxassislarimizga murojaat qiling.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
