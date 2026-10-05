'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { CartProvider } from '@/context/CartContext';

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const serviceNames: Record<string, string> = {
    montazh: 'Профессиональный монтаж',
    measurements: 'Услуги замерщика',
    'design-project': 'Услуги дизайнера',
    delivery: 'Доставка',
    '3d-library': '3D-модели',
    fibrogips: 'Стеклофиброгипс',
    fasad: 'Стеклофибробетон',
  };

  const title = serviceNames[params.slug] || params.slug.replace(/-/g, ' ');

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-green-600">Главная</Link>
              <span>/</span>
              <Link href="/services/" className="hover:text-green-600">Услуги</Link>
              <span>/</span>
              <span className="text-gray-800">{title}</span>
            </nav>

            <h1 className="text-3xl font-medium text-gray-800 mb-8">{title}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Завод Дикарт предлагает профессиональные услуги по работе с гипсовой лепниной.
                  Наши специалисты имеют большой опыт работы с различными типами объектов.
                </p>
                <ul className="space-y-3 mb-6">
                  {['Гарантия качества работ', 'Опытные специалисты', 'Соблюдение сроков', 'Индивидуальный подход'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 rounded p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Заказать услугу</h3>
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
