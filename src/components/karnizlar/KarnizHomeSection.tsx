'use client';

import React from 'react';
import CategoryTiles from '@/components/catalog/CategoryTiles';

interface KarnizHomeSectionProps {
  title: string;
}

/** Bosh sahifa: Interyer dekorlari katalogi — Karnizlar va Bortkarnizlar. */
export default function KarnizHomeSection({ title }: KarnizHomeSectionProps) {
  return (
    <section className="py-10">
      <h2 className="text-2xl font-medium text-gray-800 mb-6">{title}</h2>
      <CategoryTiles />
    </section>
  );
}
