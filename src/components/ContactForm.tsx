'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function ContactForm() {
  const t = useTranslations('ContactForm');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [agreed, setAgreed] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t('err_name');
    if (!formData.phone.trim()) newErrors.phone = t('err_phone');
    if (!agreed) newErrors.agreed = t('err_agree');
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

    const botToken = '8878838934:AAH2JWG0TjBfs-NJl2Im4BXWz2WiYzIdUss';
    const chatId = process.env.NEXT_PUBLIC_TG_CHAT_ID || '123456789';

    const message = `
🔔 *Yangi Zayavka (Elit Dekor)*
👤 *Ismi:* ${formData.name}
📞 *Tel:* ${formData.phone}
📧 *Email:* ${formData.email || 'Kiritilmadi'}
    `;

    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert(t('err_phone'));
      }
    } catch (error) {
      alert(t('err_phone'));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <p className="text-gray-700 text-lg">{t('success_msg')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">{t('name_label')}</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
            placeholder={t('name_placeholder')}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all font-medium"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">{t('phone_label')}</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
            placeholder={t('phone_placeholder')}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all font-medium"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">{t('email_label')}</label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
            placeholder={t('email_placeholder')}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all font-medium"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-white px-10 py-4 rounded-lg font-bold hover:bg-[#b5952f] transition-all disabled:opacity-60 shadow-lg shadow-accent/20"
        >
          {loading ? t('loading') : t('submit_btn')}
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
              {t('agree_text')}{' '}
              <Link href="/information_for_client/7951/" className="text-green-600 hover:underline">{t('agree_privacy_link')}</Link>
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
              {t('newsletter_text')}{' '}
              <Link href="/information_for_client/1812841/" className="text-green-600 hover:underline">{t('newsletter_link')}</Link>
            </span>
          </label>
        </div>
      </div>
    </form>
  );
}
