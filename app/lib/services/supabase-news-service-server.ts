import { ResearchResult } from '@/app/types/article';
import { 
  translateResearchStatement, 
  batchTranslateExpertPerspectives
} from './translation-service';
import { supabaseAdmin } from '../supabase';

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

// ✅ NEW: Expert perspective interface
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

class SupabaseNewsServiceServer {
  /**
   * Get research results from Supabase research_results table (server-side with admin client)
   */
  async getNews(filters: SupabaseNewsFilters = {}): Promise<ResearchResult[]> {
    try {
      // Check if admin client is available
      if (!supabaseAdmin) {
        console.error('Supabase admin client not available');
        return [];
      }

      // Test connection first
      const { data: testData, error: testError } = await supabaseAdmin
        .from('research_results')
        .select('id, statement')
        .limit(1);

      if (testError) {
        console.error('Supabase connection test failed:', testError);
        return [];
      }

      if (!testData || testData.length === 0) {
        console.warn('No data found in research_results table');
        return [];
      }

      // Build main query
      let query = supabaseAdmin
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
          expert_perspectives,
          processed_at,
          created_at,
          topic_id,
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
        query = query.or(`statement.ilike.%${filters.search}%,verdict.ilike.%${filters.search}%`);
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
        console.error('Supabase query error:', error);
        return [];
      }

      if (!data || data.length === 0) {
        console.log('No research results found');
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
        expert_perspectives: this.parseJsonField(item.expert_perspectives),
        resources_agreed: this.parseJsonField(item.resources_agreed),
        resources_disagreed: this.parseJsonField(item.resources_disagreed),
        profileId: item.profile_id, 
        topic_id: item.topic_id || null,
        processed_at: item.processed_at || item.created_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
        category: item.category
      }));

      // ✅ ENHANCED: Apply translation if requested (including expert perspectives)
      if (filters.translateTo) {
        results = await this.translateResearchResults(results, filters.translateTo);
      }

      return results;

    } catch (error) {
      console.error('Supabase news service error:', error);
      return [];
    }
  }

  /**
   * ✅ ENHANCED: Translate statements, verdicts, and expert perspectives in batch
   */
  private async translateResearchResults(results: ResearchResult[], targetLanguage: string): Promise<ResearchResult[]> {
    try {
      console.log(`🌐 Translating ${results.length} research results to ${targetLanguage}`);

      const translatedResults = await Promise.all(
        results.map(async (result) => {
          try {
            // Translate statement and verdict
            const [translatedStatement, translatedVerdict] = await Promise.all([
              translateResearchStatement(result.statement, 'en', targetLanguage, 'news'),
              translateResearchStatement(result.verdict, 'en', targetLanguage, 'news')
            ]);

            // ✅ NEW: Translate expert perspectives if they exist
            let translatedExpertPerspectives = result.expert_perspectives;

            if (result.expert_perspectives) {
              // Handle both array and string formats
              let perspectives: ExpertPerspective[] = [];
              
              if (typeof result.expert_perspectives === 'string') {
                try {
                  perspectives = JSON.parse(result.expert_perspectives);
                } catch (parseError) {
                  console.warn('Failed to parse expert_perspectives string:', parseError);
                  perspectives = [];
                }
              } else if (Array.isArray(result.expert_perspectives)) {
                perspectives = result.expert_perspectives;
              }

              if (perspectives.length > 0) {
                console.log(`🎭 Translating ${perspectives.length} expert perspectives for result ${result.id}`);
                const translated = await batchTranslateExpertPerspectives(perspectives, 'en', targetLanguage);
                translatedExpertPerspectives = translated;
              }
            }

            return {
              ...result,
              statement: translatedStatement || result.statement,
              verdict: translatedVerdict || result.verdict,
              expert_perspectives: translatedExpertPerspectives,
              __meta: {
                ...result.__meta,
                translatedTo: targetLanguage,
                translationTimestamp: new Date().toISOString()
              }
            };

          } catch (error) {
            console.error(`Failed to translate result ${result.id}:`, error);
            return result; // Return original on error
          }
        })
      );

      console.log(`✅ Successfully translated ${translatedResults.length} research results`);
      return translatedResults;

    } catch (error) {
      console.error('Batch translation failed:', error);
      return results; // Return original results on error
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
        return field; // Return as string if parsing fails
      }
    }
    return undefined;
  }
}

export const supabaseNewsServiceServer = new SupabaseNewsServiceServer();