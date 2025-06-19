import { useCallback } from 'react';
import { useUserPreferences } from './use-user-preferences';
import { userPreferencesApiClient } from '@/app/lib/services/user-preferences-api-client';

/**
 * Hook that provides API functions with automatic user preference injection
 */
export function useApiWithPreferences() {
  const { preferences } = useUserPreferences();

  // Update the API client with current preferences
  userPreferencesApiClient.setPreferences(preferences);

  /**
   * Enhanced fetch that automatically includes user preferences
   */
  const fetchWithPreferences = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
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
    
    // Add translation parameter if needed
    const translationTarget = userPreferencesApiClient.getTranslationTarget(preferences);
    if (translationTarget) {
      url.searchParams.set('lang', translationTarget);
    }
    
    // ✅ Only add theme parameter if explicitly requested
    if (options.includeTheme && preferences.theme && preferences.theme !== 'system') {
      url.searchParams.set('theme', preferences.theme);
    }
    
    // Add additional parameters
    Object.entries(additionalParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    
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