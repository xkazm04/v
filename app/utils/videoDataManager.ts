import { useMemo } from 'react';
import { useVideos } from '@/app/hooks/useVideos';
import { useVideoDetail } from '@/app/hooks/useVideoDetail';
import { VideoWithTimestamps } from '@/app/types/video_api';
import { videos as mockVideos } from '@/app/constants/videos';

export interface VideoDataManagerOptions {
  limit?: number;
  researched?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  videoId?: string | null;
  enableVideosList?: boolean; // ✅ Add option to disable videos list
}

export interface VideoDataManagerResult {
  videos: VideoWithTimestamps[];
  specificVideo?: VideoWithTimestamps;
  videosLoading: boolean;
  videoLoading: boolean;
  videosError: Error | null;
  videoError: Error | null;
  hasApiData: boolean;
  hasSpecificVideo: boolean;
  isUsingFallback: boolean;
  isUsingMockData: boolean;
  dataSource: 'api' | 'mock' | 'hybrid' | 'none';
  initialIndex: number;
  enhancedVideos: VideoWithTimestamps[];
  refetchVideos: () => void;
  refetchVideo: () => void;
}

export function useVideoDataManager(options: VideoDataManagerOptions = {}): VideoDataManagerResult {
  const {
    limit = 50,
    researched = true,
    sort_by = 'processed_at',
    sort_order = 'desc',
    videoId,
    enableVideosList = true // ✅ Default to true, but allow disabling
  } = options;

  // ✅ Only fetch videos list if explicitly enabled and we have meaningful filters
  const videosQueryOptions = useMemo(() => {
    if (!enableVideosList) return null;
    
    return {
      limit,
      researched,
      sort_by,
      sort_order
    };
  }, [enableVideosList, limit, researched, sort_by, sort_order]);

  const {
    data: apiVideos,
    isLoading: videosLoading,
    error: videosError,
    refetch: refetchVideos
  } = useVideos(videosQueryOptions || {}, {
    enabled: !!videosQueryOptions && enableVideosList
  });

  const {
    data: specificVideo,
    isLoading: videoLoading,
    error: videoError,
    refetch: refetchVideo
  } = useVideoDetail(videoId || '', {
    enabled: !!videoId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  // Enhanced video combination with fallback logic
  const videos: VideoWithTimestamps[] = useMemo(() => {
    const combinedVideos: VideoWithTimestamps[] = [];

    // Add API videos if available and enabled
    if (enableVideosList && apiVideos && Array.isArray(apiVideos) && apiVideos.length > 0) {
      const convertedVideos = apiVideos.map(video => ({
        video,
        timestamps: []
      }));
      combinedVideos.push(...convertedVideos);
    }

    // Add mock videos as fallback only if we don't have API data or videos list is disabled
    if (!enableVideosList || !apiVideos || apiVideos.length === 0) {
      combinedVideos.push(...mockVideos);
    }

    // Remove duplicates (prefer API data over mock)
    const uniqueVideos = combinedVideos.reduce((acc, current) => {
      const exists = acc.find(video => video.video.id === current.video.id);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, [] as VideoWithTimestamps[]);

    return uniqueVideos;
  }, [apiVideos, enableVideosList]);

  const initialIndex = useMemo(() => {
    if (!videoId) return 0;
    return Math.max(0, videos.findIndex(v => v.video.id === videoId));
  }, [videoId, videos]);

  const enhancedVideos = useMemo(() => {
    if (!specificVideo) return videos;
    
    return videos.map(v =>
      v.video.id === videoId ? specificVideo : v
    );
  }, [videos, specificVideo, videoId]);

  // Enhanced status tracking
  const hasApiData = Boolean(enableVideosList && apiVideos && apiVideos.length > 0);
  const hasSpecificVideo = Boolean(specificVideo);
  const isUsingFallback = Boolean(videosError && !hasApiData);
  
  const isUsingMockData = useMemo(() => {
    if (!specificVideo || !videoId) return false;
    return mockVideos.some(mock => mock.video.id === videoId);
  }, [specificVideo, videoId]);

  const dataSource: 'api' | 'mock' | 'hybrid' | 'none' = useMemo(() => {
    if (!hasSpecificVideo && !hasApiData) return 'none';
    if (hasApiData && hasSpecificVideo && !isUsingMockData) return 'api';
    if (!hasApiData && isUsingMockData) return 'mock';
    if (hasApiData && isUsingMockData) return 'hybrid';
    return 'hybrid';
  }, [hasApiData, hasSpecificVideo, isUsingMockData]);

  return {
    videos: enhancedVideos,
    specificVideo,
    videosLoading: enableVideosList ? videosLoading : false,
    videoLoading,
    videosError: videosError as Error | null,
    videoError: videoError as Error | null,
    hasApiData,
    hasSpecificVideo,
    isUsingFallback,
    isUsingMockData,
    dataSource,
    initialIndex,
    enhancedVideos,
    refetchVideos,
    refetchVideo
  };
}

export function getVideoCountText(count: number): string {
  return `${count} video${count !== 1 ? 's' : ''}`;
}