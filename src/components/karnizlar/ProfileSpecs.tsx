'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import profiles from '@/data/karniz-profil.json';
import { GYPSUM_DENSITY_KG_M3, MATERIAL_NAME, MIN_ORDER_PM } from '@/data/karniz-config';

interface Profile {
  w: number; // chuqurlik (shift bo'ylab), mm
  h: number; // balandlik (devor bo'ylab), mm
  area: number; // kesim yuzasi, mm²
  pts: number[][];
}

const NAVY = '#152f40';
const data = profiles as unknown as Record<string, Profile>;

/** Profil kesimi chizmasi (shtrixli) + o'lchamlar + xususiyatlar jadvali — dikart'dagidek, lekin o'zimizning uslubda. */
export default function ProfileSpecs({ kod }: { kod: string }) {
  const t = useTranslations('ProductPage');
  const p = data[kod];
  if (!p) return null;

  // Chizma o'lchamlari
  const boxW = 300;
  const boxH = 250;
  const s = Math.min(boxW / p.w, boxH / p.h);
  const L = 52; // chap chegara (balandlik o'lchami uchun)
  const T = 46; // yuqori chegara (chuqurlik o'lchami uchun)
  const dw = p.w * s;
  const dh = p.h * s;
  const vbW = L + dw + 36;
  const vbH = T + dh + 24;
  const points = p.pts.map(([x, y]) => `${(L + x * s).toFixed(1)},${(T + y * s).toFixed(1)}`).join(' ');
  const id = kod.replace(/[^a-z0-9]/gi, '');

  const weight = (p.area * 1e-6 * GYPSUM_DENSITY_KG_M3).toFixed(2);

  const rows: { label: string; value: string }[] = [];
  if (MIN_ORDER_PM !== null) rows.push({ label: t('tech_min_order'), value: String(MIN_ORDER_PM) });
  rows.push(
    { label: t('tech_height'), value: String(Math.round(p.h)) },
    { label: t('tech_depth'), value: String(Math.round(p.w)) },
    { label: t('tech_material'), value: MATERIAL_NAME },
    { label: t('tech_weight'), value: `≈ ${weight}` }
  );

  return (
    <section className="detail-specs mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200" aria-label={t('tech_title')}>
      <h2 className="font-sans text-xl sm:text-2xl font-bold text-gray-900 mb-5">{t('tech_title')}</h2>
      <div className="grid md:grid-cols-2 gap-5 md:gap-8 items-center">
        {/* Chizma */}
        <div className="rounded-xl flex items-center justify-center py-6 px-3" style={{ backgroundColor: '#f6f1e3' }}>
          <svg
            viewBox={`0 0 ${vbW.toFixed(0)} ${vbH.toFixed(0)}`}
            style={{ width: vbW, maxWidth: '100%', height: 'auto' }}
            role="img"
            aria-label={`${t('tech_drawing')} ${kod}`}
          >
            <defs>
              <pattern id={`h-${id}`} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke={NAVY} strokeWidth="1" opacity="0.42" />
              </pattern>
              <marker id={`a-${id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 1 10 5 0 9Z" fill={NAVY} />
              </marker>
            </defs>

            {/* Profil */}
            <polygon points={points} fill={`url(#h-${id})`} stroke={NAVY} strokeWidth="2.2" strokeLinejoin="round" />

            {/* Yuqori o'lcham: chuqurlik */}
            <line x1={L} y1={T - 26} x2={L} y2={T - 4} stroke={NAVY} strokeWidth="1" />
            <line x1={L + dw} y1={T - 26} x2={L + dw} y2={T - 4} stroke={NAVY} strokeWidth="1" />
            <line x1={L} y1={T - 18} x2={L + dw} y2={T - 18} stroke={NAVY} strokeWidth="1.2" markerStart={`url(#a-${id})`} markerEnd={`url(#a-${id})`} />
            <text x={L + dw / 2} y={T - 24} textAnchor="middle" fontSize="15" fontWeight="700" fill={NAVY} fontFamily="Arial, sans-serif">
              {Math.round(p.w)}
            </text>

            {/* Chap o'lcham: balandlik */}
            <line x1={L - 28} y1={T} x2={L - 4} y2={T} stroke={NAVY} strokeWidth="1" />
            <line x1={L - 28} y1={T + dh} x2={L - 4} y2={T + dh} stroke={NAVY} strokeWidth="1" />
            <line x1={L - 20} y1={T} x2={L - 20} y2={T + dh} stroke={NAVY} strokeWidth="1.2" markerStart={`url(#a-${id})`} markerEnd={`url(#a-${id})`} />
            <text
              transform={`translate(${L - 26},${T + dh / 2}) rotate(-90)`}
              textAnchor="middle"
              fontSize="15"
              fontWeight="700"
              fill={NAVY}
              fontFamily="Arial, sans-serif"
            >
              {Math.round(p.h)}
            </text>
          </svg>
        </div>

        {/* Jadval */}
        <div className="flex flex-col text-[15px] sm:text-base overflow-hidden rounded-xl border border-gray-200">
          {rows.map((r, i) => (
            <div
              key={r.label}
              className="grid grid-cols-[1fr_auto] gap-4 px-4 sm:px-5 py-3.5"
              style={{
                backgroundColor: i === 0 && MIN_ORDER_PM !== null ? NAVY : i % 2 === 0 ? '#f6f1e3' : '#fbf8ef',
                color: i === 0 && MIN_ORDER_PM !== null ? '#fff' : '#1f2937',
              }}
            >
              <span>{r.label}</span>
              <span className="font-semibold tabular-nums">{r.value}</span>
            </div>
          ))}
          <div className="px-4 sm:px-5 py-3 text-[13px] sm:text-sm text-white/90" style={{ backgroundColor: NAVY }}>
            {t('tech_note')}
          </div>
        </div>
      </div>
    </section>
  );
}
