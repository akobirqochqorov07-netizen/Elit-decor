import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import brand from '@/lib/brand';

export default function Footer() {
  const t = useTranslations('Footer');
  const tHeader = useTranslations('Header');
  return (
    <footer style={{ backgroundColor: '#0a2734' }}>
      <div className="container mx-auto px-4 py-20 text-center" style={{ maxWidth: '700px' }}>
        <div className="flex justify-center mb-6">
          <Link href="/">
            <img src={brand.logoFooter} alt={brand.name} className="h-14 w-auto object-contain opacity-90" />
          </Link>
        </div>

        <h2 className="font-sans text-3xl md:text-4xl font-bold mb-4 uppercase tracking-wide text-white">
          {t('cta_title')}
        </h2>

        <p className="mb-10 text-base text-white/70 leading-relaxed">
          {t('cta_desc')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
          <Link
            href="/contacts/"
            className="inline-flex items-center gap-2 bg-accent text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-amber-600 transition-colors"
          >
            {t('btn')}
          </Link>

          <div className="flex flex-col items-center sm:items-start gap-1">
            <a href={brand.phoneHref} className="text-xl font-bold text-white tracking-wide hover:text-accent transition-colors">
              {brand.phone}
            </a>
            <a href={brand.phoneHref2} className="text-xl font-bold text-white tracking-wide hover:text-accent transition-colors">
              {brand.phone2}
            </a>
            <span className="text-xs text-white/50 mt-0.5">{tHeader('work_hours_1')}</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-white/10">
          <p className="text-xs text-white/40 leading-relaxed">
            © {new Date().getFullYear()} {brand.name}. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}