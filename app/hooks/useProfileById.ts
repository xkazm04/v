import { useQuery } from '@tanstack/react-query';
import { supabaseProfileService } from '@/app/lib/services/supabase-profile-service';
import { Profile } from '@/app/types/profile';

export const useProfileById = (profileId?: string) => {
  return useQuery<Profile | null>({
    queryKey: ['profile-by-id', profileId],
    queryFn: async () => {
      if (!profileId) return null;
      return await supabaseProfileService.getProfileById(profileId);
    },
    enabled: !!profileId,
    staleTime: 5 * 60 * 1000,
  });
};