'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { CartProvider } from '@/context/CartContext';
import { useTranslations } from 'next-intl';

const articles = [
  {
    id: '1606558',
    title: 'Interyerdagi gips moldinglar: makonni idrok etishni o\'zgartiruvchi aksentlar',
    excerpt: 'Hech e\'tibor berganmisiz, bir xil o\'lchamdagi ikki xonadan biri kengroq va balandroq, ikkinchisi esa torroq ko\'rinadi? Sir har doim ham rejalashtirish yoki mebelda emas.',
    imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/90d/i1rtbo9r3pyme97ni11wxrtbyr3b2wtw/700_500_1/img_31.webp',
    date: '2024-01-15',
    href: '/articles/1606558/'
  },
  {
    id: '2',
    title: 'Interyer uchun gips lepkani qanday tanlash kerak',
    excerpt: 'Gips lepka — bu shunchaki bezak emas, bu har qanday xonani o\'zgartiradigan san\'at. Interyeringiz uchun lepkani qanday to\'g\'ri tanlashni aytib beramiz.',
    imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/1cc/jjyiic2agrpb3eobha3vuuvc6ftl2vv4/310_210_1/Rectangle-136-_1_.jpg',
    date: '2024-01-10',
    href: '/articles/2/'
  },
  {
    id: '3',
    title: 'Gips va poliuretan: interyer uchun qaysi birini tanlash kerak',
    excerpt: 'Ko\'pchilik o\'ylanadi: qaysi biri afzal — gipsmi yoki poliuretan? Aniq javob beramiz: gips barcha ko\'rsatkichlar bo\'yicha poliuretandan ustun turadi.',
    imgSrc: 'https://dikart.ru/local/templates/dikart-new/images/img-20.png',
    date: '2024-01-05',
    href: '/articles/3/'
  }
];

export default function BlogPage() {
  const t = useTranslations('ArticlesPage');

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-accent">{t('breadcrumb_home')}</Link>
              <span>/</span>
              <span className="text-gray-800">{t('breadcrumb_blog')}</span>
            </nav>

            <h1 className="text-3xl font-medium text-gray-800 mb-8">{t('title')}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {articles?.map((article) => (
                <article key={article?.id} className="border border-gray-200 rounded overflow-hidden hover:shadow-md transition-shadow">
                  <Link href={article?.href}>
                    <img
                      src={article?.imgSrc}
                      alt={article?.title}
                      className="w-full object-cover hover:scale-105 transition-transform duration-300"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  </Link>
                  <div className="p-4">
                    <p className="text-xs text-gray-400 mb-2">{article.date}</p>
                    <Link href={article?.href} className="block font-medium text-gray-800 hover:text-accent transition-colors mb-2">
                      {article?.title}
                    </Link>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{article?.excerpt}</p>
                    <Link href={article?.href} className="text-sm text-accent hover:underline font-medium">
                      {t('read_more')}
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-10">
              <h2 className="text-2xl font-medium text-gray-800 mb-2">{t('questions_title')}</h2>
              <p className="text-gray-600 mb-6">{t('questions_desc')}</p>
              <ContactForm />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}