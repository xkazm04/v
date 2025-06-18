'use client';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { Milestone } from '../../../sections/edu/data/timeline';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';
import TimelineMilestoneDateBadge from './TimelineMilestoneDateBadge';
import TimelineMilestonePersons from './TimelineMilestonePersons';
import TimelineMilestoneImpact from './TimelineMilestoneImpact';
import TimelineEvent from '../TimelineEvent/TimelineEvent';

interface TimelineMilestoneProps {
  milestone: Milestone;
  index: number;
  activeEventId: string | null;
  activeMilestoneId: string | null;
  onEventHover: (eventId: string | null) => void;
  onMilestoneHover: (milestoneId: string | null) => void;
  scrollProgress: MotionValue<number>;
}

export default function TimelineMilestone({
  milestone,
  index,
  activeEventId,
  activeMilestoneId,
  onEventHover,
  onMilestoneHover,
  scrollProgress
}: TimelineMilestoneProps) {
  const { colors, isDark } = useLayoutTheme();
  const { isMobile, isTablet, isDesktop } = useViewport();
  const isActive = activeMilestoneId === milestone.id;

  // Enhanced scroll-based reveals for individual components
  const headerProgress = useTransform(
    scrollProgress,
    [index * 0.25, index * 0.25 + 0.05],
    [0, 1]
  );

  const contentProgress = useTransform(
    scrollProgress,
    [index * 0.25 + 0.05, index * 0.25 + 0.1],
    [0, 1]
  );

  const personsProgress = useTransform(
    scrollProgress,
    [index * 0.25 + 0.1, index * 0.25 + 0.15],
    [0, 1]
  );

  const impactProgress = useTransform(
    scrollProgress,
    [index * 0.25 + 0.15, index * 0.25 + 0.2],
    [0, 1]
  );

  const eventsProgress = useTransform(
    scrollProgress,
    [index * 0.25 + 0.2, index * 0.25 + 0.25],
    [0, 1]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.section
      className={`relative ${isMobile ? 'mb-16' : 'mb-24'}`}
      onMouseEnter={() => onMilestoneHover(milestone.id)}
      onMouseLeave={() => onMilestoneHover(null)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-150px" }}
    >
      {/* Enhanced Date Badge & Milestone Header */}
      <motion.div 
        className={`relative flex items-center justify-center ${
          isMobile ? 'mb-8' : 'mb-12'
        }`}
        style={{
          opacity: headerProgress,
          y: useTransform(headerProgress, [0, 1], [50, 0])
        }}
      >
        {/* Central Node - Enhanced */}
        <motion.div
          className={`relative z-30 rounded-full border-2 backdrop-blur-sm flex items-center justify-center ${
            isMobile ? 'w-16 h-16' : isTablet ? 'w-20 h-20' : 'w-24 h-24'
          }`}
          style={{
            backgroundColor: isActive ? colors.primary : colors.background,
            borderColor: isActive ? colors.primary : colors.border,
            boxShadow: isActive 
              ? `0 0 40px ${colors.primary}50` 
              : `0 8px 30px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)'}`
          }}
          animate={{
            scale: isActive ? 1.05 : 1,
            boxShadow: isActive 
              ? `0 0 50px ${colors.primary}60` 
              : `0 8px 30px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)'}`
          }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: isActive ? 1.1 : 1.05 }}
        >
          <span 
            className={`font-black ${
              isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-3xl'
            }`}
            style={{ color: isActive ? 'white' : colors.primary }}
          >
            {index + 1}
          </span>
        </motion.div>

        {/* Enhanced Pulse Effects */}
        {isActive && (
          <>
            {[1, 2].map((ring) => (
              <motion.div
                key={ring}
                className={`absolute rounded-full border ${
                  isMobile ? 'w-16 h-16' : isTablet ? 'w-20 h-20' : 'w-24 h-24'
                }`}
                style={{ borderColor: colors.primary + '30' }}
                animate={{
                  scale: [1, 2 + ring * 0.5],
                  opacity: [0.6, 0]
                }}
                transition={{
                  duration: 2.5 + ring * 0.5,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: ring * 0.4
                }}
              />
            ))}
          </>
        )}

        {/* Enhanced Date Badge Component */}
        <TimelineMilestoneDateBadge 
          date={milestone.date}
          isActive={isActive}
          isMobile={isMobile}
          isTablet={isTablet}
          colors={colors}
          isDark={isDark}
        />
      </motion.div>

      {/* Main Content Card */}
      <motion.div
        className={`relative mx-auto ${
          isMobile ? 'mb-8' : 'mb-12'
        } ${
          isDesktop ? 'max-w-4xl' : isMobile ? 'max-w-full' : 'max-w-2xl'
        }`}
        style={{
          opacity: contentProgress,
          y: useTransform(contentProgress, [0, 1], [40, 0])
        }}
      >
        <GlassContainer
          style="frosted"
          border={isActive ? "glow" : "visible"}
          shadow="xl"
          rounded="2xl"
          className={isMobile ? 'p-5' : 'p-8'}
          overlay={isActive}
          overlayOpacity={0.08}
        >
          {/* Title with Enhanced Typography */}
          <motion.h2 
            className={`font-black tracking-tight leading-tight mb-6 ${
              isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-3xl'
            }`}
            style={{ 
              color: isActive ? colors.primary : colors.foreground,
              letterSpacing: '-0.03em'
            }}
            animate={{
              color: isActive ? colors.primary : colors.foreground
            }}
            transition={{ duration: 0.4 }}
          >
            {milestone.title}
          </motion.h2>

          {/* Context with Better Typography */}
          {milestone.context && (
            <motion.p 
              className={`leading-relaxed font-light opacity-90 mb-8 ${
                isMobile ? 'text-sm' : 'text-base'
              }`}
              style={{ color: colors.foreground }}
            >
              {milestone.context}
            </motion.p>
          )}

          {/* Event Count Indicator */}
          {milestone.events && milestone.events.length > 0 && (
            <motion.div
              className="flex items-center justify-center gap-3 mb-6 pb-6 border-b"
              style={{ borderColor: colors.border + '20' }}
            >
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.primary }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              <span 
                className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}
                style={{ color: colors.primary }}
              >
                {milestone.events.length} Critical {milestone.events.length === 1 ? 'Event' : 'Events'}
              </span>
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.primary }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1
                }}
              />
            </motion.div>
          )}
        </GlassContainer>
      </motion.div>

      {/* Key Persons Section */}
      {milestone.key_persons && milestone.key_persons.length > 0 && (
        <motion.div
          style={{
            opacity: personsProgress,
            y: useTransform(personsProgress, [0, 1], [30, 0])
          }}
          className={`mb-${isMobile ? '6' : '8'}`}
        >
          <TimelineMilestonePersons 
            persons={milestone.key_persons}
            isActive={isActive}
            isMobile={isMobile}
            colors={colors}
          />
        </motion.div>
      )}

      {/* Impact & Consequence Section */}
      {milestone.consequence && (
        <motion.div
          style={{
            opacity: impactProgress,
            y: useTransform(impactProgress, [0, 1], [30, 0])
          }}
          className={`mb-${isMobile ? '8' : '12'}`}
        >
          <TimelineMilestoneImpact 
            consequence={milestone.consequence}
            isActive={isActive}
            isMobile={isMobile}
            colors={colors}
          />
        </motion.div>
      )}

      {/* Events Section */}
      <motion.div 
        className={`space-y-${isMobile ? '8' : '12'} flex flex-col lg:gap-20 xl:gap-28`}
        style={{
          opacity: eventsProgress,
          y: useTransform(eventsProgress, [0, 1], [40, 0])
        }}
      >
        {milestone.events.map((event, eventIndex) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              delay: eventIndex * 0.1,
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
          >
            <TimelineEvent
              event={event}
              eventIndex={eventIndex}
              milestoneIndex={index}
              activeEventId={activeEventId}
              onEventHover={onEventHover}
              scrollProgress={scrollProgress}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}