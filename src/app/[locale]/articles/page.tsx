'use client';

import React from 'react';
import { Link } from '@/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { useTranslations, useLocale } from 'next-intl';

const articlesData = {
  uz: [
    {
      id: '1606558',
      title: "Interyerdagi gips moldinglar: makonni idrok etishni o'zgartiruvchi aksentlar",
      excerpt:
        "Hech e'tibor berganmisiz, bir xil o'lchamdagi ikki xonadan biri kengroq va balandroq, ikkinchisi esa torroq ko'rinadi? Sir har doim ham rejalashtirish yoki mebelda emas.",
      imgSrc:
        'https://dikart.ru/upload/resize_cache/iblock/90d/i1rtbo9r3pyme97ni11wxrtbyr3b2wtw/700_500_1/img_31.webp',
      date: '2024-01-15',
      href: '/articles/1606558/',
    },
    {
      id: '2',
      title: 'Interyer uchun gips lepkani qanday tanlash kerak',
      excerpt:
        "Gips lepka — bu shunchaki bezak emas, bu har qanday xonani o'zgartiradigan san'at. Interyeringiz uchun lepkani qanday to'g'ri tanlashni aytib beramiz.",
      imgSrc:
        'https://dikart.ru/upload/resize_cache/iblock/1cc/jjyiic2agrpb3eobha3vuuvc6ftl2vv4/310_210_1/Rectangle-136-_1_.jpg',
      date: '2024-01-10',
      href: '/articles/2/',
    },
    {
      id: '3',
      title: 'Gips va poliuretan: interyer uchun qaysi birini tanlash kerak',
      excerpt:
        "Ko'pchilik o'ylanadi: qaysi biri afzal — gipsmi yoki poliuretan? Aniq javob beramiz: gips barcha ko'rsatkichlar bo'yicha poliuretandan ustun turadi.",
      imgSrc: 'https://dikart.ru/local/templates/dikart-new/images/img-20.png',
      date: '2024-01-05',
      href: '/articles/3/',
    },
  ],
  ru: [
    {
      id: '1606558',
      title: 'Гипсовые молдинги в интерьере: акценты, меняющие восприятие пространства',
      excerpt:
        'Замечали ли вы, что из двух комнат одного размера одна кажется просторнее и выше, а другая теснее? Секрет не всегда в планировке или мебели.',
      imgSrc:
        'https://dikart.ru/upload/resize_cache/iblock/90d/i1rtbo9r3pyme97ni11wxrtbyr3b2wtw/700_500_1/img_31.webp',
      date: '2024-01-15',
      href: '/articles/1606558/',
    },
    {
      id: '2',
      title: 'Как выбрать гипсовую лепнину для интерьера',
      excerpt:
        'Гипсовая лепнина — это не просто декор, это искусство, преображающее любую комнату. Рассказываем, как правильно выбрать лепнину.',
      imgSrc:
        'https://dikart.ru/upload/resize_cache/iblock/1cc/jjyiic2agrpb3eobha3vuuvc6ftl2vv4/310_210_1/Rectangle-136-_1_.jpg',
      date: '2024-01-10',
      href: '/articles/2/',
    },
    {
      id: '3',
      title: 'Гипс или полиуретан: что выбрать для интерьера',
      excerpt:
        'Многие задаются вопросом: что лучше — гипс или полиуретан? Отвечаем точно: гипс превосходит полиуретан по всем ключевым параметрам.',
      imgSrc: 'https://dikart.ru/local/templates/dikart-new/images/img-20.png',
      date: '2024-01-05',
      href: '/articles/3/',
    },
  ],
  en: [
    {
      id: '1606558',
      title: 'Gypsum moldings in the interior: accents that transform spatial perception',
      excerpt:
        'Have you ever noticed that of two rooms of equal size, one feels higher and more spacious while the other feels cramped? The secret lies in architectural trim.',
      imgSrc:
        'https://dikart.ru/upload/resize_cache/iblock/90d/i1rtbo9r3pyme97ni11wxrtbyr3b2wtw/700_500_1/img_31.webp',
      date: '2024-01-15',
      href: '/articles/1606558/',
    },
    {
      id: '2',
      title: 'How to choose gypsum architectural moldings for your interior',
      excerpt:
        'Gypsum molding is not just decoration, it is an art that transforms any room. Here is our guide on selecting the best molding for your home.',
      imgSrc:
        'https://dikart.ru/upload/resize_cache/iblock/1cc/jjyiic2agrpb3eobha3vuuvc6ftl2vv4/310_210_1/Rectangle-136-_1_.jpg',
      date: '2024-01-10',
      href: '/articles/2/',
    },
    {
      id: '3',
      title: 'Gypsum vs Polyurethane: which one to choose for interior design',
      excerpt:
        'Many wonder: which is superior — gypsum or polyurethane? The definitive answer: gypsum outperforms polyurethane in durability, eco-friendliness, and aesthetics.',
      imgSrc: 'https://dikart.ru/local/templates/dikart-new/images/img-20.png',
      date: '2024-01-05',
      href: '/articles/3/',
    },
  ],
};

export default function BlogPage() {
  const t = useTranslations('ArticlesPage');
  const locale = (useLocale() || 'uz') as 'uz' | 'ru' | 'en';
  const articles = articlesData[locale] || articlesData.uz;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-accent">
              {t('breadcrumb_home')}
            </Link>
            <span>/</span>
            <span className="text-gray-800">{t('breadcrumb_blog')}</span>
          </nav>

          <h1 className="text-3xl font-medium text-gray-800 mb-8">{t('title')}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white border border-gray-200 rounded overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative overflow-hidden" style={{ height: '220px' }}>
                  <img
                    src={article.imgSrc}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs text-gray-600 px-2 py-1 rounded">
                    {article.date}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-lg font-medium text-gray-800 mb-3 hover:text-accent transition-colors line-clamp-2">
                    <Link href={article.href}>{article.title}</Link>
                  </h2>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">{article.excerpt}</p>
                  <Link
                    href={article.href}
                    className="text-accent text-sm font-medium hover:underline inline-flex items-center gap-1"
                  >
                    {t('read_more')}
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-medium text-gray-800 mb-2">{t('questions_title')}</h2>
            <p className="text-gray-600 mb-8">{t('questions_desc')}</p>
            <ContactForm source="Blog sahifasi" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
