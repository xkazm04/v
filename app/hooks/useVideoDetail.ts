import { useQuery } from '@tanstack/react-query';
import { VideoWithTimestamps } from '@/app/types/video_api';
import { supabaseVideoDetailService } from '@/app/lib/services/supabase-video-detail-service';
import { videos as mockVideos } from '@/app/constants/videos';

// ✅ ADDED: Helper to check if a string is a valid YouTube ID
const isValidYouTubeId = (id: string): boolean => {
  // YouTube IDs are 11 characters long and contain only alphanumeric, underscore, and hyphen
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
};

// ✅ ADDED: Helper to check if a string is a UUID (database ID)
const isUUID = (id: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

async function getVideoDetail(videoId: string): Promise<VideoWithTimestamps> {
  try {
    console.log(`🎬 Fetching video detail: ${videoId}`);
    
    // ✅ **PRIMARY: Try Supabase service**
    const videoDetail = await supabaseVideoDetailService.getVideoWithTimestamps(videoId);
    
    if (videoDetail) {
      console.log(`✅ Video detail loaded from Supabase: ${videoDetail.video.title || videoId}`);
      return videoDetail;
    }

    console.log(`⚠️ Video not found in Supabase: ${videoId}`);

  } catch (error) {
    console.warn('⚠️ Supabase video detail fetch failed:', error);
  }

  // ✅ **FALLBACK: Try Next.js API (which includes FastAPI fallback)**
  try {
    console.log(`🔄 Trying API fallback for: ${videoId}`);
    
    const response = await fetch(`/api/videos/${videoId}`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Video detail fetched via API fallback`);
      
      // Remove metadata if present
      const { __meta, ...cleanData } = data;
      return cleanData;
    }
    
  } catch (apiError) {
    console.warn('⚠️ API fallback failed:', apiError);
  }

  // ✅ **MOCK DATA FALLBACK**
  const mockVideo = mockVideos.find(v => 
    v.video.id === videoId || 
    v.video.video_url.includes(videoId)
  );

  if (mockVideo) {
    console.log(`📚 Using mock data for: ${videoId}`);
    return mockVideo;
  }

  // ✅ **IMPROVED ULTIMATE FALLBACK: Only create valid fallback for YouTube IDs**
  console.warn(`⚠️ No video data found for: ${videoId}`);
  
  // If the videoId is a UUID (database ID), don't create a fake YouTube video
  if (isUUID(videoId)) {
    throw new Error(`Video with database ID ${videoId} not found in any data source`);
  }
  
  // If it looks like a YouTube ID, create a minimal fallback
  if (isValidYouTubeId(videoId)) {
    console.log(`🔧 Creating minimal YouTube video object for: ${videoId}`);
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
        processed_at: null,
        duration: 'Unknown'
      },
      timestamps: []
    };
  }
  
  // For any other invalid ID format
  throw new Error(`Invalid video ID format: ${videoId}. Expected YouTube video ID or valid database UUID.`);
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
      // Don't retry for invalid ID formats
      if (error instanceof Error && error.message.includes('Invalid video ID format')) {
        return false;
      }
      
      // Only retry if we haven't found mock data
      if (failureCount === 0) {
        const mockVideo = mockVideos.find(v =>
          v.video.id === videoId || 
          v.video.video_url.includes(videoId)
        );
        return !mockVideo;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

// ✅ **Separate hook for just timestamps (for real-time updates)**
export const useVideoTimestamps = (videoId: string) => {
  return useQuery({
    queryKey: ['video', videoId, 'timestamps'],
    queryFn: async () => {
      const videoDetail = await supabaseVideoDetailService.getVideoWithTimestamps(videoId);
      return videoDetail?.timestamps || [];
    },
    enabled: !!videoId,
    staleTime: 5 * 60 * 1000, // 5 minutes for timestamps
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Keep other hooks unchanged
export const useMultipleVideoDetails = (videoIds: string[]) => {
  return useQuery({
    queryKey: ['videos', 'batch', videoIds.sort()],
    queryFn: async () => {
      const results: Record<string, VideoWithTimestamps> = {};
      
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
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};