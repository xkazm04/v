import { useMemo } from 'react';

type TranslationKey = string;
type Translations = Record<string, any>;

const translations: Record<string, Translations> = {
  en: {
    navigation: {
      home: "Home",
      dashboard: "Dashboard", 
      reel: "Reel",
      upload: "Upload",
      education: "Education"
    },
    common: {
      loading: "Loading...",
      active: "Active",
      available: "Available",
      enhanced: "Enhanced",
      live: "Live"
    }
  },
  es: {
    navigation: {
      home: "Inicio",
      dashboard: "Panel", 
      reel: "Reel",
      upload: "Subir",
      education: "Educación"
    },
    common: {
      loading: "Cargando...",
      active: "Activo",
      available: "Disponible",
      enhanced: "Mejorado",
      live: "En vivo"
    }
  },
  cs: {
    navigation: {
      home: "Domů",
      dashboard: "Panel", 
      reel: "Reel",
      upload: "Nahrát",
      education: "Vzdělání"
    },
    common: {
      loading: "Načítání...",
      active: "Aktivní",
      available: "Dostupné",
      enhanced: "Vylepšené",
      live: "Živě"
    }
  }
};

export function useSimpleTranslations(locale: string = 'en') {
  const t = useMemo(() => {
    const localeTranslations = translations[locale] || translations.en;
    
    return (key: string) => {
      const keys = key.split('.');
      let value: any = localeTranslations;
      
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
      
      return value || key;
    };
  }, [locale]);

  return t;
}