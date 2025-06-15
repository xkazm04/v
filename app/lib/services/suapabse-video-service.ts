// app/lib/services/supabase-video-service.ts
import { supabase, supabaseAdmin } from '@/app/lib/supabase';
import { 
  VideoWithTimestamps, 
  Video, 
  VideoTimestamp, 
  FactCheckData,
} from '@/app/types/video_api';

export interface SupabaseVideoDetail {
  id: string;
  video_url: string;
  source: string;
  researched: boolean;
  title: string | null;
  verdict: string | null;
  duration_seconds: number | null;
  speaker_name: string | null;
  language_code: string | null;
  audio_extracted: boolean;
  transcribed: boolean;
  analyzed: boolean;
  created_at: string;
  updated_at: string | null;
  processed_at: string | null;
  video_timestamps?: Array<{
    time_from_seconds: number;
    time_to_seconds: number;
    statement: string;
    context?: string;
    category?: string;
    confidence_score?: number;
    research_data?: any;
  }>;
}

class SupabaseVideoService {
  /**
   * Get video detail with timestamps from Supabase
   */
  async getVideoDetail(videoId: string): Promise<VideoWithTimestamps | null> {
    try {
      console.log(`🔍 Fetching video detail from Supabase: ${videoId}`);

      // First, try to find the video by ID
      let { data: videoData, error: videoError } = await supabase
        .from('videos')
        .select(`
          id,
          video_url,
          source,
          researched,
          title,
          verdict,
          duration_seconds,
          speaker_name,
          language_code,
          audio_extracted,
          transcribed,
          analyzed,
          created_at,
          updated_at,
          processed_at
        `)
        .eq('id', videoId)
        .single();

      // If not found by ID, try to find by video URL pattern (for YouTube IDs)
      if (videoError || !videoData) {
        console.log(`🔄 Video not found by ID, trying URL pattern match...`);
        
        const { data: urlMatchData, error: urlError } = await supabase
          .from('videos')
          .select(`
            id,
            video_url,
            source,
            researched,
            title,
            verdict,
            duration_seconds,
            speaker_name,
            language_code,
            audio_extracted,
            transcribed,
            analyzed,
            created_at,
            updated_at,
            processed_at
          `)
          .or(`video_url.ilike.%${videoId}%,id.eq.${videoId}`)
          .limit(1);

        if (urlError || !urlMatchData || urlMatchData.length === 0) {
          console.log(`❌ Video not found in Supabase: ${videoId}`);
          return null;
        }

        videoData = urlMatchData[0];
      }

      console.log(`✅ Found video in Supabase: ${videoData.title || videoData.id}`);

      // Get timestamps for this video
      const { data: timestampsData, error: timestampsError } = await supabase
        .from('video_timestamps')
        .select(`
          time_from_seconds,
          time_to_seconds,
          statement,
          context,
          category,
          confidence_score,
          research_data
        `)
        .eq('video_id', videoData.id)
        .order('time_from_seconds', { ascending: true });

      if (timestampsError) {
        console.warn(`⚠️ Error fetching timestamps: ${timestampsError.message}`);
      }

      console.log(`📊 Found ${timestampsData?.length || 0} timestamps`);

      // Convert to frontend format
      const video: Video = {
        id: videoData.id,
        video_url: videoData.video_url,
        source: videoData.source,
        researched: videoData.researched,
        title: videoData.title,
        verdict: videoData.verdict,
        duration_seconds: videoData.duration_seconds,
        speaker_name: videoData.speaker_name,
        language_code: videoData.language_code,
        audio_extracted: videoData.audio_extracted,
        transcribed: videoData.transcribed,
        analyzed: videoData.analyzed,
        created_at: videoData.created_at,
        updated_at: videoData.updated_at,
        processed_at: videoData.processed_at
      };

      const timestamps: VideoTimestamp[] = (timestampsData || []).map(ts => ({
        startTime: ts.time_from_seconds,
        endTime: ts.time_to_seconds,
        statement: ts.statement,
        context: ts.context,
        category: ts.category,
        confidence: ts.confidence_score,
        factCheck: ts.research_data ? this.convertSupabaseResearchToFactCheck(ts.research_data) : undefined
      }));

      return { video, timestamps };

    } catch (error) {
      console.error('💥 Supabase video detail fetch error:', error);
      return null;
    }
  }

  /**
   * Get all videos for build-time generation
   */
  async getAllVideoIds(): Promise<string[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('videos')
        .select('id, video_url')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching video IDs:', error);
        return [];
      }

      // Return both actual IDs and extracted YouTube IDs
      const ids = data?.map(video => {
        const youtubeId = this.extractYouTubeId(video.video_url);
        return [video.id, youtubeId].filter(Boolean);
      }).flat() || [];

      console.log(`📊 Found ${ids.length} video IDs for build generation`);
      return ids as string[];

    } catch (error) {
      console.error('Error getting all video IDs:', error);
      return [];
    }
  }

  /**
   * Batch fetch multiple videos (for build optimization)
   */
  async getMultipleVideoDetails(videoIds: string[]): Promise<Record<string, VideoWithTimestamps>> {
    try {
      const results: Record<string, VideoWithTimestamps> = {};
      
      // Process in batches to avoid overwhelming Supabase
      const batchSize = 10;
      for (let i = 0; i < videoIds.length; i += batchSize) {
        const batch = videoIds.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (videoId) => {
          const detail = await this.getVideoDetail(videoId);
          if (detail) {
            results[videoId] = detail;
          }
        });

        await Promise.all(batchPromises);
        
        // Small delay to be nice to Supabase
        if (i + batchSize < videoIds.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      console.log(`✅ Batch fetched ${Object.keys(results).length} video details`);
      return results;

    } catch (error) {
      console.error('Error in batch video fetch:', error);
      return {};
    }
  }

  /**
   * Convert Supabase research data to FactCheck format
   */
  private convertSupabaseResearchToFactCheck(researchData: any): FactCheckData | undefined {
    if (!researchData) return undefined;

    try {
      const research = typeof researchData === 'string' ? JSON.parse(researchData) : researchData;

      return {
        id: research.id,
        verdict: research.verdict,
        status: research.status,
        correction: research.correction,
        confidence: research.valid_sources || research.confidence,
        sources: {
          agreed: {
            count: research.resources_agreed?.count || 0,
            percentage: research.resources_agreed?.total || '0%',
            references: research.resources_agreed?.references || [],
            countries: research.resources_agreed?.major_countries || []
          },
          disagreed: {
            count: research.resources_disagreed?.count || 0,
            percentage: research.resources_disagreed?.total || '0%',
            references: research.resources_disagreed?.references || [],
            countries: research.resources_disagreed?.major_countries || []
          }
        },
        expertAnalysis: research.experts,
        processedAt: research.processed_at ? new Date(research.processed_at) : new Date()
      };
    } catch (error) {
      console.warn('Error parsing research data:', error);
      return undefined;
    }
  }

  /**
   * Extract YouTube ID from URL
   */
  private extractYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  /**
   * Health check for Supabase connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('id')
        .limit(1);

      return !error;
    } catch (error) {
      console.error('Supabase health check failed:', error);
      return false;
    }
  }
}

export const supabaseVideoService = new SupabaseVideoService();