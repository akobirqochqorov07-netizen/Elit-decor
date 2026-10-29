'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const serviceItems = [
  {
    id: 1,
    img: '/images/rasm7.jpg',
    titleKey: 'services.s1',
    descKey: 'services.d1',
    accent: '#D4AF37',
  },
  {
    id: 2,
    img: '/images/rasm8.jpg',
    titleKey: 'services.s2',
    descKey: 'services.d2',
    accent: '#D4AF37',
  },
  {
    id: 3,
    img: '/images/rasm9.jpg',
    titleKey: 'services.s3',
    descKey: 'services.d3',
    accent: '#D4AF37',
  },
  {
    id: 4,
    img: '/images/rasm10.jpg',
    titleKey: 'services.s4',
    descKey: 'services.d4',
    accent: '#D4AF37',
  },
];

export default function ServicesSection() {
  const t = useTranslations('HomePage');

  return (
    <section className="py-12 sm:py-16 border-t border-gray-100">
      {/* Header row */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-1.5">
            {t('services.subtitle')}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('services.title')}</h2>
        </div>
        <Link
          href="/services/"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors group"
        >
          {t('services.view_all')}
          <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
        </Link>
      </div>

      {/* Bento grid — desktop: 1 featured (tall) + 3 right; mobile: 2×2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:grid-rows-2">
        {/* Featured card — spans 2 rows on desktop */}
        <Link
          href="/services/"
          className="group relative col-span-1 lg:col-span-2 lg:row-span-2 overflow-hidden rounded-2xl block"
          style={{ minHeight: '260px' }}
        >
          <div className="relative w-full h-full" style={{ minHeight: '260px', height: '100%' }}>
            <img
              src={serviceItems[0].img}
              alt={t(serviceItems[0].titleKey as any)}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            {/* Hover color wash */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
              style={{ background: serviceItems[0].accent }}
            />

            {/* Corner badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-accent text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                #{1}
              </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <h3 className="text-white text-lg sm:text-2xl font-bold leading-snug mb-1.5">
                {t(serviceItems[0].titleKey as any)}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed hidden sm:block">
                {t(serviceItems[0].descKey as any)}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 text-white/80 text-xs font-semibold group-hover:text-white transition-colors">
                {t('services.view_all')}
                <svg
                  className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* 3 smaller cards */}
        {serviceItems.slice(1).map((service, i) => (
          <Link
            key={service.id}
            href="/services/"
            className="group relative overflow-hidden rounded-2xl block"
            style={{ minHeight: '125px' }}
          >
            <div className="relative w-full h-full" style={{ minHeight: '125px' }}>
              <img
                src={service.img}
                alt={t(service.titleKey as any)}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-400"
                style={{ background: service.accent }}
              />

              {/* Number badge */}
              <div className="absolute top-3 left-3">
                <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold flex items-center justify-center">
                  {i + 2}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <span className="text-white text-xs sm:text-sm font-bold leading-tight block">
                  {t(service.titleKey as any)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile: view all */}
      <div className="mt-4 sm:hidden text-center">
        <Link
          href="/services/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent border border-accent/30 px-5 py-2 rounded-full"
        >
          {t('services.view_all')} →
        </Link>
      </div>
    </section>
  );
}
