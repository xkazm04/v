import { Profile, ProfileStatsResponse } from "@/app/types/profile";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ProfileApiService {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
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
      let errorMessage: string;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  static async getProfileById(profileId: string): Promise<{ data?: Profile; error?: string }> {
    try {
      console.log(`Fetching profile: ${profileId}`);
      
      const result = await this.request<{ data?: Profile } | Profile>(`/profile/${profileId}`);
      
      // Handle both response formats: { data: Profile } or Profile directly
      const profile = 'data' in result ? result.data : result;
      
      return { data: profile };
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
      return {
        error: error.message || 'Failed to fetch profile',
      };
    }
  }

  static async searchProfiles(params: {
    search?: string;
    country?: string;
    party?: string;
    type?: string;
    include_counts?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ data?: Profile[]; error?: string }> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.search) searchParams.set('search', params.search);
      if (params.country) searchParams.set('country', params.country);
      if (params.party) searchParams.set('party', params.party);
      if (params.type) searchParams.set('type', params.type);
      if (params.include_counts) searchParams.set('include_counts', 'true');
      if (params.limit) searchParams.set('limit', params.limit.toString());
      if (params.offset) searchParams.set('offset', params.offset.toString());

      const endpoint = `/profile?${searchParams.toString()}`;
      console.log(`Searching profiles: ${endpoint}`);
      
      const result = await this.request<Profile[] | { data: Profile[] }>(endpoint);
      
      // Handle both response formats
      const profiles = Array.isArray(result) ? result : result.data;
      
      return { data: profiles };
    } catch (error: any) {
      console.error('Failed to search profiles:', error);
      return {
        error: error.message || 'Failed to search profiles',
      };
    }
  }

  static async getProfileStatements(
    profileId: string,
    params: {
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ data?: any; error?: string }> {
    try {
      const searchParams = new URLSearchParams();
      
      searchParams.set('profile_id', profileId);
      if (params.limit) searchParams.set('limit', params.limit.toString());
      if (params.offset) searchParams.set('offset', params.offset.toString());

      const endpoint = `/news?${searchParams.toString()}`;
      console.log(`Fetching profile statements: ${endpoint}`);
      
      const result = await this.request(endpoint);
      return { data: result };
    } catch (error: any) {
      console.error('Failed to fetch profile statements:', error);
      return {
        error: error.message || 'Failed to fetch profile statements',
      };
    }
  }

  // Updated stats method to use the new endpoint
  static async getProfileStats(profileId: string): Promise<{ data?: ProfileStatsResponse; error?: string }> {
    try {
      console.log(`Fetching profile stats for: ${profileId}`);
      
      const result = await this.request<ProfileStatsResponse | { data: ProfileStatsResponse }>(`/stats/profile/${profileId}`);
      
      // Handle both response formats
      const stats = 'data' in result ? result.data : result;
      
      return { data: stats };
    } catch (error: any) {
      console.error('Failed to fetch profile stats:', error);
      return {
        error: error.message || 'Failed to fetch profile stats',
      };
    }
  }

  // General stats summary (if still needed)
  static async getGeneralStats(): Promise<{ data?: any; error?: string }> {
    try {
      console.log('Fetching general profile stats');
      
      const result = await this.request('/profile/stats/summary');
      return { data: result };
    } catch (error: any) {
      console.error('Failed to fetch general stats:', error);
      return {
        error: error.message || 'Failed to fetch general stats',
      };
    }
  }
}