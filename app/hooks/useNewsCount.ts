'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useUserPreferences } from './use-user-preferences';

interface CountData {
  country: string;
  count: number;
  lastUpdated: string;
}

interface UseNewsCountReturn {
  counts: Record<string, CountData>;
  loading: boolean;
  error: string | null;
  refreshCounts: () => void;
  getCountForCountry: (countryCode: string) => number;
}

const globalCache = new Map<string, { data: Record<string, CountData>; timestamp: number }>();
const CACHE_DURATION = 12 * 60 * 60 * 1000; 

export function useNewsCount(countries: string[] = ['worldwide']): UseNewsCountReturn {
  const [counts, setCounts] = useState<Record<string, CountData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef<boolean>(false);
  
  const { preferences } = useUserPreferences();

  const stableCountries = useMemo(() => {
    return [...countries].sort();
  }, [countries.join(',')]);

  const cacheKey = useMemo(() => stableCountries.join(','), [stableCountries]);

  const getCachedData = useCallback(() => {
    const cached = globalCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('📋 Using cached news counts for:', cacheKey);
      return cached.data;
    }
    return null;
  }, [cacheKey]);

  const fetchCounts = useCallback(async () => {
    if (stableCountries.length === 0) {
      setLoading(false);
      return;
    }

    if (fetchingRef.current) {
      console.log('⏳ Request already in progress for:', cacheKey);
      return;
    }

    // ✅ Check cache first
    const cachedData = getCachedData();
    if (cachedData) {
      setCounts(cachedData);
      setLoading(false);
      return;
    }

    try {
      fetchingRef.current = true;
      setLoading(true);
      setError(null);
      
      console.log('📊 Fetching news counts for:', stableCountries);
      
      const queryParams = new URLSearchParams({
        countries: stableCountries.join(',')
      });

      const response = await fetch(`/api/news/counts?${queryParams}`, {
        headers: {
          'Cache-Control': 'max-age=43200, stale-while-revalidate=86400'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const countsData = data.counts || {};
      
      globalCache.set(cacheKey, {
        data: countsData,
        timestamp: Date.now()
      });
      
      setCounts(countsData);
      
    } catch (err) {
      console.error('❌ Failed to fetch news counts:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [stableCountries, cacheKey, getCachedData]);

  const refreshCounts = useCallback(() => {
    globalCache.delete(cacheKey);
    fetchCounts();
  }, [cacheKey, fetchCounts]);

  const getCountForCountry = useCallback((countryCode: string): number => {
    return counts[countryCode]?.count || 0;
  }, [counts]);

  useEffect(() => {
    const cachedData = getCachedData();
    if (cachedData) {
      setCounts(cachedData);
      setLoading(false);
    } else {
      fetchCounts();
    }
  }, [cacheKey]); // Only depend on cache key, not on fetchCounts

  useEffect(() => {
    const lastUpdate = preferences?.lastUpdated;
    if (lastUpdate && Object.keys(counts).length > 0) {
      const timeSinceUpdate = Date.now() - new Date(lastUpdate).getTime();
      if (timeSinceUpdate < 2000) { // Reduced to 2 seconds
        console.log('🔄 User preferences changed, scheduling count refresh...');
        const timeoutId = setTimeout(() => {
          globalCache.delete(cacheKey); // Clear cache
          fetchCounts();
        }, 2000); // Increased delay to 2 seconds
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [preferences?.lastUpdated, cacheKey]); // Removed fetchCounts dependency

  return {
    counts,
    loading,
    error,
    refreshCounts,
    getCountForCountry
  };
}