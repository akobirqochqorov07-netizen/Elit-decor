'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { allKarnizlar, allKataloglar } from '@/data/karnizlar';

interface KarnizHomeSectionProps {
  title: string;
}

/** Bosh sahifa: faqat karnizlar katalogiga olib boradigan statik karta. */
export default function KarnizHomeSection({ title }: KarnizHomeSectionProps) {
  const t = useTranslations('CatalogSection');

  return (
    <section className="py-10">
      <h2 className="text-2xl font-medium text-gray-800 mb-6">{title}</h2>
      <Link
        href="/katalog/karnizlar/"
        className="group grid md:grid-cols-2 overflow-hidden"
        style={{ backgroundColor: '#0a2734' }}
      >
        <div className="relative h-56 md:h-80" style={{ backgroundColor: '#152f40' }}>
          <Image
            src="/images/karnizlar/katalog-1-katta/karniz-006-kok.jpg"
            alt={t('karniz_title')}
            fill
            sizes="(min-width: 768px) 600px, 100vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center gap-3 p-6 md:p-10">
          <h3 className="text-white text-2xl md:text-3xl font-medium">{t('karniz_title')}</h3>
          <p className="text-gray-300 text-sm md:text-base">
            {t('karniz_desc', { count: allKarnizlar.length, groups: allKataloglar.length })}
          </p>
          <span
            className="inline-block self-start px-5 py-3 text-sm font-bold text-white transition-colors"
            style={{ background: 'var(--ed-green-grad)' }}
          >
            {t('karniz_btn')} →
          </span>
        </div>
      </Link>
    </section>
  );
}
