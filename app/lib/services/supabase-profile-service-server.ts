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

class SupabaseProfileServiceServer {
  /**
   * Get profiles from Supabase profiles table (server-side with admin client)
   */
  async getProfiles(filters: ProfileFilters = {}): Promise<Profile[]> {
    try {
      // Check if admin client is available
      if (!supabaseAdmin) {
        console.warn('Supabase admin client not available (missing service role key)');
        return [];
      }

      // Test connection first
      const { data: testData, error: testError } = await supabaseAdmin
        .from('profiles')
        .select('id, name')
        .limit(1);

      if (testError) {
        throw new Error(`Supabase connection failed: ${testError.message}`);
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
   * Get profile statistics from research_results table
   */
  async getProfileStats(profileId: string): Promise<ProfileStatsResponse | null> {
    try {
      // Verify profile exists
      const profile = await this.getProfileById(profileId);
      if (!profile) {
        return null;
      }

      // Get recent statements from research_results table
      const { data: statementsData, error: statementsError } = await supabaseAdmin
        .from('research_results')
        .select(`
          id,
          verdict,
          status,
          correction,
          country,
          category,
          experts,
          expert_perspectives,
          created_at
        `)
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (statementsError) {
        console.warn(`Failed to fetch statements: ${statementsError.message}`);
      }

      // Get category and status breakdowns
      const { data: allStatementsData, error: allStatementsError } = await supabaseAdmin
        .from('research_results')
        .select('category, status')
        .eq('profile_id', profileId);

      if (allStatementsError) {
        console.warn(`Failed to fetch all statements: ${allStatementsError.message}`);
      }

      // Process the data
      const recent_statements = (statementsData || []).map(item => ({
        id: item.id,
        verdict: item.verdict || '',
        status: item.status || 'UNVERIFIABLE',
        correction: item.correction,
        country: item.country,
        category: item.category,
        experts: this.parseJsonField(item.experts),
        profile_id: profileId,
        expert_perspectives: this.parseJsonField(item.expert_perspectives) || [],
        created_at: item.created_at
      }));

      // Calculate category stats
      const categoryCount: Record<string, number> = {};
      const statusCount: Record<string, number> = {};

      (allStatementsData || []).forEach(item => {
        if (item.category) {
          categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
        }
        if (item.status) {
          statusCount[item.status] = (statusCount[item.status] || 0) + 1;
        }
      });

      const categories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      const stats: ProfileStatsResponse = {
        profile_id: profileId,
        recent_statements,
        stats: {
          total_statements: (allStatementsData || []).length,
          categories,
          status_breakdown: statusCount as any
        }
      };

      return stats;
    } catch (error) {
      console.error('Get profile stats error:', error);
      return null;
    }
  }

  /**
   * Parse JSON fields safely
   */
  private parseJsonField(field: any): any {
    if (!field) return undefined;
    if (typeof field === 'object') return field;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return undefined;
      }
    }
    return undefined;
  }
}

export const supabaseProfileServiceServer = new SupabaseProfileServiceServer();