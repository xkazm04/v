import { useCallback } from 'react';
import { useUserPreferences } from './use-user-preferences';
import { userPreferencesApiClient } from '@/app/lib/services/user-preferences-api-client';
import { useTranslationStore } from '@/app/stores/useTranslationStore'; 

/**
 * Hook that provides API functions with automatic user preference injection
 */
export function useApiWithPreferences() {
  const { preferences } = useUserPreferences();
  const { startTranslation, completeTranslation, failTranslation } = useTranslationStore();

  userPreferencesApiClient.resetCache();
  userPreferencesApiClient.setPreferences(preferences);

  /**
   * Enhanced fetch that automatically includes user preferences AND tracks translations
   */
  const fetchWithPreferences = useCallback(async (
    url: string,
    options: RequestInit = {},
    trackTranslation: boolean = true
  ): Promise<Response> => {
    const translationTarget = userPreferencesApiClient.getTranslationTarget(preferences);
    const needsTranslation = userPreferencesApiClient.needsTranslation(preferences);
    
    let translationTaskId: string | null = null;
    
    // ✅ Start translation tracking if needed
    if (trackTranslation && needsTranslation && translationTarget) {
      translationTaskId = startTranslation({
        text: `API request to ${url}`,
        sourceLocale: 'en',
        targetLocale: translationTarget,
        context: url.includes('/news') ? 'news' : 'timeline'
      });
    }
    
    console.log('🌐 fetchWithPreferences called:', {
      url,
      language: preferences?.language,
      translationTarget,
      trackingTranslation: !!translationTaskId,
      currentTime: new Date().toISOString()
    });
    
    try {
      const response = await userPreferencesApiClient.fetchWithPreferences(url, options, preferences);
      
      if (translationTaskId) {
        // Check if the response indicates translation occurred
        const responseClone = response.clone();
        const data = await responseClone.json();
        const wasTranslated = data.__meta?.userPreferences?.translationEnabled || false;
        
        completeTranslation(translationTaskId, !wasTranslated);
      }
      
      return response;
      
    } catch (error) {
      // ✅ Fail translation task on error
      if (translationTaskId) {
        failTranslation(translationTaskId, error instanceof Error ? error.message : 'Request failed');
      }
      throw error;
    }
  }, [preferences, startTranslation, completeTranslation, failTranslation]);

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