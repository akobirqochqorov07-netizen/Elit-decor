'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

import { mainNavigation } from '@/data/navigation';
import { useCart } from '@/context/CartContext';
import brand from '@/lib/brand';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [loginDropdown, setLoginDropdown] = useState(false);
  const [callbackModalOpen, setCallbackModalOpen] = useState(false);
  const { totalItems } = useCart();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setSearchOpen(false);
        setCallbackModalOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Header */}
      <header className="header-wrapper bg-white sticky top-0 z-50 shadow-md pb-4">
        {/* Top bar */}
        <div className="header-top py-3">
          <div className="container mx-auto px-4" style={{ maxWidth: '1200px' }}>
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <img
                  src={brand.logo}
                  alt={brand.fullName}
                  className="h-24 w-auto"
                  style={{ maxHeight: '96px' }}
                />
              </Link>

              {/* City */}
              <div className="hidden md:flex items-center text-base font-semibold text-gray-800">
                <span className="mr-1 text-gray-500 font-normal">Lokatsiya:</span>
                <a href="#" className="hover:text-accent transition-colors">{brand.city}</a>
              </div>

              {/* Work hours */}
              <div className="hidden lg:block text-base font-semibold text-gray-800">
                {brand.workHours.map((h, i) => <p key={i}>{h}</p>)}
              </div>

              {/* Email */}
              <div className="hidden lg:block text-base font-semibold text-gray-800">
                <span className="text-gray-500 font-normal">Pochta:</span>
                <a href={brand.emailHref} className="ml-1 hover:text-accent transition-colors">{brand.email}</a>
              </div>

              {/* Phones */}
              <div className="hidden md:block text-base font-bold text-gray-900">
                <p><a href={brand.phoneHref} className="hover:text-accent transition-colors">{brand.phone}</a></p>
                <p><a href={brand.phoneHref2} className="hover:text-accent transition-colors">{brand.phone2}</a></p>
              </div>

              {/* Right buttons */}
              <div className="flex items-center gap-2">
                {/* Language Switcher */}
                <div className="hidden md:flex items-center text-sm font-medium border border-gray-200 rounded overflow-hidden shadow-sm mr-2">
                  <button className="px-2 py-1 bg-primary text-white hover:bg-primary-dark transition-colors">UZ</button>
                  <button className="px-2 py-1 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border-l border-r border-gray-200">RU</button>
                  <button className="px-2 py-1 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">EN</button>
                </div>

                {/* Search */}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="flex items-center justify-center w-9 h-9 hover:text-accent transition-colors"
                  aria-label="Поиск"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>

                {/* Hamburger */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex flex-col gap-1 p-1 md:hidden"
                  aria-label="Меню"
                >
                  <span className="block w-6 h-0.5 bg-gray-700"></span>
                  <span className="block w-6 h-0.5 bg-gray-700"></span>
                  <span className="block w-6 h-0.5 bg-gray-700"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-b border-gray-200 bg-white">
            <div className="container mx-auto px-4" style={{ maxWidth: '1200px' }}>
              <form action="/search/" method="get" className="flex items-center py-2 gap-2">
                <input
                  ref={searchRef}
                  type="text"
                  name="q"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Поиск по каталогу..."
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary-dark transition-colors">
                  Найти
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Navigation menu */}
        <nav className="hidden md:block border-t-2 border-b-2 border-accent bg-white mt-4 relative">
          <div className="container mx-auto px-4" style={{ maxWidth: '1200px' }}>
            <ul className="flex items-center justify-between">
              {mainNavigation.map((item) => (
                <li
                  key={item.title}
                  className="relative group block"
                  onMouseEnter={() => item.hasSubmenu && setActiveSubmenu(item.title)}
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 py-4 text-[17px] text-gray-900 hover:text-accent transition-colors whitespace-nowrap font-bold"
                  >
                    {item.title}
                    {item.hasSubmenu && (
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="mt-0.5 opacity-70">
                        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                  </Link>
                  {item.hasSubmenu && item.children && activeSubmenu === item.title && (
                    <div className="absolute top-full left-0 bg-white border border-gray-200 shadow-lg z-50 min-w-[200px] py-2"
                      style={{ columns: item.children.length > 12 ? 2 : 1, columnGap: '0' }}>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-1.5 text-sm text-gray-700 hover:text-accent hover:bg-gray-50 transition-colors whitespace-nowrap"
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 w-80 max-w-full h-full bg-white overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <img src={brand.logo} alt={brand.name} className="h-10 w-auto" />
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-1">Ваш город: <span className="text-gray-800">{brand.city}</span></p>
              <p className="text-sm font-medium mb-1"><a href={brand.phoneHref}>{brand.phone}</a></p>
              <p className="text-xs text-gray-500 mb-4">{brand.workHours.join(' | ')}</p>
            </div>
            <nav>
              {mainNavigation.map((item) => (
                <MobileNavItem key={item.title} item={item} onClose={() => setMobileMenuOpen(false)} />
              ))}
            </nav>
            <div className="p-4 border-t">
              <button
                onClick={() => { setCallbackModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full bg-primary text-white py-2 rounded text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Заказать звонок
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Callback Modal */}
      {callbackModalOpen && (
        <CallbackModal onClose={() => setCallbackModalOpen(false)} />
      )}
    </>
  );
}

function MobileNavItem({ item, onClose }: { item: typeof mainNavigation[0]; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <div className="flex items-center justify-between">
        <Link href={item.href} className="flex-1 px-4 py-3 text-sm text-gray-700 font-medium" onClick={onClose}>
          {item.title}
        </Link>
        {item.hasSubmenu && (
          <button onClick={() => setOpen(!open)} className="px-4 py-3 text-gray-500">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
              <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      {open && item.children && (
        <div className="bg-gray-50 pl-4">
          {item.children.map((child) => (
            <Link key={child.href} href={child.href} className="block px-4 py-2 text-sm text-gray-600 hover:text-accent" onClick={onClose}>
              {child.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function CallbackModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; agreed?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Введите имя';
    if (!phone.trim()) newErrors.phone = 'Введите телефон';
    if (!agreed) newErrors.agreed = 'Необходимо согласие';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-accent text-5xl mb-4">✓</div>
            <h3 className="text-xl font-semibold mb-2">Спасибо!</h3>
            <p className="text-gray-600">В ближайшее время мы с Вами свяжемся.</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-4">Заказать звонок</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Имя:</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Иванов Иван Иванович"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Телефон:</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="modal-agree"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5"
                />
                <label htmlFor="modal-agree" className="text-xs text-gray-500">
                  Я согласен с обработкой персональных данных в соответствии с{' '}
                  <Link href="/information_for_client/7951/" className="text-green-600 hover:underline">политикой конфиденциальности</Link>
                </label>
              </div>
              {errors.agreed && <p className="text-red-500 text-xs">{errors.agreed}</p>}
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded font-medium hover:bg-primary-dark transition-colors"
              >
                Заказать звонок
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
