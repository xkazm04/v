import { supabase, supabaseAdmin } from '@/app/lib/supabase';
import { ResearchResult, NewsArticle, convertResearchToNews } from '@/app/types/article';

export class ResearchApiService {
  /**
   * Get research results with optional filtering
   */
  static async getResearchResults({
    search,
    status,
    limit = 50,
    offset = 0,
    useAdmin = false
  }: {
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
    useAdmin?: boolean;
  } = {}): Promise<{ data: ResearchResult[]; count: number; error?: string }> {
    try {
      const client = useAdmin ? supabaseAdmin : supabase;
      
      if (search || status) {
        // Use the search function for complex queries
        const { data, error } = await client.rpc('search_research_results', {
          search_text: search || null,
          status_filter: status || null,
          limit_count: limit,
          offset_count: offset
        });

        if (error) throw error;

        // Get full details for found IDs
        const ids = data?.map((item: any) => item.id) || [];
        if (ids.length === 0) {
          return { data: [], count: 0 };
        }

        const { data: fullData, error: detailError } = await client
          .from('research_results_with_resources')
          .select('*')
          .in('id', ids)
          .order('processed_at', { ascending: false });

        if (detailError) throw detailError;

        return {
          data: fullData || [],
          count: data?.length || 0
        };
      } else {
        // Simple query without search
        const { data, error, count } = await client
          .from('research_results_with_resources')
          .select('*', { count: 'exact' })
          .order('processed_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) throw error;

        return {
          data: data || [],
          count: count || 0
        };
      }
    } catch (error) {
      console.error('Error fetching research results:', error);
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get a single research result by ID
   */
  static async getResearchById(id: string, useAdmin = false): Promise<{
    data: ResearchResult | null;
    error?: string;
  }> {
    try {
      const client = useAdmin ? supabaseAdmin : supabase;
      
      const { data, error } = await client
        .from('research_results_with_resources')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data };
    } catch (error) {
      console.error('Error fetching research result:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get recent research results as news articles
   */
  static async getRecentNews({
    limit = 20,
    onlyFactChecked = false,
    useAdmin = false
  }: {
    limit?: number;
    onlyFactChecked?: boolean;
    useAdmin?: boolean;
  } = {}): Promise<{ data: NewsArticle[]; error?: string }> {
    try {
      const client = useAdmin ? supabaseAdmin : supabase;
      
      let query = client
        .from('research_results_with_resources')
        .select('*')
        .order('processed_at', { ascending: false })
        .limit(limit);

      if (onlyFactChecked) {
        query = query.neq('status', 'UNVERIFIABLE');
      }

      const { data, error } = await query;

      if (error) throw error;

      const newsArticles = (data || []).map(convertResearchToNews);

      return { data: newsArticles };
    } catch (error) {
      console.error('Error fetching recent news:', error);
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get breaking news (FALSE or MISLEADING statements)
   */
  static async getBreakingNews({
    limit = 10,
    useAdmin = false
  }: {
    limit?: number;
    useAdmin?: boolean;
  } = {}): Promise<{ data: NewsArticle[]; error?: string }> {
    try {
      const client = useAdmin ? supabaseAdmin : supabase;
      
      const { data, error } = await client
        .from('research_results_with_resources')
        .select('*')
        .in('status', ['FALSE', 'MISLEADING'])
        .order('processed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const newsArticles = (data || []).map((research) => ({
        ...convertResearchToNews(research),
        isBreaking: true
      }));

      return { data: newsArticles };
    } catch (error) {
      console.error('Error fetching breaking news:', error);
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Search research results with advanced filters
   */
  static async searchResearch({
    searchText,
    statusFilter,
    countryFilter,
    categoryFilter,
    sourceFilter,
    limitCount = 50,
    offsetCount = 0,
    useAdmin = false
  }: {
    searchText?: string;
    statusFilter?: string;
    countryFilter?: string;
    categoryFilter?: string;
    sourceFilter?: string;
    limitCount?: number;
    offsetCount?: number;
    useAdmin?: boolean;
  } = {}): Promise<{ data: ResearchResult[]; error?: string }> {
    try {
      const client = useAdmin ? supabaseAdmin : supabase;
      
      // Build query with filters
      let query = client
        .from('research_results_with_resources')
        .select('*');

      // Apply filters
      if (searchText) {
        query = query.or(`statement.ilike.%${searchText}%,verdict.ilike.%${searchText}%,source.ilike.%${searchText}%`);
      }
      
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      if (countryFilter) {
        query = query.eq('country', countryFilter);
      }
      
      if (categoryFilter) {
        query = query.eq('category', categoryFilter);
      }
      
      if (sourceFilter) {
        query = query.ilike('source', `%${sourceFilter}%`);
      }

      // Apply pagination and ordering
      const { data, error } = await query
        .order('processed_at', { ascending: false })
        .range(offsetCount, offsetCount + limitCount - 1);

      if (error) throw error;

      return { data: data || [] };
    } catch (error) {
      console.error('Error searching research:', error);
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}