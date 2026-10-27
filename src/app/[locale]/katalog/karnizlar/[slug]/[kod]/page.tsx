'use client';
/**
 * /katalog/karnizlar/[slug]/[kod]/page.tsx
 * DIKART-exact mahsulot detail sahifasi.
 *
 * 3 ustunli layout:
 * [Galereya] | [Ma'lumot paneli #f5efe4] | [Buyurtma formasi]
 */

import { use, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderRequestForm from '@/components/cart/OrderRequestForm';
import { useCart } from '@/context/CartContext';
import { useDrawer } from '@/context/DrawerContext';
import {
    getKarnizByKod,
    getKatalogBySlug,
    getPrevNextInKatalog,
    formatOlcham,
    getDownloadUrl,
    getModel3dUrl,
} from '@/data/karnizlar';

const ModelViewer3D = dynamic(() => import('@/components/catalog/ModelViewer3D'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            3D yuklanmoqda...
        </div>
    ),
});

// ─── Galereya komponenti ─────────────────────────────────────────────────────

function KarnizGallery({ rasms, nomi }: { rasms: string[]; nomi: string }) {
    const [active, setActive] = useState(0);

    return (
        <div className="flex flex-col" style={{ backgroundColor: '#152f40' }}>
            {/* Asosiy rasm */}
            <div
                className="relative w-full flex items-center justify-center"
                style={{ height: '307px', backgroundColor: '#152f40' }}
            >
                {/* Tilla yurak */}
                <button
                    className="absolute top-3 right-3 z-10 text-2xl leading-none"
                    style={{ color: '#c9a46a' }}
                    aria-label="Sevimlilarga qo'shish"
                >
                    ♡
                </button>

                {/* Chap strelka */}
                {rasms.length > 1 && (
                    <button
                        onClick={() => setActive((i) => (i - 1 + rasms.length) % rasms.length)}
                        className="absolute left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors hover:bg-white/20"
                        style={{ border: '1px solid rgba(255,255,255,0.4)' }}
                    >
                        ‹
                    </button>
                )}

                <div style={{ width: '85%', height: '260px', position: 'relative' }}>
                    <Image
                        src={rasms[active]}
                        alt={`${nomi} — ${active + 1}`}
                        fill
                        style={{ objectFit: 'contain', imageRendering: 'auto' }}
                        sizes="400px"
                        priority
                    />
                </div>

                {/* O'ng strelka */}
                {rasms.length > 1 && (
                    <button
                        onClick={() => setActive((i) => (i + 1) % rasms.length)}
                        className="absolute right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors hover:bg-white/20"
                        style={{ border: '1px solid rgba(255,255,255,0.4)' }}
                    >
                        ›
                    </button>
                )}
            </div>

            {/* Miniatyuralar */}
            <div className="flex gap-2 px-3 pb-3 mt-2">
                {rasms.map((src, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(i)}
                        className="relative flex-shrink-0 transition-all"
                        style={{
                            width: '80px',
                            height: '60px',
                            backgroundColor: '#152f40',
                            border: i === active ? '2px solid #86c540' : '2px solid transparent',
                        }}
                        aria-label={`Rasm ${i + 1}`}
                    >
                        <Image src={src} alt={`${nomi} ${i + 1}`} fill style={{ objectFit: 'contain', padding: '4px' }} sizes="80px" />
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Ma'lumot paneli ─────────────────────────────────────────────────────────

const ICONS = [
    { label: 'Eko material', icon: '🌿' },
    { label: "Yong'inga chidamli", icon: '🔥' },
    { label: "Bo'yaladi", icon: '🎨' },
    { label: 'Ehtiyotkorlik', icon: '📦' },
    { label: '24 soat', icon: '⏰' },
];

function InfoPanel({
    nomi,
    kod,
    katalogNomi,
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
    narx: number | null;
    olcham: string;
    material: string;
    balandlik: number | null;
    kenglik: number | null;
    ogirlik: number | null;
}) {
    return (
        <div
            className="flex flex-col gap-4 h-full"
            style={{ backgroundColor: '#f5efe4', padding: '30px', minHeight: '307px' }}
        >
            {/* 5 ta ikonka qatori */}
            <div className="flex gap-2 flex-wrap">
                {ICONS.map((ic) => (
                    <div
                        key={ic.label}
                        className="flex flex-col items-center gap-1"
                        style={{ width: '42px' }}
                        title={ic.label}
                    >
                        <div
                            className="flex items-center justify-center text-lg"
                            style={{
                                width: '42px',
                                height: '42px',
                                border: '2px solid #86c540',
                                borderRadius: '4px',
                                backgroundColor: 'white',
                            }}
                        >
                            {ic.icon}
                        </div>
                        <span className="text-[8px] text-gray-500 text-center leading-tight">{ic.label}</span>
                    </div>
                ))}
            </div>

            {/* Xususiyatlar ro'yxati */}
            <ul className="flex flex-col gap-1 text-sm text-gray-700">
                <li>
                    <span className="font-semibold">Material:</span> {material}
                </li>
                {olcham !== '—' && (
                    <li>
                        <span className="font-semibold">O&apos;lcham:</span> {olcham}
                    </li>
                )}
                {ogirlik !== null && (
                    <li>
                        <span className="font-semibold">Og&apos;irligi:</span> {ogirlik} kg/p.m.
                    </li>
                )}
                <li>
                    <span className="font-semibold">Katalog:</span> {katalogNomi}
                </li>
            </ul>

            {/* Qisqa tavsif */}
            <p className="text-sm text-gray-600 leading-relaxed flex-1">
                {nomi} ({kod}) — Elit Dekor zavodida G-16 markali yuqori sifatli gipsdan tayyorlangan
                karniz.{balandlik ? ` Balandligi ${balandlik}mm.` : ''} Interyer bezatishda keng
                qo&apos;llaniladi.
            </p>

            {/* Narx */}
            <div className="mt-auto pt-3 border-t border-[#e0d5c5]">
                <span className="text-sm text-gray-500">Narx:</span>{' '}
                <span className="font-bold" style={{ fontSize: '28px', color: '#152f40', lineHeight: 1 }}>
                    {narx ? `${narx.toLocaleString('uz-UZ')}` : <span className="text-lg font-medium text-gray-500">So&apos;rang</span>}
                </span>
                {narx && <span className="text-sm text-gray-500 ml-1">so&apos;m/p.m.</span>}
            </div>
        </div>
    );
}

// ─── Buyurtma ustuni ─────────────────────────────────────────────────────────

function OrderColumn({ item }: { item: ReturnType<typeof getKarnizByKod> }) {
    const { addItem, items } = useCart();
    const { openDrawer } = useDrawer();
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);

    if (!item) return null;

    const inCart = items.some((i) => i.sku === item.kod);

    const handleAddCart = () => {
        addItem({
            id: item.kod,
            title: `${item.korsatiladigan_kod} — ${item.katalog_nomi}`,
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
        <div className="flex flex-col gap-4" style={{ minHeight: '307px' }}>
            {/* Savatga qo'shish bloği */}
            <div className="flex flex-col gap-3">
                {/* Miqdor boshqaruvi */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Miqdor (p.m.)
                    </label>
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden w-36">
                        <button
                            onClick={() => setQty((v) => Math.max(1, v - 1))}
                            className="w-9 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg font-bold"
                        >
                            −
                        </button>
                        <input
                            type="number"
                            min={1}
                            value={qty}
                            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                            className="flex-1 h-10 text-center text-sm font-semibold outline-none border-x border-gray-300"
                        />
                        <button
                            onClick={() => setQty((v) => v + 1)}
                            className="w-9 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg font-bold"
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
                        border: '2px solid #86c540',
                        color: added || inCart ? 'white' : '#86c540',
                        backgroundColor: added || inCart ? '#86c540' : 'transparent',
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    {added ? "✓ Qo'shildi" : inCart ? '✓ Savatda' : "Savatga qo'shish"}
                </button>
                <View3DButton kod={item.kod} nomi={`Karniz ${item.korsatiladigan_kod}`} />
            </div>

            {/* Separator */}
            <hr className="border-gray-200" />

            {/* Hisob-kitob formasi */}
            <div>
                <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                    Hisob-kitob buyurtma qilish
                </p>
                <div
                    className="border border-gray-300 rounded p-4"
                    style={{ borderColor: '#333' }}
                >
                    <OrderRequestForm
                        variant="standalone"
                        singleItem={{
                            kod: item.kod,
                            nomi: `${item.korsatiladigan_kod} — ${item.katalog_nomi}`,
                            miqdor: qty,
                            katalog: item.katalog_slug,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

// ─── Downloads bloki ─────────────────────────────────────────────────────────

const DOWNLOAD_FORMATS: Array<{
    ext: string;
    label: string;
    color: string;
}> = [
    { ext: '3ds', label: 'Modelni yuklab olish', color: '#6d28d9' },
    { ext: 'max', label: 'Modelni yuklab olish', color: '#c2410c' },
    { ext: 'dwg', label: 'Modelni yuklab olish', color: '#0369a1' },
    { ext: 'obj', label: 'Modelni yuklab olish', color: '#15803d' },
    { ext: 'fbx', label: 'Modelni yuklab olish', color: '#a16207' },
    { ext: 'pdf', label: 'Tavsifni yuklab olish', color: '#b91c1c' },
];

function DownloadsBlock({ kod }: { kod: string }) {
    return (
        <div className="mt-10 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-5">3D modellar va chizmalar</h3>
            <div className="flex flex-wrap gap-6">
                {DOWNLOAD_FORMATS.map(({ ext, label, color }) => {
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
                                {href ? label : 'Tez orada'}
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
                            title={`${ext.toUpperCase()} yuklab olish`}
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
                            backgroundColor: '#86c540',
                            transform: 'rotate(12deg)',
                        }}
                    >
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#152f40" strokeWidth="1.8">
                            <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
                            <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
                        </svg>
                    </span>
                    <span className="text-left leading-tight">
                        <span className="block text-lg">3D da ko&apos;rish</span>
                        <span className="block text-xs font-normal text-white/70">
                            {src ? 'Aylanib ko‘ring, yaqinlashtiring' : 'Model tez orada qo‘shiladi'}
                        </span>
                    </span>
                </span>
            </button>

            {open && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
                    <div className="relative bg-white w-full max-w-3xl h-[70vh] flex flex-col">
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <p className="font-medium text-gray-800">{nomi} — 3D</p>
                            <button type="button" onClick={() => setOpen(false)} className="text-gray-500 text-xl px-2">
                                ×
                            </button>
                        </div>
                        <div className="flex-1 min-h-0">
                            {src ? (
                                <ModelViewer3D src={src} productName={nomi} />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500 text-sm px-6 text-center">
                                    Ushbu model uchun 3D fayl hali joylanmagan. Yuklab olish formatlari
                                    tayyor bo‘lgach shu yerda ochiladi.
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

function KarnizDetailPageInner({ slug, kod }: { slug: string; kod: string }) {
    const item = getKarnizByKod(kod);
    const katalog = getKatalogBySlug(slug);
    const { prev, next } = getPrevNextInKatalog(slug, kod);

    if (!item || !katalog) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl text-gray-700 mb-4">Mahsulot topilmadi</h1>
                        <Link href={`/katalog/karnizlar/${slug}/`} className="text-[#86c540] underline">
                            Katalogga qaytish
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const rasms = [item.rasm_kok];
    const olcham = formatOlcham(item.balandlik_mm, item.kenglik_mm);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-1">
                <div className="mx-auto px-4 sm:px-6 py-5" style={{ maxWidth: '1200px' }}>

                    {/* Breadcrumb + prev/next nav */}
                    <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                        <nav className="flex flex-wrap items-center text-base" style={{ color: '#333' }}>
                            <Link href="/" className="hover:underline">Bosh sahifa</Link>
                            <span className="mx-1 text-gray-400">/</span>
                            <Link href="/katalog/karnizlar/" className="hover:underline">Karnizlar</Link>
                            <span className="mx-1 text-gray-400">/</span>
                            <Link href={`/katalog/karnizlar/${slug}/`} className="hover:underline">
                                {katalog.nomi}
                            </Link>
                            <span className="mx-1 text-gray-400">/</span>
                            <span>{item.korsatiladigan_kod}</span>
                        </nav>

                        {/* Prev / Next chevrons */}
                        <div className="flex items-center gap-2">
                            {prev ? (
                                <Link
                                    href={`/katalog/karnizlar/${slug}/${prev.kod}/`}
                                    className="flex items-center gap-1 font-bold text-sm transition-colors hover:opacity-80"
                                    style={{ color: '#86c540' }}
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
                                    href={`/katalog/karnizlar/${slug}/${next.kod}/`}
                                    className="flex items-center gap-1 font-bold text-sm transition-colors hover:opacity-80"
                                    style={{ color: '#86c540' }}
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
                        Karniz {item.korsatiladigan_kod}
                        {olcham !== '—' ? `, ${olcham}` : ''}
                    </h1>

                    {/* 3 ustunli asosiy blok */}
                    <div className="detail-grid grid gap-6">
                        {/* 1. Galereya — to‘q ko‘k fonli rasm */}
                        <KarnizGallery rasms={rasms} nomi={item.korsatiladigan_kod} />

                        {/* 2. Ma'lumot paneli */}
                        <InfoPanel
                            nomi={`Karniz ${item.korsatiladigan_kod}`}
                            kod={item.korsatiladigan_kod}
                            katalogNomi={item.katalog_nomi}
                            narx={item.narx_pm}
                            olcham={olcham}
                            material={item.material}
                            balandlik={item.balandlik_mm}
                            kenglik={item.kenglik_mm}
                            ogirlik={item.ogirlik_kg}
                        />

                        {/* 3. Buyurtma */}
                        <OrderColumn item={item} />
                    </div>

                    <DownloadsBlock kod={item.kod} />

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
        @media (max-width: 767px) {
          .detail-grid { grid-template-columns: 1fr; }
          .karniz-grid { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    );
}

// ─── Related products ────────────────────────────────────────────────────────

import { getKarnizlarByKatalog } from '@/data/karnizlar';
import KarnizCard from '@/components/karnizlar/KarnizCard';

function RelatedProducts({ currentKod, catalogSlug }: { currentKod: string; catalogSlug: string }) {
    const items = getKarnizlarByKatalog(catalogSlug)
        .filter((k) => k.kod !== currentKod)
        .slice(0, 4);

    if (items.length === 0) return null;

    return (
        <div className="mt-12">
            <h2 className="mb-5" style={{ fontSize: '28px', fontWeight: 400, color: '#333' }}>
                Sizga ham kerak bo&apos;lishi mumkin
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
                backgroundColor: '#86c540',
                boxShadow: '0 0 0 6px rgba(134,197,64,0.2)',
            }}
            aria-label="Telegram da so'rash"
        >
            {/* Telegram ikonkasi */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.93 6.868l-1.685 7.944c-.125.568-.457.706-.924.44l-2.561-1.888-1.236 1.19c-.137.137-.25.25-.514.25l.184-2.622 4.763-4.302c.207-.184-.045-.285-.32-.1L7.44 14.73l-2.507-.784c-.544-.17-.556-.543.12-.8l9.804-3.779c.454-.166.85.1.073.501z" />
            </svg>
        </a>
    );
}

function BackToTop() {
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
                backgroundColor: '#86c540',
            }}
            aria-label="Tepaga"
        >
            ↑
        </button>
    );
}

function CookieBanner() {
    // CookieBar.tsx ga ko'chirilgan — bu yerda placeholder
    return null;
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function KarnizDetailPage({
    params,
}: {
    params: Promise<{ slug: string; kod: string }>;
}) {
    const { slug, kod } = use(params);
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="animate-pulse text-gray-400">Yuklanmoqda...</div>
                    </main>
                    <Footer />
                </div>
            }
        >
            <KarnizDetailPageInner slug={slug} kod={kod} />
        </Suspense>
    );
}
