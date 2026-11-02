'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface LightboxSlide {
  src: string;
  alt: string;
}

interface ImageLightboxProps {
  slides: LightboxSlide[];
  startIndex?: number;
  onClose: () => void;
}

/**
 * Rasmni butun ekranga ochadigan oyna (dikart.ru dagidek):
 * qora fon, yirik rasm, oldingi/keyingi, hisoblagich, kattalashtirish,
 * slayd-shou, to'liq ekran, pastda miniatyuralar. Klaviatura va telefonda surish ishlaydi.
 */
export default function ImageLightbox({ slides, startIndex = 0, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [playing, setPlaying] = useState(false);
  const [showThumbs, setShowThumbs] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number; moved: boolean } | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const many = slides.length > 1;

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + slides.length) % slides.length);
      setZoomed(false);
      setOffset({ x: 0, y: 0 });
    },
    [slides.length]
  );

  const toggleZoom = useCallback(() => {
    setZoomed((z) => !z);
    setOffset({ x: 0, y: 0 });
  }, []);

  const toggleFullscreen = () => {
    const el = rootRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else el.requestFullscreen?.().catch(() => {});
  };

  // Klaviatura
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' && many) go(1);
      else if (e.key === 'ArrowLeft' && many) go(-1);
      else if (e.key === '+' || e.key === '=') setZoomed(true);
      else if (e.key === '-') setZoomed(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, many, onClose]);

  // Sahifa aylanmasin
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
      if (document.fullscreenElement) document.exitFullscreen?.();
    };
  }, []);

  // Slayd-shou
  useEffect(() => {
    if (!playing || !many) return;
    const id = setInterval(() => go(1), 3000);
    return () => clearInterval(id);
  }, [playing, many, go]);

  // Kattalashtirilganda sudrash (sichqoncha/barmoq)
  const onPointerDown = (e: React.PointerEvent) => {
    if (!zoomed) return;
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
    setOffset({ x: d.ox + dx, y: d.oy + dy });
  };
  const onPointerUp = () => {
    const moved = drag.current?.moved;
    drag.current = null;
    if (!moved) toggleZoom();
  };

  // Telefonda surish: oldingi/keyingi
  const onTouchStart = (e: React.TouchEvent) => {
    if (zoomed || e.touches.length !== 1) return;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touchStart.current;
    touchStart.current = null;
    if (!s || !many) return;
    const dx = e.changedTouches[0].clientX - s.x;
    const dy = e.changedTouches[0].clientY - s.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  };

  const slide = slides[index];
  const iconBtn =
    'w-11 h-11 flex items-center justify-center text-white/85 hover:text-white hover:bg-white/10 rounded transition-colors';

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={slide.alt}
      className="fixed inset-0 z-[300] flex flex-col select-none"
      style={{ background: 'rgba(8,10,13,0.99)' }}
    >
      {/* Yuqori panel */}
      <div className="flex items-center justify-between px-3 sm:px-5 h-14 shrink-0">
        <span className="text-white/80 text-sm tabular-nums">
          {index + 1} / {slides.length}
        </span>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button type="button" onClick={toggleZoom} className={iconBtn} aria-label="Kattalashtirish">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5M8.5 11h5M11 8.5v5" className={zoomed ? 'opacity-0' : ''} />
              <path d="M8.5 11h5" className={zoomed ? '' : 'opacity-0'} />
            </svg>
          </button>
          {many && (
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className={iconBtn}
              aria-label={playing ? 'To‘xtatish' : 'Slayd-shou'}
            >
              {playing ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 4.5v15l12-7.5-12-7.5Z" />
                </svg>
              )}
            </button>
          )}
          <button type="button" onClick={toggleFullscreen} className={`${iconBtn} hidden sm:flex`} aria-label="To‘liq ekran">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            </svg>
          </button>
          {many && (
            <button
              type="button"
              onClick={() => setShowThumbs((v) => !v)}
              className={`${iconBtn} ${showThumbs ? 'text-white' : ''}`}
              aria-label="Miniatyuralar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                {[5, 12, 19].flatMap((x) => [5, 12, 19].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.7" />))}
              </svg>
            </button>
          )}
          <button type="button" onClick={onClose} className={iconBtn} aria-label="Yopish">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l14 14M19 5 5 19" />
            </svg>
          </button>
        </div>
      </div>

      {/* Rasm */}
      <div
        className="relative flex-1 min-h-0 flex items-center justify-center overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={(e) => {
          // Rasmdan tashqari qora joyni bosish — yopish
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {many && (
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-1 sm:left-4 z-10 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full"
            aria-label="Oldingi rasm"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 5-7 7 7 7" />
            </svg>
          </button>
        )}

        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          draggable={false}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="max-w-[94%] max-h-[94%] object-contain"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoomed ? 2.2 : 1})`,
            transition: drag.current ? 'none' : 'transform 0.25s ease',
            cursor: zoomed ? 'grab' : 'zoom-in',
            touchAction: zoomed ? 'none' : 'pan-y',
          }}
        />

        {many && (
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-1 sm:right-4 z-10 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full"
            aria-label="Keyingi rasm"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Miniatyuralar */}
      {many && showThumbs && (
        <div className="shrink-0 flex justify-center gap-2 px-3 py-3 sm:py-4">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => {
                setIndex(i);
                setZoomed(false);
                setOffset({ x: 0, y: 0 });
              }}
              className="w-24 h-16 sm:w-32 sm:h-20 p-1 rounded-sm overflow-hidden"
              style={{
                background: i === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.12)',
                border: i === index ? '2px solid var(--ed-green)' : '2px solid transparent',
                opacity: i === index ? 1 : 0.7,
              }}
              aria-label={`Rasm ${i + 1}`}
            >
              <img src={s.src} alt="" className="w-full h-full object-contain" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
