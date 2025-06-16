import { LingoDotDevEngine } from 'lingo.dev/sdk';
import { supabaseAdmin } from '../supabase';

// Lingo.dev client
const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.NEXT_PUBLIC_LINGO_API_KEY!,
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

/**
 * Generate cache key for content
 */
function generateCacheKey(content: string, sourceLocale: string, targetLocale: string): string {
  // Create a simple hash of the content for cache lookup
  const contentHash = btoa(content).slice(0, 50);
  return `${sourceLocale}_${targetLocale}_${contentHash}`;
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
    // Use content hash for lookup to avoid storing full content multiple times
    const contentHash = btoa(content);
    
    const { data, error } = await supabaseAdmin
      .from('lingo_translations')
      .select('translated_text')
      .eq('source_text', contentHash)
      .eq('source_locale', sourceLocale)
      .eq('target_locale', targetLocale)
      .eq('translation_type', 'text')
      .maybeSingle(); // Use maybeSingle to avoid error if no match

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
 * Translate research statement with caching
 */
export async function translateResearchStatement(
  statement: string,
  sourceLocale: string = 'en',
  targetLocale: string = 'es'
): Promise<string | null> {
  if (!statement || statement.trim() === '') {
    return null;
  }

  // Same language, no translation needed
  if (sourceLocale === targetLocale) {
    return statement;
  }

  try {
    console.log(`🌐 Translating statement: "${statement.slice(0, 50)}..." from ${sourceLocale} to ${targetLocale}`);

    // Check cache first
    const cachedResult = await getCachedTranslation(statement, sourceLocale, targetLocale);
    if (cachedResult) {
      console.log(`📋 Using cached translation for ${sourceLocale} → ${targetLocale}`);
      return cachedResult;
    }

    // Perform translation
    const translatedText = await lingoDotDev.localizeText(statement, {
      sourceLocale,
      targetLocale,
      fast: true, // Use fast mode for better performance
    });

    if (translatedText && translatedText !== statement) {
      // Cache the successful translation
      await cacheTranslation(statement, translatedText, sourceLocale, targetLocale);
      console.log(`✅ Statement translated: ${sourceLocale} → ${targetLocale}`);
      return translatedText;
    } else {
      console.warn('Translation returned same text or empty result');
      return statement; // Return original if translation didn't work
    }

  } catch (error) {
    console.error('Translation error:', error);
    return statement; // Return original on error
  }
}

/**
 * Batch translate multiple statements
 */
export async function batchTranslateStatements(
  statements: string[],
  sourceLocale: string = 'en',
  targetLocale: string = 'es'
): Promise<string[]> {
  if (sourceLocale === targetLocale) {
    return statements;
  }

  try {
    console.log(`🌐 Batch translating ${statements.length} statements: ${sourceLocale} → ${targetLocale}`);

    const translationPromises = statements.map(async (statement, index) => {
      try {
        const result = await translateResearchStatement(statement, sourceLocale, targetLocale);
        return result || statement;
      } catch (error) {
        console.warn(`Batch translation failed for item ${index}:`, error);
        return statement; // Return original on failure
      }
    });

    const results = await Promise.allSettled(translationPromises);
    
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.warn(`Batch translation rejected for item ${index}:`, result.reason);
        return statements[index]; // Return original on rejection
      }
    });

  } catch (error) {
    console.error('Batch translation error:', error);
    return statements; // Return original array on error
  }
}

/**
 * Clear translation cache (utility function)
 */
export async function clearTranslationCache(): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('lingo_translations')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) {
      console.error('Cache clear error:', error);
    } else {
      console.log('✅ Translation cache cleared');
    }
  } catch (error) {
    console.error('Cache clear failed:', error);
  }
}

/**
 * Get translation cache stats
 */
export async function getTranslationCacheStats(): Promise<{
  totalTranslations: number;
  languagePairs: string[];
  mostTranslatedContent?: string;
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from('lingo_translations')
      .select('source_locale, target_locale, created_at');

    if (error) {
      throw error;
    }

    const totalTranslations = data?.length || 0;
    const languagePairs = [...new Set(
      data?.map(item => `${item.source_locale} → ${item.target_locale}`) || []
    )];

    return {
      totalTranslations,
      languagePairs,
    };
  } catch (error) {
    console.error('Cache stats error:', error);
    return {
      totalTranslations: 0,
      languagePairs: [],
    };
  }
}