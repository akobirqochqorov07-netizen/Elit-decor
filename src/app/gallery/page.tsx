'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';

const galleryItems = [
{ id: 1, src: 'https://dikart.ru/local/templates/dikart-new/images/img-10.jpg', alt: 'Интерьер с гипсовой лепниной Дикарт', category: 'Интерьер' },
{ id: 2, src: 'https://dikart.ru/upload/resize_cache/iblock/90d/i1rtbo9r3pyme97ni11wxrtbyr3b2wtw/700_500_1/img_31.webp', alt: 'Гипсовые молдинги в интерьере', category: 'Интерьер' },
{ id: 3, src: 'https://dikart.ru/upload/resize_cache/iblock/1cc/jjyiic2agrpb3eobha3vuuvc6ftl2vv4/310_210_1/Rectangle-136-_1_.jpg', alt: 'Индивидуальное проектирование с лепниной', category: 'Проекты' },
{ id: 4, src: 'https://dikart.ru/upload/resize_cache/iblock/9dd/gv9tkiygpgd2y962ftyo666lmhlyiu0b/310_210_1/Rectangle-12.jpg', alt: 'Профессиональный монтаж лепнины', category: 'Монтаж' },
{ id: 5, src: 'https://dikart.ru/upload/resize_cache/iblock/90e/kwvrhmwi09c1ruzvq8rn3xde0hpje5m3/310_210_1/Rectangle-137.jpg', alt: 'Услуги замерщика', category: 'Услуги' },
{ id: 6, src: 'https://dikart.ru/upload/resize_cache/iblock/99c/rr1wjxog59l3atou655gpfav41k7poan/310_210_1/Rectangle-139.jpg', alt: 'Доставка лепнины', category: 'Доставка' },
{ id: 7, src: 'https://dikart.ru/upload/iblock/3f1/8h2syzhsvydjeyidt8cidayefq7ocqqs/banner_site_Montazhnaya_oblast_1_kopiya_12.jpg', alt: 'Лепнина Дикарт - искусство в каждом уголке', category: 'Интерьер' },
{ id: 8, src: 'https://dikart.ru/upload/iblock/fcf/bgdd8gpllh54estm3rp8hnrtgd3btryy/banner_24h_Montazhnaya-oblast-1.jpg', alt: 'Гипсовая лепнина 24 часа', category: 'Интерьер' },
{ id: 9, src: 'https://dikart.ru/upload/iblock/664/hl128sm5t6pl4npiazrtz4351cxq0vgg/banner_site_Montazhnaya-oblast-1-kopiya-5.jpg', alt: '3D панели Дикарт', category: 'Фасад' }];


const categories = ['Все', 'Интерьер', 'Фасад', 'Проекты', 'Монтаж', 'Услуги', 'Доставка'];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('Все');
  const [lightboxImg, setLightboxImg] = useState<typeof galleryItems[0] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filtered = activeCategory === 'Все' ?
  galleryItems :
  galleryItems.filter((item) => item.category === activeCategory);

  const openLightbox = (item: typeof galleryItems[0], index: number) => {
    setLightboxImg(item);
    setLightboxIndex(index);
  };

  const closeLightbox = () => setLightboxImg(null);

  const prevImage = () => {
    const newIndex = (lightboxIndex - 1 + filtered.length) % filtered.length;
    setLightboxIndex(newIndex);
    setLightboxImg(filtered[newIndex]);
  };

  const nextImage = () => {
    const newIndex = (lightboxIndex + 1) % filtered.length;
    setLightboxIndex(newIndex);
    setLightboxImg(filtered[newIndex]);
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-green-600">Главная</Link>
              <span>/</span>
              <span className="text-gray-800">Галерея</span>
            </nav>

            <h1 className="text-3xl font-medium text-gray-800 mb-4">Галерея интерьеров с лепниной</h1>
            <p className="text-gray-600 mb-6">
              Реализованные проекты и визуализации с гипсовой лепниной Дикарт
            </p>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((cat) =>
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                activeCategory === cat ?
                'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                }>
                
                  {cat}
                </button>
              )}
            </div>

            {/* Gallery grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item, index) =>
              <div
                key={item.id}
                className="relative overflow-hidden rounded cursor-pointer group"
                onClick={() => openLightbox(item, index)}>
                
                  <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  style={{ height: '200px', objectFit: 'cover' }} />
                
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs">{item.alt}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />

        {/* Lightbox */}
        {lightboxImg &&
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4" onClick={closeLightbox}>
            <button onClick={closeLightbox} className="absolute top-4 right-4 text-white hover:text-gray-300">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <button onClick={(e) => {e.stopPropagation();prevImage();}} className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <img
            src={lightboxImg.src}
            alt={lightboxImg.alt}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()} />
          
            <button onClick={(e) => {e.stopPropagation();nextImage();}} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {lightboxIndex + 1} / {filtered.length}
            </div>
          </div>
        }
      </div>
    </CartProvider>);

}