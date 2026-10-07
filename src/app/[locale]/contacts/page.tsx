import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { CartProvider } from '@/context/CartContext';
import { getTranslations } from 'next-intl/server';
import brand from '@/lib/brand';

export default async function ContactsPage() {
  const t = await getTranslations('ContactsPage');

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8" style={{ maxWidth: '1200px' }}>
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-green-600">{t('breadcrumb_home')}</Link>
              <span>/</span>
              <span className="text-gray-800">{t('breadcrumb_contacts')}</span>
            </nav>

            <h1 className="text-4xl font-bold text-gray-900 mb-8 border-l-4 border-accent pl-4">
              {t('title')}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Left Side: Info & Map */}
              <div className="space-y-8">
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 bg-accent text-white flex justify-center items-center rounded-full shadow-lg">1</span>
                    {t('address_name')}
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" className="flex-shrink-0 mt-1">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <div>
                        <p className="text-gray-900 font-medium text-lg">{brand.addresses[0]?.city}</p>
                        <p className="text-gray-600">{t('address_street')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <a href={brand.addresses[0]?.phoneHref} className="text-gray-900 font-bold hover:text-accent text-lg">{brand.addresses[0]?.phone}</a>
                    </div>
                    <div className="flex items-center gap-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <a href={`mailto:${brand.addresses[0]?.email}`} className="text-gray-900 hover:text-accent font-medium text-lg">{brand.addresses[0]?.email}</a>
                    </div>
                    <div className="flex items-start gap-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" className="flex-shrink-0 mt-1">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <p className="text-gray-600 whitespace-pre-line leading-relaxed">{t('address_hours')}</p>
                    </div>
                  </div>
                </div>

                {/* Map Embed */}
                <div className="rounded-xl overflow-hidden shadow-lg border-2 border-accent/20 h-[450px] relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.868725838573!2d69.11-69.2401!3d41.2995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1684499120610!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>

              {/* Right Side: Contact form */}
              <div className="bg-white border flex flex-col border-gray-100 rounded-xl p-10 shadow-2xl relative overflow-hidden h-fit">
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent opacity-[0.05] rounded-bl-[100%] pointer-events-none"></div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3 relative z-10">{t('form_panel_title')}</h2>
                <p className="text-gray-500 mb-8 relative z-10 text-lg leading-relaxed">{t('form_panel_desc')}</p>
                <div className="relative z-10">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
