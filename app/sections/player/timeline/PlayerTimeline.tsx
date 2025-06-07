'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoWithTimestamps, VideoTimestamp } from '@/app/types/video_api';
import { useSmartTimeTracking } from '@/app/hooks/useSmartTimeTracking';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { getSegmentTypeFromCategory } from '@/app/helpers/playerHelp';
import PlayerTimelineBottom from './PlayerTimelineBottom';
import { Divider } from '@/app/components/ui/divider';
import TimelineClaimItem from './TimelineClaimItem';

import TimelineSegment from './TimelineSegment';
import TimelineListenHeader from './TimelineListenHeader';

interface PlayerTimelineProps {
  videoData: VideoWithTimestamps;
  onSeekToTimestamp?: (timestamp: number) => void;
  onExpansionChange?: (isExpanded: boolean) => void;
  targetHeight?: string;
  isOverNavbar?: boolean;
  isListenMode?: boolean; // New prop for listen-only mode
  currentVideoTime?: number; // External video time if available
}

export interface SegmentInteface {
  timestamp: number;
  duration: number;
  type: 'truth' | 'neutral' | 'lie';
  claim: string;
  confidence: number;
  id: string;
}

// Convert VideoTimestamps to TimelineSegments
const convertTimestampsToSegments = (timestamps: VideoTimestamp[]): SegmentInteface[] => {
  return timestamps.map(timestamp => ({
    id: timestamp.id,
    timestamp: timestamp.time_from_seconds,
    duration: timestamp.time_to_seconds - timestamp.time_from_seconds,
    type: getSegmentTypeFromCategory(timestamp.category),
    claim: timestamp.statement,
    confidence: timestamp.confidence_score || 0
  }));
};

// Calculate fact check statistics from timestamps
const calculateFactCheckStats = (timestamps: VideoTimestamp[]) => {
  if (timestamps.length === 0) {
    return {
      truthPercentage: 0,
      confidence: 0,
      sources: 0
    };
  }

  const totalStatements = timestamps.length;
  const truthfulStatements = timestamps.filter(t => 
    getSegmentTypeFromCategory(t.category) === 'truth'
  ).length;
  
  const averageConfidence = timestamps.reduce((sum, t) => 
    sum + (t.confidence_score || 0), 0
  ) / totalStatements;

  const uniqueSources = new Set(timestamps.map(t => t.research_id).filter(Boolean)).size;

  return {
    truthPercentage: Math.round((truthfulStatements / totalStatements) * 100),
    confidence: Math.round(averageConfidence),
    sources: uniqueSources
  };
};

export function PlayerTimeline({ 
  videoData,
  onSeekToTimestamp,
  onExpansionChange,
  targetHeight = "50vh",
  isOverNavbar = false,
  isListenMode = false,
  currentVideoTime
}: PlayerTimelineProps) {
  const { colors, isDark, mounted } = useLayoutTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const timelineRef = useRef<HTMLDivElement>(null);

  const { video, timestamps } = videoData;
  const videoDuration = video.duration_seconds || 0;
  const timelineSegments = convertTimestampsToSegments(timestamps);
  const factCheckStats = calculateFactCheckStats(timestamps);

  // Smart time tracking for listen mode
  const { 
    currentTime: trackedTime, 
    accuracy, 
    confidence: trackingConfidence 
  } = useSmartTimeTracking(video.id, videoDuration);

  // Use external time if provided, otherwise use tracked time
  const currentTime = currentVideoTime !== undefined ? currentVideoTime : trackedTime;
  const progressPercentage = (currentTime / videoDuration) * 100;

  // Find active claims at current time
  const activeClaims = timelineSegments.filter(
    segment => currentTime >= segment.timestamp && currentTime <= (segment.timestamp + segment.duration)
  );

  useEffect(() => {
    onExpansionChange?.(isExpanded);
  }, [isExpanded, onExpansionChange]);

  const handleToggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSeekToTimestamp = (timestamp: number) => {
    onSeekToTimestamp?.(timestamp);
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
      : 'rgba(22, 163, 74, 0.8)'
  };

  return (
    <>
      {/* Expanded Timeline Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsExpanded(false)}
            />
            
            {/* Expanded Panel */}
            <motion.div
              initial={{ 
                y: "100%",
                opacity: 0,
                scale: 0.95
              }}
              animate={{ 
                y: 0,
                opacity: 1,
                scale: 1
              }}
              exit={{ 
                y: "100%",
                opacity: 0,
                scale: 0.95
              }}
              transition={{ 
                type: "spring",
                damping: 25,
                stiffness: 200,
                duration: 0.5
              }}
              className="fixed max-h-[700px] max-w-[800px] w-full px-5 inset-x-4 top-4 ml-[5%]
              md:inset-x-8 md:top-8 md:bottom-24 backdrop-blur-md border rounded-xl shadow-2xl z-50 overflow-hidden"
              style={{
                backgroundColor: timelineColors.background,
                borderColor: timelineColors.border
              }}
            >
              {/* Close button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.2 }}
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full transition-colors"
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  color: colors.foreground
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Enhanced Regular Timeline with Listen Mode Features */}
      <motion.div
        ref={timelineRef}
        className={`relative backdrop-blur-sm border rounded-lg ${
          isOverNavbar ? 'z-50' : 'z-10'
        }`}
        style={{
          backgroundColor: timelineColors.background,
          borderColor: timelineColors.border,
          marginBottom: isOverNavbar ? '80px' : '0px'
        }}
        layout
      >
        {/* Listen Mode Header with Accuracy Indicator */}
        {isListenMode && (
          <TimelineListenHeader
            timelineColors={timelineColors}
            accuracy={accuracy}
            trackingConfidence={trackingConfidence}
            currentTime={currentTime}
            videoDuration={videoDuration}
          />
        )}

        {/* Enhanced Timeline Progress Track */}
        <div className="p-4 space-y-3">
          <div 
            className="relative rounded-full overflow-hidden"
            style={{
              height: isListenMode ? '16px' : '8px',
              backgroundColor: timelineColors.track
            }}
          >
            {/* Progress bar with enhanced animation */}
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: timelineColors.progressGradient,
                boxShadow: `0 0 12px ${colors.primary}40`
              }}
              animate={{ 
                width: `${Math.min(progressPercentage, 100)}%` 
              }}
              transition={{ 
                duration: isListenMode ? 0.1 : 0.3,
                ease: 'easeOut'
              }}
            />

            {/* Segment indicators using backend timestamps */}
            <div className="absolute inset-0 flex">
              {timelineSegments.map((segment) => (
                <TimelineSegment 
                  key={segment.id}
                  segment={segment}
                  activeClaims={activeClaims}
                  handleSeekToTimestamp={handleSeekToTimestamp}
                  videoDuration={videoDuration}
                />
              ))}
            </div>

            {/* Current time indicator with enhanced styling */}
            <motion.div
              className="absolute top-0 rounded-full z-20"
              style={{
                left: `${Math.min(progressPercentage, 100)}%`,
                width: '3px',
                height: '100%',
                background: timelineColors.indicator,
                boxShadow: `0 0 12px ${colors.primary}60, 0 0 4px ${colors.primary}40`,
                transform: 'translateX(-50%)'
              }}
              animate={{ 
                left: `${Math.min(progressPercentage, 100)}%`,
                scaleY: activeClaims.length > 0 ? 1.3 : 1
              }}
              transition={{ 
                duration: isListenMode ? 0.1 : 0.3,
                ease: 'easeOut'
              }}
            >
              {/* Pulse effect for active claims */}
              {activeClaims.length > 0 && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: timelineColors.indicator,
                    filter: 'blur(2px)'
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              )}
            </motion.div>
          </div>

          {/* Active Claims Display */}
          <AnimatePresence>
            {activeClaims.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="p-3 rounded-lg border space-y-2"
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
        />
      </motion.div>
    </>
  );
}