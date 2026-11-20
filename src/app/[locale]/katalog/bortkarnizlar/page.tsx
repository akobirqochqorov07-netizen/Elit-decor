import { Suspense } from 'react';
import KarnizCatalogListing from '@/components/karnizlar/KarnizCatalogListing';

export default function BortkarnizlarPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <KarnizCatalogListing initialGroup="all" bolim="bortkarnizlar" />
        </Suspense>
    );
}
