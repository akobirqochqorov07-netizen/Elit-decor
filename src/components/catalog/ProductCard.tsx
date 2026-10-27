'use client';

/**
 * ProductCard — DIKART-style catalog grid card.
 *
 * Visual design matches dikart.ru/catalog/smooth-rods/:
 *  - Dark navy background (#0a2734)
 *  - Landscape image area (310:210 ratio), white bg, object-contain
 *  - Price in green at top of text area
 *  - Dimensions shown
 *  - "Savatga qo'shish" button at bottom
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useDrawer } from '@/context/DrawerContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('ProductCard');
  const { addItem } = useCart();
  const { openDrawer } = useDrawer();
  const href = `/catalog/${product.category}/${product.slug}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.slug,
      title: product.name,
      price: product.pricePerMeter,
      quantity: 1,
      imgSrc: product.images.card,
      unit: `so'm/p.m.`,
      sku: product.code,
    });
    openDrawer();
  };

  return (
    <Link
      href={href}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      aria-label={t('aria_view', { name: product.name })}
    >
      <article
        className="flex flex-col overflow-hidden border border-[#1a3d52] bg-[#0a2734] transition-all duration-200 hover:shadow-lg hover:border-[#2a5d7a]"
        style={{ minHeight: '280px' }}
      >
        {/* ── Image area — landscape 310:210 ratio, white bg ── */}
        <div
          className="relative w-full overflow-hidden bg-white"
          style={{ aspectRatio: '310 / 210' }}
        >
          {product.images.card ? (
            <Image
              src={product.images.card}
              alt={`${product.name} — ${product.code}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
              priority={false}
            />
          ) : (
            /* Placeholder when image is missing */
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d1d5db"
                strokeWidth="1"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )}

          {/* made_to_order badge */}
          {product.availability === 'made_to_order' && (
            <span
              className="absolute top-1.5 left-1.5 text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5"
              style={{ backgroundColor: '#D4AF37' }}
            >
              {t('made_to_order')}
            </span>
          )}
        </div>

        {/* ── Text area ── */}
        <div className="flex flex-col flex-1 px-3 pt-2.5 pb-2.5 gap-1">
          {/* Price — DIKART style: prominent, colored */}
          <div className="flex items-center justify-between gap-1">
            <span className="text-sm font-bold leading-none" style={{ color: '#4db87a' }}>
              {t('from_price')} {product.pricePerMeter.toLocaleString('uz-UZ')} {t('currency')}/
              {t('unit')}
            </span>
            {/* In-stock indicator */}
            {product.availability === 'in_stock' && (
              <span
                className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 flex-shrink-0"
                style={{ color: '#4db87a', border: '1px solid #2a6640' }}
              >
                {t('in_stock')}
              </span>
            )}
          </div>

          {/* Product code */}
          <span className="text-white text-sm font-semibold leading-snug line-clamp-1">
            {product.code}
          </span>

          {/* Dimensions */}
          <span className="text-white/50 text-xs">
            {product.heightMm}Н×{product.depthMm}mm
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Add to cart button — full width, DIKART style */}
          <button
            onClick={handleAddToCart}
            className="mt-1 w-full py-2 text-white text-xs font-semibold uppercase tracking-wide transition-colors duration-200"
            style={{ backgroundColor: '#1a6b41', border: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#145432')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a6b41')}
            aria-label={t('add_to_cart_aria', { name: product.name })}
          >
            {t('add_to_cart')}
          </button>
        </div>
      </article>
    </Link>
  );
}
