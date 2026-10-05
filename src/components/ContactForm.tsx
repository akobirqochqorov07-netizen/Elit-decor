'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [agreed, setAgreed] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Введите имя';
    if (!formData.phone.trim()) newErrors.phone = 'Введите телефон';
    if (!agreed) newErrors.agreed = 'Необходимо согласие';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <p className="text-gray-700 text-lg">В ближайшее время мы с Вами свяжемся.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Имя</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
            placeholder="Иванов Иван Иванович"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-500"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Телефон</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
            placeholder="+7 (___) ___-__-__"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-500"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">EMAIL</label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
            placeholder="fio@dikart.ru"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-8 py-3 rounded font-medium hover:bg-green-600 transition-colors disabled:opacity-60"
        >
          {loading ? 'Отправка...' : 'Заказать звонок'}
        </button>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="w-4 h-4"
            />
            <span>
              Я согласен с обработкой персональных данных в соответствии с{' '}
              <Link href="/information_for_client/7951/" className="text-green-600 hover:underline">политикой конфиденциальности</Link>
            </span>
          </label>
          {errors.agreed && <p className="text-red-500 text-xs">{errors.agreed}</p>}
          <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={e => setNewsletter(e.target.checked)}
              className="w-4 h-4"
            />
            <span>
              Я согласен на получение{' '}
              <Link href="/information_for_client/1812841/" className="text-green-600 hover:underline">рекламных и информационных рассылок</Link>
            </span>
          </label>
        </div>
      </div>
    </form>
  );
}
