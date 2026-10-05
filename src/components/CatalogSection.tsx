'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { interiorCategories } from '@/data/catalog';

interface CatalogSectionProps {
  title: string;
  categories: typeof interiorCategories;
  type: 'interior' | 'facade';
}

export default function CatalogSection({ title, categories, type }: CatalogSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleCategories = showAll ? categories : categories.filter((c) => c.visible);
  const hiddenCount = categories.filter((c) => !c.visible).length;

  return (
    <div className="py-10">
      <h2 className="text-2xl font-medium text-gray-800 mb-6">{title}</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {visibleCategories.map((cat) =>
        <li key={cat.id}>
            <Link
            href={cat.href}
            className="block group"
            style={{ backgroundColor: '#0a2734' }}>
            
              <div className="relative overflow-hidden">
                <img
                src={cat.imgSrc}
                alt={`${cat.title} - лепнина Дикарт`}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                style={{ height: '140px', objectFit: 'cover' }} />
              
                <div
                className="absolute top-0 left-0 right-0 text-xs text-white px-2 py-1"
                style={{ backgroundColor: 'rgba(10,39,52,0.85)' }}>
                
                  {cat.price}/{cat.unit}
                </div>
              </div>
              <div className="px-2 py-2">
                <span className="text-white text-sm font-medium group-hover:text-green-400 transition-colors">
                  {cat.title}
                </span>
              </div>
            </Link>
          </li>
        )}

        {/* Show more button */}
        {!showAll && hiddenCount > 0 &&
        <li>
            <button
            onClick={() => setShowAll(true)}
            className="block w-full h-full group cursor-pointer"
            style={{ backgroundColor: '#0a2734', minHeight: '180px' }}>
            
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <img
                src="https://dikart.ru/local/templates/dikart-new/images/logo_white.png"
                alt="Дикарт"
                className="w-16 h-auto mb-3 opacity-70" />
              
                <p className="text-white text-xs mb-1">Больше категорий изделий</p>
                <span className="text-green-400 text-xs font-medium">Показать ещё</span>
              </div>
            </button>
          </li>
        }
      </ul>
    </div>);

}