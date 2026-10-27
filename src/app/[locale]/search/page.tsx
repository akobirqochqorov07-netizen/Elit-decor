'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { allKarnizlar } from '@/data/karnizlar';

type Result = { title: string; href: string; type: string };

function SearchInner() {
  const t = useTranslations('SearchPage');
  const searchParams = useSearchParams();
  const initial = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initial);
  const [results, setResults] = useState<Result[]>([]);
  const [searched, setSearched] = useState(false);

  const catalogItems: Result[] = useMemo(
    () => [
      { title: 'Karnizlar', href: '/catalog/', type: t('types.category') },
      ...allKarnizlar.map((k) => ({
        title: `${k.korsatiladigan_kod} ${k.katalog_nomi}`,
        href: `/katalog/karnizlar/${k.katalog_slug}/${k.kod}/`,
        type: k.katalog_nomi,
      })),
      { title: 'Galereya', href: '/gallery/', type: t('types.page') },
      { title: 'Biz haqimizda', href: '/about/', type: t('types.page') },
      { title: 'Aloqa', href: '/contacts/', type: t('types.page') },
      { title: 'Xizmatlar', href: '/services/', type: t('types.service') },
    ],
    [t]
  );

  const runSearch = (raw: string) => {
    const q = raw.trim().toLowerCase();
    if (!q) return;
    setResults(catalogItems.filter((item) => item.title.toLowerCase().includes(q)));
    setSearched(true);
  };

  useEffect(() => {
    if (initial.trim()) runSearch(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial, catalogItems]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
          <h1 className="text-3xl font-medium text-gray-800 mb-6">{t('title')}</h1>

          <form onSubmit={handleSearch} className="flex gap-3 mb-8">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('placeholder')}
              className="flex-1 border border-gray-300 rounded px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded font-medium hover:bg-primary-dark transition-colors"
            >
              {t('submit_btn')}
            </button>
          </form>

          {searched && (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                {t('found_count')}: {results.length} {t('results_suffix')}
              </p>
              {results.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">{t('empty_title')}</p>
                  <p className="text-sm">{t('empty_desc')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded hover:border-accent hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {item.type}
                      </span>
                      <span className="text-gray-800 font-medium">{item.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchInner />
    </Suspense>
  );
}
