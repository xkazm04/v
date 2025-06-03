import { NewsArticle, ResearchResult } from '@/app/types/article';

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
  ) {
    const params = new URLSearchParams();
    
    if (searchText) params.append('search_text', searchText);
    if (statusFilter) params.append('status_filter', statusFilter);
    if (countryFilter) params.append('country_filter', countryFilter);
    if (categoryFilter) params.append('category_filter', categoryFilter);
    if (sourceFilter) params.append('source_filter', sourceFilter);
    params.append('limit_count', String(limitCount));
    params.append('offset_count', String(offsetCount));

    return this.request(`/news/search/advanced?${params.toString()}`);
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

  private convertToNewsArticle(research: ResearchResult): NewsArticle {
    const statusToScore = {
      'TRUE': 0.9,
      'PARTIALLY_TRUE': 0.7,
      'MISLEADING': 0.4,
      'FALSE': 0.1,
      'UNVERIFIABLE': 0.5
    };

    const statusToConfidence = {
      'TRUE': 95,
      'PARTIALLY_TRUE': 75,
      'MISLEADING': 65,
      'FALSE': 90,
      'UNVERIFIABLE': 30
    };

    return {
      id: research.id,
      headline: research.statement.length > 100 
        ? research.statement.substring(0, 97) + '...'
        : research.statement,
      source: {
        name: research.source || 'Unknown Source',
        logoUrl: undefined
      },
      category: 'General',
      datePublished: research.statement_date || research.processed_at,
      truthScore: statusToScore[research.status],
      isBreaking: research.status === 'FALSE' || research.status === 'MISLEADING',
      publishedAt: research.processed_at,
      factCheck: {
        evaluation: research.status,
        confidence: statusToConfidence[research.status],
        verdict: research.verdict,
        experts: research.experts,
        resources_agreed: research.resources_agreed,
        resources_disagreed: research.resources_disagreed
      },
      citation: research.source || '',
      summary: research.verdict,
      statementDate: research.statement_date,
      researchId: research.id
    };
  }
}

export const newsAPI = new NewsAPI();