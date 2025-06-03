'use client';


import { Card, CardContent  } from '@/components/ui/card';
import { useProfile } from '@/app/hooks/useProfile';

interface ProfileDashboardProps {
  profileId: string;
}

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ profileId }) => {
  const { profile, isLoading, error, isError } = useProfile(profileId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-red-600 text-lg font-semibold">
                {error || 'Profile not found'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Profile Header */}

    </div>
  );
};

export default ProfileDashboard;