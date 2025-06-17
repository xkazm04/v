import { Profile, ProfileStatsResponse } from "@/app/types/profile";
import { supabaseAdmin } from "../supabase";

export interface ProfileFilters {
  limit?: number;
  offset?: number;
  search?: string;
  country?: string;
  party?: string;
  type?: string;
  include_counts?: boolean;
}

class SupabaseProfileService {
  /**
   * Get profiles from Supabase profiles table (client-side with restricted access)
   */
  async getProfiles(filters: ProfileFilters = {}): Promise<Profile[]> {
    if (!supabaseAdmin) {
      console.warn('Supabase admin client is not initialized. Cannot fetch profiles.');
      return [];
    }
    try {
      // Test connection first
      const { data: testData, error: testError } = await supabaseAdmin
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
      let query = supabaseAdmin
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
        type: item.type || 'person',
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
   * Get single profile by ID
   */
  async getProfileById(id: string): Promise<Profile | null> {
    if (!supabaseAdmin) {
      console.warn('Supabase admin client is not initialized. Cannot fetch profile by ID.');
      return null;
    }
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
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
        type: data.type || 'person',
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
   * Get profile statistics (mock implementation for now)
   * TODO: Replace with actual stats table queries when available
   */
  async getProfileStats(profileId: string): Promise<ProfileStatsResponse | null> {
    try {
      // Verify profile exists
      const profile = await this.getProfileById(profileId);
      if (!profile) {
        return null;
      }

      // Mock stats data following the expected structure
      // TODO: Replace with actual research_results table queries
      const mockStats: ProfileStatsResponse = {
        profile_id: profileId,
        recent_statements: [
          {
            id: `stmt_${Math.random()}`,
            verdict: "This statement has been analyzed and found to be accurate based on current data.",
            status: "TRUE",
            correction: undefined,
            country: "US",
            category: "politics",
            expert_perspectives: [],
            created_at: new Date().toISOString()
          },
          {
            id: `stmt_${Math.random()}`,
            verdict: "This claim requires additional context and may be misleading without proper explanation.",
            status: "MISLEADING",
            correction: "The actual data shows a different trend when accounting for seasonal variations.",
            country: "US",
            category: "economy",
            expert_perspectives: [],
            created_at: new Date().toISOString()
          }
          // Add more mock statements as needed
        ],
        stats: {
          total_statements: 47,
          categories: [
            { category: "politics", count: 15 },
            { category: "economy", count: 12 },
            { category: "healthcare", count: 8 },
            { category: "environment", count: 7 },
            { category: "education", count: 5 }
          ],
          status_breakdown: {
            "TRUE": 28,
            "FALSE": 5,
            "MISLEADING": 8,
            "PARTIALLY_TRUE": 4,
            "UNVERIFIABLE": 2
          }
        }
      };

      return mockStats;
    } catch (error) {
      console.error('Get profile stats error:', error);
      return null;
    }
  }

  /**
   * Health check for Supabase connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .limit(1);
      return !error;
    } catch (error) {
      return false;
    }
  }
}

export const supabaseProfileService = new SupabaseProfileService();