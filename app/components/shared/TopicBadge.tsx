'use client';

import { memo, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { ResearchResult } from '@/app/types/article';
import { Video } from '@/app/types/video_api';
import { TIMELINE_DATASETS, useTimelineStore } from '@/app/stores/useTimelineStore';

interface Props {
  data?: ResearchResult | Video;
  topicId?: string; // Manual override
  className?: string;
}

// Type guards
const isResearchResult = (data: any): data is ResearchResult => {
  return data && 'statement' in data && 'topic_id' in data;
};

const isVideo = (data: any): data is Video => {
  return data && 'video_url' in data && 'topic_id' in data;
};

const TopicBadge = memo(function TopicBadge({ 
  data,
  topicId: manualTopicId,
  className = '', 
}: Props) {
  const { colors, isDark, vintage } = useLayoutTheme();
  const router = useRouter();
  const { selectTimelineByTopicId } = useTimelineStore();
  
  const [isHovered, setIsHovered] = useState(false);

  // Extract topic_id from data or use manual override
  const topicId = useMemo(() => {
    if (manualTopicId) return manualTopicId;
    
    if (data) {
      if (isResearchResult(data)) {
        return data.topic_id;
      } else if (isVideo(data)) {
        return data.topic_id;
      }
    }
    
    return null;
  }, [data, manualTopicId]);

  // Find the corresponding timeline dataset
  const timelineDataset = useMemo(() => {
    if (!topicId) return null;
    return TIMELINE_DATASETS.find(dataset => dataset.topic_id === topicId);
  }, [topicId]);

  // Don't render if no topic ID or no matching timeline found
  if (!topicId || !timelineDataset) {
    return null;
  }

  const handleClick = () => {
    // Set the timeline in the store
    selectTimelineByTopicId(topicId);
    
    // Navigate to timeline page
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
    <div className={`absolute right-2 ${className}`}>
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
                className="px-3 py-1 rounded-md shadow-lg border text-sm font-medium"
                style={{
                  backgroundColor: topicColors.background,
                  borderColor: topicColors.border,
                  color: topicColors.text,
                  boxShadow: `0 4px 12px ${topicColors.shadow}`,
                }}
              >
                {timelineDataset.title}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle pulse animation when not hovered */}
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
});

export default TopicBadge;