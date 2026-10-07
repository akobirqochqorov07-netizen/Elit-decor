import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { CartProvider } from '@/context/CartContext';
import { getTranslations } from 'next-intl/server';

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations('ServicesPage');

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-accent">{t('breadcrumb_home')}</Link>
              <span>/</span>
              <Link href="/services/" className="hover:text-accent">{t('breadcrumb_services')}</Link>
              <span>/</span>
              <span className="text-gray-800 capitalize">{slug.replace(/-/g, ' ')}</span>
            </nav>

            <h1 className="text-3xl font-medium text-gray-800 mb-8 capitalize">
              {slug.replace(/-/g, ' ')}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="relative z-10">
                <ContactForm />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
