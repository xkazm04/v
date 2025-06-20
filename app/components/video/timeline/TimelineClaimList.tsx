'use client';

import { motion } from 'framer-motion';
import { Activity, Clock } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { VideoWithTimestamps, VideoTimestamp } from '@/app/types/video_api';
import TimelineClaimItem from './TimelineClaimItem';
import { Divider } from '@/app/components/ui/divider';
import { useViewport } from '@/app/hooks/useViewport';
import TimelineClaimListStats from './TimelineClaimListStats';
import { calculateClaimStats, convertVideoTimestampToClaim, UnifiedClaim } from '@/app/helpers/timelineStatsHelpers';

interface UnifiedTimelineClaimListProps {
  video?: VideoWithTimestamps; // Desktop data
  timelineSegments?: any[]; // Mobile timeline segments
  activeClaims?: any[]; // Mobile active claims
  
  // Common props
  currentTime?: number;
  currentTimestamp?: VideoTimestamp; 
  onSeekToTimestamp?: (timestamp: number) => void;
  timelineColors?: {
    border: string;
    background?: string;
    foreground?: string;
  };
  
  className?: string;
  showHeader?: boolean;
  showStats?: boolean;
  maxHeight?: string;
  isCompact?: boolean;
}


export function TimelineClaimList({
  video,
  timelineSegments,
  activeClaims,
  currentTime = 0,
  currentTimestamp,
  onSeekToTimestamp,
  timelineColors,
  className,
  showHeader = true,
  showStats = true,
  maxHeight = "400px",
  isCompact = false
}: UnifiedTimelineClaimListProps) {
  const { colors, isDark, vintage, isVintage } = useLayoutTheme();
    const {isDesktop} = useViewport();
  const allClaims: UnifiedClaim[] = (() => {
    if (video?.timestamps) {
      return video.timestamps.map((timestamp, index) => 
        convertVideoTimestampToClaim(timestamp, index)
      );
    } else if (timelineSegments) {
      // Mobile data - already in compatible format
      return timelineSegments.map(segment => ({
        ...segment,
        claim: segment.claim || segment.statement, 
        type: segment.type || 'neutral',
        confidence: segment.confidence || 85,
      }));
    }
    return [];
  })();

  const activeClaimsData: UnifiedClaim[] = (() => {
    if (activeClaims && activeClaims.length > 0) {
      return activeClaims.map(claim => ({
        ...claim,
        isActive: true,
        claim: claim.claim || claim.statement,
      }));
    } else if (currentTimestamp && video) {
      // Desktop current timestamp
      return allClaims.filter(claim => 
        claim.timestamp <= currentTime && 
        (claim.endTime || claim.timestamp + (claim.duration || 30)) >= currentTime
      ).map(claim => ({ ...claim, isActive: true }));
    } else if (currentTime > 0) {
      // Calculate active claims from current time
      return allClaims.filter(claim => 
        claim.timestamp <= currentTime && 
        (claim.endTime || claim.timestamp + (claim.duration || 30)) >= currentTime
      ).map(claim => ({ ...claim, isActive: true }));
    }
    return [];
  })();

  const stats = calculateClaimStats(allClaims);

  // Enhanced colors with fallback
  const colors_enhanced = {
    border: timelineColors?.border || (isDark ? 'rgba(71, 85, 105, 0.2)' : 'rgba(226, 232, 240, 0.3)'),
    background: timelineColors?.background || (isVintage ? vintage.paper : isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'),
    foreground: timelineColors?.foreground || (isVintage ? vintage.ink : colors.foreground),
  };

  // Handle seek function
  const handleSeek = (timestamp: number) => {
    if (onSeekToTimestamp) {
      onSeekToTimestamp(timestamp);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with stats */}
      {showHeader && (
        <TimelineClaimListStats
            showStats={showStats}
            colors_enhanced={colors_enhanced}
            stats={stats}
        />
      )}

      {/* Active Claims */}
      {activeClaimsData.length > 0 && (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4
            className="text-sm font-bold flex items-center gap-2"
            style={{
              color: isVintage ? vintage.ink : colors.foreground,
              fontFamily: isVintage ? '"Times New Roman", serif' : 'inherit'
            }}
          >
            <Activity size={16} style={{ color: colors.primary }} />
            Active Claims ({activeClaimsData.length})
          </h4>
          
          <div className="space-y-2">
            {activeClaimsData.map((claim, index) => (
              <TimelineClaimItem
                key={`active-${claim.id}`}
                claim={claim}
                timelineColors={colors_enhanced}
                index={index}
                isActive={true}
                onSeek={handleSeek}
              />
            ))}
          </div>
        </motion.div>
      )}

      {!isCompact && <Divider />}

      {/* All Claims */}
      {isDesktop && showHeader && <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: isCompact ? 0.2 : 0.4 }}
      >
        <h4
          className="text-sm font-bold flex items-center gap-2"
          style={{
            color: isVintage ? vintage.ink : colors.foreground,
            fontFamily: isVintage ? '"Times New Roman", serif' : 'inherit'
          }}
        >
          <Clock size={16} style={{ color: colors.primary }} />
          All Claims ({allClaims.length})
        </h4>
        
        <div 
          className="space-y-2 overflow-y-auto custom-scrollbar"
          style={{ maxHeight }}
        >
          {allClaims &&
            allClaims.map((claim, index) => {
              const isCurrentlyActive = activeClaimsData.some(active => active.id === claim.id);
              return (
                <TimelineClaimItem
                  key={claim.id}
                  claim={claim}
                  timelineColors={colors_enhanced}
                  index={index}
                  isActive={isCurrentlyActive}
                  onSeek={handleSeek}
                />
              );
            })
          }
        </div>
      </motion.div>}
    </div>
  );
}