'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import profiles from '@/data/karniz-profil.json';
import { MATERIAL_NAME, MIN_ORDER_PM } from '@/data/karniz-config';

interface Profile {
  w: number; // chuqurlik (shift bo'ylab), mm
  h: number; // balandlik (devor bo'ylab), mm
}

const NAVY = '#152f40';
const DRAWING_BG = '#fef6ee'; // dizayner chizmalarining fon rangi
const data = profiles as unknown as Record<string, Profile>;

/** Texnik xususiyatlar: dizayner chizgan profil kesimi + o'lchamlar jadvali. */
export default function ProfileSpecs({ kod }: { kod: string }) {
  const t = useTranslations('ProductPage');
  const p = data[kod];
  if (!p) return null;

  const rows: { label: string; value: string }[] = [];
  if (MIN_ORDER_PM !== null) rows.push({ label: t('tech_min_order'), value: String(MIN_ORDER_PM) });
  rows.push(
    { label: t('tech_height'), value: String(p.h) },
    { label: t('tech_depth'), value: String(p.w) },
    { label: t('tech_material'), value: MATERIAL_NAME }
  );

  return (
    <section className="detail-specs mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200" aria-label={t('tech_title')}>
      <h2 className="font-sans text-xl sm:text-2xl font-bold text-gray-900 mb-5">{t('tech_title')}</h2>
      <div className="grid md:grid-cols-2 gap-5 md:gap-8 items-center">
        {/* Chizma */}
        <div className="rounded-xl flex items-center justify-center overflow-hidden" style={{ backgroundColor: DRAWING_BG }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/karnizlar/_profil/${kod}.webp`}
            alt={`${t('tech_drawing')} ${kod}`}
            className="block w-auto max-w-full h-auto max-h-[420px]"
            loading="lazy"
          />
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
        </div>
      </div>
    </section>
  );
}
