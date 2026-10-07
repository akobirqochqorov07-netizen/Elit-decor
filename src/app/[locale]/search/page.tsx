'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import { useTranslations } from 'next-intl';

export default function SearchPage() {
  const t = useTranslations('SearchPage');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ title: string; href: string; type: string }>>([]);
  const [searched, setSearched] = useState(false);

  const allItems = [
    { title: 'Karnizlar / Карнизы', href: '/catalog/karnizy/', type: t('types.category') },
    { title: 'Rozetkalar / Розетки', href: '/catalog/rozetki/', type: t('types.category') },
    { title: 'Moldinglar / Молдинги', href: '/catalog/arched-frame/', type: t('types.category') },
    { title: 'Frizlar / Фризы', href: '/catalog/friezes/', type: t('types.category') },
    { title: 'Porezalar / Порезки', href: '/catalog/cutting/', type: 'Категория' },
    { title: 'Kaminlar / Камины', href: '/catalog/decorative-fireplaces/', type: t('types.category') },
    { title: 'Ustunlar / Колонны', href: '/catalog/columns/', type: t('types.category') },
    { title: 'Pilyastrlar / Пилястры', href: '/catalog/pilasters/', type: t('types.category') },
    { title: 'Montaj / Монтаж', href: '/services/', type: t('types.service') },
    { title: 'O\'lcham olish / Замеры', href: '/services/', type: t('types.service') },
    { title: 'Galereya / Галерея', href: '/gallery/', type: t('types.page') },
    { title: 'Biz haqimizda / О компании', href: '/about/', type: t('types.page') },
    { title: 'Aloqa / Контакты', href: '/contacts/', type: t('types.page') },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const q = query.toLowerCase();
    const found = allItems.filter(item => item.title.toLowerCase().includes(q));
    setResults(found);
    setSearched(true);
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
            <h1 className="text-3xl font-medium text-gray-800 mb-6">{t('title')}</h1>

            <form onSubmit={handleSearch} className="flex gap-3 mb-8">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('placeholder')}
                className="flex-1 border border-gray-300 rounded px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <button type="submit" className="bg-primary text-white px-6 py-3 rounded font-medium hover:bg-primary-dark transition-colors">
                {t('submit_btn')}
              </button>
            </form>

            {searched && (
              <div>
                <p className="text-sm text-gray-500 mb-4">{t('found_count')}: {results.length} {t('results_suffix')}</p>
                {results.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg mb-2">{t('empty_title')}</p>
                    <p className="text-sm">{t('empty_desc')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {results.map((item, i) => (
                      <Link key={i} href={item.href} className="flex items-center gap-3 p-4 border border-gray-200 rounded hover:border-accent hover:bg-gray-50 transition-colors">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{item.type}</span>
                        <span className="text-gray-800 font-medium">{item.title}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#174872" strokeWidth="2" className="ml-auto">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
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
    </CartProvider>
  );
}
