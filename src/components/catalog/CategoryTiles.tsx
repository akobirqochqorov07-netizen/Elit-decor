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
            href: '/katalog/karnizlar/',
            img: '/images/karnizlar/katalog-1-katta/karniz-006-kok.jpg',
        },
        {
            id: 'bortkarnizlar',
            title: t('bortkarnizlar_title'),
            count: allBortkarnizlar?.length ?? 26,
            href: '/katalog/bortkarnizlar/',
            img: '/images/bortkarnizlar/bortkarniz-001-kok.jpg',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {categories.map((c) => (
                <Link
                    key={c.id}
                    href={c.href}
                    className="group block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                    style={{ backgroundColor: '#152f40' }}
                >
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
                        <Image
                            src={c.img}
                            alt={c.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 600px"
                            quality={100}
                            className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        />
                    </div>
                    <div
                        className="flex items-center justify-between px-5 sm:px-6 py-4"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0e2738' }}
                    >
                        <div className="flex items-baseline gap-3">
                            <span className="text-white text-lg sm:text-xl font-medium tracking-tight">{c.title}</span>
                            <span className="text-white/50 text-sm tabular-nums">{c.count}</span>
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
