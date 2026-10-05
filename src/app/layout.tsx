import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '../styles/index.css';

const inter = Inter({ subsets: ['cyrillic', 'latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['cyrillic', 'latin'], variable: '--font-playfair' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Лепнина для интерьера - купить лепной декор от завода Дикарт',
  description: '⚜️ Завод гипсовой лепнины Дикарт. Изготовление, доставка, монтаж, дизайн и индивидуальное проектирование для Вашего интерьера.',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased text-text bg-white">{children}</body>
    </html>
  );
}
