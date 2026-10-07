// Navigation data
export interface NavSubItem {
  title: string;
  href: string;
}

export interface NavItem {
  title: string;
  href: string;
  children?: NavSubItem[];
  hasSubmenu?: boolean;
}

export const getMainNavigation = (t: any): NavItem[] => [
  {
    title: t('about'),
    href: '/#about',
  },
  {
    title: t('catalog'),
    href: '/catalog/',
    hasSubmenu: true,
    children: [
      { title: t('catalog_interior'), href: '/catalog/interior/' },
      { title: t('catalog_facade'), href: '/catalog-facade/' },
      { title: t('catalog_3d'), href: '/catalog/3d-panel/' },
      { title: t('catalog_special'), href: '/catalog/special/' },
    ],
  },
  {
    title: t('gallery'),
    href: '/gallery/',
  },
  {
    title: t('virtual_showroom'),
    href: '/virtual-showroom/',
  },
  {
    title: t('services'),
    href: '/services/',
  },
  {
    title: t('contacts'),
    href: '/contacts/',
  },
];

// Footer navigation — used with translation function
export const getFooterNav1 = (t: any) => [
  { title: t('nav_about'),    href: '/about/' },
  { title: t('nav_catalog'),  href: '/catalog/' },
  { title: t('nav_gallery'),  href: '/gallery/' },
  { title: t('nav_services'), href: '/services/' },
  { title: t('nav_contacts'), href: '/contacts/' },
];

export const getFooterNav2 = (t: any) => [
  { title: t('nav_fibrobeton'),  href: '/fasad/' },
  { title: t('nav_3d'),         href: '/3d-library/' },
  { title: t('nav_fibrogips'),  href: '/fibrogips/' },
  { title: t('nav_privacy'),    href: '/information_for_client/7951/' },
  { title: t('nav_newsletter'), href: '/information_for_client/1812841/' },
];

export const getFooterNav3 = (t: any) => [
  { title: t('nav_blog'),      href: '/articles/' },
  { title: t('nav_video'),     href: '/video/' },
  { title: t('nav_tours'),     href: 'https://meetdikart.tilda.ws/' },
  { title: t('nav_sitemap'),   href: '/sitemap/' },
  { title: t('nav_director'),  href: '/director/' },
];
