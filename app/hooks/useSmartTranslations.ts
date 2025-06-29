import { useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useUserPreferences } from './use-user-preferences';
import { commonTranslations } from '../translations/dictionaries/common';
import { newsTranslations } from '../translations/dictionaries/news';
import { navigationTranslations } from '../translations/dictionaries/navigation';
import { profileTranslations } from '../translations/dictionaries/profile';
import { researchTranslations } from '../translations/dictionaries/research';

type TranslationDictionary = Record<string, any>;
type LocaleCode = 'en' | 'es' | 'cs' | 'ru';
type TranslationVariables = Record<string, string | number>;

// Combine all translation dictionaries
const allTranslations: Record<string, TranslationDictionary> = {
  en: {
    common: commonTranslations.en,
    news: newsTranslations.en,
    navigation: navigationTranslations.en,
    profile: profileTranslations.en,
    research: researchTranslations.en,
  },
  es: {
    common: commonTranslations.es,
    news: newsTranslations.es,
    navigation: navigationTranslations.es,
    profile: profileTranslations.es,
    research: researchTranslations.es,
  },
  cs: {
    common: commonTranslations.cs,
    news: newsTranslations.cs,
    navigation: navigationTranslations.cs,
    profile: profileTranslations.cs,
    research: researchTranslations.cs,
  },
  ru: {
    common: commonTranslations.ru,
    news: newsTranslations.ru,
    navigation: navigationTranslations.ru,
    profile: profileTranslations.ru,
    research: researchTranslations.ru,
  }
};

// ✅ ENHANCED: Variable interpolation function
const interpolateVariables = (text: string, variables?: TranslationVariables): string => {
  if (!variables || typeof text !== 'string') return text;
  
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    const value = variables[key];
    return value !== undefined ? String(value) : match;
  });
};

export function useSmartTranslations(forceLocale?: LocaleCode) {
  const params = useParams();
  const { preferences } = useUserPreferences();
  
  // Memoize locale determination
  const locale = useMemo(() => {
    // 1. Force locale (highest priority)
    if (forceLocale) return forceLocale;
    
    // 2. User preferences (second priority)
    if (preferences?.language && ['en', 'es', 'cs', 'ru'].includes(preferences.language)) {
      return preferences.language as LocaleCode;
    }
    
    // 3. URL params (third priority)
    const urlLocale = params?.locale as LocaleCode;
    if (urlLocale && ['es', 'cs', 'ru'].includes(urlLocale)) {
      return urlLocale;
    }
    
    // 4. Default to English
    return 'en' as LocaleCode;
  }, [forceLocale, preferences?.language, params]);

  const translations = useMemo(() => {
    return allTranslations[locale] || allTranslations.en;
  }, [locale]);

  const t = useCallback((key: string, fallback?: string, variables?: TranslationVariables): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    const text = value || fallback || key;

    return interpolateVariables(text, variables);
  }, [translations]);

  const isTranslationActive = useMemo(() => locale !== 'en', [locale]);
  const userPreferredLanguage = useMemo(() => preferences?.language || 'en', [preferences?.language]);

  return { 
    t, 
    locale,
    isTranslationActive,
    userPreferredLanguage
  };
}

export function useNewsTranslations(forceLocale?: LocaleCode) {
  const { t, locale, isTranslationActive, userPreferredLanguage } = useSmartTranslations(forceLocale);
  
  const newsT = useCallback((key: string, fallback?: string, variables?: TranslationVariables) => {
    return t(`news.${key}`, fallback, variables);
  }, [t]);

  return {
    t: newsT,
    locale,
    isTranslationActive,
    userPreferredLanguage
  };
}

export function useCommonTranslations(forceLocale?: LocaleCode) {
  const { t, locale, isTranslationActive, userPreferredLanguage } = useSmartTranslations(forceLocale);
  
  const commonT = useCallback((key: string, fallback?: string, variables?: TranslationVariables) => {
    return t(`common.${key}`, fallback, variables);
  }, [t]);

  return {
    t: commonT,
    locale,
    isTranslationActive,
    userPreferredLanguage
  };
}

export function useNavigationTranslations(forceLocale?: LocaleCode) {
  const { t, locale, isTranslationActive, userPreferredLanguage } = useSmartTranslations(forceLocale);
  
  const navigationT = useCallback((key: string, fallback?: string, variables?: TranslationVariables) => {
    return t(`navigation.${key}`, fallback, variables);
  }, [t]);

  return {
    t: navigationT,
    locale,
    isTranslationActive,
    userPreferredLanguage
  };
}

export function useProfileTranslations(forceLocale?: LocaleCode) {
  const { t, locale, isTranslationActive, userPreferredLanguage } = useSmartTranslations(forceLocale);
  
  const profileT = useCallback((key: string, fallback?: string, variables?: TranslationVariables) => {
    return t(`profile.${key}`, fallback, variables);
  }, [t]);

  return {
    t: profileT,
    locale,
    isTranslationActive,
    userPreferredLanguage
  };
}

export function useResearchTranslations(forceLocale?: LocaleCode) {
  const { t, locale, isTranslationActive, userPreferredLanguage } = useSmartTranslations(forceLocale);
  
  const researchT = useCallback((key: string, fallback?: string, variables?: TranslationVariables) => {
    return t(`research.${key}`, fallback, variables);
  }, [t]);

  return {
    t: researchT,
    locale,
    isTranslationActive,
    userPreferredLanguage
  };
}