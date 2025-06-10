import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { NewsArticle, convertResearchToNews, ResearchResult } from '@/app/types/article';
import { MockDataService, demoUtils } from '@/app/services/mockDataService';
import { useMemo, useEffect } from 'react';

const LOCAL_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Enhanced error handling wrapper
async function handleApiResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
  }
  return response.json();
}

// Check if API is reachable
async function checkApiHealth(): Promise<boolean> {
  if (!LOCAL_API_BASE) return false;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${LOCAL_API_BASE}/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log('API health check failed:', error);
    return false;
  }
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
  // Check if we should use offline mode
  const isOfflineMode = MockDataService.isOfflineMode();
  const isApiHealthy = !isOfflineMode ? await checkApiHealth() : false;

  // Use mock data if offline mode is enabled OR API is not reachable
  if (isOfflineMode || !isApiHealthy) {
    console.log(isOfflineMode ? '🔄 Using demo offline mode' : '⚠️ API unreachable, falling back to offline data');
    
    const mockNews = MockDataService.getMockNews({
      limit,
      offset,
      status,
      category,
      country,
      source,
      search
    });

    // Simulate network delay for realistic demo experience
    return MockDataService.simulateNetworkDelay(mockNews, isOfflineMode ? 600 : 1200);
  }

  // Try to fetch from API
  try {
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

    const response = await fetch(`${LOCAL_API_BASE}/news?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await handleApiResponse(response);
    
    if (Array.isArray(data)) {
      return data.map((item: ResearchResult) => convertResearchToNews(item));
    }
    
    return [];
  } catch (error) {
    console.warn('API request failed, falling back to offline data:', error);
    
    // Fallback to mock data on API failure
    const mockNews = MockDataService.getMockNews({
      limit,
      offset,
      status,
      category,
      country,
      source,
      search
    });

    return MockDataService.simulateNetworkDelay(mockNews, 1000);
  }
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
    'news', 
    {
      limit, 
      onlyFactChecked, 
      breaking, 
      categoryFilter: categoryFilter && categoryFilter !== 'all' ? categoryFilter : undefined,
      searchText: searchText?.trim() || undefined,
      statusFilter: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
      countryFilter: countryFilter && countryFilter !== 'all' && countryFilter !== 'worldwide' ? countryFilter : undefined,
      sourceFilter: sourceFilter && sourceFilter !== 'all' ? sourceFilter : undefined,
      offlineMode: MockDataService.isOfflineMode() // Include offline mode in cache key
    }
  ], [limit, onlyFactChecked, breaking, categoryFilter, searchText, statusFilter, countryFilter, sourceFilter]);

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<NewsArticle[]> => {
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
    staleTime: MockDataService.isOfflineMode() ? 5 * 60 * 1000 : 2 * 60 * 1000, // Longer stale time for offline
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchInterval: autoRefresh && !MockDataService.isOfflineMode() ? refreshInterval : false, // Disable auto-refresh in offline mode
    refetchIntervalInBackground: false,
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error) => {
      // Don't retry in offline mode
      if (MockDataService.isOfflineMode()) return false;
      
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
    isOfflineMode: MockDataService.isOfflineMode(), // Expose offline mode status
  };
}

// Enhanced category counts with offline fallback
export function useCategoryCounts() {
  return useQuery({
    queryKey: ['categories', 'counts', MockDataService.isOfflineMode()],
    queryFn: async (): Promise<Record<string, number>> => {
      const isOfflineMode = MockDataService.isOfflineMode();
      const isApiHealthy = !isOfflineMode ? await checkApiHealth() : false;

      if (isOfflineMode || !isApiHealthy) {
        return MockDataService.simulateNetworkDelay(
          MockDataService.getMockCategories(),
          isOfflineMode ? 300 : 800
        );
      }

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
        console.warn('Categories API failed, using offline data');
        return MockDataService.getMockCategories();
      }
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

// Enhanced country counts with offline fallback
export function useCountryCounts() {
  return useQuery({
    queryKey: ['countries', 'counts', MockDataService.isOfflineMode()],
    queryFn: async (): Promise<Record<string, number>> => {
      const isOfflineMode = MockDataService.isOfflineMode();
      const isApiHealthy = !isOfflineMode ? await checkApiHealth() : false;

      if (isOfflineMode || !isApiHealthy) {
        return MockDataService.simulateNetworkDelay(
          MockDataService.getMockCountries(),
          isOfflineMode ? 300 : 800
        );
      }

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
        console.warn('Countries API failed, using offline data');
        return MockDataService.getMockCountries();
      }
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

// Enhanced infinite news with offline support
export function useInfiniteNews({
  limit = 20,
  onlyFactChecked = false,
  breaking = false,
}: Omit<UseNewsOptions, 'autoRefresh' | 'refreshInterval'> = {}) {
  return useInfiniteQuery({
    queryKey: ['news', 'infinite', { limit, onlyFactChecked, breaking, offlineMode: MockDataService.isOfflineMode() }],
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

// Enhanced research by ID with offline support
export function useResearchById(id: string) {
  return useQuery({
    queryKey: ['research', 'result', id, MockDataService.isOfflineMode()],
    queryFn: async () => {
      const isOfflineMode = MockDataService.isOfflineMode();
      
      if (isOfflineMode) {
        const mockArticle = MockDataService.getMockArticleById(id);
        if (!mockArticle) {
          throw new Error('Article not found in offline data');
        }
        return MockDataService.simulateNetworkDelay(mockArticle, 400);
      }

      try {
        const response = await fetch(`${LOCAL_API_BASE}/news/${id}`);
        if (!response.ok) {
          throw new Error(`Research fetch failed: ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        // Fallback to offline data
        const mockArticle = MockDataService.getMockArticleById(id);
        if (mockArticle) {
          return mockArticle;
        }
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}

// Demo utility hook for toggling offline mode
export function useOfflineMode() {
  return {
    isOffline: MockDataService.isOfflineMode(),
    toggle: MockDataService.toggleOfflineMode,
    enable: () => {
      localStorage.setItem('demo-offline-mode', 'true');
      window.location.reload(); // Reload to apply changes
    },
    disable: () => {
      localStorage.setItem('demo-offline-mode', 'false');
      window.location.reload(); // Reload to apply changes
    }
  };
}

