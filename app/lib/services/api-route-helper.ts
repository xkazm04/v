import { NextRequest } from 'next/server';
import { userPreferencesApiClient } from './user-preferences-api-client';
import { UserPreferences } from '@/app/hooks/use-user-preferences';

/**
 * Universal helper for API routes that need user preferences
 */
export class ApiRouteHelper {
  /**
   * Extract and process user preferences from Next.js request
   */
  public static extractUserPreferences(request: NextRequest): UserPreferences | null {
    const { searchParams } = new URL(request.url);
    
    return userPreferencesApiClient.extractUserPreferences({
      request,
      searchParams,
      headers: request.headers
    });
  }

  /**
   * Apply user preferences to API filters
   */
  public static applyUserPreferences<T extends Record<string, any>>(
    baseFilters: T,
    request: NextRequest
  ): T & { translate_to?: string } {
    const preferences = this.extractUserPreferences(request);
    return userPreferencesApiClient.applyPreferencesToFilters(baseFilters, preferences);
  }

  /**
   * Get translation target from request
   */
  public static getTranslationTarget(request: NextRequest): string | null {
    const preferences = this.extractUserPreferences(request);
    return userPreferencesApiClient.getTranslationTarget(preferences);
  }

  /**
   * Check if translation is needed for request
   */
  public static needsTranslation(request: NextRequest): boolean {
    return this.getTranslationTarget(request) !== null;
  }

  /**
   * Create response metadata with preference information
   */
  public static createResponseMeta(
    request: NextRequest,
    additionalMeta: Record<string, any> = {}
  ): Record<string, any> {
    const preferences = this.extractUserPreferences(request);
    const translationTarget = userPreferencesApiClient.getTranslationTarget(preferences);

    return {
      timestamp: new Date().toISOString(),
      userPreferences: {
        hasPreferences: !!preferences,
        language: preferences?.language || 'en',
        theme: preferences?.theme || 'system',
        translationEnabled: !!translationTarget,
        translationTarget: translationTarget || 'en'
      },
      ...additionalMeta
    };
  }

  /**
   * Log request with preference information
   */
  public static logRequest(
    request: NextRequest,
    context: string,
    additionalInfo: Record<string, any> = {}
  ): void {
    if (process.env.NODE_ENV === 'development') {
      const preferences = this.extractUserPreferences(request);
      const translationTarget = userPreferencesApiClient.getTranslationTarget(preferences);

      console.log(`🌐 [${context}] API Request:`, {
        url: request.url,
        method: request.method,
        hasPreferences: !!preferences,
        language: preferences?.language || 'en',
        translationTarget: translationTarget || 'none',
        userAgent: request.headers.get('user-agent')?.slice(0, 50) + '...',
        ...additionalInfo
      });
    }
  }
}