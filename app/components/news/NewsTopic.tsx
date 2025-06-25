'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useTimelineStore } from '@/app/stores/useTimelineStore';
import { useTimelineLoader } from '@/app/hooks/useTimelineLoader';

interface NewsTopicProps {
  topicId: string;
  className?: string;
}

const NewsTopic: React.FC<NewsTopicProps> = ({ 
  topicId, 
  className = '', 
}) => {
  const { colors, isDark, vintage } = useLayoutTheme();
  const router = useRouter();
  const { selectTimelineByTopicId } = useTimelineStore();
  const { timelines: availableTimelines } = useTimelineLoader();
  
  const [isHovered, setIsHovered] = useState(false);

  const timelineDataset = useMemo(() => {
    return availableTimelines.find(dataset => dataset.topic_id === topicId);
  }, [topicId, availableTimelines]);

  if (!timelineDataset) {
    return null;
  }

  const handleClick = () => {
    selectTimelineByTopicId(topicId, availableTimelines);
    router.push('/timeline');
  };

  const vintageColors = vintage || {
    paper: '#f8f6f0',
    ink: '#2c1810',
    faded: '#7a6f47',
    aged: '#e8dcc0',
    sepia: '#d4c4a8',
    highlight: '#fff8e7',
    shadow: 'rgba(139, 69, 19, 0.15)',
  };

  const topicColors = isDark ? {
    background: colors.primary + '20',
    text: 'white',
    border: colors.border,
    shadow: 'rgba(0, 0, 0, 0.3)',
    hover: colors.muted,
    icon: colors.primary,
  } : {
    background: vintageColors.highlight,
    text: vintageColors.ink,
    border: vintageColors.sepia,
    shadow: vintageColors.shadow,
    hover: vintageColors.aged,
    icon: vintageColors.faded,
  };

  return (
    <div className={`absolute bottom-28 right-4 z-40 ${className}`}>
      <motion.div
        className="relative cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Icon Container */}
        <motion.div
          className="flex items-center justify-center w-8 h-8 rounded-full shadow-lg transition-all duration-200"
          style={{
            backgroundColor: topicColors.background,
            borderColor: topicColors.border,
            border: `1px solid ${topicColors.border}`,
            boxShadow: `0 2px 8px ${topicColors.shadow}`,
          }}
          animate={{
            backgroundColor: isHovered ? topicColors.hover : topicColors.background,
          }}
        >
          <GraduationCap 
            size={20} 
            style={{ color: topicColors.icon }}
            className="transition-colors duration-200"
          />
        </motion.div>

        {/* Translation indicator */}
        {timelineDataset.fallbackUsed && (
          <div
            className="absolute -top-1 -left-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: '#f59e0b' }}
            title="Using English fallback"
          />
        )}

        {/* Expandable Text */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute top-1/2 right-10 -translate-y-1/2 whitespace-nowrap"
              initial={{ opacity: 0, x: 10, scaleX: 0 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scaleX: 1,
                transition: { 
                  duration: 0.2, 
                  ease: "easeOut",
                  scaleX: { duration: 0.15 }
                }
              }}
              exit={{ 
                opacity: 0, 
                x: 10, 
                scaleX: 0,
                transition: { 
                  duration: 0.15, 
                  ease: "easeIn",
                  scaleX: { duration: 0.1 }
                }
              }}
              style={{ 
                transformOrigin: 'left center',
              }}
            >
              <div
                className="px-3 py-2 rounded-lg shadow-lg text-xs font-medium"
                style={{
                  backgroundColor: topicColors.background,
                  color: topicColors.text,
                  border: `1px solid ${topicColors.border}`,
                  boxShadow: `0 4px 12px ${topicColors.shadow}`,
                }}
              >
                {timelineDataset.title}
                
                {/* Language indicator */}
                {timelineDataset.loadedLanguage && timelineDataset.loadedLanguage !== 'en' && (
                  <div className="text-xs opacity-60 mt-1">
                    📖 {timelineDataset.loadedLanguage.toUpperCase()}
                    {timelineDataset.fallbackUsed && ' (fallback)'}
                  </div>
                )}
                
                {/* Arrow */}
                <div
                  className="absolute top-1/2 -right-1 w-2 h-2 transform rotate-45 -translate-y-1/2"
                  style={{
                    backgroundColor: topicColors.background,
                    borderRight: `1px solid ${topicColors.border}`,
                    borderBottom: `1px solid ${topicColors.border}`,
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse animation */}
        {!isHovered && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: topicColors.icon,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default NewsTopic;