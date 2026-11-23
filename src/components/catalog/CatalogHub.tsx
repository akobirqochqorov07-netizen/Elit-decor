'use client';

import { Link } from '@/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryTiles from '@/components/catalog/CategoryTiles';
import { useTranslations } from 'next-intl';

export default function CatalogHub() {
    const t = useTranslations('CatalogHub');

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-1">
                <div className="mx-auto px-4 sm:px-6 py-6 sm:py-8" style={{ maxWidth: '1200px' }}>
                    <nav className="flex items-center text-sm mb-6" style={{ color: '#4b5563' }}>
                        <Link href="/" className="hover:text-black transition-colors">
                            {t('breadcrumb_home')}
                        </Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <span className="text-gray-900">{t('breadcrumb_catalog')}</span>
                    </nav>

                    <h1
                        className="text-3xl sm:text-4xl font-normal text-gray-900 mb-8 tracking-tight"
                        style={{ lineHeight: 1.15 }}
                    >
                        {t('title')}
                    </h1>

                    <CategoryTiles />
                </div>
            </main>
            <Footer />
        </div>
    );
}
