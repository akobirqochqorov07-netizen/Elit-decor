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
    el.addEventListener('load', onLoad);
    el.addEventListener('error', onErr);
    return () => {
      el.removeEventListener('load', onLoad);
      el.removeEventListener('error', onErr);
    };
  }, []);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
        {t('viewer_error')}
      </div>
    );
  }

  return (
    <div
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
