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

export const mainNavigation: NavItem[] = [
  {
    title: 'Kompaniya haqida',
    href: '/about/',
    hasSubmenu: true,
    children: [
      { title: 'Biz haqimizda', href: '/about/' },
      { title: 'Hujjatlar', href: '/information_for_client/' },
      { title: 'Mijozlar sharhlari', href: '/reviews/' },
      { title: 'Video lavhalar', href: '/video/' },
    ],
  },
  {
    title: 'Mahsulotlar katalogi',
    href: '/catalog/',
    hasSubmenu: true,
    children: [
      { title: 'Interyer dekori', href: '/catalog/interior/' },
      { title: 'Fasad dekori', href: '/catalog-facade/' },
      { title: '3D Panellar', href: '/catalog/3d-panel/' },
      { title: 'Maxsus yechimlar', href: '/catalog/special/' },
    ],
  },
  {
    title: 'Galereya',
    href: '/gallery/',
  },
  {
    title: 'Virtual Showroom',
    href: '/virtual-showroom/',
  },
  {
    title: 'Xizmatlar',
    href: '/services/',
    hasSubmenu: true,
    children: [
      { title: 'O\'rnatish (Montaj)', href: '/montazh/' },
      { title: 'O\'lcham olish', href: '/measurements/' },
      { title: 'Dizayner xizmatlari', href: '/design-project/' },
      { title: 'Yetkazib berish', href: '/delivery/' },
    ],
  },
  {
    title: 'Aloqa',
    href: '/contacts/',
  }
];

export const footerNav1 = [
  { title: 'О компании', href: '/about/' },
  { title: 'Каталог', href: '/catalog/' },
  { title: 'Галерея', href: '/gallery/' },
  { title: 'Услуги', href: '/services/' },
  { title: 'Контакты', href: '/contacts/' },
];

export const footerNav2 = [
  { title: 'Стеклофибробетон', href: '/fasad/' },
  { title: '3D-модели', href: '/3d-library/' },
  { title: 'Стеклофиброгипс', href: '/fibrogips/' },
  { title: 'Политика конфиденциальности', href: '/information_for_client/7951/' },
  { title: 'Согласие на получение рекламно-информационной рассылки', href: '/information_for_client/1812841/' },
];

export const footerNav3 = [
  { title: 'Блог', href: '/articles/' },
  { title: 'Видео-уроки', href: '/video/' },
  { title: 'Экскурсии', href: 'https://meetdikart.tilda.ws/' },
  { title: 'Карта сайта', href: '/sitemap/' },
  { title: 'Написать директору', href: '/director/' },
];
