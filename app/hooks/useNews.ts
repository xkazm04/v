'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ResearchResult } from '@/app/types/article';
import { useReadArticlesStore } from '@/app/stores/useReadArticlesStore';
import { useFilterStore } from '@/app/stores/filterStore';
import { useUserPreferences } from '@/app/hooks/use-user-preferences';
import { useApiWithPreferences } from '@/app/hooks/use-api-with-preferences';
import { useTranslationStore } from '../stores/useTranslationStore';

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
  reservePoolSize: number;
}

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

  if (statusFilter && statusFilter !== 'all') params.status_filter = statusFilter;
  if (countryFilter && countryFilter !== 'worldwide') params.country_filter = countryFilter;
  if (sourceFilter && sourceFilter !== 'all') params.source_filter = sourceFilter;
  if (searchText && searchText.trim()) params.search_text = searchText.trim();
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
  
  // Refs to prevent multiple simultaneous fetches
  const initialFetchDone = useRef(false);
  const currentFetchAbortController = useRef<AbortController | null>(null);
  const reserveFetchAbortController = useRef<AbortController | null>(null);
  const lastFetchParams = useRef<string>('');
  
  const { 
    addReadArticle, 
    getExcludeIds, 
    clearReadArticles,
    setReservePool,
    replaceArticleWithReserve,
    shouldRefetchReserves,
    setIsRefetchingReserves,
    reservePool
  } = useReadArticlesStore();
  
  const { getNewsFilters } = useFilterStore();
  const { preferences } = useUserPreferences();
  const { 
    fetchWithPreferences, 
    createUrlWithPreferences,
    translationTarget,
    needsTranslation
  } = useApiWithPreferences();

  const { startTranslation, completeTranslation, failTranslation } = useTranslationStore();

  // ✅ FIX: Extract store values to stable variables ONLY when needed
  const storeFilters = useMemo(() => getNewsFilters(), []);
  const excludeIds = useMemo(() => getExcludeIds(), []);

  // ✅ FIX: Create stable filter object with REDUCED dependencies to prevent loops
  const stableFilters = useMemo(() => {
    const currentStoreFilters = getNewsFilters();
    const currentExcludeIds = getExcludeIds();
    
    const filterObj = createNewsFilters(filters, currentStoreFilters, preferences, currentExcludeIds);
    
    console.log('🔧 Creating stable filters:', filterObj);
    return filterObj;
  }, [
    // Core filter dependencies - reduced to prevent loops
    filters.limit,
    filters.autoRefresh,
    filters.categoryFilter,
    filters.countryFilter,
    filters.searchText,
    filters.statusFilter,
    filters.sourceFilter,
    filters.breaking,
    filters.onlyFactChecked,
    filters.topicId,
    // Store dependencies - use string values directly
    storeFilters.statusFilter,
    storeFilters.categoryFilter,
    storeFilters.countryFilter,
    storeFilters.sourceFilter,
    storeFilters.searchText,
    storeFilters.topicFilter,
    // User preferences - use stable strings
    preferences?.language,
    preferences?.countries?.[0],
    // Translation target
    translationTarget
    // NOTE: Removed excludeIds from dependencies to prevent loops
  ]);

  // ✅ OPTIMIZED: Main fetch function
  const fetchNews = useCallback(async (isRefresh = false, isReserveFetch = false) => {
    const currentExcludeIds = getExcludeIds();
    const filtersWithExcludes = { ...stableFilters };
    
    // Add current exclude IDs only at fetch time
    if (currentExcludeIds.length > 0) {
      filtersWithExcludes.exclude_ids = currentExcludeIds.join(',');
    }
    
    const paramsString = JSON.stringify(filtersWithExcludes);
    
    // Prevent duplicate fetches
    if (!isRefresh && !isReserveFetch && paramsString === lastFetchParams.current && initialFetchDone.current) {
      console.log('🚫 Skipping duplicate fetch');
      return;
    }

    // Abort any existing fetch
    if (isReserveFetch) {
      reserveFetchAbortController.current?.abort();
      reserveFetchAbortController.current = new AbortController();
    } else {
      currentFetchAbortController.current?.abort();
      currentFetchAbortController.current = new AbortController();
    }

    const abortController = isReserveFetch ? reserveFetchAbortController.current : currentFetchAbortController.current;
    
    try {
      if (!isReserveFetch) {
        setLoading(true);
        setError(null);
      } else {
        setIsRefetchingReserves(true);
      }

      const fetchParams = isReserveFetch 
        ? { ...filtersWithExcludes, limit: '25', offset: String(totalFetched) }
        : filtersWithExcludes;

      console.log(`📰 ${isReserveFetch ? 'Reserve' : 'Main'} fetch starting:`, fetchParams);

      const url = createUrlWithPreferences('/api/news', fetchParams);
      const response = await fetchWithPreferences(url, {
        signal: abortController?.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (abortController?.signal.aborted) {
        console.log(`🚫 ${isReserveFetch ? 'Reserve' : 'Main'} fetch aborted`);
        return;
      }

      const fetchedArticles = data.results || [];
      console.log(`📰 Found ${fetchedArticles.length} articles from Supabase`);
      
      if (currentExcludeIds.length > 0) {
        console.log(`🚫 Excluding ${currentExcludeIds.length} read articles`);
      }
      
      if (isReserveFetch) {
        setReservePool(fetchedArticles);
        setIsRefetchingReserves(false);
        console.log(`🏊 Reserve fetch completed: ${fetchedArticles.length} articles`);
      } else {
        setArticles(fetchedArticles);
        setTotalFetched(fetchedArticles.length);
        setDataSource('supabase');
        setHasMoreArticles(fetchedArticles.length >= (parseInt(filtersWithExcludes.limit) || 10));
        
        lastFetchParams.current = paramsString;
        initialFetchDone.current = true;
        console.log(`📰 Main fetch completed: ${fetchedArticles.length} articles`);
      }

    } catch (fetchError) {
      if (abortController?.signal.aborted) {
        return;
      }
      
      console.error(`❌ ${isReserveFetch ? 'Reserve' : 'Main'} fetch failed:`, fetchError);
      
      if (!isReserveFetch) {
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch news');
      }
      
      setIsRefetchingReserves(false);
    } finally {
      if (!isReserveFetch) {
        setLoading(false);
      }
    }
  }, [stableFilters, totalFetched, fetchWithPreferences, createUrlWithPreferences, setReservePool, setIsRefetchingReserves, getExcludeIds]);

  // ✅ OPTIMIZED: Smart reserve refetch
  const refetchReservesIfNeeded = useCallback(async () => {
    if (shouldRefetchReserves()) {
      console.log('🏊 Refetching reserves in background...');
      await fetchNews(false, true);
    }
  }, [shouldRefetchReserves, fetchNews]);

  // ✅ OPTIMIZED: Article replacement with reserve system
  const replaceReadArticle = useCallback(async (articleId: string) => {
    console.log(`🔄 Replacing article: ${articleId}`);
    
    const { replacementArticle, shouldRefetchReserves: shouldRefetch } = replaceArticleWithReserve(articleId);
    
    if (replacementArticle) {
      setArticles(prev => prev.map(article => 
        article.id === articleId ? replacementArticle : article
      ));
      console.log(`✅ Article replaced: ${articleId} -> ${replacementArticle.id}`);
    } else {
      setArticles(prev => prev.filter(article => article.id !== articleId));
      console.log(`❌ No replacement available for: ${articleId}`);
    }
    
    // Refetch reserves in background if needed
    if (shouldRefetch) {
      setTimeout(() => refetchReservesIfNeeded(), 1000); // Delay to prevent immediate refetch
    }
  }, [replaceArticleWithReserve, refetchReservesIfNeeded]);

  // ✅ OPTIMIZED: Refresh function
  const refreshNews = useCallback(() => {
    console.log('🔄 Refreshing news...');
    initialFetchDone.current = false;
    lastFetchParams.current = '';
    fetchNews(true);
  }, [fetchNews]);

  // ✅ OPTIMIZED: Initial fetch effect - only when stable filters change significantly
  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchNews();
    }
  }, [stableFilters]); // This now won't cause loops

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      currentFetchAbortController.current?.abort();
      reserveFetchAbortController.current?.abort();
    };
  }, []);

  return {
    articles,
    loading,
    error,
    refreshNews,
    replaceReadArticle,
    dataSource,
    totalFetched,
    hasMoreArticles,
    reservePoolSize: reservePool.length
  };
}