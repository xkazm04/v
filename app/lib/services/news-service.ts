import { NewsArticle, ResearchResult, convertResearchToNews } from '@/app/types/article';
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

export interface SearchFilters {
  searchText?: string;
  statusFilter?: string;
  countryFilter?: string;
  categoryFilter?: string;
  sourceFilter?: string;
  limitCount?: number;
  offsetCount?: number;
}

export interface RecentNewsFilters {
  limit?: number;
  onlyFactChecked?: boolean;
  breaking?: boolean;
}

class NewsService {
  private static instance: NewsService;

  private constructor() {}

  public static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService();
    }
    return NewsService.instance;
  }

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

  async searchResearch(filters: SearchFilters): Promise<NewsArticle[]> {
    const {
      searchText,
      statusFilter,
      countryFilter,
      categoryFilter,
      sourceFilter,
      limitCount = 50,
      offsetCount = 0
    } = filters;

    const searchFilters = {
      searchText,
      statusFilter,
      countryFilter,
      categoryFilter,
      sourceFilter,
      limitCount,
      offsetCount
    };

    const result = await ResearchApiService.searchResearch(searchFilters);

    if (result.error) {
      throw new Error(result.error);
    }

    // Convert raw research results to NewsArticle format
    return (result.data || []).map((research: ResearchResult) => 
      convertResearchToNews(research)
    );
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

  async getRecentNews(filters: RecentNewsFilters = {}): Promise<NewsArticle[]> {
    const newsFilters: NewsFilters = {
      limit: filters.limit || 20,
      sort_by: 'processed_at',
      sort_order: 'desc'
    };

    // Filter for fact-checked items (exclude UNVERIFIABLE)
    if (filters.onlyFactChecked) {
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

  // Helper method to convert research to news article
  convertToNewsArticle(research: ResearchResult): NewsArticle {
    return convertResearchToNews(research);
  }

  // Determine if request is a search request based on parameters
  isSearchRequest(params: Record<string, string | null>): boolean {
    const searchParams = ['search_text', 'status_filter', 'country_filter', 'category_filter', 'source_filter'];
    return searchParams.some(param => params[param] !== null && params[param] !== undefined);
  }

  // Parse search parameters from URL search params
  parseSearchParams(searchParams: URLSearchParams): SearchFilters {
    return {
      searchText: searchParams.get('search_text') || undefined,
      statusFilter: searchParams.get('status_filter') || undefined,
      countryFilter: searchParams.get('country_filter') || undefined,
      categoryFilter: searchParams.get('category_filter') || undefined,
      sourceFilter: searchParams.get('source_filter') || undefined,
      limitCount: parseInt(searchParams.get('limit_count') || '50'),
      offsetCount: parseInt(searchParams.get('offset_count') || '0')
    };
  }

  // Parse recent news parameters from URL search params
  parseRecentNewsParams(searchParams: URLSearchParams): RecentNewsFilters {
    return {
      limit: parseInt(searchParams.get('limit') || '20'),
      onlyFactChecked: searchParams.get('only_fact_checked') === 'true',
      breaking: searchParams.get('breaking') === 'true'
    };
  }
}

// Export the singleton instance
export const newsService = NewsService.getInstance();

// Export helper functions for easier usage
export async function fetchRecentNews(filters?: RecentNewsFilters): Promise<NewsArticle[]> {
  return newsService.getRecentNews(filters);
}

export async function searchNews(filters: SearchFilters): Promise<NewsArticle[]> {
  return newsService.searchResearch(filters);
}

export async function fetchNewsById(id: string): Promise<ResearchResult> {
  return newsService.getResearchById(id);
}

export async function fetchNewsStats(): Promise<NewsStats> {
  return newsService.getNewsStats();
}

export async function fetchAvailableCategories(): Promise<CategoryInfo[]> {
  return newsService.getAvailableCategories();
}

export async function fetchAvailableCountries(): Promise<CountryInfo[]> {
  return newsService.getAvailableCountries();
}