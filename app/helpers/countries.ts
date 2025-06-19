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
  }
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

export const countryLabels: Record<string, string> = {
    'US': 'United States',
    'GB': 'United Kingdom',
    'FR': 'France',
    'DE': 'Germany',
    'CA': 'Canada',
    'AU': 'Australia',
    'JP': 'Japan',
    'CN': 'China',
    'IN': 'India',
    'BR': 'Brazil',
    'RU': 'Russia',
    'ZA': 'South Africa',
    'KR': 'South Korea',
    'MX': 'Mexico',
    'IT': 'Italy',
    'ES': 'Spain',
    'NL': 'Netherlands',
    'SE': 'Sweden',
    'NO': 'Norway',
    'CZ': 'Czech Republic',
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