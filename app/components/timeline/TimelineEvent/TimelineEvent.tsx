'use client';
import { useTransform, MotionValue } from 'framer-motion';
import { useState, forwardRef, useCallback } from 'react';
import { useViewport } from '@/app/hooks/useViewport';
import { EventType } from '@/app/types/timeline';
import TimelineEventMobile from './TimelineEventMobile';
import TimelineEventDesktop from './TimelineEventDesktop';

interface TimelineEventProps {
  event: EventType;
  eventIndex: number;
  milestoneIndex: number;
  activeEventId: string | null;
  scrollProgress: MotionValue<number>;
}

const TimelineEvent = forwardRef<HTMLDivElement, TimelineEventProps>(({
  event,
  eventIndex,
  milestoneIndex,
  activeEventId,
  scrollProgress
}, ref) => {
  const viewport = useViewport();
  const { isMobile, isTablet } = viewport;
  const [showAllOpinions, setShowAllOpinions] = useState(false);
  const isActive = activeEventId === event.id;

  const handleOpinionToggle = useCallback((value: boolean) => {
    setShowAllOpinions(value);
  }, []);

  const eventOpacity = useTransform(
    scrollProgress,
    [
      Math.max(0, (milestoneIndex * 0.2) + (eventIndex * 0.05) - 0.05), 
      (milestoneIndex * 0.2) + ((eventIndex + 1) * 0.05)
    ],
    [0, 1]
  );

  const sharedProps = {
    event,
    eventIndex,
    milestoneIndex,
    isActive,
    showAllOpinions,
    onOpinionToggle: handleOpinionToggle,
    eventOpacity,
    viewport
  };

  if (isMobile || isTablet) {
    return (
      <div ref={ref}>
        <TimelineEventMobile {...sharedProps} />
      </div>
    );
  }

  return (
    <div ref={ref}>
      <TimelineEventDesktop {...sharedProps} />
    </div>
  );
});

TimelineEvent.displayName = 'TimelineEvent';

export default TimelineEvent;