'use client';
import { motion, useTransform, MotionValue, AnimatePresence } from 'framer-motion';
import { useState, forwardRef, useMemo, useCallback } from 'react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import ExpertOpinionCard from '../../../components/timeline/ExpertOpinionCard/ExpertOpinionCard';
import TimelineEventFactCard from './TimelineEventFactCard';
import { EventType } from '@/app/types/timeline';
import { 
  getTimelineEventGridConfig, 
  getOpinionCardPositions 
} from '@/app/config/timelineEventGrid';

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
  const { colors } = useLayoutTheme();
  const viewport = useViewport();
  const { isMobile, isTablet } = viewport;
  const [showAllOpinions, setShowAllOpinions] = useState(false);
  const isActive = activeEventId === event.id;

  const handleOpinionToggle = useCallback((value: boolean) => {
    setShowAllOpinions(value);
  }, []);

  const eventOpacity = useTransform(
    scrollProgress,
    [(milestoneIndex * 0.2) + (eventIndex * 0.05), (milestoneIndex * 0.2) + ((eventIndex + 1) * 0.05)],
    [0, 1]
  );

  const allSecondaryOpinions = useMemo(() => {
    const leftOpinions = event.all_opinions.filter(op => op.isLeft);
    const rightOpinions = event.all_opinions.filter(op => !op.isLeft);
    return [...leftOpinions, ...rightOpinions];
  }, [event.all_opinions]);

  const gridConfig = useMemo(() => {
    return getTimelineEventGridConfig(viewport, showAllOpinions);
  }, [viewport, showAllOpinions]);

  const opinionCards = useMemo(() => {
    return getOpinionCardPositions(
      allSecondaryOpinions,
      showAllOpinions,
      {
        left: {
          opinion: event.left_opinion,
          expertType: event.left_type,
          sourceUrl: event.left_source_url
        },
        right: {
          opinion: event.right_opinion,
          expertType: event.right_type,
          sourceUrl: event.right_source_url
        }
      }
    );
  }, [allSecondaryOpinions, showAllOpinions, event]);

  // Mobile/Tablet layout (column-based)
  if (isMobile || isTablet) {
    const allCards = [];
    
    allCards.push({
      id: 'fact-card',
      component: (
        <TimelineEventFactCard
          key="fact-card"
          isActive={isActive}
          showAllOpinions={showAllOpinions}
          setShowAllOpinions={handleOpinionToggle}
          event={event}
          eventIndex={eventIndex}
        />
      ),
      order: 0
    });

    if (!showAllOpinions) {
      if (opinionCards.topRight) {
        allCards.push({
          id: 'mobile-primary-1',
          component: (
            <ExpertOpinionCard
              key="mobile-primary-1"
              opinion={opinionCards.topRight.opinion}
              expertType={opinionCards.topRight.expertType}
              sourceUrl={opinionCards.topRight.sourceUrl}
              side={opinionCards.topRight.side}
              isStrongest={opinionCards.topRight.isStrongest}
              isActive={isActive}
              isExpanded={true}
              index={0}
              isSecondaryLayout={false}
            />
          ),
          order: 1
        });
      }
      
      if (opinionCards.bottomLeft) {
        allCards.push({
          id: 'mobile-primary-2',
          component: (
            <ExpertOpinionCard
              key="mobile-primary-2"
              opinion={opinionCards.bottomLeft.opinion}
              expertType={opinionCards.bottomLeft.expertType}
              sourceUrl={opinionCards.bottomLeft.sourceUrl}
              side={opinionCards.bottomLeft.side}
              isStrongest={opinionCards.bottomLeft.isStrongest}
              isActive={isActive}
              isExpanded={true}
              index={0}
              isSecondaryLayout={false}
            />
          ),
          order: 2
        });
      }
    } else {
      allSecondaryOpinions.slice(0, 6).forEach((opinion, index) => {
        allCards.push({
          id: `mobile-secondary-${index}`,
          component: (
            <ExpertOpinionCard
              key={`mobile-secondary-${index}`}
              opinion={opinion.opinion}
              expertType={opinion.expert_type}
              side={opinion.isLeft ? 'left' : 'right'}
              isStrongest={false}
              isActive={isActive}
              isExpanded={true}
              index={index}
              isSecondaryLayout={true}
            />
          ),
          order: index + 1
        });
      });
    }

    return (
      <motion.div
        ref={ref}
        className="relative py-8"
        style={{ opacity: eventOpacity }}
        data-event-id={event.id}
      >
        <div style={gridConfig.container}>
          <div className={gridConfig.mobileConfig.container}>
            <AnimatePresence mode="sync">
              {allCards
                .sort((a, b) => a.order - b.order)
                .map(({ id, component }) => (
                  <motion.div
                    key={`${id}-${showAllOpinions ? 'secondary' : 'primary'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {component}
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>

        {isActive && (
          <motion.div
            className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-12 rounded-full"
            style={{ backgroundColor: colors.primary }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="relative py-12"
      style={{ opacity: eventOpacity }}
      data-event-id={event.id}
    >
      <div style={gridConfig.container}>
        
        <div style={gridConfig.factCard.style}>
          <TimelineEventFactCard
            isActive={isActive}
            showAllOpinions={showAllOpinions}
            setShowAllOpinions={handleOpinionToggle}
            event={event}
            eventIndex={eventIndex}
          />
        </div>

        <AnimatePresence mode="sync">
          {gridConfig.positions.map((position) => {
            const opinionData = opinionCards[position.id];
            if (!opinionData) return null;

            return (
              <motion.div
                key={`${position.id}-${showAllOpinions ? 'secondary' : 'primary'}`}
                style={{
                  ...position.style,
                  width: '360px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                initial={position.animation.initial}
                animate={position.animation.animate}
                exit={position.animation.exit}
                transition={position.animation.transition}
              >
                <ExpertOpinionCard
                  opinion={opinionData.opinion}
                  expertType={opinionData.expertType}
                  sourceUrl={opinionData.sourceUrl}
                  side={opinionData.side}
                  isStrongest={opinionData.isStrongest}
                  isActive={isActive}
                  isExpanded={true}
                  index={opinionData.index || 0}
                  isSecondaryLayout={!opinionData.isPrimary}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {!showAllOpinions && (
          <>
            {gridConfig.positions.slice(2).map((position) => {
              const hasCard = opinionCards[position.id];
              if (hasCard) return null;

              return (
                <motion.div
                  key={`placeholder-${position.id}`}
                  style={{
                    ...position.style,
                    width: '360px',
                    height: '180px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  <motion.div
                    className="w-full h-full rounded-2xl border-2 border-dashed opacity-10"
                    style={{ 
                      borderColor: colors.primary + '30',
                      backgroundColor: colors.primary + '05'
                    }}
                    animate={{ 
                      borderColor: [colors.primary + '20', colors.primary + '40', colors.primary + '20'],
                      backgroundColor: [colors.primary + '03', colors.primary + '08', colors.primary + '03']
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: position.order * 0.5 }}
                  />
                </motion.div>
              );
            })}
          </>
        )}
      </div>

      {!showAllOpinions && isActive && opinionCards.topRight && opinionCards.bottomLeft && (
        <>
          <motion.div
            className="absolute"
            style={{
              top: '25%',
              right: '20%',
              width: '120px',
              height: '2px',
              backgroundColor: colors.primary + '50',
              transform: 'rotate(45deg)',
              transformOrigin: 'left center'
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          
          <motion.div
            className="absolute"
            style={{
              bottom: '25%',
              left: '20%',
              width: '120px',
              height: '2px',
              backgroundColor: colors.primary + '50',
              transform: 'rotate(45deg)',
              transformOrigin: 'right center'
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          />
        </>
      )}
    </motion.div>
  );
});

TimelineEvent.displayName = 'TimelineEvent';
export default TimelineEvent;