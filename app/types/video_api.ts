export interface Video {
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
}

export interface VideoTimestamp {
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
}

export interface VideoWithTimestamps {
  video: Video;
  timestamps: VideoTimestamp[];
}

export interface VideoFilters {
  limit?: number;
  offset?: number;
  source?: string;
  researched?: boolean;
  analyzed?: boolean;
  speaker_name?: string;
  language_code?: string;
  categories?: string; // Comma-separated categories
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface CategoryInfo {
  category: string;
  count: number;
}

export interface VideoStats {
  total_videos: number;
  researched_videos: number;
  analyzed_videos: number;
  unique_sources: number;
  unique_speakers: number;
  unique_languages: number;
  avg_duration_seconds: number;
  category_distribution: Record<string, number>;
  earliest_video: string;
  latest_video: string;
}

export interface AdvancedSearchResult {
  id: string;
  video_url: string;
  source: string;
  title: string | null;
  speaker_name: string | null;
  total_statements: number;
  researched_statements: number;
  categories: string[];
  processed_at: string | null;
  match_rank: number;
}