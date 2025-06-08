import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { NewsArticle, convertResearchToNews, ResearchResult } from '@/app/types/article';
import { useMemo } from 'react';

const LOCAL_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Enhanced error handling wrapper
async function handleApiResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
  }
  return response.json();
}

async function getNewsFromResearch(
  limit: number = 50,
  offset: number = 0,
  status?: string,
  category?: string,
  country?: string,
  source?: string,
  search?: string
): Promise<NewsArticle[]> {
  const params = new URLSearchParams();
  
  // Add pagination
  params.append('limit', String(limit));
  params.append('offset', String(offset));
  
  // Add filters only if they exist and are not 'all' or 'worldwide'
  if (status && status !== 'all') params.append('status', status);
  if (category && category !== 'all') params.append('category', category);
  if (country && country !== 'all' && country !== 'worldwide') params.append('country', country);
  if (source && source !== 'all') params.append('source', source);
  if (search?.trim()) params.append('search', search.trim());
  
  // Always sort by processed_at desc to get latest news
  params.append('sort_by', 'processed_at');
  params.append('sort_order', 'desc');

  const response = await fetch(`${LOCAL_API_BASE}/news?${params.toString()}`);
  const data = await handleApiResponse(response);
  
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
  
  // Create stable query key
  const queryKey = useMemo(() => [
    'news', 
    {
      limit, 
      onlyFactChecked, 
      breaking, 
      categoryFilter: categoryFilter && categoryFilter !== 'all' ? categoryFilter : undefined,
      searchText: searchText?.trim() || undefined,
      statusFilter: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
      countryFilter: countryFilter && countryFilter !== 'all' && countryFilter !== 'worldwide' ? countryFilter : undefined,
      sourceFilter: sourceFilter && sourceFilter !== 'all' ? sourceFilter : undefined
    }
  ], [limit, onlyFactChecked, breaking, categoryFilter, searchText, statusFilter, countryFilter, sourceFilter]);

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<NewsArticle[]> => {
      // Use the /news endpoint which maps to research results
      return getNewsFromResearch(
        limit,
        0, // offset
        statusFilter === 'all' ? undefined : statusFilter,
        categoryFilter === 'all' ? undefined : categoryFilter,
        countryFilter === 'all' || countryFilter === 'worldwide' ? undefined : countryFilter,
        sourceFilter === 'all' ? undefined : sourceFilter,
        searchText?.trim()
      );
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchInterval: autoRefresh ? refreshInterval : false,
    refetchIntervalInBackground: false,
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('4')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
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

// Use existing endpoints for counts
export function useCategoryCounts() {
  return useQuery({
    queryKey: ['categories', 'counts'],
    queryFn: async (): Promise<Record<string, number>> => {
      try {
        const response = await fetch(`${LOCAL_API_BASE}/news/categories/available`);
        const data = await handleApiResponse(response);
        
        if (Array.isArray(data)) {
          const counts: Record<string, number> = {};
          data.forEach((item: {category: string, count: number}) => {
            if (item.category && typeof item.count === 'number') {
              counts[item.category] = item.count;
            }
          });
          return counts;
        }
        
        return {};
      } catch (error) {
        return {};
      }
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useCountryCounts() {
  return useQuery({
    queryKey: ['countries', 'counts'],
    queryFn: async (): Promise<Record<string, number>> => {
      try {
        const response = await fetch(`${LOCAL_API_BASE}/news/countries/available`);
        const data = await handleApiResponse(response);
        
        if (Array.isArray(data)) {
          const counts: Record<string, number> = {};
          data.forEach((item: {country: string, count: number}) => {
            if (item.country && typeof item.count === 'number') {
              counts[item.country] = item.count;
            }
          });
          return counts;
        }
        
        return {};
      } catch (error) {
        return {};
      }
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

// Keep other existing hooks...
export function useInfiniteNews({
  limit = 20,
  onlyFactChecked = false,
  breaking = false,
}: Omit<UseNewsOptions, 'autoRefresh' | 'refreshInterval'> = {}) {
  return useInfiniteQuery({
    queryKey: ['news', 'infinite', { limit, onlyFactChecked, breaking }],
    queryFn: async ({ pageParam = 0 }): Promise<NewsArticle[]> => {
      const offset = pageParam as number;
      return getNewsFromResearch(limit, offset);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: NewsArticle[], pages) => {
      return lastPage.length === limit ? pages.length * limit : undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useResearchResults(filters: any = {}) {
  return useQuery({
    queryKey: ['research', 'results', filters],
    queryFn: () => getNewsFromResearch(
      filters.limitCount || 5,
      filters.offsetCount || 0,
      filters.statusFilter,
      filters.categoryFilter,
      filters.countryFilter,
      filters.sourceFilter,
      filters.searchText
    ),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useResearchById(id: string) {
  return useQuery({
    queryKey: ['research', 'result', id],
    queryFn: async () => {
      const response = await fetch(`${LOCAL_API_BASE}/news/${id}`);
      if (!response.ok) {
        throw new Error(`Research fetch failed: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

