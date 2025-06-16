import { supabaseNewsService } from './supabase-news-service';
import { MockDataService } from './mockDataService';
import { ResearchResult } from '@/app/types/article';
import { translateResearchStatement } from './translation-service';

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
  translate_to?: string;
}

class NewsService {
  /**
   * Get research results with dual strategy: Supabase → Backend → Mock
   */
  async getNews(filters: NewsServiceFilters = {}): Promise<ResearchResult[]> {
    const startTime = Date.now();
    
    // ✅ **STRATEGY 1: Try Supabase first (with translation)**
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
        sort_order: filters.sort_order,
        translateTo: filters.translate_to // ✅ **Pass translation parameter**
      };

      const supabaseResults = await supabaseNewsService.getNews(supabaseFilters);
      
      if (supabaseResults && supabaseResults.length > 0) {
        console.log(`✅ Successfully fetched ${supabaseResults.length} research results from Supabase in ${Date.now() - startTime}ms`);
        
        return supabaseResults.map(result => ({
          ...result,
          __meta: {
            ...result.__meta,
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

    // ✅ **STRATEGY 2: Fallback to Backend API (with manual translation)**
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

      const response = await fetch(`${BACKEND_API_BASE}/news?${params.toString()}`, {
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      });

      if (response.ok) {
        const backendData = await response.json();
        console.log(`✅ Successfully fetched ${Array.isArray(backendData) ? backendData.length : 0} research from backend in ${Date.now() - startTime}ms`);
        
        let processedResults: ResearchResult[] = Array.isArray(backendData) 
          ? backendData.map((item: any) => ({
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
        
        // ✅ **NEW: Apply translation to backend results if requested**
        if (filters.translate_to && processedResults.length > 0) {
          console.log(`🌐 Translating ${processedResults.length} backend statements to ${filters.translate_to}`);
          
          processedResults = await Promise.all(
            processedResults.map(async (result) => {
              if (!result.statement) return result;
              
              try {
                const translatedStatement = await translateResearchStatement(
                  result.statement,
                  'en',
                  filters.translate_to!
                );
                
                return {
                  ...result,
                  statement: translatedStatement || result.statement,
                  __meta: {
                    ...result.__meta,
                    originalStatement: result.statement,
                    translatedTo: filters.translate_to,
                    translationSource: 'lingo-dev'
                  }
                };
              } catch (error) {
                console.warn(`Backend translation failed for ${result.id}:`, error);
                return result;
              }
            })
          );
        }
        
        return processedResults;
      } else {
        console.warn(`⚠️ Backend responded with status: ${response.status}`);
      }
    } catch (backendError) {
      console.warn('⚠️ Backend research fetch failed:', backendError);
    }

    // ✅ **STRATEGY 3: Ultimate fallback to mock data (with translation)**
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
    
    // Convert mock NewsArticle to ResearchResult format
    let convertedResults = mockResults.map(article => ({
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

    // ✅ **NEW: Apply translation to mock results if requested**
    if (filters.translate_to) {
      console.log(`🌐 Translating ${convertedResults.length} mock statements to ${filters.translate_to}`);
      
      convertedResults = await Promise.all(
        convertedResults.map(async (result) => {
          if (!result.statement) return result;
          
          try {
            const translatedStatement = await translateResearchStatement(
              result.statement,
              'en',
              filters.translate_to!
            );
            
            return {
              ...result,
              statement: translatedStatement || result.statement,
              __meta: {
                ...result.__meta,
                originalStatement: result.statement,
                translatedTo: filters.translate_to,
                translationSource: 'lingo-dev'
              }
            };
          } catch (error) {
            console.warn(`Mock translation failed for ${result.id}:`, error);
            return result;
          }
        })
      );
    }

    return convertedResults;
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
      sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc',
      translate_to: searchParams.get('translate_to') || undefined // ✅ **NEW: Parse translation parameter**
    };
  }

  // ... rest of the methods remain the same
}

export const newsService = new NewsService();