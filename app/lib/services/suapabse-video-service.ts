import { Video, VideoWithTimestamps, FactCheckData, formatVideoDuration } from '@/app/types/video_api';
import { supabaseAdmin } from '../supabase';
import { extractYouTubeId } from '@/app/helpers/playerHelp';

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
  country_code?: string;
  title?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  categories?: string;
  status?: string;
  topic_id?: string;
}

class SupabaseVideoService {
  async getVideos(filters: SupabaseVideoFilters = {}): Promise<Video[]> {
    try {
      // Check if admin client is available
      if (!supabaseAdmin) {
        throw new Error('Supabase admin client is not available');
      }

      // Test connection first
      const { data: testData, error: testError } = await supabaseAdmin
        .from('videos')
        .select('id, title')
        .limit(1);

      if (testError) {
        throw new Error(`Supabase connection test failed: ${testError.message}`);
      }

      // Build query
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
          processed_at,
          topic_id,
          status
        `);

      // Apply filters (keeping the same filter logic)
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
        query = query.ilike('title', `%${filters.title}%`);
      }

      if (filters.status && filters.status !== 'all' && filters.status.trim() !== '') {
        query = query.eq('status', filters.status);
      }

      if (filters.topic_id && filters.topic_id.trim() !== '') {
        query = query.eq('topic_id', filters.topic_id);
      }

      if (filters.search && filters.search.trim() !== '') {
        query = query.or(`title.ilike.%${filters.search}%,speaker_name.ilike.%${filters.search}%`);
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
        throw new Error(`Supabase query failed: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return [];
      }

      console.log(`✅ Supabase videos service returning ${data.length} results`);

      const videos: Video[] = data.map(row => {
        const youtubeId = extractYouTubeId(row.video_url);
        const thumbnail_url = youtubeId 
          ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
          : '/images/video-placeholder.jpg';

        return {
          // ✅ Map to correct Video interface properties
          id: row.id,
          video_url: row.video_url,
          source: row.source,
          researched: row.researched,
          title: row.title,
          verdict: row.verdict,
          duration_seconds: row.duration_seconds,
          speaker_name: row.speaker_name,
          language_code: row.language_code,
          audio_extracted: row.audio_extracted,
          transcribed: row.transcribed,
          analyzed: row.analyzed,
          created_at: row.created_at,
          updated_at: row.updated_at,
          processed_at: row.processed_at,
          thumbnail_url, 
          description: row.verdict || '', 
          categories: row.country_code || '', 
          status: row.status as 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'PENDING' || 'COMPLETED',
          topic_id: row.topic_id,
          duration: formatVideoDuration(row.duration_seconds), 
        };
      });

      return videos;

    } catch (error) {
      console.error('💥 Supabase video service error:', error);
      throw error;
    }
  }

  async getFeaturedVideos(limit: number = 6): Promise<Video[]> {
    return this.getVideos({
      limit: Math.min(limit, 6),
      researched: true,
      analyzed: true,
      sort_by: 'processed_at',
      sort_order: 'desc'
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!supabaseAdmin) {
        return false;
      }
      const { data, error } = await supabaseAdmin
        .from('videos')
        .select('id')
        .limit(1);
      
      return !error && !!data;
    } catch (error) {
      return false;
    }
  }
}

export const supabaseVideoService = new SupabaseVideoService();