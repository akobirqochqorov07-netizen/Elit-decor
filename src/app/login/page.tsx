'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [step, setStep] = useState<'phone' | 'code' | 'success'>('phone');
  const [code, setCode] = useState(['', '', '', '']);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone && agreed) setStep('code');
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-md px-4">
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <h1 className="text-2xl font-medium text-gray-800 mb-2 text-center">Добро пожаловать в Дикарт</h1>
              <p className="text-sm text-gray-500 text-center mb-6">Личный кабинет дизайнера и партнера</p>

              {step === 'phone' && (
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Телефон</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+7 (___) ___-__-__"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-500"
                    />
                  </div>
                  <label className="flex items-start gap-2 text-xs text-gray-500 cursor-pointer">
                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5" />
                    <span>Я согласен на обработку персональных данных в соответствии с <Link href="/information_for_client/7951/" className="text-green-600">политикой конфиденциальности</Link></span>
                  </label>
                  <button type="submit" className="w-full bg-green-500 text-white py-3 rounded font-medium hover:bg-green-600 transition-colors">
                    Получить код
                  </button>
                </form>
              )}

              {step === 'code' && (
                <form onSubmit={handleCodeSubmit} className="space-y-4">
                  <p className="text-sm text-gray-600 text-center">СМС код отправлен на номер <strong>{phone}</strong></p>
                  <div className="flex gap-3 justify-center">
                    {code.map((digit, i) => (
                      <input
                        key={i}
                        type="number"
                        maxLength={1}
                        value={digit}
                        onChange={e => {
                          const newCode = [...code];
                          newCode[i] = e.target.value.slice(-1);
                          setCode(newCode);
                        }}
                        className="w-12 h-12 text-center text-xl border border-gray-300 rounded outline-none focus:border-green-500"
                      />
                    ))}
                  </div>
                  <button type="submit" className="w-full bg-green-500 text-white py-3 rounded font-medium hover:bg-green-600 transition-colors">
                    Войти
                  </button>
                  <button type="button" onClick={() => setStep('phone')} className="w-full text-sm text-gray-500 hover:text-gray-700">
                    Изменить номер
                  </button>
                </form>
              )}

              {step === 'success' && (
                <div className="text-center">
                  <div className="text-green-500 text-5xl mb-4">✓</div>
                  <p className="text-gray-700">Вы успешно вошли!</p>
                  <Link href="/" className="block mt-4 text-green-600 hover:text-green-700">На главную</Link>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
