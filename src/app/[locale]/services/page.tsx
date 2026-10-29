import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProcessPath from '@/components/ProcessPath';
import PinnedProcess from '@/components/PinnedProcess';
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
  tyaga: { img: '/images/galereya1/full/dekor-103.webp', reverse: false },
  lepka: { img: '/images/galereya1/full/dekor-062.webp', reverse: true },
  fibrobeton: { img: '/images/fibrobeton.jpg', reverse: false },
  eksklyuziv: { img: '/images/galereya1/full/dekor-018.webp', reverse: true },
};

export default async function ServicesPage() {
  const t = await getTranslations('ServicesPage');

  const serviceKeys = ['tyaga', 'lepka', 'fibrobeton', 'eksklyuziv'] as const;

  const services = serviceKeys.map((slug) => ({
    slug,
    title: t(`items.${slug}.title`),
    subtitle: t(`items.${slug}.subtitle`),
    desc: t(`items.${slug}.desc`),
    tags: t.raw(`items.${slug}.tags`) as string[],
    ...serviceImages[slug],
  }));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* ── 1. HERO TITLE ─────────────────────────────────────── */}
        <section className="pt-10 sm:pt-16 pb-8 sm:pb-10 text-center px-4 bg-white">
          <nav className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-5 sm:mb-8">
            <Link href="/" className="inline-block py-2 hover:text-accent transition-colors">
              {t('breadcrumb_home')}
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">{t('breadcrumb_services')}</span>
          </nav>

          <h1 className="font-sans text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 uppercase tracking-wide">
            {t('title')}
          </h1>
          <GoldSeparator />

          <p className="max-w-xl mx-auto text-base md:text-lg text-gray-600 leading-relaxed">
            {t('desc')}
          </p>
        </section>

        {/* ── 2. SERVICE BLOCKS ─────────────────────────────────── */}
        {services.map((svc) => (
          <section key={svc.slug} className={svc.reverse ? 'bg-white' : 'bg-gray-50'}>
            <div className="container mx-auto" style={{ maxWidth: '1200px' }}>
              <div
                className={`flex flex-col items-stretch lg:min-h-[420px] ${svc.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
              >
                {/* Image */}
                <div className="lg:w-1/2 overflow-hidden relative group h-56 sm:h-72 lg:h-auto lg:min-h-[380px]">
                  <img
                    src={svc.img}
                    alt={svc.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Telefonda: kichik sarlavha-yorliq rasm ustida */}
                  <span className="lg:hidden absolute left-3 bottom-3 bg-black/55 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                    {svc.subtitle}
                  </span>
                </div>

                {/* Text */}
                <div
                  className={`lg:w-1/2 flex flex-col justify-center px-5 sm:px-8 md:px-12 py-6 sm:py-10 ${svc.reverse ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <span className="hidden lg:block text-xs font-bold tracking-widest uppercase text-accent mb-3">
                    {svc.subtitle}
                  </span>

                  <h2 className="font-sans text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                    {svc.title}
                  </h2>

                  <p className="text-[15px] sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">{svc.desc}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6">
                    {svc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border border-accent text-amber-700 bg-amber-50"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#D4AF37"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href="/contacts/"
                    className="group w-full sm:w-auto sm:self-start inline-flex items-center justify-center gap-2 bg-accent text-white px-8 h-12 rounded-full font-medium hover:bg-amber-600 transition-colors shadow-sm"
                  >
                    {t('cta')}
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
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
  );
}
