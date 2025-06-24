'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useApiWithPreferences } from './use-api-with-preferences';
import { useUserPreferences } from './use-user-preferences';
import { useReadArticlesStore } from '@/app/stores/useReadArticlesStore';
import { useFilterStore } from '@/app/stores/filterStore'; 
import { ResearchResult } from '@/app/types/article';

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
  topicId?: string; 
}

interface UseNewsWithExchangeReturn {
  articles: ResearchResult[];
  loading: boolean;
  error: string | null;
  refreshNews: () => void;
  replaceReadArticle: (articleId: string) => void;
  dataSource: string;
  totalFetched: number;
  hasMoreArticles: boolean;
}

// ✅ Extracted filter creation logic
function createNewsFilters(
  filters: UseNewsFilters,
  storeFilters: any,
  preferences: any,
  excludeIds: string[]
): Record<string, string> {
  const params: Record<string, string> = {
    limit: String(filters.limit || 10),
    offset: '0',
    sort_by: 'processed_at',
    sort_order: 'desc'
  };

  const statusFilter = filters.statusFilter || storeFilters.statusFilter;
  const countryFilter = filters.countryFilter || storeFilters.countryFilter || 
                       (preferences?.countries?.length > 0 && preferences.countries[0] !== 'worldwide' ? preferences.countries[0] : undefined);
  const sourceFilter = filters.sourceFilter || storeFilters.sourceFilter;
  const searchText = filters.searchText || storeFilters.searchText;
  const topicId = filters.topicId || storeFilters.topicFilter;

  if (statusFilter) params.status_filter = statusFilter;
  if (countryFilter) params.country_filter = countryFilter;
  if (sourceFilter) params.source_filter = sourceFilter;
  if (searchText) params.search_text = searchText;
  if (topicId) params.topic_id = topicId;
  if (excludeIds.length > 0) params.exclude_ids = excludeIds.join(',');

  return params;
}

export function useNewsWithExchange(filters: UseNewsFilters = {}): UseNewsWithExchangeReturn {
  const [articles, setArticles] = useState<ResearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('none');
  const [totalFetched, setTotalFetched] = useState(0);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);
  
  const { addReadArticle, getExcludeIds, clearReadArticles } = useReadArticlesStore();
  const { getNewsFilters } = useFilterStore();
  const { preferences } = useUserPreferences();
  const { 
    fetchWithPreferences, 
    createUrlWithPreferences,
    translationTarget,
    needsTranslation
  } = useApiWithPreferences();

  const stableFilters = useMemo(() => {
    const storeFilters = getNewsFilters();
    const excludeIds = getExcludeIds();
    
    return createNewsFilters(filters, storeFilters, preferences, excludeIds);
  }, [
    filters,
    getNewsFilters().statusFilter,
    getNewsFilters().categoryFilter,
    getNewsFilters().countryFilter,
    getNewsFilters().sourceFilter,
    getNewsFilters().searchText,
    getNewsFilters().topicFilter,
    preferences?.categories?.[0],
    preferences?.countries?.[0],
    getExcludeIds().join(','),
    translationTarget
  ]);

  // ✅ Extracted fetch logic
  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = createUrlWithPreferences('/api/news', stableFilters, { includeTheme: false });
      
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
      setTotalFetched(results.length);
      setHasMoreArticles(results.length >= (filters.limit || 10));
      
      // Determine data source from response metadata
      if (data.__meta?.userPreferences) {
        setDataSource(data.__meta.userPreferences.translationEnabled ? 'translated' : 'original');
      } else {
        setDataSource('unknown');
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

  // Replace read article with a new one
  const replaceReadArticle = useCallback(async (articleId: string) => {
    try {
      addReadArticle(articleId);
      setArticles(prev => prev.filter(article => article.id !== articleId));
      await fetchNews();
    } catch (error) {
      console.error('Failed to replace article:', error);
    }
  }, [addReadArticle, fetchNews]);

  // Refresh all news and clear read articles
  const refreshNews = useCallback(() => {
    clearReadArticles();
    fetchNews();
  }, [fetchNews, clearReadArticles]);

  // Effect to fetch initial news and react to changes
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);


  return {
    articles,
    loading,
    error,
    refreshNews,
    replaceReadArticle,
    dataSource,
    totalFetched,
    hasMoreArticles
  };
}