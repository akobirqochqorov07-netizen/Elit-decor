import { getRequestConfig } from 'next-intl/server';

export const locales = ['uz', 'ru', 'en'];

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !locales.includes(locale as any)) {
        locale = 'uz';
    }

    return {
        locale: locale as string,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
