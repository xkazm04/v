import { supabase, supabaseAdmin } from '@/app/lib/supabase';
import { Video, VideoWithTimestamps } from '@/app/types/video_api';
import { supabaseVideoTimestampsService } from './supabase-video-timestamps-service';

class SupabaseVideoDetailService {
  /**
   * Get video basic info (without timestamps)
   */
  async getVideoInfo(videoId: string): Promise<Video | null> {
    try {
      console.log(`🎬 Fetching video info: ${videoId}`);

      if (!supabaseAdmin) {
        console.warn('Supabase admin client not available');
        return null;
      }

      // Try exact ID match first
      let { data: videoData, error } = await supabaseAdmin
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
          country_code,
          audio_extracted,
          transcribed,
          analyzed,
          created_at,
          updated_at,
          processed_at
        `)
        .eq('id', videoId)
        .single();

      // If not found by ID, try URL pattern match
      if (error && error.code === 'PGRST116') { // No rows returned
        console.log(`🔄 Video not found by ID, trying URL pattern...`);
        
        const { data: urlData, error: urlError } = await supabaseAdmin
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
            country_code,
            audio_extracted,
            transcribed,
            analyzed,
            created_at,
            updated_at,
            processed_at
          `)
          .or(`video_url.ilike.%${videoId}%`)
          .limit(1);

        if (urlError || !urlData || urlData.length === 0) {
          console.log(`❌ Video not found: ${videoId}`);
          return null;
        }

        videoData = urlData[0];
      } else if (error) {
        console.error('Database error:', error);
        return null;
      }
      if (!videoData) return null;

      // Convert to Video format
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
        processed_at: videoData.processed_at,
        duration: this.formatVideoDuration(videoData.duration_seconds)
      };

      console.log(`✅ Found video: ${video.title || video.id}`);
      return video;

    } catch (error) {
      console.error('Error fetching video info:', error);
      return null;
    }
  }

  /**
   * Get complete video with timestamps (combines video info + timestamps)
   */
  async getVideoWithTimestamps(videoId: string): Promise<VideoWithTimestamps | null> {
    try {
      console.log(`🎯 Fetching complete video data: ${videoId}`);

      // Get video info and timestamps in parallel
      const [video, timestamps] = await Promise.all([
        this.getVideoInfo(videoId),
        supabaseVideoTimestampsService.getVideoTimestamps(videoId)
      ]);

      if (!video) {
        console.log(`❌ Video not found: ${videoId}`);
        return null;
      }

      console.log(`✅ Complete video data loaded: ${video.title || video.id} (${timestamps.length} timestamps)`);

      return {
        video,
        timestamps
      };

    } catch (error) {
      console.error('Error fetching complete video data:', error);
      return null;
    }
  }

  /**
   * Check if video exists
   */
  async videoExists(videoId: string): Promise<boolean> {
    try {
      if (!supabaseAdmin) {
        console.warn('Supabase admin client not available');
        return false;
      }
      const { data, error } = await supabaseAdmin
        .from('videos')
        .select('id')
        .eq('id', videoId)
        .single();

      return !error && !!data;
    } catch (error) {
      return false;
    }
  }

  /**
   * Format video duration helper
   */
  private formatVideoDuration(duration_seconds: number | null): string {
    if (!duration_seconds) return 'Unknown';
    
    const minutes = Math.floor(duration_seconds / 60);
    const seconds = duration_seconds % 60;
    
    if (minutes === 0) {
      return `${seconds}s`;
    }
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!supabaseAdmin) {
        console.warn('Supabase admin client not available');
        return false;
      }
      const { error } = await supabaseAdmin
        .from('videos')
        .select('id')
        .limit(1);

      return !error;
    } catch (error) {
      return false;
    }
  }
}

export const supabaseVideoDetailService = new SupabaseVideoDetailService();