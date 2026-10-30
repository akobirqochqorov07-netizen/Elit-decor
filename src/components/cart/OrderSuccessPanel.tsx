'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface OrderSuccessPanelProps {
  orderId: string;
  /** Savat oynasida: "Yopish" tugmasi. Bo'lmasa — "Katalogga qaytish" havolasi. */
  onClose?: () => void;
}

/** Buyurtma yuborilgach mijozga ko'rsatiladigan tasdiq oynasi (savat bo'shab qolsa ham yo'qolmaydi). */
export default function OrderSuccessPanel({ orderId, onClose }: OrderSuccessPanelProps) {
  const t = useTranslations('CartDrawer');
  const btnCls = 'h-12 px-8 inline-flex items-center justify-center text-white font-bold rounded';

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-14" role="status">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl mb-5"
        style={{ background: 'var(--ed-green-grad)' }}
      >
        ✓
      </div>
      <h3 className="font-bold text-gray-900 text-xl mb-2">{t('order_done_title')}</h3>
      {orderId && (
        <p className="text-sm text-gray-500 mb-2">
          {t('order_done_number')}: <strong>#{orderId}</strong>
        </p>
      )}
      <p className="text-sm text-gray-600 mb-7">{t('order_done_text')}</p>
      {onClose ? (
        <button type="button" onClick={onClose} className={btnCls} style={{ background: 'var(--ed-green-grad)' }}>
          {t('order_done_close')}
        </button>
      ) : (
        <Link href="/catalog/" className={btnCls} style={{ background: 'var(--ed-green-grad)' }}>
          {t('order_done_catalog')}
        </Link>
      )}
    </div>
  );
}
