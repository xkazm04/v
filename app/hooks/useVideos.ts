import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { VideoFilters } from '../types/video_api';

const LOCAL_API_BASE = '/api';

// ✅ Create a stable query key generator
function createVideosQueryKey(filters: VideoFilters = {}) {
  // Remove undefined/null values and sort keys for consistent caching
  const cleanFilters = Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  
  return ['videos', cleanFilters];
}

async function getVideosLocal(filters: VideoFilters = {}) {
  // ✅ Don't make request if no meaningful filters
  const hasSignificantFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== '' && value !== 0
  );
  
  if (!hasSignificantFilters) {
    console.log('useVideos: Skipping request - no significant filters provided');
    return [];
  }

  const params = new URLSearchParams();
  
  // Map frontend filters to backend parameters correctly
  const paramMapping: Record<string, string> = {
    limit: 'limit',
    offset: 'offset', 
    source: 'source',
    researched: 'researched',
    analyzed: 'analyzed',
    speaker_name: 'speaker_name',
    language_code: 'language_code',
    categories: 'categories',
    search: 'search',
    sort_by: 'sort_by',
    sort_order: 'sort_order'
  };

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      const backendParam = paramMapping[key] || key;
      
      // Handle array values (like categories)
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.append(backendParam, value.join(','));
        }
      } else {
        params.append(backendParam, String(value));
      }
    }
  });

  const url = `${LOCAL_API_BASE}/videos?${params.toString()}`;
  console.log('useVideos: Fetching videos with URL:', url);

  const response = await fetch(url);
  if (!response.ok) {
    console.error('useVideos: Fetch failed:', response.status, response.statusText);
    throw new Error(`Video fetch failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log('useVideos: Received data count:', Array.isArray(data) ? data.length : 'not array');
  return data;
}

export const useVideos = (filters: VideoFilters = {}) => {
  // ✅ Create stable query key
  const queryKey = createVideosQueryKey(filters);
  
  // ✅ Check if this is a meaningful request
  const hasSignificantFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== '' && value !== 0
  );

  return useQuery({
    queryKey,
    queryFn: () => getVideosLocal(filters),
    enabled: hasSignificantFilters, // ✅ Only run if we have meaningful filters
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
  });
};

export const useInfiniteVideos = (filters: Omit<VideoFilters, 'offset'> = {}) => {
  // ✅ Ensure we have a minimum limit for infinite queries
  const filtersWithDefaults = {
    limit: 20, // Always set a default limit for infinite queries
    ...filters
  };

  return useInfiniteQuery({
    queryKey: ['videos', 'infinite', filtersWithDefaults],
    queryFn: ({ pageParam = 0 }) => 
      getVideosLocal({ ...filtersWithDefaults, offset: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, pages) => {
      const limit = filtersWithDefaults.limit || 20;
      return (lastPage as any[]).length === limit ? pages.length * limit : undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// ✅ Add a hook specifically for featured videos to avoid conflicts
export const useFeaturedVideos = (limit: number = 4) => {
  return useQuery({
    queryKey: ['videos', 'featured', { limit, researched: true, sort_by: 'processed_at', sort_order: 'desc' }],
    queryFn: () => getVideosLocal({
      limit,
      researched: true,
      sort_by: 'processed_at',
      sort_order: 'desc'
    }),
    staleTime: 10 * 60 * 1000, // 10 minutes for featured
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

// Keep other hooks with better defaults
export const useVideoWithTimestamps = (videoId: string) => {
  return useQuery({
    queryKey: ['video', videoId, 'timestamps'],
    queryFn: async () => {
      const response = await fetch(`${LOCAL_API_BASE}/videos/${videoId}/timestamps`);
      if (!response.ok) {
        throw new Error(`Video timestamps fetch failed: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: !!videoId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000,
  });
};

export const useVideoStats = () => {
  return useQuery({
    queryKey: ['videos', 'stats'],
    queryFn: async () => {
      const response = await fetch(`${LOCAL_API_BASE}/videos/stats/summary`);
      if (!response.ok) {
        throw new Error(`Video stats fetch failed: ${response.statusText}`);
      }
      return response.json();
    },
    staleTime: 15 * 60 * 1000, // 15 minutes for stats
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  });
};

export const useSearchVideos = (
  searchText?: string,
  sourceFilter?: string,
  researchedFilter?: boolean,
  speakerFilter?: string,
  languageFilter?: string,
  categoriesFilter?: string,
  limitCount: number = 50,
  offsetCount: number = 0
) => {
  const hasSearchCriteria = !!(
    searchText || 
    sourceFilter || 
    researchedFilter !== undefined || 
    speakerFilter || 
    languageFilter || 
    categoriesFilter
  );

  return useQuery({
    queryKey: [
      'videos', 
      'search', 
      searchText, 
      sourceFilter, 
      researchedFilter, 
      speakerFilter, 
      languageFilter,
      categoriesFilter,
      limitCount,
      offsetCount
    ],
    queryFn: () => searchVideosAdvanced(
      searchText,
      sourceFilter,
      researchedFilter,
      speakerFilter,
      languageFilter,
      categoriesFilter,
      limitCount,
      offsetCount
    ),
    enabled: hasSearchCriteria, // ✅ Only run if we have search criteria
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useAvailableCategories = () => {
  return useQuery({
    queryKey: ['videos', 'categories'],
    queryFn: async () => {
      const response = await fetch(`${LOCAL_API_BASE}/videos/categories`);
      if (!response.ok) {
        throw new Error(`Video categories fetch failed: ${response.statusText}`);
      }
      return response.json();
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  });
};

// ✅ Helper function for other components that might be causing extra calls
async function searchVideosAdvanced(
  searchText?: string,
  sourceFilter?: string,
  researchedFilter?: boolean,
  speakerFilter?: string,
  languageFilter?: string,
  categoriesFilter?: string,
  limitCount: number = 50,
  offsetCount: number = 0
) {
  const params = new URLSearchParams();
  
  if (searchText) params.append('search_text', searchText);
  if (sourceFilter) params.append('source_filter', sourceFilter);
  if (researchedFilter !== undefined) params.append('researched_filter', String(researchedFilter));
  if (speakerFilter) params.append('speaker_filter', speakerFilter);
  if (languageFilter) params.append('language_filter', languageFilter);
  if (categoriesFilter) params.append('categories_filter', categoriesFilter);
  params.append('limit_count', String(limitCount));
  params.append('offset_count', String(offsetCount));

  const url = `${LOCAL_API_BASE}/videos/search/advanced?${params.toString()}`;
  console.log('useVideos: Advanced search URL:', url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Video search failed: ${response.statusText}`);
  }
  return response.json();
}