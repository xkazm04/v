// app/lib/services/news-service.ts
import { supabaseNewsService } from './supabase-news-service';
import { MockDataService } from './mockDataService';
import { ResearchResult } from '@/app/types/article';

const BACKEND_API_BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';

export interface NewsServiceFilters {
  limit?: number;
  offset?: number;
  status_filter?: string;
  category_filter?: string;
  country_filter?: string;
  source_filter?: string;
  search_text?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

class NewsService {
  /**
   * Get research results with dual strategy: Supabase → Backend → Mock
   */
  async getNews(filters: NewsServiceFilters = {}): Promise<ResearchResult[]> {
    const startTime = Date.now();
    
    // ✅ **STRATEGY 1: Try Supabase first**
    try {
      console.log('🔄 Attempting Supabase research fetch...');
      
      const supabaseFilters = {
        limit: filters.limit,
        offset: filters.offset,
        status: filters.status_filter,
        category: filters.category_filter,
        country: filters.country_filter,
        source: filters.source_filter,
        search: filters.search_text,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order
      };

      const supabaseResults = await supabaseNewsService.getNews(supabaseFilters);
      
      if (supabaseResults && supabaseResults.length > 0) {
        console.log(`✅ Successfully fetched ${supabaseResults.length} research results from Supabase in ${Date.now() - startTime}ms`);
        
        return supabaseResults.map(result => ({
          ...result,
          __meta: {
            source: 'supabase',
            fetchTime: Date.now() - startTime,
            timestamp: new Date().toISOString()
          }
        }));
      } else {
        console.log('⚠️ No research found in Supabase, trying backend...');
      }
    } catch (supabaseError) {
      console.warn('⚠️ Supabase research fetch failed:', supabaseError);
    }

    // ✅ **STRATEGY 2: Fallback to Backend API**
    try {
      console.log('🔄 Attempting backend research fetch...');
      
      const params = new URLSearchParams();
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.offset) params.append('offset', String(filters.offset));
      if (filters.status_filter && filters.status_filter !== 'all') params.append('status', filters.status_filter);
      if (filters.category_filter && filters.category_filter !== 'all') params.append('category', filters.category_filter);
      if (filters.country_filter && filters.country_filter !== 'all' && filters.country_filter !== 'worldwide') {
        params.append('country', filters.country_filter);
      }
      if (filters.source_filter && filters.source_filter !== 'all') params.append('source', filters.source_filter);
      if (filters.search_text?.trim()) params.append('search', filters.search_text.trim());
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.sort_order) params.append('sort_order', filters.sort_order);

      // ✅ **Use /news endpoint**
      const response = await fetch(`${BACKEND_API_BASE}/news?${params.toString()}`, {
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      });

      if (response.ok) {
        const backendData = await response.json();
        console.log(`✅ Successfully fetched ${Array.isArray(backendData) ? backendData.length : 0} research from backend in ${Date.now() - startTime}ms`);
        
        // ✅ **Return as ResearchResult directly, fix field mapping if needed**
        const processedResults: ResearchResult[] = Array.isArray(backendData) 
          ? backendData.map((item: any) => ({
              // Map backend fields to ResearchResult interface
              id: item.id || '',
              statement: item.statement || '',
              source: item.source || '',
              context: item.context || '',
              request_datetime: item.request_datetime || item.created_at || new Date().toISOString(),
              statement_date: item.statement_date,
              country: item.country,
              valid_sources: item.valid_sources || '',
              verdict: item.verdict || '',
              status: item.status || 'UNVERIFIABLE',
              correction: item.correction,
              experts: item.experts,
              resources_agreed: item.resources_agreed,
              resources_disagreed: item.resources_disagreed,
              processed_at: item.processed_at || item.created_at || new Date().toISOString(),
              created_at: item.created_at || new Date().toISOString(),
              updated_at: item.updated_at || new Date().toISOString(),
              category: item.category,
              profileId: item.profileId || item.profile_id,
              __meta: {
                source: 'backend',
                fetchTime: Date.now() - startTime,
                timestamp: new Date().toISOString()
              }
            }))
          : [];
        
        return processedResults;
      } else {
        console.warn(`⚠️ Backend responded with status: ${response.status}`);
      }
    } catch (backendError) {
      console.warn('⚠️ Backend research fetch failed:', backendError);
    }

    // ✅ **STRATEGY 3: Ultimate fallback to mock data**
    console.log('🔄 Using mock data fallback...');
    
    const mockResults = MockDataService.getMockNews({
      limit: filters.limit,
      offset: filters.offset,
      status: filters.status_filter,
      category: filters.category_filter,
      country: filters.country_filter,
      source: filters.source_filter,
      search: filters.search_text
    });

    console.log(`✅ Using ${mockResults.length} mock research results`);
    
    // ✅ **Convert mock NewsArticle to ResearchResult format**
    return mockResults.map(article => ({
      id: article.id,
      statement: article.headline,
      source: article.source.name,
      context: article.summary,
      request_datetime: article.publishedAt,
      statement_date: article.statementDate,
      country: article.country,
      valid_sources: '',
      verdict: article.factCheck.verdict,
      status: article.factCheck.evaluation,
      correction: '',
      experts: article.factCheck.experts,
      resources_agreed: article.factCheck.resources_agreed,
      resources_disagreed: article.factCheck.resources_disagreed,
      processed_at: article.publishedAt,
      created_at: article.datePublished,
      updated_at: article.publishedAt,
      category: article.category,
      profileId: article.profileId,
      __meta: {
        source: 'mock',
        fetchTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        warning: 'Using offline mock data'
      }
    }));
  }

  /**
   * Parse search parameters
   */
  parseSearchParams(searchParams: URLSearchParams): NewsServiceFilters {
    return {
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
      status_filter: searchParams.get('status_filter') || undefined,
      category_filter: searchParams.get('category_filter') || undefined,
      country_filter: searchParams.get('country_filter') || undefined,
      source_filter: searchParams.get('source_filter') || undefined,
      search_text: searchParams.get('search_text') || undefined,
      sort_by: searchParams.get('sort_by') || 'processed_at',
      sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc'
    };
  }

  /**
   * Check if request has search parameters
   */
  isSearchRequest(params: any): boolean {
    return !!(
      params.search_text ||
      (params.status_filter && params.status_filter !== 'all') ||
      (params.category_filter && params.category_filter !== 'all') ||
      (params.country_filter && params.country_filter !== 'all' && params.country_filter !== 'worldwide') ||
      (params.source_filter && params.source_filter !== 'all')
    );
  }

  /**
   * Parse recent news parameters
   */
  parseRecentNewsParams(searchParams: URLSearchParams): NewsServiceFilters {
    return {
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
      sort_by: 'processed_at',
      sort_order: 'desc'
    };
  }

  /**
   * Search research with filters
   */
  async searchResearch(filters: NewsServiceFilters): Promise<ResearchResult[]> {
    return this.getNews(filters);
  }

  /**
   * Get recent research
   */
  async getRecentNews(filters: NewsServiceFilters): Promise<ResearchResult[]> {
    return this.getNews({
      ...filters,
      sort_by: 'processed_at',
      sort_order: 'desc'
    });
  }
}

export const newsService = new NewsService();