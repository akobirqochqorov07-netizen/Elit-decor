import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    // Barcha mavjud tillar qatori (A locale list)
    locales: ['uz', 'ru', 'en'],

    // Boshlang'ich (default) til
    defaultLocale: 'uz',

    // Locale prefix url da default tilda ishlatilmaydi
    localePrefix: 'as-needed'
});

export const config = {
    // Qaysi manzillar middleware orqali o'tkaziladi
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
