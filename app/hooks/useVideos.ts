import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { VideoFilters } from '../types/video_api';

const LOCAL_API_BASE = '/api';

async function getVideosLocal(filters: VideoFilters = {}) {
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
    if (value !== undefined && value !== null) {
      const backendParam = paramMapping[key] || key;
      
      // Handle array values (like categories)
      if (Array.isArray(value)) {
        params.append(backendParam, value.join(','));
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
  console.log('useVideos: Received data:', data);
  return data;
}

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

export const useVideos = (filters: VideoFilters = {}) => {
  return useQuery({
    queryKey: ['videos', filters],
    queryFn: () => getVideosLocal(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useInfiniteVideos = (filters: Omit<VideoFilters, 'offset'> = {}) => {
  return useInfiniteQuery({
    queryKey: ['videos', 'infinite', filters],
    queryFn: ({ pageParam = 0 }) => 
      getVideosLocal({ ...filters, offset: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, pages) => {
      const limit = filters.limit || 50;
      return (lastPage as any[]).length === limit ? pages.length * limit : undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

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
    staleTime: 10 * 60 * 1000,
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
    enabled: !!(searchText || sourceFilter || researchedFilter !== undefined || speakerFilter || languageFilter || categoriesFilter),
    staleTime: 5 * 60 * 1000,
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
    refetchOnWindowFocus: false,
  });
};