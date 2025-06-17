import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Profile, ProfileStatsResponse } from '../types/profile';
import { supabaseProfileService } from '@/app/lib/services/supabase-profile-service';
import { ProfileApiService } from '@/app/api/profile/profile';

interface UseCombinedProfileResult {
  profile: Profile | undefined;
  isLoading: boolean;
  error: string | null;
  isError: boolean;
  refetch: () => void;
  dataSource: 'supabase' | 'api' | null;
}

export const useCombinedProfile = (profileId: string | undefined): UseCombinedProfileResult => {
  const query: UseQueryResult<{ profile?: Profile; dataSource: 'supabase' | 'api' }> = useQuery({
    queryKey: ['combined-profile', profileId],
    queryFn: async () => {
      if (!profileId) {
        throw new Error('Profile ID is required');
      }

      // Try Supabase first
      try {
        console.log(`🔄 Attempting to fetch profile from Supabase: ${profileId}`);
        const supabaseProfile = await supabaseProfileService.getProfileById(profileId);
        
        if (supabaseProfile) {
          console.log(`✅ Successfully fetched profile from Supabase: ${profileId}`);
          return { profile: supabaseProfile, dataSource: 'supabase' as const };
        }
      } catch (supabaseError) {
        console.warn(`⚠️ Supabase profile fetch failed for ${profileId}:`, supabaseError);
      }

      // Fallback to FastAPI
      try {
        console.log(`🔄 Falling back to FastAPI for profile: ${profileId}`);
        const apiResult = await ProfileApiService.getProfileById(profileId);
        
        if (apiResult.error) {
          throw new Error(apiResult.error);
        }
        
        if (apiResult.data) {
          console.log(`✅ Successfully fetched profile from FastAPI: ${profileId}`);
          return { profile: apiResult.data, dataSource: 'api' as const };
        }
      } catch (apiError) {
        console.error(`❌ FastAPI profile fetch failed for ${profileId}:`, apiError);
        throw apiError;
      }

      throw new Error('Profile not found in any data source');
    },
    enabled: !!profileId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      if (error?.message?.includes('404') || error?.message?.includes('not found')) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
  });

  return {
    profile: query.data?.profile,
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    isError: query.isError,
    refetch: query.refetch,
    dataSource: query.data?.dataSource || null,
  };
};

// Combined Profile Stats Hook
export const useCombinedProfileStats = (profileId: string | undefined) => {
  return useQuery({
    queryKey: ['combined-profile-stats', profileId],
    queryFn: async (): Promise<{ stats?: ProfileStatsResponse; dataSource: 'supabase' | 'api' }> => {
      if (!profileId) {
        throw new Error('Profile ID is required for stats');
      }

      // Try Supabase first
      try {
        console.log(`🔄 Attempting to fetch profile stats from Supabase: ${profileId}`);
        const supabaseStats = await supabaseProfileService.getProfileStats(profileId);
        
        if (supabaseStats) {
          console.log(`✅ Successfully fetched profile stats from Supabase: ${profileId}`);
          return { stats: supabaseStats, dataSource: 'supabase' as const };
        }
      } catch (supabaseError) {
        console.warn(`⚠️ Supabase profile stats fetch failed for ${profileId}:`, supabaseError);
      }

      // Fallback to FastAPI
      try {
        console.log(`🔄 Falling back to FastAPI for profile stats: ${profileId}`);
        const apiResult = await ProfileApiService.getProfileStats(profileId);
        
        if (apiResult.error) {
          throw new Error(apiResult.error);
        }
        
        if (apiResult.data) {
          console.log(`✅ Successfully fetched profile stats from FastAPI: ${profileId}`);
          return { stats: apiResult.data, dataSource: 'api' as const };
        }
      } catch (apiError) {
        console.error(`❌ FastAPI profile stats fetch failed for ${profileId}:`, apiError);
        throw apiError;
      }

      throw new Error('Profile stats not found in any data source');
    },
    enabled: !!profileId,
    staleTime: 3 * 60 * 1000, // 3 minutes for stats
    gcTime: 8 * 60 * 1000, // 8 minutes in cache
    retry: 2,
  });
};

// Combined Profile Search Hook
export const useCombinedProfileSearch = (
  params: {
    search?: string;
    country?: string;
    party?: string;
    type?: string;
    limit?: number;
    offset?: number;
  } = {},
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['combined-profile-search', params],
    queryFn: async (): Promise<{ profiles?: Profile[]; dataSource: 'supabase' | 'api' }> => {
      // Try Supabase first
      try {
        console.log(`🔄 Attempting to search profiles from Supabase:`, params);
        const supabaseProfiles = await supabaseProfileService.getProfiles(params);
        
        if (supabaseProfiles && supabaseProfiles.length > 0) {
          console.log(`✅ Successfully searched profiles from Supabase: ${supabaseProfiles.length} results`);
          return { profiles: supabaseProfiles, dataSource: 'supabase' as const };
        }
      } catch (supabaseError) {
        console.warn(`⚠️ Supabase profile search failed:`, supabaseError);
      }

      // Fallback to FastAPI
      try {
        console.log(`🔄 Falling back to FastAPI for profile search:`, params);
        const apiResult = await ProfileApiService.searchProfiles(params);
        
        if (apiResult.error) {
          throw new Error(apiResult.error);
        }
        
        if (apiResult.data) {
          console.log(`✅ Successfully searched profiles from FastAPI: ${apiResult.data.length} results`);
          return { profiles: apiResult.data, dataSource: 'api' as const };
        }
      } catch (apiError) {
        console.error(`❌ FastAPI profile search failed:`, apiError);
        throw apiError;
      }

      // Return empty results instead of throwing error for search
      console.log(`📭 No profiles found in any data source`);
      return { profiles: [], dataSource: 'supabase' as const };
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000, // 5 minutes in cache
    retry: 1,
  });
};