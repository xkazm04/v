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
}

class SupabaseNewsService {
  /**
   * Get research results from Supabase research_results table
   */
  async getNews(filters: SupabaseNewsFilters = {}): Promise<ResearchResult[]> {
    try {
      // Test connection first
      const { data: testData, error: testError } = await supabaseAdmin
        .from('research_results')
        .select('id, statement')
        .limit(1);

      if (testError) {
        throw new Error(`Supabase connection failed: ${testError.message}`);
      }

      if (!testData || testData.length === 0) {
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
          processed_at,
          created_at,
          updated_at,
          profile_id
        `);

      // Apply filters only with strict validation
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
        throw new Error(`Supabase query failed: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Convert to ResearchResult format
      return data.map((item: any): ResearchResult => ({
        id: item.id,
        statement: item.statement || '',
        source: item.source || '',
        context: item.context || '',
        request_datetime: item.request_datetime || item.created_at,
        statement_date: item.statement_date,
        country: item.country, // Add country field
        valid_sources: item.valid_sources || '',
        verdict: item.verdict || '',
        status: item.status || 'UNVERIFIABLE',
        correction: item.correction,
        experts: this.parseJsonField(item.experts),
        resources_agreed: this.parseJsonField(item.resources_agreed),
        resources_disagreed: this.parseJsonField(item.resources_disagreed),
        profileId: item.profile_id, // Add profileId field
        processed_at: item.processed_at || item.created_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
        category: item.category
      }));

    } catch (error) {
      return [];
    }
  }

  /**
   * Get single research result by ID
   */
  async getNewsById(id: string): Promise<ResearchResult | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('research_results')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      return {
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
    } catch (error) {
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
      const { error } = await supabaseAdmin
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