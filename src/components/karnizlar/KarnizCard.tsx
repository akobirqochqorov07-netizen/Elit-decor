'use client';
/**
 * KarnizCard — DIKART-exact product card for Elit Decor.
 *
 * ┌──────────────────────────────────────────┐
 * │ (dark #152f40 bg)            K-001 (kod) │  ← top-right (white text)
 * │                                          │
 * │       [karniz-kok.jpg] (large blue bg)   │  ← contain, prominent
 * │                                          │
 * │ [+]                  ┌───────────────────┤  ← narx tabletkasi
 * │                      │ 45 000 so'm / p.m.│    #b8bec3, left-rounded
 * ├──────────────────────┴───────────────────┤
 * │ [E] L=2.0 m                     30×30 mm │  ← bottom info strip (dark navy)
 * └──────────────────────────────────────────┘
 */

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useDrawer } from '@/context/DrawerContext';
import { KarnizItem, formatOlcham, getItemHref, BOLIM_NOMI } from '@/data/karnizlar';

interface KarnizCardProps {
    item: KarnizItem;
}

export default function KarnizCard({ item }: KarnizCardProps) {
    const { addItem, items } = useCart();
    const { openDrawer } = useDrawer();
    const [toast, setToast] = useState(false);

    const href = getItemHref(item);
    const inCart = items.some((i) => i.sku === item.kod);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id: item.kod,
            title: `${item.korsatiladigan_kod} — ${item.katalog_nomi}`,
            price: item.narx_pm,
            quantity: 1,
            imgSrc: item.rasm_kok,
            unit: 'p.m.',
            sku: item.kod,
            katalog: item.katalog_slug,
            olcham: formatOlcham(item.balandlik_mm, item.kenglik_mm),
        });
        setToast(true);
        openDrawer();
        setTimeout(() => setToast(false), 2000);
    };

    const narxText = item.narx_pm
        ? `${item.narx_pm.toLocaleString('uz-UZ')} so'm / p.m.`
        : "Narx so'rang";

    const olchamText = formatOlcham(item.balandlik_mm, item.kenglik_mm);

    return (
        <div className="group relative flex flex-col h-full">
            {/* Toast notification */}
            {toast && (
                <div
                    className="absolute top-2 left-1/2 z-30 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap pointer-events-none"
                    style={{
                        background: 'linear-gradient(135deg, #0e9f6e 0%, #12a870 100%)',
                        transform: 'translateX(-50%)',
                        animation: 'fadeIn 0.2s ease-out',
                    }}
                >
                    ✓ Savatga qo&apos;shildi
                </div>
            )}

            <article
                className="relative flex flex-col flex-1 overflow-hidden transition-all duration-300 rounded shadow-md group-hover:shadow-2xl group-hover:-translate-y-1"
                style={{
                    backgroundColor: '#152f40',
                }}
            >
                {/* ── Main card link ── */}
                <Link
                    href={href}
                    className="block relative flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                    style={{ cursor: 'pointer' }}
                >
                    {/* Image Area with dark blue background */}
                    <div
                        className="relative w-full overflow-hidden"
                        style={{
                            aspectRatio: '255 / 200',
                            backgroundColor: '#152f40',
                        }}
                    >
                        {/* Model code — Top-Right corner */}
                        <span
                            className="kc-code absolute z-10 font-semibold select-none text-white tracking-wide"
                            style={{
                                fontSize: '17px',
                                top: '10px',
                                right: '12px',
                                lineHeight: 1,
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                            }}
                        >
                            {item.korsatiladigan_kod}
                        </span>

                        {/* Blue-background product image */}
                        <div className="absolute inset-0 flex items-center justify-center p-3">
                            <div className="relative w-full h-full">
                                <Image
                                    src={item.rasm_kok}
                                    alt={`${item.korsatiladigan_kod} gips ${BOLIM_NOMI[item.bolim].birlik.toLowerCase()}`}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 640px"
                                    quality={100}
                                    style={{ objectFit: 'contain' }}
                                    className="transition-transform duration-300 group-hover:scale-105"
                                    priority={false}
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* Price pill overlay — Bottom-Right, DIKART style */}
                        <div
                            className="kc-pill-wrap absolute z-10 flex items-center"
                            style={{
                                bottom: '10px',
                                right: '0',
                                height: '28px',
                            }}
                        >
                            <div
                                className="kc-pill flex items-center px-3 py-1 font-semibold text-xs sm:text-sm whitespace-nowrap shadow-md"
                                style={{
                                    backgroundColor: '#b8bec3',
                                    color: '#1a2228',
                                    borderRadius: '16px 0 0 16px',
                                    lineHeight: 1.2,
                                }}
                            >
                                {narxText}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Information Strip */}
                    <div
                        className="kc-ribbon flex items-center justify-between px-3.5 py-2.5"
                        style={{
                            background: 'linear-gradient(90deg, #0e2738 0%, #153a54 100%)',
                            borderTop: '1px solid #1f4762',
                            minHeight: '48px',
                            width: '100%',
                        }}
                    >
                        {/* Left: E badge & piece length */}
                        <div className="flex items-center gap-2.5">
                            <div
                                className="flex items-center justify-center rounded font-bold text-xs"
                                style={{
                                    backgroundColor: '#0c202d',
                                    border: '1px solid rgba(212, 175, 55, 0.4)',
                                    color: '#D4AF37',
                                    width: '24px',
                                    height: '24px',
                                    flexShrink: 0,
                                }}
                                title="Elit Decor"
                            >
                                E
                            </div>
                            <span className="text-gray-200 text-xs sm:text-sm font-medium tracking-tight" title="Standart uzunlik">
                                L = {item.uzunlik_m ?? 2.0} m
                            </span>
                        </div>

                        {/* Right: profile dimensions */}
                        <span className="text-white font-semibold text-xs sm:text-sm tracking-wide text-right">
                            {olchamText}
                        </span>
                    </div>
                </Link>

                {/* Quick Add to Cart button */}
                <button
                    type="button"
                    onClick={handleAddToCart}
                    className="absolute z-20 w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-base transition-all duration-200 shadow-md hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                    style={{
                        bottom: '52px',
                        left: '10px',
                        background: inCart
                            ? 'linear-gradient(135deg, #c9a46a 0%, #e2c082 100%)'
                            : 'linear-gradient(135deg, #0e9f6e 0%, #12a870 100%)',
                    }}
                    aria-label={`${item.korsatiladigan_kod} ni savatga qo'shish`}
                    title={inCart ? "Savatda mavjud" : `${item.korsatiladigan_kod} ni savatga qo'shish`}
                >
                    {inCart ? '✓' : '+'}
                </button>
            </article>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(-4px); }
                    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `}</style>
        </div>
    );
}
