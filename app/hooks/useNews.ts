'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useApiWithPreferences } from './use-api-with-preferences';
import { useUserPreferences } from './use-user-preferences';
import { useReadArticlesStore } from '@/app/stores/useReadArticlesStore';
import { useFilterStore } from '@/app/stores/filterStore'; 
// ✅ **REMOVED: Direct server import that caused the issue**
// import { supabaseNewsServiceServer } from '@/app/lib/services/supabase-news-service-server'; 
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

export function useNewsWithExchange(filters: UseNewsFilters = {}): UseNewsWithExchangeReturn {
  const [articles, setArticles] = useState<ResearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('none');
  const [totalFetched, setTotalFetched] = useState(0);
  
  // ✅ **Use persistent read articles store**
  const { addReadArticle, getExcludeIds, clearReadArticles } = useReadArticlesStore();
  
  // ✅ **Use filter store for reactive filtering**
  const { getNewsFilters } = useFilterStore();
  
  // ✅ **Fetch pool to maintain additional articles for replacement**
  const [articlePool, setArticlePool] = useState<ResearchResult[]>([]);
  const [poolOffset, setPoolOffset] = useState(0);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);
  
  const { preferences } = useUserPreferences();
  const { 
    fetchWithPreferences, 
    createUrlWithPreferences,
    translationTarget,
    needsTranslation
  } = useApiWithPreferences();

  // Cache to prevent duplicate fetches
  const fetchCache = useRef<Map<string, Promise<any>>>(new Map());

  // ✅ **FIXED: Stable enhancedFilters with proper memoization**
  const enhancedFilters = useMemo(() => {
    const storeFilters = getNewsFilters();
    
    const combinedFilters = {
      // Explicit filters take priority
      limit: filters.limit,
      statusFilter: filters.statusFilter || storeFilters.statusFilter,
      sourceFilter: filters.sourceFilter || storeFilters.sourceFilter,
      searchText: filters.searchText || storeFilters.searchText,
      
      // ✅ **Topic filter from store**
      topicId: filters.topicId || storeFilters.topicFilter,
      
      // Category and country with fallback to user preferences
      categoryFilter: filters.categoryFilter || 
                     storeFilters.categoryFilter || 
                     (preferences?.categories?.length > 0 ? preferences.categories[0] : undefined),
      
      countryFilter: filters.countryFilter || 
                     storeFilters.countryFilter || 
                     (preferences?.countries?.length > 0 && 
                      preferences.countries[0] !== 'worldwide' ? preferences.countries[0] : undefined),
      
      // Other filters
      breaking: filters.breaking || storeFilters.breaking,
      onlyFactChecked: filters.onlyFactChecked || storeFilters.onlyFactChecked,
    };

    // Clean up undefined values to create a stable object
    const cleanedFilters = {};
    Object.keys(combinedFilters).forEach(key => {
      const value = combinedFilters[key];
      if (value !== undefined && value !== 'all' && value !== 'worldwide' && value !== null) {
        cleanedFilters[key] = value;
      }
    });

    return cleanedFilters;
  }, [
    // ✅ **FIXED: Only depend on specific values, not the entire objects**
    filters.limit,
    filters.statusFilter,
    filters.sourceFilter,
    filters.searchText,
    filters.topicId,
    filters.categoryFilter,
    filters.countryFilter,
    filters.breaking,
    filters.onlyFactChecked,
    // From store - be very specific about dependencies
    getNewsFilters().statusFilter,
    getNewsFilters().sourceFilter,
    getNewsFilters().searchText,
    getNewsFilters().topicFilter,
    getNewsFilters().categoryFilter,
    getNewsFilters().countryFilter,
    getNewsFilters().breaking,
    getNewsFilters().onlyFactChecked,
    // From preferences - only the specific values we use
    preferences?.categories?.[0],
    preferences?.countries?.[0]
  ]);

  // ✅ **FIXED: Use stable dependencies**
  const fetchArticles = useCallback(async (offset: number = 0, limit: number = 10): Promise<ResearchResult[]> => {
    // Use JSON.stringify for stable cache key
    const filtersHash = JSON.stringify(enhancedFilters);
    const excludeIds = getExcludeIds();
    const cacheKey = `${filtersHash}-${offset}-${limit}-${excludeIds.length}`;
    
    // Check cache first
    if (fetchCache.current.has(cacheKey)) {
      return fetchCache.current.get(cacheKey)!;
    }

    const fetchPromise = (async () => {
      try {
        console.log(`🔄 Fetching articles via API:`, {
          filters: enhancedFilters,
          offset,
          limit,
          excludedIds: excludeIds.length,
          translationTarget: translationTarget || 'none'
        });
        
        // ✅ **Use API endpoint instead of direct server service**
        const params: Record<string, string> = {
          limit: String(limit),
          offset: String(offset),
          sort_by: 'processed_at',
          sort_order: 'desc'
        };

        // ✅ **Apply enhanced filters to API params**
        if (enhancedFilters.statusFilter) params.status_filter = enhancedFilters.statusFilter;
        if (enhancedFilters.categoryFilter) params.category_filter = enhancedFilters.categoryFilter;
        if (enhancedFilters.countryFilter) params.country_filter = enhancedFilters.countryFilter;
        if (enhancedFilters.sourceFilter) params.source_filter = enhancedFilters.sourceFilter;
        if (enhancedFilters.searchText) params.search_text = enhancedFilters.searchText;
        if (enhancedFilters.topicId) params.topic_id = enhancedFilters.topicId; // ✅ **Topic filter**
        if (excludeIds.length > 0) params.exclude_ids = excludeIds.join(',');

        const apiUrl = createUrlWithPreferences('/api/news', params, { includeTheme: false });
        const response = await fetchWithPreferences(apiUrl, { cache: 'no-store' });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.details || data.error);
        }

        const results = Array.isArray(data.results) ? data.results : data;
        
        // ✅ **Double-check: Filter out any read articles client-side**
        const filteredResults = results.filter((article: ResearchResult) => 
          !excludeIds.includes(article.id)
        );

        console.log(`✅ Fetched ${filteredResults.length} new articles (${results.length - filteredResults.length} excluded)`);

        // Update has more articles flag
        setHasMoreArticles(filteredResults.length === limit);
        
        return filteredResults;
        
      } catch (err) {
        console.error('Failed to fetch articles:', err);
        throw err;
      }
    })();

    fetchCache.current.set(cacheKey, fetchPromise);
    
    // Clean cache after 5 minutes
    setTimeout(() => {
      fetchCache.current.delete(cacheKey);
    }, 5 * 60 * 1000);

    return fetchPromise;
  }, [
    // ✅ **SIMPLIFIED: Only depend on the stable enhancedFilters**
    enhancedFilters,
    getExcludeIds,
    createUrlWithPreferences,
    fetchWithPreferences,
    translationTarget
  ]);

  // ✅ **FIXED: Stable fetchInitialNews**
  const fetchInitialNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const initialLimit = enhancedFilters.limit || 10;
      
      // ✅ **Fetch initial articles**
      const initialArticles = await fetchArticles(0, initialLimit);

      setArticles(initialArticles);
      setTotalFetched(initialArticles.length);
      setPoolOffset(initialLimit); // Start pool from next position
      setArticlePool([]); // Clear pool initially
      
      // ✅ **Pre-fill pool in background**
      if (initialArticles.length === initialLimit) {
        try {
          const poolSize = Math.max(3, Math.floor(initialLimit / 3));
          const poolArticles = await fetchArticles(initialLimit, poolSize);
          setArticlePool(poolArticles);
          setPoolOffset(initialLimit + poolSize);
          setTotalFetched(prev => prev + poolArticles.length);
          console.log(`🎯 Pre-filled pool with ${poolArticles.length} articles`);
        } catch (poolError) {
          console.warn('Failed to pre-fill pool:', poolError);
        }
      }
      
      // Determine data source
      setDataSource(needsTranslation ? 'translated' : 'original');
      
    } catch (err) {
      console.error('💥 Failed to fetch initial news:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [
    // ✅ **SIMPLIFIED: Only the essential dependencies**
    enhancedFilters,
    fetchArticles,
    needsTranslation
  ]);

  // ✅ **Replace read article with proper pool management**
  const replaceReadArticle = useCallback(async (articleId: string) => {
    try {
      console.log(`🔄 Replacing read article: ${articleId}`);
      
      // ✅ **Mark as read in persistent store**
      addReadArticle(articleId);
      
      // Get replacement from pool or fetch new one
      let replacementArticle: ResearchResult | null = null;
      
      if (articlePool.length > 0) {
        // ✅ **Use first article from pool**
        replacementArticle = articlePool[0];
        setArticlePool(prev => prev.slice(1));
        
        console.log(`🎯 Using article from pool: ${replacementArticle.id}`);
        
        // ✅ **Refill pool if running low**
        if (articlePool.length <= 1 && hasMoreArticles) {
          try {
            const newPoolArticles = await fetchArticles(poolOffset, 3);
            if (newPoolArticles.length > 0) {
              setArticlePool(prev => [...prev.slice(1), ...newPoolArticles]);
              setPoolOffset(prev => prev + newPoolArticles.length);
              console.log(`🔄 Refilled pool with ${newPoolArticles.length} articles`);
            }
          } catch (poolError) {
            console.warn('Failed to refill article pool:', poolError);
          }
        }
      } else if (hasMoreArticles) {
        // ✅ **Fetch new article directly if pool is empty**
        try {
          const newArticles = await fetchArticles(poolOffset, 1);
          if (newArticles.length > 0) {
            replacementArticle = newArticles[0];
            setPoolOffset(prev => prev + 1);
            console.log(`🆕 Fetched new article directly: ${replacementArticle.id}`);
          }
        } catch (fetchError) {
          console.warn('Failed to fetch replacement article:', fetchError);
        }
      }

      // ✅ **Replace article in the list**
      setArticles(prev => {
        if (!replacementArticle) {
          // No replacement available, just remove the read article
          console.log(`❌ No replacement available, removing article: ${articleId}`);
          return prev.filter(article => article.id !== articleId);
        }
        
        // Replace with new article
        const index = prev.findIndex(article => article.id === articleId);
        if (index !== -1) {
          const newArticles = [...prev];
          newArticles[index] = replacementArticle;
          console.log(`✅ Replaced article ${articleId} with ${replacementArticle.id}`);
          return newArticles;
        }
        
        // Fallback: remove read article
        console.log(`⚠️ Article not found, removing: ${articleId}`);
        return prev.filter(article => article.id !== articleId);
      });
      
    } catch (error) {
      console.error('Failed to replace read article:', error);
      
      // Fallback: just remove the read article and mark as read
      addReadArticle(articleId);
      setArticles(prev => prev.filter(article => article.id !== articleId));
    }
  }, [articlePool, hasMoreArticles, poolOffset, fetchArticles, addReadArticle]);

  // ✅ **Refresh all news and clear read articles**
  const refreshNews = useCallback(() => {
    // Clear cache and reset state
    fetchCache.current.clear();
    clearReadArticles(); 
    setArticlePool([]);
    setPoolOffset(0);
    setTotalFetched(0);
    fetchInitialNews();
    console.log('🔄 News refreshed and read articles cleared');
  }, [fetchInitialNews, clearReadArticles]);

  // ✅ **Auto-refresh logic**
  useEffect(() => {
    if (filters.autoRefresh) {
      const interval = setInterval(() => {
        console.log('⏰ Auto-refreshing news...');
        refreshNews();
      }, 5 * 60 * 1000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [refreshNews, filters.autoRefresh]);

  // ✅ **Remove the problematic useEffect that causes infinite loops**
  // Instead of reacting to every enhancedFilters change, only refresh on mount and manual refresh
  useEffect(() => {
    console.log('🔄 Initial news fetch on mount');
    fetchInitialNews();
  }, []); // ✅ **EMPTY DEPENDENCY ARRAY - only run on mount**

  // ✅ **ADD: Separate effect for filter changes with debouncing**
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('🔄 Filters changed after debounce, refreshing news...', enhancedFilters);
      fetchInitialNews();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [enhancedFilters]); // ✅ **Only depend on enhancedFilters**

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