'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import KarnizCard from '@/components/karnizlar/KarnizCard';
import {
    allKarnizlar,
    allKataloglar,
    getKarnizlarByKatalog,
    type KarnizItem,
} from '@/data/karnizlar';

type SortKey = 'default' | 'name';

export default function KarnizCatalogListing() {
    const [group, setGroup] = useState<string>('all');
    const [sort, setSort] = useState<SortKey>('default');

    const items = useMemo(() => {
        const list: KarnizItem[] =
            group === 'all' ? [...allKarnizlar] : getKarnizlarByKatalog(group);
        if (sort === 'name') list.sort((a, b) => a.kod.localeCompare(b.kod));
        return list;
    }, [group, sort]);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-1">
                <div className="mx-auto px-4 sm:px-6 py-5" style={{ maxWidth: '1200px' }}>
                    <nav className="flex flex-wrap items-center text-base mb-5" style={{ color: '#333' }}>
                        <Link href="/" className="hover:underline">
                            Bosh sahifa
                        </Link>
                        <span className="mx-1 text-gray-400">/</span>
                        <span>Karnizlar</span>
                    </nav>

                    <h1
                        className="mb-3"
                        style={{ fontSize: '40px', fontWeight: 400, color: '#333', lineHeight: 1.15 }}
                    >
                        Interyer karnizlar
                    </h1>
                    <p className="text-gray-500 mb-6 max-w-2xl text-base">
                        5 o&apos;lcham guruhida 50 ta gips karniz. Oq fondagi karta — mahsulotga
                        bosganda to&apos;liq ma&apos;lumot ochiladi.
                    </p>

                    <div className="flex flex-wrap gap-2 mb-5">
                        <button
                            type="button"
                            onClick={() => setGroup('all')}
                            className="px-3 py-1.5 text-sm border transition-colors"
                            style={{
                                borderColor: group === 'all' ? '#86c540' : '#ddd',
                                backgroundColor: group === 'all' ? '#152f40' : '#fff',
                                color: group === 'all' ? '#fff' : '#333',
                            }}
                        >
                            Barchasi ({allKarnizlar.length})
                        </button>
                        {allKataloglar.map((k) => (
                            <button
                                key={k.slug}
                                type="button"
                                onClick={() => setGroup(k.slug)}
                                className="px-3 py-1.5 text-sm border transition-colors"
                                style={{
                                    borderColor: group === k.slug ? '#86c540' : '#ddd',
                                    backgroundColor: group === k.slug ? '#152f40' : '#fff',
                                    color: group === k.slug ? '#fff' : '#333',
                                }}
                            >
                                {k.nomi}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 mb-5 flex-wrap">
                        <label className="text-sm text-gray-600 flex items-center gap-2">
                            Tartib:
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as SortKey)}
                                className="border border-gray-400 rounded-xl px-3 py-2 text-sm bg-white"
                                style={{ minWidth: '200px' }}
                            >
                                <option value="default">Standart</option>
                                <option value="name">Kod bo&apos;yicha</option>
                            </select>
                        </label>
                        <p className="text-sm text-gray-500 ml-auto">{items.length} ta mahsulot</p>
                    </div>

                    <div className="flex gap-6 items-start">
                        <aside className="hidden xl:block w-52 flex-shrink-0 text-sm">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-2 py-1 mb-1">
                                Karnizlar
                            </p>
                            <button
                                type="button"
                                onClick={() => setGroup('all')}
                                className={`block w-full text-left px-3 py-2 rounded ${
                                    group === 'all' ? 'font-semibold text-white' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                                style={group === 'all' ? { backgroundColor: '#152f40' } : {}}
                            >
                                Barchasi
                            </button>
                            {allKataloglar.map((k) => (
                                <button
                                    key={k.slug}
                                    type="button"
                                    onClick={() => setGroup(k.slug)}
                                    className={`block w-full text-left px-3 py-2 rounded ${
                                        group === k.slug
                                            ? 'font-semibold text-white'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                    style={group === k.slug ? { backgroundColor: '#152f40' } : {}}
                                >
                                    {k.nomi}
                                </button>
                            ))}
                        </aside>

                        <div className="flex-1 min-w-0">
                            <div className="karniz-grid grid">
                                {items.map((item) => (
                                    <KarnizCard key={item.kod} item={item} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 max-w-2xl">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                            Elit Dekor — gips karnizlar
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Barcha modellar G-16 gipsdan ishlab chiqariladi. O&apos;rnatish, o&apos;lchov va
                            narx bo&apos;yicha mutaxassislarimiz bilan bog&apos;laning.
                        </p>
                    </div>

                </div>
            </main>
            <Footer />
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
          .karniz-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 479px) {
          .karniz-grid { grid-template-columns: repeat(1, 1fr); }
        }
      `}</style>
        </div>
    );
}
