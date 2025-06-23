import { LingoDotDevEngine } from 'lingo.dev/sdk';
import { supabaseAdmin } from '../supabase';

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

// ✅ NEW: Expert perspective translation interface
interface ExpertPerspective {
  expert_name: string;
  stance: 'SUPPORTING' | 'OPPOSING' | 'NEUTRAL';
  reasoning: string;
  confidence_level: number;
  summary: string;
  source_type: 'llm' | 'external' | 'hybrid';
  expertise_area: string;
  publication_date?: string | null;
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
      console.warn('Cache retrieval error:', error);
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
      console.warn('Caching failed:', error);
    } else {
      console.log(`✅ Cached translation: ${originalContent.slice(0, 30)}...`);
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
      console.log(`💾 Using cached translation for: "${statement.slice(0, 30)}..."`);
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
      return translatedText;
    } else {
      console.warn(`⚠️ Translation returned same text or empty: "${statement}"`);
      return statement;
    }

  } catch (error) {
    console.error('Server translation error:', error);
    return statement;
  }
}

/**
 * ✅ NEW: Translate expert perspective summary and reasoning
 */
export async function translateExpertPerspective(
  perspective: ExpertPerspective,
  sourceLocale: string = 'en',
  targetLocale: string = 'es'
): Promise<ExpertPerspective> {
  if (sourceLocale === targetLocale) {
    return perspective;
  }

  try {
    console.log(`🎭 Translating expert perspective: ${perspective.expert_name}`);

    // Translate summary
    const translatedSummary = perspective.summary 
      ? await translateResearchStatement(perspective.summary, sourceLocale, targetLocale, 'expert-opinion')
      : perspective.summary;

    // Translate reasoning
    const translatedReasoning = perspective.reasoning 
      ? await translateResearchStatement(perspective.reasoning, sourceLocale, targetLocale, 'expert-opinion')
      : perspective.reasoning;

    return {
      ...perspective,
      summary: translatedSummary || perspective.summary,
      reasoning: translatedReasoning || perspective.reasoning
    };

  } catch (error) {
    console.error('Expert perspective translation error:', error);
    return perspective; // Return original on error
  }
}

/**
 * ✅ NEW: Batch translate multiple expert perspectives
 */
export async function batchTranslateExpertPerspectives(
  perspectives: ExpertPerspective[],
  sourceLocale: string = 'en',
  targetLocale: string = 'es'
): Promise<ExpertPerspective[]> {
  if (!perspectives || perspectives.length === 0 || sourceLocale === targetLocale) {
    return perspectives;
  }

  try {
    console.log(`🎭 Batch translating ${perspectives.length} expert perspectives`);

    // Process all perspectives in parallel
    const translatedPerspectives = await Promise.all(
      perspectives.map(perspective => 
        translateExpertPerspective(perspective, sourceLocale, targetLocale)
      )
    );

    console.log(`✅ Successfully translated ${translatedPerspectives.length} expert perspectives`);
    return translatedPerspectives;

  } catch (error) {
    console.error('Batch expert perspective translation error:', error);
    return perspectives; // Return original on error
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
      return {
        translatedText: cachedResult,
        wasCached: true
      };
    }

    // Perform translation
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
    const translatedStatements = await Promise.all(
      statements.map(statement => 
        translateResearchStatement(statement, sourceLocale, targetLocale, context)
      )
    );

    return translatedStatements.map((translated, index) => 
      translated || statements[index]
    );

  } catch (error) {
    console.error('Batch translation error:', error);
    return statements;
  }
}

// Clear translation cache
export async function clearTranslationCache(): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('lingo_translations')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except non-existent ID

    if (error) {
      console.error('Failed to clear translation cache:', error);
      return false;
    }

    console.log('✅ Translation cache cleared successfully');
    return true;
  } catch (error) {
    console.error('Failed to clear translation cache:', error);
    return false;
  }
}

// Get cache statistics
export async function getTranslationCacheStats() {
  try {
    const { data, error } = await supabaseAdmin
      .from('lingo_translations')
      .select('target_locale, translation_type', { count: 'exact' });

    if (error) {
      console.error('Failed to get cache stats:', error);
      return null;
    }

    return {
      totalCached: data?.length || 0,
      byLanguage: data?.reduce((acc: Record<string, number>, item) => {
        acc[item.target_locale] = (acc[item.target_locale] || 0) + 1;
        return acc;
      }, {}) || {},
      byType: data?.reduce((acc: Record<string, number>, item) => {
        acc[item.translation_type] = (acc[item.translation_type] || 0) + 1;
        return acc;
      }, {}) || {}
    };
  } catch (error) {
    console.error('Failed to get cache stats:', error);
    return null;
  }
}