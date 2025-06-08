'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SegmentInterface } from './PlayerTimeline';
import TimelineSegment from './TimelineSegment';

interface TimelineProgressTrackerProps {
  currentTime: number;
  videoDuration: number;
  timelineSegments: SegmentInterface[];
  activeClaims: SegmentInterface[];
  isListenMode: boolean;
  syncMode: 'external' | 'internal';
  onSeekToTimestamp: (timestamp: number) => void;
  timelineColors: {
    track: string;
    progressGradient: string;
    indicator: string;
    primary: string;
  };
}

export function TimelineProgressTracker({
  currentTime,
  videoDuration,
  timelineSegments,
  activeClaims,
  isListenMode,
  syncMode,
  onSeekToTimestamp,
  timelineColors
}: TimelineProgressTrackerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isUserSeeking, setIsUserSeeking] = useState(false);
  const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncTimeRef = useRef<number>(0);

  // For external sync, use currentTime directly when not user seeking
  // For internal sync, always use currentTime
  const displayTime = isUserSeeking ? lastSyncTimeRef.current : currentTime;

  // Update last sync time when not user seeking
  useEffect(() => {
    if (!isUserSeeking) {
      lastSyncTimeRef.current = currentTime;
    }
  }, [currentTime, isUserSeeking]);

  const progressPercentage = (displayTime / videoDuration) * 100;

  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    if (!trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const seekTime = percentage * videoDuration;
    
    // Set user seeking state
    setIsUserSeeking(true);
    lastSyncTimeRef.current = seekTime;
    onSeekToTimestamp(seekTime);
    
    // Clear previous timeout
    if (seekTimeoutRef.current) {
      clearTimeout(seekTimeoutRef.current);
    }
    
    // Reset user seeking state after YouTube player responds
    seekTimeoutRef.current = setTimeout(() => {
      setIsUserSeeking(false);
    }, 300); // Reduced timeout for quicker response
  }, [videoDuration, onSeekToTimestamp]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isUserSeeking || !trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const seekTime = percentage * videoDuration;
    
    lastSyncTimeRef.current = seekTime;
  }, [isUserSeeking, videoDuration]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!trackRef.current) return;
    
    setIsUserSeeking(true);
    
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const seekTime = percentage * videoDuration;
    
    lastSyncTimeRef.current = seekTime;
  }, [videoDuration]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isUserSeeking || !trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const seekTime = percentage * videoDuration;
    
    lastSyncTimeRef.current = seekTime;
    onSeekToTimestamp(seekTime);
    
    // Reset user seeking state
    setTimeout(() => {
      setIsUserSeeking(false);
    }, 200);
  }, [isUserSeeking, videoDuration, onSeekToTimestamp]);

  const handleMouseLeave = useCallback(() => {
    if (isUserSeeking) {
      // If user was seeking and leaves, reset after a short delay
      setTimeout(() => {
        setIsUserSeeking(false);
      }, 100);
    }
  }, [isUserSeeking]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-3">
      {/* Progress Track */}
      <div 
        ref={trackRef}
        className="relative rounded-full overflow-hidden cursor-pointer select-none"
        style={{
          height: isListenMode ? '16px' : '8px',
          backgroundColor: timelineColors.track
        }}
        onClick={handleTrackClick}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Progress bar */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: timelineColors.progressGradient,
            boxShadow: `0 0 12px ${timelineColors.primary}40`,
            width: `${Math.min(Math.max(progressPercentage, 0), 100)}%`
          }}
          animate={{ 
            width: `${Math.min(Math.max(progressPercentage, 0), 100)}%` 
          }}
          transition={{ 
            duration: isUserSeeking ? 0 : 0.1,
            ease: 'easeOut'
          }}
        />

        {/* Segment indicators */}
        <div className="absolute inset-0 flex pointer-events-none">
          {timelineSegments.map((segment) => (
            <TimelineSegment 
              key={segment.id}
              segment={segment}
              activeClaims={activeClaims}
              handleSeekToTimestamp={onSeekToTimestamp}
              videoDuration={videoDuration}
            />
          ))}
        </div>

        {/* Current time indicator */}
        <motion.div
          className="absolute top-0 rounded-full z-20 pointer-events-none"
          style={{
            left: `${Math.min(Math.max(progressPercentage, 0), 100)}%`,
            width: '3px',
            height: '100%',
            background: timelineColors.indicator,
            boxShadow: `0 0 12px ${timelineColors.primary}60, 0 0 4px ${timelineColors.primary}40`,
            transform: 'translateX(-50%)'
          }}
          animate={{ 
            left: `${Math.min(Math.max(progressPercentage, 0), 100)}%`,
            scaleY: activeClaims.length > 0 ? 1.3 : 1,
            scaleX: isUserSeeking ? 1.5 : 1
          }}
          transition={{ 
            duration: isUserSeeking ? 0 : 0.1,
            ease: 'easeOut'
          }}
        >
          {/* Pulse effect for active claims */}
          {activeClaims.length > 0 && !isUserSeeking && (
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

          {/* User seeking indicator */}
          {isUserSeeking && (
            <motion.div
              className="absolute -top-2 -bottom-2 -left-1 -right-1 rounded-full border-2"
              style={{
                borderColor: timelineColors.primary,
                background: `${timelineColors.primary}20`
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            />
          )}
        </motion.div>
      </div>

      {/* Time Display */}
      <div className="flex justify-between items-center text-xs">
        <motion.span
          className="font-mono font-medium tabular-nums"
          animate={{ 
            color: isUserSeeking ? timelineColors.primary : 'inherit',
            scale: isUserSeeking ? 1.05 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          {Math.floor(displayTime / 60)}:{Math.floor(displayTime % 60).toString().padStart(2, '0')}
        </motion.span>
        <span className="opacity-60">/</span>
        <span className="font-mono opacity-60 tabular-nums">
          {Math.floor(videoDuration / 60)}:{Math.floor(videoDuration % 60).toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}