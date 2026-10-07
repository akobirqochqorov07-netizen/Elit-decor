'use client';
import { useEffect, useRef } from 'react';

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export default function PinnedProcess({ children }: { children: React.ReactNode }) {
    const wrap = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const w = wrap.current;
        if (!w) return;
        const steps = Array.from(w.querySelectorAll<HTMLElement>('[data-step]'));
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let target = 0, cur = 0, raf = 0;

        const tick = () => {
            raf = 0;
            cur += (target - cur) * 0.1;
            if (Math.abs(target - cur) < 0.001) cur = target;
            w.style.setProperty('--p', String(cur));
            steps.forEach((s, i) => s.classList.toggle('on', cur >= i / (steps.length - 1) - 0.03));
            if (cur !== target) raf = requestAnimationFrame(tick);
        };

        const measure = () => {
            const h = document.querySelector('header') as HTMLElement | null;
            const top = h && getComputedStyle(h).position !== 'static' ? h.offsetHeight : 0;
            w.style.setProperty('--hh', top + 'px');
            const r = w.getBoundingClientRect();
            const vh = window.innerHeight;
            if (reduce) target = 1;
            else if (window.innerWidth > 860)
                target = clamp((top - r.top) / (r.height - (vh - top)));
            else
                target = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.3));
            if (!raf) raf = requestAnimationFrame(tick);
        };

        w.dataset.js = '1';
        measure();
        window.addEventListener('scroll', measure, { passive: true });
        window.addEventListener('resize', measure);
        return () => {
            window.removeEventListener('scroll', measure);
            window.removeEventListener('resize', measure);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <div className="pin" ref={wrap}>
            <div className="pin-in">{children}</div>
        </div>
    );
}
