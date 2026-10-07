import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GalleryClient from '@/components/GalleryClient';
import { CartProvider } from '@/context/CartContext';
import { getTranslations } from 'next-intl/server';

export default async function GalleryPage() {
  const t = await getTranslations('GalleryPage');

  const filePath = path.join(process.cwd(), 'public', 'images', 'galereya1', 'gallery.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { categories: rawCategories, items } = JSON.parse(fileContents);

  // Build translated categories from message files
  const translatedCategories: Record<string, string> = {};
  for (const key of Object.keys(rawCategories)) {
    translatedCategories[key] = t(`categories.${key}` as any);
  }

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-1">
          {/* Breadcrumb section */}
          <div className="bg-white py-4 border-b border-gray-100">
            <div className="container mx-auto px-4" style={{ maxWidth: '1200px' }}>
              <nav className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/" className="hover:text-accent transition-colors">{t('breadcrumb_home')}</Link>
                <span>/</span>
                <span className="text-gray-800 font-medium">{t('breadcrumb_gallery')}</span>
              </nav>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12 md:py-20" style={{ maxWidth: '1200px' }}>
            {/* Header Titles */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-5xl font-sans font-bold text-gray-900 mb-6 uppercase tracking-wide">
                {t('title')}
              </h1>

              {/* Gold Rhombus Separator */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-16 md:w-32 h-px bg-accent/60"></div>
                <div className="w-2.5 h-2.5 rotate-45 border-2 border-accent"></div>
                <div className="w-2.5 h-2.5 rotate-45 bg-accent"></div>
                <div className="w-2.5 h-2.5 rotate-45 border-2 border-accent"></div>
                <div className="w-16 md:w-32 h-px bg-accent/60"></div>
              </div>

              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                {t('desc')}
              </p>
            </div>

            {/* Gallery Interactive Component */}
            <GalleryClient categories={translatedCategories} items={items} />
          </div>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}
