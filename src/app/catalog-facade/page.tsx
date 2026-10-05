'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import { facadeCategories } from '@/data/catalog';

export default function CatalogFacadePage() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-green-600">Главная</Link>
              <span>/</span>
              <span className="text-gray-800">Фасадный декор</span>
            </nav>
            <h1 className="text-3xl font-medium text-gray-800 mb-4">Фасадный декор</h1>
            <p className="text-gray-600 mb-8">
              Гипсовая лепнина для фасадов зданий от завода Дикарт. Стеклофибробетон и стеклофиброгипс для наружных работ.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {facadeCategories?.map((cat) => (
                <Link
                  key={cat?.id}
                  href={cat?.href}
                  className="group block"
                  style={{ backgroundColor: '#0a2734' }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={cat?.imgSrc}
                      alt={`${cat?.title} - фасадная лепнина Дикарт`}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      style={{ height: '140px', objectFit: 'cover' }}
                    />
                    <div
                      className="absolute top-0 left-0 right-0 text-xs text-white px-2 py-1"
                      style={{ backgroundColor: 'rgba(10,39,52,0.85)' }}
                    >
                      {cat?.price}/{cat?.unit}
                    </div>
                  </div>
                  <div className="px-2 py-2">
                    <span className="text-white text-sm font-medium group-hover:text-green-400 transition-colors">
                      {cat?.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
