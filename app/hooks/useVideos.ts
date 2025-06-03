import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

import { VideoFilters } from '../types/video_api';
import { videoAPI } from '../api/videos/videos';

export const useVideos = (filters: VideoFilters = {}) => {
  return useQuery({
    queryKey: ['videos', filters],
    queryFn: () => videoAPI.getVideos(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useInfiniteVideos = (filters: Omit<VideoFilters, 'offset'> = {}) => {
  return useInfiniteQuery({
    queryKey: ['videos', 'infinite', filters],
    queryFn: ({ pageParam = 0 }) => 
      videoAPI.getVideos({ ...filters, offset: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      const limit = filters.limit || 50;
      return lastPage.length === limit ? pages.length * limit : undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useVideoWithTimestamps = (videoId: string) => {
  return useQuery({
    queryKey: ['video', videoId, 'timestamps'],
    queryFn: () => videoAPI.getVideoWithTimestamps(videoId),
    enabled: !!videoId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useVideoStats = () => {
  return useQuery({
    queryKey: ['videos', 'stats'],
    queryFn: () => videoAPI.getVideoStats(),
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
  categoriesFilter?: string, // New parameter
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
      categoriesFilter, // Include in query key
      limitCount,
      offsetCount
    ],
    queryFn: () => videoAPI.searchVideos(
      searchText,
      sourceFilter,
      researchedFilter,
      speakerFilter,
      languageFilter,
      categoriesFilter, // Pass to API
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
    queryFn: () => videoAPI.getAvailableCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};