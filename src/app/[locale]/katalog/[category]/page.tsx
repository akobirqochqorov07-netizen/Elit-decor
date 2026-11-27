import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

interface CategoryConfig {
  titleKey: string;
  image: string;
  descKey: string;
}

const CATEGORIES: Record<string, CategoryConfig> = {
  moldinglar: {
    titleKey: 'moldinglar_title',
    image: '/images/categories/moldinglar.jpg',
    descKey: 'in_production_desc',
  },
  rozetkalar: {
    titleKey: 'rozetkalar_title',
    image: '/images/categories/rozetkalar.jpg',
    descKey: 'in_production_desc',
  },
  frizlar: {
    titleKey: 'frizlar_title',
    image: '/images/categories/frizlar.jpg',
    descKey: 'in_production_desc',
  },
  burchaklar: {
    titleKey: 'burchaklar_title',
    image: '/images/categories/burchaklar.jpg',
    descKey: 'in_production_desc',
  },
  porezkalar: {
    titleKey: 'porezkalar_title',
    image: '/images/categories/porezkalar.jpg',
    descKey: 'in_production_desc',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const t = await getTranslations({ locale, namespace: 'CatalogHub' });
  const cat = CATEGORIES[category];
  if (!cat) return { title: 'Katalog | Elit Dekor' };

  return {
    title: `${t(cat.titleKey as any)} | Elit Dekor`,
    description: t(cat.descKey as any),
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const cat = CATEGORIES[category];
  if (!cat) notFound();

  const t = await getTranslations({ locale, namespace: 'CatalogHub' });
  const categoryTitle = t(cat.titleKey as any);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm mb-6 text-gray-500">
            <Link href={`/${locale}`} className="hover:text-black transition-colors">
              {t('breadcrumb_home')}
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <Link href={`/${locale}/katalog`} className="hover:text-black transition-colors">
              {t('breadcrumb_catalog')}
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-900 font-medium">{categoryTitle}</span>
          </nav>

          {/* Title & Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-5 border-b border-gray-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A265]/15 border border-[#C5A265]/30 text-[#9E7A3D] text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A265] animate-pulse" />
                {t('coming_soon_badge')}
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif text-gray-900 tracking-tight">
                {categoryTitle}
              </h1>
            </div>

            <Link
              href={`/${locale}/katalog`}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-black font-medium transition-colors"
            >
              <span>←</span>
              <span>{t('back_to_catalog')}</span>
            </Link>
          </div>

          {/* Featured Showcase Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#152F40] rounded-2xl overflow-hidden p-6 sm:p-10 text-white shadow-xl">
            {/* Visual Image */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#0E2738] border border-white/10 flex items-center justify-center">
              <Image
                src={cat.image}
                alt={categoryTitle}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-contain p-4"
                quality={95}
                priority
              />
            </div>

            {/* Information & Consultation */}
            <div className="space-y-5">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#E8D39E] font-mono">
                  Elit Dekor · Ganch San’ati
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif mt-1 text-white">
                  {categoryTitle} to‘plami
                </h2>
                <p className="text-sm text-gray-300 font-light mt-3 leading-relaxed">
                  {t(cat.descKey as any)}
                </p>
              </div>

              {/* Quality Checklist */}
              <div className="space-y-2.5 pt-3 border-t border-white/10 text-xs sm:text-sm text-gray-200">
                <div className="flex items-center gap-2.5">
                  <span className="text-[#E8D39E]">✔</span>
                  <span>100% Sof Samarqand ganchi (mustahkam va ekologik toza)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[#E8D39E]">✔</span>
                  <span>Yong‘in xavfsizligi A1 klass (yonmaydigan tabiiy mineral)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[#E8D39E]">✔</span>
                  <span>Maxsus o‘lcham va loyihalar bo‘yicha individual quyish</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[#E8D39E]">✔</span>
                  <span>3D Max, DWG va OBJ arxitektura chizmalari taqdim etiladi</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 flex flex-wrap gap-3">
                <a
                  href="tel:+998979200709"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B38F52] hover:brightness-110 text-black font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-lg flex items-center gap-2"
                >
                  <span>📞</span>
                  <span>+998 97 920 07 09</span>
                </a>
                <a
                  href="https://t.me/elitdecor_uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/20 transition-all"
                >
                  Telegram orqali so‘rash
                </a>
              </div>
            </div>
          </div>

          {/* Quick links to active sections */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Hozirda mavjud bo‘limlar:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href={`/${locale}/katalog/karnizlar`}
                className="p-4 rounded-xl border border-gray-200 hover:border-[#D4AF37] hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-[#9E7A3D] transition-colors">
                    {t('karnizlar_title')}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">83 ta me’moriy model mavjud</p>
                </div>
                <span className="text-gray-400 group-hover:text-[#9E7A3D] transition-colors">→</span>
              </Link>
              <Link
                href={`/${locale}/katalog/bortkarnizlar`}
                className="p-4 rounded-xl border border-gray-200 hover:border-[#D4AF37] hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-[#9E7A3D] transition-colors">
                    {t('bortkarnizlar_title')}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">26 ta yashirin chiroqli model</p>
                </div>
                <span className="text-gray-400 group-hover:text-[#9E7A3D] transition-colors">→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
