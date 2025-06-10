'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '@/app/hooks/useProfile';
import { AlertCircle, Loader2 } from 'lucide-react';

import DashSpeakerProfile from '@/app/sections/dashboard/DashSpeakerProfile';
import DashTruthTrend from '@/app/sections/dashboard/DashTruthTrend';
import DashBreakdown from '@/app/sections/dashboard/DashBreakdown';
import DashScore from '@/app/sections/dashboard/DashScore';
import DashActivity from '@/app/sections/dashboard/DashActivity';
import DashComparison from '@/app/sections/dashboard/DashComparison';
import { MOCK_SPEAKERS } from '@/app/constants/speakers';

interface DashboardLayoutProps {
  profileId?: string;
}

const DashboardLayout = ({ profileId }: DashboardLayoutProps) => {
  const [selectedSpeaker, setSelectedSpeaker] = useState(MOCK_SPEAKERS[0]);
  const [timeRange, setTimeRange] = useState('6months');
  
  // Fetch real profile data if profileId is provided
  const { profile, isLoading: profileLoading, error: profileError, isError } = useProfile(profileId);

  // Use real profile data when available, fallback to mock data
  const shouldUseRealData = profileId && profile && !isError;

  useEffect(() => {
    // If we have a profileId but no real data yet, and it's not loading, show an error
    if (profileId && !profile && !profileLoading && isError) {
      console.warn('Failed to load profile:', profileError);
    }
  }, [profileId, profile, profileLoading, isError, profileError]);

  // Loading state for real profile
  if (profileId && profileLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <div className="text-lg font-semibold text-foreground">Loading Profile...</div>
              <div className="text-sm text-muted-foreground">Fetching profile data for {profileId}</div>
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
                {profileError || `Unable to load profile with ID: ${profileId}`}
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
                {/* Real data components will be added later */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Reliability Score</h3>
                  <div className="text-center text-muted-foreground">
                    <div className="text-sm">Coming soon with more data</div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Comparison</h3>
                  <div className="text-center text-muted-foreground">
                    <div className="text-sm">Coming soon with more profiles</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <DashScore speaker={selectedSpeaker} />
                <DashComparison currentSpeaker={selectedSpeaker} />
              </>
            )}
          </motion.div>

          {/* Center Column - Main Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {shouldUseRealData ? (
              <>
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Truth Trend</h3>
                  <div className="text-center text-muted-foreground py-8">
                    <div className="text-sm">Statement analysis coming soon</div>
                    <div className="text-xs mt-2">
                      Profile has {profile.total_statements || 0} statements
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Topic Breakdown</h3>
                  <div className="text-center text-muted-foreground py-8">
                    <div className="text-sm">Topic analysis coming soon</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <DashTruthTrend speaker={selectedSpeaker} timeRange={timeRange} />
                <DashBreakdown speaker={selectedSpeaker} />
              </>
            )}
          </motion.div>

          {/* Right Column - Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {shouldUseRealData ? (
              <DashActivity profileId={profileId!} limit={10} />
            ) : (
              <></>
            )}
          </motion.div>
        </div>

        {/* Time Range Controls - Only for mock data */}
        {!shouldUseRealData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <div className="bg-card border border-border rounded-xl p-2 shadow-sm">
              {['1month', '3months', '6months', '1year', 'all'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize
                    ${timeRange === range
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }
                  `}
                >
                  {range === 'all' ? 'All Time' : range.replace(/(\d+)/, '$1 ')}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Debug Info - Development only */}
        {process.env.NODE_ENV === 'development' && shouldUseRealData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-card border border-border rounded-xl p-4 shadow-sm"
          >
            <h4 className="text-sm font-semibold text-foreground mb-2">Debug Info</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <div><strong>Profile ID:</strong> {profile.id}</div>
              <div><strong>Name:</strong> {profile.name}</div>
              <div><strong>Statements:</strong> {profile.total_statements || 0}</div>
              <div><strong>Country:</strong> {profile.country || 'Not set'}</div>
              <div><strong>Party:</strong> {profile.party || 'Not set'}</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;