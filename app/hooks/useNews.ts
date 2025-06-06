import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { NewsArticle, convertResearchToNews, ResearchResult } from '@/app/types/article';
import { NewsFilters } from '../lib/services/news-service';

const LOCAL_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Enhanced error handling wrapper
async function handleApiResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
  }
  return response.json();
}

async function searchResearchLocal(
  searchText?: string,
  statusFilter?: string,
  countryFilter?: string,
  categoryFilter?: string,
  sourceFilter?: string,
  limitCount: number = 50,
  offsetCount: number = 0
): Promise<NewsArticle[]> {
  const params = new URLSearchParams();
  
  if (searchText) params.append('search_text', searchText);
  if (statusFilter) params.append('status_filter', statusFilter);
  if (countryFilter) params.append('country_filter', countryFilter);
  if (categoryFilter) params.append('category_filter', categoryFilter);
  if (sourceFilter) params.append('source_filter', sourceFilter);
  params.append('limit_count', String(limitCount));
  params.append('offset_count', String(offsetCount));

  const response = await fetch(`${LOCAL_API_BASE}/news?${params.toString()}`);
  const data = await handleApiResponse(response);
  
  // Convert ResearchResult[] to NewsArticle[]
  if (Array.isArray(data)) {
    return data.map((item: ResearchResult) => convertResearchToNews(item));
  }
  
  return [];
}

async function getRecentNewsLocal(options: {
  limit?: number;
  onlyFactChecked?: boolean;
  breaking?: boolean;
} = {}): Promise<NewsArticle[]> {
  const params = new URLSearchParams();
  if (options.limit) params.append('limit', String(options.limit));
  if (options.onlyFactChecked) params.append('only_fact_checked', 'true');
  if (options.breaking) params.append('breaking', 'true');

  const response = await fetch(`${LOCAL_API_BASE}/news?${params.toString()}`);
  const data = await handleApiResponse(response);
  
  // Convert ResearchResult[] to NewsArticle[]
  if (Array.isArray(data)) {
    return data.map((item: ResearchResult) => convertResearchToNews(item));
  }
  
  return [];
}

interface UseNewsOptions {
  limit?: number;
  onlyFactChecked?: boolean;
  breaking?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  categoryFilter?: string;
  searchText?: string;
  statusFilter?: string;
  countryFilter?: string;
  sourceFilter?: string;
}

export function useNews({
  limit = 20,
  onlyFactChecked = false,
  breaking = false,
  autoRefresh = false,
  refreshInterval = 300000,
  categoryFilter,
  searchText,
  statusFilter,
  countryFilter,
  sourceFilter
}: UseNewsOptions = {}) {
  
  // Create comprehensive query key that includes all filters
  const queryKey = [
    'news', 
    { 
      limit, 
      onlyFactChecked, 
      breaking, 
      categoryFilter, 
      searchText,
      statusFilter,
      countryFilter,
      sourceFilter
    }
  ];

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<NewsArticle[]> => {
      // Determine which endpoint to use based on filters
      const hasAdvancedFilters = searchText || statusFilter || countryFilter || categoryFilter || sourceFilter;
      
      if (hasAdvancedFilters) {
        // Use advanced search endpoint
        return searchResearchLocal(
          searchText,
          statusFilter,
          countryFilter,
          categoryFilter,
          sourceFilter,
          limit,
          0 // offset
        );
      } else {
        // Use basic news endpoint
        return getRecentNewsLocal({ limit, onlyFactChecked, breaking });
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false,
    refetchInterval: autoRefresh ? refreshInterval : false,
    refetchIntervalInBackground: false,
    placeholderData: (previousData) => previousData, // Keep previous data while refetching
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors, only on network/5xx errors
      if (error instanceof Error && error.message.includes('4')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    articles: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    refreshNews: query.refetch,
    hasMore: (query.data?.length || 0) >= limit,
    isFetching: query.isFetching,
    isStale: query.isStale,
  };
}

// Enhanced category counts hook with better error handling
export function useCategoryCounts() {
  return useQuery({
    queryKey: ['categories', 'counts'],
    queryFn: async (): Promise<Record<string, number>> => {
      try {
        const response = await fetch(`${LOCAL_API_BASE}/news/categories/available`);
        const data = await handleApiResponse(response);
        
        // Handle different response formats
        if (Array.isArray(data)) {
          // Convert array of {category, count} to Record<string, number>
          const counts: Record<string, number> = {};
          data.forEach((item: {category: string, count: number}) => {
            if (item.category && typeof item.count === 'number') {
              counts[item.category] = item.count;
            }
          });
          return counts;
        } else if (typeof data === 'object' && data !== null) {
          // Already in the correct format
          return data as Record<string, number>;
        }
        
        // Fallback to empty object
        return {};
      } catch (error) {
        console.warn('Failed to fetch category counts:', error);
        // Return empty object instead of throwing in development
        if (process.env.NODE_ENV === 'development') {
          return {};
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // In development, don't retry category counts
      if (process.env.NODE_ENV === 'development') {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 1000,
  });
}

// Other hooks remain the same but with updated error handling...
export function useInfiniteNews({
  limit = 20,
  onlyFactChecked = false,
  breaking = false,
}: Omit<UseNewsOptions, 'autoRefresh' | 'refreshInterval'> = {}) {
  return useInfiniteQuery({
    queryKey: ['news', 'infinite', { limit, onlyFactChecked, breaking }],
    queryFn: async ({ pageParam = 0 }): Promise<NewsArticle[]> => {
      const articles = await getRecentNewsLocal({ 
        limit, 
        onlyFactChecked, 
        breaking 
      });
      // Simple pagination simulation - in real implementation, 
      // you'd pass offset to the API
      const startIndex = pageParam as number;
      return articles.slice(startIndex, startIndex + limit);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: NewsArticle[], pages) => {
      return lastPage.length === limit ? pages.length * limit : undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useResearchResults(filters: any = {}) {
  return useQuery({
    queryKey: ['research', 'results', filters],
    queryFn: () => searchResearchLocal(
      filters.searchText,
      filters.statusFilter,
      filters.countryFilter,
      filters.categoryFilter,
      filters.sourceFilter,
      filters.limitCount || 5,
      filters.offsetCount || 0
    ),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useResearchById(id: string) {
  return useQuery({
    queryKey: ['research', 'result', id],
    queryFn: async () => {
      const response = await fetch(`${LOCAL_API_BASE}/research/${id}`);
      if (!response.ok) {
        throw new Error(`Research fetch failed: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

