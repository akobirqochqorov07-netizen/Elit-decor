import React from 'react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }) {
    const t = await getTranslations({ locale: params.locale, namespace: 'VirtualShowroom' });
    return {
        title: `${t('hero_title')} | Elit Dekor`,
        description: `${t('hero_desc')} ${t('hero_interactive')} ${t('hero_desc2')}`,
    };
}

export default async function VirtualShowroomPage() {
    const t = await getTranslations('VirtualShowroom');

    const rooms = [
        {
            title: t('room1_title'),
            desc:  t('room1_desc'),
            img:   'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80',
        },
        {
            title: t('room2_title'),
            desc:  t('room2_desc'),
            img:   'https://images.unsplash.com/photo-1545042746-ec9f44b2afad?auto=format&fit=crop&q=80',
        },
        {
            title: t('room3_title'),
            desc:  t('room3_desc'),
            img:   'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Banner */}
            <div className="relative py-24 bg-dark overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80"
                        alt="Showroom Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-dark to-transparent"></div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 tracking-wide drop-shadow-md">
                        {t('hero_title')}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
                        {t('hero_desc')}
                        <span className="text-accent font-medium mx-1">{t('hero_interactive')}</span>
                        {t('hero_desc2')}
                    </p>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="container mx-auto px-4 py-16 flex-1" style={{ maxWidth: '1200px' }}>

                {/* 360 Panorama Placeholder */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 mb-16 group">
                    <div className="relative h-[600px] w-full flex items-center justify-center bg-gray-900 overflow-hidden cursor-crosshair">
                        <img
                            src="https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=2000"
                            alt="360 View"
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="relative z-10 backdrop-blur-md bg-white/10 border border-white/20 p-8 rounded-2xl flex flex-col items-center max-w-sm text-center">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white mb-4 animate-pulse" strokeWidth="1.5">
                                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                            </svg>
                            <h3 className="text-white font-serif text-2xl mb-2">{t('panorama_title')}</h3>
                            <p className="text-gray-200 text-sm font-light">{t('panorama_desc')}</p>
                            <button className="mt-6 px-6 py-2 bg-accent text-white rounded hover:bg-yellow-600 transition-colors tracking-wide text-sm">
                                {t('panorama_btn')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Room Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rooms.map((room, idx) => (
                        <div key={idx} className="bg-white rounded overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group">
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={room.img}
                                    alt={room.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <div className="p-6">
                                <h4 className="font-serif text-xl text-gray-800 mb-2">{room.title}</h4>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.desc}</p>
                                <Link href="#" className="inline-flex items-center text-accent hover:text-primary transition-colors text-sm font-medium">
                                    {t('enter_btn')} <span className="ml-2">→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
