'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import brand from '@/lib/brand';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('AboutPage');

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-accent">{t('breadcrumb_home')}</Link>
              <span>/</span>
              <span className="text-gray-800">{t('breadcrumb_about')}</span>
            </nav>

            <h1 className="text-3xl font-medium text-gray-800 mb-8">{t('title')}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('desc1')}
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('desc2')}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {t('desc3')}
                </p>
              </div>
              <div>
                <div className="relative bg-gray-900 rounded overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    poster="https://dikart.ru/upload/video/main-02-poster.webp"
                    controls
                    preload="none">
                    <source src="https://dikart.ru/upload/video/main-01.mp4" type="video/mp4" />
                  </video>
                </div>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  <span className="font-medium">{t('director_role')}</span>
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 py-8 border-t border-b border-gray-100">
              {[
                { value: '2018', label: t('stat_year') },
                { value: '5000+', label: t('stat_items') },
                { value: '17K+', label: t('stat_projects') },
                { value: '250+', label: t('stat_designers') }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-4xl font-bold text-accent mb-2">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Advantages */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium text-gray-800 mb-6">{t('why_title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { img: 'https://dikart.ru/local/templates/dikart-new/images/img-02.svg', title: t('adv1_title'), text: t('adv1_desc') },
                  { img: 'https://dikart.ru/local/templates/dikart-new/images/img-04.svg', title: t('adv2_title'), text: t('adv2_desc') },
                  { img: 'https://dikart.ru/local/templates/dikart-new/images/img-05.svg', title: t('adv3_title'), text: t('adv3_desc') },
                  { img: 'https://dikart.ru/local/templates/dikart-new/images/img-06.svg', title: t('adv4_title'), text: t('adv4_desc') }
                ].map((item, i) => (
                  <div key={i} className="text-center p-4">
                    <img src={item.img} alt={item.title} className="w-16 h-16 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.text}</p>
                  </div>
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