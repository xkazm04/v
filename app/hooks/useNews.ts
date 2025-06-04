import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { NewsFilters } from '../lib/services/news-service';

// Update to use local API routes instead of external API
const LOCAL_API_BASE = '/api';

async function searchResearchLocal(
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

  const response = await fetch(`${LOCAL_API_BASE}/news?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }
  return response.json();
}

async function getResearchResultsLocal(filters: NewsFilters = {}) {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  const response = await fetch(`${LOCAL_API_BASE}/research?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Research fetch failed: ${response.statusText}`);
  }
  return response.json();
}

async function getRecentNewsLocal(options: {
  limit?: number;
  onlyFactChecked?: boolean;
  breaking?: boolean;
} = {}) {
  const params = new URLSearchParams();
  if (options.limit) params.append('limit', String(options.limit));
  if (options.onlyFactChecked) params.append('only_fact_checked', 'true');
  if (options.breaking) params.append('breaking', 'true');

  const response = await fetch(`${LOCAL_API_BASE}/news?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`News fetch failed: ${response.statusText}`);
  }
  return response.json();
}

interface UseNewsOptions {
  limit?: number;
  onlyFactChecked?: boolean;
  breaking?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  filters?: NewsFilters;
  categoryFilter?: string;
}

export function useNews({
  limit = 20,
  onlyFactChecked = false,
  breaking = false,
  autoRefresh = false,
  refreshInterval = 300000,
  filters = {},
  categoryFilter
}: UseNewsOptions = {}) {
  // Build the complete filters object
  const completeFilters = {
    ...filters,
    ...(categoryFilter && { category: categoryFilter })
  };

  const query = useQuery({
    queryKey: ['news', { limit, onlyFactChecked, breaking, categoryFilter, filters }],
    queryFn: () => {
      // If we have category filter or other filters, use search endpoint
      if (categoryFilter || Object.keys(filters).length > 0) {
        return searchResearchLocal(
          undefined, // searchText
          undefined, // statusFilter
          undefined, // countryFilter
          categoryFilter, // categoryFilter
          undefined, // sourceFilter
          limit,
          0 // offset
        );
      }
      // Otherwise use the regular news endpoint
      return getRecentNewsLocal({ limit, onlyFactChecked, breaking });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  return {
    articles: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    refreshNews: query.refetch,
    hasMore: (query.data?.length || 0) >= limit,
    loadMore: async () => {
      // For load more, we'd need to implement infinite query
      // This is a placeholder for the current interface
    }
  };
}

export function useInfiniteNews({
  limit = 20,
  onlyFactChecked = false,
  breaking = false,
  filters = {}
}: Omit<UseNewsOptions, 'autoRefresh' | 'refreshInterval'> = {}) {
  return useInfiniteQuery({
    queryKey: ['news', 'infinite', { limit, onlyFactChecked, breaking, filters }],
    queryFn: ({ pageParam = 0 }) => {
      const newsFilters = {
        ...filters,
        limit,
        offset: pageParam as number
      };
      return getResearchResultsLocal(newsFilters);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, pages) => {
      return (lastPage as any[]).length === limit ? pages.length * limit : undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useResearchResults(filters: NewsFilters = {}) {
  return useQuery({
    queryKey: ['research', 'results', filters],
    queryFn: () => getResearchResultsLocal(filters),
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

export function useNewsStats() {
  return useQuery({
    queryKey: ['news', 'stats'],
    queryFn: async () => {
      const response = await fetch(`${LOCAL_API_BASE}/news/stats`);
      if (!response.ok) {
        throw new Error(`News stats fetch failed: ${response.statusText}`);
      }
      return response.json();
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useAvailableCategories() {
  return useQuery({
    queryKey: ['news', 'categories'],
    queryFn: async () => {
      const response = await fetch(`${LOCAL_API_BASE}/news/categories`);
      if (!response.ok) {
        throw new Error(`News categories fetch failed: ${response.statusText}`);
      }
      return response.json();
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useAvailableCountries() {
  return useQuery({
    queryKey: ['news', 'countries'],
    queryFn: async () => {
      const response = await fetch(`${LOCAL_API_BASE}/news/countries`);
      if (!response.ok) {
        throw new Error(`News countries fetch failed: ${response.statusText}`);
      }
      return response.json();
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useSearchResearch(
  searchText?: string,
  statusFilter?: string,
  countryFilter?: string,
  categoryFilter?: string,
  sourceFilter?: string,
  limitCount: number = 50,
  offsetCount: number = 0
) {
  return useQuery({
    queryKey: [
      'research', 
      'search', 
      searchText, 
      statusFilter, 
      countryFilter, 
      categoryFilter,
      sourceFilter,
      limitCount,
      offsetCount
    ],
    queryFn: () => searchResearchLocal(
      searchText,
      statusFilter,
      countryFilter,
      categoryFilter,
      sourceFilter,
      limitCount,
      offsetCount
    ),
    enabled: !!(searchText || statusFilter || countryFilter || categoryFilter || sourceFilter),
    staleTime: 5 * 60 * 1000,
  });
}

// Add to useNews hook exports - get category counts
export function useCategoryCounts() {
  return useQuery({
    queryKey: ['categories', 'counts'],
    queryFn: async () => {
      const response = await fetch(`${LOCAL_API_BASE}/news/categories`);
      if (!response.ok) {
        throw new Error(`Category counts fetch failed: ${response.statusText}`);
      }
      const data = await response.json();
      
      // Convert array of {category, count} to Record<string, number>
      const counts: Record<string, number> = {};
      if (Array.isArray(data)) {
        data.forEach((item: {category: string, count: number}) => {
          counts[item.category] = item.count;
        });
      }
      
      return counts;
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}