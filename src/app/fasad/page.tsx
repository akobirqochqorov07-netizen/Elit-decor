'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { CartProvider } from '@/context/CartContext';

export default function FasadPage() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-green-600">Главная</Link>
              <span>/</span>
              <span className="text-gray-800">Стеклофибробетон</span>
            </nav>

            <h1 className="text-3xl font-medium text-gray-800 mb-8">Стеклофибробетон (СФБ)</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Стеклофибробетон (СФБ) — это материал, полученный путем армирования цементного раствора стекловолокном.
                  Обладает высокой прочностью, морозостойкостью и долговечностью.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Идеально подходит для фасадного декора: карнизов, колонн, пилястр и других архитектурных элементов.
                </p>
                <ul className="space-y-3 mb-6">
                  {['Высокая прочность', 'Морозостойкость', 'Влагостойкость', 'Долговечность', 'Идеально для фасадов']?.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/catalog-facade/" className="inline-block bg-green-500 text-white px-6 py-3 rounded font-medium hover:bg-green-600 transition-colors">
                  Каталог фасадного декора
                </Link>
              </div>
              <div className="bg-gray-50 rounded p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Заказать изделия из СФБ</h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
