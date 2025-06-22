import { LingoDotDevEngine } from 'lingo.dev/sdk';
import { supabaseAdmin } from '../supabase';

// Lingo.dev client
const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGO_API_KEY!,
  batchSize: 100,
  idealBatchItemSize: 1000,
});

interface CachedTranslation {
  id?: string;
  source_text: string;
  source_locale: string;
  target_locale: string;
  translated_text: string;
  translation_type: 'text' | 'object' | 'html' | 'chat';
  created_at?: string;
  updated_at?: string;
}

interface TranslationResult {
  translatedText: string;
  wasCached: boolean;
}

/**
 * Get cached translation from Supabase
 */
async function getCachedTranslation(
  content: string,
  sourceLocale: string,
  targetLocale: string
): Promise<string | null> {
  try {
    const contentHash = btoa(content);
    
    const { data, error } = await supabaseAdmin
      .from('lingo_translations')
      .select('translated_text')
      .eq('source_text', contentHash)
      .eq('source_locale', sourceLocale)
      .eq('target_locale', targetLocale)
      .eq('translation_type', 'text')
      .maybeSingle();

    if (error) {
      console.warn('Cache lookup error:', error);
      return null;
    }

    return data?.translated_text || null;
  } catch (error) {
    console.warn('Cache retrieval failed:', error);
    return null;
  }
}

/**
 * Cache translation in Supabase
 */
async function cacheTranslation(
  originalContent: string,
  translatedContent: string,
  sourceLocale: string,
  targetLocale: string
): Promise<void> {
  try {
    const contentHash = btoa(originalContent);
    
    const cacheEntry: CachedTranslation = {
      source_text: contentHash,
      source_locale: sourceLocale,
      target_locale: targetLocale,
      translated_text: translatedContent,
      translation_type: 'text',
    };

    const { error } = await supabaseAdmin
      .from('lingo_translations')
      .upsert(cacheEntry, {
        onConflict: 'source_text,source_locale,target_locale,translation_type'
      });

    if (error) {
      console.warn('Cache storage error:', error);
    } else {
      console.log(`✅ Cached translation: ${sourceLocale} → ${targetLocale}`);
    }

  } catch (error) {
    console.warn('Caching failed:', error);
  }
}

/**
 * ✅ ENHANCED: Translate research statement with cache detection
 */
export async function translateResearchStatement(
  statement: string,
  sourceLocale: string = 'en',
  targetLocale: string = 'es',
  context?: 'news' | 'timeline' | 'expert-opinion'
): Promise<string | null> {
  if (!statement || statement.trim() === '') {
    return null;
  }

  // Same language, no translation needed
  if (sourceLocale === targetLocale) {
    return statement;
  }

  try {
    console.log(`🌐 Server: Translating statement: "${statement.slice(0, 50)}..." from ${sourceLocale} to ${targetLocale}`);

    // Check cache first
    const cachedResult = await getCachedTranslation(statement, sourceLocale, targetLocale);
    if (cachedResult) {
      console.log(`📋 Server: Using cached translation for ${sourceLocale} → ${targetLocale}`);
      return cachedResult;
    }

    console.log(`🔄 Server: No cache found, translating via Lingo.dev`);

    // Perform translation
    const translatedText = await lingoDotDev.localizeText(statement, {
      sourceLocale,
      targetLocale,
      fast: true,
    });

    if (translatedText && translatedText !== statement) {
      // Cache the successful translation
      await cacheTranslation(statement, translatedText, sourceLocale, targetLocale);
      console.log(`✅ Server: Statement translated: ${sourceLocale} → ${targetLocale}`);
      return translatedText;
    } else {
      console.warn('Server: Translation returned same text or empty result');
      return statement;
    }

  } catch (error) {
    console.error('Server translation error:', error);
    return statement;
  }
}

/**
 * ✅ NEW: Translate with detailed result information
 */
export async function translateWithMetadata(
  statement: string,
  sourceLocale: string = 'en',
  targetLocale: string = 'es',
  context?: 'news' | 'timeline' | 'expert-opinion'
): Promise<TranslationResult> {
  if (!statement || statement.trim() === '' || sourceLocale === targetLocale) {
    return {
      translatedText: statement,
      wasCached: false
    };
  }

  try {
    // Check cache first
    const cachedResult = await getCachedTranslation(statement, sourceLocale, targetLocale);
    if (cachedResult) {
      console.log(`📋 Server: Using cached translation`);
      return {
        translatedText: cachedResult,
        wasCached: true
      };
    }

    // Perform fresh translation
    const translatedText = await lingoDotDev.localizeText(statement, {
      sourceLocale,
      targetLocale,
      fast: true,
    });

    if (translatedText && translatedText !== statement) {
      await cacheTranslation(statement, translatedText, sourceLocale, targetLocale);
      return {
        translatedText,
        wasCached: false
      };
    } else {
      return {
        translatedText: statement,
        wasCached: false
      };
    }

  } catch (error) {
    console.error('Translation with metadata error:', error);
    return {
      translatedText: statement,
      wasCached: false
    };
  }
}

/**
 * Batch translate multiple statements
 */
export async function batchTranslateStatements(
  statements: string[],
  sourceLocale: string = 'en',
  targetLocale: string = 'es',
  context?: 'news' | 'timeline' | 'expert-opinion'
): Promise<string[]> {
  if (sourceLocale === targetLocale) {
    return statements;
  }

  try {
    console.log(`🌐 Server: Batch translating ${statements.length} statements: ${sourceLocale} → ${targetLocale}`);

    const translationPromises = statements.map(async (statement, index) => {
      try {
        const result = await translateResearchStatement(statement, sourceLocale, targetLocale, context);
        return result || statement;
      } catch (error) {
        console.warn(`Server: Batch translation failed for item ${index}:`, error);
        return statement;
      }
    });

    const results = await Promise.allSettled(translationPromises);
    
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.warn(`Server: Batch translation rejected for item ${index}:`, result.reason);
        return statements[index];
      }
    });

  } catch (error) {
    console.error('Server: Batch translation error:', error);
    return statements;
  }
}

// Clear translation cache
export async function clearTranslationCache(): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('lingo_translations')
      .delete()
      .gte('id', 0);

    if (error) {
      console.error('Failed to clear translation cache:', error);
      return false;
    }

    console.log('✅ Translation cache cleared');
    return true;
  } catch (error) {
    console.error('Error clearing translation cache:', error);
    return false;
  }
}

// Get cache statistics
export async function getTranslationCacheStats() {
  try {
    const { data, error } = await supabaseAdmin
      .from('lingo_translations')
      .select('id, source_locale, target_locale, created_at', { count: 'exact' });

    if (error) {
      console.error('Failed to get cache stats:', error);
      return null;
    }

    return {
      totalCached: data?.length || 0,
      byLanguagePair: data?.reduce((acc: any, item) => {
        const pair = `${item.source_locale}-${item.target_locale}`;
        acc[pair] = (acc[pair] || 0) + 1;
        return acc;
      }, {}) || {}
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return null;
  }
}