'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ phone: '', name: '', email: '' });
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone && agreed) setSubmitted(true);
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-md px-4">
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <h1 className="text-2xl font-medium text-gray-800 mb-2 text-center">Регистрация</h1>
              <p className="text-sm text-gray-500 text-center mb-6">Личный кабинет дизайнера и партнера</p>

              {submitted ? (
                <div className="text-center">
                  <div className="text-green-500 text-5xl mb-4">✓</div>
                  <p className="text-gray-700">Регистрация успешна!</p>
                  <Link href="/" className="block mt-4 text-green-600 hover:text-green-700">На главную</Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Телефон *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+7 (___) ___-__-__"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Имя</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      placeholder="Иванов Иван"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      placeholder="email@example.com"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-500"
                    />
                  </div>
                  <label className="flex items-start gap-2 text-xs text-gray-500 cursor-pointer">
                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5" />
                    <span>Я согласен на обработку персональных данных в соответствии с <Link href="/information_for_client/7951/" className="text-green-600">политикой конфиденциальности</Link></span>
                  </label>
                  <button type="submit" className="w-full bg-green-500 text-white py-3 rounded font-medium hover:bg-green-600 transition-colors">
                    Зарегистрироваться
                  </button>
                  <p className="text-center text-sm text-gray-500">
                    Уже есть аккаунт?{' '}
                    <Link href="/login/" className="text-green-600 hover:text-green-700">Войти</Link>
                  </p>
                </form>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
