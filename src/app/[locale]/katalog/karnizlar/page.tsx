import { Suspense } from 'react';
import KarnizCatalogListing from '@/components/karnizlar/KarnizCatalogListing';

export default function KarnizlarPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <KarnizCatalogListing initialGroup="all" />
        </Suspense>
    );
}
