'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { CartProvider } from '@/context/CartContext';
import { useTranslations } from 'next-intl';

export default function FasadPage() {
  const t = useTranslations('FasadPage');

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-accent">{t('breadcrumb_home')}</Link>
              <span>/</span>
              <span className="text-gray-800">{t('breadcrumb_facade')}</span>
            </nav>

            <h1 className="text-3xl font-medium text-gray-800 mb-8">{t('title')}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('desc1')}
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('desc2')}
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    t('feature1'),
                    t('feature2'),
                    t('feature3'),
                    t('feature4'),
                    t('feature5')
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/catalog-facade/" className="inline-block bg-primary text-white px-6 py-3 rounded font-medium hover:bg-primary-dark transition-colors">
                  {t('catalog_btn')}
                </Link>
              </div>
              <div className="bg-gray-50 rounded p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">{t('order_title')}</h3>
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
