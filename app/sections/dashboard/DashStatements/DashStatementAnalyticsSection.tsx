'use client';

import { motion } from 'framer-motion';
import { useCombinedProfileStats } from '@/app/hooks/useCombinedProfile';
import DashActivity from '@/app/sections/dashboard/DashActivity';

interface DashStatementsAnalyticsSectionProps {
  profileId?: string;
  timeRange?: string;
}

const DashStatementsAnalyticsSection = ({ 
  profileId, 
  timeRange = '6months' 
}: DashStatementsAnalyticsSectionProps) => {
  
  const { 
    data: statsResult, 
    isLoading: statsLoading, 
    error: statsError,
    isError: statsIsError 
  } = useCombinedProfileStats(profileId);

  const profileStatsData = statsResult?.stats; 
  const shouldShowRealDataComponents = profileId && profileStatsData && !statsIsError;


  return (
    <>
      {/* Center Column - Truth Trend & Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6 flex flex-col col-span-2"
      >
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

        {/* Loading State */}
        {profileId && statsLoading && (
          <div className="h-96 bg-muted/30 rounded-2xl animate-pulse" />
        )}

      </motion.div>
    </>
  );
};

export default DashStatementsAnalyticsSection;