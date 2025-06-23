export const countryMap: Record<string, { flag: string; name: string }> = {
    'US': { flag: '🇺🇸', name: 'United States' },
    'CA': { flag: '🇨🇦', name: 'Canada' },
    'GB': { flag: '🇬🇧', name: 'United Kingdom' },
    'DE': { flag: '🇩🇪', name: 'Germany' },
    'FR': { flag: '🇫🇷', name: 'France' },
    'IT': { flag: '🇮🇹', name: 'Italy' },
    'ES': { flag: '🇪🇸', name: 'Spain' },
    'AU': { flag: '🇦🇺', name: 'Australia' },
    'JP': { flag: '🇯🇵', name: 'Japan' },
    'CN': { flag: '🇨🇳', name: 'China' },
    'IN': { flag: '🇮🇳', name: 'India' },
    'BR': { flag: '🇧🇷', name: 'Brazil' },
    'MX': { flag: '🇲🇽', name: 'Mexico' },
    'RU': { flag: '🇷🇺', name: 'Russia' },
    'ZA': { flag: '🇿🇦', name: 'South Africa' },
    'CZ': { flag: '🇨🇿', name: 'Czech Republic' },
};

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flagSvg: string;
  flag: string;
  description?: string;
  voiceId?: string; 
}

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    flagSvg: '/flags/us.svg',
    description: 'Default language',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    flagSvg: '/flags/es.svg',
    description: 'Traducción automática',
    voiceId: '6xftrpatV0jGmFHxDjUv'
  },
  {
    code: 'cs',
    name: 'Czech',
    nativeName: 'Čeština',
    flag: '🇨🇿',
    flagSvg: '/flags/cz.svg',
    description: 'Automatický překlad',
    voiceId: 'SZXidiHhq5QYe3jRboSZ'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    flagSvg: '/flags/jp.svg',
    description: '自動翻訳',
    voiceId: 'Mv8AjrYZCBkdsmDHNwcB'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    flagSvg: '/flags/fr.svg',
    description: 'Traduction automatique',
    voiceId: 'ohItIVrXTBI80RrUECOD'
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    flagSvg: '/flags/de.svg',
    description: 'Automatische Übersetzung',
    voiceId: 'kkJxCnlRCckmfFvzDW5Q'
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    flagSvg: '/flags/ru.svg',
    description: 'Автоматический перевод',
    voiceId: 'txnCCHHGKmYIwrn7HfHQ'
  },
];

export interface CountryOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  flagSvg: string;
  region: string;
}

export const AVAILABLE_COUNTRIES: CountryOption[] = [
  { code: 'worldwide', name: 'Worldwide', nativeName: 'Global', flag: '🌍', flagSvg: '/flags/worldwide.svg', region: 'Global' },
  { code: 'us', name: 'United States', nativeName: 'United States', flag: '🇺🇸', flagSvg: '/flags/us.svg', region: 'North America' },
  { code: 'uk', name: 'United Kingdom', nativeName: 'United Kingdom', flag: '🇬🇧', flagSvg: '/flags/gb.svg', region: 'Europe' },
  { code: 'ca', name: 'Canada', nativeName: 'Canada', flag: '🇨🇦', flagSvg: '/flags/ca.svg', region: 'North America' },
  { code: 'au', name: 'Australia', nativeName: 'Australia', flag: '🇦🇺', flagSvg: '/flags/au.svg', region: 'Oceania' },
  { code: 'de', name: 'Germany', nativeName: 'Deutschland', flag: '🇩🇪', flagSvg: '/flags/de.svg', region: 'Europe' },
  { code: 'fr', name: 'France', nativeName: 'France', flag: '🇫🇷', flagSvg: '/flags/fr.svg', region: 'Europe' },
  { code: 'es', name: 'Spain', nativeName: 'España', flag: '🇪🇸', flagSvg: '/flags/es.svg', region: 'Europe' },
  { code: 'it', name: 'Italy', nativeName: 'Italia', flag: '🇮🇹', flagSvg: '/flags/it.svg', region: 'Europe' },
  { code: 'jp', name: 'Japan', nativeName: '日本', flag: '🇯🇵', flagSvg: '/flags/jp.svg', region: 'Asia' },
  { code: 'cn', name: 'China', nativeName: '中国', flag: '🇨🇳', flagSvg: '/flags/cn.svg', region: 'Asia' },
  { code: 'in', name: 'India', nativeName: 'भारत', flag: '🇮🇳', flagSvg: '/flags/in.svg', region: 'Asia' },
  { code: 'br', name: 'Brazil', nativeName: 'Brasil', flag: '🇧🇷', flagSvg: '/flags/br.svg', region: 'South America' },
  { code: 'ru', name: 'Russia', nativeName: 'Россия', flag: '🇷🇺', flagSvg: '/flags/ru.svg', region: 'Europe/Asia' },
  { code: 'cz', name: 'Czech Republic', nativeName: 'Česká republika', flag: '🇨🇿', flagSvg: '/flags/cz.svg', region: 'Europe' },
];

export type AvailableCountryType = (typeof AVAILABLE_COUNTRIES)[number];
export type AvailableLanguageType = (typeof AVAILABLE_LANGUAGES)[number];

// Safe getter functions with fallbacks
export const getCountryFlag = (countryCode: string): string => {
    if (!countryCode || !AVAILABLE_COUNTRIES) return '🌍';
    const country = AVAILABLE_COUNTRIES.find(c => c.code.toLowerCase() === countryCode.toLowerCase());
    return country?.flag || '🌍';
};

export const getCountryFlagSvg = (countryCode: string): string => {
    if (!countryCode || !AVAILABLE_COUNTRIES) return '/flags/worldwide.svg';
    const country = AVAILABLE_COUNTRIES.find(c => c.code.toLowerCase() === countryCode.toLowerCase());
    return country?.flagSvg || '/flags/worldwide.svg';
};

export const getCountryName = (countryCode?: string): string => {
    if (!countryCode || !AVAILABLE_COUNTRIES) return '🌍 Global';
    
    const country = AVAILABLE_COUNTRIES.find(c => c.code.toLowerCase() === countryCode.toLowerCase());
    return country ? `${country.flag} ${country.name}` : `🌍 ${countryCode.toUpperCase()}`;
};

export const getLanguageFlag = (languageCode: string): string => {
    if (!languageCode || !AVAILABLE_LANGUAGES) return '🇺🇸';
    const language = AVAILABLE_LANGUAGES.find(l => l.code.toLowerCase() === languageCode.toLowerCase());
    return language?.flag || '🇺🇸';
};

export const getLanguageFlagSvg = (languageCode: string): string => {
    if (!languageCode || !AVAILABLE_LANGUAGES) return '/flags/us.svg';
    const language = AVAILABLE_LANGUAGES.find(l => l.code.toLowerCase() === languageCode.toLowerCase());
    return language?.flagSvg || '/flags/us.svg';
};

export const getLanguageName = (languageCode?: string): string => {
    if (!languageCode || !AVAILABLE_LANGUAGES) return '🇺🇸 English';
    
    const language = AVAILABLE_LANGUAGES.find(l => l.code.toLowerCase() === languageCode.toLowerCase());
    return language ? `${language.flag} ${language.nativeName}` : `🇺🇸 ${languageCode.toUpperCase()}`;
};

// Helper to validate country codes
export const isValidCountryCode = (code: string): boolean => {
    if (!code || !AVAILABLE_COUNTRIES) return false;
    return AVAILABLE_COUNTRIES.some(country => country.code === code);
};

// Helper to validate language codes
export const isValidLanguageCode = (code: string): boolean => {
    if (!code || !AVAILABLE_LANGUAGES) return false;
    return AVAILABLE_LANGUAGES.some(language => language.code === code);
};

// Safe array getters that always return an array
export const getAvailableLanguages = (): LanguageOption[] => {
    return AVAILABLE_LANGUAGES || [];
};

export const getAvailableCountries = (): CountryOption[] => {
    return AVAILABLE_COUNTRIES || [];
};

// Helper to get voice ID for a language
export const getVoiceIdForLanguage = (languageCode: string): string => {
  if (!languageCode || !AVAILABLE_LANGUAGES) return 'JBFqnCBsd6RMkjVDRZzb'; // Default English voice
  
  const language = AVAILABLE_LANGUAGES.find(l => l.code === languageCode);
  return language?.voiceId || 'JBFqnCBsd6RMkjVDRZzb'; // Fallback to English voice
};

// Helper to get language info including voice ID
export const getLanguageInfo = (languageCode: string): LanguageOption | null => {
  if (!languageCode || !AVAILABLE_LANGUAGES) return null;
  
  return AVAILABLE_LANGUAGES.find(l => l.code === languageCode) || null;
};

/**
 * Enhanced country resolution specifically for profile data
 * Handles various country name formats and provides comprehensive fallback
 */
export const getProfileCountryInfo = (country: string | undefined): {
  code: string;
  flagSvg: string | null;
  flagEmoji: string;
  displayName: string;
  isValid: boolean;
  region?: string;
} => {
  if (!country) {
    return {
      code: '',
      flagSvg: null,
      flagEmoji: '🌍',
      displayName: 'Unknown',
      isValid: false
    };
  }

  const normalizedCountry = country.toLowerCase().trim();
  
  // Try exact match first
  let matchedCountry = AVAILABLE_COUNTRIES.find(c => 
    c.code.toLowerCase() === normalizedCountry ||
    c.name.toLowerCase() === normalizedCountry ||
    c.nativeName.toLowerCase() === normalizedCountry
  );

  // Extended variations mapping for common profile data formats
  if (!matchedCountry) {
    const countryVariations: Record<string, string> = {
      // US variations
      'us': 'us', 'usa': 'us', 'united states': 'us', 'america': 'us', 'estados unidos': 'us',
      
      // UK variations  
      'uk': 'uk', 'gb': 'uk', 'great britain': 'uk', 'britain': 'uk', 'england': 'uk', 
      'scotland': 'uk', 'wales': 'uk', 'northern ireland': 'uk',
      
      // Czech variations
      'cz': 'cz', 'czech': 'cz', 'czech republic': 'cz', 'czechia': 'cz', 'česká republika': 'cz',
      
      // Germany variations
      'de': 'de', 'germany': 'de', 'deutschland': 'de', 'alemania': 'de',
      
      // Spain variations
      'es': 'es', 'spain': 'es', 'españa': 'es', 'espanha': 'es',
      
      // France variations
      'fr': 'fr', 'france': 'fr', 'frança': 'fr', 'francia': 'fr',
      
      // Italy variations
      'it': 'it', 'italy': 'it', 'italia': 'it',
      
      // Japan variations
      'jp': 'jp', 'japan': 'jp', '日本': 'jp', 'japón': 'jp', 'japao': 'jp',
      
      // China variations
      'cn': 'cn', 'china': 'cn', '中国': 'cn', 'república popular china': 'cn',
      
      // India variations
      'in': 'in', 'india': 'in', 'भारत': 'in', 'hindustan': 'in',
      
      // Brazil variations
      'br': 'br', 'brazil': 'br', 'brasil': 'br',
      
      // Russia variations
      'ru': 'ru', 'russia': 'ru', 'россия': 'ru', 'rusia': 'ru',
      
      // Australia variations
      'au': 'au', 'australia': 'au', 'oz': 'au',
      
      // Canada variations
      'ca': 'ca', 'canada': 'ca', 'canadá': 'ca'
    };

    const mappedCode = countryVariations[normalizedCountry];
    if (mappedCode) {
      matchedCountry = AVAILABLE_COUNTRIES.find(c => c.code === mappedCode);
    }
  }

  if (matchedCountry) {
    return {
      code: matchedCountry.code,
      flagSvg: matchedCountry.flagSvg,
      flagEmoji: matchedCountry.flag,
      displayName: matchedCountry.name,
      isValid: true,
      region: matchedCountry.region
    };
  }

  // Fallback for unknown countries
  return {
    code: normalizedCountry.toUpperCase(),
    flagSvg: null,
    flagEmoji: '🌍',
    displayName: country.charAt(0).toUpperCase() + country.slice(1),
    isValid: false
  };
};