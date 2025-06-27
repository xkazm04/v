'use client';

import { useLocalStorage } from './use-local-storage';

export interface UserPreferences {
  language: string;
  countries: string[];
  categories: string[];
  theme: 'light' | 'dark' | 'system';
  
  hasCompletedOnboarding: boolean;
  autoRefresh: boolean;
  notificationsEnabled: boolean;

  lastUpdated: string;
  version: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'en', // ✅ ENSURE: Always defaults to 'en'
  countries: ['worldwide'],
  categories: ['politics', 'environment'],
  theme: 'light',
  hasCompletedOnboarding: false,
  autoRefresh: true,
  notificationsEnabled: false,
  lastUpdated: new Date().toISOString(),
  version: '1.0.0'
};

// ✅ VALIDATION: Available language codes
const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'cs', name: 'Česky', flag: '🇨🇿' },
  // Add more languages as they become available
];

// ✅ VALIDATION: Available country codes
const AVAILABLE_COUNTRIES = [
  { code: 'worldwide', name: 'Worldwide', flag: '🌍' },
  { code: 'us', name: 'United States', flag: '🇺🇸' },
  { code: 'cz', name: 'Czech Republic', flag: '🇨🇿' },
  // Add more countries as needed
];

const isValidLanguageCode = (code: string): boolean => {
  return AVAILABLE_LANGUAGES.some(lang => lang.code === code);
};

const isValidCountryCode = (code: string): boolean => {
  return AVAILABLE_COUNTRIES.some(country => country.code === code);
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    'storyteller-user-preferences',
    DEFAULT_PREFERENCES
  );

  // ✅ IMPROVED: Update language preference with validation and fallback
  const setLanguage = (language: string) => {
    // If empty or invalid language, default to English
    if (!language || language === '' || !isValidLanguageCode(language)) {
      console.warn(`🌐 Invalid language code: ${language}, defaulting to English`);
      language = 'en';
    }
    
    setPreferences(prev => ({
      ...prev,
      language,
      lastUpdated: new Date().toISOString()
    }));
  };

  // Update countries preference with validation and auto-selection reset
  const setCountries = (countries: string[]) => {
    // Validate all country codes
    const validCountries = countries.filter(code => isValidCountryCode(code));
    
    if (validCountries.length !== countries.length) {
      console.warn('🌍 Some invalid country codes were filtered out:', countries);
    }
    
    // Ensure at least one country is selected, default to worldwide
    const finalCountries = validCountries.length > 0 ? validCountries : ['worldwide'];
    
    console.log('🌍 UserPreferences: Setting countries to:', finalCountries);
    
    setPreferences(prev => ({
      ...prev,
      countries: finalCountries,
      lastUpdated: new Date().toISOString() 
    }));
  };

  // Update categories preference
  const setCategories = (categories: string[]) => {
    setPreferences(prev => ({
      ...prev,
      categories,
      lastUpdated: new Date().toISOString()
    }));
  };

  // Update theme preference
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    setPreferences(prev => ({
      ...prev,
      theme,
      lastUpdated: new Date().toISOString()
    }));
  };

  // Mark onboarding as completed
  const completeOnboarding = (onboardingPreferences?: Partial<UserPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...onboardingPreferences,
      hasCompletedOnboarding: true,
      lastUpdated: new Date().toISOString()
    }));
  };

  // Update multiple preferences at once
  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString()
    }));
  };

  // Reset to defaults
  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  // ✅ IMPROVED: Get translation target language with proper fallback
  const getTranslationTarget = (): string | null => {
    const lang = preferences?.language;
    if (!lang || lang === 'en' || lang === '') {
      return null; // No translation needed
    }
    return lang;
  };

  // Export preferences for backup
  const exportPreferences = () => {
    return JSON.stringify(preferences, null, 2);
  };

  // Import preferences from backup
  const importPreferences = (preferencesJson: string) => {
    try {
      const importedPreferences = JSON.parse(preferencesJson);
      
      // Validate imported preferences
      if (importedPreferences.language && !isValidLanguageCode(importedPreferences.language)) {
        importedPreferences.language = 'en';
      }
      
      setPreferences({
        ...DEFAULT_PREFERENCES,
        ...importedPreferences,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to import preferences:', error);
      throw new Error('Invalid preferences format');
    }
  };

  // Get available options for validation
  const getAvailableLanguages = () => AVAILABLE_LANGUAGES;
  const getAvailableCountries = () => AVAILABLE_COUNTRIES;

  // Get user's preferred countries with details
  const getUserCountries = () => {
    const allCountries = getAvailableCountries();
    
    if (!preferences.countries || preferences.countries.length === 0) {
      return [allCountries.find(c => c.code === 'worldwide')!];
    }
    
    return preferences.countries
      .map(code => allCountries.find(c => c.code === code))
      .filter(Boolean);
  };

  // ✅ ENSURE: Always return a valid language (fallback to 'en')
  const safeLanguage = preferences?.language || 'en';

  return {
    preferences: {
      ...preferences,
      language: safeLanguage // ✅ Always provide a fallback language
    },
    setLanguage,
    setCountries,
    setCategories,
    setTheme,
    completeOnboarding,
    updatePreferences,
    resetPreferences,
    getTranslationTarget,
    exportPreferences,
    importPreferences,
    getAvailableLanguages,
    getAvailableCountries,
    getUserCountries,
    isFirstTimeUser: !preferences?.hasCompletedOnboarding,
    needsTranslation: safeLanguage !== 'en' && safeLanguage !== '',
    
    // ✅ ADDED: Debug helpers
    isPreferencesLoaded: !!preferences,
    currentLanguage: safeLanguage,
  };
}