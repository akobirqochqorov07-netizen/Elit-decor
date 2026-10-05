'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { CartProvider } from '@/context/CartContext';

const articleContent = {
  '1606558': {
    title: 'Гипсовые молдинги в интерьере: акценты, которые меняют восприятие пространства',
    imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/90d/i1rtbo9r3pyme97ni11wxrtbyr3b2wtw/700_500_1/img_31.webp',
    date: '2024-01-15',
    content: `
      <p>Вы когда-нибудь замечали, что одна комната кажется просторнее и выше, а другая – тесной, даже если их размеры одинаковы? Секрет не всегда в планировке или мебели.</p>
      <p>Гипсовые молдинги — это один из самых эффективных способов изменить восприятие пространства. Они создают визуальные линии, которые направляют взгляд вверх или вдоль стен, делая помещение визуально выше или шире.</p>
      <h2>Как молдинги влияют на восприятие пространства</h2>
      <p>Горизонтальные молдинги вдоль стен визуально расширяют пространство. Вертикальные молдинги делают потолок выше. Правильно подобранные молдинги создают ритм и структуру в пространстве.</p>
    `
  }
};

export default function ArticlePage({ params }: {params: {id: string;};}) {
  const article = articleContent[params.id as keyof typeof articleContent] || {
    title: 'Статья',
    imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/90d/i1rtbo9r3pyme97ni11wxrtbyr3b2wtw/700_500_1/img_31.webp',
    date: '2024-01-01',
    content: '<p>Содержимое статьи в разработке.</p>'
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '900px' }}>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-green-600">Главная</Link>
              <span>/</span>
              <Link href="/articles/" className="hover:text-green-600">Блог</Link>
              <span>/</span>
              <span className="text-gray-800 truncate max-w-xs">{article.title}</span>
            </nav>

            <article>
              <h1 className="text-3xl font-medium text-gray-800 mb-4">{article.title}</h1>
              <p className="text-sm text-gray-400 mb-6">{new Date(article.date).toLocaleDateString('ru-RU')}</p>
              <img
                src={article.imgSrc}
                alt={article.title}
                className="w-full rounded object-cover mb-8"
                style={{ maxHeight: '400px', objectFit: 'cover' }} />
              
              <div
                className="prose max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }} />
              
            </article>

            <div className="mt-12 border-t border-gray-100 pt-10">
              <h2 className="text-2xl font-medium text-gray-800 mb-2">Остались вопросы?</h2>
              <p className="text-gray-600 mb-6">Заполните форму и мы свяжемся с вами</p>
              <ContactForm />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>);

}