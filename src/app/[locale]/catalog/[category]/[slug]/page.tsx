'use client';

/**
 * /catalog/[category]/[slug] — Product detail page.
 * Layout mirrors dikart.ru exactly:
 *
 * DESKTOP (2-col):
 *   LEFT  — gallery (2 thumbs top, large active, lightbox)
 *   RIGHT — badges | h1 | code | props | price | 2 buttons | 3D btn | specs table
 * BELOW  — tabs (Tavsif | O'lchamlar | O'rnatish)
 *           Downloads block
 *           "Sizga kerak" services
 *           Related products
 *           FAQ form
 * MOBILE — stacked, sticky bottom bar with "Hisob-kitob" + "Savatga"
 */

import React, { use, useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/catalog/ProductCard';
import {
  getProductBySlug,
  getProductsByCategory,
  formatPrice,
  type Product,
  type Category,
  CURRENCY_LABEL,
} from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useDrawer } from '@/context/DrawerContext';
import brand from '@/lib/brand';

const ModelViewer3D = dynamic(() => import('@/components/catalog/ModelViewer3D'), {
  ssr: false,
  loading: () => null,
});

// ── Calc helper ───────────────────────────────────────────────────────────────

function calcPieces(lengthM: number, pieceLengthM: number, pricePerMeter: number) {
  const pieces = Math.ceil(lengthM / pieceLengthM);
  const actualLength = pieces * pieceLengthM;
  return { pieces, actualLength, totalPrice: actualLength * pricePerMeter };
}

// ── Badge ─────────────────────────────────────────────────────────────────────

function Badge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-2xl leading-none">{icon}</span>
      <span className="text-[10px] text-gray-500 font-medium leading-tight max-w-[56px]">
        {label}
      </span>
    </div>
  );
}

// ── Gallery ───────────────────────────────────────────────────────────────────

function Gallery({ images, name }: { images: { src: string; alt: string }[]; name: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const valid = images.filter((i) => i.src);
  const count = valid.length;
  const prev = useCallback(() => setActive((i) => (i - 1 + count) % count), [count]);
  const next = useCallback(() => setActive((i) => (i + 1) % count), [count]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') setLightbox(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [prev, next]);

  if (!count)
    return (
      <div className="aspect-square rounded-2xl bg-primary flex items-center justify-center">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    );

  return (
    <>
      {/* Thumbnail strip (left on desktop, top on mobile) */}
      <div className="flex lg:flex-col gap-2 mb-3 lg:mb-0 lg:mr-3 lg:w-20 overflow-x-auto lg:overflow-y-auto lg:max-h-[500px]">
        {valid.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 transition-all ${i === active ? 'border-accent' : 'border-transparent hover:border-accent/30'}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={80}
              height={80}
              className="w-full h-full object-contain bg-primary/80"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 relative">
        <div
          className="relative w-full rounded-2xl overflow-hidden bg-primary cursor-zoom-in"
          style={{ aspectRatio: '1/1' }}
          onClick={() => setLightbox(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setLightbox(true)}
        >
          <Image
            src={valid[active].src}
            alt={valid[active].alt}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-contain p-4"
            priority={active === 0}
          />
          {count > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow z-10"
                aria-label="Oldingi"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0a2734"
                  strokeWidth="2.5"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow z-10"
                aria-label="Keyingi"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0a2734"
                  strokeWidth="2.5"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(false)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm flex items-center gap-1"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>{' '}
              ESC
            </button>
            <Image
              src={valid[active].src}
              alt={valid[active].alt}
              width={1200}
              height={900}
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>
          {count > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

// ── Order Form ────────────────────────────────────────────────────────────────

function OrderForm({ product, length }: { product: Product; length: number }) {
  const t = useTranslations('ProductPage');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [hp, setHp] = useState('');
  const [st, setSt] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errs, setErrs] = useState<Record<string, string>>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hp || st === 'loading') return;
    const ne: Record<string, string> = {};
    if (!name.trim()) ne.name = t('order_err_name');
    if (!phone.trim()) ne.phone = t('order_err_phone');
    else if (!phone.startsWith('+998')) ne.phone = t('order_err_phone_format');
    if (Object.keys(ne).length) {
      setErrs(ne);
      return;
    }
    setErrs({});
    setSt('loading');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ism: name.trim(),
          telefon: phone.trim(),
          izoh: `${product.name} (${product.code}), ${length} p.m.${comment.trim() ? ` — ${comment.trim()}` : ''}`,
          website: hp,
          sahifa_url: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });
      const data = await res.json();
      setSt(res.ok && data.ok ? 'success' : 'error');
    } catch {
      setSt('error');
    }
  };

  if (st === 'success')
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <div className="text-green-500 text-3xl mb-2">✓</div>
        <p className="text-green-800 font-semibold text-sm">{t('order_success')}</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <input
        type="text"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />
      {st === 'error' && (
        <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{t('order_error')}</p>
      )}
      <p className="text-xs text-gray-400 italic">{t('order_length_auto', { length })}</p>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t('order_name')}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sardor Valiyev"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors"
        />
        {errs.name && <p className="text-red-500 text-xs mt-1">{errs.name}</p>}
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{t('order_phone')}</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+998 90 000 00 00"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors"
        />
        {errs.phone && <p className="text-red-500 text-xs mt-1">{errs.phone}</p>}
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          {t('order_comment')}
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={st === 'loading'}
        className="w-full bg-accent text-white py-3 rounded-xl font-bold text-sm hover:bg-accent-dark transition-colors disabled:opacity-60 shadow-md shadow-accent/20"
      >
        {st === 'loading' ? t('order_sending') : t('order_submit')}
      </button>
    </form>
  );
}

// ── Downloads ─────────────────────────────────────────────────────────────────

const FMT: Record<string, string> = {
  '3ds': '3DS',
  max: 'MAX',
  dwg: 'DWG',
  obj: 'OBJ',
  fbx: 'FBX',
  pdf: 'PDF',
};

function DownloadsBlock({ product }: { product: Product }) {
  const t = useTranslations('ProductPage');
  if (!product.downloads) return null;
  const entries = Object.entries(product.downloads).filter(([, v]) => v);
  if (!entries.length) return null;
  const models = entries.filter(([k]) => k !== 'pdf');
  const pdf = entries.find(([k]) => k === 'pdf');
  return (
    <div className="mt-10 pt-8 border-t border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-1">{t('downloads_title')}</h2>
      <p className="text-sm text-gray-500 mb-5">{t('downloads_desc')}</p>
      {models.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
          {models.map(([fmt, url]) => (
            <a
              key={fmt}
              href={url as string}
              download
              aria-label={t('download_aria', {
                code: product.code,
                format: FMT[fmt] || fmt.toUpperCase(),
              })}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-accent hover:bg-accent/5 transition-all text-center"
            >
              <span className="text-xl font-black text-gray-700 group-hover:text-accent transition-colors leading-none">
                {FMT[fmt] || fmt.toUpperCase()}
              </span>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                {t('download_btn')}
              </span>
            </a>
          ))}
        </div>
      )}
      {pdf && (
        <a
          href={pdf[1] as string}
          download
          aria-label={t('download_aria', { code: product.code, format: 'PDF' })}
          className="inline-flex items-center gap-2.5 text-sm font-semibold text-gray-600 hover:text-accent border border-gray-200 hover:border-accent px-4 py-2.5 rounded-xl transition-all"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          {t('download_pdf')}
        </a>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function ProductPageInner({ product }: { product: Product }) {
  const t = useTranslations('ProductPage');
  const tCat = useTranslations('CategoryPage');
  const { addItem } = useCart();
  const { openDrawer } = useDrawer();
  const [orderLength, setOrderLength] = useState(product.minOrderM);
  const [show3D, setShow3D] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'dimensions' | 'install'>(
    'description'
  );
  const orderRef = useRef<HTMLDivElement>(null);

  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const galleryImages = [
    product.images.main ? { src: product.images.main, alt: `${product.name} — render` } : null,
    product.images.interior
      ? { src: product.images.interior, alt: `${product.name} — interyer` }
      : null,
    product.images.profile
      ? { src: product.images.profile, alt: `${product.name} — profil` }
      : null,
  ].filter(Boolean) as { src: string; alt: string }[];
  if (!galleryImages.length && product.images.card)
    galleryImages.push({ src: product.images.card, alt: product.name });

  const { pieces, actualLength, totalPrice } = calcPieces(
    orderLength,
    product.pieceLengthM,
    product.pricePerMeter
  );
  const belowMin = orderLength < product.minOrderM;

  const handleAddToCart = () => {
    addItem({
      id: product.slug,
      title: product.name,
      price: product.pricePerMeter,
      quantity: 1,
      imgSrc: product.images.card,
      unit: `so'm/p.m.`,
      sku: product.code,
    });
    openDrawer();
  };

  const badges = [
    { icon: '🪨', label: t('badge_gypsum') },
    { icon: '🌿', label: t('badge_eco') },
    { icon: '🎨', label: t('badge_paintable') },
    { icon: '📦', label: t('badge_fragile') },
    { icon: '⏱️', label: t('badge_24h') },
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pb-20 lg:pb-0">
          <div className="container mx-auto px-4 py-6 sm:py-8" style={{ maxWidth: '1200px' }}>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6 flex-wrap">
              <Link href="/" className="hover:text-accent transition-colors">
                {t('breadcrumb_home')}
              </Link>
              <span>/</span>
              <Link href="/catalog/" className="hover:text-accent transition-colors">
                {t('breadcrumb_catalog')}
              </Link>
              <span>/</span>
              <Link
                href={`/catalog/${product.category}/`}
                className="hover:text-accent transition-colors"
              >
                {tCat(product.category as any)}
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">{product.name}</span>
            </nav>

            {/* ── 2-col layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* LEFT — gallery */}
              <div className="flex flex-col lg:flex-row gap-2 lg:gap-0">
                <Gallery images={galleryImages} name={product.name} />
              </div>

              {/* RIGHT — all info */}
              <div className="flex flex-col gap-5">
                {/* Badges */}
                <div className="flex gap-4 flex-wrap">
                  {badges.map((b) => (
                    <Badge key={b.label} icon={b.icon} label={b.label} />
                  ))}
                </div>

                {/* Title + code */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-1">
                    {product.name}
                  </h1>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
                    {product.code}
                  </p>
                </div>

                {/* Key props (3 inline) */}
                <div className="flex gap-2 flex-wrap text-sm">
                  <span className="bg-gray-100 rounded-lg px-3 py-1.5 font-medium text-gray-700">
                    {t('specs_material')}: <strong>{product.material}</strong>
                  </span>
                  <span className="bg-gray-100 rounded-lg px-3 py-1.5 font-medium text-gray-700">
                    {product.heightMm}×{product.depthMm} mm
                  </span>
                  <span className="bg-gray-100 rounded-lg px-3 py-1.5 font-medium text-gray-700">
                    {product.weightKgPerM} {t('weight_unit')}
                  </span>
                </div>

                {/* Short description */}
                <p className="text-sm text-gray-600 leading-relaxed">{product.shortDescription}</p>

                {/* Price + availability */}
                <div className="flex items-center gap-4 flex-wrap">
                  <p className="text-3xl font-black text-gray-900">
                    {formatPrice(product.pricePerMeter)}
                  </p>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${product.availability === 'in_stock' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}
                  >
                    {product.availability === 'in_stock'
                      ? t('availability_in_stock')
                      : t('availability_made_to_order')}
                  </span>
                </div>

                {/* ── 2 main buttons (dikart style) ── */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() =>
                      orderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                    className="flex-1 bg-accent text-white py-3.5 rounded-xl font-bold text-sm hover:bg-accent-dark transition-colors shadow-md shadow-accent/20"
                  >
                    {t('order_btn')}
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 border-2 border-primary text-primary py-3.5 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all"
                  >
                    {t('add_to_cart')}
                  </button>
                </div>

                {/* 3D button */}
                {product.model3d && (
                  <button
                    onClick={() => setShow3D(true)}
                    className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:border-accent hover:text-accent transition-all"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                    {t('view_3d')}
                  </button>
                )}

                {/* Specs table (dikart.ru style) */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        [t('specs_min_order'), `${product.minOrderM} p.m.`],
                        [t('specs_height') + ', mm', `${product.heightMm}`],
                        [t('specs_depth') + ', mm', `${product.depthMm}`],
                        [t('specs_material'), product.material],
                        [t('weight'), `${product.weightKgPerM} kg`],
                      ].map(([label, value], i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-4 py-2.5 text-gray-500 border-b border-gray-100">
                            {label}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-gray-800 border-b border-gray-100">
                            {value}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={2} className="px-4 py-2 text-xs text-gray-400 italic">
                          {t('specs_note')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Contact shortcuts */}
                <div className="flex gap-3">
                  <a
                    href={brand.social.telegramManager}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold border border-gray-200 rounded-xl py-2.5 hover:border-[#229ED9] hover:text-[#229ED9] transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                    {t('telegram_cta')}
                  </a>
                  <a
                    href={brand.phoneHref}
                    className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold border border-gray-200 rounded-xl py-2.5 hover:border-accent hover:text-accent transition-colors"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {t('phone_cta')}
                  </a>
                </div>
              </div>
            </div>

            {/* ── Tabs ── */}
            <div className="mt-12 border-t border-gray-100 pt-8">
              <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
                {(['description', 'dimensions', 'install'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {t(
                      tab === 'description'
                        ? 'tab_description'
                        : tab === 'dimensions'
                          ? 'tab_dimensions'
                          : 'tab_install'
                    )}
                  </button>
                ))}
              </div>
              {activeTab === 'description' && (
                <div className="max-w-2xl text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                  {product.description}
                </div>
              )}
              {activeTab === 'dimensions' && (
                <div className="max-w-lg">
                  <table className="w-full text-sm border-collapse">
                    <tbody>
                      {[
                        [t('specs_material'), product.material],
                        [t('dimensions'), `${product.heightMm}×${product.depthMm} mm`],
                        [t('weight'), `${product.weightKgPerM} ${t('weight_unit')}`],
                        ['Uzunlik (1 dona)', `${product.pieceLengthM} p.m.`],
                        [t('min_order'), `${product.minOrderM} p.m.`],
                      ].map(([label, value], i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="px-4 py-2.5 text-gray-500 w-48 border border-gray-100">
                            {label}
                          </td>
                          <td className="px-4 py-2.5 font-semibold text-gray-800 border border-gray-100">
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === 'install' && (
                <div className="max-w-2xl">
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">{t('install_text')}</p>
                  <button
                    onClick={() => orderRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm font-semibold text-accent hover:text-accent-dark transition-colors flex items-center gap-1"
                  >
                    {t('order_btn')} →
                  </button>
                </div>
              )}
            </div>

            {/* ── Length Calculator + Order form ── */}
            <div ref={orderRef} className="mt-10 pt-8 border-t border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calculator */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">{t('calc_title')}</h3>
                  <div className="mb-3">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      {t('calc_length_label')}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={0.5}
                        step={0.5}
                        value={orderLength}
                        onChange={(e) => setOrderLength(Math.max(0.5, Number(e.target.value)))}
                        className="w-28 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-semibold outline-none focus:border-accent transition-colors"
                      />
                      <span className="text-sm text-gray-500">p.m.</span>
                    </div>
                  </div>
                  {belowMin && (
                    <p className="text-amber-600 text-xs font-medium mb-3 flex items-center gap-1.5">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      {t('calc_min_warning', { min: product.minOrderM })}
                    </p>
                  )}
                  <div className="flex flex-col gap-2 text-sm border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t('calc_pieces')}</span>
                      <span className="font-semibold">
                        {pieces} {t('calc_pieces')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t('calc_actual')}</span>
                      <span className="font-semibold">{actualLength} p.m.</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-accent border-t border-gray-200 pt-2 mt-1">
                      <span>{t('calc_total')}</span>
                      <span>
                        {totalPrice.toLocaleString()} {CURRENCY_LABEL}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">{t('calc_note')}</p>
                </div>

                {/* Order form */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">{t('order_title')}</h3>
                  <OrderForm product={product} length={orderLength} />
                </div>
              </div>
            </div>

            {/* Downloads */}
            <DownloadsBlock product={product} />

            {/* "Sizga kerak" services */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-5">{t('services_title')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(
                  [
                    ['svc_design', '✏️'],
                    ['svc_install', '🔧'],
                    ['svc_measure', '📐'],
                    ['svc_delivery', '🚚'],
                  ] as const
                ).map(([key, icon]) => (
                  <Link
                    key={key}
                    href="/services/"
                    className="group flex flex-col items-start gap-2 p-4 rounded-xl border border-gray-100 hover:border-accent/30 hover:bg-accent/5 transition-all"
                  >
                    <span className="text-2xl">{icon}</span>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-accent transition-colors leading-snug">
                      {t(key)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-5">{t('related_title')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {related.map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
                </div>
              </div>
            )}

            {/* FAQ form */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('order_title')}</h2>
              <p className="text-sm text-gray-500 mb-5">
                {t('order_length_auto', { length: orderLength })}
              </p>
              <div className="max-w-lg">
                <OrderForm product={product} length={orderLength} />
              </div>
            </div>
          </div>
        </main>

        {/* Mobile sticky bottom bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-30 flex gap-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 border-2 border-primary text-primary py-3 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all"
          >
            {t('add_to_cart')}
          </button>
          <button
            onClick={() => orderRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="flex-1 bg-accent text-white py-3 rounded-xl font-bold text-sm hover:bg-accent-dark transition-colors shadow-md shadow-accent/20"
          >
            {t('order_btn')}
          </button>
        </div>

        <div className="pb-20 lg:pb-0">
          <Footer />
        </div>
      </div>

      {/* 3D Modal */}
      {show3D && product.model3d && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShow3D(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden"
            style={{ height: '70vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShow3D(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow"
              aria-label={t('viewer_close')}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#333"
                strokeWidth="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <ModelViewer3D src={product.model3d} productName={product.name} />
            <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-gray-400 pointer-events-none">
              {t('viewer_rotate')}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// ── page export ───────────────────────────────────────────────────────────────

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);
  if (!product)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-4">Mahsulot topilmadi</p>
            <Link href="/catalog/" className="text-accent hover:underline">
              Katalogga qaytish
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  return <ProductPageInner product={product} />;
}
