'use client'
import React, { useRef, useMemo } from 'react';
import { motion, useTransform } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { useTimelineScroll } from '@/app/hooks/useTimelineScroll';
import TimelineMilestone from '../../components/timeline/TimelineMilestone/TimelineMilestone';
import TimelineProgress from '../../components/timeline/TimelineProgress/TimelineProgress';
import TimelineBackground from '../../components/timeline/TimelineVertical/TimelineBackground';
import TimelineVerticalLeft from '../../components/timeline/TimelineVertical/TimelineVerticalLeft';
import TimelineVerticalRight from '../../components/timeline/TimelineVertical/TimelineVerticalRight';
import { FloatingVerdictIcon } from '@/app/components/ui/Decorative/FloatingVerdictIcon';
import { Timeline } from '../../types/timeline';
import exampleData from './data/example.json';
import TimelineHeader from '../../components/timeline/TimelineVertical/TimelineHeader';

// Memoized components for performance
const MemoizedTimelineBackground = React.memo(TimelineBackground);
const MemoizedTimelineHeader = React.memo(TimelineHeader);
const MemoizedTimelineProgress = React.memo(TimelineProgress);
const MemoizedTimelineVerticalLeft = React.memo(TimelineVerticalLeft);
const MemoizedTimelineVerticalRight = React.memo(TimelineVerticalRight);

const OptimizedTimelineMilestone = React.memo(({ 
  milestone, 
  index, 
  activeEventId, 
  activeMilestoneId, 
  onEventHover, 
  onMilestoneHover, 
  smoothScrollProgress 
}: any) => (
  <div
    className="mb-12"
    data-milestone-id={milestone.id}
  >
    <TimelineMilestone
      milestone={milestone}
      index={index}
      activeEventId={activeEventId}
      activeMilestoneId={activeMilestoneId}
      onEventHover={onEventHover}
      onMilestoneHover={onMilestoneHover}
      scrollProgress={smoothScrollProgress}
    />
  </div>
));

OptimizedTimelineMilestone.displayName = 'OptimizedTimelineMilestone';

// Fixed Timeline Progress Component using portal
const FixedTimelineProgress = React.memo(({ 
  scrollProgress, 
  sortedMilestones, 
  activeMilestoneId, 
  activeEventId, 
  handleNavigateToMilestone, 
  handleNavigateToEvent,
  isDesktop 
}: any) => {
  // Only render on client side and if desktop
  if (typeof window === 'undefined' || !isDesktop) return null;

  const progressComponent = (
    <MemoizedTimelineProgress
      scrollProgress={scrollProgress}
      milestones={sortedMilestones}
      activeMilestoneId={activeMilestoneId}
      activeEventId={activeEventId}
      onNavigateToMilestone={handleNavigateToMilestone}
      onNavigateToEvent={handleNavigateToEvent}
    />
  );

  // Create portal to render outside the scrolling container
  return createPortal(progressComponent, document.body);
});

FixedTimelineProgress.displayName = 'FixedTimelineProgress';

export default function TimelineVertical() {
  const { colors, isDark } = useLayoutTheme();
  const { isMobile, isDesktop } = useViewport();
  const containerRef = useRef<HTMLDivElement>(null);

  const timeline: Timeline = useMemo(() => exampleData as Timeline, []);

  const sortedMilestones = useMemo(() => 
    [...timeline.milestones].sort((a, b) => a.order - b.order), 
    [timeline.milestones]
  );

  // Use the custom scrolling hook
  const {
    activeEventId,
    activeMilestoneId,
    showScrollHint,
    smoothScrollProgress,
    handleNavigateToMilestone,
    handleNavigateToEvent,
  } = useTimelineScroll({
    milestones: timeline.milestones,
    containerRef
  });

  const progressWidth = useTransform(smoothScrollProgress, [0, 1], ['0%', '100%']);
  const headerOpacity = useTransform(smoothScrollProgress, [0, 0.2], [1, 0]); 
  const sideOpacity = useTransform(smoothScrollProgress, [0.1, 0.3, 0.8, 1], [0, 1, 1, 0.8]); 

  const backgroundGradient = useMemo(() => 
    isDark
      ? 'linear-gradient(180deg, rgb(15, 23, 42) 0%, rgb(30, 41, 59) 100%)'
      : 'linear-gradient(180deg, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 100%)',
    [isDark]
  );

  const timelineLineGradients = useMemo(() => ({
    background: isDark
      ? 'linear-gradient(180deg, transparent 0%, rgba(148, 163, 184, 0.3) 50%, transparent 100%)'
      : 'linear-gradient(180deg, transparent 0%, rgba(100, 116, 139, 0.2) 50%, transparent 100%)',
    progress: `linear-gradient(180deg, ${colors.primary}50, ${colors.primary}80)`
  }), [isDark, colors.primary]);

  const scrollHintStyle = useMemo(() => ({
    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(248, 250, 252, 0.9)',
    borderColor: colors.border,
    color: colors.foreground
  }), [isDark, colors.border, colors.foreground]);

  return (
    <>
      {/* FIXED: Timeline Progress rendered via portal outside scrolling container */}
      <FixedTimelineProgress
        scrollProgress={smoothScrollProgress}
        sortedMilestones={sortedMilestones}
        activeMilestoneId={activeMilestoneId}
        activeEventId={activeEventId}
        handleNavigateToMilestone={handleNavigateToMilestone}
        handleNavigateToEvent={handleNavigateToEvent}
        isDesktop={isDesktop}
      />

      <div
        ref={containerRef}
        style={{
          background: backgroundGradient,
          color: colors.foreground,
          willChange: 'transform',
          transform: 'translateZ(0)'
        }}
      >
        <MemoizedTimelineBackground
          scrollProgress={smoothScrollProgress.get()}
          isDark={isDark}
          colors={colors}
        />

        {isDesktop && (
          <>
            <motion.div
              className="relative z-5"
              style={{ opacity: sideOpacity }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            >
              <MemoizedTimelineVerticalLeft
                sideOpacity={sideOpacity}
                leftSide={timeline.leftSide}
                colors={colors}
              />
            </motion.div>

            <motion.div
              className="relative z-5" 
              style={{ opacity: sideOpacity }}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            >
              <MemoizedTimelineVerticalRight
                sideOpacity={sideOpacity}
                rightSide={timeline.rightSide}
                colors={colors}
              />
            </motion.div>
          </>
        )}

        <div 
          className="fixed left-1/2 top-0 w-px h-full -translate-x-1/2 z-10 opacity-60"
          style={{ willChange: 'transform' }}
        >
          <div
            className="w-full h-full"
            style={{ background: timelineLineGradients.background }}
          />
          
          <motion.div
            className="absolute top-0 left-0 w-full origin-top"
            style={{
              height: progressWidth,
              background: timelineLineGradients.progress,
              boxShadow: `0 0 8px ${colors.primary}30`,
              willChange: 'height'
            }}
          />
        </div>

        {isDesktop && (
          <motion.div
            className="fixed top-[50%] left-8 z-20"
            style={{ opacity: headerOpacity }}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <FloatingVerdictIcon
              size="sm"
              confidence={85}
              showConfidenceRing={false}
              autoAnimate={true}
              delay={0.3}
            />
          </motion.div>
        )}

        <motion.div
          style={{ opacity: headerOpacity }}
          className="relative z-25" 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          data-scroll-target="hero" 
        >
          <MemoizedTimelineHeader timeline={timeline} />
        </motion.div>

        <div 
          className={`relative z-20 mx-auto px-4 pt-6 ${
            isDesktop ? 'max-w-5xl' : isMobile ? 'max-w-full' : 'max-w-3xl'
          }`}
          style={{ willChange: 'transform' }}
        >
          {sortedMilestones.map((milestone, index) => (
            <OptimizedTimelineMilestone
              key={milestone.id}
              milestone={milestone}
              index={index}
              activeEventId={activeEventId}
              activeMilestoneId={activeMilestoneId}
              smoothScrollProgress={smoothScrollProgress}
            />
          ))}
        </div>

        {isDesktop && showScrollHint && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            <motion.div
              className="px-4 py-2 rounded-full backdrop-blur-md border text-sm font-medium shadow-xl"
              style={scrollHintStyle}
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-2">
                <span>🎯</span>
                <span>Snap Scroll Active • Wheel to navigate</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}