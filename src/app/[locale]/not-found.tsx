'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="text-center px-4">
                <h1 className="text-8xl font-bold text-accent mb-4">404</h1>
                <h2 className="text-2xl font-medium text-gray-800 mb-4">Sahifa topilmadi / Страница не найдена</h2>
                <p className="text-gray-600 mb-8">Siz qidirgan sahifa mavjud emas yoki o'chirilgan.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/" className="bg-primary text-white px-8 py-3 rounded font-medium hover:bg-primary-dark transition-colors">
                        Bosh sahifaga
                    </Link>
                    <Link href="/catalog/" className="border border-primary text-primary px-8 py-3 rounded font-medium hover:bg-gray-50 transition-colors">
                        Katalogga
                    </Link>
                </div>
            </div>
        </div>
    );
}
