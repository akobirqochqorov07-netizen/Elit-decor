'use client';

import React, { useState, useEffect, useCallback } from 'react';


interface Slide {
  id: number;
  imgSrc: string;
  title?: string;
  subtitle?: string;
  btnText?: string;
  btnHref?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    imgSrc: '/images/rasm1.png',
    title: 'Qadimiy Va Abadiy Go\'zallik',
    subtitle: 'Bino ko\'rinishini qirollar saroyidek bezatasiz',
    btnText: 'Smetani hisoblash',
    btnHref: '#callback',
  },
  { id: 3, imgSrc: '/images/rasm4.png' },
  {
    id: 2,
    imgSrc: '/images/rasm2.png',
    title: 'Interyerda Benuqson Uslub',
    subtitle: 'Eksklyuziv loyihalar uchun yengil va mustahkam ganch materiallari',
    btnText: 'Galereyani ko\'rish',
    btnHref: '/gallery/',
  },
  { id: 4, imgSrc: '/images/rasm5.png' },
  { id: 5, imgSrc: '/images/rasm6.png' },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  return (
    <div className="w-full bg-white py-0">
      <div className="container mx-auto px-2" style={{ maxWidth: '1240px' }}>
        <div className="relative overflow-hidden" style={{ minHeight: '520px', backgroundColor: '#f5f5f5' }}>
          <div className="relative w-full h-[520px]">
            {slides.map((slide, index) =>
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
                <div className="relative z-20 flex flex-col h-full container mx-auto px-12 lg:px-24 py-16" style={{ maxWidth: '1200px' }}>

                  {/* --- GENERIC SLIDES (rasm1, rasm2) --- */}
                  {(slide.id === 1 || slide.id === 2) && (
                    <div className="flex flex-col justify-center items-start h-full max-w-2xl px-0 py-4">
                      <h2 className="text-white font-serif text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg leading-tight">
                        {slide.title}
                      </h2>
                      <p className="text-gray-100 text-lg md:text-xl max-w-xl mb-8 drop-shadow-md">
                        {slide.subtitle}
                      </p>
                      <a
                        href={slide.btnHref}
                        className="text-white px-8 py-3 rounded text-lg font-medium transition-colors shadow-lg"
                        style={{ backgroundColor: '#D4AF37' }}
                      >
                        {slide.btnText}
                      </a>
                    </div>
                  )}

                  {/* --- SLIDE 3 (rasm4.png) --- */}
                  {slide.id === 3 && (
                    <div className="flex flex-col items-start justify-center h-full max-w-xl">
                      <h2 className="text-white font-sans text-4xl lg:text-5xl font-bold mb-2 uppercase leading-tight drop-shadow-md">
                        ELIT DEKOR GANCHLARI
                      </h2>
                      <h3 className="text-white font-sans text-3xl lg:text-4xl font-bold mb-8 uppercase leading-tight drop-shadow-md">
                        SAN'AT HAR BIR BURCHAKDA
                      </h3>
                      <button
                        className="text-white px-8 py-3 rounded text-lg font-medium transition-colors shadow-lg"
                        style={{ backgroundColor: '#D4AF37' }}
                      >
                        Katalogni ko'rish
                      </button>
                    </div>
                  )}

                  {/* --- SLIDE 4 (rasm5.png) --- */}
                  {slide.id === 4 && (
                    <div className="flex flex-col items-start justify-center h-full max-w-xl">
                      <h2 className="font-sans text-4xl lg:text-5xl font-bold mb-2 uppercase leading-tight" style={{ color: '#D4AF37' }}>
                        FASADINGIZ UCHUN DEKOR
                      </h2>
                      <h3 className="font-sans text-3xl lg:text-4xl font-bold mb-6 uppercase leading-tight" style={{ color: '#D4AF37' }}>
                        STEKLOFIBROBETONDAN
                      </h3>
                      <p className="text-gray-700 font-sans text-xl lg:text-2xl uppercase mb-10 tracking-wide font-medium">
                        G'OYALARNI HAYOTGA TATBIQ ETAMIZ
                      </p>
                      <button
                        className="text-white px-8 py-3 rounded text-lg font-medium transition-colors shadow-lg"
                        style={{ backgroundColor: '#D4AF37' }}
                      >
                        Hisoblashga buyurtma
                      </button>
                    </div>
                  )}

                  {/* --- SLIDE 5 (rasm6.png) --- */}
                  {slide.id === 5 && (
                    <div className="flex flex-col items-start justify-center h-full max-w-lg mt-8 ml-10">
                      <h2 className="font-sans text-4xl lg:text-5xl font-bold mb-2 leading-tight" style={{ color: '#D4AF37' }}>
                        Ganch bezaklarini
                      </h2>
                      <h2 className="font-sans text-4xl lg:text-5xl font-bold mb-2 leading-tight" style={{ color: '#D4AF37' }}>
                        o'rnatish xizmatlari
                      </h2>
                      <h3 className="text-gray-800 font-sans text-3xl lg:text-4xl font-bold mb-10 leading-tight">
                        professionallardan
                      </h3>

                      <div className="flex flex-col items-start w-full gap-8">
                        <button
                          className="text-white px-10 py-4 rounded text-xl font-medium transition-colors shadow-lg w-full max-w-xs"
                          style={{ backgroundColor: '#D4AF37' }}
                        >
                          Montajga ariza qoldirish
                        </button>

                        <div className="text-gray-800 text-lg font-medium leading-relaxed max-w-sm mt-4">
                          <p>Sifatli montaj kafolati</p>
                          <p>shaxsiy brigadir bilan.</p>
                          <p>To'liq ishlash jarayoni (sikli).</p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>

          {/* Navigation arrows (styled as dark gray circles like Dikart) */}
          <button
            onClick={() => { prev(); setIsAutoPlaying(false); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-700 text-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-gray-800 transition-all shadow-md z-30"
            aria-label="Предыдущий слайд">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => { next(); setIsAutoPlaying(false); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-700 text-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-gray-800 transition-all shadow-md z-30"
            aria-label="Следующий слайд">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-30">
            {slides.map((_, index) =>
              <button
                key={index}
                onClick={() => { setCurrent(index); setIsAutoPlaying(false); }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${index === current ? 'bg-gray-700 scale-110' : 'bg-gray-400 opacity-60'}`
                }
                aria-label={`Слайд ${index + 1}`} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}