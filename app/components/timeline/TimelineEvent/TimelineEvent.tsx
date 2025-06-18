'use client';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { useState, forwardRef } from 'react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import ExpertOpinionCard from '../../../components/timeline/ExpertOpinionCard/ExpertOpinionCard';
import TimelineEventSecondaryLayout from './TimelineEventSecondaryLayout';
import TimelineEventFactCard from './TimelineEventFactCard';
import { EventType } from '@/app/sections/edu/data/timeline';

interface TimelineEventProps {
  event: EventType;
  eventIndex: number;
  milestoneIndex: number;
  activeEventId: string | null;
  onEventHover: (eventId: string | null) => void;
  scrollProgress: MotionValue<number>;
}

const TimelineEvent = forwardRef<HTMLDivElement, TimelineEventProps>(({
  event,
  eventIndex,
  milestoneIndex,
  activeEventId,
  onEventHover,
  scrollProgress
}, ref) => {
  const { colors } = useLayoutTheme();
  const { isMobile, isTablet, isDesktop } = useViewport();
  const [showAllOpinions, setShowAllOpinions] = useState(false);
  const isActive = activeEventId === event.id;

  // Enhanced responsive animation transforms
  const eventY = useTransform(
    scrollProgress,
    [(milestoneIndex * 0.25) + (eventIndex * 0.08), (milestoneIndex * 0.25) + ((eventIndex + 1) * 0.08)],
    [isMobile ? 20 : 40, 0]
  );

  const eventOpacity = useTransform(
    scrollProgress,
    [(milestoneIndex * 0.25) + (eventIndex * 0.06), (milestoneIndex * 0.25) + ((eventIndex + 1) * 0.1)],
    [0, 1]
  );

  const eventScale = useTransform(
    scrollProgress,
    [(milestoneIndex * 0.25) + (eventIndex * 0.08), (milestoneIndex * 0.25) + ((eventIndex + 1) * 0.08)],
    [0.98, 1]
  );

  const getGridConfig = () => {
    if (showAllOpinions && isDesktop) {
      // Special layout for secondary opinions - full width container with proper spacing
      return {
        container: "relative w-full max-w-9xl mx-auto min-h-[700px]",
        centerCol: "mx-auto",
        showSecondaryLayout: true
      };
    } else if (isMobile) {
      return {
        container: "space-y-6",
        leftCol: "w-full",
        centerCol: "w-full order-first",
        rightCol: "w-full",
        showSecondaryLayout: false
      };
    } else if (isTablet) {
      return {
        container: showAllOpinions ? "grid grid-cols-2 gap-6 items-start" : "grid grid-cols-10 gap-6 items-start",
        leftCol: "col-span-4",
        centerCol: showAllOpinions ? "col-span-2 order-first mx-auto" : "col-span-2",
        rightCol: "col-span-4",
        showSecondaryLayout: false
      };
    } else {
      // Enhanced for wider screens
      return {
        container: "grid grid-cols-16 gap-8 items-start max-w-7xl mx-auto",
        leftCol: "col-span-6",
        centerCol: "col-span-4",
        rightCol: "col-span-6",
        showSecondaryLayout: false
      };
    }
  };

  const gridConfig = getGridConfig();


  return (
    <motion.div
      ref={ref}
      className="relative"
      style={{ 
        y: eventY, 
        opacity: eventOpacity,
        scale: eventScale
      }}
      onMouseEnter={() => onEventHover(event.id)}
      onMouseLeave={() => onEventHover(null)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: eventIndex * 0.12, duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, margin: "-80px" }}
      data-event-id={event.id}
    >
      {/* Primary Layout: Show primary opinions on left/right */}
      {!showAllOpinions && (
        <div className={gridConfig.container}>
          
          {/* Left Side - Left Primary Opinion */}
          <div className={`${gridConfig.leftCol} space-y-4`}>
            <motion.div
              initial={{ x: isMobile ? 0 : -40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: eventIndex * 0.08, duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <ExpertOpinionCard
                opinion={event.left_opinion}
                expertType={event.left_type}
                sourceUrl={event.left_source_url}
                side="left"
                isStrongest={true}
                isActive={isActive}
                isExpanded={false}
              />
            </motion.div>
          </div>

          {/* Center - Neutral Factual Event */}
          <div className={gridConfig.centerCol}>
            <TimelineEventFactCard
                isActive={isActive}
                showAllOpinions={showAllOpinions}
                setShowAllOpinions={setShowAllOpinions}
                event={event}
                eventIndex={eventIndex}
              />
          </div>

          {/* Right Side - Right Primary Opinion */}
          <div className={`${gridConfig.rightCol} space-y-4`}>
            <motion.div
              initial={{ x: isMobile ? 0 : 40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: eventIndex * 0.08, duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <ExpertOpinionCard
                opinion={event.right_opinion}
                expertType={event.right_type}
                sourceUrl={event.right_source_url}
                side="right"
                isStrongest={true}
                isActive={isActive}
                isExpanded={false}
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* Secondary Layout: Show secondary opinions around central fact */}
      {showAllOpinions && <TimelineEventSecondaryLayout
        gridConfig={gridConfig}
        event={event}
        showAllOpinions={showAllOpinions}   
        setShowAllOpinions={setShowAllOpinions}
        isActive={isActive}
        />}

      {/* Enhanced Connection Lines - Primary Layout Only */}
      {!showAllOpinions && isActive && isDesktop && (
        <>
          <motion.div
            className="absolute top-1/2 left-[35%] w-20 h-0.5 -translate-y-1/2"
            style={{ backgroundColor: colors.primary + '60' }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          
          <motion.div
            className="absolute top-1/2 right-[35%] w-20 h-0.5 -translate-y-1/2"
            style={{ backgroundColor: colors.primary + '60' }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          />
        </>
      )}

      {/* Enhanced Mobile Active State Indicator */}
      {isActive && isMobile && (
        <motion.div
          className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-16 rounded-full"
          style={{ backgroundColor: colors.primary }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          exit={{ scaleY: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      )}
    </motion.div>
  );
});

TimelineEvent.displayName = 'TimelineEvent';
export default TimelineEvent;