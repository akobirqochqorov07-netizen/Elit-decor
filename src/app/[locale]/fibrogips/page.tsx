'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { CartProvider } from '@/context/CartContext';
import { useTranslations } from 'next-intl';

export default function FibrogipsPage() {
  const t = useTranslations('FibrogipsPage');

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-accent">{t('breadcrumb_home')}</Link>
              <span>/</span>
              <span className="text-gray-800">{t('breadcrumb_fibro')}</span>
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
              </div>
              <div className="bg-gray-50 rounded p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">{t('order_title')}</h3>
                <ContactForm />
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-medium text-gray-800 mb-6">{t('usage_title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: t('use1_title'), href: '/gallery/', desc: t('use1_desc') },
                  { title: t('use2_title'), href: '/catalog/', desc: t('use2_desc') },
                  { title: t('use3_title'), href: '/catalog-facade/', desc: t('use3_desc') },
                ]?.map((item, i) => (
                  <Link key={i} href={item.href} className="block p-4 border border-gray-200 rounded hover:border-accent hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
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
