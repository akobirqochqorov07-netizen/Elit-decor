import React from 'react';
import Link from 'next/link';
import { footerNav1, footerNav2, footerNav3 } from '@/data/navigation';
import brand from '@/lib/brand';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0a2734', color: '#ffffff' }}>
      <div className="container mx-auto px-4 py-10" style={{ maxWidth: '1200px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo */}
          <div className="lg:col-span-1">
            <Link href="/">
              <img src={brand?.logoFooter} alt="ДИКАРТ" className="h-12 w-auto mb-3" />
            </Link>
            <img src="https://dikart.ru/local/templates/dikart-new/images/img-24.png" alt="" className="h-8 w-auto" />
          </div>

          {/* Nav 1 */}
          <div>
            <ul className="space-y-2">
              {footerNav1?.map((item) =>
                <li key={item?.href}>
                  <Link href={item?.href} className="text-sm text-white hover:text-green-400 transition-colors">
                    {item?.title}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Nav 2 */}
          <div>
            <ul className="space-y-2">
              {footerNav2?.map((item) =>
                <li key={item?.href}>
                  <Link href={item?.href} className="text-sm text-white hover:text-green-400 transition-colors">
                    {item?.title}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Nav 3 */}
          <div>
            <ul className="space-y-2">
              {footerNav3?.map((item) =>
                <li key={item?.href}>
                  <Link href={item?.href} className="text-sm text-white hover:text-green-400 transition-colors">
                    {item?.title}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Social + Payment */}
          <div>
            {/* Social icons */}
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex gap-2">
                <a href={brand?.social?.vk} target="_blank" rel="noopener noreferrer">
                  <img src="https://dikart.ru/local/templates/dikart-new/images/soc/1.svg" alt="VK" className="w-7 h-7" />
                </a>
                <a href={brand?.social?.max} target="_blank" rel="noopener noreferrer">
                  <img src="https://dikart.ru/local/templates/dikart-new/images/soc/max-messenger-logo.svg" alt="Max" className="w-7 h-7" />
                </a>
                <a href={brand?.social?.telegram} target="_blank" rel="noopener noreferrer">
                  <img src="https://dikart.ru/local/templates/dikart-new/images/soc/3.svg" alt="Telegram" className="w-7 h-7" />
                </a>
              </div>
              <div className="flex gap-2">
                <a href={brand?.social?.youtube} target="_blank" rel="noopener noreferrer">
                  <img src="https://dikart.ru/local/templates/dikart-new/images/soc/4.svg" alt="YouTube" className="w-7 h-7" />
                </a>
                <a href={brand?.social?.dzen} target="_blank" rel="noopener noreferrer">
                  <img src="https://dikart.ru/local/templates/dikart-new/images/soc/2.svg" alt="Dzen" className="w-7 h-7" />
                </a>
                <a href={brand?.social?.pinterest} target="_blank" rel="noopener noreferrer">
                  <img src="https://dikart.ru/local/templates/dikart-new/images/soc/6.svg" alt="Pinterest" className="w-7 h-7" />
                </a>
              </div>
              <div className="flex gap-2">
                <a href={brand?.social?.ddd} target="_blank" rel="noopener noreferrer">
                  <img src="https://dikart.ru/local/templates/dikart-new/images/soc/5.svg" alt="3DDD" className="w-7 h-7" />
                </a>
                <a href={brand?.social?.houzz} target="_blank" rel="noopener noreferrer">
                  <img src="https://dikart.ru/local/templates/dikart-new/images/soc/logo-houzz.svg" alt="Houzz" className="w-7 h-7" />
                </a>
                <a href={brand?.social?.rutube} target="_blank" rel="noopener noreferrer">
                  <img src="https://dikart.ru/local/templates/dikart-new/images/soc/rutube-logo.svg" alt="Rutube" className="w-7 h-7" />
                </a>
              </div>
            </div>

            {/* Payment */}
            <div>
              <p className="text-xs text-gray-400 mb-2">Системы платежей</p>
              <div className="flex gap-2 items-center">
                <img src="https://dikart.ru/local/templates/dikart-new/images/img-25.png" alt="Платежная система" className="h-6 w-auto" />
                <img src="https://dikart.ru/local/templates/dikart-new/images/img-26.png" alt="Платежная система" className="h-6 w-auto" />
                <img src="https://dikart.ru/local/templates/dikart-new/images/img-27.png" alt="Платежная система" className="h-6 w-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-400 leading-relaxed">
            © {new Date().getFullYear()} Все материалы данного сайта являются объектами авторского права. Запрещается
            использование указанных материалов в коммерческих целях.
          </p>
        </div>
      </div>
    </footer>);

}