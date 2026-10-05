'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ title: string; href: string; type: string }>>([]);
  const [searched, setSearched] = useState(false);

  const allItems = [
    { title: 'Карнизы', href: '/catalog/karnizy/', type: 'Категория' },
    { title: 'Розетки', href: '/catalog/rozetki/', type: 'Категория' },
    { title: 'Молдинги', href: '/catalog/arched-frame/', type: 'Категория' },
    { title: 'Фризы', href: '/catalog/friezes/', type: 'Категория' },
    { title: 'Порезки', href: '/catalog/cutting/', type: 'Категория' },
    { title: 'Декоративные камины', href: '/catalog/decorative-fireplaces/', type: 'Категория' },
    { title: 'Колонны', href: '/catalog/columns/', type: 'Категория' },
    { title: 'Пилястры', href: '/catalog/pilasters/', type: 'Категория' },
    { title: 'Монтаж', href: '/montazh/', type: 'Услуга' },
    { title: 'Доставка', href: '/delivery/', type: 'Услуга' },
    { title: 'Замеры', href: '/measurements/', type: 'Услуга' },
    { title: 'Галерея', href: '/gallery/', type: 'Страница' },
    { title: 'О компании', href: '/about/', type: 'Страница' },
    { title: 'Контакты', href: '/contacts/', type: 'Страница' },
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
            <h1 className="text-3xl font-medium text-gray-800 mb-6">Поиск</h1>

            <form onSubmit={handleSearch} className="flex gap-3 mb-8">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Введите запрос..."
                className="flex-1 border border-gray-300 rounded px-4 py-3 text-sm outline-none focus:border-green-500"
              />
              <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded font-medium hover:bg-green-600 transition-colors">
                Найти
              </button>
            </form>

            {searched && (
              <div>
                <p className="text-sm text-gray-500 mb-4">Найдено: {results.length} результатов</p>
                {results.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg mb-2">Ничего не найдено</p>
                    <p className="text-sm">Попробуйте изменить запрос</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {results.map((item, i) => (
                      <Link key={i} href={item.href} className="flex items-center gap-3 p-4 border border-gray-200 rounded hover:border-green-300 hover:bg-green-50 transition-colors">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{item.type}</span>
                        <span className="text-gray-800 font-medium">{item.title}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6FC727" strokeWidth="2" className="ml-auto">
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
