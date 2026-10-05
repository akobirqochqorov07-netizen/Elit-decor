'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { CartProvider } from '@/context/CartContext';

export default function FibrogipsPage() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-green-600">Главная</Link>
              <span>/</span>
              <span className="text-gray-800">Стеклофиброгипс</span>
            </nav>

            <h1 className="text-3xl font-medium text-gray-800 mb-8">Стеклофиброгипс (СФГ)</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Стеклофиброгипс (СФГ) — это композитный материал, состоящий из гипса и стекловолокна.
                  Он обладает высокой прочностью, легкостью и возможностью создания сложных архитектурных форм.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Изделия из СФГ идеально подходят для декорации интерьеров с высокими потолками,
                  куполов, арок, а также для фасадных работ.
                </p>
                <ul className="space-y-3 mb-6">
                  {['Высокая прочность', 'Легкость', 'Огнестойкость', 'Долговечность', 'Возможность создания сложных форм']?.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 rounded p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Заказать изделия из СФГ</h3>
                <ContactForm />
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-medium text-gray-800 mb-6">Применение СФГ</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Главный Храм ВС РФ', href: '/khram/', desc: 'Крупнейший проект с использованием СФГ' },
                  { title: 'Интерьерный декор', href: '/catalog/', desc: 'Карнизы, розетки, молдинги из СФГ' },
                  { title: 'Фасадный декор', href: '/catalog-facade/', desc: 'Карнизы, колонны, пилястры из СФГ' },
                ]?.map((item, i) => (
                  <Link key={i} href={item?.href} className="block p-4 border border-gray-200 rounded hover:border-green-300 hover:bg-green-50 transition-colors">
                    <h3 className="font-medium text-gray-800 mb-2">{item?.title}</h3>
                    <p className="text-sm text-gray-600">{item?.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
