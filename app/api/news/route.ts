import { NewsArticle, ResearchResult, convertResearchToNews } from '@/app/types/article';
import { NextRequest, NextResponse } from 'next/server';
import { ResearchApiService } from '@/lib/services/research-api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface NewsFilters {
  limit?: number;
  offset?: number;
  status?: 'TRUE' | 'FALSE' | 'MISLEADING' | 'PARTIALLY_TRUE' | 'UNVERIFIABLE';
  category?: string;
  country?: string;
  source?: string;
  date_from?: string;
  date_to?: string;
  processed_from?: string;
  processed_to?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface NewsStats {
  total_results: number;
  status_distribution: Record<string, number>;
  category_distribution: Record<string, number>;
  country_distribution: Record<string, number>;
  recent_results: number;
  earliest_result: string | null;
  latest_result: string | null;
}

export interface CategoryInfo {
  category: string;
  count: number;
}

export interface CountryInfo {
  country: string;
  count: number;
}

class NewsAPI {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getResearchResults(filters: NewsFilters = {}): Promise<ResearchResult[]> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    const endpoint = `/news${queryString ? `?${queryString}` : ''}`;
    
    return this.request<ResearchResult[]>(endpoint);
  }

  async getResearchById(id: string): Promise<ResearchResult> {
    return this.request<ResearchResult>(`/news/${id}`);
  }

  async searchResearch(
    searchText?: string,
    statusFilter?: string,
    countryFilter?: string,
    categoryFilter?: string,
    sourceFilter?: string,
    limitCount: number = 50,
    offsetCount: number = 0
  ): Promise<ResearchResult[]> {
    const params = new URLSearchParams();
    
    if (searchText) params.append('search_text', searchText);
    if (statusFilter) params.append('status_filter', statusFilter);
    if (countryFilter) params.append('country_filter', countryFilter);
    if (categoryFilter) params.append('category_filter', categoryFilter);
    if (sourceFilter) params.append('source_filter', sourceFilter);
    params.append('limit_count', String(limitCount));
    params.append('offset_count', String(offsetCount));

    return this.request<ResearchResult[]>(`/research/search/advanced?${params.toString()}`);
  }

  async getNewsStats(): Promise<NewsStats> {
    return this.request<NewsStats>('/news/stats/summary');
  }

  async getAvailableCategories(): Promise<CategoryInfo[]> {
    return this.request<CategoryInfo[]>('/news/categories/available');
  }

  async getAvailableCountries(): Promise<CountryInfo[]> {
    return this.request<CountryInfo[]>('/news/countries/available');
  }

  // Helper methods to get news-formatted data
  async getRecentNews(filters: {
    limit?: number;
    onlyFactChecked?: boolean;
    breaking?: boolean;
  } = {}): Promise<NewsArticle[]> {
    const newsFilters: NewsFilters = {
      limit: filters.limit || 20,
      sort_by: 'processed_at',
      sort_order: 'desc'
    };

    // Filter for fact-checked items (exclude UNVERIFIABLE)
    if (filters.onlyFactChecked) {
      // We'll need to make multiple requests for different statuses
      const statuses: Array<'TRUE' | 'FALSE' | 'MISLEADING' | 'PARTIALLY_TRUE'> = 
        ['TRUE', 'FALSE', 'MISLEADING', 'PARTIALLY_TRUE'];
      
      const allResults: ResearchResult[] = [];
      
      for (const status of statuses) {
        const results = await this.getResearchResults({
          ...newsFilters,
          status,
          limit: Math.ceil((filters.limit || 20) / statuses.length)
        });
        allResults.push(...results);
      }
      
      // Sort by processed_at and limit
      allResults.sort((a, b) => 
        new Date(b.processed_at).getTime() - new Date(a.processed_at).getTime()
      );
      
      return allResults
        .slice(0, filters.limit || 20)
        .map(this.convertToNewsArticle);
    }

    // Filter for breaking news (FALSE or MISLEADING)
    if (filters.breaking) {
      const breakingResults = await Promise.all([
        this.getResearchResults({ ...newsFilters, status: 'FALSE' }),
        this.getResearchResults({ ...newsFilters, status: 'MISLEADING' })
      ]);
      
      const combined = [...breakingResults[0], ...breakingResults[1]]
        .sort((a, b) => 
          new Date(b.processed_at).getTime() - new Date(a.processed_at).getTime()
        )
        .slice(0, filters.limit || 20);
      
      return combined.map(result => ({
        ...this.convertToNewsArticle(result),
        isBreaking: true
      }));
    }

    // Default: get all recent results
    const results = await this.getResearchResults(newsFilters);
    return results.map(this.convertToNewsArticle);
  }

  // Use the existing utility function instead of duplicate code
  convertToNewsArticle(research: ResearchResult): NewsArticle {
    return convertResearchToNews(research);
  }
}

export const newsAPI = new NewsAPI();

// Add GET handler for both search and general news fetching
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check if this is a search request or general news request
    const searchText = searchParams.get('search_text');
    const statusFilter = searchParams.get('status_filter');
    const countryFilter = searchParams.get('country_filter'); 
    const categoryFilter = searchParams.get('category_filter');
    const sourceFilter = searchParams.get('source_filter');
    const limitCount = parseInt(searchParams.get('limit_count') || '50');
    const offsetCount = parseInt(searchParams.get('offset_count') || '0');

    // Check for general news parameters
    const limit = parseInt(searchParams.get('limit') || '20');
    const onlyFactChecked = searchParams.get('only_fact_checked') === 'true';
    const breaking = searchParams.get('breaking') === 'true';

    // If it's a search request (has search parameters)
    if (searchText || statusFilter || countryFilter || categoryFilter || sourceFilter) {
      const filters = {
        searchText: searchText || undefined,
        statusFilter: statusFilter || undefined,
        countryFilter: countryFilter || undefined,
        categoryFilter: categoryFilter || undefined,
        sourceFilter: sourceFilter || undefined,
        limitCount,
        offsetCount
      };

      const result = await ResearchApiService.searchResearch(filters);

      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      // Convert raw research results to NewsArticle format using the utility function
      const articles = (result.data || []).map((research: ResearchResult) => 
        convertResearchToNews(research)
      );

      return NextResponse.json(articles);
    }

    // Otherwise, it's a general news request
    const articles = await newsAPI.getRecentNews({
      limit,
      onlyFactChecked,
      breaking
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}