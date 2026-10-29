import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { allKarnizlar, allKataloglar, getKarnizlarByKatalog, getMinNarx } from '@/data/karnizlar';

export default function KarnizlarPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-1">
                <div className="mx-auto px-4 sm:px-6 py-5" style={{ maxWidth: '1200px' }}>

                    {/* Breadcrumb */}
                    <nav className="flex flex-wrap items-center text-base mb-5" style={{ color: '#333' }}>
                        <Link href="/" className="hover:underline">Bosh sahifa</Link>
                        <span className="mx-1 text-gray-400">/</span>
                        <span>Karnizlar</span>
                    </nav>

                    {/* H1 */}
                    <h1 className="mb-3" style={{ fontSize: '48px', fontWeight: 400, color: '#333', lineHeight: 1.15 }}>
                        Interyer karnizlar
                    </h1>
                    <p className="text-gray-500 mb-8 max-w-2xl text-base">
                        Elit Dekor zavodidan gips karnizlarining to&apos;liq assortimenti. {allKataloglar.length} ta o&apos;lcham guruhida {allKarnizlar.length} ta model.
                    </p>

                    {/* 5 ta subkategoriya plitkalari */}
                    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                        {allKataloglar.map((katalog) => {
                            const items = getKarnizlarByKatalog(katalog.slug);
                            const minNarx = getMinNarx(katalog.slug);
                            const previewItem = items[0];

                            return (
                                <Link
                                    key={katalog.slug}
                                    href={`/katalog/karnizlar/${katalog.slug}/`}
                                    className="group block overflow-hidden transition-all duration-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ed-green)]"
                                    style={{ backgroundColor: '#152f40' }}
                                >
                                    {/* Rasm */}
                                    <div
                                        className="relative w-full"
                                        style={{ aspectRatio: '4/3', backgroundColor: '#152f40' }}
                                    >
                                        {previewItem && (
                                            <Image
                                                src={previewItem.rasm_kok}
                                                alt={katalog.nomi}
                                                fill
                                                sizes="(max-width: 640px) 50vw, 220px"
                                                style={{ objectFit: 'contain', padding: '12px' }}
                                                loading="lazy"
                                            />
                                        )}
                                    </div>

                                    {/* Yashil lenta */}
                                    <div
                                        className="px-3 py-2 flex flex-col gap-0.5"
                                        style={{ background: 'var(--ed-green-grad)' }}
                                    >
                                        <span className="text-white text-xs font-medium">
                                            {minNarx ? `dan ${minNarx.toLocaleString('uz-UZ')} so'm/p.m.` : "Narx so'rang"}
                                        </span>
                                        <span className="text-white font-bold text-sm leading-tight">
                                            {katalog.nomi}
                                        </span>
                                        <span className="text-white/80 text-xs">{items.length} ta model</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* SEO matn */}
                    <div className="mt-16 max-w-2xl">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                            Karnizlar — gips lepninadan
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-3">
                            Elit Dekor — O&apos;zbekistonda interyer va fasad uchun gips mahsulotlari ishlab chiqaruvchi zavod.
                            Karnizlarimiz yuqori sifatli G-16 markali gipsdan tayyorlanib, interyerga nafosatli ko&apos;rinish beradi.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Har bir karnizning 3D modeli va texnik chizmasi mavjud. O&apos;rnatish xizmati ko&apos;rsatiladi.
                            Narx va o&apos;lchamlar bo&apos;yicha mutaxassislarimizga murojaat qiling.
                        </p>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
