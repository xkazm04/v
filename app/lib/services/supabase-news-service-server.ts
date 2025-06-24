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
  excludeIds?: string[]; // ✅ Support for excluding article IDs
  topicId?: string; // ✅ NEW: Support for topic_id filtering
}

// ✅ Expert perspective interface
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
        throw new Error('Supabase admin client is not available');
      }

      // Test connection first
      const { data: testData, error: testError } = await supabaseAdmin
        .from('research_results')
        .select('id, statement')
        .limit(1);

      if (testError) {
        throw new Error(`Supabase connection test failed: ${testError.message}`);
      }

      if (!testData || testData.length === 0) {
        console.warn('⚠️ No data available in research_results table');
        return [];
      }

      // ✅ **Build main query with exclusion support**
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
          valid_sources,
          verdict,
          status,
          correction,
          experts,
          expert_perspectives,
          resources_agreed,
          resources_disagreed,
          profile_id,
          processed_at,
          created_at,
          updated_at,
          topic_id,
          category
        `);

      // ✅ **Apply exclusion filter first**
      if (filters.excludeIds && filters.excludeIds.length > 0) {
        console.log(`🚫 Excluding ${filters.excludeIds.length} read articles`);
        query = query.not('id', 'in', `(${filters.excludeIds.map(id => `"${id}"`).join(',')})`);
      }

      // ✅ **NEW: Apply topic_id filter**
      if (filters.topicId) {
        console.log(`🔥 Filtering by topic_id: ${filters.topicId}`);
        query = query.eq('topic_id', filters.topicId);
      }

      // Apply other filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.country) {
        query = query.eq('country', filters.country);
      }

      if (filters.source) {
        query = query.ilike('source', `%${filters.source}%`);
      }

      if (filters.search) {
        query = query.or(`statement.ilike.%${filters.search}%,context.ilike.%${filters.search}%`);
      }

      // Apply sorting
      const sortBy = filters.sort_by || 'processed_at';
      const sortOrder = filters.sort_order || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      if (filters.offset) {
        query = query.range(filters.offset, (filters.offset || 0) + (filters.limit || 10) - 1);
      } else if (filters.limit) {
        query = query.limit(filters.limit);
      }

      console.log(`🎯 Executing Supabase query with filters:`, {
        ...filters,
        excludeCount: filters.excludeIds?.length || 0
      });

      const { data, error } = await query;

      if (error) {
        throw new Error(`Supabase query failed: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.log('📭 No results returned from Supabase');
        return [];
      }

      console.log(`✅ Supabase returned ${data.length} results`);

      // Transform and parse the data
      const results: ResearchResult[] = data.map(row => {
        try {
          return {
            id: row.id,
            statement: row.statement || '',
            source: row.source || '',
            context: row.context || '',
            request_datetime: row.request_datetime || new Date().toISOString(),
            statement_date: row.statement_date,
            country: row.country,
            valid_sources: row.valid_sources || '',
            verdict: row.verdict || '',
            status: row.status || 'UNVERIFIABLE',
            correction: row.correction,
            experts: this.parseJsonField(row.experts) || {},
            expert_perspectives: this.parseJsonField(row.expert_perspectives) || [],
            resources_agreed: this.parseJsonField(row.resources_agreed),
            resources_disagreed: this.parseJsonField(row.resources_disagreed),
            profile_id: row.profile_id,
            processed_at: row.processed_at || new Date().toISOString(),
            created_at: row.created_at || new Date().toISOString(),
            updated_at: row.updated_at || new Date().toISOString(),
            topic_id: row.topic_id,
            category: row.category,
            __meta: {
              source: 'supabase',
              fetchTime: Date.now(),
              timestamp: new Date().toISOString()
            }
          };
        } catch (parseError) {
          console.error('Failed to parse research result:', parseError, row);
          return null;
        }
      }).filter(Boolean) as ResearchResult[];

      // Apply translation if needed
      if (filters.translateTo && filters.translateTo !== 'en') {
        console.log(`🌐 Translating ${results.length} results to ${filters.translateTo}`);
        return await this.translateResearchResults(results, filters.translateTo);
      }

      return results;

    } catch (error) {
      console.error('💥 Supabase service error:', error);
      throw error;
    }
  }

  /**
   * ✅ NEW: Get count of articles matching filters (for pagination and stats)
   */
  async getNewsCount(filters: Omit<SupabaseNewsFilters, 'limit' | 'offset' | 'sort_by' | 'sort_order'> = {}): Promise<number> {
    try {
      if (!supabaseAdmin) {
        throw new Error('Supabase admin client is not available');
      }

      let query = supabaseAdmin
        .from('research_results')
        .select('id', { count: 'exact', head: true });

      // Apply same filters as getNews (except pagination)
      if (filters.excludeIds && filters.excludeIds.length > 0) {
        query = query.not('id', 'in', `(${filters.excludeIds.map(id => `"${id}"`).join(',')})`);
      }

      if (filters.topicId) {
        query = query.eq('topic_id', filters.topicId);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.country) {
        query = query.eq('country', filters.country);
      }

      if (filters.source) {
        query = query.ilike('source', `%${filters.source}%`);
      }

      if (filters.search) {
        query = query.or(`statement.ilike.%${filters.search}%,context.ilike.%${filters.search}%`);
      }

      const { count, error } = await query;

      if (error) {
        throw new Error(`Supabase count query failed: ${error.message}`);
      }

      return count || 0;
    } catch (error) {
      console.error('Error getting news count:', error);
      throw error;
    }
  }

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
        return field; 
      }
    }
    return undefined;
  }
}

export const supabaseNewsServiceServer = new SupabaseNewsServiceServer();