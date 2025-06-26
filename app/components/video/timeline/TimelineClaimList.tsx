'use client';

import React, { useMemo } from 'react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useVideoTimestamps } from '@/app/hooks/useVideoDetail';
import { VideoWithTimestamps, VideoTimestamp } from '@/app/types/video_api';

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

  const { 
    data: fetchedTimestamps, 
    isLoading: timestampsLoading, 
    error: timestampsError 
  } = useVideoTimestamps(video?.video.id || '');

  const timestamps = useMemo(() => {
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
  }, [video?.timestamps, fetchedTimestamps]); 

  const activeTimestamps = useMemo(() => {
    return timestamps.filter(timestamp => {
      return currentTime >= timestamp.startTime && currentTime <= timestamp.endTime;
    });
  }, [timestamps, currentTime]);

  const stats = useMemo(() => {
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
  }, [timestamps]);

  // ✅ FIXED: Memoize enhanced colors
  const colors_enhanced = useMemo(() => ({
    border: timelineColors?.border || (isDark ? 'rgba(71, 85, 105, 0.2)' : 'rgba(226, 232, 240, 0.3)'),
    background: timelineColors?.background || (isVintage ? vintage.paper : isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'),
    foreground: timelineColors?.foreground || (isVintage ? vintage.ink : colors.foreground),
  }), [timelineColors, isDark, isVintage, vintage, colors.foreground]);

  const handleSeek = (timestamp: number) => {
    console.log('TimelineClaimList: Seeking to', timestamp);
    if (onSeekToTimestamp && typeof timestamp === 'number' && !isNaN(timestamp)) {
      onSeekToTimestamp(timestamp);
    }
  };

  // ✅ FIXED: Memoize claim conversion function
  const convertTimestampToClaim = useMemo(() => {
    return (timestamp: VideoTimestamp, index: number) => {
      const getTypeFromStatus = (status?: string): 'truth' | 'lie' | 'neutral' => {
        switch (status) {
          case 'TRUE': return 'truth';
          case 'FALSE': return 'lie';
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
  }, []);

  // ✅ FIXED: Memoize claims data
  const allClaims = useMemo(() => {
    return timestamps.map((timestamp, index) => 
      convertTimestampToClaim(timestamp, index)
    );
  }, [timestamps, convertTimestampToClaim]);

  const activeClaimsData = useMemo(() => {
    return activeTimestamps.map((timestamp, index) => 
      ({ ...convertTimestampToClaim(timestamp, index), isActive: true })
    );
  }, [activeTimestamps, convertTimestampToClaim]);

  // Loading state
  if (timestampsLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading timeline data...</p>
      </div>
    );
  }

  // Error state
  if (timestampsError) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">⚠️</div>
        <p className="text-muted-foreground">Failed to load timeline data</p>
        <p className="text-xs text-muted-foreground mt-2">
          {timestampsError.message || 'Unknown error'}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Stats Section */}
      {showHeader && showStats && (
        <div
          className="p-4 rounded-lg border"
          style={{
            background: colors_enhanced.background,
            borderColor: colors_enhanced.border
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold" style={{ color: colors_enhanced.foreground }}>
                {stats.total}
              </div>
              <div className="text-xs text-muted-foreground">Total Claims</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {stats.truthCount}
              </div>
              <div className="text-xs text-muted-foreground">Verified</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {stats.lieCount}
              </div>
              <div className="text-xs text-muted-foreground">False</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: colors_enhanced.foreground }}>
                {stats.completionRate}%
              </div>
              <div className="text-xs text-muted-foreground">Researched</div>
            </div>
          </div>
        </div>
      )}

      {/* Active Claims */}
      {activeClaimsData.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold" style={{ color: colors_enhanced.foreground }}>
            Active Claims ({activeClaimsData.length})
          </h4>
          {activeClaimsData.map((claim) => (
            <div
              key={claim.id}
              className="p-3 rounded-lg border-l-4 cursor-pointer hover:bg-opacity-80 transition-colors"
              style={{
                background: colors_enhanced.background,
                borderLeftColor: claim.type === 'truth' ? '#22c55e' : claim.type === 'lie' ? '#ef4444' : '#f59e0b'
              }}
              onClick={() => handleSeek(claim.timestamp)}
            >
              <p className="text-sm font-medium" style={{ color: colors_enhanced.foreground }}>
                {claim.claim}
              </p>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>
                  {Math.floor(claim.timestamp / 60)}:{String(Math.floor(claim.timestamp % 60)).padStart(2, '0')}
                </span>
                <span className="capitalize">{claim.type}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All Claims (when not compact) */}
      {!isCompact && allClaims.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold" style={{ color: colors_enhanced.foreground }}>
            All Claims ({allClaims.length})
          </h4>
          <div 
            className="space-y-1 overflow-y-auto"
            style={{ maxHeight }}
          >
            {allClaims.map((claim) => (
              <div
                key={claim.id}
                className="p-2 rounded border cursor-pointer hover:bg-opacity-80 transition-colors text-sm"
                style={{
                  background: colors_enhanced.background,
                  borderColor: colors_enhanced.border
                }}
                onClick={() => handleSeek(claim.timestamp)}
              >
                <p className="font-medium truncate" style={{ color: colors_enhanced.foreground }}>
                  {claim.claim}
                </p>
                <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                  <span>
                    {Math.floor(claim.timestamp / 60)}:{String(Math.floor(claim.timestamp % 60)).padStart(2, '0')}
                  </span>
                  <span className="capitalize">{claim.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compact view showing only count */}
      {isCompact && allClaims.length > activeClaimsData.length && (
        <div className="text-center">
          <button
            className="text-sm text-primary hover:underline"
            onClick={() => {/* Handle expand */}}
          >
            View {allClaims.length - activeClaimsData.length} more claims
          </button>
        </div>
      )}

      {/* Empty state */}
      {timestamps.length === 0 && !timestampsLoading && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No timeline data available for this video</p>
        </div>
      )}
    </div>
  );
}