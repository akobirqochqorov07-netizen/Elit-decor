'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ServiceTimeline() {
    const t = useTranslations('ServiceTimeline');
    const sectionRef = useRef<HTMLDivElement>(null);
    const [revealed, setRevealed] = useState<boolean[]>(Array(5).fill(false));
    const [lineProgress, setLineProgress] = useState(0);

    const steps = [
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12h20M12 2v20M7 7l-5 5 5 5M17 7l5 5-5 5" />
                </svg>
            ),
            title: t('step1_title'),
            desc: t('step1_desc'),
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
            ),
            title: t('step2_title'),
            desc: t('step2_desc'),
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4" />
                </svg>
            ),
            title: t('step3_title'),
            desc: t('step3_desc'),
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="1" />
                    <path d="M16 8h4l3 6v4h-7V8zM5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
            ),
            title: t('step4_title'),
            desc: t('step4_desc'),
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.121 2.121 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                </svg>
            ),
            title: t('step5_title'),
            desc: t('step5_desc'),
        },
    ];

    const prefersReduced =
        typeof window !== 'undefined'
            ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
            : false;

    useEffect(() => {
        if (prefersReduced) {
            setRevealed(Array(steps.length).fill(true));
            setLineProgress(1);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();

                // Animate line progress from 0 → 1 over 1400ms
                const duration = 1400;
                const start = performance.now();
                const animateLine = (now: number) => {
                    const t = Math.min((now - start) / duration, 1);
                    setLineProgress(t);
                    if (t < 1) requestAnimationFrame(animateLine);
                };
                requestAnimationFrame(animateLine);

                // Reveal steps one by one, staggered
                steps.forEach((_, i) => {
                    setTimeout(() => {
                        setRevealed(prev => { const n = [...prev]; n[i] = true; return n; });
                    }, 200 + i * 280);
                });
            },
            { threshold: 0.25 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, [prefersReduced]);

    return (
        <section ref={sectionRef} className="py-20" style={{ background: '#f6f1e6' }}>
            <div className="container mx-auto px-4" style={{ maxWidth: '1200px' }}>
                {/* Section heading */}
                <div className="text-center mb-16">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 uppercase tracking-wider" style={{ color: '#0F4C81' }}>
                        {t('section_title')}
                    </h2>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px w-24" style={{ background: '#c9a84c', opacity: 0.6 }} />
                        <div className="w-2.5 h-2.5 rotate-45 border-2" style={{ borderColor: '#c9a84c' }} />
                        <div className="w-2.5 h-2.5 rotate-45" style={{ background: '#c9a84c' }} />
                        <div className="w-2.5 h-2.5 rotate-45 border-2" style={{ borderColor: '#c9a84c' }} />
                        <div className="h-px w-24" style={{ background: '#c9a84c', opacity: 0.6 }} />
                    </div>
                </div>

                {/* Desktop: horizontal */}
                <div className="hidden md:block relative">
                    {/* Animated connecting line */}
                    <div className="absolute top-[52px] left-[10%] right-[10%] h-px overflow-hidden" style={{ background: 'rgba(201,168,76,0.15)' }}>
                        <div
                            className="h-full origin-left transition-none"
                            style={{
                                background: 'linear-gradient(to right, #c9a84c, #e8c96b)',
                                transform: `scaleX(${lineProgress})`,
                                transition: prefersReduced ? 'none' : 'transform 1.4s cubic-bezier(0.4,0,0.2,1)',
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-5 gap-4 relative z-10">
                        {steps.map((step, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center text-center"
                                style={{
                                    opacity: revealed[i] ? 1 : 0,
                                    transform: revealed[i] ? 'translateY(0)' : 'translateY(8px)',
                                    transition: prefersReduced ? 'none' : 'opacity 0.5s ease, transform 0.5s ease',
                                }}
                            >
                                {/* Icon circle */}
                                <div
                                    className="w-[60px] h-[60px] rounded-full flex items-center justify-center mb-5 border"
                                    style={{ background: '#f6f1e6', borderColor: '#c9a84c' }}
                                >
                                    {step.icon}
                                </div>
                                {/* Step number */}
                                <span className="text-xs font-bold mb-1 tracking-widest uppercase" style={{ color: '#c9a84c' }}>
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <h3 className="font-serif font-bold text-base mb-2 leading-tight" style={{ color: '#0F4C81' }}>
                                    {step.title}
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#5a5040' }}>
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile: vertical */}
                <div className="md:hidden flex flex-col gap-0 relative">
                    {/* Vertical line */}
                    <div className="absolute left-[29px] top-[60px] bottom-[30px] w-px" style={{ background: '#c9a84c', opacity: 0.3 }} />

                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className="flex gap-5 pb-10"
                            style={{
                                opacity: revealed[i] ? 1 : 0,
                                transform: revealed[i] ? 'translateY(0)' : 'translateY(8px)',
                                transition: prefersReduced ? 'none' : 'opacity 0.5s ease, transform 0.5s ease',
                            }}
                        >
                            <div
                                className="w-[58px] h-[58px] flex-shrink-0 rounded-full flex items-center justify-center border"
                                style={{ background: '#f6f1e6', borderColor: '#c9a84c' }}
                            >
                                {step.icon}
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#c9a84c' }}>
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <h3 className="font-serif font-bold text-base mb-1" style={{ color: '#0F4C81' }}>
                                    {step.title}
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#5a5040' }}>
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
