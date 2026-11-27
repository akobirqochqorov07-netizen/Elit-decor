import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'VirtualShowroom' });
  return {
    title: `${t('hero_title')} | Elit Dekor`,
    description: t('coming_soon_desc'),
  };
}

export default async function VirtualShowroomPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'VirtualShowroom' });

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0C10] text-white">
      <Header />

      {/* Main Full-Screen Blurred Canvas */}
      <main className="relative flex-1 min-h-[calc(100vh-160px)] flex items-center justify-center overflow-hidden px-4 py-16">
        {/* Background Image with Deep Blur */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 filter blur-2xl opacity-40 select-none pointer-events-none"
          style={{ backgroundImage: "url('/images/galereya1/full/dekor-090.webp')" }}
        />

        {/* Frosted Dark Glass Layer (Hirra qatlam) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0C10]/85 via-[#0A0C10]/70 to-[#0A0C10]/95 backdrop-blur-xl" />

        {/* Center Content: "Tez orada" */}
        <div className="relative z-10 max-w-xl mx-auto text-center px-4">
          {/* Subtle Brand Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#C5A265] text-xs font-mono tracking-widest uppercase mb-6 shadow-lg">
            <span>✦</span>
            <span>{t('hero_title')}</span>
            <span>✦</span>
          </div>

          {/* "Tez orada" Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white tracking-tight mb-4 drop-shadow-2xl">
            {t('coming_soon')}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed mb-8 max-w-md mx-auto">
            {t('coming_soon_desc')}
          </p>

          {/* Back to Home Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/${locale}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-black hover:bg-[#C5A265] font-medium text-sm tracking-wide transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              <span>←</span>
              <span>{t('back_to_home')}</span>
            </Link>
            <Link
              href={`/${locale}/katalog/karnizlar`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors text-sm font-medium"
            >
              <span>Katalogga o‘tish</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
