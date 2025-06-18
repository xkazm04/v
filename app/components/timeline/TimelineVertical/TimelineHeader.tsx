'use client';
import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { Timeline } from '../../../types/timeline';
import { Calendar, Users, Globe, Target } from 'lucide-react';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';
import { FloatingVerdictIcon } from '@/app/components/ui/Decorative/FloatingVerdictIcon';
import TimelineHeaderSummary from './TimelineHeaderSummary';

interface TimelineHeaderProps {
  timeline: Timeline;
}

export default function TimelineHeader({ timeline }: TimelineHeaderProps) {
  const { colors, isDark } = useLayoutTheme();
  const { isMobile, isTablet, isDesktop } = useViewport();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 20
      }
    }
  };

  return (
    <motion.div
      className={`relative text-center ${isMobile ? 'py-8 px-4' : isTablet ? 'py-12 px-6' : 'py-16 px-8'
        }`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Compact Title */}
      <motion.div
        className="relative mb-8"
        variants={itemVariants}
      >
        <motion.h1
          className={`relative z-10 font-black tracking-tight leading-tight ${isMobile ? 'text-2xl' : 'text-3xl'
            }`}
        >
          {timeline.title}
        </motion.h1>

        {/* Minimal Subtitle */}
        <motion.p
          className={`font-light opacity-60 mt-2 ${isMobile ? 'text-sm' : 'text-base'
            }`}
          style={{ color: colors.foreground }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.5 }}
        >
          Timeline breakdown
        </motion.p>
      </motion.div>

      {/* Minimal Metadata - Single Row */}
      <motion.div
        className={`flex justify-center gap-6 mb-8 ${isMobile ? 'flex-wrap gap-3' : 'flex-nowrap'
          }`}
        variants={itemVariants}
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3 opacity-60" style={{ color: colors.primary }} />
          <span className="text-xs font-medium opacity-80">{timeline.timeSpan}</span>
        </div>

        <div className="w-px h-4 opacity-30" style={{ backgroundColor: colors.border }} />

        <div className="flex items-center gap-2">
          <Users className="w-3 h-3 opacity-60" style={{ color: colors.primary }} />
          <span className="text-xs font-medium opacity-80">
            {isMobile ? 'Conflict' : 'Bilateral Conflict'}
          </span>
        </div>

        <div className="w-px h-4 opacity-30" style={{ backgroundColor: colors.border }} />

        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 opacity-60" style={{ color: colors.primary }} />
          <span className="text-xs font-medium opacity-80">Global Impact</span>
        </div>
      </motion.div>

      {/* Executive Summary Section with Side Perspectives - Desktop Layout */}
      {isDesktop ? (
        <motion.div
          className="relative max-w-7xl mx-auto mb-12"
          variants={itemVariants}
        >
          <div className="grid grid-cols-12 gap-8 items-start">

            {/* Left Perspective */}
            <motion.div
              className="col-span-3"
              variants={itemVariants}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <GlassContainer
                style="frosted"
                border="visible"
                rounded="xl"
                className="p-6 h-full"
              >
                <h3
                  className="text-xl font-bold mb-2 tracking-tight"
                  style={{ color: colors.primary }}
                >
                  {timeline.leftSide}
                </h3>
                <motion.div
                  className="w-full h-0.5 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </GlassContainer>
            </motion.div>

            {/* Central Executive Summary */}
            <TimelineHeaderSummary
              timeline={timeline}
              colors={colors}
              itemVariants={itemVariants}
              />

            {/* Right Perspective */}
            <motion.div
              className="col-span-3"
              variants={itemVariants}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <GlassContainer
                style="frosted"
                border="visible"
                rounded="xl"
                className="p-6 h-full"
              >
                <h3
                  className="text-xl font-bold mb-2 tracking-tight text-right"
                  style={{ color: colors.primary }}
                >
                  {timeline.rightSide}
                </h3>
                <motion.div
                  className="w-full h-0.5 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                />
              </GlassContainer>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        /* Mobile/Tablet Compact Layout */
        <motion.div
          className={`mx-auto mb-12 ${isMobile ? 'max-w-full' : 'max-w-2xl'
            }`}
          variants={itemVariants}
        >
          <GlassContainer
            style="subtle"
            border="visible"
            shadow="sm"
            rounded="xl"
            className={isMobile ? 'p-4' : 'p-6'}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors.primary + '15' }}
                whileHover={{ scale: 1.05 }}
              >
                <Target className="w-4 h-4" style={{ color: colors.primary }} />
              </motion.div>
              <h2
                className={`font-bold ${isMobile ? 'text-sm' : 'text-base'}`}
                style={{ color: colors.primary }}
              >
                Executive Summary
              </h2>
              <motion.div
                className={`flex justify-center gap-6 mt-6 pt-4 border-t ${isMobile ? 'gap-4' : 'gap-6'
                  }`}
                style={{ borderColor: colors.border + '30' }}
              >
              </motion.div>
            </div>

            <p
              className={`leading-relaxed font-light ${isMobile ? 'text-sm' : 'text-base'
                }`}
              style={{ color: colors.foreground }}
            >
              {timeline.conclusion}
            </p>

          </GlassContainer>
        </motion.div>
      )}
    </motion.div>
  );
}