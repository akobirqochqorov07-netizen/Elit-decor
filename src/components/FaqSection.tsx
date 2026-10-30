'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import ContactForm from './ContactForm';

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-accent/40 shadow-sm' : 'border-gray-200'}`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 text-left bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span
          className={`font-semibold text-sm leading-snug ${isOpen ? 'text-accent' : 'text-gray-800'}`}
        >
          {question}
        </span>
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isOpen ? 'border-accent bg-accent' : 'border-gray-300'}`}
        >
          <svg
            className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-45 text-white' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? '400px' : '0px' }}
      >
        <div className="px-4 sm:px-6 pb-4 pt-1 bg-white">
          <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const t = useTranslations('HomePage');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
  ];

  return (
    <section className="py-12 sm:py-16 border-t border-gray-100">
      {/* Mobile: stacked; Desktop: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        {/* ── FAQ column ── */}
        <div>
          <p className="text-accent text-xs sm:text-sm font-semibold uppercase tracking-widest mb-1.5 sm:mb-2">
            {t('faq.subtitle')}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-1.5 sm:mb-2">
            {t('faq.title')}
          </h2>
          <p className="text-gray-500 text-sm mb-6 sm:mb-8">{t('faq.desc')}</p>

          <div className="flex flex-col gap-2.5 sm:gap-3">
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                question={item.q}
                answer={item.a}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>

        {/* ── Contact form column ── */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5 sm:p-8 lg:sticky lg:top-24">
            {/* Header */}
            <div className="mb-5 sm:mb-6">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                {t('contacts.questions_title')}
              </h3>
              <p className="text-gray-500 text-sm">{t('contacts.questions_desc')}</p>
            </div>

            <ContactForm source="Bosh sahifa (savollar bo'limi)" />
          </div>
        </div>
      </div>
    </section>
  );
}
