'use client';
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
        width: '100%', // FIXED: Changed from 100vw to 100% to prevent right offset
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        margin: '0 auto', // FIXED: Center the container
        maxWidth: '1400px' // FIXED: Constrain max width for better centering
      }}
      data-event-id={event.id}
    >
      {/* CONDITIONAL LAYOUT: Primary vs Secondary */}
      {showAllOpinions ? (
        // SECONDARY LAYOUT: All 6 opinions
        <>
          <div className="absolute inset-0 z-10">
            <TimelineEventSecondaryLayout
              isActive={isActive}
              event={event}
              eventIndex={eventIndex}
            />
          </div>

          {/* FACT CARD - Always perfectly centered */}
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
        </>
      ) : (
        // PRIMARY LAYOUT: 2 key opinions (top-right, bottom-left)
        <>
          {/* FACT CARD - Perfectly centered */}
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

          {/* PRIMARY OPINION CARDS: Top-Right and Bottom-Left */}
          <AnimatePresence mode="sync">
            {/* TOP-RIGHT OPINION */}
            <motion.div
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
              className="absolute bottom-16 left-16 z-10"
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
        </>
      )}

      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2 w-1 h-16 rounded-full z-30"
          style={{ backgroundColor: colors.primary }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      )}

      {/* Connection lines when active (PRIMARY LAYOUT ONLY) */}
      {isActive && !showAllOpinions && (
        <motion.div
          className="absolute inset-0 z-5 pointer-events-none"
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <motion.line
              x1="75" y1="25"
              x2="25" y2="75"
              stroke={colors.primary}
              strokeWidth="0.2"
              strokeOpacity="0.3"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.line
              x1="25" y1="25"
              x2="75" y2="75"
              stroke={colors.primary}
              strokeWidth="0.2"
              strokeOpacity="0.3"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            />
          </svg>
        </motion.div>
      )}

      {/* Toggle Button for switching between layouts */}
      <motion.button
        className="absolute bottom-4 right-4 z-30 px-4 py-2 rounded-full border text-sm font-medium"
        style={{
          backgroundColor: colors.background + '90',
          borderColor: colors.border,
          color: colors.foreground
        }}
        onClick={() => onOpinionToggle(!showAllOpinions)}
        whileHover={{ scale: 1.05 }}
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