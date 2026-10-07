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
  title: 'Elit Dekor — Ganch lepnin zavodi',
  description: 'Elit Dekor — interyer va fasad uchun ganch mahsulotlari ishlab chiqaruvchi zavod. Samarqand.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased text-text bg-white">
        {children}
      </body>
    </html>
  );
}
