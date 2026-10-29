'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const TELEGRAM_URL = 'https://t.me/samarkandganch';
const INSTAGRAM_URL = 'https://www.instagram.com/elit_decor.sam?stkn=MWR5Nm1nMzdwYWdwaA==';

function TelegramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function SocialLink({
  href,
  icon,
  label,
  color,
  handle,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  handle: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="inline-flex items-center gap-2 sm:gap-3"
      style={{ textDecoration: 'none' }}
    >
      <span
        className="flex items-center justify-center rounded-full transition-all duration-300 flex-shrink-0 w-9 h-9 sm:w-[42px] sm:h-[42px]"
        style={{
          background: hov ? color : 'transparent',
          border: `1.5px solid ${color}`,
          color: hov ? '#fff' : color,
        }}
      >
        {icon}
      </span>
      <span className="flex flex-col">
        <span
          className="font-semibold leading-tight transition-colors duration-200 text-[13px] sm:text-[15px]"
          style={{ color: hov ? color : '#1a1a1a' }}
        >
          {label}
        </span>
        <span className="text-gray-400 leading-tight mt-0.5 text-[11px] sm:text-[13px]">
          {handle}
        </span>
      </span>
      <span
        style={{
          color,
          opacity: hov ? 1 : 0.4,
          transform: hov ? 'translateX(4px)' : 'none',
          display: 'inline-block',
          transition: 'all 0.3s',
          fontSize: 16,
        }}
      >
        →
      </span>
    </a>
  );
}

export default function BlogSection() {
  const t = useTranslations('HomePage');
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (visible && videoRef.current) videoRef.current.play().catch(() => {});
  }, [visible]);

  /*
    LAYOUT STRATEGY:
    ─────────────────────────────────────────────────────────────
    The section is full-viewport-width (no container constraint).
    Inside, we use a grid:
      Left column  = constrained text (max ~520px)
      Right column = mockup image, full height, bleeds to right edge

    This lets the mockup be truly large while the text stays readable.

    PNG info:
      Original: 6000 × 4171  (ratio 1.439 : 1)
      Bezel:    left 29.67% → right 70.00%, top 4.80% → bottom 82.25%
      Screen:   left 30.17% → right 69.50%, top 5.52% → bottom 81.53%
                width 39.33%, height 76.02%
    ─────────────────────────────────────────────────────────────
  */
  return (
    <div ref={sectionRef} className="border-t border-gray-100 w-full overflow-x-hidden">
      <div className="flex flex-row lg:items-stretch lg:min-h-[480px]">
        {/* ══════════════════════════════════════
            LEFT — text column (constrained width)
        ══════════════════════════════════════ */}
        <div className="order-2 lg:order-1 flex-1 min-w-0 lg:flex-none lg:flex-shrink-0 lg:w-full lg:max-w-[400px] flex items-center py-6 pl-1 pr-3 sm:py-10 sm:pl-4 sm:pr-8 lg:py-[60px] lg:pl-6 lg:pr-8">
          <div
            className="w-full"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateX(-24px)',
              transition:
                'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            {/* eyebrow */}
            <p
              className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.22em] mb-2 sm:mb-3"
              style={{ color: '#B8965A' }}
            >
              {t('blog.subtitle')}
            </p>

            {/* headline — matches other sections */}
            <h2 className="text-[17px] sm:text-3xl font-bold text-gray-900 leading-tight mb-3">
              {t('blog.title')}
            </h2>

            {/* sub */}
            <p className="hidden sm:block text-gray-500 leading-relaxed mb-7" style={{ fontSize: 15 }}>
              {t('blog.header_desc')}
            </p>

            {/* gold rule */}
            <div
              className="hidden sm:block"
              style={{
                width: 36,
                height: 2,
                background: '#D4AF37',
                marginBottom: 24,
                borderRadius: 2,
              }}
            />

            {/* Telegram */}
            <div className="mb-4 sm:mb-6">
              <h3 className="font-bold text-gray-900 mb-2 sm:mb-1 text-[13px] sm:text-[15px]">
                {t('blog.tg_block_title')}
              </h3>
              <p className="hidden sm:block text-gray-500 mb-4 leading-snug" style={{ fontSize: 13 }}>
                {t('blog.tg_block_desc')}
              </p>
              <SocialLink
                href={TELEGRAM_URL}
                icon={<TelegramIcon size={16} />}
                label={t('blog.tg_btn')}
                handle="@samarkandganch"
                color="#229ED9"
              />
            </div>

            {/* divider */}
            <div
              style={{
                height: 1,
                background: 'linear-gradient(to right,#e5e7eb 60%,transparent)',
                marginBottom: 20,
              }}
            />

            {/* Instagram */}
            <div>
              <h3 className="font-bold text-gray-900 mb-2 sm:mb-1 text-[13px] sm:text-[15px]">
                {t('blog.ig_block_title')}
              </h3>
              <p className="hidden sm:block text-gray-500 mb-4 leading-snug" style={{ fontSize: 13 }}>
                {t('blog.ig_block_desc')}
              </p>
              <SocialLink
                href={INSTAGRAM_URL}
                icon={<InstagramIcon size={16} />}
                label={t('blog.ig_btn')}
                handle="@elit_decor.sam"
                color="#C13584"
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            RIGHT — mockup + video
            flex-1 so it fills all remaining space
        ══════════════════════════════════════ */}
        <div
          className="order-1 lg:order-2 w-[46%] shrink-0 lg:w-auto lg:flex-1 flex items-end justify-center lg:justify-end overflow-hidden lg:overflow-visible relative lg:min-h-[320px] lg:-mr-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(28px)',
            transition:
              'opacity 1s cubic-bezier(0.22,1,0.36,1) 0.15s, transform 1s cubic-bezier(0.22,1,0.36,1) 0.15s',
          }}
        >
          <div
            className="relative select-none w-[170%] shrink-0 lg:w-[120%]"
            style={{
              filter: 'drop-shadow(0 24px 64px rgba(0,0,0,0.13))',
            }}
          >
            {/* VIDEO behind PNG
                From screenshot: video is ~4% too far left.
                Corrected: left 31.5% (was 27.3%)
                Screenshot shows video fills ~top 60% of screen height — correct.
            */}
            <video
              ref={videoRef}
              src="/video2.MP4"
              autoPlay
              muted
              loop
              playsInline
              style={{
                position: 'absolute',
                top: '5.3%',
                left: '31.5%',
                width: '37.5%',
                height: '64.5%',
                objectFit: 'cover',
                zIndex: 0,
                clipPath: 'inset(0% 0% 0% 0% round 1.8% / 2.5%)',
                borderRadius: '1.8% / 2.5%',
                overflow: 'hidden',
              }}
            />

            {/* PNG on top */}
            <img
              src="/images/iphone-hand-mockup.png"
              alt=""
              aria-hidden="true"
              draggable={false}
              style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                height: 'auto',
                display: 'block',
                userSelect: 'none',
                pointerEvents: 'none',
                verticalAlign: 'bottom',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
