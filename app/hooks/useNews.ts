import { useState, useEffect, useCallback } from 'react';
import { NewsArticle } from '@/app/types/article';

interface UseNewsOptions {
  limit?: number;
  onlyFactChecked?: boolean;
  breaking?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseNewsReturn {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  refreshNews: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export function useNews({
  limit = 20,
  onlyFactChecked = false,
  breaking = false,
  autoRefresh = false,
  refreshInterval = 300000 
}: UseNewsOptions = {}): UseNewsReturn {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const fetchNews = useCallback(async (isLoadMore = false) => {
    try {
      if (!isLoadMore) setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: limit.toString(),
        fact_checked: onlyFactChecked.toString(),
        breaking: breaking.toString()
      });

      if (isLoadMore) {
        params.set('offset', offset.toString());
      }

      const response = await fetch(`/news?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      if (isLoadMore) {
        setArticles(prev => [...prev, ...result.data]);
        setOffset(prev => prev + limit);
      } else {
        setArticles(result.data);
        setOffset(limit);
      }

      setHasMore(result.data.length === limit);

    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  }, [limit, onlyFactChecked, breaking, offset]);

  const refreshNews = useCallback(async () => {
    setOffset(0);
    await fetchNews(false);
  }, [fetchNews]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchNews(true);
    }
  }, [fetchNews, loading, hasMore]);

  useEffect(() => {
    fetchNews(false);
  }, [fetchNews]);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(refreshNews, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, refreshNews]);

  return {
    articles,
    loading,
    error,
    refreshNews,
    hasMore,
    loadMore
  };
}