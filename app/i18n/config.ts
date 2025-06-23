export const locales = ['en', 'es', 'cs'] as const; // Updated to match your translations
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  es: 'Español', 
  cs: 'Čeština' 
};

export const localeDetection = {
  strategy: 'user-preference' as const,
  fallback: defaultLocale,
  cookieName: 'user-locale'
};