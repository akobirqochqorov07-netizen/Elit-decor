'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import brand from '@/lib/brand';

export default function ContactsSection() {
  const t = useTranslations('HomePage');
  const [mapActive, setMapActive] = useState(false);

  return (
    <section className="py-12 sm:py-16 border-t border-gray-100">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <p className="text-accent text-xs sm:text-sm font-semibold uppercase tracking-widest mb-1.5 sm:mb-2">
          {t('contacts.subtitle')}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          {t('contacts.title')}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* ── Contact info cards ── */}
        <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
          {/* Phone */}
          <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-accent"
                style={{ width: '20px', height: '20px' }}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                {t('contacts.phone_label')}
              </p>
              <a
                href={brand.phoneHref}
                className="text-gray-900 font-semibold text-sm sm:text-base hover:text-accent transition-colors block truncate"
              >
                {brand.phone}
              </a>
              {brand.phone2 && (
                <a
                  href={brand.phoneHref2}
                  className="text-gray-500 text-xs sm:text-sm hover:text-accent transition-colors block mt-0.5 truncate"
                >
                  {brand.phone2}
                </a>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <svg
                style={{ width: '20px', height: '20px' }}
                className="text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                {t('contacts.email_label')}
              </p>
              <a
                href={brand.emailHref}
                className="text-gray-900 font-semibold text-sm sm:text-base hover:text-accent transition-colors truncate block"
              >
                {brand.email}
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <svg
                style={{ width: '20px', height: '20px' }}
                className="text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                {t('contacts.address_label')}
              </p>
              <p className="text-gray-900 font-semibold text-sm">{t('contacts.address_name')}</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                {t('contacts.address_street')}
              </p>
            </div>
          </div>

          {/* Hours */}
          <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <svg
                style={{ width: '20px', height: '20px' }}
                className="text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">
                {t('contacts.hours_label')}
              </p>
              <p className="text-gray-900 text-sm font-medium whitespace-pre-line">
                {t('contacts.address_hours')}
              </p>
            </div>
          </div>

          {/* Social links */}
          <div className="sm:col-span-2 lg:col-span-1 p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">
              {t('contacts.social_label')}
            </p>
            <div className="flex gap-2.5">
              <a
                href={brand.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#229ED9] flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              <a
                href={brand.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/elit_decor.sam"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                style={{
                  background:
                    'linear-gradient(45deg,#f09433,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888)',
                }}
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ── Map — click to activate scroll ── */}
        <div className="lg:col-span-2">
          <div
            className="relative w-full rounded-2xl overflow-hidden shadow-md border border-gray-100"
            style={{ minHeight: '320px', height: '100%' }}
          >
            <iframe
              src="https://yandex.uz/map-widget/v1/?ll=69.279737%2C41.299496&z=14&pt=69.279737,41.299496,pm2rdm"
              width="100%"
              height="100%"
              style={{ minHeight: '320px', height: '100%', display: 'block', border: 0 }}
              allowFullScreen
              title="Elit Dekor — Toshkent"
              loading="lazy"
            />

            {/* Click-to-activate overlay — prevents accidental scroll hijack */}
            {!mapActive && (
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/10 backdrop-blur-[1px] transition-all"
                onClick={() => setMapActive(true)}
              >
                <div className="bg-white rounded-2xl px-5 py-3 shadow-lg flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-accent"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-gray-800">
                    {t('contacts.map_click')}
                  </span>
                </div>
              </div>
            )}

            {/* Deactivate hint when active */}
            {mapActive && (
              <button
                onClick={() => setMapActive(false)}
                className="absolute top-3 right-3 bg-white rounded-xl px-3 py-1.5 shadow-md text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1.5 z-10"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                {t('contacts.map_close')}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
