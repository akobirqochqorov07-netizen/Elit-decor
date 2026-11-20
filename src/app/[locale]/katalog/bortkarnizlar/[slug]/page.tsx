'use client';

import { use, Suspense } from 'react';
import KarnizCatalogListing from '@/components/karnizlar/KarnizCatalogListing';

export default function BortkarnizKatalogPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <KarnizCatalogListing initialGroup={slug} bolim="bortkarnizlar" />
        </Suspense>
    );
}
