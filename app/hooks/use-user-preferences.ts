// app/hooks/use-user-preferences.ts
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
  language: 'en',
  countries: ['worldwide'],
  categories: ['politics', 'environment', 'military'],
  theme: 'system',
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

  // Update language preference
  const setLanguage = (language: string) => {
    setPreferences(prev => ({
      ...prev,
      language,
      lastUpdated: new Date().toISOString()
    }));
  };

  // Update countries preference
  const setCountries = (countries: string[]) => {
    setPreferences(prev => ({
      ...prev,
      countries,
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
      setPreferences({
        ...DEFAULT_PREFERENCES,
        ...imported,
        lastUpdated: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
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
    
    // Computed values
    isFirstTimeUser: !preferences.hasCompletedOnboarding,
    needsTranslation: preferences.language !== 'en' && preferences.language !== '',
  };
}