'use client';

/**
 * ModelViewer3D — lazy-loaded 3D model viewer using @google/model-viewer.
 * Implements a World-Space Quaternion Trackball:
 * - 360° unrestricted rotation in all directions.
 * - Horizontal drag rotates strictly around the screen vertical axis (no lifting / drifting).
 * - Vertical drag rotates naturally (drag down -> pulls down, drag up -> pushes up).
 * - Zero gimbal lock, zero pole clamping.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface ModelViewer3DProps {
  src: string;
  productName: string;
  cameraOrbit?: string;
}

// ── Quaternion math utilities ────────────────────────────────────────────────

type Quat = [number, number, number, number]; // [x, y, z, w]

function quatMultiply(a: Quat, b: Quat): Quat {
  return [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
    a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
  ];
}

function quatNormalize(q: Quat): Quat {
  const len = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
  return [q[0] / len, q[1] / len, q[2] / len, q[3] / len];
}

function quatFromAxisAngle(axis: [number, number, number], rad: number): Quat {
  const half = rad / 2;
  const s = Math.sin(half);
  return [axis[0] * s, axis[1] * s, axis[2] * s, Math.cos(half)];
}

function quatToEulerString(q: Quat): string {
  const [x, y, z, w] = q;
  const m13 = 2 * (x * z + y * w);
  const m21 = 2 * (x * y + z * w);
  const m22 = 1 - 2 * (x * x + z * z);
  const m23 = 2 * (y * z - x * w);
  const m33 = 1 - 2 * (x * x + y * y);

  const pitch = Math.asin(Math.max(-1, Math.min(1, -m23)));
  const yaw = Math.atan2(m13, m33);
  const roll = Math.atan2(m21, m22);

  const toDeg = 180 / Math.PI;
  return `${(roll * toDeg).toFixed(2)}deg ${(pitch * toDeg).toFixed(2)}deg ${(yaw * toDeg).toFixed(2)}deg`;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ModelViewer3D({ src, productName }: ModelViewer3DProps) {
  const t = useTranslations('ProductPage');
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const scriptInjected = useRef(false);
  const viewerRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [spinning, setSpinning] = useState(false);
  const [touched, setTouched] = useState(false);

  // Modelning 3D fazodagi haqiqiy orientatsiyasi (Katernion asosida: hech qachon qiyshaymaydi)
  const qRef = useRef<Quat>([0, 0, 0, 1]); // Identity (boshlang'ich: 100% to'g'ri, tekis)
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const touchDistRef = useRef<number | null>(null);

  // model-viewer kutubxonasini yuklash
  useEffect(() => {
    if (scriptInjected.current) return;
    scriptInjected.current = true;

    if (!customElements.get('model-viewer')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js';
      document.head.appendChild(script);
    }
  }, []);

  const mv = useCallback(() => viewerRef.current as any, []);

  // Orientatsiyani model-viewer ga uzatish
  const applyOrientation = useCallback((q: Quat) => {
    const el = mv();
    if (!el) return;
    el.setAttribute('orientation', quatToEulerString(q));
  }, [mv]);

  // Model yuklangach
  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    const onLoad = () => {
      setLoaded(true);
      applyOrientation(qRef.current);
    };
    const onErr = () => setError(true);

    el.addEventListener('load', onLoad);
    el.addEventListener('error', onErr);
    return () => {
      el.removeEventListener('load', onLoad);
      el.removeEventListener('error', onErr);
    };
  }, [applyOrientation]);

  // Sahifa orqa foni skroll bo'lmasligi uchun
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Erkin dunyo o'qlari bo'yicha aylantirish (Gimbal lock va ko'tarilishdan xoli)
  const rotateWorldAxis = useCallback((axis: [number, number, number], rad: number) => {
    const qDelta = quatFromAxisAngle(axis, rad);
    qRef.current = quatNormalize(quatMultiply(qDelta, qRef.current));
    applyOrientation(qRef.current);
  }, [applyOrientation]);

  // Avto-aylanish (faqat vertikal o'q atrofida toza aylanadi, tepaga ko'tarilmaydi)
  useEffect(() => {
    if (!spinning) return;
    let animId: number;
    const animate = () => {
      rotateWorldAxis([0, 1, 0], 0.007);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [spinning, rotateWorldAxis]);

  // Tugmalar orqali burish
  const rotateStep = (direction: 'up' | 'down' | 'left' | 'right') => {
    setTouched(true);
    setSpinning(false);
    const rad = (15 * Math.PI) / 180;
    if (direction === 'up') rotateWorldAxis([1, 0, 0], -rad);
    if (direction === 'down') rotateWorldAxis([1, 0, 0], rad);
    if (direction === 'left') rotateWorldAxis([0, 1, 0], -rad);
    if (direction === 'right') rotateWorldAxis([0, 1, 0], rad);
  };

  // Tezkor burchaklar (Presets)
  const setPresetView = (preset: 'front' | 'corner' | 'top' | 'bottom') => {
    setTouched(true);
    setSpinning(false);
    if (preset === 'front') {
      qRef.current = [0, 0, 0, 1];
    } else if (preset === 'corner') {
      qRef.current = quatFromAxisAngle([0, 1, 0], (-35 * Math.PI) / 180);
    } else if (preset === 'top') {
      qRef.current = quatFromAxisAngle([1, 0, 0], (90 * Math.PI) / 180);
    } else if (preset === 'bottom') {
      qRef.current = quatFromAxisAngle([1, 0, 0], (-90 * Math.PI) / 180);
    }
    applyOrientation(qRef.current);
  };

  // Masshtab (Zoom)
  const zoom = (factor: number) => {
    const el = mv();
    if (!el?.getCameraOrbit) return;
    const o = el.getCameraOrbit();
    el.cameraOrbit = `${o.theta}rad ${o.phi}rad ${o.radius * factor}m`;
    setTouched(true);
  };

  const resetView = () => {
    const el = mv();
    if (!el) return;
    qRef.current = [0, 0, 0, 1];
    applyOrientation(qRef.current);
    el.cameraOrbit = '0deg 90deg auto';
    el.cameraTarget = 'auto auto auto';
    el.fieldOfView = 'auto';
    setSpinning(false);
  };

  const toggleSpin = () => {
    setSpinning((prev) => !prev);
  };

  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else el.requestFullscreen?.().catch(() => {});
  };

  // Klaviatura strelkalari orqali boshqaruv
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        rotateStep('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        rotateStep('down');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        rotateStep('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        rotateStep('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Sichqoncha / Trekpad orqali to'liq 360° erkin aylantirish
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setTouched(true);
    setSpinning(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };

    const sensitivity = 0.007;

    // Gorizontal drag (dx) -> toza vertikal Y o'qi atrofida aylanadi (model aslo tepaga ko'tarilmaydi!)
    if (dx !== 0) {
      const qYaw = quatFromAxisAngle([0, 1, 0], dx * sensitivity);
      qRef.current = quatNormalize(quatMultiply(qYaw, qRef.current));
    }

    // Vertikal drag (dy) -> toza gorizontal X o'qi atrofida aylanadi
    // dy > 0 (pastga tortganda) -> model pastga qarab aylanadi (tabiiy tortish)
    if (dy !== 0) {
      const qPitch = quatFromAxisAngle([1, 0, 0], dy * sensitivity);
      qRef.current = quatNormalize(quatMultiply(qPitch, qRef.current));
    }

    applyOrientation(qRef.current);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.08 : 0.92;
    zoom(factor);
  };

  // Telefonda 2 barmoq bilan masshtab (pinch-to-zoom)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      if (touchDistRef.current !== null) {
        const factor = touchDistRef.current / dist;
        zoom(factor);
      }
      touchDistRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    touchDistRef.current = null;
  };

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
        {t('viewer_error')}
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-full select-none cursor-grab active:cursor-grabbing touch-none"
      style={{ background: 'radial-gradient(circle at 50% 42%, #2c343f 0%, #151a21 58%, #080a0d 100%)' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Loading spinner */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-400">{t('viewer_loading')}</span>
          </div>
        </div>
      )}

      {/* Tezkor burchaklar (Presets): To'g'ri, 3D Burchak, Tepadan (Shift), Pastdan */}
      {loaded && (
        <div
          className="absolute top-3 left-3 z-10 flex items-center gap-1 sm:gap-2 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/15 text-xs shadow-lg"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setPresetView('front')}
            className="px-2.5 py-1 rounded text-white/80 hover:text-white hover:bg-white/20 transition-colors font-medium"
          >
            To‘g‘ri (Oldidan)
          </button>
          <button
            type="button"
            onClick={() => setPresetView('corner')}
            className="px-2.5 py-1 rounded text-white/80 hover:text-white hover:bg-white/20 transition-colors font-medium"
          >
            3D Burchak
          </button>
          <button
            type="button"
            onClick={() => setPresetView('top')}
            className="px-2.5 py-1 rounded text-white/80 hover:text-white hover:bg-white/20 transition-colors font-medium"
          >
            Tepadan (Shift)
          </button>
          <button
            type="button"
            onClick={() => setPresetView('bottom')}
            className="px-2.5 py-1 rounded text-white/80 hover:text-white hover:bg-white/20 transition-colors font-medium"
          >
            Pastdan
          </button>
        </div>
      )}

      {/* model-viewer canvas */}
      <ModelViewerElement
        ref={viewerRef}
        src={src}
        alt={productName}
        style={{ width: '100%', height: '100%', background: 'transparent', pointerEvents: 'none' }}
      />

      {/* Ko'rsatma */}
      {loaded && !touched && (
        <div className="absolute bottom-3 left-3 right-24 sm:right-auto sm:max-w-md pointer-events-none z-10">
          <span className="inline-block text-[12px] sm:text-[13px] text-white/80 bg-black/50 backdrop-blur-sm rounded px-3 py-1.5 leading-snug border border-white/10">
            {t('viewer_rotate')} (tepadan-pastga 360° to‘liq aylanadi)
          </span>
        </div>
      )}

      {/* Boshqaruv tugmalari */}
      {loaded && (
        <div
          className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* Vertikal (tepaga/pastga) va gorizontal (chapga/o'ngga) 360° burish tugmalari */}
          <div className="flex items-center gap-0.5 bg-black/60 backdrop-blur-md rounded-md p-1 border border-white/15 shadow-lg">
            <button
              type="button"
              onClick={() => rotateStep('up')}
              aria-label="Tepaga burish"
              title="Tepaga 360° burish (↑)"
              className="w-8 h-8 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 rounded transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => rotateStep('down')}
              aria-label="Pastga burish"
              title="Pastga 360° burish (↓)"
              className="w-8 h-8 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 rounded transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className="w-[1px] h-5 bg-white/20 mx-0.5" />
            <button
              type="button"
              onClick={() => rotateStep('left')}
              aria-label="Chapga burish"
              title="Chapga 360° burish (←)"
              className="w-8 h-8 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 rounded transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => rotateStep('right')}
              aria-label="O'ngga burish"
              title="O'ngga 360° burish (→)"
              className="w-8 h-8 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 rounded transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {[
            { key: 'zoom_out', label: t('viewer_zoom_out'), on: () => zoom(1.25), d: 'M5 12h14' },
            { key: 'zoom_in', label: t('viewer_zoom_in'), on: () => zoom(0.8), d: 'M5 12h14M12 5v14' },
            { key: 'reset', label: t('viewer_reset'), on: resetView, d: 'M4 12a8 8 0 1 0 2.5-5.8M4 4v5h5' },
          ].map((b) => (
            <button
              key={b.key}
              type="button"
              onClick={b.on}
              aria-label={b.label}
              title={b.label}
              className="w-10 h-10 flex items-center justify-center text-white/90 hover:text-white bg-black/60 hover:bg-black/80 rounded-md transition-colors border border-white/10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={b.d} />
              </svg>
            </button>
          ))}
          <button
            type="button"
            onClick={toggleSpin}
            aria-label={t('viewer_autorotate')}
            title={t('viewer_autorotate')}
            className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors border border-white/10 ${spinning ? 'text-white bg-white/25' : 'text-white/90 bg-black/60 hover:bg-black/80'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={t('viewer_fullscreen')}
            title={t('viewer_fullscreen')}
            className="hidden sm:flex w-10 h-10 items-center justify-center text-white/90 hover:text-white bg-black/60 hover:bg-black/80 rounded-md transition-colors border border-white/10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ── Wrapper avoids TypeScript JSX namespace issues ────────────────────────────

const ModelViewerElement = React.forwardRef<
  HTMLElement,
  {
    src: string;
    alt: string;
    style?: React.CSSProperties;
  }
>(function ModelViewerElement({ src, alt, style }, ref) {
  const elRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Merge forwarded ref
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === 'function') {
      ref(elRef.current);
    } else {
      (ref as React.MutableRefObject<HTMLElement | null>).current = elRef.current;
    }
  });

  useEffect(() => {
    const div = containerRef.current;
    if (!div) return;

    let mv = div.querySelector('model-viewer') as HTMLElement | null;
    if (!mv) {
      mv = document.createElement('model-viewer');
      mv.setAttribute('src', src);
      mv.setAttribute('alt', alt);
      mv.setAttribute('shadow-intensity', '1.1');
      mv.setAttribute('shadow-softness', '0.9');
      mv.setAttribute('exposure', '0.65');
      mv.setAttribute('environment-image', 'legacy');
      mv.setAttribute('camera-orbit', '0deg 90deg auto');
      mv.setAttribute('orientation', '0deg 0deg 0deg');
      mv.setAttribute('interaction-prompt', 'none');
      mv.addEventListener('load', () => {
        const model = (mv as any).model;
        model?.materials?.forEach((m: any) => {
          m.setDoubleSided?.(true);
          m.doubleSided = true;
          m.pbrMetallicRoughness.setBaseColorFactor([0.92, 0.92, 0.93, 1]);
          m.pbrMetallicRoughness.setRoughnessFactor(0.75);
          m.pbrMetallicRoughness.setMetallicFactor(0);
        });
      });
      mv.setAttribute('loading', 'eager');
      mv.setAttribute('reveal', 'auto');
      Object.assign(mv.style, style);
      div.appendChild(mv);
      (elRef as React.MutableRefObject<HTMLElement>).current = mv;
    }
  }, [src, alt, style]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
});
