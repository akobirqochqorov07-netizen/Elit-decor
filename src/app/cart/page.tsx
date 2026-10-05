'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider, useCart } from '@/context/CartContext';

function CartContent() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();

  if (items?.length === 0) {
    return (
      <div className="text-center py-20">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1" className="mx-auto mb-6">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <h2 className="text-2xl font-medium text-gray-700 mb-4">Корзина пуста</h2>
        <p className="text-gray-500 mb-6">Добавьте товары из каталога</p>
        <Link href="/catalog/" className="bg-green-500 text-white px-8 py-3 rounded font-medium hover:bg-green-600 transition-colors">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart items */}
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-gray-800">Товары в корзине ({totalItems})</h2>
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 transition-colors">
            Очистить корзину
          </button>
        </div>
        <div className="space-y-4">
          {items?.map((item) => (
            <div key={item?.id} className="flex gap-4 border border-gray-200 rounded p-4">
              <img src={item?.imgSrc} alt={item?.title} className="w-20 h-20 object-cover rounded flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-gray-800 mb-1">{item?.title}</p>
                {item?.sku && <p className="text-xs text-gray-500 mb-2">Арт.: {item?.sku}</p>}
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button onClick={() => updateQuantity(item?.id, item?.quantity - 1)} className="px-2 py-1 text-gray-600 hover:text-green-600">-</button>
                    <span className="px-3 py-1 text-sm">{item?.quantity}</span>
                    <button onClick={() => updateQuantity(item?.id, item?.quantity + 1)} className="px-2 py-1 text-gray-600 hover:text-green-600">+</button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{(item?.price * item?.quantity)?.toLocaleString('ru-RU')} руб.</p>
                    <p className="text-xs text-gray-500">{item?.price?.toLocaleString('ru-RU')} {item?.unit}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => removeItem(item?.id)} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Order summary */}
      <div>
        <div className="border border-gray-200 rounded p-6 sticky top-24">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Итого</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Товаров:</span>
              <span>{totalItems} шт.</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
              <span>Итого:</span>
              <span>{totalPrice?.toLocaleString('ru-RU')} руб.</span>
            </div>
          </div>
          <button className="w-full bg-green-500 text-white py-3 rounded font-medium hover:bg-green-600 transition-colors mb-3">
            Оформить заказ
          </button>
          <Link href="/catalog/" className="block text-center text-sm text-green-600 hover:text-green-700">
            Продолжить покупки
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-green-600">Главная</Link>
              <span>/</span>
              <span className="text-gray-800">Корзина</span>
            </nav>
            <h1 className="text-3xl font-medium text-gray-800 mb-8">Корзина</h1>
            <CartContent />
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
