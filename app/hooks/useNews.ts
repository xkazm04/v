import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { NewsFilters, newsAPI } from '../api/news/route';


interface UseNewsOptions {
  limit?: number;
  onlyFactChecked?: boolean;
  breaking?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  filters?: NewsFilters;
}

export function useNews({
  limit = 20,
  onlyFactChecked = false,
  breaking = false,
  autoRefresh = false,
  refreshInterval = 300000,
  filters = {}
}: UseNewsOptions = {}) {
  const query = useQuery({
    queryKey: ['news', { limit, onlyFactChecked, breaking, filters }],
    queryFn: () => newsAPI.getRecentNews({ limit, onlyFactChecked, breaking }),
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
        offset: pageParam
      };
      return newsAPI.getResearchResults(newsFilters);
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === limit ? pages.length * limit : undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data) => {
      // Convert research results to news articles
      const allResults = data.pages.flat();
      return allResults.map(result => newsAPI['convertToNewsArticle'](result));
    }
  });
}

export function useResearchResults(filters: NewsFilters = {}) {
  return useQuery({
    queryKey: ['research', 'results', filters],
    queryFn: () => newsAPI.getResearchResults(filters),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useResearchById(id: string) {
  return useQuery({
    queryKey: ['research', 'result', id],
    queryFn: () => newsAPI.getResearchById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

export function useNewsStats() {
  return useQuery({
    queryKey: ['news', 'stats'],
    queryFn: () => newsAPI.getNewsStats(),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useAvailableCategories() {
  return useQuery({
    queryKey: ['news', 'categories'],
    queryFn: () => newsAPI.getAvailableCategories(),
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useAvailableCountries() {
  return useQuery({
    queryKey: ['news', 'countries'],
    queryFn: () => newsAPI.getAvailableCountries(),
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
    queryFn: () => newsAPI.searchResearch(
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