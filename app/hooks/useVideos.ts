import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { VideoFilters, Video } from '../types/video_api';
import { useApiWithPreferences } from './use-api-with-preferences';

const LOCAL_API_BASE = '/api';

// ✅ Create stable query key
function createVideosQueryKey(filters: VideoFilters = {}, translationTarget?: string) {
  const cleanFilters = Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  
  return ['videos', cleanFilters, { lang: translationTarget || 'en' }];
}

// ✅ Simplified fetch function
async function getVideosLocal(
  filters: VideoFilters = {}, 
  fetchWithPreferences: any,
  createUrlWithPreferences: any
): Promise<Video[]> {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.append(key, value.join(','));
        }
      } else {
        params.append(key, String(value));
      }
    }
  });

  const baseUrl = `${LOCAL_API_BASE}/videos`;
  const url = createUrlWithPreferences(baseUrl, Object.fromEntries(params.entries()));
  
  const response = await fetchWithPreferences(url);
  
  if (!response.ok) {
    throw new Error(`Video fetch failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  return Array.isArray(data) ? data : (data.videos || []);
}

export const useVideos = (filters: VideoFilters = {}, options: { enabled?: boolean } = {}) => {
  const { 
    fetchWithPreferences, 
    createUrlWithPreferences,
    translationTarget 
  } = useApiWithPreferences();

  const queryKey = createVideosQueryKey(filters, translationTarget);
  
  return useQuery({
    queryKey,
    queryFn: () => getVideosLocal(filters, fetchWithPreferences, createUrlWithPreferences),
    enabled: options.enabled !== false, // ✅ Allow disabling via options
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // ✅ Prevent duplicate initial requests
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
  });
};

export const useFeaturedVideos = (limit: number = 6, options: { enabled?: boolean } = {}) => {
  const { 
    fetchWithPreferences, 
    createUrlWithPreferences,
    translationTarget 
  } = useApiWithPreferences();

  const stableLimit = Math.min(limit, 6);

  return useQuery({
    queryKey: ['videos', 'featured', { 
      limit: stableLimit,
      sort_by: 'processed_at', 
      sort_order: 'desc',
      lang: translationTarget || 'en'
    }],
    queryFn: () => getVideosLocal({
      limit: stableLimit,
      sort_by: 'processed_at',
      sort_order: 'desc'
    }, fetchWithPreferences, createUrlWithPreferences),
    enabled: options.enabled !== false, 
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false, 
    retry: 1,
  });
};

export const useInfiniteVideos = (filters: Omit<VideoFilters, 'offset'> = {}, options: { enabled?: boolean } = {}) => {
  const { 
    fetchWithPreferences, 
    createUrlWithPreferences,
    translationTarget 
  } = useApiWithPreferences();

  const filtersWithDefaults = {
    limit: 20,
    ...filters
  };

  return useInfiniteQuery({
    queryKey: ['videos', 'infinite', filtersWithDefaults, { lang: translationTarget || 'en' }],
    queryFn: ({ pageParam = 0 }) => 
      getVideosLocal(
        { ...filtersWithDefaults, offset: pageParam as number }, 
        fetchWithPreferences, 
        createUrlWithPreferences
      ),
    enabled: options.enabled !== false,
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, pages) => {
      if (!lastPage || lastPage.length < filtersWithDefaults.limit) {
        return undefined;
      }
      return pages.length * filtersWithDefaults.limit;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};