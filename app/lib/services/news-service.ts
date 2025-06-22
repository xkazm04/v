import { ResearchResult } from "@/app/types/article";
import { supabase } from "../supabase"; 

export interface SupabaseNewsFilters {
  limit?: number;
  offset?: number;
  status?: string;
  category?: string;
  country?: string;
  source?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  translateTo?: string;
}

// Client-side translation function that calls API route
async function translateViaAPI(
  text: string,
  sourceLocale: string = 'en',
  targetLocale: string = 'es'
): Promise<string | null> {
  if (!text || text.trim() === '' || sourceLocale === targetLocale) {
    return text;
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        sourceLocale,
        targetLocale,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.translatedText || text;
    } else {
      console.warn('Translation API failed:', response.status);
      return text;
    }
  } catch (error) {
    console.warn('Translation error:', error);
    return text;
  }
}

class SupabaseNewsService {
  async getNews(filters: SupabaseNewsFilters = {}): Promise<ResearchResult[]> {
    try {
      // Test connection first
      const { data: testData, error: testError } = await supabase
        .from('research_results')
        .select('id, statement')
        .limit(1);

      if (testError) {
        console.warn(`Supabase connection failed: ${testError.message}`);
        return [];
      }

      if (!testData || testData.length === 0) {
        return [];
      }

      // Build main query
      let query = supabase
        .from('research_results')
        .select(`
          id,
          statement,
          source,
          context,
          request_datetime,
          statement_date,
          country,
          category,
          valid_sources,
          verdict,
          status,
          correction,
          resources_agreed,
          resources_disagreed,
          experts,
          processed_at,
          created_at,
          updated_at,
          profile_id
        `);

      // Apply filters
      if (filters.status && filters.status !== 'all' && filters.status.trim() !== '') {
        query = query.eq('status', filters.status.toUpperCase());
      }

      if (filters.category && filters.category !== 'all' && filters.category.trim() !== '') {
        query = query.eq('category', filters.category);
      }

      if (filters.country && filters.country !== 'all' && filters.country !== 'worldwide' && filters.country.trim() !== '') {
        query = query.eq('country', filters.country);
      }

      if (filters.source && filters.source !== 'all' && filters.source.trim() !== '') {
        query = query.ilike('source', `%${filters.source}%`);
      }

      if (filters.search && filters.search.trim() !== '') {
        const searchTerm = filters.search.trim();
        query = query.or(`statement.ilike.%${searchTerm}%,source.ilike.%${searchTerm}%,context.ilike.%${searchTerm}%,verdict.ilike.%${searchTerm}%`);
      }

      // Sorting
      const sortBy = filters.sort_by || 'processed_at';
      const sortOrder = filters.sort_order || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Pagination
      const limit = Math.min(filters.limit || 20, 100);
      const offset = filters.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) {
        console.warn(`Supabase query failed: ${error.message}`);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Convert to ResearchResult format
      let results = data.map((item: any): ResearchResult => ({
        id: item.id,
        statement: item.statement || '',
        source: item.source || '',
        context: item.context || '',
        request_datetime: item.request_datetime || item.created_at,
        statement_date: item.statement_date,
        country: item.country,
        valid_sources: item.valid_sources || '',
        verdict: item.verdict || '',
        status: item.status || 'UNVERIFIABLE',
        correction: item.correction,
        experts: this.parseJsonField(item.experts),
        resources_agreed: this.parseJsonField(item.resources_agreed),
        resources_disagreed: this.parseJsonField(item.resources_disagreed),
        profileId: item.profile_id, 
        processed_at: item.processed_at || item.created_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
        category: item.category
      }));

      // Apply translation if requested
      if (filters.translateTo) {
        console.log(`🌐 Translating ${results.length} research results to ${filters.translateTo}`);
        results = await this.translateResearchResults(results, filters.translateTo);
      }

      return results;

    } catch (error) {
      console.error('Supabase news service error:', error);
      return [];
    }
  }

  /**
   * ✅ ENHANCED: Translate multiple fields in research results
   */
  private async translateResearchResults(results: ResearchResult[], targetLanguage: string): Promise<ResearchResult[]> {
    try {
      const translationPromises = results.map(async (result) => {
        const translatedFields: Partial<ResearchResult> = {};

        if (result.statement && result.statement.trim() !== '') {
          try {
            const translatedStatement = await translateViaAPI(
              result.statement,
              'en',
              targetLanguage
            );
            translatedFields.statement = translatedStatement || result.statement;
          } catch (error) {
            console.warn(`Statement translation failed for ${result.id}:`, error);
            translatedFields.statement = result.statement;
          }
        }

        // ✅ NEW: Translate verdict if present
        if (result.verdict && result.verdict.trim() !== '') {
          try {
            const translatedVerdict = await translateViaAPI(
              result.verdict,
              'en',
              targetLanguage
            );
            translatedFields.verdict = translatedVerdict || result.verdict;
          } catch (error) {
            console.warn(`Verdict translation failed for ${result.id}:`, error);
            translatedFields.verdict = result.verdict;
          }
        }

        // ✅ NEW: Translate context if present
        if (result.context && result.context.trim() !== '') {
          try {
            const translatedContext = await translateViaAPI(
              result.context,
              'en',
              targetLanguage
            );
            translatedFields.context = translatedContext || result.context;
          } catch (error) {
            console.warn(`Context translation failed for ${result.id}:`, error);
            translatedFields.context = result.context;
          }
        }

        return {
          ...result,
          ...translatedFields,
          __meta: {
            ...result.__meta,
            originalStatement: result.statement,
            originalVerdict: result.verdict,
            originalContext: result.context,
            translatedTo: targetLanguage,
            translationSource: 'api'
          }
        };
      });

      const translatedResults = await Promise.allSettled(translationPromises);
      
      return translatedResults.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          console.warn(`Translation failed for result ${index}:`, result.reason);
          return results[index]; // Return original on failure
        }
      });

    } catch (error) {
      console.error('Batch translation failed:', error);
      return results; // Return original results if batch translation fails
    }
  }

  /**
   * Get single research result by ID
   */
  async getNewsById(id: string, translateTo?: string): Promise<ResearchResult | null> {
    try {
      const { data, error } = await supabase
        .from('research_results')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      let result: ResearchResult = {
        id: data.id,
        statement: data.statement || '',
        source: data.source || '',
        context: data.context || '',
        request_datetime: data.request_datetime || data.created_at,
        statement_date: data.statement_date,
        country: data.country,
        valid_sources: data.valid_sources || '',
        verdict: data.verdict || '',
        status: data.status || 'UNVERIFIABLE',
        correction: data.correction,
        experts: this.parseJsonField(data.experts),
        resources_agreed: this.parseJsonField(data.resources_agreed),
        resources_disagreed: this.parseJsonField(data.resources_disagreed),
        profileId: data.profile_id,
        processed_at: data.processed_at || data.created_at,
        created_at: data.created_at,
        updated_at: data.updated_at,
        category: data.category
      };

      // Translate single result if requested
      if (translateTo) {
        const translatedResults = await this.translateResearchResults([result], translateTo);
        result = translatedResults[0];
      }

      return result;
    } catch (error) {
      console.error('Get news by ID error:', error);
      return null;
    }
  }

  /**
   * Parse JSON fields safely
   */
  private parseJsonField(field: any): any {
    if (!field) return undefined;
    if (typeof field === 'object') return field;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  /**
   * Health check for Supabase connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('research_results')
        .select('id')
        .limit(1);
      return !error;
    } catch (error) {
      return false;
    }
  }
}

export const supabaseNewsService = new SupabaseNewsService();