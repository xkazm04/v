'use client';
import React, { memo } from 'react';
import { motion, MotionValue, AnimatePresence } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import ExpertOpinionCard from '../../../components/timeline/ExpertOpinionCard/ExpertOpinionCard';
import TimelineEventFactCard from './TimelineEventFactCard';
import TimelineEventSecondaryLayout from './TimelineEventSecondaryLayout';
import { EventType } from '@/app/types/timeline';
import { ViewportType } from '@/app/hooks/useViewport';

interface TimelineEventDesktopProps {
  event: EventType;
  eventIndex: number;
  milestoneIndex: number;
  isActive: boolean;
  showAllOpinions: boolean;
  onOpinionToggle: (value: boolean) => void;
  eventOpacity: MotionValue<number>;
  viewport: ViewportType;
}

// Memoize the FactCard to prevent unnecessary re-renders
const MemoizedFactCard = memo(function MemoizedFactCard({
  isActive,
  showAllOpinions,
  onOpinionToggle,
  event,
  eventIndex
}: {
  isActive: boolean;
  showAllOpinions: boolean;
  onOpinionToggle: (value: boolean) => void;
  event: EventType;
  eventIndex: number;
}) {
  return (
    <motion.div
      className="relative z-20"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        maxWidth: '640px',
        width: '100%'
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <TimelineEventFactCard
        isActive={isActive}
        showAllOpinions={showAllOpinions}
        setShowAllOpinions={onOpinionToggle}
        event={event}
        eventIndex={eventIndex}
      />
    </motion.div>
  );
});

export default function TimelineEventDesktop({
  event,
  eventIndex,
  milestoneIndex,
  isActive,
  showAllOpinions,
  onOpinionToggle,
  eventOpacity,
  viewport
}: TimelineEventDesktopProps) {
  const { colors } = useLayoutTheme();

  return (
    <motion.div
      className="timeline-event-container"
      style={{ 
        opacity: milestoneIndex === 0 && eventIndex === 0 ? 1 : eventOpacity,
        height: '100vh',
        width: '100%', 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        margin: '0 auto', 
        maxWidth: '1400px' 
      }}
      data-event-id={event.id}
    >
      {showAllOpinions ? (
        <React.Fragment key={`${event.id}-all-opinions`}>
          <div className="absolute inset-0 z-10">
            <TimelineEventSecondaryLayout
              isActive={isActive}
              event={event}
              eventIndex={eventIndex}
            />
          </div>

          {/* FACT CARD  */}
          <MemoizedFactCard
            isActive={isActive}
            showAllOpinions={showAllOpinions}
            onOpinionToggle={onOpinionToggle}
            event={event}
            eventIndex={eventIndex}
          />
        </React.Fragment>
      ) : (
        <React.Fragment key={`${event.id}-key-opinions`}>
          {/* FACT CARD */}
          <MemoizedFactCard
            isActive={isActive}
            showAllOpinions={showAllOpinions}
            onOpinionToggle={onOpinionToggle}
            event={event}
            eventIndex={eventIndex}
          />

          {/* PRIMARY OPINION CARDS: Top-Right and Bottom-Left */}
          <AnimatePresence mode="sync">
            {/* TOP-RIGHT OPINION */}
            <motion.div
              key={`${event.id}-right-opinion`} // FIXED: Added unique key
              className="absolute top-16 right-16 z-10"
              initial={{ opacity: 0, y: -30, x: 30 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -30, x: 30 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ExpertOpinionCard
                opinion={event.right_opinion}
                expertType={event.right_type}
                sourceUrl={event.right_source_url}
                side="top-right"
                isStrongest={true}
                isActive={isActive}
                isExpanded={false}
                index={0}
                isSecondaryLayout={false}
              />
            </motion.div>

            {/* BOTTOM-LEFT OPINION */}
            <motion.div
              key={`${event.id}-left-opinion`} // FIXED: Added unique key
              className="absolute bottom-16 left-8 z-10"
              initial={{ opacity: 0, y: 30, x: -30 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 30, x: -30 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ExpertOpinionCard
                opinion={event.left_opinion}
                expertType={event.left_type}
                sourceUrl={event.left_source_url}
                side="bottom-left"
                isStrongest={true}
                isActive={isActive}
                isExpanded={false}
                index={1}
                isSecondaryLayout={false}
              />
            </motion.div>
          </AnimatePresence>
        </React.Fragment>
      )}
      
      {/* Toggle Button for switching between layouts */}
      <motion.button
        key={`${event.id}-toggle-button`} // FIXED: Added unique key
        className="absolute bottom-4 right-4 z-30 px-4 py-2 rounded-full border text-sm font-medium backdrop-blur-sm"
        style={{
          backgroundColor: colors.background + '90',
          borderColor: colors.border,
          color: colors.foreground
        }}
        onClick={() => onOpinionToggle(!showAllOpinions)}
        whileHover={{ 
          scale: 1.05,
          backgroundColor: colors.background,
          boxShadow: `0 4px 12px ${colors.primary}20`
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.3 }}
      >
        {showAllOpinions ? 'Show Key Opinions' : 'Show All Opinions'}
      </motion.button>
    </motion.div>
  );
}