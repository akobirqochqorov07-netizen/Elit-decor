'use client';

/**
 * /catalog/[category] — Category product listing page.
 *
 * Features:
 *  - DIKART-style left sidebar: category navigation tree + filters
 *  - URL-driven filter & sort state
 *  - Grid: 4 cols desktop, 3 tablet, 2 mobile
 *  - Mobile: bottom sheet with "Filtrlar (n)" trigger
 */

import React, { use, useMemo, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/catalog/ProductCard';
import { products, type Product, type Category } from '@/data/products';

// ─── types ────────────────────────────────────────────────────────────────────

interface FilterState {
  heightMin: string;
  heightMax: string;
  priceMin: string;
  priceMax: string;
  material: string;
  availability: string;
  sort: string;
}

function readFilters(params: URLSearchParams): FilterState {
  return {
    heightMin: params.get('heightMin') ?? '',
    heightMax: params.get('heightMax') ?? '',
    priceMin: params.get('priceMin') ?? '',
    priceMax: params.get('priceMax') ?? '',
    material: params.get('material') ?? '',
    availability: params.get('availability') ?? '',
    sort: params.get('sort') ?? 'default',
  };
}

function countActiveFilters(f: FilterState): number {
  return [f.heightMin, f.heightMax, f.priceMin, f.priceMax, f.material, f.availability].filter(
    Boolean
  ).length;
}

// ─── skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="overflow-hidden animate-pulse border border-gray-200">
      <div className="bg-gray-100" style={{ aspectRatio: '310/210' }} />
      <div className="p-3 flex flex-col gap-2 bg-[#0a2734]">
        <div className="h-3 bg-white/10 rounded w-1/2" />
        <div className="h-3 bg-white/10 rounded w-3/4" />
        <div className="h-2.5 bg-white/10 rounded w-1/3" />
        <div className="h-7 bg-white/10 rounded w-full mt-1" />
      </div>
    </div>
  );
}

// ─── DIKART-style category sidebar nav ────────────────────────────────────────

// Interior sub-categories for "karnizy"
const karnizySubCats = [
  { slug: 'karnizy', label: 'Tekis karnizlar' },
  { slug: 'karnizy-naqshli', label: 'Naqshli karnizlar' },
  { slug: 'karnizy-yoritilgan', label: 'Yoritilgan karnizlar' },
];

// All interior main categories
const interiorCats = [
  { slug: 'karnizy', label: 'Karnizlar' },
  { slug: 'rozetki', label: 'Rozetkalar' },
  { slug: 'moldinghi', label: 'Moldinglar' },
  { slug: 'friezes', label: 'Frizlar' },
  { slug: 'columns', label: 'Ustunlar' },
  { slug: 'panels', label: 'Panno' },
];

// All facade categories
const facadeCats = [
  { slug: 'fasad-karnizlar', label: 'Fasad karnizlar' },
  { slug: 'fasad-ustunlar', label: 'Fasad ustunlar' },
  { slug: 'fasad-panellar', label: 'Fasad panellar' },
];

interface CatalogNavSidebarProps {
  currentCategory: Category;
  filters: FilterState;
  onChange: (key: keyof FilterState, value: string) => void;
  onClearAll: () => void;
  materials: string[];
}

function CatalogNavSidebar({
  currentCategory,
  filters,
  onChange,
  onClearAll,
  materials,
}: CatalogNavSidebarProps) {
  const t = useTranslations('CategoryPage');
  const activeCount = countActiveFilters(filters);
  const isKarnizy = currentCategory === 'karnizy';

  return (
    <aside className="flex flex-col gap-0 text-sm" style={{ minWidth: '220px' }}>
      {/* ── Back to catalog ── */}
      <Link
        href="/catalog/"
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0a2734] mb-3 transition-colors"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Barcha kategoriyalar
      </Link>

      {/* ── INTERYER DEKORI section ── */}
      <div className="mb-2">
        <p
          className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 py-1.5 mb-1"
          style={{ letterSpacing: '0.1em' }}
        >
          Interyer dekori
        </p>

        {/* Karnizy — expandable if current */}
        <div>
          <Link
            href="/catalog/karnizy/"
            className={`flex items-center justify-between px-2 py-2 text-sm font-semibold transition-colors ${currentCategory === 'karnizy' ? 'text-[#0a2734] bg-gray-100' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <span>Karnizlar</span>
            {currentCategory === 'karnizy' && (
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </Link>

          {/* Sub-categories — only shown when on karnizy */}
          {isKarnizy && (
            <div className="ml-3 border-l border-gray-200 pl-2 mb-1">
              {karnizySubCats.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/catalog/${sub.slug}/`}
                  className={`block py-1.5 px-1 text-sm transition-colors ${sub.slug === 'karnizy' ? 'font-bold text-[#1a6b41]' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Other interior categories */}
        {interiorCats
          .filter((c) => c.slug !== 'karnizy')
          .map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalog/${cat.slug}/`}
              className={`block px-2 py-2 text-sm transition-colors ${currentCategory === cat.slug ? 'text-[#0a2734] bg-gray-100 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {cat.label}
            </Link>
          ))}
      </div>

      {/* ── Separator ── */}
      <hr className="border-gray-200 my-2" />

      {/* ── FASAD DEKORI section ── */}
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 py-1.5 mb-1">
          Fasad dekori
        </p>
        {facadeCats.map((cat) => (
          <Link
            key={cat.slug}
            href={`/catalog/${cat.slug}/`}
            className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* ── Separator ── */}
      <hr className="border-gray-200 my-2" />

      {/* ── Filters ── */}
      <div className="flex flex-col gap-4 mt-1">
        {activeCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors text-left flex items-center gap-1"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            {t('clear_all')} ({activeCount})
          </button>
        )}

        {/* Height range */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            {t('filter_height')}
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder={t('min')}
              value={filters.heightMin}
              onChange={(e) => onChange('heightMin', e.target.value)}
              className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-[#0a2734] transition-colors"
            />
            <input
              type="number"
              placeholder={t('max')}
              value={filters.heightMax}
              onChange={(e) => onChange('heightMax', e.target.value)}
              className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-[#0a2734] transition-colors"
            />
          </div>
        </div>

        {/* Price range */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            {t('filter_price')}
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder={t('min')}
              value={filters.priceMin}
              onChange={(e) => onChange('priceMin', e.target.value)}
              className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-[#0a2734] transition-colors"
            />
            <input
              type="number"
              placeholder={t('max')}
              value={filters.priceMax}
              onChange={(e) => onChange('priceMax', e.target.value)}
              className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-[#0a2734] transition-colors"
            />
          </div>
        </div>

        {/* Material */}
        {materials.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              {t('filter_material')}
            </p>
            <div className="flex flex-col gap-1.5">
              {materials.map((m) => (
                <label key={m} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="material"
                    value={m}
                    checked={filters.material === m}
                    onChange={() => onChange('material', filters.material === m ? '' : m)}
                    className="w-3.5 h-3.5"
                    style={{ accentColor: '#0a2734' }}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{m}</span>
                </label>
              ))}
              {filters.material && (
                <button
                  onClick={() => onChange('material', '')}
                  className="text-xs text-gray-400 hover:text-red-500 text-left mt-1 transition-colors"
                >
                  ✕ {t('clear_filters')}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Availability */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            {t('filter_availability')}
          </p>
          <div className="flex flex-col gap-1.5">
            {(['in_stock', 'made_to_order'] as const).map((val) => (
              <label key={val} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="availability"
                  value={val}
                  checked={filters.availability === val}
                  onChange={() => onChange('availability', filters.availability === val ? '' : val)}
                  className="w-3.5 h-3.5"
                  style={{ accentColor: '#0a2734' }}
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {t(val === 'in_stock' ? 'filter_in_stock' : 'filter_made_to_order')}
                </span>
              </label>
            ))}
            {filters.availability && (
              <button
                onClick={() => onChange('availability', '')}
                className="text-xs text-gray-400 hover:text-red-500 text-left mt-1 transition-colors"
              >
                ✕ {t('clear_filters')}
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── active filter chips ───────────────────────────────────────────────────────

function ActiveChips({
  filters,
  onChange,
  onClearAll,
}: {
  filters: FilterState;
  onChange: (key: keyof FilterState, value: string) => void;
  onClearAll: () => void;
}) {
  const t = useTranslations('CategoryPage');
  const chips: { key: keyof FilterState; label: string }[] = [];

  if (filters.heightMin) chips.push({ key: 'heightMin', label: `≥${filters.heightMin}mm` });
  if (filters.heightMax) chips.push({ key: 'heightMax', label: `≤${filters.heightMax}mm` });
  if (filters.priceMin) chips.push({ key: 'priceMin', label: `≥${filters.priceMin}` });
  if (filters.priceMax) chips.push({ key: 'priceMax', label: `≤${filters.priceMax}` });
  if (filters.material) chips.push({ key: 'material', label: filters.material });
  if (filters.availability)
    chips.push({
      key: 'availability',
      label: t(filters.availability === 'in_stock' ? 'filter_in_stock' : 'filter_made_to_order'),
    });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={() => onChange(chip.key, '')}
          className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
        >
          {chip.label}
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs text-gray-400 hover:text-gray-700 transition-colors underline underline-offset-2"
      >
        {t('clear_all')}
      </button>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

function CategoryPageInner({ category }: { category: Category }) {
  const t = useTranslations('CategoryPage');
  const tCatalog = useTranslations('CatalogPage');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const activeCount = countActiveFilters(filters);

  const handleChange = useCallback(
    (key: keyof FilterState, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const handleClearAll = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const categoryProducts = useMemo(
    () => products.filter((p) => p.category === category),
    [category]
  );

  const materials = useMemo(
    () => [...new Set(categoryProducts.map((p) => p.material))].sort(),
    [categoryProducts]
  );

  const filtered = useMemo(() => {
    let list: Product[] = [...categoryProducts];

    if (filters.heightMin) list = list.filter((p) => p.heightMm >= Number(filters.heightMin));
    if (filters.heightMax) list = list.filter((p) => p.heightMm <= Number(filters.heightMax));
    if (filters.priceMin) list = list.filter((p) => p.pricePerMeter >= Number(filters.priceMin));
    if (filters.priceMax) list = list.filter((p) => p.pricePerMeter <= Number(filters.priceMax));
    if (filters.material) list = list.filter((p) => p.material === filters.material);
    if (filters.availability) list = list.filter((p) => p.availability === filters.availability);

    if (filters.sort === 'price_asc') list = list.sort((a, b) => a.pricePerMeter - b.pricePerMeter);
    else if (filters.sort === 'price_desc')
      list = list.sort((a, b) => b.pricePerMeter - a.pricePerMeter);

    return list;
  }, [categoryProducts, filters]);

  const categoryLabel = t(category as any) || category;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6" style={{ maxWidth: '1200px' }}>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-5 flex-wrap">
            <Link href="/" className="hover:text-[#0a2734] transition-colors">
              {t('breadcrumb_home')}
            </Link>
            <span>/</span>
            <Link href="/catalog/" className="hover:text-[#0a2734] transition-colors">
              {tCatalog('breadcrumb_interior')}
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">{categoryLabel}</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-semibold text-[#0a2734] mb-5">
            {categoryLabel}
          </h1>

          {/* Top bar: count + mobile filter trigger + sort */}
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <p className="text-sm text-gray-500">
              {t('found')} <span className="font-semibold text-gray-800">{filtered.length}</span>{' '}
              {t('found_suffix')}
            </p>
            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 text-sm font-medium border border-gray-200 rounded px-3 py-1.5 hover:border-[#0a2734] transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="20" y2="12" />
                  <line x1="12" y1="18" x2="20" y2="18" />
                </svg>
                {t('filters_btn')}
                {activeCount > 0 && ` (${activeCount})`}
              </button>

              {/* Sort */}
              <select
                value={filters.sort}
                onChange={(e) => handleChange('sort', e.target.value)}
                className="text-sm border border-gray-200 rounded px-3 py-1.5 outline-none focus:border-[#0a2734] transition-colors bg-white"
                aria-label={t('sort_label')}
              >
                <option value="default">{t('sort_default')}</option>
                <option value="price_asc">{t('sort_price_asc')}</option>
                <option value="price_desc">{t('sort_price_desc')}</option>
              </select>
            </div>
          </div>

          {/* Active chips */}
          <ActiveChips filters={filters} onChange={handleChange} onClearAll={handleClearAll} />

          {/* ── Main layout: sidebar + grid ── */}
          <div className="flex gap-8 items-start">
            {/* Desktop sidebar */}
            <div className="hidden lg:block w-56 flex-shrink-0">
              <CatalogNavSidebar
                currentCategory={category}
                filters={filters}
                onChange={handleChange}
                onClearAll={handleClearAll}
                materials={materials}
              />
            </div>

            {/* Product grid */}
            <div className="flex-1 min-w-0">
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="1"
                    className="mx-auto mb-4"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <p className="text-lg font-medium text-gray-600 mb-2">{t('empty_title')}</p>
                  <p className="text-sm text-gray-400 mb-6">{t('empty_desc')}</p>
                  <button
                    onClick={handleClearAll}
                    className="text-sm font-semibold text-[#0a2734] border border-[#0a2734]/30 px-5 py-2 rounded hover:bg-[#0a2734] hover:text-white transition-all"
                  >
                    {t('clear_filters')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0 border-t border-l border-gray-200">
                  {filtered.map((product) => (
                    <div key={product.slug} className="border-b border-r border-gray-200">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile filter bottom sheet */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{t('filters_title')}</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Yopish"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="px-5 py-5">
              <CatalogNavSidebar
                currentCategory={category}
                filters={filters}
                onChange={handleChange}
                onClearAll={handleClearAll}
                materials={materials}
              />
            </div>
            <div className="sticky bottom-0 bg-white px-5 py-4 border-t border-gray-100">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full text-white py-3 rounded font-bold hover:opacity-90 transition-colors"
                style={{ backgroundColor: '#0a2734' }}
              >
                {t('apply')} · {filtered.length} {t('found_suffix')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── page export ───────────────────────────────────────────────────────────────

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-white">
          <Header />
          <main className="flex-1">
            <div className="container mx-auto px-4 py-6" style={{ maxWidth: '1200px' }}>
              <div className="flex gap-8 mt-8">
                <div className="hidden lg:block w-56 flex-shrink-0">
                  <div className="flex flex-col gap-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0 border-t border-l border-gray-200">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="border-b border-r border-gray-200">
                        <CardSkeleton />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <CategoryPageInner category={category as Category} />
    </Suspense>
  );
}
