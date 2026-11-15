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

const MAX_SCALE = 8;
const SWIPE_MIN_PX = 90;

interface View {
  s: number;
  x: number;
  y: number;
}

/**
 * Rasmni butun ekranga ochadigan oyna.
 *  - Sichqoncha g'ildiragi / trackpad: kursor turgan joyga qarab silliq yaqinlashadi
 *  - Telefonda: ikki barmoq bilan chimchilab yaqinlashtirish va siljitish
 *  - Ikki marta bosish: tanlangan joyga yaqinlashtiradi / qaytaradi
 *  - Yaqinlashtirilganda sudrab siljitish (rasm ekrandan chiqib ketmaydi)
 *  - Boshqa rasmga o'tish: faqat aniq yon tomonga surish (yoki tugma) va faqat yaqinlashtirilmagan holatda
 */
export default function ImageLightbox({ slides, startIndex = 0, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const [zoomPct, setZoomPct] = useState(100);
  const [playing, setPlaying] = useState(false);
  const [showThumbs, setShowThumbs] = useState(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const view = useRef<View>({ s: 1, x: 0, y: 0 });
  const base = useRef({ w: 0, h: 0 }); // rasmning 1x dagi ko'rinadigan o'lchami
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<
    | null
    | { type: 'pan'; x0: number; y0: number; vx: number; vy: number; moved: number; t0: number }
    | { type: 'swipe'; x0: number; y0: number; moved: number; t0: number }
    | { type: 'pinch'; d0: number; s0: number; qx: number; qy: number }
  >(null);
  const lastTap = useRef({ t: 0, x: 0, y: 0 });

  const many = slides.length > 1;

  // ── Ko'rinish (zoom/siljish) ──────────────────────────────────────────────
  const stageInfo = () => {
    const r = stageRef.current!.getBoundingClientRect();
    return { r, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
  };

  /**
   * strict=false: harakat paytida chekkada biroz bo'sh joy ruxsat (tanlangan nuqta joyida qolishi uchun).
   * strict=true: qo'yib yuborilgach — rasm ekran chetidan tashqariga chiqmaydi.
   */
  const clampView = (s: number, x: number, y: number, strict = false): View => {
    s = Math.min(MAX_SCALE, Math.max(1, s));
    if (s <= 1.001) return { s: 1, x: 0, y: 0 };
    const { r } = stageInfo();
    const slackX = strict ? 0 : r.width * 0.35;
    const slackY = strict ? 0 : r.height * 0.35;
    const ws = base.current.w * s;
    const hs = base.current.h * s;
    // Rasm ekrandan katta bo'lsa — chetlari ekran chetidan o'tmaydi; kichik bo'lsa — to'liq ekran ichida erkin turadi
    const mx = Math.abs(ws - r.width) / 2 + slackX;
    const my = Math.abs(hs - r.height) / 2 + slackY;
    return { s, x: Math.min(mx, Math.max(-mx, x)), y: Math.min(my, Math.max(-my, y)) };
  };

  const applyView = useCallback((v: View, animate = false) => {
    view.current = v;
    const el = imgRef.current;
    if (!el) return;
    el.style.transition = animate ? 'transform 0.22s cubic-bezier(0.2, 0.7, 0.3, 1)' : 'none';
    el.style.transform = `translate3d(${v.x}px, ${v.y}px, 0) scale(${v.s})`;
    setZoomPct(Math.round(v.s * 100));
  }, []);

  const settleTimer = useRef<number | null>(null);
  /** Harakat tugagach rasmni yumshoq ravishda ekran chegarasiga qaytaradi */
  const settle = useCallback(
    (delay = 0) => {
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
      settleTimer.current = window.setTimeout(() => {
        const v = view.current;
        const t = clampView(v.s, v.x, v.y, true);
        if (Math.abs(t.x - v.x) > 0.5 || Math.abs(t.y - v.y) > 0.5) applyView(t, true);
      }, delay);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [applyView]
  );

  const measure = useCallback(() => {
    const el = imgRef.current;
    if (!el) return;
    base.current = { w: el.offsetWidth, h: el.offsetHeight };
  }, []);

  /** (px, py) ekran nuqtasini joyida ushlab turib, masshtabni o'zgartiradi */
  const zoomAt = useCallback(
    (px: number, py: number, newScale: number, animate = false) => {
      const { cx, cy } = stageInfo();
      const v = view.current;
      const qx = (px - cx - v.x) / v.s; // rasm koordinatasi (markazdan)
      const qy = (py - cy - v.y) / v.s;
      const s = Math.min(MAX_SCALE, Math.max(1, newScale));
      applyView(clampView(s, px - cx - qx * s, py - cy - qy * s), animate);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [applyView]
  );

  const zoomCenter = (factor: number) => {
    const { cx, cy } = stageInfo();
    zoomAt(cx, cy, view.current.s * factor, true);
    settle(280);
  };

  const resetView = useCallback((animate = false) => applyView({ s: 1, x: 0, y: 0 }, animate), [applyView]);

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + slides.length) % slides.length);
    },
    [slides.length]
  );

  // Rasm almashganda ko'rinish tiklanadi
  useEffect(() => {
    resetView(false);
    measure();
  }, [index, resetView, measure]);

  useEffect(() => {
    const onResize = () => {
      measure();
      applyView(clampView(view.current.s, view.current.x, view.current.y));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure, applyView]);

  // ── G'ildirak va brauzer pinch-zoom'ini bloklash (passiv bo'lmagan) ──────
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const k = e.ctrlKey ? 0.012 : 0.0018; // trackpad pinch kuchliroq
      const notch = !e.ctrlKey && Math.abs(e.deltaY) >= 50; // oddiy sichqoncha g'ildiragi: yumshoq animatsiya
      const factor = Math.exp(-e.deltaY * k);
      zoomAt(e.clientX, e.clientY, view.current.s * factor, notch);
      settle(notch ? 500 : 350);
    };
    const block = (e: Event) => e.preventDefault();
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('gesturestart', block as EventListener);
    el.addEventListener('gesturechange', block as EventListener);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('gesturestart', block as EventListener);
      el.removeEventListener('gesturechange', block as EventListener);
    };
  }, [zoomAt, settle]);

  // ── Klaviatura ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const zoomed = view.current.s > 1.001;
      if (e.key === 'Escape') onClose();
      else if (e.key === '+' || e.key === '=') zoomCenter(1.5);
      else if (e.key === '-') zoomCenter(1 / 1.5);
      else if (e.key === '0') resetView(true);
      else if (e.key === 'ArrowRight') {
        if (zoomed) applyView(clampView(view.current.s, view.current.x - 80, view.current.y), true);
        else if (many) go(1);
      } else if (e.key === 'ArrowLeft') {
        if (zoomed) applyView(clampView(view.current.s, view.current.x + 80, view.current.y), true);
        else if (many) go(-1);
      } else if (zoomed && e.key === 'ArrowUp') applyView(clampView(view.current.s, view.current.x, view.current.y + 80), true);
      else if (zoomed && e.key === 'ArrowDown') applyView(clampView(view.current.s, view.current.x, view.current.y - 80), true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [go, many, onClose, applyView, resetView]);

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

  // ── Ko'rsatkich (sichqoncha / barmoq) hodisalari ──────────────────────────
  const startPinch = () => {
    const pts = [...pointers.current.values()];
    const [a, b] = pts;
    const d0 = Math.hypot(a.x - b.x, a.y - b.y) || 1;
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const { cx, cy } = stageInfo();
    const v = view.current;
    gesture.current = { type: 'pinch', d0, s0: v.s, qx: (mx - cx - v.x) / v.s, qy: (my - cy - v.y) / v.s };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      startPinch();
    } else if (pointers.current.size === 1) {
      const v = view.current;
      if (v.s > 1.001) {
        gesture.current = { type: 'pan', x0: e.clientX, y0: e.clientY, vx: v.x, vy: v.y, moved: 0, t0: Date.now() };
      } else {
        gesture.current = { type: 'swipe', x0: e.clientX, y0: e.clientY, moved: 0, t0: Date.now() };
      }
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (!g) return;

    if (g.type === 'pinch' && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const { cx, cy } = stageInfo();
      const s = Math.min(MAX_SCALE, Math.max(1, (g.s0 * d) / g.d0));
      applyView(clampView(s, mx - cx - g.qx * s, my - cy - g.qy * s));
    } else if (g.type === 'pan') {
      const dx = e.clientX - g.x0;
      const dy = e.clientY - g.y0;
      g.moved = Math.max(g.moved, Math.abs(dx) + Math.abs(dy));
      applyView(clampView(view.current.s, g.vx + dx, g.vy + dy));
    } else if (g.type === 'swipe') {
      g.moved = Math.max(g.moved, Math.abs(e.clientX - g.x0) + Math.abs(e.clientY - g.y0));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const g = gesture.current;
    pointers.current.delete(e.pointerId);

    if (g?.type === 'pinch') {
      settle(0);
      // Bitta barmoq qolsa — siljitishga o'tamiz (sakrashsiz)
      if (pointers.current.size === 1) {
        const [p] = [...pointers.current.values()];
        const v = view.current;
        gesture.current =
          v.s > 1.001
            ? { type: 'pan', x0: p.x, y0: p.y, vx: v.x, vy: v.y, moved: 99, t0: Date.now() }
            : null;
      } else if (pointers.current.size === 0) gesture.current = null;
      return;
    }
    if (pointers.current.size > 0 || !g) return;
    gesture.current = null;
    if (g.type === 'pan') settle(0);

    const dt = Date.now() - g.t0;
    const isTap = g.moved < 10 && dt < 350;

    if (g.type === 'swipe') {
      const dx = e.clientX - g.x0;
      const dy = e.clientY - g.y0;
      if (many && Math.abs(dx) >= SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy) * 1.8) {
        go(dx < 0 ? 1 : -1);
        return;
      }
    }

    if (isTap) {
      const img = imgRef.current;
      const rect = img?.getBoundingClientRect();
      const inside = rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      const now = Date.now();
      const lt = lastTap.current;
      const isDouble = now - lt.t < 320 && Math.hypot(e.clientX - lt.x, e.clientY - lt.y) < 32;
      lastTap.current = { t: now, x: e.clientX, y: e.clientY };
      if (isDouble) {
        lastTap.current = { t: 0, x: 0, y: 0 };
        if (view.current.s > 1.3) resetView(true);
        else {
          zoomAt(e.clientX, e.clientY, 3, true);
          settle(280);
        }
      } else if (!inside) {
        // Rasmdan tashqari qora joyga bir marta bosish — yopish
        window.setTimeout(() => {
          if (lastTap.current.t === now) onClose();
        }, 340);
      }
    }
  };

  const onPointerCancel = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) gesture.current = null;
  };

  const toggleFullscreen = () => {
    const el = rootRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else el.requestFullscreen?.().catch(() => {});
  };

  const slide = slides[index];
  const zoomed = zoomPct > 101;
  const iconBtn =
    'w-11 h-11 flex items-center justify-center text-white/85 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent';

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
          {zoomed && <span className="ml-3 text-white/55">{zoomPct}%</span>}
        </span>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button type="button" onClick={() => zoomCenter(1 / 1.6)} disabled={!zoomed} className={iconBtn} aria-label="Uzoqlashtirish">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5M8.5 11h5" />
            </svg>
          </button>
          <button type="button" onClick={() => zoomCenter(1.6)} disabled={view.current.s >= MAX_SCALE - 0.01} className={iconBtn} aria-label="Yaqinlashtirish">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5M8.5 11h5M11 8.5v5" />
            </svg>
          </button>
          {many && (
            <button type="button" onClick={() => setPlaying((p) => !p)} className={iconBtn} aria-label={playing ? 'To‘xtatish' : 'Slayd-shou'}>
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
            <button type="button" onClick={() => setShowThumbs((v) => !v)} className={`${iconBtn} ${showThumbs ? 'text-white' : ''}`} aria-label="Miniatyuralar">
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

      {/* Rasm maydoni: barcha harakatlar shu yerda */}
      <div
        ref={stageRef}
        className="relative flex-1 min-h-0 flex items-center justify-center overflow-hidden"
        style={{ touchAction: 'none', cursor: zoomed ? 'grab' : 'zoom-in' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        {many && !zoomed && (
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
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
          ref={imgRef}
          src={slide.src}
          alt={slide.alt}
          draggable={false}
          decoding="async"
          onLoad={() => {
            measure();
            resetView(false);
          }}
          className="max-w-[92vw] sm:max-w-[min(62vw,980px)] max-h-[58vh] sm:max-h-[min(62vh,640px)] object-contain pointer-events-none will-change-transform"
          style={{ transformOrigin: '50% 50%' }}
        />

        {many && !zoomed && (
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
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
              onClick={() => setIndex(i)}
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
