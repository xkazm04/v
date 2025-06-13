import { useQuery } from '@tanstack/react-query';
import { VideoDetailResponse, VideoWithTimestamps, convertBackendToFrontend } from '@/app/types/video_api';
import { videos as mockVideos } from '@/app/constants/videos';

const LOCAL_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getVideoDetail(videoId: string): Promise<VideoWithTimestamps> {
  try {
    const response = await fetch(`${LOCAL_API_BASE}/video/${videoId}`);
    if (!response.ok) {
      throw new Error(`Video detail fetch failed: ${response.statusText}`);
    }
    
    const backendData: VideoDetailResponse = await response.json();
    return convertBackendToFrontend(backendData);
  } catch (error) {
    // Fallback to mock data if API fails
    console.warn('API fetch failed, checking mock data:', error);
    const mockVideo = mockVideos.find(v => v.video.id === videoId);
    if (mockVideo) {
      return mockVideo;
    }
    throw error;
  }
}

export const useVideoDetail = (videoId: string) => {
  return useQuery({
    queryKey: ['video', videoId, 'detail'],
    queryFn: () => getVideoDetail(videoId),
    enabled: !!videoId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry if we have mock data
      if (failureCount === 0) {
        const mockVideo = mockVideos.find(v => v.video.id === videoId);
        return !mockVideo; // Only retry if no mock data available
      }
      return false;
    }
  });
};