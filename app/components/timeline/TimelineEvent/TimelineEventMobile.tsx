'use client';
import { motion, MotionValue, AnimatePresence } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import ExpertOpinionCard from '../../../components/timeline/ExpertOpinionCard/ExpertOpinionCard';
import TimelineEventFactCard from './TimelineEventFactCard';
import { EventType } from '@/app/types/timeline';
import { 
  getTimelineEventGridConfig, 
  getOpinionCardPositions 
} from '@/app/config/timelineEventGrid';
import { ViewportType } from '@/app/hooks/useViewport';

interface TimelineEventMobileProps {
  event: EventType;
  eventIndex: number;
  milestoneIndex: number;
  isActive: boolean;
  showAllOpinions: boolean;
  onOpinionToggle: (value: boolean) => void;
  eventOpacity: MotionValue<number>;
  viewport: ViewportType;
}

export default function TimelineEventMobile({
  event,
  eventIndex,
  milestoneIndex,
  isActive,
  showAllOpinions,
  onOpinionToggle,
  eventOpacity,
  viewport
}: TimelineEventMobileProps) {
  const { colors } = useLayoutTheme();

  const allSecondaryOpinions = event.all_opinions.filter(op => op.opinion);
  
  const gridConfig = getTimelineEventGridConfig(viewport, showAllOpinions);
  
  const opinionCards = getOpinionCardPositions(
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

  const allCards = [];
  
  // Always add fact card first
  allCards.push({
    id: 'fact-card',
    component: (
      <TimelineEventFactCard
        key="fact-card"
        isActive={isActive}
        showAllOpinions={showAllOpinions}
        setShowAllOpinions={onOpinionToggle}
        event={event}
        eventIndex={eventIndex}
      />
    ),
    order: 0
  });

  if (!showAllOpinions) {
    // Primary opinions only
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
    // All opinions in expanded view
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
      className="relative py-8"
      style={{ 
        opacity: milestoneIndex === 0 && eventIndex === 0 ? 1 : eventOpacity
      }}
      data-event-id={event.id}
    >
      <div style={gridConfig.container}>
        <div className={gridConfig.mobileConfig.container}>
          <AnimatePresence mode="sync">
            {allCards
              .sort((a, b) => a.order - b.order)
              .map(({ id, component }) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {component}
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Active indicator */}
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