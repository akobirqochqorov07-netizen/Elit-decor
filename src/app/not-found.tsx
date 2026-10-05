'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center px-4">
        <h1 className="text-8xl font-bold text-green-500 mb-4">404</h1>
        <h2 className="text-2xl font-medium text-gray-800 mb-4">Страница не найдена</h2>
        <p className="text-gray-600 mb-8">Запрашиваемая страница не существует или была удалена.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-green-500 text-white px-8 py-3 rounded font-medium hover:bg-green-600 transition-colors">
            На главную
          </Link>
          <Link href="/catalog/" className="border border-green-500 text-green-600 px-8 py-3 rounded font-medium hover:bg-green-50 transition-colors">
            В каталог
          </Link>
        </div>
      </div>
    </div>
  );
}