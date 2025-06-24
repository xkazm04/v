import { useCallback } from 'react';
import { useUserPreferences } from './use-user-preferences';
import { userPreferencesApiClient } from '@/app/lib/services/user-preferences-api-client';

/**
 * Hook that provides API functions with automatic user preference injection
 */
export function useApiWithPreferences() {
  const { preferences } = useUserPreferences();

  // ✅ FORCE: Always reset and update preferences to ensure fresh state
  userPreferencesApiClient.resetCache();
  userPreferencesApiClient.setPreferences(preferences);

  /**
   * Enhanced fetch that automatically includes user preferences
   */
  const fetchWithPreferences = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    // ✅ Force use of current preferences, don't rely on cached ones
    console.log('🌐 fetchWithPreferences called:', {
      url,
      language: preferences?.language,
      translationTarget: userPreferencesApiClient.getTranslationTarget(preferences),
      currentTime: new Date().toISOString()
    });
    
    // ✅ Always pass current preferences explicitly
    return userPreferencesApiClient.fetchWithPreferences(url, options, preferences);
  }, [preferences]);

  /**
   * Create URL with preference parameters
   */
  const createUrlWithPreferences = useCallback((
    baseUrl: string,
    additionalParams: Record<string, string> = {},
    options: { includeTheme?: boolean } = {}
  ): string => {
    const url = new URL(baseUrl, window.location.origin);
    
    // ✅ Force fresh translation target calculation
    const translationTarget = userPreferencesApiClient.getTranslationTarget(preferences);
    
    console.log('🔗 createUrlWithPreferences called:', {
      baseUrl,
      preferences: preferences?.language,
      translationTarget,
      willAddLangParams: !!translationTarget
    });
    
    if (translationTarget) {
      url.searchParams.set('lang', translationTarget);
      url.searchParams.set('translate_to', translationTarget);
    }
    
    // ✅ Only add theme parameter if explicitly requested
    if (options.includeTheme && preferences?.theme && preferences.theme !== 'system') {
      url.searchParams.set('theme', preferences.theme);
    }
    
    // Add additional parameters
    Object.entries(additionalParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    
    console.log('🔗 Final URL:', url.toString());
    
    return url.toString();
  }, [preferences]);

  /**
   * Get request headers with user preferences
   */
  const getPreferenceHeaders = useCallback((): HeadersInit => {
    return userPreferencesApiClient.createRequestHeaders(preferences);
  }, [preferences]);

  /**
   * Apply preferences to filter object
   */
  const applyPreferencesToFilters = useCallback(<T extends Record<string, any>>(
    baseFilters: T
  ): T & { translate_to?: string } => {
    return userPreferencesApiClient.applyPreferencesToFilters(baseFilters, preferences);
  }, [preferences]);

  return {
    fetchWithPreferences,
    createUrlWithPreferences,
    getPreferenceHeaders,
    applyPreferencesToFilters,
    translationTarget: userPreferencesApiClient.getTranslationTarget(preferences),
    needsTranslation: userPreferencesApiClient.needsTranslation(preferences),
    preferences
  };
}