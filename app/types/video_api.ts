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

export interface SourceData {
  count: number;
  percentage: string;
  references: SourceReference[];
  countries: string[];
}

export interface SourceReference {
  url: string;
  title: string;
  country: string;
  category: string;
  credibility: 'high' | 'medium' | 'low';
}

export interface FactCheckData {
  id: string;
  verdict: string;
  status: 'TRUE' | 'FALSE' | 'PARTIALLY_TRUE' | 'MISLEADING' | 'UNVERIFIABLE';
  correction?: string;
  confidence: string;
  sources: {
    agreed: SourceData;
    disagreed: SourceData;
  };
  expertAnalysis: {
    nerd?: string;
    devil?: string;
    critic?: string;
    psychic?: string;
  };
  processedAt: Date;
}

export interface VideoTimestamp {
  startTime: number;
  endTime: number;
  statement: string;
  context?: string;
  category?: string;
  confidence?: number;
  factCheck?: FactCheckData;
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

export interface ResearchResult {
  id?: string;
  source?: string;
  country?: string;
  valid_sources?: string;
  verdict?: string;
  status?: string;
  correction?: string;
  resources_agreed?: {
    count: number;
    total: string;
    references: Array<{
      url: string;
      title: string;
      country: string;
      category: string;
      credibility: string;
    }>;
    major_countries: string[];
  };
  resources_disagreed?: {
    count: number;
    total: string;
    references: Array<{
      url: string;
      title: string;
      country: string;
      category: string;
      credibility: string;
    }>;
    major_countries: string[];
  };
  experts?: {
    nerd?: string;
    devil?: string;
    critic?: string;
    psychic?: string;
  };
  processed_at?: string;
}

export interface TimestampWithResearch {
  time_from_seconds: number;
  time_to_seconds: number;
  statement: string;
  context?: string;
  category?: string;
  confidence_score?: number;
  research?: ResearchResult;
}

export interface VideoDetailResponse {
  // Video base data
  video_url: string;
  source: string;
  title?: string;
  verdict?: string;
  duration_seconds?: number;
  speaker_name?: string;
  language_code?: string;
  processed_at?: string;
  
  // Combined timestamps with research data
  timestamps: TimestampWithResearch[];
  
  // Summary statistics
  total_statements: number;
  researched_statements: number;
  research_completion_rate: number;
}

// Helper types for frontend consumption
export interface VideoDetail {
  id: string;
  url: string;
  source: string;
  title: string;
  speaker: string;
  duration: number;
  language: string;
  processedAt?: Date;
  verdict?: string;
  
  // Fact-check summary
  totalStatements: number;
  researchedStatements: number;
  completionRate: number;
  
  // Timestamps for video player
  timestamps: VideoTimestamp[];
}

