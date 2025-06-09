'use client';

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoWithTimestamps } from '@/app/types/video_api';
import { useSmartTimeTracking } from '@/app/hooks/useSmartTimeTracking';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { getSegmentTypeFromCategory } from '@/app/helpers/playerHelp';
import PlayerTimelineBottom from './PlayerTimelineBottom';
import { Divider } from '@/app/components/ui/divider';
import TimelineClaimItem from './TimelineClaimItem';
import { TimelineProgressTracker } from './TimelineProgressTracker';

interface PlayerTimelineProps {
  videoData: VideoWithTimestamps;
  onSeekToTimestamp?: (timestamp: number) => void;
  isOverNavbar?: boolean;
  isListenMode?: boolean;
  currentVideoTime?: number; 
  syncMode?: 'external' | 'internal'; 
  setShowTimeline: (show: boolean) => void; 
}

export interface SegmentInterface {
  timestamp: number;
  duration: number;
  type: 'truth' | 'neutral' | 'lie';
  claim: string;
  confidence: number;
  id: string;
}

// Convert VideoTimestamps to TimelineSegments with unique keys
const convertTimestampsToSegments = (timestamps: any[]): SegmentInterface[] => {
  if (!Array.isArray(timestamps)) {
    console.warn('convertTimestampsToSegments: timestamps is not an array', timestamps);
    return [];
  }

  // Create a Map to track used IDs and ensure uniqueness
  const usedIds = new Set<string>();
  
  return timestamps
    .filter((timestamp, index) => {
      // Validate timestamp structure
      if (!timestamp || typeof timestamp !== 'object') {
        console.warn(`Invalid timestamp at index ${index}:`, timestamp);
        return false;
      }

      // Check required fields
      if (typeof timestamp.time_from_seconds !== 'number' || typeof timestamp.time_to_seconds !== 'number') {
        console.warn(`Missing or invalid time fields in timestamp at index ${index}:`, timestamp);
        return false;
      }

      if (!timestamp.statement || typeof timestamp.statement !== 'string') {
        console.warn(`Missing or invalid statement in timestamp at index ${index}:`, timestamp);
        return false;
      }

      return true;
    })
    .map((timestamp, index) => {
      // Generate base ID
      let baseId = timestamp.id || `${timestamp.time_from_seconds}-${timestamp.time_to_seconds}`;
      
      // Ensure uniqueness by adding index if needed
      let uniqueId = baseId;
      let counter = 1;
      while (usedIds.has(uniqueId)) {
        uniqueId = `${baseId}-${counter}`;
        counter++;
      }
      usedIds.add(uniqueId);

      const duration = Math.max(0, timestamp.time_to_seconds - timestamp.time_from_seconds);
      
      return {
        id: uniqueId,
        timestamp: timestamp.time_from_seconds,
        duration: duration,
        type: getSegmentTypeFromCategory(timestamp.category),
        claim: timestamp.statement,
        confidence: timestamp.confidence_score || 0
      };
    });
};

// Calculate fact check statistics from timestamps with error handling
const calculateFactCheckStats = (timestamps: any[]) => {
  if (!Array.isArray(timestamps) || timestamps.length === 0) {
    console.warn('calculateFactCheckStats: Invalid or empty timestamps array');
    return {
      truthPercentage: 0,
      neutralPercentage: 0,
      misleadingPercentage: 0,
      confidence: 0,
      sources: 0
    };
  }

  try {
    const validTimestamps = timestamps.filter(t => t && typeof t === 'object');
    const totalStatements = validTimestamps.length;
    
    if (totalStatements === 0) {
      return {
        truthPercentage: 0,
        neutralPercentage: 0,
        misleadingPercentage: 0,
        confidence: 0,
        sources: 0
      };
    }

    const truthfulStatements = validTimestamps.filter(t =>
      getSegmentTypeFromCategory(t.category) === 'truth'
    ).length;
    
    const neutralStatements = validTimestamps.filter(t =>
      getSegmentTypeFromCategory(t.category) === 'neutral'
    ).length;
    
    const misleadingStatements = validTimestamps.filter(t =>
      getSegmentTypeFromCategory(t.category) === 'lie'
    ).length;

    const confidenceScores = validTimestamps
      .map(t => t.confidence_score)
      .filter(score => typeof score === 'number' && !isNaN(score));
    
    const averageConfidence = confidenceScores.length > 0
      ? confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length
      : 0;

    const uniqueSources = new Set(
      validTimestamps
        .map(t => t.research_id)
        .filter(Boolean)
    ).size;

    return {
      truthPercentage: Math.round((truthfulStatements / totalStatements) * 100),
      neutralPercentage: Math.round((neutralStatements / totalStatements) * 100),
      misleadingPercentage: Math.round((misleadingStatements / totalStatements) * 100),
      confidence: Math.round(averageConfidence * 100),
      sources: uniqueSources
    };
  } catch (error) {
    console.error('Error calculating fact check stats:', error);
    return {
      truthPercentage: 0,
      neutralPercentage: 0,
      misleadingPercentage: 0,
      confidence: 0,
      sources: 0
    };
  }
};

export function PlayerTimeline({
  videoData,
  onSeekToTimestamp,
  isOverNavbar = false,
  isListenMode = false,
  currentVideoTime,
  syncMode = 'external',
  setShowTimeline
}: PlayerTimelineProps) {
  const { colors, isDark, mounted } = useLayoutTheme();
  const timelineRef = useRef<HTMLDivElement>(null);

  // Validate videoData structure
  if (!videoData || typeof videoData !== 'object') {
    console.error('PlayerTimeline: Invalid videoData provided', videoData);
    return (
      <div className="p-4 text-center text-red-500">
        Error: Invalid video data
      </div>
    );
  }

  const { video, timestamps } = videoData;
  
  // Validate video and timestamps
  if (!video || typeof video !== 'object') {
    console.error('PlayerTimeline: Invalid video object', video);
    return (
      <div className="p-4 text-center text-red-500">
        Error: Invalid video object
      </div>
    );
  }

  if (!Array.isArray(timestamps)) {
    console.error('PlayerTimeline: timestamps is not an array', timestamps);
    return (
      <div className="p-4 text-center text-yellow-500">
        No timestamps available for this video
      </div>
    );
  }

  const videoDuration = video.duration_seconds || 0;
  const timelineSegments = convertTimestampsToSegments(timestamps);
  const factCheckStats = calculateFactCheckStats(timestamps);

  const {
    currentTime: trackedTime,
    accuracy,
    confidence: trackingConfidence
  } = useSmartTimeTracking(video.id, videoDuration);

  // Determine which time source to use
  const currentTime = (() => {
    if (syncMode === 'external' && currentVideoTime !== undefined) {
      return currentVideoTime; // Use synced time from YouTube player
    }
    return trackedTime; // Fallback to internal tracking
  })();

  // Find active claims at current time - with error handling
  const activeClaims = timelineSegments.filter(
    segment => {
      if (!segment || typeof segment.timestamp !== 'number' || typeof segment.duration !== 'number') {
        return false;
      }
      return currentTime >= segment.timestamp && currentTime <= (segment.timestamp + segment.duration);
    }
  );

  const handleSeekToTimestamp = (timestamp: number) => {
    if (typeof timestamp === 'number' && !isNaN(timestamp)) {
      onSeekToTimestamp?.(timestamp);
    } else {
      console.warn('Invalid timestamp for seeking:', timestamp);
    }
  };

  if (!mounted) {
    return null;
  }

  // Enhanced color scheme for dual theming
  const timelineColors = {
    background: isDark
      ? 'rgba(15, 23, 42, 0.95)'
      : 'rgba(255, 255, 255, 0.95)',
    border: isDark
      ? 'rgba(71, 85, 105, 0.2)'
      : 'rgba(226, 232, 240, 0.3)',
    track: isDark
      ? 'rgba(71, 85, 105, 0.3)'
      : 'rgba(226, 232, 240, 0.5)',
    progress: colors.primary,
    progressGradient: `linear-gradient(90deg, ${colors.primary}, ${colors.primary}90)`,
    indicator: colors.foreground,
    activeClaim: isDark
      ? 'rgba(30, 41, 59, 0.8)'
      : 'rgba(248, 250, 252, 0.8)',
    accuracy: isDark
      ? 'rgba(34, 197, 94, 0.8)'
      : 'rgba(22, 163, 74, 0.8)',
    primary: colors.primary
  };

  return (
    <>
      {/* Enhanced Regular Timeline with Sync Status */}
      <motion.div
        ref={timelineRef}
        className={`relative backdrop-blur-sm border rounded-lg ${isOverNavbar ? 'z-50' : 'z-10'
          }`}
        style={{
          backgroundColor: timelineColors.background,
          borderColor: timelineColors.border,
          marginBottom: isOverNavbar ? '80px' : '0px'
        }}
        layout
      >
        {/* Sync Status Indicator */}
        {syncMode === 'external' && (
          <div className="absolute top-2 right-2 z-20">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                color: isDark ? '#4ade80' : '#16a34a',
                border: `1px solid ${isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'}`
              }}>
              <motion.div
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              <span>Synced</span>
            </div>
          </div>
        )}

        {/* Enhanced Timeline Progress Track */}
        <div className="p-4">
          <TimelineProgressTracker
            currentTime={currentTime}
            videoDuration={videoDuration}
            timelineSegments={timelineSegments}
            activeClaims={activeClaims}
            isListenMode={isListenMode}
            syncMode={syncMode}
            onSeekToTimestamp={handleSeekToTimestamp}
            timelineColors={timelineColors}
          />

          {/* Active Claims Display */}
          <AnimatePresence>
            {activeClaims.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="p-3 rounded-lg border space-y-2 mt-4"
                style={{
                  backgroundColor: timelineColors.activeClaim,
                  borderColor: timelineColors.border,
                  backdropFilter: 'blur(8px)'
                }}
              >
                <div
                  className="text-sm font-semibold flex items-center space-x-2"
                  style={{ color: colors.foreground }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                  <span>Active Claims ({activeClaims.length})</span>
                </div>

                <Divider variant="gradient" thickness="thin" spacing="tight" />

                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {activeClaims.map((claim, index) => (
                    <TimelineClaimItem
                      claim={claim}
                      key={claim.id}
                      index={index}
                      timelineColors={timelineColors}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Timeline controls and info */}
        <PlayerTimelineBottom
          factCheck={factCheckStats}
          isExpanded={false}
          handleToggleExpansion={() => {}}
          setShowTimeline={setShowTimeline}
        />

      </motion.div>
    </>
  );
}