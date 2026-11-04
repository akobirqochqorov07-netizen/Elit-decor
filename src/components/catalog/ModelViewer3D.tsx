'use client';

/**
 * ModelViewer3D — lazy-loaded 3D model viewer using @google/model-viewer web component.
 * Loaded only when the modal opens (dynamic import, ssr: false).
 */

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

interface ModelViewer3DProps {
  src: string;
  productName: string;
}

export default function ModelViewer3D({ src, productName }: ModelViewer3DProps) {
  const t = useTranslations('ProductPage');
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const scriptInjected = useRef(false);
  const viewerRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [spinning, setSpinning] = useState(true);
  const [touched, setTouched] = useState(false);

  // Inject the model-viewer script once
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

  // Attach load/error events after the element mounts
  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    const onLoad = () => setLoaded(true);
    const onErr = () => setError(true);
    // Foydalanuvchi modelni ushlagach, o'z-o'zidan aylanish to'xtaydi (aks holda qarshilik qiladi)
    const onCamera = (e: Event) => {
      if ((e as CustomEvent).detail?.source === 'user-interaction') {
        (el as any).autoRotate = false;
        setSpinning(false);
        setTouched(true);
      }
    };
    el.addEventListener('load', onLoad);
    el.addEventListener('error', onErr);
    el.addEventListener('camera-change', onCamera);
    return () => {
      el.removeEventListener('load', onLoad);
      el.removeEventListener('error', onErr);
      el.removeEventListener('camera-change', onCamera);
    };
  }, []);

  // 3D oyna ochiq paytda orqadagi sahifa surilmasin (telefonda vertikal surish modelni aylantirsin)
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const mv = () => viewerRef.current as any;

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
    el.cameraOrbit = '-25deg 66deg auto';
    el.cameraTarget = 'auto auto auto';
    el.fieldOfView = 'auto';
  };

  const toggleSpin = () => {
    const el = mv();
    if (!el) return;
    el.autoRotate = !el.autoRotate;
    setSpinning(el.autoRotate);
  };

  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else el.requestFullscreen?.().catch(() => {});
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
      className="relative w-full h-full"
      style={{ background: 'radial-gradient(circle at 50% 42%, #2c343f 0%, #151a21 58%, #080a0d 100%)' }}
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

      {/*
        model-viewer is a custom element — use createElement to avoid JSX
        type errors without namespace hacks.
      */}
      <ModelViewerElement
        ref={viewerRef}
        src={src}
        alt={productName}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      />

      {/* Ko'rsatma: birinchi harakatdan keyin yo'qoladi */}
      {loaded && !touched && (
        <div className="absolute bottom-3 left-3 right-24 sm:right-auto sm:max-w-md pointer-events-none z-10">
          <span className="inline-block text-[12px] sm:text-[13px] text-white/80 bg-black/40 rounded px-3 py-1.5 leading-snug">
            {t('viewer_rotate')}
          </span>
        </div>
      )}

      {/* Boshqaruv tugmalari */}
      {loaded && (
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
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
              className="w-10 h-10 flex items-center justify-center text-white/90 hover:text-white bg-black/45 hover:bg-black/70 rounded-md transition-colors"
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
            className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${spinning ? 'text-white bg-white/25' : 'text-white/90 bg-black/45 hover:bg-black/70'}`}
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
            className="hidden sm:flex w-10 h-10 items-center justify-center text-white/90 hover:text-white bg-black/45 hover:bg-black/70 rounded-md transition-colors"
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

  // Merge forwarded ref
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === 'function') {
      ref(elRef.current);
    } else {
      (ref as React.MutableRefObject<HTMLElement | null>).current = elRef.current;
    }
  });

  // Use dangerouslySetInnerHTML trick to avoid JSX custom element types
  return (
    <div
      ref={(div) => {
        if (!div) return;
        // Only create if not already there
        if (div.querySelector('model-viewer')) return;
        const mv = document.createElement('model-viewer');
        mv.setAttribute('src', src);
        mv.setAttribute('alt', alt);
        mv.setAttribute('camera-controls', '');
        mv.setAttribute('auto-rotate', '');
        mv.setAttribute('shadow-intensity', '1.1');
        mv.setAttribute('shadow-softness', '0.9');
        // 'legacy' muhit yorug'likni yo'nalgan beradi: profil pog'onalari va burchaklar aniq ko'rinadi
        mv.setAttribute('exposure', '0.65');
        mv.setAttribute('environment-image', 'legacy');
        mv.setAttribute('camera-orbit', '-25deg 66deg auto');
        // To'liq erkin aylantirish: tepadan pastgacha, yaqin/uzoq kattalashtirish
        mv.setAttribute('min-camera-orbit', 'auto 5deg 25%');
        mv.setAttribute('max-camera-orbit', 'auto 175deg 260%');
        mv.setAttribute('orbit-sensitivity', '1.4');
        mv.setAttribute('zoom-sensitivity', '1.3');
        mv.setAttribute('touch-action', 'none');
        mv.setAttribute('auto-rotate-delay', '1500');
        mv.addEventListener('load', () => {
          // Gips rangi: ozgina kulrang oq, silliq emas — soya va qirralar yo'qolmasin
          const model = (mv as any).model;
          model?.materials?.forEach((m: any) => {
            m.pbrMetallicRoughness.setBaseColorFactor([0.92, 0.92, 0.93, 1]);
            m.pbrMetallicRoughness.setRoughnessFactor(0.75);
            m.pbrMetallicRoughness.setMetallicFactor(0);
          });
        });
        mv.setAttribute('loading', 'eager');
        mv.setAttribute('reveal', 'auto');
        Object.assign(mv.style, style);
        // attach ref
        (elRef as React.MutableRefObject<HTMLElement>).current = mv;
        div.appendChild(mv);
      }}
      style={{ width: '100%', height: '100%' }}
    />
  );
});
