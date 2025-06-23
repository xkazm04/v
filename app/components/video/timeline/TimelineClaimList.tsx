'use client';

import { motion } from 'framer-motion';
import { Activity, Clock } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { VideoWithTimestamps, VideoTimestamp } from '@/app/types/video_api';
import TimelineClaimItem from './TimelineClaimItem';
import { Divider } from '@/app/components/ui/divider';
import { useViewport } from '@/app/hooks/useViewport';
import TimelineClaimListStats from './TimelineClaimListStats';
import { useVideoTimestamps } from '@/app/hooks/useVideoDetail';

interface TimelineClaimListProps {
  video?: VideoWithTimestamps;
  timelineSegments?: any[];
  activeClaims?: any[];
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
}: TimelineClaimListProps) {
  const { colors, isDark, vintage, isVintage } = useLayoutTheme();
  const { isDesktop } = useViewport();

  // ✅ FIX: Fetch timestamps if not provided via video prop
  const { 
    data: fetchedTimestamps, 
    isLoading: timestampsLoading, 
    error: timestampsError 
  } = useVideoTimestamps(video?.video.id || '', {
    enabled: !!video?.video.id && (!video.timestamps || video.timestamps.length === 0)
  });

  // ✅ UNIFIED: Determine which timestamps to use
  const timestamps = (() => {
    // Use video timestamps if available
    if (video?.timestamps && video.timestamps.length > 0) {
      console.log('Using video.timestamps:', video.timestamps.length);
      return video.timestamps;
    }
    
    // Use fetched timestamps
    if (fetchedTimestamps && fetchedTimestamps.length > 0) {
      console.log('Using fetchedTimestamps:', fetchedTimestamps.length);
      return fetchedTimestamps;
    }
    
    // Fallback to empty array
    console.log('No timestamps available');
    return [];
  })();

  // Find active timestamps at current time
  const activeTimestamps = timestamps.filter(timestamp => {
    return currentTime >= timestamp.startTime && currentTime <= timestamp.endTime;
  });

  // Calculate statistics
  const stats = (() => {
    const total = timestamps.length;
    const researched = timestamps.filter(ts => ts.factCheck).length;
    const truthful = timestamps.filter(ts => 
      ts.factCheck?.status === 'TRUE'
    ).length;
    const lies = timestamps.filter(ts => 
      ts.factCheck?.status === 'FALSE'
    ).length;
    const neutral = total - truthful - lies;
    const avgConfidence = total > 0 
      ? Math.round(timestamps.reduce((sum, ts) => 
          sum + (ts.confidence || 0), 0
        ) / total)
      : 0;
    
    return { 
      total, 
      researched, 
      truthCount: truthful, 
      lieCount: lies, 
      neutralCount: neutral, 
      avgConfidence,
      completionRate: total > 0 ? Math.round((researched / total) * 100) : 0
    };
  })();

  // Enhanced colors with fallback
  const colors_enhanced = {
    border: timelineColors?.border || (isDark ? 'rgba(71, 85, 105, 0.2)' : 'rgba(226, 232, 240, 0.3)'),
    background: timelineColors?.background || (isVintage ? vintage.paper : isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'),
    foreground: timelineColors?.foreground || (isVintage ? vintage.ink : colors.foreground),
  };

  const handleSeek = (timestamp: number) => {
    console.log('TimelineClaimList: Seeking to', timestamp);
    if (onSeekToTimestamp && typeof timestamp === 'number' && !isNaN(timestamp)) {
      onSeekToTimestamp(timestamp);
    }
  };

  // ✅ LOADING STATE
  if (timestampsLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Loading timeline data...</p>
      </div>
    );
  }

  // ✅ ERROR STATE
  if (timestampsError) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: colors.primary }} />
        <h3 className="text-lg font-medium mb-2" style={{ color: colors.foreground }}>
          Error Loading Timeline
        </h3>
        <p className="text-sm" style={{ color: colors.mutedForeground }}>
          {timestampsError instanceof Error ? timestampsError.message : 'Failed to load timeline data'}
        </p>
      </div>
    );
  }
  // ✅ CONVERT timestamps to claim format for TimelineClaimItem
  const convertTimestampToClaim = (timestamp: VideoTimestamp, index: number) => {
    const getTypeFromStatus = (status?: string): 'truth' | 'lie' | 'neutral' => {
      switch (status) {
        case 'TRUE': return 'truth';
        case 'FALSE': return 'lie';
        case 'PARTIALLY_TRUE':
        case 'MISLEADING':
        case 'UNVERIFIABLE':
        default: return 'neutral';
      }
    };

    return {
      id: `timestamp-${timestamp.startTime}-${index}`,
      claim: timestamp.statement,
      type: getTypeFromStatus(timestamp.factCheck?.status),
      confidence: timestamp.confidence || 75,
      timestamp: timestamp.startTime,
      endTime: timestamp.endTime,
      category: timestamp.category,
      factCheck: timestamp.factCheck
    };
  };

  const allClaims = timestamps.map((timestamp, index) => 
    convertTimestampToClaim(timestamp, index)
  );

  const activeClaimsData = activeTimestamps.map((timestamp, index) => 
    ({ ...convertTimestampToClaim(timestamp, index), isActive: true })
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with stats */}
      {showHeader && showStats && (
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
          
          {!isCompact && <Divider />}
        </motion.div>
      )}

      {/* All Claims */}
      {!isCompact && (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {showHeader && (
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
          )}
          
          <div 
            className="space-y-2 overflow-y-auto custom-scrollbar"
            style={{ maxHeight }}
          >
            {allClaims.map((claim, index) => {
              const isCurrentlyActive = activeClaimsData.some(active => 
                active.timestamp === claim.timestamp
              );
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
            })}
          </div>
        </motion.div>
      )}

      {/* Mobile compact mode footer */}
      {isCompact && allClaims.length > activeClaimsData.length && (
        <motion.div
          className="text-center pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs" style={{ color: colors.mutedForeground }}>
            {allClaims.length - activeClaimsData.length} more claims in this video
          </p>
        </motion.div>
      )}

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? 'rgba(71, 85, 105, 0.1)' : 'rgba(139, 69, 19, 0.08)'};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(139, 69, 19, 0.25)'};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? 'rgba(148, 163, 184, 0.5)' : 'rgba(139, 69, 19, 0.4)'};
        }
      `}</style>
    </div>
  );
}