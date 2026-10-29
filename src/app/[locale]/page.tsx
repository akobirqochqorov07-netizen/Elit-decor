'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import HomeIcon from '@/components/home/HomeIcons';
import KarnizHomeSection from '@/components/karnizlar/KarnizHomeSection';
import ServicesSection from '@/components/ServicesSection';
import BlogSection from '@/components/BlogSection';
import ContactsSection from '@/components/ContactsSection';
import FaqSection from '@/components/FaqSection';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Slider */}
        <HeroSlider />

        <div className="container mx-auto px-4" style={{ maxWidth: '1200px' }}>
          {/* About section - Dikart style */}
          <section id="about" className="py-10 scroll-mt-32">
            {/* Centered, large, bold heading — Dikart style */}
            <h1
              style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: '38px',
                fontWeight: '700',
                color: '#1a1a1a',
                lineHeight: '1.3',
                marginBottom: '28px',
                textAlign: 'center',
              }}
            >
              {t('about.title')}
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
              <div
                className="flex flex-col justify-start"
                style={{ maxHeight: '420px', overflow: 'hidden' }}
              >
                <p className="text-gray-700 text-base leading-relaxed mb-4">{t('about.p1')}</p>
                <p className="text-gray-700 text-base leading-relaxed mb-4">{t('about.p2')}</p>
                <p className="text-gray-700 text-base leading-relaxed mb-6">{t('about.p3')}</p>

                {/* Leader signature - gold color */}
                <div>
                  <p className="text-base font-semibold" style={{ color: '#D4AF37' }}>
                    {t('about.leader_title')}
                  </p>
                  <p className="text-base font-semibold" style={{ color: '#D4AF37' }}>
                    Ibodillaev Jafar
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Why choose us */}
          <section className="py-10 sm:py-16">
            <div className="text-center mb-7 sm:mb-12">
              <h2 className="font-sans text-2xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 uppercase tracking-wide">
                {t('why.title')}
              </h2>
              <div className="w-20 sm:w-24 h-1 mx-auto rounded" style={{ backgroundColor: '#D4AF37' }}></div>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
              {[
                { icon: 'quality', title: t('why.item1_title'), text: t('why.item1_desc') },
                { icon: 'assortment', title: t('why.item2_title'), text: t('why.item2_desc') },
                { icon: 'complex', title: t('why.item3_title'), text: t('why.item3_desc') },
                { icon: 'experience', title: t('why.item4_title'), text: t('why.item4_desc') },
              ].map((item, i) => (
                <li
                  key={i}
                  className="group flex flex-row sm:flex-col items-center sm:items-center gap-4 sm:gap-0 text-left sm:text-center p-4 sm:p-8 bg-white border border-gray-100 rounded-2xl hover:shadow-2xl transition-all duration-300 sm:hover:-translate-y-2 relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    style={{ backgroundColor: '#D4AF37' }}
                  ></div>
                  <div
                    className="w-12 h-12 sm:w-20 sm:h-20 shrink-0 rounded-full flex items-center justify-center sm:mb-6 sm:group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: '#f6f1e3', color: '#152f40' }}
                  >
                    <HomeIcon name={item.icon as any} className="w-6 h-6 sm:w-9 sm:h-9" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-1 sm:mb-3 group-hover:text-amber-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[13px] sm:text-sm text-gray-600 leading-snug sm:leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Gallery section */}
        <section className="py-10 sm:py-16 lg:py-20 relative bg-gray-50 w-full">
          <div className="container mx-auto px-4" style={{ maxWidth: '1200px' }}>
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 lg:gap-0">
              {/* Rasm — telefonda tepada */}
              <div className="order-1 lg:order-2 lg:w-[48%] w-full relative">
                <img
                  src="/images/galereya1/full/dekor-001.webp"
                  alt={t('gallery.image_overlay')}
                  className="relative w-full h-56 sm:h-80 lg:h-[500px] rounded-2xl object-cover shadow-xl ml-auto"
                  loading="lazy"
                />
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6">
                  <div className="backdrop-blur-md bg-black/25 border border-white/20 px-4 py-3 sm:px-8 sm:py-5 rounded-xl w-full text-center">
                    <span className="text-white text-xs sm:text-base font-medium tracking-widest uppercase">
                      {t('gallery.image_overlay')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Matn */}
              <div className="order-2 lg:order-1 lg:w-[48%] flex flex-col items-start pr-0">
                <h2 className="font-sans text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-6 uppercase tracking-wider leading-tight">
                  {t('gallery.title')}
                  <br /> <span style={{ color: '#D4AF37' }}>{t('gallery.subtitle')}</span>
                </h2>
                <p className="text-gray-600 text-sm sm:text-lg mb-5 sm:mb-10 leading-relaxed max-w-lg">
                  {t('gallery.desc')}
                </p>

                {/* Ko'rsatkichlar — telefonda 3 ustunli ixcham qator */}
                <ul className="grid grid-cols-3 gap-2 sm:gap-4 xl:gap-8 w-full mb-6 sm:mb-0 order-1 sm:order-2">
                  {[
                    { icon: 'shield', stat: '100%', text: t('gallery.stat1') },
                    { icon: 'design', stat: '250+', text: t('gallery.stat2') },
                    { icon: 'home', stat: '10K+', text: t('gallery.stat3') },
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex flex-col items-center sm:items-start text-center sm:text-left bg-white sm:bg-transparent rounded-xl sm:rounded-none border border-gray-100 sm:border-0 px-2 py-3 sm:p-0"
                    >
                      <HomeIcon
                        name={item.icon as any}
                        className="w-6 h-6 sm:w-9 sm:h-9 mb-1.5 sm:mb-3 text-gray-800"
                      />
                      <p
                        className="font-bold text-lg sm:text-xl xl:text-2xl leading-none mb-1"
                        style={{ color: '#D4AF37' }}
                      >
                        {item.stat}
                      </p>
                      <p className="text-[10px] sm:text-[11px] xl:text-xs text-gray-500 uppercase tracking-wide font-medium leading-tight">
                        {item.text}
                      </p>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/gallery/"
                  className="group inline-flex w-full sm:w-auto items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl order-2 sm:order-1 sm:mb-12"
                >
                  {t('gallery.btn')}
                  <svg
                    className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4" style={{ maxWidth: '1200px' }}>
          {/* Catalog sections */}
          <KarnizHomeSection title={t('catalogs.interior')} />

          {/* New improved sections */}
          <ServicesSection />
          <BlogSection />
          <ContactsSection />
          <FaqSection />
        </div>
      </main>
      <Footer />

      {/* Cookie notice */}
      <CookieNotice />

      {/* Scroll to top */}
      <ScrollToTop />
    </div>
  );
}

function CookieNotice() {
  const t = useTranslations('HomePage.cookies');
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const accepted = sessionStorage.getItem('cookies_accepted');
    if (accepted) setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-2 sm:p-4 z-40 shadow-lg">
      <div
        className="container mx-auto px-1 sm:px-4 flex flex-row items-center justify-between gap-3"
        style={{ maxWidth: '1200px' }}
      >
        <p className="text-xs sm:text-sm text-gray-600 leading-snug">
          {t('desc')}{' '}
          <Link href="/information_for_client/1430021/" className="hidden sm:inline text-green-600 hover:underline">
            {t('link')}
          </Link>
        </p>
        <button
          onClick={() => {
            sessionStorage.setItem('cookies_accepted', '1');
            setVisible(false);
          }}
          className="flex-shrink-0 bg-primary text-white px-4 sm:px-6 h-11 sm:h-auto sm:py-2 rounded font-medium hover:bg-primary-dark transition-colors text-sm"
        >
          {t('btn')}
        </button>
      </div>
    </div>
  );
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
      aria-label="Наверх"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}
