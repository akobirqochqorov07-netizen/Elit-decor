'use client';
/**
 * /katalog/karnizlar/[slug]/page.tsx
 * Yagona katalog komponenti — tanlangan guruh oldindan faol.
 */

import { use, Suspense } from 'react';
import KarnizCatalogListing from '@/components/karnizlar/KarnizCatalogListing';

export default function KarnizKatalogPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <KarnizCatalogListing initialGroup={slug} />
        </Suspense>
    );
}
