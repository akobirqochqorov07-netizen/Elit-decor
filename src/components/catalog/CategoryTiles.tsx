'use client';

import { Link } from '@/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { allKarnizlar } from '@/data/karnizlar';
import { allBortkarnizlar } from '@/data/bortkarnizlar';

export default function CategoryTiles() {
    const t = useTranslations('CatalogHub');
    const categories = [
        {
            id: 'karnizlar',
            title: t('karnizlar_title'),
            count: allKarnizlar?.length ?? 83,
            badge: null,
            href: '/katalog/karnizlar/',
            img: '/images/karnizlar/katalog-1-katta/karniz-006-kok.jpg',
        },
        {
            id: 'bortkarnizlar',
            title: t('bortkarnizlar_title'),
            count: allBortkarnizlar?.length ?? 26,
            badge: null,
            href: '/katalog/bortkarnizlar/',
            img: '/images/bortkarnizlar/bortkarniz-001-kok.jpg',
        },
        {
            id: 'moldinglar',
            title: t('moldinglar_title'),
            count: null,
            badge: t('coming_soon_badge'),
            href: '/katalog/moldinglar/',
            img: '/images/categories/moldinglar.jpg',
        },
        {
            id: 'rozetkalar',
            title: t('rozetkalar_title'),
            count: null,
            badge: t('coming_soon_badge'),
            href: '/katalog/rozetkalar/',
            img: '/images/categories/rozetkalar.jpg',
        },
        {
            id: 'frizlar',
            title: t('frizlar_title'),
            count: null,
            badge: t('coming_soon_badge'),
            href: '/katalog/frizlar/',
            img: '/images/categories/frizlar.jpg',
        },
        {
            id: 'burchaklar',
            title: t('burchaklar_title'),
            count: null,
            badge: t('coming_soon_badge'),
            href: '/katalog/burchaklar/',
            img: '/images/categories/burchaklar.jpg',
        },
        {
            id: 'porezkalar',
            title: t('porezkalar_title'),
            count: null,
            badge: t('coming_soon_badge'),
            href: '/katalog/porezkalar/',
            img: '/images/categories/porezkalar.jpg',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categories.map((c) => (
                <Link
                    key={c.id}
                    href={c.href}
                    className="group block overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] transition-all hover:shadow-xl"
                    style={{ backgroundColor: '#152f40' }}
                >
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
                        <Image
                            src={c.img}
                            alt={c.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                            quality={95}
                            className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                        />
                    </div>
                    <div
                        className="flex items-center justify-between px-5 sm:px-6 py-4"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0e2738' }}
                    >
                        <div className="flex items-baseline gap-3">
                            <span className="text-white text-lg sm:text-xl font-medium tracking-tight">{c.title}</span>
                            {c.count !== null ? (
                                <span className="text-white/50 text-sm tabular-nums">{c.count}</span>
                            ) : (
                                <span className="text-[#E8D39E] text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C5A265]/20 border border-[#C5A265]/30">
                                    {c.badge}
                                </span>
                            )}
                        </div>
                        <span
                            className="flex items-center justify-center w-9 h-9 rounded-full text-white transition-all duration-300 group-hover:translate-x-1"
                            style={{ border: '1px solid rgba(212,175,55,0.5)', color: '#D4AF37' }}
                            aria-hidden
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
