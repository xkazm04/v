'use client';

import { motion } from 'framer-motion';
import { useCombinedProfileStats } from '@/app/hooks/useCombinedProfile';
import DashTruthTrend from '@/app/sections/dashboard/DashTruthTrend';
import DashActivity from '@/app/sections/dashboard/DashActivity';

interface DashStatementsAnalyticsSectionProps {
  profileId?: string;
  timeRange?: string;
}

const DashStatementsAnalyticsSection = ({ 
  profileId, 
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
  const shouldShowRealDataComponents = profileId && profileStatsData && !statsIsError;
  const shouldShowMockDataComponents = !profileId ;


  return (
    <>
      {/* Center Column - Truth Trend & Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6 flex flex-col col-span-2"
      >
        {/* Real Data Components */}
        {shouldShowRealDataComponents && statsData && (
          <>
            <DashTruthTrend 
              profileId={profileId!}
              stats={statsData}
              timeRange={timeRange} 
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
            

          </>
        )}

        {/* Loading State */}
        {profileId && statsLoading && (
          <div className="space-y-6">
            <div className="h-80 bg-muted/30 rounded-2xl animate-pulse" />
            <div className="h-64 bg-muted/30 rounded-2xl animate-pulse" />
          </div>
        )}

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