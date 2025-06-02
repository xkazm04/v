import { Profile } from "@/app/types/profile";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export class ProfileApiService {
  private static async fetchWithErrorHandling<T>(
    url: string,
    options?: RequestInit
  ): Promise<{ data?: T; error?: string }> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        
        return {
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Network error:', error);
      return {
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  static async getProfileById(profileId: string): Promise<{ data?: Profile; error?: string }> {
    const url = `${API_BASE_URL}/profiles/${profileId}`;
    
    console.log(`Fetching profile: ${url}`);
    
    return this.fetchWithErrorHandling<Profile>(url);
  }

  static async searchProfiles(params: {
    search?: string;
    country?: string;
    party?: string;
    include_counts?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ data?: Profile[]; error?: string }> {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.set('search', params.search);
    if (params.country) searchParams.set('country', params.country);
    if (params.party) searchParams.set('party', params.party);
    if (params.include_counts) searchParams.set('include_counts', 'true');
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.offset) searchParams.set('offset', params.offset.toString());

    const url = `${API_BASE_URL}/profiles?${searchParams.toString()}`;
    
    console.log(`Searching profiles: ${url}`);
    
    return this.fetchWithErrorHandling<Profile[]>(url);
  }

  static async getProfileStatements(
    profileId: string,
    params: {
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ data?: any; error?: string }> {
    const searchParams = new URLSearchParams();
    
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.offset) searchParams.set('offset', params.offset.toString());

    const url = `${API_BASE_URL}/profiles/${profileId}/statements?${searchParams.toString()}`;
    
    console.log(`Fetching profile statements: ${url}`);
    
    return this.fetchWithErrorHandling(url);
  }
}