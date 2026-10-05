// Interior catalog categories
export interface CatalogCategory {
  id: string;
  title: string;
  slug: string;
  href: string;
  imgSrc: string;
  price: string;
  unit: string;
  type: 'interior' | 'facade';
  description?: string;
  visible?: boolean;
}

export const interiorCategories: CatalogCategory[] = [
{
  id: 'karnizy',
  title: 'Карнизы',
  slug: 'karnizy',
  href: '/catalog/karnizy/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/f10/z0ulpr0jecyxzxcyu01e30owt04kwdpw/310_210_1/www.dikart.ru_Dk_204_216Hx220mm_3D.png',
  price: 'от 438',
  unit: 'руб./п.м.',
  type: 'interior',
  visible: true
},
{
  id: 'rozetki',
  title: 'Розетки',
  slug: 'rozetki',
  href: '/catalog/rozetki/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/00b/sw370ccdlyft83nrbsh5t52l74q4szqg/310_210_1/3_1_.png',
  price: 'от 402',
  unit: 'руб./шт.',
  type: 'interior',
  visible: true
},
{
  id: 'moldinghi',
  title: 'Молдинги',
  slug: 'arched-frame',
  href: '/catalog/arched-frame/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/c5d/ttyxkjhh8f0w0q15f50glf0n1qsklyx8/310_210_1/6_1_.png',
  price: 'от 234',
  unit: 'руб./п.м.',
  type: 'interior',
  visible: true
},
{
  id: 'friezes',
  title: 'Фризы',
  slug: 'friezes',
  href: '/catalog/friezes/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/e63/oz5ro83kzg1ej2ukzvkyewo7z8zw8wz2/310_210_1/www.dikart_1_1_.png',
  price: 'от 408',
  unit: 'руб./п.м.',
  type: 'interior',
  visible: true
},
{
  id: 'cutting',
  title: 'Порезки',
  slug: 'cutting',
  href: '/catalog/cutting/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/97a/omm2t8qvs8rfya773hq8v3k82x7w90s2/310_210_1/www.mzgi.ru_K025.75Hx60mm_1_.png',
  price: 'от 262',
  unit: 'руб./п.м.',
  type: 'interior',
  visible: true
},
{
  id: 'ceiling-tracks',
  title: 'Потолочные композиции',
  slug: 'ceiling-tracks',
  href: '/catalog/ceiling-tracks/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/65b/ubkwdj920eizdzul87taf3x4dsip9uc9/310_210_1/www.dikart.ru_Kompozitsiya_19V_3D.png',
  price: 'от 3 741',
  unit: 'руб./компл.',
  type: 'interior',
  visible: true
},
{
  id: 'decorative-frame',
  title: 'Декоративные рамки',
  slug: 'decorative-frame',
  href: '/catalog/decorative-frame/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/5ea/o99j7eucs3dgrwhaqard5z2hdx33fqks/310_210_1/777.png',
  price: 'от 12 441',
  unit: 'руб./компл.',
  type: 'interior',
  visible: true
},
{
  id: 'corners',
  title: 'Углы',
  slug: 'corners',
  href: '/catalog/corners/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/8b6/6l290ijljtwx71ya3srfbh9aq9s3l8yl/310_210_1/8.png',
  price: 'от 133',
  unit: 'руб./шт.',
  type: 'interior',
  visible: true
},
{
  id: 'the-gutters',
  title: 'Средники',
  slug: 'the-gutters',
  href: '/catalog/the-gutters/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/114/9id8lvbeh9absyfefoa8yrjqyz2wd2wz/310_210_1/10.png',
  price: 'от 36',
  unit: 'руб./шт.',
  type: 'interior',
  visible: true
},
{
  id: 'decorative-fireplaces',
  title: 'Декоративные камины',
  slug: 'decorative-fireplaces',
  href: '/catalog/decorative-fireplaces/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/99e/74zopoo6bxnbbb8kk7o2okyyp25g30dt/310_210_1/12.png',
  price: 'от 26 571',
  unit: 'руб./компл.',
  type: 'interior',
  visible: true
},
{
  id: 'decorative-portals',
  title: 'Декоративные порталы',
  slug: 'decorative-portals',
  href: '/catalog/decorative-portals/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/3cc/1cp0px4fd06vs5ttsh30a8qe2nw012uf/310_210_1/15.png',
  price: 'от 10 064',
  unit: 'руб./компл.',
  type: 'interior',
  visible: true
},
{
  id: '3d-panel',
  title: '3D-панели',
  slug: '3d-panel',
  href: '/catalog/3d-panel/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/5be/ikkw1nhjkck3jigrc11z373pgwi8fqu8/310_210_1/www.dikart.ru_Listya_1185x872x45mm_3D.png',
  price: 'от 324',
  unit: 'руб./шт.',
  type: 'interior',
  visible: false
},
{
  id: 'panels',
  title: 'Панно',
  slug: 'panels',
  href: '/catalog/panels/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/c2c/bjf3wx67ljhru4deejrr9x2qw7ade9ey/310_210_1/Dikart_lev_Panno.png',
  price: 'от 1 195',
  unit: 'руб./шт.',
  type: 'interior',
  visible: false
},
{
  id: 'brackets',
  title: 'Кронштейны',
  slug: 'brackets',
  href: '/catalog/brackets/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/06d/rsl7wzzoua5nm6ezm1s82mm52rjpi8wz/310_210_1/9.png',
  price: 'от 126',
  unit: 'руб./шт.',
  type: 'interior',
  visible: false
},
{
  id: 'sculpture',
  title: 'Скульптуры и Ниши',
  slug: 'sculpture',
  href: '/catalog/sculpture/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/76f/jycgafxltnf3wwgc4kuqv8fqsa1hyb2l/310_210_1/00.png',
  price: 'от 2 329',
  unit: 'руб./шт.',
  type: 'interior',
  visible: false
},
{
  id: 'caryatids',
  title: 'Кариатиды и Атланты',
  slug: 'caryatids',
  href: '/catalog/caryatids/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/4d4/c2a31glh0yapn6vquywbgp1zox6rt9mz/310_210_1/Bez_imeni_1_1_.png',
  price: 'от 2 737',
  unit: 'руб./шт.',
  type: 'interior',
  visible: false
},
{
  id: 'columns',
  title: 'Колонны',
  slug: 'columns',
  href: '/catalog/columns/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/62d/jmue2hzgt81f4b7whajq6v8x6x4emf3q/310_210_1/17.png',
  price: 'от 7 799',
  unit: 'руб./компл.',
  type: 'interior',
  visible: false
},
{
  id: 'baseboards',
  title: 'Плинтусы',
  slug: 'baseboards',
  href: '/catalog/baseboards/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/798/mcrrylawm15jyiqjd9fgmh7t80mos3nd/310_210_1/16.png',
  price: 'от 863',
  unit: 'руб./п.м.',
  type: 'interior',
  visible: false
},
{
  id: 'pilasters',
  title: 'Пилястры',
  slug: 'pilasters',
  href: '/catalog/pilasters/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/a0b/hy7j21jur2ugqsseg1tu1aze1cnvx6cu/310_210_1/18.png',
  price: 'от 6 823',
  unit: 'руб./компл.',
  type: 'interior',
  visible: false
},
{
  id: 'dome',
  title: 'Купола',
  slug: 'dome',
  href: '/catalog/dome/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/912/zwhmbk2rqopoyyi4dw8oh19gmd2kyh5l/310_210_1/www.dikart.ru_Kupol_1_D2478x354mm_3D.png',
  price: 'от 66 953',
  unit: 'руб./шт',
  type: 'interior',
  visible: false
},
{
  id: 'solutions-for-ventilation',
  title: 'Вентиляционные решения',
  slug: 'solutions-for-ventilation',
  href: '/catalog/solutions-for-ventilation/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/437/cc4w0gk6gkn3istcgkaag7qk3zqt3smu/310_210_1/www.dikart.ru_Dk_219_137Hx148mm_3D-_2_.png',
  price: 'от 1 366',
  unit: 'руб./п.м.',
  type: 'interior',
  visible: false
},
{
  id: 'svetovye-resheniya',
  title: 'Световые решения',
  slug: 'svetovye-resheniya',
  href: '/catalog/svetovye-resheniya/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/ca5/se23nlugr7ps5zdhzm21rwjnwa46rttw/310_210_1/1._Ptichki.jpg',
  price: 'от 4 025',
  unit: 'руб./компл.',
  type: 'interior',
  visible: false
},
{
  id: 'ventilyatsionnye-reshetki',
  title: 'Вентиляционные решетки',
  slug: 'ventilyatsionnye-reshetki',
  href: '/catalog/ventilyatsionnye-reshetki/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/3d4/cahzx5bxrj1o28fy8uhhtru3fob4qcv2/310_210_1/www.dikart.ru_D3_200Hx300mm_3D.png',
  price: 'от 2 974',
  unit: 'руб./шт.',
  type: 'interior',
  visible: false
},
{
  id: 'ventilyatsionnye-diffuzory',
  title: 'Вентиляционные диффузоры',
  slug: 'ventilyatsionnye-diffuzory',
  href: '/catalog/ventilyatsionnye-diffuzory/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/741/wl8i1ujhqzs264n51qqspl6jrucm7w21/310_210_1/www.dikart.ru_Diffuzor_B3_3D.png',
  price: 'от 990',
  unit: 'руб./шт.',
  type: 'interior',
  visible: false
}];


export const facadeCategories: CatalogCategory[] = [
{
  id: 'facade-karnizy',
  title: 'Карнизы',
  slug: 'karnizy',
  href: '/catalog-facade/karnizy/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/9c9/r9374rvllg1q4195tp4n4xw26r0iz74c/310_210_1/Dk_373_SFB.png',
  price: 'от 438',
  unit: 'руб./п.м.',
  type: 'facade',
  visible: true
},
{
  id: 'facade-moldinghi',
  title: 'Молдинги',
  slug: 'arched-frame',
  href: '/catalog-facade/arched-frame/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/613/edacue6tqxo169gs9kiymkurwsus4n0r/310_210_1/M_182_SFB.png',
  price: 'от 234',
  unit: 'руб./п.м.',
  type: 'facade',
  visible: true
},
{
  id: 'facade-friezes',
  title: 'Фризы',
  slug: 'friezes',
  href: '/catalog-facade/friezes/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/d77/ulzy7fwkaxi0qol4ie65s2iha4daebru/310_210_1/Df_283_SFB.png',
  price: 'от 408',
  unit: 'руб./п.м.',
  type: 'facade',
  visible: true
},
{
  id: 'facade-corners',
  title: 'Углы',
  slug: 'corners',
  href: '/catalog-facade/corners/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/53a/rgol3pb14w1nss6r9s5se7g3ydrssz06/310_210_1/Du_74_SFB.png',
  price: 'от 133',
  unit: 'руб./шт.',
  type: 'facade',
  visible: true
},
{
  id: 'facade-3d-panel',
  title: '3D-панели',
  slug: '3d-panel',
  href: '/catalog-facade/3d-panel/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/591/b974tcw10k2ebcif5gg41kt7am2507ac/310_210_1/Rust_1_SFB.png',
  price: 'от 324',
  unit: 'руб./шт.',
  type: 'facade',
  visible: false
},
{
  id: 'facade-columns',
  title: 'Колонны',
  slug: 'columns',
  href: '/catalog-facade/columns/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/a40/6qlpwljod2ojvkf3ylijpxoigbtkgu84/310_210_1/D_641_SFB.png',
  price: 'от 7 799',
  unit: 'руб./компл.',
  type: 'facade',
  visible: false
},
{
  id: 'facade-pilasters',
  title: 'Пилястры',
  slug: 'pilasters',
  href: '/catalog-facade/pilasters/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/253/485tks16sm8dadwv2nbbxoldxorhw3sa/310_210_1/P_613_SFB.png',
  price: 'от 6 823',
  unit: 'руб./компл.',
  type: 'facade',
  visible: false
},
{
  id: 'facade-dekorativnye-elementy',
  title: 'Декоративные элементы',
  slug: 'dekorativnye-elementy',
  href: '/catalog-facade/dekorativnye-elementy/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/3ce/is5yh7zu2uqfdklsf8r2v9skvr5t9s7v/310_210_1/Panno_50_SFB.png',
  price: 'от 470',
  unit: 'руб./шт.',
  type: 'facade',
  visible: false
},
{
  id: 'facade-nakladki',
  title: 'Накладки на торец плиты перекрытия',
  slug: 'nakladki-na-torets-plity-perekrytiya',
  href: '/catalog-facade/nakladki-na-torets-plity-perekrytiya/',
  imgSrc: 'https://dikart.ru/upload/iblock/f9f/4gcqo6dnfwv56v51vbxbpb65o2c230bp/www.dikart.ru_Dnt_1_SFB_196Hx88mm_3D.png',
  price: 'от 7 351',
  unit: 'руб./шт.',
  type: 'facade',
  visible: false
},
{
  id: 'facade-obramleniya-dverey',
  title: 'Обрамления дверей',
  slug: 'obramleniya-dverey',
  href: '/catalog-facade/obramleniya-dverey/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/7c5/gi40jsqxi32ayoa9ui38qsmhaf8kptvb/310_210_1/Portal_8_SFB.png',
  price: 'от 14 696',
  unit: 'руб./шт.',
  type: 'facade',
  visible: false
},
{
  id: 'facade-windows',
  title: 'Окна',
  slug: 'windows',
  href: '/catalog-facade/windows/',
  imgSrc: 'https://dikart.ru/upload/iblock/a08/b30cgoxa3q7vsf6rdfm9cqzbtwdvu66f/www.dikart.ru_Okno_1_SFB_2695x2320mm_3D.png',
  price: 'от 77 213',
  unit: 'руб./шт.',
  type: 'facade',
  visible: false
}];


export const services = [
{
  id: 'design-project',
  title: 'Индивидуальное проектирование',
  href: '/design-project/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/1cc/jjyiic2agrpb3eobha3vuuvc6ftl2vv4/310_210_1/Rectangle-136-_1_.jpg'
},
{
  id: 'montazh',
  title: 'Профессиональный монтаж',
  href: '/montazh/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/9dd/gv9tkiygpgd2y962ftyo666lmhlyiu0b/310_210_1/Rectangle-12.jpg'
},
{
  id: 'measurements',
  title: 'Услуги замерщика',
  href: '/measurements/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/90e/kwvrhmwi09c1ruzvq8rn3xde0hpje5m3/310_210_1/Rectangle-137.jpg'
},
{
  id: 'delivery',
  title: 'Доставка',
  href: '/delivery/',
  imgSrc: 'https://dikart.ru/upload/resize_cache/iblock/99c/rr1wjxog59l3atou655gpfav41k7poan/310_210_1/Rectangle-139.jpg'
}];