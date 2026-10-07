'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface GalleryItem {
    id: number;
    file: string;
    category: string;
    w: number;
    h: number;
}

interface GalleryClientProps {
    categories: Record<string, string>;
    items: GalleryItem[];
}

export default function GalleryClient({ categories, items }: GalleryClientProps) {
    const t = useTranslations('GalleryPage');
    const [activeCat, setActiveCat] = useState<string>('all');
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Filter items based on active category. 
    // If 'all', shuffle them in round-robin fashion by category to mix them up nicely.
    const filteredItems = React.useMemo(() => {
        if (activeCat !== 'all') {
            return items.filter(img => img.category === activeCat);
        }

        // Round-robin shuffle for "Hammasi"
        const grouped: Record<string, GalleryItem[]> = {};
        Object.keys(categories).forEach(k => { grouped[k] = []; });
        items.forEach(item => {
            if (grouped[item.category]) {
                grouped[item.category].push(item);
            }
        });

        const mixed: GalleryItem[] = [];
        let hasMore = true;
        let i = 0;
        while (hasMore) {
            hasMore = false;
            Object.keys(grouped).forEach(k => {
                if (i < grouped[k].length) {
                    mixed.push(grouped[k][i]);
                    hasMore = true;
                }
            });
            i++;
        }
        return mixed;
    }, [activeCat, items, categories]);

    // Keyboard navigation for Lightbox
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (lightboxIndex === null) return;
        if (e.key === 'Escape') setLightboxIndex(null);
        if (e.key === 'ArrowRight') setLightboxIndex(prev => prev !== null ? (prev + 1) % filteredItems.length : null);
        if (e.key === 'ArrowLeft') setLightboxIndex(prev => prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null);
    }, [lightboxIndex, filteredItems.length]);

    useEffect(() => {
        if (lightboxIndex !== null) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [lightboxIndex, handleKeyDown]);

    const activeItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

    return (
        <div>
            {/* Category Filters */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 mb-14">
                <button
                    onClick={() => setActiveCat('all')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-300 font-medium text-sm md:text-base border border-gray-200
            ${activeCat === 'all'
                            ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
                            : 'bg-white text-gray-600 hover:border-accent/40'}
          `}
                >
                    {t('all_filter')}
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${activeCat === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {items.length}
                    </span>
                </button>

                {Object.entries(categories).map(([key, name]) => {
                    const count = items.filter(u => u.category === key).length;
                    const isActive = activeCat === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveCat(key)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-300 font-medium text-sm md:text-base border border-gray-200
                ${isActive
                                    ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
                                    : 'bg-white text-gray-600 hover:border-accent/40'}
              `}
                        >
                            {name}
                            <span className={`text-[11px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Masonry Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {filteredItems.map((item, index) => (
                    <div
                        key={`${item.id}-${activeCat}`}
                        className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl bg-gray-100"
                        onClick={() => setLightboxIndex(index)}
                    >
                        {/* Image (Scale on Hover) */}
                        <div className="relative w-full overflow-hidden rounded-xl">
                            <Image
                                src={`/images/galereya1/thumb/${item.file}`}
                                alt={categories[item.category] || 'Gallery Image'}
                                width={item.w}
                                height={item.h}
                                className="w-full h-auto object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
                                style={{
                                    aspectRatio: `${item.w}/${item.h}`
                                }}
                                loading="lazy"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />

                            {/* Inner thin gold border on hover */}
                            <div className="absolute inset-2 border border-accent/0 group-hover:border-accent/70 transition-colors duration-500 rounded-lg pointer-events-none"></div>

                            {/* Overlay with Category Text appearing at bottom */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                <span className="text-white font-serif tracking-widest uppercase text-sm font-semibold translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    {categories[item.category]}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && activeItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">

                    {/* Close Button */}
                    <button
                        onClick={() => setLightboxIndex(null)}
                        className="absolute top-6 right-6 z-[110] w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/25 rounded-full text-white transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    {/* Previous Arrow */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null); }}
                        className="absolute left-4 md:left-10 z-[110] w-14 h-14 flex items-center justify-center bg-white/10 hover:bg-white/25 rounded-full text-white transition-colors hidden md:flex"
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>

                    {/* Next Arrow */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => prev !== null ? (prev + 1) % filteredItems.length : null); }}
                        className="absolute right-4 md:right-10 z-[110] w-14 h-14 flex items-center justify-center bg-white/10 hover:bg-white/25 rounded-full text-white transition-colors hidden md:flex"
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>

                    {/* Image Container */}
                    <div className="relative w-full h-full md:w-[90vw] md:h-[90vh] flex flex-col items-center justify-center p-4">
                        <img
                            src={`/images/galereya1/full/${activeItem.file}`}
                            alt={categories[activeItem.category]}
                            className="max-w-full max-h-[85vh] object-contain shadow-2xl select-none"
                        />
                        {/* Caption */}
                        <div className="absolute bottom-4 flex flex-col items-center gap-1 text-center">
                            <span className="text-white/80 font-serif tracking-widest uppercase text-sm md:text-base">
                                {categories[activeItem.category]} &middot; {lightboxIndex + 1} / {filteredItems.length}
                            </span>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
