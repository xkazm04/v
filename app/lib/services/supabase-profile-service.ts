import { supabase } from '@/app/lib/supabase';
import { Profile, ProfileStatsResponse } from '@/app/types/profile';

export interface ProfileFilters {
  limit?: number;
  offset?: number;
  search?: string;
  country?: string;
  party?: string;
  type?: string;
  include_counts?: boolean;
}

export interface ProfileSearchOptions {
  search?: string;
  country?: string;
  party?: string;
  type?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'score' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

class SupabaseProfileService {
  /**
   * Get profiles from Supabase profiles table (client-side with restricted access)
   */
  async getProfiles(filters: ProfileFilters = {}): Promise<Profile[]> {
    try {
      // Test connection first
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('id, name')
        .limit(1);

      if (testError) {
        console.warn(`Supabase profile connection failed: ${testError.message}`);
        return [];
      }

      if (!testData || testData.length === 0) {
        return [];
      }

      // Build main query
      let query = supabase
        .from('profiles')
        .select(`
          id,
          name,
          name_normalized,
          avatar_url,
          country,
          party,
          type,
          position,
          bg_url,
          score,
          created_at,
          updated_at
        `);

      // Apply filters
      if (filters.search && filters.search.trim() !== '') {
        const searchTerm = filters.search.trim();
        query = query.or(`name.ilike.%${searchTerm}%,name_normalized.ilike.%${searchTerm}%`);
      }

      if (filters.country && filters.country !== 'all' && filters.country.trim() !== '') {
        query = query.eq('country', filters.country);
      }

      if (filters.party && filters.party !== 'all' && filters.party.trim() !== '') {
        query = query.eq('party', filters.party);
      }

      if (filters.type && filters.type !== 'all' && filters.type.trim() !== '') {
        query = query.eq('type', filters.type);
      }

      // Sorting
      query = query.order('name', { ascending: true });

      // Pagination
      const limit = Math.min(filters.limit || 50, 100);
      const offset = filters.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) {
        throw new Error(`Supabase profile query failed: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Convert to Profile format
      const profiles = data.map((item: any): Profile => ({
        id: item.id,
        name: item.name || '',
        name_normalized: item.name_normalized || '',
        avatar_url: item.avatar_url,
        country: item.country,
        party: item.party,
        type: item.type,
        position: item.position,
        bg_url: item.bg_url,
        score: item.score || 0,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      return profiles;

    } catch (error) {
      console.error('Supabase profile service error:', error);
      return [];
    }
  }

  /**
   * Get all profiles with filtering and pagination
   */
  async searchProfiles(options: ProfileSearchOptions = {}): Promise<Profile[]> {
    try {
      const {
        search,
        country,
        party,
        type,
        limit = 20,
        offset = 0,
        sortBy = 'name',
        sortOrder = 'asc'
      } = options;

      console.log(`🔍 Searching profiles with options:`, options);

      let query = supabase
        .from('profiles')
        .select(`
          id,
          name,
          name_normalized,
          avatar_url,
          country,
          party,
          type,
          position,
          bg_url,
          score,
          created_at,
          updated_at
        `);

      // Apply filters
      if (type) {
        query = query.eq('type', type);
      }
      
      if (search) {
        query = query.or(`name.ilike.%${search}%,name_normalized.ilike.%${search}%`);
      }
      
      if (country) {
        query = query.eq('country', country);
      }
      
      if (party) {
        query = query.eq('party', party);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching profiles:', error);
        return [];
      }

      console.log(`✅ Found ${data?.length || 0} profiles`);
      return data || [];

    } catch (error) {
      console.error('💥 Profile search error:', error);
      return [];
    }
  }

  /**
   * Get single profile by ID
   */
  async getProfileById(id: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          name_normalized,
          avatar_url,
          country,
          party,
          type,
          position,
          bg_url,
          score,
          created_at,
          updated_at
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      const profile: Profile = {
        id: data.id,
        name: data.name || '',
        name_normalized: data.name_normalized || '',
        avatar_url: data.avatar_url,
        country: data.country,
        party: data.party,
        type: data.type,
        position: data.position,
        bg_url: data.bg_url,
        score: data.score || 0,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      return profile;
    } catch (error) {
      console.error('Get profile by ID error:', error);
      return null;
    }
  }

  /**
   * Search profiles by name (for autocomplete)
   */
  async searchProfilesByName(searchTerm: string, limit: number = 10): Promise<Profile[]> {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        return [];
      }

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          name_normalized,
          avatar_url,
          country,
          party,
          type,
          position,
          score
        `)
        .or(`name.ilike.%${searchTerm}%,name_normalized.ilike.%${searchTerm}%`)
        .order('name', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('❌ Error searching profiles by name:', error);
        return [];
      }

      return (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        name_normalized: item.name_normalized,
        avatar_url: item.avatar_url,
        country: item.country,
        party: item.party,
        type: item.type,
        position: item.position,
        score: item.score,
        created_at: item.created_at ?? undefined,
        updated_at: item.updated_at ?? undefined
      }));

    } catch (error) {
      console.error('💥 Profile name search error:', error);
      return [];
    }
  }

  /**
   * Get profile statistics using server-side API route
   * Uses the /api/profile/[id]/stats endpoint for full data access
   */
  async getProfileStats(profileId: string): Promise<ProfileStatsResponse | null> {
    try {
      console.log(`🔄 Fetching profile stats for: ${profileId}`);
      
      // Use server-side API route for stats
      const response = await fetch(`/api/profile/${profileId}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache headers for better performance
        cache: 'default',
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Profile stats not found for: ${profileId}`);
          return null;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.data) {
        console.warn(`No stats data returned for profile: ${profileId}`);
        return null;
      }

      console.log(`✅ Successfully fetched profile stats for: ${profileId}`);
      return result.data;
      
    } catch (error) {
      console.error(`❌ Failed to fetch profile stats for ${profileId}:`, error);
      return null;
    }
  }

  /**
   * Health check for Supabase connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      return !error;
    } catch (error) {
      console.error('💥 Profile service health check failed:', error);
      return false;
    }
  }
}

export const supabaseProfileService = new SupabaseProfileService();