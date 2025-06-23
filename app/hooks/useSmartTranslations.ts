import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { commonTranslations } from '../translations/dictionaries/common';
import { newsTranslations } from '../translations/dictionaries/news';
import { navigationTranslations } from '../translations/dictionaries/navigation';

type TranslationDictionary = Record<string, any>;
type LocaleCode = 'en' | 'es' | 'cs';

// Combine all translation dictionaries
const allTranslations: Record<string, TranslationDictionary> = {
  en: {
    common: commonTranslations.en,
    news: newsTranslations.en,
    navigation: navigationTranslations.en,
  },
  es: {
    common: commonTranslations.es,
    news: newsTranslations.es,
    navigation: navigationTranslations.es,
  },
  cs: {
    common: commonTranslations.cs,
    news: newsTranslations.cs,
    navigation: navigationTranslations.cs,
  }
};

export function useSmartTranslations(forceLocale?: LocaleCode) {
  const params = useParams();
  
  // Determine locale: forceLocale > URL params > default 'en'
  const locale = useMemo(() => {
    if (forceLocale) return forceLocale;
    
    // Check if we're on a localized route
    const urlLocale = params?.locale as LocaleCode;
    if (urlLocale && ['es', 'cs'].includes(urlLocale)) {
      return urlLocale;
    }
    
    // Default to English for non-localized routes
    return 'en' as LocaleCode;
  }, [forceLocale, params]);

  const t = useMemo(() => {
    const localeTranslations = allTranslations[locale] || allTranslations.en;
    
    return (key: string, fallback?: string) => {
      const keys = key.split('.');
      let value: any = localeTranslations;
      
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
      
      // Return value, fallback, or key as last resort
      return value || fallback || key;
    };
  }, [locale]);

  return { t, locale };
}

// Convenience hooks for specific domains
export function useNewsTranslations(forceLocale?: LocaleCode) {
  const { t, locale } = useSmartTranslations(forceLocale);
  return {
    t: (key: string, fallback?: string) => t(`news.${key}`, fallback),
    locale
  };
}

export function useCommonTranslations(forceLocale?: LocaleCode) {
  const { t, locale } = useSmartTranslations(forceLocale);
  return {
    t: (key: string, fallback?: string) => t(`common.${key}`, fallback),
    locale
  };
}

export function useNavigationTranslations(forceLocale?: LocaleCode) {
  const { t, locale } = useSmartTranslations(forceLocale);
  return {
    t: (key: string, fallback?: string) => t(`navigation.${key}`, fallback),
    locale
  };
}