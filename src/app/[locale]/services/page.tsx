import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProcessPath from '@/components/ProcessPath';
import PinnedProcess from '@/components/PinnedProcess';
import { CartProvider } from '@/context/CartContext';
import { getTranslations } from 'next-intl/server';

// Gold rhombus separator — same style as gallery page
function GoldSeparator() {
  return (
    <div className="flex items-center justify-center gap-3 mt-4 mb-6">
      <div className="h-px w-20 md:w-32 bg-accent opacity-60" />
      <div className="w-2.5 h-2.5 rotate-45 border-2 border-accent" />
      <div className="w-2.5 h-2.5 rotate-45 bg-accent" />
      <div className="w-2.5 h-2.5 rotate-45 border-2 border-accent" />
      <div className="h-px w-20 md:w-32 bg-accent opacity-60" />
    </div>
  );
}

const serviceImages: Record<string, { img: string; reverse: boolean }> = {
  tyaga:      { img: '/images/galereya1/full/dekor-103.webp', reverse: false },
  lepka:      { img: '/images/galereya1/full/dekor-062.webp', reverse: true },
  fibrobeton: { img: '/images/fibrobeton.jpg',                reverse: false },
  eksklyuziv: { img: '/images/galereya1/full/dekor-018.webp', reverse: true },
};

export default async function ServicesPage() {
  const t = await getTranslations('ServicesPage');

  const serviceKeys = ['tyaga', 'lepka', 'fibrobeton', 'eksklyuziv'] as const;

  const services = serviceKeys.map(slug => ({
    slug,
    title:    t(`items.${slug}.title`),
    subtitle: t(`items.${slug}.subtitle`),
    desc:     t(`items.${slug}.desc`),
    tags:     t.raw(`items.${slug}.tags`) as string[],
    ...serviceImages[slug],
  }));

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        <main className="flex-1">

          {/* ── 1. HERO TITLE ─────────────────────────────────────── */}
          <section className="pt-16 pb-10 text-center px-4 bg-white">
            <nav className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-accent transition-colors">{t('breadcrumb_home')}</Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">{t('breadcrumb_services')}</span>
            </nav>

            <h1 className="font-sans text-3xl md:text-5xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
              {t('title')}
            </h1>
            <GoldSeparator />

            <p className="max-w-xl mx-auto text-base md:text-lg text-gray-600 leading-relaxed">
              {t('desc')}
            </p>
          </section>

          {/* ── 2. SERVICE BLOCKS ─────────────────────────────────── */}
          {services.map((svc) => (
            <section
              key={svc.slug}
              className={svc.reverse ? 'bg-white' : 'bg-gray-50'}
            >
              <div className="container mx-auto" style={{ maxWidth: '1200px' }}>
                <div
                  className={`sv flex flex-col items-stretch ${svc.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
                  style={{ minHeight: 420 }}
                >
                  {/* Image */}
                  <div className="ph lg:w-1/2 overflow-hidden relative group" style={{ minHeight: 380 }}>
                    <img
                      src={svc.img}
                      alt={svc.title}
                      className="w-full h-full object-cover"
                      style={{ minHeight: 380 }}
                      loading="lazy"
                    />
                  </div>

                  {/* Text */}
                  <div className={`lg:w-1/2 flex flex-col justify-center px-8 md:px-12 py-10 ${svc.reverse ? 'bg-white' : 'bg-gray-50'}`}>
                    <span className="text-xs font-bold tracking-widest uppercase text-accent mb-3">
                      {svc.subtitle}
                    </span>

                    <h2 className="font-sans text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                      {svc.title}
                    </h2>

                    <p className="text-base text-gray-600 leading-relaxed mb-6">
                      {svc.desc}
                    </p>

                    {/* Tags */}
                    <div className="tg flex flex-wrap gap-2 mb-6">
                      {svc.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border border-accent text-amber-700 bg-amber-50"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link
                      href="/contacts/"
                      className="group self-start inline-flex items-center gap-2 bg-accent text-white px-8 py-3 rounded-full font-medium hover:bg-amber-600 transition-colors shadow-sm"
                    >
                      {t('cta')}
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          ))}

          {/* ── 3. PINNED TIMELINE ────────────────────────────────── */}
          <PinnedProcess>
            <ProcessPath />
          </PinnedProcess>

        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}
