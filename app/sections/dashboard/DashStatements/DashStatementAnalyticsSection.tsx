'use client';

import { motion } from 'framer-motion';
import { useCombinedProfileStats } from '@/app/hooks/useCombinedProfile';
import DashTruthTrend from '@/app/sections/dashboard/DashTruthTrend';
import DashBreakdown from '@/app/sections/dashboard/DashBreakdown';
import DashActivity from '@/app/sections/dashboard/DashActivity';
import { Speaker } from '@/app/constants/speakers';

interface DashStatementsAnalyticsSectionProps {
  profileId?: string;
  speaker?: Speaker; // For mock data fallback
  timeRange?: string;
}

const DashStatementsAnalyticsSection = ({ 
  profileId, 
  speaker, 
  timeRange = '6months' 
}: DashStatementsAnalyticsSectionProps) => {
  
  // Fetch profile stats when profileId is provided
  const { 
    data: statsResult, 
    isLoading: statsLoading, 
    error: statsError,
    isError: statsIsError 
  } = useCombinedProfileStats(profileId);

  const profileStatsData = statsResult?.stats; 
  const statsData = profileStatsData?.stats; 
  const statsDataSource = statsResult?.dataSource;

  const shouldShowRealDataComponents = profileId && profileStatsData && !statsIsError;
  const shouldShowMockDataComponents = !profileId && speaker;


  return (
    <>
      {/* Center Column - Truth Trend & Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        {/* Real Data Components */}
        {shouldShowRealDataComponents && statsData && (
          <>
            <DashTruthTrend 
              profileId={profileId!}
              stats={statsData}
              timeRange={timeRange} 
            />
            
            <DashBreakdown 
              profileId={profileId!}
              stats={statsData}
            />
          </>
        )}

        {/* Mock Data Components */}
        {shouldShowMockDataComponents && (
          <>
            <DashTruthTrend 
              speaker={speaker}
              timeRange={timeRange} 
            />
            
            <DashBreakdown 
              speaker={speaker} 
            />
          </>
        )}

        {/* Loading State */}
        {profileId && statsLoading && (
          <div className="space-y-6">
            <div className="h-80 bg-muted/30 rounded-2xl animate-pulse" />
            <div className="h-64 bg-muted/30 rounded-2xl animate-pulse" />
          </div>
        )}
      </motion.div>

      {/* Right Column - Activity */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        {/* Real Data Activity - Fixed data passing */}
        {shouldShowRealDataComponents && profileStatsData && (
          <DashActivity 
            statsData={profileStatsData}
            limit={8} 
          />
        )}

        {/* Mock Data Activity - Keep existing fallback for now */}
        {shouldShowMockDataComponents && (
          <div className="rounded-xl border p-4 bg-muted/20">
            <div className="text-sm text-muted-foreground text-center">
              Mock activity view for {speaker?.name}
              <br />
              <span className="text-xs">Real data available when profile ID is provided</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {profileId && statsLoading && (
          <div className="h-96 bg-muted/30 rounded-2xl animate-pulse" />
        )}

      </motion.div>
    </>
  );
};

export default DashStatementsAnalyticsSection;