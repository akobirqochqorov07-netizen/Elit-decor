import ProductDetail from '@/components/karnizlar/ProductDetail';

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string; kod: string; locale: string }>;
}) {
    const { slug, kod } = await params;
    return <ProductDetail slug={slug} kod={kod} bolim="karnizlar" />;
}
