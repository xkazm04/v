import { supabase, supabaseAdmin } from '@/app/lib/supabase';
import { VideoTimestamp, FactCheckData } from '@/app/types/video_api';

export interface SupabaseVideoTimestamp {
  id: string;
  video_id: string;
  research_id: string | null;
  time_from_seconds: number;
  time_to_seconds: number;
  statement: string;
  context: string | null;
  category: string | null;
  confidence_score: number | null;
  created_at: string;
  updated_at: string;
}

class SupabaseVideoTimestampsService {
  /**
   * Get all timestamps for a specific video
   */
  async getVideoTimestamps(videoId: string): Promise<VideoTimestamp[]> {
    try {
      console.log(`🕒 Fetching timestamps for video: ${videoId}`);

      if (!supabaseAdmin) {
        console.warn('Supabase admin client not available for timestamps');
        return [];
      }

      // ✅ FIX: Query only existing columns, join with research_results if needed
      const { data: timestampsData, error } = await supabaseAdmin
        .from('video_timestamps')
        .select(`
          id,
          video_id,
          research_id,
          time_from_seconds,
          time_to_seconds,
          statement,
          context,
          category,
          confidence_score,
          created_at,
          updated_at,
          research_results (
            id,
            verdict,
            status,
            correction,
            valid_sources,
            resources_agreed,
            resources_disagreed,
            experts,
            processed_at
          )
        `)
        .eq('video_id', videoId)
        .order('time_from_seconds', { ascending: true });

      if (error) {
        console.error('Error fetching video timestamps:', error);
        return [];
      }

      if (!timestampsData || timestampsData.length === 0) {
        console.log(`📭 No timestamps found for video: ${videoId}`);
        return [];
      }

      // Convert to frontend VideoTimestamp format
      const timestamps: VideoTimestamp[] = timestampsData.map(ts => ({
        startTime: ts.time_from_seconds,
        endTime: ts.time_to_seconds,
        statement: ts.statement,
        context: ts.context || undefined,
        category: ts.category || undefined,
        confidence: ts.confidence_score || undefined,
        factCheck: ts.research_results ? this.convertResearchToFactCheck(ts.research_results) : undefined
      }));

      console.log(`✅ Loaded ${timestamps.length} timestamps for video: ${videoId}`);
      return timestamps;

    } catch (error) {
      console.error('Error in getVideoTimestamps:', error);
      return [];
    }
  }

  /**
   * Convert Supabase research data to FactCheck format
   */
  private convertResearchToFactCheck(research: any): FactCheckData {
    return {
      id: research.id,
      verdict: research.verdict,
      status: research.status,
      correction: research.correction,
      confidence: research.valid_sources || 'Unknown',
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
      processedAt: research.processed_at ? new Date(research.processed_at) : undefined
    };
  }

  /**
   * Health check for timestamp service
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!supabaseAdmin) {
        return false;
      }
      const { error } = await supabaseAdmin
        .from('video_timestamps')
        .select('id')
        .limit(1);

      return !error;
    } catch (error) {
      console.error('Timestamp service health check failed:', error);
      return false;
    }
  }
}

export const supabaseVideoTimestampsService = new SupabaseVideoTimestampsService();