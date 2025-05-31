'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FactCheckResult } from '@/app/types/video';
import PlayerTimelineExp from './PlayerTimelineExp';
import { getSegmentColor } from '@/app/helpers/playerHelp';
import PlayerTimelineBottom from './PlayerTimelineBottom';
import { mockClaims } from '@/app/constants/claims';

interface FactCheckTimelineProps {
  factCheck: FactCheckResult;
  videoDuration: number;
  onSeekToTimestamp?: (timestamp: number) => void;
  onExpansionChange?: (isExpanded: boolean) => void;
  targetHeight?: string; 
}

interface TimelineSegment {
  timestamp: number;
  duration: number;
  type: 'truth' | 'neutral' | 'lie';
  claim: string;
  confidence: number;
}

// Mock claims data based on factCheck percentages
const generateMockClaims = (factCheck: FactCheckResult, videoDuration: number) => {

  // Filter claims that fit within video duration
  return mockClaims.filter(claim => claim.startTime < videoDuration);
};

export function PlayerTimeline({ 
  factCheck, 
  videoDuration, 
  onSeekToTimestamp,
  onExpansionChange,
  targetHeight = "50vh"
}: FactCheckTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Generate mock claims data
  const mockClaims = generateMockClaims(factCheck, videoDuration);

  useEffect(() => {
    onExpansionChange?.(isExpanded);
  }, [isExpanded, onExpansionChange]);

  const handleToggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Convert mock claims to timeline segments for consistency
  const timelineSegments: TimelineSegment[] = mockClaims.map(claim => ({
    timestamp: claim.startTime,
    duration: claim.endTime - claim.startTime,
    type: claim.veracity === 'true' ? 'truth' : claim.veracity === 'false' ? 'lie' : 'neutral',
    claim: claim.text,
    confidence: claim.confidence
  }));

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
              md:inset-x-8 md:top-8 md:bottom-24 bg-primary-100 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Close button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.2 }}
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              <PlayerTimelineExp
                factCheck={factCheck}
                mockTimelineData={timelineSegments}
                onSeekToTimestamp={(timestamp) => {
                  onSeekToTimestamp?.(timestamp);
                  setIsExpanded(false);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Regular Timeline Bar */}
      <motion.div
        ref={timelineRef}
        className="relative bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg z-10"
        layout
      >
        {/* Timeline progress track */}
        <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
          {/* Segment indicators using mock claims */}
          <div className="absolute inset-0 flex">
            {mockClaims.map((claim, index) => {
              const segmentWidth = ((claim.endTime - claim.startTime) / videoDuration) * 100;
              const segmentStart = (claim.startTime / videoDuration) * 100;
              
              return (
                <motion.div
                  key={claim.id}
                  className={`absolute h-full ${getSegmentColor(claim.veracity)} transition-all duration-200 cursor-pointer ${
                    hoveredSegment === index ? 'brightness-125 scale-y-125' : ''
                  }`}
                  style={{
                    left: `${segmentStart}%`,
                    width: `${segmentWidth}%`,
                  }}
                  onMouseEnter={() => setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  onClick={() => onSeekToTimestamp?.(claim.startTime)}
                  whileHover={{ scaleY: 1.2 }}
                  transition={{ duration: 0.2 }}
                />
              );
            })}
          </div>
        </div>

        {/* Timeline controls and info */}
        <PlayerTimelineBottom
          isExpanded={isExpanded}
          handleToggleExpansion={handleToggleExpansion}
          factCheck={factCheck}
        />
      </motion.div>
    </>
  );
}