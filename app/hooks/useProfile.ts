import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ProfileApiService } from '@/app/api/profile/profile';
import { Profile } from '../types/profile';

interface UseProfileResult {
  profile: Profile | undefined;
  isLoading: boolean;
  error: string | null;
  isError: boolean;
  refetch: () => void;
}

export const useProfile = (profileId: string | undefined): UseProfileResult => {
  const query: UseQueryResult<{ data?: Profile; error?: string }> = useQuery({
    queryKey: ['profile', profileId],
    queryFn: async () => {
      if (!profileId) {
        throw new Error('Profile ID is required');
      }
      return ProfileApiService.getProfileById(profileId);
    },
    enabled: !!profileId, // Only run query if profileId exists
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      if (error?.message?.includes('404')) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
  });

  return {
    profile: query.data?.data,
    isLoading: query.isLoading,
    error: query.data?.error || (query.error?.message ?? null),
    isError: query.isError || !!query.data?.error,
    refetch: query.refetch,
  };
};

// Hook for profile statements
export const useProfileStatements = (
  profileId: string | undefined,
  params: { limit?: number; offset?: number } = {}
) => {
  return useQuery({
    queryKey: ['profile-statements', profileId, params],
    queryFn: async () => {
      if (!profileId) {
        throw new Error('Profile ID is required');
      }
      return ProfileApiService.getProfileStatements(profileId, params);
    },
    enabled: !!profileId,
    staleTime: 2 * 60 * 1000, // 2 minutes for statements
    gcTime: 5 * 60 * 1000, // 5 minutes in cache
  });
};

// Hook for searching profiles
export const useProfileSearch = (
  params: {
    search?: string;
    country?: string;
    party?: string;
    include_counts?: boolean;
    limit?: number;
    offset?: number;
  } = {},
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['profile-search', params],
    queryFn: () => ProfileApiService.searchProfiles(params),
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute for search results
    gcTime: 3 * 60 * 1000, // 3 minutes in cache
  });
};

// Hook for profile statistics
export const useProfileStats = () => {
  return useQuery({
    queryKey: ['profile-stats'],
    queryFn: () => ProfileApiService.getProfileStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes for stats
    gcTime: 10 * 60 * 1000, // 10 minutes in cache
  });
};