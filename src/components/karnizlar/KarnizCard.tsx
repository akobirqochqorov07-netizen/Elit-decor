'use client';
/**
 * KarnizCard — DIKART-exact karta komponenti.
 *
 * ┌──────────────────────────────────────────┐
 * │ (dark #152f40 bg)            K-001 (kод) │  ← top-right
 * │                                          │
 * │          [karniz -kok.jpg]               │  ← contain, 85% width
 * │                                          │
 * │                      ┌───────────────────┤  ← narx tabletkasi
 * │                      │ 45 000 so'm/p.m.  │    #b8bec3, left-rounded
 * ├──────────────────────┴───────────────────┤
 * │ █ 24h  52.2 p.m.         30H×30mm       │  ← yashil lenta #86c540
 * └──────────────────────────────────────────┘
 */

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useDrawer } from '@/context/DrawerContext';
import { KarnizItem, formatOlcham } from '@/data/karnizlar';

interface KarnizCardProps {
    item: KarnizItem;
}

export default function KarnizCard({ item }: KarnizCardProps) {
    const { addItem, items } = useCart();
    const { openDrawer } = useDrawer();
    const [toast, setToast] = useState(false);

    const href = `/katalog/karnizlar/${item.katalog_slug}/${item.kod}/`;
    const inCart = items.some((i) => i.sku === item.kod);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id: item.kod,
            title: `${item.korsatiladigan_kod} — ${item.katalog_nomi}`,
            price: item.narx_pm,
            quantity: 1,
            imgSrc: item.rasm_oq,
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
        ? `${item.narx_pm.toLocaleString('uz-UZ')} so'm/p.m.`
        : "Narx so'rang";

    const olchamText = formatOlcham(item.balandlik_mm, item.kenglik_mm);
    // Omborda ham, o'lchamda ham ma'lumot bo'lmasa, telefonda yashil lenta yashiriladi
    const ribbonEmpty = item.ombor_pm === null && olchamText === '—';

    return (
        <div className="group relative">
        <Link
            href={href}
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#86c540] focus-visible:ring-offset-2"
            style={{ cursor: 'pointer' }}
        >
            {/* Toast */}
            {toast && (
                <div
                    className="absolute top-2 left-1/2 z-20 text-white text-xs font-semibold px-3 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none"
                    style={{
                        backgroundColor: '#86c540',
                        transform: 'translateX(-50%)',
                        animation: 'fadeIn 0.2s ease-out',
                    }}
                >
                    ✓ Savatga qo&apos;shildi
                </div>
            )}

            <article
                className="relative overflow-hidden transition-all duration-200 group-hover:shadow-xl"
                style={{
                    backgroundColor: '#152f40',
                    borderRadius: 0,
                    transform: 'translateY(0)',
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(0,0,0,0.35)';
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
            >
                {/* ── Karta tanasi ── */}
                <div style={{ aspectRatio: '255 / 208', position: 'relative' }}>
                    {/* Kod — o'ng yuqori burchak */}
                    <span
                        className="kc-code absolute z-10 font-medium select-none"
                        style={{
                            fontSize: '18px',
                            top: '10px',
                            right: '10px',
                            lineHeight: 1,
                            color: '#152f40',
                        }}
                    >
                        {item.korsatiladigan_kod}
                    </span>

                    {/* Oq fonli rasm — asosiy katalog kartasi */}
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ backgroundColor: '#ffffff' }}
                    >
                        <div style={{ width: '92%', height: '86%', position: 'relative' }}>
                            <Image
                                src={item.rasm_oq}
                                alt={item.korsatiladigan_kod}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
                                style={{ objectFit: 'contain' }}
                                priority={false}
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Narx tabletkasi — o'ng pastki burchak */}
                    <div
                        className="kc-pill-wrap absolute bottom-2 right-0 z-10 flex items-center"
                        style={{ height: '30px' }}
                    >
                        <div
                            className="kc-pill flex items-center px-3 text-sm font-medium"
                            style={{
                                backgroundColor: '#b8bec3',
                                color: '#2d2d2d',
                                borderRadius: '20px 0 0 20px', // chap yumaloq, o'ng kartaga yopishgan
                                height: '30px',
                                fontSize: '14px',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {narxText}
                        </div>
                    </div>

                </div>

                {/* ── Yashil lenta — pastda ── */}
                <div
                    className={`kc-ribbon ${ribbonEmpty ? 'kc-ribbon-empty ' : ''}flex items-center justify-between px-2`}
                    style={{
                        backgroundColor: '#86c540',
                        height: '32px',
                        width: '100%',
                    }}
                >
                    {/* Chap: 24h ikonka + ombor */}
                    <div className="flex items-center gap-1.5">
                        <div
                            className="flex items-center justify-center rounded"
                            style={{
                                backgroundColor: '#152f40',
                                borderRadius: '6px',
                                width: '22px',
                                height: '22px',
                                flexShrink: 0,
                            }}
                        >
                            {/* 24h ikonka */}
                            <svg width="13" height="11" viewBox="0 0 13 11" fill="none">
                                <text x="0" y="10" style={{ fill: '#86c540', fontSize: '9px', fontWeight: 700 }}>
                                    24
                                </text>
                            </svg>
                        </div>
                        <span className="text-white font-medium" style={{ fontSize: '13px' }}>
                            {item.ombor_pm !== null ? `${item.ombor_pm} p.m.` : '—'}
                        </span>
                    </div>

                    {/* O'ng: o'lcham */}
                    <span
                        className="text-white font-medium text-right"
                        style={{ fontSize: '13px' }}
                    >
                        {olchamText}
                    </span>
                </div>
            </article>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
        </Link>
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className={`kc-add ${ribbonEmpty ? 'kc-add-empty ' : ''}absolute z-10 w-7 h-7 rounded flex items-center justify-center text-white font-bold text-lg transition-all focus-visible:ring-2 focus-visible:ring-white`}
                        style={{
                            bottom: '40px',
                            left: '8px',
                            backgroundColor: inCart ? '#86c540' : 'rgba(134,197,64,0.85)',
                            fontSize: '18px',
                            lineHeight: 1,
                        }}
                        aria-label={`${item.korsatiladigan_kod} ni savatga qo'shish`}
                    >
                        {inCart ? '✓' : '+'}
                    </button>
        </div>
    );
}
