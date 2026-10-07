'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider, useCart } from '@/context/CartContext';

const mockProduct = {
  id: 'dk-204',
  sku: 'DK-204',
  title: 'Карниз DK-204 216Hx220mm',
  price: 438,
  unit: 'руб./п.м.',
  images: [
    'https://dikart.ru/upload/resize_cache/iblock/f10/z0ulpr0jecyxzxcyu01e30owt04kwdpw/310_210_1/www.dikart.ru_Dk_204_216Hx220mm_3D.png',
    'https://dikart.ru/upload/resize_cache/iblock/c5d/ttyxkjhh8f0w0q15f50glf0n1qsklyx8/310_210_1/6_1_.png',
    'https://dikart.ru/upload/resize_cache/iblock/e63/oz5ro83kzg1ej2ukzvkyewo7z8zw8wz2/310_210_1/www.dikart_1_1_.png',
  ],
  dimensions: '216х220 мм',
  width: '220',
  height: '216',
  material: 'Гипс',
  availability: true,
  productionTime: '3-5 рабочих дней',
  description: 'Карниз DK-204 — элегантный гипсовый карниз для интерьера. Идеально подходит для оформления потолка в классическом, барокко и неоклассическом стилях. Изготавливается из высококачественного гипса на заводе Дикарт.',
  specifications: [
    { name: 'Артикул', value: 'DK-204' },
    { name: 'Высота', value: '216 мм' },
    { name: 'Ширина', value: '220 мм' },
    { name: 'Материал', value: 'Гипс' },
    { name: 'Цвет', value: 'Белый' },
    { name: 'Стандартная длина', value: '2000 мм' },
  ],
  category: 'Карнизы',
  categoryHref: '/catalog/karnizy/',
};

function ProductDetailContent({ productSlug }: { productSlug: string }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addItem } = useCart();

  const product = mockProduct;

  return (
    <div>
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-green-600">Главная</Link>
        <span>/</span>
        <Link href="/catalog/" className="hover:text-green-600">Интерьерный декор</Link>
        <span>/</span>
        <Link href={product.categoryHref} className="hover:text-green-600">{product.category}</Link>
        <span>/</span>
        <span className="text-gray-800">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image gallery */}
        <div>
          <div className="border border-gray-200 rounded overflow-hidden mb-3">
            <img
              src={product.images[selectedImage]}
              alt={`${product.title} - фото ${selectedImage + 1}`}
              className="w-full object-contain"
              style={{ height: '400px', objectFit: 'contain' }}
            />
          </div>
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`border-2 rounded overflow-hidden ${selectedImage === i ? 'border-green-500' : 'border-gray-200'}`}
              >
                <img src={img} alt={`Фото ${i + 1}`} className="w-16 h-16 object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div>
          <h1 className="text-2xl font-medium text-gray-800 mb-2">{product.title}</h1>
          <p className="text-sm text-gray-500 mb-4">Арт.: {product.sku}</p>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold text-gray-800">{product.price.toLocaleString('ru-RU')} руб.</span>
            <span className="text-gray-500">{product.unit}</span>
          </div>

          <div className={`inline-flex items-center gap-1 text-sm mb-4 ${product.availability ? 'text-green-600' : 'text-red-500'}`}>
            <span className={`w-2 h-2 rounded-full ${product.availability ? 'bg-green-500' : 'bg-red-500'}`} />
            {product.availability ? 'В наличии' : 'Под заказ'}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
            <div>
              <span className="text-gray-500">Размер:</span>
              <span className="ml-1 text-gray-800">{product.dimensions}</span>
            </div>
            <div>
              <span className="text-gray-500">Материал:</span>
              <span className="ml-1 text-gray-800">{product.material}</span>
            </div>
            <div>
              <span className="text-gray-500">Срок изготовления:</span>
              <span className="ml-1 text-gray-800">{product.productionTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border border-gray-300 rounded">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-gray-600 hover:text-green-600">-</button>
              <span className="px-4 py-2 text-sm font-medium">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-3 py-2 text-gray-600 hover:text-green-600">+</button>
            </div>
            <button
              onClick={() => addItem({ id: product.id, title: product.title, price: product.price, quantity: qty, imgSrc: product.images[0], unit: product.unit, sku: product.sku })}
              className="flex-1 bg-green-500 text-white py-3 rounded font-medium hover:bg-green-600 transition-colors"
            >
              Добавить в корзину
            </button>
          </div>

          <button className="w-full border border-green-500 text-green-600 py-3 rounded font-medium hover:bg-green-50 transition-colors">
            Заказать расчет
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          {[
            { id: 'description', label: 'Описание' },
            { id: 'specs', label: 'Характеристики' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600' :'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'description' && (
        <div className="prose max-w-none text-gray-700 mb-12">
          <p>{product.description}</p>
        </div>
      )}

      {activeTab === 'specs' && (
        <div className="mb-12">
          <table className="w-full text-sm">
            <tbody>
              {product.specifications.map((spec, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-2 text-gray-500 w-1/3">{spec.name}</td>
                  <td className="px-4 py-2 text-gray-800">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ProductPage({ params }: { params: { slug: string; product: string } }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
            <ProductDetailContent productSlug={params.product} />
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
