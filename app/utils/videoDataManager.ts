import { useMemo } from 'react';
import { useVideos } from '@/app/hooks/useVideos';
import { useVideoDetail } from '@/app/hooks/useVideoDetail';
import { VideoWithTimestamps, Video } from '@/app/types/video_api';
import { videos as mockVideos } from '@/app/constants/videos';

export interface VideoDataManagerOptions {
  limit?: number;
  researched?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  videoId?: string | null;
}

export interface VideoDataManagerResult {
  // Data - ALL using VideoWithTimestamps
  videos: VideoWithTimestamps[];
  specificVideo?: VideoWithTimestamps;
  
  // Loading states
  videosLoading: boolean;
  videoLoading: boolean;
  
  // Error states
  videosError: Error | null;
  videoError: Error | null;
  
  // Status
  hasApiData: boolean;
  hasSpecificVideo: boolean;
  isUsingFallback: boolean;
  
  // Computed values
  initialIndex: number;
  enhancedVideos: VideoWithTimestamps[];
  
  // Actions
  refetchVideos: () => void;
  refetchVideo: () => void;
}

export function useVideoDataManager(options: VideoDataManagerOptions = {}): VideoDataManagerResult {
  const {
    limit = 50,
    researched = true,
    sort_by = 'processed_at',
    sort_order = 'desc',
    videoId
  } = options;

  const {
    data: apiVideos,
    isLoading: videosLoading,
    error: videosError,
    refetch: refetchVideos
  } = useVideos({
    limit,
    researched,
    sort_by,
    sort_order
  });

  const {
    data: specificVideo,
    isLoading: videoLoading,
    error: videoError,
    refetch: refetchVideo
  } = useVideoDetail(videoId || '');

  // Simple combination - no conversions needed!
  const videos: VideoWithTimestamps[] = useMemo(() => {
    const combinedVideos: VideoWithTimestamps[] = [];

    // Add API videos if available
    if (apiVideos && Array.isArray(apiVideos) && apiVideos.length > 0) {
      const convertedVideos = apiVideos.map(video => ({
        video,
        timestamps: [] // Will be populated when individual video is loaded
      }));
      combinedVideos.push(...convertedVideos);
    }

    // Add mock videos as fallback
    combinedVideos.push(...mockVideos);

    // Remove duplicates
    const uniqueVideos = combinedVideos.reduce((acc, current) => {
      const exists = acc.find(video => video.video.id === current.video.id);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, [] as VideoWithTimestamps[]);

    return uniqueVideos;
  }, [apiVideos]);

  const initialIndex = useMemo(() => {
    if (!videoId) return 0;
    return Math.max(0, videos.findIndex(v => v.video.id === videoId));
  }, [videoId, videos]);

  const enhancedVideos = useMemo(() => {
    if (!specificVideo) return videos;
    
    // Simple replacement - no conversion needed!
    return videos.map(v =>
      v.video.id === videoId ? specificVideo : v
    );
  }, [videos, specificVideo, videoId]);

  const hasApiData = Boolean(apiVideos && apiVideos.length > 0);
  const hasSpecificVideo = Boolean(specificVideo);
  const isUsingFallback = Boolean(videosError && !hasApiData);

  return {
    videos: enhancedVideos,
    specificVideo,
    videosLoading,
    videoLoading,
    videosError: videosError as Error | null,
    videoError: videoError as Error | null,
    hasApiData,
    hasSpecificVideo,
    isUsingFallback,
    initialIndex,
    enhancedVideos,
    refetchVideos,
    refetchVideo
  };
}

// Simple helper functions
export function getDataSourceStatus(result: VideoDataManagerResult) {
  if (result.videosLoading) {
    return {
      type: 'loading' as const,
      message: 'Loading API...',
      color: 'text-blue-400'
    };
  }
  
  if (result.isUsingFallback) {
    return {
      type: 'fallback' as const,
      message: 'Using fallback',
      color: 'text-yellow-400'
    };
  }
  
  if (result.hasApiData) {
    return {
      type: 'connected' as const,
      message: 'API connected',
      color: 'text-green-400'
    };
  }
  
  return {
    type: 'unknown' as const,
    message: 'Unknown status',
    color: 'text-gray-400'
  };
}

export function getVideoCountText(count: number): string {
  return `${count} video${count !== 1 ? 's' : ''}`;
}