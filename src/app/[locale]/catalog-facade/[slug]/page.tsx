'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import { facadeCategories } from '@/data/catalog';

export default function FacadeCategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const category = facadeCategories.find(c => c.slug === params.slug);

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-green-600">Главная</Link>
              <span>/</span>
              <Link href="/catalog-facade/" className="hover:text-green-600">Фасадный декор</Link>
              <span>/</span>
              <span className="text-gray-800">{category?.title || categoryName}</span>
            </nav>
            <h1 className="text-3xl font-medium text-gray-800 mb-6">{category?.title || categoryName}</h1>
            <p className="text-gray-600 mb-8">Фасадный декор из стеклофибробетона и стеклофиброгипса от завода Дикарт.</p>
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg mb-2">Каталог в разработке</p>
              <p className="text-sm mb-4">Свяжитесь с нами для получения полного каталога</p>
              <Link href="/contacts/" className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition-colors">
                Связаться
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
