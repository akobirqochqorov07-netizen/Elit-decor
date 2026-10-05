'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import CatalogSection from '@/components/CatalogSection';
import ContactForm from '@/components/ContactForm';
import { CartProvider } from '@/context/CartContext';
import { interiorCategories, facadeCategories, services } from '@/data/catalog';

import brand from '@/lib/brand';

export default function HomePage() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Slider */}
          <HeroSlider />



          <div className="container mx-auto px-4" style={{ maxWidth: '1200px' }}>
            {/* About section - Dikart style */}
            <section className="py-10">
              {/* Centered, large, bold heading — Dikart style */}
              <h1 style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: '38px',
                fontWeight: '700',
                color: '#1a1a1a',
                lineHeight: '1.3',
                marginBottom: '28px',
                textAlign: 'center'
              }}>
                Interyer va fasad lepnini ishlab chiqaruvchi zavod — Elit Dekor
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Video - left side, taller */}
                <div
                  className="relative bg-black rounded overflow-hidden flex items-center justify-center"
                  style={{ paddingBottom: '65%' }}
                >
                  <video
                    className="absolute inset-0 w-full h-full object-contain"
                    poster="/images/gold.png"
                    controls
                    preload="none"
                  >
                    <source src="/video1.MP4" type="video/mp4" />
                  </video>
                </div>

                {/* Text - right side, capped to video height with overflow hidden */}
                <div className="flex flex-col justify-start" style={{ maxHeight: '420px', overflow: 'hidden' }}>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    <strong>Elit Dekor</strong> — 2018-yildan buyon Samarqandda ganch mahsulotlarini
                    ishlab chiqarish va o'rnatish bilan shug'ullanib kelayotgan ishonchli kompaniya.
                    Biz dekorativ va me'moriy ganch bezaklarini — kornişlar, rozеtkalar, ustunlar va
                    maxsus buyurtma elementlarini zamonaviy texnologiyalar yordamida tayyorlaymiz.
                  </p>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    Har bir mahsulotimiz yuqori sifat nazoratidan o'tadi. Loyihalarimiz Samarqand va
                    uning atrofidagi viloyatlarda keng tarqalgan. Faqat tabiiy xom ashyodan tayyorlangan
                    uzoq umrli ganch mahsulotlarini taqdim etamiz.
                  </p>
                  <p className="text-gray-700 text-base leading-relaxed mb-6">
                    Loyiha bosqichidan tortib to tayyor montajgacha to'liq kompleks xizmat ko'rsatamiz.
                  </p>

                  {/* Leader signature - gold color */}
                  <div>
                    <p className="text-base font-semibold" style={{ color: '#D4AF37' }}>
                      Kompaniya Rahbari
                    </p>
                    <p className="text-base font-semibold" style={{ color: '#D4AF37' }}>
                      Ibodillaev Jafar
                    </p>
                  </div>
                </div>
              </div>
            </section>



            {/* Why choose us - Premium Redesign */}
            <section className="py-16">
              <div className="text-center mb-12">
                <h2 className="font-sans text-3xl md:text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
                  Nima uchun aynan Elit Dekor?
                </h2>
                <div className="w-24 h-1 mx-auto rounded" style={{ backgroundColor: '#D4AF37' }}></div>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { img: 'https://dikart.ru/local/templates/dikart-new/images/img-02.svg', title: 'Oliy Sifat', text: 'Materiallarimiz yillar davomida oʻz mustahkamligini va koʻrkini yoʻqotmaydi, rangini saqlab qoladi.' },
                  { img: 'https://dikart.ru/local/templates/dikart-new/images/img-04.svg', title: 'Keng Assortiment', text: 'Yuzlab xil mahsulotlarimiz bilan har qanday dizayn gʻoyangizni roʻyobga chiqaramiz.' },
                  { img: 'https://dikart.ru/local/templates/dikart-new/images/img-05.svg', title: 'Kompleks Yondashuv', text: 'Oʻlcham olishdan tortib to obyektni toʻliq montaj qilib topshirishgacha toʻliq jarayon.' },
                  { img: 'https://dikart.ru/local/templates/dikart-new/images/img-06.svg', title: 'Boy Tajriba', text: '2018-yildan beri xususiy uylar va yirik biznes majmualarida muvaffaqiyatli loyihalar.' }]?.
                  map((item, i) =>
                    <li key={i} className="group flex flex-col items-center text-center p-8 bg-white border border-gray-100 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" style={{ backgroundColor: '#D4AF37' }}></div>
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                        <img src={item?.img} alt={item?.title} className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-amber-600 transition-colors">{item?.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item?.text}</p>
                    </li>
                  )}
              </ul>
            </section>
          </div>

          {/* Gallery section - Premium Redesign */}
          <section className="py-20 relative bg-gray-50 w-full">
            <div className="container mx-auto px-4" style={{ maxWidth: '1200px' }}>
              <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-0">
                {/* Text Content */}
                <div className="lg:w-[48%] flex flex-col items-start pr-0">
                  <h2 className="font-sans text-3xl md:text-5xl font-bold text-gray-900 mb-6 uppercase tracking-wider leading-tight">
                    Ganch bezakli<br /> <span style={{ color: '#D4AF37' }}>Interyerlar Galereyasi</span>
                  </h2>
                  <p className="text-gray-600 text-lg mb-10 leading-relaxed max-w-lg">
                    Bizning galereyamizda ilhom izlash uchun hamkorlarimiz bilan amalga oshirilgan real loyihalar va nafis ganch bezaklari vizualizatsiyalarini topishingiz mumkin.
                  </p>

                  <Link href="/gallery/" className="group inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl mb-12">
                    Galereyaga o'tish
                    <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>

                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 xl:gap-8 w-full">
                    {[
                      { img: 'https://dikart.ru/local/templates/dikart-new/images/img-07.png', stat: '100%', text: 'Sifat kafolati' },
                      { img: 'https://dikart.ru/local/templates/dikart-new/images/img-08.png', stat: '250+', text: 'Dizaynerlar bazasi' },
                      { img: 'https://dikart.ru/local/templates/dikart-new/images/img-09.png', stat: '10K+', text: 'Amalga oshgan loyihalar' }]?.
                      map((item, i) =>
                        <li key={i} className="flex flex-col items-start">
                          <img src={item?.img} alt={item?.text} className="w-10 h-10 mb-3" style={{ filter: 'grayscale(100%) brightness(0)' }} />
                          <p className="font-bold text-xl xl:text-2xl leading-none mb-1" style={{ color: '#D4AF37' }}>{item?.stat}</p>
                          <p className="text-[11px] xl:text-xs text-gray-500 uppercase tracking-wide font-medium whitespace-nowrap">{item?.text}</p>
                        </li>
                      )}
                  </ul>
                </div>

                {/* Image Showcase */}
                <div className="lg:w-[48%] w-full relative">
                  <img
                    src="https://dikart.ru/local/templates/dikart-new/images/img-10.jpg"
                    alt="Turli uslubdagi interyerlar"
                    className="relative w-full h-[500px] rounded-2xl object-cover shadow-2xl ml-auto"
                  />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="backdrop-blur-md bg-white/10 border border-white/20 px-8 py-5 rounded-xl w-full text-center">
                      <span className="text-white text-sm md:text-base font-medium tracking-widest uppercase">
                        Turli uslubdagi noyob interyerlar
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="container mx-auto px-4" style={{ maxWidth: '1200px' }}>
            {/* Interior Catalog */}
            <CatalogSection
              title="Каталог интерьерного декора"
              categories={interiorCategories}
              type="interior" />


            {/* Facade Catalog */}
            <CatalogSection
              title="Каталог фасадного декора"
              categories={facadeCategories}
              type="facade" />


            {/* Services */}
            <section className="py-10 border-t border-gray-100">
              <h2 className="font-serif text-2xl font-medium text-gray-800 mb-6">Наши услуги</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {services?.map((service) =>
                  <Link key={service?.id} href={service?.href} className="group block">
                    <div className="relative overflow-hidden rounded">
                      <img
                        src={service?.imgSrc}
                        alt={`${service?.title} - Дикарт`}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        style={{ height: '160px', objectFit: 'cover' }} />

                      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <span className="text-white text-sm font-medium">{service?.title}</span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </section>

            {/* Blog */}
            <section className="py-10 border-t border-gray-100">
              <h2 className="font-serif text-2xl font-medium text-gray-800 mb-6">Наш блог</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded z-10">
                    Статья: <em>Гипсовые молдинги в интерьере: акценты, которые меняют восприятие пространства</em>
                  </div>
                  <img
                    src="https://dikart.ru/upload/resize_cache/iblock/90d/i1rtbo9r3pyme97ni11wxrtbyr3b2wtw/700_500_1/img_31.webp"
                    alt="Гипсовые молдинги в интерьере"
                    className="w-full rounded object-cover"
                    style={{ height: '250px', objectFit: 'cover' }} />

                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-gray-600 mb-4">
                    Вы когда-нибудь замечали, что одна комната кажется просторнее и выше, а другая – тесной, даже если их размеры одинаковы? Секрет не всегда в планировке или мебели.
                  </p>
                  <Link href="/articles/1606558/" className="text-green-600 hover:text-accent-dark font-medium transition-colors">
                    Читать далее →
                  </Link>
                </div>
              </div>
            </section>

            {/* Gypsum vs Polyurethane */}
            <section className="py-10 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Gypsum */}
                <div className="p-6 bg-gray-50 rounded">
                  <img src="https://dikart.ru/local/templates/dikart-new/images/img-20.png" alt="Гипс" className="w-16 h-16 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Гипс</h2>
                  <ul className="space-y-3">
                    {[
                      { img: 'https://dikart.ru/local/templates/dikart-new/images/img-14.svg', text: 'Служит более 100 лет' },
                      { img: 'https://dikart.ru/local/templates/dikart-new/images/img-15.svg', text: 'Натуральный' },
                      { img: 'https://dikart.ru/local/templates/dikart-new/images/img-16.svg', text: 'Нетоксичный, дышащий материал' }]?.
                      map((item, i) =>
                        <li key={i} className="flex items-center gap-3">
                          <img src={item?.img} alt={item?.text} className="w-8 h-8" />
                          <span className="text-sm text-gray-700">{item?.text}</span>
                        </li>
                      )}
                  </ul>
                </div>
                {/* Polyurethane */}
                <div className="p-6 bg-gray-50 rounded">
                  <img src="https://dikart.ru/local/templates/dikart-new/images/img-21.png" alt="Полиуретан" className="w-16 h-16 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Полиуретан</h2>
                  <ul className="space-y-3">
                    {[
                      { img: 'https://dikart.ru/local/templates/dikart-new/images/img-17.svg', text: 'Токсичный' },
                      { img: 'https://dikart.ru/local/templates/dikart-new/images/img-18.svg', text: 'Разрушается за несколько лет' },
                      { img: 'https://dikart.ru/local/templates/dikart-new/images/img-19.svg', text: 'Пожароопасный, нельзя использовать в местах общественного пользования' }]?.
                      map((item, i) =>
                        <li key={i} className="flex items-center gap-3">
                          <img src={item?.img} alt={item?.text} className="w-8 h-8" />
                          <span className="text-sm text-gray-700">{item?.text}</span>
                        </li>
                      )}
                  </ul>
                </div>
              </div>
            </section>

            {/* Contacts */}
            <section className="py-10 border-t border-gray-100">
              <h2 className="font-serif text-2xl font-medium text-gray-800 mb-6">Наши контакты</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact info */}
                <div>
                  <div className="space-y-6">
                    {brand.addresses.map((contact, i) =>
                      <div key={i} className="p-4 border border-gray-200 rounded">
                        <p className="font-semibold text-gray-800">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.city}</p>
                        <p className="text-sm text-gray-600 mb-2">{contact.street}</p>
                        <p className="text-sm">
                          <a href={contact.phoneHref} className="text-gray-800 hover:text-accent">{contact.phone}</a>
                        </p>
                        <p className="text-sm">
                          <a href={`mailto:${contact.email}`} className="text-gray-800 hover:text-accent">{contact.email}</a>
                        </p>
                        <p className="text-xs text-gray-500 mt-1" style={{ whiteSpace: 'pre-line' }}>{contact.hours}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <a href="https://t.me/Dikart_manager" target="_blank" rel="noopener noreferrer">
                      <img src="https://dikart.ru/local/templates/dikart-new/images/tm.svg" alt="Telegram" className="w-10 h-10" />
                    </a>
                    <a href="https://max.ru/u/f9LHodD0cOLjtPvnoPK4n4sSSbs6fv29pzqyYDyne3qwtvZRnW3FvtpTSng" target="_blank" rel="noopener noreferrer">
                      <img src="https://dikart.ru/local/templates/dikart-new/images/soc/max-messenger-logo.svg" alt="Max" className="w-10 h-10" />
                    </a>
                  </div>
                </div>
                {/* Map placeholder */}
                <div className="bg-gray-100 rounded flex items-center justify-center" style={{ minHeight: '300px' }}>
                  <div className="text-center text-gray-500">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <p className="text-sm">{brand.addresses[0]?.city}, {brand.addresses[0]?.street}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Form */}
            <section className="py-10 border-t border-gray-100">
              <h2 className="font-serif text-2xl font-medium text-gray-800 mb-2">Остались вопросы?</h2>
              <p className="text-gray-600 mb-6">Заполните форму и мы свяжемся с вами</p>
              <ContactForm />
            </section>
          </div>
        </main>
        <Footer />

        {/* Cookie notice */}
        <CookieNotice />

        {/* Scroll to top */}
        <ScrollToTop />
      </div >
    </CartProvider >);

}

function CookieNotice() {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const accepted = sessionStorage.getItem('cookies_accepted');
    if (accepted) setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 shadow-lg">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ maxWidth: '1200px' }}>
        <p className="text-sm text-gray-600">
          Мы используем файлы cookie, чтобы обеспечивать правильную работу нашего веб-сайта и анализировать сетевой трафик.{' '}
          <Link href="/information_for_client/1430021/" className="text-green-600 hover:underline">Согласие на обработку и политика в отношении персональных данных</Link>
        </p>
        <button
          onClick={() => { sessionStorage.setItem('cookies_accepted', '1'); setVisible(false); }}
          className="flex-shrink-0 bg-primary text-white px-6 py-2 rounded font-medium hover:bg-primary-dark transition-colors text-sm">

          Хорошо
        </button>
      </div>
    </div>);

}

function ScrollToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-20 right-6 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors z-30"
      aria-label="Наверх">

      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>);

}