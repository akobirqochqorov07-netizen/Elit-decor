'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function HeroSlider() {
  const t = useTranslations('HeroSlider');
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      imgSrc: '/images/rasm1.png',
      title: t('slide1_title'),
      subtitle: t('slide1_subtitle'),
      btnText: t('slide1_btn'),
      btnHref: '#callback',
    },
    { id: 3, imgSrc: '/images/rasm4.png' },
    {
      id: 2,
      imgSrc: '/images/rasm2.png',
      title: t('slide2_title'),
      subtitle: t('slide2_subtitle'),
      btnText: t('slide2_btn'),
      btnHref: '/gallery/',
    },
    { id: 4, imgSrc: '/images/rasm5.png' },
    { id: 5, imgSrc: '/images/rasm6.png' },
  ];

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  return (
    <div className="w-full bg-white py-0">
      <div className="container mx-auto px-2" style={{ maxWidth: '1240px' }}>
        <div
          className="relative overflow-hidden"
          style={{ minHeight: '520px', backgroundColor: '#f5f5f5' }}
        >
          <div className="relative w-full h-[520px]">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`transition-opacity duration-1000 absolute inset-0 ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                {/* Overlay for text visibility (only for the generic slides) */}
                {(slide.id === 1 || slide.id === 2) && (
                  <div className="absolute inset-0 bg-black/40 mix-blend-multiply z-10 transition-opacity"></div>
                )}

                {/* Background Image */}
                <img
                  src={slide.imgSrc}
                  alt="Slide"
                  className="w-full h-full object-cover absolute inset-0"
                />

                {/* Content Layer */}
                <div
                  className="relative z-20 flex flex-col h-full container mx-auto px-5 sm:px-12 lg:px-24 py-8 sm:py-16"
                  style={{ maxWidth: '1200px' }}
                >
                  {/* --- GENERIC SLIDES (rasm1, rasm2) --- */}
                  {(slide.id === 1 || slide.id === 2) && (
                    <div className="flex flex-col justify-center items-start h-full max-w-2xl px-0 py-2 sm:py-4">
                      <h2 className="text-white font-sans text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 drop-shadow-lg leading-tight uppercase">
                        {slide.title}
                      </h2>
                      <p className="text-gray-100 font-sans text-sm sm:text-lg md:text-xl max-w-xl mb-4 sm:mb-8 drop-shadow-md">
                        {slide.subtitle}
                      </p>
                      <a
                        href={slide.btnHref}
                        className="inline-block text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded text-sm sm:text-lg font-medium transition-colors shadow-lg hover:opacity-90"
                        style={{ backgroundColor: '#D4AF37' }}
                      >
                        {slide.btnText}
                      </a>
                    </div>
                  )}

                  {/* --- SLIDE 3 (rasm4.png) --- */}
                  {slide.id === 3 && (
                    <div className="flex flex-col items-start justify-center h-full max-w-xl">
                      <h2 className="text-white font-sans text-2xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 uppercase leading-tight drop-shadow-md">
                        {t('slide3_title')}
                      </h2>
                      <h3 className="text-white font-sans text-lg sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-8 uppercase leading-tight drop-shadow-md">
                        {t('slide3_subtitle')}
                      </h3>
                      <Link
                        href="/catalog/"
                        className="inline-block text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded text-sm sm:text-lg font-medium transition-colors shadow-lg hover:opacity-90"
                        style={{ backgroundColor: '#D4AF37' }}
                      >
                        {t('slide3_btn')}
                      </Link>
                    </div>
                  )}

                  {/* --- SLIDE 4 (rasm5.png) --- */}
                  {slide.id === 4 && (
                    <div className="flex flex-col items-start justify-center h-full max-w-xl">
                      <h2
                        className="font-sans text-2xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 uppercase leading-tight"
                        style={{ color: '#D4AF37' }}
                      >
                        {t('slide4_title')}
                      </h2>
                      <h3
                        className="font-sans text-lg sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-6 uppercase leading-tight"
                        style={{ color: '#D4AF37' }}
                      >
                        {t('slide4_subtitle')}
                      </h3>
                      <p className="text-gray-700 font-sans text-sm sm:text-xl lg:text-2xl uppercase mb-4 sm:mb-10 tracking-wide font-medium">
                        {t('slide4_tagline')}
                      </p>
                      <Link
                        href="/catalog-facade/"
                        className="inline-block text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded text-sm sm:text-lg font-medium transition-colors shadow-lg hover:opacity-90"
                        style={{ backgroundColor: '#D4AF37' }}
                      >
                        {t('slide4_btn')}
                      </Link>
                    </div>
                  )}

                  {/* --- SLIDE 5 (rasm6.png) --- */}
                  {slide.id === 5 && (
                    <div className="flex flex-col items-start justify-center h-full max-w-lg mt-0 sm:mt-8 ml-0 sm:ml-10">
                      <h2
                        className="font-sans text-2xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 leading-tight"
                        style={{ color: '#D4AF37' }}
                      >
                        {t('slide5_title1')}
                      </h2>
                      <h2
                        className="font-sans text-2xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 leading-tight"
                        style={{ color: '#D4AF37' }}
                      >
                        {t('slide5_title2')}
                      </h2>
                      <h3 className="text-gray-800 font-sans text-base sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-8 leading-tight">
                        {t('slide5_subtitle')}
                      </h3>

                      <div className="flex flex-col items-start w-full gap-2 sm:gap-6">
                        <Link
                          href="/contacts/"
                          className="inline-block text-white px-6 sm:px-10 py-2 sm:py-4 rounded text-sm sm:text-xl font-medium transition-colors shadow-lg w-auto sm:w-full max-w-xs text-center hover:opacity-90"
                          style={{ backgroundColor: '#D4AF37' }}
                        >
                          {t('slide5_btn')}
                        </Link>

                        <div className="text-gray-800 text-xs sm:text-base font-medium leading-snug sm:leading-relaxed max-w-sm mt-1 sm:mt-3 space-y-0.5 sm:space-y-1">
                          <p>{t('slide5_quality')}</p>
                          <p>{t('slide5_brigadir')}</p>
                          <p>{t('slide5_cycle')}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => {
              prev();
              setIsAutoPlaying(false);
            }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 text-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-gray-800 transition-all shadow-md z-30"
            aria-label={t('prev_aria')}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => {
              next();
              setIsAutoPlaying(false);
            }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 text-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-gray-800 transition-all shadow-md z-30"
            aria-label={t('next_aria')}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-30">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrent(index);
                  setIsAutoPlaying(false);
                }}
                className={`relative before:absolute before:-inset-3 before:content-[''] w-2.5 h-2.5 rounded-full transition-all ${index === current ? 'bg-gray-700 scale-110' : 'bg-gray-400 opacity-60'}`}
                aria-label={`${t('dot_aria')} ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
