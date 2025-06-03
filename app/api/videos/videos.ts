import { Video, VideoWithTimestamps, VideoFilters, VideoStats, CategoryInfo, AdvancedSearchResult } from '@/app/types/video_api';

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
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

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

  async getVideoWithTimestamps(videoId: string): Promise<VideoWithTimestamps> {
    return this.request<VideoWithTimestamps>(`/videos/${videoId}`);
  }

  async searchVideos(
    searchText?: string,
    sourceFilter?: string,
    researchedFilter?: boolean,
    speakerFilter?: string,
    languageFilter?: string,
    categoriesFilter?: string, // New parameter for categories
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