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
  duration?: string; 
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

export interface FactCheckData {
  id?: string;
  verdict?: string;
  status?: 'TRUE' | 'FALSE' | 'PARTIALLY_TRUE' | 'MISLEADING' | 'UNVERIFIABLE';
  correction?: string;
  confidence?: number | string;
  sources?: {
    agreed: SourceData;
    disagreed: SourceData;
  };
  expertAnalysis?: {
    nerd?: string;
    devil?: string;
    critic?: string;
    psychic?: string;
  };
  processedAt?: Date;
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

// SINGLE SOURCE OF TRUTH - Use this everywhere
export interface VideoWithTimestamps {
  video: Video;
  timestamps: VideoTimestamp[];
}

// Backend response types (for API conversion only)
export interface ResearchResult {
  id?: string;
  source?: string;
  country?: string;
  valid_sources?: string;
  verdict?: string;
  status?: 'TRUE' | 'FALSE' | 'PARTIALLY_TRUE' | 'MISLEADING' | 'UNVERIFIABLE';
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
  video_url: string;
  source: string;
  title?: string;
  verdict?: string;
  duration_seconds?: number;
  speaker_name?: string;
  language_code?: string;
  processed_at?: string;
  timestamps: TimestampWithResearch[];
  total_statements: number;
  researched_statements: number;
  research_completion_rate: number;
}

// ONLY conversion function we need - Backend → Frontend
export function convertBackendToFrontend(backendResponse: VideoDetailResponse): VideoWithTimestamps {
  const video: Video = {
    id: extractVideoIdFromUrl(backendResponse.video_url),
    video_url: backendResponse.video_url,
    source: backendResponse.source,
    researched: backendResponse.researched_statements > 0,
    title: backendResponse.title || null,
    verdict: backendResponse.verdict || null,
    duration_seconds: backendResponse.duration_seconds || null,
    speaker_name: backendResponse.speaker_name || null,
    language_code: backendResponse.language_code || null,
    audio_extracted: true,
    transcribed: true,
    analyzed: backendResponse.researched_statements > 0,
    created_at: backendResponse.processed_at || new Date().toISOString(),
    updated_at: backendResponse.processed_at || null,
    processed_at: backendResponse.processed_at || null
  };

  const timestamps: VideoTimestamp[] = backendResponse.timestamps.map(ts => ({
    startTime: ts.time_from_seconds,
    endTime: ts.time_to_seconds,
    statement: ts.statement,
    context: ts.context,
    category: ts.category,
    confidence: ts.confidence_score,
    factCheck: ts.research ? convertResearchToFactCheck(ts.research) : undefined
  }));

  return { video, timestamps };
}

function convertResearchToFactCheck(research: ResearchResult): FactCheckData {
  const agreed = research.resources_agreed;
  const disagreed = research.resources_disagreed;

  return {
    id: research.id,
    verdict: research.verdict,
    status: research.status,
    correction: research.correction,
    confidence: research.valid_sources || 'Unknown',
    sources: {
      agreed: {
        count: agreed?.count || 0,
        percentage: agreed?.total || '0%',
        references: (agreed?.references || []).map(ref => ({
          url: ref.url,
          title: ref.title,
          country: ref.country,
          category: ref.category,
          credibility: ref.credibility as 'high' | 'medium' | 'low'
        })),
        countries: agreed?.major_countries || []
      },
      disagreed: {
        count: disagreed?.count || 0,
        percentage: disagreed?.total || '0%',
        references: (disagreed?.references || []).map(ref => ({
          url: ref.url,
          title: ref.title,
          country: ref.country,
          category: ref.category,
          credibility: ref.credibility as 'high' | 'medium' | 'low'
        })),
        countries: disagreed?.major_countries || []
      }
    },
    expertAnalysis: research.experts,
    processedAt: research.processed_at ? new Date(research.processed_at) : undefined
  };
}

function extractVideoIdFromUrl(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : url.split('/').pop() || 'unknown';
}

// Helper functions
export function formatVideoDuration(duration_seconds: number | null): string {
  if (!duration_seconds) return 'Unknown';
  
  const minutes = Math.floor(duration_seconds / 60);
  const seconds = duration_seconds % 60;
  
  if (minutes === 0) {
    return `${seconds}s`;
  }
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function getVideoThumbnailUrl(video: Video): string {
  if (video.source === 'youtube') {
    const videoId = extractYouTubeId(video.video_url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/logo_large_black.png';
  }
  
  return '/logo_large_black.png';
}

function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export interface VideoFilters {
  limit?: number;
  offset?: number;
  source?: string;
  researched?: boolean;
  analyzed?: boolean;
  speaker_name?: string;
  language_code?: string;
  categories?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface VideoStats {
  total_videos: number;
  researched_videos: number;
  pending_videos: number;
  completion_rate: number;
}

export interface CategoryInfo {
  category: string;
  count: number;
  percentage: number;
}

export interface AdvancedSearchResult extends Video {
  relevance_score?: number;
  match_reason?: string;
}