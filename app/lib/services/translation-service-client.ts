import { useTranslationStore } from '@/app/stores/useTranslationStore';

/**
 * Client-side translation service that integrates with the store
 */
export class ClientTranslationService {
  /**
   * Translate text via API with store integration
   */
  static async translateText(
    text: string,
    sourceLocale: string = 'en',
    targetLocale: string = 'es',
    context?: 'news' | 'timeline' | 'expert-opinion'
  ): Promise<string> {
    if (!text || text.trim() === '' || sourceLocale === targetLocale) {
      return text;
    }

    const store = useTranslationStore.getState();
    
    // ✅ Start tracking translation
    const taskId = store.startTranslation({
      text,
      sourceLocale,
      targetLocale,
      context
    });

    try {
      console.log(`🌐 Client: Starting translation via API`);
      
      // ✅ Update status to translating
      store.updateTaskStatus(taskId, 'translating');

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          sourceLocale,
          targetLocale,
          context
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation API failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.translatedText) {
        console.log(`✅ Client: Translation completed`);
        
        // ✅ Mark as completed (check if it was cached)
        const wasCached = data.cached || false;
        store.completeTranslation(taskId, wasCached);
        
        return data.translatedText;
      } else {
        throw new Error('No translated text in response');
      }

    } catch (error) {
      console.error('Client translation error:', error);
      
      // ✅ Mark as failed
      store.failTranslation(taskId, error instanceof Error ? error.message : 'Unknown error');
      
      return text; // Return original text on failure
    }
  }

  /**
   * Batch translate multiple texts
   */
  static async batchTranslateTexts(
    texts: string[],
    sourceLocale: string = 'en',
    targetLocale: string = 'es',
    context?: 'news' | 'timeline' | 'expert-opinion'
  ): Promise<string[]> {
    if (sourceLocale === targetLocale) {
      return texts;
    }

    console.log(`🌐 Client: Batch translating ${texts.length} texts`);

    const translationPromises = texts.map(async (text) => {
      try {
        return await this.translateText(text, sourceLocale, targetLocale, context);
      } catch (error) {
        console.warn('Batch translation item failed:', error);
        return text;
      }
    });

    const results = await Promise.allSettled(translationPromises);
    
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.warn(`Batch translation rejected for item ${index}:`, result.reason);
        return texts[index];
      }
    });
  }
}