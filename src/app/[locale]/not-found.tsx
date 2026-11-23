'use client';

import React from 'react';
import { Link } from '@/navigation';
import { useLocale } from 'next-intl';

export default function NotFound() {
  const locale = useLocale();

  const isRu = locale === 'ru';
  const isEn = locale === 'en';

  const title = isRu
    ? 'Страница не найдена'
    : isEn
    ? 'Page not found'
    : 'Sahifa topilmadi';

  const desc = isRu
    ? 'Страница, которую вы ищете, не существует или была удалена.'
    : isEn
    ? 'The page you are looking for does not exist or has been removed.'
    : "Siz qidirgan sahifa mavjud emas yoki o'chirilgan.";

  const btnHome = isRu ? 'На главную' : isEn ? 'Go Home' : 'Bosh sahifaga';
  const btnCatalog = isRu ? 'В каталог' : isEn ? 'Catalog' : 'Katalogga';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center px-4">
        <h1 className="text-8xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-2xl font-medium text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 mb-8">{desc}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-primary text-white px-8 py-3 rounded font-medium hover:bg-primary-dark transition-colors"
          >
            {btnHome}
          </Link>
          <Link
            href="/catalog/"
            className="border border-primary text-primary px-8 py-3 rounded font-medium hover:bg-gray-50 transition-colors"
          >
            {btnCatalog}
          </Link>
        </div>
      </div>
    </div>
  );
}
