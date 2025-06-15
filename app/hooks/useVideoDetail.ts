import { useQuery } from '@tanstack/react-query';
import { VideoDetailResponse, VideoWithTimestamps, convertBackendToFrontend } from '@/app/types/video_api';
import { videos as mockVideos } from '@/app/constants/videos';

const LOCAL_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Enhanced video detail response with metadata
interface VideoDetailWithMeta extends VideoWithTimestamps {
  __meta?: {
    source: 'supabase' | 'fastapi' | 'mock' | 'nextjs' | 'error';
    fetchTime: number;
    timestamp: string;
    warning?: string;
  };
}

async function getVideoDetail(videoId: string): Promise<VideoWithTimestamps> {
  try {
    // ✅ **PRIMARY: Try Next.js API route (which handles dual strategy internally)**
    console.log(`🎬 Fetching video detail via Next.js API: ${videoId}`);
    
    const response = await fetch(`/api/video/${videoId}`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (response.ok) {
      const data: VideoDetailWithMeta = await response.json();
      
      console.log(`✅ Video detail fetched via Next.js API from ${data.__meta?.source || 'unknown'} in ${data.__meta?.fetchTime || 0}ms`);
      
      // Remove metadata before returning
      const { __meta, ...cleanData } = data;
      return cleanData;
    } else if (response.status === 404) {
      console.log('⚠️ Next.js API returned 404, trying direct FastAPI...');
    } else {
      console.warn(`⚠️ Next.js API returned ${response.status}, trying direct FastAPI...`);
    }
    
  } catch (nextApiError) {
    console.warn('⚠️ Next.js API fetch failed, trying direct FastAPI:', nextApiError);
  }

  // ✅ **SECONDARY: Try direct FastAPI call**
  if (LOCAL_API_BASE) {
    try {
      console.log(`🔄 Attempting direct FastAPI fetch: ${videoId}`);
      
      const response = await fetch(`${LOCAL_API_BASE}/video/${videoId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const backendData: VideoDetailResponse = await response.json();
        const convertedData = convertBackendToFrontend(backendData);
        
        console.log(`✅ Video detail fetched directly from FastAPI`);
        return convertedData;
      } else {
        console.warn(`⚠️ Direct FastAPI returned ${response.status}`);
      }
      
    } catch (fastApiError) {
      console.warn('⚠️ Direct FastAPI fetch failed:', fastApiError);
    }
  }

  // ✅ **TERTIARY: Fallback to mock data**
  console.log('🔄 Attempting mock data fallback...');
  const mockVideo = mockVideos.find(v => 
    v.video.id === videoId || 
    v.video.video_url.includes(videoId)
  );
  
  if (mockVideo) {
    console.log(`✅ Using mock data for video: ${videoId}`);
    return mockVideo;
  }

  // ✅ **ULTIMATE FALLBACK: Create minimal video object**
  console.warn(`⚠️ No data found anywhere for video: ${videoId}, creating minimal object`);
  
  return {
    video: {
      id: videoId,
      video_url: `https://youtube.com/watch?v=${videoId}`,
      source: 'youtube',
      researched: false,
      title: `Video ${videoId}`,
      verdict: null,
      duration_seconds: null,
      speaker_name: null,
      language_code: 'en',
      audio_extracted: false,
      transcribed: false,
      analyzed: false,
      created_at: new Date().toISOString(),
      updated_at: null,
      processed_at: null
    },
    timestamps: []
  };
}

export const useVideoDetail = (videoId: string, options?: {
  enabled?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
}) => {
  return useQuery({
    queryKey: ['video', videoId, 'detail'],
    queryFn: () => getVideoDetail(videoId),
    enabled: !!videoId && (options?.enabled !== false),
    staleTime: options?.staleTime || 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    retry: (failureCount, error) => {
      // Don't retry if we have mock data or if it's a 404
      if (failureCount === 0) {
        const mockVideo = mockVideos.find(v => 
          v.video.id === videoId || 
          v.video.video_url.includes(videoId)
        );
        return !mockVideo; // Only retry if no mock data available
      }
      return failureCount < 2; // Retry up to 2 times
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

// ✅ **BATCH HOOK for multiple videos**
export const useMultipleVideoDetails = (videoIds: string[]) => {
  return useQuery({
    queryKey: ['videos', 'batch', videoIds.sort()],
    queryFn: async () => {
      const results: Record<string, VideoWithTimestamps> = {};
      
      // Process in parallel but with a reasonable limit
      const batchSize = 5;
      for (let i = 0; i < videoIds.length; i += batchSize) {
        const batch = videoIds.slice(i, i + batchSize);
        const batchPromises = batch.map(async (videoId) => {
          try {
            const detail = await getVideoDetail(videoId);
            results[videoId] = detail;
          } catch (error) {
            console.warn(`Failed to fetch video ${videoId}:`, error);
          }
        });
        
        await Promise.all(batchPromises);
      }
      
      return results;
    },
    enabled: videoIds.length > 0,
    staleTime: 15 * 60 * 1000, // 15 minutes for batch
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  });
};

// ✅ **PREFETCH utility for build-time optimization**
export const prefetchVideoDetail = async (videoId: string) => {
  try {
    return await getVideoDetail(videoId);
  } catch (error) {
    console.warn(`Failed to prefetch video ${videoId}:`, error);
    return null;
  }
};