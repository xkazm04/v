'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCombinedProfile } from '@/app/hooks/useCombinedProfile';
import { AlertCircle, Loader2 } from 'lucide-react';
import DashSpeakerProfile from '@/app/sections/dashboard/DashSpeakerProfile';
import DashComparison from '@/app/sections/dashboard/DashComparison';
import DashStatementsAnalyticsSection from '@/app/sections/dashboard/DashStatements/DashStatementAnalyticsSection';
import { MOCK_SPEAKERS } from '@/app/constants/speakers';

interface DashboardLayoutProps {
  profileId?: string;
}

const DashboardLayout = ({ profileId }: DashboardLayoutProps) => {
  const [selectedSpeaker, setSelectedSpeaker] = useState(MOCK_SPEAKERS[0]);
  const [timeRange, setTimeRange] = useState('6months');
  
  // Fetch real profile data if profileId is provided using combined hook
  const { 
    profile, 
    isLoading: profileLoading, 
    error: profileError, 
    isError,
    dataSource 
  } = useCombinedProfile(profileId);

  // Use real profile data when available, fallback to mock data
  const shouldUseRealData = profileId && profile && !isError;

  useEffect(() => {
    // Log data source for debugging
    if (profileId && dataSource) {
      console.log(`📊 Dashboard using ${dataSource} as data source for profile: ${profileId}`);
    }

    // If we have a profileId but no real data yet, and it's not loading, show an error
    if (profileId && !profile && !profileLoading && isError) {
      console.warn('Failed to load profile from all sources:', profileError);
    }
  }, [profileId, profile, profileLoading, isError, profileError, dataSource]);

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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Data Source Indicator (only in development) */}
        {process.env.NODE_ENV === 'development' && profileId && dataSource && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="text-sm text-blue-700 dark:text-blue-300">
              📊 Data Source: <span className="font-semibold capitalize">{dataSource}</span>
              {dataSource === 'api' && ' (Fallback)'}
            </div>
          </div>
        )}

        {/* Speaker Selection - Only show for mock data */}
        {!shouldUseRealData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6 shadow-sm"
          >
            <div className="flex flex-wrap gap-3">
              {MOCK_SPEAKERS.map((speaker) => (
                <button
                  key={speaker.id}
                  onClick={() => setSelectedSpeaker(speaker)}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${selectedSpeaker.id === speaker.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }
                  `}
                >
                  {speaker.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Key Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {shouldUseRealData ? (
              <>
                <DashSpeakerProfile profile={profile} />
                {/* Additional real data components can be added here later */}
              </>
            ) : (
              <>
                <DashComparison currentSpeaker={selectedSpeaker} />
              </>
            )}
          </motion.div>

          {/* Center & Right Columns - Analytics Section */}
          <DashStatementsAnalyticsSection 
            profileId={profileId}
            speaker={shouldUseRealData ? undefined : selectedSpeaker}
            timeRange={timeRange}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;