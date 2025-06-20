'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { VideoWithTimestamps } from '@/app/types/video_api';
import { useSmartTimeTracking } from '@/app/hooks/useSmartTimeTracking';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import PlayerTimelineBottom from './PlayerTimelineBottom';
import { Divider } from '@/app/components/ui/divider';
import { TimelineProgressTracker } from './TimelineProgressTracker';
import { Activity, X } from 'lucide-react';
import { calculateFactCheckStats, convertTimestampsToSegments } from '@/app/helpers/timelineTimeHelpers';
import { TimelineClaimList } from './TimelineClaimList';
import { useViewport } from '@/app/hooks/useViewport';

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


export function PlayerTimeline({
  videoData,
  onSeekToTimestamp,
  isOverNavbar = false,
  isListenMode = false,
  currentVideoTime,
  syncMode = 'external',
  setShowTimeline
}: PlayerTimelineProps) {
  const { colors, isDark, vintage, isVintage } = useLayoutTheme();
  const timelineRef = useRef<HTMLDivElement>(null);
  const { isDesktop } = useViewport();

  // Validate videoData structure
  if (!videoData || typeof videoData !== 'object') {
    console.error('PlayerTimeline: Invalid videoData provided', videoData);
    return (
      <div className="text-center py-8 text-gray-500">
        No video data available
      </div>
    );
  }

  const { video, timestamps } = videoData;
  
  if (!video || typeof video !== 'object') {
    console.error('PlayerTimeline: Invalid video object', video);
    return (
      <div className="text-center py-8 text-gray-500">
        Invalid video object
      </div>
    );
  }

  if (!Array.isArray(timestamps)) {
    console.error('PlayerTimeline: timestamps is not an array', timestamps);
    return (
      <div className="text-center py-8 text-gray-500">
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

  const currentTime = (() => {
    if (syncMode === 'external' && currentVideoTime !== undefined) {
      return currentVideoTime;
    }
    return trackedTime;
  })();

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

  // Enhanced vintage-aware color scheme
  const timelineColors = {
    background: isVintage 
      ? vintage.paper
      : isDark 
        ? 'rgba(15, 23, 42, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
    border: isVintage 
      ? vintage.crease
      : isDark 
        ? 'rgba(71, 85, 105, 0.2)'
        : 'rgba(226, 232, 240, 0.3)',
    track: isVintage 
      ? vintage.aged
      : isDark 
        ? 'rgba(71, 85, 105, 0.3)'
        : 'rgba(226, 232, 240, 0.5)',
    progress: colors.primary,
    progressGradient: `linear-gradient(90deg, ${colors.primary}, ${colors.primary}90)`,
    indicator: isVintage ? vintage.ink : colors.foreground,
    activeClaim: isVintage 
      ? vintage.highlight
      : isDark 
        ? 'rgba(30, 41, 59, 0.8)'
        : 'rgba(248, 250, 252, 0.8)',
    primary: colors.primary
  };

  // Vintage paper styling
  const paperStyle = isVintage ? {
    backgroundImage: `
      radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
      radial-gradient(circle at 80% 70%, rgba(160, 82, 45, 0.015) 1px, transparent 1px),
      radial-gradient(circle at 50% 90%, rgba(139, 69, 19, 0.01) 1px, transparent 1px),
      linear-gradient(135deg, transparent 48%, rgba(139, 69, 19, 0.008) 50%, transparent 52%)
    `,
    backgroundSize: '25px 25px, 30px 30px, 35px 35px, 100% 100%',
    filter: 'sepia(0.08) contrast(1.02) brightness(0.98)',
    boxShadow: `
      inset 0 2px 4px rgba(139, 69, 19, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      0 4px 8px rgba(139, 69, 19, 0.08),
      0 2px 4px rgba(139, 69, 19, 0.05)
    `,
  } : {};

  return (
    <>
      <motion.div
        ref={timelineRef}
        className={`relative backdrop-blur-sm border rounded-lg overflow-hidden ${isOverNavbar ? 'z-50' : 'z-10'}`}
        style={{
          backgroundColor: timelineColors.background,
          borderColor: timelineColors.border,
          marginBottom: isOverNavbar ? '80px' : '0px',
          borderWidth: isVintage ? '2px' : '1px',
          ...paperStyle,
        }}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 20,
          delay: 0.1 
        }}
        layout
      >
        <div className="p-6 relative z-10">
          {/* Progress Tracker */}
          <motion.div 
            className=""
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
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
          </motion.div>

          <Divider />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <TimelineClaimList
              video={videoData}
              timelineSegments={timelineSegments}
              activeClaims={activeClaims}
              currentTime={currentTime}
              onSeekToTimestamp={handleSeekToTimestamp}
              timelineColors={timelineColors}
              showHeader={false} 
              showStats={false} 
              maxHeight="300px"
              isCompact={true}
            />
          </motion.div>
        </div>
        {!isDesktop && <PlayerTimelineBottom
          factCheck={factCheckStats}
          isExpanded={false}
          handleToggleExpansion={() => {}}
          setShowTimeline={setShowTimeline}
        />}

        {/* Vintage paper edge effect */}
        {isVintage && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-1 opacity-60"
            style={{
              background: `linear-gradient(90deg, transparent, ${vintage.crease}, transparent)`,
              boxShadow: `0 1px 0 ${vintage.highlight}, 0 -1px 0 ${vintage.shadow}`
            }}
          />
        )}
      </motion.div>
    </>
  );
}