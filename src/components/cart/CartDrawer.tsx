'use client';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useTranslations } from 'next-intl';
import { useDrawer } from '@/context/DrawerContext';
import { useCart } from '@/context/CartContext';
import CartDrawerItems from './CartDrawerItems';
import OrderRequestForm from './OrderRequestForm';

export default function CartDrawer() {
  const t = useTranslations('CartDrawer');
  const { isOpen, closeDrawer } = useDrawer();
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, closeDrawer]);

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div className={isOpen ? '' : 'pointer-events-none'} aria-hidden={!isOpen}>
      <div
        className={`fixed inset-0 z-[190] bg-black/50 transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeDrawer}
      />

      <div
        role="dialog"
        aria-modal={isOpen}
        aria-label={t('title')}
        className={`fixed inset-y-0 right-0 z-[200] w-full sm:w-[420px] bg-white flex flex-col min-h-0 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <h2 className="font-bold text-gray-900 text-base">
            {t('title')}
            {items.length > 0 ? ` (${items.length})` : ''}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label={t('close_aria')}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <CartDrawerItems />

        {items.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-4 bg-white shrink-0 max-h-[42%] overflow-y-auto">
            <OrderRequestForm variant="drawer" onSuccess={closeDrawer} />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
