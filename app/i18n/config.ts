export const locales = ['en', 'es', 'fr', 'de'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch'
};

export const localeDetection = {
  strategy: 'user-preference' as const,
  fallback: defaultLocale,
  cookieName: 'user-locale'
};