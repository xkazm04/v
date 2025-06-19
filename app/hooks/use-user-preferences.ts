'use client';

import { useLocalStorage } from './use-local-storage';
import { AVAILABLE_COUNTRIES, AVAILABLE_LANGUAGES, isValidCountryCode, isValidLanguageCode } from '@/app/helpers/countries';

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
  language: 'en',
  countries: ['worldwide'],
  categories: ['politics', 'environment'],
  theme: 'light', // Default to light theme instead of system
  hasCompletedOnboarding: false,
  autoRefresh: true,
  notificationsEnabled: false,
  lastUpdated: new Date().toISOString(),
  version: '1.0.0'
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    'storyteller-user-preferences',
    DEFAULT_PREFERENCES
  );

  // Update language preference with validation
  const setLanguage = (language: string) => {
    if (!isValidLanguageCode(language)) {
      console.warn(`Invalid language code: ${language}`);
      return;
    }
    
    setPreferences(prev => ({
      ...prev,
      language,
      lastUpdated: new Date().toISOString()
    }));
  };

  // Update countries preference with validation
  const setCountries = (countries: string[]) => {
    // Validate all country codes
    const validCountries = countries.filter(code => isValidCountryCode(code));
    
    if (validCountries.length !== countries.length) {
      console.warn('Some invalid country codes were filtered out:', 
        countries.filter(code => !isValidCountryCode(code)));
    }
    
    // Ensure at least one country is selected, default to worldwide
    const finalCountries = validCountries.length > 0 ? validCountries : ['worldwide'];
    
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

  // Get translation target language (null if English or no translation needed)
  const getTranslationTarget = (): string | null => {
    if (preferences.language === 'en' || !preferences.language) {
      return null; // No translation needed for English
    }
    return preferences.language;
  };

  // Export preferences for backup
  const exportPreferences = () => {
    return JSON.stringify(preferences, null, 2);
  };

  // Import preferences from backup
  const importPreferences = (preferencesJson: string) => {
    try {
      const imported = JSON.parse(preferencesJson);
      
      // Validate imported preferences
      const validatedPreferences = {
        ...DEFAULT_PREFERENCES,
        ...imported,
        language: isValidLanguageCode(imported.language) ? imported.language : 'en',
        countries: Array.isArray(imported.countries) 
          ? imported.countries.filter(isValidCountryCode)
          : ['worldwide'],
        lastUpdated: new Date().toISOString()
      };
      
      // Ensure at least one country is selected
      if (validatedPreferences.countries.length === 0) {
        validatedPreferences.countries = ['worldwide'];
      }
      
      setPreferences(validatedPreferences);
      return true;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  };

  // Get available options for validation
  const getAvailableLanguages = () => AVAILABLE_LANGUAGES;
  const getAvailableCountries = () => AVAILABLE_COUNTRIES;

  // Get user's preferred countries with details
  const getUserCountries = () => {
    const allCountries = getAvailableCountries();
    
    if (!preferences.countries || preferences.countries.length === 0) {
      return allCountries.filter(c => c.code === 'worldwide');
    }
    
    return allCountries.filter(country => 
      preferences.countries.includes(country.code)
    );
  };

  return {
    preferences,
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
    
    // Computed values
    isFirstTimeUser: !preferences.hasCompletedOnboarding,
    needsTranslation: preferences.language !== 'en' && preferences.language !== '',
  };
}