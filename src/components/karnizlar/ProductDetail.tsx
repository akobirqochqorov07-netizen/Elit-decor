'use client';
/**
 * ProductDetail — karnizlar va bortkarnizlar uchun umumiy mahsulot sahifasi.
 * Route: /katalog/<bolim>/[slug]/[kod]/
 *
 * 3 ustunli layout:
 * [Galereya] | [Ma'lumot paneli #f5efe4] | [Buyurtma formasi]
 */

import { useState, useEffect, Suspense } from 'react';
import { Link } from '@/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderRequestForm from '@/components/cart/OrderRequestForm';
import { useCart } from '@/context/CartContext';
import { useDrawer } from '@/context/DrawerContext';
import { useTranslations, useLocale } from 'next-intl';
import {
    getKarnizByKod,
    getKatalogBySlug,
    getPrevNextInKatalog,
    formatOlcham,
    getDownloadUrl,
    getModel3dUrl,
    getModel3dOrbit,
    getGallerySlides,
    getBolimNomi,
    getKatalogNomi,
    type Bolim,
} from '@/data/karnizlar';

import ImageLightbox from '@/components/karnizlar/ImageLightbox';
import ProfileSpecs from '@/components/karnizlar/ProfileSpecs';
import FeatureIcon, { type FeatureIconName } from '@/components/karnizlar/FeatureIcons';

const ModelViewer3D = dynamic(() => import('@/components/catalog/ModelViewer3D'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            3D yuklanmoqda...
        </div>
    ),
});

// ─── Galereya komponenti ─────────────────────────────────────────────────────

/** Yuqori-chapdan yumshoq studiya yorug'ligi + o'ngga qarab tabiiy so'nish (Iliq bej / ohaktosh) */
const BEIGE_STAGE_BG = [
    'radial-gradient(ellipse 80% 90% at 0% 0%, rgba(255,252,246,0.95) 0%, rgba(255,250,242,0.55) 30%, rgba(255,250,242,0) 65%)',
    'radial-gradient(ellipse 75% 95% at 100% 100%, rgba(112,86,56,0.24) 0%, rgba(112,86,56,0) 70%)',
    'linear-gradient(118deg, #f0e7d9 0%, #e5d8c4 46%, #d5c3a8 100%)',
].join(', ');

/** Gips karnizga real chuqurlik: yorug'lik yuqori-chapdan → soya pastki-o'ngga */
const BEIGE_PRODUCT_SHADOW =
    'drop-shadow(12px 16px 18px rgba(92,68,40,0.24)) drop-shadow(3px 4px 4px rgba(92,68,40,0.18))';

/** Katta ko'rinish (lightbox) uchun — kattaroq hajm soyasi */
const BEIGE_LIGHTBOX_SHADOW =
    'drop-shadow(26px 34px 38px rgba(92,68,40,0.24)) drop-shadow(6px 8px 8px rgba(92,68,40,0.18))';

const BEIGE_THUMB_BG = 'linear-gradient(135deg, #f2e9dc 0%, #e3d4be 100%)';

/** Katta ko'rinish, 1-rasm: to'liq ekran professional 3D studiya (yaxlit, chiziq/bo'linishsiz) */
const NAVY_STAGE_BG = [
    'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(42, 62, 82, 0.65) 0%, rgba(22, 34, 46, 0.48) 45%, rgba(10, 16, 23, 0.90) 75%, rgba(5, 8, 12, 0.99) 100%)',
    'linear-gradient(180deg, #101822 0%, #0a0f16 50%, #05080c 100%)',
].join(', ');

const NAVY_SHADOW =
    'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.70)) drop-shadow(0 18px 32px rgba(0, 0, 0, 0.60)) drop-shadow(0 45px 80px rgba(0, 0, 0, 0.50))';

/** Bej fondagi tugmalar uchun iliq, yarim shaffof doiracha */
const BEIGE_BTN: React.CSSProperties = {
    color: '#4a3d2e',
    background: 'rgba(255,252,247,0.78)',
    border: '1px solid rgba(160,135,100,0.35)',
    boxShadow: '0 2px 8px rgba(90,65,35,0.14)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
};

function KarnizGallery({
    slides,
    nomi,
    kod,
}: {
    slides: { thumb: string; full: string }[];
    nomi: string;
    kod?: string;
}) {
    const [active, setActive] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    // 2-rasm uchun har doim shaffof cutout
    const cutoutSrc = kod === 'karniz-001' ? '/images/karnizlar/_bej/karniz-001.webp' : slides[0].full;
    const rasms = slides.map((s, i) => (i === 1 ? cutoutSrc : s.thumb));
    const beige = active === 1;

    return (
        <div
            className="flex flex-col rounded-sm overflow-hidden transition-colors duration-300"
            style={{ backgroundColor: '#152f40' }}
        >
            {/* Asosiy rasm */}
            <div
                className="relative w-full flex items-center justify-center transition-colors duration-300"
                style={
                    beige
                        ? { height: '307px', background: BEIGE_STAGE_BG, boxShadow: 'inset 0 0 70px rgba(110,84,52,0.10)' }
                        : { height: '307px', backgroundColor: '#152f40' }
                }
            >
                {/* Kattalashtirish belgisi */}
                <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className={
                        beige
                            ? 'absolute bottom-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full transition-all hover:scale-105'
                            : 'absolute bottom-3 right-3 z-10 w-9 h-9 flex items-center justify-center text-white/90 bg-black/35 hover:bg-black/55 rounded-full transition-colors'
                    }
                    style={beige ? BEIGE_BTN : undefined}
                    aria-label="Kattalashtirish"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                        <circle cx="11" cy="11" r="6.5" />
                        <path d="m16 16 4.5 4.5M8.5 11h5M11 8.5v5" />
                    </svg>
                </button>

                {/* Tilla yurak */}
                <button
                    className={
                        beige
                            ? 'absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center text-xl leading-none transition-all hover:scale-105'
                            : 'absolute top-3 right-3 z-10 text-2xl leading-none'
                    }
                    style={beige ? { ...BEIGE_BTN, color: '#b08a4f' } : { color: '#c9a46a' }}
                    aria-label="Sevimlilarga qo'shish"
                >
                    ♡
                </button>

                {/* Chap strelka */}
                {rasms.length > 1 && (
                    <button
                        onClick={() => setActive((i) => (i - 1 + rasms.length) % rasms.length)}
                        className={
                            beige
                                ? 'absolute left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105'
                                : 'absolute left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors hover:bg-white/20'
                        }
                        style={beige ? BEIGE_BTN : { border: '1px solid rgba(255,255,255,0.4)' }}
                        aria-label="Oldingi rasm"
                    >
                        ‹
                    </button>
                )}

                <div
                    style={{ width: beige ? '82%' : '85%', height: '260px', position: 'relative', cursor: 'zoom-in' }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${nomi} — katta ko'rish`}
                    onClick={() => setLightboxOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setLightboxOpen(true);
                        }
                    }}
                >
                    <Image
                        src={rasms[active]}
                        alt={`${nomi} — ${active + 1}`}
                        fill
                        style={
                            beige
                                ? { objectFit: 'contain', imageRendering: 'auto', filter: BEIGE_PRODUCT_SHADOW }
                                : { objectFit: 'contain', imageRendering: 'auto' }
                        }
                        sizes="(max-width: 767px) 100vw, 900px"
                        quality={100}
                        priority
                    />
                </div>

                {/* O'ng strelka */}
                {rasms.length > 1 && (
                    <button
                        onClick={() => setActive((i) => (i + 1) % rasms.length)}
                        className={
                            beige
                                ? 'absolute right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105'
                                : 'absolute right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors hover:bg-white/20'
                        }
                        style={beige ? BEIGE_BTN : { border: '1px solid rgba(255,255,255,0.4)' }}
                        aria-label="Keyingi rasm"
                    >
                        ›
                    </button>
                )}
            </div>

            {/* Miniatyuralar (pastki qism doimo to'q ko'k #152f40) */}
            {rasms.length > 1 && (
            <div className="flex gap-2 px-3 pb-3 pt-2" style={{ backgroundColor: '#152f40' }}>
                {rasms.map((src, i) => {
                    const isThumbBeige = i === 1;
                    return (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className="relative flex-shrink-0 transition-all rounded-sm overflow-hidden"
                            style={{
                                width: '80px',
                                height: '60px',
                                ...(isThumbBeige ? { background: BEIGE_THUMB_BG } : { backgroundColor: '#152f40' }),
                                border: i === active ? '2px solid var(--ed-green)' : '2px solid transparent',
                            }}
                            aria-label={`Rasm ${i + 1}`}
                        >
                            <Image
                                src={src}
                                alt={`${nomi} ${i + 1}`}
                                fill
                                style={{
                                    objectFit: 'contain',
                                    padding: isThumbBeige ? '8px' : '4px',
                                    ...(isThumbBeige ? { filter: 'drop-shadow(2px 3px 3px rgba(92,68,40,0.25))' } : {}),
                                }}
                                sizes="80px"
                            />
                        </button>
                    );
                })}
            </div>
            )}

            {lightboxOpen && (
                <ImageLightbox
                    slides={slides.map((sl, i) =>
                        i === 1
                            ? {
                                  src: cutoutSrc,
                                  alt: nomi,
                                  background: BEIGE_STAGE_BG,
                                  imgFilter: BEIGE_LIGHTBOX_SHADOW,
                                  theme: 'light' as const,
                              }
                            : {
                                  src: sl.full,
                                  alt: nomi,
                                  background: NAVY_STAGE_BG,
                                  imgFilter: NAVY_SHADOW,
                                  theme: 'dark' as const,
                              }
                    )}
                    startIndex={active}
                    onClose={() => setLightboxOpen(false)}
                />
            )}
        </div>
    );
}

// ─── Ma'lumot paneli ─────────────────────────────────────────────────────────

function InfoPanel({
    nomi,
    kod,
    katalogNomi,
    turi,
    narx,
    olcham,
    material,
    balandlik,
    kenglik,
    ogirlik,
}: {
    nomi: string;
    kod: string;
    katalogNomi: string;
    turi: string;
    narx: number | null;
    olcham: string;
    material: string;
    balandlik: number | null;
    kenglik: number | null;
    ogirlik: number | null;
}) {
    const t = useTranslations('ProductDetail');
    const locale = useLocale();

    const icons: { id: FeatureIconName; label: string }[] = [
        { id: 'eco', label: t('icon_eco') },
        { id: 'fire', label: t('icon_fire') },
        { id: 'paint', label: t('icon_paint') },
        { id: 'care', label: t('icon_care') },
        { id: 'time', label: t('icon_time') },
    ];

    const numLocale = locale === 'uz' ? 'uz-UZ' : locale === 'ru' ? 'ru-RU' : 'en-US';

    return (
        <div
            className="flex flex-col gap-4 h-full"
            style={{ backgroundColor: '#f5efe4', padding: '30px', minHeight: '307px' }}
        >
            {/* 5 ta ikonka qatori */}
            <div className="flex gap-2 flex-wrap">
                {icons.map((ic) => (
                    <div
                        key={ic.id}
                        className="flex flex-col items-center gap-1"
                        style={{ width: '42px' }}
                        title={ic.label}
                    >
                        <div
                            className="flex items-center justify-center"
                            style={{
                                width: '42px',
                                height: '42px',
                                border: '2px solid transparent',
                                borderRadius: '10px',
                                background: 'linear-gradient(#fff, #fff) padding-box, var(--ed-green-grad) border-box',
                            }}
                        >
                            <FeatureIcon name={ic.id} size={26} />
                        </div>
                        <span className="text-[10px] text-gray-500 text-center leading-tight">{ic.label}</span>
                    </div>
                ))}
            </div>

            {/* Xususiyatlar ro'yxati */}
            <ul className="flex flex-col gap-1 text-sm text-gray-700">
                <li>
                    <span className="font-semibold">{t('spec_material')}</span> {material}
                </li>
                {olcham !== '—' && (
                    <li>
                        <span className="font-semibold">{t('spec_dimensions')}</span> {olcham}
                    </li>
                )}
                <li>
                    <span className="font-semibold">{t('spec_catalog')}</span> {katalogNomi}
                </li>
            </ul>

            {/* Qisqa tavsif */}
            <p className="text-sm text-gray-600 leading-relaxed flex-1">
                {t('desc_template', {
                    nomi,
                    kod,
                    turi,
                    balandlik: balandlik ? t('height_info', { h: balandlik }) : '',
                })}
            </p>

            {/* Narx */}
            <div className="mt-auto pt-3 border-t border-[#e0d5c5]">
                <span className="text-sm text-gray-500">{t('price_label')}</span>{' '}
                <span className="font-bold" style={{ fontSize: '28px', color: '#152f40', lineHeight: 1 }}>
                    {narx ? `${narx.toLocaleString(numLocale)}` : <span className="text-lg font-medium text-gray-500">{t('price_on_request')}</span>}
                </span>
                {narx && <span className="text-sm text-gray-500 ml-1">{t('currency_pm')}</span>}
            </div>
        </div>
    );
}

// ─── Buyurtma ustuni ─────────────────────────────────────────────────────────

function OrderColumn({ item }: { item: ReturnType<typeof getKarnizByKod> }) {
    const t = useTranslations('ProductDetail');
    const locale = useLocale();
    const bolimNomi = item ? getBolimNomi(item.bolim, locale) : { kop: '', birlik: '' };
    const katalogNomi = item ? getKatalogNomi(item.katalog_slug, item.katalog_nomi, locale) : '';
    const { addItem, items } = useCart();
    const { openDrawer } = useDrawer();
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);

    if (!item) return null;

    const inCart = items.some((i) => i.sku === item.kod);

    const handleAddCart = () => {
        addItem({
            id: item.kod,
            title: `${item.korsatiladigan_kod} — ${katalogNomi}`,
            price: item.narx_pm,
            quantity: qty,
            imgSrc: item.rasm_kok,
            unit: 'p.m.',
            sku: item.kod,
            katalog: item.katalog_slug,
            olcham: formatOlcham(item.balandlik_mm, item.kenglik_mm),
        });
        setAdded(true);
        openDrawer();
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="order-col flex flex-col gap-4" style={{ minHeight: '307px' }}>
            {/* Savatga qo'shish bloği */}
            <div className="order-actions flex flex-col gap-3">
                {/* Miqdor boshqaruvi */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        {t('qty_label')}
                    </label>
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden w-40">
                        <button
                            onClick={() => setQty((v) => Math.max(1, v - 1))}
                            className="w-10 h-10 shrink-0 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg font-bold"
                        >
                            −
                        </button>
                        <input
                            type="number"
                            min={1}
                            value={qty}
                            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                            className="flex-1 min-w-0 w-full h-10 text-center text-sm font-semibold outline-none border-x border-gray-300"
                        />
                        <button
                            onClick={() => setQty((v) => v + 1)}
                            className="w-10 h-10 shrink-0 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg font-bold"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Savatga qo'shish tugmasi */}
                <button
                    onClick={handleAddCart}
                    className="w-full flex items-center justify-center gap-2 py-3 font-bold text-sm transition-all"
                    style={{
                        border: '2px solid var(--ed-green)',
                        color: added || inCart ? 'white' : 'var(--ed-green)',
                        background: added || inCart ? 'var(--ed-green-grad)' : 'transparent',
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    {added ? t('added_toast') : inCart ? t('in_cart') : t('add_to_cart')}
                </button>
                {getModel3dUrl(item.kod) && (
                    <View3DButton kod={item.kod} nomi={`${bolimNomi.birlik} ${item.korsatiladigan_kod}`} />
                )}
            </div>

            <div className="order-form flex flex-col gap-4">
                <hr className="border-gray-200" />
                <div>
                    <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                        {t('request_calc')}
                    </p>
                    <div
                        className="border border-gray-300 rounded p-4"
                        style={{ borderColor: '#333' }}
                    >
                        <OrderRequestForm
                            variant="standalone"
                            singleItem={{
                                kod: item.kod,
                                nomi: `${item.korsatiladigan_kod} — ${katalogNomi}`,
                                miqdor: qty,
                                katalog: item.katalog_slug,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Downloads bloki ─────────────────────────────────────────────────────────

const DOWNLOAD_FORMATS: Array<{
    ext: string;
    color: string;
}> = [
    { ext: '3ds', color: '#6d28d9' },
    { ext: 'max', color: '#c2410c' },
    { ext: 'dwg', color: '#0369a1' },
    { ext: 'obj', color: '#15803d' },
    { ext: 'fbx', color: '#a16207' },
    { ext: 'stl', color: '#0f766e' },
];

function DownloadsBlock({ kod }: { kod: string }) {
    const t = useTranslations('ProductDetail');
    const available = DOWNLOAD_FORMATS.filter(({ ext }) => getDownloadUrl(kod, ext));
    if (available.length === 0) return null;
    return (
        <div className="detail-downloads mt-10 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-5">{t('downloads_title')}</h3>
            <div className="flex flex-wrap gap-6">
                {available.map(({ ext, color }) => {
                    const href = getDownloadUrl(kod, ext);
                    const inner = (
                        <>
                            <span
                                className="flex items-center justify-center text-white text-[11px] font-bold uppercase tracking-wide"
                                style={{
                                    width: '52px',
                                    height: '52px',
                                    backgroundColor: href ? color : '#9ca3af',
                                    borderRadius: '50%',
                                }}
                            >
                                {ext}
                            </span>
                            <span className="text-[11px] text-center text-gray-500 leading-tight max-w-[88px]">
                                {href ? t('download_model') : t('coming_soon')}
                            </span>
                        </>
                    );
                    if (!href) {
                        return (
                            <div key={ext} className="flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
                                {inner}
                            </div>
                        );
                    }
                    return (
                        <a
                            key={ext}
                            href={href}
                            download
                            className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
                            title={t('download_title_fmt', { ext: ext.toUpperCase() })}
                        >
                            {inner}
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

function View3DButton({ kod, nomi }: { kod: string; nomi: string }) {
    const t = useTranslations('ProductDetail');
    const [open, setOpen] = useState(false);
    const src = getModel3dUrl(kod);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKey);
        };
    }, [open]);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="group relative w-full overflow-hidden"
            >
                <span
                    className="flex items-center gap-3 px-5 py-3.5 text-white font-semibold"
                    style={{ backgroundColor: '#152f40' }}
                >
                    <span
                        className="flex items-center justify-center shrink-0"
                        style={{
                            width: 44,
                            height: 44,
                            background: 'var(--ed-green-grad)',
                            transform: 'rotate(12deg)',
                        }}
                    >
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#152f40" strokeWidth="1.8">
                            <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
                            <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
                        </svg>
                    </span>
                    <span className="text-left leading-tight">
                        <span className="block text-lg">{t('view_3d')}</span>
                        <span className="block text-xs font-normal text-white/70">
                            {src ? t('view_3d_sub') : t('view_3d_soon')}
                        </span>
                    </span>
                </span>
            </button>

            {open && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
                    <div className="relative w-full max-w-5xl h-[84vh] sm:h-[80vh] flex flex-col" style={{ backgroundColor: '#0e1116' }}>
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                            <p className="font-medium text-white">{nomi} — 3D</p>
                            <button type="button" onClick={() => setOpen(false)} className="text-white/70 hover:text-white text-2xl leading-none w-10 h-10" aria-label={t('close')}>
                                ×
                            </button>
                        </div>
                        <div className="flex-1 min-h-0">
                            {src ? (
                                <ModelViewer3D src={src} productName={nomi} cameraOrbit={getModel3dOrbit(kod)} />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400 text-sm px-6 text-center">
                                    {t('view_3d_empty')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// ─── Main page ───────────────────────────────────────────────────────────────

function KarnizDetailPageInner({ slug, kod, bolim }: { slug: string; kod: string; bolim: Bolim }) {
    const t = useTranslations('ProductDetail');
    const locale = useLocale();
    const bolimNomi = getBolimNomi(bolim, locale);
    const found = getKarnizByKod(kod);
    const item = found && found.bolim === bolim ? found : undefined;
    const katalog = getKatalogBySlug(slug);
    const katalogNomi = katalog ? getKatalogNomi(katalog.slug, katalog.nomi, locale) : '';
    const base = `/katalog/${bolim}`;
    const { prev, next } = getPrevNextInKatalog(slug, kod);

    if (!item || !katalog) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl text-gray-700 mb-4">{t('not_found')}</h1>
                        <Link href={`${base}/${slug}/`} className="text-[color:var(--ed-green)] underline">
                            {t('back_to_catalog')}
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const slides = getGallerySlides(item);
    const olcham = formatOlcham(item.balandlik_mm, item.kenglik_mm);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-1">
                <div className="mx-auto px-4 sm:px-6 py-5" style={{ maxWidth: '1200px' }}>

                    {/* Breadcrumb + prev/next nav */}
                    <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                        <nav className="flex flex-wrap items-center text-base" style={{ color: '#333' }}>
                            <Link href="/" className="inline-block py-2 hover:underline">{t('breadcrumb_home')}</Link>
                            <span className="mx-1 text-gray-400">/</span>
                            <Link href="/catalog/" className="inline-block py-2 hover:underline">{t('breadcrumb_catalog')}</Link>
                            <span className="mx-1 text-gray-400">/</span>
                            <Link href={`${base}/`} className="inline-block py-2 hover:underline">{bolimNomi.kop}</Link>
                            <span className="mx-1 text-gray-400">/</span>
                            <Link href={`${base}/${slug}/`} className="inline-block py-2 hover:underline">
                                {katalogNomi}
                            </Link>
                            <span className="mx-1 text-gray-400">/</span>
                            <span>{item.korsatiladigan_kod}</span>
                        </nav>

                        {/* Prev / Next chevrons */}
                        <div className="flex items-center gap-2">
                            {prev ? (
                                <Link
                                    href={`${base}/${prev.katalog_slug}/${prev.kod}/`}
                                    className="flex items-center gap-1 font-bold text-sm py-2 px-1 transition-colors hover:opacity-80"
                                    style={{ color: 'var(--ed-green)' }}
                                    title={prev.korsatiladigan_kod}
                                >
                                    ‹ {prev.korsatiladigan_kod}
                                </Link>
                            ) : (
                                <span className="text-gray-300 text-sm">‹</span>
                            )}
                            <span className="text-gray-300">|</span>
                            {next ? (
                                <Link
                                    href={`${base}/${next.katalog_slug}/${next.kod}/`}
                                    className="flex items-center gap-1 font-bold text-sm py-2 px-1 transition-colors hover:opacity-80"
                                    style={{ color: 'var(--ed-green)' }}
                                    title={next.korsatiladigan_kod}
                                >
                                    {next.korsatiladigan_kod} ›
                                </Link>
                            ) : (
                                <span className="text-gray-300 text-sm">›</span>
                            )}
                        </div>
                    </div>

                    {/* H1 */}
                    <h1 className="mb-6" style={{ fontSize: '32px', fontWeight: 400, color: '#333', lineHeight: 1.2 }}>
                        {bolimNomi.birlik} {item.korsatiladigan_kod}
                        {olcham !== '—' ? `, ${olcham}` : ''}
                    </h1>

                    {/* 3 ustunli asosiy blok */}
                    <div className="detail-grid grid gap-6">
                        {/* 1. Galereya */}
                        <KarnizGallery slides={slides} nomi={item.korsatiladigan_kod} kod={item.kod} />

                        {/* 2. Ma'lumot paneli */}
                        <InfoPanel
                            nomi={`${bolimNomi.birlik} ${item.korsatiladigan_kod}`}
                            kod={item.korsatiladigan_kod}
                            katalogNomi={katalogNomi}
                            turi={bolimNomi.birlik.toLowerCase()}
                            narx={item.narx_pm}
                            olcham={olcham}
                            material={item.material}
                            balandlik={item.balandlik_mm}
                            kenglik={item.kenglik_mm}
                            ogirlik={item.ogirlik_kg}
                        />

                        {/* 3. Buyurtma */}
                        <OrderColumn item={item} />

                        {/* 4. Texnik xususiyatlar: profil chizmasi va jadval */}
                        <ProfileSpecs kod={item.kod} />

                        <DownloadsBlock kod={item.kod} />
                    </div>

                    <RelatedProducts currentKod={item.kod} catalogSlug={slug} />

                </div>
            </main>

            {/* Floating chat button */}
            <ChatFloating />
            <BackToTop />
            <CookieBanner />

            <Footer />

            <style>{`
        .detail-grid { grid-template-columns: 1fr 1fr 1fr; }
        .karniz-grid {
          grid-template-columns: repeat(4, 1fr);
          column-gap: 14px;
          row-gap: 40px;
        }
        @media (max-width: 1023px) {
          .detail-grid { grid-template-columns: 1fr 1fr; }
          .karniz-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .detail-downloads { grid-column: 1 / -1; }
        .detail-specs { grid-column: 1 / -1; }
        @media (max-width: 767px) {
          .detail-grid { grid-template-columns: 1fr; }
          .karniz-grid { grid-template-columns: 1fr; }
          /* Telefon: rasm → ma'lumot → savat → yuklab olish → buyurtma formasi */
          .order-col { display: contents; }
          .detail-grid > :nth-child(1) { order: 1; }
          .detail-grid > :nth-child(2) { order: 2; }
          .order-actions { order: 3; }
          .detail-specs { order: 4; margin-top: 0; }
          .detail-downloads { order: 5; margin-top: 0; }
          .order-form { order: 6; }
        }
      `}</style>
        </div>
    );
}

// ─── Related products ────────────────────────────────────────────────────────

import { getKarnizlarByKatalog } from '@/data/karnizlar';
import KarnizCard from '@/components/karnizlar/KarnizCard';

function RelatedProducts({ currentKod, catalogSlug }: { currentKod: string; catalogSlug: string }) {
    const t = useTranslations('ProductDetail');
    const items = getKarnizlarByKatalog(catalogSlug)
        .filter((k) => k.kod !== currentKod)
        .slice(0, 4);

    if (items.length === 0) return null;

    return (
        <div className="mt-12">
            <h2 className="mb-5" style={{ fontSize: '28px', fontWeight: 400, color: '#333' }}>
                {t('related_title')}
            </h2>
            <div className="karniz-grid grid">
                {items.map((item) => (
                    <KarnizCard key={item.kod} item={item} />
                ))}
            </div>
        </div>
    );
}

// ─── Floating elements ───────────────────────────────────────────────────────

function ChatFloating() {
    const t = useTranslations('ProductDetail');
    return (
        <a
            href="https://t.me/Ibodillaev_jafar"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
            style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--ed-green-grad)',
                boxShadow: '0 0 0 6px rgba(18,168,112,0.2)',
            }}
            aria-label={t('ask_telegram')}
        >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.93 6.868l-1.685 7.944c-.125.568-.457.706-.924.44l-2.561-1.888-1.236 1.19c-.137.137-.25.25-.514.25l.184-2.622 4.763-4.302c.207-.184-.045-.285-.32-.1L7.44 14.73l-2.507-.784c-.544-.17-.556-.543.12-.8l9.804-3.779c.454-.166.85.1.073.501z" />
            </svg>
        </a>
    );
}

function BackToTop() {
    const t = useTranslations('ProductDetail');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-6 z-50 flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
            style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--ed-green-grad)',
            }}
            aria-label={t('back_to_top')}
        >
            ↑
        </button>
    );
}

function CookieBanner() {
    return null;
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function ProductDetail({ slug, kod, bolim }: { slug: string; kod: string; bolim: Bolim }) {
    const t = useTranslations('ProductDetail');
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="animate-pulse text-gray-400">{t('loading')}</div>
                    </main>
                    <Footer />
                </div>
            }
        >
            <KarnizDetailPageInner slug={slug} kod={kod} bolim={bolim} />
        </Suspense>
    );
}
