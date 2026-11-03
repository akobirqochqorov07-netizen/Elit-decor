import React from 'react';

// Elit Dekor uchun o'zimizning ikonkalar (emoji emas): to'q ko'k kontur + oltin va yashil urg'u.
const NAVY = '#152f40';
const GOLD = '#d4af37';
const GREEN = '#12a870';

export type FeatureIconName = 'eco' | 'fire' | 'paint' | 'care' | 'time';

const common = {
  viewBox: '0 0 32 32',
  fill: 'none',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export default function FeatureIcon({ name, size = 28 }: { name: FeatureIconName; size?: number }) {
  switch (name) {
    // Ekologik material — barg (yashil) + tomir
    case 'eco':
      return (
        <svg {...common} width={size} height={size}>
          <path d="M6 26C6 14 13 7 26 6c0 13-7 20-20 20Z" fill={GREEN} fillOpacity="0.9" stroke={NAVY} strokeWidth="1.8" />
          <path d="M6 26 19 13" stroke={NAVY} strokeWidth="1.8" />
          <path d="M13 19.5h5M16.5 16.5h5" stroke="#fff" strokeWidth="1.4" />
        </svg>
      );
    // Yong'inga chidamli — qalqon ichida olov
    case 'fire':
      return (
        <svg {...common} width={size} height={size}>
          <path d="M16 3.5 5.5 7.5v8c0 6.2 4.2 10.4 10.5 13 6.3-2.6 10.5-6.8 10.5-13v-8L16 3.5Z" stroke={NAVY} strokeWidth="1.8" fill="#fff" />
          <path
            d="M16 24.5c-3.3 0-5.5-2.2-5.5-5.2 0-2.6 1.7-4.2 3-6 .4 1.4 1.2 2.2 2 2.6.3-2 .2-3.8-.8-5.6 3.6 1.4 6.8 4.6 6.8 8.8 0 3.1-2.2 5.4-5.5 5.4Z"
            fill={GOLD}
            stroke={NAVY}
            strokeWidth="1.4"
          />
        </svg>
      );
    // Bo'yaladi — rangli valik
    case 'paint':
      return (
        <svg {...common} width={size} height={size}>
          <rect x="5" y="5.5" width="19" height="8" rx="2.2" fill={GOLD} stroke={NAVY} strokeWidth="1.8" />
          <path d="M24 9.5h3v6.5H16v3.5" stroke={NAVY} strokeWidth="1.8" />
          <rect x="13.5" y="19.5" width="5" height="8" rx="1.6" fill={GREEN} stroke={NAVY} strokeWidth="1.8" />
          <path d="M8.5 9.5h9" stroke="#fff" strokeWidth="1.4" />
        </svg>
      );
    // Ehtiyotkorlik bilan qadoqlash — quti
    case 'care':
      return (
        <svg {...common} width={size} height={size}>
          <path d="M16 4.5 5.5 9.8v12.4L16 27.5l10.5-5.3V9.8L16 4.5Z" fill="#fff" stroke={NAVY} strokeWidth="1.8" />
          <path d="M16 4.5 5.5 9.8 16 15l10.5-5.2L16 4.5Z" fill={GOLD} stroke={NAVY} strokeWidth="1.8" />
          <path d="M16 15v12.5" stroke={NAVY} strokeWidth="1.8" />
          <path d="M20.5 12.3 11 7.5" stroke={NAVY} strokeWidth="1.4" />
        </svg>
      );
    // 24 soat — aylanma strelka va "24"
    case 'time':
      return (
        <svg {...common} width={size} height={size}>
          <path d="M16 4.5a11.5 11.5 0 1 1-8.3 3.6" stroke={GREEN} strokeWidth="2.2" />
          <path d="M5.2 4.8 7.9 8.4l3.6-2.4" stroke={GREEN} strokeWidth="2.2" />
          <text x="16" y="20.2" textAnchor="middle" fontSize="11" fontWeight="800" fill={NAVY} fontFamily="Arial, sans-serif">
            24
          </text>
        </svg>
      );
    default:
      return null;
  }
}
