'use client';

import React from 'react';
import NextLink from 'next/link';
import {
  usePathname as useNextPathname,
  useRouter as useNextRouter,
  redirect as nextRedirect,
} from 'next/navigation';
import { useLocale } from 'next-intl';

export const locales = ['uz', 'ru', 'en'] as const;
export const defaultLocale = 'uz';

export function localizeHref(href: string, locale: string): string {
  if (
    !href ||
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#')
  ) {
    return href;
  }

  // URL query va hash larni ajratib olamiz
  const [baseAndQuery, hash] = href.split('#');
  const [pathname, search] = baseAndQuery.split('?');

  let clean = pathname;
  for (const l of locales) {
    if (clean === `/${l}` || clean.startsWith(`/${l}/`)) {
      clean = clean.slice(l.length + 1) || '/';
      break;
    }
  }
  if (!clean.startsWith('/')) clean = '/' + clean;

  let localized = clean;
  if (locale && locale !== defaultLocale) {
    localized = `/${locale}${clean === '/' ? '' : clean}`;
  }

  const queryPart = search ? `?${search}` : '';
  const hashPart = hash ? `#${hash}` : '';
  return `${localized}${queryPart}${hashPart}`;
}

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  locale?: string;
  children?: React.ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, locale: propLocale, ...props },
  ref
) {
  let activeLocale = propLocale;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const currentLocale = useLocale();
    if (!activeLocale) activeLocale = currentLocale;
  } catch {
    // server / outside Intl context fallback
  }
  const finalHref = localizeHref(href, activeLocale || defaultLocale);

  return React.createElement(NextLink, { ref, href: finalHref, ...props });
});

export function usePathname(): string {
  const pathname = useNextPathname();
  if (!pathname) return '';
  for (const l of locales) {
    if (pathname === `/${l}` || pathname.startsWith(`/${l}/`)) {
      const stripped = pathname.slice(l.length + 1);
      return stripped ? (stripped.startsWith('/') ? stripped : '/' + stripped) : '/';
    }
  }
  return pathname;
}

export function useRouter() {
  const router = useNextRouter();
  let currentLocale = defaultLocale;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    currentLocale = useLocale() || defaultLocale;
  } catch {
    // fallback
  }

  return {
    ...router,
    push(href: string, options?: { locale?: string }) {
      const targetLocale = options?.locale || currentLocale;
      return router.push(localizeHref(href, targetLocale));
    },
    replace(href: string, options?: { locale?: string }) {
      const targetLocale = options?.locale || currentLocale;
      return router.replace(localizeHref(href, targetLocale));
    },
  };
}

export function redirect(params: string | { href: string; locale?: string }) {
  if (typeof params === 'string') {
    return nextRedirect(params);
  }
  return nextRedirect(localizeHref(params.href, params.locale || defaultLocale));
}
