import { motion, useTransform, MotionValue } from 'framer-motion';
import { useViewport } from '@/app/hooks/useViewport';
import { Milestone } from '../../../types/timeline';
import TimelineMilestoneWrapper from './TimelineMilestoneWrapper';
import TimelineMilestoneContent from './TimelineMilestoneContent';
import TimelineEvent from '../TimelineEvent/TimelineEvent';

interface TimelineMilestoneProps {
  milestone: Milestone;
  index: number;
  activeEventId: string | null;
  activeMilestoneId: string | null;
  scrollProgress: MotionValue<number>;
}

export default function TimelineMilestone({
  milestone,
  index,
  activeEventId,
  activeMilestoneId,
  scrollProgress
}: TimelineMilestoneProps) {
  const { isMobile } = useViewport();
  
  const milestoneProgress = useTransform(
    scrollProgress,
    [index * 0.15, index * 0.15 + 0.1, index * 0.15 + 0.2],
    [0, 0.5, 1]
  );

  const baseOpacity = index === 0 ? 1 : 0;
  const headerOpacity = useTransform(milestoneProgress, [0, 0.3], [baseOpacity, 1]);
  const contentOpacity = useTransform(milestoneProgress, [0.2, 0.6], [baseOpacity, 1]);
  const eventsOpacity = useTransform(milestoneProgress, [0.6, 1], [0, 1]);

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <>
      {/* MILESTONE CONTENT - Separate scroll target */}
      <TimelineMilestoneWrapper
        milestone={milestone}
        index={index}
        activeMilestoneId={activeMilestoneId}
        scrollProgress={scrollProgress}
      >
        <TimelineMilestoneContent
          milestone={milestone}
          index={index}
          activeMilestoneId={activeMilestoneId}
          headerOpacity={headerOpacity}
          contentOpacity={contentOpacity}
        />
      </TimelineMilestoneWrapper>

      {/* EVENTS SECTION - Completely separate, each event is its own scroll target */}
      {milestone.events && milestone.events.length > 0 && (
        <div className="w-full">
          {milestone.events.map((event, eventIndex) => (
            <motion.div
              key={event.id}
              className="w-full"
              initial={{ 
                opacity: index === 0 && eventIndex === 0 ? 1 : 0, 
                y: 40, 
                scale: 0.98 
              }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: index === 0 && eventIndex === 0 ? 0 : eventIndex * 0.2,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
              }}
              style={{ 
                opacity: index === 0 ? 1 : eventsOpacity 
              }}
            >
              <TimelineEvent
                event={event}
                eventIndex={eventIndex}
                milestoneIndex={index}
                activeEventId={activeEventId}
                scrollProgress={scrollProgress}
              />
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}