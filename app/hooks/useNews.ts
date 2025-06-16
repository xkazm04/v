// app/hooks/useNews.ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { ResearchResult } from '@/app/types/article';
import { MockDataService, demoUtils } from '@/app/lib/services/mockDataService';
import { useMemo, useEffect } from 'react';

const LOCAL_API_BASE = '/api';

async function handleApiResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
  }
  return response.json();
}

async function getResearchFromAPI(
  limit: number = 50,
  offset: number = 0,
  status?: string,
  category?: string,
  country?: string,
  source?: string,
  search?: string
): Promise<ResearchResult[]> {
  console.log(`🔍 Fetching research via Next.js API`);
  
  const params = new URLSearchParams();
  
  // Add pagination
  params.append('limit', String(limit));
  params.append('offset', String(offset));
  
  // Add filters only if they exist and are not 'all' or 'worldwide'
  if (status && status !== 'all') params.append('status_filter', status);
  if (category && category !== 'all') params.append('category_filter', category);
  if (country && country !== 'all' && country !== 'worldwide') params.append('country_filter', country);
  if (source && source !== 'all') params.append('source_filter', source);
  if (search?.trim()) params.append('search_text', search.trim());
  
  // Always sort by processed_at desc to get latest research
  params.append('sort_by', 'processed_at');
  params.append('sort_order', 'desc');

  const response = await fetch(`${LOCAL_API_BASE}/news?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  const data = await handleApiResponse(response);
  
  console.log(`✅ Next.js API returned ${data.results?.length || 0} research results from ${data.results?.[0]?.__meta?.source || 'unknown'} source`);
  
  return data.results || [];
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
  
  // Add demo indicator when in offline mode
  useEffect(() => {
    if (MockDataService.isOfflineMode()) {
      demoUtils.addDemoIndicator();
    } else {
      demoUtils.removeDemoIndicator();
    }
    
    return () => {
      demoUtils.removeDemoIndicator();
    };
  }, []);

  // Create stable query key
  const queryKey = useMemo(() => [
    'research', 
    {
      limit, 
      onlyFactChecked, 
      breaking, 
      categoryFilter: categoryFilter && categoryFilter !== 'all' ? categoryFilter : undefined,
      searchText: searchText?.trim() || undefined,
      statusFilter: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
      countryFilter: countryFilter && countryFilter !== 'all' && countryFilter !== 'worldwide' ? countryFilter : undefined,
      sourceFilter: sourceFilter && sourceFilter !== 'all' ? sourceFilter : undefined,
    }
  ], [limit, onlyFactChecked, breaking, categoryFilter, searchText, statusFilter, countryFilter, sourceFilter]);

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<ResearchResult[]> => {
      return getResearchFromAPI(
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

  // Check if data is from offline mode
  const isOfflineMode = useMemo(() => {
    return query.data?.some(result => result.__meta?.source === 'mock') || false;
  }, [query.data]);

  // Check data source
  const dataSource = useMemo(() => {
    if (!query.data || query.data.length === 0) return 'none';
    const firstResult = query.data[0];
    return firstResult.__meta?.source || 'unknown';
  }, [query.data]);

  return {
    articles: query.data || [], // ✅ Now ResearchResult[] instead of NewsArticle[]
    loading: query.isLoading,
    error: query.error?.message || null,
    refreshNews: query.refetch,
    hasMore: (query.data?.length || 0) >= limit,
    isFetching: query.isFetching,
    isStale: query.isStale,
    isOfflineMode,
    dataSource,
  };
}

// ✅ **Remove category and country hooks since they're no longer needed**

// Enhanced infinite research
export function useInfiniteNews({
  limit = 20,
  onlyFactChecked = false,
  breaking = false,
}: Omit<UseNewsOptions, 'autoRefresh' | 'refreshInterval'> = {}) {
  return useInfiniteQuery({
    queryKey: ['research', 'infinite', { limit, onlyFactChecked, breaking }],
    queryFn: async ({ pageParam = 0 }): Promise<ResearchResult[]> => {
      const offset = pageParam as number;
      return getResearchFromAPI(limit, offset);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: ResearchResult[], pages) => {
      return lastPage.length === limit ? pages.length * limit : undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useOfflineMode() {
  return {
    isOffline: MockDataService.isOfflineMode(),
    toggle: MockDataService.toggleOfflineMode,
    enable: () => {
      localStorage.setItem('demo-offline-mode', 'true');
      window.location.reload();
    },
    disable: () => {
      localStorage.setItem('demo-offline-mode', 'false');
      window.location.reload();
    }
  };
}