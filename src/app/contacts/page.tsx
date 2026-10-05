'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { CartProvider } from '@/context/CartContext';
import brand from '@/lib/brand';

export default function ContactsPage() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-green-600">Главная</Link>
              <span>/</span>
              <span className="text-gray-800">Контакты</span>
            </nav>

            <h1 className="text-3xl font-medium text-gray-800 mb-8">Контакты</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {brand.addresses.map((contact, i) => (
                <div key={i} className="border border-gray-200 rounded p-6">
                  <h2 className="text-xl font-medium text-gray-800 mb-4">{contact?.name}</h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6FC727" strokeWidth="1.5" className="flex-shrink-0 mt-0.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <div>
                        <p className="text-gray-800">{contact?.city}</p>
                        <p className="text-gray-600">{contact?.street}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6FC727" strokeWidth="1.5">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <a href={contact?.phoneHref} className="text-gray-800 hover:text-green-600">{contact?.phone}</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6FC727" strokeWidth="1.5">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <a href={`mailto:${contact?.email}`} className="text-gray-800 hover:text-green-600">{contact?.email}</a>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6FC727" strokeWidth="1.5" className="flex-shrink-0 mt-0.5">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <p className="text-gray-600 whitespace-pre-line">{contact?.hours}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact form */}
            <div className="border-t border-gray-100 pt-10">
              <h2 className="text-2xl font-medium text-gray-800 mb-2">Остались вопросы?</h2>
              <p className="text-gray-600 mb-6">Заполните форму и мы свяжемся с вами</p>
              <ContactForm />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
