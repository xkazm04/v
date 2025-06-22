'use client'
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { motion, useTransform } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { useTimelineScroll } from '@/app/hooks/useTimelineScroll';
import { useTimelineAudioStore } from '@/app/stores/useTimelineAudioStore';
import TimelineMilestone from '../../components/timeline/TimelineMilestone/TimelineMilestone';
import TimelineProgress from '../../components/timeline/TimelineProgress/TimelineProgress';
import TimelineBackground from '../../components/timeline/TimelineVertical/TimelineBackground';
import TimelineSelector from '../../components/timeline/TimelineSelector/TimelineSelector';
import TimelineSummaryModal from '../../components/timeline/TimelineSummary/TimelineSummaryModal';
import { FloatingVerdictIcon } from '@/app/components/ui/Decorative/FloatingVerdictIcon';
import { Timeline } from '../../types/timeline';
import exampleData from './data/example.json';
import TimelineHeader from '../../components/timeline/TimelineVertical/TimelineHeader';
import { useUserPreferences } from '@/app/hooks/use-user-preferences';
import { getVoiceIdForLanguage } from '@/app/helpers/countries';
import TimelineVerticalWrapper from './TimelineVerticalWrapper';
import FloatingSummaryButton from '@/app/components/timeline/TimelineSummary/FloatingSummaryButton';

const MemoizedTimelineBackground = React.memo(TimelineBackground);
const MemoizedTimelineHeader = React.memo(TimelineHeader);
const MemoizedTimelineProgress = React.memo(TimelineProgress);

const OptimizedTimelineMilestone = React.memo(({ 
  milestone, 
  index, 
  activeEventId, 
  activeMilestoneId, 
  smoothScrollProgress 
}: any) => (
  <TimelineMilestone
    milestone={milestone}
    index={index}
    activeEventId={activeEventId}
    activeMilestoneId={activeMilestoneId}
    scrollProgress={smoothScrollProgress}
  />
));

OptimizedTimelineMilestone.displayName = 'OptimizedTimelineMilestone';

const FixedTimelineProgress = React.memo(({ 
  smoothScrollProgress, 
  sortedMilestones, 
  activeMilestoneId, 
  activeEventId, 
  handleNavigateToMilestone, 
  handleNavigateToEvent,
  hasScrolled
}: any) => {
  if (typeof window === 'undefined') return null;

  const progressComponent = (
    <MemoizedTimelineProgress
      scrollProgress={smoothScrollProgress}
      milestones={sortedMilestones}
      activeMilestoneId={activeMilestoneId}
      activeEventId={activeEventId}
      onNavigateToMilestone={handleNavigateToMilestone}
      onNavigateToEvent={handleNavigateToEvent}
      hasScrolled={hasScrolled}
    />
  );

  return createPortal(progressComponent, document.body);
});

FixedTimelineProgress.displayName = 'FixedTimelineProgress';

export default function TimelineVertical() {
  const { colors, isDark, vintage } = useLayoutTheme();
  const { isMobile, isDesktop } = useViewport();
  const containerRef = useRef<HTMLDivElement>(null);

  // State for timeline selection and summary modal
  const [currentTimeline, setCurrentTimeline] = useState<Timeline>(exampleData as Timeline);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // Get user preferences for language-based voice selection
  const { preferences } = useUserPreferences();
  const userLanguage = preferences.language || 'en';
  const voiceId = useMemo(() => getVoiceIdForLanguage(userLanguage), [userLanguage]);

  // Use currentTimeline instead of exampleData
  const timeline: Timeline = currentTimeline;
  
  // Initialize audio store
  const { initializeTracklist } = useTimelineAudioStore();

  // Use the custom scrolling hook with hasScrolled tracking
  const {
    activeEventId,
    activeMilestoneId,
    showScrollHint,
    smoothScrollProgress,
    handleNavigateToMilestone,
    handleNavigateToEvent,
    scrollToMilestone,
    scrollToEvent,
    hasScrolled // Get hasScrolled state
  } = useTimelineScroll(containerRef, timeline);


  useEffect(() => {
    initializeTracklist(timeline);
  }, [timeline, initializeTracklist]);

  useEffect(() => {
    console.log('📢 Timeline language preference changed:', {
      language: userLanguage,
      voiceId: voiceId
    });
  }, [userLanguage, voiceId]);

  const sortedMilestones = useMemo(() => 
    [...timeline.milestones].sort((a, b) => a.order - b.order), 
    [timeline.milestones]
  );

  const progressWidth = useTransform(smoothScrollProgress, [0, 1], ['0%', '100%']);
  const headerOpacity = useTransform(smoothScrollProgress, [0, 0.2], [1, 0]); 

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
    <TimelineVerticalWrapper
      userLanguage={userLanguage}
      voiceId={voiceId}
      scrollToMilestone={scrollToMilestone}
      scrollToEvent={scrollToEvent}
    >
      <FixedTimelineProgress
        smoothScrollProgress={smoothScrollProgress}
        sortedMilestones={sortedMilestones}
        activeMilestoneId={activeMilestoneId}
        activeEventId={activeEventId}
        handleNavigateToMilestone={handleNavigateToMilestone}
        handleNavigateToEvent={handleNavigateToEvent}
        hasScrolled={hasScrolled}
      />

      {/* Floating Summary Button */}
      <FloatingSummaryButton
        onClick={() => setIsSummaryOpen(true)}
        colors={colors}
        isDark={isDark}
        vintage={vintage}
        isMobile={isMobile}
        scrollProgress={smoothScrollProgress}
      />

      <div
        ref={containerRef}
        id="timeline-container"
        className="min-h-screen relative w-full overflow-hidden"
        style={{
          background: backgroundGradient,
          color: colors.foreground,
          willChange: 'transform',
          transform: 'translateZ(0)'
        }}
      >
        <TimelineSelector
          currentTimeline={currentTimeline}
          setCurrentTimeline={setCurrentTimeline}
          setIsLoadingTimeline={setIsLoadingTimeline}
        />
        
        <MemoizedTimelineBackground
          scrollProgress={smoothScrollProgress.get()}
          isDark={isDark}
          colors={colors}
        />
        
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
          
          {/* Loading indicator */}
          {isLoadingTimeline && (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ borderColor: colors.primary }}
              />
              <p className="mt-2 text-sm opacity-60">Loading timeline...</p>
            </motion.div>
          )}
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
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30"
            style={scrollHintStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="px-4 py-2 rounded-full border text-sm flex items-center gap-2">
              <div className="w-4 h-6 flex flex-col justify-center items-center">
                <motion.div
                  className="w-1 h-3 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                  animate={{ scaleY: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              </div>
              Scroll to explore timeline
            </div>
          </motion.div>
        )}
      </div>
      <TimelineSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        timeline={timeline}
      />
    </TimelineVerticalWrapper>
  );
}