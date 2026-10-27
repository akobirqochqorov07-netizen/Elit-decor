'use client';

/**
 * OrderRequestForm — Savat va mahsulot sahifasida ishlatiladi.
 * Bot tokenini FRONTENDGA CHIQARMAYDI — /api/order orqali yubоradi.
 */
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCart, CartItem } from '@/context/CartContext';
import brand from '@/lib/brand';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

interface OrderRequestFormProps {
  /** Savat drawer da ishlatiladigan callback */
  onSuccess?: () => void;
  /** Yagona mahsulot yuborish uchun (mahsulot sahifasida) — savat ishlatilmaydi */
  singleItem?: {
    kod: string;
    nomi: string;
    miqdor: number;
    katalog: string;
  };
  /** Formstyle: "drawer" | "standalone" */
  variant?: 'drawer' | 'standalone';
}

export default function OrderRequestForm({
  onSuccess,
  singleItem,
  variant = 'drawer',
}: OrderRequestFormProps) {
  const t = useTranslations('OrderForm');
  const { items, clearCart } = useCart();

  const [ism, setIsm] = useState('');
  const [telefon, setTelefon] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [izoh, setIzoh] = useState('');
  const [agree, setAgree] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState('');

  // Telefon mask: +998 (_ _) ___-__-__ formatiga yo'naltirish
  const handlePhone = (val: string) => {
    const digits = val.replace(/\D/g, '');
    let formatted = '+998 ';
    if (digits.length > 3) {
      const local = digits.slice(3);
      if (local.length <= 2) formatted += `(${local}`;
      else if (local.length <= 5) formatted += `(${local.slice(0, 2)}) ${local.slice(2)}`;
      else if (local.length <= 7) formatted += `(${local.slice(0, 2)}) ${local.slice(2, 5)}-${local.slice(5)}`;
      else formatted += `(${local.slice(0, 2)}) ${local.slice(2, 5)}-${local.slice(5, 7)}-${local.slice(7, 9)}`;
    }
    setTelefon(formatted);
  };

  const isPhoneComplete = (p: string) => p.replace(/\D/g, '').length === 12; // 998 + 9 raqam

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitState === 'loading') return;

    const newErrors: Record<string, string> = {};
    if (!ism.trim() || ism.trim().length < 2) newErrors.ism = t('err_name');
    if (!isPhoneComplete(telefon)) newErrors.telefon = t('err_phone');
    if (!agree) newErrors.agree = t('err_agree');

    // Savat tekshiruvi
    const cartItems: CartItem[] = singleItem
      ? [
        {
          id: singleItem.kod,
          title: singleItem.nomi,
          price: null,
          quantity: singleItem.miqdor,
          imgSrc: '',
          unit: 'p.m.',
          sku: singleItem.kod,
          katalog: singleItem.katalog,
        },
      ]
      : items;

    if (cartItems.length === 0) newErrors.cart = t('err_cart_empty');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitState('loading');

    try {
      const payload = {
        ism: ism.trim(),
        telefon: telefon.trim(),
        email: email.trim() || undefined,
        izoh: izoh.trim() || undefined,
        mahsulotlar: cartItems.map((item) => ({
          kod: item.sku ?? item.id,
          miqdor: item.quantity,
        })),
        sahifa_url: typeof window !== 'undefined' ? window.location.href : '',
        // honeypot — foydalanuvchi to'ldirmaydi
        website: '',
      };

      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setOrderId(data.orderId ?? '');
        if (!singleItem) clearCart();
        setSubmitState('success');
        onSuccess?.();
      } else {
        console.error('[order] server xato:', data.error);
        setSubmitState('error');
      }
    } catch (err) {
      console.error('[order] yuborishda xato:', err);
      setSubmitState('error');
    }
  };

  if (submitState === 'success') {
    return (
      <div className="text-center py-8 px-4">
        <div
          className="text-5xl mb-4"
          style={{ color: '#86c540' }}
        >
          ✓
        </div>
        <p className="font-bold text-gray-900 text-lg mb-1">
          Buyurtmangiz qabul qilindi!
        </p>
        {orderId && (
          <p className="text-sm text-gray-500 mb-2">
            Raqam: <strong>#{orderId}</strong>
          </p>
        )}
        <p className="text-sm text-gray-600">Tez orada siz bilan bog&apos;lanamiz.</p>
      </div>
    );
  }

  const isStandalone = variant === 'standalone';
  const inputCls = (err: boolean) =>
    `w-full border ${err ? 'border-red-400' : 'border-gray-300'} rounded px-3 py-2.5 text-sm outline-none focus:border-[#86c540] focus:ring-1 focus:ring-[#86c540]/30 transition-all`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
      {/* Honeypot — hidden from users, visible to bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        style={{ position: 'absolute', opacity: 0, height: 0, pointerEvents: 'none' }}
      />

      {errors.cart && (
        <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded">{errors.cart}</p>
      )}
      {submitState === 'error' && (
        <div className="text-red-600 text-xs bg-red-50 border border-red-200 px-3 py-2 rounded">
          Yuborib bo&apos;lmadi. Qayta urinib ko&apos;ring yoki qo&apos;ng&apos;iroq qiling:{' '}
          <a href={brand.phoneHref} className="font-semibold underline">
            {brand.phone}
          </a>
        </div>
      )}

      {/* Ism */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          {t('name_label')} <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={ism}
          onChange={(e) => setIsm(e.target.value)}
          placeholder={t('name_placeholder')}
          className={inputCls(!!errors.ism)}
          autoComplete="name"
        />
        {errors.ism && <p className="text-red-500 text-xs mt-1">{errors.ism}</p>}
      </div>

      {/* Telefon */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          {t('phone_label')} <span className="text-red-400">*</span>
        </label>
        <input
          type="tel"
          inputMode="tel"
          value={telefon}
          onChange={(e) => handlePhone(e.target.value)}
          placeholder="+998 (__) ___-__-__"
          className={inputCls(!!errors.telefon)}
          autoComplete="tel"
        />
        {errors.telefon && <p className="text-red-500 text-xs mt-1">{errors.telefon}</p>}
      </div>

      {isStandalone && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Email <span className="text-gray-400 font-normal">(ixtiyoriy)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className={inputCls(false)}
            autoComplete="email"
          />
        </div>
      )}

      {isStandalone && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            {t('comment_label')}
          </label>
          <textarea
            value={izoh}
            onChange={(e) => setIzoh(e.target.value)}
            placeholder={t('comment_placeholder')}
            rows={3}
            className={`${inputCls(false)} resize-none`}
          />
        </div>
      )}

      {/* Rozilik */}
      <label className="flex items-start gap-2 cursor-pointer group select-none">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded flex-shrink-0"
          style={{ accentColor: '#86c540' }}
        />
        <span className="text-xs text-gray-500 leading-snug">
          Shaxsiy ma&apos;lumotlarni qayta ishlashga roziman
        </span>
      </label>
      {errors.agree && <p className="text-red-500 text-xs -mt-2">{errors.agree}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitState === 'loading'}
        className="w-full py-3 text-white font-bold text-sm rounded transition-all disabled:opacity-60"
        style={{ backgroundColor: '#152f40' }}
        onMouseEnter={(e) => {
          if (submitState !== 'loading') e.currentTarget.style.backgroundColor = '#1e4160';
        }}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#152f40')}
      >
        {submitState === 'loading' ? 'Yuborilmoqda...' : t('submit_btn')}
      </button>
    </form>
  );
}
