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
  country_code: string | null; 
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

export interface SupabaseVideoFilters {
  limit?: number;
  offset?: number;
  source?: string;
  researched?: boolean;
  analyzed?: boolean;
  speaker_name?: string;
  language_code?: string;
  country_code?: string; // New filter
  title?: string; // New filter for title search
  search?: string; // General search
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  categories?: string;
}

class SupabaseVideoService {
  /**
   * Get multiple videos from Supabase (primary method for featured videos)
   */
  async getVideos(filters: SupabaseVideoFilters = {}): Promise<Video[]> {
    try {
      console.log(`🔍 Fetching videos from Supabase with filters:`, filters);

      // Check if admin client is available
      if (!supabaseAdmin) {
        console.warn('Supabase admin client not available (missing service role key)');
        return [];
      }

      // Test connection first
      const { data: testData, error: testError } = await supabaseAdmin
        .from('videos')
        .select('id, title')
        .limit(1);

      if (testError) {
        throw new Error(`Supabase connection failed: ${testError.message}`);
      }

      // Build main query
      let query = supabaseAdmin
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
        `);

      // Apply filters
      if (filters.source && filters.source !== 'all' && filters.source.trim() !== '') {
        query = query.eq('source', filters.source);
      }

      if (filters.researched !== undefined) {
        query = query.eq('researched', filters.researched);
      }

      if (filters.analyzed !== undefined) {
        query = query.eq('analyzed', filters.analyzed);
      }

      if (filters.speaker_name && filters.speaker_name !== 'all' && filters.speaker_name.trim() !== '') {
        query = query.ilike('speaker_name', `%${filters.speaker_name}%`);
      }

      if (filters.language_code && filters.language_code !== 'all' && filters.language_code.trim() !== '') {
        query = query.eq('language_code', filters.language_code);
      }

      if (filters.country_code && filters.country_code !== 'all' && filters.country_code !== 'worldwide' && filters.country_code.trim() !== '') {
        query = query.eq('country_code', filters.country_code);
      }

      if (filters.title && filters.title.trim() !== '') {
        query = query.ilike('title', `%${filters.title.trim()}%`);
      }

      if (filters.search && filters.search.trim() !== '') {
        const searchTerm = filters.search.trim();
        query = query.or(`title.ilike.%${searchTerm}%,speaker_name.ilike.%${searchTerm}%,verdict.ilike.%${searchTerm}%`);
      }

      // Sorting
      const sortBy = filters.sort_by || 'processed_at';
      const sortOrder = filters.sort_order || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Pagination - max 6 for featured videos
      const limit = Math.min(filters.limit || 6, 6);
      const offset = filters.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) {
        throw new Error(`Supabase videos query failed: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.log(`📭 No videos found in Supabase with filters:`, filters);
        return [];
      }

      // Convert to Video format
      const videos: Video[] = data.map((item: any): Video => ({
        id: item.id,
        video_url: item.video_url,
        source: item.source,
        researched: item.researched || false,
        title: item.title,
        verdict: item.verdict,
        duration_seconds: item.duration_seconds,
        speaker_name: item.speaker_name,
        language_code: item.language_code,
        audio_extracted: item.audio_extracted || false,
        transcribed: item.transcribed || false,
        analyzed: item.analyzed || false,
        created_at: item.created_at,
        updated_at: item.updated_at,
        processed_at: item.processed_at,
        // Add computed duration string
        duration: this.formatVideoDuration(item.duration_seconds)
      }));

      console.log(`✅ Supabase videos service returning ${videos.length} results`);
      return videos;

    } catch (error) {
      console.error('💥 Supabase videos service error:', error);
      throw error; // Re-throw to allow fallback handling
    }
  }

  /**
   * Get featured videos (researched videos, sorted by processed_at)
   */
  async getFeaturedVideos(limit: number = 6): Promise<Video[]> {
    return this.getVideos({
      limit: Math.min(limit, 6),
      researched: true,
      analyzed: true,
      sort_by: 'processed_at',
      sort_order: 'desc'
    });
  }

  /**
   * Get video detail with timestamps from Supabase (FIXED VERSION)
   */
  async getVideoDetail(videoId: string): Promise<VideoWithTimestamps | null> {
    try {
      console.log(`🔍 Fetching video detail from Supabase: ${videoId}`);

      // ✅ FIX: Use supabaseAdmin instead of supabase for video details
      if (!supabaseAdmin) {
        console.warn('Supabase admin client not available');
        return null;
      }

      // ✅ FIX: Try multiple query strategies for finding the video
      let videoData = null;

      // Strategy 1: Exact ID match
      try {
        const { data: exactData, error: exactError } = await supabaseAdmin
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

        if (!exactError && exactData) {
          videoData = exactData;
          console.log(`✅ Found video by exact ID match`);
        }
      } catch (exactError) {
        console.log(`🔄 Exact ID match failed, trying URL patterns...`);
      }

      // Strategy 2: YouTube ID in URL (if exact ID fails)
      if (!videoData) {
        try {
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

          if (!urlError && urlData && urlData.length > 0) {
            videoData = urlData[0];
            console.log(`✅ Found video by URL pattern match`);
          }
        } catch (urlError) {
          console.log(`🔄 URL pattern match failed...`);
        }
      }

      // Strategy 3: Search in all text fields
      if (!videoData) {
        try {
          const { data: searchData, error: searchError } = await supabaseAdmin
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
            .or(`id.eq.${videoId},title.ilike.%${videoId}%,speaker_name.ilike.%${videoId}%`)
            .limit(1);

          if (!searchError && searchData && searchData.length > 0) {
            videoData = searchData[0];
            console.log(`✅ Found video by text search`);
          }
        } catch (searchError) {
          console.log(`❌ All search strategies failed`);
        }
      }

      if (!videoData) {
        console.log(`❌ Video not found in Supabase: ${videoId}`);
        return null;
      }

      console.log(`✅ Found video in Supabase: ${videoData.title || videoData.id}`);

      // ✅ FIX: Use supabaseAdmin for timestamps too
      const { data: timestampsData, error: timestampsError } = await supabaseAdmin
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
        processed_at: videoData.processed_at,
        duration: this.formatVideoDuration(videoData.duration_seconds)
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
   * Get all videos for build-time generation (existing method)
   */
  async getAllVideoIds(): Promise<string[]> {
    try {
      if (!supabaseAdmin) {
        console.warn('Supabase admin client not available');
        return [];
      }
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
   * Convert Supabase research data to FactCheck format (existing method)
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
   * Extract YouTube ID from URL (existing method)
   */
  private extractYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
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
   * Health check for Supabase connection (existing method)
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