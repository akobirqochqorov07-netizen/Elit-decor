import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VirtualShowroomClient from '@/components/showroom/VirtualShowroomClient';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'VirtualShowroom' });
  return {
    title: `${t('hero_title')} | Elit Dekor`,
    description: `${t('hero_desc')} ${t('hero_interactive')} ${t('hero_desc2')}`,
  };
}

export default async function VirtualShowroomPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0D12]">
      <Header />
      <main className="flex-1">
        <VirtualShowroomClient />
      </main>
      <Footer />
    </div>
  );
}
