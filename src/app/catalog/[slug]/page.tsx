'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider, useCart } from '@/context/CartContext';

// Mock products for a category
interface Product {
  id: string;
  sku: string;
  title: string;
  price: number;
  unit: string;
  imgSrc: string;
  dimensions: string;
  material: string;
  availability: boolean;
  href: string;
}

const mockProducts: Product[] = [
{
  id: 'dk-204',
  sku: 'DK-204',
  title: 'Карниз DK-204 216Hx220mm',
  price: 438,
  unit: 'руб./п.м.',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/f10/z0ulpr0jecyxzxcyu01e30owt04kwdpw/310_210_1/www.dikart.ru_Dk_204_216Hx220mm_3D.png',
  dimensions: '216х220 мм',
  material: 'Гипс',
  availability: true,
  href: '/catalog/karnizy/dk-204/'
},
{
  id: 'dk-205',
  sku: 'DK-205',
  title: 'Карниз DK-205 180Hx195mm',
  price: 520,
  unit: 'руб./п.м.',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/f10/z0ulpr0jecyxzxcyu01e30owt04kwdpw/310_210_1/www.dikart.ru_Dk_204_216Hx220mm_3D.png',
  dimensions: '180х195 мм',
  material: 'Гипс',
  availability: true,
  href: '/catalog/karnizy/dk-205/'
},
{
  id: 'dk-206',
  sku: 'DK-206',
  title: 'Карниз DK-206 240Hx260mm',
  price: 680,
  unit: 'руб./п.м.',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/f10/z0ulpr0jecyxzxcyu01e30owt04kwdpw/310_210_1/www.dikart.ru_Dk_204_216Hx220mm_3D.png',
  dimensions: '240х260 мм',
  material: 'Гипс',
  availability: true,
  href: '/catalog/karnizy/dk-206/'
},
{
  id: 'dk-207',
  sku: 'DK-207',
  title: 'Карниз DK-207 с подсветкой',
  price: 1200,
  unit: 'руб./п.м.',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/f10/z0ulpr0jecyxzxcyu01e30owt04kwdpw/310_210_1/www.dikart.ru_Dk_204_216Hx220mm_3D.png',
  dimensions: '200х230 мм',
  material: 'Гипс',
  availability: false,
  href: '/catalog/karnizy/dk-207/'
},
{
  id: 'dk-208',
  sku: 'DK-208',
  title: 'Карниз DK-208 гладкий',
  price: 380,
  unit: 'руб./п.м.',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/f10/z0ulpr0jecyxzxcyu01e30owt04kwdpw/310_210_1/www.dikart.ru_Dk_204_216Hx220mm_3D.png',
  dimensions: '150х160 мм',
  material: 'Гипс',
  availability: true,
  href: '/catalog/karnizy/dk-208/'
},
{
  id: 'dk-209',
  sku: 'DK-209',
  title: 'Карниз DK-209 с рисунком',
  price: 750,
  unit: 'руб./п.м.',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/f10/z0ulpr0jecyxzxcyu01e30owt04kwdpw/310_210_1/www.dikart.ru_Dk_204_216Hx220mm_3D.png',
  dimensions: '190х210 мм',
  material: 'Гипс',
  availability: true,
  href: '/catalog/karnizy/dk-209/'
}];


function ProductCard({ product }: {product: Product;}) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  return (
    <div className="border border-gray-200 rounded overflow-hidden hover:shadow-md transition-shadow">
      <Link href={product.href}>
        <img
          src={product.imgSrc}
          alt={`${product.title} - лепнина Дикарт`}
          className="w-full object-cover hover:scale-105 transition-transform duration-300"
          style={{ height: '180px', objectFit: 'cover' }} />
        
      </Link>
      <div className="p-3">
        <p className="text-xs text-gray-400 mb-1">Арт.: {product.sku}</p>
        <Link href={product.href} className="text-sm font-medium text-gray-800 hover:text-green-600 transition-colors block mb-2">
          {product.title}
        </Link>
        <p className="text-xs text-gray-500 mb-1">Размер: {product.dimensions}</p>
        <p className="text-xs text-gray-500 mb-2">Материал: {product.material}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-800">{product.price.toLocaleString('ru-RU')} руб.</span>
          <span className="text-xs text-gray-500">{product.unit}</span>
        </div>
        <div className={`text-xs mb-3 ${product.availability ? 'text-green-600' : 'text-red-500'}`}>
          {product.availability ? 'В наличии' : 'Под заказ'}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-2 py-1 text-gray-600 hover:text-green-600">
              -</button>
            <span className="px-2 py-1 text-sm">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="px-2 py-1 text-gray-600 hover:text-green-600">
              +</button>
          </div>
          <button
            onClick={() => addItem({ id: product.id, title: product.title, price: product.price, quantity: qty, imgSrc: product.imgSrc, unit: product.unit, sku: product.sku })}
            className="flex-1 bg-green-500 text-white text-xs py-2 rounded hover:bg-green-600 transition-colors">
            
            В корзину
          </button>
        </div>
      </div>
    </div>);

}

function CategoryContent({ slug }: {slug: string;}) {
  const [sortBy, setSortBy] = useState('default');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredProducts = mockProducts.filter((p) => {
    if (priceMin && p.price < parseInt(priceMin)) return false;
    if (priceMax && p.price > parseInt(priceMax)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="flex gap-6">
      {/* Filters sidebar */}
      <aside className={`w-64 flex-shrink-0 ${filtersOpen ? 'block' : 'hidden md:block'}`}>
        <div className="border border-gray-200 rounded p-4">
          <h3 className="font-medium text-gray-800 mb-4">Фильтры</h3>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Цена, руб.</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="От"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
              
              <input
                type="number"
                placeholder="До"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
              
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Материал</label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              Гипс
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer mt-1">
              <input type="checkbox" className="w-4 h-4" />
              Стеклофиброгипс
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Наличие</label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              В наличии
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer mt-1">
              <input type="checkbox" className="w-4 h-4" />
              Под заказ
            </label>
          </div>
          <button
            onClick={() => {setPriceMin('');setPriceMax('');}}
            className="w-full border border-gray-300 text-gray-600 py-2 rounded text-sm hover:border-green-500 hover:text-green-600 transition-colors">
            
            Сбросить фильтры
          </button>
        </div>
      </aside>

      {/* Products */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">Найдено: {sortedProducts.length} товаров</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="md:hidden flex items-center gap-1 text-sm text-gray-600 border border-gray-300 rounded px-3 py-1">
              
              Фильтры
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm outline-none">
              
              <option value="default">По умолчанию</option>
              <option value="price_asc">Цена: по возрастанию</option>
              <option value="price_desc">Цена: по убыванию</option>
            </select>
          </div>
        </div>

        {sortedProducts.length === 0 ?
        <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-2">Товары не найдены</p>
            <p className="text-sm">Попробуйте изменить фильтры</p>
          </div> :

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedProducts.map((product) =>
          <ProductCard key={product.id} product={product} />
          )}
          </div>
        }
      </div>
    </div>);

}

export default function CategoryPage({ params }: {params: {slug: string;};}) {
  const categoryName = params.slug.
  replace(/-/g, ' ').
  replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-green-600">Главная</Link>
              <span>/</span>
              <Link href="/catalog/" className="hover:text-green-600">Интерьерный декор</Link>
              <span>/</span>
              <span className="text-gray-800">{categoryName}</span>
            </nav>

            <h1 className="text-3xl font-medium text-gray-800 mb-6">{categoryName}</h1>

            <CategoryContent slug={params.slug} />
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>);

}