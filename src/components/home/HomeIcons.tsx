import React from 'react';

// O'zimizning ikonkalar (dikart.ru dan olinmaydi). Rang `currentColor` dan olinadi.
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
};

const paths: Record<string, React.ReactNode> = {
  // Oliy sifat — medal
  quality: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.7 13.6 7 21l5-2.6 5 2.6-1.7-7.4" />
      <path d="m9.9 9 1.5 1.5 2.7-3" />
    </>
  ),
  // Keng assortiment — to'rtta blok
  assortment: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  // Kompleks yondashuv — bajarilgan vazifalar
  complex: (
    <>
      <path d="M9 4h6l1 2h3v14H5V6h3l1-2Z" />
      <path d="m8.8 13.2 2.2 2.2 4.2-4.6" />
    </>
  ),
  // Boy tajriba — soat/kalendar
  experience: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.2 2" />
    </>
  ),
  // Statistika: kafolat (qalqon)
  shield: (
    <>
      <path d="M12 3 5 6v5.5c0 4.3 2.9 7.6 7 9.5 4.1-1.9 7-5.2 7-9.5V6l-7-3Z" />
      <path d="m9 12 2.2 2.2L15.2 10" />
    </>
  ),
  // Statistika: dizaynerlar (qalam-chizg'ich)
  design: (
    <>
      <path d="m4 20 1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1Z" />
      <path d="m14.5 6.5 3 3" />
    </>
  ),
  // Statistika: loyihalar (uy)
  home: (
    <>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v10h12V10" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
};

export type HomeIconName = keyof typeof paths;

export default function HomeIcon({ name, className }: { name: HomeIconName; className?: string }) {
  return (
    <svg {...base} className={className}>
      {paths[name]}
    </svg>
  );
}
