import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'VirtualShowroom' });
  return {
    title: `${t('hero_title')} | Elit Dekor`,
    description: t('coming_soon'),
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
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      <Header />

      {/* Main viewport with soft frosted glass blur layer (1-rasmdagi xira fon) */}
      <main className="relative flex-1 min-h-[calc(100vh-100px)] flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Soft light frosted blur gradient layer */}
        <div
          className="absolute inset-0 select-none pointer-events-none bg-gradient-to-b from-white via-[#E6EBF0] to-[#8C98A6] opacity-90 filter blur-3xl scale-125"
        />

        {/* Ambient radial overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-white/50 to-transparent pointer-events-none" />

        {/* Center: "Tez orada" */}
        <div className="relative z-10 text-center px-4 max-w-lg mx-auto flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-gray-900 tracking-wider font-normal drop-shadow-sm mb-4">
            {t('coming_soon')}
          </h1>

          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-black border border-gray-300/80 shadow-sm hover:shadow transition-all text-xs sm:text-sm font-medium tracking-wide mt-2"
          >
            <span>←</span>
            <span>{t('back_to_home')}</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
