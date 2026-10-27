'use client';
/**
 * CookieBar — DIKART uslubida cookie bildirishnoma.
 * localStorage ga eslab qoladi, bosilgach yo'qoladi.
 */
import { useState, useEffect } from 'react';

const COOKIE_KEY = 'ed_cookie_accepted';

export default function CookieBar() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            if (!localStorage.getItem(COOKIE_KEY)) setVisible(true);
        } catch {
            // localStorage bloklangan bo'lsa, ko'rsatmaymiz
        }
    }, []);

    const handleAccept = () => {
        try { localStorage.setItem(COOKIE_KEY, '1'); } catch { /* ignore */ }
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white px-4 py-3 flex flex-wrap items-center justify-between gap-3"
            style={{ boxShadow: '0 -2px 12px rgba(0,0,0,0.08)' }}
        >
            <p className="text-sm text-gray-600 flex-1 min-w-[200px]">
                Veb-saytimiz to&apos;g&apos;ri ishlashi uchun cookie fayllaridan foydalanamiz.{' '}
                <a href="/privacy" className="underline" style={{ color: '#86c540' }}>
                    Maxfiylik siyosati
                </a>
            </p>
            <button
                onClick={handleAccept}
                className="px-6 py-2 text-white font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#86c540' }}
            >
                OK
            </button>
        </div>
    );
}
