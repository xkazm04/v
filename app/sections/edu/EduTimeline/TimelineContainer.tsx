'use client';
import { motion } from 'framer-motion';
import TimelineMilestone from '../../../components/timeline/TimelineMilestone/TimelineMilestone';
import { Milestone } from '../sampleData';

interface TimelineContainerProps {
  milestones: Milestone[];
  activeMilestoneId: string | null;
  activeEventId: string | null;
  expandedEventId: string | null;
  visibleMilestones: Set<string>;
  scrollProgress: number;
  onEventHover: (eventId: string | null) => void;
  onMilestoneHover: (milestoneId: string | null) => void;
  onEventExpand: (eventId: string | null) => void;
}

export default function TimelineContainer({
  milestones,
  activeMilestoneId,
  activeEventId,
  expandedEventId,
  visibleMilestones,
  scrollProgress,
  onEventHover,
  onMilestoneHover,
  onEventExpand
}: TimelineContainerProps) {
  
  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-8 pb-32">
      {/* Timeline Navigation Helper */}
      <motion.div
        className="sticky top-8 z-30 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex justify-center">
          <div className="flex gap-2 px-4 py-2 rounded-full backdrop-blur-sm bg-white/10 border border-white/20">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: visibleMilestones.has(milestone.id) 
                    ? '#3b82f6' 
                    : 'rgba(148, 163, 184, 0.5)'
                }}
                animate={{
                  scale: activeMilestoneId === milestone.id ? 1.5 : 1,
                  backgroundColor: activeMilestoneId === milestone.id 
                    ? '#3b82f6' 
                    : visibleMilestones.has(milestone.id)
                      ? '#60a5fa'
                      : 'rgba(148, 163, 184, 0.5)'
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Timeline Milestones */}
      <div className="space-y-32">
        {milestones.map((milestone, index) => (
          <TimelineMilestone
            key={`milestone-${milestone.id}`}
            milestone={milestone}
            index={index}
            activeMilestoneId={activeMilestoneId}
            activeEventId={activeEventId}
            expandedEventId={expandedEventId}
            onEventHover={onEventHover}
            onMilestoneHover={onMilestoneHover}
            onEventExpand={onEventExpand}
            isVisible={visibleMilestones.has(milestone.id)}
            scrollProgress={scrollProgress}
          />
        ))}
      </div>
    </div>
  );
}