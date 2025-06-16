import { UserPreferences } from '@/app/hooks/use-user-preferences';

export class UserPreferencesApiClient {
  private static instance: UserPreferencesApiClient;
  private preferences: UserPreferences | null = null;
  private isServer: boolean;

  private constructor() {
    this.isServer = typeof window === 'undefined';
  }

  public static getInstance(): UserPreferencesApiClient {
    if (!UserPreferencesApiClient.instance) {
      UserPreferencesApiClient.instance = new UserPreferencesApiClient();
    }
    return UserPreferencesApiClient.instance;
  }

  /**
   * Extract user preferences from various sources
   */
  public extractUserPreferences(sources: {
    request?: Request;
    searchParams?: URLSearchParams;
    headers?: Headers;
    clientPreferences?: UserPreferences;
  }): UserPreferences | null {
    try {
      // 1. Try client-side preferences first (most reliable)
      if (sources.clientPreferences) {
        console.log('📱 Using client-side preferences');
        this.preferences = sources.clientPreferences;
        return sources.clientPreferences;
      }

      // 2. Try to extract from request headers (server-side)
      if (sources.request || sources.headers) {
        const headers = sources.headers || sources.request?.headers;
        if (headers) {
          const preferencesHeader = headers.get('x-user-preferences');
          const languageHeader = headers.get('x-user-language');
          
          if (preferencesHeader) {
            try {
              const parsed = JSON.parse(preferencesHeader) as UserPreferences;
              console.log('🌐 Using preferences from request header');
              this.preferences = parsed;
              return parsed;
            } catch (error) {
              console.warn('Failed to parse preferences header:', error);
            }
          }
          
          // Fallback to language-only header
          if (languageHeader) {
            const minimalPrefs: UserPreferences = {
              language: languageHeader,
              countries: ['worldwide'],
              categories: ['politics'],
              theme: 'system',
              hasCompletedOnboarding: true,
              autoRefresh: true,
              notificationsEnabled: false,
              lastUpdated: new Date().toISOString(),
              version: '1.0.0'
            };
            console.log('🌍 Using language from request header');
            this.preferences = minimalPrefs;
            return minimalPrefs;
          }
        }
      }

      // 3. Try search params (URL parameters)
      if (sources.searchParams) {
        const lang = sources.searchParams.get('lang');
        const theme = sources.searchParams.get('theme');
        
        if (lang || theme) {
          const minimalPrefs: UserPreferences = {
            language: lang || 'en',
            countries: ['worldwide'],
            categories: ['politics'],
            theme: (theme as 'light' | 'dark' | 'system') || 'system',
            hasCompletedOnboarding: true,
            autoRefresh: true,
            notificationsEnabled: false,
            lastUpdated: new Date().toISOString(),
            version: '1.0.0'
          };
          console.log('🔗 Using preferences from URL params');
          this.preferences = minimalPrefs;
          return minimalPrefs;
        }
      }

      // 4. Try browser localStorage (client-side only)
      if (!this.isServer && typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('storyteller-user-preferences');
          if (stored) {
            const parsed = JSON.parse(stored) as UserPreferences;
            console.log('💾 Using preferences from localStorage');
            this.preferences = parsed;
            return parsed;
          }
        } catch (error) {
          console.warn('Failed to read localStorage preferences:', error);
        }
      }

      console.log('⚪ No user preferences found, using defaults');
      return null;

    } catch (error) {
      console.error('Error extracting user preferences:', error);
      return null;
    }
  }

  /**
   * Get translation target language (null if English or no translation needed)
   */
  public getTranslationTarget(preferences?: UserPreferences): string | null {
    const prefs = preferences || this.preferences;
    if (!prefs || prefs.language === 'en' || !prefs.language) {
      return null;
    }
    return prefs.language;
  }

  /**
   * Check if translation is needed
   */
  public needsTranslation(preferences?: UserPreferences): boolean {
    return this.getTranslationTarget(preferences) !== null;
  }

  /**
   * Get user's preferred countries filter
   */
  public getCountriesFilter(preferences?: UserPreferences): string[] {
    const prefs = preferences || this.preferences;
    return prefs?.countries || ['worldwide'];
  }

  /**
   * Get user's preferred categories filter
   */
  public getCategoriesFilter(preferences?: UserPreferences): string[] {
    const prefs = preferences || this.preferences;
    return prefs?.categories || ['politics', 'environment', 'military'];
  }

  /**
   * Get user's theme preference
   */
  public getThemePreference(preferences?: UserPreferences): 'light' | 'dark' | 'system' {
    const prefs = preferences || this.preferences;
    return prefs?.theme || 'system';
  }

  /**
   * Apply user preferences to API filters
   */
  public applyPreferencesToFilters<T extends Record<string, any>>(
    baseFilters: T,
    preferences?: UserPreferences
  ): T & { translate_to?: string } {
    const prefs = preferences || this.preferences;
    const translationTarget = this.getTranslationTarget(prefs);

    return {
      ...baseFilters,
      ...(translationTarget && { translate_to: translationTarget })
    };
  }

  /**
   * Create headers for outgoing requests with user preferences
   */
  public createRequestHeaders(preferences?: UserPreferences): HeadersInit {
    const prefs = preferences || this.preferences;
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    if (prefs) {
      headers['X-User-Preferences'] = JSON.stringify(prefs);
      headers['X-User-Language'] = prefs.language || 'en';
      headers['X-User-Theme'] = prefs.theme || 'system';
    }

    return headers;
  }

  /**
   * Enhanced fetch wrapper that automatically includes user preferences
   */
  public async fetchWithPreferences(
    url: string,
    options: RequestInit = {},
    preferences?: UserPreferences
  ): Promise<Response> {
    const prefs = preferences || this.preferences;
    const enhancedHeaders = {
      ...this.createRequestHeaders(prefs),
      ...options.headers
    };

    return fetch(url, {
      ...options,
      headers: enhancedHeaders
    });
  }

  /**
   * Log current preferences state (for debugging)
   */
  public logPreferencesState(context: string = 'Unknown'): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 User Preferences State [${context}]:`, {
        hasPreferences: !!this.preferences,
        language: this.preferences?.language || 'en',
        needsTranslation: this.needsTranslation(),
        translationTarget: this.getTranslationTarget(),
        theme: this.preferences?.theme || 'system',
        isServer: this.isServer
      });
    }
  }

  /**
   * Reset cached preferences (useful for testing)
   */
  public resetCache(): void {
    this.preferences = null;
  }

  /**
   * Set preferences manually (useful for testing or SSR)
   */
  public setPreferences(preferences: UserPreferences): void {
    this.preferences = preferences;
  }

  /**
   * Get current cached preferences
   */
  public getCachedPreferences(): UserPreferences | null {
    return this.preferences;
  }
}

// Export singleton instance
export const userPreferencesApiClient = UserPreferencesApiClient.getInstance();