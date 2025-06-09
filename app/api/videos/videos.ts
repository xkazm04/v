import { 
  Video, 
  VideoWithTimestamps, 
  VideoFilters, 
  VideoStats, 
  CategoryInfo, 
  AdvancedSearchResult,
  VideoDetailResponse,
  VideoDetail, 
  FactCheckData
} from '@/app/types/video_api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class VideoAPI {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  // NEW: Get video detail with timestamps and research
  async getVideoDetail(videoId: string): Promise<VideoDetailResponse> {
    return this.request<VideoDetailResponse>(`/video/${videoId}`);
  }

  // NEW: Get transformed video detail for frontend consumption
  async getVideoForPlayer(videoId: string): Promise<VideoDetail> {
    const response = await this.getVideoDetail(videoId);
    return this.transformVideoResponse(response, videoId);
  }

  // Transform backend response to frontend-friendly format
  private transformVideoResponse(response: VideoDetailResponse, videoId: string): VideoDetail {
    return {
      id: videoId,
      url: response.video_url,
      source: response.source,
      title: response.title || 'Untitled Video',
      speaker: response.speaker_name || 'Unknown Speaker',
      duration: response.duration_seconds || 0,
      language: response.language_code || 'en',
      processedAt: response.processed_at ? new Date(response.processed_at) : undefined,
      verdict: response.verdict,
      
      // Summary stats
      totalStatements: response.total_statements,
      researchedStatements: response.researched_statements,
      completionRate: response.research_completion_rate,
      
      // Transform timestamps
      timestamps: response.timestamps.map(ts => ({
        startTime: ts.time_from_seconds,
        endTime: ts.time_to_seconds,
        statement: ts.statement,
        context: ts.context,
        category: ts.category,
        confidence: ts.confidence_score,
        factCheck: ts.research ? this.transformResearchData(ts.research) : undefined
      }))
    };
  }

  private transformResearchData(research: any): FactCheckData {
    return {
      id: research.id || '',
      verdict: research.verdict || '',
      status: research.status || 'UNVERIFIABLE',
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
      expertAnalysis: {
        nerd: research.experts?.nerd,
        devil: research.experts?.devil,
        critic: research.experts?.critic,
        psychic: research.experts?.psychic
      },
      processedAt: research.processed_at ? new Date(research.processed_at) : new Date()
    };
  }

  // Keep existing methods
  async getVideos(filters: VideoFilters = {}): Promise<Video[]> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    const endpoint = `/videos${queryString ? `?${queryString}` : '/'}`;
    
    return this.request<Video[]>(endpoint);
  }

  async searchVideos(
    searchText?: string,
    sourceFilter?: string,
    researchedFilter?: boolean,
    speakerFilter?: string,
    languageFilter?: string,
    categoriesFilter?: string,
    limitCount: number = 50,
    offsetCount: number = 0
  ): Promise<AdvancedSearchResult[]> {
    const params = new URLSearchParams();
    
    if (searchText) params.append('search_text', searchText);
    if (sourceFilter) params.append('source_filter', sourceFilter);
    if (researchedFilter !== undefined) params.append('researched_filter', String(researchedFilter));
    if (speakerFilter) params.append('speaker_filter', speakerFilter);
    if (languageFilter) params.append('language_filter', languageFilter);
    if (categoriesFilter) params.append('categories_filter', categoriesFilter);
    params.append('limit_count', String(limitCount));
    params.append('offset_count', String(offsetCount));

    return this.request<AdvancedSearchResult[]>(`/videos/search/advanced?${params.toString()}`);
  }

  async getVideoStats(): Promise<VideoStats> {
    return this.request<VideoStats>('/videos/stats/summary');
  }

  async getAvailableCategories(): Promise<CategoryInfo[]> {
    return this.request<CategoryInfo[]>('/videos/categories/available');
  }
}

export const videoAPI = new VideoAPI();