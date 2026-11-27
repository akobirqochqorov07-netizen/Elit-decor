'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import ModelViewer3D from '@/components/catalog/ModelViewer3D';

export interface ShowroomProduct {
  kod: string;
  displayKod: string;
  name: string;
  dims: string;
  type: 'Karniz' | 'Bortkarniz';
  modelSrc: string;
  cutout: string;
  drawing: string;
  slug: string;
  bolim: 'karnizlar' | 'bortkarnizlar';
  desc: string;
}

export interface ShowroomHotspot {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  product: ShowroomProduct;
}

export interface ShowroomRoom {
  id: string;
  number: string;
  titleKey: string;
  descKey: string;
  image: string;
  thumb: string;
  hotspots: ShowroomHotspot[];
}

const PRODUCTS_DATA: Record<string, ShowroomProduct> = {
  'karniz-001': {
    kod: 'karniz-001',
    displayKod: 'DK-001',
    name: 'Monumental Shift Karnizi',
    dims: '400 × 400 mm',
    type: 'Karniz',
    modelSrc: '/products/karniz-001/model.glb',
    cutout: '/images/karnizlar/_cutout/karniz-001.webp',
    drawing: '/images/karnizlar/_profil/karniz-001.webp',
    slug: 'katalog-1-katta',
    bolim: 'karnizlar',
    desc: 'Monumental xonalar va hashamatli zallar uchun 400×400 mm klassik massiv ganch karniz.',
  },
  'bortkarniz-002': {
    kod: 'bortkarniz-002',
    displayKod: 'BK-002',
    name: 'Yashirin LED Bortkarniz',
    dims: '82 × 150 mm',
    type: 'Bortkarniz',
    modelSrc: '/products/bortkarniz-002/model.glb',
    cutout: '/images/bortkarnizlar/_cutout/bortkarniz-002.webp',
    drawing: '/images/bortkarnizlar/_profil/bortkarniz-002.webp',
    slug: 'bortkarnizlar-katta',
    bolim: 'bortkarnizlar',
    desc: 'Shift orti yashirin chiroq va LED lenta montaji uchun maxsus javonli arxitektura profili.',
  },
  'karniz-010': {
    kod: 'karniz-010',
    displayKod: 'DK-010',
    name: 'Klassik Relyefli Karniz',
    dims: '175 × 175 mm',
    type: 'Karniz',
    modelSrc: '/products/karniz-010/model.glb',
    cutout: '/images/karnizlar/_cutout/karniz-010.webp',
    drawing: '/images/karnizlar/_profil/karniz-010.webp',
    slug: 'katalog-2-orta-katta',
    bolim: 'karnizlar',
    desc: 'Devor va shift tutashuvida to‘liq muvozanatli, simmetrik neoklassik relyef.',
  },
  'karniz-006': {
    kod: 'karniz-006',
    displayKod: 'DK-006',
    name: 'Vertikal Nafis Karniz',
    dims: '115 × 320 mm',
    type: 'Karniz',
    modelSrc: '/products/karniz-006/model.glb',
    cutout: '/images/karnizlar/_cutout/karniz-006.webp',
    drawing: '/images/karnizlar/_profil/karniz-006.webp',
    slug: 'katalog-1-katta',
    bolim: 'karnizlar',
    desc: 'Baland shiftli saroy zallari uchun vertikal o‘lchami 320 mm bo‘lgan o‘ta nafis karniz.',
  },
  'bortkarniz-005': {
    kod: 'bortkarniz-005',
    displayKod: 'BK-005',
    name: 'Shift Qirrasi Bortkarnizi',
    dims: '91 × 121 mm',
    type: 'Bortkarniz',
    modelSrc: '/products/bortkarniz-005/model.glb',
    cutout: '/images/bortkarnizlar/_cutout/bortkarniz-005.webp',
    drawing: '/images/bortkarnizlar/_profil/bortkarniz-005.webp',
    slug: 'bortkarnizlar-orta',
    bolim: 'bortkarnizlar',
    desc: 'Ikki pog‘onali shiftlarda yumshoq yorug‘lik oqimini yaratuvchi nozik ganch profili.',
  },
  'karniz-012': {
    kod: 'karniz-012',
    displayKod: 'DK-012',
    name: 'Naqshli Hoshiya Karniz',
    dims: '140 × 203 mm',
    type: 'Karniz',
    modelSrc: '/products/karniz-012/model.glb',
    cutout: '/images/karnizlar/_cutout/karniz-012.webp',
    drawing: '/images/karnizlar/_profil/karniz-012.webp',
    slug: 'katalog-2-orta-katta',
    bolim: 'karnizlar',
    desc: 'Sharqona va Yevropa klassikasini birlashtirgan naqshinkor qirrali me’moriy detal.',
  },
  'karniz-015': {
    kod: 'karniz-015',
    displayKod: 'DK-015',
    name: 'Sokin Shift Karnizi',
    dims: '150 × 180 mm',
    type: 'Karniz',
    modelSrc: '/products/karniz-015/model.glb',
    cutout: '/images/karnizlar/_cutout/karniz-015.webp',
    drawing: '/images/karnizlar/_profil/karniz-015.webp',
    slug: 'katalog-2-orta-katta',
    bolim: 'karnizlar',
    desc: 'Zamonaviy minimalizm va qulaylikni ta’minlovchi sokin yotoqxona karnizi.',
  },
  'bortkarniz-010': {
    kod: 'bortkarniz-010',
    displayKod: 'BK-010',
    name: 'Ixcham LED Bortkarnizi',
    dims: '77 × 107 mm',
    type: 'Bortkarniz',
    modelSrc: '/products/bortkarniz-010/model.glb',
    cutout: '/images/bortkarnizlar/_cutout/bortkarniz-010.webp',
    drawing: '/images/bortkarnizlar/_profil/bortkarniz-010.webp',
    slug: 'bortkarnizlar-orta',
    bolim: 'bortkarnizlar',
    desc: 'Pastroq shiftlar uchun eng optimal, yashirin chiroq o‘rnatishga mos ixcham bortkarniz.',
  },
  'karniz-007': {
    kod: 'karniz-007',
    displayKod: 'DK-007',
    name: 'Hashamatli Keng Karniz',
    dims: '200 × 180 mm',
    type: 'Karniz',
    modelSrc: '/products/karniz-007/model.glb',
    cutout: '/images/karnizlar/_cutout/karniz-007.webp',
    drawing: '/images/karnizlar/_profil/karniz-007.webp',
    slug: 'katalog-1-katta',
    bolim: 'karnizlar',
    desc: 'Keng va to‘liq silliqlangan profil, interyerda chuqur me’moriy fazoni hosil qiladi.',
  },
  'karniz-008': {
    kod: 'karniz-008',
    displayKod: 'DK-008',
    name: 'Chuqur Relyefli Karniz',
    dims: '150 × 239 mm',
    type: 'Karniz',
    modelSrc: '/products/karniz-008/model.glb',
    cutout: '/images/karnizlar/_cutout/karniz-008.webp',
    drawing: '/images/karnizlar/_profil/karniz-008.webp',
    slug: 'katalog-1-katta',
    bolim: 'karnizlar',
    desc: 'Kamin va zal portali atrofiga mo‘ljallangan hashamatli chuqur profilli ganch bezagi.',
  },
  'bortkarniz-001': {
    kod: 'bortkarniz-001',
    displayKod: 'BK-001',
    name: 'Klassik Bortkarniz',
    dims: '84 × 150 mm',
    type: 'Bortkarniz',
    modelSrc: '/products/bortkarniz-001/model.glb',
    cutout: '/images/bortkarnizlar/_cutout/bortkarniz-001.webp',
    drawing: '/images/bortkarnizlar/_profil/bortkarniz-001.webp',
    slug: 'bortkarnizlar-katta',
    bolim: 'bortkarnizlar',
    desc: 'Shift atrofida silliq chiziqli yorug‘lik aks ettiruvchi klassik bortkarniz.',
  },
  'karniz-003': {
    kod: 'karniz-003',
    displayKod: 'DK-003',
    name: 'Me’moriy Burchak Karnizi',
    dims: '170 × 250 mm',
    type: 'Karniz',
    modelSrc: '/products/karniz-003/model.glb',
    cutout: '/images/karnizlar/_cutout/karniz-003.webp',
    drawing: '/images/karnizlar/_profil/karniz-003.webp',
    slug: 'katalog-1-katta',
    bolim: 'karnizlar',
    desc: 'Geometrik burchakli toza chiziqlar, mustahkam Samarqand ganchidan ishlangan.',
  },
};

const ROOMS_DATA: ShowroomRoom[] = [
  {
    id: 'salon',
    number: '01',
    titleKey: 'room1_title',
    descKey: 'room1_desc',
    image: '/images/galereya1/full/dekor-090.webp',
    thumb: '/images/galereya1/thumb/dekor-090.webp',
    hotspots: [
      { id: 'hs-1', x: 50, y: 13, product: PRODUCTS_DATA['karniz-001'] },
      { id: 'hs-2', x: 26, y: 22, product: PRODUCTS_DATA['bortkarniz-002'] },
      { id: 'hs-3', x: 78, y: 32, product: PRODUCTS_DATA['karniz-010'] },
    ],
  },
  {
    id: 'palace',
    number: '02',
    titleKey: 'room2_title',
    descKey: 'room2_desc',
    image: '/images/galereya1/full/dekor-097.webp',
    thumb: '/images/galereya1/thumb/dekor-097.webp',
    hotspots: [
      { id: 'hs-4', x: 38, y: 15, product: PRODUCTS_DATA['karniz-006'] },
      { id: 'hs-5', x: 68, y: 22, product: PRODUCTS_DATA['bortkarniz-005'] },
      { id: 'hs-6', x: 82, y: 28, product: PRODUCTS_DATA['karniz-012'] },
    ],
  },
  {
    id: 'bedroom',
    number: '03',
    titleKey: 'room3_title',
    descKey: 'room3_desc',
    image: '/images/galereya1/full/dekor-100.webp',
    thumb: '/images/galereya1/thumb/dekor-100.webp',
    hotspots: [
      { id: 'hs-7', x: 45, y: 14, product: PRODUCTS_DATA['karniz-015'] },
      { id: 'hs-8', x: 22, y: 24, product: PRODUCTS_DATA['bortkarniz-010'] },
      { id: 'hs-9', x: 76, y: 16, product: PRODUCTS_DATA['karniz-007'] },
    ],
  },
  {
    id: 'fireplace',
    number: '04',
    titleKey: 'room4_title',
    descKey: 'room4_desc',
    image: '/images/galereya1/full/dekor-108.webp',
    thumb: '/images/galereya1/thumb/dekor-108.webp',
    hotspots: [
      { id: 'hs-10', x: 50, y: 15, product: PRODUCTS_DATA['karniz-008'] },
      { id: 'hs-11', x: 80, y: 24, product: PRODUCTS_DATA['bortkarniz-001'] },
      { id: 'hs-12', x: 20, y: 18, product: PRODUCTS_DATA['karniz-003'] },
    ],
  },
];

export default function VirtualShowroomClient() {
  const t = useTranslations('VirtualShowroom');
  const locale = useLocale();

  const [mounted, setMounted] = useState(false);
  const [activeRoomIdx, setActiveRoomIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'room' | '3d'>('room');
  const [selectedProduct, setSelectedProduct] = useState<ShowroomProduct>(PRODUCTS_DATA['karniz-001']);
  const [activeHotspot, setActiveHotspot] = useState<ShowroomHotspot | null>(null);
  const [lighting, setLighting] = useState<'day' | 'warm'>('warm');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentRoom = ROOMS_DATA[activeRoomIdx];

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!stageRef.current) return;
    if (!document.fullscreenElement) {
      stageRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Inspect in 3D studio mode
  const openProductIn3D = (p: ShowroomProduct) => {
    setSelectedProduct(p);
    setViewMode('3d');
    setActiveHotspot(null);
  };

  return (
    <div
      ref={stageRef}
      className={`relative w-full bg-[#0E1015] text-[#ECEFF4] font-sans select-none overflow-hidden ${
        isFullscreen ? 'h-screen' : 'min-h-[calc(100vh-76px)]'
      }`}
    >
      {/* ── ARCHITECTURAL TOP HUD (Shapespark Minimalist Style) ── */}
      <header className="relative z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-[#0E1015]/95 backdrop-blur-md border-b border-white/[0.08]">
        {/* Left: Exit to Home */}
        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}`}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
          >
            <span className="text-sm font-light transition-transform group-hover:-translate-x-1">←</span>
            <span>{t('back_to_home')}</span>
          </Link>
          <span className="h-3 w-px bg-white/10 hidden sm:block" />
          <span className="text-[11px] uppercase tracking-widest text-[#C5A265] hidden sm:block font-medium">
            Elit Dekor · Virtual Showroom
          </span>
        </div>

        {/* Center: Minimalist Viewpoint / Room Selector */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/[0.06]">
          {ROOMS_DATA.map((room, idx) => {
            const active = idx === activeRoomIdx && viewMode === 'room';
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => {
                  setActiveRoomIdx(idx);
                  setViewMode('room');
                  setActiveHotspot(null);
                }}
                className={`px-3 py-1.5 rounded-full text-xs transition-all font-medium ${
                  active
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span>{room.number}</span>
                <span className="mx-1.5 opacity-40">/</span>
                <span>{t(room.titleKey)}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/[0.04] p-1 rounded-full border border-white/[0.06] text-xs">
            <button
              type="button"
              onClick={() => {
                setViewMode('room');
                setActiveHotspot(null);
              }}
              className={`px-3 py-1 rounded-full transition-all text-xs font-medium ${
                viewMode === 'room'
                  ? 'bg-[#C5A265] text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Interyer
            </button>
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1 rounded-full transition-all text-xs font-medium ${
                viewMode === '3d'
                  ? 'bg-[#C5A265] text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              3D Studiya
            </button>
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/[0.05] transition-colors hidden sm:flex items-center justify-center"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── MOBILE SCENE SWITCHER ── */}
      <div className="md:hidden flex items-center justify-start gap-1 overflow-x-auto px-4 py-2 bg-[#0E1015]/90 border-b border-white/[0.06] scrollbar-none">
        {ROOMS_DATA.map((room, idx) => {
          const active = idx === activeRoomIdx && viewMode === 'room';
          return (
            <button
              key={room.id}
              type="button"
              onClick={() => {
                setActiveRoomIdx(idx);
                setViewMode('room');
                setActiveHotspot(null);
              }}
              className={`px-3 py-1 rounded-full text-[11px] whitespace-nowrap transition-all ${
                active ? 'bg-white text-black font-medium' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {room.number} · {t(room.titleKey)}
            </button>
          );
        })}
      </div>

      {/* ── MAIN STAGE VIEWPORT ── */}
      <main className="relative w-full h-[calc(100vh-140px)] sm:h-[calc(100vh-120px)] flex items-center justify-center overflow-hidden">
        {/* ── MODE 1: ARCHITECTURAL INTERIOR SCENE ── */}
        {viewMode === 'room' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* High-Resolution Room Image with subtle tone adjustments */}
            <img
              src={currentRoom.image}
              alt={t(currentRoom.titleKey)}
              className={`w-full h-full object-cover transition-all duration-700 select-none ${
                lighting === 'warm'
                  ? 'brightness-[0.98] contrast-[1.03] sepia-[0.14]'
                  : 'brightness-100 contrast-100'
              }`}
            />

            {/* Subtle Vignette for architectural depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

            {/* ── MINIMALIST ARCHITECTURAL HOTSPOTS ── */}
            {currentRoom.hotspots.map((hs) => {
              const isSelected = activeHotspot?.id === hs.id;
              return (
                <div
                  key={hs.id}
                  style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  {/* Shapespark-Style Delicate Hotspot Button */}
                  <button
                    type="button"
                    onClick={() => setActiveHotspot(isSelected ? null : hs)}
                    className="relative group/pin p-3 outline-none"
                    aria-label={`Inspect ${hs.product.displayKod}`}
                  >
                    {/* Outer thin pulsating ring */}
                    <span className="absolute inset-1 rounded-full border border-white/40 animate-ping" />
                    {/* Inner elegant glass marker */}
                    <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/80 group-hover/pin:border-[#C5A265] group-hover/pin:scale-110 transition-all shadow-xl">
                      <span className="w-2 h-2 rounded-full bg-white group-hover/pin:bg-[#C5A265] transition-colors" />
                    </span>
                    {/* Discreet label tag */}
                    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] uppercase font-mono tracking-wider text-white/90 border border-white/10 whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none">
                      {hs.product.displayKod} · {hs.product.dims}
                    </span>
                  </button>

                  {/* Shapespark Architectural Inspection Card */}
                  {isSelected && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 sm:w-80 p-4 rounded-xl bg-[#12151C]/95 backdrop-blur-xl border border-white/15 shadow-2xl text-left z-30 animate-in fade-in duration-150">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-mono tracking-widest text-[#C5A265] uppercase">
                            {hs.product.type}
                          </span>
                          <h4 className="text-sm font-serif text-white tracking-wide">
                            {hs.product.displayKod} — {hs.product.name}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveHotspot(null)}
                          className="text-neutral-400 hover:text-white text-sm w-5 h-5 flex items-center justify-center rounded hover:bg-white/10"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex gap-3 items-center my-3 p-2 bg-black/40 rounded-lg border border-white/[0.06]">
                        <img
                          src={hs.product.cutout}
                          alt={hs.product.displayKod}
                          className="w-14 h-14 object-contain"
                        />
                        <div className="text-xs space-y-0.5">
                          <p className="text-neutral-400">O‘lchami:</p>
                          <p className="font-mono text-white font-medium">{hs.product.dims}</p>
                          <p className="text-[11px] text-emerald-400">100% Sof Samarqand ganchi</p>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-300 font-light leading-relaxed mb-3 line-clamp-2">
                        {hs.product.desc}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/[0.08]">
                        <button
                          type="button"
                          onClick={() => openProductIn3D(hs.product)}
                          className="px-3 py-2 rounded-lg bg-white text-black hover:bg-[#C5A265] text-xs font-medium tracking-wide transition-colors flex items-center justify-center gap-1.5"
                        >
                          <span>3D Tekshirish</span>
                          <span className="text-sm">⟲</span>
                        </button>
                        <Link
                          href={`/${locale}/katalog/${hs.product.bolim}/${hs.product.slug}/${hs.product.kod}`}
                          className="px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-neutral-200 text-xs font-medium text-center border border-white/10 transition-colors"
                        >
                          Katalogda ko‘rish →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Room Bottom Left Minimalist Title */}
            <div className="absolute bottom-6 left-6 z-20 pointer-events-none hidden sm:block">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#C5A265]">
                {currentRoom.number} / {t(currentRoom.titleKey)}
              </span>
              <p className="text-xs text-neutral-300 font-light mt-0.5 max-w-md drop-shadow">
                {t(currentRoom.descKey)}
              </p>
            </div>
          </div>
        )}

        {/* ── MODE 2: DELICATE 3D PRODUCT STUDIO (Turntable Stage) ── */}
        {viewMode === '3d' && (
          <div className="relative w-full h-full flex flex-col lg:flex-row items-center justify-between p-4 sm:p-8 bg-gradient-to-b from-[#12151D] to-[#0A0C10]">
            {/* Central 3D Canvas */}
            <div className="relative flex-1 w-full h-full min-h-[380px] flex items-center justify-center rounded-2xl bg-black/40 border border-white/[0.08] overflow-hidden">
              {mounted && (
                <ModelViewer3D
                  key={selectedProduct.kod}
                  src={selectedProduct.modelSrc}
                  productName={selectedProduct.name}
                />
              )}

              {/* Viewport Back Button */}
              <button
                type="button"
                onClick={() => setViewMode('room')}
                className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>←</span>
                <span>Interyerga qaytish</span>
              </button>
            </div>

            {/* Right Architectural Spec Sheet */}
            <aside className="w-full lg:w-80 lg:pl-6 pt-4 lg:pt-0 flex flex-col justify-between text-xs sm:text-sm">
              <div className="space-y-4">
                <div className="border-b border-white/[0.08] pb-3">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A265]">
                    {selectedProduct.type} · 3D Model
                  </span>
                  <h3 className="text-xl font-serif text-white mt-1">
                    {selectedProduct.displayKod}
                  </h3>
                  <p className="text-neutral-400 text-xs mt-0.5">{selectedProduct.name}</p>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-neutral-500">O‘lchami (W×H):</span>
                    <span className="text-white font-medium">{selectedProduct.dims}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-neutral-500">Material:</span>
                    <span className="text-neutral-200">100% Tabiiy ganch</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-neutral-500">Yong‘inga chidamlilik:</span>
                    <span className="text-emerald-400 font-medium">A1 sinfi</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-neutral-500">CAD formatlari:</span>
                    <span className="text-neutral-200">OBJ, GLB, DWG</span>
                  </div>
                </div>

                <p className="text-neutral-400 text-xs font-light leading-relaxed">
                  {selectedProduct.desc}
                </p>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <Link
                  href={`/${locale}/katalog/${selectedProduct.bolim}/${selectedProduct.slug}/${selectedProduct.kod}`}
                  className="w-full py-2.5 rounded-lg bg-white text-black hover:bg-[#C5A265] text-xs font-semibold text-center tracking-wide transition-colors"
                >
                  Katalogda ko‘rish →
                </Link>
                <a
                  href={`/products/${selectedProduct.kod}/downloads/DK-${selectedProduct.kod.replace('karniz-', '').replace('bortkarniz-', '')}.obj`}
                  download
                  className="w-full py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 text-xs font-medium text-center border border-white/10 transition-colors"
                >
                  ⬇ OBJ 3D modelni yuklab olish
                </a>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* ── MINIMALIST BOTTOM ARCHITECTURAL HUD ── */}
      <footer className="relative z-30 flex items-center justify-between px-4 sm:px-8 py-2.5 bg-[#0E1015]/95 backdrop-blur-md border-t border-white/[0.08] text-xs text-neutral-400">
        {/* Lighting Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-neutral-500 hidden sm:inline">
            Yoritish:
          </span>
          <button
            type="button"
            onClick={() => setLighting('warm')}
            className={`px-2.5 py-1 rounded-full text-[11px] transition-colors ${
              lighting === 'warm'
                ? 'bg-white/15 text-[#E8D39E] font-medium'
                : 'hover:text-white'
            }`}
          >
            Issiq nur (3000K)
          </button>
          <button
            type="button"
            onClick={() => setLighting('day')}
            className={`px-2.5 py-1 rounded-full text-[11px] transition-colors ${
              lighting === 'day'
                ? 'bg-white/15 text-white font-medium'
                : 'hover:text-white'
            }`}
          >
            Kunduzgi (5500K)
          </button>
        </div>

        {/* Current Stage Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Real Elit Dekor ganch obyektlari · 360° interaktiv</span>
        </div>

        {/* Quick Catalog Link */}
        <Link
          href={`/${locale}/katalog/karnizlar`}
          className="hover:text-white transition-colors text-xs font-medium flex items-center gap-1"
        >
          <span>To‘liq katalog</span>
          <span>→</span>
        </Link>
      </footer>
    </div>
  );
}
