'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { CartProvider } from '@/context/CartContext';

const servicesData = [
{
  id: 'montazh',
  title: 'Профессиональный монтаж',
  href: '/montazh/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/9dd/gv9tkiygpgd2y962ftyo666lmhlyiu0b/310_210_1/Rectangle-12.jpg',
  description: 'Профессиональный монтаж гипсовой лепнины опытными специалистами завода Дикарт.',
  benefits: ['Гарантия качества', 'Опытные мастера', 'Соблюдение сроков']
},
{
  id: 'measurements',
  title: 'Услуги замерщика',
  href: '/measurements/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/90e/kwvrhmwi09c1ruzvq8rn3xde0hpje5m3/310_210_1/Rectangle-137.jpg',
  description: 'Точные замеры помещения для правильного подбора и расчета количества лепнины.',
  benefits: ['Точные размеры', 'Правильный расчет', 'Без переплат']
},
{
  id: 'design-project',
  title: 'Услуги дизайнера',
  href: '/design-project/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/1cc/jjyiic2agrpb3eobha3vuuvc6ftl2vv4/310_210_1/Rectangle-136-_1_.jpg',
  description: 'Индивидуальное проектирование интерьера с использованием гипсовой лепнины.',
  benefits: ['Индивидуальный подход', '3D-визуализация', 'Подбор изделий']
},
{
  id: 'delivery',
  title: 'Доставка',
  href: '/delivery/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/99c/rr1wjxog59l3atou655gpfav41k7poan/310_210_1/Rectangle-139.jpg',
  description: 'Быстрая и бережная доставка по Москве и всей России.',
  benefits: ['Собственный транспорт', 'Бережная упаковка', 'Доставка по всей России']
},
{
  id: '3d-library',
  title: '3D-модели',
  href: '/3d-library/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/5be/ikkw1nhjkck3jigrc11z373pgwi8fqu8/310_210_1/www.dikart.ru_Listya_1185x872x45mm_3D.png',
  description: 'Библиотека 3D-моделей для дизайнеров и архитекторов.',
  benefits: ['Бесплатно', 'Все форматы', 'Регулярное обновление']
}];


export default function ServicesPage() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-green-600">Главная</Link>
              <span>/</span>
              <span className="text-gray-800">Услуги</span>
            </nav>

            <h1 className="text-3xl font-medium text-gray-800 mb-8">Наши услуги</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {servicesData?.map((service) =>
              <Link key={service?.id} href={service?.href} className="group block border border-gray-200 rounded overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative overflow-hidden">
                    <img
                    src={service?.imgSrc}
                    alt={`${service?.title} - Дикарт`}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={{ height: '200px', objectFit: 'cover' }} />
                  
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-medium text-gray-800 mb-2 group-hover:text-green-600 transition-colors">{service?.title}</h2>
                    <p className="text-sm text-gray-600 mb-3">{service?.description}</p>
                    <ul className="space-y-1">
                      {service?.benefits?.map((benefit, i) =>
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                          {benefit}
                        </li>
                    )}
                    </ul>
                  </div>
                </Link>
              )}
            </div>

            <div className="border-t border-gray-100 pt-10">
              <h2 className="text-2xl font-medium text-gray-800 mb-2">Заказать услугу</h2>
              <p className="text-gray-600 mb-6">Заполните форму и мы свяжемся с вами</p>
              <ContactForm />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>);

}