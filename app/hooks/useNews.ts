import { useState, useEffect, useCallback, useMemo } from 'react';
import { ResearchResult } from '@/app/types/article';
import { useApiWithPreferences } from './use-api-with-preferences';

export interface UseNewsFilters {
  limit?: number;
  autoRefresh?: boolean;
  categoryFilter?: string;
  countryFilter?: string;
  searchText?: string;
  statusFilter?: string;
  sourceFilter?: string;
  breaking?: boolean;
  onlyFactChecked?: boolean;
}

interface UseNewsReturn {
  articles: ResearchResult[];
  loading: boolean;
  error: string | null;
  refreshNews: () => void;
  dataSource: string;
}

export function useNews(filters: UseNewsFilters = {}): UseNewsReturn {
  const [articles, setArticles] = useState<ResearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('none');
  
  // ✅ **Use universal API client with preferences**
  const { 
    fetchWithPreferences, 
    createUrlWithPreferences,
    translationTarget,
    needsTranslation
  } = useApiWithPreferences();
  
  // Stable filter object to prevent unnecessary re-renders
  const stableFilters = useMemo(() => {
    const params: Record<string, string> = {};
    
    if (filters.limit) params.limit = String(filters.limit);
    if (filters.statusFilter && filters.statusFilter !== 'all') params.status_filter = filters.statusFilter;
    if (filters.categoryFilter && filters.categoryFilter !== 'all') params.category_filter = filters.categoryFilter;
    if (filters.countryFilter && 
        filters.countryFilter !== 'all' && 
        filters.countryFilter !== 'worldwide') {
      params.country_filter = filters.countryFilter;
    }
    if (filters.sourceFilter && filters.sourceFilter !== 'all') params.source_filter = filters.sourceFilter;
    if (filters.searchText?.trim()) params.search_text = filters.searchText.trim();
    params.sort_by = 'processed_at';
    params.sort_order = 'desc';
    
    return params;
  }, [
    filters.limit,
    filters.statusFilter, 
    filters.categoryFilter,
    filters.countryFilter,
    filters.sourceFilter,
    filters.searchText
  ]);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ **Create URL with user preferences automatically applied**
      const apiUrl = createUrlWithPreferences('/api/news', stableFilters);

      console.log(`🔄 Fetching news with preferences:`, {
        url: apiUrl,
        translationTarget: translationTarget || 'none',
        needsTranslation
      });
      
      // ✅ **Use enhanced fetch with preferences**
      const response = await fetchWithPreferences(apiUrl, {
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.details || data.error);
      }

      const results = Array.isArray(data.results) ? data.results : data;
      setArticles(results);
      
      // Determine data source from response metadata
      if (data.__meta?.userPreferences) {
        setDataSource(data.__meta.userPreferences.translationEnabled ? 'translated' : 'original');
      } else {
        setDataSource('unknown');
      }

      console.log(`✅ Successfully loaded ${results.length} news results`);
      
      // ✅ **Log translation status from response**
      if (data.__meta?.userPreferences?.translationEnabled) {
        console.log(`🌐 Content translated to: ${data.__meta.userPreferences.translationTarget}`);
      } else {
        console.log(`📄 Content in original language (English)`);
      }

    } catch (err) {
      console.error('❌ Failed to fetch news:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setArticles([]);
      setDataSource('error');
    } finally {
      setLoading(false);
    }
  }, [stableFilters, fetchWithPreferences, createUrlWithPreferences, translationTarget, needsTranslation]);

  // Auto-refresh logic
  useEffect(() => {
    fetchNews();

    if (filters.autoRefresh) {
      const interval = setInterval(fetchNews, 5 * 60 * 1000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [fetchNews, filters.autoRefresh]);

  const refreshNews = useCallback(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    articles,
    loading,
    error,
    refreshNews,
    dataSource
  };
}