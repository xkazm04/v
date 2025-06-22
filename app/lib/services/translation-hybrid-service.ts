import { translateResearchStatement } from './translation-service';
import { useTranslations } from 'next-intl';

export class HybridTranslationService {
  /**
   * Get static translation using next-intl
   */
  static getStaticTranslation(
    t: ReturnType<typeof useTranslations>,
    key: string,
    params?: Record<string, any>
  ): string {
    try {
      return t(key, params);
    } catch (error) {
      console.warn(`Static translation missing for key: ${key}`);
      return key;
    }
  }

  /**
   * Get dynamic translation using API
   */
  static async getDynamicTranslation(
    text: string,
    sourceLocale: string = 'en',
    targetLocale: string,
    context?: 'news' | 'timeline' | 'expert-opinion'
  ): Promise<string> {
    if (!text || text.trim() === '' || sourceLocale === targetLocale) {
      return text;
    }

    // Skip translation for static-like content (translation keys)
    if (this.isStaticLikeContent(text)) {
      return text;
    }

    try {
      return await translateResearchStatement(text, sourceLocale, targetLocale);
    } catch (error) {
      console.warn('Dynamic translation failed:', error);
      return text;
    }
  }

  /**
   * Smart content translation - tries static first, then dynamic
   */
  static async getSmartTranslation(
    content: {
      staticKey?: string;
      dynamicText?: string;
      fallbackText: string;
      params?: Record<string, any>;
    },
    t: ReturnType<typeof useTranslations>,
    targetLocale: string,
    context?: 'news' | 'timeline' | 'expert-opinion'
  ): Promise<string> {
    // Try static translation first
    if (content.staticKey) {
      try {
        const staticResult = this.getStaticTranslation(t, content.staticKey, content.params);
        if (staticResult && staticResult !== content.staticKey) {
          return staticResult;
        }
      } catch (error) {
        console.warn(`Static translation failed for ${content.staticKey}:`, error);
      }
    }

    // Fall back to dynamic translation
    if (content.dynamicText && targetLocale !== 'en') {
      try {
        return await this.getDynamicTranslation(
          content.dynamicText,
          'en',
          targetLocale,
          context
        );
      } catch (error) {
        console.warn('Dynamic translation failed:', error);
      }
    }

    return content.dynamicText || content.fallbackText;
  }

  /**
   * Check if content looks like a translation key
   */
  private static isStaticLikeContent(text: string): boolean {
    // Detect translation key patterns like "feed.statementOfTheDay"
    return /^[a-z]+(\.[a-zA-Z]+)+$/.test(text);
  }

  /**
   * Batch translate dynamic content
   */
  static async batchTranslateDynamic(
    items: { id: string; text: string }[],
    sourceLocale: string = 'en',
    targetLocale: string,
    context?: 'news' | 'timeline' | 'expert-opinion'
  ): Promise<Record<string, string>> {
    const translations: Record<string, string> = {};

    const translationPromises = items.map(async (item) => {
      try {
        const translated = await this.getDynamicTranslation(
          item.text,
          sourceLocale,
          targetLocale,
          context
        );
        translations[item.id] = translated;
      } catch (error) {
        console.warn(`Translation failed for item ${item.id}:`, error);
        translations[item.id] = item.text;
      }
    });

    await Promise.allSettled(translationPromises);
    return translations;
  }
}