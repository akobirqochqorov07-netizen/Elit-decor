'use client';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function ProcessPath() {
    const t = useTranslations('ProcessPath');

    const steps = [
        {
            t: t('step1_title'),
            d: t('step1_desc'),
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12h20M12 2v20" />
                    <path d="M7 7l-5 5 5 5M17 7l5 5-5 5" />
                </svg>
            ),
        },
        {
            t: t('step2_title'),
            d: t('step2_desc'),
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                </svg>
            ),
        },
        {
            t: t('step3_title'),
            d: t('step3_desc'),
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                </svg>
            ),
        },
        {
            t: t('step4_title'),
            d: t('step4_desc'),
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="1" />
                    <path d="M16 8h4l3 6v4h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="1.5" />
                    <circle cx="18.5" cy="18.5" r="1.5" />
                </svg>
            ),
        },
        {
            t: t('step5_title'),
            d: t('step5_desc'),
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.121 2.121 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                </svg>
            ),
        },
    ];

    return (
        /* No overflow:hidden here — critical for PinnedProcess sticky to work */
        <div className="py-16 bg-gray-50 w-full">
            <div className="container mx-auto px-4" style={{ maxWidth: '1200px' }}>

                {/* Section heading — site-consistent style */}
                <div className="text-center mb-14">
                    <h2 className="font-sans text-3xl md:text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
                        {t('section_title')}
                    </h2>
                    <div className="w-24 h-1 mx-auto rounded bg-accent mb-4" />
                    <p className="text-gray-600 text-base">
                        {t('section_desc')}
                    </p>
                </div>

                {/* Desktop: horizontal */}
                <div className="hidden md:block relative">
                    {/* Background rail */}
                    <div className="absolute top-[52px] left-[10%] right-[10%] h-px bg-accent/15 overflow-visible">
                        {/* Animated fill — .fl class for PinnedProcess CSS */}
                        <div className="fl absolute inset-0 bg-gradient-to-r from-accent to-amber-300" />
                    </div>

                    <div className="grid grid-cols-5 gap-4 relative z-10">
                        {steps.map((s, i) => (
                            /* .st class + data-step for PinnedProcess animation */
                            <div className="st flex flex-col items-center text-center" data-step key={s.t}>
                                <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center mb-5 border border-accent bg-white">
                                    {s.icon}
                                </div>
                                <span className="text-xs font-bold mb-1 tracking-widest uppercase text-accent">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <h3 className="font-sans font-bold text-sm md:text-base mb-2 text-gray-800 leading-tight">
                                    {s.t}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{s.d}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile: vertical */}
                <div className="md:hidden flex flex-col gap-0 relative">
                    {/* Vertical rail */}
                    <div className="absolute left-[29px] top-0 bottom-0 w-px bg-accent/20">
                        <div className="fl absolute inset-0 bg-gradient-to-b from-accent to-amber-300" />
                    </div>

                    {steps.map((s, i) => (
                        <div className="st flex gap-5 pb-10 relative z-10" data-step key={s.t + '-m'}>
                            <div className="w-[58px] h-[58px] flex-shrink-0 rounded-full flex items-center justify-center border border-accent bg-white">
                                {s.icon}
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-xs font-bold tracking-widest uppercase mb-0.5 text-accent">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <h3 className="font-sans font-bold text-base mb-1 text-gray-800">{s.t}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{s.d}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
