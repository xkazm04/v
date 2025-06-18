'use client';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { Milestone } from '../data/timeline';
import { Calendar, Hash, Clock, Circle } from 'lucide-react';

interface ScrollTarget {
  id: string;
  type: 'milestone' | 'event';
  element: Element;
  offsetTop: number;
  milestoneId?: string;
}

interface TimelineProgressIndicatorProps {
  scrollProgress: MotionValue<number>;
  milestones: Milestone[];
  activeMilestoneId: string | null;
  activeEventId: string | null;
  currentScrollIndex: number;
  scrollTargets: ScrollTarget[];
  onNavigateToMilestone?: (milestoneId: string) => void;
  onNavigateToEvent?: (eventId: string, milestoneId: string) => void;
}

export default function TimelineProgressIndicator({
  scrollProgress,
  milestones,
  activeMilestoneId,
  activeEventId,
  currentScrollIndex,
  scrollTargets,
  onNavigateToMilestone,
  onNavigateToEvent
}: TimelineProgressIndicatorProps) {
  const { colors, isDark } = useLayoutTheme();
  const { isMobile, isTablet, isDesktop } = useViewport();

  // Enhanced scroll-based transforms
  const indicatorOpacity = useTransform(scrollProgress, [0, 0.08, 0.92, 1], [0, 1, 1, 0.7]);
  const indicatorScale = useTransform(scrollProgress, [0, 0.08], [0.9, 1]);

  const handleMilestoneClick = (milestoneId: string) => {
    onNavigateToMilestone?.(milestoneId);
  };

  const handleEventClick = (eventId: string, milestoneId: string) => {
    onNavigateToEvent?.(eventId, milestoneId);
  };

  // Build timeline items with proper positioning
  const timelineItems = [];
  milestones.forEach((milestone, milestoneIndex) => {
    // Add milestone
    timelineItems.push({
      id: milestone.id,
      type: 'milestone' as const,
      title: milestone.title,
      date: milestone.date,
      isActive: activeMilestoneId === milestone.id,
      milestone
    });

    // Add events
    milestone.events.forEach((event, eventIndex) => {
      timelineItems.push({
        id: event.id,
        type: 'event' as const,
        title: event.title,
        date: milestone.date,
        isActive: activeEventId === event.id,
        parentMilestoneId: milestone.id,
        eventIndex
      });
    });
  });

  // Mobile/Tablet: Compact timeline without text
  if (isMobile || isTablet) {
    return (
      <motion.div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
        style={{ opacity: indicatorOpacity, scale: indicatorScale }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <div 
          className="relative backdrop-blur-md border rounded-full overflow-hidden px-4 py-3"
          style={{
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(248, 250, 252, 0.95)',
            borderColor: colors.border
          }}
        >
          {/* Compact horizontal timeline */}
          <div className="relative flex items-center gap-2 overflow-x-auto">
            {/* Timeline line */}
            <div 
              className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2"
              style={{ backgroundColor: colors.border }}
            />
            
            {/* Progress line */}
            <motion.div
              className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 origin-left"
              style={{
                backgroundColor: colors.primary,
                width: `${(currentScrollIndex / Math.max(1, timelineItems.length - 1)) * 100}%`
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />

            {timelineItems.map((item, index) => (
              <motion.button
                key={item.id}
                className={`relative flex-shrink-0 rounded-full border-2 flex items-center justify-center ${
                  item.type === 'milestone' ? 'w-6 h-6' : 'w-4 h-4'
                }`}
                style={{
                  backgroundColor: item.isActive ? colors.primary : 'transparent',
                  borderColor: item.isActive ? colors.primary : colors.border,
                  zIndex: 10
                }}
                animate={{
                  scale: item.isActive ? 1.3 : 1,
                  boxShadow: item.isActive 
                    ? `0 0 12px ${colors.primary}60` 
                    : 'none'
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (item.type === 'milestone') {
                    handleMilestoneClick(item.id);
                  } else {
                    handleEventClick(item.id, item.parentMilestoneId!);
                  }
                }}
              >
                {item.type === 'milestone' ? (
                  <Circle 
                    className="w-2 h-2" 
                    style={{ color: item.isActive ? 'white' : colors.primary }}
                    fill={item.isActive ? 'white' : colors.primary}
                  />
                ) : (
                  <Circle 
                    className="w-1.5 h-1.5" 
                    style={{ color: item.isActive ? 'white' : colors.border }}
                    fill={item.isActive ? 'white' : colors.border}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Compact progress indicator */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2">
            <div
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: colors.primary }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  // Desktop: Full-featured vertical timeline
  return (
    <motion.div
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50"
      style={{ opacity: indicatorOpacity, scale: indicatorScale }}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
    >
      <div 
        className="backdrop-blur-md border rounded-2xl overflow-hidden"
        style={{
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(248, 250, 252, 0.95)',
          borderColor: colors.border,
          width: '280px',
          maxHeight: '70vh'
        }}
      >
        {/* Timeline header */}
        <div className="px-4 py-3 border-b" style={{ borderColor: colors.border + '30' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors.primary }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              <span className="text-sm font-bold" style={{ color: colors.primary }}>
                Timeline Navigator
              </span>
            </div>
            <span className="text-xs opacity-60" style={{ color: colors.foreground }}>
              {currentScrollIndex + 1}/{timelineItems.length}
            </span>
          </div>
        </div>

        {/* Vertical timeline */}
        <div className="p-4 overflow-y-auto max-h-96">
          <div className="relative">
            {/* Main timeline line */}
            <div 
              className="absolute left-6 top-0 bottom-0 w-0.5"
              style={{ backgroundColor: colors.border }}
            />
            
            {/* Progress line */}
            <motion.div
              className="absolute left-6 top-0 w-0.5 origin-top"
              style={{
                backgroundColor: colors.primary,
                height: `${(currentScrollIndex / Math.max(1, timelineItems.length - 1)) * 100}%`
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />

            <div className="space-y-6">
              {timelineItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="relative flex items-start gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  {/* Timeline node */}
                  <motion.button
                    className={`relative flex-shrink-0 rounded-full border-2 flex items-center justify-center ${
                      item.type === 'milestone' ? 'w-6 h-6' : 'w-4 h-4 ml-1'
                    }`}
                    style={{
                      backgroundColor: item.isActive ? colors.primary : 'transparent',
                      borderColor: item.isActive ? colors.primary : 
                        item.type === 'milestone' ? colors.primary : colors.border,
                      zIndex: 10
                    }}
                    animate={{
                      scale: item.isActive ? 1.2 : 1,
                      boxShadow: item.isActive 
                        ? `0 0 16px ${colors.primary}60` 
                        : 'none'
                    }}
                    whileHover={{ scale: item.isActive ? 1.3 : 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (item.type === 'milestone') {
                        handleMilestoneClick(item.id);
                      } else {
                        handleEventClick(item.id, item.parentMilestoneId!);
                      }
                    }}
                  >
                    {item.type === 'milestone' ? (
                      <Calendar 
                        className="w-3 h-3" 
                        style={{ color: item.isActive ? 'white' : colors.primary }} 
                      />
                    ) : (
                      <Hash 
                        className="w-2 h-2" 
                        style={{ color: item.isActive ? 'white' : colors.border }} 
                      />
                    )}
                  </motion.button>

                  {/* Content */}
                  <motion.div
                    className="flex-1 cursor-pointer"
                    whileHover={{ x: 2 }}
                    onClick={() => {
                      if (item.type === 'milestone') {
                        handleMilestoneClick(item.id);
                      } else {
                        handleEventClick(item.id, item.parentMilestoneId!);
                      }
                    }}
                  >
                    <div className={`${item.type === 'milestone' ? 'mb-1' : 'mb-0.5'}`}>
                      <span 
                        className={`font-semibold ${
                          item.type === 'milestone' ? 'text-sm' : 'text-xs'
                        } ${item.isActive ? 'text-primary' : ''}`}
                        style={{ 
                          color: item.isActive ? colors.primary : colors.foreground 
                        }}
                      >
                        {item.title.length > 28 ? item.title.substring(0, 28) + '...' : item.title}
                      </span>
                    </div>
                    
                    {item.type === 'milestone' && (
                      <div className="flex items-center gap-1 opacity-60">
                        <span className="text-xs" style={{ color: colors.foreground }}>
                          {item.date}
                        </span>
                        {item.milestone?.events && item.milestone.events.length > 0 && (
                          <>
                            <span className="text-xs">•</span>
                            <span className="text-xs">
                              {item.milestone.events.length} event{item.milestone.events.length !== 1 ? 's' : ''}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </motion.div>

                  {/* Active indicator */}
                  {item.isActive && (
                    <motion.div
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full"
                      style={{ backgroundColor: colors.primary }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with navigation hint */}
        <div className="px-4 py-2 border-t text-center" style={{ borderColor: colors.border + '30' }}>
          <span className="text-xs opacity-60" style={{ color: colors.foreground }}>
            Click to navigate • Scroll to explore
          </span>
        </div>
      </div>
    </motion.div>
  );
}