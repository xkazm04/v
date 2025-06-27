'use client'
import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { motion, useTransform } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { useTimelineScroll } from '@/app/hooks/useTimelineScroll';
import { useTimelineAudioStore } from '@/app/stores/useTimelineAudioStore';
import { useTimelineStore } from '@/app/stores/useTimelineStore';
import { useTimelineLoader } from '@/app/hooks/useTimelineLoader'; // ✅ ADD: Import timeline loader
import TimelineMilestone from '../../components/timeline/TimelineMilestone/TimelineMilestone';
import TimelineProgress from '../../components/timeline/TimelineProgress/TimelineProgress';
import TimelineBackground from '../../components/timeline/TimelineVertical/TimelineBackground';
import TimelineSelector from '../../components/timeline/TimelineSelector/TimelineSelector';
import TimelineSummaryModal from '../../components/timeline/TimelineSummary/TimelineSummaryModal';
import { FloatingVerdictIcon } from '@/app/components/ui/Decorative/FloatingVerdictIcon';
import TimelineHeader from '../../components/timeline/TimelineVertical/TimelineHeader';
import { useUserPreferences } from '@/app/hooks/use-user-preferences';
import { getVoiceIdForLanguage } from '@/app/helpers/countries';
import TimelineVerticalWrapper from './TimelineVerticalWrapper';
import FloatingSummaryButton from '@/app/components/timeline/TimelineSummary/FloatingSummaryButton';
import FloatingAudioButton from '@/app/components/timeline/FloatingAudioButton/FloatingAudioButton';
import { VerifyWordsPattern } from '@/app/components/backgrounds/VerifyWordsPattern';

const MemoizedTimelineBackground = React.memo(TimelineBackground);
const MemoizedTimelineHeader = React.memo(TimelineHeader);
const MemoizedTimelineProgress = React.memo(TimelineProgress);

// Fixed OptimizedTimelineMilestone with proper key handling
const OptimizedTimelineMilestone = React.memo(({
  milestone,
  index,
  activeEventId,
  activeMilestoneId,
  smoothScrollProgress
}: {
  milestone: any;
  index: number;
  activeEventId: string | null;
  activeMilestoneId: string | null;
  smoothScrollProgress: any;
}) => (
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
  hasScrolled,
  timelineId // Add timelineId for unique key
}: {
  smoothScrollProgress: any;
  sortedMilestones: any[];
  activeMilestoneId: string | null;
  activeEventId: string | null;
  handleNavigateToMilestone: (id: string) => void;
  handleNavigateToEvent: (eventId: string, milestoneId: string) => void;
  hasScrolled: boolean;
  timelineId: string;
}) => {
  if (typeof window === 'undefined') return null;

  const progressComponent = (
    <div key={`timeline-progress-portal-${timelineId}`}> {/* Unique key for portal content */}
      <MemoizedTimelineProgress
        scrollProgress={smoothScrollProgress}
        milestones={sortedMilestones}
        activeMilestoneId={activeMilestoneId}
        activeEventId={activeEventId}
        onNavigateToMilestone={handleNavigateToMilestone}
        onNavigateToEvent={handleNavigateToEvent}
        hasScrolled={hasScrolled}
      />
    </div>
  );

  return createPortal(progressComponent, document.body);
});

FixedTimelineProgress.displayName = 'FixedTimelineProgress';

export default function TimelineVertical() {
  const { colors, isDark, vintage } = useLayoutTheme();
  const { isMobile, isDesktop } = useViewport();
  const containerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  // Use timeline store and loader
  const {
    currentTimeline: timeline,
    isLoadingTimeline,
    selectedTopicId,
    selectTimelineByTopicId // ✅ ADD: Get the action
  } = useTimelineStore();

  const { timelines: availableTimelines, loading: timelinesLoading } = useTimelineLoader(); // ✅ ADD

  // ✅ ADD: Timeline fallback logic - load default timeline if none selected
  useEffect(() => {
    if (!timeline && !timelinesLoading && availableTimelines.length > 0 && !selectedTopicId) {
      console.log('🎯 No timeline selected, using default (first available)');
      const defaultTimeline = availableTimelines[0];
      selectTimelineByTopicId(defaultTimeline.topic_id || defaultTimeline.id, availableTimelines);
    }
  }, [timeline, timelinesLoading, availableTimelines, selectedTopicId, selectTimelineByTopicId]);

  // State for summary modal
  const [isSummaryOpen, setIsSummaryOpen] = React.useState(false);

  // Get user preferences for language-based voice selection
  const { preferences } = useUserPreferences();
  const userLanguage = preferences.language || 'en';
  const voiceId = useMemo(() => getVoiceIdForLanguage(userLanguage), [userLanguage]);

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
    hasScrolled
    //@ts-expect-error Ignore
  } = useTimelineScroll(containerRef, timeline);

  // Move all useTransform calls to top level
  const progressWidth = useTransform(smoothScrollProgress, [0, 1], ['0%', '100%']);
  const headerOpacity = useTransform(smoothScrollProgress, [0, 0.2], [1, 0]);

  // Stable handlers to prevent unnecessary re-renders
  const stableNavigateToMilestone = useCallback((id: string) => {
    handleNavigateToMilestone(id);
  }, [handleNavigateToMilestone]);

  const stableNavigateToEvent = useCallback((eventId: string, milestoneId: string) => {
    handleNavigateToEvent(eventId, milestoneId);
  }, [handleNavigateToEvent]);

  const stableSetSummaryOpen = useCallback((open: boolean) => {
    setIsSummaryOpen(open);
  }, []);

  useEffect(() => {
    if (timeline) {
      initializeTracklist(timeline);
    }
  }, [timeline, initializeTracklist]);

  useEffect(() => {
    console.log('📢 Timeline language preference changed:', {
      language: userLanguage,
      voiceId: voiceId
    });
  }, [userLanguage, voiceId]);

  useEffect(() => {
    if (selectedTopicId) {
      console.log('📢 Timeline selected via topic:', {
        topicId: selectedTopicId,
        timelineTitle: timeline?.title
      });
    }
  }, [selectedTopicId, timeline]);

  // Memoize sorted milestones
  const sortedMilestones = useMemo(() =>
    timeline ? [...timeline.milestones].sort((a, b) => a.order - b.order) : [],
    [timeline]
  );

  // Memoize style objects
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

  // ✅ IMPROVED: Show loading while timelines are being loaded OR timeline is loading
  if (timelinesLoading || isLoadingTimeline || !timeline) {
    return (
      <div key="timeline-loading-state" className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="inline-block w-8 h-8 border-2 border-current border-t-transparent rounded-full mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ borderColor: colors.primary }}
          />
          <p className="text-lg opacity-60">
            {timelinesLoading ? 'Loading timelines...' : 'Loading timeline...'}
          </p>
        </motion.div>
      </div>
    );
  }

  // Create unique timeline key
  const timelineKey = `timeline-${timeline.id}`;

  return (
    <React.Fragment key={timelineKey}> {/* Use explicit Fragment with unique key */}
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
          handleNavigateToMilestone={stableNavigateToMilestone}
          handleNavigateToEvent={stableNavigateToEvent}
          hasScrolled={hasScrolled}
          timelineId={timeline.id} // Pass timeline ID for unique key
        />

        {/* Floating Summary Button */}
        <FloatingSummaryButton
          key={`floating-summary-${timeline.id}`}
          onClick={() => stableSetSummaryOpen(true)}
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
            key={`timeline-selector-${timeline.id}`}
            className="pt-4"
          />
          <VerifyWordsPattern
            opacity={0.8}
            density="medium"
            className="z-0"
          />

          <MemoizedTimelineBackground
            key={`timeline-background-${timeline.id}`}
            scrollProgress={smoothScrollProgress.get()}
            isDark={isDark}
            colors={colors}
          />

          <div
            key={`timeline-progress-line-${timeline.id}`}
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
              key={`floating-verdict-${timeline.id}`}
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
            key={`timeline-header-section-${timeline.id}`}
            style={{ opacity: headerOpacity }}
            className="relative z-25"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            data-scroll-target="hero"
          >
            <FloatingAudioButton
              isVisible={true}
              milestones={sortedMilestones}
            />
            <MemoizedTimelineHeader timeline={timeline} />

            {/* Loading indicator */}
            {isLoadingTimeline && (
              <motion.div
                key={`loading-indicator-${timeline.id}`}
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
              </motion.div>
            )}
          </motion.div>

          <div
            key={`milestones-container-${timeline.id}`}
            className={`relative z-20 mx-auto px-4 pt-6 ${isDesktop ? 'max-w-5xl' : isMobile ? 'max-w-full' : 'max-w-3xl'
              }`}
            style={{ willChange: 'transform' }}
          >
            {sortedMilestones.map((milestone, index) => (
              <OptimizedTimelineMilestone
                key={`${timeline.id}-milestone-${milestone.id}`} // Unique key with timeline prefix
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
              key={`scroll-hint-${timeline.id}`}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30"
              style={scrollHintStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Your scroll hint content */}
            </motion.div>
          )}
        </div>

        <TimelineSummaryModal
          key={`timeline-summary-modal-${timeline.id}`}
          isOpen={isSummaryOpen}
          onClose={() => stableSetSummaryOpen(false)}
          timeline={timeline}
        />
      </TimelineVerticalWrapper>
    </React.Fragment>
  );
}