'use client';

import { use } from 'react';
import ProductDetail from '@/components/karnizlar/ProductDetail';

export default function Page({ params }: { params: Promise<{ slug: string; kod: string }> }) {
    const { slug, kod } = use(params);
    return <ProductDetail slug={slug} kod={kod} bolim="bortkarnizlar" />;
}
