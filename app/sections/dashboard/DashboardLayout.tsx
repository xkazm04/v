'use client';

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { useCombinedProfile } from '@/app/hooks/useCombinedProfile';
import { AlertCircle, Loader2 } from 'lucide-react';
import DashStatementsAnalyticsSection from '@/app/sections/dashboard/DashStatements/DashStatementAnalyticsSection';
import ProfileItemGrid from '@/app/components/profile/ProfileItemGrid';
import DashBreakdown from './DashBreakdown';

interface DashboardLayoutProps {
  profileId?: string;
}

const StatsBackground = memo(() => (
  <div 
    className="fixed inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: `url('/background/bg_stats_8.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}
  />
));

StatsBackground.displayName = 'StatsBackground';


const DashboardLayout = ({ profileId }: DashboardLayoutProps) => {
  const [timeRange, setTimeRange] = useState('6months');

  const {
    profile,
    isLoading: profileLoading,
    error: profileError,
    isError,
    dataSource
  } = useCombinedProfile(profileId);

  // Use real profile data when available, fallback to mock data
  const shouldUseRealData = profileId && profile && !isError;

  // Loading state for real profile
  if (profileId && profileLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <div className="text-lg font-semibold text-foreground">Loading Profile...</div>
              <div className="text-sm text-muted-foreground">
                Fetching profile data for {profileId}
              </div>
              <div className="text-xs text-muted-foreground">
                Trying Supabase → FastAPI fallback
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state for real profile
  if (profileId && isError) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
              <div className="text-lg font-semibold text-foreground">Profile Not Found</div>
              <div className="text-sm text-muted-foreground max-w-md mx-auto">
                {profileError || `Unable to load profile with ID: ${profileId} from any data source`}
              </div>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <StatsBackground />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Key Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 col-span-1"
          >
            {shouldUseRealData ? (
              <>
                <ProfileItemGrid profile={profile} index={0} />
                <DashBreakdown
                  profileId={profileId}
                />
              </>
            ) : (
              <>
              </>
            )}
          </motion.div>
          <DashStatementsAnalyticsSection
            profileId={profileId}
            timeRange={timeRange}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;