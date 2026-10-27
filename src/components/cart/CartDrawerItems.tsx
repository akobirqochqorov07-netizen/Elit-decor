'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCart } from '@/context/CartContext';

export default function CartDrawerItems() {
  const t = useTranslations('CartDrawer');
  const { items, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-12 px-6 text-center min-h-0">
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d1d5db"
          strokeWidth="1.2"
          className="mb-4"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <p className="text-gray-500 font-medium mb-1">{t('empty_title')}</p>
        <p className="text-gray-400 text-sm mb-5">{t('empty_desc')}</p>
        <Link
          href="/catalog/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent border border-accent/30 px-5 py-2 rounded-full hover:bg-accent hover:text-white transition-all"
        >
          {t('catalog_link')} →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
        {t('list_heading')} · {items.length}
      </p>
      <ul className="flex flex-col gap-3">
        {items.map((item) => {
          const href = item.katalog
            ? `/katalog/karnizlar/${item.katalog}/${item.id}/`
            : '/catalog/';
          return (
            <li key={item.id} className="flex gap-3 border border-gray-200 bg-white p-3">
              <Link
                href={href}
                className="flex-shrink-0 w-[72px] h-[72px] overflow-hidden bg-white border border-gray-100"
              >
                <img
                  src={item.imgSrc}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              </Link>

              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link href={href} className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-[#152f40]">
                      {item.title}
                    </p>
                    {item.sku && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.sku.replace('karniz-', 'K-').toUpperCase()}
                      </p>
                    )}
                    {item.olcham && item.olcham !== '—' && (
                      <p className="text-xs text-gray-500">{item.olcham}</p>
                    )}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 text-xs text-gray-400 hover:text-red-500 px-1"
                    aria-label={t('remove')}
                  >
                    {t('remove')}
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center border border-gray-300 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      aria-label={t('qty_minus')}
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-semibold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      aria-label={t('qty_plus')}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">{item.unit}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
