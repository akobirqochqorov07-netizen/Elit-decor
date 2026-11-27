'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useTranslations, useLocale } from 'next-intl';

// Lazy-load ModelViewer3D with SSR false
const ModelViewer3D = dynamic(() => import('@/components/catalog/ModelViewer3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] flex flex-col items-center justify-center text-gold/80 gap-3">
      <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      <span className="text-xs uppercase tracking-widest text-gray-400">3D Model yuklanmoqda...</span>
    </div>
  ),
});

export interface Hotspot {
  id: string;
  kod: string;
  displayKod: string;
  name: string;
  dims: string;
  pos: { x: number; y: number }; // percentage 0-100
  bolim: 'karnizlar' | 'bortkarnizlar';
  slug: string;
  modelSrc: string;
  cutout: string;
  desc: string;
}

export interface ShowroomRoom {
  id: string;
  titleKey: string;
  descKey: string;
  image: string;
  thumb: string;
  hotspots: Hotspot[];
}

const ROOMS_DATA: ShowroomRoom[] = [
  {
    id: 'salon',
    titleKey: 'room1_title',
    descKey: 'room1_desc',
    image: '/images/galereya1/full/dekor-090.webp',
    thumb: '/images/galereya1/thumb/dekor-090.webp',
    hotspots: [
      {
        id: 'k-001',
        kod: 'karniz-001',
        displayKod: 'DK-001',
        name: 'Monumental Klassik Karniz',
        dims: '400 × 400 mm',
        pos: { x: 50, y: 13 },
        bolim: 'karnizlar',
        slug: 'katalog-1-katta',
        modelSrc: '/products/karniz-001/model.glb',
        cutout: '/images/karnizlar/_cutout/karniz-001.webp',
        desc: 'Hashamatli zallar uchun 400×400 mm ulkan monumental ganch karniz',
      },
      {
        id: 'bk-002',
        kod: 'bortkarniz-002',
        displayKod: 'BK-002',
        name: 'Yashirin LED Bortkarnizi',
        dims: '82 × 150 mm',
        pos: { x: 26, y: 22 },
        bolim: 'bortkarnizlar',
        slug: 'bortkarnizlar-katta',
        modelSrc: '/products/bortkarniz-002/model.glb',
        cutout: '/images/bortkarnizlar/_cutout/bortkarniz-002.webp',
        desc: 'Yashirin shift chirog‘i va LED lentasi uchun maxsus profil',
      },
      {
        id: 'k-010',
        kod: 'karniz-010',
        displayKod: 'DK-010',
        name: 'Klassik Relyefli Karniz',
        dims: '175 × 175 mm',
        pos: { x: 78, y: 32 },
        bolim: 'karnizlar',
        slug: 'katalog-2-orta-katta',
        modelSrc: '/products/karniz-010/model.glb',
        cutout: '/images/karnizlar/_cutout/karniz-010.webp',
        desc: 'Simmetrik klassik me’moriy o‘lchamli ganch bezagi',
      },
    ],
  },
  {
    id: 'palace',
    titleKey: 'room2_title',
    descKey: 'room2_desc',
    image: '/images/galereya1/full/dekor-097.webp',
    thumb: '/images/galereya1/thumb/dekor-097.webp',
    hotspots: [
      {
        id: 'k-006',
        kod: 'karniz-006',
        displayKod: 'DK-006',
        name: 'Vertikal Nafis Karniz',
        dims: '115 × 320 mm',
        pos: { x: 38, y: 15 },
        bolim: 'karnizlar',
        slug: 'katalog-1-katta',
        modelSrc: '/products/karniz-006/model.glb',
        cutout: '/images/karnizlar/_cutout/karniz-006.webp',
        desc: 'Baland shiftli saroy zallari uchun 320 mm vertikal profilli karniz',
      },
      {
        id: 'bk-005',
        kod: 'bortkarniz-005',
        displayKod: 'BK-005',
        name: 'Shift Qirrasi Bortkarnizi',
        dims: '91 × 121 mm',
        pos: { x: 68, y: 22 },
        bolim: 'bortkarnizlar',
        slug: 'bortkarnizlar-orta',
        modelSrc: '/products/bortkarniz-005/model.glb',
        cutout: '/images/bortkarnizlar/_cutout/bortkarniz-005.webp',
        desc: 'Ko‘p bosqichli shiftlarda nozik yorug‘lik akslantiruvchi profil',
      },
      {
        id: 'k-012',
        kod: 'karniz-012',
        displayKod: 'DK-012',
        name: 'Naqshli Hoshiya Karniz',
        dims: '140 × 203 mm',
        pos: { x: 82, y: 28 },
        bolim: 'karnizlar',
        slug: 'katalog-2-orta-katta',
        modelSrc: '/products/karniz-012/model.glb',
        cutout: '/images/karnizlar/_cutout/karniz-012.webp',
        desc: 'To‘lqinsimon chiziqli neoklassik ganch elementi',
      },
    ],
  },
  {
    id: 'bedroom',
    titleKey: 'room3_title',
    descKey: 'room3_desc',
    image: '/images/galereya1/full/dekor-100.webp',
    thumb: '/images/galereya1/thumb/dekor-100.webp',
    hotspots: [
      {
        id: 'k-015',
        kod: 'karniz-015',
        displayKod: 'DK-015',
        name: 'Nozik Shift Karnizi',
        dims: '150 × 180 mm',
        pos: { x: 45, y: 14 },
        bolim: 'karnizlar',
        slug: 'katalog-2-orta-katta',
        modelSrc: '/products/karniz-015/model.glb',
        cutout: '/images/karnizlar/_cutout/karniz-015.webp',
        desc: 'Yotoqxona uchun sokin, qulay va yorug‘likni yumshoq qaytaruvchi karniz',
      },
      {
        id: 'bk-010',
        kod: 'bortkarniz-010',
        displayKod: 'BK-010',
        name: 'Minimalist LED Bortkarniz',
        dims: '77 × 107 mm',
        pos: { x: 22, y: 24 },
        bolim: 'bortkarnizlar',
        slug: 'bortkarnizlar-orta',
        modelSrc: '/products/bortkarniz-010/model.glb',
        cutout: '/images/bortkarnizlar/_cutout/bortkarniz-010.webp',
        desc: 'Ixcham o‘lchamdagi yashirin chiroq profili, zamonaviy uslub',
      },
      {
        id: 'k-007',
        kod: 'karniz-007',
        displayKod: 'DK-007',
        name: 'Hashamatli Keng Karniz',
        dims: '200 × 180 mm',
        pos: { x: 76, y: 16 },
        bolim: 'karnizlar',
        slug: 'katalog-1-katta',
        modelSrc: '/products/karniz-007/model.glb',
        cutout: '/images/karnizlar/_cutout/karniz-007.webp',
        desc: 'Keng profilli, o‘ta silliq va nafis ishlangan ganch bezagi',
      },
    ],
  },
  {
    id: 'fireplace',
    titleKey: 'room4_title',
    descKey: 'room4_desc',
    image: '/images/galereya1/full/dekor-108.webp',
    thumb: '/images/galereya1/thumb/dekor-108.webp',
    hotspots: [
      {
        id: 'k-008',
        kod: 'karniz-008',
        displayKod: 'DK-008',
        name: 'Keng Relyefli Karniz',
        dims: '150 × 239 mm',
        pos: { x: 50, y: 15 },
        bolim: 'karnizlar',
        slug: 'katalog-1-katta',
        modelSrc: '/products/karniz-008/model.glb',
        cutout: '/images/karnizlar/_cutout/karniz-008.webp',
        desc: 'Kamin va zal atrofi uchun chuqur relyefli ganch karnizi',
      },
      {
        id: 'bk-001',
        kod: 'bortkarniz-001',
        displayKod: 'BK-001',
        name: 'Klassik Bortkarniz',
        dims: '84 × 150 mm',
        pos: { x: 80, y: 24 },
        bolim: 'bortkarnizlar',
        slug: 'bortkarnizlar-katta',
        modelSrc: '/products/bortkarniz-001/model.glb',
        cutout: '/images/bortkarnizlar/_cutout/bortkarniz-001.webp',
        desc: 'Devor va shiftda uzluksiz yorug‘lik chizig‘ini hosil qiluvchi bortkarniz',
      },
      {
        id: 'k-003',
        kod: 'karniz-003',
        displayKod: 'DK-003',
        name: 'Naqshinkor Klassik Karniz',
        dims: '170 × 250 mm',
        pos: { x: 20, y: 18 },
        bolim: 'karnizlar',
        slug: 'katalog-1-katta',
        modelSrc: '/products/karniz-003/model.glb',
        cutout: '/images/karnizlar/_cutout/karniz-003.webp',
        desc: 'Klassik uslubdagi me’moriy burchak karnizi',
      },
    ],
  },
];

const STUDIO_PRODUCTS = [
  {
    kod: 'karniz-001',
    displayKod: 'DK-001',
    name: 'Monumental Karniz',
    dims: '400 × 400 mm',
    type: 'Karniz',
    modelSrc: '/products/karniz-001/model.glb',
    cutout: '/images/karnizlar/_cutout/karniz-001.webp',
    slug: 'katalog-1-katta',
    bolim: 'karnizlar' as const,
  },
  {
    kod: 'karniz-006',
    displayKod: 'DK-006',
    name: 'Vertikal Nafis Karniz',
    dims: '115 × 320 mm',
    type: 'Karniz',
    modelSrc: '/products/karniz-006/model.glb',
    cutout: '/images/karnizlar/_cutout/karniz-006.webp',
    slug: 'katalog-1-katta',
    bolim: 'karnizlar' as const,
  },
  {
    kod: 'karniz-010',
    displayKod: 'DK-010',
    name: 'Klassik Karniz',
    dims: '175 × 175 mm',
    type: 'Karniz',
    modelSrc: '/products/karniz-010/model.glb',
    cutout: '/images/karnizlar/_cutout/karniz-010.webp',
    slug: 'katalog-2-orta-katta',
    bolim: 'karnizlar' as const,
  },
  {
    kod: 'bortkarniz-001',
    displayKod: 'BK-001',
    name: 'Klassik Bortkarniz',
    dims: '84 × 150 mm',
    type: 'Bortkarniz',
    modelSrc: '/products/bortkarniz-001/model.glb',
    cutout: '/images/bortkarnizlar/_cutout/bortkarniz-001.webp',
    slug: 'bortkarnizlar-katta',
    bolim: 'bortkarnizlar' as const,
  },
  {
    kod: 'bortkarniz-002',
    displayKod: 'BK-002',
    name: 'LED Bortkarniz',
    dims: '82 × 150 mm',
    type: 'Bortkarniz',
    modelSrc: '/products/bortkarniz-002/model.glb',
    cutout: '/images/bortkarnizlar/_cutout/bortkarniz-002.webp',
    slug: 'bortkarnizlar-katta',
    bolim: 'bortkarnizlar' as const,
  },
  {
    kod: 'bortkarniz-005',
    displayKod: 'BK-005',
    name: 'Shift Bortkarnizi',
    dims: '91 × 121 mm',
    type: 'Bortkarniz',
    modelSrc: '/products/bortkarniz-005/model.glb',
    cutout: '/images/bortkarnizlar/_cutout/bortkarniz-005.webp',
    slug: 'bortkarnizlar-orta',
    bolim: 'bortkarnizlar' as const,
  },
];

export default function VirtualShowroomClient() {
  const t = useTranslations('VirtualShowroom');
  const locale = useLocale();

  const [activeRoomIdx, setActiveRoomIdx] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [modalModel, setModalModel] = useState<Hotspot | null>(null);
  const [lighting, setLighting] = useState<'day' | 'warm' | 'night'>('warm');
  const [selectedStudioProduct, setSelectedStudioProduct] = useState(STUDIO_PRODUCTS[0]);

  const currentRoom = ROOMS_DATA[activeRoomIdx];

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalModel(null);
        setActiveHotspot(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0A0D12] text-white selection:bg-[#C5A265] selection:text-black">
      {/* ── STICKY LUXURY EXIT BAR (User is NEVER trapped) ── */}
      <div className="sticky top-0 z-40 bg-[#0A0D12]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 sm:py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Back to Home Button */}
          <Link
            href={`/${locale}`}
            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 hover:bg-[#C5A265]/20 border border-white/15 hover:border-[#C5A265]/60 text-white hover:text-[#E8D39E] transition-all text-xs sm:text-sm font-medium tracking-wide shadow-lg"
          >
            <span className="text-base group-hover:-translate-x-1 transition-transform">←</span>
            <span>{t('back_to_home')}</span>
          </Link>

          {/* Quick Breadcrumbs / Title */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              Elit Dekor
            </Link>
            <span>/</span>
            <span className="text-[#C5A265] font-medium">{t('hero_title')}</span>
          </div>

          {/* Catalog Shortcut */}
          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/katalog/karnizlar`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-medium transition-colors"
            >
              <span>{t('view_in_catalog')}</span>
              <span className="text-xs">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <section className="relative pt-12 pb-16 px-4 overflow-hidden border-b border-white/5">
        {/* Ambient radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#C5A265]/15 via-[#C5A265]/5 to-transparent blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A265]/10 border border-[#C5A265]/30 text-[#E8D39E] text-[11px] sm:text-xs font-semibold tracking-widest uppercase mb-5">
            <span className="w-2 h-2 rounded-full bg-[#C5A265] animate-ping" />
            {t('badge')}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight mb-4 drop-shadow-md">
            {t('hero_title')}
          </h1>

          <p className="text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto font-light leading-relaxed mb-6">
            {t('hero_desc')} <span className="text-[#E8D39E] font-medium">{t('hero_interactive')}</span>{' '}
            {t('hero_desc2')}
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-2 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A265]" />
              <strong className="text-white font-semibold">109+</strong> 3D Modellari
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A265]" />
              <strong className="text-white font-semibold">100%</strong> {t('features_natural')}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A265]" />
              <strong className="text-white font-semibold">360°</strong> {t('hotspot_instruction')}
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN INTERACTIVE SHOWROOM STAGE ── */}
      <section className="py-10 px-4 max-w-7xl mx-auto">
        {/* Room Selection Tabs */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              {t('room_select')}
            </h2>
            <span className="text-xs text-[#E8D39E] hidden sm:inline">
              ✦ {t('hotspot_instruction')}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {ROOMS_DATA.map((room, idx) => {
              const active = idx === activeRoomIdx;
              return (
                <button
                  key={room.id}
                  onClick={() => {
                    setActiveRoomIdx(idx);
                    setActiveHotspot(null);
                  }}
                  className={`group relative text-left p-2.5 sm:p-3 rounded-xl border transition-all flex items-center gap-3 overflow-hidden ${
                    active
                      ? 'bg-white/10 border-[#C5A265] shadow-lg shadow-[#C5A265]/10'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                  }`}
                >
                  <img
                    src={room.thumb}
                    alt={t(room.titleKey)}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover flex-shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs sm:text-sm font-medium truncate ${
                        active ? 'text-[#E8D39E]' : 'text-white'
                      }`}
                    >
                      {t(room.titleKey)}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">
                      {room.hotspots.length} ta ganch bezagi
                    </p>
                  </div>
                  {active && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C5A265]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Room Viewport with Interactive Pins */}
        <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl group">
          {/* Top Stage Controls Overlay */}
          <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
            {/* Room Title Badge */}
            <div className="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-white flex items-center gap-2 shadow-lg">
              <span className="text-[#C5A265]">🏛</span>
              <span>{t(currentRoom.titleKey)}</span>
            </div>

            {/* Lighting Mode Selector */}
            <div className="pointer-events-auto flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/15 p-1 rounded-lg text-xs shadow-lg">
              <button
                type="button"
                onClick={() => setLighting('day')}
                className={`px-2 py-1 rounded transition-colors ${
                  lighting === 'day'
                    ? 'bg-white/20 text-white font-medium'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ☀ {t('lighting_day')}
              </button>
              <button
                type="button"
                onClick={() => setLighting('warm')}
                className={`px-2 py-1 rounded transition-colors ${
                  lighting === 'warm'
                    ? 'bg-[#C5A265]/30 text-[#E8D39E] font-medium'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                💡 {t('lighting_warm')}
              </button>
              <button
                type="button"
                onClick={() => setLighting('night')}
                className={`px-2 py-1 rounded transition-colors ${
                  lighting === 'night'
                    ? 'bg-indigo-900/40 text-indigo-300 font-medium'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🌙 {t('lighting_night')}
              </button>
            </div>
          </div>

          {/* Main Stage Image */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[640px] overflow-hidden select-none">
            <img
              src={currentRoom.image}
              alt={t(currentRoom.titleKey)}
              className={`w-full h-full object-cover transition-all duration-700 ${
                lighting === 'warm'
                  ? 'sepia-[0.18] brightness-[0.98] contrast-[1.04]'
                  : lighting === 'night'
                  ? 'brightness-[0.72] contrast-[1.12] hue-rotate-[200deg]'
                  : 'brightness-100 contrast-100'
              }`}
            />

            {/* Subtle Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none" />

            {/* ── INTERACTIVE HOTSPOT PINS ── */}
            {currentRoom.hotspots.map((hs) => {
              const isActive = activeHotspot?.id === hs.id;
              return (
                <div
                  key={hs.id}
                  style={{ left: `${hs.pos.x}%`, top: `${hs.pos.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  {/* Pulsing Pin Button */}
                  <button
                    type="button"
                    onClick={() => setActiveHotspot(isActive ? null : hs)}
                    className="relative group/pin p-2 outline-none focus:outline-none"
                    aria-label={`Inspect ${hs.displayKod}`}
                  >
                    {/* Golden Ripple Effect */}
                    <span className="absolute inset-0 rounded-full bg-[#C5A265]/40 animate-ping" />
                    <span className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#E8D39E] to-[#9E7A3D] text-black font-bold text-xs shadow-xl shadow-black/80 border-2 border-white/90 group-hover/pin:scale-110 transition-transform">
                      ✦
                    </span>
                    {/* Tooltip Label */}
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur text-[10px] sm:text-xs text-white font-medium whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none border border-white/20">
                      {hs.displayKod} ({hs.dims})
                    </span>
                  </button>

                  {/* Hotspot Popover Card */}
                  {isActive && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-72 sm:w-80 p-4 rounded-xl bg-[#12161F]/95 backdrop-blur-xl border border-[#C5A265]/50 shadow-2xl text-left z-30 animate-in fade-in zoom-in-95 duration-200">
                      {/* Close popover */}
                      <button
                        type="button"
                        onClick={() => setActiveHotspot(null)}
                        className="absolute top-2.5 right-2.5 text-gray-400 hover:text-white text-lg w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10"
                      >
                        ×
                      </button>

                      <div className="flex gap-3 items-center mb-3">
                        <img
                          src={hs.cutout}
                          alt={hs.displayKod}
                          className="w-16 h-16 rounded-lg bg-white/5 object-contain p-1 border border-white/10"
                        />
                        <div className="min-w-0">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#C5A265]/20 text-[#E8D39E] mb-1">
                            {hs.displayKod}
                          </span>
                          <h4 className="text-sm font-semibold text-white leading-tight truncate">
                            {hs.name}
                          </h4>
                          <p className="text-xs text-gray-300 font-mono mt-0.5">{hs.dims}</p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed mb-4 line-clamp-2">
                        {hs.desc}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setModalModel(hs)}
                          className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#C5A265] to-[#B38F52] hover:brightness-110 text-black text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <span>{t('view_in_3d')}</span>
                          <span>⟲</span>
                        </button>
                        <Link
                          href={`/${locale}/katalog/${hs.bolim}/${hs.slug}/${hs.kod}`}
                          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium text-center border border-white/15 transition-colors"
                        >
                          {t('view_in_catalog')}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Stage Info Bar */}
          <div className="p-4 sm:p-5 bg-gradient-to-t from-[#0A0D12] to-[#12161F] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs text-[#E8D39E] font-medium uppercase tracking-wider">
                {t(currentRoom.titleKey)}
              </p>
              <p className="text-sm text-gray-300 font-light mt-0.5">
                {t(currentRoom.descKey)}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real o‘rnatilgan Elit Dekor obyektlari</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3D PRODUCT LABORATORY / STUDIO ── */}
      <section className="py-12 px-4 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 mb-2">
            <span>⟲</span>
            <span>360° Interaktiv Tekshiruv</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-white mb-2">
            {t('studio_title')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
            {t('studio_desc')}
          </p>
        </div>

        {/* Product selector buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {STUDIO_PRODUCTS.map((p) => {
            const isSelected = selectedStudioProduct.kod === p.kod;
            return (
              <button
                key={p.kod}
                type="button"
                onClick={() => setSelectedStudioProduct(p)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#C5A265]/20 border-[#C5A265] text-[#E8D39E] shadow-md'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <img src={p.cutout} alt={p.displayKod} className="w-5 h-5 object-contain" />
                <span>
                  {p.displayKod} ({p.dims})
                </span>
              </button>
            );
          })}
        </div>

        {/* Embedded 3D Viewer Stage */}
        <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#10141D] to-[#0A0D12] shadow-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* 3D Canvas Container */}
            <div className="lg:col-span-2 relative h-[360px] sm:h-[480px] w-full rounded-xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center">
              <ModelViewer3D
                key={selectedStudioProduct.kod}
                src={selectedStudioProduct.modelSrc}
                productName={selectedStudioProduct.name}
              />
            </div>

            {/* Product Specifications Sidebar */}
            <div className="space-y-5 lg:pl-4">
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-[#C5A265]/20 text-[#E8D39E] mb-2">
                  {selectedStudioProduct.type}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif text-white">
                  {selectedStudioProduct.displayKod}
                </h3>
                <p className="text-sm text-gray-300 mt-1">{selectedStudioProduct.name}</p>
              </div>

              <div className="space-y-3 pt-2 border-t border-white/10 text-xs sm:text-sm">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-400">Aniq o‘lchami:</span>
                  <span className="font-mono text-white font-medium">
                    {selectedStudioProduct.dims}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-400">Xom ashyo:</span>
                  <span className="text-white font-medium">{t('features_natural')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-400">Xavfsizlik:</span>
                  <span className="text-emerald-400 font-medium">{t('features_fire')}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-gray-400">Arxitektura fayllari:</span>
                  <span className="text-white font-medium">{t('features_cad')}</span>
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row gap-2.5">
                <Link
                  href={`/${locale}/katalog/${selectedStudioProduct.bolim}/${selectedStudioProduct.slug}/${selectedStudioProduct.kod}`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A265] to-[#B38F52] hover:brightness-110 text-black text-xs font-semibold text-center transition-all shadow-lg"
                >
                  {t('view_in_catalog')}
                </Link>
                <a
                  href={`/products/${selectedStudioProduct.kod}/downloads/DK-${selectedStudioProduct.kod.replace('karniz-', '').replace('bortkarniz-', '')}.obj`}
                  download
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium text-center border border-white/15 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>⬇ OBJ yuklab olish</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONSULTATION CTA SECTION ── */}
      <section className="py-14 px-4 max-w-5xl mx-auto text-center border-t border-white/10">
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[#121622] via-[#0D1017] to-black border border-[#C5A265]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A265]/10 rounded-full blur-3xl pointer-events-none" />

          <h3 className="text-2xl sm:text-3xl font-serif text-white mb-3">
            {t('consult_title')}
          </h3>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto font-light leading-relaxed mb-6">
            {t('consult_desc')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/${locale}/contacts`}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#C5A265] to-[#B38F52] hover:brightness-110 text-black font-semibold text-sm tracking-wide shadow-lg transition-all"
            >
              {t('consult_btn')}
            </Link>
            <Link
              href={`/${locale}`}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 transition-all"
            >
              {t('back_to_home')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── FULLSCREEN 3D MODEL MODAL ── */}
      {modalModel && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          {/* Top Bar with Exit */}
          <div className="w-full max-w-5xl flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-white">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#C5A265] text-black">
                {modalModel.displayKod}
              </span>
              <h3 className="text-base sm:text-lg font-serif">{modalModel.name}</h3>
              <span className="text-xs text-gray-400 hidden sm:inline">({modalModel.dims})</span>
            </div>

            <button
              type="button"
              onClick={() => setModalModel(null)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 flex items-center gap-1.5 transition-colors"
            >
              <span>{t('close_viewer')}</span>
              <span className="text-sm">✕</span>
            </button>
          </div>

          {/* Modal 3D Canvas */}
          <div className="relative w-full max-w-5xl h-[65vh] sm:h-[72vh] rounded-2xl bg-gradient-to-b from-[#141824] to-[#0A0D12] border border-white/15 overflow-hidden">
            <ModelViewer3D
              src={modalModel.modelSrc}
              productName={modalModel.name}
            />
          </div>

          {/* Bottom Action Footer */}
          <div className="w-full max-w-5xl pt-3 flex items-center justify-between text-xs text-gray-400">
            <span>Sichqoncha yoki barmog‘ingiz bilan 360° erkin aylantiring</span>
            <Link
              href={`/${locale}/katalog/${modalModel.bolim}/${modalModel.slug}/${modalModel.kod}`}
              className="text-[#E8D39E] hover:underline font-medium"
            >
              {t('view_in_catalog')} →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
